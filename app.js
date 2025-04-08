const { config } = require('dotenv');
config({ path: '.env' });
const express = require('express');
const morgan = require('morgan');
const { connect } = require('mongoose');
const usersRouters = require('./src/routers/usersRouters');
const authRouters = require('./src/routers/authRouters');
const globalErrorMiddleware = require('./src/middlewares/globalErrorMiddleware');
const videoRouters = require('./src/routers/videoRouters');


//const port = process.env.PORT || 3000;
//const environment = process.env.NODE_ENV || 'development';

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
app.use(globalErrorMiddleware);

/** 
app.listen(port, () => {
  console.log(`*Servidor corriendo en modo ${environment} en el url: http://localhost:${port}/.`);
});**/


app.listen(process.env.PORT, () => {
  console.log(`-Entorno: ${process.env.NODE_ENV}`);
  console.log(`-Servidor corriendo en el puerto: ${process.env.PORT}`);
  console.log(`-URL: http://localhost:${process.env.PORT}/`);
});
