const mongoose = require('mongoose');
const { EVENT_CATEGORIES } = require('../constants');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul event wajib diisi'],
      trim: true,
      maxlength: [200, 'Judul maksimal 200 karakter'],
    },
    description: {
      type: String,
      required: [true, 'Deskripsi wajib diisi'],
    },
    ustadz: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Kategori wajib diisi'],
      enum: {
        values: EVENT_CATEGORIES,
        message: 'Kategori tidak valid',
      },
    },
    location: {
      type: String,
      required: [true, 'Lokasi wajib diisi'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Tanggal wajib diisi'],
    },
    startTime: {
      type: String,
      required: [true, 'Waktu mulai wajib diisi'],
    },
    endTime: {
      type: String,
      required: [true, 'Waktu selesai wajib diisi'],
    },
    image: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model('Event', eventSchema);
