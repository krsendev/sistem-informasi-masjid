// User Roles
const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
};

// Announcement
const ANNOUNCEMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

const ANNOUNCEMENT_CATEGORIES = [
  'pengumuman',
  'kegiatan',
  'kajian',
  'ramadhan',
  'infaq',
  'zakat',
  'qurban',
  'lainnya',
];

// Finance
const FINANCE_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

const FINANCE_CATEGORIES = [
  'infaq',
  'zakat',
  'sedekah',
  'donasi',
  'operasional',
  'pembangunan',
  'perawatan',
  'gaji',
  'listrik',
  'air',
  'kebersihan',
  'kegiatan',
  'lainnya',
];

// Donation
const DONATION_CATEGORIES = [
  'infaq',
  'zakat',
  'sedekah',
  'wakaf',
  'pembangunan',
  'yatim',
  'qurban',
  'lainnya',
];

// Event
const EVENT_CATEGORIES = [
  'kajian',
  'sholat',
  'pengajian',
  'ramadhan',
  'musyawarah',
  'sosial',
  'pendidikan',
  'lainnya',
];

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER: 500,
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

module.exports = {
  ROLES,
  ANNOUNCEMENT_STATUS,
  ANNOUNCEMENT_CATEGORIES,
  FINANCE_TYPE,
  FINANCE_CATEGORIES,
  DONATION_CATEGORIES,
  EVENT_CATEGORIES,
  HTTP_STATUS,
  PAGINATION,
};
