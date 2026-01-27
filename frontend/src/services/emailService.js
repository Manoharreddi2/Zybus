// Web3Forms Email Service - No backend required!
// Get your FREE access key at: https://web3forms.com/

const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE'; // Get your free key at web3forms.com

export const sendBookingEmail = async (email, bookingId, busName, seats, totalAmount, route) => {
    // Check if configured
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
        console.log('📧 Web3Forms not configured. Email would be sent to:', email);
        console.log('To enable: Get free key at https://web3forms.com/');
        return { success: false, message: 'Email not configured' };
    }

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: `🎫 Zybus Booking Confirmed - ${bookingId}`,
                from_name: 'Zybus Tickets',
                to: email,
                message: `
🎫 ZYBUS BOOKING CONFIRMATION

Dear Customer,

Your bus ticket has been booked successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking ID: ${bookingId}
Bus: ${busName}
Route: ${route || 'N/A'}
Seats: ${seats}
Total Paid: ₹${totalAmount}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing Zybus!
Have a safe and comfortable journey.

Best regards,
Zybus Team
                `.trim()
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Confirmation email sent to:', email);
            return { success: true, message: 'Email sent successfully' };
        } else {
            console.error('❌ Email failed:', data);
            return { success: false, message: data.message || 'Email failed' };
        }
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, message: error.message };
    }
};
