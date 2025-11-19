import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8700/api';

export default function AssignQuizModal({ show, onClose, courseId, courseName }) {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [assignToAll, setAssignToAll] = useState(false);
    const [dueDate, setDueDate] = useState('');
    const [maxAttempts, setMaxAttempts] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleAssignQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(
                `${API_BASE_URL}/assignments/assign`,
                {
                    courseId: courseId,
                    studentIds: selectedStudents,
                    assignToAll: assignToAll,
                    dueDate: dueDate,
                    maxAttempts: parseInt(maxAttempts)
                },
                getAxiosConfig()
            );

            if (response.data.success) {
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    onClose();
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

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">Assign Quiz: {courseName}</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={onClose}
                            disabled={loading}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger alert-dismissible">
                                {error}
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert alert-success">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleAssignQuiz}>
                           
                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="assignToAll"
                                    checked={assignToAll}
                                    onChange={(e) => {
                                        setAssignToAll(e.target.checked);
                                        if (e.target.checked) {
                                            setSelectedStudents([]);
                                        }
                                    }}
                                    disabled={loading}
                                />
                                <label className="form-check-label fw-medium" htmlFor="assignToAll">
                                    Assign to All Students
                                </label>
                            </div>

                          
                            {!assignToAll && (
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Select Students *</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="border rounded" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                        {filteredStudents.length === 0 ? (
                                            <div className="p-3 text-center text-muted">
                                                No students found
                                            </div>
                                        ) : (
                                            filteredStudents.map(student => (
                                                <div 
                                                    key={student._id} 
                                                    className="form-check p-3 border-bottom"
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`student-${student._id}`}
                                                        checked={selectedStudents.includes(student._id)}
                                                        onChange={() => handleStudentSelect(student._id)}
                                                        disabled={loading}
                                                    />
                                                    <label 
                                                        className="form-check-label w-100" 
                                                        htmlFor={`student-${student._id}`}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="d-flex justify-content-between">
                                                            <span className="fw-medium">{student.fullName}</span>
                                                            <span className="text-muted small">{student.email}</span>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {!assignToAll && selectedStudents.length > 0 && (
                                        <small className="text-muted">
                                            {selectedStudents.length} student(s) selected
                                        </small>
                                    )}
                                </div>
                            )}

                           
                            <div className="mb-3">
                                <label className="form-label fw-medium">Due Date (Optional)</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                           
                            <div className="mb-3">
                                <label className="form-label fw-medium">Maximum Attempts *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    max="10"
                                    value={maxAttempts}
                                    onChange={(e) => setMaxAttempts(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <small className="text-muted">Number of times a student can attempt this quiz</small>
                            </div>

                            <div className="d-flex gap-2">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary flex-fill"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-success flex-fill"
                                    disabled={loading || (!assignToAll && selectedStudents.length === 0)}
                                >
                                    {loading ? 'Assigning...' : 'Assign Quiz'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}