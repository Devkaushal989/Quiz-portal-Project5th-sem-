import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8700/api';

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

  // Program and Semester options
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

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 75) return 'text-primary';
    if (percentage >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreBadge = (percentage) => {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 75) return 'bg-primary';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-danger';
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
                    <span className="text-white"><svg xmlns="http://www.w3.org/2000/svg"
                      width="28" height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round">


                      <circle cx="12" cy="5" r="3"></circle>

                      <path d="M6 20v-2c0-3 2-5 6-5s6 2 6 5v2"></path>

                      <rect x="3" y="9" width="18" height="8" rx="1"></rect>

                      <line x1="12" y1="9" x2="12" y2="12"></line>

                    </svg></span>
                  </div>
                  <span className="fw-medium text-white">Teacher</span>
                </div>

                <nav>
                  <ul className="nav flex-column">
                    <Link to="/teacher" className='text-decoration-none'>
                      <li className="nav-item mb-1">
                        <button
                          className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded text-light bg-transparent`}
                        >
                          <span className="me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                          </span> Dashboard
                        </button>
                      </li>
                    </Link>
                    <Link to="/teacher" className='text-decoration-none'>
                      <li className="nav-item mb-1">
                        <button
                          className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded text-light bg-transparent`}
                        >
                          <span className="me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                              <polygon points="12 15 17 21 7 21 12 15"></polygon>
                            </svg>
                          </span> Courses/Exams
                        </button>
                      </li>
                    </Link>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded bg-success text-white`}
                      >
                        <span className="me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                        </span> Results
                      </button>
                    </li>
                    <li className="nav-item mb-1">
                      <button
                        className="nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded text-light bg-transparent hover-danger"
                        onClick={() => {

                          localStorage.removeItem('token');
                          localStorage.removeItem('user');

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
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="h3 fw-bold text-dark mb-1">Student Quiz Results</h1>
                  <p className="text-muted mb-0">View and analyze student performance</p>
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

              {/* Statistics Cards */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
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
                  <div className="card border-0 shadow-sm">
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
                  <div className="card border-0 shadow-sm">
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
                  <div className="card border-0 shadow-sm">
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

              {/* Filters */}
              <div className="card border-0 shadow-sm mb-4">
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
                      <select
                        className="form-select"
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                      >
                        {programs.map((program, index) => (
                          <option key={index} value={program === 'All Programs' ? '' : program}>
                            {program}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-medium">Semester</label>
                      <select
                        className="form-select"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                      >
                        {semesters.map((semester, index) => (
                          <option key={index} value={semester === 'All Semesters' ? '' : semester}>
                            {semester === 'All Semesters' ? semester : `Semester ${semester}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-medium">Course</label>
                      <select
                        className="form-select"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                      >
                        {courses.map((course, index) => (
                          <option key={index} value={course === 'All Courses' ? '' : course}>
                            {course}
                          </option>
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
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Student name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
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
                                  <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2"
                                    style={{ width: '32px', height: '32px' }}>
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
                                <Link
                                  to={`/teacher/result/${result._id}`}
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}