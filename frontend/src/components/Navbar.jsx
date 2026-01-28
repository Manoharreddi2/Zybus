import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #222',
            flexWrap: 'wrap',
            gap: '0.5rem'
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--accent-color)' }}>Zy</span>bus
            </Link>

            {/* Mobile menu toggle */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                    display: 'none',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0.25rem'
                }}
                className="mobile-menu-btn"
            >
                ☰
            </button>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
            }} className={menuOpen ? 'nav-links-open' : ''}>
                {currentUser ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <Link to="/my-profile" style={{ textDecoration: 'none' }}>
                            <button style={{
                                fontSize: '0.85rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--accent-color)',
                                color: 'var(--accent-color)'
                            }}>
                                My Profile
                            </button>
                        </Link>
                        <span style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {currentUser.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                fontSize: '0.85rem',
                                padding: '0.5rem 1rem'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link to="/login">
                            <button style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Login</button>
                        </Link>
                        <Link to="/signup">
                            <button style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Sign Up</button>
                        </Link>
                    </div>
                )}
            </div>

            <style>{`
                @media screen and (max-width: 480px) {
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    .nav-links-open {
                        width: 100%;
                        justify-content: center;
                        padding-top: 0.5rem;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
