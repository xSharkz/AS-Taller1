const { faker } = require('@faker-js/faker');

const estados = ['Pendiente', 'Pagado', 'Vencido'];

const generateFakeInvoice = (clientId) => {
  return {
    clientId,
    monto: faker.number.int({ min: 10000, max: 100000 }),
    estado: faker.helpers.arrayElement(estados),
    createdAt: faker.date.past(),
    updatedAt: new Date()
  };
};

module.exports = generateFakeInvoice;
