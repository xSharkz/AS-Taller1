const express = require('express');
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.listen(port, () => {
  console.log(`*Servidor corriendo en modo ${environment} en el url: http://localhost:${port}/.`);
});

app.get('/', (req, res) => {
  res.send('El servidor está corriendo.');
});

