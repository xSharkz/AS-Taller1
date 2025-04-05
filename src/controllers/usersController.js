const users = [
    { name: 'Martin', lastName: 'Becerra', email: 'martin.becerra@alumnos.ucn.cl', password: 'admin', role: 'Administrador' },
];

const getAllUsers = (req, res) => {
    res.status(200).json(users);
}

module.exports = {getAllUsers};