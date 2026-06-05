# Troubleshooting Guide

## CSS/Styles Not Loading

If you see unstyled HTML (no colors, no layout), this is usually caused by a corrupted Next.js build cache.

### Quick Fix

Run the clean script:

```bash
npm run clean
npm run dev
```

Or use the combined command:

```bash
npm run fresh
```

### What This Does

- Deletes the `.next` folder (Next.js build cache)
- Deletes `node_modules/.cache` (Webpack cache)
- Restarts the dev server with a clean slate

### Why This Happens

Next.js caches compiled assets for faster builds. Sometimes when you:
- Update Tailwind config
- Change global CSS
- Switch branches
- Update dependencies
- Force stop the dev server

The cache can become stale and serve old/missing CSS files.

### Prevention

The project is now configured to:
1. Disable webpack cache in development mode
2. Use faster refresh with proper cache invalidation
3. Include cleaning scripts for easy maintenance

### Still Having Issues?

1. Make sure port 3000 is not in use by another process
2. Try deleting `node_modules` and running `npm install` again
3. Check browser console for specific error messages
4. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

## Port Already in Use

If you see "Port 3000 is in use":

### Windows
```powershell
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
```

### Mac/Linux
```bash
lsof -ti:3000 | xargs kill -9
```

## Slow Performance / Laggy Scrolling

The project includes optimized canvas animations and scroll handlers. If you experience lag:

1. Check if browser dev tools are open (this slows animations)
2. Make sure hardware acceleration is enabled in browser
3. Reduce particle count in `HeroBackgroundAnimation.jsx` if needed
4. Disable animations with `prefers-reduced-motion` in your OS

## Build Errors

If `npm run build` fails:

1. Run `npm run clean` first
2. Make sure all imported components exist
3. Check for TypeScript/JS syntax errors
4. Verify all dependencies are installed

## Quick Reference

| Problem | Solution |
|---------|----------|
| No styles loading | `npm run fresh` |
| Port in use | Kill process on port 3000 |
| Slow animations | Check browser dev tools, reduce particles |
| Build fails | `npm run clean && npm install && npm run build` |
| Old code still showing | Hard refresh browser (Ctrl+Shift+R) |
