// import searchAPI from '../../lib/searchEngine.js';
import axios from 'axios';

const handleHelpfulQuestion = (question_id) => {
  // return searchAPI.put(`qa/questions/${question_id}/helpful`)
  return axios.put(`qa/questions/${question_id}/helpful`)
    .then((data) => {
      console.log('Question marked as helpful', data);
    })
    .catch(err => console.error('Unable to mark question as helpful', err));
};

export default handleHelpfulQuestion;