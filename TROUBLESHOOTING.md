# 🔧 Troubleshooting Guide - Blank Page Issue

## 🚨 Common Issue: Blank Page on Deployment

### Symptoms
- ✅ App works fine locally (`npm run dev`)
- ❌ Blank white screen on deployed site
- ❌ Console shows errors or no output

---

## ✅ Solution Steps (Follow in Order)

### 1. Check Browser Console

```bash
# Open Developer Tools (F12)
# Go to Console tab
# Look for errors

# Common errors:
# - "Failed to fetch" → Network/API issue
# - "Uncaught TypeError" → JavaScript error
# - "404 Not Found" → Missing files
```

### 2. Verify Build Output

```bash
# Test build locally
npm run build

# You should see:
✓ built in XXXms
dist/index.html                  X.XX kB
dist/assets/index-XXXXX.js       XXX kB
dist/assets/index-XXXXX.css      XX kB

# If build fails, check error messages
```

### 3. Test Production Build Locally

```bash
# After successful build
npm run serve

# Open http://localhost:3000
# Test navigation:
# - Click different routes
# - Login with patient@demo.com / demo123
# - Navigate to /home, /mood, etc.

# If it works locally but not on server:
# → Server configuration issue (see Step 4)
```

### 4. Check Server Configuration

#### For Render:
```bash
# Verify in Render Dashboard:
Build Command: npm install && npm run build
Start Command: npx serve -s dist -l $PORT

# The -s flag is CRITICAL for SPA routing!
```

#### For Netlify:
```bash
# Ensure _redirects file exists in /public/
/*    /index.html   200

# This file should be in your repo
```

### 5. Check File Paths

```bash
# Common issue: Incorrect base path in vite.config.ts

# Should be:
export default defineConfig({
  base: '/',  // ← Must be '/' for most deployments
  // ...
})

# NOT:
base: '/app/'  // ← Wrong!
base: './dist/' // ← Wrong!
```

### 6. Verify Environment Variables

```bash
# If using Supabase, add to Render/Netlify:
VITE_SUPABASE_URL=https://ntglfzqujpywvylrzjju.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# IMPORTANT: Must start with VITE_ prefix!
```

### 7. Check React/ReactDOM Dependencies

```bash
# In package.json, React MUST be in dependencies, not devDependencies:

"dependencies": {
  "react": "18.3.1",          ← Correct!
  "react-dom": "18.3.1",      ← Correct!
  // ...
}

# NOT in devDependencies:
"devDependencies": {
  "react": "18.3.1",          ← Wrong!
  "react-dom": "18.3.1",      ← Wrong!
}
```

### 8. Clear Cache and Rebuild

```bash
# On your local machine:
rm -rf node_modules dist
npm install
npm run build
npm run serve

# If it works, push to GitHub:
git add .
git commit -m "Fix deployment"
git push origin main

# Render will auto-deploy
```

### 9. Check Render Logs

```bash
# In Render Dashboard:
# 1. Go to your service
# 2. Click "Logs" tab
# 3. Look for errors during build or runtime

# Common issues in logs:
# - "Module not found" → Missing dependency
# - "Command not found" → Wrong build command
# - "Port already in use" → Wrong start command
```

### 10. Network Tab Inspection

```bash
# In Browser DevTools:
# 1. Go to Network tab
# 2. Reload page
# 3. Check:
#    - Is index.html loading? (Status 200)
#    - Are JS/CSS files loading? (Status 200)
#    - Any 404 errors?

# If index.html is 404:
# → Server routing issue (check Step 4)

# If JS/CSS are 404:
# → Build output issue (check Step 2)
```

---

## 🎯 Quick Fix Checklist

- [ ] `npm run build` completes without errors
- [ ] `npm run serve` works locally on http://localhost:3000
- [ ] Navigation works in local production build
- [ ] `/public/_redirects` file exists (for Netlify)
- [ ] `render.yaml` exists (for Render)
- [ ] `vite.config.ts` has `base: '/'`
- [ ] React/ReactDOM in `dependencies` (not devDependencies)
- [ ] Start command includes `-s` flag: `npx serve -s dist -l $PORT`
- [ ] No console errors in browser
- [ ] Environment variables set correctly (if using Supabase)

---

## 🔍 Specific Error Solutions

### Error: "Cannot read properties of null (reading 'root')"

```bash
# Issue: React not mounting
# Solution: Check /src/main.tsx

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
ReactDOM.createRoot(rootElement).render(<App />);
```

### Error: "Failed to fetch dynamically imported module"

```bash
# Issue: Build cache issue
# Solution:
rm -rf dist node_modules
npm install
npm run build

# Clear browser cache:
# Ctrl+Shift+Delete → Clear browsing data
```

### Error: "404 when accessing routes directly"

```bash
# Issue: Server not configured for SPA
# Solution: Ensure start command has -s flag
npx serve -s dist -l $PORT
#            ↑ This flag!

# Or add _redirects file in /public/
/*    /index.html   200
```

### Error: "White screen, no console errors"

```bash
# Issue: React not rendering
# Solution: Check ErrorBoundary

# In /src/main.tsx:
import { ErrorBoundary } from './app/components/ErrorBoundary';

ReactDOM.createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

---

## 🆘 Still Not Working?

### Test Each Part Individually

1. **Test HTML**: Open `dist/index.html` directly in browser
   - Should show blank page with `<div id="root"></div>`

2. **Test JS Loading**: Check Network tab
   - `index-XXXXX.js` should load (Status 200)

3. **Test React Mount**: Add console.log in `main.tsx`
   ```typescript
   console.log('React mounting...');
   ReactDOM.createRoot(rootElement).render(<App />);
   console.log('React mounted!');
   ```

4. **Test Router**: Add console.log in `App.tsx`
   ```typescript
   console.log('Router loading...');
   return <RouterProvider router={router} />;
   ```

### Enable Debug Mode

```typescript
// In /src/main.tsx
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  alert('Error: ' + event.error.message); // Shows error as popup
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejection:', event.reason);
  alert('Promise Error: ' + event.reason);
});
```

---

## 📞 Contact Support

If you've tried all the above and still facing issues:

1. **Check Render Logs**: Copy error messages
2. **Check Browser Console**: Take screenshot of errors
3. **Share Build Output**: Copy terminal output of `npm run build`
4. **Share Network Tab**: Screenshot of Network tab showing 404s

---

## ✅ Success Indicators

Your deployment is working when:

- ✅ Home page loads at root URL
- ✅ Navigation between pages works
- ✅ Direct URLs work (e.g., /home, /mood)
- ✅ Login functionality works
- ✅ No console errors
- ✅ Images load correctly
- ✅ Responsive design works on mobile

---

**Made with 💜 for women's mental wellness**
