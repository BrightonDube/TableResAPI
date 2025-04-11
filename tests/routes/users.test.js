const userController = require('../../controllers/userController');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('userController', () => {
  // Mock response object
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  // Mock next function
  const mockNext = jest.fn();

  describe('getAllUsers', () => {
    it('should return all users with success response', async () => {
      const req = {};
      const res = mockResponse();
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@test.com' },
        { _id: '2', name: 'User 2', email: 'user2@test.com' }
      ];

      User.find.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res, mockNext);

      expect(User.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Users fetched successfully',
          data: mockUsers
        })
      );
    });

    it('should call next with error when database fails', async () => {
      const req = {};
      const res = mockResponse();
      const mockError = new Error('Database error');

      User.find.mockRejectedValue(mockError);

      await userController.getAllUsers(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const req = {
        params: { id: '507f1f77bcf86cd799439011' } // Valid ObjectId
      };
      const res = mockResponse();
      const mockUser = { 
        _id: '507f1f77bcf86cd799439011', 
        name: 'Test User', 
        email: 'test@user.com' 
      };

      User.findById.mockResolvedValue(mockUser);

      await userController.getUserById(req, res, mockNext);

      expect(User.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User fetched successfully',
          data: mockUser
        })
      );
    });

    it('should call next with other errors', async () => {
      const req = {
        params: { id: '507f1f77bcf86cd799439011' }
      };
      const res = mockResponse();
      const mockError = new Error('Some other error');

      User.findById.mockRejectedValue(mockError);

      await userController.getUserById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});