# KPI Document — FlashGenius

> **Domain:** EdTech · **Version:** 1.0 (MVP) · **Last Updated:** 2026-06-10

---

## Project Overview

FlashGenius is a single-purpose EdTech tool designed to eliminate the manual effort of flashcard creation during exam preparation. Students and teachers paste unstructured study notes into a textarea, click a single button, and via React + Gemini API instantly receive a deck of 5 interactive flashcards — each consisting of a question (front) and an answer (back) — rendered with a CSS flip animation optimized for active recall.

**Target Users:**

- **Students** (undergraduate and high-school) who need to convert raw lecture notes or textbook excerpts into structured revision aids within minutes before an exam.
- **Teachers** who want to auto-generate flashcard sets from lesson plans or textbook content for class-wide distribution without manual authoring.
- **Self-Learners** studying from articles, blog posts, or course transcripts who want to reinforce retention through interactive Q&A review.

**Core Problem:** A conversion bottleneck exists between unstructured text notes and structured, testable study material. Students spend more time *creating* flashcards than *studying* them, and teachers cannot scale manual card authoring across topics and cohorts. FlashGenius bridges this gap with one-click generation, CSS flip animations, and fully client-side persistence (no database needed).

---

## Business Objectives

1. **Eliminate the Flashcard Creation Bottleneck:** Reduce the time required to produce a 5-card revision deck from 15–30 minutes (manual) to under 60 seconds (automated), allowing users to invest their effort in recall practice instead of content formatting.

2. **Validate Automated Q&A Extraction as a Viable Product:** Prove through the POC that pasting a paragraph of study notes can reliably produce 5 contextually relevant, pedagogically useful flashcards — establishing the foundational value proposition for FlashGenius.

3. **Demonstrate Interactive Review Mechanics:** Confirm that a CSS flip animation provides a functional and engaging active-recall experience that users interact with (flip cards, navigate the deck) rather than passively observe.

4. **Establish Browser-Local Persistence:** Validate that saving a single deck to `localStorage` and retrieving it on subsequent visits is sufficient for the MVP's single-user, single-deck use case.

5. **Deliver a Submission-Ready POC:** Produce a demonstrable proof of concept that satisfies all three submission checklist items: flashcards generate from text, flip animation works, and 1 demo deck is saved.

---

## Success Metrics

The following parameters define what constitutes a successful validation of the FlashGenius MVP during the POC phase:

| # | Success Parameter | Definition | Target |
|---|---|---|---|
| 1 | **Generation Completeness** | Every valid text submission (50–10,000 characters of informational content) produces exactly 5 flashcards, each with a non-empty question and a non-empty answer. | 100% of POC demo runs produce 5 complete cards. |
| 2 | **CSS Flip Animation Functionality** | Every generated flashcard responds to a click/tap by playing a smooth front-to-back (and back-to-front) CSS transition animation without visual glitches, clipping, or frame drops. | All 5 cards in the demo deck flip correctly. |
| 3 | **Deck Persistence to localStorage** | A saved deck survives a full browser page reload by being stored in `localStorage`, restoring all 5 original cards with exact content intact. | 1 demo deck persists in `localStorage` and loads without data loss. |
| 4 | **End-to-End Flow Completion** | A single uninterrupted user journey — paste text → generate → flip all 5 cards → save deck → reload → load saved deck — completes without errors or dead-end states. | 100% completion in POC walkthrough. |
| 5 | **Input Validation Enforcement** | The system correctly prevents generation when input is blank, below 50 characters, or exceeds 10,000 characters, and provides clear user-facing feedback for each case. | All 3 boundary conditions handled gracefully. |

---

## Key Performance Indicators

The primary KPI table captures the core measurable outcomes that determine whether the FlashGenius MVP meets its POC goals.

| KPI Number | KPI Name | Verification Method | Criteria |
|---|---|---|---|
| KPI-01 | **Flashcard Generation from Text** | Paste a sample paragraph (≥ 50 characters) into the textarea, click "Generate Flashcards," and verify that exactly 5 flashcards are rendered in the deck view, each displaying a unique question on the front face and a corresponding answer on the back face. | 5 flashcards are generated per valid submission; each card contains a non-empty, non-duplicate question and answer pair. |
| KPI-02 | **CSS Flip Animation Execution** | Click each of the 5 generated flashcards and visually confirm that a smooth CSS 3D or 2D flip animation transitions the card from the question (front) to the answer (back) and reverses on a second click. | All 5 cards exhibit a visually smooth CSS flip animation on click with no rendering glitches, and the animation completes in ≤ 600 milliseconds per flip. |
| KPI-03 | **Demo Deck Saved to localStorage** | After generating a deck, click "Save Deck" and inspect the browser's `localStorage` (via developer tools) to confirm a valid deck object is persisted. Reload the page and verify the deck is retrievable with all 5 cards intact. | 1 deck object exists in `localStorage` containing `deck_id`, `cards` array (5 items), and each card's `question` and `answer` fields match the originally generated content. |
| KPI-04 | **Card Navigation Accuracy** | Use Previous/Next controls to navigate through all 5 cards in the deck. Verify the progress indicator updates correctly at each step (e.g., "Card 1 of 5" through "Card 5 of 5"). | Progress indicator reflects the correct card position at every step; Previous is disabled on Card 1, Next is disabled on Card 5. |
| KPI-05 | **Input Boundary Enforcement** | Test three boundary conditions: (a) submit an empty textarea, (b) submit text with fewer than 50 characters, (c) paste text exceeding 10,000 characters. Verify the system prevents generation and displays appropriate feedback for each. | Generate button is disabled for conditions (a) and (b); input is truncated to 10,000 characters for condition (c); descriptive user-facing messages are shown in all three cases. |
| KPI-06 | **End-to-End POC Completion** | Execute the full user flow — paste notes → generate flashcards → flip each card → save deck → reload page → load saved deck — in a single uninterrupted session and confirm no step produces an error or unresponsive state. | The complete flow executes without errors, the saved deck loads successfully after reload, and all 5 cards display their original content. |

---

## Operational KPIs

Operational KPIs focus on the system's processing performance, rendering reliability, and input handling during the MVP's core operations.

| KPI Number | KPI Name | Verification Method | Criteria |
|---|---|---|---|
| OPS-01 | **Generation Response Time** | Measure the elapsed time from clicking "Generate Flashcards" to the first flashcard being rendered in the deck view. Repeat across 5 distinct text inputs of varying lengths (50, 500, 2,000, 5,000, and 10,000 characters). | First card renders in ≤ 5 seconds for all 5 test inputs. |
| OPS-02 | **Generation Success Rate** | Submit 10 distinct, valid text passages (covering different subjects: biology, history, literature, mathematics, geography) and record how many produce exactly 5 well-formed flashcards without errors. | ≥ 9 out of 10 submissions (90%) produce 5 complete flashcards. |
| OPS-03 | **Flip Animation Frame Rate** | During the card flip animation, visually inspect (or measure via browser performance tools) for dropped frames, jitter, or rendering lag. Test on a standard-specification device. | Flip animation maintains ≥ 30 FPS with no visible stutter or clipping artifacts. |
| OPS-04 | **localStorage Write Latency** | Measure the elapsed time from clicking "Save Deck" to the confirmation toast appearing. Test with a full 5-card deck. | Toast confirmation appears in ≤ 500 milliseconds after clicking "Save Deck." |
| OPS-05 | **localStorage Read Integrity** | Save a deck, close the browser tab entirely, reopen the application, and load the saved deck. Compare every card's question and answer against the original. | 100% field-level match between saved and loaded deck data; zero data corruption across tab close/reopen. |
| OPS-06 | **Input Sanitization** | Paste rich text from a word processor (containing bold, italic, hyperlinks, and inline images) into the textarea and verify only plain text is retained. | All HTML tags, inline styles, non-printable characters, and embedded objects are stripped; textarea contains only clean plain text. |
| OPS-07 | **Error Recovery** | Simulate a generation failure (e.g., network timeout) and verify the UI exits the loading state, displays an error message, shows a "Retry" button, and preserves the original text in the textarea. | UI recovers to an interactive state within 30 seconds of failure; original text is intact; "Retry" re-triggers generation without requiring the user to re-paste content. |

---

## User Adoption KPIs

User Adoption KPIs measure initial interaction quality — whether users engage with the generated flashcards and utilize the persistence feature.

| KPI Number | KPI Name | Verification Method | Criteria |
|---|---|---|---|
| UA-01 | **Card Flip Interaction Rate** | During a demo session, track how many of the 5 generated cards the user flips to reveal the answer. A card is counted as "flipped" if the user clicks it at least once. | ≥ 4 out of 5 cards (80%) are flipped in a single review session. |
| UA-02 | **Full Deck Traversal Rate** | Track whether the user navigates through all 5 cards (Card 1 through Card 5) using Previous/Next controls during a single session. | User reaches Card 5 of 5 at least once per session. |
| UA-03 | **Deck Save Action Rate** | After generating a deck, observe whether the user clicks the "Save Deck" button. Measure across 5 independent demo sessions. | ≥ 3 out of 5 demo sessions (60%) result in the user saving the generated deck. |
| UA-04 | **Saved Deck Reload Rate** | After saving a deck and reloading the page, observe whether the user selects "Load Saved Deck" (versus "Create New Deck"). Measure across 3 independent sessions where a saved deck exists. | ≥ 2 out of 3 sessions (66%) result in the user loading the previously saved deck. |
| UA-05 | **Repeat Generation Rate** | Track whether the user pastes new text and generates a second deck within the same session after reviewing the first deck. | At least 1 out of 5 demo sessions includes a second generation attempt — indicating re-engagement with the tool. |
| UA-06 | **Time to First Flip** | Measure the elapsed time from the deck view first appearing to the user's first card flip interaction. | User flips the first card within ≤ 10 seconds of the deck view rendering — indicating the flip affordance is intuitive and discoverable. |

---

## Financial KPIs

FlashGenius MVP operates as a zero-cost, browser-local proof of concept. No transactional revenue, subscription fees, or paid infrastructure is in scope. Financial KPIs for this phase are limited to cost containment and ROI validation of the POC investment.

| KPI Number | KPI Name | Verification Method | Criteria |
|---|---|---|---|
| FIN-01 | **MVP Development Cost Adherence** | Compare actual development hours against the estimated POC budget (hours allocated for textarea input, generation integration, flip-card UI, and localStorage persistence). | Actual development effort does not exceed the allocated POC estimate by more than 20%. |
| FIN-02 | **Infrastructure Cost at MVP** | Verify that the MVP's client-side architecture (localStorage for persistence, single-page interface) incurs no recurring hosting, database, or cloud service fees beyond static file serving. | Total recurring infrastructure cost = $0 for the MVP phase (excluding the generation service's own API costs, if externally hosted). |
| FIN-03 | **Generation API Cost per Deck** | If the flashcard generation service uses a metered external API (e.g., a pay-per-request intelligence service), calculate the cost per 5-card deck generation based on input token count for a 10,000-character submission. | Cost per deck generation is documented and stays within an acceptable threshold for POC-phase usage (target: ≤ $0.05 per deck). |
| FIN-04 | **Zero Transaction Revenue (Expected)** | Confirm that the MVP does not include any payment flow, subscription gate, or monetization mechanism, matching the defined scope. | No payment-related UI elements, API endpoints, or transaction processing logic exist in the MVP. |

---

## Risk Indicators

Risk indicators capture failure modes that could compromise the POC demonstration or degrade user experience during the MVP phase.

| KPI Number | KPI Name | Verification Method | Criteria |
|---|---|---|---|
| RISK-01 | **localStorage Quota Exceeded** | Attempt to save a deck when the browser's localStorage is near its 5 MB quota limit (pre-fill localStorage with dummy data). Verify the system detects the failure and presents a user-facing message instead of silently failing. | System detects `QuotaExceededError`, does not crash, and displays: *"Storage is full. Replace existing deck to save this one?"* |
| RISK-02 | **localStorage Unavailable (Private Browsing)** | Open the application in a private/incognito browsing window where localStorage may be restricted. Verify the system detects unavailability and disables the save feature gracefully. | "Save Deck" button is disabled with a tooltip: *"Saving is not available in your current browser mode."* The rest of the application (generation, flip, navigation) remains fully functional. |
| RISK-03 | **Unparseable Input Text** | Submit text containing only special characters (`!@#$%^&*()`), emoji sequences, or a single word repeated 200 times. Verify the system rejects the input with a meaningful error rather than generating nonsensical cards. | API returns a `422 UNPROCESSABLE_CONTENT` response; UI displays: *"We couldn't extract enough meaningful content from your notes."* No malformed or empty flashcards are rendered. |
| RISK-04 | **Network Timeout During Generation** | Simulate a network disconnection or a server timeout (> 30 seconds) after the user clicks "Generate Flashcards." Verify the UI does not hang indefinitely. | The loading state times out at 30 seconds; UI displays an error message and a "Retry" button; the original text is preserved in the textarea; no spinner persists indefinitely. |
| RISK-05 | **Double-Click / Rapid Resubmission** | Rapidly click the "Generate Flashcards" button 5 times within 1 second. Verify only a single generation request is dispatched and no duplicate or partial decks appear. | Exactly 1 API call is made; the button enters a disabled/loading state on the first click; 5 (not 10, 15, or 25) cards are rendered upon completion. |
| RISK-06 | **Corrupted localStorage Data** | Manually modify the saved deck object in localStorage (e.g., delete a card's `answer` field or corrupt the JSON structure). Reload the application and attempt to load the saved deck. | System detects the corrupted data, does not crash, and either prompts the user to create a new deck or displays: *"Your saved deck appears to be damaged. Please generate a new one."* |
| RISK-07 | **Cross-Tab Conflict** | Open FlashGenius in two browser tabs. Save a deck in Tab A, then generate and save a different deck in Tab B. Reload Tab A and verify the state is consistent. | The most recently saved deck is loaded (last-write-wins). No merge conflicts, partial overwrites, or application errors occur. Tab A reflects Tab B's saved deck after reload. |

---

## Reporting Dashboard Recommendations

For the MVP phase, a full analytics dashboard is out of scope. However, the following lightweight visual widgets and status flags are recommended for internal monitoring during the POC demonstration and early validation period:

### Status Flag Panel

| Widget | Type | Description |
|---|---|---|
| **Generation Health** | Status Indicator (Green / Yellow / Red) | Green: last generation request succeeded. Yellow: last request succeeded but took > 3 seconds. Red: last request failed or timed out. Resets on each new generation attempt. |
| **localStorage Status** | Status Indicator (Available / Unavailable) | Displays whether localStorage is writable in the current browser session. Checked on page load. |
| **Saved Deck Presence** | Boolean Flag (Yes / No) | Indicates whether a valid deck exists in localStorage. Updated after save, delete, and page load events. |

### Counters (Session-Scoped)

| Widget | Type | Description |
|---|---|---|
| **Cards Generated** | Numeric Counter | Total number of flashcards generated during the current browser session (resets on page close). Tracks generation volume. |
| **Cards Flipped** | Numeric Counter | Total number of unique card flip interactions during the current session. Helps gauge engagement depth. |
| **Decks Saved** | Numeric Counter | Number of "Save Deck" actions taken during the current session. Expected MVP value: 0 or 1. |

### Timing Metrics

| Widget | Type | Description |
|---|---|---|
| **Last Generation Duration** | Timer Display (seconds) | Shows the elapsed time of the most recent generation request. Helps identify performance regressions during demos. |
| **Session Duration** | Timer Display (minutes) | Elapsed time since the user opened the application. Tracks engagement length without requiring server-side analytics. |

### Recommended Implementation Approach

These widgets should be implemented as an internal-only debug panel (toggled via a keyboard shortcut or hidden UI element) rather than surfaced in the primary user interface. This preserves the clean, focused user experience while providing the POC team with real-time observability during demonstrations.

---

## Assumptions

The following assumptions underpin the KPI definitions and success criteria. If any assumption proves invalid, the affected KPIs must be re-evaluated.

| # | Assumption | Impact if Invalid |
|---|---|---|
| 1 | **Users paste English-language text.** The MVP targets English-only input. Flashcard quality metrics (relevance, accuracy) are calibrated for English-language educational content. | Non-English input may produce low-quality or nonsensical Q&A pairs, reducing Generation Success Rate (OPS-02) and Flashcard Relevance scores. |
| 2 | **Input text is informational in nature.** The system assumes users paste study notes, textbook excerpts, or educational articles — not fiction, code, poetry, or conversational text. | Non-informational text may trigger UNPROCESSABLE_CONTENT errors at rates exceeding the 10% failure allowance in OPS-02. |
| 3 | **Input length falls between 50 and 10,000 characters.** KPIs are designed around this range. Extremely short inputs (< 50 chars) are rejected; extremely long inputs (> 10,000 chars) are truncated. | Inputs near the lower boundary (50–100 chars) may produce lower-quality cards due to insufficient source material, affecting relevance scores. |
| 4 | **The browser supports localStorage with ≥ 5 MB quota.** All persistence KPIs assume a standards-compliant browser (Chrome, Firefox, Safari, Edge) with localStorage enabled and a minimum 5 MB quota. | Private browsing modes or non-standard browsers may disable localStorage entirely, making save/load KPIs unverifiable in those environments. |
| 5 | **A single deck is saved at any time.** The MVP supports exactly one saved deck in localStorage. KPIs related to deck persistence assume a single-deck storage model with a last-write-wins conflict resolution strategy. | If future iterations require multi-deck storage, persistence KPIs (KPI-03, OPS-05, RISK-01) must be revised to account for cumulative storage usage and deck selection logic. |
| 6 | **The flashcard generation service is available and responsive.** Generation KPIs assume the backend service (or external API) returns results within 5 seconds. Network failures and service outages are treated as exceptional, not baseline, conditions. | Sustained service unavailability would prevent any generation KPIs from being measured, blocking the entire POC demonstration. |
| 7 | **The POC is demonstrated on a single device/browser.** KPIs do not account for cross-device sync, multi-browser compatibility testing, or responsive layout breakpoints across form factors. | If the POC must be demonstrated on mobile or multiple browsers, additional rendering and interaction KPIs (touch gestures, viewport adaptation) would be required. |
| 8 | **Exactly 5 flashcards are generated per submission.** The fixed card count of 5 is a hard constraint. All KPIs measuring card-level interactions (flip rate, navigation, relevance) are calibrated to a 5-card deck. | If the card count becomes configurable in future versions, all card-level KPIs must be normalized to percentages rather than absolute counts. |

---

## Future KPIs

The following metrics are **reserved for future iterations** beyond the MVP. They are explicitly out of scope for the current POC but are documented here to inform the product roadmap and ensure continuity between phases.

| # | Future KPI | Description | Prerequisite |
|---|---|---|---|
| 1 | **Card Retention Rate** | Percentage of flashcards a user can correctly recall (self-reported or quiz-validated) after a defined interval (1 day, 3 days, 7 days). Measures long-term pedagogical effectiveness. | Requires a quiz/self-assessment mode and session tracking across multiple visits. |
| 2 | **Spaced Repetition Interval Adherence** | Measures whether users return to review cards at the intervals prescribed by a spaced repetition algorithm (e.g., SM-2 or Leitner scheduling). | Requires implementation of a spaced repetition engine and per-card scheduling metadata. |
| 3 | **Multi-Deck Library Growth** | Total number of decks saved per user over time. Tracks whether users build a growing library of revision material. | Requires multi-deck storage, deck naming, and a deck management UI. |
| 4 | **Cross-Device Sync Adoption** | Percentage of users who access their saved decks from more than one device or browser. | Requires user authentication, server-side deck persistence, and a sync protocol. |
| 5 | **Deck Sharing Frequency** | Number of decks shared via link, export, or direct collaboration per user per week. | Requires sharing infrastructure (unique deck URLs, access controls, or export formats like CSV/Anki). |
| 6 | **Custom Card Count Utilization** | Distribution of user-selected card counts (e.g., 3, 5, 10, 20) when configurable generation is available. Informs default value optimization. | Requires a card count selector in the UI and backend support for variable generation. |
| 7 | **Input Source Diversification** | Breakdown of input methods (paste text, upload PDF, upload image, voice-to-text) once multi-modal input is supported. | Requires file upload, OCR, and/or speech-to-text integration. |
| 8 | **Flashcard Edit Rate** | Percentage of generated cards that users manually edit (modify question, modify answer, delete card, add card). Indicates generation quality gaps. | Requires an inline card editing interface with save-back functionality. |
| 9 | **Net Promoter Score (NPS)** | User-reported willingness to recommend FlashGenius to peers, collected via an in-app survey. | Requires an in-app feedback mechanism and a sufficient active user base for statistical significance. |
| 10 | **Monthly Active Users (MAU)** | Count of unique users who interact with FlashGenius at least once in a 30-day window. | Requires user identification (authentication or anonymous tracking) and server-side analytics. |
| 11 | **Average Session Duration** | Mean time spent per user session, from page load to tab close. | Requires client-side session timing with heartbeat tracking and server-side aggregation. |
| 12 | **Generation Quality Score (Automated)** | Automated evaluation of generated Q&A pairs against the source text using semantic similarity scoring, replacing manual relevance review. | Requires an automated evaluation pipeline with NLP-based semantic comparison. |

---

*End of Document*
