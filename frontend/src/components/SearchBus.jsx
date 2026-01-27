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
            padding: 'clamp(1rem, 4vw, 2rem)',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            marginTop: '1.5rem',
            border: '1px solid #222'
        }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: 'clamp(1rem, 3vw, 2rem)',
                color: 'var(--accent-color)',
                fontSize: 'clamp(1.1rem, 4vw, 1.5rem)'
            }}>
                Book Your Bus Ticket
            </h2>
            <form onSubmit={handleSearch} style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: '1 1 200px', minWidth: '0' }}>
                    <CitySelector
                        label="From"
                        value={fromCity}
                        onChange={setFromCity}
                        exclude={toCity}
                    />
                </div>
                <div style={{ flex: '1 1 200px', minWidth: '0' }}>
                    <CitySelector
                        label="To"
                        value={toCity}
                        onChange={setToCity}
                        exclude={fromCity}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    flex: '1 1 200px',
                    minWidth: '0'
                }}>
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
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '0.8rem 1.5rem',
                        backgroundColor: 'var(--accent-color)',
                        color: 'black',
                        fontWeight: 'bold',
                        border: 'none',
                        height: 'fit-content',
                        flex: '1 1 150px',
                        minWidth: '120px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                    }}
                >
                    Search Buses
                </button>
            </form>
        </div>
    );
};

export default SearchBus;
