// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const validationMiddleware = require('../middleware/dataValidationMiddleware');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.post(
  '/',
  verifyToken,
  validationMiddleware.validateUserInput,
  userController.createUser
);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put(
  '/:id',
  verifyToken,
  validationMiddleware.validateUserInput,
  userController.updateUser
);
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
