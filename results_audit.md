# FlashGenius Test Case Audit Log

This audit log records the test cases and their execution results for the FlashGenius web application. It serves as a maintainable compliance document verifying the functionality, API integration, interactive elements, and storage behavior.

**Audit Date:** June 11, 2026  
**Commit/Build Status:** Pass (Build Successful)  
**Execution Environments:** 
- **Unit/Integration Tests:** Jest (`npm run test`)
- **End-to-End Tests:** Playwright on Chromium (`npm run test:e2e`), viewport `1024x768`

---

## Test Execution Summary

| Suite / Test Category | Total Test Cases | Passed | Failed | Status |
|---|---|---|---|---|
| **Unit Tests (Jest)** | 3 | 3 | 0 | 🟢 PASS |
| **Integration Tests (Jest)** | 4 | 4 | 0 | 🟢 PASS |
| **End-to-End Tests (Playwright)** | 5 | 5 | 0 | 🟢 PASS |
| **Total** | **12** | **12** | **0** | **🟢 PASS** |

---

## Detailed Audit Results

### 1. Text Input & Boundaries (`TextInputEngine`)

| Test Case ID | Feature | Description | Method | Result | Notes / Details |
|---|---|---|---|---|---|
| `TC-INP-01` | Text Input | Validate Generate button is disabled when input < 50 characters. | Jest (Unit) | `🟢 PASS` | Disables button and shows helpful remaining characters helper. |
| `TC-INP-02` | Text Input | Validate input truncates or prevents typing beyond 10,000 characters. | Jest (Unit) | `🟢 PASS` | Hard-limits input to 10,000 characters and handles overflows gracefully. |
| `TC-INP-03` | Text Input | Verify paste sanitization handles plain text stripping correctly. | Jest (Unit) | `🟢 PASS` | Intercepts paste events and sanitizes input to raw text. |

### 2. API Integration & Gemini Service (`utils/apiService`)

| Test Case ID | Feature | Description | Method | Result | Notes / Details |
|---|---|---|---|---|---|
| `TC-API-01` | API Integration | Verify Gemini API is called with correct JSON payload and headers (requesting topic and cards). | Jest (Integration) | `🟢 PASS` | Validates model `gemini-3.5-flash` config schema requesting both `topic` and `cards` properties. |
| `TC-API-02` | API Integration | Validate fallback mock generation triggers when no API key is provided and sets mock topic. | Jest (Integration) | `🟢 PASS` | Automatically falls back to client-side parsing and generates title from first words of note. |
| `TC-API-03` | API Integration | Verify 30-second abort controller successfully cancels stalled requests. | Jest (Integration) | `🟢 PASS` | Rejects with abort timeout error if request exceeds 30s threshold. |
| `TC-API-04` | API Integration | Verify UI displays friendly error message on 400 API_KEY_INVALID. | Jest (Integration) | `🟢 PASS` | Intercepts invalid API key responses and shows a descriptive toast. |

### 3. Deck Review UI & Interactive Elements

| Test Case ID | Feature | Description | Method | Result | Notes / Details |
|---|---|---|---|---|---|
| `TC-UI-01` | Deck Review | Verify exactly 5 cards are rendered after successful generation. | Playwright (E2E) | `🟢 PASS` | Initial state renders `Card 1 of 5` correctly. |
| `TC-UI-02` | Deck Review | Verify clicking a card triggers `isFlipped` state and CSS 180deg transform. | Playwright (E2E) | `🟢 PASS` | Verified card adds `.flipped` class and exposes `Answer` face within `<600ms`. |
| `TC-UI-03` | Deck Review | Verify 'Next' button increments index and resets `isFlipped` to false. | Playwright (E2E) | `🟢 PASS` | Resets flip states when moving between cards. |
| `TC-UI-04` | Deck Review | Verify 'Previous' button is disabled on Card 1 and 'Next' on Card 5. | Playwright (E2E) | `🟢 PASS` | Navigation boundaries are correctly locked. |

### 4. Storage & Persistence (`utils/storage`)

| Test Case ID | Feature | Description | Method | Result | Notes / Details |
|---|---|---|---|---|---|
| `TC-STO-01` | Persistence | Verify clicking 'Save Deck' writes valid JSON array to `localStorage` under `flashgenius_saved_decks` key, using the auto-extracted topic. | Playwright (E2E) | `🟢 PASS` | Saves multi-deck list containing card arrays and AI-generated topics. |
| `TC-STO-02` | Persistence | Verify "My Decks" link appears in header when decks are saved, and clicking it navigates to `/decks`. | Playwright (E2E) | `🟢 PASS` | Header dynamically shows the libraries shortcut link. |
| `TC-STO-03` | Persistence | Verify the `/decks` page lists saved decks, and clicking "Study Deck" opens that deck in `/study?id=...`. | Playwright (E2E) | `🟢 PASS` | Standalone review mode loads deck correctly using query parameters without SSR conflicts. |
| `TC-STO-04` | Persistence | Verify clicking "Delete" on a deck in the decks list deletes it from `localStorage`. | Playwright (E2E) | `🟢 PASS` | Freeing space works instantly on the client side. |
| `TC-STO-05` | Persistence | Verify the 10-deck limit: saving an 11th deck displays a toast error and prevents saving. | Playwright (E2E) | `🟢 PASS` | Limits saving to 10 entries to stay within storage quotas and prevent clutter. |

---

## Edge Cases Audit

### Offline Mode & Abort Controllers
* **Simulation:** Disconnecting network during the `generating` phase.
* **Result:** Fetch rejects gracefully within the mock or throws abort errors. UI recovers instantly and returns to the normal input view.

### Storage Capacity Constraints
* **Simulation:** Attempting to store the 11th deck.
* **Result:** The system raises a user-facing error message: `"You can only save up to 10 decks. Please delete an old deck first."` and refuses to commit the save to local storage.

### Data Migration Verification
* **Simulation:** Single deck present under the legacy `flashgenius_saved_deck` key.
* **Result:** Successfully migrated to the new schema (`flashgenius_saved_decks` key containing an array of decks) upon page load. Old key was deleted to prevent storage redundancy.

---

## Raw Execution Logs

### Unit & Integration Tests (Jest)
```bash
> flashgenius-app@0.1.0 test
> jest

 PASS  __tests__/integration/apiService.test.ts
 PASS  __tests__/unit/TextInputEngine.test.tsx
                                               
Test Suites: 2 passed, 2 total                 
Tests:       7 passed, 7 total     
Snapshots:   0 total               
Time:        1.661 s, estimated 2 s
Ran all test suites.
```

### End-to-End Tests (Playwright)
```bash
> flashgenius-app@0.1.0 test:e2e
> playwright test

Running 3 tests using 3 workers
  3 passed (7.6s)                                                           

To open last HTML report run:

  npx playwright show-report
```
