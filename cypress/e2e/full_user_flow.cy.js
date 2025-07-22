describe('Full E-Commerce User Flow', () => {
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
    cy.visit('/#/signup');
    cy.get('#name').type(userOne.name);
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/products');
    cy.contains('Our Products');

    cy.get('button[aria-label="My Account"]').click();
    cy.contains('button', 'Logout').click({ force: true });
    cy.url().should('include', '/login');

    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/products');
  });

  it('should persist the cart after a user logs out and logs back in', () => {
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();

    cy.contains('Darjeeling Pickle 1').parents('[class*="bg-white"]').find('button').click();
    cy.contains('button', '-').should('be.visible');

    cy.get('button[aria-label="My Account"]').click();
    cy.contains('button', 'Logout').click({ force: true });
    cy.url().should('include', '/login');

    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();

    cy.get('a[aria-label="View cart"]').click();
    cy.contains('h2', 'Darjeeling Pickle 1').should('be.visible');
  });

  it('should not share cart data between different user sessions', () => {
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();

    cy.contains('Spicy Pickle 2').parents('[class*="bg-white"]').find('button').click();
    cy.get('a[aria-label="View cart"]').click();
    cy.contains('h2', 'Spicy Pickle 2').should('be.visible');

    cy.get('button[aria-label="My Account"]').click();
    cy.contains('button', 'Logout').click({ force: true });

    cy.visit('/#/signup');
    cy.get('#name').type(userTwo.name);
    cy.get('#email').type(userTwo.email);
    cy.get('#password').type(userTwo.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/products');

    cy.get('a[aria-label="View cart"]').click();
    cy.contains('Your cart is empty.').should('be.visible');
    cy.contains('h2', 'Spicy Pickle 2').should('not.exist');
  });

  it('should allow a user to update their profile name and manage addresses', () => {
    cy.visit('/#/login');
    cy.get('#email').type(userOne.email);
    cy.get('#password').type(userOne.password);
    cy.get('button[type="submit"]').click();
    cy.visit('/#/account');

    const newName = "Ramro Test User";
    cy.contains('button', 'Edit').click();
    cy.get('input[type="text"]').clear().type(newName);
    cy.contains('button', 'Save').click();
    cy.contains('h2', newName).should('be.visible');
    cy.reload();
    cy.contains('h2', newName).should('be.visible');

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
