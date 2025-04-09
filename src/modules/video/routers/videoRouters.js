const { Router } = require('express');
const {
  crearVideo,
  listarVideos,
  obtenerVideo,
  actualizarVideo,
  eliminarVideo
} = require('../controllers/videoController');

const videoRouter = Router();

videoRouter.route('/')
  .get(listarVideos)
  .post(crearVideo);

videoRouter.route('/:id')
  .get(obtenerVideo)
  .patch(actualizarVideo)
  .delete(eliminarVideo);

module.exports = videoRouter;
