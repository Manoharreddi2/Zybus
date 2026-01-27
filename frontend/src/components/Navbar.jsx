import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

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
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #222'
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--accent-color)' }}>Zy</span>bus
            </Link>
            <div>
                {currentUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{currentUser.email}</span>
                        <button onClick={handleLogout} style={{ fontSize: '0.9rem' }}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login">
                            <button style={{ marginRight: '10px' }}>Login</button>
                        </Link>
                        <Link to="/signup">
                            <button>Sign Up</button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
