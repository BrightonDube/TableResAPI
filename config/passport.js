const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, 
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our database based on Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });

          user = await newUser.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  console.log("serializeUser:", user.id || user._id);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  console.log("deserializeUser - ID:", id);
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("deserializeUser - User not found for ID:", id); 
      return done(null, false); 
    }
    console.log("deserializeUser - User found:", user); 
    done(null, user);
  } catch (error) {
    console.error("deserializeUser Error:", err);
    done(error);
  }
});

module.exports = passport;
