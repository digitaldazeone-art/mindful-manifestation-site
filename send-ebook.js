import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = 'Mindful Manifestation <onboarding@resend.dev>';
const ebookUrl = 'https://mindfulmanifestation.life/ebook.pdf';

export async function handler(event) {
  // Handle preflight OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Ensure the request method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  
  // Check for the API key at the very beginning
  if (!process.env.RESEND_API_KEY) {
    console.error('Resend API Key is not set.');
    return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Server configuration error: Email service is not set up.' }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Email is required.' }),
      };
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Your Free Mindful Manifestation Ebook is Here!</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h1 style="color: #6B46C1;">Thank you for subscribing!</h1>
          <p>Here is your free Mindful Manifestation Ebook. We're so excited to have you on this journey with us.</p>
          <p style="margin: 30px 0;">
            <a href="${ebookUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #c09a69; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Click here to download your ebook
            </a>
          </p>
          <p>With gratitude,</p>
          <p>The Mindful Manifestation Team</p>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Your Free Mindful Manifestation Ebook is Here!',
      html: emailHtml,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Success! Your ebook has been sent.' }),
    };

  } catch (error) {
    console.error('Function Error:', error);
    const errorMessage = error.message || 'An unknown error occurred while sending the email.';
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: errorMessage }),
    };
  }
}
