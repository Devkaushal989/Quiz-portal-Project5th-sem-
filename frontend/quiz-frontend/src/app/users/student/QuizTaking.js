import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8700/api';

export default function QuizTaking() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [quizSchedule, setQuizSchedule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeWindowStatus, setTimeWindowStatus] = useState('checking');

  const getAuthToken = () => localStorage.getItem('token');
  const getAxiosConfig = () => ({
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });

  const checkTimeWindow = (scheduleInfo) => {
    if (!scheduleInfo || !scheduleInfo.scheduledStartTime || !scheduleInfo.scheduledEndTime) {
      return 'active'; 
    }

    const now = new Date();
    const startTime = new Date(scheduleInfo.scheduledStartTime);
    const endTime = new Date(scheduleInfo.scheduledEndTime);

    if (now < startTime) {
      return 'before';
    } else if (now >= endTime) {
      return 'after';
    } else {
      return 'active';
    }
  };

  const getTimeUntilStart = () => {
    if (!quizSchedule || !quizSchedule.scheduledStartTime) return 0;
    const now = new Date();
    const startTime = new Date(quizSchedule.scheduledStartTime);
    return Math.max(0, Math.floor((startTime - now) / 1000));
  };

  const getTimeUntilEnd = () => {
    if (!quizSchedule || !quizSchedule.scheduledEndTime) return Infinity;
    const now = new Date();
    const endTime = new Date(quizSchedule.scheduledEndTime);
    return Math.max(0, Math.floor((endTime - now) / 1000));
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchQuizSchedule = async () => {
      try {
        setLoading(true);
        const scheduleResponse = await axios.get(
          `${API_BASE_URL}/student/quiz/schedule/${courseId}`,
          getAxiosConfig()
        );

        if (scheduleResponse.data.success) {
          const schedule = scheduleResponse.data.data;
          setQuizSchedule(schedule);
          
          const status = checkTimeWindow(schedule);
          setTimeWindowStatus(status);
        } else {
          setTimeWindowStatus('active');
        }
      } catch (err) {
        console.log('No schedule found, allowing quiz:', err);
        setTimeWindowStatus('active');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizSchedule();
  }, [courseId]);

  useEffect(() => {
    if (!quizSchedule) return;

    const interval = setInterval(() => {
      const newStatus = checkTimeWindow(quizSchedule);
      
      if (newStatus !== timeWindowStatus) {
        setTimeWindowStatus(newStatus);
      }
      
      if (newStatus === 'after' && quiz && !submitting) {
        handleSubmit(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizSchedule, timeWindowStatus, quiz, submitting]);

  useEffect(() => {
    if (timeWindowStatus === 'active' && !quiz) {
      startQuiz();
    }
  }, [timeWindowStatus]);

  useEffect(() => {
    if (timeLeft > 0 && quiz) {
      if (quizSchedule) {
        const status = checkTimeWindow(quizSchedule);
        if (status === 'after') {
          handleSubmit(true);
          return;
        }
      }

      const timer = setTimeout(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit(true);
    }
  }, [timeLeft, quiz]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/student/quiz/start/${courseId}`,
        {},
        getAxiosConfig()
      );

      if (response.data.success) {
        const quizData = response.data.data;
        setQuiz(quizData);
      
        if (quizData.scheduledStartTime && quizData.scheduledEndTime) {
          setQuizSchedule({
            scheduledStartTime: quizData.scheduledStartTime,
            scheduledEndTime: quizData.scheduledEndTime
          });
        }
        
        let calculatedTimeLeft = quizData.duration * 60; 
        
        if (quizSchedule && quizSchedule.scheduledEndTime) {
          const timeUntilEnd = getTimeUntilEnd();
          calculatedTimeLeft = Math.min(calculatedTimeLeft, timeUntilEnd);
        }
        
        setTimeLeft(calculatedTimeLeft);
        setStartTime(Date.now());

        const initialAnswers = {};
        quizData.questions.forEach((q) => {
          initialAnswers[q._id] = null;
        });
        setAnswers(initialAnswers);
      } else {
        setError(response.data.message || 'Failed to start quiz');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start quiz');
      console.error('Start quiz error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex + 1 }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) setCurrentQuestion((c) => c + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((c) => c - 1);
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto) {
      const ok = window.confirm('Are you sure you want to submit? You cannot change answers after submission.');
      if (!ok) return;
    }

    if (!quiz) return;

    try {
      setSubmitting(true);
      const timeTaken = Math.floor((Date.now() - (startTime || Date.now())) / 1000);

      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId,
        selectedAnswer: answers[questionId]
      }));

      const response = await axios.post(
        `${API_BASE_URL}/student/quiz/submit/${quiz.attemptId}`,
        {
          answers: formattedAnswers,
          timeTaken
        },
        getAxiosConfig()
      );

      if (response.data.success) {
        navigate('/student');
      } else {
        setError(response.data.message || 'Failed to submit quiz');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
      console.error('Submit quiz error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => Object.values(answers).filter((a) => a !== null).length;

  if (timeWindowStatus === 'before' && quizSchedule) {
    const timeUntilStart = getTimeUntilStart();
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card border-0 shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="card-body text-center p-5">
            <div className="text-warning mb-4" style={{ fontSize: '64px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="fw-bold mb-3">Quiz Not Yet Started</h3>
            <p className="text-muted mb-4">
              This quiz will start at <strong>{formatDateTime(quizSchedule.scheduledStartTime)}</strong>
              <br />
              and end at <strong>{formatDateTime(quizSchedule.scheduledEndTime)}</strong>
            </p>
            <div className="alert alert-info">
              <h4 className="mb-0">Time until quiz starts: <strong>{formatTime(timeUntilStart)}</strong></h4>
            </div>
            <p className="text-muted small mt-3">This page will automatically refresh when the quiz starts.</p>
            <button className="btn btn-outline-secondary mt-3" onClick={() => navigate('/student')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (timeWindowStatus === 'after' && quizSchedule) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card border-0 shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="card-body text-center p-5">
            <div className="text-danger mb-4" style={{ fontSize: '64px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="fw-bold mb-3">Quiz Time Window Ended</h3>
            <p className="text-muted mb-4">
              The quiz time window has ended at <strong>{formatDateTime(quizSchedule.scheduledEndTime)}</strong>
            </p>
            <div className="alert alert-danger">
              <p className="mb-0">You can no longer take this quiz.</p>
            </div>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/student')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card border-0 shadow-lg" style={{ maxWidth: '500px' }}>
          <div className="card-body text-center p-5">
            <div className="text-danger mb-3" style={{ fontSize: '48px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12" y2="17"></line>
              </svg>
            </div>
            <h4 className="fw-bold mb-3">Unable to Start Quiz</h4>
            <p className="text-muted mb-4">{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/student/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-dark text-white py-3 sticky-top">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h5 className="mb-0">{quiz.courseName}</h5>
              <small>Question {currentQuestion + 1} of {quiz.questions.length}</small>
            </div>
            <div className="col-md-4 text-center">
              <div className="d-flex align-items-center justify-content-center">
                <span className="me-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </span>
                <h4 className={`mb-0 ${timeLeft < 300 ? 'text-danger' : 'text-white'}`}>{formatTime(timeLeft)}</h4>
              </div>
              {quizSchedule && quizSchedule.scheduledEndTime && (
                <small className="text-warning">Ends at {formatDateTime(quizSchedule.scheduledEndTime)}</small>
              )}
            </div>
            <div className="col-md-4 text-end">
              <span className="badge bg-success me-2">{getAnsweredCount()} / {quiz.questions.length} Answered</span>
              <button className="btn btn-warning btn-sm" onClick={() => handleSubmit(false)} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="progress" style={{ height: '4px' }}>
        <div className="progress-bar bg-success" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Marks: {currentQ.marks}</span>
                </div>

                <h4 className="fw-bold mb-4">{currentQuestion + 1}. {currentQ.questionText}</h4>

                <div className="row g-3">
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="col-12">
                      <div
                        className={`card border-2 ${answers[currentQ._id] === index + 1 ? 'border-success bg-success bg-opacity-10' : 'border-secondary'}`}
                        onClick={() => handleAnswerSelect(currentQ._id, index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body py-3 d-flex align-items-center">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${answers[currentQ._id] === index + 1 ? 'bg-success text-white' : 'bg-light'}`} style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <strong>{String.fromCharCode(65 + index)}</strong>
                          </div>
                          <span className="fw-medium">{option.optionText}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-outline-secondary" onClick={handlePrevious} disabled={currentQuestion === 0}>← Previous</button>
                  <button className="btn btn-outline-secondary" onClick={handleNext} disabled={currentQuestion === quiz.questions.length - 1}>Next →</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">Question Navigator</h6>
                <div className="row g-2">
                  {quiz.questions.map((q, index) => (
                    <div key={index} className="col-3">
                      <button
                        className={`btn btn-sm w-100 ${currentQuestion === index ? 'btn-primary' : answers[q._id] ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => handleQuestionJump(index)}
                      >
                        {index + 1}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <small className="text-muted d-block mb-1"><span className="badge bg-success me-1"></span> Answered</small>
                  <small className="text-muted d-block mb-1"><span className="badge bg-outline-secondary me-1"></span> Not Answered</small>
                  <small className="text-muted d-block"><span className="badge bg-primary me-1"></span> Current</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}