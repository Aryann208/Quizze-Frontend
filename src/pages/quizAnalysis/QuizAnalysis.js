import React, { useEffect, useState } from 'react';
import './QuizAnalysis.css';
import { useParams } from 'react-router';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const QuizAnalysis = () => {
  const params = useParams();
  const quizID = params.id;
  const [quizData, setQuizData] = useState(null);
  const [quizId, setQuizId] = useState('');
  const [metaData, setMetaData] = useState();
  useEffect(() => {
    fetch(`${BASE_URL}/api/quiz/${quizID}`)
      .then((response) => response.json())
      .then((data) => {
        const quizData = data;

        const quizzesWithImpression = quizData.questions.map((question) => {
          const impression = question.choices.reduce(
            (totalImpression, choice) => {
              return totalImpression + choice.userSelection;
            },
            0
          );

          return { ...question, impression };
        });

        setQuizData({
          quizName: quizData.quizName,
          questions: quizzesWithImpression,
        });
      })
      .catch((error) => console.error('Error fetching quiz data:', error));
  }, [quizId]);

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quizanalysis-container">
      <h2 className="appHeading">{quizData.quizName} Question Analysis</h2>

      <div className="quizanalysis-question-analysis">
        {quizData.questions.map((question, idx) => (
          <div key={question._id}>
            <div className="flex">
              <p>Q{idx + 1}.</p>
              <p style={{ marginLeft: '1em' }}>{question.question}</p>
            </div>
            <div className="quizanalysis-choices">
              {question.choices?.map((choice, idx) =>
                quizData.quizType === 'Poll' ? (
                  <div
                    className="quizanalysis-choice --alignCenter"
                    key={choice._id}
                  >
                    {choice.userSelection}
                    <p className="choice-sidetext">Option {idx + 1}</p>
                  </div>
                ) : (
                  <div
                    className="quizanalysis-choice --alignCenter"
                    key={choice._id}
                  >
                    {choice.userSelection}
                    <p className="choice-sidetext">
                      people Attempted this question
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizAnalysis;
