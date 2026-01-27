import React from 'react';
import SearchBus from '../components/SearchBus';

const Home = () => {
    return (
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh'
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                Travel with <span style={{ color: 'var(--accent-color)' }}>Style</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Premium bus booking experience in dark mode.
            </p>
            <div style={{ width: '100%', maxWidth: '900px' }}>
                <SearchBus />
            </div>
        </div>
    );
};

export default Home;
