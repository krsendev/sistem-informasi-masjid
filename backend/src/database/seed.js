const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Finance = require('../models/Finance');
const Donation = require('../models/Donation');

const { ROLES, ANNOUNCEMENT_STATUS } = require('../constants');
const { generateUniqueSlug } = require('../utils/slug');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/simm_db';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Announcement.deleteMany({}),
      Event.deleteMany({}),
      Finance.deleteMany({}),
      Donation.deleteMany({}),
    ]);
    console.log('Data cleared');

    // Seed users
    console.log('Seeding users...');
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'admin@masjid.com',
        password: 'password123',
        phone: '081234567890',
        role: ROLES.SUPERADMIN,
        isActive: true,
      },
      {
        name: 'Admin Masjid',
        email: 'admin2@masjid.com',
        password: 'password123',
        phone: '081234567891',
        role: ROLES.ADMIN,
        isActive: true,
      },
    ]);
    console.log(`${users.length} users seeded`);

    const superadmin = users[0];

    // Seed announcements
    console.log('Seeding announcements...');
    const announcements = await Announcement.create([
      {
        title: 'Jadwal Sholat Jumat Bulan Ini',
        slug: generateUniqueSlug('Jadwal Sholat Jumat Bulan Ini'),
        content: 'Berikut jadwal imam dan khatib sholat Jumat untuk bulan ini. Jamaah diharapkan hadir 15 menit sebelum waktu sholat.',
        category: 'pengumuman',
        status: ANNOUNCEMENT_STATUS.PUBLISHED,
        author: superadmin._id,
        publishedAt: new Date(),
      },
      {
        title: 'Pengumpulan Zakat Fitrah',
        slug: generateUniqueSlug('Pengumpulan Zakat Fitrah'),
        content: 'Pengumpulan zakat fitrah akan dimulai tanggal 20 Ramadhan. Dapat dibayarkan di sekretariat masjid setiap hari pukul 08:00 - 17:00.',
        category: 'zakat',
        status: ANNOUNCEMENT_STATUS.PUBLISHED,
        author: superadmin._id,
        publishedAt: new Date(),
      },
      {
        title: 'Renovasi Tempat Wudhu',
        slug: generateUniqueSlug('Renovasi Tempat Wudhu'),
        content: 'Insya Allah akan dilakukan renovasi tempat wudhu mulai minggu depan. Jamaah diharapkan menggunakan tempat wudhu sementara.',
        category: 'pengumuman',
        status: ANNOUNCEMENT_STATUS.DRAFT,
        author: superadmin._id,
      },
      {
        title: 'Kajian Rutin Subuh',
        slug: generateUniqueSlug('Kajian Rutin Subuh'),
        content: 'Kajian rutin ba\'da subuh setiap hari Ahad bersama Ustadz Ahmad. Tema: Fiqih Ibadah.',
        category: 'kajian',
        status: ANNOUNCEMENT_STATUS.PUBLISHED,
        author: superadmin._id,
        publishedAt: new Date(),
      },
    ]);
    console.log(`${announcements.length} announcements seeded`);

    // Seed events
    console.log('Seeding events...');
    const now = new Date();
    const events = await Event.create([
      {
        title: 'Kajian Akbar Bulanan',
        description: 'Kajian akbar bulanan bersama Ustadz Dr. Abdullah. Tema: Menjadi Muslim Kaffah di Era Modern.',
        ustadz: 'Ustadz Dr. Abdullah',
        category: 'kajian',
        location: 'Masjid Al-Ikhlas - Aula Utama',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        startTime: '09:00',
        endTime: '11:30',
        isPublished: true,
      },
      {
        title: 'Pengajian Ibu-Ibu',
        description: 'Pengajian rutin ibu-ibu setiap Selasa pagi. Belajar tajwid dan tafsir Al-Quran.',
        ustadz: 'Ustadzah Fatimah',
        category: 'pengajian',
        location: 'Masjid Al-Ikhlas - Ruang Serbaguna',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        startTime: '08:00',
        endTime: '10:00',
        isPublished: true,
      },
      {
        title: 'Sholat Istisqa',
        description: 'Pelaksanaan sholat istisqa (sholat minta hujan) berjamaah.',
        ustadz: 'Imam Masjid',
        category: 'sholat',
        location: 'Halaman Masjid Al-Ikhlas',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
        startTime: '07:00',
        endTime: '08:00',
        isPublished: true,
      },
      {
        title: 'Musyawarah Pengurus DKM',
        description: 'Rapat pengurus DKM membahas program kerja semester II.',
        ustadz: '',
        category: 'musyawarah',
        location: 'Sekretariat Masjid',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
        startTime: '19:30',
        endTime: '21:00',
        isPublished: true,
      },
    ]);
    console.log(`${events.length} events seeded`);

    // Seed finances
    console.log('Seeding finances...');
    const finances = await Finance.create([
      {
        type: 'income',
        category: 'infaq',
        amount: 5000000,
        description: 'Infaq Jumat minggu ke-1',
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        createdBy: superadmin._id,
      },
      {
        type: 'income',
        category: 'infaq',
        amount: 4500000,
        description: 'Infaq Jumat minggu ke-2',
        date: new Date(now.getFullYear(), now.getMonth(), 12),
        createdBy: superadmin._id,
      },
      {
        type: 'income',
        category: 'donasi',
        amount: 10000000,
        description: 'Donasi pembangunan dari Bapak Haji Usman',
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        createdBy: superadmin._id,
      },
      {
        type: 'expense',
        category: 'listrik',
        amount: 1500000,
        description: 'Pembayaran listrik bulan ini',
        date: new Date(now.getFullYear(), now.getMonth(), 8),
        createdBy: superadmin._id,
      },
      {
        type: 'expense',
        category: 'kebersihan',
        amount: 800000,
        description: 'Gaji petugas kebersihan',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        createdBy: superadmin._id,
      },
      {
        type: 'expense',
        category: 'perawatan',
        amount: 2000000,
        description: 'Perbaikan AC masjid',
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        createdBy: superadmin._id,
      },
      {
        type: 'income',
        category: 'sedekah',
        amount: 3000000,
        description: 'Sedekah kotak amal',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 20),
        createdBy: superadmin._id,
      },
      {
        type: 'expense',
        category: 'operasional',
        amount: 500000,
        description: 'Pembelian alat tulis dan perlengkapan',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 25),
        createdBy: superadmin._id,
      },
    ]);
    console.log(`${finances.length} finance records seeded`);

    // Seed donations
    console.log('Seeding donations...');
    const donations = await Donation.create([
      {
        donorName: 'Bapak Haji Ahmad',
        amount: 5000000,
        category: 'pembangunan',
        note: 'Untuk renovasi mihrab',
        date: new Date(now.getFullYear(), now.getMonth(), 3),
        createdBy: superadmin._id,
      },
      {
        donorName: 'Ibu Siti Aminah',
        amount: 2000000,
        category: 'infaq',
        note: 'Infaq bulanan',
        date: new Date(now.getFullYear(), now.getMonth(), 7),
        createdBy: superadmin._id,
      },
      {
        donorName: 'Bapak Usman',
        amount: 10000000,
        category: 'wakaf',
        note: 'Wakaf tanah parkir',
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        createdBy: superadmin._id,
      },
      {
        donorName: 'Keluarga Bapak Ridwan',
        amount: 3000000,
        category: 'yatim',
        note: 'Santunan anak yatim',
        date: new Date(now.getFullYear(), now.getMonth(), 14),
        createdBy: superadmin._id,
      },
      {
        donorName: 'Ibu Khadijah',
        amount: 1500000,
        category: 'sedekah',
        note: 'Sedekah Jumat',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        createdBy: superadmin._id,
      },
      {
        donorName: 'Hamba Allah',
        amount: 500000,
        category: 'infaq',
        note: 'Infaq anonim',
        date: new Date(now.getFullYear(), now.getMonth(), 18),
        createdBy: superadmin._id,
      },
    ]);
    console.log(`${donations.length} donations seeded`);

    // Summary
    console.log('\n========================================');
    console.log('  Seed Data Complete!');
    console.log('========================================');
    console.log(`  Users:         ${users.length}`);
    console.log(`  Announcements: ${announcements.length}`);
    console.log(`  Events:        ${events.length}`);
    console.log(`  Finances:      ${finances.length}`);
    console.log(`  Donations:     ${donations.length}`);
    console.log('========================================');
    console.log('\n  Login credentials:');
    console.log('  Superadmin: admin@masjid.com / password123');
    console.log('  Admin:      admin2@masjid.com / password123');
    console.log('========================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
