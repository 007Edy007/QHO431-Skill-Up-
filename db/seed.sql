-- db/seed.sql
INSERT INTO instructors (name, bio) VALUES
  ('Alice Smith', 'Front-end specialist'),
  ('Bob Jones',   'Database & API tutor');

INSERT INTO courses (title, instructor_id, duration) VALUES
  ('Intro to HTML',   1, '2 weeks'),
  ('Node JS Basics', 2, '3 weeks');
