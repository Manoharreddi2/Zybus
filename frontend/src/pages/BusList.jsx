import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const MOCK_BUSES = [
    { id: 1, name: "NeoTravels Premium", type: "AC Sleeper (2+1)", departure: "22:00", arrival: "06:00", duration: "8h 00m", price: 1200, seatsAvailable: 12, rating: 4.5 },
    { id: 2, name: "CityExpress", type: "Non-AC Seater (2+2)", departure: "20:30", arrival: "05:00", duration: "8h 30m", price: 800, seatsAvailable: 24, rating: 4.0 },
    { id: 3, name: "NightRider", type: "AC Volvo", departure: "23:00", arrival: "06:30", duration: "7h 30m", price: 1500, seatsAvailable: 5, rating: 4.8 },
    { id: 4, name: "InterCity Gold", type: "AC Sleeper", departure: "21:15", arrival: "05:45", duration: "8h 30m", price: 1100, seatsAvailable: 15, rating: 4.2 },
];

const BusList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);

    const searchParams = new URLSearchParams(location.search);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');

    useEffect(() => {
        if (!from || !to || !date) {
            navigate('/');
            return;
        }

        setLoading(true);
        // Fetch buses from API
        fetch(API_ENDPOINTS.searchBuses(from, to, date))
            .then(res => {
                if (!res.ok) throw new Error("Backend not reachable");
                return res.json();
            })
            .then(data => setBuses(data))
            .catch(err => {
                console.warn("Failed to fetch buses, using mock data", err);
                setBuses(MOCK_BUSES);
            })
            .finally(() => setLoading(false));
    }, [from, to, date, navigate]);

    return (
        <div className="container" style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Available Buses</h2>
                <p style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>{from} → {to} on {date}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {buses.map(bus => (
                    <div key={bus.id} style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: 'clamp(1rem, 3vw, 1.5rem)',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        border: '1px solid #222',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#222'}
                    >
                        {/* Bus Info */}
                        <div style={{ flex: '2 1 200px', minWidth: '150px' }}>
                            <h3 style={{ margin: 0, color: 'white', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>{bus.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.5rem 0' }}>{bus.type}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: '#00b894', color: 'black', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>★ {bus.rating}</span>
                                <span style={{ color: '#888', fontSize: '0.75rem' }}>140 ratings</span>
                            </div>
                        </div>

                        {/* Time Info */}
                        <div style={{ flex: '1 1 100px', textAlign: 'center', minWidth: '80px' }}>
                            <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 'bold' }}>{bus.departure}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{bus.duration}</div>
                            <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 'bold' }}>{bus.arrival}</div>
                        </div>

                        {/* Price & Action */}
                        <div style={{ flex: '1 1 120px', textAlign: 'center', minWidth: '100px' }}>
                            <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 'bold', color: 'var(--accent-color)' }}>₹{bus.price}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{bus.seatsAvailable} Seats Left</div>
                            <button
                                onClick={() => navigate('/seats', { state: { bus } })}
                                style={{
                                    backgroundColor: 'var(--accent-color)',
                                    color: 'black',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    padding: '0.6rem 1.2rem',
                                    fontSize: '0.85rem',
                                    width: '100%',
                                    maxWidth: '150px'
                                }}>
                                View Seats
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusList;
