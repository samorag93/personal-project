const router = require('express').Router();
router.use('/', require('./swagger'));
const passport = require('passport');


// router.get('/', (req, res) => {
//   //#swagger.tags=['API is working']
//   res.send('API is working');
// });

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));
router.use('/comments', require('./comments'));
router.use('/auth', require('./auth'));

router.get('/login', passport.authenticate('github', {
  scope: ['user:email'],
  prompt: 'login'  // fuerza la reautenticación
}));


router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // opcional, por seguridad
      res.redirect('/');
    });
  });
});

module.exports = router;
