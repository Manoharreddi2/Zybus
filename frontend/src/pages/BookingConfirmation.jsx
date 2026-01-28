import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendBookingEmail } from '../services/emailService';
import { createPaymentOrder, openRazorpayCheckout, verifyPayment } from '../services/paymentService';
import { API_ENDPOINTS } from '../config/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [bookingId, setBookingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const ticketRef = useRef(null);

    // Coupon code states
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [discount, setDiscount] = useState(0);

    const { bus, selectedSeats } = location.state || {};

    useEffect(() => {
        if (!bus || !selectedSeats) {
            navigate('/');
        }
    }, [bus, selectedSeats, navigate]);

    if (!bus || !selectedSeats) return null;

    const baseFare = selectedSeats.length * bus.price;
    const discountAmount = couponApplied ? Math.round(baseFare * discount) : 0;
    const totalFare = baseFare - discountAmount;

    // Apply coupon code
    const applyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        setCouponError('');

        if (code === 'ZYBUS10') {
            setCouponApplied(true);
            setDiscount(0.10); // 10% discount
        } else if (code === '') {
            setCouponError('Please enter a coupon code');
        } else {
            setCouponError('Invalid coupon code');
            setCouponApplied(false);
            setDiscount(0);
        }
    };

    // Remove applied coupon
    const removeCoupon = () => {
        setCouponCode('');
        setCouponApplied(false);
        setDiscount(0);
        setCouponError('');
    };

    // Process payment and then confirm booking
    const handlePayment = async () => {
        setLoading(true);
        setPaymentError('');

        try {
            // Step 1: Create payment order
            const orderDetails = await createPaymentOrder(totalFare);

            // Step 2: Open Razorpay checkout (shows PhonePe, GPay, Paytm UPI options)
            const paymentResult = await openRazorpayCheckout({
                keyId: orderDetails.keyId,
                amount: orderDetails.amount,
                currency: orderDetails.currency,
                orderId: orderDetails.orderId,
                email: currentUser.email,
                description: `${bus.name} - ${selectedSeats.length} seat(s)`
            });

            // Step 3: Verify payment on backend
            await verifyPayment(
                paymentResult.orderId,
                paymentResult.paymentId,
                paymentResult.signature
            );

            // Step 4: Payment successful - now create booking
            await confirmBooking(paymentResult.paymentId);

        } catch (error) {
            console.error("Payment failed:", error);
            setPaymentError(error.message || 'Payment failed. Please try again.');
            setLoading(false);
        }
    };

    const confirmBooking = async (paymentId) => {
        try {
            let newBookingId = "ZB" + Math.floor(Math.random() * 1000000);
            let savedToBackend = false;

            try {
                const bookingRequest = {
                    userId: currentUser.uid,
                    email: currentUser.email,
                    busId: bus.id,
                    selectedSeats: selectedSeats,
                    totalAmount: totalFare,
                    paymentId: paymentId,
                    date: bus.date || new Date().toISOString().split('T')[0]
                };

                const response = await fetch(API_ENDPOINTS.createBooking, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingRequest)
                });

                if (response.ok) {
                    const data = await response.json();
                    newBookingId = data.bookingId;
                    savedToBackend = true;
                }
            } catch (apiError) {
                console.warn("Backend not available, saving to Firestore directly", apiError);
            }

            // If backend unavailable, save directly to Firestore
            if (!savedToBackend) {
                try {
                    const { doc, setDoc } = await import('firebase/firestore');
                    await setDoc(doc(db, 'bookings', newBookingId), {
                        id: newBookingId,
                        userId: currentUser.uid,
                        email: currentUser.email,
                        busId: bus.id,
                        busName: bus.name,
                        busType: bus.type,
                        departure: bus.from || bus.departure,
                        arrival: bus.to || bus.arrival,
                        departureTime: bus.departure || '22:00',
                        arrivalTime: bus.arrival || '06:00',
                        selectedSeats: selectedSeats,
                        totalAmount: totalFare,
                        paymentId: paymentId,
                        date: bus.date || new Date().toISOString().split('T')[0],
                        status: 'CONFIRMED',
                        bookedAt: new Date().toISOString()
                    });
                    console.log("Booking saved to Firestore:", newBookingId);
                } catch (firestoreError) {
                    console.error("Failed to save to Firestore:", firestoreError);
                }
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
            <div className="container" style={{ textAlign: 'center', marginTop: 'clamp(1rem, 3vw, 3rem)', padding: '0 0.5rem' }}>
                <div
                    ref={ticketRef}
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: 'clamp(1.5rem, 4vw, 3rem)',
                        borderRadius: '12px',
                        border: '1px solid var(--accent-color)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        boxSizing: 'border-box'
                    }}
                >
                    <h1 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: 'clamp(1.3rem, 5vw, 2rem)' }}>🎫 Zybus Ticket</h1>
                    <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '1.5rem', color: '#00ff00' }}>✓ Booking Confirmed!</p>

                    <div style={{
                        textAlign: 'left',
                        marginBottom: '1.5rem',
                        backgroundColor: '#000',
                        padding: 'clamp(1rem, 3vw, 1.5rem)',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
                    }}>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Booking ID:</strong> <span style={{ color: 'var(--accent-color)' }}>{bookingId}</span></p>
                        <p style={{ marginBottom: '0.5rem', wordBreak: 'break-all' }}><strong>Passenger:</strong> {currentUser?.email}</p>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Bus:</strong> {bus.name}</p>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Type:</strong> {bus.type}</p>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Departure:</strong> {bus.departure}</p>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Arrival:</strong> {bus.arrival}</p>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                        <hr style={{ borderColor: '#333', margin: '1rem 0' }} />
                        <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}><strong>Total Fare:</strong> <span style={{ color: 'var(--accent-color)' }}>₹{totalFare}</span></p>
                    </div>

                    {emailStatus && <p style={{ color: '#00ff00', fontSize: '0.9rem', marginBottom: '1rem' }}>{emailStatus}</p>}
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    justifyContent: 'center',
                    padding: '0 0.5rem'
                }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--accent-color)',
                            color: 'var(--accent-color)',
                            flex: '1 1 140px',
                            maxWidth: '200px',
                            padding: '0.75rem 1rem'
                        }}
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={downloadTicket}
                        style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'black',
                            border: 'none',
                            fontWeight: 'bold',
                            flex: '1 1 180px',
                            maxWidth: '250px',
                            padding: '0.75rem 1rem'
                        }}
                    >
                        📥 Download Ticket (PDF)
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: 'clamp(1rem, 3vw, 2rem)', padding: '0 0.5rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: 'clamp(1.15rem, 4vw, 1.5rem)' }}>Review Booking</h2>

            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                borderRadius: '12px',
                maxWidth: '600px',
                margin: '0 auto',
                border: '1px solid #333',
                boxSizing: 'border-box'
            }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.25rem', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>Trip Details</h3>

                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: 'clamp(1rem, 3vw, 1.1rem)', fontWeight: 'bold', marginBottom: '0.3rem' }}>{bus.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{bus.type}</div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    textAlign: 'center'
                }}>
                    <div style={{ flex: '1 1 80px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Departure</div>
                        <div style={{ fontWeight: 'bold' }}>{bus.departure}</div>
                    </div>
                    <div style={{ flex: '1 1 80px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Arrival</div>
                        <div style={{ fontWeight: 'bold' }}>{bus.arrival}</div>
                    </div>
                    <div style={{ flex: '1 1 80px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Duration</div>
                        <div style={{ fontWeight: 'bold' }}>{bus.duration}</div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#000', padding: 'clamp(0.75rem, 2vw, 1rem)', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>
                        <span>Seats ({selectedSeats.length})</span>
                        <span>{selectedSeats.join(', ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>
                        <span>Base Fare</span>
                        <span>₹{baseFare}</span>
                    </div>
                    {couponApplied && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', color: '#00ff00' }}>
                            <span>Discount (10%)</span>
                            <span>-₹{discountAmount}</span>
                        </div>
                    )}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                        fontWeight: 'bold',
                        color: 'var(--accent-color)',
                        borderTop: '1px solid #333',
                        paddingTop: '0.5rem',
                        marginTop: '0.5rem'
                    }}>
                        <span>Total To Pay</span>
                        <span>₹{totalFare}</span>
                    </div>
                </div>

                {/* Coupon Code Section */}
                <div style={{
                    backgroundColor: '#000',
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: couponApplied ? '1px solid #00ff00' : '1px solid #333'
                }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        🎟️ Have a coupon code?
                    </div>
                    {!couponApplied ? (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Enter code (e.g., ZYBUS10)"
                                style={{
                                    flex: '1 1 150px',
                                    padding: '0.6rem',
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '1px solid #444',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase'
                                }}
                            />
                            <button
                                onClick={applyCoupon}
                                style={{
                                    padding: '0.6rem 1rem',
                                    backgroundColor: 'var(--accent-color)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Apply
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ color: '#00ff00', fontWeight: 'bold' }}>
                                ✅ ZYBUS10 applied - 10% OFF!
                            </div>
                            <button
                                onClick={removeCoupon}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    backgroundColor: 'transparent',
                                    color: '#ff4d4d',
                                    border: '1px solid #ff4d4d',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                    {couponError && (
                        <div style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            {couponError}
                        </div>
                    )}
                </div>

                {/* Payment Error Display */}
                {paymentError && (
                    <div style={{
                        backgroundColor: '#ff4d4d20',
                        border: '1px solid #ff4d4d',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        color: '#ff4d4d',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        ⚠️ {paymentError}
                    </div>
                )}

                {/* UPI Payment Info */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    <span>💳 Pay via UPI:</span>
                    <span>GPay</span>
                    <span>•</span>
                    <span>PhonePe</span>
                    <span>•</span>
                    <span>Paytm</span>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: 'clamp(0.75rem, 2vw, 1rem)',
                        backgroundColor: 'var(--accent-color)',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                        border: 'none',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Processing Payment...' : `Pay ₹${totalFare} Now`}
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
