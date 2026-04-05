# 🍔 Slooze Food Ordering API

A production-grade backend for a food ordering application built with **Node.js + Express + MongoDB**.  
Features full **RBAC (Role-Based Access Control)** and **country-based data scoping** (Bonus).

---

## 🏗️ Architecture

```
src/
 ├── config/          # DB connection & seed script
 ├── constants/       # Roles, countries, order status enums
 ├── controllers/     # Request/response handlers
 ├── middlewares/     # Auth, RBAC, country-scoping, error handler
 ├── models/          # Mongoose schemas
 ├── repositories/    # Database access layer
 ├── routes/          # Express route definitions
 ├── services/        # Business logic layer
 ├── utils/           # JWT, bcrypt, response helpers
 ├── validators/      # Input validation (express-validator)
 └── app.js           # Express app setup
server.js             # Entry point
```

Clean Architecture pattern — strict separation of concerns:
> Routes → Controllers → Services → Repositories → Models

---

## 👥 Users & Roles

| Name             | Email                       | Password     | Role    | Country |
|------------------|-----------------------------|--------------|---------|---------|
| Nick Fury        | nick.fury@shield.com        | admin@123    | ADMIN   | America |
| Captain Marvel   | captain.marvel@shield.com   | manager@123  | MANAGER | India   |
| Captain America  | captain.america@shield.com  | manager@123  | MANAGER | America |
| Thanos           | thanos@shield.com           | member@123   | MEMBER  | India   |
| Thor             | thor@shield.com             | member@123   | MEMBER  | India   |
| Travis           | travis@shield.com           | member@123   | MEMBER  | America |

---

## 🔐 Access Control Matrix

| Function                    | ADMIN | MANAGER | MEMBER |
|-----------------------------|-------|---------|--------|
| View restaurants & menu     | ✅    | ✅      | ✅     |
| Create order (add items)    | ✅    | ✅      | ✅     |
| Place order (checkout & pay)| ✅    | ✅      | ❌     |
| Cancel order                | ✅    | ✅      | ❌     |
| Update payment method       | ✅    | ❌      | ❌     |

### 🌍 Bonus: Country-Based Scoping
- **ADMIN** → sees all data across all countries
- **MANAGER / MEMBER** → can only access data from their own country (India or America)

---

## ⚙️ Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/slooze-backend.git
cd slooze-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and fill in your values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/slooze_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Seed the database
```bash
npm run seed
```
This populates Nick Fury's team, restaurants (India & America), menu items, and payment methods.

### 5. Start the server
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`  
Health check: `GET http://localhost:5000/health`

---

## 📡 API Reference

Base URL: `/api/v1`

### Auth
| Method | Endpoint           | Access  | Description        |
|--------|--------------------|---------|--------------------|
| POST   | /auth/register     | Public  | Register new user  |
| POST   | /auth/login        | Public  | Login & get token  |
| GET    | /auth/me           | All     | Get current user   |

### Restaurants
| Method | Endpoint           | Access  | Description                        |
|--------|--------------------|---------|------------------------------------|
| GET    | /restaurants       | All     | List restaurants (country-scoped)  |
| GET    | /restaurants/:id   | All     | Get restaurant + menu              |

### Orders
| Method | Endpoint              | Access           | Description                    |
|--------|-----------------------|------------------|--------------------------------|
| GET    | /orders               | All              | List orders (country-scoped)   |
| GET    | /orders/:id           | All              | Get single order               |
| POST   | /orders               | All              | Create order                   |
| POST   | /orders/:id/place     | ADMIN, MANAGER   | Place/checkout order           |
| DELETE | /orders/:id/cancel    | ADMIN, MANAGER   | Cancel order                   |

### Payments
| Method | Endpoint           | Access  | Description              |
|--------|--------------------|---------|--------------------------|
| GET    | /payments          | All     | Get my payment methods   |
| POST   | /payments          | ADMIN   | Add payment method       |
| PUT    | /payments/update   | ADMIN   | Update payment method    |

---

## 🚀 Deployment

Deployed on **Render**: [https://slooze-backend.onrender.com](https://slooze-backend.onrender.com)

### Deploy your own on Render:
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set environment variables (same as `.env`)
5. Build command: `npm install`
6. Start command: `npm start`

---

## 🧪 Sample Request Bodies

### Register
```json
POST /api/v1/auth/register
{
  "name": "Iron Man",
  "email": "iron.man@stark.com",
  "password": "jarvis@123",
  "role": "MEMBER",
  "country": "America"
}
```

### Login
```json
POST /api/v1/auth/login
{
  "email": "nick.fury@shield.com",
  "password": "admin@123"
}
```

### Create Order
```json
POST /api/v1/orders
Authorization: Bearer <token>
{
  "restaurantId": "<restaurant_id>",
  "items": [
    { "menuItemId": "<menu_item_id>", "quantity": 2 },
    { "menuItemId": "<menu_item_id>", "quantity": 1 }
  ]
}
```

### Update Payment Method (ADMIN only)
```json
PUT /api/v1/payments/update
Authorization: Bearer <token>
{
  "method": "CARD",
  "details": {
    "cardLast4": "9999",
    "cardBrand": "Visa",
    "billingName": "Nick Fury"
  },
  "isDefault": true
}
```

---

## 🛡️ Security

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- Auth via **JWT** (Bearer token)
- Route-level RBAC via `authorize([roles])` middleware
- Country-level scoping via `restrictCountryAccess` middleware
- Centralized error handler — no raw errors exposed

---

## 📦 Tech Stack

| Layer       | Tech                   |
|-------------|------------------------|
| Runtime     | Node.js 18+            |
| Framework   | Express.js             |
| Database    | MongoDB + Mongoose     |
| Auth        | JWT + bcryptjs         |
| Validation  | express-validator      |
| Logging     | Morgan                 |
| Deployment  | Render + MongoDB Atlas |
