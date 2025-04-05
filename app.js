require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const usersRouters = require('./src/routers/usersRouters');
const authRouters = require('./src/routers/authRouters');

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('El servidor está corriendo.');
});

app.use('/usuarios', usersRouters);
app.use('/auth', authRouters);

app.listen(port, () => {
  console.log(`*Servidor corriendo en modo ${environment} en el url: http://localhost:${port}/.`);
});
