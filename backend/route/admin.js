const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../schema/datamodel');

const QuizAssignment = require('../models/QuizAssignment');
const Course = require('../models/Course');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await User.findOne({ _id: decoded.userId, userType: 'Admin' });

        if (!admin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Admin privileges required.' 
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid token.' 
        });
    }
};

router.get('/check', async (req, res) => {
    try {
        const admin = await User.findOne({ userType: 'Admin' }).select('email fullName createdAt');
        
        if (admin) {
            const emailParts = admin.email.split('@');
            const maskedEmail = emailParts[0].substring(0, 3) + '***@' + emailParts[1];
            
            res.json({
                success: true,
                exists: true,
                message: 'Admin account exists',
                data: {
                    emailHint: maskedEmail,
                    fullName: admin.fullName,
                    createdAt: admin.createdAt
                }
            });
        } else {
            res.json({
                success: true,
                exists: false,
                message: 'No admin account found. Use POST /api/admin/setup to create one.'
            });
        }
    } catch (error) {
        console.error('Check admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword, secretKey } = req.body;
        
        if (secretKey !== 'RESET_ADMIN_2024') {
            return res.status(403).json({
                success: false,
                message: 'Invalid secret key'
            });
        }
        
        const admin = await User.findOne({ email, userType: 'Admin' });
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found with this email'
            });
        }
        
        admin.password = newPassword;
        await admin.save();
        
        res.json({
            success: true,
            message: 'Admin password reset successfully!'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const admin = await User.findOne({ email, userType: 'Admin' });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials or not an admin account'
            });
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { userId: admin._id, userType: 'Admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                token,
                admin: {
                    id: admin._id,
                    fullName: admin.fullName,
                    email: admin.email,
                    userType: admin.userType
                }
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

router.post('/setup', async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ userType: 'Admin' });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin account already exists. Cannot create another.'
            });
        }

        const adminData = {
            fullName: req.body.fullName || 'System Administrator',
            email: req.body.email || 'admin@quizotron.com',
            password: req.body.password || 'admin123',
            userType: 'Admin'
        };

        const admin = new User(adminData);
        await admin.save();

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully!',
            data: {
                fullName: adminData.fullName,
                email: adminData.email,
                note: 'Please change the default password immediately after first login!'
            }
        });

    } catch (error) {
        console.error('Admin setup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin setup'
        });
    }
});

router.post('/register-teacher', adminAuth, async (req, res) => {
    try {
        const { fullName, email, password, department } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and password are required'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const teacher = new User({
            fullName,
            email,
            password,
            userType: 'Teacher',
            department: department || ''
        });

        await teacher.save();

        res.status(201).json({
            success: true,
            message: 'Teacher registered successfully',
            data: {
                id: teacher._id,
                fullName: teacher.fullName,
                email: teacher.email,
                department: teacher.department
            }
        });

    } catch (error) {
        console.error('Register teacher error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while registering teacher'
        });
    }
});

router.get('/teachers', adminAuth, async (req, res) => {
    try {
        const teachers = await User.find({ userType: 'Teacher' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: teachers
        });

    } catch (error) {
        console.error('Fetch teachers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching teachers'
        });
    }
});

router.delete('/teachers/:id', adminAuth, async (req, res) => {
    try {
        const teacher = await User.findOneAndDelete({
            _id: req.params.id,
            userType: 'Teacher'
        });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        res.json({
            success: true,
            message: 'Teacher deleted successfully'
        });

    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting teacher'
        });
    }
});

router.get('/students', adminAuth, async (req, res) => {
    try {
        const students = await User.find({ userType: 'Student' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: students
        });

    } catch (error) {
        console.error('Fetch students error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching students'
        });
    }
});

router.delete('/students/:id', adminAuth, async (req, res) => {
    try {
        const student = await User.findOneAndDelete({
            _id: req.params.id,
            userType: 'Student'
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting student'
        });
    }
});

router.get('/assignments', adminAuth, async (req, res) => {
    try {
        const assignments = await QuizAssignment.find()
            .populate('course', 'courseName description duration totalQuestions')
            .populate('questionPool', 'name totalQuestions')
            .populate('assignedBy', 'fullName email department')
            .populate('assignedTo', 'fullName email program semester')
            .sort({ createdAt: -1 });

        const formattedAssignments = assignments.map(assignment => ({
            _id: assignment._id,
            course: assignment.course,
            questionPool: assignment.questionPool,
            teacher: assignment.assignedBy,
            students: assignment.assignedTo,
            studentsCount: assignment.assignedToAll ? 'All Students' : (assignment.assignedTo?.length || 0),
            assignedToAll: assignment.assignedToAll,
            dueDate: assignment.dueDate,
            maxAttempts: assignment.maxAttempts,
            isActive: assignment.isActive,
            status: assignment.isActive ? 'active' : 'inactive',
            createdAt: assignment.createdAt
        }));

        res.json({
            success: true,
            data: formattedAssignments
        });

    } catch (error) {
        console.error('Fetch assignments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching assignments'
        });
    }
});

router.get('/courses', adminAuth, async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('questionPool', 'name totalQuestions')
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: courses
        });

    } catch (error) {
        console.error('Fetch courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching courses'
        });
    }
});

router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalTeachers = await User.countDocuments({ userType: 'Teacher' });
        const totalStudents = await User.countDocuments({ userType: 'Student' });
        const totalCourses = await Course.countDocuments();
        const totalAssignments = await QuizAssignment.countDocuments();
        const activeAssignments = await QuizAssignment.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: {
                totalTeachers,
                totalStudents,
                totalQuizzes: totalCourses,
                totalAssignments,
                activeAssignments
            }
        });

    } catch (error) {
        console.error('Fetch stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching stats'
        });
    }
});

module.exports = router;