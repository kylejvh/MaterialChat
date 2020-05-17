// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add(
  "login",
  (
    email = Cypress.env("email"),
    password = Cypress.env("password"),
    redirect = true,
    failOnStatusCode = true
  ) => {
    cy.request({
      method: "POST",
      url: "/api/v1/users/login",
      body: {
        email,
        password,
      },
      failOnStatusCode,
    }).then(res => {
      if (res.status === 401) {
        return;
      }
      window.localStorage.setItem("token", res.body.token);
      window.localStorage.setItem("id", res.body.data.user._id);
    });

    if (redirect) {
      cy.visit("/");
    }
  }
);

Cypress.Commands.add("cleanUserFromDB", (email, password) => {
  // Backend delete route is protected.
  // Requires authorized user - if user doesn't need to be cleaned and
  // status === 401, just return.
  cy.login(email, password, false, false).then(res => {
    if (res.status === 401) {
      return;
    } else {
      const id = window.localStorage.getItem("id");
      cy.request({
        method: "DELETE",
        url: `/api/v1/users/${id}`,
        body: {
          email,
        },
      }).then(() => cy.clearLocalStorage());
    }
  });
});
