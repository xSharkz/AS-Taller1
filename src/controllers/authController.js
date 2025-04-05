const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersController = require('./usersController');
const jwt_secret = process.env.JWT_SECRET;

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const users = usersController.getAllUsersData(); 

        const user = users.find(user => user.email === email);

        if (!user || user.active === 0) {
            return res.status(401).json({ message: 'Las credenciales son inválidas o el usuario fue eliminado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'La contraseña ingresada no es correcta' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwt_secret, {
            expiresIn: '1h',
        });

        const { password: _, ...userWithoutPassword } = user;

        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Ha ocurrido un error de parte del servidor', error: error.message });
    }
};

module.exports = {
    login,
};
