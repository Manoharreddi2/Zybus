import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const sendOtpEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Generate OTP
            const newOtp = generateOtp();
            setGeneratedOtp(newOtp);

            // Try to send via backend first
            try {
                const response = await fetch('http://localhost:8080/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp: newOtp })
                });

                if (response.ok) {
                    setStep(2);
                    setMessage(`OTP sent to ${email}. Check your inbox!`);
                    setLoading(false);
                    return;
                }
            } catch (backendError) {
                console.log('Backend not available, using Firebase reset');
            }

            // Fallback: Use Firebase Password Reset
            await sendPasswordResetEmail(auth, email);
            setMessage(`Password reset link sent to ${email}. Check your inbox!`);
            setStep(3);

        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email.');
            } else {
                setError('Failed to send reset email: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = (e) => {
        e.preventDefault();
        setError('');

        if (otp === generatedOtp) {
            setMessage('OTP Verified! You can now reset your password.');
            setStep(3);
            // In a real app, you would redirect to password reset page
            // For now, using Firebase's reset link that was sent
        } else {
            setError('Invalid OTP. Please try again.');
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
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Forgot Password</h2>

                {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {message && <div style={{ color: '#00ff00', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

                {step === 1 && (
                    <form onSubmit={sendOtpEmail}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>
                            Enter your email address and we'll send you a password reset link.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center', opacity: 0.8 }}>
                            📧 Don't forget to check your spam/junk folder!
                        </p>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                style={{ width: '100%', marginTop: '0.5rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                marginBottom: '1rem',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={verifyOtp}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>
                            Enter the 6-digit OTP sent to your email.
                        </p>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>OTP Code</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                style={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    letterSpacing: '0.5rem'
                                }}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', marginBottom: '1rem' }}>
                            Verify OTP
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep(1); setOtp(''); }}
                            style={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--text-secondary)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            Resend OTP
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
                        <p style={{ marginBottom: '1rem' }}>
                            Check your email for the password reset link!
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem', opacity: 0.8 }}>
                            📧 Don't forget to check your spam/junk folder!
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            style={{ width: '100%' }}
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link to="/login" style={{ color: 'var(--accent-color)' }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
