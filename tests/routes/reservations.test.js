const mongoose = require('mongoose'); 
const request = require('supertest');
const app = require('../../server');

describe('Reservations API - GET Endpoints Only (No Auth)', () => {
//   let server;

//   beforeAll((done) => {
//     server = app.listen(3008, done);
//   });

//   afterAll(async (done) => {
//     await server.close(done);
//     await mongoose.connection.close();
//   });

  it('should get all reservations', async () => {
    const response = await request(app).get('/api/reservations');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.statuses)).toBe(true);
  });

  it('should get a specific reservation by ID', async () => {
    const testReservationId = '65a9b2c3d4e5f6a7b8c9d0e3'; // Replace with a valid reservation ID

    const response = await request(app).get(
      `/api/reservations/${testReservationId}`
    );
    expect(response.status).toBe(200);
    expect(response.body.status).toBeDefined();
  });
});
