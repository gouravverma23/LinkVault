# 🔗 LinkVault — Smart Bookmark Manager

A modern, full-stack Bookmark Manager application built with React, Node.js, Express, and MongoDB.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?logo=tailwindcss)

## ✨ Features

### Authentication
- User registration & login with JWT
- Password hashing with bcrypt
- Protected routes
- Persistent sessions via localStorage

### Bookmark Management
- Save bookmarks with URL, title, description, category, tags
- Edit & delete bookmarks
- Mark/unmark favorites
- Auto link preview (title, description, favicon, OG image)
- Click tracking & analytics

### Organization
- **Categories** — Organize by type
- **Tags** — Multi-tag support with chip input
- **Collections** — Group bookmarks into named collections with colors
- **Search** — Full-text search across all fields
- **Filter** — By category, tag, collection
- **Sort** — Newest, oldest, A-Z, Z-A, most visited

### Analytics Dashboard
- Total bookmarks, favorites, categories count
- Most visited bookmarks
- Recent bookmarks
- Click count per bookmark

### Import & Export
- Export as JSON or CSV
- Import from JSON file

### UI/UX
- Dark/Light mode with system preference detection
- Glassmorphism design
- Framer Motion animations
- Responsive mobile-first design
- Toast notifications

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3, React Router v6, Axios, Framer Motion, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| State | React Context API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd bookmarkManager
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Configure environment variables

**Backend** — Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bookmarkManager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

**Frontend** — `frontend/.env` is pre-configured for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the application
```bash
# Run both servers concurrently
npm run dev

# Or separately:
npm run server   # Backend on port 5000
npm run client   # Frontend on port 5173
```

---

## 📁 Project Structure

```
bookmarkManager/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── bookmarkController.js  # Bookmark CRUD
│   │   └── collectionController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT middleware
│   │   └── errorHandler.js    # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Bookmark.js
│   │   └── Collection.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookmarkRoutes.js
│   │   ├── collectionRoutes.js
│   │   └── previewRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── linkPreview.js     # URL metadata scraper
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth, Bookmark, Theme contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── layouts/           # MainLayout, AuthLayout
│   │   ├── pages/             # All page components
│   │   ├── services/          # API service layers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── .env
└── package.json               # Root (concurrently)
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### Bookmarks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks` | List bookmarks (paginated, filtered) |
| POST | `/api/bookmarks` | Create bookmark |
| GET | `/api/bookmarks/:id` | Get single bookmark |
| PUT | `/api/bookmarks/:id` | Update bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |
| PUT | `/api/bookmarks/:id/favorite` | Toggle favorite |
| PUT | `/api/bookmarks/:id/click` | Track click |
| GET | `/api/bookmarks/search?q=` | Search bookmarks |
| GET | `/api/bookmarks/favorites` | Get favorites |
| GET | `/api/bookmarks/stats` | Dashboard stats |
| GET | `/api/bookmarks/export?format=json` | Export bookmarks |
| POST | `/api/bookmarks/import` | Import bookmarks |

### Collections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections` | List collections |
| POST | `/api/collections` | Create collection |
| PUT | `/api/collections/:id` | Update collection |
| DELETE | `/api/collections/:id` | Delete collection |

### Link Preview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/preview` | Fetch URL metadata |

---

## 🚢 Deployment

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`

### Frontend — Vercel

1. Import project on [Vercel](https://vercel.com)
2. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 📄 License

MIT License — feel free to use this for your projects.
