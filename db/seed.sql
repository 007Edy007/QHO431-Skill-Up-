/* ---------- fresh seed (v3) ---------- */

/* Wipe any old demo data (safe if tables are empty) */
DELETE FROM enrolments;
DELETE FROM instructor_courses;
DELETE FROM students;
DELETE FROM courses;
DELETE FROM instructors;

/* ----- instructors (4) ----- */
INSERT INTO instructors (name, bio, photo) VALUES
  ('Alice Smith',  'Front-end specialist',        'alice.jpg'),
  ('Bob Jones',    'Database & API tutor',        'bob.jpg'),
  ('Carla Nguyen', 'JavaScript & UX mentor',      'carla.jpg'),
  ('Dinesh Patel', 'Full-stack problem-solver',   'dinesh.jpg');

/* ----- courses (5) ----- */
INSERT INTO courses (code, title, price, duration) VALUES
  ('SKL01', 'Intro to HTML',          49.00, '2 weeks'),
  ('SKL02', 'CSS Layout Mastery',     59.00, '2 weeks'),
  ('SKL03', 'JavaScript Essentials',  79.00, '3 weeks'),
  ('SKL04', 'Node.js Basics',         89.00, '3 weeks'),
  ('SKL05', 'Full-stack Project',    129.00, '4 weeks');

/* ----- instructor ↔ course pairings (each instructor teaches exactly 2 courses) ----- */
INSERT INTO instructor_courses (instructor_id, course_code) VALUES
  (1, 'SKL01'), (1, 'SKL02'),
  (2, 'SKL04'), (2, 'SKL05'),
  (3, 'SKL02'), (3, 'SKL03'),
  (4, 'SKL04'), (4, 'SKL05');
