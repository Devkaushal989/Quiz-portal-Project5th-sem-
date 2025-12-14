const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const myrouting = require('./routing/routes');
const authRoutes = require('./route/auth');
const questionPoolRoutes = require('./route/questionPool');
const courseRoutes = require('./route/course');
const questionRoutes = require('./route/question');
const studentRoutes = require('./route/student');
const assignmentRoutes = require('./route/assignment');
const resultRoute = require('./route/result');
const adminRoutes = require('./route/admin');

dotenv.config();

require('./database/connectdb');

const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());

app.use(myrouting);
app.use('/api/auth', authRoutes);
app.use('/api/question-pools', questionPoolRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/results', resultRoute);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Quiz Portal API is running' });
});

const port = process.env.PORT || 8700;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
