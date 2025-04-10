const request = require('supertest');
const app = require('../../server');

describe('Restaurant Info API', () => {
  it('should get restaurant information', async () => {
    const response = await request(app).get('/api/restaurant-info');
    expect(response.status).toBe(200);
  });
});
