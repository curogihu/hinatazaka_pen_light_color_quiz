import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Quiz App</h1>
        <Link to="/top">
          <button>トップページへ</button>
        </Link>
      </header>
    </div>
  );
}

export default App;