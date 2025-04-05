const { Router } = require('express');
const { getAllUsers, getUserById, deleteUserById, updateUserById, createUser } = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.post('/', createUser);

usersRouter.get('/:id', getUserById);

usersRouter.patch('/:id', updateUserById);

usersRouter.delete('/:id', deleteUserById);

usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
