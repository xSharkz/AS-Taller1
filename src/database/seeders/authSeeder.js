const generateFakeAuthLog = require('../fakers/authFaker');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../prisma'); 

const generateFakeAuthLogs = async (num) => {
  const fakeAuthLogs = [];
  for (let i = 0; i < num; i++) {
    fakeAuthLogs.push(generateFakeAuthLog());
  }
  return fakeAuthLogs;
};

const insertFakeAuthLogs = catchAsync(async (num) => {
  const fakeAuthLogs = await generateFakeAuthLogs(num);
  await prisma.authLog.createMany({
    data: fakeAuthLogs,
  });
  console.log(`${num} registros de AuthLog falsos han sido insertados en la base de datos.`);
});

module.exports = insertFakeAuthLogs;
