# Bus Ticket Booking Web App

A full-stack Bus Ticket Booking application with a pure black theme, React frontend, Spring Boot backend, and Firebase integration.

For testing the payment integration, enter the UPI ID 👉 success@razorpay 👈 in the UPI field, no need of real money. 😄😄

## 🚀 Features

- **Strict Black Theme**: Premium dark UI with neon accents.
- **Firebase Authentication**: Login/Signup with Email/Password and Google.
- **Bus Search**: Select City (20+ predefined), Date.
- **Visual Seat Selection**: Interactive grid for seat booking.
- **Razorpay UPI Integration**: Secure payments via GPay, PhonePe, and Paytm.
- **Spring Boot Backend**: REST APIs for buses, bookings, and payments.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS Modules (Black Theme)
- **Backend**: Spring Boot 3.x, Java 17
- **Payment Gateway**: Razorpay (UPI)
- **Database**: Firestore (via Firebase Admin SDK)
- **Authentication**: Firebase Auth

## 🔧 Setup Instructions

### 1. Prerequisites
- Node.js & npm
- Java 17+ & Maven
- Firebase Service Account Key (optional for full backend features)
- Razorpay Test Key ID & Secret

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access at `http://localhost:5173`

### 3. Backend Setup
1. Place your `serviceAccountKey.json` in `backend/src/main/resources/`.
2. Configure Razorpay keys in `application.properties` or Environment Variables.
3. Run the application:
```bash
cd backend
mvn spring-boot:run
```
Access API at `http://localhost:8080/api/buses`

## 📡 API Endpoints

- `GET /api/buses?from={city}&to={city}&date={date}` - Search buses
- `GET /api/buses/{id}` - Get bus details
- `POST /api/bookings` - Create a booking
- `POST /api/payments/create-order` - Create Razorpay Order
- `POST /api/payments/verify` - Verify Payment Signature

## 🎨 Theme Details
- Background: `#000000`
- Cards: `#111111`
- Text: `#ffffff`
- Accents: Neon Blue/Cyan

## 🧪 Testing Payments (Laptop/PC)

Since you cannot scan QR codes in Test Mode, follow these steps:
1. Click **Pay Now** to open Razorpay.
2. Select **UPI** payment method.
3. Click **"Enter UPI ID"** (do not scan QR).
4. Enter test ID: `success@razorpay`
5. Click **Pay Now** to complete the transaction successfully.
