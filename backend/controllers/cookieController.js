// controllers/cookieController.js

function acceptCookies(req, res) {
  res.cookie('cookieConsent', 'true', {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,   // backend-managed
    sameSite: 'lax'
  });

  res.json({ message: 'Cookie consent saved' });
}

function checkCookies(req, res) {
  const consent = req.cookies.cookieConsent === 'true';
  res.json({ consent });
}

module.exports = {
  acceptCookies,
  checkCookies
};
