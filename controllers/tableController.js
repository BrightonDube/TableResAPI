const Table = require('../models/Table');

const createTable = async (req, res, next) => {
    try {
        const newTable = new Table(req.body);
        const savedTable = await newTable.save();
        res.status(201).json(savedTable);
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
};

const getAllTables = async (req, res, next) => {
    try {
        const tables = await Table.find();
        res.status(200).json(tables);
    } catch (error) {
        next(error);
    }
};

const getTableById = async (req, res, next) => {
    try {
        const table = await Table.findById(req.params.tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.status(200).json(table);
    } catch (error) {
        next(error);
    }
};

const updateTable = async (req, res, next) => {
    try {
        const updatedTable = await Table.findByIdAndUpdate(req.params.tableId, req.body, { new: true, runValidators: true });
        if (!updatedTable) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.status(200).json(updatedTable);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message }); // Validation error from Mongoose
        }
        next(error);
    }
};

const deleteTable = async (req, res, next) => {
    try {
        const deletedTable = await Table.findByIdAndDelete(req.params.tableId);
        if (!deletedTable) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTable,
    getAllTables,
    getTableById,
    updateTable,
    deleteTable,
};