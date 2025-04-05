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

//TODO: El usuario actualmente no puede cambiar su contraseña ya que se obtiene una lista de usuarios
//provisional, por lo que no se cambia la contraseña real de la base de datos.
const updatePasswordById = async (req, res) => {
    const { id } = req.params;
    const { password, newPassword, confirmPassword } = req.body;

    if (!password?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    //TODO: Cambiar la forma de obtener el usuario para que no se use una lista de usuarios
    const users = usersController.getAllUsersData(); 

    const user = users.find(user => user.id === parseInt(id));

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

    res.json({ message: 'Contraseña actualizada correctamente' });
};

module.exports = {
    login,
    updatePasswordById,
};
