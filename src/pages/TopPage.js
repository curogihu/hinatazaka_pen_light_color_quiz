import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TopPage = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState('all');
  const [questionCount, setQuestionCount] = useState('5');
  const [difficulty, setDifficulty] = useState('easy');

  const handleStartQuiz = () => {
    navigate('/quiz', {
      state: { range, questionCount, difficulty },
    });
  };

  return (
    <div>
      <h1>日向坂46 ペンライトカラークイズ</h1>
      <div className="quiz-options">
        <label>出題範囲</label>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="all">オール</option>
          <option value="1st">1期生</option>
          <option value="2nd">2期生</option>
          <option value="3rd">3期生</option>
          <option value="4th">4期生</option>
        </select>

        <label>出題数</label>
        <select
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
        >
          <option value="5">5問</option>
          <option value="10">10問</option>
          <option value="all">オール</option>
        </select>

        <label>難易度</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">イージー</option>
          <option value="normal">ノーマル</option>
          <option value="hard">ハード</option>
          <option value="superhard">スーパーハード</option>
        </select>

        <button onClick={handleStartQuiz}>スタート</button>
      </div>
    </div>
  );
};

export default TopPage;
