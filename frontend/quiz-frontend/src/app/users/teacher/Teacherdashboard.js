import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Quiz_Logo from '../../images/quiz_logo.png'

export default function TeacherDashboard() {
    const [activeTab, setActiveTab] = useState('Courses/Exams');

    const coursesData = [
        {
            id: 1,
            title: 'Physics I',
            questions: 20,
            duration: 45,
            progress: 75,
            icon: '⚗️'
        },
        {
            id: 2,
            title: 'Calculus Basics',
            questions: 20,
            duration: 45,
            progress: 100,
            icon: '📐'
        },
        {
            id: 3,
            title: 'Physics',
            questions: 20,
            duration: 45,
            progress: 75,
            icon: '🔬'
        },
        {
            id: 4,
            title: 'Physics',
            questions: 20,
            duration: 45,
            progress: 15,
            icon: '⚛️'
        }
    ];

    const questionData = [
        {
            id: 1,
            text: 'Question Text',
            answer: 1,
            correct: 1,
            marks: 1
        },
        {
            id: 2,
            text: 'Question Text',
            answer: 2,
            correct: 2,
            marks: 2
        },
        {
            id: 3,
            text: 'Question Text',
            answer: 2,
            correct: 3,
            marks: 15
        }
    ];

    return (
        <>
           

            <div className="min-vh-100 bg-light">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3 col-lg-2 bg-dark vh-100 p-0">
                            <div className="p-3">
                                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary">
                                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '40px', height: '40px' }}>
                                        <span className="text-white">👨‍🏫</span>
                                    </div>
                                    <span className="fw-medium text-light">Teacher</span>
                                </div>
                                <nav>
                                    <ul className="nav flex-column">
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Dashboard2' ? 'bg-success text-white' : 'text-light bg-transparent'
                                                    }`}
                                                onClick={() => setActiveTab('Dashboard2')}
                                            >
                                                <span className="me-3">⬜</span> Dashboard
                                            </button>
                                        </li>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Courses/Exams' ? 'bg-success text-white' : 'text-light bg-transparent'
                                                    }`}
                                                onClick={() => setActiveTab('Courses/Exams')}
                                            >
                                                <span className="me-3">🏠</span> Courses/Exams
                                            </button>
                                        </li>
                                         <Link to="/teacher/result" className='text-decoration-none'>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Results' ? 'bg-light text-dark' : 'text-light bg-transparent'
                                                    }`}
                                                onClick={() => setActiveTab('Results')}
                                            >
                                                <span className="me-3">🏆</span> Results
                                            </button>
                                        </li>
                                        </Link>
                                        <li className="nav-item mb-1">
                                            <button
                                                className={`nav-link w-100 text-start border-0 d-flex align-items-center py-2 px-3 rounded ${activeTab === 'Settings' ? 'bg-light text-dark' : 'text-light bg-transparent'
                                                    }`}
                                                onClick={() => setActiveTab('Settings')}
                                            >
                                                <span className="me-3">⚙️</span> Settings
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="col-md-9 col-lg-10 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="h3 fw-bold text-dark mb-0">Courses / Exams</h1>
                                <button className="btn btn-success">
                                    + Add New Course
                                </button>
                            </div>
                            <div className="mb-5">
                                <h4 className="fw-bold mb-3 text-dark">My Courses</h4>
                                <div className="row g-3">
                                    {coursesData.map((course) => (
                                        <div key={course.id} className="col-md-6 col-lg-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-start mb-3">
                                                        <span className="me-2" style={{ fontSize: '20px', filter: 'grayscale(100%)' }}>
                                                            {course.icon}
                                                        </span>
                                                        <div className="flex-grow-1">
                                                            <h6 className="card-title fw-bold mb-1">{course.title}</h6>
                                                            <p className="card-text text-muted small mb-0">
                                                                {course.questions} Questions | {course.duration} min
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <span className="small text-success">{course.progress}% Complete</span>
                                                        </div>
                                                        <div className="progress" style={{ height: '6px' }}>
                                                            <div
                                                                className="progress-bar bg-success"
                                                                style={{ width: `${course.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <button className="btn btn-success w-100">
                                                        Manage
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4 text-dark">Course Details & Questions</h5>

                                    <div className="row mb-4">
                                        <div className="col-md-3">
                                            <div className="d-flex align-items-center">
                                                <label className="form-label me-2 mb-0 fw-medium">Select Course:</label>
                                                <select className="form-select">
                                                    <option>Physics I</option>
                                                    <option>Calculus Basics</option>
                                                    <option>Chemistry</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <button className="btn btn-outline-secondary">
                                                Edit Course Details
                                            </button>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-borderless">
                                            <thead>
                                                <tr className="border-bottom">
                                                    <th className="fw-medium text-muted pb-3"></th>
                                                    <th className="fw-medium text-muted pb-3">Question Answer</th>
                                                    <th className="fw-medium text-muted pb-3">Correct Answer</th>
                                                    <th className="fw-medium text-muted pb-3">Marks</th>
                                                    <th className="fw-medium text-muted pb-3"></th>
                                                    <th className="fw-medium text-muted pb-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {questionData.map((question) => (
                                                    <tr key={question.id} className="border-bottom">
                                                        <td className="py-3 fw-medium">Question Text</td>
                                                        <td className="py-3 text-center">{question.answer}</td>
                                                        <td className="py-3 text-center">{question.correct}</td>
                                                        <td className="py-3 text-center">{question.marks}</td>
                                                        <td className="py-3 text-center">
                                                            <button className="btn btn-sm btn-outline-secondary border-0 p-1">
                                                                <span style={{ filter: 'grayscale(100%)' }}>📋</span>
                                                            </button>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <button className="btn btn-sm btn-outline-danger border-0 p-1">
                                                                <span>✕</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-medium text-dark">Courses Completed: 4 / 12</span>
                                <button className="btn btn-success">
                                    + Add New Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           
        </>
    );
}