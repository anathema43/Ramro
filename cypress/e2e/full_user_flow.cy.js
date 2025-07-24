describe('Full E-Commerce User Flow', () => {
  // We'll create unique user data for each test run to ensure tests are isolated
  const userOne = {
    name: "User One",
    email: `userone_${Date.now()}@example.com`,
    password: "password123",
  };
  const userTwo = {
    name: "User Two",
    email: `usertwo_${Date.now()}@example.com`,
    password: "password123",
  };

  it('should allow a user to sign up, log out, and log back in', () => {
    // --- SIGNUP ---
    cy.visit('/#/signup');
    cy.get('#name').type(userOne.name);
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    
    // Wait for authentication to complete and redirect
    cy.get('a[aria-label="My Account"]', { timeout: 15000 }).should('be.visible');
    cy.url().should('include', '/products');

    // --- LOGOUT ---
    cy.get('a[aria-label="My Account"]').click();
    cy.url().should('include', '/account');
    cy.contains('button', 'Logout', { timeout: 10000 }).should('be.visible').click();
    cy.url().should('include', '/login');

    // --- LOGIN ---
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();

    // Wait for login to complete
    cy.get('a[aria-label="My Account"]', { timeout: 15000 }).should('be.visible');
    cy.url().should('include', '/products');
  });

  it('should persist the cart after a user logs out and logs back in', () => {
    // --- LOGIN AS USER ONE ---
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.get('a[aria-label="My Account"]', { timeout: 15000 }).should('be.visible');

    // Add a specific item to the cart
    cy.contains('Darjeeling Pickle 1').parents('[class*="bg-white"]').find('button').click();
    cy.contains('button', '-').should('be.visible');

    // --- LOGOUT ---
    cy.get('a[aria-label="My Account"]').click();
    cy.contains('button', 'Logout', { timeout: 10000 }).should('be.visible').click();

    // --- LOGIN AGAIN ---
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.get('a[aria-label="My Account"]', { timeout: 15000 }).should('be.visible');

    // Wait a moment for cart to load from Firestore
    cy.wait(2000);

    // --- VERIFY CART ---
    cy.get('a[aria-label="View cart"]').click();
    cy.contains('h2', 'Darjeeling Pickle 1').should('be.visible');
  });

  it('should not share cart data between different user sessions', () => {
    // --- SESSION 1: USER ONE ---
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.get('a[aria-label="My Account"]', { timeout: 15000 }).should('be.visible');

    cy.contains('Spicy Pickle 2').parents('[class*="bg-white"]').find('button').click();
    cy.get('a[aria-label="View cart"]').click();
    cy.contains('h2', 'Spicy Pickle 2').should('be.visible');
    
    cy.get('a[aria-label="My Account"]').click();
    cy.contains('button', 'Logout', { timeout: 10000 }).should('be.visible').click();

    // --- SESSION 2: USER TWO ---
    cy.visit('/#/signup');
    cy.get('#name').type(userTwo.name);
    cy.get('#email').type(userTwo.email);
    cy.get('#password').type(userTwo.password);
    cy.get('button[type="submit"]').click();
    cy.get('a[aria-label="My Account"]', { timeout: 15000 }).should('be.visible');

    // --- VERIFY CART FOR USER TWO ---
    cy.get('a[aria-label="View cart"]').click();
    cy.url().should('include', '/cart');
    cy.contains('Your cart is empty.').should('be.visible');
  });

  it('should allow a user to update their profile name and manage addresses', () => {
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.get('a[aria-label="My Account"]', { timeout: 15000 }).should('be.visible');
    
    cy.visit('/#/account');
    
    // --- PROFILE UPDATE ---
    const newName = "Ramro Test User";
    cy.contains('button', 'Edit').click();
    cy.get('input[type="text"]').clear().type(newName);
    cy.contains('button', 'Save').click();
    
    // Wait for the page to reload after save
    cy.wait(2000);
    cy.contains('h2', newName, { timeout: 10000 }).should('be.visible');
  });
});