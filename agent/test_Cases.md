# FlashGenius Test Cases & QA Strategy

## Test Coverage Matrix

| Feature Module | Test Case ID | Description | Type | Priority |
|---|---|---|---|---|
| **Text Input** | `TC-INP-01` | Validate Generate button is disabled when input < 50 characters. | UI/Unit | High |
| **Text Input** | `TC-INP-02` | Validate input truncates or prevents typing beyond 10,000 characters. | UI/Unit | High |
| **Text Input** | `TC-INP-03` | Verify paste sanitization handles plain text stripping correctly. | UI/Unit | Medium |
| **API Integration** | `TC-API-01` | Verify Gemini API is called with correct JSON payload and headers (requesting topic and 5 cards). | Integration | High |
| **API Integration** | `TC-API-02` | Validate fallback mock generation triggers when no API key is provided and sets mock topic. | Integration | Medium |
| **API Integration** | `TC-API-03` | Verify 30-second abort controller successfully cancels stalled requests. | Integration | High |
| **API Integration** | `TC-API-04` | Verify UI displays friendly error message on 400 API_KEY_INVALID. | Integration | High |
| **Deck Review** | `TC-UI-01` | Verify exactly 5 cards are rendered after successful generation. | E2E | High |
| **Deck Review** | `TC-UI-02` | Verify clicking a card triggers `isFlipped` state and CSS 180deg transform. | E2E | High |
| **Deck Review** | `TC-UI-03` | Verify 'Next' button increments index and resets `isFlipped` to false. | E2E | High |
| **Deck Review** | `TC-UI-04` | Verify 'Previous' button is disabled on Card 1 and 'Next' on Card 5. | UI/Unit | Medium |
| **Persistence** | `TC-STO-01` | Verify clicking 'Save Deck' writes valid JSON array to `localStorage` under `flashgenius_saved_decks` key, using the auto-extracted topic. | E2E | High |
| **Persistence** | `TC-STO-02` | Verify "My Decks" link appears in header when decks are saved, and clicking it navigates to `/decks`. | E2E | High |
| **Persistence** | `TC-STO-03` | Verify the `/decks` page lists saved decks, and clicking "Study Deck" opens that deck in `/study?id=...`. | E2E | High |
| **Persistence** | `TC-STO-04` | Verify clicking "Delete" on a deck in the decks list deletes it from `localStorage`. | E2E | Medium |
| **Persistence** | `TC-STO-05` | Verify the 10-deck limit: saving an 11th deck displays a toast error and prevents saving. | E2E | High |

## Edge Case Scenarios

- **API Rate Limiting:** Simulate a 429 response from Gemini. Ensure the application does not crash and explicitly shows the "rate limit exceeded" toast/error.
- **Empty JSON Structure:** Simulate the API returning valid JSON but with missing `topic`, `id`, `question`, or `answer` keys. Ensure the validation block catches this and throws the structural error.
- **Malformed Paste Data:** User pastes 15,000 characters of zalgo text or complex unicode. The `handlePaste` function must perfectly slice to 10,000 characters without crashing the browser.
- **Keyboard Navigation Mash:** User rapidly mashes the Spacebar and Arrow Keys during deck review. Ensure the state does not decouple the active card index from the flip animation.
- **Offline Mode:** User loses network connection during the "Generating..." loading state. Verify the fetch promise rejects gracefully and unlocks the UI.
- **Legacy Storage Migration:** Ensure that if a user has a single deck saved under the legacy `flashgenius_saved_deck` key, it is successfully migrated to the new `flashgenius_saved_decks` array upon loading the app.

## Boundary Validation Rules

1. **Character Limits:** `minLength = 50`, `maxLength = 10000`. Inputs strictly outside these bounds must absolutely fail validation.
2. **Card Array Length:** The application strictly expects `deck.length === 5`. An array of 4 or 6 must trigger an explicit error boundary.
3. **Viewport Lock:** Automated UI tests must be explicitly configured with `viewport: { width: 1024, height: 768 }`. Mobile dimensions are out of scope.
4. **Data Volatility:** If the user creates a deck but does *not* click "Save Deck", verifying `localStorage` must return empty or no new additions to `flashgenius_saved_decks`.
5. **Storage Cap:** `maxDecks = 10`. Attempts to push an 11th item to the array must fail.

## Suggested Testing Approach

1. **Unit Testing (Jest/React Testing Library):** Focus on pure functions (`apiService.ts` error parsing, mock fallback logic) and isolated UI components (`NavigationOverlay` disabled states, `TextInputEngine` character counters).
2. **Integration Testing:** Mount `app/page.tsx` with a mocked global `fetch`. Validate state transitions from 'input' -> 'loading' -> 'deck' without hitting the real Gemini API.
3. **End-to-End Testing (Playwright/Cypress):** Test the happy path in a real browser. Paste text -> Generate -> Flip Card -> Save Deck -> Go to My Decks -> Open Deck -> Delete Deck. Ensure `localStorage` acts as the single source of truth for persistence.
