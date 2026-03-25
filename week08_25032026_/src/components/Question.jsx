import { useState } from 'react';

const Question = ({ question, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className="question">
      <h2>{question.question}</h2>
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => onAnswerSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;