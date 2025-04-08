const { Router } = require('express');
const { getAllUsers, getUserById, deleteUserById, updateUserById, createUser } = require('../modules/users/usersController');

const usersRouter = Router();

usersRouter.route('/')
    .get(getAllUsers)
    .post(createUser);

usersRouter.route('/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);

module.exports = usersRouter;
