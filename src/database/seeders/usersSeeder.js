const { generateFakeUser, generateFakeAdmin } = require('../fakers/usersFaker');
const catchAsync = require('../../utils/catchAsync');
const Users = require('../models/usersModel');

const generateFakeUsers = async (num) => {
    const fakeUsers = [];
    for (let i = 0; i < num; i++) {
      fakeUsers.push(await generateFakeUser());
    }
    return fakeUsers;
  };
  
const insertFakeUsers = catchAsync(async (num) => {
    const fakeUsers = await generateFakeUsers(num);
    const fakeAdmins = await generateFakeAdmins();
    await Users.insertMany(fakeUsers);
    await Users.insertMany(fakeAdmins);
    console.log(`${num} usuarios falsos han sido insertados en la base de datos.`);
});

const generateFakeAdmins = async () => {
  const fakeAdmins = [];
  fakeAdmins.push(await generateFakeAdmin("Kevin","Araya","kevin.araya01@alumnos.ucn.cl"));
  fakeAdmins.push(await generateFakeAdmin("Martin","Becerra","martin.becerra@alumnos.ucn.cl"));
  return fakeAdmins;
};

module.exports = insertFakeUsers;