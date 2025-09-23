import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Loginpage from './app/appmodules/auth/Loginpage';
import Apperrorpage from './app/error404/Apperror';
import Student from './app/users/student/Student';
import Studentresult from './app/users/student/Studentresult';
import TeacherDashboard from './app/users/teacher/Teacherdashboard';
import TeacherResultsPage from './app/users/teacher/Teacherresult';
import Admin from './app/users/admin/Admin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Loginpage />}></Route>
            <Route path='*' element={<Apperrorpage />}></Route>
            <Route path='student' element={<Student />}></Route>
            <Route path='student/result' element={<Studentresult />}></Route>
            <Route path='teacher' element={<TeacherDashboard/>}></Route>
            <Route path='teacher/result' element={<TeacherResultsPage/>}></Route>
            <Route path='admin' element={<Admin/>}></Route>
            

        </Routes>
    </BrowserRouter>
);