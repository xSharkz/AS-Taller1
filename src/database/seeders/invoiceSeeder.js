const { faker } = require('@faker-js/faker');
const Invoice = require('../models/invoiceModel');
const generateFakeInvoice = require('../fakers/invoiceFaker');
const Users = require('../models/usersModel');
const sequelize = require('../sequelize');

const insertFakeInvoices = async (cantidadTotal = 350) => {
    try {
      const clientes = await Users.find({ role: 'Cliente', active: true });
  
      if (!clientes.length) {
        return;
      }
  
      const facturas = [];
  
      while (facturas.length < cantidadTotal) {
        const cliente = faker.helpers.arrayElement(clientes);
        const factura = generateFakeInvoice(cliente._id.toString());
        facturas.push(factura);
      }
  
      await sequelize.sync();
      await Invoice.bulkCreate(facturas);
    } catch (error) {
      console.error('Error al insertar facturas:', error.message);
    }
  };

module.exports = insertFakeInvoices;
