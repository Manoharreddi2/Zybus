import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loginWithGoogle, loginWithDemo } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to login: ' + err.message);
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
            alignItems: 'flex-start',
            padding: '1rem',
            marginTop: 'clamp(1rem, 5vw, 5rem)',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                boxSizing: 'border-box'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>Login</h2>
                {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', wordBreak: 'break-word' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            required
                            style={{ width: '100%', boxSizing: 'border-box', fontSize: '16px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            required
                            style={{ width: '100%', boxSizing: 'border-box', fontSize: '16px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem' }}>Login</button>
                </form>
                <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>OR</div>
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        width: '100%',
                        backgroundColor: '#db4437',
                        color: 'white',
                        marginBottom: '1rem',
                        padding: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#fff" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                    </svg>
                    Login with Google
                </button>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Need an account? <Link to="/signup" style={{ color: 'var(--accent-color)' }}>Sign Up</Link>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Forgot Password?
                    </Link>
                </div>

                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem', textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await loginWithDemo();
                                navigate('/');
                            } catch (e) {
                                setError("Demo login failed");
                            }
                        }}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--text-secondary)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            padding: '0.5rem 1rem',
                            width: '100%'
                        }}
                    >
                        Skip & Enter as Guest (Demo)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
