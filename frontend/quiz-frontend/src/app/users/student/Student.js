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
            <img src={Quiz_Logo} alt="logo"  className='logo_image'/>
              <div className="p-3 h-100 d-flex align-items-center">
                <ul className="nav flex-column w-100">
                  
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Dashboard' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Dashboard')}
                    >
                      📊 Dashboard
                    </button>
                  </li>
                  
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'My Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('My Results')}
                    >
                      📈 My Results
                    </button>
                  </li>
                   <Link to="/student/result" className='text-decoration-none'>
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Results')}
                    >
                      📋 Results
                    </button>
                  </li>
                     </Link>
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Settings' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Settings')}
                    >
                      ⚙️ Settings
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