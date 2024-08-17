import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TopPage() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');

  const handleStartQuiz = () => {
    navigate('/quiz', { state: { difficulty, range: 'all', questionCount: 'all' } });
  };

  return (
    <div className="top-page">
      <h1>日向坂46<br/>ペンライトカラークイズ</h1>

      <div>
        <label>難易度を選択:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">イージー</option>
          <option value="normal">ノーマル</option>
          <option value="hard">ハード</option>
        </select>
      </div>

      <div className="buttons-container">
        <button className="custom-button" onClick={handleStartQuiz}>スタート</button>      
      </div>
    </div>
  );
}

export default TopPage;