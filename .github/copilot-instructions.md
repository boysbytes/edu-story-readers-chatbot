# Mia Kids Educational Chatbot - AI Agent Instructions

## Project Overview
This is an **educational chatbot for Malaysian Year 1-4 students** teaching reading comprehension through an interactive story about a girl named Mia. The app is a **Vite + React single-page application** designed for deployment to **Vercel** as a static site with serverless functions.

## Tech Stack & Architecture
- **Frontend**: React 18 + Vite (ESM modules)
- **Styling**: Tailwind CSS v4 (utility-first, inline classes with custom animations)
- **Deployment**: Vercel (static site + serverless API)
- **API**: Google Generative AI Imagen 3.0 for image generation (via `api/generate-image.js`)

## Core Application Flow
The app follows a **step-based state machine** pattern:
1. Story segments (`type: "story"`) are displayed sequentially
2. Question prompts (`type: "question"`) require user selection between correct/wrong answers
3. Correct answers trigger **AI image generation** via the Vercel serverless function
4. **Fallback behavior**: If API fails or is unavailable, a colorful placeholder SVG is shown
5. Wrong answers offer retry with educational feedback and two options: re-read story or repeat question
6. Progress is tracked through `questionProgress` state (5 total questions)

Key state: `currentStepIndex` drives progression through the `STEPS` array in `src/components/MiaKidsChatbot.jsx`.

## Image Generation Implementation

### `generateImage` Function
**Location**: `src/components/MiaKidsChatbot.jsx` (lines ~256-280)

The function is fully implemented and handles:
1. **API Call**: POSTs to `/api/generate-image` with `{ prompt: string }`
2. **Response Parsing**: Extracts base64 image from `json.predictions[0].bytesBase64Encoded`
3. **Error Handling**: Returns `null` on failure (triggers fallback)
4. **Return Format**: `data:image/png;base64,${base64}` or `null`

### Fallback Mechanism
**Function**: `generatePlaceholderImage(questionId)`

When `generateImage` returns `null`, the system automatically generates a colorful SVG placeholder:
- Uses question ID to select from 5 gradient colors
- Creates 600×400px SVG with emoji icon (🎨)
- Returns as base64-encoded data URI
- Ensures students always see visual feedback

**Example fallback flow**:
```javascript
let img = await generateImage(prompt);
if (!img) {
  console.log('Using fallback placeholder for question', questionId);
  img = generatePlaceholderImage(questionId);
}
```

This ensures the app degrades gracefully when:
- API key is missing/invalid
- Network connection fails
- Rate limits are exceeded
- Vercel serverless function errors

## Environment Variables & API Keys
The project uses **dual-key architecture** for flexibility:
- **Production (Vercel)**: Set `GENERATIVE_API_KEY` in Vercel environment variables (server-side only)
- **Legacy/Fallback**: `VITE_IMG_API_KEY` exposed to client (deprecated but supported for backward compatibility)
- **API function** (`api/generate-image.js`) prefers `GENERATIVE_API_KEY` over `VITE_IMG_API_KEY`

Key design: The serverless function acts as a **proxy** to keep API keys server-side and avoid client exposure.

## File Structure & Responsibilities
```
api/generate-image.js         # Vercel serverless function (ESM default export)
src/components/MiaKidsChatbot.jsx  # Main component with STEPS data + state machine
src/App.jsx                    # Minimal wrapper (just renders MiaKidsChatbot)
src/main.jsx                   # React entry point
index.html                     # SPA entry with viewport meta for mobile
```

## Component Patterns & Conventions
- **No PropTypes or TypeScript**: Uses plain JSX with inline type assumptions
- **Utility-first Tailwind**: All styles inline via className (see `UI_DESIGN_SYSTEM.md` for comprehensive guidelines)
- **Custom animations**: Defined in inline `<style>` tag (fade-in, float, bounce-slow, spin-slow)
- **Modern UI for ages 6-10**: Vibrant gradients, large touch targets (min 72px), rounded shapes, emoji avatars
- **Emoji UI elements**: Teacher bot (👩‍🏫), student (👧), owl (🦉) used consistently for visual identity
- **Button tone system**: `tone="primary"` (blue-indigo gradient), `tone="danger"` (rose-pink gradient), `tone="secondary"` (slate gradient)
- **Randomized answer choices**: `useMemo` shuffles correct/wrong answers on mount per question
- **Auto-scroll**: `chatEndRef` + `useEffect` ensures latest message visible

## UI Design System
A comprehensive **UI Design System** is documented in `UI_DESIGN_SYSTEM.md` covering:
- 🌈 **Color Palette**: Primary colors, gradients, semantic colors
- 📝 **Typography**: Font sizes, weights, line heights
- 🧩 **Component Patterns**: Headers, chat bubbles, buttons, cards, loaders
- ✨ **Animations**: Keyframes, timing, usage guidelines
- 📐 **Spacing & Layout**: Containers, padding, margins, gaps
- ♿ **Accessibility**: ARIA labels, keyboard nav, color contrast, touch targets
- 🎭 **Emoji Usage**: Context-appropriate emoji selection
- 📱 **Responsive Design**: Mobile-first breakpoints

**Key UI Features**:
- Gradient backgrounds with animated floating elements
- Avatar circles: 48px with gradient fills and white borders
- Chat bubbles: Gradient backgrounds with 2px borders and asymmetric tails
- Buttons: 72px min height, gradient fills, 4px borders, scale animations
- Progress dots: Animated scale on completion (green-400)
- Loading states: Purple-pink gradient with spinning icon
- Question containers: Indigo gradient with thick borders

Refer to `UI_DESIGN_SYSTEM.md` when creating new components or features to maintain consistency.

## Data Structure: STEPS Array
Each step object has `type` field determining behavior:
- `"bot"`: Display message with `actionText` button to advance
- `"story"`: Narrative text with "Next" button
- `"question"`: Display `text` prompt with two choices (`correct` and `wrong` objects)
  - `correct`: Contains `text` (answer), `prompt` (for image gen), `response` (feedback)
  - `wrong`: Contains `text` (answer), `explanation` (feedback)
  - Questions must have `questionId` (1-5) for image state tracking

## Developer Workflow
- **Local dev**: `npm run dev` (Vite default port 5173)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview build**: `npm run preview --port 5173`
- **Deployment**: Push to GitHub → Vercel auto-deploys from `main` branch
- **No tests configured**: Manual testing only (target audience is non-technical educators)

## Vercel-Specific Considerations
- **Serverless functions**: Must be in `api/` folder with ESM `export default` syntax
- **Build detection**: Vercel auto-detects Vite (framework preset)
- **Environment vars**: Must be set in Vercel dashboard (Project → Settings → Environment Variables)
- **CORS**: Serverless function returns JSON directly (same origin, no CORS needed)

## Accessibility & UX Conventions
- All interactive elements have `aria-label` attributes
- Progress indicators (`step/totalQuestions`) with visual dots for young learners
- Large touch targets (min 64px height) for mobile/tablet use
- Auto-scroll ensures students don't lose context
- Positive reinforcement language in all feedback messages

## Common Pitfalls to Avoid
- Don't add TypeScript or prop validation (project deliberately simple)
- Don't extract Tailwind classes to separate files (all inline per project style)
- Don't modify the STEPS array without preserving `questionId` continuity
- Don't expose API keys in client code (always proxy through serverless function)
- Don't use CommonJS syntax (`require`) - project is ESM-only (`"type": "module"` in package.json)

## Educational Context
Target audience: **Malaysian Year 1-4 students (ages 6-10)**, learning English reading comprehension. Story content uses:
- Simple present tense
- Malaysian cultural context (character names: Mia, Ali)
- Explicit WHO/WHERE/WHAT sentence structure teaching
- Child-safe image generation prompts (all prompts specify "child-friendly", "cartoon", "age 7")

## UI/UX Design Philosophy
The interface is designed specifically for young learners with:
- **High Engagement**: Bright gradients, animations, emoji avatars create playful atmosphere
- **Clear Hierarchy**: Large text (18px+ body, 24px headings), obvious interactive elements
- **Accessibility**: 72px min touch targets, high contrast ratios, ARIA labels, keyboard navigation
- **Positive Reinforcement**: Soft error colors (orange/rose gradients), encouraging language
- **Visual Feedback**: Animations on every interaction, loading states, progress visualization

See `UI_DESIGN_SYSTEM.md` for complete design guidelines.
