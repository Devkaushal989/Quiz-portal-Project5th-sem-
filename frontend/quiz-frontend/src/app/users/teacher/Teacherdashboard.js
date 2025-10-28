import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

const API_BASE_URL = 'http://locaclhost:8700/api';

export default function TeacherDashboard() {
    const [activeTab, setActiveTab] = useState('Courses/Exams');
    const [showQuestionPoolModal, setShowQuestionPoolModal] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [questionPoolAction, setQuestionPoolAction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
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

    const [coursesData, setCoursesData] = useState([]);
    const [questionPools, setQuestionPools] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    const getAxiosConfig = () => {
        return {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        };
    };

    useEffect(() => {
        fetchCourses();
        fetchQuestionPools();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/courses`,
                getAxiosConfig()
            );
            
            if (response.data.success) {
                setCoursesData(response.data.data);
            }
        } catch (err) {
            console.error('Fetch courses error:', err);
            if (err.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        }
    };

    // Fetch all question pools
    const fetchQuestionPools = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/question-pools`,
                getAxiosConfig()
            );
            
            if (response.data.success) {
                setQuestionPools(response.data.data);
            }
        } catch (err) {
            console.error('Fetch question pools error:', err);
        }
    };

    // Handle Question Pool Modal Actions
    const handleQuestionPoolAction = (action) => {
        setQuestionPoolAction(action);
        setError('');
    };

    // Handle Question Pool Form Submit
    const handleQuestionPoolSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

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
                
                // Refresh question pools list
                fetchQuestionPools();
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create question pool');
        } finally {
            setLoading(false);
        }
    };

    // Handle Course Form Submit
    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

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
                
                // Refresh courses list
                fetchCourses();
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    // Handle course deletion
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

    const questionData = [
        {
            id: 1,
            text: 'Question Text',
            answer: 1,
            correct: 1,
            marks: 1
        },
        {
            id: 2,
            text: 'Question Text',
            answer: 2,
            correct: 2,
            marks: 2
        },
        {
            id: 3,
            text: 'Question Text',
            answer: 2,
            correct: 3,
            marks: 15
        }
    ];

    return (
        <>
            <div className="min-vh-100 bg-light">
                <div className="container-fluid">
                    <div className="row">
                        {/* Sidebar */}
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
                                                <span className="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                                    </svg>
                                                </span> Dashboard
                                            </button>
                                        </li>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Courses/Exams' ? 'bg-success text-white' : 'text-light bg-transparent'}`}
                                                onClick={() => setActiveTab('Courses/Exams')}
                                            >
                                                <span className="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                                                        <polygon points="12 15 17 21 7 21 12 15"></polygon>
                                                    </svg>
                                                </span> Courses/Exams
                                            </button>
                                        </li>
                                        <Link to="/teacher/result" className='text-decoration-none'>
                                            <li className="nav-item mb-1">
                                                <button
                                                    className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Results' ? 'bg-light text-dark' : 'text-light bg-transparent'}`}
                                                    onClick={() => setActiveTab('Results')}
                                                >
                                                    <span className="me-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="9 11 12 14 22 4"></polyline>
                                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                                        </svg>
                                                    </span> Results
                                                </button>
                                            </li>
                                        </Link>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Settings' ? 'bg-light text-dark' : 'text-light bg-transparent'}`}
                                                onClick={() => setActiveTab('Settings')}
                                            >
                                                <span className="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                                        <line x1="3" y1="6" x2="3" y2="6"></line>
                                                        <line x1="3" y1="12" x2="3" y2="12"></line>
                                                        <line x1="3" y1="18" x2="3" y2="18"></line>
                                                    </svg>
                                                </span> Settings
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-md-9 col-lg-10 p-4">
                            {/* Success/Error Messages */}
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
                                        className="btn btn-success me-3"
                                        onClick={() => setShowQuestionPoolModal(true)}
                                        disabled={loading}
                                    >
                                        + Add New Question Pool
                                    </button>
                                    <button 
                                        className="btn btn-success"
                                        onClick={() => setShowCourseModal(true)}
                                        disabled={loading}
                                    >
                                        + Add New Course
                                    </button>
                                </div>
                            </div>

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
                                                        <div className="d-flex align-items-start mb-3">
                                                            <span className="me-2" style={{ fontSize: '20px', filter: 'grayscale(100%)' }}>
                                                                📚
                                                            </span>
                                                            <div className="flex-grow-1">
                                                                <h6 className="card-title fw-bold mb-1">{course.courseName}</h6>
                                                                <p className="card-text text-muted small mb-0">
                                                                    {course.totalQuestions || 0} Questions | {course.duration} min
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <span className="small text-success">{course.progress || 0}% Complete</span>
                                                            </div>
                                                            <div className="progress" style={{ height: '6px' }}>
                                                                <div
                                                                    className="progress-bar bg-success"
                                                                    style={{ width: `${course.progress || 0}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-success flex-grow-1">
                                                                Manage
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDeleteCourse(course._id)}
                                                                title="Delete Course"
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

                            {/* Course Details & Questions */}
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4 text-dark">Course Details & Questions</h5>

                                    <div className="row mb-4">
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <label className="form-label me-2 mb-0 fw-medium">Select Course:</label>
                                                <select 
                                                    className="form-select"
                                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                                    value={selectedCourse || ''}
                                                >
                                                    <option value="">Choose a course</option>
                                                    {coursesData.map(course => (
                                                        <option key={course._id} value={course._id}>
                                                            {course.courseName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <button 
                                                className="btn btn-outline-secondary"
                                                disabled={!selectedCourse}
                                            >
                                                Edit Course Details
                                            </button>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-borderless">
                                            <thead>
                                                <tr className="border-bottom">
                                                    <th className="fw-medium text-muted pb-3">Question Text</th>
                                                    <th className="fw-medium text-muted pb-3">Question Answer</th>
                                                    <th className="fw-medium text-muted pb-3">Correct Answer</th>
                                                    <th className="fw-medium text-muted pb-3">Marks</th>
                                                    <th className="fw-medium text-muted pb-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {questionData.map((question) => (
                                                    <tr key={question.id} className="border-bottom">
                                                        <td className="py-3 fw-medium">{question.text}</td>
                                                        <td className="py-3 text-center">{question.answer}</td>
                                                        <td className="py-3 text-center">{question.correct}</td>
                                                        <td className="py-3 text-center">{question.marks}</td>
                                                        <td className="py-3 text-center">
                                                            <button className="btn btn-sm btn-outline-secondary border-0 p-1 me-2">
                                                                <span style={{ filter: 'grayscale(100%)' }}>📋</span>
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger border-0 p-1">
                                                                <span>✕</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-medium text-dark">
                                    Courses Completed: {coursesData.filter(c => c.progress === 100).length} / {coursesData.length}
                                </span>
                                <button className="btn btn-success">
                                    + Add New Question
                                </button>
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
                                    <div className="alert alert-danger alert-dismissible">
                                        {error}
                                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                    </div>
                                )}
                                
                                {!questionPoolAction ? (
                                    <div className="d-grid gap-3">
                                        <button 
                                            className="btn btn-outline-success btn-lg"
                                            onClick={() => handleQuestionPoolAction('create')}
                                        >
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="me-2">➕</span>
                                                <span>Create New Question Pool</span>
                                            </div>
                                        </button>
                                        <button 
                                            className="btn btn-outline-primary btn-lg"
                                            onClick={() => handleQuestionPoolAction('import')}
                                        >
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="me-2">📥</span>
                                                <span>Import Existing Question Pool</span>
                                            </div>
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
                                        <div className="d-flex gap-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary flex-fill"
                                                onClick={() => {
                                                    setQuestionPoolAction('');
                                                    setError('');
                                                }}
                                                disabled={loading}
                                            >
                                                Back
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-success flex-fill"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        Creating...
                                                    </>
                                                ) : (
                                                    questionPoolAction === 'create' ? 'Create Pool' : 'Import Pool'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Course Modal */}
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
                                    <div className="alert alert-danger alert-dismissible">
                                        {error}
                                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                    </div>
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
                                        {questionPools.length === 0 && (
                                            <small className="text-danger">
                                                ⚠️ No question pools available. Create one first!
                                            </small>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary flex-fill"
                                            onClick={() => {
                                                setShowCourseModal(false);
                                                setError('');
                                            }}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-success flex-fill"
                                            disabled={loading || questionPools.length === 0}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create Course'
                                            )}
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