describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('User Registration', () => {
    it('should allow new user registration', () => {
      const timestamp = Date.now();
      const testEmail = `test${timestamp}@ramro.com`;
      
      cy.get('[data-cy="nav-signup"]').click();
      cy.url().should('include', '/signup');
      
      // Fill registration form
      cy.get('[data-cy="signup-name"]').type('Test User');
      cy.get('[data-cy="signup-email"]').type(testEmail);
      cy.get('[data-cy="signup-password"]').type('password123');
      cy.get('[data-cy="signup-confirm-password"]').type('password123');
      
      // Submit form
      cy.get('[data-cy="signup-submit"]').click();
      
      // Verify successful registration
      cy.url().should('not.include', '/signup');
      cy.get('[data-cy="user-menu"]').should('be.visible');
      cy.get('[data-cy="welcome-message"]').should('contain', 'Test User');
    });

    it('should show validation errors for invalid registration', () => {
      cy.get('[data-cy="nav-signup"]').click();
      
      // Test empty form submission
      cy.get('[data-cy="signup-submit"]').click();
      cy.get('[data-cy="error-message"]').should('contain', 'required');
      
      // Test invalid email
      cy.get('[data-cy="signup-email"]').type('invalid-email');
      cy.get('[data-cy="signup-submit"]').click();
      cy.get('[data-cy="error-message"]').should('contain', 'valid email');
      
      // Test password mismatch
      cy.get('[data-cy="signup-email"]').clear().type('test@example.com');
      cy.get('[data-cy="signup-password"]').type('password123');
      cy.get('[data-cy="signup-confirm-password"]').type('different123');
      cy.get('[data-cy="signup-submit"]').click();
      cy.get('[data-cy="error-message"]').should('contain', 'passwords do not match');
    });

    it('should prevent registration with existing email', () => {
      const existingEmail = Cypress.env('testUser').email;
      
      cy.get('[data-cy="nav-signup"]').click();
      cy.get('[data-cy="signup-name"]').type('Another User');
      cy.get('[data-cy="signup-email"]').type(existingEmail);
      cy.get('[data-cy="signup-password"]').type('password123');
      cy.get('[data-cy="signup-confirm-password"]').type('password123');
      cy.get('[data-cy="signup-submit"]').click();
      
      cy.get('[data-cy="error-message"]').should('contain', 'email already exists');
    });
  });

  describe('User Login', () => {
    it('should allow valid user login', () => {
      const user = Cypress.env('testUser');
      
      cy.get('[data-cy="nav-login"]').click();
      cy.url().should('include', '/login');
      
      cy.get('[data-cy="login-email"]').type(user.email);
      cy.get('[data-cy="login-password"]').type(user.password);
      cy.get('[data-cy="login-submit"]').click();
      
      // Verify successful login
      cy.url().should('not.include', '/login');
      cy.get('[data-cy="user-menu"]').should('be.visible');
      cy.get('[data-cy="user-name"]').should('contain', user.name);
    });

    it('should reject invalid credentials', () => {
      cy.get('[data-cy="nav-login"]').click();
      
      cy.get('[data-cy="login-email"]').type('invalid@email.com');
      cy.get('[data-cy="login-password"]').type('wrongpassword');
      cy.get('[data-cy="login-submit"]').click();
      
      cy.get('[data-cy="error-message"]').should('contain', 'Invalid credentials');
      cy.url().should('include', '/login');
    });

    it('should show validation for empty fields', () => {
      cy.get('[data-cy="nav-login"]').click();
      cy.get('[data-cy="login-submit"]').click();
      
      cy.get('[data-cy="email-error"]').should('be.visible');
      cy.get('[data-cy="password-error"]').should('be.visible');
    });
  });

  describe('Google OAuth Login', () => {
    it('should handle Google OAuth flow', () => {
      cy.get('[data-cy="nav-login"]').click();
      
      // Mock Google OAuth
      cy.window().then((win) => {
        cy.stub(win, 'open').returns({
          closed: false,
          location: { href: 'https://accounts.google.com/oauth/callback?code=test' }
        });
      });
      
      cy.get('[data-cy="google-login-button"]').click();
      
      // Verify OAuth flow initiation
      cy.window().its('open').should('have.been.called');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      cy.loginAsUser();
    });

    it('should successfully logout user', () => {
      cy.get('[data-cy="user-menu"]').click();
      cy.get('[data-cy="logout-button"]').click();
      
      // Verify logout
      cy.get('[data-cy="nav-login"]').should('be.visible');
      cy.get('[data-cy="user-menu"]').should('not.exist');
      cy.window().its('localStorage').should('not.contain.key', 'auth-storage');
    });
  });

  describe('Password Reset', () => {
    it('should send password reset email', () => {
      cy.get('[data-cy="nav-login"]').click();
      cy.get('[data-cy="forgot-password-link"]').click();
      
      cy.get('[data-cy="reset-email"]').type('test@ramro.com');
      cy.get('[data-cy="reset-submit"]').click();
      
      cy.get('[data-cy="success-message"]').should('contain', 'Password reset email sent');
    });
  });

  describe('Session Management', () => {
    it('should maintain session across page refreshes', () => {
      cy.loginAsUser();
      cy.reload();
      
      cy.get('[data-cy="user-menu"]').should('be.visible');
      cy.window().its('localStorage').should('contain.key', 'auth-storage');
    });

    it('should redirect to login for protected routes', () => {
      cy.visit('/account');
      cy.url().should('include', '/login');
      
      cy.visit('/admin');
      cy.url().should('include', '/login');
    });
  });
});