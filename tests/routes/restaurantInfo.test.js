const reservationController = require('../../controllers/reservationController');
const Reservation = require('../../models/Reservation');
const Table = require('../../models/Table');

jest.mock('../../models/Reservation');
jest.mock('../../models/Table');

describe('reservationController', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('getAllReservations', () => {
    it('should return paginated reservations with metadata', async () => {
      const req = {
        query: {
          page: '1',
          limit: '10',
        },
      };
      const res = mockResponse();

      const mockReservations = [
        { _id: '1', name: 'Reservation 1' },
        { _id: '2', name: 'Reservation 2' }
      ];
      
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockReservations),
      };
      
      Reservation.find.mockReturnValue(mockQuery);
      Reservation.countDocuments.mockResolvedValue(15);

      await reservationController.getAllReservations(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Reservations retrieved successfully',
          data: mockReservations,
        })
      );
    });

    it('should return 500 error when database fails', async () => {
      const req = {
        query: {
          page: '1',
          limit: '10',
        },
      };
      const res = mockResponse();

      Reservation.find.mockImplementation(() => {
        throw new Error('Database error');
      });

      await reservationController.getAllReservations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Database error'
        })
      );
    });
  });

  describe('getReservationById', () => {
    it('should return 400 for invalid ID format', async () => {
      const req = {
        params: { reservationId: 'invalid-id' }
      };
      const res = mockResponse();

      await reservationController.getReservationById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid reservation ID format'
        })
      );
    });

    it('should return 404 when reservation not found', async () => {
      const req = {
        params: { reservationId: '507f1f77bcf86cd799439011' }
      };
      const res = mockResponse();

      Reservation.findById.mockResolvedValue(null);

      await reservationController.getReservationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Reservation not found'
        })
      );
    });

    it('should return 500 when database fails', async () => {
      const req = {
        params: { reservationId: '507f1f77bcf86cd799439011' }
      };
      const res = mockResponse();

      Reservation.findById.mockRejectedValue(new Error('Database error'));

      await reservationController.getReservationById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Database error'
        })
      );
    });
  });
});