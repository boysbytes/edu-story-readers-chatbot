# Story Readers

This chatbot is used in Project A of AI Toolkit for Students.

Vercel page: https://vercel.com/boysbytes-projects/edu-story-readers

This repository contains a small React app (Vite) that runs the "Mia Kids Chatbot" component. It is ready to deploy on Vercel as a static site.

What I created for you
- A minimal Vite + React project at the repository root.
- The provided chatbot component at `src/components/MiaKidsChatbot.jsx` wired into `src/App.jsx`.
- A lightweight stylesheet so the interface looks tidy without extra setup.

Files you'll use
- `index.html` — app entry
- `src/main.jsx` — mounts the app
- `src/App.jsx` — root component that renders the chatbot
- `src/components/MiaKidsChatbot.jsx` — the chatbot you provided
- `package.json` — scripts for running and building

Run locally (copy & paste into PowerShell)
1. Open PowerShell and change to the project folder. For example:

   cd 'd:/Work/edu-story-readers-chatbot'

2. Install dependencies (only needed once):

   npm install

3. Start the local development server (live reload):

   npm run dev

4. Open the URL printed by the command (usually http://localhost:5173) in your browser.

Create a GitHub repo and push (simple steps)
1. If you don't have a GitHub account, sign up at https://github.com.
2. Create a new repository (private or public) on GitHub. Do NOT initialize with README or .gitignore (this avoids merge conflicts).
3. On your PC open PowerShell and run these commands (replace USER and REPO):

   cd 'd:/Work/edu-story-readers-chatbot'
   git init
   git add .
   git commit -m "Initial commit — Mia Kids Chatbot"
   git branch -M main
   git remote add origin https://github.com/USER/REPO.git
   git push -u origin main

Deploy to Vercel (web UI — easiest for non-developers)
1. Go to https://vercel.com and sign up / log in with GitHub (recommended).
2. Click "New Project" and import the GitHub repository you just pushed.
3. Vercel usually auto-detects Vite. If asked, use these settings:
   - Framework preset: Vite
   - Build command: npm run build
   - Output directory: dist
4. Click "Deploy" and wait a minute — Vercel will build and give you a live URL.

Environment variables (optional)
- The chatbot can call an image API. To keep keys safe, set an environment variable in Vercel and the code will read it at build time.

How to name the variable on Vercel
- Set the environment variable name to: `VITE_IMG_API_KEY`
- On Vercel: Project → Settings → Environment Variables → Add New
   - Key: VITE_IMG_API_KEY
   - Value: (paste your image API key)
   - Environment: Production (and Preview if you want the key used on preview deployments)

Why `VITE_` prefix?
- Vite only exposes environment variables to the client-side code if they start with `VITE_`. This is why we ask you to name the variable `VITE_IMG_API_KEY`.

Behavior when the key is missing
- If you don't set the variable, the app will fall back to a built-in placeholder image generator so the app still works without an API key.

Notes & Troubleshooting
- If you see layout that looks different, it's because the component uses Tailwind utility classes — I added minimal CSS so the app is usable without configuring Tailwind.
- If the build fails on Vercel, open the Deployment > Logs page and copy errors; I can help interpret them.
- To update the site after changes: commit and push to GitHub; Vercel will automatically rebuild.

Need help? Reply here and tell me which step you're stuck on (creating the GitHub repo, pushing, or deploying on Vercel) and I'll give exact copy-paste commands and screenshots-friendly guidance.

---

## Embedding the App

This app can be embedded in other websites using iframes. By default, it's configured to allow embedding from **any domain**.

### Quick Embed Code

```html
<iframe 
  src="https://your-app-name.vercel.app" 
  width="100%" 
  height="600"
  frameborder="0"
  title="Mia Kids Educational Chatbot"
></iframe>
```

### Configuration

Embedding behavior is controlled by `vercel.json`. See `EMBEDDING_GUIDE.md` for:
- Different security options (allow all, specific domains, same origin only)
- How to restrict embedding to your school domains
- Testing instructions
- Troubleshooting

**Default Setting**: Allows embedding from all domains (good for development and wide distribution)

**For Production**: Consider restricting to specific school domains for better security.

---

## Documentation Files

- `README.md` - This file (setup and deployment guide)
- `EMBEDDING_GUIDE.md` - How to embed the app in other websites
- `TAILWIND_V4_NOTES.md` - Tailwind CSS v4 configuration notes
- `UI_DESIGN_SYSTEM.md` - Comprehensive UI design system for reuse
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `.github/copilot-instructions.md` - AI assistant development guidelines


