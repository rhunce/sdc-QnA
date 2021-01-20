import React from 'react';

const StyleSelector = ({ currentStyleList, currentStyle, styleChange }) => (
  <div className='style-selector'>
    <div className='style-name answerBody'>
      <b className='questionBody'>STYLE &gt;</b> {currentStyle.name}
    </div>
    {currentStyleList.map((style, i) => (
      <button
        onClick={styleChange}
        className='thumbnail thumb-round'
        key={style.style_id}
        value={JSON.stringify(style)}
        style={{
          backgroundImage: `url(${style.photos[0].thumbnail_url})`,
        }}
      >
        {style.style_id === currentStyle.style_id ? (
          <svg
            // xmlns='http://www.w3.org/2000/svg'
            // width='16'
            // height='16'
            fill='currentColor'
            className='bi bi-check-circle check'
            viewBox='0 0 16 16'
          >
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
            <path d='M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z' />
          </svg>
        ) : null}
      </button>
    ))}
  </div>
);

export default StyleSelector;