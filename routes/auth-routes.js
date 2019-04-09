const router = require('express').Router();
const passport = require('passport');

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

//callback route google
router.get('/google/redirect', passport.authenticate('google'), function (req, res) {
  res.redirect('/profile/');
});

module.exports = router;
