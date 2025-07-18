// const { ObjectId } = require('mongodb');
// const mongodb = require('../data/database');

// const createComment = async (req, res) => {
//   try {
//     const { movieId, comment } = req.body;
//     const userId = req.user && req.user.userId;

//     if (!movieId || !comment) {
//       return res.status(400).send({ message: 'Movie ID and comment are required' });
//     }
//     if (!userId) {
//       return res.status(401).send({ message: 'Unauthorized: User not authenticated' });
//     }

//     const newComment = {
//       movieId: new ObjectId(movieId),
//       userId: new ObjectId(userId),
//       comment,
//       createdAt: new Date()
//     };

//     const response = await mongodb.getDatabase().db().collection('comments').insertOne(newComment);

//     if (response.acknowledged) {
//       res.status(201).json({ message: 'Comment added' });
//     } else {
//       res.status(500).json({ message: 'Failed to add comment' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message || 'Internal server error' });
//   }
// };

// const getCommentsByMovie = async (req, res) => {
//   try {
//     const movieId = req.params.movieId;

//     if (!movieId) {
//       return res.status(400).send({ message: 'Movie ID is required' });
//     }

//     const comments = await mongodb.getDatabase().db()
//       .collection('comments')
//       .find({ movieId: new ObjectId(movieId) })
//       .toArray();

//     res.status(200).json(comments);
//   } catch (err) {
//     res.status(500).json({ message: err.message || 'Internal server error' });
//   }
// };

// module.exports = {
//   createComment,
//   getCommentsByMovie
// };


// #swagger.description = 'Create a new comment for a movie'
// #swagger.security = [{ bearerAuth: [] }]

const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

// Create a comment
const createComment = async (req, res) => {
  //#swagger.tags=['Comments']
  try {
    const { movieId, comment } = req.body;
    const userId = req.user?.userId;

    // Validaciones completas
    if (!movieId || !ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Valid movie ID is required' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      return res.status(400).json({ message: 'Comment must be at least 25 characters long' });
    }

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user ID' });
    }

    const newComment = {
      movieId: new ObjectId(movieId),
      userId: new ObjectId(userId),
      comment: comment.trim(),
      createdAt: new Date()
    };

    const response = await mongodb.getDatabase().db().collection('comments').insertOne(newComment);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Comment added' });
    } else {
      res.status(500).json({ message: 'Failed to add comment' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};


// Get comments for a movie (with full name, title, and formatted date)
const getCommentsByMovie = async (req, res) => {
  //#swagger.tags=['Comments']
  try {
    const movieId = req.params.movieId;

    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const rawComments = await mongodb.getDatabase().db().collection('comments').aggregate([
      { $match: { movieId: new ObjectId(movieId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      {
        $project: {
          _id: 1,
          user: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          title: '$movie.title',
          comment: 1,
          createdAt: 1
        }
      }
    ]).toArray();

    // Format date and time in readable form
    const formattedComments = rawComments.map(comment => {
      const date = new Date(comment.createdAt);
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      return {
        _id: comment._id,
        user: comment.user,
        title: comment.title,
        comment: comment.comment,
        date: date.toLocaleString('en-US', options)
      };
    });

    res.status(200).json(formattedComments);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch comments' });
  }
};

const updateComment = async (req, res) => {
  //#swagger.tags=['Comments']
  try {
    const commentId = req.params.id;
    const { comment } = req.body;
    const userId = req.user?.userId;

    // Validaciones básicas
    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      return res.status(400).json({ message: 'Comment must be at least 5 characters long' });
    }

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user ID' });
    }

    // Verificamos que el comentario exista y sea del usuario autenticado
    const existingComment = await mongodb.getDatabase().db().collection('comments').findOne({
      _id: new ObjectId(commentId),
      userId: new ObjectId(userId)
    });

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found or access denied' });
    }

    // Actualización
    const result = await mongodb.getDatabase().db().collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { comment: comment.trim(), updatedAt: new Date() } }
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: 'Comment updated successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to update comment' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};


module.exports = { createComment, getCommentsByMovie, updateComment };
