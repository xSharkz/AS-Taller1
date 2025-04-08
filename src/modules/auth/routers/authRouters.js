const { Router } = require('express');
const { login, updatePasswordById } = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/login', login);

authRouter.patch('/usuarios/:id', updatePasswordById);

module.exports= authRouter;