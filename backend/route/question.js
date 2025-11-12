const express = require('express');
const router = express.Router();
const multer = require('multer');
const questionController = require('../controllers/questionController');
const { authMiddleware } = require('../controllers/authController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
});

router.use(authMiddleware);

router.post('/', questionController.addQuestion);

router.post('/upload-csv', upload.single('csvFile'), questionController.uploadQuestionsCSV);
// router.post('/upload-csv', upload.single('csvFile'), uploadQuestionsCSV);


router.get('/pool/:poolId', questionController.getQuestionsByPool);

router.get('/pool/:poolId/random', questionController.getRandomQuestionsForStudent);

router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
