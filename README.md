# 🛕 PujaConnect – Online Pandit & Puja Booking Platform

<div align="center">

![PujaConnect Banner](https://img.shields.io/badge/PujaConnect-Online%20Puja%20Booking-orange?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6Ii8+PC9zdmc+)

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%204.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-pujaconnect.onrender.com-FF6B35?style=for-the-badge)](https://pujaconnect.onrender.com/)

**A service-based digital platform to discover, compare, and book verified Pandits for religious ceremonies.**

🌐 **[Live Demo → https://pujaconnect.onrender.com/](https://pujaconnect.onrender.com/)**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Routes](#-api-routes) • [Folder Structure](#-folder-structure) • [Author](#-author)

</div>

---

## 📖 Overview

**PujaConnect** bridges the gap between devotees and trusted Pandits by providing a modern, transparent, and easy-to-use booking platform. Whether it's a **Satyanarayan Katha**, **Griha Pravesh**, **Naamkaran**, **Havan**, **Mundan**, or any other sacred ritual — users can find verified Pandits, view their profiles, and book services from the comfort of their home.

> 🙏 Services available for **Home-based Pujas** and **Temple-based Ceremonies**

---

## ❗ Problem Statement

Traditional Pandit booking relies heavily on:
- Personal references and local contacts
- Phone calls or physical temple visits
- No standardized pricing or availability info

This causes:
- Difficulty finding trusted, verified Pandits
- Unclear puja requirements, duration, or costs
- Last-minute cancellations and scheduling conflicts
- Limited options for comparing services

**PujaConnect** solves all of this by digitizing the entire discovery and booking process.

---

## ✨ Features

### 👤 User Features
- 🔐 User Registration & Login (JWT-based auth)
- 🔍 Browse & Search Pandits by:
  - Location
  - Puja type
  - Experience
  - Language spoken
- 📋 View detailed Pandit profiles:
  - Photo & bio
  - Supported rituals with pricing
  - Availability calendar
  - Ratings & reviews *(planned)*
- 📅 Book puja services — select ritual, date, time & location
- 📜 View booking history & track booking status
- ✅ Receive booking confirmations

### 🕉️ Pandit Features
- 📝 Pandit registration & profile creation
- ➕ Add supported rituals with custom pricing
- 📆 Set & manage availability calendar
- ✔️ Accept or reject incoming booking requests
- 📂 Manage upcoming bookings dashboard
- ✏️ Update service and profile details

### 🛡️ Admin Features
- ✅ Verify and approve Pandit profiles
- 📂 Manage puja categories and ritual catalog
- 📊 Monitor all bookings and resolve disputes
- 👥 Manage users and service providers
- 🚩 Handle reports and user feedback

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router DOM 7 |
| **Backend** | Node.js, Express.js 4 |
| **Database** | MongoDB (via Mongoose 8) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Icons** | Lucide React |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend) |

---

## 📁 Folder Structure

```
PujaConnect/
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static assets
│   └── src/
│       ├── assets/             # Images and media
│       ├── components/         # Reusable UI components
│       │   ├── Header.jsx
│       │   ├── PanditCard.jsx
│       │   ├── BookingCard.jsx
│       │   └── BookingModal.jsx
│       ├── context/            # React Context (Auth, Global state)
│       ├── pages/              # Application pages
│       │   ├── Home.jsx
│       │   ├── Search.jsx
│       │   ├── Auth.jsx
│       │   ├── Profile.jsx
│       │   └── Dashboard.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # DB connection & configuration
│   ├── controllers/            # Route handler logic
│   ├── middleware/             # Auth middleware, error handlers
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Pandit.js
│   │   ├── Ritual.js
│   │   └── Booking.js
│   ├── routes/                 # Express API routes
│   │   ├── authRoutes.js
│   │   ├── panditRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── ritualRoutes.js
│   │   └── adminRoutes.js
│   ├── seed.js                 # Database seeder script
│   ├── server.js               # App entry point
│   └── .env.example            # Environment variable template
│
├── PujaConnect.md              # Product Requirements Document
├── PROJECT_REPORT.md           # Detailed project report
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://mongodb.com/) (local or Atlas cloud)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Dileep-kumawat/PujaConnect.git
cd PujaConnect
```

### 2. Setup the Backend (Server)

```bash
cd server
npm install
```

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pujaconnect?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

Seed the database with sample data:

```bash
npm run seed
```

Start the server:

```bash
npm run dev       # Development (with auto-reload)
# or
npm start         # Production
```

> The server runs on `http://localhost:5000`

---

### 3. Setup the Frontend (Client)

```bash
cd ../client
npm install
npm run dev
```

> The client runs on `http://localhost:5173`

---

## 🔗 API Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login & get token | Public |
| `GET` | `/api/pandits` | List all pandits | Public |
| `GET` | `/api/pandits/:id` | Get pandit profile | Public |
| `POST` | `/api/pandits` | Create pandit profile | Pandit |
| `GET` | `/api/rituals` | Get all rituals | Public |
| `POST` | `/api/bookings` | Create a booking | User |
| `GET` | `/api/bookings` | Get user bookings | User |
| `PUT` | `/api/bookings/:id` | Accept/Reject booking | Pandit |
| `GET` | `/api/admin/users` | Manage all users | Admin |
| `PUT` | `/api/admin/pandits/:id` | Verify pandit | Admin |

---

## 🔄 User Flow

```
1. User visits PujaConnect
      ↓
2. Searches Pandit by ritual / location
      ↓
3. Views Pandit profile & ritual details
      ↓
4. Selects puja type, date & time
      ↓
5. Sends booking request
      ↓
6. Pandit accepts or rejects request
      ↓
7. User receives booking confirmation ✅
```

---

## 🗂️ Database Models

| Model | Key Fields |
|-------|-----------|
| **User** | name, email, password, role, phone, address |
| **Pandit** | name, bio, location, experience, languages, rituals, availability, verified |
| **Ritual** | name, description, duration, requiredMaterials, priceRange, locationType |
| **Booking** | user, pandit, ritual, date, time, location, status |

---

## 📊 Key Performance Indicators

- 📈 Number of registered users
- 🕉️ Number of verified Pandits
- ✅ Booking completion rate
- ❌ Cancellation rate
- ⏱️ Average booking completion time

---

## 🔮 Future Enhancements

- [ ] 💳 Online payments & donations integration
- [ ] 🌐 Multi-language support (Hindi, Gujarati, Tamil, etc.)
- [ ] 🔔 Puja reminder push notifications
- [ ] 📺 Live puja streaming
- [ ] 🔭 Astrology & horoscope services
- [ ] 📱 Native mobile applications (iOS & Android)
- [ ] ⭐ Ratings & reviews system
- [ ] 📍 GPS-based Pandit location tracking

---

## ⚙️ Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Page load < 3 seconds, smooth booking flow |
| **Security** | JWT auth, bcrypt password hashing, role-based access |
| **Usability** | Simple, respectful & easy-to-navigate interface |
| **Scalability** | Multi-city and multi-region support |
| **Reliability** | Prevent double bookings & scheduling conflicts |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🧑‍💻 Author

👤 **Dileep Kumawat**

- 📧 [dileepkumawat525@gmail.com](mailto:dileepkumawat525@gmail.com)
- 🔗 [LinkedIn](https://www.linkedin.com/in/dileep-kumawat/)
- 🌐 [Portfolio](https://dileep3.netlify.app)

---

<div align="center">

Made with ❤️ and 🙏 by **Dileep Kumawat**

*Connecting devotion with trusted service — digitally.*

⭐ **Star this repo if you found it useful!**

</div>
