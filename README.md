# GlowSpot Hyderabad

AI-Powered Beauty Salon Marketplace for Hyderabad

## 🚀 Quick Start

### First Time Setup

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### If Styles Are Not Loading

This is the most common issue. Run:

```bash
npm run fresh
```

Or on Windows PowerShell:

```powershell
.\start-fresh.ps1
```

This will:
- Kill any processes on port 3000
- Clean the build cache
- Start a fresh dev server

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run clean` | Clean build cache (.next folder) |
| `npm run fresh` | Clean cache + start dev server |

## 🛠️ Troubleshooting

### Styles Not Loading (White Page)

**Problem:** The page shows unstyled HTML with no colors or layout.

**Solution:**
```bash
npm run fresh
```

Then hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R).

### Port 3000 Already in Use

**Windows:**
```powershell
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
```

Or use the PowerShell script:
```powershell
.\start-fresh.ps1
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Slow Performance / Laggy Scrolling

The app includes optimized canvas animations. If experiencing lag:

1. Close browser dev tools (they slow animations significantly)
2. Check that hardware acceleration is enabled in browser settings
3. If still slow, you can reduce particle count in `components/HeroBackgroundAnimation.jsx` (line 38: change `particleCount` from 30 to 15)

### Changes Not Reflecting

1. Make sure you saved the file
2. Check the terminal for compilation errors
3. Hard refresh browser (Ctrl+Shift+R)
4. If still not working: `npm run fresh`

## 🏗️ Project Structure

```
glowspot-hyderabad/
├── app/                    # Next.js App Router pages
│   ├── advisor/           # AI Style Advisor
│   ├── preview/           # Face Preview (Vision AI)
│   ├── planner/           # Wedding Planner
│   ├── salons/            # Salon listing & details
│   └── api/               # API routes
├── components/            # React components
├── data/                  # JSON data files
├── public/                # Static assets
├── clean-build.js         # Build cache cleaner script
├── start-fresh.ps1        # Windows helper script
└── TROUBLESHOOTING.md     # Detailed troubleshooting guide
```

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, Canvas API
- **Icons:** Lucide React
- **State:** Zustand

## 🔧 Configuration

### Next.js Config

The project is configured to:
- Disable webpack cache in development (prevents stale CSS issues)
- Enable React strict mode
- Optimize for faster refresh

### Tailwind Config

Includes custom:
- Colors: noir, gold, mauve, ivory palettes
- Animations: float, sparkle, bounce-gentle, glow-pulse
- Fonts: Cormorant Garamond (display), Jost (body)

## 🎯 Features

1. **AI Style Advisor** - Conversational AI for style recommendations
2. **Face Preview** - Vision AI analyzes face shape and suggests styles
3. **Wedding Planner** - Multi-day beauty planning with AI
4. **Salon Directory** - 25+ verified salons across Hyderabad
5. **Smart Booking** - Natural language booking system

## 📝 Development Notes

### Performance Optimizations Applied

- Canvas animations optimized (reduced particle count, optimized draw loops)
- Scroll performance improved (RAF throttling, better IntersectionObserver)
- CSS optimized (faster transitions, hardware acceleration hints)
- Build cache disabled in dev to prevent style issues

### Known Issues

- **Styles disappearing:** This happens when Next.js cache gets corrupted. Always use `npm run fresh` to fix.
- **Port conflicts:** Multiple dev servers can start on different ports. Use the helper scripts to ensure clean starts.

## 🔗 Links

- **Troubleshooting Guide:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **AI Powered By:** NVIDIA NIM (Llama 3.3 70B & Llama 3.2 90B Vision)

## 📄 License

Private Project

---

**Need Help?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.
