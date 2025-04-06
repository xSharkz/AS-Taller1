const bcrypt = require('bcrypt');
const Users = require('../database/models/usersModel');

const createUser = async (req, res) => {
    const { name, lastName, email, password, confirmationPassword, role } = req.body;
    if (!name?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim() || !confirmationPassword?.trim() || !role?.trim()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await Users.findOne({email});
    if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    if (role !== 'Administrador' && role !== 'Usuario') {
        return res.status(400).json({ message: 'El rol debe ser Administrador o Usuario' });
    }

    if ( confirmationPassword !== password ) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
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
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await Users.findById(id);

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { _id, name, lastName, email, role, createdAt } = user;
    res.status(200).json({ id: _id, name, lastName, email, role, createdAt });
}

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
    
        const user = await Users.findById(id);

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

        await user.save();
        const { _id, role, createdAt } = user;
        res.status(200).json({ id: _id, name: user.name, lastName: user.lastName, email: user.email, role, createdAt });
        }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
    
}

const deleteUserById = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await Users.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.active = false;
        await user.save();

        res.status(200).end();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
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
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  };

module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    createUser,
};