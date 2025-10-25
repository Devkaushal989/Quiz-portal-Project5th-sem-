import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function TeacherResultsPage() {
  const [activeTab, setActiveTab] = useState('Results');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const studentResults = [
    {
      id: 1,
      studentName: 'Mayank ',
      courseTitle: 'Physics I',
      score: '88%',
      date: '2024-07-30'
    },
    {
      id: 2,
      studentName: 'Raj',
      courseTitle: 'Physics I',
      score: '72%',
      date: '2024-07-25'
    },
    {
      id: 3,
      studentName: 'Raj',
      courseTitle: 'Calculus Basics',
      score: '72%',
      date: '2025-09-20'
    },
    {
      id: 4,
      studentName: 'Raj',
      courseTitle: 'Mathematics',
      score: '95%',
      date: '2025-05-25'
    },
    {
      id: 5,
      studentName: 'Jay singh',
      courseTitle: 'Physics I',
      score: '95%',
      date: '2025-05-10'
    },
    {
      id: 6,
      studentName: 'Bheem singh',
      courseTitle: 'Physics I',
      score: '20%',
      date: '	2025-07-14'
    },
    {
      id: 7,
      studentName: 'Raju ',
      courseTitle: 'Chemistry',
      score: '92%',
      date: '	2025-08-30'
    }
  ];

  const courses = ['All Courses', 'Physics I', 'Calculus Basics', 'Chemistry', 'Mathematics'];

  const filteredResults = studentResults.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !selectedCourse || selectedCourse === 'All Courses' || result.courseTitle === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleFilter = () => {
    
    console.log('Filtering results...');
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
                  <span className="fw-medium text-white">Teacher</span>
                </div>

                
                <nav>
                  <ul className="nav flex-column">
                    <Link to="/teacher" className='text-decoration-none'>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Dashboard' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Dashboard')}
                      >
                        <span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span> Dashboard
                      </button>
                    </li>
                    </Link>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Courses/Exams' ? 'bg-success text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Courses/Exams')}
                      >
                        <span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg></span> Courses/Exams
                      </button>
                    </li>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Results' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Results')}
                      >
                        <span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg></span> Results
                      </button>
                    </li>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Settings' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Settings')}
                      >
                        <span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg></span> Settings
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

         
            <div className="col-md-9 col-lg-10 p-4">
             
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 fw-bold text-dark mb-0">Results</h1>
                <button className="btn btn-outline-secondary">
                  <span>📤</span>
                </button>
              </div>

             
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <select 
                    className="form-select"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">Course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      🔍
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search Student Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <button 
                    className="btn btn-success w-100"
                    onClick={handleFilter}
                  >
                    Filter
                  </button>
                </div>
              </div>

              <div className="bg-white rounded shadow-sm">
                <div className="p-4">
                  <h5 className="fw-bold mb-4 text-dark">Student Exam Results</h5>
                  
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr className="border-bottom">
                          <th className="fw-medium text-muted pb-3">Student Name</th>
                          <th className="fw-medium text-muted pb-3">Course/Exam Title</th>
                          <th className="fw-medium text-muted pb-3">Score (Percentage)</th>
                          <th className="fw-medium text-muted pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults.map((result) => (
                          <tr key={result.id} className="border-bottom">
                            <td className="py-3 fw-medium">{result.studentName}</td>
                            <td className="py-3">{result.courseTitle}</td>
                            <td className="py-3">{result.score}</td>
                            <td className="py-3">
                              {result.date === 'View Details' ? (
                                <button className="btn btn-link p-0 text-decoration-none">
                                  View Details <span>📋</span>
                                </button>
                              ) : (
                                <span>{result.date}</span>
                              )}
                              {(result.date === '28' || result.date === '10leaf') && (
                                <span className="ms-2">📋</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-center mt-4">
                    <nav>
                      <ul className="pagination pagination-sm">
                        <li className="page-item">
                          <button className="page-link border-0 bg-dark text-white rounded-circle me-2" style={{ width: '32px', height: '32px' }}>
                            ●
                          </button>
                        </li>
                        <li className="page-item">
                          <button className="page-link border-0 bg-light text-dark rounded-circle me-2" style={{ width: '32px', height: '32px' }}>
                            ○
                          </button>
                        </li>
                        <li className="page-item">
                          <button className="page-link border-0 bg-light text-dark">
                            📄
                          </button>
                        </li>
                        <li className="page-item">
                          <button className="page-link border-0 bg-light text-dark ms-2">
                            🗑️
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
}