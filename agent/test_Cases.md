# FlashGenius Test Cases & QA Strategy

## Test Coverage Matrix

| Feature Module | Test Case ID | Description | Type | Priority |
|---|---|---|---|---|
| **Text Input** | `TC-INP-01` | Validate Generate button is disabled when input < 50 characters. | UI/Unit | High |
| **Text Input** | `TC-INP-02` | Validate input truncates or prevents typing beyond 10,000 characters. | UI/Unit | High |
| **Text Input** | `TC-INP-03` | Verify paste sanitization handles plain text stripping correctly. | UI/Unit | Medium |
| **API Integration** | `TC-API-01` | Verify Gemini API is called with correct JSON payload and headers. | Integration | High |
| **API Integration** | `TC-API-02` | Validate fallback mock generation triggers when no API key is provided. | Integration | Medium |
| **API Integration** | `TC-API-03` | Verify 30-second abort controller successfully cancels stalled requests. | Integration | High |
| **API Integration** | `TC-API-04` | Verify UI displays friendly error message on 400 API_KEY_INVALID. | Integration | High |
| **Deck Review** | `TC-UI-01` | Verify exactly 5 cards are rendered after successful generation. | E2E | High |
| **Deck Review** | `TC-UI-02` | Verify clicking a card triggers `isFlipped` state and CSS 180deg transform. | E2E | High |
| **Deck Review** | `TC-UI-03` | Verify 'Next' button increments index and resets `isFlipped` to false. | E2E | High |
| **Deck Review** | `TC-UI-04` | Verify 'Previous' button is disabled on Card 1 and 'Next' on Card 5. | UI/Unit | Medium |
| **Persistence** | `TC-STO-01` | Verify clicking 'Save Deck' writes valid JSON array to `localStorage`. | E2E | High |
| **Persistence** | `TC-STO-02` | Verify page reload prompts user to load saved deck if `localStorage` is populated. | E2E | High |
| **Persistence** | `TC-STO-03` | Verify saving a new deck triggers Confirm Dialog if a deck already exists. | E2E | Medium |

## Edge Case Scenarios

- **API Rate Limiting:** Simulate a 429 response from Gemini. Ensure the application does not crash and explicitly shows the "rate limit exceeded" toast/error.
- **Empty JSON Structure:** Simulate the API returning valid JSON but with missing `id`, `question`, or `answer` keys. Ensure the validation block catches this and throws the structural error.
- **Malformed Paste Data:** User pastes 15,000 characters of zalgo text or complex unicode. The `handlePaste` function must perfectly slice to 10,000 characters without crashing the browser.
- **Keyboard Navigation Mash:** User rapidly mashes the Spacebar and Arrow Keys during deck review. Ensure the state does not decouple the active card index from the flip animation (e.g. showing Answer side of next card immediately).
- **Offline Mode:** User loses network connection during the "Generating..." loading state. Verify the fetch promise rejects gracefully and unlocks the UI.

## Boundary Validation Rules

1. **Character Limits:** `minLength = 50`, `maxLength = 10000`. Inputs strictly outside these bounds must absolutely fail validation.
2. **Card Array Length:** The application strictly expects `deck.length === 5`. An array of 4 or 6 must trigger an explicit error boundary.
3. **Viewport Lock:** Automated UI tests must be explicitly configured with `viewport: { width: 1024, height: 768 }` (or greater). Mobile dimensions are explicitly out of scope and should not be tested.
4. **Data Volatility:** If the user creates a deck but does *not* click "Save Deck", verifying `localStorage` must return `null` or `undefined`.

## Suggested Testing Approach

1. **Unit Testing (Jest/React Testing Library):** Focus on pure functions (`apiService.ts` error parsing, mock fallback logic) and isolated UI components (`NavigationOverlay` disabled states, `TextInputEngine` character counters).
2. **Integration Testing:** Mount `app/page.tsx` with a mocked global `fetch`. Validate state transitions from 'input' -> 'loading' -> 'deck' without hitting the real Gemini API.
3. **End-to-End Testing (Playwright/Cypress):** Test the happy path in a real browser. Paste text -> Generate -> Flip Card -> Save Deck -> Reload Page -> Load Saved Deck. Ensure `localStorage` acts as the single source of truth for persistence.

## Testing Folder Structure Guidance

```text
flashgenius-app/
├── __tests__/
│   ├── unit/
│   │   ├── apiService.test.ts
│   │   └── TextInputEngine.test.tsx
│   ├── integration/
│   │   └── page.test.tsx
│   └── fixtures/
│       ├── mockGeminiResponse.json
│       └── mockStudyNotes.txt
└── e2e/
    ├── generation-flow.spec.ts
    └── local-storage.spec.ts
```
