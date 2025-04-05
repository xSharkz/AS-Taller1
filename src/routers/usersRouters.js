const { Router } = require('express');
const { getAllUsers, getUserById, deleteUserById, updateUserById } = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getUserById);

usersRouter.delete('/:id', deleteUserById);

usersRouter.patch('/:id', updateUserById);

module.exports = usersRouter;
