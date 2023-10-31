import React, { useEffect, useState } from 'react';
import './Analytics.css';

import AnalyticCountTab from '../../components/analyticCountTab/AnalyticCountTab';
import QuizTabs from '../../components/quizTabs/QuizTabs';
import { useNavigate } from 'react-router';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Analytics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (token) {
      fetch(`${BASE_URL}/api/quiz/`)
        .then((response) => response.json())
        .then((data) => {
          setQuizzes(data);
        })
        .catch((error) => console.error('Error fetching quizzes:', error));
    }
  }, [token]);

  const analyticsCounters = [
    {
      color: '#FF5D01',
      count: quizzes.length,
      primaryText: 'quiz',
      secondaryText: 'created',
    },
    {
      color: '#60B84B',
      count: quizzes.reduce((total, quiz) => total + quiz.questions.length, 0), // Total number of questions
      primaryText: 'questions',
      secondaryText: 'created',
    },
    {
      color: '#5076FF',
      count: quizzes.reduce((total, quiz) => {
        return (
          total +
          quiz.questions.reduce((qMax, question) => {
            return Math.max(
              qMax,
              question.choices.reduce((cMax, choice) => {
                return Math.max(cMax, choice.userSelection);
              }, 0)
            );
          }, 0)
        );
      }, 0),
      primaryText: 'Total',
      secondaryText: 'Impressions',
    },
  ];
  if (!token) {
    return (
      <p>
        You need to login first{' '}
        <button onClick={() => navigate('/login')}>Login</button>{' '}
      </p>
    );
  }

  return (
    <div className="analytic--container">
      <div className="analytic--container--counters flex">
        {analyticsCounters?.map((analyticsCounter, index) => (
          <AnalyticCountTab
            key={index}
            color={analyticsCounter.color}
            count={analyticsCounter.count}
            primaryText={analyticsCounter.primaryText}
            secondaryText={analyticsCounter.secondaryText}
          />
        ))}
      </div>
      <div className="analytic--container--quizes">
        <h3>Trending Quizes</h3>
        <div className="analytic--container--quizes--container">
          {quizzes.map((quiz, index) => (
            <QuizTabs key={index} quiz={quiz} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
