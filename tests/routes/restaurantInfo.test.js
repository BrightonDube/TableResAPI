const restaurantInfoController = require('../../controllers/restaurantInfoController'); // Adjust path
const RestaurantInfo = require('../../models/RestaurantInfo'); // Adjust path

jest.mock('../../models/RestaurantInfo'); // Mock the RestaurantInfo model

describe('restaurantInfoController', () => {
  describe('getRestaurantInfo', () => {
    it('should return status 200 on successful retrieval', async () => {
      const mockReq = {}; // Empty request object for GET - restaurant info likely doesn't need params
      const mockRes = {
        status: jest.fn().mockReturnThis(), // Mock res.status() - chainable
        json: jest.fn(),                   // Mock res.json() - if you use it to send data
        // send: jest.fn(),                // Mock res.send() - if you use it
      };
      const mockNext = jest.fn();

      // Mock successful database query - simulate finding restaurant info
      const mockRestaurantData = {
        name: 'Test Restaurant',
        address: '123 Main St',
        // ... other restaurant info properties
      };
      RestaurantInfo.findOne.mockResolvedValue(mockRestaurantData); // Mock findOne to resolve with data

      await restaurantInfoController.getRestaurantInfo(mockReq, mockRes, mockNext);

      expect(RestaurantInfo.findOne).toHaveBeenCalled(); // Verify findOne was called (optional, but good to check)
      expect(mockRes.status).toHaveBeenCalledWith(200);   // Assert status code 200
      // If you send JSON data in the response, you can also assert on res.json() here:
      // expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockRestaurantData });
      expect(mockNext).not.toHaveBeenCalled(); // Ensure next is not called for success
    });

    it('should handle errors and call next if retrieval fails (e.g., DB error)', async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        // send: jest.fn(),
      };
      const mockNext = jest.fn();

      const dbError = new Error('Database error fetching restaurant info');
      RestaurantInfo.findOne.mockRejectedValue(dbError); // Mock findOne to reject with an error

      await restaurantInfoController.getRestaurantInfo(mockReq, mockRes, mockNext);

      expect(RestaurantInfo.findOne).toHaveBeenCalled(); // Verify findOne was called
      expect(mockRes.status).not.toHaveBeenCalled();     // status should not be called directly in error case if using error handler
      expect(mockRes.json).not.toHaveBeenCalled();       // json should not be called directly in error case
      expect(mockNext).toHaveBeenCalledWith(dbError);    // Assert that next is called with the error
    });

    // You can add more test cases:
    // - What if no restaurant info is found? (Should it be 404 or 200 with empty data, depends on your API design)
    // - What if there are validation errors in the controller logic (though less likely for a GET restaurant info endpoint)
  });
});