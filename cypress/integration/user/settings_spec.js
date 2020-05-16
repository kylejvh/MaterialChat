/// <reference types="cypress" />

describe("settings", () => {
  beforeEach(() => {
    cy.login();
    // log in first
    // and then visit settings panel
    // click on gear at the top for settings panel
    cy.get("button").contains("img").click();
  });

  it("contains description text", () => {
    cy.contains("h1", "Settings");
  });
});
