require('dotenv').config({ path: require('path').resolve(__dirname, '.env'), override: true });

const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const supportSchema = new mongoose.Schema({
  type:        { type: String, enum: ['estimate', 'chat_contact'], required: true },
  name:        { type: String, default: '' },
  email:       { type: String, default: '' },
  projectType: { type: String, default: '' },
  timeline:    { type: String, default: '' },
  budget:      { type: String, default: '' },
  message:     { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now },
});

const Support = mongoose.model('kindleworks support', supportSchema);

if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'YOUR_MONGODB_URI_HERE') {
  const mongoUri = process.env.MONGODB_URI.replace(/^"|"$/g, ''); // strip quotes if any
  mongoose
    .connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected — collection: kindleworks support'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));
} else {
  console.warn('⚠️  MONGODB_URI not set — customer data will not be stored.');
}

// ─── Gemini AI ────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the official AI assistant for KindleWorks — a premium web design and digital development agency.

ABOUT KINDLEWORKS:
KindleWorks crafts custom digital experiences for businesses. Every solution is pixel-perfect, performance-driven, and 100% owned by the client from day one. Founded by Meet Ratwani and team.

SERVICES:
- Custom Website Design & Development (Corporate sites, Portfolios, E-Commerce, Landing Pages)
- Web Application & SaaS Product Development
- UI/UX Design (bespoke, never templated)
- Deployment to client's own infrastructure (zero vendor lock-in)
- Ongoing Support: Up to 40 free updates in the first year

PRICING PACKAGES:
1. Basic Package — ₹7,500 to ₹8,500
   Best for: Small businesses, portfolios, local services
   Includes: Minimal professional website, essential pages, fully responsive design, light development, basic deployment guidance

2. Business Package (Most Popular) — ₹9,000 to ₹14,000
   Best for: Growing businesses and professional service providers
   Includes: Custom UI/UX design, light to medium animations, polished design, fully responsive, enhanced UX, medium development effort

3. Premium Package — ₹17,000 to ₹20,000
   Best for: Brands seeking a premium digital presence
   Includes: Premium custom design, rich advanced UI/UX, advanced animations, rich visual experience, higher development effort

KEY SELLING POINTS:
- Pricing Transparency: Every cost is outlined upfront. No hidden fees, no surprise invoices, ever.
- Complete Ownership: Upon delivery, every line of code, design asset, and element belongs entirely to the client.
- Client Infrastructure: Website is deployed directly to the client's hosting account — no vendor lock-in.
- Bespoke by Design: Every element is crafted around the client's brand identity — never templated, always unique.
- Zero Commissions: KindleWorks earns from craft, not your revenue. No commissions, no percentage cuts.
- 40 Free Updates: Up to 40 free updates at no cost during the first year.

PORTFOLIO PROJECTS:
- CivicLensAI: AI-powered civic platform (civiclensai-eight.vercel.app)
- Stafroom: AI-powered teaching workspace (stafroom.onrender.com)
- Portfolio: Meet Ratwani (portfoliomeetratwani250109.web.app)
- R Store: Cosmic-themed mobile e-commerce (r-sanju.web.app)

HOW TO GET STARTED:
- Visit the "Get Estimate" page and fill in the multi-step form with your project type, timeline, and budget.
- The team will review and respond with a custom estimate.

IMPORTANT RULES:
- ONLY answer questions related to KindleWorks: its services, pricing, projects, process, and digital development topics.
- If asked about something completely unrelated (politics, sports, weather, etc.), politely say you can only help with KindleWorks-related questions.
- Be friendly, professional, and concise. Use short paragraphs.
- When a user wants to contact the team or get an estimate, encourage them to use the estimate form or provide their name and email.
- Speak in first person as "we" (referring to the KindleWorks team).`;

let genAI;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log(`✅ Gemini AI initialized — model: ${GEMINI_MODEL}`);
} else {
  console.warn('⚠️  GEMINI_API_KEY not set — will try OpenRouter fallback.');
}

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
if (OPENROUTER_KEY) console.log('✅ OpenRouter API key found (fallback ready)');

// ─── API Routes ───────────────────────────────────────────────────────────────

// POST /api/chat — Gemini AI chat
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required.' });

  // ── Try Gemini first ─────────────────────────────────────────────────────
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: SYSTEM_PROMPT,
      });

      const chatHistory = history.map((h) => ({
        role: h.role === 'bot' ? 'model' : 'user',
        parts: [{ text: h.text }],
      })).filter(h => h.role === 'model' || h.role === 'user');

      const chat = model.startChat({ history: chatHistory });
      const result = await chat.sendMessage(message);
      const reply = result.response.text();
      return res.json({ reply });
    } catch (err) {
      console.error('Gemini error:', err.message, '— trying OpenRouter fallback...');
    }
  }

  // ── OpenRouter fallback ───────────────────────────────────────────────────
  if (OPENROUTER_KEY) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(h => ({ role: h.role === 'bot' ? 'assistant' : 'user', content: h.text })),
        { role: 'user', content: message },
      ];

      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://kindleworks.in',
          'X-Title': 'KindleWorks AI',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages,
        }),
      });

      const orData = await orRes.json();
      const reply = orData?.choices?.[0]?.message?.content;
      if (reply) return res.json({ reply });
      throw new Error('Empty OpenRouter response');
    } catch (err) {
      console.error('OpenRouter error:', err.message);
    }
  }

  // ── Hard fallback ─────────────────────────────────────────────────────────
  res.json({
    reply: "I'm having trouble connecting right now. Please try again in a moment, or click 'Get Estimate' to reach our team directly!",
  });
});

// POST /api/estimate — Save estimate request to MongoDB
app.post('/api/estimate', async (req, res) => {
  const { name, email, projectType, timeline, budget } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const doc = new Support({ type: 'estimate', name, email, projectType, timeline, budget });
      await doc.save();
      console.log(`📩 Estimate saved — ${name} <${email}>`);
    } else {
      console.log(`📩 Estimate (not saved — no DB): ${name} <${email}> | ${projectType} | ${timeline} | ${budget}`);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Estimate save error:', err.message);
    res.status(500).json({ error: 'Failed to save estimate. Please try again.' });
  }
});

// POST /api/contact — Save chat contact request to MongoDB
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (mongoose.connection.readyState === 1) {
      const doc = new Support({ type: 'chat_contact', name, email, message });
      await doc.save();
      console.log(`💬 Chat contact saved — ${name} <${email}>`);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Contact save error:', err.message);
    res.status(500).json({ error: 'Failed to save contact.' });
  }
});

// ─── Serve React App ──────────────────────────────────────────────────────────
const clientDist = path.join(__dirname, 'public');
app.use(express.static(clientDist));

// Fallback: serve index.html for all non-API routes (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 KindleWorks server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
