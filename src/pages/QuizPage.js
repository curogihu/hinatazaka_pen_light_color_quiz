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
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [countdown, setCountdown] = useState(null);

  // 経過時間をMM:SS.NNN形式でフォーマットする関数
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millisecondsRemaining = milliseconds % 1000;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millisecondsRemaining).padStart(3, '0')}`;
  };

  const moveToNextQuestion = useCallback(() => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
      setSelectedOption(null);
      setCountdown(null);
    } else {
      const timeTaken = formatTime(Date.now() - startTime);
      setTimeout(() => {
        navigate('/result', { state: { correctAnswers: questionIndex + 1, totalQuestions: questions.length, timeTaken } });
      }, 3000); // 3秒待機
    }
  }, [navigate, questions, questionIndex, startTime]);

  const handleAnswer = useCallback((option) => {
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
          moveToNextQuestion();
        }
        return prevCountdown - 1;
      });
    }, 1000);
  }, [life, questionIndex, questions, navigate, startTime, currentQuestion, moveToNextQuestion]);

  const initializeQuiz = useCallback(() => {
    setStartTime(Date.now());
    setQuestionIndex(0);
    setLife(difficulty === 'easy' ? 3 : difficulty === 'normal' ? 2 : 1);

    let filteredMembers = membersData.members;

    if (filteredMembers.length === 0) {
      console.error("該当するメンバーがいません");
      navigate('/top');
      return;
    }

    const indices = Array.from({ length: filteredMembers.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

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
            onClick={() => handleAnswer(option)}
            style={{
              backgroundColor:
                selectedOption === option
                  ? isCorrect
                    ? '#00aaff'
                    : '#ff6666'
                  : option === currentQuestion.correctAnswer && selectedOption !== null
                  ? '#00aaff'
                  : ''
            }}
            disabled={selectedOption !== null}
          >
            {option}
          </button>
        ))}
      </div>
      {countdown !== null && (
        <div style={{ fontSize: '24px', marginTop: '20px' }}>
          次の出題まで {countdown} 
        </div>
      )}
    </div>
  );
};

export default QuizPage;
