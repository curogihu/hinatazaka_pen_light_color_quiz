import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import membersData from '../data/members.json';
import heartIcon from '../assets/heart_icon.png';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { range, questionCount, difficulty } = location.state;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [life, setLife] = useState(difficulty === 'easy' ? 3 : difficulty === 'normal' || difficulty === 'hard' ? 2 : 1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [timeLeft, setTimeLeft] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(difficulty === 'superhard');
  const [startTime, setStartTime] = useState(Date.now());

  // 経過時間をMM:SS.NNN形式でフォーマットする関数
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millisecondsRemaining = milliseconds % 1000;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millisecondsRemaining).padStart(3, '0')}`;
  };

  const handleAnswer = useCallback((isCorrect) => {
    if (!isCorrect) {
      setLife(life - 1);
      if (life - 1 === 0) {
        const timeTaken = formatTime(Date.now() - startTime);
        navigate('/result', { state: { correctAnswers: questionIndex, totalQuestions: questions.length, timeTaken } });
        return;
      }
    }

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
      setTimeLeft(5);
      setIsCountingDown(difficulty === 'superhard');
    } else {
      const timeTaken = formatTime(Date.now() - startTime);
      navigate('/result', { state: { correctAnswers: questionIndex + 1, totalQuestions: questions.length, timeTaken } });
    }
  }, [life, questionIndex, questions, navigate, difficulty, startTime]);

  const initializeQuiz = useCallback(() => {
    setStartTime(Date.now());
    setQuestionIndex(0);
    setLife(difficulty === 'easy' ? 3 : difficulty === 'normal' || difficulty === 'hard' ? 2 : 1);
    setTimeLeft(5);
    setIsCountingDown(difficulty === 'superhard');

    let filteredMembers = membersData.members;
    if (range !== 'all_og') {
      filteredMembers = filteredMembers.filter(member => member.isGraduation === false);
    }

    if (range !== 'all' && range !== 'all_og') {
      filteredMembers = filteredMembers.filter(member => member.generation === range);
    }

    const selectedQuestions = [];
    for (let i = 0; i < (questionCount === 'all' ? filteredMembers.length : parseInt(questionCount)); i++) {
      const randomIndex = Math.floor(Math.random() * filteredMembers.length);
      const question = filteredMembers.splice(randomIndex, 1)[0];
      selectedQuestions.push({
        questionText: `このペンライトカラーのメンバーは誰？\n ${question.colors[0]} × ${question.colors[1]}`,
        correctAnswer: question.name,
        options: shuffleOptions(filteredMembers, question.name)
      });
    }

    setQuestions(selectedQuestions);
    setCurrentQuestion(selectedQuestions[0]);
  }, [difficulty, range, questionCount]);

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
      const randomIndex = Math.floor(Math.random() * shuffledMembers.length);
      const option = shuffledMembers.splice(randomIndex, 1)[0].name;
      if (!options.includes(option)) {
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
    <div className="quiz-container">  {/* <-- 緑色 */}
      <h1>クイズ画面</h1> {/* <-- 緑色 */}
      <div className="hearts">  {/* <-- 緑色 */}
        {renderHearts()}
      </div>
      <div>
        <p>{currentQuestion.questionText}</p>
      </div>
      <div>
        {currentQuestion.options && currentQuestion.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option === currentQuestion.correctAnswer)}>
            {option}
          </button>
        ))}
      </div>
      {isCountingDown && (
        <div style={{ fontSize: '48px', color: 'red' }}>  {/* <-- 緑色 */}
          {timeLeft}
        </div>
      )}
    </div>
  );
};

export default QuizPage;