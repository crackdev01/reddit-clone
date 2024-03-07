describe("template spec", () => {
  it("root page", () => {
    cy.visit("/", {
      failOnStatusCode: false,
    });
    cy.contains("Login");
    cy.contains("Home");
  });
  it("after login", () => {
    cy.session("signed-in", () => {
      cy.signIn();
    });
    cy.visit("/", {
      failOnStatusCode: false,
    });
    cy.contains("My posts");
    cy.contains("Home");
  });
  it("signout", () => {
    cy.session("signed-in", () => {
      cy.signOut();
    });
  });
});
