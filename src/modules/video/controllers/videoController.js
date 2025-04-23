const Video = require('../../../database/models/videoModel');
const AppError = require('../../../utils/appError');
const catchAsync = require('../../../utils/catchAsync');

// Crear video (solo administrador)
const createVideo = catchAsync(async (req, res) => {
  const { titulo, descripcion, genero } = req.body;
  const { role } = req.user;

  if (role !== 'Administrador') {
    throw new AppError('Solo los administradores pueden subir videos', 403);
  }

  if (!titulo?.trim() || !descripcion?.trim() || !genero?.trim()) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  const newVideo = await Video.create({ titulo, descripcion, genero });

  res.status(201).json({ message: 'Video creado correctamente', video: newVideo });
});

// Obtener video por ID
const getVideoById = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);

  const video = await Video.findOne({ id, eliminado: false });
  if (!video) {
    throw new AppError('Video no encontrado', 404);
  }

  res.status(200).json(video);
});

// Actualizar video (solo administrador)
const updateVideoById = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);
  const { role } = req.user;

  if (role !== 'Administrador') {
    throw new AppError('Solo los administradores pueden actualizar videos', 403);
  }

  const { titulo, descripcion, genero } = req.body;

  const video = await Video.findOneAndUpdate(
    { id, eliminado: false },
    { titulo, descripcion, genero },
    { new: true }
  );

  if (!video) {
    throw new AppError('Video no encontrado', 404);
  }

  res.status(200).json({ message: 'Video actualizado correctamente', video });
});

// Eliminar video (soft delete, solo administrador)
const deleteVideoById = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);
  const { role } = req.user;

  if (role !== 'Administrador') {
    throw new AppError('Solo los administradores pueden eliminar videos', 403);
  }

  const video = await Video.findOneAndUpdate({ id }, { eliminado: true });

  if (!video) {
    throw new AppError('Video no encontrado', 404);
  }

  res.status(204).end();
});

// Listar videos disponibles (clientes y administradores)
const getAllVideos = catchAsync(async (req, res) => {
  const { titulo, genero } = req.query;

  const filter = {
    eliminado: false,
    ...(titulo && { titulo: { $regex: titulo, $options: 'i' } }),
    ...(genero && { genero: { $regex: genero, $options: 'i' } }),
  };

  const videos = await Video.find(filter);

  const result = videos.map(({ id, titulo, descripcion, genero }) => ({
    id,
    titulo,
    descripcion,
    genero
  }));

  res.status(200).json(result);
});

module.exports = {
  createVideo,
  getVideoById,
  updateVideoById,
  deleteVideoById,
  getAllVideos
};
