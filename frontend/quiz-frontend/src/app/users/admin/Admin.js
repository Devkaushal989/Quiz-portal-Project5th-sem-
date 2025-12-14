import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import quizLogo from '../../images/quiz_logo.png';

const API_BASE_URL = 'http://localhost:8700/api';

const Sidebar = ({
    activeTab,
    navItems,
    onNavClick,
    sidebarOpen,
    toggleSidebar,
    closeSidebar
}) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        window.location.href = '/';
    };

    const navLinkStyle = (isActive) => ({
        backgroundColor: isActive ? '#0d6efd' : 'transparent',
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

            <div className={`bg-dark border-end sidebar-container ${sidebarOpen ? 'active' : ''}`}>
                <button 
                    className="btn btn-close btn-close-white d-lg-none position-absolute p-3" 
                    onClick={closeSidebar} 
                    style={{top: '10px', right: '10px', zIndex: 1100}}
                ></button>

                <div className="py-3 px-3 border-bottom d-flex align-items-center gap-3">
                    <img 
                        src={quizLogo} 
                        alt="Quiz Logo" 
                        style={{ width: '50px', height: 'auto', objectFit: 'contain', borderRadius: '8px' }}
                    />
                    <h4 className="fw-bold mb-0" style={{ color: '#f4f6f9ff' }}>
                        Admin Panel
                    </h4>
                </div>
                
                <div className="text-center pt-4 pb-3 border-bottom">
                    <div className="d-flex justify-content-center mb-3">
                        <div 
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center position-relative"
                            style={{ width: '100px', height: '100px', border: '3px solid #0d6efd' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                        </div>
                    </div>
                    <h6 className="fw-bold mb-1" style={{ color: '#f4f6f9ff' }}>
                        Administrator
                    </h6>
                    <p className="text-light small mb-0">System Admin</p>
                </div>

                <nav className="py-3">
                    <ul className="nav flex-column px-2">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.label;
                            return (
                                <li className="nav-item mb-1" key={item.label}>
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

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [teacherForm, setTeacherForm] = useState({
        fullName: '',
        email: '',
        password: '',
        department: ''
    });
    
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [stats, setStats] = useState({
        totalTeachers: 0,
        totalStudents: 0,
        totalQuizzes: 0,
        totalAssignments: 0
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const adminNavItems = [
        { 
            label: 'Dashboard', 
            svgPath: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
        },
        { 
            label: 'Register Teacher', 
            svgPath: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
        },
        { 
            label: 'All Teachers', 
            svgPath: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
        },
        { 
            label: 'All Students', 
            svgPath: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',
        },
        { 
            label: 'All Assignments', 
            svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
        }
    ];

    const getAuthToken = () => localStorage.getItem('token');
    const getAxiosConfig = () => ({
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchTeachers(),
                fetchStudents(),
                fetchAssignments(),
                fetchStats()
            ]);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(
  `${process.env.REACT_APP_API_URL}/admin/teachers`,
  getAxiosConfig()
);;
            if (response.data.success) {
                setTeachers(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch teachers:', err);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
  `${process.env.REACT_APP_API_URL}/admin/students`,
  getAxiosConfig()
);

            if (response.data.success) {
                setStudents(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch students:', err);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await axios.get(
  `${process.env.REACT_APP_API_URL}/admin/assignments`,
  getAxiosConfig()
);

            if (response.data.success) {
                setAssignments(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch assignments:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(
  `${process.env.REACT_APP_API_URL}/admin/stats`,
  getAxiosConfig()
);

            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const handleTeacherInputChange = (e) => {
        setTeacherForm({
            ...teacherForm,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccessMessage('');
    };

    const handleRegisterTeacher = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/admin/register-teacher`,
  {
    ...teacherForm,
    userType: 'Teacher'
  },
  getAxiosConfig()
);

            if (response.data.success) {
                setSuccessMessage('Teacher registered successfully!');
                setTeacherForm({
                    fullName: '',
                    email: '',
                    password: '',
                    department: ''
                });
                fetchTeachers();
                fetchStats();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register teacher');
            console.error('Register teacher error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) return;

        try {
            const response = await axios.delete(
  `${process.env.REACT_APP_API_URL}/admin/teachers/${teacherId}`,
  getAxiosConfig()
);


            if (response.data.success) {
                setSuccessMessage('Teacher deleted successfully!');
                fetchTeachers();
                fetchStats();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete teacher');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        try {
            const response = await axios.delete(
  `${process.env.REACT_APP_API_URL}/admin/students/${studentId}`,
  getAxiosConfig()
);


            if (response.data.success) {
                setSuccessMessage('Student deleted successfully!');
                fetchStudents();
                fetchStats();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete student');
        }
    };

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
            <style>
                {`
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
                .sidebar-nav-btn:hover:not([style*="background-color: rgb(13, 110, 253)"]) {
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
                }
                `}
            </style>

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" crossOrigin="anonymous" />
            
            <Sidebar
                activeTab={activeTab}
                navItems={adminNavItems}
                onNavClick={setActiveTab}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={closeSidebar}
            />
            
            <div className="mobile-header d-lg-none">
                <h4 className="fw-bold mb-0">Admin Dashboard</h4>
                <button className="btn btn-dark" onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div className="flex-grow-1 bg-light main-content-wrapper">
                <div className="p-4">
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success alert-dismissible fade show">
                            {successMessage}
                            <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                        </div>
                    )}

                    {/* Dashboard View */}
                    {activeTab === 'Dashboard' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h1 className="h3 fw-bold text-dark mb-1 d-none d-lg-block">Admin Dashboard</h1>
                                    <p className="text-muted mb-0 d-none d-lg-block">Manage your Quiz-o-Tron system</p>
                                </div>
                            </div>

                            <div className="row g-4 mb-4 stat-card-row">
                                <div className="col-md-3">
                                    <div className="card border-0 shadow-sm stat-card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <p className="text-muted mb-1 small">Total Teachers</p>
                                                    <h3 className="fw-bold mb-0">{teachers.length}</h3>
                                                </div>
                                                <div className="bg-primary bg-opacity-10 rounded p-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="9" cy="7" r="4"></circle>
                                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
                                                    <p className="text-muted mb-1 small">Total Students</p>
                                                    <h3 className="fw-bold mb-0">{students.length}</h3>
                                                </div>
                                                <div className="bg-success bg-opacity-10 rounded p-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                                    <p className="text-muted mb-1 small">Total Quizzes</p>
                                                    <h3 className="fw-bold mb-0">{stats.totalQuizzes}</h3>
                                                </div>
                                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
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
                                                    <p className="text-muted mb-1 small">Total Assignments</p>
                                                    <h3 className="fw-bold mb-0">{assignments.length}</h3>
                                                </div>
                                                <div className="bg-info bg-opacity-10 rounded p-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0dcaf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-3">Recent Teachers</h5>
                                            <div className="list-group list-group-flush">
                                                {teachers.slice(0, 5).map((teacher) => (
                                                    <div key={teacher._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6 className="mb-0">{teacher.fullName}</h6>
                                                            <small className="text-muted">{teacher.email}</small>
                                                        </div>
                                                        <span className="badge bg-primary">{teacher.department || 'N/A'}</span>
                                                    </div>
                                                ))}
                                                {teachers.length === 0 && (
                                                    <p className="text-muted text-center py-3">No teachers registered yet</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-3">Recent Students</h5>
                                            <div className="list-group list-group-flush">
                                                {students.slice(0, 5).map((student) => (
                                                    <div key={student._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6 className="mb-0">{student.fullName}</h6>
                                                            <small className="text-muted">{student.email}</small>
                                                        </div>
                                                        <span className="badge bg-success">{student.program || 'N/A'}</span>
                                                    </div>
                                                ))}
                                                {students.length === 0 && (
                                                    <p className="text-muted text-center py-3">No students registered yet</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Register Teacher View */}
                    {activeTab === 'Register Teacher' && (
                        <div>
                            <h4 className="fw-bold mb-4">Register New Teacher</h4>
                            <div className="row justify-content-center">
                                <div className="col-md-8">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-4">
                                            <form onSubmit={handleRegisterTeacher}>
                                                <div className="mb-3">
                                                    <label className="form-label fw-medium">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        placeholder="Enter teacher's full name"
                                                        value={teacherForm.fullName}
                                                        onChange={handleTeacherInputChange}
                                                        className="form-control form-control-lg"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-medium">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="teacher@example.com"
                                                        value={teacherForm.email}
                                                        onChange={handleTeacherInputChange}
                                                        className="form-control form-control-lg"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-medium">Password</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        placeholder="Create a secure password"
                                                        value={teacherForm.password}
                                                        onChange={handleTeacherInputChange}
                                                        className="form-control form-control-lg"
                                                        required
                                                        minLength="6"
                                                        disabled={loading}
                                                    />
                                                    <small className="text-muted">Minimum 6 characters</small>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label fw-medium">Department</label>
                                                    <input
                                                        type="text"
                                                        name="department"
                                                        placeholder="e.g., Computer Science, Mathematics"
                                                        value={teacherForm.department}
                                                        onChange={handleTeacherInputChange}
                                                        className="form-control form-control-lg"
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-lg w-100"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                            Registering...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="8.5" cy="7" r="4"></circle>
                                                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                                                <line x1="23" y1="11" x2="17" y2="11"></line>
                                                            </svg>
                                                            Register Teacher
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* All Teachers View */}
                    {activeTab === 'All Teachers' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">All Registered Teachers</h4>
                                <span className="badge bg-primary fs-6">{teachers.length} Total</span>
                            </div>

                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="fw-medium py-3">#</th>
                                                    <th className="fw-medium py-3">Name</th>
                                                    <th className="fw-medium py-3">Email</th>
                                                    <th className="fw-medium py-3">Department</th>
                                                    <th className="fw-medium py-3">Registered On</th>
                                                    <th className="fw-medium py-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {teachers.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-5 text-muted">
                                                            No teachers registered yet
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    teachers.map((teacher, index) => (
                                                        <tr key={teacher._id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                                                                        <span className="fw-bold text-primary">
                                                                            {teacher.fullName?.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <span className="fw-medium">{teacher.fullName}</span>
                                                                </div>
                                                            </td>
                                                            <td>{teacher.email}</td>
                                                            <td>
                                                                <span className="badge bg-info">
                                                                    {teacher.department || 'Not Specified'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {new Date(teacher.createdAt || Date.now()).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDeleteTeacher(teacher._id)}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                    </svg>
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
                        </div>
                    )}

                    {/* All Students View */}
                    {activeTab === 'All Students' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">All Registered Students</h4>
                                <span className="badge bg-success fs-6">{students.length} Total</span>
                            </div>

                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="fw-medium py-3">#</th>
                                                    <th className="fw-medium py-3">Name</th>
                                                    <th className="fw-medium py-3">Email</th>
                                                    <th className="fw-medium py-3">Program</th>
                                                    <th className="fw-medium py-3">Semester</th>
                                                    <th className="fw-medium py-3">Registered On</th>
                                                    <th className="fw-medium py-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-5 text-muted">
                                                            No students registered yet
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    students.map((student, index) => (
                                                        <tr key={student._id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                                                                        <span className="fw-bold text-success">
                                                                            {student.fullName?.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <span className="fw-medium">{student.fullName}</span>
                                                                </div>
                                                            </td>
                                                            <td>{student.email}</td>
                                                            <td>
                                                                <span className="badge bg-primary">
                                                                    {student.program || 'Not Specified'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-secondary">
                                                                    {student.semester ? `Semester ${student.semester}` : 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {new Date(student.createdAt || Date.now()).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDeleteStudent(student._id)}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                    </svg>
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
                        </div>
                    )}

                    {/* All Assignments View */}
                    {activeTab === 'All Assignments' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">All Quiz Assignments</h4>
                                <span className="badge bg-primary fs-6">{assignments.length} Total</span>
                            </div>

                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="fw-medium py-3">#</th>
                                                    <th className="fw-medium py-3">Course Name</th>
                                                    <th className="fw-medium py-3">Assigned By</th>
                                                    <th className="fw-medium py-3">Students Assigned</th>
                                                    <th className="fw-medium py-3">Due Date</th>
                                                    <th className="fw-medium py-3">Max Attempts</th>
                                                    <th className="fw-medium py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assignments.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-5 text-muted">
                                                            No quiz assignments created yet
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    assignments.map((assignment, index) => (
                                                        <tr key={assignment._id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <div>
                                                                    <span className="fw-medium">{assignment.course?.courseName || 'N/A'}</span>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        {assignment.course?.duration ? `${assignment.course.duration} mins` : ''}
                                                                        {assignment.course?.totalQuestions ? ` • ${assignment.course.totalQuestions} questions` : ''}
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <span>{assignment.teacher?.fullName || 'Unknown'}</span>
                                                                    <br />
                                                                    <small className="text-muted">{assignment.teacher?.email}</small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-info">
                                                                    {assignment.assignedToAll ? 'All Students' : `${assignment.studentsCount} Students`}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {assignment.dueDate ? (
                                                                    <>
                                                                        {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </>
                                                                ) : (
                                                                    <span className="text-muted">No deadline</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-secondary">
                                                                    {assignment.maxAttempts || 1} {assignment.maxAttempts === 1 ? 'attempt' : 'attempts'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    assignment.isActive ? 'bg-success' : 'bg-danger'
                                                                }`}>
                                                                    {assignment.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

