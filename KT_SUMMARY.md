# Knowledge Transfer (KT) Summary: FlashGenius

## 1. Project Mission & Core Architecture
FlashGenius is a web-based automated study utility designed to instantly transform raw text notes into interactive flashcards. A zero-database, zero-storage architecture was intentionally chosen for the MVP to enforce a lean, highly deterministic Proof of Concept (POC). By operating entirely in browser memory and avoiding backend infrastructure, the project eliminates server hosting costs, sidesteps database schema migrations, and avoids complex data privacy regulations. The application acts as a pure, stateless conduit between the user's browser and the external OpenAI API.

## 2. In-Memory State & Lifecycle Management
The entire application lifecycle is governed by the central container component (`app/page.tsx`), which manages volatile React `useState` hooks. The core global states include:
- `apiKey` (string): Captures the user-provided OpenAI token temporarily for the session.
- `inputText` (string): Holds the study notes pasted into the textarea.
- `deck` (Array): Stores the array of exactly 5 generated flashcard objects.
- `currentIndex` (number): Tracks the user's linear progression (0 to 4) when navigating the deck.
- `isFlipped` (boolean): Controls the active 3D CSS transition state of the currently viewed card.
- `loadingState` (string): Manages UI blocking and async loading feedback ('idle' | 'loading' | 'error').
These states flow unidirectionally downward via props to the isolated presentation components. Data remains strictly volatile and is destroyed the moment the component tree unmounts.

## 3. API Contract & Payload Pipeline
The data transmission layer connects directly to the `https://api.openai.com/v1/chat/completions` endpoint via a native browser `fetch` POST request originating from the client.
- **Headers:** `Content-Type: application/json` and `Authorization: Bearer <apiKey>`.
- **System Prompt Schema:** The prompt explicitly forces the LLM to return exactly 5 items. The structural contract is requested as a pure JSON array of objects, where each object contains an `id`, `question`, and `answer`. 
- **Error Handling:** Network timeouts (configured to 30 seconds via `AbortController`) and HTTP anomalies (e.g., 401 Unauthorized, 429 Rate Limit) are caught, parsed, and thrown as distinct UI-friendly error messages.

## 4. Component Topology & UI Architecture
The component matrix is explicitly modularized:
- **`app/page.tsx`:** The root orchestrator. Manages all volatile state and controls the conditional rendering between the input view and the deck review view.
- **`components/TextInputEngine.tsx`:** The input layer. Handles paste sanitization, character limit boundaries (max 10,000), API key masking, and primary submission logic constraints.
- **`components/FlashcardUI.tsx`:** The visual interaction layer. Responsible exclusively for rendering the front and back card faces and housing the CSS flip container mechanics.
- **`components/NavigationOverlay.tsx`:** The controller overlay. Manages linear progression through the deck, handles the disabling of Previous/Next buttons at array boundaries, and renders dynamic progress strings.
- **`utils/apiService.ts`:** The pure network module. Isolates all OpenAI `fetch` logic, JSON hydration, and error routing away from the React component tree.

## 5. High-Performance UX & CSS Mechanics
The signature card flip interaction is powered entirely by GPU-accelerated Tailwind CSS transitions without relying on complex React animation libraries:
- A parent `.flip-container` sets `perspective: 1000px` to establish the 3D depth field.
- An inner wrapper uses `transform-style: preserve-3d` and triggers a `rotateY(180deg)` transition via a dynamic `.flipped` class toggle when `isFlipped` is true.
- The front and back card faces utilize `backface-visibility: hidden` and absolute positioning. As the inner wrapper rotates, the front face rotates out of view while the back face (pre-rotated to 180 degrees) smoothly enters the viewport. The transition executes over 600ms using a `cubic-bezier(0.4, 0, 0.2, 1)` timing curve for fluid motion.

## 6. Developer Verification & Hard Boundaries
- **Total Volatility:** Refreshing the page (F5) or closing the browser tab must permanently destroy all data. The application reboots entirely to its empty, initial state.
- **Zero Storage Rule:** No usage of `window.localStorage`, `sessionStorage`, or IndexedDB is permitted for saving decks or caching API payloads.
- **Token Handling:** The user's OpenAI API key must never be logged to the console, transmitted to any server other than OpenAI, or persisted across sessions.
- **Viewport Lock:** The application layout is strictly designed for desktop environments (≥1024px viewport width). Mobile responsive layouts and touch-gestures (e.g., swiping) are strictly out of scope.
