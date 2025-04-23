const bcrypt = require('bcrypt');
const Users = require('../../../database/models/usersModel');
const catchAsync = require('../../../utils/catchAsync');
const AppError = require('../../../utils/appError');
const verifyToken = require('../../../utils/verifyToken');

const createUser = catchAsync(async (req, res) => {
    const { name, lastName, email, password, confirmationPassword, role } = req.body;
    if (!name?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim() || !confirmationPassword?.trim() || !role?.trim()) {
        throw new AppError('Todos los campos son obligatorios', 400);
    }
    
    const existingUser = await Users.findOne({email});
    if (existingUser) {
        throw new AppError('El correo ya está registrado', 400);
    }

    if (role !== 'Administrador' && role !== 'Cliente') {
        throw new AppError('El rol debe ser Administrador o Cliente', 400);
    }

    if ( confirmationPassword !== password ) {
        throw new AppError('Las contraseñas no coinciden', 400);
    }

    if (role === 'Administrador') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new AppError('No estás autenticado para crear un administrador', 401);
        }
        const decodedToken = await verifyToken(token);
        const authenticatedUserRole = decodedToken.role;

        if (authenticatedUserRole !== 'Administrador') {
            throw new AppError('No tienes permisos para crear un usuario con rol Administrador', 403);
        }
    }
    const newUser = await Users.create({
        name,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
        createdAt: new Date(),
        active: true
    });
    
    const { password: hashedPassword, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Usuario creado', user: userWithoutPassword });
});

const getUserById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { id: tokenId, role: tokenRole } = req.user;

    const user = await Users.findById(id);

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    if (tokenRole !== 'Administrador' && tokenId !== id) {
        throw new AppError('No tienes permisos para ver este usuario', 403);
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
    const { id: tokenId, role: tokenRole } = req.user;

    const user = await Users.findById(id);

    if (tokenRole !== 'Administrador') {
        throw new AppError('No tienes permisos para realizar esta acción', 403);
    }

    if (!user) {
        throw new AppError('Usuario no encontrado', 404);
    }

    if (user._id.toString() === tokenId) {
        throw new AppError('No puedes eliminar tu propio usuario', 400);
    }

    user.active = false;
    await user.save();

    res.status(204).end();
});

const getAllUsers = catchAsync(async (req, res) => {
    const { email, name, lastName } = req.query;
    const { id: tokenId, role: tokenRole } = req.user;

    if (tokenRole !== 'Administrador') {
        throw new AppError('No tienes permisos para realizar esta acción', 403);
    }

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