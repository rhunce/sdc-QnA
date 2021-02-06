// import searchAPI from '../../lib/searchEngine.js';
import axios from 'axios';

const handleHelpfulAnswer = (answer_id) => {
  // return searchAPI.put(`qa/answers/${answer_id}/helpful`)
  return axios.put(`qa/answers/${answer_id}/helpful`)
    .then((data) => {
      console.log('Answer marked as helpful', data);
    })
    .catch(err => console.error('Unable to mark answer as helpful', err));
};

export default handleHelpfulAnswer;