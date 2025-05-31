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

/* ---------- starter FAQs (10 Q&A) ---------- */
INSERT INTO faqs (question, answer) VALUES
  ('What software do I need for the courses?',
   'Just a modern web browser and VS Code (free). We provide setup guides in Week 1.'),

  ('Are the classes live or self-paced?',
   'All core lessons are self-paced videos. Live Q&A sessions run every Thursday.'),

  ('Do I get a certificate after completion?',
   'Yes – complete all quizzes and the capstone project to receive a PDF certificate.'),

  ('How long do I have access to the materials?',
   'Lifetime access. You can revisit videos and slides any time.'),

  ('Can I switch courses after enrolling?',
   'Sure. Email support within the first 7 days and we’ll move you to another course.'),

  ('What payment methods do you accept?',
   'Debit/credit cards and PayPal. Invoices for companies on request.'),

  ('Is there a student discount?',
   'Yes – 25 % off with a valid .edu or .ac email address.'),

  ('Do I need prior coding experience?',
   'No. SKL01 (Intro to HTML) starts from absolute basics.'),

  ('How much time should I budget per week?',
   'Around 3–4 hours of study and 1 hour of practice coding.'),

  ('Can I download the videos?',
   'Streaming only, but slides and code examples are downloadable.');
