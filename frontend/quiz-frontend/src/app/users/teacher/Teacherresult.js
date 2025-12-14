import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:8700/api';
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

export default function TeacherResultsPage() {
    const [activeTab, setActiveTab] = useState('Results');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [studentResults, setStudentResults] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const teacherInfo = JSON.parse(localStorage.getItem('user') || '{}');

    // Sidebar configuration for Teacher
    const teacherNavItems = [
        { 
            label: 'Dashboard', 
            path: '/teacher', 
            svgPath: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
        },
        { 
            label: 'Courses/Exams', 
            path: '/teacher', 
            svgPath: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
        },
        { 
            label: 'Results', 
            path: '/teacher/result', 
            svgPath: '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
        }
    ];

    const teacherProfileDetails = {
        profileDetail1Label: 'Department',
        profileDetail1Value: teacherInfo?.department || 'Faculty',
        profileDetail2Label: 'Status',
        profileDetail2Value: 'Active',
    };

    const programs = [
        'All Programs',
        'B.Tech',
        'BCA',
        'BBA',
        'B.com',
        'Bsc Forensic Science',
        'B.Pharma',
        'D.Pharma',
        'Bsc Agriculture',
        'Other'
    ];

    const semesters = ['All Semesters', '1', '2', '3', '4', '5', '6', '7', '8'];

    const getAuthToken = () => localStorage.getItem('token');
    const getAxiosConfig = () => ({
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        fetchResults();
        fetchCourses();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/results/teacher/all`,
                getAxiosConfig()
            );
            if (response.data.success) {
                setStudentResults(response.data.data);
            }
        } catch (err) {
            setError('Failed to load results');
            console.error('Fetch results error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/courses`, getAxiosConfig());
            if (response.data.success) {
                setCourses(['All Courses', ...response.data.data.map(c => c.courseName)]);
            }
        } catch (err) {
            console.error('Fetch courses error:', err);
        }
    };

    const filteredResults = studentResults.filter(result => {
        const matchesSearch = result.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = !selectedCourse || selectedCourse === 'All Courses' || result.course?.courseName === selectedCourse;
        const matchesProgram = !selectedProgram || selectedProgram === 'All Programs' || result.student?.program === selectedProgram;
        const matchesSemester = !selectedSemester || selectedSemester === 'All Semesters' || result.student?.semester === selectedSemester;
        return matchesSearch && matchesCourse && matchesProgram && matchesSemester;
    });

    const handleExport = () => {
        const csvContent = [
            ['Student Name', 'Program', 'Semester', 'Course', 'Score', 'Percentage', 'Date'].join(','),
            ...filteredResults.map(result => [
                result.student?.fullName,
                result.student?.program,
                result.student?.semester,
                result.course?.courseName,
                `${result.marksObtained}/${result.totalMarks}`,
                `${result.percentage.toFixed(2)}%`,
                new Date(result.completedAt).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz_results_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getScoreBadge = (percentage) => {
        if (percentage >= 90) return 'bg-success';
        if (percentage >= 75) return 'bg-primary';
        if (percentage >= 60) return 'bg-warning';
        return 'bg-danger';
    };

    const handleSidebarNav = (label) => {
        setActiveTab(label);
    };

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
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
                <h4 className="fw-bold mb-0">Student Results</h4>
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
            </div>
        </div>
    );
}