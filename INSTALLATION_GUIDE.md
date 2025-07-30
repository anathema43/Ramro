# 📦 Complete Installation Guide for Ramro E-commerce

## 🔒 **SECURITY-FIRST INSTALLATION**
This installation guide includes all critical security fixes:
- ✅ **Server-side Admin Verification** - No hardcoded admin access
- ✅ **Secure File Upload Rules** - Strict validation and size limits
- ✅ **Data Integrity** - Single source of truth from Firestore
- ✅ **Input Validation** - XSS and injection prevention
- ✅ **Real-time Cart Sync** - Cross-tab synchronization

## 🚀 **Quick Install (All Dependencies)**

Run these commands in your project root directory:

### **1. Core Dependencies (Already Installed)**
```bash
# Main application dependencies
npm install react@latest react-dom@latest
npm install react-router-dom@latest
npm install firebase@latest
npm install zustand@latest
npm install @heroicons/react@latest
npm install react-hook-form@latest
```

### **2. Development Tools**
```bash
# Build tools
npm install --save-dev vite@latest @vitejs/plugin-react@latest
npm install --save-dev tailwindcss@latest autoprefixer@latest postcss@latest
npm install --save-dev eslint@latest @eslint/js@latest eslint-plugin-react@latest
```

### **3. Testing Framework (Cypress + Vitest)**
```bash
# Cypress E2E Testing
npm install --save-dev cypress@latest
npm install --save-dev @cypress/code-coverage@latest
npm install --save-dev cypress-axe@latest
npm install --save-dev @testing-library/cypress@latest
npm install --save-dev eslint-plugin-cypress@latest

# Unit Testing with Vitest
npm install --save-dev vitest@latest
npm install --save-dev @vitest/coverage-v8@latest
npm install --save-dev @testing-library/jest-dom@latest
npm install --save-dev @testing-library/react@latest
npm install --save-dev @testing-library/user-event@latest
npm install --save-dev jsdom@latest
```

### **4. TypeScript Support (Optional)**
```bash
# If you want TypeScript support
npm install --save-dev typescript@latest
npm install --save-dev @types/react@latest
npm install --save-dev @types/react-dom@latest
```

## 🔧 **Verification Commands**

After installation, verify everything works:

### **1. Check Dependencies**
```bash
# Verify all packages are installed
npm list --depth=0

# Check for vulnerabilities
npm audit

# Fix any vulnerabilities
npm audit fix
```

### **2. Test Installation**
```bash
# Start development server
npm run dev

# Run unit tests
npm run test

# Open Cypress (after dev server is running)
npm run cy:open

# Run Cypress tests headlessly
npm run cy:run
```

## 📋 **Package.json Scripts**

Your package.json should include these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:chrome": "cypress run --browser chrome",
    "cy:run:firefox": "cypress run --browser firefox",
    "cy:run:mobile": "cypress run --config viewportWidth=375,viewportHeight=667",
    "cy:run:tablet": "cypress run --config viewportWidth=768,viewportHeight=1024"
  }
}
```

## 🛠️ **Additional Tools (Optional)**

### **Performance & Bundle Analysis**
```bash
npm install --save-dev vite-bundle-analyzer@latest
npm install --save-dev lighthouse@latest
```

### **Code Quality**
```bash
npm install --save-dev prettier@latest
npm install --save-dev husky@latest
npm install --save-dev lint-staged@latest
```

### **Firebase Tools**
```bash
# Firebase CLI (global installation)
npm install -g firebase-tools@latest
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Node Version Compatibility**
   ```bash
   # Check Node version (should be 18+)
   node --version
   
   # Update Node if needed
   nvm install 18
   nvm use 18
   ```

2. **Clear Cache if Issues**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Cypress Installation Issues**
   ```bash
   # If Cypress binary doesn't download
   npx cypress install --force
   
   # Verify Cypress installation
   npx cypress verify
   ```

## ✅ **Installation Checklist**

- [ ] Node.js 18+ installed
- [ ] Firebase project created with secure rules
- [ ] All npm packages installed successfully
- [ ] Development server starts (`npm run dev`)
- [ ] Tests run successfully (`npm run test`)
- [ ] Cypress opens without errors (`npm run cy:open`)
- [ ] Build process works (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Security tests pass (`npm run test:security`)
- [ ] Admin access properly configured (server-side role verification)
- [x] **Responsive images** system implemented with multi-device optimization

## 🚀 **Next Steps After Installation**

1. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and Razorpay keys
   ```

2. **Set Up Firebase Project**
   - Create project at console.firebase.google.com
   - Enable Firestore and Authentication
   - Configure secure Firestore rules (included in project)
   - Set up secure Storage rules (included in project)
   - Get configuration keys

3. **Set Up Razorpay Account**
   - Create account at razorpay.com
   - Get test API keys
   - Configure webhook endpoints

4. **Run Initial Tests**
   ```bash
   npm run dev
   npm run test
   npm run cy:open
   ```

5. **Verify Security Implementation**
   ```bash
   # Test admin access (should require proper role in Firestore)
   # Test file uploads (should enforce size/type limits)
   # Test data integrity (should use only Firestore data)
   ```

Your Ramro e-commerce application will be fully set up with enterprise-grade security and ready for development and testing!