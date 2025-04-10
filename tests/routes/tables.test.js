const tableController = require('../../controllers/tableController'); // Adjust path
const Table = require('../../models/Table'); // Adjust path
const mongoose = require('mongoose'); // You might need mongoose for ObjectId validation or mocking

jest.mock('../../models/Table'); // Mock the Table model

describe('tableController', () => {
  describe('getTables', () => {
    it('should return status 200 on successful retrieval of all tables', async () => {
      const mockReq = {}; // Empty request object for GET all tables
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // If you send JSON data
      };
      const mockNext = jest.fn();

      // Mock successful Table.find() - simulate getting tables array
      const mockTables = [
        { _id: 'table1', tableNumber: 1, capacity: 4 },
        { _id: 'table2', tableNumber: 2, capacity: 2 },
      ];
      Table.find.mockResolvedValue(mockTables); // Mock find to resolve with tables

      await tableController.getTables(mockReq, mockRes, mockNext);

      expect(Table.find).toHaveBeenCalled(); // Verify Table.find() was called
      expect(mockRes.status).toHaveBeenCalledWith(200); // Assert status 200
      // If you send JSON response, you can assert on it:
      // expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockTables });
      expect(mockNext).not.toHaveBeenCalled(); // Ensure next is not called for success
    });

    it('should handle errors and call next if getTables fails (e.g., DB error)', async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const dbError = new Error('Database error fetching tables');
      Table.find.mockRejectedValue(dbError); // Mock find to reject with error

      await tableController.getTables(mockReq, mockRes, mockNext);

      expect(Table.find).toHaveBeenCalled(); // Verify Table.find() was called
      expect(mockRes.status).not.toHaveBeenCalled(); // Status not directly set in error case
      expect(mockRes.json).not.toHaveBeenCalled();   // JSON not directly sent in error case
      expect(mockNext).toHaveBeenCalledWith(dbError); // Assert next is called with error
    });
  });

  describe('getTableById', () => {
    it('should return status 200 and table on successful retrieval by ID', async () => {
      const mockReq = { params: { id: 'testTableId' } }; // Mock request with table ID param
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const mockTable = { _id: 'testTableId', tableNumber: 3, capacity: 6 };
      Table.findById.mockResolvedValue(mockTable); // Mock findById to resolve with table

      await tableController.getTableById(mockReq, mockRes, mockNext);

      expect(Table.findById).toHaveBeenCalledWith('testTableId'); // Verify findById called with ID
      expect(mockRes.status).toHaveBeenCalledWith(200); // Assert status 200
      // If you send JSON response, assert on it:
      // expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockTable });
      expect(mockNext).not.toHaveBeenCalled(); // Next not called on success
    });

    it('should return status 404 if table is not found by ID', async () => {
      const mockReq = { params: { id: 'nonExistentTableId' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      Table.findById.mockResolvedValue(null); // Mock findById to resolve with null (not found)

      await tableController.getTableById(mockReq, mockRes, mockNext);

      expect(Table.findById).toHaveBeenCalledWith('nonExistentTableId'); // Verify findById called
      expect(mockRes.status).toHaveBeenCalledWith(404); // Assert status 404 (or your "not found" status)
      expect(mockNext).not.toHaveBeenCalled(); // Next not called if 404 is directly handled in controller. If error handler is used, next might be called. Adjust accordingly.
    });

    it('should handle errors and call next if getTableById fails (e.g., DB error)', async () => {
      const mockReq = { params: { id: 'testTableId' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const dbError = new Error('Database error fetching table by ID');
      Table.findById.mockRejectedValue(dbError); // Mock findById to reject with error

      await tableController.getTableById(mockReq, mockRes, mockNext);

      expect(Table.findById).toHaveBeenCalledWith('testTableId'); // Verify findById called
      expect(mockRes.status).not.toHaveBeenCalled(); // Status not directly set in error case
      expect(mockRes.json).not.toHaveBeenCalled();   // JSON not directly sent in error case
      expect(mockNext).toHaveBeenCalledWith(dbError); // Assert next is called with error
    });

     it('should return status 400 if table ID is invalid (optional, if you validate ID format)', async () => {
      const mockReq = { params: { id: 'invalid-table-id' } }; // Invalid ID format
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      // If your controller checks for ObjectId validity, mock that behavior or adjust assertions.
      // For simplicity, if no explicit validation, findById might just return null or error for invalid ID.
      // If you explicitly handle invalid IDs and return 400, then expect 400 here.
      // If you treat invalid IDs as "not found" and return 404, expect 404 here.
      Table.findById.mockResolvedValue(null); // Mock as not found for simplicity

      await tableController.getTableById(mockReq, mockRes, mockNext);

      expect(Table.findById).toHaveBeenCalledWith('invalid-table-id'); // Verify findById called (or not called if you validate before DB query)
      expect(mockRes.status).toHaveBeenCalledWith(404); // or 400 depending on your logic for invalid IDs
      // expect(mockNext).toHaveBeenCalled(); // If you use next for invalid ID errors
    });
  });
});