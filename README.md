# HaatLink 🌱

> **Direct Farm-to-Buyer Agricultural Marketplace & Market Intelligence Platform**  
> *Smart India Hackathon (SIH) Prototype*

HaatLink is a full-stack digital agricultural marketplace that connects farmers directly with verified institutional buyers (FPOs, retail chains, food processors, and wholesale merchants). By eliminating intermediate commission agents and providing transparent mandi price intelligence and demand matching, HaatLink empowers producers to maximize their farmgate margins while giving buyers reliable, quality-graded procurement pipelines.

---

## 🚀 Key Highlights & Features

### 👨‍🌾 Farmer Suite
- **Inventory & Crop Tracking**: Manage produce listings, harvest dates, readiness status (*Growing*, *Harvested*, *Ready to Sell*), and quality grades (*Grade A*, *Grade B*, *Organic*).
- **Buyer Marketplace**: Browse real-time institutional procurement requirements. Filter by buyer or crop, view required volumes and target prices, and submit direct supply offers.
- **Live Mandi Intelligence**: Track commodity spot prices, 7-day trend histories, daily fluctuations, and wholesale market volume across major regional mandis.
- **Smart Recommendations**: Decision support for optimal harvesting windows, market timing, and pricing strategy based on mandi trends.
- **Direct Deals**: Transparent transaction tracking from negotiation to agreement.

### 🏢 Buyer Suite
- **Demand Publishing**: Post structured procurement requirements specifying crop, target volume, expected price per quintal, delivery location, minimum quality grade, and procurement deadline.
- **Offer Management**: Review and accept incoming farmer supply offers with direct communication and verified volume tracking.
- **Procurement Dashboard**: High-level KPIs covering active purchase contracts, fulfilled quantities, and procurement expenditure.

### 🔐 Secure & Role-Based Workflow
- **Authentication**: JWT-based session security via `HttpOnly`, `SameSite=Lax` cookies.
- **Instant Role Switch**: Switch seamlessly between Farmer and Buyer perspectives during exploration without re-authenticating.
- **Interactive UI**: Custom design system crafted in vanilla CSS featuring responsive card grids, accessible modals, and micro-interactions.

---

## 🏗️ System Architecture

HaatLink is designed with a strict, decoupled layered architecture where **MongoDB serves as the single source of truth** for all business data.

```
React (Frontend)
   │
   ▼
services/ (API Client Layer)
   │
   ▼
Express HTTP API (app.js)
   │
   ▼
Routes (/api/*)
   │
   ▼
Controllers (Validation & Business Logic)
   │
   ▼
Mongoose Models (Data Schema & Access)
   │
   ▼
MongoDB (Local Database: mongodb://localhost:27017/haatlink)
```

- **Frontend**: React 19, Vite, React Router v7, Context API, Prettier, ESLint.
- **Backend**: Node.js, Express v5 (ES Modules), Mongoose v9.
- **Security**: `bcryptjs` password hashing, `jsonwebtoken`, `cookie-parser`, `cors`.

---

## 📁 Repository Structure

```
HaatLink/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Shared & layout components (Modal, StatCard, PriceChart, etc.)
│   │   ├── context/            # React Context (AppContext, AuthContext)
│   │   ├── pages/              # Application views
│   │   │   ├── buyer/          # Buyer dashboard, requirements, and orders
│   │   │   ├── Buyers/         # Farmer → Buyer marketplace & offer submission
│   │   │   ├── Crops/          # Farmer crop inventory management
│   │   │   ├── Dashboard/      # Farmer summary dashboard
│   │   │   ├── Deals/          # Deal & transaction records
│   │   │   ├── Login/          # Authentication pages (Login / Register)
│   │   │   ├── Market/         # Mandi price trends & analytics
│   │   │   └── Recommendation/ # Crop & price decision support
│   │   ├── services/           # Centralized API service layer
│   │   ├── utils/              # Formatting, validations, and heuristics
│   │   ├── App.jsx             # Route definitions & guards
│   │   └── index.css           # Custom design system & styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express REST Backend (ES Modules)
│   ├── config/                 # Database connection (Mongoose)
│   ├── controllers/            # Request handlers & domain logic
│   ├── models/                 # Mongoose schemas (User, Crop, Requirement, Offer, Deal, Market, etc.)
│   ├── req/                    # Auth middleware & request helpers
│   ├── routes/                 # Express API routes
│   ├── seed.js                 # Safe one-time seed script
│   ├── app.js                  # Express setup & middleware mounting
│   └── package.json
│
├── AGENTS.md                   # Repository development rules & permanent constraints
└── README.md                   # Project documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** running locally on default port `27017` (or a MongoDB Atlas connection string)

---

### 1. Backend Setup

1. Open a terminal and navigate to `/server`:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/haatlink
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. *(Optional)* Seed initial data:
   ```bash
   node seed.js
   ```
   > *Note:* `seed.js` only populates collections that are currently empty. It does not delete or overwrite existing data.

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will be accessible at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a second terminal and navigate to `/client`:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The web application will open at `http://localhost:5173`.

---

## 📡 REST API Reference

| Endpoint | Method | Description | Auth Required |
|---|---|---|:---:|
| `/api/health` | `GET` | Health check endpoint | No |
| `/api/auth/register` | `POST` | Register a new user (`farmer` or `buyer`) | No |
| `/api/auth/login` | `POST` | Authenticate and receive `token` cookie | No |
| `/api/auth/logout` | `POST` | Clear authentication session cookie | No |
| `/api/auth/me` | `GET` | Retrieve currently authenticated user | Yes |
| `/api/crops` | `GET`, `POST` | List and create farmer crops | Optional / Yes |
| `/api/crops/:id` | `GET`, `PUT`, `DELETE` | Read, update, or remove a crop record | Yes |
| `/api/requirements` | `GET`, `POST` | List and publish buyer procurement requirements | Optional / Yes |
| `/api/offers` | `GET`, `POST` | View and submit farmer supply offers | Optional / Yes |
| `/api/deals` | `GET`, `POST` | View and create finalized trade deals | Optional / Yes |
| `/api/markets` | `GET` | Retrieve real-time mandi prices and historical data | No |
| `/api/dashboard` | `GET` | Aggregated dashboard metrics | No |
| `/api/notifications` | `GET`, `POST` | User notifications and alerts | No |

---

## 🧪 Testing & Code Quality

In the `client` directory:
- **Linting**:
  ```bash
  npm run lint
  ```
- **Code Formatting**:
  ```bash
  npm run format
  ```
- **Production Build**:
  ```bash
  npm run build
  ```

---

## 📜 Development Guidelines

Development strictly adheres to the principles documented in [AGENTS.md](AGENTS.md):
- **Single Source of Truth**: All operational marketplace data originates from MongoDB through the backend API.
- **Clean Architecture**: Separation of concerns (`React → services → routes → controllers → models → MongoDB`).
- **Data Integrity**: Never introduce client-side mock data as a replacement for database state.
- **Privacy & Security**: Credentials, tokens, and secrets must remain within `.env` and never be committed.

---

## 📄 License

This project was developed for the **Smart India Hackathon (SIH)**. All rights reserved.
