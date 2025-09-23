import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginpage.css'
import Quiz_Logo from '../../images/quiz_logo.png'

export default function AuthPage() {
    const [userType, setUserType] = useState('Student');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        loginEmail: '',
        loginPassword: ''
    });

    // const handleInputChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value
    //     });
    // };

    // const handleSignUp = (e) => {
    //     e.preventDefault();
    //     console.log('Sign up:', { userType, ...formData });
    // };

    // const handleLogIn = (e) => {
    //     e.preventDefault();
    //     console.log('Log in:', { userType, loginEmail: formData.loginEmail, loginPassword: formData.loginPassword });
    // };

    return (
        <>
            <div className="min-vh-100  d-flex align-items-center justify-content-center p-4 " style={{ backgroundColor: 'rgba(36,105,92,0.1)' }}>
                <div className="bg-white shadow-lg w-100 mycontainer" style={{ maxWidth: '900px' }} >
                    {/* <div className="d-flex justify-content-center">
                        <img src={Quiz_Logo} alt="logo" width="150" className='logo_image'/>
                    </div> */}
                    <div className="p-5">
                        <div className="mb-5 multiple_users">
                            <div className="btn-group multiple_users" role="group" >
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
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="row both_form border-5 mw-100">
                            <div className="col-md-6">
                                <h2 className="h3 fw-bold text-dark mb-4">Welcome!</h2>
                                <div className="mb-3">
                                    <input
                                        type="text "
                                        name="fullName"
                                        placeholder="Full Name"
                                        // value={formData.fullName}
                                        // onChange={handleInputChange}
                                        className="form-control form-control-medium"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        // value={formData.email}
                                        // onChange={handleInputChange}
                                        className="form-control form-control-medium"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        // value={formData.password}
                                        // onChange={handleInputChange}
                                        className="form-control form-control-medium"
                                    />
                                </div>
                                <button
                                    // onClick={handleSignUp}
                                    className=" w-100 mb-3"
                                >
                                    Sign Up
                                </button>
                                <p className="text-center text-muted">
                                    Already have an account?{' '}
                                    <a href="#" className="text-primary text-decoration-none fw-medium">
                                        Log In
                                    </a>
                                </p>
                            </div>



                            <div className="col-md-6">
                                <h2 className="h3 fw-bold text-dark mb-4 text-center">Log In</h2>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        name="loginEmail"
                                        placeholder="Email Address"
                                        // value={formData.loginEmail}
                                        // onChange={handleInputChange}
                                        className="form-control form-control-medium"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        name="loginPassword"
                                        placeholder="Password"
                                        // value={formData.loginPassword}
                                        // onChange={handleInputChange}
                                        className="form-control form-control-medium"
                                    />
                                </div>
                                <div className="text-center mb-3 fs-5">
                                    <a href="#" className="text-muted text-decoration-none small mt-2 ">
                                        Forgot Password?
                                    </a>
                                </div>
                                <button
                                    // onClick={handleLogIn}
                                    className="w-100 logup_button"
                                >
                                    Log Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}