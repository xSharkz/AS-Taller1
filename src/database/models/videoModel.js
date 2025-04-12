const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const videoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  genero: {
    type: String,
    required: true,
  },
  eliminado: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number,
    unique: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret.id || ret._id;
      delete ret._id;
    }
  }
});

videoSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Video', videoSchema);
