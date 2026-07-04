# SIMM Backend — Sistem Informasi Manajemen Masjid

REST API untuk Sistem Informasi Manajemen Masjid (SIMM) yang dibangun dengan Node.js, Express.js, MongoDB, dan JWT Authentication menggunakan arsitektur Clean Architecture.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer

## Arsitektur

```
backend/
├── src/
│   ├── config/          # Konfigurasi app & swagger
│   ├── constants/       # Konstanta (roles, categories, status)
│   ├── controllers/     # Request handler (thin layer)
│   ├── database/        # Connection & seed data
│   ├── docs/            # Swagger schema definitions
│   ├── middleware/       # Auth, validation, error handler, upload
│   ├── models/          # Mongoose schemas
│   ├── repositories/    # Data access layer
│   ├── routes/          # Express routes + Swagger annotations
│   ├── services/        # Business logic layer
│   ├── utils/           # Helpers (jwt, pagination, response, slug)
│   ├── validations/     # express-validator rules
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── uploads/             # File upload directory
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Template environment variables
├── .gitignore
├── package.json
└── README.md
```

## Instalasi

### Prerequisites

- Node.js >= 18
- MongoDB (local atau Atlas)

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd sistem-informasi-masjid/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment**
   ```bash
   cp .env.example .env
   ```
   Edit file `.env` dan sesuaikan:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/simm_db
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Jalankan seed data**
   ```bash
   npm run seed
   ```

5. **Jalankan server (development)**
   ```bash
   npm run dev
   ```

6. **Jalankan server (production)**
   ```bash
   npm start
   ```

## API Documentation

Setelah server berjalan, buka Swagger UI di:
```
http://localhost:5000/api-docs
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update current user profile |
| PUT | `/api/auth/change-password` | Change password |

### Users (Superadmin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Announcements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/announcements` | Get all announcements |
| GET | `/api/announcements/:id` | Get announcement by ID |
| POST | `/api/announcements` | Create announcement |
| PUT | `/api/announcements/:id` | Update announcement |
| DELETE | `/api/announcements/:id` | Delete announcement |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

### Finances
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finances` | Get all finance records |
| GET | `/api/finances/summary` | Get finance summary |
| GET | `/api/finances/monthly` | Get monthly report |
| GET | `/api/finances/yearly` | Get yearly report |
| GET | `/api/finances/:id` | Get finance record by ID |
| POST | `/api/finances` | Create finance record |
| PUT | `/api/finances/:id` | Update finance record |
| DELETE | `/api/finances/:id` | Delete finance record |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donations` | Get all donations |
| GET | `/api/donations/summary` | Get donation summary |
| GET | `/api/donations/recent` | Get recent donations |
| GET | `/api/donations/:id` | Get donation by ID |
| POST | `/api/donations` | Create donation |
| PUT | `/api/donations/:id` | Update donation |
| DELETE | `/api/donations/:id` | Delete donation |

## Query Parameters

### Pagination
Semua endpoint list mendukung pagination:
- `page` (default: 1)
- `limit` (default: 10, max: 100)

### Announcements
- `search` — Cari berdasarkan judul/konten
- `status` — Filter: `draft` / `published`
- `category` — Filter kategori
- `sortBy` — Sort: `createdAt` / `title` / `publishedAt`

### Events
- `search` — Cari berdasarkan judul
- `category` — Filter kategori
- `startDate` / `endDate` — Filter rentang tanggal
- `upcoming=true` — Hanya event mendatang
- `past=true` — Hanya event yang sudah lewat

### Finances
- `type` — Filter: `income` / `expense`
- `category` — Filter kategori
- `startDate` / `endDate` — Filter rentang tanggal
- `search` — Cari berdasarkan deskripsi

### Donations
- `search` — Cari berdasarkan nama donatur
- `category` — Filter kategori
- `startDate` / `endDate` — Filter rentang tanggal

## Seed Data

Login credentials setelah seed:

| Role | Email | Password |
|------|-------|----------|
| Superadmin | admin@masjid.com | password123 |
| Admin | admin2@masjid.com | password123 |

## Keamanan

- ✅ Password hashing (bcrypt, 12 salt rounds)
- ✅ JWT access & refresh tokens
- ✅ httpOnly cookie untuk refresh token
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Rate limiting (global + auth)
- ✅ Input validation (express-validator)
- ✅ Environment variables (no hardcoded secrets)
- ✅ Role-based authorization

## Response Format

### Success
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

### Success (Paginated)
```json
{
  "success": true,
  "message": "Daftar berhasil diambil",
  "data": [],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Email wajib diisi"
    }
  ]
}
```

## License

ISC
