const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Pagado', 'Vencido'),
    defaultValue: 'Pendiente'
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: true
  },
  eliminado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'facturas',
  timestamps: true
});

module.exports = Invoice;
