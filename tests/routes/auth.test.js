const request = require('supertest');
const app = require('../../server'); // Directly import your server.js
const passport = require('passport');

jest.mock('passport', () => ({
  initialize: jest.fn(() => (req, res, next) => next()),
  session: jest.fn(() => (req, res, next) => next()),
  authenticate: jest.fn(),
}));
describe('Authentication Routes', () => {
  beforeEach(() => {
    // Reset mocks before each test
    passport.authenticate.mockReset();
  });

  describe('GET /auth/google', () => {
    it('redirects to Google OAuth', async () => {
      passport.authenticate.mockImplementation(() => (req, res) => {
        res.redirect('https://accounts.google.com');
      });

      await request(app)
        .get('/auth/google')
        .expect(302)
        .expect('Location', 'https://accounts.google.com');
    });
  });

  describe('GET /auth/google/callback', () => {
    it('handles successful auth', async () => {
      passport.authenticate.mockImplementation((_, callback) => {
        callback(null, { id: '123', email: 'test@example.com' });
        return (req, res) => res.redirect('/dashboard');
      });

      await request(app)
        .get('/auth/google/callback')
        .expect(302)
        .expect('Location', '/dashboard');
    });

    it('handles auth failure', async () => {
      passport.authenticate.mockImplementation((_, callback) => {
        callback(new Error('Auth failed'), null);
        return (req, res) => res.sendStatus(500);
      });

      await request(app).get('/auth/google/callback').expect(500);
    });
  });

  describe('GET /auth/logout', () => {
    it('clears session and redirects home', async () => {
      await request(app)
        .get('/auth/logout')
        .expect(302)
        .expect('Location', '/');
    });
  });
});
