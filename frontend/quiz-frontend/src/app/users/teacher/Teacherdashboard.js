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
    onNavClick,
    sidebarOpen,
    closeSidebar
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
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>

            <div 
                className={`bg-dark border-end sidebar-container ${sidebarOpen ? 'active' : ''}`} 
            >
                <button 
                    className="btn btn-close btn-close-white d-lg-none position-absolute p-3" 
                    onClick={closeSidebar} 
                    style={{top: '10px', right: '10px', zIndex: 1100}}
                ></button>

                <div className="py-3 px-3 border-bottom d-flex align-items-center gap-3 ">
                    <img 
                        src={quizLogo} 
                        alt="Quiz Logo" 
                        style={{ width: '50px', height: 'auto', objectFit: 'contain', borderRadius: '8px' }}
                    />
                    <h4 className="fw-bold mb-0" style={{ color: '#f4f6f9ff' }}>
                        Quiz-o-Tron
                    </h4>
                </div>
              
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
                    <p className="text-light small mb-3">Teacher Account</p>
                    <div className="d-flex justify-content-center gap-3 px-3">
                        <div className="text-center flex-fill">
                            <div className="bg-light rounded p-2">
                                <small className="text-muted d-block" style={{ fontSize: '10px' }}>{profileDetail1Label}</small>
                                <small className="fw-bold text-dark">{profileDetail1Value || 'Faculty'}</small>
                            </div>
                        </div>
                        <div className="text-center flex-fill">
                            <div className="bg-light rounded p-2">
                                <small className="text-muted d-block" style={{ fontSize: '10px' }}>{profileDetail2Label}</small>
                                <small className="fw-bold text-success">{profileDetail2Value || 'Active'}</small>
                            </div>
                        </div>
                    </div>
                </div>
                
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
                                                    closeSidebar();
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

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

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
        const hash = window.location.hash.replace('#', '');
        if (hash === 'courses-exams') {
            setActiveTab('Courses/Exams');
        } else if (hash === 'dashboard') {
            setActiveTab('Dashboard');
        } else {
            setActiveTab('Dashboard');
        }
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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses`, getAxiosConfig());
            if (response.data.success) {
                setCoursesData(response.data.data);
            }
        } catch (err) {
            console.error('Fetch courses error:', err);
        }
    };

    const fetchQuestionPools = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/question-pools`, getAxiosConfig());
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
                `${process.env.REACT_APP_API_URL}/question-pools`,
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
                `${process.env.REACT_APP_API_URL}/courses`,
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
                `${process.env.REACT_APP_API_URL}/questions`,
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
                `${process.env.REACT_APP_API_URL}/questions/upload-csv`,
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
                `${process.env.REACT_APP_API_URL}/questions/${questionId}`,
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
                `${process.env.REACT_APP_API_URL}/courses/${courseId}`,
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
                        <div className="mb-4 d-none d-lg-block">
                            <p className="text-muted">Quick stats on courses and question pools.</p>
                        </div>
                        <div className="row g-4 mb-5 stat-card-row">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm stat-card">
                                    <div className="card-body text-center">
                                        <div className="mb-2">
                                            <span className="text-primary" style={{ fontSize: '32px' }}>📚</span>
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
                                            <span className="text-success" style={{ fontSize: '32px' }}>📝</span>
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
                                            <span className="text-warning" style={{ fontSize: '32px' }}>📊</span>
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
                            <div className="d-flex flex-wrap gap-2">
                                <button
                                    className="btn btn-success"
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

                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fw-bold text-dark">Question Pools ({questionPools.length})</h4>
                                <div className="d-flex flex-wrap gap-2">
                                    <button
                                        className="btn btn-outline-primary btn-sm"
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
                                <div className="row g-3 stat-card-row">
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

                        <div className="mb-5">
                            <h4 className="fw-bold mb-3 text-dark">My Courses ({coursesData.length})</h4>
                            <div className="row g-4 stat-card-row">
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
            case 'Results':
                return (
                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="h3 fw-bold text-dark mb-1 d-none d-lg-block">Student Quiz Results</h1> 
                                <p className="text-muted mb-0 d-none d-lg-block">View and analyze student performance</p>
                                <h1 className="h3 fw-bold text-dark mb-1 d-lg-none">Filter & Table</h1>
                            </div>
                            <button className="btn btn-success d-flex align-items-center" onClick={handleExport}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Export CSV
                            </button>
                        </div>

                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show">
                                {error}
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        )}

                        <div className="row g-3 mb-4 stat-card-row">
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm stat-card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="text-muted mb-1 small">Total Results</p>
                                                <h3 className="fw-bold mb-0">{filteredResults.length}</h3>
                                            </div>
                                            <div className="bg-primary bg-opacity-10 rounded p-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="8.5" cy="7" r="4"></circle>
                                                    <polyline points="17 11 19 13 23 9"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm stat-card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="text-muted mb-1 small">Average Score</p>
                                                <h3 className="fw-bold mb-0">
                                                    {filteredResults.length > 0
                                                        ? (filteredResults.reduce((sum, r) => sum + r.percentage, 0) / filteredResults.length).toFixed(1)
                                                        : 0}%
                                                </h3>
                                            </div>
                                            <div className="bg-success bg-opacity-10 rounded p-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm stat-card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="text-muted mb-1 small">Highest Score</p>
                                                <h3 className="fw-bold mb-0">
                                                    {filteredResults.length > 0
                                                        ? Math.max(...filteredResults.map(r => r.percentage)).toFixed(1)
                                                        : 0}%
                                                </h3>
                                            </div>
                                            <div className="bg-warning bg-opacity-10 rounded p-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                                    <polyline points="17 6 23 6 23 12"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm stat-card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="text-muted mb-1 small">Pass Rate</p>
                                                <h3 className="fw-bold mb-0">
                                                    {filteredResults.length > 0
                                                        ? ((filteredResults.filter(r => r.percentage >= 60).length / filteredResults.length) * 100).toFixed(1)
                                                        : 0}%
                                                </h3>
                                            </div>
                                            <div className="bg-info bg-opacity-10 rounded p-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0dcaf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm mb-4 filter-section">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                    </svg>
                                    Filter Results
                                </h5>
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label small fw-medium">Program</label>
                                        <select className="form-select" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
                                            {programs.map((program, index) => (
                                                <option key={index} value={program === 'All Programs' ? '' : program}>{program}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-medium">Semester</label>
                                        <select className="form-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                                            {semesters.map((semester, index) => (
                                                <option key={index} value={semester === 'All Semesters' ? '' : semester}>
                                                    {semester === 'All Semesters' ? semester : `Semester ${semester}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-medium">Course</label>
                                        <select className="form-select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                                            {courses.map((course, index) => (
                                                <option key={index} value={course === 'All Courses' ? '' : course}>{course}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-medium">Search Student</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                </svg>
                                            </span>
                                            <input type="text" className="form-control" placeholder="Student name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-0 results-table-container">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : filteredResults.length === 0 ? (
                                    <div className="text-center py-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted mb-3">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        <p className="text-muted">No results found matching your filters</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="fw-medium py-3 ps-4">Student Name</th>
                                                    <th className="fw-medium py-3">Program</th>
                                                    <th className="fw-medium py-3">Semester</th>
                                                    <th className="fw-medium py-3">Course</th>
                                                    <th className="fw-medium py-3">Score</th>
                                                    <th className="fw-medium py-3">Percentage</th>
                                                    <th className="fw-medium py-3">Date</th>
                                                    <th className="fw-medium py-3 pe-4">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredResults.map((result) => (
                                                    <tr key={result._id}>
                                                        <td className="py-3 ps-4">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                                                                    <span className="small">👤</span>
                                                                </div>
                                                                <span className="fw-medium">{result.student?.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="badge bg-primary">{result.student?.program}</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="badge bg-secondary">Sem {result.student?.semester}</span>
                                                        </td>
                                                        <td className="py-3">{result.course?.courseName}</td>
                                                        <td className="py-3 fw-medium">{result.marksObtained}/{result.totalMarks}</td>
                                                        <td className="py-3">
                                                            <span className={`badge ${getScoreBadge(result.percentage)} px-3 py-2`}>
                                                                {result.percentage.toFixed(1)}%
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-muted">
                                                            {new Date(result.completedAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="py-3 pe-4">
                                                            <Link to={`/teacher/result/${result._id}`} className="btn btn-sm btn-outline-primary">
                                                                View Details
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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
                    margin-left: 280px; /* Offset for desktop sidebar */
                    min-height: 100vh;
                    width: calc(100% - 280px);
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                .results-table-container {
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    overflow-x: auto;
                }

                /* Mobile & Tablet Overrides (Hamburger Menu Implementation) */
                @media (max-width: 991.98px) {
                    .sidebar-container {
                        position: fixed;
                        transform: translateX(-280px); /* Hide sidebar initially */
                        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
                        width: 280px !important;
                        height: 100vh;
                        left: 0;
                        top: 0;
                    }
                    .sidebar-container.active {
                        transform: translateX(0); /* Slide into view when active */
                    }
                    .main-content-wrapper {
                        margin-left: 0 !important; /* Remove desktop offset */
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
                }
                `}
            </style>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" crossOrigin="anonymous" />
            
            <Sidebar
                role="teacher"
                activeTab={activeTab}
                navItems={teacherNavItems}
                {...teacherProfileDetails}
                onNavClick={handleSidebarNav}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={closeSidebar}
            />
           
            <div className="mobile-header d-lg-none">
                <h4 className="fw-bold mb-0">Teacher Dashboard</h4>
                <button className="btn btn-dark" onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </div>


            <div 
                className="flex-grow-1 bg-light main-content-wrapper" 
            >
                <div className="p-4">
                   
                    <div className="d-flex justify-content-between align-items-center mb-4 d-none d-lg-flex">
                        <div>
                            <h1 className="h3 fw-bold text-dark mb-1">Teacher Dashboard</h1>
                            <p className="text-muted mb-0">Manage courses, questions, and view results.</p>
                        </div>
                       
                    </div>

                    
                    {renderContent()}

                </div>
            </div>

            {/* MODALS */}
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