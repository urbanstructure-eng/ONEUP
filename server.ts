import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import Mailgun from "mailgun.js";
import formData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const mailgun = new Mailgun(formData);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API upload route for exact branding assets
  app.post("/api/upload-asset", (req, res) => {
    try {
      const { filename, data } = req.body;
      if (!filename || !data) {
        return res.status(400).json({ error: "Missing filename or data" });
      }
      const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, filename), buffer);

      const assetsDir = path.join(process.cwd(), "src/assets/images");
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(assetsDir, filename), buffer);

      console.log(`Asset ${filename} saved successfully (${buffer.length} bytes)`);
      return res.status(200).json({ success: true, url: `/${filename}?t=${Date.now()}` });
    } catch (err: any) {
      console.error("Asset upload error:", err);
      return res.status(500).json({ error: err.message || "Upload failed" });
    }
  });

  // API routes
  app.post("/api/send-email", async (req, res) => {
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
      console.error("Mailgun configuration is missing");
      return res.status(500).json({ error: "Email service not configured. Please add MAILGUN_API_KEY and MAILGUN_DOMAIN to your environment variables." });
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

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error("Error sending email via Mailgun:", error);
      res.status(500).json({ 
        error: "Failed to send email", 
        details: error.message || "Unknown error"
      });
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
