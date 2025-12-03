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

            const response = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);

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
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: formData.loginEmail,
                password: formData.loginPassword,
                userType: userType
            });

            if (response.data.success) {
                setSuccessMessage('Login successful! Redirecting...');
              
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                
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
                                {['Student', 'Teacher'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setUserType(type)}
                                        className={`btn ${userType === type
                                            ? 'btn-primary'
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

                                    {/* Show Program and Semester only for Students */}
                                    {userType === 'Student' && (
                                        <>
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
                                        </>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-success w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing Up...' : 'Sign Up'}
                                    </button>
                                </form>
                                <p className="text-center text-muted">
                                    Already have an account?{' '}
                                    <a href="#login" className="text-primary text-decoration-none fw-medium">
                                        Log In
                                    </a>
                                </p>
                            </div>

                            {/* Log In Form */}
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
                    </div>
                </div>
            </div>
        </>
    );
}
