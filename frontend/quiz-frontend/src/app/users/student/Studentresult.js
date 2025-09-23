import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Quiz_Logo from '../../images/quiz_logo.png'
import './student_result.css'


export default function StudentResultsPage() {
  const [activeTab, setActiveTab] = useState('My Results');

  const resultData = [
    {
      attempt: 'A)',
      score: 93,
      date: '2024-07-25',
      timeAllocated: '40 min',
      timeTaken: '30 min',
      scorePercentage: '76%',
      status: 'completed'
    },
    {
      attempt: 'A)',
      score: 77,
      date: '2024-07-28',
      timeAllocated: '35 min',
      timeTaken: '30 min',
      scorePercentage: '92%',
      status: 'completed'
    },
    {
      attempt: 'D)',
      score: 80,
      date: '2024-08-01',
      timeAllocated: '30 min',
      timeTaken: '30 min',
      scorePercentage: '',
      status: 'view-details'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  return (
    <>
     
      
      <div className="min-vh-100 bg-light">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-lg-2 bg-white vh-100 p-0">
              <img src={Quiz_Logo} alt="logo" width="150" className='logo_image'/>
              <div className="p-3 h-100 d-flex align-items-center">
                <ul className="nav flex-column w-100">
                  <Link to="/student" className='text-decoration-none'>
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Dashboard2' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Dashboard2')}
                    >
                      📊 Dashboard
                    </button>
                  </li>
                  </Link>
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'My Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('My Results')}
                    >
                      📈 My Results
                    </button>
                  </li>
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Results')}
                    >
                      📋 Results
                    </button>
                  </li>
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
                <h2 className="h4 fw-bold text-center">Mathematics Basics - Results</h2>
              </div>

              
              <div className="bg-white rounded p-4 shadow-sm mb-4">
                <div className="row">
                  <div className="col-md-6">
                    <h3 className="h2 fw-bold text-dark mb-2">Score: 88%</h3>
                    <p className="text-muted mb-0">Correct Answers: 22/25</p>
                  </div>
                </div>
              </div>

              
              <div className="bg-white rounded p-4 shadow-sm">
                <h5 className="fw-bold mb-4">Attempt History</h5>
                
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr className="border-bottom">
                        <th className="fw-medium text-muted">Attempt</th>
                        <th className="fw-medium text-muted">Date</th>
                        <th className="fw-medium text-muted">Time Taken</th>
                        <th className="fw-medium text-muted">Time Taken</th>
                        <th className="fw-medium text-muted">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultData.map((result, index) => (
                        <tr key={index} className="border-bottom">
                          <td className="py-3">
                            <span className="fw-medium">{result.attempt}</span>
                            <span className="ms-2 text-muted">{result.score}</span>
                          </td>
                          <td className="py-3 text-muted">{result.date}</td>
                          <td className="py-3 text-muted">{result.timeAllocated}</td>
                          <td className="py-3 text-muted">{result.timeTaken}</td>
                          <td className="py-3">
                            {result.status === 'view-details' ? (
                              <button className="btn btn-link p-0 text-decoration-none">
                                View Details
                              </button>
                            ) : (
                              <span className={`fw-medium ${getScoreColor(result.score)}`}>
                                {result.scorePercentage}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              
              <div className="position-fixed bottom-0 end-0 p-4">
                <button className="btn btn-success rounded-circle" style={{ width: '50px', height: '50px' }}>
                  <span style={{ fontSize: '20px' }}>?</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
}