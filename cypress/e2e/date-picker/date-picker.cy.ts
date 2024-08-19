/// <reference types="cypress" />

describe('Home page', { testIsolation: true }, () => {
  beforeEach(() => {
    cy.visit('/');
    cy.getDataTestId('MainNavbar').as('mainNavbar');
  });

  it('should show 3 headings', () => {
    cy.get('h3').should('contain', /date picker/i);
    cy.get('h3').should('contain', /Date range/i);
    cy.get('h3').should('contain', /berlin clock/i);
  });

  it('track dark mode on home page', () => {
    cy.get('@mainNavbar').should('have.css', 'color-scheme', 'dark');
    cy.get('@mainNavbar').should('have.css', 'background-color', 'rgb(14, 22, 36)');

    cy.get('#root > div').should('have.css', 'background-color', 'rgb(14, 22, 36)');

    cy.getDataTestId('light_theme_button')
      .invoke('attr', 'aria-label')
      .then((value) => {
        expect(value).equal('light button');
      });
  });

  it.only('track light mode on home page', () => {
    cy.getDataTestId('light_theme_button').click();
    cy.get('@mainNavbar').should('have.css', 'color-scheme', 'light');
    cy.get('@mainNavbar').should('have.css', 'background-color', 'rgb(14, 22, 36)');

    cy.get('#root > div').should('have.css', 'background-color', 'rgb(255, 255, 255)');

    // cy.get('@themeButton')
    //   .invoke('attr', 'aria-label')
    //   .then((value) => {
    //     expect(value).equal('light button');
    //   });
  });
});

describe('Date Picker', () => {});
describe('Date range', () => {});
describe('Berlin clock', () => {
  it('should display time for Europe/Berlin', () => {
    cy.visit('/berlinClock');
    cy.contains(/Time playground/i);

    cy.getAriaLabel('Select Zone').invoke('val').should('equal', 'Europe');
    cy.getAriaLabel('Select Country').invoke('val').should('equal', 'Berlin');
  });
});
