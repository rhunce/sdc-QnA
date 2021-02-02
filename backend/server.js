const express = require('express');
const path = require('path');
const { getQuestionsForProduct, getAnswersForQuestion, getLastQuestionNumber, submitQuestiontoPAQAAWPCollection, submitQuestiontoQAAWPCollection } = require('./database');
const { formatObject } = require('./utils.js');

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../client/dist/index.html')));

// ROUTES
app.get('/qa/questions', (req, res) => {
  const product_id = req.query.product_id;
  const page = req.query.page; // Don't know what this is for and how it's to be used
  const count = req.query.count;
  getQuestionsForProduct(product_id, page, count)
    .then((productQuestions) => {
      let reformattedproductQuestions = formatObject(productQuestions[0], count);
      res.status(200);
      res.send(reformattedproductQuestions);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  const question_id = req.params.question_id;
  const page = req.query.page; // Don't know what this is for and how it's to be used
  const count = req.query.count;
  getAnswersForQuestion(question_id, page, count)
    .then((questionAnswers) => {
      res.status(200);
      res.send(questionAnswers);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post('/qa/questions', (req, res) => {
  getLastQuestionNumber()
    .then((lastQuestion) => {
      const product_id = req.body.product_id;
      const question_body = req.body.body;
      const questioner_name = req.body.name;
      const questioner_email = req.body.email;
      const question_id = parseInt(lastQuestion + 1);
      let questionSubmissionToPAQAAWPCollection = submitQuestiontoPAQAAWPCollection(product_id, question_body, questioner_name, questioner_email, question_id);
      let questionSubmissionToQAAWPCollection = submitQuestiontoQAAWPCollection(product_id, question_body, questioner_name, questioner_email, question_id);
      Promise.all([questionSubmissionToPAQAAWPCollection, questionSubmissionToQAAWPCollection])
        .then(() => {
          res.sendStatus(201);
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
});

// ********* START HERE !!!! *********
  // Route to handle POST request to qa/questions/:questions_id/answers
// Posts an answer to a question
// body params
  // body text
  // name text
  // email text
  // photos [text]
// Response: Status: 201 CREATED
app.post('/qa/questions/:questions_id/answers', (req, res) => {
  const answer_body = req.body.body;
  const answerer_name = req.body.name;
  const answerer_email = req.body.email;
  const answer_photos = req.body.photos;
  // save answer in database
  res.sendStatus(201);
});

// Route to handle PUT request to qa/questions/:question_id/helpful
// Marks questions as helpful
// Response: Status: 204 NO CONTENT
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  // mark question as helpful in database
  res.sendStatus(204);
});

// Don't think this app has this route
app.put('/qa/questions/:question_id/report', (req, res) => {
  // report question as helpful in database
  res.sendStatus(204);
});

// Route to handle PUT request to qa/answers/:answer_id/helpful
// Marks answer as helpful
// Response: Status: 204 NO CONTENT
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  // mark answer as helpful in database
  res.sendStatus(204);
});

// Route to handle PUT request to qa/answers/:answer_id/report
// Reports an answer
// Response: Status: 204 NO CONTENT
app.put('/qa/answers/:answer_id/report', (req, res) => {
  // report answer in database
  res.send(req.params);
  res.status(204);
  console.log('IT WORKED!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port: ', PORT);
});