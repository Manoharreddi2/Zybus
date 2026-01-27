import React from 'react';
import SearchBus from '../components/SearchBus';

const Home = () => {
    return (
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            padding: 'clamp(1rem, 4vw, 2rem)',
            textAlign: 'center'
        }}>
            <h1 style={{
                fontSize: 'clamp(1.75rem, 6vw, 3rem)',
                marginBottom: '0.5rem',
                lineHeight: 1.2
            }}>
                Travel with <span style={{ color: 'var(--accent-color)' }}>Style</span>
            </h1>
            <p style={{
                color: 'var(--text-secondary)',
                marginBottom: 'clamp(1rem, 3vw, 2rem)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
            }}>
                Premium bus booking experience in dark mode.
            </p>
            <div style={{ width: '100%', maxWidth: '900px' }}>
                <SearchBus />
            </div>
        </div>
    );
};

export default Home;
