// const router = require('express').Router();

// router.get('/', (req, res) => {res.send('Hello Word');});

// module.exports = router

const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //#swagger.tags=['API is working']
  res.send('API is working');
});

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));
router.use('/comments', require('./comments'));
router.use('/auth', require('./auth'));

module.exports = router;
