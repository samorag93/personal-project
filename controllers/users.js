const mongodb = require('../data/database');
const passwordUtil = require('../util/passwordComplexityCheck');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    const result = await mongodb.getDatabase().db().collection('users').find();
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    });
}

const getSingle = async (req, res) => {
    //#swagger.tags=['Users']
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('users').find({ _id: userId });
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0]);
    });
}
// OLD CREATUSER METHOD 
// const createUser = async (req, res) => {
//     //#swagger.tags=['Users']
//     const user = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         password: req.body.password
//     };
//     const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
//     if (response.acknowledged) {
//         res.status(204).send();
//     } else {
//         res.status(500).json(responde.error || 'some error ocurred while updating the user.');
//     }
// };

const createUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validar campos obligatorios
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send({ message: 'All fields are required!' });
    }

    // Validar complejidad de contraseña
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      return res.status(400).send({ message: passwordCheck.error });
    }

    const user = { firstName, lastName, email, password };
    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);

    if (response.acknowledged) {
      return res.status(201).json({ message: 'User created successfully' });
    } else {
      return res.status(500).send({ message: 'Error creating user.' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

// const updateUser = async (req, res) => {
//     //#swagger.tags=['Users']
//     const userId = new ObjectId(req.params.id);
//     const user = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         password: req.body.password
//     };
//     const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId}, user);
//     if (response.modifiedCount > 0) {
//         res.status(204).send();
//     } else {
//         res.status(500).json(responde.error || 'some error ocurred while updating the user.');
//     }
// };

const updateUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const { firstName, lastName, email, password } = req.body;

    // Validar campos obligatorios
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send({ message: 'All fields are required!' });
    }

    // Validar complejidad de contraseña
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      return res.status(400).send({ message: passwordCheck.error });
    }

    const user = { firstName, lastName, email, password };
    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);

    if (response.modifiedCount > 0) {
      return res.status(204).send();
    } else {
      return res.status(500).send({ message: 'Error updating user.' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

// const deleteUser = async (req, res) => {
//     //#swagger.tags=['Users']
//     const userId = new ObjectId(req.params.id);
//     const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId});
//     if (response.deletedCount > 0) {
//         res.status(204).send();
//     } else {
//         res.status(500).json(responde.error || 'some error ocurred while updating the user.');
//     }
// };

const deleteUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);

    if (!userId) {
      return res.status(400).send({ message: 'Invalid user ID supplied' });
    }

    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      return res.status(204).send(); // No content
    } else {
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};


module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};