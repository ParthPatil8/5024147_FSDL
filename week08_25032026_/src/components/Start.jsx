import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Start = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      navigate('/quiz', { state: { name } });
    }
  };

  return (
    <div className="start">
      <h1>Welcome to the Quiz App</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Start Quiz</button>
      </form>
    </div>
  );
};

export default Start;