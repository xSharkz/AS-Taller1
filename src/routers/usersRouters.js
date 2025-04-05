const { Router } = require('express');
const { getAllUsers, getUserById, deleteUserById } = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getUserById);

usersRouter.delete('/:id', deleteUserById);

module.exports = usersRouter;
