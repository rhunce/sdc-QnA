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

let answersSchema = mongoose.Schema({
  id: Number,
  question_id: Number,
  body: String,
  date_written: String,
  answerer_name: String,
  answerer_email: String,
  reported: Number,
  helpful: Number
});
let answers = mongoose.model('answer', answersSchema);

let questionsSchema = mongoose.Schema({
  id: Number,
  product_id: Number,
  body: String,
  date_written: String,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number
});
let questions = mongoose.model('question', questionsSchema);

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

const submitQuestiontoQuestionsCollection = (productId, questionBody, dateWritten, questionerName, questionerEmail, questionId) => {
  let newDocument = {
    id: parseInt(questionId),
    product_id: parseInt(productId),
    body: questionBody,
    date_written: dateWritten,
    asker_name: questionerName,
    asker_email: questionerEmail,
    reported: 0,
    helpful: 0
  };
  return questions.create(newDocument);
};

const getLastAnswerNumber = () => {
  return answers.countDocuments().exec();
};

const getQuestionData = (questionId) => {
  return questions.find({id: questionId}).exec();
};

const saveAnswerInQAAWPCollection = (questionId, answerBody, answererName, answererEmail, answerPhotos, answerId, dateWritten) => {
  let newDocument = {
    question_id: questionId,
    body: answerBody,
    answerer_name: answererName,
    date: dateWritten,
    helpfulness: 0,
    photos: [],
    answer_id: answerId
  };
  return questionsAndAnswersWithPhotos.updateOne({ question: `${questionId}`}, {$push: {results: newDocument}}).exec();
};

const saveAnswerInAnswersCollection = (questionId, answerBody, answererName, answererEmail, answerId, dateWritten) => {
  const newDocument = {
    id: answerId,
    question_id: questionId,
    body: answerBody,
    date_written: dateWritten,
    answerer_name: answererName,
    answerer_email: answererEmail,
    reported: 0,
    helpful: 0
  };
  return answers.create(newDocument);
};

const saveAnswerInPAQAAWPCollection = (productId, updatedDocument) => {
  return productsAndQuestionsAndAnswersWithPhotos.updateOne({ product_id: `${productId}` }, updatedDocument).exec();
};

const findProductForQuestion = (productId) => {
  return productsAndQuestionsAndAnswersWithPhotos.find({product_id: `${productId}`});
};

const markQuestionHelpfulInQuestionsCollection = (questionId) => {
  return questions.findOneAndUpdate({id: parseInt(questionId)}, { $inc: { helpful: 1 } }, { useFindAndModify: false }).exec();
};

const markQuestionHelpfulInPAQAAWPCollection = (productId, updatedDocument) => {
  return productsAndQuestionsAndAnswersWithPhotos.updateOne({ product_id: `${productId}` }, updatedDocument).exec();
};

module.exports = {
  getQuestionsForProduct,
  getAnswersForQuestion,
  getLastQuestionNumber,
  submitQuestiontoPAQAAWPCollection,
  submitQuestiontoQAAWPCollection,
  saveAnswerInQAAWPCollection,
  getLastAnswerNumber,
  saveAnswerInAnswersCollection,
  getQuestionData,
  saveAnswerInPAQAAWPCollection,
  findProductForQuestion,
  submitQuestiontoQuestionsCollection,
  markQuestionHelpfulInQuestionsCollection,
  markQuestionHelpfulInPAQAAWPCollection
};