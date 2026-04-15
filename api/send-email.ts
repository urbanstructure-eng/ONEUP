import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);

export default async function handler(req: any, res: any) {
  // Vercel handles body parsing automatically for JSON
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, service, message } = req.body;

  const rawDomain = process.env.MAILGUN_DOMAIN || "";
  const domain = rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const apiKey = process.env.MAILGUN_API_KEY;
  
  // Validate MAILGUN_URL - must be a valid Mailgun API endpoint
  let url = "https://api.mailgun.net";
  const envUrl = process.env.MAILGUN_URL;
  if (envUrl && envUrl.includes("mailgun.net") && envUrl.startsWith("http")) {
    url = envUrl;
  }

  if (!apiKey || !domain) {
    return res.status(500).json({ error: "Email service not configured. Please add MAILGUN_API_KEY and MAILGUN_DOMAIN to your Vercel environment variables." });
  }

  try {
    const mg = mailgun.client({
      username: "api",
      key: apiKey,
      url: url,
    });

    const result = await mg.messages.create(domain, {
      from: `OneUp Contact <mailgun@${domain}>`,
      to: ["urbanstructure@gmail.com"],
      subject: `New Inquiry from ${name} - ${service}`,
      text: `
New Project Inquiry
Name: ${name}
Email: ${email}
Service: ${service}
Message: ${message}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Project Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <strong>Message:</strong><br/>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error sending email via Mailgun:", error);
    return res.status(500).json({ 
      error: "Failed to send email", 
      details: error.message || "Unknown error"
    });
  }
}
