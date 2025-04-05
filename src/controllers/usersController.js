const users = [
    { id: 0, name: 'Martin', lastName: 'Becerra', email: 'martin.becerra@alumnos.ucn.cl', password: 'admin', role: 'Administrador', createdDate: '05/04/2025'},
];

const getUserById = (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { id: userId, name, lastName, email, role, createdDate } = user;
    res.status(200).json({ id: userId, name, lastName, email, role, createdDate });
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
    getUserById
};