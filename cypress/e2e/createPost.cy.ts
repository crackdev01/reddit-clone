describe("template spec", () => {
  beforeEach(() => {
    cy.session("signed-in", () => {
      cy.signIn();
    });
    cy.visit("/", {
      failOnStatusCode: false,
    });
  });
  it("root page", () => {
    cy.get("[data-test-id='title']").should("exist");
    cy.get("[data-test-id='content']").should("exist");
    cy.get("[data-test-id='post-submit']").should("exist");

    cy.get("[data-test-id='title']").type("Test Title");
    cy.get("[data-test-id='content']").type("Test Content");
    cy.get("[data-test-id='post-submit']").click();
    cy.get("[data-test-id='post-list']").contains("Test Title");
    cy.get("[data-test-id='post-list']").contains("Test Content");
  });
});
