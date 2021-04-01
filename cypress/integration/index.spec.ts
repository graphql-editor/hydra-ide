/// <reference types="cypress" />

import { tree } from '@/cypressTree';

context('Main IDE functions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1457/');
  });
  it('allows to edit the code', () => {
    cy.get(`[data-cy=${tree.tree.code}]`)
      .find('textarea')
      .type('return `<div>Hello world</div>`')
      .wait(100)
      .type(`{backspace}{backspace}`);

    cy.get(`[data-cy=${tree.tree.code}]`)
      .find('textarea')
      .invoke('val')
      .should('equal', 'return `<div>Hello world</div');
  });
});
