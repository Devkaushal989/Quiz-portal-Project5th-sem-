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
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline></svg>   Dashboard
                    </button>
                  </li>
                  </Link>
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'My Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('My Results')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-box"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line></svg> My Results
                    </button>
                  </li>
                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Results')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> Results
                    </button>
                  </li>
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