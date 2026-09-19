<div align="center">

  # 🛍️ AuraShop — Full-Stack E-Commerce Platform

  <p align="center">
    <strong>A production-ready, high-performance Mini E-Commerce Platform built for the Week 4 Full Stack & Deployment Internship Capstone.</strong>
  </p>

  <p align="center">
    <a href="#-live-demo--recruiter-quick-access"><strong>Live Demo Access</strong></a> •
    <a href="#-key-features"><strong>Features</strong></a> •
    <a href="#-system-architecture"><strong>Architecture</strong></a> •
    <a href="#-rest-api-documentation"><strong>API Specs</strong></a> •
    <a href="#-getting-started"><strong>Quick Start</strong></a> •
    <a href="#-deployment-guide"><strong>Deployment</strong></a>
  </p>

  <!-- Shields.io Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-4.19-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
    <img src="https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/Render-Hosted-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render" />
  </p>

</div>

---

## 📌 Resume Highlight Snippet

> **Copy-paste ready for your resume or portfolio site:**

```text
"Built a full-stack e-commerce platform using React, Node.js, Express and MongoDB with JWT authentication, product management, cart functionality and REST API integration. Designed a responsive user interface and deployed the frontend and backend using Vercel and Render."
```

---

## 🔑 Recruiter Quick Access & Demo Credentials

To evaluate full functionality instantly without manual registration, click the **"Demo Login"** button on the application header or use:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Demo User / Admin** | `demo@shop.com` | `password123` | Full Auth, Shopping Cart, Orders, Admin Dashboard (`/admin`) |

---

## 📖 Problem Statement & Solution

### The Challenge
Basic student CRUD applications often lack real-world full-stack polish: they store plain-text passwords, lack state persistence, collapse when database connections fail, or present basic placeholder interfaces that fail to impress technical recruiters.

### The Solution
**AuraShop** is built from the ground up as a production-quality SaaS e-commerce application featuring:
1. **Decoupled Architecture**: Clean separation between `frontend/` (React + Vite) and `backend/` (Node.js + Express).
2. **Resilient Data Layer**: Gracefully connects to **MongoDB Atlas** while maintaining a high-performance in-memory dataset fallback so the application works out of the box in any environment.
3. **Enterprise UX**: Glassmorphism aesthetic, skeleton loaders, floating notification toasts, wishlists, promo coupon engine, customer product reviews, and live order tracking.

---

## ✨ Key Features Breakdown

### 🔒 1. Authentication & Security
- **JWT Session Tokens**: State stored securely in `localStorage` and sent via `Authorization: Bearer <token>` headers.
- **bcrypt Password Hashing**: Passwords salted and hashed with 10 rounds of bcrypt encryption.
- **Protected Routes**: React Router guards restricting access to `/checkout`, `/order-success`, `/orders`, `/wishlist`, and `/admin`.
- **Form Validation**: Strict client-side and server-side validation with responsive toast feedback.

### 🛍️ 2. Product Catalogue & Real-Time Filtering
- **Multi-Category Filter**: Instant filtering across Audio, Wearables, Fashion, Electronics, and Home categories.
- **Price Range Slider**: Dynamic price boundary filter ($10 – $500+).
- **Multi-Criteria Sorting**: Sort catalogue by Price (Low to High / High to Low), Rating, and Newest Arrivals.
- **Instant Search Bar**: Debounced title, brand, and description text search.

### 💖 3. User Wishlist & Product Reviews
- **Saved Favorites**: One-click heart toggle to save products to a dedicated `/wishlist` page.
- **Customer Product Reviews**: Logged-in users can write reviews and submit 1–5 star ratings on `ProductDetailPage`.
- **Dynamic Rating Recalculation**: Automatic recalculation of average rating scores and total review counts.

### 🛒 4. Shopping Cart & Discount Coupon Engine
- **Stateful Shopping Cart**: Increment, decrement, or remove items with automatic recalculation of subtotal, tax (8%), and free shipping progress.
- **Promo Coupon System**:
  - `WELCOME10` ➔ 10% Discount off subtotal
  - `AURA20` ➔ $20 Flat Discount off order total
  - `FREESHIP` ➔ 100% Free Shipping waiver

### 🚚 5. Checkout & Live Delivery Tracker
- **Order Placement**: Multi-step checkout form collecting shipping address and payment preferences (Card/COD).
- **Interactive Delivery Stepper**: 5-stage progress timeline tracking (`Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`).
- **Order History**: Persistent list of past purchases with invoice details.

### 📊 6. Admin Store Dashboard (`/admin`) — *Admin Only*
- **Role-Based Protection**: Restricted strictly to Admin accounts (`user.role === 'admin'`). Regular users attempting to access `/admin` receive an **Access Denied** guard screen.
- **Executive Analytics**: Key metric cards for Total Revenue in INR (`₹`), Completed Orders Count, Total Catalogue Products, and Active Users.
- **Product Publishing & Inventory Control**: Admin modal form for publishing new products with company assignment, stock count, and an inventory control table to search, inspect, and delete products.

---

## 🛠️ Technology Stack Detail

```text
               ┌───────────────────────────────────────────────────────────┐
               │                     Frontend Layer                        │
               │  - React 18.3           - Vite 5.2 Build System           │
               │  - Tailwind CSS 3.4     - React Router v6 SPA Routing     │
               │  - Axios HTTP Client    - Lucide React Iconography          │
               └─────────────────────────────┬─────────────────────────────┘
                                             │
                                  REST API (JSON / Bearer JWT)
                                             │
               ┌─────────────────────────────▼─────────────────────────────┐
               │                     Backend Layer                         │
               │  - Node.js 20.x         - Express.js 4.19 Framework      │
               │  - JWT (jsonwebtoken)   - bcryptjs Password Encryption    │
               │  - CORS & Dotenv        - Centralized Error Handler       │
               └─────────────────────────────┬─────────────────────────────┘
                                             │
                                     Mongoose ODM
                                             │
               ┌─────────────────────────────▼─────────────────────────────┐
               │                     Database Layer                        │
               │  - MongoDB Atlas Cloud Database                           │
               │  - (With High-Performance In-Memory Dev Fallback)         │
               └───────────────────────────────────────────────────────────┘
```

---

## 📂 Repository File Tree

```text
E-Commerce Web Application/
├── frontend/                    # React + Vite Client Application
│   ├── public/                  # Favicons and public static assets
│   ├── src/
│   │   ├── assets/              # Logos, hero images, banners
│   │   ├── components/          # Reusable UI component modules
│   │   │   ├── auth/            # ProtectedRoute, LoginForm, RegisterForm
│   │   │   ├── cart/            # CartItem, CartSummary components
│   │   │   ├── common/          # Navbar, Footer, OrderTimeline, RatingStars, SkeletonLoader, Toast
│   │   │   └── products/        # ProductCard, ProductFilter
│   │   ├── context/             # AuthContext, CartContext, ProductContext, ToastContext, WishlistContext
│   │   ├── hooks/               # Custom React state hooks
│   │   ├── layouts/             # MainLayout wrapper with header & footer
│   │   ├── pages/               # HomePage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage,
│   │   │                        # OrderSuccessPage, OrdersPage, WishlistPage, AdminDashboardPage, AboutPage
│   │   ├── services/            # Axios API instances (authService, productService, cartService, orderService)
│   │   └── utils/               # Currency, date, and text formatters
│   ├── .env.example             # Frontend environment variables template
│   ├── index.html               # Main HTML document
│   ├── package.json             # Frontend dependency manifest
│   ├── tailwind.config.js       # Tailwind CSS design system configuration
│   ├── vercel.json              # Vercel SPA routing rewrite rules
│   └── vite.config.js           # Vite server proxy settings
├── backend/                     # Node.js + Express REST API Server
│   ├── config/                  # MongoDB Mongoose connection & fallback logic
│   ├── controllers/             # authController, productController, cartController, orderController
│   ├── middleware/              # JWT auth protect & centralized error handlers
│   ├── models/                  # User, Product, Cart, Order Mongoose schemas
│   ├── routes/                  # Express route definitions
│   ├── services/                # In-memory dev dataset fallback store
│   ├── utils/                   # Seed dataset & JWT token generator
│   ├── .env.example             # Backend environment variables template
│   ├── index.js                 # Express application entry point
│   ├── package.json             # Backend dependency manifest
│   └── render.yaml              # Render web service deployment blueprint
├── package.json                 # Root script runner for concurrent dev execution
└── README.md                    # Project Documentation
```

---

## 🔗 REST API Documentation

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`). Returns JWT.
- `POST /api/auth/login` — Authenticate user credentials. Returns JWT.
- `GET /api/auth/me` — *(Protected)* Fetch authenticated user profile.

### Product Catalogue Routes (`/api/products`)
- `GET /api/products` — Retrieve products with optional query params (`?category=`, `?q=`, `?sort=`, `?maxPrice=`).
- `GET /api/products/:id` — Fetch single product details by ID.
- `POST /api/products` — *(Admin)* Create a new product.
- `POST /api/products/:id/reviews` — *(Protected)* Submit a star rating & review comment.
- `GET /api/products/admin/stats` — *(Admin)* Fetch store sales metrics & order statistics.

### Shopping Cart Routes (`/api/cart`)
- `GET /api/cart` — *(Protected)* Fetch active user cart items.
- `POST /api/cart` — *(Protected)* Add product or increment quantity (`productId`, `quantity`).
- `PUT /api/cart/:id` — *(Protected)* Update item quantity (`quantity`).
- `DELETE /api/cart/:id` — *(Protected)* Remove item from cart.

### Order Routes (`/api/orders`)
- `POST /api/orders` — *(Protected)* Create new order & clear shopping cart.
- `GET /api/orders` — *(Protected)* Fetch list of user's past orders.
- `GET /api/orders/:id` — *(Protected)* Fetch single order breakdown.

---

## ⚡ Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18.x or later) and **npm** installed on your machine.

### 2. Installation
Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/mini-ecommerce-platform.git
cd mini-ecommerce-platform

# Install root, backend, and frontend dependencies in one command
npm run install:all
```

### 3. Environment Variables Setup

#### Backend (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_e_commerce_2026_dev_prod
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
> *Note: If `MONGODB_URI` is omitted, the server automatically initializes an in-memory dev dataset fallback!*

#### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Running the Application Locally
Run backend REST API and frontend React app concurrently:

```bash
# In Terminal 1 (Starts Express REST API on http://localhost:5000)
npm run dev:backend

# In Terminal 2 (Starts Vite React App on http://localhost:5173)
npm run dev:frontend
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 🌐 Production Deployment Guide

### Deploying Backend to Render
1. Sign in to [Render.com](https://render.com) and create a **Web Service**.
2. Connect your GitHub repository and set the **Root Directory** to `backend`.
3. Configure settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(Your random secret key)*
   - `MONGODB_URI`: *(Your MongoDB Atlas URI)*
   - `CLIENT_URL`: `https://your-app-name.vercel.app`

### Deploying Frontend to Vercel
1. Sign in to [Vercel.com](https://vercel.com) and create a **New Project**.
2. Select your repository and set the **Root Directory** to `frontend`.
3. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-render-backend-url.onrender.com/api`
4. Click **Deploy**. Vercel will build the SPA and apply SPA routing rewrites from `vercel.json`.

---

## 🎯 Week 4 Assignment Requirements Checklist

- [x] **Requirement 1**: Integrated React frontend with Node.js/Express backend.
- [x] **Requirement 2**: Built advanced React components with proper API integration.
- [x] **Requirement 3**: Implemented complete Login/Signup JWT authentication flow.
- [x] **Requirement 4**: Implemented catalogue, details, cart, quantity controls, and checkout flow.
- [x] **Requirement 5**: Application testing and debugging completed.
- [x] **Requirement 6**: Tested components, API requests, cart operations, and protected routes.
- [x] **Requirement 7**: Zero console errors, broken links, or broken buttons.
- [x] **Requirement 8**: Production deployment ready.
- [x] **Requirement 9**: Vercel frontend deployment configuration ready (`vercel.json`).
- [x] **Requirement 10**: Render backend deployment configuration ready (`render.yaml`).
- [x] **Requirement 11**: MongoDB Atlas compatible schemas with Mongoose.
- [x] **Requirement 12**: Environment variables used for configuration (`.env.example`).
- [x] **Requirement 13**: Complete technical documentation prepared.
- [x] **Requirement 14**: Professional README with setup, architecture, and deployment steps.
- [x] **Requirement 15**: Presentation-ready for recruiter portfolio reviews.
- [x] **Requirement 16**: Clean GitHub structure with root `.gitignore` and no committed secrets.
- [x] **Requirement 17**: Working repository code containing frontend and backend.
- [x] **Requirement 18**: Verified end-to-end data flow (Frontend ➔ API ➔ Backend ➔ DB).

---

## 👨‍💻 Author & License

- **Developer**: Full Stack Web Developer Internship Candidate
- **Project**: Week 4 Full Stack & Deployment Internship Capstone
- **License**: [MIT License](LICENSE)
