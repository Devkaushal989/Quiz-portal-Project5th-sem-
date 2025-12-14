import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginpage.css';
import quizLogo from '../../images/quiz_logo.png';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8700/api';

export default function AuthPage() {
    const [userType, setUserType] = useState('Student');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        program: '',
        semester: '', 
        loginEmail: '',
        loginPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
       
        setError('');
        setSuccessMessage('');
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const signupData = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                userType: userType
            };

            if (userType === 'Student') {
                signupData.program = formData.program;
                signupData.semester = formData.semester;
            }

            const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/auth/login`,
  data
);

            if (response.data.success) {
                setSuccessMessage('Registration successful! Redirecting...');
                
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
               
                setFormData({
                    ...formData,
                    fullName: '',
                    email: '',
                    password: '',
                    program: '',
                    semester: ''
                });

                setTimeout(() => {
                    redirectToDashboard(userType);
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const loginEndpoint = userType === 'Admin' 
                ? `${API_BASE_URL}/admin/login`
                : `${API_BASE_URL}/auth/login`;

            const loginPayload = userType === 'Admin'
                ? { email: formData.loginEmail, password: formData.loginPassword }
                : { email: formData.loginEmail, password: formData.loginPassword, userType: userType };

            const response = await axios.post(loginEndpoint, loginPayload);

            if (response.data.success) {
                setSuccessMessage('Login successful! Redirecting...');
              
                localStorage.setItem('token', response.data.data.token);
                
                if (userType === 'Admin') {
                    localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
                } else {
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                }
                
                setTimeout(() => {
                    redirectToDashboard(userType);
                }, 1000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const redirectToDashboard = (type) => {
        switch(type) {
            case 'Student':
                window.location.href = '/student';
                break;
            case 'Teacher':
                window.location.href = '/teacher';
                break;
            case 'Admin':
                window.location.href = '/admin';
                break;
            default:
                window.location.href = '/';
        }
    };

    return (
        <>
            <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" 
                style={{ backgroundColor: 'rgba(36,105,92,0.1)' }}>
                    
                <div className="bg-white shadow-lg w-100 mycontainer" style={{ maxWidth: '900px' }}>
                    <div className="p-5">
                        
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {successMessage}
                                <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                            </div>
                        )}

                        {/* User Type Selection */}
                        <div className="mb-5 multiple_users">
                            <div className="btn-group multiple_users" role="group">
                                {['Student', 'Teacher', 'Admin'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setUserType(type)}
                                        className={`btn ${userType === type
                                            ? type === 'Admin' ? 'btn-dark' : 'btn-primary'
                                            : 'btn-outline-secondary'
                                        }`}
                                        id='changebutt'
                                        disabled={loading}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Student View: Both Signup and Login */}
                        {userType === 'Student' && (
                            <div className="row both_form border-5 mw-100">
                                {/* Sign Up Form */}
                                <div className="col-md-6">
                                    <h2 className="h3 fw-bold text-dark mb-4">Welcome!</h2>
                                    <form onSubmit={handleSignUp}>
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="Full Name"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="form-control form-control-medium"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="form-control form-control-medium"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="form-control form-control-medium"
                                                required
                                                minLength="6"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <select
                                                name="program"
                                                value={formData.program}
                                                onChange={handleInputChange}
                                                className="form-select form-control-medium"
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Select Program</option>
                                                {programs.map((prog) => (
                                                    <option key={prog} value={prog}>
                                                        {prog}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <select
                                                name="semester"
                                                value={formData.semester}
                                                onChange={handleInputChange}
                                                className="form-select form-control-medium"
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Select Semester</option>
                                                {semesters.map((sem) => (
                                                    <option key={sem} value={sem}>
                                                        Semester {sem}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-success w-100 mb-3"
                                            disabled={loading}
                                        >
                                            {loading ? 'Signing Up...' : 'Sign Up'}
                                        </button>
                                    </form>
                                </div>

                                {/* Login Form */}
                                <div className="col-md-6">
                                    <h2 className="h3 fw-bold text-dark mb-4 text-center">Log In</h2>
                                    <form onSubmit={handleLogIn}>
                                        <div className="mb-3">
                                            <input
                                                type="email"
                                                name="loginEmail"
                                                placeholder="Email Address"
                                                value={formData.loginEmail}
                                                onChange={handleInputChange}
                                                className="form-control form-control-medium"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                type="password"
                                                name="loginPassword"
                                                placeholder="Password"
                                                value={formData.loginPassword}
                                                onChange={handleInputChange}
                                                className="form-control form-control-medium"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="text-center mb-3 fs-5">
                                            <a href="#forgot" className="text-muted text-decoration-none small mt-2">
                                                Forgot Password?
                                            </a>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-success w-100 logup_button"
                                            disabled={loading}
                                        >
                                            {loading ? 'Logging In...' : 'Log In'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Teacher View: Login Only (Centered) */}
                        {userType === 'Teacher' && (
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <div className="text-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <h2 className="h3 fw-bold text-dark mb-2">Teacher Login</h2>
                                    </div>

                                    <form onSubmit={handleLogIn}>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Email Address</label>
                                            <input
                                                type="email"
                                                name="loginEmail"
                                                placeholder="teacher@example.com"
                                                value={formData.loginEmail}
                                                onChange={handleInputChange}
                                                className="form-control form-control-lg"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Password</label>
                                            <input
                                                type="password"
                                                name="loginPassword"
                                                placeholder="Enter your password"
                                                value={formData.loginPassword}
                                                onChange={handleInputChange}
                                                className="form-control form-control-lg"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="text-center mb-3">
                                            <a href="#forgot" className="text-muted text-decoration-none small">
                                                Forgot Password?
                                            </a>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-lg w-100"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Logging In...
                                                </>
                                            ) : (
                                                'Log In as Teacher'
                                            )}
                                        </button>
                                    </form>

                                    <div className="text-center mt-4">
                                        <p className="text-muted small">
                                            Teachers cannot register through this portal.
                                            <br />
                                            Please contact the administrator.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin View: Login Only (Centered with distinct styling) */}
                        {userType === 'Admin' && (
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                                            style={{ 
                                                width: '100px', 
                                                height: '100px', 
                                                backgroundColor: '#212529',
                                                border: '3px solid #ffc107'
                                            }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                            </svg>
                                        </div>
                                        <h2 className="h3 fw-bold text-dark mb-2">Admin Login</h2>
                                        <p className="text-muted small">Access the administration panel</p>
                                    </div>

                                    <form onSubmit={handleLogIn}>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Admin Email</label>
                                            <input
                                                type="email"
                                                name="loginEmail"
                                                placeholder="admin@quizotron.com"
                                                value={formData.loginEmail}
                                                onChange={handleInputChange}
                                                className="form-control form-control-lg"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Password</label>
                                            <input
                                                type="password"
                                                name="loginPassword"
                                                placeholder="Enter admin password"
                                                value={formData.loginPassword}
                                                onChange={handleInputChange}
                                                className="form-control form-control-lg"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-dark btn-lg w-100"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Authenticating...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                    </svg>
                                                    Access Admin Panel
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="text-center mt-4">
                                        <p className="text-muted small">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M12 16v-4"></path>
                                                <path d="M12 8h.01"></path>
                                            </svg>
                                            Only authorized administrators can access this portal.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
