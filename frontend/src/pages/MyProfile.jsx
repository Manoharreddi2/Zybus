import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MyProfile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);

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
                const q = query(bookingsRef, where('userId', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const bookingsData = [];

                querySnapshot.forEach((doc) => {
                    bookingsData.push({ id: doc.id, ...doc.data() });
                });

                setOrders(bookingsData);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    return (
        <div className="container" style={{ marginTop: 'clamp(1rem, 3vw, 2rem)', padding: '0 1rem' }}>
            {/* Profile Header */}
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                marginBottom: '1.5rem',
                border: '1px solid #333',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '2rem',
                    color: 'black',
                    fontWeight: 'bold'
                }}>
                    {currentUser.email?.charAt(0).toUpperCase()}
                </div>
                <h2 style={{
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                    color: 'var(--text-primary)'
                }}>
                    My Profile
                </h2>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                    wordBreak: 'break-all'
                }}>
                    {currentUser.email}
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #333',
                paddingBottom: '0.5rem'
            }}>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        backgroundColor: activeTab === 'orders' ? 'var(--accent-color)' : 'transparent',
                        color: activeTab === 'orders' ? 'black' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: '8px 8px 0 0'
                    }}
                >
                    🎫 My Orders
                </button>
                <button
                    onClick={() => setActiveTab('account')}
                    style={{
                        backgroundColor: activeTab === 'account' ? 'var(--accent-color)' : 'transparent',
                        color: activeTab === 'account' ? 'black' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: '8px 8px 0 0'
                    }}
                >
                    ⚙️ Account
                </button>
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="loading-spinner"></div>
                            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                                        <span style={{ color: 'black', fontWeight: 'bold', fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)' }}>
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
                                                    fontSize: 'clamp(1rem, 3vw, 1.15rem)',
                                                    fontWeight: 'bold',
                                                    color: 'var(--text-primary)',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {order.busName || 'Bus Journey'}
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                    {order.busType || 'AC Sleeper'}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Fare</div>
                                                <div style={{
                                                    fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                                                    fontWeight: 'bold',
                                                    color: 'var(--accent-color)'
                                                }}>
                                                    ₹{order.totalAmount}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                            gap: '0.75rem',
                                            backgroundColor: '#000',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>📍 From</div>
                                                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{order.departure || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>📍 To</div>
                                                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{order.arrival || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>💺 Seats</div>
                                                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                                    {Array.isArray(order.selectedSeats) ? order.selectedSeats.join(', ') : order.selectedSeats || 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>📅 Date</div>
                                                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{order.date || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: 'clamp(1.5rem, 4vw, 2rem)',
                    border: '1px solid #333'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Account Details</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                            Email Address
                        </label>
                        <div style={{
                            backgroundColor: '#000',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            wordBreak: 'break-all'
                        }}>
                            {currentUser.email}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                            User ID
                        </label>
                        <div style={{
                            backgroundColor: '#000',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            wordBreak: 'break-all'
                        }}>
                            {currentUser.uid}
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid var(--accent-color)',
                        borderRadius: '8px',
                        padding: '1rem',
                        fontSize: '0.9rem',
                        color: 'var(--accent-color)'
                    }}>
                        ✅ Your account is verified and active
                    </div>
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
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

export default MyProfile;
