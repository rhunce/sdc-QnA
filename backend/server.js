const express = require('express');
const path = require('path');
const db = require('./database');
const utils = require('./utils.js');

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../client/dist/index.html')));

// ROUTES
app.get('/qa/questions', (req, res) => {
  const product_id = req.query.product_id;
  const page = req.query.page; // Don't know what this is for and how it's to be used
  const count = req.query.count;
  db.getQuestionsForProduct(product_id, page, count)
    .then((productQuestions) => {
      let reformattedproductQuestions = utils.formatObject(productQuestions[0], count);
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
  db.getAnswersForQuestion(question_id, page, count)
    .then((questionAnswers) => {
      res.status(200);
      res.send(questionAnswers);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post('/qa/questions', (req, res) => {
  db.getLastQuestionNumber()
    .then((lastQuestion) => {
      const product_id = req.body.product_id;
      const question_body = req.body.body;
      const questioner_name = req.body.name;
      const questioner_email = req.body.email;
      const question_id = parseInt(lastQuestion + 1);
      const date_written = JSON.stringify(new Date()).slice(1, 11);
      let questionSubmissionToPAQAAWPCollection = db.submitQuestiontoPAQAAWPCollection(product_id, question_body, questioner_name, questioner_email, question_id);
      let questionSubmissionToQAAWPCollection = db.submitQuestiontoQAAWPCollection(product_id, question_body, questioner_name, questioner_email, question_id);
      let questionSubmissionToQuestionsCollection = db.submitQuestiontoQuestionsCollection(product_id, question_body, date_written, questioner_name, questioner_email, question_id);
      Promise.all([questionSubmissionToPAQAAWPCollection, questionSubmissionToQAAWPCollection, questionSubmissionToQuestionsCollection])
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

app.post('/qa/questions/:question_id/answers', (req, res) => {
  const question_id = req.params.question_id;
  let lastAnswer = db.getLastAnswerNumber();
  let questionData = db.getQuestionData(question_id);
  Promise.all([lastAnswer, questionData])
    .then((values) => {
      const answer_id = values[0] + 1;
      const product_id = values[1][0].product_id;
      const question_id = req.params.question_id;
      const answer_body = req.body.body;
      const answerer_name = req.body.name;
      const answerer_email = req.body.email;
      const answer_photos = req.body.photos;
      const date_written = JSON.stringify(new Date()).slice(1, 11);

      // find product for question
      db.findProductForQuestion(product_id)
        .then((result) => {
          const newAnswer = {
            question_id,
            body: answer_body,
            answerer_name,
            date: date_written,
            helpfulness: 0,
            photos: answer_photos,
            id: answer_id
          };
          const document = result[0];
          for (let i = 0; i < document.results.length; i++) {
            if (document.results[i].question_id === parseInt(question_id)) {
              document.results[i].answers.push(newAnswer);
              break;
            }
          }
          // save answer in answers database
          let answerSubmissionToAnswersCollection = db.saveAnswerInAnswersCollection(question_id, answer_body, answerer_name, answerer_email, answer_id, date_written);

          // save answer in QAAWP database
          let answerSubmissionToQAAWPCollection = db.saveAnswerInQAAWPCollection(question_id, answer_body, answerer_name, answerer_email, answer_photos, answer_id, date_written);

          // save answer in PWQAAWP database
          let answerSubmissionToPAQAAWPCollection = db.saveAnswerInPAQAAWPCollection(product_id, document);

          Promise.all([answerSubmissionToAnswersCollection, answerSubmissionToQAAWPCollection, answerSubmissionToPAQAAWPCollection])
            .then((values) => {
              res.sendStatus(201);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });

});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  const question_id = req.params.question_id;
  db.getQuestionData(question_id)
    .then((questionData) => {
      const product_id = questionData[0].product_id;
      db.findProductForQuestion(product_id)
        .then((result) => {
          const document = result[0];
          for (let i = 0; i < document.results.length; i++) {
            if (document.results[i].question_id === parseInt(question_id)) {
              document.results[i].question_helpfulness++;
              break;
            }
          }
          let questionMarkedHelpfulInPAQAAWPCollection = db.markQuestionHelpfulInPAQAAWPCollection(product_id, document);
          let questionMarkedHelpfulInQuestionsCollection = db.markQuestionHelpfulInQuestionsCollection(question_id);
          Promise.all([questionMarkedHelpfulInPAQAAWPCollection, questionMarkedHelpfulInQuestionsCollection])
            .then((values) => {
              res.sendStatus(204);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  const question_id = req.params.question_id;
  let questionReported = db.reportQuestion(question_id);
  let productWithQuestion = db.getQuestionData(question_id)
  .then((questionData) => {
    const product_id = questionData[0].product_id;
    return db.findProductForQuestion(product_id);
  })
  .catch((err) => {
    console.error(err);
  });
  Promise.all([questionReported, productWithQuestion])
    .then((values) => {
      let product_id = values[1][0].product_id;
      let document = values[1][0];
      for (let i = 0; i < document.results.length; i++) {
        if (document.results[i].question_id === parseInt(question_id)) {
          document.results[i].reported = true;
          break;
        }
      }
      db.reportQuestionInPAQAAWPCollection(product_id, document)
        .then(() => {
          res.sendStatus(204);
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  const answer_id = req.params.answer_id;
  db.findAnswerInAnswersCollection(answer_id)
    .then((answer) => {
      const question_id = answer[0].question_id;
      db.markAnswerAsHelpfulInAnswersCollection(answer_id)
        .then(()=> {
          db.findProductIDForQuestion(question_id)
            .then((question) => {
              const product_id = question[0].product_id;
              db.findQuestionInQAAWPCollection(question_id)
                .then((question) => {
                  let document = question[0];
                  for (let i = 0; i < document.results.length; i++) {
                    if (document.results[i].answer_id === parseInt(answer_id)) {
                      document.results[i].helpfulness++;
                      break;
                    }
                  }
                  db.markAnswerHelpfulInQAAWPCollection(question_id, document)
                    .then(() => {
                      db.findProductForQuestion(product_id)
                        .then((product) => {
                          let answerUpdated = false;
                          let document = product[0];
                          for (let i = 0; i < document.results.length; i++) {
                            if (document.results[i].question_id === parseInt(question_id)) {
                              for (let j = 0; j < document.results[i].answers.length; j++) {
                                if (document.results[i].answers[j].id === `${answer_id}`) {
                                  document.results[i].answers[j].helpfulness++;
                                  answerUpdated = true;
                                  break;
                                }
                              }
                            }
                            if (answerUpdated) {
                              break;
                            }
                          }
                          db.markQuestionHelpfulInPAQAAWPCollection(product_id, document)
                            .then(() => {
                              res.sendStatus(204);
                            })
                            .catch((err) => {
                              console.error(err);
                            });
                        })
                        .catch((err) => {
                          console.error(err);
                        });
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
});

// Route to handle PUT request to qa/answers/:answer_id/report
// Reports an answer
// Response: Status: 204 NO CONTENT
app.put('/qa/answers/:answer_id/report', (req, res) => {
  const answer_id = req.params.answer_id;
  console.log('answer_id: ', answer_id);
  // mark answer as reported in Answers Collection

  // also get question_id while there
  // use question_id to find question in QAAWP Collection
  // iterate over the results and find answer using answer_id
  // remove answer for results array
  // use question_id to find product_id in Questions Collection
  // Use product_id to finf product in PAQAAWP Collection
  // iterate over results array and find question using question_id
  // in that question, iterate over answers array to find answer using answer_id
  // remove that answer from array
  // break out of both loops
  // res.send(204)
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port: ', PORT);
});