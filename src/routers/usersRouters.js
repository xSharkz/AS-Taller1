const { Router } = require('express');
const { getAllUsers, getUserById } = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getUserById);

module.exports = usersRouter;
