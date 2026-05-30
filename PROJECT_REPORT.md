# PujaConnect — Detailed Project Report

> **Online Pandit & Puja Booking Platform**
> Report Date: May 30, 2026 | Version: 1.0.0

| | |
|---|---|
| 🌐 **Live App** | [https://pujaconnect.onrender.com](https://pujaconnect.onrender.com) |
| 🐙 **GitHub Repository** | [github.com/Dileep-kumawat/PujaConnect](https://github.com/Dileep-kumawat/PujaConnect.git) |
| ☁️ **Hosting Platform** | Render (Full-stack) |
| 📅 **Deployed On** | May 2026 |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Scope](#4-scope)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Project Directory Structure](#7-project-directory-structure)
8. [Database Design — Data Models](#8-database-design--data-models)
9. [Backend API Reference](#9-backend-api-reference)
10. [Frontend Application](#10-frontend-application)
11. [Authentication & Security](#11-authentication--security)
12. [User Roles & Permissions](#12-user-roles--permissions)
13. [Key Features & Functional Modules](#13-key-features--functional-modules)
14. [User Flow](#14-user-flow)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Key Performance Indicators (KPIs)](#16-key-performance-indicators-kpis)
17. [Deployment](#17-deployment)
18. [Assumptions & Constraints](#18-assumptions--constraints)
19. [Future Enhancements](#19-future-enhancements)
20. [Deliverables Summary](#20-deliverables-summary)
21. [Expected Impact](#21-expected-impact)  

---

## 1. Project Overview

**PujaConnect** is a full-stack, service-based digital platform designed to bridge the gap between devotees seeking religious services and verified Pandits (Hindu priests) who perform them. The platform enables users to discover, compare, and book certified Pandits for a wide range of Vedic ceremonies — from Satyanarayan Katha, Naamkaran, and Griha Pravesh to Havan, Mundan, and other sacred rituals.

Services can be arranged for both **home-based pujas** and **temple-based ceremonies**, giving users complete flexibility in choosing the format of their religious observances.

The platform is built with a modern **MERN stack** (MongoDB, Express.js, React.js, Node.js), features a clean role-based access control system with three roles — **Customer**, **Pandit**, and **Admin** — and is designed to be scalable across cities and regions.

---

## 2. Problem Statement

The traditional process of hiring a Pandit for a religious ceremony is heavily informal and fragmented:

| Pain Point | Description |
|---|---|
| **Discovery** | Users rely on personal references, local contacts, or temple visits |
| **Pricing Opacity** | No standardized or transparent pricing for rituals |
| **Availability** | No real-time availability checking; scheduling is done via phone calls |
| **Trust & Verification** | No formal mechanism to verify the credentials or experience of a Pandit |
| **Booking Management** | No structured confirmation, status tracking, or cancellation process |
| **Comparison** | Users cannot compare multiple Pandits' profiles, rituals, or rates |

These challenges result in a frustrating, unreliable, and often last-minute experience for devotees seeking spiritual services.

---

## 3. Objectives

### Primary Objectives

- Digitize the Pandit discovery and puja booking process end-to-end
- Provide a verified and trusted roster of religious service providers
- Enable fully transparent pricing and detailed ritual information
- Simplify booking, scheduling, and booking management for all stakeholders

### Secondary Objectives

- Support multiple rituals and regional/cultural traditions
- Empower Pandits to manage their bookings and availability digitally
- Provide scalability infrastructure to expand across cities and regions
- Improve accessibility to quality religious services for all users

---

## 4. Scope

### In-Scope (Phase 1)

- Web-based platform (desktop & mobile responsive)
- Pandit profile listing, browsing, filtering, and admin verification
- Puja and ritual catalog management
- Booking and scheduling management with status lifecycle
- Admin moderation panel with real-time metrics

### Out of Scope

- Native iOS / Android mobile applications
- Online puja live streaming
- Advanced astrology or horoscope services
- Multi-language voice support
- Online payment gateway integration (planned for Phase 2)

---

## 5. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React.js | ^19.2.6 | UI Component Framework |
| React Router DOM | ^7.16.0 | Client-side Routing (SPA) |
| Tailwind CSS | ^4.3.0 | Utility-first Styling |
| Lucide React | ^1.17.0 | Icon Library |
| Vite | ^8.0.12 | Build Tool & Dev Server |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | JavaScript Runtime |
| Express.js | ^4.21.2 | REST API Framework |
| Mongoose | ^8.11.0 | MongoDB ODM |
| JSON Web Token | ^9.0.2 | Stateless Authentication |
| bcryptjs | ^2.4.3 | Password Hashing |
| dotenv | ^16.4.5 | Environment Variable Management |
| cors | ^2.8.5 | Cross-Origin Resource Sharing |

### Database

| Technology | Purpose |
|---|---|
| MongoDB | NoSQL Document Database |

### Deployment

| Platform | Purpose |
|---|---|
| Render | Frontend & Full-stack Hosting |

---

## 6. System Architecture

PujaConnect follows a classic **Client–Server (RESTful API)** architecture with a clear separation of concerns between the frontend SPA and the backend API.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│   React SPA  ──►  React Router  ──►  Pages & Components        │
│       │                                    │                    │
│   AuthContext (JWT stored in localStorage)                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP / REST API calls
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js + Express)                    │
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌─────────────┐  │
│   │  /auth   │  │/pandits  │  │ /bookings │  │   /admin    │  │
│   └──────────┘  └──────────┘  └───────────┘  └─────────────┘  │
│         │              │             │                │         │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │              Middleware: JWT Auth + Role Guard           │  │
│   └─────────────────────────────────────────────────────────┘  │
│         │                                                       │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                  Controllers (Business Logic)            │  │
│   └─────────────────────────────────────────────────────────┘  │
│         │                                                       │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │             Mongoose ODM ──► MongoDB Atlas               │  │
│   └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

The server also serves the compiled React production build as static files, enabling a unified deployment on a single server/host.

---

## 7. Project Directory Structure

```
PujaConnect/
├── PujaConnect.md              # Product Requirements Document (PRD)
├── PROJECT_REPORT.md           # This Report
├── .gitignore
│
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── eslint.config.js
│   └── src/
│       ├── main.jsx            # App Entry Point
│       ├── App.jsx             # Router + Layout + Protected Routes
│       ├── App.css
│       ├── index.css           # Global Styles & Tailwind Directives
│       ├── assets/             # Static Assets
│       ├── context/
│       │   └── AuthContext.jsx # Global Auth State Management (Context API)
│       ├── components/
│       │   ├── Header.jsx      # Navigation Bar
│       │   ├── PanditCard.jsx  # Pandit Listing Card
│       │   ├── BookingCard.jsx # Booking Status Card
│       │   └── BookingModal.jsx# Booking Request Modal
│       └── pages/
│           ├── Home.jsx        # Landing Page
│           ├── Search.jsx      # Pandit Discovery & Filtering
│           ├── Profile.jsx     # Pandit Profile Detail Page
│           ├── Auth.jsx        # Login / Register Page
│           └── Dashboard.jsx   # Role-based User Dashboard
│
└── server/                     # Node.js + Express Backend
    ├── server.js               # App Entry Point & Middleware Setup
    ├── seed.js                 # Database Seeder Script
    ├── .env                    # Environment Variables (private)
    ├── .env.example            # Environment Variables Template
    ├── package.json
    ├── config/
    │   └── db.js               # MongoDB Connection
    ├── middleware/
    │   └── auth.js             # JWT Protect & Role-Based Authorize
    ├── models/
    │   ├── User.js             # User Schema
    │   ├── Pandit.js           # Pandit Profile Schema
    │   ├── Booking.js          # Booking Schema
    │   └── Ritual.js           # Ritual/Puja Schema
    ├── controllers/
    │   ├── authController.js   # Register, Login, GetMe
    │   ├── panditController.js # List, Get, Update Pandit Profile
    │   ├── bookingController.js# Create, Fetch, Update Booking Status
    │   ├── adminController.js  # Verify Pandit, Create Ritual, Get Stats
    │   └── ritualController.js # Get All Rituals
    └── routes/
        ├── authRoutes.js
        ├── panditRoutes.js
        ├── bookingRoutes.js
        ├── adminRoutes.js
        └── ritualRoutes.js
```

---

## 8. Database Design — Data Models

PujaConnect uses **MongoDB** with **Mongoose ODM**. There are four core collections.

---

### 8.1 User Model (`users` collection)

Stores authentication details and role information for all platform participants.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `name` | String | required, trimmed | Full name |
| `email` | String | required, unique, lowercase | Validated with regex |
| `password` | String | required, min 6 chars, `select: false` | bcrypt hashed |
| `role` | String | enum: `customer`, `pandit`, `admin` | Default: `customer` |
| `phone` | String | required | Contact number |
| `createdAt` | Date | auto | Timestamp |

**Pre-save hook:** Password is automatically hashed using `bcrypt` (salt rounds: 10) before saving.
**Instance method:** `matchPassword()` — compares a plain-text password against the stored hash.

---

### 8.2 Pandit Model (`pandits` collection)

Extended profile for users with the `pandit` role, automatically created in draft state upon Pandit registration.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `user` | ObjectId → User | required, unique | One-to-one with User |
| `bio` | String | required | Spiritual biography |
| `languages` | [String] | required | Languages spoken |
| `location` | String | required | Operational city |
| `experience` | Number | required | Years of experience |
| `rituals` | [{ritual: ObjectId, price: Number}] | — | Rituals performed + custom price |
| `availabilitySlots` | [{day: String, slots: [String]}] | enum days | Weekly time slot schedule |
| `isVerified` | String | enum: `pending`, `verified`, `rejected` | Default: `pending` |
| `rating` | Number | min: 0, max: 5 | Default: 4.5 |
| `profilePic` | String | — | Image URL |
| `createdAt` | Date | auto | Timestamp |

---

### 8.3 Ritual Model (`rituals` collection)

The canonical catalog of Vedic rituals managed by admins.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `name` | String | required, unique | Ritual name (e.g., "Satyanarayan Katha") |
| `description` | String | required | Ritual description |
| `duration` | String | required | e.g., "2 hours" |
| `requiredMaterials` | [String] | default: [] | List of samagri items |
| `basePriceRange` | {min: Number, max: Number} | required | Suggested price range |
| `locationType` | String | enum: `Home`, `Temple`, `Both` | Default: `Both` |
| `image` | String | — | Image URL |
| `createdAt` | Date | auto | Timestamp |

---

### 8.4 Booking Model (`bookings` collection)

The transactional core of the platform — records every booking request and its lifecycle.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `customer` | ObjectId → User | required | The devotee making the booking |
| `pandit` | ObjectId → Pandit | required | The assigned Pandit |
| `ritual` | ObjectId → Ritual | required | The requested ritual |
| `date` | Date | required | Date of the ceremony |
| `timeSlot` | String | required | e.g., "09:00 AM - 12:00 PM" |
| `address` | {street, city, postalCode} | all required | Ceremony location |
| `price` | Number | required | Pulled from Pandit's ritual price |
| `status` | String | enum: `pending`, `accepted`, `rejected`, `completed`, `cancelled` | Default: `pending` |
| `notes` | String | — | Special instructions |
| `createdAt` | Date | auto | Timestamp |

---

### Entity Relationship Overview

```
User (1) ──────────── (1) Pandit
 │                          │
 │ (customer)               │ (performs)
 │                          │
 └─── Booking (many) ───────┘
         │
         └──── Ritual (1)
```

---

## 9. Backend API Reference

Base URL: `/api`

### 9.1 Auth Endpoints (`/api/auth`)

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new user (Customer or Pandit) |
| `POST` | `/login` | Public | Login and receive JWT token |
| `GET` | `/me` | Private | Get current authenticated user profile |

**Registration Auto-Action:** When a user registers with `role: pandit`, a draft Pandit profile is automatically created with default values and a `pending` verification status.

---

### 9.2 Pandit Endpoints (`/api/pandits`)

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all verified Pandits (with filtering) |
| `GET` | `/:id` | Public | Get a single Pandit's full profile |
| `PUT` | `/profile` | Private (Pandit only) | Update own Pandit profile |

---

### 9.3 Booking Endpoints (`/api/bookings`)

All routes are protected (JWT required).

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/` | Private (Customer) | Create a new booking request |
| `GET` | `/` | Private | Get bookings (role-filtered) |
| `PUT` | `/:id/status` | Private | Update booking status |

**Role-based Booking Status Logic:**

| Role | Allowed Status Transitions |
|---|---|
| Customer | `cancelled` (own bookings only) |
| Pandit | `accepted`, `rejected`, `completed` (own bookings only) |
| Admin | Any status transition |

**Business Logic — Create Booking:**
1. Validates all required fields
2. Confirms Pandit exists and is `verified`
3. Confirms Pandit offers the selected ritual
4. Extracts the Pandit's custom price for the ritual
5. Creates booking with `pending` status

---

### 9.4 Admin Endpoints (`/api/admin`)

All routes require `admin` role.

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/stats` | Admin | Platform metrics and breakdown |
| `PUT` | `/pandits/:id/verify` | Admin | Approve or reject a Pandit profile |
| `POST` | `/rituals` | Admin | Create a new ritual category |

**Admin Stats Response includes:**
- Total users, pandits, rituals, bookings
- Booking breakdown: pending, accepted, completed, cancelled
- Pandit breakdown: verified, pending, rejected
- Booking **completion rate** (percentage)
- List of all **pending pandits** awaiting verification

---

### 9.5 Ritual Endpoints (`/api/rituals`)

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all available rituals |

---

## 10. Frontend Application

The React SPA is structured around **5 pages** and **4 reusable components**, built with React 19 and React Router v7.

### 10.1 Pages

| Page | Route | Access | Description |
|---|---|---|---|
| `Home.jsx` | `/` | Public | Landing page — platform introduction & featured content |
| `Search.jsx` | `/search` | Public | Browse & filter Pandits by ritual, location, experience, language |
| `Profile.jsx` | `/profile/:id` | Public | Full Pandit profile view with booking initiation |
| `Auth.jsx` | `/auth` | Public | Unified Login / Register form (role selection) |
| `Dashboard.jsx` | `/dashboard` | **Protected** | Role-based dashboard for Customers, Pandits, and Admins |

### 10.2 Components

| Component | Description |
|---|---|
| `Header.jsx` | Responsive navigation bar with authentication-aware links |
| `PanditCard.jsx` | Summary card for a Pandit shown in search results |
| `BookingCard.jsx` | Displays a booking's details and current status |
| `BookingModal.jsx` | Modal form to initiate a new puja booking |

### 10.3 Context / State Management

| File | Purpose |
|---|---|
| `AuthContext.jsx` | Global React Context providing `user`, `token`, `login()`, `logout()`, and `loading` state across the entire app |

The JWT token is stored in `localStorage` and attached as a `Bearer` token in all protected API calls.

### 10.4 Routing & Route Protection

```
/                   → Home (Public)
/search             → Search (Public)
/profile/:id        → Pandit Profile (Public)
/auth               → Login / Register (Public)
/dashboard          → Dashboard (Protected — requires valid JWT)
*                   → Redirects to /
```

A `ProtectedRoute` HOC checks the authentication state from `AuthContext`. Unauthenticated users attempting to access `/dashboard` are redirected to `/auth`.

---

## 11. Authentication & Security

| Mechanism | Implementation |
|---|---|
| **Password Hashing** | `bcryptjs` with salt rounds of 10 (pre-save Mongoose hook) |
| **Token Generation** | JWT signed with `JWT_SECRET` env variable; expires in **30 days** |
| **Token Validation** | `protect` middleware verifies JWT on every protected route |
| **Role Enforcement** | `authorize(...roles)` middleware restricts routes to specific roles |
| **Error Handling** | Global Express error handler with structured JSON error responses |
| **API 404 Handling** | Wildcard route catches all undefined `/api/*` calls |
| **SPA Fallback** | All non-API requests serve the React `index.html` for client-side routing |

---

## 12. User Roles & Permissions

The platform implements a three-tier **Role-Based Access Control (RBAC)** model:

### Customer
- Register and log in as a Customer
- Browse all verified Pandits
- View Pandit profiles and available rituals
- Create booking requests
- View their own booking history and status
- Cancel their own pending or accepted bookings

### Pandit
- Register and log in as a Pandit (auto-creates a draft profile)
- View and update their own Pandit profile (bio, rituals, pricing, availability)
- View incoming booking requests
- Accept, reject, or mark bookings as completed
- Cannot be booked until an Admin verifies their profile

### Admin
- Access the admin dashboard with platform-wide metrics
- Approve or reject Pandit profile verification requests
- Create and manage the ritual catalog
- View all bookings across all users
- Perform any status transition on any booking

---

## 13. Key Features & Functional Modules

### Module 1: Pandit Discovery & Search
- Browse all verified Pandits
- Filter by: location, puja type, experience, language
- View Pandit cards with summary details (experience, rating, location)

### Module 2: Pandit Profile Pages
- Full profile with: photo, bio, languages, years of experience
- List of performed rituals with Pandit-specific pricing
- Weekly availability schedule (day and time slots)
- Booking initiation directly from the profile

### Module 3: Booking Management
- Create puja booking requests (ritual, date, time slot, address)
- Price auto-populated from Pandit's ritual configuration
- Full booking lifecycle: `pending → accepted/rejected → completed/cancelled`
- Role-filtered booking history views

### Module 4: Pandit Dashboard
- View own booking requests
- Accept, reject, or mark ceremonies as completed
- Update profile details, rituals, pricing, and availability

### Module 5: Customer Dashboard
- View all personal bookings with current status badges
- Cancel active (pending or accepted) bookings
- Track ceremony history

### Module 6: Admin Dashboard
- Real-time platform stats (users, pandits, rituals, bookings)
- Booking completion rate metric
- Pandit verification queue — approve or reject pending profiles
- Create new ritual categories with full details

### Module 7: Authentication
- Unified Login / Register page with role selection (Customer or Pandit)
- JWT-based stateless authentication with 30-day token validity
- Auto-creation of Pandit draft profile on Pandit registration
- Session persistence via `localStorage`

---

## 14. User Flow

### Customer Flow

```
Visit Platform
     │
     ▼
Browse / Search Pandits ──► Filter by ritual, city, language
     │
     ▼
View Pandit Profile ──► See rituals, pricing, availability
     │
     ▼
Login / Register (if not authenticated)
     │
     ▼
Open Booking Modal ──► Select ritual, date, time slot, address
     │
     ▼
Submit Booking Request (status: pending)
     │
     ▼
Track booking status in Dashboard
     │
     ├── Accepted → Ceremony proceeds
     ├── Rejected → Find another Pandit
     └── Completed → Service delivered
```

### Pandit Flow

```
Register as Pandit (draft profile auto-created, status: pending)
     │
     ▼
Admin reviews & verifies profile
     │
     ▼
Profile goes live on platform (status: verified)
     │
     ▼
Receive incoming booking requests in Dashboard
     │
     ▼
Accept / Reject bookings
     │
     ▼
Mark completed bookings as "Completed"
```

### Admin Flow

```
Login as Admin
     │
     ▼
View Dashboard Stats (users, pandits, rituals, bookings, completion rate)
     │
     ├── Pandit Verification Queue → Approve or Reject profiles
     ├── Create Ritual Categories → Add new puja types
     └── Monitor all platform bookings
```

---

## 15. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Page load time < 3 seconds; smooth booking flow |
| **Security** | Secure JWT auth; Role-based access control; Password hashing |
| **Usability** | Simple, respectful, and easy-to-navigate interface |
| **Scalability** | Multi-city and multi-region support via location filtering |
| **Reliability** | Booking status validation prevents conflicting state transitions |
| **Maintainability** | MVC architecture; separation of concerns between client and server |
| **Responsiveness** | Mobile-responsive UI using Tailwind CSS utility classes |

---

## 16. Key Performance Indicators (KPIs)

| KPI | Description |
|---|---|
| **Registered Users** | Total number of customer accounts created |
| **Verified Pandits** | Number of Pandit profiles approved by Admin |
| **Total Bookings** | All booking requests across the platform |
| **Booking Completion Rate** | `(Completed / Total) × 100%` — tracked in Admin stats endpoint |
| **Cancellation Rate** | `(Cancelled / Total) × 100%` |
| **Pending Verification Queue** | Number of Pandits awaiting Admin approval |
| **Ritual Catalog Size** | Number of active ritual categories |

---


---

## 17. Deployment

PujaConnect is deployed as a **full-stack application on Render**, using a unified deployment strategy where the Express.js server serves both the REST API and the compiled React frontend as static files.

### Live Links

| Resource | URL |
|---|---|
| 🌐 **Live Application** | [https://pujaconnect.onrender.com](https://pujaconnect.onrender.com) |
| 🐙 **GitHub Repository** | [github.com/Dileep-kumawat/PujaConnect](https://github.com/Dileep-kumawat/PujaConnect.git) |

### Deployment Architecture

```
 GitHub (Source Code)
       │
       │  Auto-Deploy on push to main
       ▼
  Render.com
  ┌───────────────────────────────────────────┐
  │  Web Service (Node.js + Express)          │
  │                                           │
  │  ├── /api/*  →  REST API Routes           │
  │  └── /*      →  React SPA (static build)  │
  │                                           │
  │  Environment Variables (managed on Render)│
  │  ├── MONGO_URI  (MongoDB Atlas)           │
  │  ├── JWT_SECRET                           │
  │  └── PORT                                │
  └───────────────────────────────────────────┘
             │
             ▼
     MongoDB Atlas (Cloud Database)
```

### Deployment Strategy

| Aspect | Detail |
|---|---|
| **Platform** | [Render](https://render.com) — Free Tier Web Service |
| **Runtime** | Node.js |
| **Start Command** | `node server.js` |
| **Build Command** | `cd client && npm install && npm run build` (React production build copied to `server/public/`) |
| **Database** | MongoDB Atlas (Cloud-hosted, separate cluster) |
| **Environment Config** | All secrets managed via Render's Environment Variable dashboard |
| **Static Serving** | Express serves the React `index.html` for all non-API routes (SPA fallback) |
| **API Base URL** | `https://pujaconnect.onrender.com/api` |

### Environment Variables

The following variables are configured in the Render dashboard (never committed to source control):

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Server port (defaults to `5000` in local dev) |

> **Note:** A `.env.example` file is committed to the repository documenting all required variables for local setup.

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Dileep-kumawat/PujaConnect.git
cd PujaConnect

# 2. Setup backend
cd server
cp .env.example .env       # Fill in MONGO_URI and JWT_SECRET
npm install
npm run seed               # (Optional) Seed sample data
npm run dev                # Starts server on port 5000

# 3. Setup frontend (in a new terminal)
cd client
npm install
npm run dev                # Starts Vite dev server on port 5173
```

---

## 18. Assumptions & Constraints

### Assumptions

- Pandits are willing and able to onboard digitally and manage profiles online
- Core ritual data (names, descriptions, durations) can be standardized across regions
- Admin verification of Pandits is performed manually in Phase 1
- Users have access to a modern browser and a reliable internet connection

### Constraints

| Constraint | Impact |
|---|---|
| **Cultural Sensitivity** | Ritual descriptions and UI language must be respectful and accurate |
| **Phase 1 Budget** | No payment gateway integration in current phase |
| **Manual Admin Verification** | Platform scale is limited by Admin bandwidth for Pandit approvals |
| **No Mobile App** | Platform is web-only in Phase 1 |

---

## 19. Future Enhancements

| Phase | Feature |
|---|---|
| **Phase 2** | Online payments & donations integration (Razorpay / Stripe) |
| **Phase 2** | Push & email notifications for booking updates |
| **Phase 2** | Customer review and rating system for Pandits |
| **Phase 3** | Multi-language support (Hindi, Marathi, Telugu, etc.) |
| **Phase 3** | Puja reminder notification system |
| **Phase 3** | Live puja streaming support |
| **Phase 4** | Astrology, horoscope, and Kundali services |
| **Phase 4** | Native iOS & Android mobile applications |
| **Phase 4** | AI-powered Pandit recommendation engine |

---

## 20. Deliverables Summary

| Deliverable | Status |
|---|---|
| Functional web application (Frontend + Backend) | ✅ Complete |
| Role-based authentication system (JWT) | ✅ Complete |
| Pandit profile management module | ✅ Complete |
| Booking lifecycle management system | ✅ Complete |
| Admin dashboard with stats & verification | ✅ Complete |
| Ritual catalog module | ✅ Complete |
| Database seeder script (`seed.js`) | ✅ Complete |
| REST API (5 route groups, 15+ endpoints) | ✅ Complete |
| Product Requirements Document (`PujaConnect.md`) | ✅ Complete |
| Detailed Project Report (`PROJECT_REPORT.md`) | ✅ Complete |
| Deployment-ready build configuration | ✅ Complete |

---

## 21. Expected Impact

| Impact Area | Description |
|---|---|
| **User Convenience** | Easy, on-demand access to trusted and verified religious service providers |
| **Transparency** | Clear pricing, ritual details, duration, and required materials visible upfront |
| **Pandit Empowerment** | Digital tools for profile management, scheduling, and income tracking |
| **Reduced Dependency** | Less reliance on informal local networks and word-of-mouth |
| **Structured Experience** | Formal booking confirmations, status tracking, and cancellation management |
| **Platform Scalability** | Infrastructure ready to expand to new cities and ritual categories |

---

*Report prepared for PujaConnect v1.0.0 — May 2026*
*Full-stack MERN Application | MongoDB · Express.js · React.js · Node.js*
*Deployed on Render: [https://pujaconnect.onrender.com](https://pujaconnect.onrender.com)*
