describe('Navigation Drawer', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should open navigation drawer with hamburger menu', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Check that drawer is visible with domain sections
    cy.contains('INVENTORY DOMAIN').should('be.exist')
    cy.contains('PRODUCT DOMAIN').should('be.exist')
    cy.contains('SHIPMENT DOMAIN').should('be.exist')
    cy.contains('DEMAND DOMAIN').should('be.exist')
    cy.contains('WAREHOUSE DOMAIN').should('be.exist')
    cy.contains('OPTIMIZATION DOMAIN').should('be.exist')
  })
  it('should have all inventory domain links in drawer', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-inventorys-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-inventorys-new-link"]').should('be.visible')
  })
  it('should have all product domain links in drawer', () => {
    cy.visit('/products')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-products-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-products-new-link"]').should('be.visible')
  })
  it('should have all shipment domain links in drawer', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-shipments-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-shipments-new-link"]').should('be.visible')
  })
  it('should have demand domain link in drawer', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-demands-list-link"]').should('be.visible')
  })
  it('should have warehouse domain link in drawer', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-warehouses-list-link"]').should('be.visible')
  })
  it('should have optimization domain link in drawer', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-optimizations-list-link"]').should('be.visible')
  })

  it('should have admin and logout at bottom of drawer', () => {
    // Login with admin role to see admin link
    cy.login(['admin'])
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Admin and Logout should be visible in the drawer
    cy.get('[data-automation-id="nav-admin-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-logout-link"]').should('be.visible')
  })

  it('should navigate to different pages from drawer', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-shipments-list-link"]').click()
    cy.url().should('include', '/shipments')
  })

  it('should close drawer after navigation', () => {
    cy.visit('/inventorys')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-shipments-list-link"]').click()
    
    // Drawer should close after navigation (temporary drawer)
    cy.wait(500)
    cy.contains('INVENTORY DOMAIN').should('not.be.visible')
  })
})