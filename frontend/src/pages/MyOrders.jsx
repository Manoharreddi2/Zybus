import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const MyOrders = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            setError('');

            try {
                // Try fetching from backend first
                try {
                    const response = await fetch(`http://localhost:8080/api/bookings/user/${currentUser.uid}`);
                    if (response.ok) {
                        const data = await response.json();
                        setOrders(data);
                        setLoading(false);
                        return;
                    }
                } catch (apiError) {
                    console.warn("Backend not available, fetching from Firestore", apiError);
                }

                // Fallback to direct Firestore query
                const bookingsRef = collection(db, 'bookings');
                const q = query(
                    bookingsRef,
                    where('userId', '==', currentUser.uid)
                );

                const querySnapshot = await getDocs(q);
                const bookingsData = [];

                querySnapshot.forEach((doc) => {
                    bookingsData.push({ id: doc.id, ...doc.data() });
                });

                setOrders(bookingsData);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError('Failed to load your orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser, navigate]);

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <div className="loading-spinner"></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: 'clamp(1rem, 3vw, 2rem)', padding: '0 1rem' }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: 'clamp(1.25rem, 4vw, 1.8rem)',
                color: 'var(--text-primary)'
            }}>
                🎫 My Orders
            </h2>

            {error && (
                <div style={{
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid #ff4444',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    color: '#ff4444'
                }}>
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: 'clamp(2rem, 5vw, 3rem)',
                    borderRadius: '12px',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Orders Yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        You haven't made any bookings yet. Start your journey today!
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'black',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Book a Bus
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {orders.map((order, index) => (
                        <div
                            key={order.id || index}
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                border: '1px solid #333',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                backgroundColor: 'var(--accent-color)',
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                            }}>
                                <span style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
                                }}>
                                    Booking ID: {order.id}
                                </span>
                                <span style={{
                                    backgroundColor: order.status === 'CONFIRMED' ? '#00c853' : '#ff9800',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    {order.status || 'CONFIRMED'}
                                </span>
                            </div>

                            {/* Content */}
                            <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                                            fontWeight: 'bold',
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {order.busName || 'Bus Journey'}
                                        </div>
                                        <div style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem'
                                        }}>
                                            {order.busType || 'AC Sleeper'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            Total Fare
                                        </div>
                                        <div style={{
                                            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                                            fontWeight: 'bold',
                                            color: 'var(--accent-color)'
                                        }}>
                                            ₹{order.totalAmount}
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                    gap: '1rem',
                                    backgroundColor: '#000',
                                    padding: '1rem',
                                    borderRadius: '8px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            📍 Departure
                                        </div>
                                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                            {order.departure || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            📍 Arrival
                                        </div>
                                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                            {order.arrival || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            💺 Seats
                                        </div>
                                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                            {Array.isArray(order.selectedSeats)
                                                ? order.selectedSeats.join(', ')
                                                : order.selectedSeats || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            📅 Date
                                        </div>
                                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                            {order.date || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--accent-color)',
                        color: 'var(--accent-color)',
                        padding: '0.75rem 1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default MyOrders;
