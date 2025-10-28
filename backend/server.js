// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// const myrouting = require('./routing/routes');
// const authRoutes = require('./route/auth');

// dotenv.config();

// require('./database/connectdb');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use(myrouting);
// app.use('/api/auth', authRoutes);

// app.get('/', (req, res) => {
//     res.json({ message: 'Quiz Portal API is running 🚀' });
// });

// const port = process.env.PORT || 6900;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const myrouting = require('./routing/routes');
const authRoutes = require('./route/auth');
const questionPoolRoutes = require('./route/questionPool');
const courseRoutes = require('./route/course');

dotenv.config();

require('./database/connectdb');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use(myrouting);
app.use('/api/auth', authRoutes);
app.use('/api/question-pools', questionPoolRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Quiz Portal API is running 🚀' });
});

const port = process.env.PORT || 8700;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});