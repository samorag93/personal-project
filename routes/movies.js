// const express = require('express');
// const router = express.Router();

// const moviesController = require('../controllers/movies');

// router.get('/', moviesController.getAll);
// router.get('/:id', moviesController.getSingle);
// router.post('/', moviesController.createMovie);
// router.put('/:id', moviesController.updateMovie);
// router.delete('/:id', moviesController.deleteMovie);

// module.exports = router;


const express = require('express');
const router = express.Router();

const moviesController = require('../controllers/movies');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { isAdmin } = require('../middleware/isAdmin');

// Rutas públicas
router.get('/', moviesController.getAll);
router.get('/:id', moviesController.getSingle);

// Rutas protegidas solo para admins
router.post('/', isAuthenticated, isAdmin, moviesController.createMovie);
router.put('/:id', isAuthenticated, isAdmin, moviesController.updateMovie);
router.delete('/:id', isAuthenticated, isAdmin, moviesController.deleteMovie);

module.exports = router;
