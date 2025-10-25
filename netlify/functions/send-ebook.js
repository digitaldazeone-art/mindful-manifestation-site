import { Resend } from 'resend';

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('FATAL: RESEND_API_KEY environment variable is not set in Netlify.');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error: The email service is not set up correctly.' }),
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const { email } = JSON.parse(event.body);

    if (!email || typeof email !== 'string') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'A valid email address is required.' }) };
    }

    const fromEmail = 'Mindful Manifestation <onboarding@resend.dev>';
    const ebookUrl = 'https://mindfulmanifestation.life/ebook.pdf';
    
    const emailHtml = `
      <!DOCTYPE html><html><head><title>Your Free Mindful Manifestation Ebook!</title></head><body style="font-family: sans-serif; text-align: center; padding: 20px; background-color: #fdfaf5;"><h1 style="color: #6B46C1;">Thank You! Your Journey Begins Now.</h1><p style="font-size: 16px; color: #3a3a3a;">Your free Mindful Manifestation Ebook is here! We are so excited to have you on this path with us.</p><p style="margin: 30px 0;"><a href="${ebookUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #c09a69; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">Download Your Ebook</a></p><p style="color: #6b6b6b;">With gratitude,<br>The Mindful Manifestation Team</p></body></html>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '✨ Your Free Mindful Manifestation Ebook is Here!',
      html: emailHtml,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return { statusCode: 502, headers, body: JSON.stringify({ error: `The email provider failed: ${error.message}` }) };
    }

    console.log(`Email sent successfully to ${email}. ID: ${data.id}`);
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Success! Your ebook has been sent.' }) };

  } catch (e) {
    console.error('General Function Error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'An unexpected error occurred. Please check the data sent.' }) };
  }
}
