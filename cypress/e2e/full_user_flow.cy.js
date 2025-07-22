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

  it('should allow a user to sign up and log in', () => {
    // --- SIGNUP ---
    cy.visit('/#/signup');
    cy.get('#name').type(userOne.name);
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/products');
    cy.contains('Our Products');

    // --- LOGOUT ---
    cy.get('a[aria-label="My Account"]').click();
    cy.contains('button', 'Logout').click();
    cy.url().should('include', '/login');

    // --- LOGIN ---
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/products');
  });

  it('should persist the cart after a user logs out and logs back in', () => {
    // --- LOGIN AS USER ONE ---
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/products');

    // Add a specific item to the cart
    cy.contains('Darjeeling Pickle 1').parents('[class*="bg-white"]').find('button').click();
    cy.contains('button', '-').should('be.visible');

    // --- LOGOUT ---
    cy.get('a[aria-label="My Account"]').click();
    cy.contains('button', 'Logout').click();
    cy.url().should('include', '/login');

    // --- LOGIN AGAIN ---
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/products');

    // --- VERIFY CART ---
    cy.get('a[aria-label="View cart"]').click();
    cy.contains('h2', 'Darjeeling Pickle 1').should('be.visible');
  });

  // --- NEW TEST: DATA ISOLATION ---
  it('should not share cart data between different user sessions', () => {
    // --- SESSION 1: USER ONE ---
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();

    // Add a different item to User One's cart
    cy.contains('Spicy Pickle 2').parents('[class*="bg-white"]').find('button').click();
    cy.get('a[aria-label="View cart"]').click();
    cy.contains('h2', 'Spicy Pickle 2').should('be.visible');
    
    // Log out User One
    cy.get('a[aria-label="My Account"]').click();
    cy.contains('button', 'Logout').click();
    cy.url().should('include', '/login');

    // --- SESSION 2: USER TWO ---
    cy.visit('/#/signup');
    cy.get('#name').type(userTwo.name);
    cy.get('#email').type(userTwo.email);
    cy.get('#password').type(userTwo.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/products');

    // --- VERIFY CART FOR USER TWO ---
    cy.get('a[aria-label="View cart"]').click();
    cy.url().should('include', '/cart');
    // Assert that User Two's cart is empty and does NOT contain User One's item
    cy.contains('h1', 'Your Cart');
    cy.contains('Your cart is empty.').should('be.visible');
    cy.contains('h2', 'Spicy Pickle 2').should('not.exist');
  });

  it('should allow a user to update their profile name and manage addresses', () => {
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.visit('/#/account');
    
    // --- PROFILE UPDATE ---
    const newName = "Ramro Test User";
    cy.contains('button', 'Edit').click();
    cy.get('input[type="text"]').clear().type(newName);
    cy.contains('button', 'Save').click();
    cy.contains('h2', newName).should('be.visible');
    cy.reload();
    cy.contains('h2', newName).should('be.visible');

    // --- ADDRESS MANAGEMENT ---
    cy.contains('button', 'Manage Addresses').click();
    cy.contains('button', 'Add New Address').click();
    cy.get('input[placeholder="Street Address"]').type('123 Tea Garden Lane');
    cy.get('input[placeholder="City"]').type('Darjeeling');
    cy.get('input[placeholder="State"]').type('West Bengal');
    cy.get('input[placeholder="ZIP Code"]').type('734101');
    cy.contains('button', 'Save Address').click();
    cy.contains('p', '123 Tea Garden Lane').should('be.visible');
    cy.get('button[aria-label*="Delete address"]').click();
    cy.contains('p', '123 Tea Garden Lane').should('not.exist');
  });
});