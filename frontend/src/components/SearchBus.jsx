import React, { useState } from 'react';
import CitySelector from './CitySelector';
import { useNavigate } from 'react-router-dom';

const SearchBus = () => {
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (fromCity && toCity && date) {
            navigate(`/buses?from=${fromCity}&to=${toCity}&date=${date}`);
        } else {
            alert("Please select all fields");
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            marginTop: '2rem',
            border: '1px solid #222'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-color)' }}>
                Book Your Bus Ticket
            </h2>
            <form onSubmit={handleSearch} style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
            }}>
                <CitySelector
                    label="From"
                    value={fromCity}
                    onChange={setFromCity}
                    exclude={toCity}
                />
                <CitySelector
                    label="To"
                    value={toCity}
                    onChange={setToCity}
                    exclude={fromCity}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Travel Date</label>
                    <input
                        type="date"
                        value={date}
                        className="dark-date-picker"
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        style={{
                            padding: '0.8rem',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid #333',
                            color: 'var(--text-primary)',
                            borderRadius: '8px',
                            width: '100%',
                            boxSizing: 'border-box' // Fix width issue
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '0.8rem 2rem',
                        backgroundColor: 'var(--accent-color)',
                        color: 'black',
                        fontWeight: 'bold',
                        border: 'none',
                        height: 'fit-content',
                        marginBottom: '2px' // Alignment adjustment
                    }}
                >
                    Search Buses
                </button>
            </form>
        </div>
    );
};

export default SearchBus;
