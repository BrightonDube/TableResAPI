// utils/dataTransformUtils.js

/**
 * Utility functions for handling common data transformations in the TableResAPI
 * These functions help with data formatting, validation, and transformation operations
 * that are commonly used throughout the application.
 */

/**
 * Formats a date string into a consistent ISO format
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted ISO date string or null if invalid
 */
const formatDate = (date) => {
  if (!date) return null;
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toISOString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
};

/**
 * Formats a phone number to a consistent format
 * Removes non-digit characters and formats to (XXX) XXX-XXXX
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number or original if invalid
 */
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  try {
    // Remove non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid US phone number (10 digits)
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // Return original if not valid format
    return phoneNumber;
  } catch (error) {
    console.error('Phone formatting error:', error);
    return phoneNumber;
  }
};

/**
 * Converts string representation of ObjectId to proper MongoDB ObjectId
 * @param {string} id - The ID to validate and convert
 * @returns {ObjectId|null} - Mongoose ObjectId or null if invalid
 */
const toObjectId = (id) => {
  const mongoose = require('mongoose');
  
  if (!id) return null;
  
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    return null;
  } catch (error) {
    console.error('ObjectId conversion error:', error);
    return null;
  }
};

/**
 * Clean and sanitize a string by trimming whitespace and removing HTML tags
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (str) => {
  if (!str) return '';
  
  try {
    // First trim the string
    let sanitized = str.trim();
    
    // Remove basic HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    
    return sanitized;
  } catch (error) {
    console.error('String sanitization error:', error);
    return str || '';
  }
};

/**
 * Formats a reservation object by transforming its properties
 * @param {Object} reservation - The reservation object to format
 * @returns {Object} - Formatted reservation object
 */
const formatReservation = (reservation) => {
  if (!reservation) return null;
  
  try {
    return {
      ...reservation,
      customerName: sanitizeString(reservation.customerName),
      customerPhone: formatPhoneNumber(reservation.customerPhone),
      reservationTime: formatDate(reservation.reservationTime),
      notes: sanitizeString(reservation.notes)
    };
  } catch (error) {
    console.error('Reservation formatting error:', error);
    return reservation;
  }
};

/**
 * Formats a table object by transforming its properties
 * @param {Object} table - The table object to format
 * @returns {Object} - Formatted table object
 */
const formatTable = (table) => {
  if (!table) return null;
  
  try {
    return {
      ...table,
      tableNumber: sanitizeString(table.tableNumber),
      location: sanitizeString(table.location)
    };
  } catch (error) {
    console.error('Table formatting error:', error);
    return table;
  }
};

/**
 * Formats a pagination object based on request query parameters
 * @param {Object} query - The request query object
 * @returns {Object} - Pagination object with page, limit, skip, and sort
 */
const getPaginationOptions = (query) => {
  try {
    // Default values
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Sort options (default to createdAt descending)
    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };
    
    return { page, limit, skip, sort };
  } catch (error) {
    console.error('Pagination options error:', error);
    return { page: 1, limit: 10, skip: 0, sort: { createdAt: -1 } };
  }
};

/**
 * Builds a dynamic query object for MongoDB based on filter parameters
 * @param {Object} filters - Object containing filter criteria
 * @returns {Object} - MongoDB query object
 */
const buildQueryFilters = (filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return {};
  }
  
  try {
    const query = {};
    
    // Process date range filters if present
    if (filters.startDate && filters.endDate) {
      query.reservationTime = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    } else if (filters.startDate) {
      query.reservationTime = { $gte: new Date(filters.startDate) };
    } else if (filters.endDate) {
      query.reservationTime = { $lte: new Date(filters.endDate) };
    }
    
    // Process status filter
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Process table availability filter
    if (filters.isAvailable !== undefined) {
      query.isAvailable = filters.isAvailable === 'true';
    }
    
    // Process capacity filter
    if (filters.minCapacity) {
      query.capacity = { $gte: parseInt(filters.minCapacity, 10) };
    }
    
    // Process search filter for names (partial matching)
    if (filters.search) {
      query.customerName = { $regex: filters.search, $options: 'i' };
    }
    
    return query;
  } catch (error) {
    console.error('Query building error:', error);
    return {};
  }
};

/**
 * Formats API response data uniformly
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {*} data - Response data
 * @param {Object} meta - Additional metadata (pagination, etc)
 * @returns {Object} - Formatted response object
 */
const formatResponse = (success, message, data = null, meta = null) => {
  const response = {
    success,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (meta !== null) {
    response.meta = meta;
  }
  
  return response;
};

module.exports = {
  formatDate,
  formatPhoneNumber,
  toObjectId,
  sanitizeString,
  formatReservation,
  formatTable,
  getPaginationOptions,
  buildQueryFilters,
  formatResponse
};