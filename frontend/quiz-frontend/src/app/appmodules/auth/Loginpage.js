import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginpage.css';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:8700/api';

export default function AuthPage() {
    const [userType, setUserType] = useState('Student');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        loginEmail: '',
        loginPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error messages when user types
        setError('');
        setSuccessMessage('');
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                userType: userType
            });

            if (response.data.success) {
                setSuccessMessage('Registration successful! Please log in.');
                // Store token in localStorage
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                
                // Clear form
                setFormData({
                    ...formData,
                    fullName: '',
                    email: '',
                    password: ''
                });

                // Redirect based on user type after 2 seconds
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
                // Store token in localStorage
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                
                // Redirect based on user type after 1 second
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
                        {/* Error/Success Messages */}
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
                                        {loading ? 'Logging In...' : 'Log Up'}
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
