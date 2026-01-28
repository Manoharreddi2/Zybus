import { API_ENDPOINTS } from '../config/api';

/**
 * Create a payment order on the backend
 * @param {number} amount - Amount in INR
 * @returns {Promise<Object>} Order details including orderId and keyId
 */
export const createPaymentOrder = async (amount) => {
    try {
        const response = await fetch(API_ENDPOINTS.createPaymentOrder, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create payment order. Please try again.');
        }

        return response.json();
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Server is starting up. Please wait 1-2 minutes and try again.');
        }
        throw error;
    }
};

/**
 * Verify payment on the backend
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async (orderId, paymentId, signature) => {
    const response = await fetch(API_ENDPOINTS.verifyPayment, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentId, signature })
    });

    if (!response.ok) {
        throw new Error('Payment verification failed');
    }

    return response.json();
};

/**
 * Open Razorpay payment modal
 * @param {Object} options - Payment options
 * @returns {Promise<Object>} Payment result
 */
export const openRazorpayCheckout = (options) => {
    return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
            key: options.keyId,
            amount: options.amount,
            currency: options.currency || 'INR',
            name: 'Zybus',
            description: options.description || 'Bus Ticket Booking',
            order_id: options.orderId,
            prefill: {
                email: options.email || '',
                contact: options.contact || ''
            },
            theme: {
                color: '#FFD700' // Zybus accent color
            },
            handler: function (response) {
                // Payment successful
                resolve({
                    success: true,
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature
                });
            },
            modal: {
                ondismiss: function () {
                    reject(new Error('Payment cancelled by user'));
                }
            }
        });

        rzp.on('payment.failed', function (response) {
            reject(new Error(response.error.description || 'Payment failed'));
        });

        rzp.open();
    });
};
