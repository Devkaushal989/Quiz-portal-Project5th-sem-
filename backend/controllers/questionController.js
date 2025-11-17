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
 
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: 'No CSV file uploaded' 
    });
  }

  const { questionPoolId } = req.body;

  try {
    const pool = await QuestionPool.findById(questionPoolId);
    if (!pool) {
     
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false,
        message: 'Question pool not found' 
      });
    }

    const questions = [];
    const results = [];
    const errors = [];
    let hasResponded = false;

    const stream = fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        if (hasResponded) return;

        try {
          console.log('CSV Data received:', results.length, 'rows');
          console.log('First row sample:', results[0]);

          if (results.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ 
              success: false,
              message: 'CSV file is empty' 
            });
          }

          for (let i = 0; i < results.length; i++) {
            const row = results[i];
            
            try {
             
              if (!row.questionText || !row.option1 || !row.option2 || 
                  !row.option3 || !row.option4 || !row.correctAnswer || !row.difficulty) {
                errors.push(`Row ${i + 2}: Missing required fields - ${JSON.stringify(row)}`);
                console.error(`Row ${i + 2} missing fields:`, row);
                continue;
              }

              
              const options = [
                { optionText: String(row.option1).trim(), isCorrect: parseInt(row.correctAnswer) === 1 },
                { optionText: String(row.option2).trim(), isCorrect: parseInt(row.correctAnswer) === 2 },
                { optionText: String(row.option3).trim(), isCorrect: parseInt(row.correctAnswer) === 3 },
                { optionText: String(row.option4).trim(), isCorrect: parseInt(row.correctAnswer) === 4 }
              ];

              const difficulty = String(row.difficulty).toLowerCase().trim();
             
              if (!['easy', 'medium', 'hard'].includes(difficulty)) {
                errors.push(`Row ${i + 2}: Invalid difficulty "${row.difficulty}". Must be easy, medium, or hard`);
                continue;
              }

              const correctAnswer = parseInt(row.correctAnswer);
              if (isNaN(correctAnswer) || correctAnswer < 1 || correctAnswer > 4) {
                errors.push(`Row ${i + 2}: Invalid correctAnswer "${row.correctAnswer}". Must be 1, 2, 3, or 4`);
                continue;
              }

              const question = await Question.create({
                questionText: String(row.questionText).trim(),
                options: options,
                correctAnswer: correctAnswer,
                marks: parseInt(row.marks) || 1,
                difficulty: difficulty,
                questionPool: questionPoolId,
                createdBy: req.user._id
              });

              questions.push(question);

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

              console.log(`Successfully processed row ${i + 2}`);

            } catch (err) {
              errors.push(`Row ${i + 2}: ${err.message}`);
              console.error(`Error processing row ${i + 2}:`, err.message);
            }
          }

          await pool.save();

         
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          hasResponded = true;

          if (questions.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No questions were uploaded. Please check the CSV format.',
              errors: errors,
              hint: 'Make sure your CSV has these exact headers: questionText,option1,option2,option3,option4,correctAnswer,marks,difficulty'
            });
          }

          return res.status(201).json({
            success: true,
            message: `${questions.length} questions uploaded successfully${errors.length > 0 ? ` (${errors.length} rows failed)` : ''}`,
            data: {
              totalUploaded: questions.length,
              totalFailed: errors.length,
              easy: pool.easyCount,
              medium: pool.mediumCount,
              hard: pool.hardCount,
              errors: errors.length > 0 ? errors.slice(0, 10) : undefined 
            }
          });

        } catch (error) {
          hasResponded = true;
         
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          console.error('CSV Processing Error:', error);
          return res.status(500).json({ 
            success: false,
            message: 'Server error while processing CSV',
            error: error.message 
          });
        }
      })
      .on('error', (error) => {
        if (hasResponded) return;
        hasResponded = true;
        
        console.error('CSV Read Error:', error);
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ 
          success: false,
          message: 'Error reading CSV file. Make sure it is a valid CSV format.',
          error: error.message 
        });
      });

  } catch (error) {
    console.error('CSV Upload Error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ 
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
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });

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
        pool.easyCount = Math.max(0, pool.easyCount - 1);
      } else if (question.difficulty === 'medium') {
        pool.mediumQuestions.pull(question._id);
        pool.mediumCount = Math.max(0, pool.mediumCount - 1);
      } else if (question.difficulty === 'hard') {
        pool.hardQuestions.pull(question._id);
        pool.hardCount = Math.max(0, pool.hardCount - 1);
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
      data: selectedQuestions.sort(() => 0.5 - Math.random())
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