import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import TopPage from './pages/TopPage';
import QuizPage from './pages/QuizPage';  // 次のステップで実装します

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/top" element={<TopPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);