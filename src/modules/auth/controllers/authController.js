const { config } = require('dotenv');
config({ path: '.env' });

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_secret = process.env.JWT_SECRET;

const Users = require('../../../database/models/usersModel');
const catchAsync = require('../../../utils/catchAsync');
const AppError = require('../../../utils/appError');
const prisma = require('../../../database/prisma');

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new AppError('Todos los campos son obligatorios', 400);
    }

    const user = await Users.findOne({ email });
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!user || !user.active) {
        await prisma.authLog.create({
            data: {
                email,
                ipAddress,
                userAgent,
                action: 'LOGIN',
                success: false,
            }
        });

        throw new AppError('Las credenciales son inválidas o el usuario fue eliminado', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        await prisma.authLog.create({
            data: {
                email,
                ipAddress,
                userAgent,
                action: 'LOGIN',
                success: false,
            }
        });

        throw new AppError('La contraseña ingresada no es correcta', 401);
    }

    await prisma.authLog.create({
        data: {
            email,
            ipAddress,
            userAgent,
            action: 'LOGIN',
            success: true,
        }
    });

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

    const user = await Users.findById(id);

    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!user) {
        await prisma.authLog.create({
            data: {
                email: user.email,
                ipAddress,
                userAgent,
                action: 'UPDATE_PASSWORD',
                success: false,
            }
        });
        throw new AppError('Usuario no encontrado', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        await prisma.authLog.create({
            data: {
                email: user.email,
                ipAddress,
                userAgent,
                action: 'UPDATE_PASSWORD',
                success: false,
            }
        });
        throw new AppError('La contraseña ingresada no es correcta', 401);
    }

    if (newPassword !== confirmPassword) {
        await prisma.authLog.create({
            data: {
                email: user.email,
                ipAddress,
                userAgent,
                action: 'UPDATE_PASSWORD',
                success: false,
            }
        });
        throw new AppError('Las contraseñas no coinciden', 400);
    }
    console.log(user);
    console.log(user.lastName);
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await prisma.authLog.create({
        data: {
            email: user.email,
            ipAddress,
            userAgent,
            action: 'UPDATE_PASSWORD',
            success: true,
        }
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
});

module.exports = {
    login,
    updatePasswordById,
};
