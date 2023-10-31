import React, { useEffect, useState } from 'react';
import './QuizTest.css';
import QuizResult from '../../components/quizResult/QuizResult';
import { useParams } from 'react-router';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const QuizTest = () => {
  const params = useParams();
  const quizID = params.id;
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null); // Added timerInterval state

  useEffect(() => {
    fetch(`${BASE_URL}/api/quiz/${quizID}`)
      .then((response) => response.json())
      .then((data) => {
        setQuizData(data);
      })
      .catch((error) => console.error('Error fetching quiz data:', error));
  }, []);

  useEffect(() => {
    if (quizData) {
      if (quizData.questions[currentQuestionIndex].timer !== 0) {
        startTimer(quizData.questions[currentQuestionIndex].timer);
        setTimer(quizData.questions[currentQuestionIndex].timer);
      } else {
        startTimer(111000);
        setTimer(111000);
      }
    }
  }, [quizData, currentQuestionIndex]);

  const startTimer = (duration) => {
    setTimer(duration);

    if (duration > 0) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            handleNextQuestion();
            clearInterval(timerId);
            setTimerExpired(true);
            return 0;
          }
        });
      }, 1000);
      setTimerInterval(timerId);
    }
  };

  const handleAnswerSelect = (choice) => {
    if (quizData && quizData.questions[currentQuestionIndex]) {
      const updatedUserAnswers = { ...userAnswers };
      updatedUserAnswers[currentQuestionIndex] = choice.id;

      setUserAnswers(updatedUserAnswers);

      if (choice.isCorrect) {
        setCorrectAnswersCount(correctAnswersCount + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (quizData) {
      // Clear the timer interval
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      if (currentQuestionIndex + 1 < quizData.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimerExpired(false);
      } else {
        const updatedQuizData = { ...quizData };
        updatedQuizData.questions = updatedQuizData.questions.map(
          (question, index) => {
            if (userAnswers[index] !== undefined) {
              question.choices = question.choices.map((choice) => {
                if (choice.id === userAnswers[index]) {
                  return {
                    ...choice,
                    userSelection: (choice.userSelection || 0) + 1,
                  };
                }
                return choice;
              });
            }
            return question;
          }
        );

        fetch(`${BASE_URL}/api/quiz/${quizID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedQuizData),
        })
          .then((response) => response.json())
          .then((response) => {
            console.log('Quiz data submitted:', response);
          })
          .catch((error) =>
            console.error('Error submitting quiz data:', error)
          );

        setIsQuizSubmitted(true);
      }
    }
  };

  if (!quizData || !quizData.questions) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  return (
    <div className="quiztest-container">
      {isQuizSubmitted ? (
        <QuizResult
          score={correctAnswersCount}
          totalNumber={quizData.questions.length}
          type={quizData.quizType}
        />
      ) : (
        <div>
          <div className="quiztest-metadata --spaceBetween">
            <p className="question--qnumber">
              {currentQuestionIndex + 1} / {quizData.questions.length}
            </p>
            {timer > 0 && timer < 20 && (
              <p className="question--qnumber" style={{ color: 'red' }}>
                00:{timer > 9 ? timer : `0${timer}`}s
              </p>
            )}
          </div>
          <div className="quiztest-question-analysis">
            <div>
              <div className="flex">
                <p className="question--qnumber">{currentQuestion.question}</p>
              </div>
              <div className="quiztest-choices">
                {currentQuestion.choices?.map((choice) => (
                  <div
                    className="quiztest-choice --alignCenter"
                    style={{
                      fontWeight: '600',
                      backgroundColor:
                        userAnswers[currentQuestionIndex] === choice.id
                          ? '#60B84B'
                          : '#F0F0F0',
                      color:
                        userAnswers[currentQuestionIndex] === choice.id
                          ? 'white'
                          : 'black',
                    }}
                    key={choice._id}
                    onClick={() => handleAnswerSelect(choice)}
                  >
                    {currentQuestion.quizType === '' && choice.choiceText}
                    {currentQuestion.quizType === 'Text' && choice.choiceText}
                    {currentQuestion.quizType === 'Image Url' && (
                      <img src={choice.choiceUrl} alt="Question " />
                    )}
                    {currentQuestion.quizType === 'Text & Image Url' && (
                      <div className="choice-container">
                        <div className="choice-text">{choice.choiceText}</div>
                        <div className="choice-image">
                          <img src={choice.choiceUrl} alt="Question" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                width: '100%',

                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                className="final-button --alignCenter"
                onClick={handleNextQuestion}
              >
                {isLastQuestion ? 'Submit' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTest;
