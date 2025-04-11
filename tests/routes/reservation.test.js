// reservation.test.js
const reservationController = require('../../controllers/reservationController');
const Reservation = require('../../models/Reservation');

jest.mock('../../models/Reservation');

describe('Reservation Controller', () => {
  describe('getAllReservations', () => {
    it('should return reservations with pagination data when successful', async () => {
      const req = {
        query: {
          page: '1',
          limit: '10',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockReservations = [{ _id: '1', name: 'Reservation 1' }];
      
      // Create a mock query object with chainable methods
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockReservations),
      };
      
      Reservation.find.mockReturnValue(mockQuery);
      Reservation.countDocuments.mockResolvedValue(1);

      await reservationController.getAllReservations(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Reservations retrieved successfully',
          data: mockReservations,
          meta: expect.objectContaining({
            page: 1,
            limit: 10,
            total: 1,
            pages: 1,
          }),
        })
      );
    });
  });

  describe('getReservationById', () => {
    it('should return a reservation when found', async () => {
      const req = {
        params: {
          reservationId: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId format
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockReservation = { 
        _id: '507f1f77bcf86cd799439011', 
        name: 'Reservation 1' 
      };
      
      Reservation.findById.mockResolvedValue(mockReservation);

      await reservationController.getReservationById(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Reservation retrieved successfully',
          data: mockReservation,
        })
      );
    });
  });
});