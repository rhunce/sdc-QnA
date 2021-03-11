const express = require('express');
const qa_questions = require('./routes/qa-questions.js');
const qa_answers = require('./routes/qa-answers.js');

// const path = require('path');

// Initialize app
let app = express();
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
app.use('/qa/questions', qa_questions);
app.use('/qa/answers', qa_answers);

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});