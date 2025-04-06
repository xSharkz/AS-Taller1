const { config } = require('dotenv');
config({ path: '.env' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_secret = process.env.JWT_SECRET;
const Users = require('../database/models/usersModel');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const user = await Users.findOne({ email });

        if (!user || !user.active) {
            return res.status(401).json({ message: 'Las credenciales son inválidas o el usuario fue eliminado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'La contraseña ingresada no es correcta' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            jwt_secret,
            { expiresIn: '1h' }
        );

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error en el servidor', error: error.message });
    }
};

const updatePasswordById = async (req, res) => {
    const { id } = req.params;
    const { password, newPassword, confirmPassword } = req.body;

    if (!password?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const user = await Users.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'La contraseña ingresada no es correcta' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save(); 

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error en el servidor', error: error.message });
    }
};

module.exports = {
    login,
    updatePasswordById,
};
