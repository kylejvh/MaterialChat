describe("Register", () => {
  const username = "visitor";
  const email = "visitor@email.com";
  const password = "visiting";
  beforeEach(() => {
    cy.cleanUserFromDB(email, password);
    cy.visit("/");
  });

  it("registers new user only", () => {
    cy.contains("Don't have an account?")
      .should("have.attr", "href", "/register")
      .click();

    cy.location("pathname").should("equal", "/register");
    cy.get("input[name=username]").type(username);
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[name=passwordConfirm]").type(password);

    cy.get("form").submit();

    cy.get("[data-test=skipUploadButton]").should("contain", "Skip").click();
    // cy.location("pathname").should("equal", "/");
    // cy.contains("[data-cy=profile]", username).should("be.visible");
  });
});

// have to make a decision on network requests....
