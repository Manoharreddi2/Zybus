import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }
        try {
            setError('');
            await signup(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to create account: ' + err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Failed to login with Google: ' + err.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '5rem'
        }}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '2rem',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>
                {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            required
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', marginBottom: '1rem' }}>Sign Up</button>
                </form>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>OR</div>
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        width: '100%',
                        backgroundColor: '#db4437',
                        color: 'white',
                        marginBottom: '1rem'
                    }}
                >
                    Sign Up with Google
                </button>
                <div style={{ textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
