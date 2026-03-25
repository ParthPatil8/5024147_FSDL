import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './components/Start';
import Quiz from './components/Quiz';
import Result from './components/Result';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
