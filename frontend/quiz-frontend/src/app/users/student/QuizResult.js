import { useState, useEffect,useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8700/api';

export default function QuizResult() {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAnswers, setShowAnswers] = useState(false);

    const getAuthToken = () => localStorage.getItem('token');
    const getAxiosConfig = () => ({
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        fetchResult();
    }, [attemptId]);

    const fetchResult = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/student/quiz/result/${attemptId}`,
                getAxiosConfig()
            );

            if (response.data.success) {
                setResult(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load result');
            console.error('Fetch result error:', err);
        } finally {
            setLoading(false);
        }
    });

    const getGradeInfo = (percentage) => {
        if (percentage >= 90) return { grade: 'A+', color: 'success', message: 'Excellent!' };
        if (percentage >= 80) return { grade: 'A', color: 'success', message: 'Great Job!' };
        if (percentage >= 70) return { grade: 'B', color: 'primary', message: 'Good Work!' };
        if (percentage >= 60) return { grade: 'C', color: 'warning', message: 'Not Bad!' };
        if (percentage >= 50) return { grade: 'D', color: 'warning', message: 'Keep Trying!' };
        return { grade: 'F', color: 'danger', message: 'Need Improvement' };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} min ${secs} sec`;
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="alert alert-danger">{error || 'Result not found'}</div>
            </div>
        );
    }

    const gradeInfo = getGradeInfo(result.percentage);

    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
              
                <div className="card border-0 shadow-lg mb-4">
                    <div className="card-body p-5 text-center">
                        <div className={`display-1 text-${gradeInfo.color} mb-3`}>🎉</div>
                        <h2 className="fw-bold mb-2">Quiz Completed!</h2>
                        <p className="text-muted mb-4">{gradeInfo.message}</p>

                        <div className={`display-3 fw-bold text-${gradeInfo.color} mb-3`}>
                            {result.percentage.toFixed(2)}%
                        </div>
                        <h4 className={`text-${gradeInfo.color} mb-4`}>Grade: {gradeInfo.grade}</h4>

                        <div className="row g-4 mt-4">
                            <div className="col-md-3">
                                <div className="p-3 bg-light rounded">
                                    <h5 className="text-success mb-1">{result.correctAnswers}</h5>
                                    <small className="text-muted">Correct</small>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light rounded">
                                    <h5 className="text-danger mb-1">{result.wrongAnswers}</h5>
                                    <small className="text-muted">Wrong</small>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light rounded">
                                    <h5 className="text-primary mb-1">{result.marksObtained}/{result.totalMarks}</h5>
                                    <small className="text-muted">Marks</small>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light rounded">
                                    <h5 className="text-info mb-1">{formatTime(result.timeTaken)}</h5>
                                    <small className="text-muted">Time Taken</small>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 d-flex gap-3 justify-content-center">
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate('/student/dashboard')}
                            >
                                Back to Dashboard
                            </button>
                            <button 
                                className="btn btn-outline-secondary"
                                onClick={() => setShowAnswers(!showAnswers)}
                            >
                                {showAnswers ? 'Hide' : 'Show'} Answers
                            </button>
                        </div>
                    </div>
                </div>

                {showAnswers && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Question-wise Analysis</h5>
                            {result.questions.map((q, index) => {
                                const question = q.question;
                                const isCorrect = q.isCorrect;
                                
                                return (
                                    <div key={index} className={`card mb-3 border-${isCorrect ? 'success' : 'danger'}`}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h6 className="fw-bold mb-0">
                                                    Question {index + 1}: {question.questionText}
                                                </h6>
                                                <span className={`badge bg-${isCorrect ? 'success' : 'danger'}`}>
                                                    {isCorrect ? '✓ Correct' : '✗ Wrong'}
                                                </span>
                                            </div>

                                            <div className="row g-2">
                                                {question.options.map((option, optIndex) => {
                                                    const isSelected = q.selectedAnswer === (optIndex + 1);
                                                    const isCorrectOption = option.isCorrect;
                                                    
                                                    return (
                                                        <div key={optIndex} className="col-12">
                                                            <div className={`p-2 rounded border ${
                                                                isCorrectOption ? 'border-success bg-success bg-opacity-10' :
                                                                isSelected && !isCorrect ? 'border-danger bg-danger bg-opacity-10' :
                                                                'border-light'
                                                            }`}>
                                                                <div className="d-flex align-items-center">
                                                                    <strong className="me-2">{String.fromCharCode(65 + optIndex)}.</strong>
                                                                    <span>{option.optionText}</span>
                                                                    {isCorrectOption && <span className="ms-auto text-success">✓ Correct Answer</span>}
                                                                    {isSelected && !isCorrect && <span className="ms-auto text-danger">✗ Your Answer</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    Marks: {q.marksObtained}/{question.marks} | 
                                                    Difficulty: <span className={`badge badge-sm bg-${
                                                        question.difficulty === 'easy' ? 'success' :
                                                        question.difficulty === 'medium' ? 'warning' : 'danger'
                                                    }`}>{question.difficulty}</span>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}