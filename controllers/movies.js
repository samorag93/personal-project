const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET all movies
const getAll = async (req, res) => {
  //#swagger.tags=['Movies']
  const result = await mongodb.getDatabase().db().collection('movies').find();
  result.toArray().then((movies) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(movies);
  });
};

// GET a single movie by ID
const getSingle = async (req, res) => {
  //#swagger.tags=['Movies']
  const movieId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('movies').find({ _id: movieId });
  result.toArray().then((movies) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(movies[0]);
  });
};

// CREATE a new movie
const createMovie = async (req, res) => {
  //#swagger.tags=['Movies']
  try {
    const { title, director, year, genre } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 1 || 
      !director || typeof director !== 'string' || director.trim().length < 1 ||
      !genre || typeof genre !== 'string' || genre.trim().length < 1 ||
      !year || typeof year !== 'number' || year < 1900 || year > new Date().getFullYear()
    ) {
      return res.status(400).send({ message: 'Invalid input: check title, director, genre, and year' });
    }

    const movie = { title: title.trim(), director: director.trim(), year, genre: genre.trim() };
    const response = await mongodb.getDatabase().db().collection('movies').insertOne(movie);

    if (response.acknowledged) {
      return res.status(201).json({ message: 'Movie created successfully' });
    } else {
      return res.status(500).send({ message: 'Error creating movie.' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

// UPDATE an existing movie
const updateMovie = async (req, res) => {
  //#swagger.tags=['Movies']
  try {
    const movieId = new ObjectId(req.params.id);
    const { title, director, year, genre } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 1 ||
      !director || typeof director !== 'string' || director.trim().length < 1 ||
      !genre || typeof genre !== 'string' || genre.trim().length < 1 ||
      !year || typeof year !== 'number' || year < 1900 || year > new Date().getFullYear()
    ) {
      return res.status(400).send({ message: 'All fields are required!' });
    }

    const movie = { title: title.trim(), director: director.trim(), year, genre: genre.trim() };
    const response = await mongodb.getDatabase().db().collection('movies').replaceOne({ _id: movieId }, movie);

    if (response.modifiedCount > 0) {
      return res.status(204).send();
    } else {
      return res.status(500).send({ message: 'Error updating movie.' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

// DELETE a movie
const deleteMovie = async (req, res) => {
  //#swagger.tags=['Movies']
  try {
    const movieId = new ObjectId(req.params.id);

    if (!movieId) {
      return res.status(400).send({ message: 'Invalid movie ID supplied' });
    }

    const response = await mongodb.getDatabase().db().collection('movies').deleteOne({ _id: movieId });

    if (response.deletedCount > 0) {
      return res.status(204).send();
    } else {
      return res.status(404).send({ message: 'Movie not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createMovie,
  updateMovie,
  deleteMovie
};
