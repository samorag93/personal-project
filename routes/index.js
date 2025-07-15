const router = require('express').Router();

router.get('/', (req, res) => {res.send('Hello Word');});

module.exports = router