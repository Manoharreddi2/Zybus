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
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
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
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', marginBottom: '1rem' }}>Login</button>
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
                    Login with Google
                </button>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    Need an account? <Link to="/signup" style={{ color: 'var(--accent-color)' }}>Sign Up</Link>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Forgot Password?
                    </Link>
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem', textAlign: 'center' }}>
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
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem'
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
