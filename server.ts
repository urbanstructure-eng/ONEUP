import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Mailgun from "mailgun.js";
import formData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/send-email", async (req, res) => {
    const { name, email, service, message } = req.body;

    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      console.error("Mailgun configuration is missing");
      return res.status(500).json({ error: "Email service not configured" });
    }

    try {
      const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `OneUp Contact <postmaster@${process.env.MAILGUN_DOMAIN}>`,
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
          <h2>New Project Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error sending email via Mailgun:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
