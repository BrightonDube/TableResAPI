const reservationStatusController = require('../../controllers/reservationStatusController');
const ReservationStatus = require('../../models/ReservationStatus');

jest.mock('../../models/ReservationStatus');

describe('reservationStatusController', () => {
  // Mock response object
  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  // Mock next function
  const mockNext = jest.fn();

  describe('getAllReservationStatuses', () => {
    it('should return all statuses sorted by name', async () => {
      const req = {};
      const res = mockResponse();
      const mockStatuses = [
        { _id: '1', name: 'Confirmed' },
        { _id: '2', name: 'Pending' }
      ];

      // Mock the chainable Mongoose methods
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockStatuses),
      };
      ReservationStatus.find.mockReturnValue(mockQuery);

      await reservationStatusController.getAllReservationStatuses(req, res, mockNext);

      expect(ReservationStatus.find).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ name: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        statuses: mockStatuses
      });
    });
  });

  describe('getReservationStatusById', () => {
    it('should return a status when found', async () => {
      const req = {
        params: { statusId: '507f1f77bcf86cd799439011' } // Valid ObjectId
      };
      const res = mockResponse();
      const mockStatus = { 
        _id: '507f1f77bcf86cd799439011', 
        name: 'Confirmed' 
      };

      ReservationStatus.findById.mockResolvedValue(mockStatus);

      await reservationStatusController.getReservationStatusById(req, res, mockNext);

      expect(ReservationStatus.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });
  });
});