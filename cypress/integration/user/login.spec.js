/// <reference types="cypress" />

beforeEach(() => {
  cy.visit("/");
});

describe("Login Input Form", () => {
  it("displays Sign In text", () => {
    cy.contains("h2", "Login");
  });

  it("displays a link to register page", () => {
    cy.contains("Don't have an account?").should(
      "have.attr",
      "href",
      "/register"
    );
  });

  it("focuses email field on load", () => {
    cy.focused().should("have.attr", "name", "email");
  });
});

describe("Login Form Submission", () => {
  beforeEach(() => {
    cy.get("input[name=email]").as("emailInput");
    cy.get("input[name=password]").as("passwordInput");
  });

  it("requires valid username and password", () => {
    cy.get("@emailInput").type("example@example.com");
    cy.get("@passwordInput").type("invalid{enter}");

    cy.get(".MuiAlert-message")
      .should("be.visible")
      .and("contain", "A login error occured");

    cy.url().should("contain", "/login");
  });

  it("it navigates to dashboard on successful login", () => {
    cy.get("@emailInput").type(Cypress.env("email"), { log: false });
    cy.get("@passwordInput").type(Cypress.env("password"), { log: false });

    cy.get("form").submit();
  });
});
