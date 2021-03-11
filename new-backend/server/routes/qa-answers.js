const router = require('express').Router();

// mark answer as helpful
router.put('/:answer_id/helpful', (req, res) => {
  const answer_id = req.params.answer_id;
  db.findAnswerInAnswersCollection(answer_id)
    .then((answer) => {
      const question_id = answer[0].question_id;
      // increments helpfulness of answer by 1
      db.markAnswerAsHelpfulInAnswersCollection(answer_id)
        .then(()=> {
          db.findProductIDForQuestion(question_id)
            .then((question) => {
              const product_id = question[0].product_id;
              // finds question for answer in QAAWP Collection
              db.findQuestionInQAAWPCollection(question_id)
                .then((question) => {
                  let document = question[0];
                  // increments helpfullness of answer by 1
                  for (let i = 0; i < document.results.length; i++) {
                    if (document.results[i].answer_id === parseInt(answer_id)) {
                      document.results[i].helpfulness++;
                      break;
                    }
                  }
                  // update document in QAAWP Collection
                  db.updateDocumentInQAAWPCollection(question_id, document)
                    .then(() => {
                      // Get product from PAQAAWP COllection
                      db.findProductFromProductId(product_id)
                        .then((product) => {
                          let answerUpdated = false;
                          let document = product[0];
                          // find answer in document and increment helpfulness by 1
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
                          // update document in PAQAAWP Collection then let client know when done
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

// report answer
router.put('/:answer_id/report', (req, res) => {
  const answer_id = req.params.answer_id;
  // mark answer as reported in Answers Collection
  db.reportAnswerInAnswersCollection(answer_id)
    .then((record) => {
      const question_id = record.question_id;
      // find question in QAAWP Collection
      db.findQuestionInQAAWPCollection(question_id)
        .then((record) => {
          let document = record[0];
          // remove answer from results array
          for (let i = 0; i < document.results.length; i++) {
            if (document.results[i].answer_id === parseInt(answer_id)) {
              document.results.splice(i, 1);
              break;
            }
          }
          // send updated document to update QAAWP Collection
          db.updateDocumentInQAAWPCollection(question_id, document)
            .then(() => {
              // get product_id for question having reported answer
              db.findProductIDForQuestion(question_id)
                .then((record) => {
                  const product_id = record[0].product_id;
                  // get document having reported answer from PAQAAWP Collection
                  db.findProductFromProductId(product_id)
                    .then((record) => {
                      let document = record[0];
                      // remove the answer
                      for (let i = 0; i < document.results.length; i++) {
                        let answerRemoved = false;
                        if (document.results[i].question_id === parseInt(question_id)) {
                          for (let j = 0; j < document.results[i].answers.length; j++) {
                            if (document.results[i].answers[j].id === parseInt(answer_id)) {
                              document.results[i].answers.splice(j, 1);
                              answerRemoved = true;
                              break;
                            }
                          }
                        }
                        if (answerRemoved) {
                          break;
                        }
                      }
                      // send updated document to update PAQAAWP Collection and let client know when done
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

module.exports = router;