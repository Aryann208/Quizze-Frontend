import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import DeleteIcon from '../../../src/assets/img/deleteIcon.svg';
import EditIcon from '../../../src/assets/img/edit.svg';
import ShareIcon from '../../../src/assets/img/share.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import Modal from '../../components/modal/Modal';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [quizData, setQuizData] = useState([]);
  const [deleteQuiz, setDeletedQuiz] = useState({ bool: false, id: '' });
  const [editedQuizName, setEditedQuizName] = useState('');
  const [editingQuizId, setEditingQuizId] = useState(null);
  const editInputRef = useRef(null);

  const formatDate = (isoDate) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };
  const handleCopyToClipboard = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  };
  const showToast = () => {
    toast('Link copied to Clipboard!', {
      position: 'top-right',
      autoClose: 3000,
    });
  };
  const handleEditQuiz = (quizId, currentQuizName) => {
    setEditingQuizId(quizId);
    setEditedQuizName(currentQuizName);
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  };

  const handleSaveEdit = (quizId) => {
    fetch(`${BASE_URL}/api/quiz/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizName: editedQuizName }),
    })
      .then((response) => {
        if (response.status === 200) {
          setQuizData((prevData) =>
            prevData.map((quiz) =>
              quiz._id === quizId ? { ...quiz, quizName: editedQuizName } : quiz
            )
          );
          setEditingQuizId(null);
        } else {
          console.error('Failed to update the quiz name.');
        }
      })
      .catch((error) => console.error('Error updating quiz name:', error));
  };

  const handleEditInputChange = (event) => {
    setEditedQuizName(event.target.value);
  };

  const handleEditInputBlur = (quizId) => {
    if (editingQuizId === quizId) {
      handleSaveEdit(quizId);
    }
  };

  const handleEditInputKeyUp = (event, quizId) => {
    if (event.key === 'Enter' && editingQuizId === quizId) {
      handleSaveEdit(quizId);
    }
  };
  const handleDelete = (quizId) => {
    setDeletedQuiz({ bool: true, id: quizId });
  };
  const handleDeleteQuiz = (quizId) => {
    console.log(quizId);
    fetch(`${BASE_URL}/api/quiz/${quizId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 200) {
          setQuizData((prevData) =>
            prevData.filter((quiz) => quiz._id !== quizId)
          );
        } else {
          console.error('Failed to delete the quiz.');
        }
      })
      .catch((error) => console.error('Error deleting quiz:', error));
    setDeletedQuiz({ bool: false, id: '' });
  };

  const isEditing = (quizId) => quizId === editingQuizId;

  useEffect(() => {
    fetch(`${BASE_URL}/api/quiz/`)
      .then((response) => response.json())
      .then((data) => {
        const quizzesWithImpression = data.map((quiz) => {
          const maxImpression = quiz.questions.reduce((max, question) => {
            const questionImpression = question.choices.reduce(
              (questionMax, choice) =>
                Math.max(questionMax, choice.userSelection),
              0
            );
            return Math.max(max, questionImpression);
          }, 0);
          return { ...quiz, impression: maxImpression };
        });

        setQuizData(quizzesWithImpression);
      })
      .catch((error) => console.error('Error fetching quiz data:', error));
  }, []);

  if (!token) {
    return (
      <p>
        You need to login first{' '}
        <button onClick={() => navigate('/login')}>Login</button>{' '}
      </p>
    );
  }
  if (deleteQuiz.bool) {
    return (
      <>
        <Modal
          children={
            <>
              <h1
                style={{ textAlign: 'center', width: '60%', margin: '0 auto' }}
              >
                Are you confirm you want to delete ?
              </h1>
              <div
                style={{ width: '90%', margin: '1em auto' }}
                className="--spaceBetween"
              >
                <button
                  onClick={() => handleDeleteQuiz(deleteQuiz.id)}
                  style={{
                    width: '279px',
                    height: '43px',
                    borderRadius: '10px',
                    background: '#FF4B4B',
                    color: '#fff',
                  }}
                >
                  Confirm Delete
                </button>

                <button
                  onClick={() => setDeletedQuiz({ bool: false, id: '' })}
                  style={{
                    width: '279px',
                    height: '43px',
                    borderRadius: '10px',
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          }
        />
      </>
    );
  }

  return (
    <div className="dashboard--container">
      <ToastContainer />
      <table className="dashboard--table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th>Share</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quizData.map((row, index) => (
            <tr key={row._id}>
              <td>{index + 1}</td>
              <td>
                {isEditing(row._id) ? (
                  <input
                    type="text"
                    value={editedQuizName}
                    onChange={handleEditInputChange}
                    onBlur={() => handleEditInputBlur(row._id)}
                    onKeyUp={(e) => handleEditInputKeyUp(e, row._id)}
                    ref={editInputRef}
                  />
                ) : (
                  row.quizName
                )}
              </td>
              <td>{formatDate(row.createdAt)}</td>
              <td>{row.impression}</td>
              <td>
                <div className="flex">
                  {isEditing(row._id) ? (
                    <button onClick={() => handleSaveEdit(row._id)}>
                      Save
                    </button>
                  ) : (
                    <img
                      src={EditIcon}
                      alt=""
                      onClick={() => handleEditQuiz(row._id, row.quizName)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  <img
                    src={DeleteIcon}
                    alt=""
                    onClick={() => handleDelete(row._id)}
                    style={{ cursor: 'pointer' }}
                  />

                  <img
                    onClick={() => {
                      handleCopyToClipboard(`${FRONTEND_URL}/quiz/${row._id}`);
                      showToast();
                    }}
                    src={ShareIcon}
                    alt=""
                  />
                </div>
              </td>
              <td>
                <p
                  onClick={() => navigate(`/quiz-analysis/${row._id}`)}
                  className="underline-text"
                >
                  Question Wise Analysis
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
