const { Router } = require('express');
const { login, updatePasswordById } = require('../controllers/authController');
const authMiddleware = require('../../../middlewares/authMiddleware');

const authRouter = Router();

authRouter.post('/login', login);

authRouter.patch('/usuarios/:id', authMiddleware, updatePasswordById);

module.exports= authRouter;