import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini API client lazily
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// 1. AI Feature: Carbon Coach Chat API Proxy
app.post("/api/coach", async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAiClient();
    
    // Inject system directive and carbon context for personalized advice
    const systemPrompt = `
      You are EcoCoach, a supportive, gamified, and highly knowledgeable AI carbon coach for the EcoVerse platform.
      The user is building their carbon story.
      Give them short, practical, action-oriented, and bio-luminous themed suggestions.
      Current Carbon Context of the user:
      - Monthly Carbon Budget: 192 kg CO2 (Paris Target)
      - User's actual monthly net balance: ${context?.balance?.toFixed(1) || 'N/A'} kg
      - Consecutive streak days: ${context?.streak || 0} days
      - Selected Sandbox Lifestyle Settings: Bike Commutes ${context?.simState?.bikeDays || 0} days/wk, Veggie Days ${context?.simState?.veggieDays || 0} days/wk, LED bulbs ${context?.simState?.ledBulbs || 0}.

      Answer the user's question or respond to their message in 2 to 3 concise, extremely encouraging sentences. Use 1 or 2 eco-themed emojis to keep it engaging.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Message: ${message}` }] }
      ]
    });

    const reply = response.text || "I'm analyzing your carbon stream. Let's make an impact today! 🌿";
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini Coach API Error:", err.message);
    res.status(500).json({ error: "EcoCoach is currently absorbing cosmic rays. Please check back shortly!", details: err.message });
  }
});

// 2. Real-time Feature: Dynamic Environmental News and Insights Stream
// Generates or lists daily planetary real-time logs to make the application feel active and alive
app.get("/api/news", async (req, res) => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{
            text: `Generate a list of 4 real-time climate or ecological positive progress headline statements.
            Format the response as a strict JSON array of strings. Do not include markdown codeblocks, just the JSON string array.
            Examples of good headlines:
            - "Costa Rica powered 99.2% of its grid with clean geothermal energy this week."
            - "Arctic sea research team outlines a new plan to slow shelf ice melting using nano-materials."
            - "Over 24,000 hectares of carbon-sink mangrove forests restored along the Mumbai coastline."
            Keep them brief, optimistic, inspiring, and factual or scientific.`
          }]
        }
      ]
    });

    let headlinesString = response.text || "";
    // Clean potential markdown wrap
    headlinesString = headlinesString.trim();
    if (headlinesString.startsWith("```json")) {
      headlinesString = headlinesString.substring(7);
    } else if (headlinesString.startsWith("```")) {
      headlinesString = headlinesString.substring(3);
    }
    if (headlinesString.endsWith("```")) {
      headlinesString = headlinesString.substring(0, headlinesString.length - 3);
    }
    
    const headlines = JSON.parse(headlinesString.trim());
    res.json({ headlines });
  } catch (err: any) {
    // Elegant fallback news feed if API rate limited or key missing
    const fallback = [
      "Paris Agreement standard individual threshold set to 192 kg CO₂/month.",
      "Vibrant seagrass meadow expansion project succeeds in capturing blue carbon offshore.",
      "Solar high-voltage lines installed to stream clean power to municipal suburbs.",
      "Renewable active travel routes grow by 15% across urban communities."
    ];
    res.json({ headlines: fallback });
  }
});

// Set up Vite Middleware for Development or serve built client static assets for Production
async function startServer() {
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
    console.log(`EcoVerse backend server running on port ${PORT}`);
  });
}

startServer();
