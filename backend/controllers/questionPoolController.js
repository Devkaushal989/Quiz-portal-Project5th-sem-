// const QuestionPool = require('../models/QuestionPool');
// const Question = require('../models/Question');

// exports.createQuestionPool = async (req, res) => {
//   try {
//     const { poolName, description, category } = req.body;

//     if (!poolName || !category) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Pool name and category are required' 
//       });
//     }

//     const existingPool = await QuestionPool.findOne({ 
//       poolName, 
//       createdBy: req.user._id 
//     });

//     if (existingPool) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Question pool with this name already exists' 
//       });
//     }

//     const questionPool = await QuestionPool.create({
//       poolName,
//       description,
//       category,
//       createdBy: req.user._id
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Question pool created successfully',
//       data: questionPool
//     });
//   } catch (error) {
//     console.error('Create Question Pool Error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while creating question pool',
//       error: error.message 
//     });
//   }
// };

// exports.getQuestionPools = async (req, res) => {
//   try {
//     const questionPools = await QuestionPool.find({ 
//       createdBy: req.user._id,
//       isActive: true 
//     })
//     .populate('questions')
//     .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: questionPools.length,
//       data: questionPools
//     });
//   } catch (error) {
//     console.error('Get Question Pools Error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while fetching question pools',
//       error: error.message 
//     });
//   }
// };

// exports.getQuestionPoolById = async (req, res) => {
//   try {
//     const questionPool = await QuestionPool.findById(req.params.id)
//       .populate('questions')
//       .populate('createdBy', 'fullName email');

//     if (!questionPool) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Question pool not found' 
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: questionPool
//     });
//   } catch (error) {
//     console.error('Get Question Pool Error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while fetching question pool',
//       error: error.message 
//     });
//   }
// };

// exports.updateQuestionPool = async (req, res) => {
//   try {
//     const { poolName, description, category } = req.body;

//     const questionPool = await QuestionPool.findOneAndUpdate(
//       { _id: req.params.id, createdBy: req.user._id },
//       { poolName, description, category, updatedAt: Date.now() },
//       { new: true, runValidators: true }
//     );

//     if (!questionPool) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Question pool not found or unauthorized' 
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Question pool updated successfully',
//       data: questionPool
//     });
//   } catch (error) {
//     console.error('Update Question Pool Error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while updating question pool',
//       error: error.message 
//     });
//   }
// };

// exports.deleteQuestionPool = async (req, res) => {
//   try {
//     const questionPool = await QuestionPool.findOneAndUpdate(
//       { _id: req.params.id, createdBy: req.user._id },
//       { isActive: false },
//       { new: true }
//     );

//     if (!questionPool) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Question pool not found or unauthorized' 
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Question pool deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete Question Pool Error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while deleting question pool',
//       error: error.message 
//     });
//   }
// };
const QuestionPool = require('../models/QuestionPool');
const Question = require('../models/Question');

exports.createQuestionPool = async (req, res) => {
  try {
    const { poolName, description, category } = req.body;

    if (!poolName || !category) {
      return res.status(400).json({ 
        success: false,
        message: 'Pool name and category are required' 
      });
    }

    const existingPool = await QuestionPool.findOne({ 
      poolName, 
      createdBy: req.user._id 
    });

    if (existingPool) {
      return res.status(400).json({ 
        success: false,
        message: 'Question pool with this name already exists' 
      });
    }

    const questionPool = await QuestionPool.create({
      poolName,
      description,
      category,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Question pool created successfully',
      data: questionPool
    });
  } catch (error) {
    console.error('Create Question Pool Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating question pool',
      error: error.message 
    });
  }
};

exports.getQuestionPools = async (req, res) => {
  try {
    const questionPools = await QuestionPool.find({ 
      createdBy: req.user._id,
      isActive: true 
    })
      .populate('easyQuestions')
      .populate('mediumQuestions')
      .populate('hardQuestions')
      .sort({ createdAt: -1 });

    const formattedPools = questionPools.map(pool => ({
      ...pool.toObject(),
      questions: [
        ...pool.easyQuestions,
        ...pool.mediumQuestions,
        ...pool.hardQuestions
      ]
    }));

    res.status(200).json({
      success: true,
      count: formattedPools.length,
      data: formattedPools
    });
  } catch (error) {
    console.error('Get Question Pools Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching question pools',
      error: error.message 
    });
  }
};

exports.getQuestionPoolById = async (req, res) => {
  try {
    const questionPool = await QuestionPool.findById(req.params.id)
      .populate('easyQuestions')
      .populate('mediumQuestions')
      .populate('hardQuestions')
      .populate('createdBy', 'fullName email');

    if (!questionPool) {
      return res.status(404).json({ 
        success: false,
        message: 'Question pool not found' 
      });
    }

    const formattedPool = {
      ...questionPool.toObject(),
      questions: [
        ...questionPool.easyQuestions,
        ...questionPool.mediumQuestions,
        ...questionPool.hardQuestions
      ]
    };

    res.status(200).json({
      success: true,
      data: formattedPool
    });
  } catch (error) {
    console.error('Get Question Pool Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching question pool',
      error: error.message 
    });
  }
};

exports.updateQuestionPool = async (req, res) => {
  try {
    const { poolName, description, category } = req.body;

    const questionPool = await QuestionPool.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { poolName, description, category, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!questionPool) {
      return res.status(404).json({ 
        success: false,
        message: 'Question pool not found or unauthorized' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question pool updated successfully',
      data: questionPool
    });
  } catch (error) {
    console.error('Update Question Pool Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating question pool',
      error: error.message 
    });
  }
};

exports.deleteQuestionPool = async (req, res) => {
  try {
    const questionPool = await QuestionPool.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!questionPool) {
      return res.status(404).json({ 
        success: false,
        message: 'Question pool not found or unauthorized' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question pool deleted successfully'
    });
  } catch (error) {
    console.error('Delete Question Pool Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting question pool',
      error: error.message 
    });
  }
};
