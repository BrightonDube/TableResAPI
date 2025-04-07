// routes/table.routes.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const {
  validateTableInput,
} = require('../middleware/dataValidationMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, validateTableInput, tableController.createTable);

router.get('/', verifyToken, tableController.getAllTables);

router.get('/:tableId', verifyToken, tableController.getTableById);

router.put(
  '/:tableId',
  verifyToken,
  validateTableInput,
  tableController.updateTable
);

router.delete('/:tableId', verifyToken, tableController.deleteTable);

module.exports = router;
