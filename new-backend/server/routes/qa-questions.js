const router = require('express').Router();
const db = require('../../database/index.js');
const utils = require('../utils.js');

// Gets questions for a given product (also has answers and answer photos embedded)
router.get('/', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    const product_id = req.query.product_id;
    const count = req.query.count;
    // Get all the questions for the given product and formats it how the client needs it before sending to client.
    db.getQuestionsForProduct(product_id, count)
      .then((productQuestions) => {
        let reformattedproductQuestions = utils.formatObject(productQuestions[0], count);
        res.status(200);
        res.send(reformattedproductQuestions);
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

// Get all the answers for a given question and sends to client.
router.get('/:question_id/answers', (req, res) => {
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

// Posts question to database
router.post('/', (req, res) => {
  db.getLastQuestionNumber()
    .then((lastQuestion) => {
      // Submitted question info
      const product_id = req.body.product_id;
      const question_body = req.body.body;
      const questioner_name = req.body.name;
      const questioner_email = req.body.email;
      const question_id = lastQuestion.question_count;
      const date_written = JSON.stringify(new Date()).slice(1, 11);
      // Submits question to PAQAAWP collection
      let questionSubmissionToPAQAAWPCollection = db.submitQuestiontoPAQAAWPCollection(product_id, question_body, questioner_name, questioner_email, question_id);
      // Submits question to QAAWP collection
      let questionSubmissionToQAAWPCollection = db.submitQuestiontoQAAWPCollection(product_id, question_body, questioner_name, questioner_email, question_id);
      // Submits question to Questions collection
      let questionSubmissionToQuestionsCollection = db.submitQuestiontoQuestionsCollection(product_id, question_body, date_written, questioner_name, questioner_email, question_id);
      // Let's client know when above accomplished
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

// Posts an answer to a question
router.post('/:question_id/answers', (req, res) => {
  const question_id = req.params.question_id;
  let lastAnswer = db.getAndUpdateAnswerCount();
  let questionData = db.getQuestionData(question_id);
  Promise.all([lastAnswer, questionData])
  .then((values) => {
      // answer info, along with its corresponding question and the question's corresponding product
      const answer_id = values[0].answer_count;
      const product_id = values[1][0].product_id;
      const answer_body = req.body.body;
      const answerer_name = req.body.name;
      const answerer_email = req.body.email;
      const answer_photos = req.body.photos;
      const date_written = JSON.stringify(new Date()).slice(1, 11);

      // find product for question
      db.findProductFromProductId(product_id)
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
          // adds new answer to the record
          for (let i = 0; i < document.results.length; i++) {
            if (document.results[i].question_id === parseInt(question_id)) {
              document.results[i].answers.push(newAnswer);
              break;
            }
          }
          // saves answer in answers database
          let answerSubmissionToAnswersCollection = db.saveAnswerInAnswersCollection(question_id, answer_body, answerer_name, answerer_email, answer_id, date_written);

          // saves answer in QAAWP database
          let answerSubmissionToQAAWPCollection = db.saveAnswerInQAAWPCollection(question_id, answer_body, answerer_name, answerer_email, answer_photos, answer_id, date_written);

          // saves answer in PWQAAWP database
          let answerSubmissionToPAQAAWPCollection = db.saveAnswerInPAQAAWPCollection(product_id, document);

          // Let's client know when above accomplished
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

// Marks a question as helpful
router.put('/:question_id/helpful', (req, res) => {
  const question_id = req.params.question_id;
  // get question record
  db.getQuestionData(question_id)
    .then((questionData) => {
      const product_id = questionData[0].product_id;
      // get product record having question
      db.findProductFromProductId(product_id)
        .then((result) => {
          // find question in retrieved document and increment helpfulness by 1
          const document = result[0];
          for (let i = 0; i < document.results.length; i++) {
            if (document.results[i].question_id === parseInt(question_id)) {
              document.results[i].question_helpfulness++;
              break;
            }
          }
          // updated document in PAQAAWP Collection
          let questionMarkedHelpfulInPAQAAWPCollection = db.updateDocumentInPAQAAWPCollection(product_id, document);
          // marks question helpful in Questions Collection
          let questionMarkedHelpfulInQuestionsCollection = db.markQuestionHelpfulInQuestionsCollection(question_id);
          // Let's client know when above accomplished
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

// Reports question
router.put('/:question_id/report', (req, res) => {
  const question_id = req.params.question_id;
  // Sets report to 1 (for true) in Questions Collection
  let questionReported = db.reportQuestion(question_id);
  // Get product_id from Questions Collection and use to get corresponding product document
  let productWithQuestion = db.getQuestionData(question_id)
  .then((questionData) => {
    const product_id = questionData[0].product_id;
    return db.findProductFromProductId(product_id);
  })
  .catch((err) => {
    console.error(err);
  });
  // When question reported and product document having question retrieved...
  Promise.all([questionReported, productWithQuestion])
    .then((values) => {
      let product_id = values[1][0].product_id;
      let document = values[1][0];
      // ...find question and set reported to true
      for (let i = 0; i < document.results.length; i++) {
        if (document.results[i].question_id === parseInt(question_id)) {
          // document.results[i].reported = true;
          document.results.splice(i, 1); // removes question, as opposed to just marking it as reported
          break;
        }
      }
      // Sends updated document to PAQAAWP Collection and lets client know when done
      db.updateDocumentInPAQAAWPCollection(product_id, document)
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

module.exports = router;