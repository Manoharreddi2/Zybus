// API Configuration
// Change this URL when deploying to production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
    // Auth
    sendOtp: `${API_BASE_URL}/api/auth/send-otp`,

    // Buses
    searchBuses: (from, to, date) => `${API_BASE_URL}/api/buses?from=${from}&to=${to}&date=${date}`,

    // Bookings
    createBooking: `${API_BASE_URL}/api/bookings`,
    getUserBookings: (userId) => `${API_BASE_URL}/api/bookings/user/${userId}`,
};

export default API_BASE_URL;
