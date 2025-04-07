// routes/table.routes.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { validateTableInput } = require('../middleware/dataValidationMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Operations related to restaurant tables
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message describing the issue.
 *       example:
 *         message: "Validation error: Customer name is required."
 *     Table:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the table (MongoDB ObjectId)
 *           readOnly: true
 *         tableNumber:
 *           type: string
 *           description: Unique identifier for the table (e.g., 'T1', '102')
 *           example: "T10"
 *         capacity:
 *           type: integer
 *           format: int32
 *           description: Maximum capacity of the table
 *           example: 4
 *         location:
 *           type: string
 *           description: Location of the table within the restaurant (optional)
 *           example: "Indoor, near window"
 *         isAvailable:
 *           type: boolean
 *           description: Indicates if the table is currently available for reservations (optional, default: true)
 *           example: true
 *       required:
 *         - tableNumber
 *         - capacity
 *       example: # Example for the entire Table schema
 *         tableNumber: "T10"
 *         capacity: 4
 *         location: "Indoor"
 *         isAvailable: true
 *   securitySchemes: # Define your security scheme here
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: connect.sid
 *       description: "Session cookie for Google Authentication. After successful Google login, a `connect.sid` cookie is set, which is used for subsequent authenticated requests."
 */

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Create a new table
 *     tags: [Tables]
 *     security:
 *       - cookieAuth: [] # Use the defined security scheme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       201:
 *         description: Table created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', verifyToken, validateTableInput, tableController.createTable);

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Tables]
 *     security:
 *       - cookieAuth: [] # Use the defined security scheme
 *     responses:
 *       200:
 *         description: Successful retrieval of tables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', verifyToken, tableController.getAllTables);

/**
 * @swagger
 * /tables/{tableId}:
 *   get:
 *     summary: Get a specific table by ID
 *     tags: [Tables]
 *     security:
 *       - cookieAuth: [] # Use the defined security scheme
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         description: ID of the table to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of table
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Table not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:tableId', verifyToken, tableController.getTableById);

/**
 * @swagger
 * /tables/{tableId}:
 *   put:
 *     summary: Update an existing table by ID
 *     tags: [Tables]
 *     security:
 *       - cookieAuth: [] # Use the defined security scheme
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         description: ID of the table to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: Table updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Table not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:tableId', verifyToken, validateTableInput, tableController.updateTable);

/**
 * @swagger
 * /tables/{tableId}:
 *   delete:
 *     summary: Delete a table by ID
 *     tags: [Tables]
 *     security:
 *       - cookieAuth: [] # Use the defined security scheme
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         description: ID of the table to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Table deleted successfully
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Table not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:tableId', verifyToken, tableController.deleteTable);

module.exports = router;