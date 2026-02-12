-- Insert Sample User (Password is 'password123' - you should bcrypt this in the app)
INSERT INTO users (username, password, role)
VALUES ('admin', '$2a$10$8.UnVuG9HHgffUDAlk8Kn.2NvS.C.Kz7eKCQJ/vB27k5D8nInxG/O', 'ROLE_USER');

-- Insert Initial Tasks [cite: 34]
INSERT INTO tasks (title, description, status, due_date, user_id) VALUES
('Setup Project Architecture', 'Initialize Spring Boot and React projects.', 'DONE', '2026-02-15 10:00:00', 1),
('Implement JWT Auth', 'Secure the backend with simple login.', 'IN_PROGRESS', '2026-02-16 17:00:00', 1),
('Design Task Dashboard', 'Create the React UI with Tailwind CSS.', 'TODO', '2026-02-18 09:00:00', 1);