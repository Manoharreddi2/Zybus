import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendBookingEmail } from '../services/emailService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [bookingId, setBookingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState('');
    const ticketRef = useRef(null);

    const { bus, selectedSeats } = location.state || {};

    useEffect(() => {
        if (!bus || !selectedSeats) {
            navigate('/');
        }
    }, [bus, selectedSeats, navigate]);

    if (!bus || !selectedSeats) return null;

    const totalFare = selectedSeats.length * bus.price;

    const confirmBooking = async () => {
        setLoading(true);
        try {
            let newBookingId = "ZB" + Math.floor(Math.random() * 1000000);

            try {
                const bookingRequest = {
                    userId: currentUser.uid,
                    email: currentUser.email,
                    busId: bus.id,
                    selectedSeats: selectedSeats,
                    totalAmount: totalFare,
                    date: bus.date || new Date().toISOString().split('T')[0]
                };

                const response = await fetch('http://localhost:8080/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingRequest)
                });

                if (response.ok) {
                    const data = await response.json();
                    newBookingId = data.bookingId;
                }
            } catch (apiError) {
                console.warn("Backend not available, using simulation", apiError);
            }

            setBookingId(newBookingId);

            // Send confirmation email
            const emailResult = await sendBookingEmail(
                currentUser.email,
                newBookingId,
                bus.name,
                selectedSeats.join(', '),
                totalFare,
                `${bus.departure} → ${bus.arrival}`
            );

            if (emailResult.success) {
                setEmailStatus('✅ Confirmation email sent!');
            } else {
                setEmailStatus('');
            }

            console.log("Booking Confirmed:", newBookingId);
        } catch (error) {
            console.error("Booking failed", error);
            const fallbackId = "ZB" + Math.floor(Math.random() * 1000000);
            setBookingId(fallbackId);
        } finally {
            setLoading(false);
        }
    };

    const downloadTicket = async () => {
        if (!ticketRef.current) return;

        try {
            const canvas = await html2canvas(ticketRef.current, {
                backgroundColor: '#111111',
                scale: 2
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.setFillColor(0, 0, 0);
            pdf.rect(0, 0, 210, 297, 'F');
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`Zybus_Ticket_${bookingId}.pdf`);
        } catch (error) {
            console.error("Failed to download ticket", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    if (bookingId) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <div
                    ref={ticketRef}
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '3rem',
                        borderRadius: '12px',
                        border: '1px solid var(--accent-color)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}
                >
                    <h1 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>🎫 Zybus Ticket</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#00ff00' }}>✓ Booking Confirmed!</p>

                    <div style={{ textAlign: 'left', marginBottom: '2rem', backgroundColor: '#000', padding: '1.5rem', borderRadius: '8px' }}>
                        <p><strong>Booking ID:</strong> <span style={{ color: 'var(--accent-color)' }}>{bookingId}</span></p>
                        <p><strong>Passenger:</strong> {currentUser?.email}</p>
                        <p><strong>Bus:</strong> {bus.name}</p>
                        <p><strong>Type:</strong> {bus.type}</p>
                        <p><strong>Departure:</strong> {bus.departure}</p>
                        <p><strong>Arrival:</strong> {bus.arrival}</p>
                        <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                        <hr style={{ borderColor: '#333', margin: '1rem 0' }} />
                        <p style={{ fontSize: '1.3rem' }}><strong>Total Fare:</strong> <span style={{ color: 'var(--accent-color)' }}>₹{totalFare}</span></p>
                    </div>

                    {emailStatus && <p style={{ color: '#00ff00', fontSize: '0.9rem', marginBottom: '1rem' }}>{emailStatus}</p>}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--accent-color)',
                            color: 'var(--accent-color)',
                            marginRight: '1rem'
                        }}
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={downloadTicket}
                        style={{ backgroundColor: 'var(--accent-color)', color: 'black', border: 'none', fontWeight: 'bold' }}
                    >
                        📥 Download Ticket (PDF)
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Review Booking</h2>

            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '2rem',
                borderRadius: '12px',
                maxWidth: '600px',
                margin: '0 auto',
                border: '1px solid #333'
            }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Trip Details</h3>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{bus.name}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{bus.type}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Departure</div>
                        <div style={{ fontWeight: 'bold' }}>{bus.departure}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Arrival</div>
                        <div style={{ fontWeight: 'bold' }}>{bus.arrival}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Duration</div>
                        <div style={{ fontWeight: 'bold' }}>{bus.duration}</div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#000', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Seats ({selectedSeats.length})</span>
                        <span>{selectedSeats.join(', ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)', borderTop: '1px solid #333', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        <span>Total To Pay</span>
                        <span>₹{totalFare}</span>
                    </div>
                </div>

                <button
                    onClick={confirmBooking}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: 'var(--accent-color)',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        border: 'none',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
