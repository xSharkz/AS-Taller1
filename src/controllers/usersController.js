const bcrypt = require('bcrypt');

const users = [
    { id: 0, name: 'Martin', lastName: 'Becerra', email: 'martin.becerra@alumnos.ucn.cl', password: 'admin', role: 'Administrador', createdDate: '05/04/2025', active: 1},
];

const createUser = (req, res) => {
    const { name, lastName, email, password, confirmationPassword, role } = req.body;
    
    if (!name?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim() || !confirmationPassword?.trim() || !role?.trim()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    if (role !== 'Administrador' && role !== 'Usuario') {
        return res.status(400).json({ message: 'El rol debe ser Administrador o Usuario' });
    }

    if ( confirmationPassword !== password ) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const newUser = {
        id: users.length,
        name,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
        createdDate: new Date().toLocaleDateString(),
        active: 1
    };

    users.push(newUser);
    const { password: hashedPassword, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Usuario creado', user: userWithoutPassword });
}

const getUserById = (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { id: userId, name, lastName, email, role, createdDate } = user;
    res.status(200).json({ id: userId, name, lastName, email, role, createdDate });
}

const updateUserById = (req, res) => {
    const { id } = req.params;
    
    const user = users.find(user => user.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { password } = req.body;

    if (password) {
        return res.status(400).json({ message: 'No se puede modificar la contraseña aquí' });
    }

    const { name, lastName, email } = req.body;
    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    const { id: userId, name: userName, lastName: userLastName, email: userEmail, role, createdDate } = user;
    res.status(200).json({ id: userId, name: userName, lastName: userLastName, email: userEmail, role, createdDate });
}

const deleteUserById = (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.active = 0;
    res.status(200).end();
}

const getAllUsers = (req, res) => {
    const filteredUsers = users.map(({ id, name, lastName, email, role, createdDate }) => ({
        id,
        name,
        lastName,
        email,
        role,
        createdDate
    }));

    res.status(200).json(filteredUsers);
}

module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    createUser,
};