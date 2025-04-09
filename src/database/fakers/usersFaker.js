const { randomUUID } = require('crypto');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt); 
  return hashedPassword;
};

const generateFakeUser = async () => {
  const password = faker.internet.password();
  const hashedPassword = await hashPassword(password);

  return {
    _id: randomUUID(),
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(['Administrador', 'Cliente']),
    createdAt: faker.date.past(),
    active: faker.datatype.boolean(),
  };
};

module.exports = generateFakeUser;
