import React from 'react';
import ProgressBar from '@ramonak/react-progress-bar';

const StarBar = ({ star, starBarValue, ratingsFilter, handleRatingsFilter }) => {
  return (
    <div id='starBarContainer'
      onClick={() => handleRatingsFilter(star)}
      style={ratingsFilter[star] === true ? {backgroundColor: 'rgba(38, 223, 240, 0.712)'} : {backgroundColor: 'transparent'}}
    >
      <div id='starText'>{`${star} stars`}</div>
      <div id='starBar'>
        <ProgressBar
          completed={starBarValue}
          labelSize='0px'
          borderRadius='0'
          bgcolor='rgb(0, 194, 129)'
          baseBgColor='rgb(200, 200, 200)'
          height='10px' />
      </div>
    </div>
  );
};

export default StarBar;