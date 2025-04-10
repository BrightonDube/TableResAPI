// tests/__setup__/jest.setup.js
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret-123';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
const mongoose = require('mongoose');
const User = require('../../models/User'); // Adjust path to your User model

module.exports = async () => { // Make it an async function
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Check if a test user already exists to avoid duplicate key errors
    let testUser = await User.findOne({ email: 'testuser@example.com' });
    if (!testUser) {
      testUser = new User({
        googleId: 'test-google-id-123',
        name: 'Test User',
        email: 'testuser@example.com',
      });
      await testUser.save();
    }
    global.__TEST_USER_ID__ = testUser._id.toString(); // Make user ID globally accessible

    console.log('Test database setup and test user created.'); // Optional confirmation
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
};