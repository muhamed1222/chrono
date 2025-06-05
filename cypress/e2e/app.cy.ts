describe('Authentication and posting', () => {
  it('registers a new user', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Зарегистрироваться').click();
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.contains('Зарегистрироваться').click();
  });

  it('logs in', () => {
    cy.visit('http://localhost:5173');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.contains('Войти').click();
  });

  it('creates a post', () => {
    cy.login('test@example.com', 'password123');
    cy.contains('Новая публикация').click();
    cy.get('textarea').type('Hello world');
    cy.contains('Запланировать').click();
  });
});
