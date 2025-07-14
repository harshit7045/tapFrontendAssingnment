# Safety Alert Web Application

A full-stack safety alert web application with real-time danger zone monitoring, emergency contact management, and automated emergency email alerts.

---

## Features
- User registration and login (JWT-based authentication)
- Emergency contact management (add, view, remove emails)
- Danger zone monitoring (Geolocation API, Haversine formula)
- Network status monitoring (Network Information API)
- Automated emergency email alerts (Nodemailer)
- Responsive React frontend (Vite)
- Node.js/Express backend with MongoDB (Mongoose)

---

## Folder Structure
```
project-root/
  frontend/    # React + Vite code
  backend/     # Node.js + Express + MongoDB + Nodemailer code
  README.md
  .env         # (root, optional)
```

---

## Backend Setup

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

2. **Create a `.env` file in `backend/` with:**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/safety-alert
   JWT_SECRET=your_jwt_secret_here
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=your_email@example.com
   ```

3. **Start the backend server:**
   ```sh
   npm start
   # or
   node index.js
   ```

4. **Example MongoDB Data:**
   - **Danger Zones:**
     ```js
     // In MongoDB shell or Compass:
     db.dangerzones.insertMany([
       { latitude: 40.7128, longitude: -74.0060, radius: 500 }, // Example: New York
       { latitude: 34.0522, longitude: -118.2437, radius: 700 }, // Example: Los Angeles
     ])
     ```
   - **Users:**
     - Register via frontend or use the backend API.

---

## Frontend Setup

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **(Optional) Create a `.env` file in `frontend/` for API base URL:**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```

4. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

---

## API Endpoints (Backend)
- `POST   /api/auth/register` — Register user
- `POST   /api/auth/login` — Login user
- `GET    /api/contacts` — Get emergency contacts (auth required)
- `POST   /api/contacts` — Add emergency contact (auth required)
- `DELETE /api/contacts` — Remove emergency contact (auth required)
- `GET    /api/danger-zones` — Get all danger zones (auth required)
- `POST   /api/alert-location` — Send emergency alert (auth required)

---

## Environment Variables
- **Backend:** See `.env.example` in backend folder for all required variables.
- **Frontend:** Set `VITE_API_BASE_URL` if backend is not on default localhost:5000.

---

## Notes
- All sensitive data (JWT secret, email credentials) must be set in `.env` files.
- CORS is enabled for local development.
- Passwords are securely hashed with bcrypt.
- Emails are sent using Nodemailer (configure your SMTP provider).
- Danger zones and users can be managed directly in MongoDB for testing.
- All API requests (except login/register) require a valid JWT.

---

## License
Open-source. Use freely for learning and non-commercial projects. 