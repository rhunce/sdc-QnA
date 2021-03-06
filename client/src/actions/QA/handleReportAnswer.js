// import searchAPI from '../../lib/searchEngine.js';
import axios from 'axios';

const handleReportAnswer = (answer_id) => {
  // return searchAPI.put(`qa/answers/${answer_id}/report`)
  return axios.put(`qa/answers/${answer_id}/report`)
    .then((data) => {
      console.log('Answer reported', data);
    })
    .catch(err => console.error('Unable to mark answer as reported', err));
};

export default handleReportAnswer;