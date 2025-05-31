/* ---------- schema v3: joins for many-to-many ---------- */

PRAGMA foreign_keys = ON;

/* Main entities */
CREATE TABLE IF NOT EXISTS instructors (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  bio   TEXT,
  photo TEXT                -- image filename in /public/images
);

CREATE TABLE IF NOT EXISTS courses (
  code     TEXT PRIMARY KEY,          -- e.g. "SKL01"
  title    TEXT NOT NULL,
  price    NUMERIC NOT NULL,
  duration TEXT
);

CREATE TABLE IF NOT EXISTS students (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  CHECK (instr(email,'@') > 1)        -- quick email-format guard
);

/* Join table: each instructor can teach up to 2 courses.
   (No need to enforce the “max 2” rule in SQL—we’ll validate in app code.) */
CREATE TABLE IF NOT EXISTS instructor_courses (
  instructor_id INTEGER,
  course_code   TEXT,
  PRIMARY KEY (instructor_id, course_code),
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
  FOREIGN KEY (course_code)   REFERENCES courses(code)   ON DELETE CASCADE
);

/* Join table: students ↔ courses (≥1 row per student). */
CREATE TABLE IF NOT EXISTS enrolments (
  student_id  INTEGER,
  course_code TEXT,
  PRIMARY KEY (student_id, course_code),
  FOREIGN KEY (student_id)  REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE
);
