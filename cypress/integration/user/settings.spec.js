/// <reference types="cypress" />
beforeEach(() => {
  // cy.login(); //! not working
  // log in first
  // and then visit settings panel
  // click on gear at the top for settings panel
  // cy.get("button").contains("img").click();

  // Stub out login process....
  //   cy.get("input[name=email]").as("emailInput");
  //   cy.get("input[name=password]").as("passwordInput");

  //   cy.get("@emailInput").type(Cypress.env("email"), { log: false });
  //   cy.get("@passwordInput").type(Cypress.env("password"), {
  //     log: false,
  //   });

  //   cy.get("form").submit();
  cy.login();
  cy.get(".MuiDialogActions-root > .MuiButtonBase-root").as("closeButton");
  cy.get(".MuiDialog-container").as("dialogContainer");
});

describe("Opening Panel", () => {
  it("opens settings panel on button click", () => {
    cy.get('[aria-label="settings"]').click();

    cy.get("@dialogContainer")
      .should("be.visible")
      .children("div")
      .should("have.attr", "role")
      .and(attr => {
        expect(attr).to.equal("dialog");
      });
  });
});

describe("Settings Panel Functionality", () => {
  beforeEach(() => {
    // From here, Set state or access settings programmatically, rather than through UI
    // Save UI testing for the specific it block below.
    cy.get('[aria-label="settings"]').click();
  });

  describe("Panel Labels/Elements", () => {
    it("contains description text and elements", () => {
      cy.get("#alert-dialog-title")
        .children("h2")
        .should("contain", "Settings");

      cy.get("@closeButton")
        .should("be.visible")
        .children("span")
        .should("contain", "Close");

      // expect >= 3 Expansion Panels
      cy.get(".MuiExpansionPanelSummary-content").then(elements => {
        expect(elements.length).to.be.gte(3);
      });

      // expect >= 3 Expansion Icon Buttons
      cy.get(
        ".MuiButtonBase-root.MuiIconButton-root.MuiExpansionPanelSummary-expandIcon"
      ).then(elements => {
        expect(elements.length).to.be.gte(3);
      });
    });
  });

  it("should close the panel when button is clicked", () => {
    cy.get("@dialogContainer").should("be.visible");
    cy.get("@closeButton").click();

    cy.get("@dialogContainer").should("not.be.visible");
  });

  it("should close the panel when area outside dialog is clicked", () => {
    cy.get("@dialogContainer").should("be.visible");
    cy.get("@dialogContainer").click("topRight");
    cy.get("@dialogContainer").should("not.be.visible");
  });
});

describe("Input Fields", () => {});

describe("Form Submission", () => {
  it("should update username", () => {});
});
