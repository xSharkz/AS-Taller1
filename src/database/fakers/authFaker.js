const { faker } = require('@faker-js/faker');
const { randomUUID } = require('crypto');

const generateFakeAuthLog = () => {
  return {
    id: randomUUID(),
    email: faker.internet.email(),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    action: faker.helpers.arrayElement(['LOGIN', 'UPDATE_PASSWORD']),
    success: faker.datatype.boolean(),
    timestamp: faker.date.recent(),
  };
};

module.exports = generateFakeAuthLog;
