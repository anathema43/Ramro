describe('Product Browsing and Search', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForPageLoad();
  });

  describe('Product Catalog', () => {
    it('should display products on shop page', () => {
      cy.navigateToShop();
      
      // Verify products are loaded
      cy.get('[data-cy="product-card"]').should('have.length.greaterThan', 0);
      cy.get('[data-cy="product-card"]').first().within(() => {
        cy.get('[data-cy="product-name"]').should('be.visible');
        cy.get('[data-cy="product-price"]').should('be.visible');
        cy.get('[data-cy="product-image"]').should('be.visible');
        cy.get('[data-cy="add-to-cart-button"]').should('be.visible');
      });
    });

    it('should show product details when clicked', () => {
      cy.navigateToShop();
      
      cy.get('[data-cy="product-card"]').first().within(() => {
        cy.get('[data-cy="product-name"]').invoke('text').as('productName');
        cy.get('[data-cy="view-details-link"]').click();
      });
      
      cy.url().should('include', '/products/');
      cy.get('[data-cy="product-detail-page"]').should('be.visible');
      cy.get('@productName').then((name) => {
        cy.get('[data-cy="product-title"]').should('contain', name);
      });
    });

    it('should handle out of stock products', () => {
      cy.navigateToShop();
      
      // Mock out of stock product
      cy.intercept('GET', '/api/products*', {
        fixture: 'products.json'
      }).as('getProducts');
      
      cy.get('[data-cy="product-card"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-cy="stock-status"]').then(($status) => {
            if ($status.text().includes('Out of Stock')) {
              cy.get('[data-cy="add-to-cart-button"]').should('be.disabled');
              cy.get('[data-cy="out-of-stock-badge"]').should('be.visible');
            }
          });
        });
      });
    });
  });

  describe('Product Search', () => {
    beforeEach(() => {
      cy.navigateToShop();
    });

    it('should search products by name', () => {
      const searchTerm = 'honey';
      
      cy.searchProduct(searchTerm);
      
      cy.get('[data-cy="search-results"]').should('be.visible');
      cy.get('[data-cy="product-card"]').each(($card) => {
        cy.wrap($card).should('contain.text', searchTerm);
      });
    });

    it('should show no results message for invalid search', () => {
      cy.searchProduct('nonexistentproduct123');
      
      cy.get('[data-cy="no-results-message"]').should('be.visible');
      cy.get('[data-cy="no-results-message"]').should('contain', 'No products found');
    });

    it('should clear search results', () => {
      cy.searchProduct('honey');
      cy.get('[data-cy="clear-search-button"]').click();
      
      cy.get('[data-cy="search-input"]').should('have.value', '');
      cy.get('[data-cy="product-card"]').should('have.length.greaterThan', 1);
    });
  });

  describe('Product Filtering', () => {
    beforeEach(() => {
      cy.navigateToShop();
    });

    it('should filter products by category', () => {
      cy.get('[data-cy="category-filter"]').select('honey');
      
      cy.get('[data-cy="product-card"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-cy="product-category"]').should('contain', 'honey');
        });
      });
    });

    it('should filter products by price range', () => {
      cy.get('[data-cy="price-filter-min"]').type('200');
      cy.get('[data-cy="price-filter-max"]').type('500');
      cy.get('[data-cy="apply-price-filter"]').click();
      
      cy.get('[data-cy="product-card"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-cy="product-price"]').invoke('text').then((priceText) => {
            const price = parseInt(priceText.replace(/[^\d]/g, ''));
            expect(price).to.be.within(200, 500);
          });
        });
      });
    });

    it('should sort products by price', () => {
      cy.get('[data-cy="sort-select"]').select('price-low');
      
      cy.get('[data-cy="product-price"]').then(($prices) => {
        const prices = [...$prices].map(el => 
          parseInt(el.textContent.replace(/[^\d]/g, ''))
        );
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).to.deep.equal(sortedPrices);
      });
    });
  });

  describe('Product Details Page', () => {
    beforeEach(() => {
      cy.navigateToShop();
      cy.get('[data-cy="product-card"]').first().click();
    });

    it('should display complete product information', () => {
      cy.get('[data-cy="product-title"]').should('be.visible');
      cy.get('[data-cy="product-description"]').should('be.visible');
      cy.get('[data-cy="product-price"]').should('be.visible');
      cy.get('[data-cy="product-rating"]').should('be.visible');
      cy.get('[data-cy="product-image"]').should('be.visible');
      cy.get('[data-cy="stock-info"]').should('be.visible');
    });

    it('should allow adding product to cart from detail page', () => {
      cy.get('[data-cy="add-to-cart-button"]').click();
      cy.get('[data-cy="cart-count"]').should('contain', '1');
      cy.get('[data-cy="success-message"]').should('contain', 'Added to cart');
    });

    it('should allow adding product to wishlist', () => {
      cy.get('[data-cy="wishlist-button"]').click();
      cy.get('[data-cy="wishlist-count"]').should('be.visible');
      cy.get('[data-cy="success-message"]').should('contain', 'Added to wishlist');
    });

    it('should show related products', () => {
      cy.get('[data-cy="related-products"]').should('be.visible');
      cy.get('[data-cy="related-product-card"]').should('have.length.greaterThan', 0);
    });
  });

  describe('Responsive Design', () => {
    it('should display properly on mobile devices', () => {
      cy.setMobileViewport();
      cy.navigateToShop();
      
      // Check mobile-specific elements
      cy.get('[data-cy="mobile-filter-button"]').should('be.visible');
      cy.get('[data-cy="product-grid"]').should('have.class', 'mobile-grid');
      
      // Test mobile navigation
      cy.get('[data-cy="mobile-menu-button"]').click();
      cy.get('[data-cy="mobile-menu"]').should('be.visible');
    });

    it('should display properly on tablet devices', () => {
      cy.setTabletViewport();
      cy.navigateToShop();
      
      cy.get('[data-cy="product-grid"]').should('have.class', 'tablet-grid');
      cy.get('[data-cy="sidebar-filters"]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      cy.navigateToShop();
      cy.checkAccessibility();
      
      // Check specific accessibility features
      cy.get('[data-cy="product-card"]').first().within(() => {
        cy.get('img').should('have.attr', 'alt');
        cy.get('[data-cy="add-to-cart-button"]').should('have.attr', 'aria-label');
      });
    });

    it('should support keyboard navigation', () => {
      cy.navigateToShop();
      
      // Test tab navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-cy', 'search-input');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-cy', 'category-filter');
    });
  });
});