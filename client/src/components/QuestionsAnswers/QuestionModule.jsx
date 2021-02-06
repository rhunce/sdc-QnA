import React from 'react';
import searchEngine from '../../lib/searchEngine.js';
import SearchBar from './SearchBar.jsx';
import QuestionList from './QuestionList.jsx';
import axios from 'axios';

class QuestionModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  componentDidMount() {
    // searchEngine.get('qa/questions', {product_id: 11001})
    axios.get('qa/questions', { params: {product_id: 11001} })
      .then(response => {
        console.log('response: ', response);
        this.setState({questions: response.data.results});
      });
  }

  render() {
    return (
      <div id="questionModule">
        <h2>QUESTIONS & ANSWERS</h2>
        <SearchBar />
        <QuestionList questions={this.state.questions} />
        <button>MORE ANSWERED QUESTIONS</button><button>ADD A QUESTION +</button>
      </div>
    );
  }
}

export default QuestionModule;