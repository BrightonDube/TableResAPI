const request = require('supertest');
const app = require('../../server');

describe('Users API - GET Endpoints Only (No Auth)', () => {
//   let server;

//   beforeAll((done) => {
//     server = app.listen(3003, done);
//   });

//   afterAll(async (done) => {
//     await server.close(done);
//     await mongoose.connection.close();
//   });

  it('GET /api/users - should respond with 401 Unauthorized (or similar) as it likely requires authentication', async () => {
    const response = await request(app).get('/api/users');

    expect([401, 302]).toContain(response.status);
  });

  it('GET /api/users/:userId - should respond with 401 Unauthorized (or similar) as it likely requires authentication', async () => {
    const testUserId = '65a9b2c3d4e5f6a7b8c9d0e9'; // Replace with a user ID if you want to test with a specific ID
    const response = await request(app).get(`/api/users/${testUserId}`);

    expect([401, 302]).toContain(response.status);
  });
});
