// EmailJS Email Service - Sends emails to USER and OWNER
// Setup: https://www.emailjs.com/
// 1. Create account at emailjs.com
// 2. Add email service (Gmail, Outlook, etc.)
// 3. Create email template - IMPORTANT: Set "To Email" field to: {{to_email}}
// 4. Get your Service ID, Template ID, and Public Key

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Owner email - receives copy of all booking confirmations
const OWNER_EMAIL = 'manoharreddy2210@gmail.com';

const sendSingleEmail = async (toEmail, userEmail, bookingId, busName, seats, totalAmount, route, isOwnerCopy = false) => {
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
                    to_email: toEmail,
                    user_email: userEmail,
                    booking_id: bookingId,
                    bus_name: busName,
                    seats: seats,
                    total: `₹${totalAmount}`,
                    route: route || 'N/A',
                    subject: isOwnerCopy
                        ? `📋 [ADMIN] New Booking - ${bookingId}`
                        : `🎫 Zybus Booking Confirmed - ${bookingId}`,
                    message: `
${isOwnerCopy ? '📋 ADMIN NOTIFICATION - NEW BOOKING\n\n' : ''}🎫 ZYBUS BOOKING CONFIRMATION

Dear ${isOwnerCopy ? 'Admin' : 'Customer'},

${isOwnerCopy ? 'A new booking has been made!' : 'Your bus ticket has been booked successfully!'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking ID: ${bookingId}
${isOwnerCopy ? `Customer Email: ${userEmail}\n` : ''}Bus: ${busName}
Route: ${route || 'N/A'}
Seats: ${seats}
Total Paid: ₹${totalAmount}

━━━━━━━━━━━━━━━━━━━━━━━━━━

${isOwnerCopy ? 'Check your dashboard for details.' : 'Thank you for choosing Zybus!\nHave a safe and comfortable journey.'}

Best regards,
Zybus Team
                    `.trim()
                }
            })
        });

        return response.ok || response.status === 200;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

export const sendBookingEmail = async (userEmail, bookingId, busName, seats, totalAmount, route) => {
    // Check if configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.log('📧 EmailJS not configured. Email would be sent to:', userEmail);
        console.log('To enable: Setup EmailJS at https://www.emailjs.com/');
        console.log('Required env vars: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY');
        return { success: false, message: 'Email not configured' };
    }

    try {
        console.log('📧 Sending email to user:', userEmail);

        // Send email to USER
        const userEmailSent = await sendSingleEmail(
            userEmail,      // Send TO user
            userEmail,      // User's email for reference
            bookingId,
            busName,
            seats,
            totalAmount,
            route,
            false           // Not owner copy
        );

        console.log('📧 User email result:', userEmailSent);

        // Send copy to OWNER (only if user is not the owner)
        let ownerEmailSent = true;
        if (userEmail.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
            console.log('📧 Sending admin copy to:', OWNER_EMAIL);
            ownerEmailSent = await sendSingleEmail(
                OWNER_EMAIL,    // Send TO owner
                userEmail,      // User's email for reference
                bookingId,
                busName,
                seats,
                totalAmount,
                route,
                true            // Owner copy
            );
            console.log('📧 Owner email result:', ownerEmailSent);
        }

        if (userEmailSent) {
            console.log('✅ Confirmation email sent to user:', userEmail);
            return { success: true, message: 'Email sent successfully' };
        } else {
            console.error('❌ User email failed');
            return { success: false, message: 'Email failed' };
        }
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, message: error.message };
    }
};
