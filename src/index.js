import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter のインポートを追加
import './index.css';
import App from './App';
import TopPage from './pages/TopPage';
import QuizPage from './pages/QuizPage';  // 次のステップで実装します
import ResultPage from './pages/ResultPage';  // ResultPage のインポート

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <BrowserRouter basename="/hinatazaka_pen_light_color_quiz">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/top" element={<TopPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />  {/* 結果画面のルートを追加 */}
      </Routes>
      </BrowserRouter>
  </React.StrictMode>
);