const { config } = require('dotenv');
config({ path: '.env' });
const express = require('express');
const morgan = require('morgan');
const { connect } = require('mongoose');
const usersRouters = require('./src/modules/users/routers/usersRouters');
const authRouters = require('./src/modules/auth/routers/authRouters');
const globalErrorMiddleware = require('./src/middlewares/globalErrorMiddleware');
const videoRouters = require('./src/modules/video/routers/videoRouters');
const invoiceRouter = require('./src/modules/invoice/routers/invoiceRouter');

const sequelize = require('./src/database/sequelize');
const Invoice = require('./src/database/models/invoiceModel');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Conexión a MariaDB exitosa y tablas sincronizadas.');
  } catch (error) {
    console.error('Error al conectar a MariaDB:', error.message);
  }
})();

config({ path: '.env' });

const MONGODB = process.env.MONGO_DATABASE
  .replace('<PASSWORD>', process.env.MONGO_PASSWORD)
  .replace('<USER>', process.env.MONGO_USER);

connect(MONGODB).then(() => {
  console.log('Conexión a la base de datos exitosa.');
}).catch((err) => {
  console.error('Error al conectar a la base de datos:', err);
});

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('El servidor está corriendo.');
});

app.use('/usuarios', usersRouters);
app.use('/auth', authRouters);
app.use('/videos', videoRouters);
app.use('/facturas', invoiceRouter);
app.use(globalErrorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`-Entorno: ${process.env.NODE_ENV}`);
  console.log(`-Servidor corriendo en el puerto: ${process.env.PORT}`);
  console.log(`-URL: http://localhost:${process.env.PORT}/`);
});
