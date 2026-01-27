// EmailJS Email Service - Sends emails to USER and OWNER
// Setup: https://www.emailjs.com/
// 1. Create account at emailjs.com
// 2. Add email service (Gmail, Outlook, etc.)
// 3. Create email template with variables: {{to_email}}, {{booking_id}}, {{bus_name}}, {{seats}}, {{total}}, {{route}}
// 4. Get your Service ID, Template ID, and Public Key

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Owner email - receives copy of all booking confirmations
const OWNER_EMAIL = 'purukutapuajayreddy@gmail.com';

const sendEmail = async (toEmail, bookingId, busName, seats, totalAmount, route, isOwnerCopy = false) => {
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
                to_email: toEmail,
                booking_id: bookingId,
                bus_name: busName,
                seats: seats,
                total: `₹${totalAmount}`,
                route: route || 'N/A',
                subject: isOwnerCopy
                    ? `📋 [ADMIN COPY] New Booking - ${bookingId}`
                    : `🎫 Zybus Booking Confirmed - ${bookingId}`,
                message: `
${isOwnerCopy ? '📋 ADMIN NOTIFICATION - NEW BOOKING\n\n' : ''}🎫 ZYBUS BOOKING CONFIRMATION

Dear ${isOwnerCopy ? 'Admin' : 'Customer'},

${isOwnerCopy ? 'A new booking has been made!' : 'Your bus ticket has been booked successfully!'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking ID: ${bookingId}
${isOwnerCopy ? `Customer Email: ${toEmail}\n` : ''}Bus: ${busName}
Route: ${route || 'N/A'}
Seats: ${seats}
Total Paid: ₹${totalAmount}

━━━━━━━━━━━━━━━━━━━━━━━━━━

${isOwnerCopy ? 'Check your admin dashboard for more details.' : 'Thank you for choosing Zybus!\nHave a safe and comfortable journey.'}

Best regards,
Zybus Team
                `.trim()
            }
        })
    });

    return response.ok || response.status === 200;
};

export const sendBookingEmail = async (email, bookingId, busName, seats, totalAmount, route) => {
    // Check if configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.log('📧 EmailJS not configured. Email would be sent to:', email);
        console.log('To enable: Setup EmailJS at https://www.emailjs.com/');
        console.log('Required env vars: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY');
        return { success: false, message: 'Email not configured' };
    }

    try {
        // Send email to USER
        const userEmailSent = await sendEmail(email, bookingId, busName, seats, totalAmount, route, false);

        // Send copy to OWNER
        let ownerEmailSent = false;
        if (email !== OWNER_EMAIL) {
            ownerEmailSent = await sendEmail(OWNER_EMAIL, bookingId, busName, seats, totalAmount, route, true);
        } else {
            ownerEmailSent = true; // Owner is the user, no need to send twice
        }

        if (userEmailSent) {
            console.log('✅ Confirmation email sent to user:', email);
            if (ownerEmailSent) {
                console.log('✅ Copy sent to owner:', OWNER_EMAIL);
            }
            return { success: true, message: 'Email sent successfully' };
        } else {
            console.error('❌ Email failed');
            return { success: false, message: 'Email failed' };
        }
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, message: error.message };
    }
};
