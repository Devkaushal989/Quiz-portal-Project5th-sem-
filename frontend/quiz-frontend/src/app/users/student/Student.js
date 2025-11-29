import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8700/api';

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState('Courses');
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [quizHistory, setQuizHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [studentInfo, setStudentInfo] = useState(null);

    const getAuthToken = () => localStorage.getItem('token');
    const getAxiosConfig = () => ({
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setStudentInfo(user);
        fetchAssignedQuizzes();
        fetchQuizHistory();
    }, []);

    const fetchAssignedQuizzes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/assignments/student/assignments`,
                getAxiosConfig()
            );
            if (response.data.success) {
                setAssignments(response.data.data);

                const assignedCourses = response.data.data.map(assignment => ({
                    ...assignment.course,
                    assignmentId: assignment._id,
                    dueDate: assignment.dueDate,
                    status: assignment.status
                }));
                setCourses(assignedCourses);
            }
        } catch (err) {
            setError('Failed to load assigned quizzes');
            console.error('Fetch assigned quizzes error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizHistory = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/student/quiz/history`,
                getAxiosConfig()
            );
            if (response.data.success) {
                setQuizHistory(response.data.data);
            }
        } catch (err) {
            console.error('Fetch quiz history error:', err);
        }
    };

    const handleStartQuiz = (courseId, assignmentId) => {

        if (assignmentId) {
            window.location.href = `/student/quiz/${courseId}?assignmentId=${assignmentId}`;
        } else {
            window.location.href = `/student/quiz/${courseId}`;
        }
    };

    const getGradeColor = (percentage) => {
        if (percentage >= 90) return 'success';
        if (percentage >= 75) return 'primary';
        if (percentage >= 60) return 'warning';
        return 'danger';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="badge bg-success">Completed</span>;
            case 'pending':
                return <span className="badge bg-warning">Pending</span>;
            case 'overdue':
                return <span className="badge bg-danger">Overdue</span>;
            default:
                return <span className="badge bg-secondary">Not Started</span>;
        }
    };

    const isOverdue = (dueDate) => {
        return dueDate && new Date(dueDate) < new Date();
    };

    const getDaysRemaining = (dueDate) => {
        if (!dueDate) return null;
        const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Overdue';
        if (days === 0) return 'Due Today';
        if (days === 1) return '1 day left';
        return `${days} days left`;
    };

    return (
        <>
            <div className="min-vh-100 bg-light">
                <div className="container-fluid">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-md-3 col-lg-2 bg-dark vh-100 p-0">
                            <div className="p-3">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary">
                                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '40px', height: '40px' }}>
                                        <span className="text-white"><svg xmlns="http://www.w3.org/2000/svg"
                                            width="28" height="28"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round">

                                            <circle cx="12" cy="6" r="3"></circle>

                                            <path d="M6 20v-2c0-3 2-5 6-5s6 2 6 5v2"></path>

                                            <polygon points="12 2 4 5 12 8 20 5 12 2"></polygon>
                                            <line x1="20" y1="5" x2="20" y2="8"></line>

                                        </svg>
                                        </span>
                                    </div>
                                    <span className="fw-medium text-light">Student</span>
                                </div>
                                <nav>
                                    <ul className="nav flex-column">
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Dashboard' ? 'bg-success text-white' : 'text-light bg-transparent'}`}
                                                onClick={() => setActiveTab('Dashboard')}
                                            >
                                                <span className="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                                    </svg>
                                                </span> Dashboard
                                            </button>
                                        </li>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Courses' ? 'bg-success text-white' : 'text-light bg-transparent'}`}
                                                onClick={() => setActiveTab('Courses')}
                                            >
                                                <span className="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                                                        <polygon points="12 15 17 21 7 21 12 15"></polygon>
                                                    </svg>
                                                </span> Assigned Quizzes
                                            </button>
                                        </li>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'History' ? 'bg-success text-white' : 'text-light bg-transparent'}`}
                                                onClick={() => setActiveTab('History')}
                                            >
                                                <span className="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="9 11 12 14 22 4"></polyline>
                                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                                    </svg>
                                                </span> My Results
                                            </button>
                                        </li>
                                        <li className="nav-item mb-1">
                                            <button
                                                className="nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded text-light bg-transparent hover-danger"
                                                onClick={() => {
                                                    // Clear all authentication data
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('user');
                                                    // Redirect to login page
                                                    window.location.href = '/';
                                                }}
                                                style={{
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#dc3545';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#f8f9fa';
                                                }}
                                            >
                                                <span className="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="20" height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="red"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round">

                                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                        <polyline points="16 17 21 12 16 7"></polyline>
                                                        <line x1="21" y1="12" x2="9" y2="12"></line>

                                                    </svg>

                                                </span>
                                                <span style={{ color: '#dc3545', fontWeight: '500' }}>Logout</span>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-md-9 col-lg-10 p-4">
                            {/* Header */}
                            <div className="mb-4">
                                <h2 className="h4 fw-bold">Welcome, {studentInfo?.fullName || 'Student'}!</h2>
                                <p className="text-muted">Ready to test your knowledge?</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                </div>
                            )}

                            {/* Assigned Quizzes */}
                            {activeTab === 'Courses' && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bold mb-0">My Assigned Quizzes</h4>
                                        <span className="badge bg-primary">{courses.length} Total</span>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : courses.length === 0 ? (
                                        <div className="alert alert-info">
                                            <h5 className="alert-heading">No Quizzes Assigned Yet</h5>
                                            <p className="mb-0">Your teacher hasn't assigned any quizzes to you yet. Please check back later.</p>
                                        </div>
                                    ) : (
                                        <div className="row g-4">
                                            {courses.map((course) => {
                                                const overdue = isOverdue(course.dueDate);
                                                const daysRemaining = getDaysRemaining(course.dueDate);

                                                return (
                                                    <div key={course._id} className="col-md-6 col-lg-4">
                                                        <div className={`card border-0 shadow-sm h-100 ${overdue ? 'border-danger border-2' : ''}`}>
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                                    <div className="bg-primary bg-opacity-10 rounded p-2">
                                                                        <span style={{ fontSize: '24px' }}><svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="50" height="50"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            stroke-width="2"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round">


                                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                                            <polyline points="14 2 14 8 20 8"></polyline>


                                                                            <path d="M15 12l5 5"></path>
                                                                            <path d="M16.5 10.5l-7 7L9 21l3.5-.5 7-7z"></path>

                                                                        </svg>
                                                                        </span>
                                                                    </div>
                                                                    {getStatusBadge(course.status)}
                                                                </div>

                                                                <h5 className="card-title fw-bold mb-2">
                                                                    {course.courseName}
                                                                </h5>
                                                                <p className="text-muted small mb-3">
                                                                    {course.questionPool?.poolName || 'Quiz Pool'}
                                                                </p>

                                                                {course.dueDate && (
                                                                    <div className={`alert ${overdue ? 'alert-danger' : 'alert-warning'} py-2 px-3 mb-3`}>
                                                                        <small className="fw-medium">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                width="15" height="15"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                stroke-width="2"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round">
                                                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                                                            </svg>
                                                                            {daysRemaining}
                                                                        </small>
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            Due: {new Date(course.dueDate).toLocaleDateString('en-US', {
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </small>
                                                                    </div>
                                                                )}

                                                                <div className="mb-3">
                                                                    <div className="d-flex justify-content-between mb-2">
                                                                        <span className="small text-muted">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                width="20" height="20"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                stroke-width="2"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round">
                                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                                <polyline points="12 6 12 12 16 14"></polyline>
                                                                            </svg>
                                                                            {course.duration} minutes
                                                                        </span>
                                                                        <span className="small text-muted">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                width="20" height="20"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                stroke-width="2"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round">
                                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                                                <line x1="12" y1="17" x2="12" y2="17"></line>
                                                                            </svg>
                                                                            20 Questions
                                                                        </span>
                                                                    </div>
                                                                    <div className="d-flex justify-content-between">
                                                                        <span className="small text-muted">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                width="28" height="28"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                stroke-width="2"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round">


                                                                                <path fill="#F4D03F" stroke="currentColor"
                                                                                    d="M3 7a2 2 0 0 1 2-2h4l2 3h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                                            </svg>
                                                                            {course.questionPool?.category || 'General'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {course.description && (
                                                                    <p className="card-text small text-muted mb-3">
                                                                        {course.description.substring(0, 100)}
                                                                        {course.description.length > 100 && '...'}
                                                                    </p>
                                                                )}

                                                                <button
                                                                    className={`btn ${course.status === 'completed' ? 'btn-outline-success' : overdue ? 'btn-danger' : 'btn-success'} w-100`}
                                                                    onClick={() => handleStartQuiz(course._id, course.assignmentId)}
                                                                    disabled={course.status === 'completed'}
                                                                >
                                                                    {course.status === 'completed' ? '✓ Completed' : overdue ? 'Start Now (Overdue)' : 'Start Quiz'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quiz History */}
                            {activeTab === 'History' && (
                                <div>
                                    <h4 className="fw-bold mb-4">My Quiz Results</h4>
                                    {quizHistory.length === 0 ? (
                                        <div className="alert alert-info">
                                            You haven't taken any quizzes yet. Start your first quiz!
                                        </div>
                                    ) : (
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr className="border-bottom">
                                                                <th>Course</th>
                                                                <th>Date</th>
                                                                <th>Score</th>
                                                                <th>Percentage</th>
                                                                <th>Time Taken</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {quizHistory.map((attempt) => (
                                                                <tr key={attempt._id}>
                                                                    <td className="fw-medium">
                                                                        {attempt.course?.courseName}
                                                                    </td>
                                                                    <td>
                                                                        {new Date(attempt.completedAt).toLocaleDateString()}
                                                                    </td>
                                                                    <td>
                                                                        {attempt.marksObtained}/{attempt.totalMarks}
                                                                    </td>
                                                                    <td>
                                                                        <span className={`badge bg-${getGradeColor(attempt.percentage)}`}>
                                                                            {attempt.percentage.toFixed(2)}%
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        {Math.floor(attempt.timeTaken / 60)} min {attempt.timeTaken % 60} sec
                                                                    </td>
                                                                    <td>
                                                                        <Link
                                                                            to={`/student/result/${attempt._id}`}
                                                                            className="btn btn-sm btn-outline-primary"
                                                                        >
                                                                            View Details
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Dashboard Overview */}
                            {activeTab === 'Dashboard' && (
                                <div>
                                    <div className="row g-4 mb-4">
                                        <div className="col-md-3">
                                            <div className="card border-0 shadow-sm">
                                                <div className="card-body text-center">
                                                    <div className="mb-2">
                                                        <span style={{ fontSize: '32px' }}><svg xmlns="http://www.w3.org/2000/svg"
                                                            width="35" height="35"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round">

                                                            <path d="M4 19h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4z"></path>


                                                            <path d="M10 19h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-6z"></path>


                                                            <path d="M16 17l3 1.5a2 2 0 0 0 2-1l1-2.2a2 2 0 0 0-1-2.6L18 10"></path>

                                                        </svg>
                                                        </span>
                                                    </div>
                                                    <h3 className="text-primary mb-1">{courses.length}</h3>
                                                    <p className="text-muted mb-0 small">Assigned Quizzes</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card border-0 shadow-sm">
                                                <div className="card-body text-center">
                                                    <div className="mb-2">
                                                        <span style={{ fontSize: '32px' }}><svg xmlns="http://www.w3.org/2000/svg"
                                                            width="35" height="35"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round">

                                                            <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>


                                                            <polyline points="7 12 11 16 17 8"></polyline>

                                                        </svg>
                                                        </span>
                                                    </div>
                                                    <h3 className="text-success mb-1">{quizHistory.length}</h3>
                                                    <p className="text-muted mb-0 small">Completed Quizzes</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card border-0 shadow-sm">
                                                <div className="card-body text-center">
                                                    <div className="mb-2">
                                                        <span style={{ fontSize: '32px' }}><svg xmlns="http://www.w3.org/2000/svg"
                                                            width="35" height="35"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round">

                                                            <rect x="3" y="3" width="18" height="18" rx="3"></rect>


                                                            <line x1="8" y1="17" x2="8" y2="11"></line>
                                                            <line x1="12" y1="17" x2="12" y2="8"></line>
                                                            <line x1="16" y1="17" x2="16" y2="6"></line>

                                                        </svg>
                                                        </span>
                                                    </div>
                                                    <h3 className="text-warning mb-1">
                                                        {quizHistory.length > 0
                                                            ? (quizHistory.reduce((sum, a) => sum + a.percentage, 0) / quizHistory.length).toFixed(1)
                                                            : 0}%
                                                    </h3>
                                                    <p className="text-muted mb-0 small">Average Score</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card border-0 shadow-sm">
                                                <div className="card-body text-center">
                                                    <div className="mb-2">
                                                        <span style={{ fontSize: '32px' }}><svg xmlns="http://www.w3.org/2000/svg"
                                                            width="35" height="35"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round">


                                                            <line x1="6" y1="2" x2="18" y2="2"></line>

                                                            <line x1="6" y1="22" x2="18" y2="22"></line>

                                                            <path d="M6 2c0 5 6 7 6 10s-6 5-6 10"></path>
                                                            <path d="M18 2c0 5-6 7-6 10s6 5 6 10"></path>

                                                            <path d="M9 7h6"></path>

                                                            <path d="M10 17h4"></path>

                                                        </svg>
                                                        </span>
                                                    </div>
                                                    <h3 className="text-danger mb-1">
                                                        {courses.filter(c => c.status === 'pending' || !c.status).length}
                                                    </h3>
                                                    <p className="text-muted mb-0 small">Pending Quizzes</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-4">
                                        <div className="col-md-8">
                                            <h5 className="fw-bold mb-3">Recent Quiz Results</h5>
                                            {quizHistory.length === 0 ? (
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body text-center py-5">
                                                        <span style={{ fontSize: '48px' }}>📝</span>
                                                        <p className="text-muted mt-3 mb-0">No quiz results yet. Start your first quiz!</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                quizHistory.slice(0, 5).map((attempt) => (
                                                    <div key={attempt._id} className="card border-0 shadow-sm mb-3">
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <h6 className="fw-bold mb-1">{attempt.course?.courseName}</h6>
                                                                    <small className="text-muted">
                                                                        {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </small>
                                                                </div>
                                                                <div className="text-end">
                                                                    <h5 className={`text-${getGradeColor(attempt.percentage)} mb-0`}>
                                                                        {attempt.percentage.toFixed(1)}%
                                                                    </h5>
                                                                    <small className="text-muted">
                                                                        {attempt.marksObtained}/{attempt.totalMarks} marks
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="col-md-4">
                                            <h5 className="fw-bold mb-3">Upcoming Deadlines</h5>
                                            {courses
                                                .filter(c => c.dueDate && (c.status === 'pending' || !c.status))
                                                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                                                .slice(0, 5)
                                                .map((course) => {
                                                    const overdue = isOverdue(course.dueDate);
                                                    const daysRemaining = getDaysRemaining(course.dueDate);

                                                    return (
                                                        <div key={course._id} className={`card border-0 shadow-sm mb-3 ${overdue ? 'border-danger border-2' : ''}`}>
                                                            <div className="card-body">
                                                                <h6 className="fw-bold mb-2">{course.courseName}</h6>
                                                                <div className={`badge ${overdue ? 'bg-danger' : 'bg-warning'} mb-2`}>
                                                                    {daysRemaining}
                                                                </div>
                                                                <p className="small text-muted mb-0">
                                                                    {new Date(course.dueDate).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                            {courses.filter(c => c.dueDate && (c.status === 'pending' || !c.status)).length === 0 && (
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body text-center py-4">
                                                        <span style={{ fontSize: '32px' }}>🎉</span>
                                                        <p className="text-muted mt-2 mb-0 small">No upcoming deadlines</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}