const reservationController = require('../../controllers/reservationController'); // Adjust path
const Reservation = require('../../models/Reservation'); // Adjust path
const mongoose = require('mongoose'); // You might need mongoose for ObjectId validation or mocking

jest.mock('../../models/Reservation'); // Mock the Reservation model

describe('reservationController', () => {
  describe('getReservations', () => {
    it('should return status 200 on successful retrieval of all reservations', async () => {
      const mockReq = {}; // Empty request object for GET all reservations
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // If you send JSON data
      };
      const mockNext = jest.fn();

      // Mock successful Reservation.find() - simulate getting reservations array
      const mockReservations = [
        { _id: 'res1', tableId: 'table1', date: '2024-07-20', time: '19:00' },
        { _id: 'res2', tableId: 'table2', date: '2024-07-21', time: '20:00' },
      ];
      Reservation.find.mockResolvedValue(mockReservations); // Mock find to resolve with reservations

      await reservationController.getReservations(mockReq, mockRes, mockNext);

      expect(Reservation.find).toHaveBeenCalled(); // Verify Reservation.find() was called
      expect(mockRes.status).toHaveBeenCalledWith(200); // Assert status 200
      // If you send JSON response, you can assert on it:
      // expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockReservations });
      expect(mockNext).not.toHaveBeenCalled(); // Ensure next is not called for success
    });

    it('should handle errors and call next if getReservations fails (e.g., DB error)', async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const dbError = new Error('Database error fetching reservations');
      Reservation.find.mockRejectedValue(dbError); // Mock find to reject with error

      await reservationController.getReservations(mockReq, mockRes, mockNext);

      expect(Reservation.find).toHaveBeenCalled(); // Verify Reservation.find() was called
      expect(mockRes.status).not.toHaveBeenCalled(); // Status not directly set in error case
      expect(mockRes.json).not.toHaveBeenCalled();   // JSON not directly sent in error case
      expect(mockNext).toHaveBeenCalledWith(dbError); // Assert next is called with error
    });
  });

  describe('getReservationById', () => {
    it('should return status 200 and reservation on successful retrieval by ID', async () => {
      const mockReq = { params: { id: 'testReservationId' } }; // Mock request with reservation ID param
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const mockReservation = { _id: 'testReservationId', tableId: 'table1', date: '2024-07-22', time: '18:30' };
      Reservation.findById.mockResolvedValue(mockReservation); // Mock findById to resolve with reservation

      await reservationController.getReservationById(mockReq, mockRes, mockNext);

      expect(Reservation.findById).toHaveBeenCalledWith('testReservationId'); // Verify findById called with ID
      expect(mockRes.status).toHaveBeenCalledWith(200); // Assert status 200
      // If you send JSON response, assert on it:
      // expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockReservation });
      expect(mockNext).not.toHaveBeenCalled(); // Next not called on success
    });

    it('should return status 404 if reservation is not found by ID', async () => {
      const mockReq = { params: { id: 'nonExistentReservationId' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      Reservation.findById.mockResolvedValue(null); // Mock findById to resolve with null (not found)

      await reservationController.getReservationById(mockReq, mockRes, mockNext);

      expect(Reservation.findById).toHaveBeenCalledWith('nonExistentReservationId'); // Verify findById called
      expect(mockRes.status).toHaveBeenCalledWith(404); // Assert status 404 (or your "not found" status)
      expect(mockNext).not.toHaveBeenCalled(); // Next not called if 404 is directly handled in controller. If error handler is used, next might be called. Adjust accordingly.
    });

    it('should handle errors and call next if getReservationById fails (e.g., DB error)', async () => {
      const mockReq = { params: { id: 'testReservationId' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const dbError = new Error('Database error fetching reservation by ID');
      Reservation.findById.mockRejectedValue(dbError); // Mock findById to reject with error

      await reservationController.getReservationById(mockReq, mockRes, mockNext);

      expect(Reservation.findById).toHaveBeenCalledWith('testReservationId'); // Verify findById called
      expect(mockRes.status).not.toHaveBeenCalled(); // Status not directly set in error case
      expect(mockRes.json).not.toHaveBeenCalled();   // JSON not directly sent in error case
      expect(mockNext).toHaveBeenCalledWith(dbError); // Assert next is called with error
    });

     it('should return status 400 if reservation ID is invalid (optional, if you validate ID format)', async () => {
      const mockReq = { params: { id: 'invalid-reservation-id' } }; // Invalid ID format
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      // If your controller checks for ObjectId validity, mock that behavior or adjust assertions.
      // For simplicity, if no explicit validation, findById might just return null or error for invalid ID.
      // If you explicitly handle invalid IDs and return 400, then expect 400 here.
      // If you treat invalid IDs as "not found" and return 404, expect 404 here.
      Reservation.findById.mockResolvedValue(null); // Mock as not found for simplicity

      await reservationController.getReservationById(mockReq, mockRes, mockNext);

      expect(Reservation.findById).toHaveBeenCalledWith('invalid-reservation-id'); // Verify findById called (or not called if you validate before DB query)
      expect(mockRes.status).toHaveBeenCalledWith(404); // or 400 depending on your logic for invalid IDs
      // expect(mockNext).toHaveBeenCalled(); // If you use next for invalid ID errors
    });
  });
});