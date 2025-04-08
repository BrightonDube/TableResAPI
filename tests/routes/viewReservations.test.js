// tests/routes/viewReservations.test.js
const request = require('supertest');
const app = require('../../server');
const { verifyToken } = require('../../middleware/authMiddleware');

jest.mock('../../middleware/authMiddleware');

describe('GET /reservations/create', () => {
  test('should redirect unauthenticated users', async () => {
    verifyToken.mockImplementation((req, res, next) => {
      res.redirect('/login');
    });

    const response = await request(app)
      .get('/reservations/create')
      .expect(302);

    expect(response.header.location).toBe('/login');
  });

  test('should render create form for authenticated users', async () => {
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: '123' };
      next();
    });

    const response = await request(app)
      .get('/reservations/create')
      .expect(200);

    expect(response.text).toContain('Create Reservation');
  });

  test('should handle rendering errors', async () => {
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: '123' };
      next();
    });

    jest.spyOn(res, 'render').mockImplementationOnce(() => {
      throw new Error('Render failed');
    });

    await request(app)
      .get('/reservations/create')
      .expect(500);
  });
});