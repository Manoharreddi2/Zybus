// EmailJS Email Service - Sends emails to USER's email address
// Setup: https://www.emailjs.com/
// 1. Create account at emailjs.com
// 2. Add email service (Gmail, Outlook, etc.)
// 3. Create email template with variables: {{to_email}}, {{booking_id}}, {{bus_name}}, {{seats}}, {{total}}, {{route}}
// 4. Get your Service ID, Template ID, and Public Key

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const sendBookingEmail = async (email, bookingId, busName, seats, totalAmount, route) => {
    // Check if configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.log('📧 EmailJS not configured. Email would be sent to:', email);
        console.log('To enable: Setup EmailJS at https://www.emailjs.com/');
        console.log('Required env vars: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY');
        return { success: false, message: 'Email not configured' };
    }

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: {
                    to_email: email,
                    booking_id: bookingId,
                    bus_name: busName,
                    seats: seats,
                    total: `₹${totalAmount}`,
                    route: route || 'N/A',
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
                }
            })
        });

        if (response.ok || response.status === 200) {
            console.log('✅ Confirmation email sent to:', email);
            return { success: true, message: 'Email sent successfully' };
        } else {
            const errorText = await response.text();
            console.error('❌ Email failed:', errorText);
            return { success: false, message: errorText || 'Email failed' };
        }
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, message: error.message };
    }
};
