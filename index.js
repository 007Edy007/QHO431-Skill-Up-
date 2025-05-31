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

app.get('/courses', async (req, res) => {
  const rows = await req.app.locals.db.all(`
    SELECT courses.id,
           courses.title,
           courses.duration,
           instructors.name AS instructor
    FROM   courses
    JOIN   instructors ON instructors.id = courses.instructor_id
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



