import React from 'react';
import './QuizTabs.css';
import Eyeview from '../../assets/img/eyeview.svg';

const QuizTabs = ({ quiz }) => {
  const impressions = quiz.questions.reduce((max, question) => {
    const questionCount = question.choices.reduce((cCount, choice) => {
      return cCount + (choice.userSelection === 1 ? 1 : 0);
    }, 0);
    return Math.max(max, questionCount);
  }, 0);

  const createdDate = new Date(quiz.createdAt);
  const formattedDate = `${createdDate.getDate()} ${createdDate.toLocaleString(
    'en',
    {
      month: 'short',
    }
  )}, ${createdDate.getFullYear()}`;

  return (
    <div className="quiztab--container">
      <div className="quiztab--container--content">
        <div className="quiztab--container--content--line1 --baseline">
          <h5>{quiz.quizName}</h5>
          <span
            style={{ color: '#FF5D01', fontWeight: 'bold' }}
            className="flex "
          >
            {impressions}
            <span style={{ margin: '0.1em' }} className="--alignCenter">
              <img src={Eyeview} alt="" />
            </span>
          </span>
        </div>
        <div className="quiztab--container--content--line2">
          Created on : {formattedDate}
        </div>
      </div>
    </div>
  );
};

export default QuizTabs;
