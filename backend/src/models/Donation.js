const mongoose = require('mongoose');
const { DONATION_CATEGORIES } = require('../constants');

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: [true, 'Nama donatur wajib diisi'],
      trim: true,
      maxlength: [100, 'Nama donatur maksimal 100 karakter'],
    },
    amount: {
      type: Number,
      required: [true, 'Jumlah donasi wajib diisi'],
      min: [0, 'Jumlah donasi tidak boleh negatif'],
    },
    category: {
      type: String,
      required: [true, 'Kategori wajib diisi'],
      enum: {
        values: DONATION_CATEGORIES,
        message: 'Kategori tidak valid',
      },
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Tanggal wajib diisi'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'CreatedBy wajib diisi'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
donationSchema.index({ category: 1 });
donationSchema.index({ date: -1 });
donationSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Donation', donationSchema);
