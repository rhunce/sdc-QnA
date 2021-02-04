const formatObject = (objectToReformat, resultsCount) => {
  for (let i = 0; i < objectToReformat.results; i++) {
    if (objectToReformat.results[i].reported) {
      objectToReformat.results.splice(i, 1);
      i--;
    }
  }
  let currentResults = objectToReformat.results.slice(0, resultsCount);
  let reformattedResults = [];
  for (let i = 0; i < currentResults.length; i++) {
    console.log(`${i}`, currentResults[i]);
    let currentQuestion = currentResults[i];
    formattedAnswers = {};
    for (let j = 0; j < currentResults[i].answers.length; j++) {
      let currentAnswer = currentResults[i].answers[j];
      let currentAnswerId = currentResults[i].answers[j].id;
      formattedAnswers[currentAnswerId] = currentAnswer;
    }
    delete currentQuestion.answers;
    currentQuestion.answers = formattedAnswers;
    reformattedResults.push(currentQuestion);
  }
  delete objectToReformat.results;
  objectToReformat.results = reformattedResults;
  return objectToReformat;
};

module.exports = {
  formatObject
};