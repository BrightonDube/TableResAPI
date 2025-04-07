// controllers/tableController.js
const Table = require('../models/Table');
// Import the utility functions
const { 
  formatTable, 
  toObjectId,
  buildQueryFilters,
  getPaginationOptions,
  formatResponse
} = require('../utils/dataTransformUtils');

const createTable = async (req, res, next) => {
    try {
        // Format the table data before saving
        const formattedData = formatTable(req.body);
        const newTable = new Table(formattedData);
        const savedTable = await newTable.save();
        
        res.status(201).json(
            formatResponse(true, "Table created successfully", savedTable)
        );
    } catch (error) {
        next(error);
    }
};

const getAllTables = async (req, res, next) => {
    try {
        // Use pagination and filtering utilities
        const filters = buildQueryFilters(req.query);
        const { page, limit, skip, sort } = getPaginationOptions(req.query);
        
        const tables = await Table.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit);
            
        const total = await Table.countDocuments(filters);
        
        const meta = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        };
        
        res.status(200).json(
            formatResponse(true, "Tables retrieved successfully", tables, meta)
        );
    } catch (error) {
        next(error);
    }
};

const getTableById = async (req, res, next) => {
    try {
        const tableId = toObjectId(req.params.tableId);
        if (!tableId) {
            return res.status(400).json(
                formatResponse(false, "Invalid table ID format")
            );
        }
        
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json(
                formatResponse(false, "Table not found")
            );
        }
        
        res.status(200).json(
            formatResponse(true, "Table retrieved successfully", table)
        );
    } catch (error) {
        next(error);
    }
};

const updateTable = async (req, res, next) => {
    try {
        const tableId = toObjectId(req.params.tableId);
        if (!tableId) {
            return res.status(400).json(
                formatResponse(false, "Invalid table ID format")
            );
        }
        
        // Format the table data before updating
        const formattedData = formatTable(req.body);
        
        const updatedTable = await Table.findByIdAndUpdate(
            tableId, 
            formattedData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedTable) {
            return res.status(404).json(
                formatResponse(false, "Table not found")
            );
        }
        
        res.status(200).json(
            formatResponse(true, "Table updated successfully", updatedTable)
        );
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json(
                formatResponse(false, error.message)
            );
        }
        next(error);
    }
};

const deleteTable = async (req, res, next) => {
    try {
        const tableId = toObjectId(req.params.tableId);
        if (!tableId) {
            return res.status(400).json(
                formatResponse(false, "Invalid table ID format")
            );
        }
        
        const deletedTable = await Table.findByIdAndDelete(tableId);
        if (!deletedTable) {
            return res.status(404).json(
                formatResponse(false, "Table not found")
            );
        }
        
        res.status(200).json(
            formatResponse(true, "Table deleted successfully")
        );
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