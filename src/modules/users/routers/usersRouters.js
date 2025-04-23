const { Router } = require('express');
const { getAllUsers, getUserById, deleteUserById, updateUserById, createUser } = require('../controllers/usersController');
const authMiddleware = require('../../../middlewares/authMiddleware');

const usersRouter = Router();

usersRouter.route('/')
    .get(authMiddleware, getAllUsers)
    .post(createUser);

usersRouter.route('/:id')
    .get(authMiddleware, getUserById)
    .patch(authMiddleware, updateUserById)
    .delete(authMiddleware, deleteUserById);

module.exports = usersRouter;
