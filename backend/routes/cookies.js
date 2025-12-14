const express = require('express');
const router = express.Router();

/* ===============================
   CHECK COOKIE CONSENT
   GET /api/cookies/consent
================================ */
router.get('/consent', (req, res) => {
  const consent = req.cookies.cookieConsent === 'true';
  res.json({ consent });
});

/* ===============================
   SET COOKIE CONSENT
   POST /api/cookies/consent
================================ */
router.post('/consent', (req, res) => {
  res.cookie('cookieConsent', 'true', {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.json({ success: true });
});

module.exports = router;
