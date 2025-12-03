import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AssignQuizModal from './AssignQuizModal';
import quizLogo from '../../images/quiz_logo.png';
const API_BASE_URL = 'http://localhost:8700/api';

const Sidebar = ({
    role,
    activeTab,
    profileDetail1Label,
    profileDetail1Value,
    profileDetail2Label,
    profileDetail2Value,
    navItems,
    onNavClick
}) => {
    const getUserData = () => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
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
        transition: 'all 0.3s ease-in-out',
        boxShadow: isActive ? '0 4px 10px rgba(25, 135, 84, 0.4)' : 'none',
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
        <div
            className="bg-dark border-end"
            style={{
                width: '280px',
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                overflowY: 'auto',
                zIndex: 1000
            }}
        >
            {/* Logo Section */}
                        <div className="py-3 px-3 border-bottom d-flex align-items-center gap-3 ">
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
            <div className="text-center pt-4 pb-3 border-bottom">
                <div className="d-flex justify-content-center mb-3">
                    <div
                        className="rounded-circle bg-light d-flex align-items-center justify-content-center position-relative"
                        style={{ width: '100px', height: '100px'}}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <div
                            className="position-absolute bg-success text-white px-2 py-1 rounded"
                            style={{ bottom: '0', fontSize: '10px', fontWeight: 'bold' }}
                        >
                            2025-26
                        </div>
                    </div>
                </div>
                <h6 className="fw-bold mb-1" style={{ color: '#f4f6f9ff' }}>
                    {user?.fullName || 'Teacher Name'}
                </h6>
                <p className="text-light small mb-3">{accountType}</p>
                <div className="d-flex justify-content-center gap-3 px-3">
                    {/* Detail 1: Department (Teacher Specific) */}
                    <div className="text-center flex-fill">
                        <div className="bg-light rounded p-2">
                            <small className="text-muted d-block" style={{ fontSize: '10px' }}>{profileDetail1Label}</small>
                            <small className="fw-bold text-dark">{profileDetail1Value || 'N/A'}</small>
                        </div>
                    </div>
                    {/* Detail 2: Status (Teacher Specific) */}
                    <div className="text-center flex-fill">
                        <div className="bg-light rounded p-2">
                            <small className="text-muted d-block" style={{ fontSize: '10px' }}>{profileDetail2Label}</small>
                            <small className={`fw-bold text-success`}>{profileDetail2Value || 'Active'}</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="py-3">
                <ul className="nav flex-column px-2">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.label;
                        return (
                            <li className="nav-item mb-1" key={item.label}>
                                {item.isExternal ? (
                                    <Link to={item.path} className='text-decoration-none'>
                                        <button
                                            className="nav-link w-100 text-start border-0 d-flex align-items-center py-3 px-3 rounded sidebar-nav-btn"
                                            style={navLinkStyle(isActive)}
                                            onMouseEnter={(e) => navLinkHoverStyle(e, isActive)}
                                            onMouseLeave={(e) => navLinkLeaveStyle(e, isActive)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-3" dangerouslySetInnerHTML={{ __html: item.svgPath }} />
                                            <span className="fw-medium">{item.label}</span>
                                        </button>
                                    </Link>
                                ) : (
                                    <button
                                        className="nav-link w-100 text-start border-0 d-flex align-items-center py-3 px-3 rounded sidebar-nav-btn"
                                        style={navLinkStyle(isActive)}
                                        onClick={(e) => {
                                            if (onNavClick) {
                                                onNavClick(item.label);
                                            }
                                        }}
                                        onMouseEnter={(e) => navLinkHoverStyle(e, isActive)}
                                        onMouseLeave={(e) => navLinkLeaveStyle(e, isActive)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-3" dangerouslySetInnerHTML={{ __html: item.svgPath }} />
                                        <span className="fw-medium">{item.label}</span>
                                    </button>
                                )}
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
    );
};
export default function TeacherDashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showQuestionPoolModal, setShowQuestionPoolModal] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [showUploadCSVModal, setShowUploadCSVModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [questionPoolAction, setQuestionPoolAction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState(null);

    const teacherInfo = JSON.parse(localStorage.getItem('user') || '{}');

    const teacherNavItems = [
        {
            label: 'Dashboard',
            path: '#dashboard',
            svgPath: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
            isExternal: false
        },
        {
            label: 'Courses/Exams',
            path: '#courses-exams',
            svgPath: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
            isExternal: false
        },
        {
            label: 'Results',
            path: '/teacher/result',
            svgPath: '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
            isExternal: true
        }
    ];

    const teacherProfileDetails = {
        profileDetail1Label: 'Department',
        profileDetail1Value: teacherInfo?.department || 'Faculty',
        profileDetail2Label: 'Status',
        profileDetail2Value: 'Active',
    };

    const [questionPoolData, setQuestionPoolData] = useState({
        poolName: '',
        description: '',
        category: ''
    });

    const [courseData, setCourseData] = useState({
        courseName: '',
        description: '',
        duration: '',
        questionPool: ''
    });

    const [newQuestion, setNewQuestion] = useState({
        questionText: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: '',
        marks: 1,
        difficulty: 'easy',
        questionPoolId: ''
    });

    const [csvFile, setCsvFile] = useState(null);
    const [selectedPoolForUpload, setSelectedPoolForUpload] = useState('');

    const [coursesData, setCoursesData] = useState([]);
    const [questionPools, setQuestionPools] = useState([]);
    const [selectedPool, setSelectedPool] = useState(null);
    const [poolQuestions, setPoolQuestions] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    const getAuthToken = () => localStorage.getItem('token');
    const getAxiosConfig = () => ({
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        fetchCourses();
        fetchQuestionPools();
    }, []);

    useEffect(() => {
        if (selectedPool) {
            fetchPoolQuestions(selectedPool, selectedDifficulty);
        }
    }, [selectedPool, selectedDifficulty]);

    const handleSidebarNav = (label) => {
        if (label !== 'Results') {
            setActiveTab(label);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/courses`, getAxiosConfig());
            if (response.data.success) {
                setCoursesData(response.data.data);
            }
        } catch (err) {
            console.error('Fetch courses error:', err);
        }
    };

    const fetchQuestionPools = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/question-pools`, getAxiosConfig());
            if (response.data.success) {
                setQuestionPools(response.data.data);
            }
        } catch (err) {
            console.error('Fetch question pools error:', err);
        }
    };

    const fetchPoolQuestions = async (poolId, difficulty = 'all') => {
        try {
            const url = difficulty === 'all'
                ? `${API_BASE_URL}/questions/pool/${poolId}`
                : `${API_BASE_URL}/questions/pool/${poolId}?difficulty=${difficulty}`;

            const response = await axios.get(url, getAxiosConfig());
            if (response.data.success) {
                setPoolQuestions(response.data.data);
            }
        } catch (err) {
            console.error('Fetch pool questions error:', err);
        }
    };

    const handleQuestionPoolAction = (action) => {
        setQuestionPoolAction(action);
        setError('');
    };

    const handleQuestionPoolSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${API_BASE_URL}/question-pools`,
                questionPoolData,
                getAxiosConfig()
            );

            if (response.data.success) {
                setSuccessMessage('Question pool created successfully!');
                setShowQuestionPoolModal(false);
                setQuestionPoolData({ poolName: '', description: '', category: '' });
                setQuestionPoolAction('');
                fetchQuestionPools();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create question pool');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${API_BASE_URL}/courses`,
                courseData,
                getAxiosConfig()
            );

            if (response.data.success) {
                setSuccessMessage('Course created successfully!');
                setShowCourseModal(false);
                setCourseData({ courseName: '', description: '', duration: '', questionPool: '' });
                fetchCourses();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const options = [
                { optionText: newQuestion.option1, isCorrect: parseInt(newQuestion.correctAnswer) === 1 },
                { optionText: newQuestion.option2, isCorrect: parseInt(newQuestion.correctAnswer) === 2 },
                { optionText: newQuestion.option3, isCorrect: parseInt(newQuestion.correctAnswer) === 3 },
                { optionText: newQuestion.option4, isCorrect: parseInt(newQuestion.correctAnswer) === 4 }
            ];

            const response = await axios.post(
                `${API_BASE_URL}/questions`,
                {
                    questionText: newQuestion.questionText,
                    options: options,
                    correctAnswer: parseInt(newQuestion.correctAnswer),
                    marks: parseInt(newQuestion.marks),
                    difficulty: newQuestion.difficulty,
                    questionPoolId: newQuestion.questionPoolId
                },
                getAxiosConfig()
            );

            if (response.data.success) {
                setSuccessMessage('Question added successfully!');
                setShowAddQuestionModal(false);
                setNewQuestion({
                    questionText: '',
                    option1: '',
                    option2: '',
                    option3: '',
                    option4: '',
                    correctAnswer: '',
                    marks: 1,
                    difficulty: 'easy',
                    questionPoolId: ''
                });
                fetchQuestionPools();
                if (selectedPool) {
                    fetchPoolQuestions(selectedPool, selectedDifficulty);
                }
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add question');
        } finally {
            setLoading(false);
        }
    };

    const handleCSVUpload = async (e) => {
        e.preventDefault();
        if (!csvFile || !selectedPoolForUpload) {
            setError('Please select both a CSV file and a question pool');
            return;
        }

        setLoading(true);
        setError('');
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('csvFile', csvFile);
        formData.append('questionPoolId', selectedPoolForUpload);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/questions/upload-csv`,
                formData,
                {
                    ...getAxiosConfig(),
                    headers: {
                        ...getAxiosConfig().headers,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            );

            if (response.data.success) {
                setSuccessMessage(response.data.message);
                setShowUploadCSVModal(false);
                setCsvFile(null);
                setSelectedPoolForUpload('');
                setUploadProgress(0);
                fetchQuestionPools();
                if (selectedPool) {
                    fetchPoolQuestions(selectedPool, selectedDifficulty);
                }
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload CSV');
            setUploadProgress(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this question?');
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `${API_BASE_URL}/questions/${questionId}`,
                getAxiosConfig()
            );

            if (response.data.success) {
                setSuccessMessage('Question deleted successfully!');
                fetchQuestionPools();
                if (selectedPool) {
                    fetchPoolQuestions(selectedPool, selectedDifficulty);
                }
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete question');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this course?');
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `${API_BASE_URL}/courses/${courseId}`,
                getAxiosConfig()
            );

            if (response.data.success) {
                setSuccessMessage('Course deleted successfully!');
                fetchCourses();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete course');
        }
    };

    const handleAssignQuiz = (course) => {
        setSelectedCourseForAssignment(course);
        setShowAssignModal(true);
    };

    const downloadCSVTemplate = () => {
        const csvContent = "questionText,option1,option2,option3,option4,correctAnswer,marks,difficulty\n" +
            "What is 2+2?,2,3,4,5,3,1,easy\n" +
            "Capital of France?,London,Paris,Berlin,Rome,2,1,medium\n" +
            "Speed of light?,300000 km/s,150000 km/s,450000 km/s,600000 km/s,1,2,hard";

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions_template.csv';
        a.click();
    };

    const getPoolStats = (pool) => {
        const easyCount = pool.easyCount || 0;
        const mediumCount = pool.mediumCount || 0;
        const hardCount = pool.hardCount || 0;

        return {
            easy: easyCount,
            medium: mediumCount,
            hard: hardCount,
            total: easyCount + mediumCount + hardCount
        };
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return (
                    <div className="p-4">
                        <div className="mb-4">
                            <h2 className="h4 fw-bold">Teacher Dashboard Overview</h2>
                            <p className="text-muted">Quick stats on courses and question pools.</p>
                        </div>
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm stat-card">
                                    <div className="card-body text-center">
                                        <div className="mb-2">
                                            <span className="text-primary" style={{ fontSize: '32px' }}><svg xmlns="http://www.w3.org/2000/svg"
                                                width="28" height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round">

                                                <path d="M4 19h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4z"></path>

                                                <path d="M10 19h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4z"></path>

                                                <path d="M16 17l3 1.5a2 2 0 0 0 2-1l1-2a2 2 0 0 0-1-2.5L17 10"></path>

                                            </svg>
                                            </span>
                                        </div>
                                        <h3 className="text-primary mb-1">{coursesData.length}</h3>
                                        <p className="text-muted mb-0 small">Total Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm stat-card">
                                    <div className="card-body text-center">
                                        <div className="mb-2">
                                            <span className="text-success" style={{ fontSize: '32px' }}><svg xmlns="http://www.w3.org/2000/svg"
                                                width="28" height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round">

                                                <rect x="4" y="3" width="14" height="18" rx="2" ry="2"></rect>

                                                <line x1="8" y1="8" x2="14" y2="8"></line>
                                                <line x1="8" y1="12" x2="14" y2="12"></line>
                                                <line x1="8" y1="16" x2="12" y2="16"></line>

                                                <path d="M18 14l2 2-4 4-2-2z"></path>
                                                <line x1="17" y1="13" x2="20" y2="16"></line>

                                            </svg>
                                            </span>
                                        </div>
                                        <h3 className="text-success mb-1">{questionPools.length}</h3>
                                        <p className="text-muted mb-0 small">Total Question Pools</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm stat-card">
                                    <div className="card-body text-center">
                                        <div className="mb-2">
                                            <span className="text-warning" style={{ fontSize: '32px' }}><svg xmlns="http://www.w3.org/2000/svg"
                                                width="28" height="28"
                                                viewBox="0 0 24 24"
                                                role="img" aria-label="Bar chart"
                                                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">

                                                <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>

                                                <g fill="currentColor" stroke="none">
                                                    <rect x="6" y="11" width="2.8" height="7"></rect>
                                                    <rect x="11" y="7" width="2.8" height="11"></rect>
                                                    <rect x="15.8" y="4" width="2.8" height="14"></rect>
                                                </g>

                                            </svg>
                                            </span>
                                        </div>
                                        <h3 className="text-warning mb-1">View Results</h3>
                                        <p className="text-muted mb-0 small">Analyze Student Performance</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h5 className="fw-bold mb-3">Recent Activity</h5>
                            <div className="alert alert-info">
                                Showing activity related to course and pool creation...
                            </div>
                        </div>

                    </div>
                );
            case 'Courses/Exams':
                return (
                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 className="h3 fw-bold text-dark mb-0">Courses / Question Pools</h1>
                            <div>
                                <button
                                    className="btn btn-success me-2"
                                    onClick={() => setShowQuestionPoolModal(true)}
                                    disabled={loading}
                                >
                                    + Add Question Pool
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowCourseModal(true)}
                                    disabled={loading}
                                >
                                    + Add Course
                                </button>
                            </div>
                        </div>

                        {/* Question Pools with Stats */}
                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fw-bold text-dark">Question Pools ({questionPools.length})</h4>
                                <div>
                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() => setShowAddQuestionModal(true)}
                                        disabled={questionPools.length === 0}
                                    >
                                        + Add Question
                                    </button>
                                    <button
                                        className="btn btn-outline-success btn-sm"
                                        onClick={() => setShowUploadCSVModal(true)}
                                        disabled={questionPools.length === 0}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            width="16" height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className='me-1'>
                                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                                            <polyline points="7 9 12 4 17 9"></polyline>
                                            <line x1="12" y1="4" x2="12" y2="16"></line>
                                        </svg>
                                        Upload CSV
                                    </button>
                                </div>
                            </div>

                            {questionPools.length === 0 ? (
                                <div className="alert alert-info">
                                    No question pools yet. Create one to start adding questions!
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {questionPools.map((pool) => {
                                        const stats = getPoolStats(pool);
                                        const totalEasyTarget = 20;
                                        const totalMediumTarget = 10;
                                        const totalHardTarget = 10;

                                        return (
                                            <div key={pool._id} className="col-md-6 col-lg-4">
                                                <div className="card border-0 shadow-sm h-100">
                                                    <div className="card-body">
                                                        <h6 className="card-title fw-bold mb-2">{pool.poolName}</h6>
                                                        <p className="text-muted small mb-3">{pool.category}</p>

                                                        <div className="mb-3">
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <small className="text-success">Easy: {stats.easy}/{totalEasyTarget}</small>
                                                                <small>{Math.round((stats.easy / totalEasyTarget) * 100)}% coverage</small>
                                                            </div>
                                                            <div className="progress mb-2 rounded-pill" style={{ height: '6px' }}>
                                                                <div className="progress-bar bg-success" style={{ width: `${Math.min(100, (stats.easy / totalEasyTarget) * 100)}%` }}></div>
                                                            </div>

                                                            <div className="d-flex justify-content-between mb-1">
                                                                <small className="text-warning">Medium: {stats.medium}/{totalMediumTarget}</small>
                                                                <small>{Math.round((stats.medium / totalMediumTarget) * 100)}% coverage</small>
                                                            </div>
                                                            <div className="progress mb-2 rounded-pill" style={{ height: '6px' }}>
                                                                <div className="progress-bar bg-warning" style={{ width: `${Math.min(100, (stats.medium / totalMediumTarget) * 100)}%` }}></div>
                                                            </div>

                                                            <div className="d-flex justify-content-between mb-1">
                                                                <small className="text-danger">Hard: {stats.hard}/{totalHardTarget}</small>
                                                                <small>{Math.round((stats.hard / totalHardTarget) * 100)}% coverage</small>
                                                            </div>
                                                            <div className="progress mb-2 rounded-pill" style={{ height: '6px' }}>
                                                                <div className="progress-bar bg-danger" style={{ width: `${Math.min(100, (stats.hard / totalHardTarget) * 100)}%` }}></div>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="badge bg-primary">{stats.total} Total Qs</span>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => {
                                                                    setSelectedPool(pool._id);
                                                                    setSelectedDifficulty('all');
                                                                }}
                                                            >
                                                                View Questions
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Questions List (Visible when a pool is selected) */}
                        {selectedPool && (
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-bold text-dark mb-0">Questions in {questionPools.find(p => p._id === selectedPool)?.poolName}</h5>
                                        <div>
                                            <select
                                                className="form-select d-inline-block w-auto"
                                                value={selectedDifficulty}
                                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                            >
                                                <option value="all">All Difficulties</option>
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr className="border-bottom">
                                                    <th className="fw-medium text-muted">Question</th>
                                                    <th className="fw-medium text-muted">Difficulty</th>
                                                    <th className="fw-medium text-muted">Marks</th>
                                                    <th className="fw-medium text-muted">Correct Answer</th>
                                                    <th className="fw-medium text-muted">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {poolQuestions.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-4 text-muted">
                                                            No questions found for this filter.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    poolQuestions.map((question) => (
                                                        <tr key={question._id}>
                                                            <td className="py-3">{question.questionText}</td>
                                                            <td className="py-3">
                                                                <span className={`badge bg-${question.difficulty === 'easy' ? 'success' :
                                                                    question.difficulty === 'medium' ? 'warning' : 'danger'
                                                                    }`}>
                                                                    {question.difficulty}
                                                                </span>
                                                            </td>
                                                            <td className="py-3">{question.marks}</td>
                                                            <td className="py-3">Option {question.correctAnswer}</td>
                                                            <td className="py-3">
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDeleteQuestion(question._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* My Courses Section */}
                        <div className="mb-5">
                            <h4 className="fw-bold mb-3 text-dark">My Courses ({coursesData.length})</h4>
                            <div className="row g-4">
                                {coursesData.length === 0 ? (
                                    <div className="col-12">
                                        <div className="alert alert-info">
                                            No courses yet. Create your first course using the "Add Course" button!
                                        </div>
                                    </div>
                                ) : (
                                    coursesData.map((course) => (
                                        <div key={course._id} className="col-md-6 col-lg-3">
                                            <div className="card border-0 shadow-sm h-100 course-card">
                                                <div className="card-body d-flex flex-column">
                                                    <div className="mb-3">
                                                        <h6 className="card-title fw-bold mb-1">{course.courseName}</h6>
                                                        <p className="card-text text-muted small mb-2">
                                                            {course.totalQuestions || 20} Questions | {course.duration} min
                                                        </p>
                                                        <p className="text-muted small mb-0">
                                                            <small>Pool: {course.questionPool?.poolName || 'N/A'}</small>
                                                        </p>
                                                    </div>
                                                    <div className="d-grid gap-2 mt-auto">
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleAssignQuiz(course)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                width="16" height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className='me-1'>
                                                                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                                                                <polyline points="7 9 12 4 17 9"></polyline>
                                                                <line x1="12" y1="4" x2="12" y2="16"></line>
                                                            </svg>
                                                            Assign to Students
                                                        </button>
                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-success btn-sm flex-grow-1">
                                                                Manage
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDeleteCourse(course._id)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                    width="16" height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                                                    <path d="M10 11v6"></path>
                                                                    <path d="M14 11v6"></path>
                                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="p-4 text-center">
                        <div className="alert alert-warning mt-5">
                            Select a menu item from the sidebar to view content.
                        </div>
                    </div>
                );
        }
    };


    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Custom CSS Styles for enhanced UX/UI */}
            <style>
                {`
                .card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border-radius: 12px;
                }
                .card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
                }
                .sidebar-nav-btn {
                    padding: 1rem 1.5rem !important;
                    font-weight: 500;
                }
                .sidebar-nav-btn:hover:not([style*="background-color: rgb(25, 135, 84)"]) {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                }
                .logout-btn {
                    color: #dc3545 !important;
                    transition: all 0.3s ease;
                    background-color: transparent !important;
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
                .modal.show {
                    animation: fadeIn 0.3s forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .course-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                `}
            </style>

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" crossOrigin="anonymous" />

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                {/* Fixed Sidebar */}
                <Sidebar
                    role="teacher"
                    activeTab={activeTab}
                    navItems={teacherNavItems}
                    {...teacherProfileDetails}
                    onNavClick={handleSidebarNav}
                />

                {/* Scrollable Main Content */}
                <div
                    className="flex-grow-1 bg-light"
                    style={{
                        marginLeft: '280px',
                        height: '100vh',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}
                >
                    {successMessage && (
                        <div className="alert alert-success alert-dismissible fade show m-4 sticky-top" role="alert" style={{ zIndex: 10 }}>
                            {successMessage}
                            <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show m-4 sticky-top" role="alert" style={{ zIndex: 10 }}>
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                    )}

                    {renderContent()}

                </div>
            </div>

            {/* MODALS */}

            {/* Question Pool Modal */}
            {showQuestionPoolModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Add New Question Pool</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowQuestionPoolModal(false);
                                        setQuestionPoolAction('');
                                        setError('');
                                    }}
                                    disabled={loading}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                {!questionPoolAction ? (
                                    <div className="d-grid gap-3">
                                        <button
                                            className="btn btn-outline-success btn-lg"
                                            onClick={() => handleQuestionPoolAction('create')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                width="24" height="24"
                                                viewBox="0 0 24 24"
                                                role="img" aria-label="Add"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="me-2">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            Create New Question Pool
                                        </button>
                                        <button
                                            className="btn btn-outline-primary btn-lg"
                                            onClick={() => handleQuestionPoolAction('import')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                width="20" height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="me-2">
                                                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                                                <polyline points="7 9 12 4 17 9"></polyline>
                                                <line x1="12" y1="4" x2="12" y2="16"></line>
                                            </svg>
                                            Import Existing Question Pool
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleQuestionPoolSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Question Pool Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter pool name"
                                                value={questionPoolData.poolName}
                                                onChange={(e) => setQuestionPoolData({ ...questionPoolData, poolName: e.target.value })}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Enter description"
                                                value={questionPoolData.description}
                                                onChange={(e) => setQuestionPoolData({ ...questionPoolData, description: e.target.value })}
                                                disabled={loading}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Category *</label>
                                            <select
                                                className="form-select"
                                                value={questionPoolData.category}
                                                onChange={(e) => setQuestionPoolData({ ...questionPoolData, category: e.target.value })}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="physics">DSA With C++</option>
                                                <option value="mathematics">ReactJS</option>
                                                <option value="chemistry">Javascript</option>
                                                <option value="biology">Computer Network</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="alert alert-info small">
                                            <strong>Note:</strong> You need to add 20 Easy, 10 Medium, and 10 Hard questions (40 total). Students will get 20 random questions.
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary flex-fill"
                                                onClick={() => setQuestionPoolAction('')}
                                                disabled={loading}
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-success flex-fill"
                                                disabled={loading}
                                            >
                                                {loading ? 'Creating...' : 'Create Pool'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Question Modal */}
            {showAddQuestionModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Add New Question</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowAddQuestionModal(false);
                                        setError('');
                                    }}
                                    disabled={loading}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                <form onSubmit={handleAddQuestion}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Select Question Pool *</label>
                                        <select
                                            className="form-select"
                                            value={newQuestion.questionPoolId}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, questionPoolId: e.target.value })}
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Select Pool</option>
                                            {questionPools.map(pool => (
                                                <option key={pool._id} value={pool._id}>
                                                    {pool.poolName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Question Text *</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Enter your question"
                                            value={newQuestion.questionText}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                                            required
                                            disabled={loading}
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Option 1 *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Option 1"
                                                value={newQuestion.option1}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, option1: e.target.value })}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Option 2 *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Option 2"
                                                value={newQuestion.option2}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, option2: e.target.value })}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Option 3 *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Option 3"
                                                value={newQuestion.option3}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, option3: e.target.value })}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Option 4 *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Option 4"
                                                value={newQuestion.option4}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, option4: e.target.value })}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-medium">Correct Answer *</label>
                                            <select
                                                className="form-select"
                                                value={newQuestion.correctAnswer}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Select</option>
                                                <option value="1">Option 1</option>
                                                <option value="2">Option 2</option>
                                                <option value="3">Option 3</option>
                                                <option value="4">Option 4</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-medium">Difficulty *</label>
                                            <select
                                                className="form-select"
                                                value={newQuestion.difficulty}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-medium">Marks *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                value={newQuestion.marks}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, marks: e.target.value })}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-secondary flex-fill"
                                            onClick={() => setShowAddQuestionModal(false)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-success flex-fill"
                                            disabled={loading}
                                        >
                                            {loading ? 'Adding...' : 'Add Question'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload CSV Modal */}
            {showUploadCSVModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Upload Questions CSV</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowUploadCSVModal(false);
                                        setError('');
                                        setCsvFile(null);
                                        setUploadProgress(0);
                                    }}
                                    disabled={loading}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                <form onSubmit={handleCSVUpload}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Select Question Pool *</label>
                                        <select
                                            className="form-select"
                                            value={selectedPoolForUpload}
                                            onChange={(e) => setSelectedPoolForUpload(e.target.value)}
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Select Pool</option>
                                            {questionPools.map(pool => (
                                                <option key={pool._id} value={pool._id}>
                                                    {pool.poolName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Upload CSV File *</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".csv"
                                            onChange={(e) => setCsvFile(e.target.files[0])}
                                            required
                                            disabled={loading}
                                        />
                                        <small className="text-muted">
                                            Only .csv files are allowed
                                        </small>
                                    </div>

                                    {uploadProgress > 0 && (
                                        <div className="mb-3">
                                            <div className="progress rounded-pill" style={{ height: '10px' }}>
                                                <div
                                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                                    style={{ width: `${uploadProgress}%` }}
                                                >
                                                    {uploadProgress}%
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="alert alert-info small">
                                        <strong>CSV Format:</strong><br />
                                        questionText, option1, option2, option3, option4, correctAnswer (1-4), marks, difficulty (easy/medium/hard)
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-link btn-sm p-0 mb-3"
                                        onClick={downloadCSVTemplate}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            width="20" height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="me-1">
                                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                                            <polyline points="7 9 12 4 17 9"></polyline>
                                            <line x1="12" y1="4" x2="12" y2="16"></line>
                                        </svg>
                                        Download CSV Template
                                    </button>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-secondary flex-fill"
                                            onClick={() => setShowUploadCSVModal(false)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-success flex-fill"
                                            disabled={loading}
                                        >
                                            {loading ? 'Uploading...' : 'Upload CSV'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Modal */}
            {showCourseModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Add New Course</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowCourseModal(false);
                                        setError('');
                                    }}
                                    disabled={loading}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                <form onSubmit={handleCourseSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Course Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter course name"
                                            value={courseData.courseName}
                                            onChange={(e) => setCourseData({ ...courseData, courseName: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Enter course description"
                                            value={courseData.description}
                                            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                            disabled={loading}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Duration (minutes) *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter duration"
                                            value={courseData.duration}
                                            onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                                            required
                                            min="1"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Select Question Pool *</label>
                                        <select
                                            className="form-select"
                                            value={courseData.questionPool}
                                            onChange={(e) => setCourseData({ ...courseData, questionPool: e.target.value })}
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Select Question Pool</option>
                                            {questionPools.map(pool => (
                                                <option key={pool._id} value={pool._id}>
                                                    {pool.poolName} ({pool.category})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-secondary flex-fill"
                                            onClick={() => setShowCourseModal(false)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-success flex-fill"
                                            disabled={loading || questionPools.length === 0}
                                        >
                                            {loading ? 'Creating...' : 'Create Course'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Quiz Modal */}
            {showAssignModal && (
                <AssignQuizModal
                    show={showAssignModal}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedCourseForAssignment(null);
                    }}
                    courseId={selectedCourseForAssignment?._id}
                    courseName={selectedCourseForAssignment?.courseName}
                />
            )}
        </div>
    );
}   