/// <reference types="cypress" />

describe('Date picker', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('displays two todo items by default', () => {
    // cy.get('.todo-list li').should('have.length', 2);
    cy.get('h1').should('contain', 'Berlin Clock');
  });
});
