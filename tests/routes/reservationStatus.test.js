const reservationStatusController = require('../../controllers/reservationStatusController');
const ReservationStatus = require('../../models/ReservationStatus');

jest.mock('../../models/ReservationStatus');

describe('reservationStatusController', () => {
  // Mock response and next
  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });
  const mockNext = jest.fn();

  describe('getAllReservationStatuses', () => {
    it('should return all statuses sorted by name', async () => {
      const req = {};
      const res = mockResponse();
      const mockStatuses = [
        { _id: '1', name: 'Confirmed' },
        { _id: '2', name: 'Pending' }
      ];

      // Mock chainable query
      ReservationStatus.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockStatuses)
      });

      await reservationStatusController.getAllReservationStatuses(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        statuses: mockStatuses
      });
    });

    it('should return empty array when no statuses exist', async () => {
      const req = {};
      const res = mockResponse();

      ReservationStatus.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      await reservationStatusController.getAllReservationStatuses(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 0,
        statuses: []
      });
    });

    it('should handle database errors', async () => {
      const req = {};
      const res = mockResponse();
      const dbError = new Error('Database error');

      ReservationStatus.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(dbError)
      });

      await reservationStatusController.getAllReservationStatuses(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });

  describe('getReservationStatusById', () => {
    it('should return status when found', async () => {
      const req = { params: { statusId: '507f1f77bcf86cd799439011' } };
      const res = mockResponse();
      const mockStatus = { _id: '507f1f77bcf86cd799439011', name: 'Confirmed' };

      ReservationStatus.findById.mockResolvedValue(mockStatus);

      await reservationStatusController.getReservationStatusById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });
  });
});