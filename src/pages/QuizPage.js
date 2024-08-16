import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import membersData from '../data/members.json';
import heartIcon from '../assets/heart_icon.png';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { difficulty } = location.state;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [life, setLife] = useState(difficulty === 'easy' ? 3 : difficulty === 'normal' || difficulty === 'hard' ? 2 : 1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState(null); // 修正箇所: 選択されたオプションを追跡
  const [isCorrect, setIsCorrect] = useState(false); // 修正箇所: 正解か不正解かを追跡
  const [timeLeft, setTimeLeft] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(difficulty === 'superhard');
  const [startTime, setStartTime] = useState(Date.now());
  const [countdown, setCountdown] = useState(null); // 修正箇所: カウントダウン用

  // 経過時間をMM:SS.NNN形式でフォーマットする関数
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millisecondsRemaining = milliseconds % 1000;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millisecondsRemaining).padStart(3, '0')}`;
  };

  const handleAnswer = useCallback((option) => {
    const moveToNextQuestion = () => { 
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(questionIndex + 1);
        setCurrentQuestion(questions[questionIndex + 1]);
        setSelectedOption(null);
        setTimeLeft(5);
        setCountdown(null);
        setIsCountingDown(difficulty === 'superhard');
      } else {
        // 最後の問題の場合も、色の変化を待ってから遷移
        const timeTaken = formatTime(Date.now() - startTime);
        setTimeout(() => {
          navigate('/result', { state: { correctAnswers: questionIndex + 1, totalQuestions: questions.length, timeTaken } });
        }, 3000); // 3秒待機
      }
    };
  
    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
  
    if (!correct) {
      setLife(life - 1);
      if (life - 1 === 0) {
        const timeTaken = formatTime(Date.now() - startTime);
        setTimeout(() => {
          navigate('/result', { state: { correctAnswers: questionIndex, totalQuestions: questions.length, timeTaken } });
        }, 3000); // 3秒待機
        return;
      }
    }
  
    setCountdown(3);
  
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          moveToNextQuestion(); // 最後の問題も含めて、次の処理に進む
        }
        return prevCountdown - 1;
      });
    }, 1000);
  }, [life, questionIndex, questions, navigate, startTime, currentQuestion, difficulty]);

  const initializeQuiz = useCallback(() => {
    setStartTime(Date.now());
    setQuestionIndex(0);
    setLife(difficulty === 'easy' ? 3 : difficulty === 'normal' || difficulty === 'hard' ? 2 : 1);
    setTimeLeft(5);
    setIsCountingDown(difficulty === 'superhard');
  
    let filteredMembers = membersData.members;
  
    // フィルタリング条件に応じたメンバーを取得
    // range フィルタリングのコードをここに追加する（もし必要なら）
  
    if (filteredMembers.length === 0) {
      console.error("該当するメンバーがいません");
      navigate('/top');
      return;
    }
  
    // インデックスのリストを作成し、それをシャッフル
    const indices = Array.from({ length: filteredMembers.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  
    // シャッフルされたインデックスを使用して問題を生成
    const selectedQuestions = [];
    for (let i = 0; i < indices.length; i++) {
      const question = filteredMembers[indices[i]];
      selectedQuestions.push({
        questionText: `このペンライトカラーのメンバーは誰？`,
        questionColors: `${question.colors[0]} × ${question.colors[1]}`,
        correctAnswer: question.name,
        options: shuffleOptions(filteredMembers, question.name)
      });
    }
  
    setQuestions(selectedQuestions);
    setCurrentQuestion(selectedQuestions[0]);
  }, [difficulty, navigate]);

  useEffect(() => {
    initializeQuiz();  // クイズページがロードされた時にクイズを初期化
  }, [initializeQuiz]);

  useEffect(() => {
    if (isCountingDown && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleAnswer(false);
    }
  }, [timeLeft, isCountingDown, handleAnswer]);

  const shuffleOptions = (members, correctAnswer) => {
    const shuffledMembers = [...members];
    const options = [correctAnswer];
  
    while (options.length < 4) {
      if (shuffledMembers.length === 0) {
        console.error("選択肢を生成できるメンバーが不足しています");
        break;
      }
      const randomIndex = Math.floor(Math.random() * shuffledMembers.length);
      const option = shuffledMembers.splice(randomIndex, 1)[0]?.name;
  
      if (option && !options.includes(option)) {
        options.push(option);
      }
    }
  
    return options.sort(() => Math.random() - 0.5);
  };

  const renderHearts = () => {
    return Array.from({ length: life }, (_, i) => (
      <img key={i} src={heartIcon} alt="Heart" style={{ width: '20px', height: '20px' }} />
    ));
  };

  return (
    <div className="quiz-container">
      <h1>クイズ画面</h1>
      <div className="hearts">
        {renderHearts()}
      </div>
      <div>
        <p>{currentQuestion.questionText}</p>
        <p>{currentQuestion.questionColors}</p>
      </div>
      <div className="quiz-options">
        {currentQuestion.options && currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)} // 修正箇所: 引数を渡す
            style={{
              backgroundColor:
                selectedOption === option
                  ? isCorrect
                    ? '#00aaff' // 正解の場合の空色
                    : '#ff6666' // 不正解の場合の赤色
                  : option === currentQuestion.correctAnswer && selectedOption !== null
                  ? '#00aaff' // 不正解のときに正解を表示
                  : ''
            }}
            disabled={selectedOption !== null} // 修正箇所: 選択後は他のボタンを無効化
          >
            {option}
          </button>
        ))}
      </div>
      {countdown !== null && ( // 修正箇所: カウントダウン表示
        <div style={{ fontSize: '24px', marginTop: '20px' }}>
          次の出題まで {countdown} 
        </div>
      )}
      {isCountingDown && (
        <div style={{ fontSize: '48px', color: 'red' }}>
          {timeLeft}
        </div>
      )}
    </div>
  );
};

export default QuizPage;