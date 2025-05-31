// index.js  — initial skeleton (CommonJS)
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 5000;

const sqlite3 = require('sqlite3').verbose();
const fs       = require('fs');
const { open } = require('sqlite');


// View engine & static files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));   // so we can read form data later

app.get('/', (req, res) => {
  res.render('index'); 
});

// Show all courses with the instructor(s) who teach them
app.get('/courses', async (req, res) => {
  const rows = await req.app.locals.db.all(`
    SELECT  c.code,
            c.title,
            c.duration,
            c.price,
            GROUP_CONCAT(i.name, ', ') AS instructors
    FROM    courses           AS c
    LEFT    JOIN instructor_courses AS ic ON ic.course_code = c.code
    LEFT    JOIN instructors        AS i  ON i.id = ic.instructor_id
    GROUP   BY c.code, c.title, c.duration, c.price
    ORDER   BY c.code
  `);

  res.render('courses', { courses: rows });
});


app.get('/instructors', async (req, res) => {
  const rows = await req.app.locals.db.all('SELECT * FROM instructors');
  res.render('instructors', { instructors: rows });
});


app.get('/schedule', (req, res) => {
  res.render('schedule');
});

app.get('/faq', (req, res) => {
  res.render('faq');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

// Show registration form with live course list
app.get('/register', async (req, res) => {
  const courses = await req.app.locals.db.all('SELECT * FROM courses ORDER BY code');
  res.render('register', { courses });
});

// Handle registration form submit
app.post('/register', async (req, res) => {
  const { name, email, phone } = req.body;
  const courseCodes = Array.isArray(req.body.courses) ? req.body.courses : [];

  // ---- basic validation ---------------------------------------------------
  if (!name || !email || courseCodes.length === 0) {
    return res.status(400).send('Name, email and at least one course are required.');
  }

  // crude email format check (reinforces the HTML5 pattern)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send('Invalid email format.');
  }

  // ---- transaction: insert student then enrolments -----------------------
  const db = req.app.locals.db;
  await db.exec('BEGIN');

  try {
    // 1) insert student
    const result = await db.run(
      'INSERT INTO students (name, email, phone) VALUES (?,?,?)',
      [name, email, phone]
    );
    const studentId = result.lastID;      // autoincrement id

    // 2) insert each chosen course in enrolments
    const stmt = await db.prepare(
      'INSERT INTO enrolments (student_id, course_code) VALUES (?,?)'
    );
    for (const code of courseCodes) {
      await stmt.run(studentId, code);
    }
    await stmt.finalize();

    await db.exec('COMMIT');
    res.send(`Thank you, ${name}! Your registration ID is ${studentId}.`);
  } catch (err) {
    await db.exec('ROLLBACK');
    console.error(err);
    res.status(500).send('Sorry—registration failed. Please try again.');
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // simple field-check
  if (!name || !email || !message) {
    return res.status(400).send('All fields are required');
  }

  // insert into the DB
  await req.app.locals.db.run(
    'INSERT INTO contact_queries (name, email, message) VALUES (?,?,?)',
    [name, email, message]
  );

  // quick confirmation page (we’ll prettify later)
  res.send('Thank you! Your message has been received.');
});


/* -------- SQLite: create/open and auto-seed on first run -------- */
(async () => {
  const dbPath = path.join(__dirname, 'db', 'database.sqlite');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 1  Run schema every time (CREATE TABLE IF NOT EXISTS is safe).
  const schemaSql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
  await db.exec(schemaSql);

  // 2  If no instructors yet, run seed.sql once.
  const { count } = await db.get('SELECT COUNT(*) AS count FROM instructor_courses');
  if (count === 0) {
    const seedSql = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
    await db.exec(seedSql);
    console.log('✓ Database seeded with starter data');
  }

  // Make the db accessible in routes.
  app.locals.db = db;
})();


// Start the server
app.listen(PORT, () =>
  console.log(`✓ Server running on http://localhost:${PORT}`)
);



