# Implementation Walkthrough: FlashGenius

## 1. Core Architectural Paradigm
The FlashGenius application operates entirely as a stateless client-side data pipeline. The architecture is restricted to browser memory execution without any remote database or local persistent caching (no `localStorage`, `sessionStorage`, or IndexedDB). The Next.js application utilizes the App Router strictly for serving static client components (`'use client'`). Upon user interaction, the UI directly orchestrates external API calls using native browser `fetch`.

## 2. In-Memory State Model
All application data is maintained ephemerally via React `useState` and `useRef` hooks at the top-level container component.
- `inputText` (string): Captures textarea content dynamically.
- `apiKey` (string): Captures the user-provided OpenAI token temporarily for the session.
- `deck` (Array<{id, question, answer}>): Stores the array of 5 generated flashcard objects.
- `currentCardIndex` (number): Tracks the user's navigation position (0 to 4).
- `isFlipped` (boolean): Controls the 3D CSS transition state of the active card.
- `loadingState` ('idle' | 'loading' | 'error'): Manages UI feedback during fetch execution.
- `errorMessage` (string): Holds active exception details for rendering.

## 3. End-To-End Execution Flow
1. **Input Validation:** User pastes text into the `<Textarea />`. React triggers `onChange`, trims input, and updates `inputText`. UI validates length (50–10,000 characters).
2. **Generation Dispatch:** User clicks "Generate Flashcards". The `onSubmit` handler sets `loadingState` to 'loading'.
3. **API Execution:** A pure JS utility function invokes `fetch('https://api.openai.com/v1/chat/completions')`, passing `inputText` and `apiKey`.
4. **Data Hydration:** The JSON response is parsed. The utility returns exactly 5 structured objects.
5. **State Update:** The container updates the `deck` state array. `loadingState` reverts to 'idle'.
6. **Card Interaction:** The user views Card 1. Clicking the card toggles the `isFlipped` boolean, triggering a Tailwind-driven 180-degree `rotateY` CSS transform. Clicking "Next" increments `currentCardIndex` and resets `isFlipped` to false.

## 4. Modular File Allocation Matrix

| File Path | Responsibility | Exports |
|---|---|---|
| `app/page.tsx` | Main workspace container. Orchestrates all state hooks and composes child components. | `Page` (default) |
| `components/TextInputEngine.tsx` | Renders the textarea, character counter, and handles input validation logic. | `TextInputEngine` |
| `components/GenerationControls.tsx`| Renders the Generate button, loading spinner, and error toasts. | `GenerationControls` |
| `components/FlashcardUI.tsx` | Manages the CSS 3D transform container, question face, and answer face based on `isFlipped`. | `FlashcardUI` |
| `components/NavigationOverlay.tsx` | Renders the Prev/Next buttons and the "Card X of 5" progress indicator. | `NavigationOverlay` |
| `utils/apiService.ts` | Pure JS module containing the OpenAI `fetch` logic and JSON extraction algorithms. | `generateFlashcards` |

## 5. Volatility Event Behavior
The system is explicitly engineered for total data volatility:
- **Page Refresh (F5 / Cmd+R):** The React component tree unmounts. The `deck`, `apiKey`, and `inputText` states are immediately destroyed. The application reverts to its blank, initial state.
- **Tab Closure:** The browser process terminates. All allocated memory is released. No data survives.
- **Network Failure:** If the browser drops connection during generation, the `fetch` call throws an exception, `loadingState` resolves to 'error', and the user is prompted to retry. No partial states are cached.
