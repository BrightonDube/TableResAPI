const reservationStatusController = require('../../controllers/reservationStatusController');
const ReservationStatus = require('../../models/ReservationStatus');

jest.mock('../../models/ReservationStatus');

describe('reservationStatusController', () => {
  describe('getAllReservationStatuses', () => {
    it('should return status 200 and reservation statuses on successful retrieval', async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const mockStatuses = [
        { _id: 'status1', name: 'Pending' },
        { _id: 'status2', name: 'Confirmed' },
      ];
      ReservationStatus.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockStatuses),
      });
      

      await reservationStatusController.getAllReservationStatuses(
        mockReq,
        mockRes,
        mockNext
      );

      expect(ReservationStatus.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: mockStatuses.length,
        statuses: mockStatuses,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors and call next if getAllReservationStatuses fails', async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const dbError = new Error('Database error fetching reservation statuses');
      ReservationStatus.find.mockRejectedValue(dbError);

      await reservationStatusController.getAllReservationStatuses(
        mockReq,
        mockRes,
        mockNext
      );

      expect(ReservationStatus.find).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });

  describe('getReservationStatusById', () => {
    it('should return status 200 and reservation status on successful retrieval by ID', async () => {
      const mockReq = { params: { statusId: 'testStatusId' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const mockStatus = { _id: 'testStatusId', name: 'Pending' };
      ReservationStatus.findById.mockResolvedValue(mockStatus);

      await reservationStatusController.getReservationStatusById(
        mockReq,
        mockRes,
        mockNext
      );

      expect(ReservationStatus.findById).toHaveBeenCalledWith('testStatusId');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return status 404 if reservation status is not found by ID', async () => {
      const mockReq = { params: { statusId: 'nonExistentStatusId' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      ReservationStatus.findById.mockResolvedValue(null);

      await reservationStatusController.getReservationStatusById(
        mockReq,
        mockRes,
        mockNext
      );

      expect(ReservationStatus.findById).toHaveBeenCalledWith(
        'nonExistentStatusId'
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Reservation status not found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle DB errors and call next if getReservationStatusById fails', async () => {
      const mockReq = { params: { statusId: 'testStatusId' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const dbError = new Error(
        'Database error fetching reservation status by ID'
      );
      ReservationStatus.findById.mockRejectedValue(dbError);

      await reservationStatusController.getReservationStatusById(
        mockReq,
        mockRes,
        mockNext
      );

      expect(ReservationStatus.findById).toHaveBeenCalledWith('testStatusId');
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(dbError);
    });

    it('should return status 400 if reservation status ID is invalid (CastError)', async () => {
      const mockReq = { params: { statusId: 'invalid-status-id' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const castError = new Error('CastError');
      castError.name = 'CastError';
      castError.kind = 'ObjectId';
      ReservationStatus.findById.mockRejectedValue(castError);

      await reservationStatusController.getReservationStatusById(
        mockReq,
        mockRes,
        mockNext
      );

      expect(ReservationStatus.findById).toHaveBeenCalledWith(
        'invalid-status-id'
      );
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();

      const errorArg = mockNext.mock.calls[0][0];
      expect(errorArg.statusCode).toBe(400);
      expect(errorArg.message).toBe('Invalid reservation status ID format.');
    });
  });
});
