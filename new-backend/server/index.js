const express = require('express');
// const db = require('./database');
// const utils = require('../utils');
const qa_questions = require('./routes/qa-questions.js');
const qa_answers = require('./routes/qa-answers.js');
// const path = require('path');

let app = express();
// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../client/dist')));

// ROUTES
app.use('/qa/questions', qa_questions);
app.use('/qa/answers', qa_answers);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});