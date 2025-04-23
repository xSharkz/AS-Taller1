const { Router } = require('express');
const {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideoById,
  deleteVideoById
} = require('../controllers/videoController');

const authMiddleware = require('../../../middlewares/authMiddleware');

const videoRouter = Router();

videoRouter.route('/')
  .get(authMiddleware, getAllVideos)
  .post(authMiddleware, createVideo);

videoRouter.route('/:id')
  .get(authMiddleware, getVideoById)
  .patch(authMiddleware, updateVideoById)
  .delete(authMiddleware, deleteVideoById);

module.exports = videoRouter;
