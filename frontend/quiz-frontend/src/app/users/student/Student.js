import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './student_dashboard.css';
import quizLogo from '../../images/quiz_logo.png';

const Sidebar = ({
    role,
    activeTab,
    profileDetail1Label,
    profileDetail1Value,
    profileDetail2Label,
    profileDetail2Value,
    navItems,
    onNavClick,
    sidebarOpen,
    toggleSidebar,
    closeSidebar
}) => {
    const getUserData = () => {
        const userKey = role === 'teacher' ? 'user' : 'user';
        try {
            return JSON.parse(localStorage.getItem(userKey) || '{}');
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e);
            return {};
        }
    };

    const user = getUserData();
    const accountType = role === 'teacher' ? 'Teacher Account' : 'Student Account';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const navLinkStyle = (isActive) => ({
        backgroundColor: isActive ? '#198754' : 'transparent',
        color: isActive ? 'white' : '#f7f9fcff',
    });

    const navLinkHoverStyle = (e, isActive) => {
        if (!isActive) {
            e.currentTarget.style.backgroundColor = '#0d0d0dff';
            e.currentTarget.style.color = '#f7f9fcff';
        }
    };

    const navLinkLeaveStyle = (e, isActive) => {
        if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#f7f9fcff';
        }
    };

    return (
        <>
            {/* Sidebar Overlay (Mobile Only) */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>

            <div 
                className={`bg-dark border-end sidebar-container ${sidebarOpen ? 'active' : ''}`}
            >
                {/* Close button for mobile sidebar */}
                <button 
                    className="btn btn-close btn-close-white d-lg-none position-absolute p-3" 
                    onClick={closeSidebar} 
                    style={{top: '10px', right: '10px', zIndex: 1100}}
                ></button>

                {/* Logo Section */}
                <div className="py-3 px-3 border-bottom d-flex align-items-center gap-3">
                    <img
                        src={quizLogo}
                        alt="Quiz Logo"
                        style={{
                            width: '50px',
                            height: 'auto',
                            objectFit: 'contain',
                            borderRadius: '8px'
                        }}
                    />
                    <h4 className="fw-bold mb-0" style={{ color: '#f4f6f9ff' }}>
                        Quiz-o-Tron
                    </h4>
                </div>

                {/* Profile Section */}
                <div className="text-center pt-4 pb-3 border-bottom">
                    <div className="d-flex justify-content-center mb-3">
                        <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center position-relative"
                            style={{ width: '100px', height: '100px', border: '3px solid #198754' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <div
                                className="position-absolute bg-primary text-white px-2 py-1 rounded"
                                style={{ bottom: '0', fontSize: '10px', fontWeight: 'bold' }}
                            >
                                2025-26
                            </div>
                        </div>
                    </div>
                    <h6 className="fw-bold mb-1" style={{ color: '#f4f6f9ff' }}>
                        {user?.fullName || (role === 'teacher' ? 'Teacher Name' : 'Student Name')}
                    </h6>
                    <p className="text-light small mb-3">{accountType}</p>
                    <div className="d-flex justify-content-center gap-3 px-3">
                        <div className="text-center flex-fill">
                            <div className="bg-light rounded p-2">
                                <small className="text-muted d-block" style={{ fontSize: '10px' }}>{profileDetail1Label}</small>
                                <small className="fw-bold text-dark">{profileDetail1Value || 'N/A'}</small>
                            </div>
                        </div>
                        <div className="text-center flex-fill">
                            <div className="bg-light rounded p-2">
                                <small className="text-muted d-block" style={{ fontSize: '10px' }}>{profileDetail2Label}</small>
                                <small className={`fw-bold text-primary`}>{profileDetail2Value || 'N/A'}</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="py-3">
                    <ul className="nav flex-column px-2">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.label;
                            return (
                                <li className="nav-item mb-1" key={item.label}>
                                    <Link to={item.path} className='text-decoration-none'>
                                        <button
                                            className="nav-link w-100 text-start border-0 d-flex align-items-center py-3 px-3 rounded sidebar-nav-btn"
                                            style={navLinkStyle(isActive)}
                                            onClick={(e) => {
                                                if (onNavClick) {
                                                    onNavClick(item.label);
                                                    closeSidebar(); // Close sidebar on mobile navigation
                                                }
                                            }}
                                            onMouseEnter={(e) => navLinkHoverStyle(e, isActive)}
                                            onMouseLeave={(e) => navLinkLeaveStyle(e, isActive)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-3" dangerouslySetInnerHTML={{ __html: item.svgPath }} />
                                            <span className="fw-medium">{item.label}</span>
                                        </button>
                                    </Link>
                                </li>
                            );
                        })}

                        <li className="nav-item mb-1">
                            <button
                                className="nav-link w-100 text-start border-0 d-flex align-items-center py-3 px-3 rounded logout-btn"
                                onClick={handleLogout}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-3 logout-svg">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span className="fw-medium">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

const API_BASE_URL = 'http://localhost:8700/api';

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [quizHistory, setQuizHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [studentInfo, setStudentInfo] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [loadingAttempt, setLoadingAttempt] = useState(false);
    const [attemptError, setAttemptError] = useState('');

    // Sidebar state for mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const studentNavItems = [
        {
            label: 'Dashboard',
            path: '#dashboard',
            svgPath: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
        },
        {
            label: 'Assigned Quizzes',
            path: '#assigned-quizzes',
            svgPath: '<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon>',
        },
        {
            label: 'My Results',
            path: '#my-results',
            svgPath: '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
        }
    ];

    const getAuthToken = () => localStorage.getItem('token');
    const getAxiosConfig = () => ({
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        let initialTab = 'Dashboard';
        if (hash === 'assigned-quizzes') {
            initialTab = 'Assigned Quizzes';
        } else if (hash === 'my-results') {
            initialTab = 'My Results';
        }
        setActiveTab(initialTab);

        const user = JSON.parse(localStorage.getItem('user') || '{}');
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
                setQuizHistory(response.data.data || []);
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

    const renderOptionCell = (optionText, isCorrect, isSelected) => {
        if (isSelected && !isCorrect) {
            return (
                <td className="align-middle text-danger fw-bold" style={{ background: '#fff5f5' }}>
                    {optionText}
                </td>
            );
        }
        if (isCorrect) {
            return (
                <td className="align-middle text-success fw-bold" style={{ background: '#f3fff5' }}>
                    {optionText}
                </td>
            );
        }
        return <td className="align-middle text-muted">{optionText}</td>;
    };

    const normalizeAttempt = (data) => {
        const attempt = data || {};
        attempt.questions = Array.isArray(attempt.questions) ? attempt.questions : [];

        attempt.questions = attempt.questions.map((q) => {
            const question = { ...q };
            if (!Array.isArray(question.options)) question.options = [];
            question.options = question.options.map(opt => (typeof opt === 'string' ? { optionText: opt } : (opt || { optionText: '-' })));

            const safeToIndex = (val) => {
                if (val === undefined || val === null) return null;
                if (typeof val === 'number') {
                    if (val >= 0 && val < question.options.length) return val + 1;
                    return val;
                }
                if (typeof val === 'string') {
                    const s = val.trim();
                    if (/^[A-Za-z]$/.test(s)) {
                        return s.toUpperCase().charCodeAt(0) - 65 + 1;
                    }
                    const num = Number(s);
                    if (!isNaN(num)) {
                        if (num >= 0 && num < question.options.length) return num + 1;
                        return num;
                    }
                }
                return null;
            };

            question.correctAnswer = safeToIndex(question.correctAnswer);
            question.studentSelectedAnswer = safeToIndex(question.studentSelectedAnswer);

            return question;
        });

        attempt.totalQuestions = attempt.totalQuestions ?? attempt.questions.length;
        attempt.correctAnswers = attempt.correctAnswers ?? attempt.questions.filter(q => q.studentSelectedAnswer !== null && q.studentSelectedAnswer === q.correctAnswer).length;
        attempt.wrongAnswers = attempt.wrongAnswers ?? (attempt.totalQuestions - (attempt.correctAnswers || 0));
        attempt.percentage = attempt.percentage ?? (attempt.totalQuestions ? ((attempt.correctAnswers / attempt.totalQuestions) * 100) : 0);

        return attempt;
    };

    const openAttemptModal = async (attemptId) => {
        try {
            setLoadingAttempt(true);
            setAttemptError('');
            setSelectedAttempt(null);
            setShowModal(true);

            const res = await axios.get(`${API_BASE_URL}/student/quiz/result/${attemptId}`, getAxiosConfig());
            if (res.data?.success) {
                const normalized = normalizeAttempt(res.data.data || {});
                setSelectedAttempt(normalized);
            } else {
                setAttemptError(res.data?.message || 'Failed to fetch attempt');
            }
        } catch (err) {
            console.error('Fetch attempt error:', err);
            setAttemptError(err.response?.data?.message || 'Failed to fetch attempt');
        } finally {
            setLoadingAttempt(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedAttempt(null);
        setAttemptError('');
    };

    const handleSidebarNav = (label) => {
        setActiveTab(label);
    };

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
            {/* INLINE CSS block for responsiveness and styling */}
            <style>
                {`
                /* Base Styles & Animations */
                body {
                    background-color: #f7f9fc;
                    overflow-x: hidden;
                }
                .card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border-radius: 12px;
                    border: none;
                }
                .card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
                }
                .sidebar-nav-btn {
                    transition: background-color 0.2s, color 0.2s, box-shadow 0.3s;
                    border-radius: 8px !important;
                }
                .sidebar-nav-btn:hover:not([style*="background-color: rgb(25, 135, 84)"]) {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                }
                .logout-btn {
                    color: #dc3545 !important;
                    background-color: transparent !important;
                    transition: all 0.3s ease;
                }
                .logout-btn:hover {
                    background-color: #dc3545 !important;
                    color: white !important;
                }
                .logout-btn:hover .logout-svg {
                    stroke: white !important;
                }
                .logout-svg {
                    stroke: #dc3545;
                    transition: stroke 0.3s ease;
                }
                .main-content-wrapper {
                    transition: margin-left 0.3s ease-in-out;
                    margin-left: 280px;
                    min-height: 100vh;
                    width: calc(100% - 280px);
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                .modal.show {
                    animation: fadeIn 0.3s forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Sidebar Container */
                .sidebar-container {
                    width: 280px;
                    position: fixed;
                    left: 0;
                    top: 0;
                    height: 100vh;
                    overflow-y: auto;
                    z-index: 1050;
                    transition: transform 0.3s ease-in-out;
                }

                /* Mobile & Tablet Overrides (Hamburger Menu Implementation) */
                @media (max-width: 991.98px) {
                    .sidebar-container {
                        transform: translateX(-280px);
                        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
                    }
                    .sidebar-container.active {
                        transform: translateX(0);
                    }
                    .main-content-wrapper {
                        margin-left: 0 !important;
                        width: 100%;
                    }
                    .mobile-header {
                        position: sticky;
                        top: 0;
                        z-index: 1000;
                        background-color: #ffffff;
                        border-bottom: 1px solid #e0e0e0;
                        padding: 1rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .sidebar-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 1040;
                        display: none;
                    }
                    .sidebar-overlay.active {
                        display: block;
                    }
                    .stat-card-row > div {
                        flex: 0 0 100%;
                        max-width: 100%;
                        margin-bottom: 0.75rem !important;
                    }
                    .d-flex.justify-content-between.align-items-center {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 1rem;
                    }
                    /* Make quiz cards full width on mobile */
                    .col-md-6.col-lg-4 {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }
                }
                `}
            </style>

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" crossOrigin="anonymous" />

            <Sidebar
                role="student"
                activeTab={activeTab}
                navItems={studentNavItems}
                profileDetail1Label="Program"
                profileDetail1Value={studentInfo?.program || 'N/A'}
                profileDetail2Label="Semester"
                profileDetail2Value={studentInfo?.semester ? `Sem ${studentInfo.semester}` : 'N/A'}
                onNavClick={handleSidebarNav}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={closeSidebar}
            />

            {/* Mobile Header (Visible below lg breakpoint) */}
            <div className="mobile-header d-lg-none">
                <h4 className="fw-bold mb-0">
                    {activeTab === 'Dashboard' ? 'Dashboard' : 
                     activeTab === 'Assigned Quizzes' ? 'My Quizzes' : 
                     'My Results'}
                </h4>
                <button className="btn btn-dark" onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-grow-1 bg-light main-content-wrapper">
                <div className="p-4">
                    {/* Header */}
                    <div className="mb-4 d-none d-lg-block">
                        <h2 className="h4 fw-bold">Welcome, {studentInfo?.fullName || 'Student'}!</h2>
                        <p className="text-muted">Ready to test your knowledge?</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                    )}

                    {/* Assigned Quizzes (Courses View) */}
                    {activeTab === 'Assigned Quizzes' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0 d-none d-lg-block">My Assigned Quizzes</h4>
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
                                                                <span style={{ fontSize: '24px' }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <circle cx="12" cy="12" r="10"></circle>
                                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                                    </svg>
                                                                    {course.duration} minutes
                                                                </span>
                                                                <span className="small text-muted">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <circle cx="12" cy="12" r="10"></circle>
                                                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                                        <line x1="12" y1="17" x2="12" y2="17"></line>
                                                                    </svg>
                                                                    20 Questions
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

                    {activeTab === 'My Results' && (
                        <div>
                            <h4 className="fw-bold mb-4 d-none d-lg-block">My Quiz Results</h4>
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
                                                                    {attempt.percentage?.toFixed(2) ?? '0.00'}%
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {attempt.timeTaken ? `${Math.floor(attempt.timeTaken / 60)} min ${attempt.timeTaken % 60} sec` : '-'}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => openAttemptModal(attempt._id)}
                                                                >
                                                                    View Details
                                                                </button>
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

                    {activeTab === 'Dashboard' && (
                        <div>
                            <div className="row g-4 mb-4 stat-card-row">
                                <div className="col-md-3">
                                    <div className="card border-0 shadow-sm stat-card">
                                        <div className="card-body text-center">
                                            <div className="mb-2">
                                                <span style={{ fontSize: '32px' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                    <div className="card border-0 shadow-sm stat-card">
                                        <div className="card-body text-center">
                                            <div className="mb-2">
                                                <span style={{ fontSize: '32px' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                    <div className="card border-0 shadow-sm stat-card">
                                        <div className="card-body text-center">
                                            <div className="mb-2">
                                                <span style={{ fontSize: '32px' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="3" width="18" height="18" rx="3"></rect>
                                                        <line x1="8" y1="17" x2="8" y2="11"></line>
                                                        <line x1="12" y1="17" x2="12" y2="8"></line>
                                                        <line x1="16" y1="17" x2="16" y2="6"></line>
                                                    </svg>
                                                </span>
                                            </div>
                                            <h3 className="text-warning mb-1">
                                                {quizHistory.length > 0
                                                    ? (quizHistory.reduce((sum, a) => sum + (a.percentage || 0), 0) / quizHistory.length).toFixed(1)
                                                    : 0}%
                                            </h3>
                                            <p className="text-muted mb-0 small">Average Score</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card border-0 shadow-sm stat-card">
                                        <div className="card-body text-center">
                                            <div className="mb-2">
                                                <span style={{ fontSize: '32px' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                                                {attempt.percentage?.toFixed(1) ?? '0.0'}%
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
                                                        <div className={`badge ${overdue ? 'bg-danger' : 'bg-warning'} mb-2`}>{daysRemaining}</div>
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

            {/* Modal for Quiz Details */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedAttempt?.course?.courseName || 'Quiz Details'}</h5>
                                <button type="button" className="btn-close" onClick={closeModal} />
                            </div>

                            <div className="modal-body">
                                {loadingAttempt ? (
                                    <div className="text-center py-4">Loading attempt...</div>
                                ) : attemptError ? (
                                    <div className="alert alert-danger">{attemptError}</div>
                                ) : !selectedAttempt ? (
                                    <div className="text-center py-4 text-muted">No data.</div>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <div className="row">
                                                <div className="col-md-3"><strong>Quiz Date</strong><div className="text-muted">{new Date(selectedAttempt.completedAt || selectedAttempt.createdAt).toLocaleDateString()}</div></div>
                                                <div className="col-md-3"><strong>Start Time</strong><div className="text-muted">{new Date(selectedAttempt.createdAt).toLocaleTimeString()}</div></div>
                                                <div className="col-md-3"><strong>End Time</strong><div className="text-muted">{selectedAttempt.completedAt ? new Date(selectedAttempt.completedAt).toLocaleTimeString() : '-'}</div></div>
                                                <div className="col-md-3"><strong>No. of Questions</strong><div className="text-muted">{selectedAttempt.totalQuestions || (selectedAttempt.questions || []).length}</div></div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table table-sm table-hover align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: '40px' }}>S.No</th>
                                                        <th>Question</th>
                                                        <th style={{ width: '120px' }}>Option A</th>
                                                        <th style={{ width: '120px' }}>Option B</th>
                                                        <th style={{ width: '120px' }}>Option C</th>
                                                        <th style={{ width: '120px' }}>Option D</th>
                                                        <th style={{ width: '120px' }}>Right Answer</th>
                                                        <th style={{ width: '140px' }}>Student Answer</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(selectedAttempt.questions || []).map((q, idx) => {
                                                        const studentChoice = q.studentSelectedAnswer ?? null;
                                                        const correctChoice = q.correctAnswer ?? null;

                                                        return (
                                                            <tr key={q._id || idx} className={studentChoice && studentChoice !== correctChoice ? 'text-danger' : ''}>
                                                                <td>{idx + 1}</td>
                                                                <td style={{ minWidth: '300px' }}>{q.questionText || '—'}</td>

                                                                {(q.options || []).map((opt, oi) => {
                                                                    const isCorrect = correctChoice === (oi + 1);
                                                                    const isSelected = studentChoice === (oi + 1);
                                                                    return (
                                                                        <React.Fragment key={oi}>
                                                                            {renderOptionCell(opt?.optionText || '-', isCorrect, isSelected)}
                                                                        </React.Fragment>
                                                                    );
                                                                })}

                                                                <td className="align-middle">
                                                                    <span className="fw-bold text-success">{`Option ${correctChoice ?? '-'}`}</span>
                                                                </td>
                                                                <td className="align-middle">
                                                                    {studentChoice ? (
                                                                        studentChoice === correctChoice ? (
                                                                            <span className="fw-bold text-success">{`Option ${studentChoice}`}</span>
                                                                        ) : (
                                                                            <span className="fw-bold text-danger">{`Option ${studentChoice}`}</span>
                                                                        )
                                                                    ) : (
                                                                        <span className="text-muted">Unanswered</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-3 d-flex justify-content-between">
                                            <div>
                                                <strong>Total: </strong>{selectedAttempt.totalQuestions || (selectedAttempt.questions || []).length} questions &nbsp;|&nbsp;
                                                <strong>Correct:</strong> {selectedAttempt.correctAnswers ?? (selectedAttempt.questions || []).filter(q => q.studentSelectedAnswer !== null && q.studentSelectedAnswer === q.correctAnswer).length} &nbsp;|&nbsp;
                                                <strong>Wrong:</strong> {selectedAttempt.wrongAnswers ?? ((selectedAttempt.totalQuestions || (selectedAttempt.questions || []).length) - (selectedAttempt.correctAnswers ?? 0))}
                                            </div>
                                            <div>
                                                <strong>Marks:</strong> {selectedAttempt.marksObtained || 0}/{selectedAttempt.totalMarks || 0} &nbsp;|&nbsp;
                                                <strong>Percentage:</strong> {Number(selectedAttempt.percentage || 0).toFixed(2)}%
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}