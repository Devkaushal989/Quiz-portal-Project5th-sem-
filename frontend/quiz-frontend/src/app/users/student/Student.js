import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './student_dashboard.css';
import Quiz_Logo from '../../images/quiz_logo.png'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [studentName] = useState('Student Name');

  const statsData = [
    { label: 'Total Courses', value: '12' },
    { label: 'Attempted Quizzes', value: '8' },
    { label: 'Overall Score', value: '8' },
    { label: 'Overall Score', value: '75%' }
  ];

  const availableCourses = [
    {
      title: 'Mathematics Basics',
      questions: '25 Questions',
      time: '45 min',
      icon: '📊'
    },
    {
      title: 'Physics',
      questions: '30 Questions',
      time: '45 min',
      icon: '⚛️'
    },
    {
      title: 'Physics Fundamentals',
      questions: '40 Questions',
      time: '45 min',
      icon: '🔬'
    },
    {
      title: 'Literature Classics',
      questions: '25 Questions',
      time: '45 min',
      icon: '📚'
    },
    {
      title: 'Chemistry: Stoichiometry',
      questions: '20 Questions',
      time: '45 min',
      icon: '🧪'
    }
  ];

  const recentActivity = [
    { subject: 'Physics', score: '82%', status: 'History Refresh' },
    { subject: 'Mathematics', score: '75%', status: 'History Refresh' }
  ];

  return (
    <>



      <div className="min-vh-100 bg-light">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-lg-2 bg-white vh-100 p-0">
              <img src={Quiz_Logo} alt="logo" className='logo_image' />
              <div className="p-3 h-100 d-flex align-items-center">
                <ul className="nav flex-column w-100">

                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Dashboard' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Dashboard')}
                    >

                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline></svg> 
                      Dashboard
                    </button>
                  </li>

                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'My Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('My Results')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-box"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line></svg> My Results
                    </button>
                  </li>
                  <Link to="/student/result" className='text-decoration-none'>
                    <li className="nav-item mb-2">
                      <button
                        className={`nav-link w-100 text-center border-0 ${activeTab === 'Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                        onClick={() => setActiveTab('Results')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> Results
                      </button>
                    </li>
                  </Link>
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Settings' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Settings')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg> Settings
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-9 col-lg-10 p-4">

              <div className="mb-4">
                <h2 className="h4 fw-bold">Welcome, [{studentName}]</h2>
              </div>


              <div className="row mb-4">
                {statsData.map((stat, index) => (
                  <div key={index} className="col-6 col-md-3 mb-3">
                    <div className="text-center">
                      <div className="text-muted small mb-1">{stat.label}</div>
                      <div className="h4 fw-bold text-dark">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row">

                <div className="col-lg-8 mb-4">
                  <h5 className="fw-bold mb-3">Available Courses</h5>
                  <div className="bg-white rounded p-3 shadow-sm">
                    {availableCourses.map((course, index) => (
                      <div key={index} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{ fontSize: '24px' }}>{course.icon}</div>
                          <div>
                            <div className="fw-medium">{course.title}</div>
                            <div className="text-muted small">{course.questions} | {course.time}</div>
                          </div>
                        </div>
                        <button className="btn btn-success btn-sm">
                          Start Quiz
                        </button>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="col-lg-4">

                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Your Recent Activity</h6>
                    <div className="bg-white rounded p-3 shadow-sm">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center py-2">
                          <div>
                            <div className="fw-medium small">{activity.subject}</div>
                            <div className="text-muted small">{activity.status}</div>
                          </div>
                          <div className="text-success fw-bold">{activity.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>


                  <div className="bg-white rounded p-3 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium">Courses Completed: 4 / 12</span>
                      <span className="fw-bold">33%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: '33%' }}
                      ></div>
                    </div>
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