const bcrypt = require('bcrypt');
const Users = require('../database/models/usersModel');
const catchAsync = require('../utils/catchAsync');
const { default: AppError } = require('../utils/appError');

const createUser = catchAsync(async (req, res) => {
    const { name, lastName, email, password, confirmationPassword, role } = req.body;
    if (!name?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim() || !confirmationPassword?.trim() || !role?.trim()) {
        throw new AppError('Todos los campos son obligatorios', 400);
    }

    const existingUser = await Users.findOne({email});
    if (existingUser) {
        throw new AppError('El correo ya está registrado', 400);
    }

    if (role !== 'Administrador' && role !== 'Usuario') {
        throw new AppError('El rol debe ser Administrador o Usuario', 400);
    }

    if ( confirmationPassword !== password ) {
        throw new AppError('Las contraseñas no coinciden', 400);
    }
    const newUser = await Users.create({
        name,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
        createdAt: new Date().toLocaleDateString(),
        active: true
    });
    
    const { password: hashedPassword, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Usuario creado', user: userWithoutPassword });
});

const getUserById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await Users.findById(id);

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    const { _id, name, lastName, email, role, createdAt } = user;
    res.status(200).json({ id: _id, name, lastName, email, role, createdAt });
});

const updateUserById = catchAsync(async (req, res) => {

    const { id } = req.params;

    const user = await Users.findById(id);

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    const { password } = req.body;

    if (password) {
        throw new AppError('No se puede modificar la contraseña aquí', 400);
    }

    const { name, lastName, email } = req.body;
    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    await user.save();
    const { _id, role, createdAt } = user;
    res.status(200).json({ id: _id, name: user.name, lastName: user.lastName, email: user.email, role, createdAt });
});

const deleteUserById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await Users.findById(id);

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    user.active = false;
    await user.save();

    res.status(200).end();
});

const getAllUsers = catchAsync(async (req, res) => {

    const { email, name, lastName } = req.query;

    const query = { active: true };

    if (email?.trim()) {
    query.email = { $regex: email, $options: 'i' }; 
    }

    if (name?.trim()) {
    query.name = { $regex: name, $options: 'i' };
    }

    if (lastName?.trim()) {
    query.lastName = { $regex: lastName, $options: 'i' };
    }

    const users = await Users.find(query);

    const result = users.map(({ id, name, lastName, email, role, createdAt }) => ({
    id,
    name,
    lastName,
    email,
    role,
    createdAt
    }));
  
    res.status(200).json(result);
});

module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    createUser,
};