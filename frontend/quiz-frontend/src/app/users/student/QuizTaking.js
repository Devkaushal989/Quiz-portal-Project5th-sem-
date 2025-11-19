import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8700/api';

export default function QuizTaking() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [startTime, setStartTime] = useState(null);

    const getAuthToken = () => localStorage.getItem('token');
    const getAxiosConfig = () => ({
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        startQuiz();
    }, [courseId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && quiz) {
            handleSubmit();
        }
    }, [timeLeft]);

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
                setTimeLeft(quizData.duration * 60); 
                setStartTime(Date.now());

                const initialAnswers = {};
                quizData.questions.forEach((q, index) => {
                    initialAnswers[q._id] = null;
                });
                setAnswers(initialAnswers);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start quiz');
            console.error('Start quiz error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, optionIndex) => {
        setAnswers({
            ...answers,
            [questionId]: optionIndex + 1 
        });
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleQuestionJump = (index) => {
        setCurrentQuestion(index);
    };

    const handleSubmit = async () => {
        if (!window.confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
            return;
        }

        try {
            setSubmitting(true);
            const timeTaken = Math.floor((Date.now() - startTime) / 1000); 

            const formattedAnswers = Object.keys(answers).map(questionId => ({
                questionId: questionId,
                selectedAnswer: answers[questionId]
            }));

            const response = await axios.post(
                `${API_BASE_URL}/student/quiz/submit/${quiz.attemptId}`,
                {
                    answers: formattedAnswers,
                    timeTaken: timeTaken
                },
                getAxiosConfig()
            );

            if (response.data.success) {
                
                navigate(`/student/result/${quiz.attemptId}`);
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

    const getAnsweredCount = () => {
        return Object.values(answers).filter(a => a !== null).length;
    };

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
                        <div className="text-danger mb-3" style={{ fontSize: '48px' }}><svg xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12" y2="17"></line>
                        </svg>
                        </div>
                        <h4 className="fw-bold mb-3">Unable to Start Quiz</h4>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/student/dashboard')}
                        >
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
                                <span className="me-2"><svg xmlns="http://www.w3.org/2000/svg"
                                    width="24" height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                </span>
                                <h4 className={`mb-0 ${timeLeft < 300 ? 'text-danger' : 'text-white'}`}>
                                    {formatTime(timeLeft)}
                                </h4>
                            </div>
                        </div>
                        <div className="col-md-4 text-end">
                            <span className="badge bg-success me-2">
                                {getAnsweredCount()} / {quiz.questions.length} Answered
                            </span>
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="progress" style={{ height: '4px' }}>
                <div
                    className="progress-bar bg-success"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="container-fluid py-4">
                <div className="row">
                    
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className={`badge bg-${currentQ.difficulty === 'easy' ? 'success' :
                                            currentQ.difficulty === 'medium' ? 'warning' : 'danger'
                                        }`}>
                                        {currentQ.difficulty.toUpperCase()}
                                    </span>
                                    <span className="text-muted">Marks: {currentQ.marks}</span>
                                </div>

                                <h4 className="fw-bold mb-4">
                                    {currentQuestion + 1}. {currentQ.questionText}
                                </h4>

                                <div className="row g-3">
                                    {currentQ.options.map((option, index) => (
                                        <div key={index} className="col-12">
                                            <div
                                                className={`card border-2 cursor-pointer ${answers[currentQ._id] === index + 1
                                                        ? 'border-success bg-success bg-opacity-10'
                                                        : 'border-secondary'
                                                    }`}
                                                onClick={() => handleAnswerSelect(currentQ._id, index)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="card-body py-3 d-flex align-items-center">
                                                    <div
                                                        className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${answers[currentQ._id] === index + 1
                                                                ? 'bg-success text-white'
                                                                : 'bg-light'
                                                            }`}
                                                        style={{ width: '40px', height: '40px', minWidth: '40px' }}
                                                    >
                                                        <strong>{String.fromCharCode(65 + index)}</strong>
                                                    </div>
                                                    <span className="fw-medium">{option.optionText}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handlePrevious}
                                        disabled={currentQuestion === 0}
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handleNext}
                                        disabled={currentQuestion === quiz.questions.length - 1}
                                    >
                                        Next →
                                    </button>
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
                                                className={`btn btn-sm w-100 ${currentQuestion === index
                                                        ? 'btn-primary'
                                                        : answers[q._id]
                                                            ? 'btn-success'
                                                            : 'btn-outline-secondary'
                                                    }`}
                                                onClick={() => handleQuestionJump(index)}
                                            >
                                                {index + 1}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3">
                                    <small className="text-muted d-block mb-1">
                                        <span className="badge bg-success me-1"></span> Answered
                                    </small>
                                    <small className="text-muted d-block mb-1">
                                        <span className="badge bg-outline-secondary me-1"></span> Not Answered
                                    </small>
                                    <small className="text-muted d-block">
                                        <span className="badge bg-primary me-1"></span> Current
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
