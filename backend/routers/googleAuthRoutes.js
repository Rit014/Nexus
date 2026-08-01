const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { generateToken } = require('../utils/generateToken');

const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL || process.env.FRONTEND_URL;

// ── Initiate Google OAuth ──
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// ── Google OAuth Callback ──
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${OAUTH_REDIRECT_URL}/login?error=google_failed`, session: false }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
      };

      const redirectUrl = `${OAUTH_REDIRECT_URL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
      res.redirect(redirectUrl);
    } catch (err) {
      res.redirect(`${OAUTH_REDIRECT_URL}/login?error=google_failed`);
    }
  }
);

module.exports = router;