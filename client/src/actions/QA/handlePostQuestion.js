// import searchAPI from '../../lib/searchEngine.js';
import axios from 'axios';

const handlePostQuestion = (data) => {
  // return searchAPI.post('qa/questions', data)
  return axios.post('qa/questions', data)
    .then((data) => {
      console.log('Question submitted', data);
    })
    .catch(err => console.error('Unable to submit question', err));
};

export default handlePostQuestion;