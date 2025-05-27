// index.js  — initial skeleton (CommonJS)
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 5000;

// View engine & static files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));   // so we can read form data later

app.get('/', (req, res) => {
  res.render('index'); 
});

app.get('/courses', (req, res) => {
  res.render('courses');
});

app.get('/instructors', (req, res) => {
  res.render('instructors');
});

app.get('/schedule', (req, res) => {
  res.render('schedule');
});


// Start the server
app.listen(PORT, () =>
  console.log(`✓ Server running on http://localhost:${PORT}`)
);



