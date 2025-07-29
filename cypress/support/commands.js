// ***********************************************
// Custom Commands for Ramro E-commerce Testing
// ***********************************************

// Authentication Commands
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('not.include', '/login');
    cy.window().its('localStorage').should('contain.key', 'auth-storage');
  });
});

Cypress.Commands.add('loginAsAdmin', () => {
  const admin = Cypress.env('adminUser');
  cy.login(admin.email, admin.password);
});

Cypress.Commands.add('loginAsUser', () => {
  const user = Cypress.env('testUser');
  cy.login(user.email, user.password);
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="logout-button"]').click();
  cy.url().should('include', '/');
  cy.window().its('localStorage').should('not.contain.key', 'auth-storage');
});

// Navigation Commands
Cypress.Commands.add('navigateToShop', () => {
  cy.get('[data-cy="nav-shop"]').click();
  cy.url().should('include', '/shop');
  cy.get('[data-cy="shop-page"]').should('be.visible');
});

Cypress.Commands.add('navigateToCart', () => {
  cy.get('[data-cy="nav-cart"]').click();
  cy.url().should('include', '/cart');
  cy.get('[data-cy="cart-page"]').should('be.visible');
});

Cypress.Commands.add('navigateToAdmin', () => {
  cy.get('[data-cy="nav-admin"]').click();
  cy.url().should('include', '/admin');
  cy.get('[data-cy="admin-dashboard"]').should('be.visible');
});

// Product Commands
Cypress.Commands.add('addProductToCart', (productName) => {
  cy.get('[data-cy="shop-page"]').within(() => {
    cy.contains('[data-cy="product-card"]', productName).within(() => {
      cy.get('[data-cy="add-to-cart-button"]').click();
    });
  });
  cy.get('[data-cy="cart-count"]').should('contain', '1');
});

Cypress.Commands.add('addToWishlist', (productName) => {
  cy.contains('[data-cy="product-card"]', productName).within(() => {
    cy.get('[data-cy="wishlist-button"]').click();
  });
  cy.get('[data-cy="wishlist-count"]').should('be.visible');
});

Cypress.Commands.add('searchProduct', (searchTerm) => {
  cy.get('[data-cy="search-input"]').type(searchTerm);
  cy.get('[data-cy="search-button"]').click();
  cy.get('[data-cy="search-results"]').should('be.visible');
});

// Cart Commands
Cypress.Commands.add('clearCart', () => {
  cy.navigateToCart();
  cy.get('[data-cy="clear-cart-button"]').click();
  cy.get('[data-cy="empty-cart-message"]').should('be.visible');
});

Cypress.Commands.add('updateCartQuantity', (productName, quantity) => {
  cy.navigateToCart();
  cy.contains('[data-cy="cart-item"]', productName).within(() => {
    cy.get('[data-cy="quantity-input"]').clear().type(quantity);
    cy.get('[data-cy="update-quantity-button"]').click();
  });
});

// Checkout Commands
Cypress.Commands.add('fillShippingInfo', (shippingData) => {
  cy.get('[data-cy="shipping-first-name"]').type(shippingData.firstName);
  cy.get('[data-cy="shipping-last-name"]').type(shippingData.lastName);
  cy.get('[data-cy="shipping-email"]').type(shippingData.email);
  cy.get('[data-cy="shipping-phone"]').type(shippingData.phone);
  cy.get('[data-cy="shipping-address"]').type(shippingData.address);
  cy.get('[data-cy="shipping-city"]').type(shippingData.city);
  cy.get('[data-cy="shipping-zip"]').type(shippingData.zipCode);
});

Cypress.Commands.add('selectPaymentMethod', (method) => {
  cy.get(`[data-cy="payment-method-${method}"]`).check();
});

// Admin Commands
Cypress.Commands.add('createProduct', (productData) => {
  cy.get('[data-cy="add-product-button"]').click();
  cy.get('[data-cy="product-name"]').type(productData.name);
  cy.get('[data-cy="product-description"]').type(productData.description);
  cy.get('[data-cy="product-price"]').type(productData.price);
  cy.get('[data-cy="product-category"]').select(productData.category);
  cy.get('[data-cy="product-image"]').type(productData.image);
  cy.get('[data-cy="product-quantity"]').type(productData.quantity);
  cy.get('[data-cy="save-product-button"]').click();
});

Cypress.Commands.add('updateOrderStatus', (orderId, status) => {
  cy.get(`[data-cy="order-${orderId}"]`).within(() => {
    cy.get('[data-cy="order-status-select"]').select(status);
    cy.get('[data-cy="update-status-button"]').click();
  });
});

// Utility Commands
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-cy="loading-spinner"]').should('not.exist');
  cy.get('body').should('be.visible');
});

Cypress.Commands.add('checkAccessibility', () => {
  cy.injectAxe();
  cy.checkA11y();
});

Cypress.Commands.add('mockRazorpayPayment', (success = true) => {
  cy.window().then((win) => {
    win.Razorpay = cy.stub().callsFake((options) => ({
      open: cy.stub().callsFake(() => {
        if (success) {
          options.handler({
            razorpay_payment_id: 'pay_test_123',
            razorpay_order_id: 'order_test_123',
            razorpay_signature: 'signature_test_123'
          });
        } else {
          options.modal.ondismiss();
        }
      })
    }));
  });
});

// Database Commands
Cypress.Commands.add('seedTestData', () => {
  cy.task('seedDatabase');
});

Cypress.Commands.add('cleanupTestData', () => {
  cy.task('clearDatabase');
});

// Visual Testing Commands
Cypress.Commands.add('matchImageSnapshot', (name) => {
  cy.screenshot(name);
  // Integration with visual testing tools would go here
});

// API Testing Commands
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    failOnStatusCode: false
  });
});

// Mobile Testing Commands
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport('iphone-x');
});

Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport('ipad-2');
});

Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720);
});

// Error Handling Commands
Cypress.Commands.add('expectError', (errorMessage) => {
  cy.get('[data-cy="error-message"]').should('contain', errorMessage);
});

Cypress.Commands.add('expectSuccess', (successMessage) => {
  cy.get('[data-cy="success-message"]').should('contain', successMessage);
});