/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
export {};
declare global {
  namespace Cypress {
    interface Chainable {
      getDataTest(dataTestSelector: string): Chainable<Element>;
      getAriaLabel(dataTestSelector: string): Chainable<Element>;
      getDataTestId(dataTestSelector: string): Chainable<Element>;
      //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

Cypress.Commands.add<any>('getDataTest', (dataTestSelector) => {
  return cy.get(`[data-test="${dataTestSelector}"]`);
});

Cypress.Commands.add<any>('getDataTestId', (dataTestSelector) => {
  return cy.get(`[data-testid="${dataTestSelector}"]`);
});

Cypress.Commands.add<any>('getAriaLabel', (dataTestSelector) => {
  return cy.get(`[aria-label="${dataTestSelector}"]`);
});
