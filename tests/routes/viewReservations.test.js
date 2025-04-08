const request = require('supertest');
const app = require('../../server');
const { verifyToken } = require('../../middleware/authMiddleware');

jest.mock('../../middleware/authMiddleware', () => ({
  verifyToken: jest.fn((req, res, next) => next())
}));

describe('GET /reservations/create', () => {
  it('renders create form for authenticated users', async () => {
    await request(app)
      .get('/reservations/create')
      .expect(200);
  });

  it('handles rendering errors', async () => {
    // Mock the render function to throw an error
    const originalRender = app.response.render;
    app.response.render = jest.fn(() => {
      throw new Error('Render failed');
    });

    await request(app)
      .get('/reservations/create')
      .expect(500);

    // Restore original render function
    app.response.render = originalRender;
  });
});