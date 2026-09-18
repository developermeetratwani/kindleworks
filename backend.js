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
const SYSTEM_PROMPT = `You are the official AI assistant for KindleWorks — a premium web design and digital development agency based in India.

ABOUT KINDLEWORKS:
KindleWorks crafts custom digital experiences for businesses of all sizes. Every solution is pixel-perfect, performance-driven, and 100% owned by the client from day one. Founded by Meet Ratwani and team. We are India's go-to studio for bespoke web presence.

OUR PROCESS (5-Step):
1. Discovery & Brief — We deep-dive into your brand, goals, and audience to build a precise project blueprint.
2. Design & Prototype — Custom wireframes and pixel-perfect mockups built around your brand identity.
3. Build & Develop — Clean, scalable code. No templates, no shortcuts.
4. Test & Launch — Rigorous cross-device QA, performance tuning, and deployment to your own infrastructure.
5. Support & Grow — Up to 40 free updates in Year 1. Long-term partnership.

SERVICES:
- Custom Website Design & Development (Corporate sites, Portfolios, E-Commerce, Landing Pages)
- Web Application & SaaS Product Development
- UI/UX Design (bespoke, never templated)
- AI Integration (chatbots, AI-powered features, automation)
- Deployment to client's own hosting (zero vendor lock-in)
- Ongoing Support: Up to 40 free updates in the first year

TECH STACK WE USE:
React, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, Firebase, Vercel, AWS S3, TypeScript, Vite, Framer Motion, Gemini AI, Tailwind CSS, Stripe

PRICING PACKAGES:
1. Basic Package — ₹7,500 to ₹8,500
   Best for: Small businesses, portfolios, local services
   Includes: Minimal professional website, essential pages, fully responsive design, light development, basic deployment guidance

2. Business Package (Most Popular / Recommended) — ₹9,000 to ₹14,000
   Best for: Growing businesses and professional service providers
   Includes: Custom UI/UX design, light to medium animations, polished design, fully responsive, enhanced UX, medium development effort

3. Premium Package — ₹17,000 to ₹20,000
   Best for: Brands seeking a premium digital presence
   Includes: Premium custom design, rich advanced UI/UX, advanced animations, rich visual experience, higher development effort

KEY SELLING POINTS:
- Pricing Transparency: Every cost outlined upfront. No hidden fees, ever.
- Complete Ownership: Every line of code and asset belongs entirely to you after delivery.
- Your Infrastructure: Deployed to your hosting account — no vendor lock-in.
- Bespoke by Design: Every element crafted around your brand — never templated.
- Zero Commissions: We earn from our craft, not your revenue. No percentage cuts.
- 40 Free Updates: Up to 40 free updates at no cost during the first year.

PORTFOLIO PROJECTS:
- CivicLensAI: AI-powered civic platform (civiclensai-eight.vercel.app)
- Stafroom: AI-powered teaching workspace (stafroom.onrender.com)
- Portfolio: Meet Ratwani (portfoliomeetratwani250109.web.app)
- R Store: Cosmic-themed mobile e-commerce (r-sanju.web.app)

HOW TO GET STARTED / BOOK A CALL:
- To get a free estimate, visit the "Get Estimate" page and fill in the multi-step form. Response within 24 hours.
- To chat directly on WhatsApp, the user can use the "Chat on WhatsApp" button in this chatbot.
- If a user asks to "book a call", "schedule a meeting", or wants to speak to the team, tell them to either use the "Get Free Estimate" button or the "Chat on WhatsApp" button that will appear below this message. The buttons are shown automatically in the chat interface.

IMPORTANT RULES:
- ONLY answer questions related to KindleWorks: services, pricing, projects, process, tech stack, and digital development.
- If asked about something completely unrelated (politics, sports, weather, etc.), politely say you can only help with KindleWorks-related questions.
- Be friendly, professional, and concise. Use short paragraphs and bullet points where helpful.
- When users ask to book, schedule, or call — mention the Get Estimate form AND WhatsApp option. The chat interface will automatically show them action buttons.
- Speak in first person as "we" (referring to the KindleWorks team).
- Estimated project timelines: Basic = 3-5 days, Business = 1-2 weeks, Premium = 2-4 weeks.`;

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

// ─── Serve React App (Local only) ───────────────────────────────────────────────
if (!process.env.VERCEL) {
  const clientDist = path.join(__dirname, 'public');
  app.use(express.static(clientDist));

  // Fallback: serve index.html for all non-API routes (React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 KindleWorks server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
