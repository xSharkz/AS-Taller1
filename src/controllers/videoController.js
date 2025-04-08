const Video = require('../database/models/videoModel');
const AppError = require('../utils/appError');

// Crear nuevo video
exports.crearVideo = async (req, res, next) => {
  try {
    const { titulo, descripcion, genero } = req.body;
    const nuevoVideo = await Video.create({ titulo, descripcion, genero });
    res.status(201).json(nuevoVideo);
  } catch (err) {
    next(err);
  }
};

// Obtener video por ID (auto-incremental)
exports.obtenerVideo = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const video = await Video.findOne({ id: id, eliminado: false });
    if (!video) return next(new AppError('Video no encontrado', 404));

    res.json(video);
  } catch (err) {
    next(err);
  }
};

// Actualizar video por ID (auto-incremental)
exports.actualizarVideo = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const video = await Video.findOneAndUpdate(
      { id: id, eliminado: false },
      req.body,
      { new: true }
    );

    if (!video) return next(new AppError('Video no encontrado', 404));

    res.json(video);
  } catch (err) {
    next(err);
  }
};

// Eliminar video (soft delete)
exports.eliminarVideo = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const video = await Video.findOneAndUpdate(
      { id: id },
      { eliminado: true }
    );

    if (!video) return next(new AppError('Video no encontrado', 404));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Listar todos los videos (filtrables)
exports.listarVideos = async (req, res, next) => {
  try {
    const { titulo, genero } = req.query;

    const filtro = {
      eliminado: false,
      ...(titulo && { titulo: { $regex: titulo, $options: 'i' } }),
      ...(genero && { genero: { $regex: genero, $options: 'i' } }),
    };

    const videos = await Video.find(filtro);
    res.json(videos);
  } catch (err) {
    next(err);
  }
};
