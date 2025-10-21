const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event, context) {
  console.log("Incoming request:", { method: event.httpMethod, body: event.body });

  if (event.httpMethod !== 'POST') {
    console.error("Invalid HTTP method:", event.httpMethod);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  let email;
  try {
    const data = JSON.parse(event.body);
    email = data.email;
    console.log("Parsed email from request:", email);
  } catch (err) {
    console.error("Error parsing request body:", err);
    return { statusCode: 400, body: 'Invalid request body.' };
  }
  if (!email) {
    console.error("No email provided in request.");
    return { statusCode: 400, body: 'Email required.' };
  }

  const msg = {
    to: email,
    from: 'iamabundance@themindfulmanifestation.com', // Your verified sender
    subject: 'Your Mindful Manifestation Ebook',
    html: `
      <h1>Thank you for signing up!</h1>
      <p>Your ebook, <strong>The Mindful Manifestation Guide</strong>, is ready for you.</p>
      <p>Click <a href="https://mindfulmanifestation.life/ebook.pdf" target="_blank">here to download your ebook</a>.</p>
      <p>If you have any issues, feel free to reply to this email!</p>
    `
  };

  try {
    const response = await sgMail.send(msg);
    console.log("SendGrid response:", response);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error("SendGrid error:", error, error.response && error.response.body);
    return { statusCode: 500, body: JSON.stringify({ error: error.message, details: error.response && error.response.body }) };
  }
};
