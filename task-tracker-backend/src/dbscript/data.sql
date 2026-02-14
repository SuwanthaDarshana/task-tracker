-- Insert Sample User (email: admin@example.com, password123: )
INSERT INTO users (email, password)
VALUES ('admin@example.com', '$2a$10$nk.Uvwpv7Jn.pzQHJmu.zO/6N67vtok4UcgHp17DjZA4gzMUTa9Q.');

-- Insert Sample Tasks for the above user
INSERT INTO tasks (title, description, status, due_date, user_id)
VALUES
('Setup Backend', 'Complete Spring Boot API logic', 'DONE', DATE_SUB(NOW(), INTERVAL 3 DAY), 1),
('Design Frontend', 'Create React components with Tailwind CSS', 'DONE', DATE_SUB(NOW(), INTERVAL 1 DAY), 1),
('Configure Database', 'Set up MySQL schema and seed data', 'DONE', DATE_SUB(NOW(), INTERVAL 2 DAY), 1),
('Implement JWT Auth', 'Add login and registration with JWT tokens', 'DONE', NOW(), 1),
('Write API Tests', 'Create unit tests for service layer', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 2 DAY), 1),
('Build Dashboard UI', 'Implement task cards, filters, and pagination', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 3 DAY), 1),
('Add Search Feature', 'Enable search by title and description', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 4 DAY), 1),
('Setup Swagger Docs', 'Configure OpenAPI documentation for all endpoints', 'TODO', DATE_ADD(NOW(), INTERVAL 5 DAY), 1),
('Deploy to Server', 'Dockerize and deploy the application', 'TODO', DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
('Submit Assignment', 'Push code to GitHub and record demo', 'TODO', DATE_ADD(NOW(), INTERVAL 8 DAY), 1),
('Code Review', 'Review codebase for best practices and clean up', 'TODO', DATE_ADD(NOW(), INTERVAL 6 DAY), 1),
('Create README', 'Write project documentation with setup instructions', 'TODO', DATE_ADD(NOW(), INTERVAL 9 DAY), 1);