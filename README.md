# GlowNest — Premium Beauty & Wellness Parlour

GlowNest is a premium web application for a luxury beauty salon. It offers a stunning user experience for exploring premium beauty treatments, booking packages, viewing recent portfolio work in a modern bento masonry layout, and checking out customer reviews. 

The application is built on **React** (using **Vite**), styled with vanilla CSS custom variables design system, and powered by a **json-server** REST API database backend.

---

## Key Features

### 🌸 User Panel
- **Premium Hero Slider**: A high-end interactive hero slider showcasing signature salon aesthetics.
- **Service Listings & Filter**: Categorized listing (Hair Care, Skin, Nails, Makeup, Spa, Bridal) with search capability.
- **Dynamic Packages**: Bundled deals for grooming, radiance, and pre-bridal transformations saving up to 33%.
- **Bento Masonry Gallery**: A modern, responsive "Our Recent Work" section featuring:
  - Staggered Bento layout style grid.
  - Smooth interactive zoom-in and custom fade overlays.
  - Complete full-screen Lightbox slideshow with mouse click navigation and keyboard accessibility (`Left`/`Right` arrows, `Esc` to close).
- **Appointment Booking System**: Multi-step booking cart where registered users can choose dates, times, and place orders.
- **Feedback Portal**: Interactive feedback forms where customers can submit ratings and testimonials.

### 👑 Admin Panel (`/admin`)
A separate, fully responsive management console that acts as a natural design extension of the website:
- **Metrics Dashboard**: Computes real-time data including **Total Users**, **Total Bookings**, **Total Revenue** (aggregated sums), **Total Services**, **Total Packages**, and **Total Reviews**.
- **Services CRUD**: Complete Add, Edit, Delete, and View panel for salon services.
- **Packages CRUD**: Complete Add, Edit, Delete, and View panel for bundles, including dynamic inputs to configure package feature lists.
- **Bookings Management**: Real-time listings of all client appointments with quick dropdown selectors to update booking statuses (`Pending`, `Confirmed`, `Completed`, `Cancelled`) and payment statuses (`Pending`, `Partially Paid`, `Paid`).
- **Feedback Management**: Read-only grid to view all client ratings and testimonials.

---

## Technology Stack

- **Frontend Core**: React 18, React Router DOM v6
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Database / API Server**: json-server (runs locally on port 1000)
- **Styling**: Pure CSS Custom Variables (Design System tokens)
- **Icons**: FontAwesome v6 (CDN integrated)

---

## Getting Started & Local Setup

To run both the database API server and the frontend React application locally, follow these steps:

### 1. Clone & Install Dependencies
Navigate to the root directory and install npm packages:
```bash
npm install
```

### 2. Start the Backend API Server
The database runs on `json-server` and reads/writes to `db.json` on port `3001`:
```bash
npx json-server db.json --port 3001
# OR if json-server is installed globally:
json-server --watch db.json --port 3001
```
*Make sure the port is set to `3001` since the frontend's API wrapper redirects calls to `http://localhost:3001`.*

### 3. Start the Frontend Development Server
In a new terminal window, spin up the Vite dev server (configured to run on port `3000`):
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 4. Create Production Build
To bundle the project for deployment:
```bash
npm run build
```
Vite will output optimized static files in the `/dist` directory.
### 5. Admin Panel Access

The admin interface is available at `/admin`. To access it you must first log in:

```bash
http://localhost:3000/admin/login
```

Use the default credentials:
- **Email:** `admin@glownest.com`
- **Password:** `admin123`

After logging in you will be redirected to the admin dashboard where you can manage services, packages, bookings, and feedback.

> **Note:** Authentication is currently a simple client‑side check stored in `localStorage`. For production replace with a secure backend authentication mechanism.
