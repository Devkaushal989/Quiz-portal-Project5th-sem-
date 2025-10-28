const Course = require('../models/Course');
const QuestionPool = require('../models/QuestionPool');

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, description, duration, questionPool } = req.body;

    // Validation
    if (!courseName || !duration || !questionPool) {
      return res.status(400).json({ 
        success: false,
        message: 'Course name, duration, and question pool are required' 
      });
    }

    // Check if question pool exists
    const pool = await QuestionPool.findById(questionPool);
    if (!pool) {
      return res.status(404).json({ 
        success: false,
        message: 'Question pool not found' 
      });
    }

    // Check if course name already exists
    const existingCourse = await Course.findOne({ 
      courseName, 
      createdBy: req.user._id 
    });

    if (existingCourse) {
      return res.status(400).json({ 
        success: false,
        message: 'Course with this name already exists' 
      });
    }

    // Create new course
    const course = await Course.create({
      courseName,
      description,
      duration,
      questionPool,
      createdBy: req.user._id,
      totalQuestions: pool.questions.length
    });

    // Populate question pool data
    await course.populate('questionPool');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating course',
      error: error.message 
    });
  }
};

// Get all courses for a teacher
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      createdBy: req.user._id,
      isActive: true 
    })
    .populate('questionPool')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching courses',
      error: error.message 
    });
  }
};

// Get single course
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('questionPool')
      .populate('createdBy', 'fullName email');

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get Course Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching course',
      error: error.message 
    });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { courseName, description, duration, questionPool, progress } = req.body;

    const updateData = {
      updatedAt: Date.now()
    };

    if (courseName) updateData.courseName = courseName;
    if (description) updateData.description = description;
    if (duration) updateData.duration = duration;
    if (questionPool) updateData.questionPool = questionPool;
    if (progress !== undefined) updateData.progress = progress;

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('questionPool');

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found or unauthorized' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating course',
      error: error.message 
    });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found or unauthorized' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting course',
      error: error.message 
    });
  }
};