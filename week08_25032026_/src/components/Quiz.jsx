import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Question from './Question';

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars"
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4"
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"],
    answer: "Harper Lee"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific"
  }
];

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name || 'Player';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const questionRef = useRef(null);

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.focus();
    }
  }, [currentQuestion]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    setSelectedAnswer('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleFinish = () => {
    navigate('/result', { state: { name, score, total: questions.length } });
  };

  if (showResult) {
    return (
      <div className="quiz">
        <h2>Quiz Completed!</h2>
        <p>{name}, your score is {score} out of {questions.length}</p>
        <button onClick={handleFinish}>View Result</button>
      </div>
    );
  }

  return (
    <div className="quiz" ref={questionRef} tabIndex={-1}>
      <h1>Quiz for {name}</h1>
      <Question
        question={questions[currentQuestion]}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
      />
      <button onClick={handleNext} disabled={!selectedAnswer}>
        {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
      </button>
    </div>
  );
};

export default Quiz;