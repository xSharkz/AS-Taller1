const { config } = require('dotenv');
config({ path: '.env' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_secret = process.env.JWT_SECRET;
const Users = require('../database/models/usersModel');
const catchAsync = require('../utils/catchAsync');
const { default: AppError } = require('../utils/appError');

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new AppError('Todos los campos son obligatorios', 400);
    }

    const user = await Users.findOne({ email });

    if (!user || !user.active) {
        throw new AppError('Las credenciales son inválidas o el usuario fue eliminado', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError('La contraseña ingresada no es correcta', 401);
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        jwt_secret,
        { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ token, user: userWithoutPassword });
    
});

const updatePasswordById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { password, newPassword, confirmPassword } = req.body;

    if (!password?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
        throw new AppError('Todos los campos son obligatorios', 400);
    }

    try {
        const user = await Users.findById(id);

        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('La contraseña ingresada no es correcta', 401);
        }

        if (newPassword !== confirmPassword) {
            throw new AppError('Las contraseñas no coinciden', 400);
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save(); 

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error en el servidor', error: error.message });
    }
});

module.exports = {
    login,
    updatePasswordById,
};
