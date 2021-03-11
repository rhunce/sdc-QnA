const mongoose = require('mongoose');
const db = require('../index.js');

let productsAndQuestionsAndAnswersWithPhotosSchema = mongoose.Schema({
  product_id: String,
  results: Array
});
let productsAndQuestionsAndAnswersWithPhotos = mongoose.model('productsAndQuestionsAndAnswersWithPhoto', productsAndQuestionsAndAnswersWithPhotosSchema);

let methods = {
  getQuestionsForProduct: (product, page, count) => {
    let productStr = `${product}`;
    return productsAndQuestionsAndAnswersWithPhotos.find({product_id: productStr}).exec();
  }
};

module.exports = productsAndQuestionsAndAnswersWithPhotos;
module.exports = methods;