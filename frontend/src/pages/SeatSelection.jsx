import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TOTAL_SEATS = 40;
// Mock booked seats
const BOOKED_SEATS = [2, 5, 8, 12, 18, 19, 25];

const SeatSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const bus = location.state?.bus;

    if (!bus) return <div className="container">Invalid Bus Selection</div>;

    const toggleSeat = (seatNum) => {
        if (BOOKED_SEATS.includes(seatNum)) return;
        if (selectedSeats.includes(seatNum)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
        } else {
            setSelectedSeats([...selectedSeats, seatNum]);
        }
    };

    const handleBook = () => {
        if (!currentUser) {
            alert("Please login to book tickets");
            navigate('/login');
            return;
        }
        // Proceed to confirmation
        navigate('/booking-confirmation', { state: { bus, selectedSeats } });
    };

    return (
        <div className="container" style={{ marginTop: '1.5rem', textAlign: 'center', paddingBottom: selectedSeats.length > 0 ? '120px' : '2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>Select Seats for {bus.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>{bus.type} - ₹{bus.price}/seat</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(40px, 60px))',
                gap: 'clamp(0.5rem, 2vw, 1rem)',
                maxWidth: '320px',
                margin: '1.5rem auto',
                backgroundColor: 'var(--bg-secondary)',
                padding: 'clamp(1rem, 3vw, 2rem)',
                borderRadius: '12px',
                border: '1px solid #222',
                justifyContent: 'center'
            }}>
                {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map(seatNum => {
                    const isBooked = BOOKED_SEATS.includes(seatNum);
                    const isSelected = selectedSeats.includes(seatNum);

                    return (
                        <div
                            key={seatNum}
                            onClick={() => toggleSeat(seatNum)}
                            style={{
                                width: 'clamp(36px, 8vw, 45px)',
                                height: 'clamp(36px, 8vw, 45px)',
                                border: isBooked ? '1px solid #333' : (isSelected ? '1px solid var(--accent-color)' : '1px solid white'),
                                backgroundColor: isBooked ? '#333' : (isSelected ? 'var(--accent-color)' : 'transparent'),
                                color: isBooked ? '#555' : (isSelected ? 'black' : 'white'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {seatNum}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(0.75rem, 3vw, 2rem)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '18px', height: '18px', border: '1px solid white', borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.85rem' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '18px', height: '18px', backgroundColor: '#333', border: '1px solid #333', borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.85rem' }}>Booked</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '18px', height: '18px', backgroundColor: 'var(--accent-color)', borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.85rem' }}>Selected</span>
                </div>
            </div>

            {/* Fixed Bottom Bar */}
            {selectedSeats.length > 0 && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    borderTop: '1px solid #222',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    boxSizing: 'border-box',
                    zIndex: 1000
                }}>
                    <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                            Seats: {selectedSeats.sort((a, b) => a - b).join(', ')}
                        </div>
                        <div style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>
                            Total: ₹{selectedSeats.length * bus.price}
                        </div>
                    </div>
                    <button
                        onClick={handleBook}
                        style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'black',
                            padding: 'clamp(0.7rem, 2vw, 1rem) clamp(1.5rem, 4vw, 3rem)',
                            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                            fontWeight: 'bold',
                            border: 'none',
                            flex: '0 0 auto'
                        }}
                    >
                        Book Ticket
                    </button>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;
