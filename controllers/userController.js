const User = require('../models/User');
const validationMiddleware = require('../middleware/dataValidationMiddleware');
const errorHandler = require('../middleware/errorHandler');
const { formatResponse } = require('../utils/dataTransformUtils');

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    validationMiddleware.validateUserInput(req, res, async () => {
      const { googleId, name, email } = req.body;
      const newUser = new User({ googleId, name, email });
      const savedUser = await newUser.save();
      res
        .status(201)
        .json(formatResponse(true, 'User created successfully', savedUser));
    });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json(formatResponse(true, 'Users fetched successfully', users));
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    res
      .status(200)
      .json(formatResponse(true, 'User fetched successfully', user));
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      const notFoundError = new Error('User not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }
    next(error);
  }
};

// Update user by ID
exports.updateUser = async (req, res, next) => {
  try {
    validationMiddleware.validateUserInput(req, res, async () => {
      const { googleId, name, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { googleId, name, email },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }
      res
        .status(200)
        .json(formatResponse(true, 'User updated successfully', updatedUser));
    });
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      const notFoundError = new Error('User not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }
    error.statusCode = 400;
    next(error);
  }
};

// Delete user by ID
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    res
      .status(200)
      .json(formatResponse(true, 'User deleted successfully', deletedUser));
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      const notFoundError = new Error('User not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }
    next(error);
  }
};