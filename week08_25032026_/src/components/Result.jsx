import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, score, total } = location.state || { name: 'Player', score: 0, total: 5 };

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="result">
      <h1>Quiz Result</h1>
      <h2>{name}</h2>
      <p>Your final score: {score} / {total}</p>
      <p>{score >= total / 2 ? 'Well done!' : 'Better luck next time!'}</p>
      <button onClick={handleRestart}>Take Quiz Again</button>
    </div>
  );
};

export default Result;