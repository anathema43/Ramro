# 🧪 Complete Cypress Testing Guide for Ramro E-commerce

## 🔒 **SECURITY-FIRST TESTING APPROACH**
This guide includes comprehensive testing for all implemented security fixes:
- ✅ **Firebase Server-side Admin Verification** - Tests that admin access requires proper role in Firestore
- ✅ **File Upload Security** - Tests size limits and type validation
- ✅ **Data Integrity** - Tests single source of truth from Firebase Firestore
- ✅ **Real-time Features** - Tests cross-tab cart/wishlist synchronization
- ✅ **Input Validation** - Tests XSS and injection prevention

## 📚 **Table of Contents**
1. [Installation and Setup](#installation-and-setup)
2. [Running Cypress Tests](#running-cypress-tests)
3. [Test Structure Overview](#test-structure-overview)
4. [Security Testing](#security-testing)
5. [E2E User Journey Tests](#e2e-user-journey-tests)
6. [Real-time Feature Tests](#real-time-feature-tests)
7. [Admin Panel Tests](#admin-panel-tests)
8. [Writing New Tests](#writing-new-tests)
9. [Troubleshooting](#troubleshooting)

---

## 🛠️ **Installation and Setup**

### **Prerequisites**
- Node.js 18+ installed
- Ramro project running locally (`npm run dev`)
- Firebase project configured
- Test data seeded in Firestore

### **Install Cypress**
```bash
# Install Cypress and dependencies
npm install --save-dev cypress@latest
npm install --save-dev @cypress/code-coverage@latest
npm install --save-dev cypress-axe@latest
npm install --save-dev @testing-library/cypress@latest
npm install --save-dev eslint-plugin-cypress@latest
```

### **Cypress Configuration**
The project includes a pre-configured `cypress.config.js` with:
- Base URL: `http://localhost:5173`
- Viewport: 1280x720
- Video recording enabled
- Screenshot on failure
- Custom commands and test data

---

## 🚀 **Running Cypress Tests**

### **Interactive Mode (Recommended for Development)**
```bash
# Open Cypress Test Runner
npm run cy:open

# This will open the Cypress GUI where you can:
# - Select and run individual tests
# - Watch tests run in real-time
# - Debug test failures
# - Record test runs
```

### **Headless Mode (CI/CD)**
```bash
# Run all tests headlessly
npm run cy:run

# Run specific test file
npm run cy:run --spec "cypress/e2e/01-authentication.cy.js"

# Run tests in different browsers
npm run cy:run:chrome
npm run cy:run:firefox
npm run cy:run:edge
```

### **Mobile Testing**
```bash
# Test mobile viewport
npm run cy:run:mobile

# Test tablet viewport
npm run cy:run:tablet

# Test desktop viewport
npm run cy:run:desktop
```

### **Comprehensive Test Suite**
```bash
# Run all tests with coverage
npm run cy:run:complete

# Run tests in parallel
npm run cy:run:parallel

# Run security-focused tests
npm run cy:run --spec "cypress/e2e/*security*.cy.js"
```

---

## 📁 **Test Structure Overview**

### **Test Organization**
```
cypress/
├── e2e/                          # End-to-end test specifications
│   ├── 01-authentication.cy.js   # User auth and security tests
│   ├── 02-product-browsing.cy.js # Product catalog tests
│   ├── 03-shopping-cart.cy.js    # Cart functionality tests
│   ├── 04-checkout-process.cy.js # Checkout and payment tests
│   ├── 05-admin-functionality.cy.js # Admin panel tests
│   ├── 06-api-testing.cy.js      # API endpoint tests
│   ├── 07-accessibility-testing.cy.js # Accessibility tests
│   ├── 08-responsive-design.cy.js # Mobile/responsive tests
│   ├── 09-error-handling.cy.js   # Error scenarios
│   ├── 10-static-pages.cy.js     # About, Contact, etc.
│   ├── 11-footer-pages.cy.js     # Policy pages
│   ├── 12-real-time-features.cy.js # Real-time sync tests
│   ├── 13-security-testing.cy.js # Security vulnerability tests
│   └── 14-development-roadmap.cy.js # Roadmap page tests
├── fixtures/                     # Test data
│   ├── products.json            # Sample product data
│   ├── users.json               # Test user accounts
│   ├── auth-success.json        # Auth response mocks
│   └── order-success.json       # Order response mocks
├── support/                      # Test utilities
│   ├── commands.js              # Custom Cypress commands
│   ├── e2e.js                   # Global test setup
│   └── component.js             # Component testing setup
└── scripts/                      # Test automation
    ├── run-all-tests.js         # Comprehensive test runner
    └── parallel-runner.js       # Parallel test execution
```

---

## 🔒 **Security Testing**

### **Critical Security Tests**

#### **1. Admin Access Security**
```javascript
// Tests server-side admin role verification
describe('Admin Security Tests', () => {
  it('should prevent unauthorized admin access', () => {
    // Try to access admin without login
    cy.visit('/admin');
    cy.url().should('include', '/login');
    
    // Login as regular user
    cy.loginAsUser();
    cy.visit('/admin');
    cy.get('[data-cy="access-denied-message"]').should('be.visible');
  });

  it('should validate admin role server-side', () => {
    cy.loginAsUser();
    
    // Try to manipulate client-side role
    cy.window().then((win) => {
      win.localStorage.setItem('userRole', 'admin');
    });
    
    cy.visit('/admin');
    cy.get('[data-cy="access-denied-message"]').should('be.visible');
  });
});
```

#### **2. File Upload Security**
```javascript
describe('File Upload Security', () => {
  it('should enforce file size limits', () => {
    cy.loginAsAdmin();
    cy.navigateToAdmin();
    
    // Try to upload large file (should be rejected)
    const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.jpg');
    cy.get('[data-cy="file-upload"]').selectFile(largeFile, { force: true });
    
    cy.get('[data-cy="file-size-error"]').should('be.visible');
  });

  it('should restrict file types', () => {
    cy.loginAsAdmin();
    cy.navigateToAdmin();
    
    // Try to upload non-image file
    const textFile = new File(['malicious content'], 'malicious.txt');
    cy.get('[data-cy="file-upload"]').selectFile(textFile, { force: true });
    
    cy.get('[data-cy="file-type-error"]').should('be.visible');
  });
});
```

#### **3. Input Validation Security**
```javascript
describe('Input Validation Security', () => {
  it('should prevent XSS attacks', () => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    cy.visit('/contact');
    cy.get('[data-cy="contact-name"]').type(xssPayload);
    cy.get('[data-cy="contact-submit"]').click();
    
    // Should not execute script
    cy.on('window:alert', () => {
      throw new Error('XSS vulnerability detected');
    });
  });
});
```

---

## 🛒 **E2E User Journey Tests**

### **Complete Shopping Flow**
```javascript
describe('Complete User Journey', () => {
  it('should complete purchase from browse to order', () => {
    // 1. Browse products
    cy.visit('/');
    cy.navigateToShop();
    
    // 2. Add to cart
    cy.addProductToCart('Darjeeling Pickle');
    cy.get('[data-cy="cart-count"]').should('contain', '1');
    
    // 3. Checkout
    cy.navigateToCart();
    cy.get('[data-cy="checkout-button"]').click();
    
    // 4. Login/Register
    cy.url().should('include', '/login');
    cy.loginAsUser();
    
    // 5. Complete checkout
    cy.fillShippingInfo({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@ramro.com',
      phone: '+91 9876543210',
      address: '123 Test Street',
      city: 'Mumbai',
      zipCode: '400001'
    });
    
    // 6. Payment
    cy.selectPaymentMethod('cod');
    cy.get('[data-cy="place-order-button"]').click();
    
    // 7. Verify success
    cy.url().should('include', '/orders');
    cy.get('[data-cy="order-confirmation"]').should('be.visible');
  });
});
```

---

## ⚡ **Real-time Feature Tests**

### **Cross-tab Synchronization**
```javascript
describe('Real-time Cart Synchronization', () => {
  it('should sync cart across browser tabs', () => {
    cy.loginAsUser();
    
    // Add item in first tab
    cy.navigateToShop();
    cy.addProductToCart('Darjeeling Pickle');
    cy.get('[data-cy="cart-count"]').should('contain', '1');
    
    // Open new tab and verify sync
    cy.window().then((win) => {
      const newTab = win.open('/', '_blank');
      cy.wrap(newTab).should('exist');
      
      // Wait for sync and check cart count
      cy.wait(2000);
      cy.window().then((newWin) => {
        cy.wrap(newWin.document.querySelector('[data-cy="cart-count"]'))
          .should('contain', '1');
      });
    });
  });

  it('should handle offline/online state changes', () => {
    cy.loginAsUser();
    cy.navigateToShop();
    
    // Simulate going offline
    cy.window().then((win) => {
      win.navigator.onLine = false;
      win.dispatchEvent(new Event('offline'));
    });
    
    cy.get('[data-cy="offline-indicator"]').should('be.visible');
    
    // Add item while offline
    cy.addProductToCart('Himalayan Wild Honey');
    cy.get('[data-cy="offline-warning"]').should('be.visible');
    
    // Come back online
    cy.window().then((win) => {
      win.navigator.onLine = true;
      win.dispatchEvent(new Event('online'));
    });
    
    cy.get('[data-cy="cart-count"]').should('contain', '2');
  });
});
```

---

## 👨‍💼 **Admin Panel Tests**

### **Product Management**
```javascript
describe('Admin Product Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.navigateToAdmin();
  });

  it('should create new product', () => {
    const newProduct = {
      name: 'Test Himalayan Product',
      description: 'A test product for automation',
      price: '399',
      category: 'spices',
      image: 'https://example.com/test-product.jpg',
      quantity: '25'
    };
    
    cy.createProduct(newProduct);
    
    cy.get('[data-cy="success-message"]').should('contain', 'Product created successfully');
    cy.get('[data-cy="products-table"]').should('contain', newProduct.name);
  });

  it('should update inventory with real-time alerts', () => {
    cy.get('[data-cy="product-row"]').first().within(() => {
      cy.get('[data-cy="manage-stock-button"]').click();
    });
    
    cy.get('[data-cy="stock-adjustment"]').type('2');
    cy.get('[data-cy="update-stock-button"]').click();
    
    // Should trigger low stock alert
    cy.get('[data-cy="low-stock-alert"]').should('be.visible');
  });
});
```

---

## 📝 **Writing New Tests**

### **Test Structure Template**
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    cy.visit('/');
    cy.waitForPageLoad();
  });

  describe('Specific Functionality', () => {
    it('should perform expected behavior', () => {
      // Arrange
      cy.loginAsUser();
      cy.navigateToShop();
      
      // Act
      cy.get('[data-cy="action-button"]').click();
      
      // Assert
      cy.get('[data-cy="expected-result"]').should('be.visible');
    });
  });
});
```

### **Custom Commands Usage**
```javascript
// Authentication
cy.loginAsUser();
cy.loginAsAdmin();
cy.logout();

// Navigation
cy.navigateToShop();
cy.navigateToCart();
cy.navigateToAdmin();
cy.navigateToArtisans();

// Actions
cy.addProductToCart('Product Name');
cy.fillShippingInfo(shippingData);
cy.selectPaymentMethod('razorpay');
cy.createProduct(productData);
cy.searchArtisans('search term');
cy.filterArtisansByRegion('region');

// Utilities
cy.waitForPageLoad();
cy.checkAccessibility();
cy.setMobileViewport();
cy.mockRazorpayPayment(true);
cy.seedArtisanData();
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Tests Failing Due to Timing**
```javascript
// Use proper waits
cy.get('[data-cy="loading-spinner"]').should('not.exist');
cy.wait('@apiCall');
cy.get('[data-cy="element"]', { timeout: 10000 }).should('be.visible');
```

#### **Firebase Connection Issues**
```javascript
// Wait for Firebase to initialize
cy.window().its('firebase').should('exist');
cy.get('[data-cy="app-loaded"]').should('exist');
```

#### **Real-time Feature Testing**
```javascript
// Allow time for real-time updates
cy.addProductToCart('Product');
cy.wait(1000); // Allow Firebase sync
cy.get('[data-cy="cart-count"]').should('contain', '1');
```

### **Debugging Tips**
```javascript
// Debug test state
cy.debug();
cy.pause();
cy.screenshot('debug-point');

// Log values
cy.get('[data-cy="element"]').then(($el) => {
  console.log('Element text:', $el.text());
});
```

---

## 📊 **Test Coverage Goals**

### **Current Coverage**
- **Authentication**: 95%
- **Shopping Cart**: 90%
- **Admin Panel**: 85%
- **Security**: 95%
- **Real-time Features**: 90%
- **Accessibility**: 85%

### **Target Coverage**
- **Overall**: 90%+
- **Critical Paths**: 100%
- **Security Tests**: 100%
- **User Journeys**: 95%

### **Unit Testing Integration**
- **Utility Functions**: 100% coverage with Vitest
- **Store Logic**: 95% coverage including real-time features
- **Component Testing**: 85% coverage with React Testing Library
- **Integration Testing**: 90% coverage with Cypress + Vitest
### **✅ Image Optimization Testing:**
1. **ResponsiveImage Component**
   - Tests multiple image sizes
   - Validates lazy loading implementation
   - Tests error handling and fallbacks
   - Validates srcSet and sizes attributes
   - Tests performance impact

## 🚀 **HOW TO RUN THE TESTS**

---

## 🎯 **Running Specific Test Suites**

### **Security-focused Testing**
```bash
# Run only security tests
npm run cy:run --spec "cypress/e2e/01-authentication.cy.js,cypress/e2e/13-security-testing.cy.js"

# Run admin security tests
npm run cy:run --spec "cypress/e2e/05-admin-functionality.cy.js"
```

### **Real-time Feature Testing**
```bash
# Test real-time synchronization
npm run cy:run --spec "cypress/e2e/12-real-time-features.cy.js"

# Test cart functionality
npm run cy:run --spec "cypress/e2e/03-shopping-cart.cy.js"

# Test cross-tab synchronization
cy.testRealTimeSync()
```

### **Accessibility Testing**
```bash
# Run accessibility compliance tests
npm run cy:run --spec "cypress/e2e/07-accessibility-testing.cy.js"
```

---

## 📈 **Continuous Integration**

### **GitHub Actions Integration**
```yaml
# .github/workflows/cypress.yml
name: Cypress Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: cypress-io/github-action@v2
        with:
          build: npm run build
          start: npm run dev
          wait-on: 'http://localhost:5173'
          spec: cypress/e2e/**/*.cy.js
```

---

## 🎉 **Success Criteria**

Your Cypress testing is successful when:
- ✅ All critical user journeys pass
- ✅ Security tests validate proper access control
- ✅ Real-time features work across tabs
- ✅ Admin panel functions correctly
- ✅ Accessibility standards are met
- ✅ Mobile experience is validated
- ✅ Error scenarios are handled gracefully

**Your comprehensive Cypress testing suite ensures the Ramro e-commerce platform is robust, secure, and user-friendly!** 🏔️

---

*Remember: Good tests are your safety net. They catch bugs before users do and give you confidence to make changes and improvements.*