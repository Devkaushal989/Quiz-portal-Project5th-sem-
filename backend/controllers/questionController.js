const Question = require('../models/Question');
const QuestionPool = require('../models/QuestionPool');
const csv = require('csv-parser');
const fs = require('fs');

exports.addQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, marks, difficulty, questionPoolId } = req.body;

    if (!questionText || !options || !correctAnswer || !difficulty || !questionPoolId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const pool = await QuestionPool.findById(questionPoolId);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Question pool not found'
      });
    }

    const question = await Question.create({
      questionText,
      options,
      correctAnswer,
      marks: marks || 1,
      difficulty,
      questionPool: questionPoolId,
      createdBy: req.user._id
    });

    if (difficulty === 'easy') {
      pool.easyQuestions.push(question._id);
      pool.easyCount += 1;
    } else if (difficulty === 'medium') {
      pool.mediumQuestions.push(question._id);
      pool.mediumCount += 1;
    } else if (difficulty === 'hard') {
      pool.hardQuestions.push(question._id);
      pool.hardCount += 1;
    }

    await pool.save();

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: question
    });
  } catch (error) {
    console.error('Add Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding question',
      error: error.message
    });
  }
};

exports.uploadQuestionsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No CSV file uploaded'
      });
    }

    const { questionPoolId } = req.body;

    const pool = await QuestionPool.findById(questionPoolId);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Question pool not found'
      });
    }

    const questions = [];
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (const row of results) {

            const options = [
              { optionText: row.option1, isCorrect: parseInt(row.correctAnswer) === 1 },
              { optionText: row.option2, isCorrect: parseInt(row.correctAnswer) === 2 },
              { optionText: row.option3, isCorrect: parseInt(row.correctAnswer) === 3 },
              { optionText: row.option4, isCorrect: parseInt(row.correctAnswer) === 4 }
            ];

            const question = await Question.create({
              questionText: row.questionText,
              options: options,
              correctAnswer: parseInt(row.correctAnswer),
              marks: parseInt(row.marks) || 1,
              difficulty: row.difficulty.toLowerCase(),
              questionPool: questionPoolId,
              createdBy: req.user._id
            });

            questions.push(question);


            if (row.difficulty.toLowerCase() === 'easy') {
              pool.easyQuestions.push(question._id);
              pool.easyCount += 1;
            } else if (row.difficulty.toLowerCase() === 'medium') {
              pool.mediumQuestions.push(question._id);
              pool.mediumCount += 1;
            } else if (row.difficulty.toLowerCase() === 'hard') {
              pool.hardQuestions.push(question._id);
              pool.hardCount += 1;
            }
          }

          await pool.save();


          fs.unlinkSync(req.file.path);

          res.status(201).json({
            success: true,
            message: `${questions.length} questions uploaded successfully`,
            data: {
              totalUploaded: questions.length,
              easy: pool.easyCount,
              medium: pool.mediumCount,
              hard: pool.hardCount
            }
          });
        } catch (error) {

          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          throw error;
        }
      });
  } catch (error) {
    console.error('CSV Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading CSV',
      error: error.message
    });
  }
};

exports.getQuestionsByPool = async (req, res) => {
  try {
    const { poolId } = req.params;
    const { difficulty } = req.query;

    const query = { questionPool: poolId };
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const questions = await Question.find(query);

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get Questions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
      error: error.message
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const pool = await QuestionPool.findById(question.questionPool);
    if (pool) {
      if (question.difficulty === 'easy') {
        pool.easyQuestions.pull(question._id);
        pool.easyCount -= 1;
      } else if (question.difficulty === 'medium') {
        pool.mediumQuestions.pull(question._id);
        pool.mediumCount -= 1;
      } else if (question.difficulty === 'hard') {
        pool.hardQuestions.pull(question._id);
        pool.hardCount -= 1;
      }
      await pool.save();
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting question',
      error: error.message
    });
  }
};

exports.getRandomQuestionsForStudent = async (req, res) => {
  try {
    const { poolId } = req.params;

    const pool = await QuestionPool.findById(poolId)
      .populate('easyQuestions')
      .populate('mediumQuestions')
      .populate('hardQuestions');

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Question pool not found'
      });
    }

    const randomEasy = pool.easyQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    const randomMedium = pool.mediumQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
    const randomHard = pool.hardQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

    const selectedQuestions = [...randomEasy, ...randomMedium, ...randomHard];

    res.status(200).json({
      success: true,
      totalQuestions: selectedQuestions.length,
      data: selectedQuestions.sort(() => 0.5 - Math.random()) // Shuffle final questions
    });
  } catch (error) {
    console.error('Get Random Questions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
      error: error.message
    });
  }
};

