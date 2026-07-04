const mongoose = require('mongoose');
const { ANNOUNCEMENT_STATUS, ANNOUNCEMENT_CATEGORIES } = require('../constants');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul wajib diisi'],
      trim: true,
      maxlength: [200, 'Judul maksimal 200 karakter'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Konten wajib diisi'],
    },
    category: {
      type: String,
      required: [true, 'Kategori wajib diisi'],
      enum: {
        values: ANNOUNCEMENT_CATEGORIES,
        message: 'Kategori tidak valid',
      },
    },
    thumbnail: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ANNOUNCEMENT_STATUS),
        message: 'Status tidak valid',
      },
      default: ANNOUNCEMENT_STATUS.DRAFT,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author wajib diisi'],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
announcementSchema.index({ title: 'text', content: 'text' });
announcementSchema.index({ status: 1, category: 1 });
announcementSchema.index({ slug: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
