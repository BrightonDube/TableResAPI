// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const validationMiddleware = require('../middleware/dataValidationMiddleware');
const router = express.Router();

router.post(
  '/',
  validationMiddleware.validateUserInput,
  userController.createUser
);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put(
  '/:id',
  validationMiddleware.validateUserInput,
  userController.updateUser
);
router.delete('/:id', userController.deleteUser);

module.exports = router;
