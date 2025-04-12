const Video = require('../models/videoModel');
const generateFakeVideo = require('../fakers/videoFaker');

const insertFakeVideos = async (num = 500) => {
  try {
    for (let i = 0; i < num; i++) {
      const video = generateFakeVideo();
      await Video.create(video); 
    }

    const total = await Video.countDocuments();
    console.log(`Total de videos insertados: ${total}`);
  } catch (error) {
    console.error('Error al insertar videos:', error.message);
    throw error;
  }
};

module.exports = insertFakeVideos;
