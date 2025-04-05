const express = require('express');
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const users = [
  { name: 'Martin', lastName: 'Becerra', email: 'martin.becerra@alumnos.ucn.cl', password: 'admin', role: 'Administrador' },
];
/**Nombre, apellido, correo 
electrónico, contraseña, y rol. */

app.get('/', (req, res) => {
  res.send('El servidor está corriendo.');
});

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.listen(port, () => {
  console.log(`*Servidor corriendo en modo ${environment} en el url: http://localhost:${port}/.`);
});
