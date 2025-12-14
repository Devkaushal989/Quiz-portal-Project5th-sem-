import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute'; 
import Loginpage from './app/appmodules/auth/Loginpage';
import Apperrorpage from './app/error404/Apperror';
import StudentDashboard from './app/users/student/Student';
import Studentresult from './app/users/student/Studentresult';
import TeacherDashboard from './app/users/teacher/Teacherdashboard';
import TeacherResultsPage from './app/users/teacher/Teacherresult';
import AdminDashboard from './app/users/admin/Admin'; 
import QuizTaking from './app/users/student/QuizTaking';
import QuizResult from './app/users/student/QuizResult';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
           
            <Route path='/' element={<Loginpage />}></Route>
      
            <Route path='*' element={<Apperrorpage />}></Route> 
            
            <Route element={<ProtectedRoute allowedUserType="Student" />}>
                <Route path='student' element={<StudentDashboard />}></Route>
                <Route path='student/result' element={<Studentresult />}></Route>
                <Route path='student/quiz/:courseId' element={<QuizTaking />}></Route>
                <Route path='student/quiz-result/:attemptId' element={<QuizResult />}></Route>
            </Route>

            <Route element={<ProtectedRoute allowedUserType="Teacher" />}>
                <Route path='teacher' element={<TeacherDashboard/>}></Route>
                <Route path='teacher/result' element={<TeacherResultsPage/>}></Route>
                
            </Route>
            
            <Route element={<ProtectedRoute allowedUserType="Admin" />}>
                <Route path='admin' element={<AdminDashboard/>}></Route>
            </Route>

        </Routes>
    </BrowserRouter>
);