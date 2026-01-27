# Bus Ticket Booking Web App

A full-stack Bus Ticket Booking application with a pure black theme, React frontend, Spring Boot backend, and Firebase integration.

## 🚀 Features

- **Strict Black Theme**: Premium dark UI with neon accents.
- **Firebase Authentication**: Login/Signup with Email/Password and Google.
- **Bus Search**: Select City (20+ predefined), Date.
- **Visual Seat Selection**: Interactive grid for seat booking.
- **Instant Booking**: Direct confirmation without payment gateway.
- **Spring Boot Backend**: REST APIs for buses and bookings.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS Modules (Black Theme)
- **Backend**: Spring Boot 3.x, Java 17
- **Database**: Firestore (via Firebase Admin SDK)
- **Authentication**: Firebase Auth

## 🔧 Setup Instructions

### 1. Prerequisites
- Node.js & npm
- Java 17+ & Maven
- Firebase Service Account Key (optional for full backend features)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access at `http://localhost:5173`

### 3. Backend Setup
1. Place your `serviceAccountKey.json` in `backend/src/main/resources/`.
2. Run the application:
```bash
cd backend
mvn spring-boot:run
```
Access API at `http://localhost:8080/api/buses`

## 📡 API Endpoints

- `GET /api/buses?from={city}&to={city}&date={date}` - Search buses
- `GET /api/buses/{id}` - Get bus details
- `POST /api/bookings` - Create a booking

## 🎨 Theme Details
- Background: `#000000`
- Cards: `#111111`
- Text: `#ffffff`
- Accents: Neon Blue/Cyan
