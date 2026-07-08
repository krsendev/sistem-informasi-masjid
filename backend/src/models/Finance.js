const mongoose = require('mongoose');
const { FINANCE_TYPE, FINANCE_CATEGORIES } = require('../constants');

const financeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Tipe transaksi wajib diisi'],
      enum: {
        values: Object.values(FINANCE_TYPE),
        message: 'Tipe transaksi tidak valid (income/expense)',
      },
    },
    category: {
      type: String,
      required: [true, 'Kategori wajib diisi'],
      enum: {
        values: FINANCE_CATEGORIES,
        message: 'Kategori tidak valid',
      },
    },
    donorName: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Jumlah wajib diisi'],
      min: [0, 'Jumlah tidak boleh negatif'],
    },
    description: {
      type: String,
      required: [true, 'Deskripsi wajib diisi'],
      trim: true,
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
financeSchema.index({ type: 1, category: 1 });
financeSchema.index({ date: 1 });
financeSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Finance', financeSchema);
