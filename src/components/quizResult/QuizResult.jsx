import React from 'react';
import './QuizResult.css';
import TrophyImg from '../../assets/img/Trophy.png';

const QuizResult = ({ score, totalNumber, type = 'Quiz' }) => {
  return (
    <>
      {type === 'Q&A' && (
        <div className="quizResult">
          {' '}
          <h1>Congrats Quiz is completed!</h1>
          <img src={TrophyImg} alt="" />
          <h1>
            Your Score is {score}/{totalNumber}
          </h1>
        </div>
      )}
      {type === 'Poll Type' && (
        <div className="quizResult">
          <h1 className="PollText"> Thank you for participating in the Poll</h1>
        </div>
      )}
      {}
    </>
  );
};

export default QuizResult;
