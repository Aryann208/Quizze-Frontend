import React, { useEffect, useState } from 'react';
import './QuizCreation.css';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import DeleteIcon from '../../assets/img/deleteIcon.svg';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
const BASE_URL = process.env.REACT_APP_BASE_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
const QuizCreation = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('');
  const [selectedCircle, setSelectedCircle] = useState(1);
  const [continueButton, setContinueButton] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [questionInput, setQuestionInput] = useState('');

  const [currentCircleIndex, setCurrentCircleIndex] = useState(0);
  const [quizQuestionData, setQuizQuestionData] = useState({});
  const [selectedOption, setSelectedOption] = useState('Text');

  const [quizNameError, setQuizNameError] = useState('');
  const [quizTypeError, setQuizTypeError] = useState('');

  const [timerOn, setTimerOn] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);
  const [quizDetails, setQuizDetails] = useState({
    quizName: '',
    quizType: '',
  });
  const [quizSaved, setQuizSaved] = useState(false);
  const [circles, setCircles] = useState([
    {
      id: 1,
      question: questionInput,
      timer: selectedTime,
      quizType: selectedType,
      choices: [
        { id: 1, choice: '', isCorrect: true, userSelection: 0 },
        { id: 2, choice: '', isCorrect: false, userSelection: 0 },
      ],
    },
  ]);
  const [circleError, setCircleError] = useState('');
  const [finalQuizID, setFinalQuizID] = useState('');

  const [quizQuestions, setQuizQuestions] = useState([]);
  const handleQuizCreationInputChange = (value) => {
    setInputValue(value);
    setQuizDetails({
      ...quizDetails,
      quizName: value,
    });
    setQuizNameError('');
  };

  const showToast = () => {
    toast('Link copied to Clipboard!', {
      position: 'top-right',
      autoClose: 3000,
    });
  };
  const handleCopyToClipboard = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  };

  const handleQuizTypeButtonClick = (type) => {
    setSelectedType(type);

    setQuizDetails({
      ...quizDetails,
      quizType: type,
    });
    setQuizTypeError('');
  };

  const handleAddChoice = () => {
    if (currentCircleIndex >= 0) {
      const updatedCircles = [...circles];
      const currentCircle = updatedCircles[currentCircleIndex];
      const newId = currentCircle.choices.length + 1;
      const newChoice = {
        id: newId,
        choice: '',
        isCorrect: false,
        userSelection: 0,
      };
      currentCircle.choices.push(newChoice);
      setCircles(updatedCircles);
    }
  };

  const handleInputChange = (value) => {
    //setInputValue(value);
    updateCurrentCircle({ question: value });
  };

  const handleQuestionChange = (value) => {
    setQuestionInput(value);
    updateCurrentCircle({ question: value });
  };

  const handleSelectTime = (time) => {
    setTimerOn(true);
    setSelectedTime(time);
    updateCurrentCircle({ timer: time });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    updateCurrentCircle({ quizType: e.target.value });
  };

  const handleTypeButtonClick = (type) => {
    //setSelectedType(type);

    const newChoices = [
      {
        id: 1,
        choice: '',
        isCorrect: true,
        choiceText: '',
        choiceUrl: '',
        userSelection: 0,
      },
      {
        id: 2,
        choice: '',
        isCorrect: false,
        choiceText: '',
        choiceUrl: '',
        userSelection: 0,
      },
    ];

    const updatedCircles = [...circles];

    const currentCircle = updatedCircles[currentCircleIndex];

    currentCircle.quizType = type;
    currentCircle.choices = newChoices;

    currentCircle.question = '';
    currentCircle.timer = 0;

    setCircles(updatedCircles);
  };

  const handleCircleClick = (id = 1) => {
    setSelectedCircle(id);
  };

  const handleContinueButtonClick = () => {
    if (quizDetails.quizName === '') {
      setQuizNameError('Quiz name is required');
    }
    if (quizDetails.quizType === '') {
      setQuizTypeError('Quiz type is required');
    }

    if (quizDetails.quizName && quizDetails.quizType) {
      setContinueButton((prev) => !prev);
    }
  };

  const handleAddCircle = () => {
    setQuestionInput('');
    setSelectedOption('Text');
    setTimerOn(false);
    setSelectedTime(0);

    const newChoices = [
      {
        id: 1,
        choice: '',
        isCorrect: true,
        choiceText: '',
        choiceUrl: '',
        userSelection: 0,
      },
      {
        id: 2,
        choice: '',
        isCorrect: false,
        choiceText: '',
        choiceUrl: '',
        userSelection: 0,
      },
    ];

    const newId = circles.length + 1;
    const newCircle = {
      id: newId,
      question: '',
      timer: 0,
      quizType: 'Text',
      choices: newChoices,
    };

    setCircles([...circles, newCircle]);

    setCurrentCircleIndex(newId - 1);
  };

  const handleDeleteCircle = (id) => {
    setContinueButton(true);
    if (circles.length > 1 && id !== 1) {
      const updatedCircles = circles.filter((circle) => circle.id !== id);
      setCircles(updatedCircles);

      setQuizQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== id)
      );

      const newCurrentCircleIndex = updatedCircles.findIndex(
        (circle) => circle.id === id
      );
      if (newCurrentCircleIndex !== -1) {
        setCurrentCircleIndex(newCurrentCircleIndex);
        const newCurrentCircle = updatedCircles[newCurrentCircleIndex];
        setQuestionInput(newCurrentCircle.question);
        setSelectedOption(newCurrentCircle.quizType);
        setTimerOn(newCurrentCircle.timer !== 0);
        setSelectedTime(newCurrentCircle.timer);
      } else {
        setCurrentCircleIndex(updatedCircles.length - 1);
        const lastRemainingCircle = updatedCircles[updatedCircles.length - 1];
        setQuestionInput(lastRemainingCircle.question);
        setSelectedOption(lastRemainingCircle.quizType);
        setTimerOn(lastRemainingCircle.timer !== 0);
        setSelectedTime(lastRemainingCircle.timer);
      }
    }
  };

  const handleTimerToggle = () => {
    setTimerOn((prev) => !prev);
    if (!timerOn) {
      setSelectedTime(5);
    }
  };

  const handleDeleteChoice = (id) => {
    if (currentCircleIndex >= 0) {
      setCircles((prevCircles) => {
        const updatedCircles = [...prevCircles];
        updatedCircles[currentCircleIndex].choices = updatedCircles[
          currentCircleIndex
        ].choices.filter((choice) => choice.id !== id);
        return updatedCircles;
      });
    }
  };

  const handleChoiceChange = (e, id) => {
    if (currentCircleIndex >= 0) {
      const updatedCircles = [...circles];
      const currentCircle = updatedCircles[currentCircleIndex];

      const choiceIndex = currentCircle.choices.findIndex(
        (choice) => choice.id === id
      );

      if (choiceIndex >= 0) {
        const updatedChoice = { ...currentCircle.choices[choiceIndex] };

        if (selectedOption === 'Text') {
          updatedChoice.choiceText = e.target.value;
          updatedChoice.choiceUrl = '';
        } else if (selectedOption === 'Image Url') {
          updatedChoice.choiceUrl = e.target.value;
          updatedChoice.choiceText = '';
        } else if (selectedOption === 'Text & Image Url') {
          if (e.target.name === 'choiceText') {
            updatedChoice.choiceText = e.target.value;
          } else if (e.target.name === 'choiceUrl') {
            updatedChoice.choiceUrl = e.target.value;
          }
        }

        currentCircle.choices[choiceIndex] = updatedChoice;

        setCircles(updatedCircles);
      }
    }
  };

  const updateCurrentCircle = (fieldsToUpdate) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle, index) => {
        if (circle.id === circles[currentCircleIndex].id) {
          return { ...circle, ...fieldsToUpdate };
        }
        return circle;
      })
    );
  };

  const handleSwitchQuestionCircle = (index) => {
    setCurrentCircleIndex(index);
  };

  useEffect(() => {
    console.log(circles[currentCircleIndex]);
  }, [circles, currentCircleIndex]);

  const handleCorrectChoiceChange = (id) => {
    if (currentCircleIndex >= 0) {
      setCircles((prevCircles) => {
        const updatedCircles = [...prevCircles];
        const currentCircle = updatedCircles[currentCircleIndex];
        currentCircle.choices = currentCircle.choices.map((choice) => ({
          ...choice,
          isCorrect: choice.id === id,
        }));
        return updatedCircles;
      });
    }
  };

  useEffect(() => {
    console.log(quizQuestionData);
    console.log('quizQuestions');
    console.log(quizQuestions);
  }, [quizQuestionData, quizQuestions]);
  const validateCurrentCircle = () => {
    const currentCircle = circles[currentCircleIndex];
    if (!currentCircle.question) {
      setCircleError('Question is required');
      return false;
    }
    if (
      currentCircle.choices.some(
        (choice) => !choice.choiceText && !choice.choiceUrl
      )
    ) {
      setCircleError('All choices must have text or image URL');
      return false;
    }
    if (timerOn && selectedTime === 0) {
      setCircleError('Timer value must be greater than 0');
      return false;
    }
    setCircleError('');
    return true;
  };

  const clearCircleError = () => {
    setCircleError('');
  };

  const handleCreateQuiz = () => {
    if (validateCurrentCircle()) {
      const newQuestions = circles.map((circle) => {
        return {
          id: circle.id,
          question: circle.question,
          timer: circle.timer,
          quizType: circle.quizType,
          choices: circle.choices,
        };
      });
      console.log('newQuestions', newQuestions);
      const quizData = {
        quizName: quizDetails.quizName,
        quizType: quizDetails.quizType,
        questions: newQuestions,
      };
      console.log('quizData', quizData);
      console.log('BASE_URL', BASE_URL);
      if (token) {
        axios
          .post(`${BASE_URL}/api/quiz/create`, quizData,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
          .then((response) => {
            console.log('Quiz created successfully:', response.data);
            setFinalQuizID(response.data._id);
            setQuizSaved(true);
          })
          .catch((error) => {
            console.error('Error creating quiz:', error);
          });
      }
    }
  };

  if (!token) {
    return (
      <p>
        You need to login first{' '}
        <button onClick={() => navigate('/login')}>Login</button>{' '}
      </p>
    );
  }
  return (
    <>
      {!quizSaved && !continueButton && (
        <div className="quizcreation--container">
          <Input
            placeholder="Quiz Name"
            inputValue={inputValue}
            handleInputChange={handleQuizCreationInputChange}
          />
          {quizNameError && (
            <div className="error-message">{quizNameError}</div>
          )}

          <div className="quizcreation--container--options flex ">
            <span>Quiz Type</span>
            <div className="quizcreation--container--options--buttons">
              <button
                className={`option--button ${
                  selectedType === 'Q&A' ? 'selected' : ''
                }`}
                onClick={() => handleQuizTypeButtonClick('Q&A')}
              >
                Q&A
              </button>
              <button
                className={`option--button ${
                  selectedType === 'Poll Type' ? 'selected' : ''
                }`}
                onClick={() => handleQuizTypeButtonClick('Poll Type')}
              >
                Poll Type
              </button>
            </div>
          </div>
          {quizTypeError && (
            <div className="error-message">{quizTypeError}</div>
          )}

          <div className="quizcreation--container--final--buttons">
            <button className="option--button">Q&A</button>
            <button
              onClick={handleContinueButtonClick}
              className="option--button--green"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {!quizSaved && continueButton && (
        <div className="quizcreation--container">
          {circleError && <div className="error-message">{circleError}</div>}
          <div className="quizformation--container--questioncircles">
            <div className="flex">
              {circles.map((circle, index) => (
                <div
                  key={circle.id}
                  // onClick={() => handleSwitchQuestionCircle(index)}
                  className={`quizformation--container--questioncircle ${
                    currentCircleIndex === index ? 'active' : ''
                  }`}
                >
                  {circle.id === circles.length ? (
                    <>
                      <span>{circle.id}</span>
                      <button
                        onClick={() => handleDeleteCircle(circle.id)}
                        className="circle-delete-button"
                      >
                        X
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{circle.id}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            {circles.length < 5 && (
              <div>
                <button id="circle-add-circle-button" onClick={handleAddCircle}>
                  +
                </button>
              </div>
            )}
          </div>
          {circles[currentCircleIndex] && (
            <>
              <Input
                placeholder="Poll Question"
                inputValue={questionInput}
                handleInputChange={handleQuestionChange}
              />
              <div className="--spaceBetween">
                <span>Option Type</span>
                <form className="quizformation--container--radios --spaceBetween">
                  <label className="--spaceBetween quizformation--container--radio">
                    <input
                      style={{ marginRight: '0.3em' }}
                      type="radio"
                      value="Text"
                      checked={selectedOption === 'Text'}
                      onChange={handleOptionChange}
                    />
                    Text
                  </label>
                  <label className="--spaceBetween quizformation--container--radio">
                    <input
                      style={{ marginRight: '0.3em' }}
                      type="radio"
                      value="Image Url"
                      checked={selectedOption === 'Image Url'}
                      onChange={handleOptionChange}
                    />
                    Image Url
                  </label>
                  <label className="--spaceBetween quizformation--container--radio">
                    <input
                      placeholder="Text & Image Url"
                      style={{ marginRight: '0.3em' }}
                      type="radio"
                      value="Text & Image Url"
                      checked={selectedOption === 'Text & Image Url'}
                      onChange={handleOptionChange}
                    />
                    Text & Image Url
                  </label>
                </form>
              </div>
              <div className="flex --spaceBetween">
                <div style={{ minWidth: '50%', overflow: 'hidden' }}>
                  {circles[currentCircleIndex].choices.map((choice) => (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      key={choice.id}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          margin: '0.3em',
                        }}
                      >
                        {quizDetails.quizType === 'Q&A' && (
                          <input
                            type="radio"
                            checked={choice.isCorrect}
                            onChange={() =>
                              handleCorrectChoiceChange(choice.id)
                            }
                          />
                        )}
                        {selectedOption === 'Text' ? (
                          <input
                            className={`choice--input ${
                              quizDetails.quizType === 'Q&A' && choice.isCorrect
                                ? 'correct'
                                : ''
                            }`}
                            placeholder="Text"
                            type="text"
                            value={choice.choiceText}
                            onChange={(e) => handleChoiceChange(e, choice.id)}
                          />
                        ) : selectedOption === 'Image Url' ? (
                          <input
                            placeholder="Image Url"
                            className={`choice--input ${
                              quizDetails.quizType === 'Q&A' && choice.isCorrect
                                ? 'correct'
                                : ''
                            }`}
                            type="text"
                            value={choice.choiceUrl}
                            onChange={(e) => handleChoiceChange(e, choice.id)}
                          />
                        ) : selectedOption === 'Text & Image Url' ? (
                          <div style={{ display: 'flex' }}>
                            <input
                              placeholder="Text "
                              className={`choice--input ${
                                quizDetails.quizType === 'Q&A' &&
                                choice.isCorrect
                                  ? 'correct'
                                  : ''
                              }`}
                              type="text"
                              name="choiceText"
                              value={choice.choiceText}
                              onChange={(e) => handleChoiceChange(e, choice.id)}
                            />
                            <input
                              placeholder="Image Url"
                              className={`choice--input ${
                                quizDetails.quizType === 'Q&A' &&
                                choice.isCorrect
                                  ? 'correct'
                                  : ''
                              }`}
                              type="text"
                              name="choiceUrl"
                              value={choice.choiceUrl}
                              onChange={(e) => handleChoiceChange(e, choice.id)}
                            />
                          </div>
                        ) : null}
                      </div>

                      {choice.id > 2 && (
                        <button
                          onClick={() => handleDeleteChoice(choice.id)}
                          style={{
                            color: '#000',
                            fontSize: '12px',
                            border: '0',
                            outline: '0',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <img
                            style={{ fontSize: '12px' }}
                            src={DeleteIcon}
                            alt=""
                          />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    style={{
                      marginLeft: '-0.8em',
                      width: '75%',
                      height: '2.5em',
                    }}
                    onClick={handleAddChoice}
                    className="circle-add-button"
                  >
                    Add Choice
                  </button>
                </div>
                {quizDetails.quizType === 'Q&A' && (
                  <div className="quizformation--timer">
                    {' '}
                    <p className="--alignCenter">Timer</p>
                    <button
                      className={`timer-button ${
                        timerOn === false ? 'selected' : ''
                      }`}
                      onClick={handleTimerToggle}
                    >
                      {timerOn ? 'ON' : 'OFF'}
                    </button>
                    <button
                      className={`timer-button ${
                        timerOn && selectedTime === 5 ? 'selected' : ''
                      }`}
                      onClick={() => handleSelectTime(5)}
                    >
                      5
                    </button>
                    <button
                      className={`timer-button ${
                        timerOn && selectedTime === 10 ? 'selected' : ''
                      }`}
                      onClick={() => handleSelectTime(10)}
                    >
                      10
                    </button>
                  </div>
                )}
              </div>

              <div className="quizcreation--container--final--buttons">
                <button className="option--button">Cancel</button>
                <button
                  onClick={handleCreateQuiz}
                  className="option--button--green"
                >
                  Create Quiz
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {quizSaved && (
        <div
          style={{
            width: '100%',

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',

            alignItems: 'center',
            position: 'relative',
          }}
        >
          <ToastContainer />
          <h1 className="Alert-Text">Congrats your Quiz is Published!</h1>
          <h5 className="Link --alignCenter">
            {FRONTEND_URL}/quiz/{finalQuizID}
          </h5>
          <button
            style={{ fontSize: '1.5em' }}
            className="final-button"
            onClick={() => {
              handleCopyToClipboard(`${FRONTEND_URL}/quiz/${finalQuizID}`);
              showToast();
            }}
          >
            Share
          </button>
        </div>
      )}
    </>
  );
};

export default QuizCreation;
