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
        <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h2>Select Seats for {bus.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{bus.type} - ₹{bus.price}/seat</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                maxWidth: '400px',
                margin: '2rem auto',
                backgroundColor: 'var(--bg-secondary)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid #222'
            }}>
                {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map(seatNum => {
                    const isBooked = BOOKED_SEATS.includes(seatNum);
                    const isSelected = selectedSeats.includes(seatNum);

                    return (
                        <div
                            key={seatNum}
                            onClick={() => toggleSeat(seatNum)}
                            style={{
                                width: '40px',
                                height: '40px',
                                border: isBooked ? '1px solid #333' : (isSelected ? '1px solid var(--accent-color)' : '1px solid white'),
                                backgroundColor: isBooked ? '#333' : (isSelected ? 'var(--accent-color)' : 'transparent'),
                                color: isBooked ? '#555' : (isSelected ? 'black' : 'white'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {seatNum}
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '20px', border: '1px solid white', borderRadius: '4px' }}></div>
                    <span>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#333', border: '1px solid #333', borderRadius: '4px' }}></div>
                    <span>Booked</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--accent-color)', borderRadius: '4px' }}></div>
                    <span>Selected</span>
                </div>
            </div>

            {selectedSeats.length > 0 && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderTop: '1px solid #222',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)' }}>Selected Seats: {selectedSeats.join(', ')}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: ₹{selectedSeats.length * bus.price}</div>
                    </div>
                    <button
                        onClick={handleBook}
                        style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'black',
                            padding: '1rem 3rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            border: 'none'
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
