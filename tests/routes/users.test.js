const userController = require('../../controllers/userController');
const User = require('../../models/User'); // Adjust path
const ErrorResponse = require('../../utils/errorResponse'); // Adjust path if you have it

jest.mock('../../models/User'); // Mock the User model

describe('userController', () => {
  describe('getUserById', () => {
    it('should return status 200 if user is found', async () => {
      const mockReq = { params: { userId: 'someUserId' } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Keep json for now if you use it
      const mockNext = jest.fn();
      const testUser = { _id: 'someUserId', name: 'Test User' };

      User.findById.mockResolvedValue(testUser); // Mock successful findById

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return status 404 if user is not found', async () => {
      const mockReq = { params: { userId: 'someUserId' } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      User.findById.mockResolvedValue(null); // Mock user not found

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404); // Or whatever status you return for not found
    });

     it('should return status 400 if userId is invalid (optional, if you handle invalid IDs)', async () => {
      const mockReq = { params: { userId: 'invalid-id' } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      // If your controller checks for invalid ObjectIds and throws an error or calls next with an error, mock that behavior
      // For this simple status test, we can just assume findById would return null or error for an invalid ID if no explicit check
      User.findById.mockResolvedValue(null); // Mock as not found for simplicity in this example

      await userController.getUserById(mockReq, mockRes, mockNext);

      // If you explicitly handle invalid IDs and return 400, then expect 400 here
      // If you treat invalid IDs as "not found" and return 404, expect 404 here
      expect(mockRes.status).toHaveBeenCalledWith(404); // or 400 depending on your logic
    });
  });
});