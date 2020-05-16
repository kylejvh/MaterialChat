/// <reference types="cypress" />

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  // it shows sign in text
  it("displays Sign In text", () => {
    cy.contains("h2", "Login");
  });

  // it links to register page
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
  // it requires email
  it("requires an email", () => {
    // get form button and click it, then verify the error response is correct.
    cy.get("form").contains("Sign in").click();
    //TODO: find error message correctly
    cy.get(".error-messages").should("contain", "email cant be blank");
  });
  // it requires password
  it("requires a password", () => {
    cy.get("input[name=password]").type("example@example.com{enter}");
    cy.get(".error-messages").should("contain", "password cant be blank");
  });

  // it requires valid username and password
  it("requires valid username and password", () => {
    cy.get("input[name=email]").type("example@example.com");

    cy.get("input[name=password]").type("invalid{enter}");
    cy.get(".error-messages").should("contain", "email or password is invalid");
  });

  // it navigates to dashboard ('/') on successful login

  // it displays login snackbar upon login

  //
});
