const { Router } = require('express');
const { getAllUsers } = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
