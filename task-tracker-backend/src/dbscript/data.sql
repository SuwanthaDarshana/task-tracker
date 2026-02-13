-- Insert Sample User (email: admin@example.com, password: password123)
INSERT INTO users (email, password)
VALUES ('admin@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqQ3a');

-- Insert Sample Tasks for the above user
INSERT INTO tasks (title, description, status, due_date, user_id)
VALUES
('Setup Backend', 'Complete Spring Boot API logic', 'DONE', NOW(), 1),
('Design Frontend', 'Create React components with Tailwind', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 2 DAY), 1),
('Submit Assignment', 'Push code to GitHub and record demo', 'TODO', DATE_ADD(NOW(), INTERVAL 5 DAY), 1);