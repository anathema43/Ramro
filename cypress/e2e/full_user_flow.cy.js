describe('Full E-Commerce User Flow', () => {
  const userEmail = `testuser_${Date.now()}@example.com`;
  const userName = "Test User";
  const userPassword = "password123";

  it('should allow a user to sign up, log out, and log back in', () => {
    // --- SIGNUP ---
    cy.visit('/#/signup');
    cy.get('#name').type(userName);
    cy.get('#email').type(userEmail);
    cy.get('#password').type(userPassword);
    cy.get('button[type="submit"]').click();
    
    // Check redirection to products page
    cy.url().should('include', '/products');
    cy.contains('Our Products');

    // --- LOGOUT ---
    cy.get('a[aria-label="My Account"]').click();
    cy.url().should('include', '/account');
    cy.get('button', { timeout: 10000 }).contains('Logout').click(); // Increased timeout for stability
    cy.url().should('include', '/login');

    // --- LOGIN ---
    cy.get('#email').type(userEmail);
    cy.get('#password').type(userPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/products');
  });

  it('should allow a logged-in user to add an item to the cart and proceed to checkout', () => {
    // --- LOGIN FIRST ---
    cy.visit('/#/login');
    cy.get('#email').type(userEmail);
    cy.get('#password').type(userPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/products');

    // --- ADD TO CART ---
    cy.contains('button', 'Add to Cart').first().click();
    
    // --- THIS IS THE FIX ---
    // Instead of looking for "Added!", we check that the quantity selector now exists.
    // We look for a button with "-" which only appears after adding to cart.
    cy.contains('button', '-').should('be.visible');
    
    // --- GO TO CART & VERIFY ---
    cy.get('a[aria-label="View cart"]').click();
    cy.url().should('include', '/cart');
    cy.contains('h1', 'Your Cart');
    cy.contains('Total:');
    
    // --- PROCEED TO CHECKOUT ---
    cy.contains('button', 'Proceed to Checkout').click();
    cy.url().should('include', '/checkout');
    cy.contains('h1', 'Checkout');
    cy.contains('Order Summary');
  });
});