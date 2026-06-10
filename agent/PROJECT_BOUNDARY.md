# Project Boundary: FlashGenius

> **Developer Execution Protocol:**
> 1. Do not commit code yourself.
> 2. Do not run any commands without asking me first.
> 3. Do not write code unless you have full picture. If you have any questions, ask me first. Lets not waste tokens and build something we do not want.
> 4. Only create maintainable modular code.

---

## 1. Boundary Overview

### Purpose

Deliver the core text-to-flashcard generation workspace within a desktop web client. The application exists as a single-page React interface running entirely inside a desktop browser. All generated data and API tokens are persisted exclusively client-side via `localStorage`. No remote persistence layer or database is used.



---

## 2. Release Boundary (MVP)

### Data Pipeline

A client-side data pipeline where input text maps directly to 5 generated card objects held in React component state and persisted to local storage:

```
[Textarea Input] → [Validation (50–10,000 chars)] → [fetch() to Gemini API] → [Parse Response] → [5 × { id, question, answer }] → [React useState]
```

- **Input:** Plain-text string from the textarea, validated client-side.
- **Processing:** Single `POST` request to Gemini API with the text and a system prompt instructing 5 Q&A pair extraction. The API key is securely retrieved from `localStorage`.
- **Output:** An array of exactly 5 objects: `{ id: string, question: string, answer: string }`. Stored in React component state (`useState`) and persisted to `localStorage`.
- **Fallback:** If no API key is provided or the network request fails, a deterministic client-side mock function parses the text into 5 static fallback cards for offline POC validation.

### Interactive Layout

| Element | Specification |
|---|---|
| **Card Container** | Centered on desktop viewport. `perspective: 1000px` for 3D depth. Max width: 520px, height: 300px. |
| **Flip Transition** | CSS `transform: rotateY(180deg)` with `transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`. `backface-visibility: hidden` on both faces. `transform-style: preserve-3d` on the inner wrapper. |
| **Navigation** | "Previous" and "Next" buttons flanking the card. Previous disabled on Card 1. Next disabled on Card 5. |
| **Progress** | Text indicator: *"Card {n} of 5"*. Updates on every navigation action. |
| **State Reset** | Navigating to a different card resets `isFlipped` to `false` (always shows question first). |

### Architectural Separation

The codebase must maintain clean separation between three concerns:

| Layer | Responsibility | Isolation Rule |
|---|---|---|
| **UI Components** | React components rendering textarea, buttons, flashcards, navigation, toasts. Manage local UI state only (`useState`). | Must not contain `fetch` calls or API logic. Receives data via props or callbacks. |
| **API Utilities** | A single utility module exporting a `generateFlashcards(text, apiKey)` function that handles the `fetch` call to Gemini, response parsing, and error handling. | Must not import React or render any UI. Returns a plain data structure (`Promise<Card[]>`). |
| **Mock Fallback** | A single utility module exporting a `mockGenerateFlashcards(text)` function for deterministic offline card generation. | Must be pure — no side effects, no network calls, no state mutations. Same input always produces same output. |

---

## 3. Acceptance Criteria / Stopping Point

The MVP is accepted and **development stops** when the following three conditions are demonstrably met in a single walkthrough:

### Criterion 1 — Generation

| Requirement | Verification |
|---|---|
| Pasting a paragraph of text (≥ 50 characters) into the textarea and clicking "Generate Flashcards" populates exactly 5 in-memory Q&A objects. | Inspect React DevTools or console output to confirm 5 card objects exist in component state, each with a non-empty `question` and `answer` string. |

### Criterion 2 — Flip Animation

| Requirement | Verification |
|---|---|
| Clicking any generated flashcard triggers a smooth CSS 3D flip transition between the front face (question) and back face (answer). Clicking again reverses the flip. | Visually confirm the `rotateY(180deg)` animation plays on click for each of the 5 cards without rendering glitches, clipping, or frame drops. Animation completes in ≤ 600ms. |

### Criterion 3 — Persistence Integrity

| Requirement | Verification |
|---|---|
| The application persists decks and API tokens client-side. Refreshing the browser does not cause data loss. | Generate a deck of 5 cards and save it. Refresh the page. Confirm the deck and API token are successfully restored from `localStorage` (inspect via DevTools → Application tab). |

### Explicit Stopping Points

Development **must not continue** past these boundaries:

- Do not add a remote database or external backend for persistence.
- Do not add a deck library, deck history, or deck management UI.
- Do not add user accounts or login screens.
- Do not add responsive layouts for viewports below 1024px width.
- Do not add touch-gesture interactions (swipe to flip, swipe to navigate).
- Do not add more than 5 cards per generation.
- Do not add card editing, deletion, or manual card creation.

---

## 4. Constraints & Assumptions

### Hard Constraints

| # | Constraint | Enforcement |
|---|---|---|
| C-1 | **Client-Side Persistence Only.** The system uses browser storage. No remote backend databases. | Only use `localStorage` for state persistence. No remote databases. |
| C-2 | **Modular Code Architecture.** The code architecture must be entirely modular. State parsing layers and API connection models must reside in isolated, highly maintainable files. | UI components, API utilities, and mock fallback must be in separate files/modules. No monolithic components combining UI rendering and API logic. |
| C-3 | **Desktop-Only Viewport.** The interface targets desktop/laptop monitors exclusively. Minimum viewport width: 1024px. | No Tailwind responsive variants targeting phone or tablet sizes (`sm:`, `max-sm:`, `md:` below 1024px). No media queries for portrait orientation. |
| C-4 | **Client-Side Only Execution.** Every React component must use the `'use client'` directive. No Server Components, no server-side rendering, no Next.js API routes. | No files in `app/api/`. No `getServerSideProps` or server actions. All rendering and data fetching happens in the browser. |
| C-5 | **Direct Gemini API Access.** The browser fetches directly from the Gemini API endpoint. No backend proxy, no API route forwarding, no middleware transformation. | The `generateFlashcards()` utility calls the Gemini API directly with the user-provided API key. |
| C-6 | **Fixed Card Count.** Every generation produces exactly 5 flashcards. No configurable count, no variable output. | The system prompt sent to Gemini explicitly requests 5 Q&A pairs. The response parser validates exactly 5 items. |
| C-7 | **Token Persistence.** The user provides their Gemini API key at runtime, which is then persisted safely client-side. | The key is stored securely in `localStorage` according to the `save_token.md` protocol. No `.env` files containing API keys shipped to the client. |

### Assumptions

| # | Assumption | Impact if Invalid |
|---|---|---|
| A-1 | **Users paste English-language informational text.** The generation prompt and response parsing are optimized for English educational content (study notes, textbook excerpts, lecture summaries). | Non-English or non-informational input (code, poetry, conversational text) may produce low-quality or nonsensical Q&A pairs. |
| A-2 | **Users have a valid Gemini API key.** The primary generation flow requires the user to provide their own API key at runtime. | Without a valid key, the system falls back to mock generation, producing structurally valid but pedagogically simplistic cards. |
| A-3 | **The Gemini API is available and responsive.** The generation pipeline assumes the external API returns results within 30 seconds. | Network failures or API outages trigger the 30-second timeout, displaying an error message with a "Retry" option. The mock fallback is available as an alternative. |
| A-4 | **Desktop browser with modern standards support.** The application assumes Chrome 90+, Firefox 90+, Safari 15+, or Edge 90+ with CSS 3D transform support and ES2020+ JavaScript. | Older browsers may not render the flip animation correctly or may fail on modern JavaScript syntax. |
| A-5 | **Multi-session usage model.** Users expect deck persistence. They expect their generated deck and API key to survive a page refresh. | Without `localStorage`, users would lose their generated deck on refresh. |

---

*End of Document*
