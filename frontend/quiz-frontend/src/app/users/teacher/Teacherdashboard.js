import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8700/api';

export default function TeacherDashboard() {
    const [activeTab, setActiveTab] = useState('Courses/Exams');
    const [showQuestionPoolModal, setShowQuestionPoolModal] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [showUploadCSVModal, setShowUploadCSVModal] = useState(false);
    const [questionPoolAction, setQuestionPoolAction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    
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
    const [selectedCourse, setSelectedCourse] = useState(null);
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
        if (!window.confirm('Are you sure you want to delete this question?')) {
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
        if (!window.confirm('Are you sure you want to delete this course?')) {
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
        return {
            easy: pool.easyCount || 0,
            medium: pool.mediumCount || 0,
            hard: pool.hardCount || 0,
            total: pool.totalQuestions || 0
        };
    };

    return (
        <>
            <div className="min-vh-100 bg-light">
                <div className="container-fluid">
                    <div className="row">
                       
                        <div className="col-md-3 col-lg-2 bg-dark vh-100 p-0">
                            <div className="p-3">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary">
                                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '40px', height: '40px' }}>
                                        <span className="text-white">👨‍🏫</span>
                                    </div>
                                    <span className="fw-medium text-light">Teacher</span>
                                </div>
                                <nav>
                                    <ul className="nav flex-column">
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Dashboard2' ? 'bg-success text-white' : 'text-light bg-transparent'}`}
                                                onClick={() => setActiveTab('Dashboard2')}
                                            >
                                                <span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span> Dashboard
                                            </button>
                                        </li>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Courses/Exams' ? 'bg-success text-white' : 'text-light bg-transparent'}`}
                                                onClick={() => setActiveTab('Courses/Exams')}
                                            >
                                                <span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg></span> Courses/Exams
                                            </button>
                                        </li>
                                        <Link to="/teacher/result" className='text-decoration-none'>
                                            <li className="nav-item mb-1">
                                                <button
                                                    className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded text-light bg-transparent`}
                                                >
                                                     <span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg></span> Results
                                                </button>
                                            </li>
                                        </Link>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded text-light bg-transparent`}
                                            >
                                                <span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg></span> Settings
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-md-9 col-lg-10 p-4">

                            {successMessage && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    {successMessage}
                                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                </div>
                            )}

                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="h3 fw-bold text-dark mb-0">Courses / Exams</h1>
                                <div>
                                    <button 
                                        className="btn btn-success me-2"
                                        onClick={() => setShowQuestionPoolModal(true)}
                                        disabled={loading}
                                    >
                                        + Add Question Pool
                                    </button>
                                    <button 
                                        className="btn btn-success"
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
                                    <h4 className="fw-bold text-dark">Question Pools</h4>
                                    <div>
                                        <button 
                                            className="btn btn-outline-primary me-2"
                                            onClick={() => setShowAddQuestionModal(true)}
                                            disabled={questionPools.length === 0}
                                        >
                                            + Add Question
                                        </button>
                                        <button 
                                            className="btn btn-outline-success"
                                            onClick={() => setShowUploadCSVModal(true)}
                                            disabled={questionPools.length === 0}
                                        >
                                            📤 Upload CSV
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
                                            return (
                                                <div key={pool._id} className="col-md-6 col-lg-4">
                                                    <div className="card border-0 shadow-sm h-100">
                                                        <div className="card-body">
                                                            <h6 className="card-title fw-bold mb-2">{pool.poolName}</h6>
                                                            <p className="text-muted small mb-3">{pool.category}</p>
                                                            
                                                            <div className="mb-3">
                                                                <div className="d-flex justify-content-between mb-1">
                                                                    <small className="text-success">Easy: {stats.easy}/20</small>
                                                                    <small>{Math.round((stats.easy/20)*100)}%</small>
                                                                </div>
                                                                <div className="progress mb-2" style={{ height: '4px' }}>
                                                                    <div className="progress-bar bg-success" style={{ width: `${(stats.easy/20)*100}%` }}></div>
                                                                </div>

                                                                <div className="d-flex justify-content-between mb-1">
                                                                    <small className="text-warning">Medium: {stats.medium}/10</small>
                                                                    <small>{Math.round((stats.medium/10)*100)}%</small>
                                                                </div>
                                                                <div className="progress mb-2" style={{ height: '4px' }}>
                                                                    <div className="progress-bar bg-warning" style={{ width: `${(stats.medium/10)*100}%` }}></div>
                                                                </div>

                                                                <div className="d-flex justify-content-between mb-1">
                                                                    <small className="text-danger">Hard: {stats.hard}/10</small>
                                                                    <small>{Math.round((stats.hard/10)*100)}%</small>
                                                                </div>
                                                                <div className="progress mb-2" style={{ height: '4px' }}>
                                                                    <div className="progress-bar bg-danger" style={{ width: `${(stats.hard/10)*100}%` }}></div>
                                                                </div>
                                                            </div>

                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className="badge bg-primary">{stats.total} Total Questions</span>
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

                            {/* Questions List */}
                            {selectedPool && (
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5 className="fw-bold text-dark mb-0">Questions</h5>
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
                                                                No questions found
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        poolQuestions.map((question) => (
                                                            <tr key={question._id}>
                                                                <td className="py-3">{question.questionText}</td>
                                                                <td className="py-3">
                                                                    <span className={`badge bg-${
                                                                        question.difficulty === 'easy' ? 'success' :
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
                                <h4 className="fw-bold mb-3 text-dark">My Courses</h4>
                                <div className="row g-3">
                                    {coursesData.length === 0 ? (
                                        <div className="col-12">
                                            <div className="alert alert-info">
                                                No courses yet. Create your first course!
                                            </div>
                                        </div>
                                    ) : (
                                        coursesData.map((course) => (
                                            <div key={course._id} className="col-md-6 col-lg-3">
                                                <div className="card border-0 shadow-sm h-100">
                                                    <div className="card-body">
                                                        <h6 className="card-title fw-bold mb-1">{course.courseName}</h6>
                                                        <p className="card-text text-muted small mb-3">
                                                            {course.totalQuestions || 0} Questions | {course.duration} min
                                                        </p>
                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-success btn-sm flex-grow-1">
                                                                Manage
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDeleteCourse(course._id)}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                            ➕ Create New Question Pool
                                        </button>
                                        <button 
                                            className="btn btn-outline-primary btn-lg"
                                            onClick={() => handleQuestionPoolAction('import')}
                                        >
                                            📥 Import Existing Question Pool
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
                                                onChange={(e) => setQuestionPoolData({...questionPoolData, poolName: e.target.value})}
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
                                                onChange={(e) => setQuestionPoolData({...questionPoolData, description: e.target.value})}
                                                disabled={loading}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Category *</label>
                                            <select 
                                                className="form-select"
                                                value={questionPoolData.category}
                                                onChange={(e) => setQuestionPoolData({...questionPoolData, category: e.target.value})}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="physics">Physics</option>
                                                <option value="mathematics">Mathematics</option>
                                                <option value="chemistry">Chemistry</option>
                                                <option value="biology">Biology</option>
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
                                            onChange={(e) => setNewQuestion({...newQuestion, questionPoolId: e.target.value})}
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
                                            onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
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
                                                onChange={(e) => setNewQuestion({...newQuestion, option1: e.target.value})}
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
                                                onChange={(e) => setNewQuestion({...newQuestion, option2: e.target.value})}
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
                                                onChange={(e) => setNewQuestion({...newQuestion, option3: e.target.value})}
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
                                                onChange={(e) => setNewQuestion({...newQuestion, option4: e.target.value})}
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
                                                onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
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
                                                onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
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
                                                onChange={(e) => setNewQuestion({...newQuestion, marks: e.target.value})}
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
                                            <div className="progress">
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
                                        <strong>CSV Format:</strong><br/>
                                        questionText, option1, option2, option3, option4, correctAnswer, marks, difficulty
                                    </div>

                                    <button 
                                        type="button" 
                                        className="btn btn-link btn-sm p-0 mb-3"
                                        onClick={downloadCSVTemplate}
                                    >
                                        📥 Download CSV Template
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
                                            onChange={(e) => setCourseData({...courseData, courseName: e.target.value})}
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
                                            onChange={(e) => setCourseData({...courseData, description: e.target.value})}
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
                                            onChange={(e) => setCourseData({...courseData, duration: e.target.value})}
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
                                            onChange={(e) => setCourseData({...courseData, questionPool: e.target.value})}
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
        </>
    );
}