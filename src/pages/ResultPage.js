import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, totalQuestions, timeTaken } = location.state;

  const handleReturnToTop = () => {
    navigate('/top');
  };

  return (
    <div className="result-container">
      <h1>結果発表</h1>
      <p>正解数: {correctAnswers} / {totalQuestions}</p>
      <p>所要時間: {timeTaken}</p>
      <button onClick={handleReturnToTop}>トップページへ</button>
    </div>
  );
};

export default ResultPage;