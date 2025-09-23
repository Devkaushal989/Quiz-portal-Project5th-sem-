import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Quiz');

  const statsData = [
    { label: 'Total Students', value: '1,245', color: 'primary' },
    { label: 'Total Teachers', value: '87', color: 'secondary' },
    { label: 'Total Courses', value: '153', color: 'success' },
    { label: 'Total Questions', value: '2,890', color: 'info' }
  ];

  const studentsData = [
    { name: 'Name', email: 'Email', courses: 'Enrolled Courses', actions: ['Edit', 'Delete'] },
    { name: 'Name', email: 'Email', courses: 'Assigned Courses', count: 10, actions: ['Edit', 'Delete'] },
    { name: 'Name', email: 'Email', courses: 'Assigned Courses', count: 5, actions: ['Edit', 'Delete'] }
  ];

  const coursesData = [
    {
      id: 1,
      title: 'Course 1',
      type: 'Course',
      rating: 4,
      instructor: 'Teacher',
      questions: 4
    },
    {
      id: 2,
      title: 'Course 2 Questions',
      type: 'Course',
      rating: 5,
      instructor: 'Teacher',
      questions: 3
    },
    {
      id: 3,
      title: 'Course 3',
      type: 'Course',
      rating: 3,
      instructor: 'Teacher',
      questions: 3
    }
  ];

  const quickAddData = [
    { name: 'Nice Inter', type: 'Admin', status: 'Not scheduled', action: 'Delete' },
    { name: '', type: 'Course', code: '1192', action: 'Delete' }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100 bg-light">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 col-lg-2 bg-dark vh-100 p-0">
              <div className="p-3">
                {/* Admin Header */}
                <div className="mb-4">
                  <h6 className="text-white fw-bold">Admin Dashboard</h6>
                </div>

                {/* Navigation */}
                <nav>
                  <ul className="nav flex-column">
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Quiz' ? 'bg-primary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Quiz')}
                      >
                        <span className="me-3">📋</span> Quiz
                      </button>
                    </li>
                    <Link to="/student" className='text-decoration-none'>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Students' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Students')}
                      >
                        <span className="me-3">👥</span> Students
                      </button>
                    </li>
                    </Link>
                    <Link to="/teacher" className='text-decoration-none'>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Teachers' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Teachers')}
                      >
                        <span className="me-3">👨‍🏫</span> Teachers
                      </button>
                    </li>
                    </Link>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Courses' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Courses')}
                      >
                        <span className="me-3">📚</span> Courses
                      </button>
                    </li>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Questions' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Questions')}
                      >
                        <span className="me-3">❓</span> Questions
                      </button>
                    </li>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Analytics' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Analytics')}
                      >
                        <span className="me-3">📊</span> Analytics
                      </button>
                    </li>
                    <li className="nav-item mb-1">
                      <button
                        className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${
                          activeTab === 'Settings' ? 'bg-secondary text-white' : 'text-light bg-transparent'
                        }`}
                        onClick={() => setActiveTab('Settings')}
                      >
                        <span className="me-3">⚙️</span> Settings
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-md-9 col-lg-10 p-4">
              {/* Stats Cards */}
              <div className="row mb-4">
                {statsData.map((stat, index) => (
                  <div key={index} className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center">
                        <h6 className="card-title text-muted mb-2">{stat.label}</h6>
                        <h3 className={`fw-bold text-${stat.color} mb-0`}>{stat.value}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row">
                {/* Manage Students Section */}
                <div className="col-lg-8 mb-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="fw-bold mb-4">Manage Students</h5>
                      
                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <thead>
                            <tr className="border-bottom">
                              <th className="fw-medium text-muted">Name</th>
                              <th className="fw-medium text-muted">Email</th>
                              <th className="fw-medium text-muted">Enrolled Courses</th>
                              <th className="fw-medium text-muted">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentsData.map((student, index) => (
                              <tr key={index} className="border-bottom">
                                <td className="py-3">{student.name}</td>
                                <td className="py-3">{student.email}</td>
                                <td className="py-3">
                                  {student.courses}
                                  {student.count && <span className="ms-2 badge bg-primary">{student.count}</span>}
                                </td>
                                <td className="py-3">
                                  <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                                  <button className="btn btn-sm btn-danger">Delete</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Manage Courses Section */}
                      <div className="mt-5">
                        <h5 className="fw-bold mb-4">Manage Courses</h5>
                        <div className="row">
                          {coursesData.map((course) => (
                            <div key={course.id} className="col-md-4 mb-3">
                              <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                  <div className="mb-2">
                                    <div className="bg-secondary rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" 
                                         style={{ width: '50px', height: '50px' }}>
                                      <span>👤</span>
                                    </div>
                                    <h6 className="fw-bold">{course.title}</h6>
                                    <small className="text-muted">{course.type}</small>
                                  </div>
                                  <div className="mb-2">
                                    <span className="text-warning" style={{ fontSize: '14px' }}>
                                      {renderStars(course.rating)}
                                    </span>
                                  </div>
                                  <p className="small text-muted mb-2">
                                    {course.instructor}<br/>
                                    {course.questions} questions
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Add Section */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="fw-bold mb-4">Quick Add</h6>
                      
                      {quickAddData.map((item, index) => (
                        <div key={index} className="d-flex align-items-center justify-content-between mb-3 p-3 bg-light rounded">
                          <div className="d-flex align-items-center">
                            <div className="bg-dark rounded-circle me-3 d-flex align-items-center justify-content-center" 
                                 style={{ width: '40px', height: '40px' }}>
                              <span className="text-white">👤</span>
                            </div>
                            <div>
                              <div className="fw-medium">{item.name || 'Course'}</div>
                              <small className="text-muted">
                                {item.type} {item.code && `• ${item.code}`}
                              </small>
                              {item.status && (
                                <div className="small text-muted">{item.status}</div>
                              )}
                            </div>
                          </div>
                          <button className="btn btn-sm btn-danger">Delete</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
}