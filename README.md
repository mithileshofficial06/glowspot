# 🌟 GlowSpot Hyderabad

> **AI-Powered Luxury Beauty Salon Marketplace & Virtual Styling Platform**
> 
> *A premium, dark-obsidian themed web application tailored for Hyderabad, India. Combining generative AI, real-time weather feeds, virtual try-ons, and dynamic wedding planning to deliver a state-of-the-art beauty experience.*

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.35-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Zustand v5](https://img.shields.io/badge/Zustand-5.0.14-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.40.0-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA-NIM_AI-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://build.nvidia.com/)

---

## 📸 Key Features

### 1. 🤖 AI Chat Advisor (`/advisor`)
*   **SSE Streaming Output**: Live-token streaming powered by Server-Sent Events (SSE). Experience instantaneous response rendering.
*   **Weather-Driven Skincare**: Calls the **Open-Meteo API** to fetch Hyderabad's real-time temperature, humidity, and Air Quality Index (US AQI/PM2.5) to suggest weather-adapted products and skincare rituals.
*   **Voice Control & Speech Synthesis**: Talk to the advisor hands-free via the browser's `webkitSpeechRecognition`. AI replies out loud with premium localized Indian voices.
*   **Zustand Persisted Store**: Connects to the user's face shape profile so the AI advisor knows facial properties before the conversation starts.

### 2. 💄 Face Preview & Virtual Try-On (`/preview`)
*   **Vision Face Analyzer**: Uses `meta/llama-3.2-90b-vision-instruct` to extract face shape, undertone, and recommended styling parameters from a user-uploaded portrait.
*   **HTML5 Canvas Overlays**: Move interactive nodes (`Lip`, `Blsh`, `Hair`) to try on styles in real time:
    *   *Lipstick*: Ruby Red, Nude Pink, Plum Wine, Peach Satin (with opacity adjusters).
    *   *Blush*: Symmetrical dual-point gradients (Rose Petal, Peach Glow, Golden Hue).
    *   *Highlights*: Radial gradient-mapped color rings (Caramel, Burgundy, Honey Blonde, Ash Silver).
*   **Consultation Sidebar**: Dedicated chatbot answering questions about your specific analyzed facial contours and styles.

### 3. 📅 AI Wedding Beauty Planner (`/planner`)
*   **Cultural Style Presets**: Custom configurations for **Classic Telugu Bride** (temple gold, jasmine braids), **Royal Deccani Bride** (vintage khada dupatta, emeralds), **North Indian Heritage**, **Contemporary Minimalist**, and **Indie Groom Fusion**.
*   **Dynamic Budget Rebalancer**: Set a wedding budget limit (₹10,000 to ₹1,50,000). Adjust individual milestone pricing, and the AI automatically replaces recommended salons to match your target limit.
*   **Entourage Planning**: Plan and coordinate side-by-side treatments for bridesmaids, the Mother of the Bride, and the Groom.
*   **Selfie Integration & Logistics**: Includes on-venue travel surcharges and shapes beauty regimens around your uploaded selfie.

### 4. 💇 Salon Directory & Smart Booking (`/salons`, `/booking`)
*   **25 Salons across 10 Neighborhoods**: Hand-curated coverage of Banjara Hills, Jubilee Hills, Hitech City, Madhapur, Gachibowli, Kukatpally, Secunderabad, Begumpet, Ameerpet, and Kondapur.
*   **NIM Review Summarization**: Consolidates multiple client reviews into 2-sentence summaries highlighting pros and practical tips.
*   **Similar Salons Matcher**: Recommends alternative beauty stops based on area proximity and specialization overlap.
*   **1-Click .ics Calendar Sync**: Downloads standard calendar events (`.ics` files) compatible with Google Calendar, Outlook, and Apple Calendar directly upon checkout.

---

## 🛠️ Tech Stack & Design System

*   **Next.js 14 App Router** (Zero-hydration mismatching, dynamically loaded modules).
*   **Zustand v5** (Persistent local storage state mapping).
*   **TailwindCSS** (Custom dark luxury layout theme: **Noir** background, **Gold** highlights, **Ivory** text, and **Mauve** accents).
*   **Framer Motion v12** (Smooth page transitions, spring-animated toast alerts).
*   **HTML5 Canvas API** (Liquid silk waves background, mouse spotlight tracking, vector checkmarks, and confetti bursts).

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js (v18+)](https://nodejs.org/) installed.

### 2. Installation
Clone and install dependencies:
```bash
git clone https://github.com/mithileshofficial06/glowspot.git
cd glowspot
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory and add your NVIDIA API credentials:
```env
NVIDIA_API_KEY=your_nvidia_nim_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Script Directory

| Command | Action |
|---------|--------|
| `npm run dev` | Starts Next.js hot-reloading development server on port 3000 |
| `npm run build` | Compiles and optimizes the project for production deployment |
| `npm run start` | Boots the compiled production server |
| `npm run clean` | Clears local `.next` and development build cache |
| `npm run fresh` | Cleans cache and instantly spins up a fresh dev server |

### 🛠️ Troubleshooting Windows Styles (White Screen)
If styling cache gets corrupted in Next.js development mode, run:
```powershell
.\start-fresh.ps1
```
This PowerShell script automatically releases port 3000, clears caching directories, and restarts the environment.

---

## 📂 Project Architecture

```
glowspot-hyderabad/
├── app/
│   ├── api/
│   │   ├── chat/route.js        # SSE Streaming Chat API
│   │   ├── planner/route.js     # Structured AI planner response
│   │   ├── preview/route.js     # Face Analysis & Llama Vision API
│   │   └── summarize/route.js   # NIM Review Summarizer API
│   ├── advisor/                 # Conversational Advisor Page
│   ├── booking/                 # Checkout and Confirmation Page
│   ├── planner/                 # Wedding Planner Page
│   ├── preview/                 # Visual Try-on Page
│   ├── salons/                  # Directory & Detail Page
│   ├── layout.js                # Shell container with Navbar, BottomNav & Toasts
│   └── globals.css              # Custom scrollbars, glass designs & shimmers
├── components/
│   ├── BookingConfirmation.jsx  # SVG checkmark & canvas particles
│   ├── BookingForm.jsx          # Booking panel, slots, & .ics downloader
│   ├── ChatInterface.jsx        # Conversational SSE panel
│   ├── FacePreview.jsx          # Live makeup canvas & vision analysis
│   ├── HeroBackgroundAnimation.jsx # Silk wave overlay with cursor tracking
│   ├── PageTransition.jsx       # Framer Motion route wrapper
│   ├── ScrollProgress.jsx       # Gold scroll indicator
│   └── ToastProvider.jsx        # Float notification system
├── store/
│   └── useProfileStore.js       # Zustand persisted profile data store
└── tailwind.config.js           # Theme palette & animations configuration
```

---

## 📄 License
Private Project. Owned by [mithileshofficial06](https://github.com/mithileshofficial06).
