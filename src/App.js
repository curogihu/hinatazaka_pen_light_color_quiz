import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/top'); // /top に遷移
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Unofficial Hinatazaka Quiz App</h1>
        <button className="custom-button" onClick={handleButtonClick}>ペンライトクイズ</button>
      </header>
    </div>
  );
}

export default App;