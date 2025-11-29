import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8700/api';

export default function AssignQuizModal({ show, onClose, courseId, courseName }) {
    const [assignmentType, setAssignmentType] = useState('program'); 
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [maxAttempts, setMaxAttempts] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Program and Semester options
    const programs = [
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

    const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const getAuthToken = () => localStorage.getItem('token');
    const getAxiosConfig = () => ({
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        if (show) {
            fetchStudents();
        }
    }, [show]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/assignments/students`,
                getAxiosConfig()
            );
            if (response.data.success) {
                setStudents(response.data.data);
            }
        } catch (err) {
            console.error('Fetch students error:', err);
            setError('Failed to load students');
        }
    };

    const handleStudentSelect = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    const getFilteredStudentsByProgramSemester = () => {
        return students.filter(student =>
            student.program === selectedProgram &&
            student.semester === selectedSemester
        );
    };

    const handleAssignQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            let studentIdsToAssign = [];
            let assignToAll = false;

            if (assignmentType === 'all') {
                assignToAll = true;
            } else if (assignmentType === 'program') {
                const filteredStudents = getFilteredStudentsByProgramSemester();
                studentIdsToAssign = filteredStudents.map(s => s._id);
            } else {
                studentIdsToAssign = selectedStudents;
            }

            const response = await axios.post(
                `${API_BASE_URL}/assignments/assign`,
                {
                    courseId: courseId,
                    studentIds: studentIdsToAssign,
                    assignToAll: assignToAll,
                    dueDate: dueDate,
                    maxAttempts: parseInt(maxAttempts),
                    program: assignmentType === 'program' ? selectedProgram : undefined,
                    semester: assignmentType === 'program' ? selectedSemester : undefined
                },
                getAxiosConfig()
            );

            if (response.data.success) {
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    onClose();
                    // Reset form
                    setAssignmentType('program');
                    setSelectedProgram('');
                    setSelectedSemester('');
                    setSelectedStudents([]);
                    setDueDate('');
                    setMaxAttempts(1);
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign quiz');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStudentCount = () => {
        if (assignmentType === 'all') return students.length;
        if (assignmentType === 'program' && selectedProgram && selectedSemester) {
            return getFilteredStudentsByProgramSemester().length;
        }
        if (assignmentType === 'individual') return selectedStudents.length;
        return 0;
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-primary text-white border-0">
                        <div>
                            <h5 className="modal-title fw-bold mb-1"><svg xmlns="http://www.w3.org/2000/svg"
                                width="28" height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round">

                                <path d="M4 19h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4z"></path>


                                <path d="M10 19h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-6z"></path>

                                <path d="M16 17l3 1.5a2 2 0 0 0 2-1l1-2.2a2 2 0 0 0-1-2.6L18 10"></path>

                            </svg>
                                Assign Quiz to Students</h5>
                            <small className="opacity-75">{courseName}</small>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            disabled={loading}
                        ></button>
                    </div>
                    <div className="modal-body p-4">
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {error}
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert alert-success fade show">
                                <i className="bi bi-check-circle me-2"></i>
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleAssignQuiz}>
                            {/* Assignment Type Selection */}
                            <div className="mb-4">
                                <label className="form-label fw-bold text-dark mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    Select Assignment Type
                                </label>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div
                                            className={`card border-2 h-100 cursor-pointer ${assignmentType === 'program' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                            onClick={() => setAssignmentType('program')}
                                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                        >
                                            <div className="card-body text-center p-3">
                                                <div className="mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={assignmentType === 'program' ? '#0d6efd' : '#6c757d'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                                    </svg>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="assignmentType"
                                                    checked={assignmentType === 'program'}
                                                    onChange={() => setAssignmentType('program')}
                                                    className="form-check-input me-2"
                                                />
                                                <span className="fw-bold">By Program & Semester</span>
                                                <p className="small text-muted mb-0 mt-1">Assign to specific class</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div
                                            className={`card border-2 h-100 cursor-pointer ${assignmentType === 'individual' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                            onClick={() => setAssignmentType('individual')}
                                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                        >
                                            <div className="card-body text-center p-3">
                                                <div className="mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={assignmentType === 'individual' ? '#0d6efd' : '#6c757d'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="assignmentType"
                                                    checked={assignmentType === 'individual'}
                                                    onChange={() => setAssignmentType('individual')}
                                                    className="form-check-input me-2"
                                                />
                                                <span className="fw-bold">Individual Students</span>
                                                <p className="small text-muted mb-0 mt-1">Pick specific students</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div
                                            className={`card border-2 h-100 cursor-pointer ${assignmentType === 'all' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                            onClick={() => setAssignmentType('all')}
                                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                        >
                                            <div className="card-body text-center p-3">
                                                <div className="mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={assignmentType === 'all' ? '#0d6efd' : '#6c757d'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="9" cy="7" r="4"></circle>
                                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                    </svg>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="assignmentType"
                                                    checked={assignmentType === 'all'}
                                                    onChange={() => setAssignmentType('all')}
                                                    className="form-check-input me-2"
                                                />
                                                <span className="fw-bold">All Students</span>
                                                <p className="small text-muted mb-0 mt-1">Assign to everyone</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Program & Semester Selection */}
                            {assignmentType === 'program' && (
                                <div className="mb-4 p-3 bg-light rounded">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                                </svg>
                                                Select Program *
                                            </label>
                                            <select
                                                className="form-select form-select-lg"
                                                value={selectedProgram}
                                                onChange={(e) => setSelectedProgram(e.target.value)}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Choose Program</option>
                                                {programs.map((prog) => (
                                                    <option key={prog} value={prog}>
                                                        {prog}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                Select Semester *
                                            </label>
                                            <select
                                                className="form-select form-select-lg"
                                                value={selectedSemester}
                                                onChange={(e) => setSelectedSemester(e.target.value)}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Choose Semester</option>
                                                {semesters.map((sem) => (
                                                    <option key={sem} value={sem}>
                                                        Semester {sem}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {selectedProgram && selectedSemester && (
                                        <div className="alert alert-info mt-3 mb-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                            </svg>
                                            <strong>{getFilteredStudentsByProgramSemester().length}</strong> students found in <strong>{selectedProgram}</strong> - Semester <strong>{selectedSemester}</strong>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Individual Student Selection */}
                            {assignmentType === 'individual' && (
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        Search & Select Students *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg mb-3"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="border rounded" style={{ maxHeight: '280px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                                        {filteredStudents.length === 0 ? (
                                            <div className="p-4 text-center text-muted">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                                </svg>
                                                <p className="mb-0">No students found</p>
                                            </div>
                                        ) : (
                                            filteredStudents.map(student => (
                                                <div
                                                    key={student._id}
                                                    className="form-check p-3 border-bottom bg-white"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleStudentSelect(student._id)}
                                                >
                                                    <input
                                                        className="form-check-input me-3"
                                                        type="checkbox"
                                                        id={`student-${student._id}`}
                                                        checked={selectedStudents.includes(student._id)}
                                                        onChange={() => handleStudentSelect(student._id)}
                                                        disabled={loading}
                                                    />
                                                    <label
                                                        className="form-check-label w-100"
                                                        htmlFor={`student-${student._id}`}
                                                    >
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <div className="fw-bold">{student.fullName}</div>
                                                                <small className="text-muted">{student.email}</small>
                                                            </div>
                                                            <div className="text-end">
                                                                <span className="badge bg-primary">{student.program}</span>
                                                                <span className="badge bg-secondary ms-1">Sem {student.semester}</span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {selectedStudents.length > 0 && (
                                        <div className="alert alert-success mt-2 mb-0">
                                            ✓ <strong>{selectedStudents.length}</strong> student(s) selected
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Due Date */}
                            <div className="mb-4">
                                <label className="form-label fw-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    Due Date & Time (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    className="form-control form-control-lg"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    disabled={loading}
                                />
                                <small className="text-muted">Leave empty for no deadline</small>
                            </div>

                            {/* Maximum Attempts */}
                            <div className="mb-4">
                                <label className="form-label fw-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    Maximum Attempts *
                                </label>
                                <input
                                    type="number"
                                    className="form-control form-control-lg"
                                    min="1"
                                    max="10"
                                    value={maxAttempts}
                                    onChange={(e) => setMaxAttempts(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <small className="text-muted">Number of times a student can attempt this quiz (1-10)</small>
                            </div>

                            {/* Student Count Summary */}
                            {getStudentCount() > 0 && (
                                <div className="alert alert-primary d-flex align-items-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-3">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    <div>
                                        <strong>Ready to assign!</strong>
                                        <div className="small">This quiz will be assigned to <strong>{getStudentCount()}</strong> student(s)</div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="d-flex gap-3">
                                <button
                                    type="button"
                                    className="btn btn-lg btn-outline-secondary flex-fill"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-lg btn-success flex-fill"
                                    disabled={loading || getStudentCount() === 0}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            Assign Quiz
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}