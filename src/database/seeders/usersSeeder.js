const generateFakeUser = require('../fakers/usersFaker');
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
    await Users.insertMany(fakeUsers);
    console.log(`${num} usuarios falsos han sido insertados en la base de datos.`);
});

module.exports = insertFakeUsers;