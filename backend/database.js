const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sdcQandAService', { useNewUrlParser: true, useUnifiedTopology: true });

// SCHEMAS
let questionsAndAnswersWithPhotosSchema = mongoose.Schema({
  question: String,
  results: Array
});
let questionsAndAnswersWithPhotos = mongoose.model('questionsAndAnswersWithPhoto', questionsAndAnswersWithPhotosSchema);

let productsAndQuestionsAndAnswersWithPhotosSchema = mongoose.Schema({
  product_id: String,
  results: Array
});
let productsAndQuestionsAndAnswersWithPhotos = mongoose.model('productsAndQuestionsAndAnswersWithPhoto', productsAndQuestionsAndAnswersWithPhotosSchema);

// ESTABLISHING A CONNECTION
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  console.log('Connected to database!');
});

// FUNCTIONS/DATABASE QUERIES
const getQuestionsForProduct = (product, page, count) => {
  let productStr = `${product}`;
  return productsAndQuestionsAndAnswersWithPhotos.find({product_id: productStr}).exec();
};

const getAnswersForQuestion = (question, page, count) => {
  return questionsAndAnswersWithPhotos.find({question: `${question}`}).exec();
};

const getLastQuestionNumber = () => {
  return questionsAndAnswersWithPhotos.countDocuments().exec();
};

const submitQuestiontoPAQAAWPCollection = (productId, questionBody, questionerName, questionerEmail, questionId) => {
  let newDocument = {
    product_id: productId,
    asker_name: questionerName,
    answers: [],
    question_id: questionId,
    question_body: questionBody,
    question_date: JSON.stringify(new Date()).slice(0, 11),
    question_helpfulness: 0,
    reported: false
  };
  return productsAndQuestionsAndAnswersWithPhotos.updateOne({product_id: productId}, {$push: {results: newDocument}}).exec();
};

const submitQuestiontoQAAWPCollection = (productId, questionBody, questionerName, questionerEmail, questionId) => {
  let newDocument = { question: `${questionId}`, results: [] };
  return questionsAndAnswersWithPhotos.create(newDocument);
};



module.exports = {
  getQuestionsForProduct,
  getAnswersForQuestion,
  getLastQuestionNumber,
  submitQuestiontoPAQAAWPCollection,
  submitQuestiontoQAAWPCollection
};