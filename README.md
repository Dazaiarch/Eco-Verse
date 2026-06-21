# 🌍 EcoVerse: Your Carbon Story, Reimagined

![EcoVerse Github Banner](./src/assets/images/ecoverse_github_banner_1782064050611.jpg)

> **EcoVerse** is a fully gamified, interactive personal carbon-story sandbox aligned with standard individual Paris Agreement caps (192 kg CO₂/month max). Connect a secure authenticated session to watch a live digital mirror of Earth heal or decay based on your consumption logs, compete in daily interactive quests, simulate future lifestyle pivots, and consult your real-time **EcoCoach AI** powered by Gemini.

---

## ✨ Features \& Architecture Overview

### 1. 🌍 The Biosphere Mirror (Digital Twin)
An immersive, reactive 3D canvas rendering representing the state of the Earth. 
* **Dynamic Feedback Loop**: As you log your activities (commutes, veggie meals, plastic waste, energy usage), the globe reacts. High carbon overhead cracks and heats up the surface, while sustainable actions nourish a lush, bioluminescent green atmosphere.
* **Responsive Visual Transitions**: Programmed using custom standard React layout states with `motion/react` springs and keyframes for high-performance visual fidelity.

### 2. 🧠 EcoCoach AI — Server-Side Proxy (Gemini API)
A fully functional personal carbon counselor integrated at the root of the app.
* **Context-Aware Analytics**: Sends your current net carbon balance, streak multipliers, and lifestyle factors to customized server-side proxy routes.
* **Intelligent Strategy Generation**: Suggests targeted carbon-offset methods like blue carbon seafloor projects, local seasonal crops, home insulation adjustments, and transport shifts.
* **Enterprise Guardrails**: Leverages the `gemini-2.5-flash` model via `@google/genai` on server-side nodes, ensuring API keys are never leaked to client runtimes.

### 3. 🔥 Interactive Quest & Daily Multipliers
* **Active Mission Cards**: Complete gamified tasks (e.g., *Double Transit Commute*, *Meatless Monday Streak*) to claim **EcoCoins** and compound daily streak multipliers.
* **Proactive Status Monitor**: Follows the user's active check-in cadence to record consecutive streak days across logins.

### 4. 🎚️ lifestyle Sandbox & What-If Simulator
* **Configurable Pivots**: Shift sliders for meatless meals, public transport commutes, solar array installations, and smart home lighting.
* **Real-time Projection Engine**: Dynamically calculates and charts how adjustments translate to cumulative yearly CO₂ savings, presenting clear physical metrics.

### 5. 🗄️ Real-time Firestore Sync & Dev-Guest Gateway
* **Seamless Google Popup Login**: Authenticates via Firebase Authentication to load and store data directly across user profiles.
* **Sandbox Bypass Mode**: Includes an automated Guest Bypass that instantly syncs records for local development and sandboxed iframe previews.
* **Resilient Schema Design**: Dual-mode caching (LocalState persistent fallback + live Firestore document updates) for bulletproof offline-first operation.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React (Vite, TypeScript, Tailwind CSS)
* **Animation System**: Framer Motion (`motion/react`)
* **Icons**: Lucide React
* **Backend Ingress Proxy**: Express (Node.js Custom Server)
* **Cloud Database & Auth**: Google Firebase (Firestore \& Authentication)
* **GenAI Engine**: `@google/genai` (SDK utilizing server-side endpoint isolation)

---

## 🚀 Running Locally & Configuration

### Prerequisites
Make sure you have Node.js 18+ and `npm` installed.

### 1. Environment Configuration
Create file `.env` in the root folder, adding:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Spin up Dev Server
Runs the high-speed combination of the Express API Proxy and Vite middleware on port `3000`:
```bash
npm run dev
```

### 4. Build for Production
Compiles client assets and bundles server.ts safely into a self-contained CommonJS target (`dist/server.cjs`) using `esbuild`:
```bash
npm run build
npm start
```

---

## 🎯 Paris Budget Realignment Details

Individual average carbon output targets must drop below **192 kg CO₂/month** (2.3 tons per year) to stabilize planetary heating. *EcoVerse* visualizes this threshold dynamically, contrasting net balance levels, logged offsets, and target boundaries. Let us transform standard carbon audits into an active digital story! 🌿💚
