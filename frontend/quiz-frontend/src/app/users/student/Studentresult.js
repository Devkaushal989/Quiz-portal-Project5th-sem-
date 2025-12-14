// StudentResultsPage.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Quiz_Logo from '../../images/quiz_logo.png';
// import './student_result.css';

const API_BASE_URL = 'http://localhost:8700/api';

export default function StudentResultsPage() {
  const [activeTab, setActiveTab] = useState('My Results');
  const [history, setHistory] = useState([]); // from backend
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null); // attempt object from backend
  const [loadingAttempt, setLoadingAttempt] = useState(false);
  const [attemptError, setAttemptError] = useState('');

  const getAuthToken = () => localStorage.getItem('token');
  const axiosConfig = () => ({ headers: { Authorization: `Bearer ${getAuthToken()}` } });

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch attempts history (completed)
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      // keep this endpoint (your routes map to /quiz/history under student)
      const res = await axios.get(`${API_BASE_URL}/student/quiz/history`, axiosConfig());
      if (res.data.success) {
        setHistory(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load history');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch single attempt details and open modal
  const openAttemptModal = async (attemptId) => {
    try {
      setLoadingAttempt(true);
      setAttemptError('');
      setSelectedAttempt(null);
      setShowModal(true);

      // <-- FIXED: correct backend route (matches your student.js router)
      const res = await axios.get(`${API_BASE_URL}/student/quiz/result/${attemptId}`, axiosConfig());

      if (res.data.success) {
        // controller returns cleaned attempt object in res.data.data
        setSelectedAttempt(res.data.data || null);
      } else {
        setAttemptError(res.data.message || 'Failed to fetch attempt');
      }
    } catch (err) {
      console.error('Fetch attempt error:', err);
      setAttemptError(err.response?.data?.message || 'Failed to fetch attempt');
    } finally {
      setLoadingAttempt(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAttempt(null);
    setAttemptError('');
  };

  const getScoreColor = (score) => {
    const n = Number(score);
    if (n >= 90) return 'text-success';
    if (n >= 75) return 'text-primary';
    if (n >= 60) return 'text-warning';
    return 'text-danger';
  };

  // Render helpers
  const renderOptionCell = (optionText, isCorrect, isSelected) => {
    if (isSelected && !isCorrect) {
      return (
        <td className="align-middle text-danger fw-bold" style={{ background: '#fff5f5' }}>
          {optionText}
        </td>
      );
    }
    if (isCorrect) {
      return (
        <td className="align-middle text-success fw-bold" style={{ background: '#f3fff5' }}>
          {optionText}
        </td>
      );
    }
    return <td className="align-middle text-muted">{optionText}</td>;
  };

  return (
    <>
      <div className="min-vh-100 bg-light">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-lg-2 bg-white vh-100 p-0">
              <div className="text-center py-3">
                <img src={Quiz_Logo} alt="logo" width="150" className="logo_image" />
              </div>
              <div className="p-3 h-100 d-flex align-items-start">
                <ul className="nav flex-column w-100">
                  <Link to="/student" className="text-decoration-none">
                    <li className="nav-item mb-2">
                      <button
                        className={`nav-link w-100 text-center border-0 ${activeTab === 'Dashboard2' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                        onClick={() => setActiveTab('Dashboard2')}
                      >
                        Dashboard
                      </button>
                    </li>
                  </Link>

                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'My Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('My Results')}
                    >
                      My Results
                    </button>
                  </li>

                  <li className="nav-item mb-2">
                    <button
                      className={`nav-link w-100 text-center border-0 ${activeTab === 'Results' ? 'bg-primary text-white' : 'text-dark'} rounded`}
                      onClick={() => setActiveTab('Results')}
                    >
                      Results
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
                  {loadingHistory ? (
                    <div className="text-center py-4">Loading attempts...</div>
                  ) : history.length === 0 ? (
                    <div className="text-center py-4 text-muted">No attempts available.</div>
                  ) : (
                    <table className="table table-borderless">
                      <thead>
                        <tr className="border-bottom">
                          <th className="fw-medium text-muted">Attempt</th>
                          <th className="fw-medium text-muted">Date</th>
                          <th className="fw-medium text-muted">Time Allocated</th>
                          <th className="fw-medium text-muted">Time Taken</th>
                          <th className="fw-medium text-muted">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((attempt) => (
                          <tr key={attempt._id} className="border-bottom">
                            <td className="py-3">
                              <span className="fw-medium">{attempt.attemptLabel || `Attempt`}</span>
                              <div className="text-muted small">{attempt.totalQuestions} Qs</div>
                            </td>
                            <td className="py-3 text-muted">{new Date(attempt.completedAt || attempt.createdAt).toLocaleString()}</td>
                            <td className="py-3 text-muted">{attempt.course?.duration ? `${attempt.course.duration} min` : '-'}</td>
                            <td className="py-3 text-muted">{attempt.timeTaken ? `${attempt.timeTaken} sec` : '-'}</td>
                            <td className="py-3">
                              {attempt.status === 'completed' ? (
                                <div className="d-flex align-items-center gap-2">
                                  <span className={`fw-medium ${getScoreColor(attempt.percentage)}`}>
                                    {attempt.percentage ? `${Number(attempt.percentage).toFixed(1)}%` : `${Math.round((attempt.marksObtained / attempt.totalMarks) * 100)}%`}
                                  </span>
                                  <button
                                    className="btn btn-link p-0 text-decoration-none ms-3"
                                    onClick={() => openAttemptModal(attempt._id)}
                                  >
                                    View Details
                                  </button>
                                </div>
                              ) : (
                                <span className="fw-medium text-muted">{attempt.status}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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

      {/* DETAILS MODAL */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedAttempt?.course?.courseName || 'Quiz Details'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                {loadingAttempt ? (
                  <div className="text-center py-4">Loading attempt...</div>
                ) : attemptError ? (
                  <div className="alert alert-danger">{attemptError}</div>
                ) : !selectedAttempt ? (
                  <div className="text-center py-4 text-muted">No data.</div>
                ) : (
                  <>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-3"><strong>Quiz Date</strong><div className="text-muted">{new Date(selectedAttempt.completedAt || selectedAttempt.createdAt).toLocaleDateString()}</div></div>
                        <div className="col-md-3"><strong>Start Time</strong><div className="text-muted">{new Date(selectedAttempt.createdAt).toLocaleTimeString()}</div></div>
                        <div className="col-md-3"><strong>End Time</strong><div className="text-muted">{selectedAttempt.completedAt ? new Date(selectedAttempt.completedAt).toLocaleTimeString() : '-'}</div></div>
                        <div className="col-md-3"><strong>No. of Questions</strong><div className="text-muted">{selectedAttempt.totalQuestions || 0}</div></div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-sm table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: '40px' }}>S.No</th>
                            <th>Question</th>
                            <th style={{ width: '120px' }}>Option A</th>
                            <th style={{ width: '120px' }}>Option B</th>
                            <th style={{ width: '120px' }}>Option C</th>
                            <th style={{ width: '120px' }}>Option D</th>
                            <th style={{ width: '120px' }}>Right Answer</th>
                            <th style={{ width: '140px' }}>Student Answer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedAttempt.questions || []).map((q, idx) => {
                            // Updated shape: q is the question object (cleaned by backend)
                            const studentChoice = q.studentSelectedAnswer !== undefined && q.studentSelectedAnswer !== null
                              ? q.studentSelectedAnswer
                              : null;
                            const correctChoice = q.correctAnswer;

                            return (
                              <tr key={q._id || idx} className={studentChoice && studentChoice !== correctChoice ? 'text-danger' : ''}>
                                <td>{idx + 1}</td>
                                <td style={{ minWidth: '300px' }}>{q.questionText}</td>

                                {/* Options — mark correct in green, selected wrong in red */}
                                {(q.options || []).map((opt, oi) => {
                                  const isCorrect = correctChoice === oi + 1;
                                  const isSelected = studentChoice === oi + 1;
                                  return (
                                    <React.Fragment key={oi}>
                                      {renderOptionCell(opt?.optionText || '-', isCorrect, isSelected)}
                                    </React.Fragment>
                                  );
                                })}

                                <td className="align-middle">
                                  <span className="fw-bold text-success">{`Option ${correctChoice || '-'}`}</span>
                                </td>
                                <td className="align-middle">
                                  {studentChoice ? (
                                    studentChoice === correctChoice ? (
                                      <span className="fw-bold text-success">{`Option ${studentChoice}`}</span>
                                    ) : (
                                      <span className="fw-bold text-danger">{`Option ${studentChoice}`}</span>
                                    )
                                  ) : (
                                    <span className="text-muted">Unanswered</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 d-flex justify-content-between">
                      <div>
                        <strong>Total: </strong>{selectedAttempt.totalQuestions || 0} questions &nbsp;|&nbsp;
                        <strong>Correct:</strong> {selectedAttempt.correctAnswers || 0} &nbsp;|&nbsp;
                        <strong>Wrong:</strong> {selectedAttempt.wrongAnswers || 0}
                      </div>
                      <div>
                        <strong>Marks:</strong> {selectedAttempt.marksObtained || 0}/{selectedAttempt.totalMarks || 0} &nbsp;|&nbsp;
                        <strong>Percentage:</strong> {Number(selectedAttempt.percentage || 0).toFixed(2)}%
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
