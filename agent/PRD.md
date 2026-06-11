# FlashGenius — Product Requirements Document

> **Domain:** EdTech · **Version:** 1.0 (MVP) · **Last Updated:** 2026-06-10

---

## 1. Problem Statement

### Pain Points

Exam preparation is one of the most time-sensitive phases in a student's academic cycle. Despite having access to lecture notes, textbooks, and supplementary materials, students face critical inefficiencies that directly impact retention and performance:

1. **Manual Flashcard Creation Is Tedious:** Students who use flashcards as a revision technique spend a disproportionate amount of time *creating* the cards rather than *studying* them. Converting paragraphs of dense notes into discrete question-and-answer pairs requires sustained cognitive effort — effort that would be better spent on actual recall practice.

2. **Unstructured Notes Resist Active Recall:** Most students revise by passively re-reading highlighted text. Research consistently shows that active recall (self-testing via questions) dramatically outperforms passive review, yet the barrier to generating self-test material keeps students trapped in low-yield study habits.

3. **Teachers Lack Scalable Tools:** Educators who want to distribute flashcard-based revision aids to their classes must manually author each card. For a single chapter, this can take 30–60 minutes — time that scales linearly with the number of topics and is rarely reusable across cohorts without modification.

4. **Context Switching Across Tools:** Students currently bounce between note-taking apps, generic flashcard platforms, and document editors. Each tool handles only one part of the workflow, introducing friction, data loss, and abandoned study sessions.

### Operational Inefficiency

The core inefficiency is a **conversion bottleneck**: valuable study content exists in unstructured text form, but no lightweight tool exists to instantly transform it into structured, interactive revision material. This bottleneck causes students to either skip flashcard-based study entirely or invest preparation time that yields diminishing returns.

---

## 2. Solution Overview

### What Is FlashGenius?

FlashGenius is a focused, single-purpose EdTech tool that enables students and teachers to **paste any block of text or notes and instantly generate a deck of interactive flashcards** (question + answer pairs). The platform eliminates the manual effort of flashcard creation by intelligently extracting key concepts from unstructured text and presenting them in a flip-card interface optimized for active recall.

### Target User Personas

| Persona | Description | Primary Goal |
|---|---|---|
| **The Cramming Student** | Undergraduate or high-school student with 1–3 days before an exam. Has class notes or textbook excerpts but no structured revision aids. | Convert raw notes into testable flashcards in under 60 seconds. |
| **The Proactive Teacher** | Educator preparing supplementary revision material for a class of 30+ students. Needs to produce flashcard sets quickly from lesson plans or textbook content. | Generate and distribute ready-to-use flashcard decks without manual authoring. |
| **The Self-Learner** | Independent learner studying from articles, blog posts, or online course transcripts. Wants to reinforce retention from ad-hoc reading material. | Turn any pasted passage into a personal study deck saved for repeated review. |

### Core Goals

1. **Zero-Friction Input:** A single textarea where any text — lecture notes, textbook excerpts, article passages — can be pasted without formatting requirements.
2. **Instant Generation:** One click to produce a set of meaningful, contextually accurate flashcards from the submitted text.
3. **Interactive Review:** A flip-card interface that supports active recall by displaying the question first and revealing the answer on interaction.
4. **Persistent Decks:** Generated decks are saved to the browser's local storage so students can return to review without re-generating cards.

---

## 3. User Flow

The end-to-end user journey proceeds through five sequential stages:

### Stage 1 — Landing & Input

1. The user opens FlashGenius and is presented with a clean interface containing a single, prominent **text area** labeled *"Paste your notes here"*.
2. The user pastes or types study material into the text area. The text area accepts plain text of any length between **50 and 10,000 characters**.
3. A live character counter below the text area displays the current character count and the maximum allowed limit.
4. If the text is below the 50-character minimum, the **"Generate Flashcards"** button remains visually disabled with a tooltip explaining the minimum requirement.

### Stage 2 — Generation Trigger

5. Once valid text is entered, the user clicks the **"Generate Flashcards"** button.
6. The button transitions to a loading state (e.g., spinner with label *"Generating…"*) to indicate processing.
7. The system processes the input text and extracts key concepts, producing **5 flashcards**, each consisting of a **question** (front) and an **answer** (back).
8. If generation fails for any reason, the user sees a descriptive inline error message with a **"Retry"** option. The original text remains intact in the textarea.

### Stage 3 — Flashcard Review

9. Upon successful generation, the UI transitions to a **deck view** displaying the first flashcard with its question visible (front face).
10. The user taps or clicks the card to trigger a **flip animation**, revealing the answer on the back face.
11. Navigation controls (**Previous / Next** buttons or swipe gestures) allow the user to move between the 5 cards in the deck.
12. A progress indicator (e.g., *"Card 2 of 5"*) keeps the user oriented within the deck.
13. The user can tap/click the card again to flip it back to the question side at any time.

### Stage 4 — Saving the Deck

14. Below the deck view, a **"Save Deck"** button is displayed.
15. The user clicks **"Save Deck"**, and the system persists the entire deck (all 5 cards with questions and answers, along with the automatically extracted topic title) to the browser's local storage.
16. A confirmation toast notification appears: *"Deck saved successfully!"*
17. The user can save up to 10 decks. If the limit is reached, they must delete an old deck before saving a new one.

### Stage 5 — Returning to Saved Decks

18. On subsequent visits, if saved decks are detected in local storage, a **"My Decks"** link is displayed in the header.
19. Selecting **"My Decks"** navigates the user to a dedicated page listing all saved decks with their card counts and creation dates.
20. The user can click on any deck to open it in a separate study view, or delete it to free up space.

---

## 4. API Design

The following table defines the conceptual RESTful API surface required to support the FlashGenius MVP. These endpoints describe the logical contract between the client interface and the flashcard generation service.

### 4.1 Flashcard Generation

| Method | Endpoint | Description | Request Payload | Response Payload |
|---|---|---|---|---|
| `POST` | `/api/flashcards/generate` | Accepts a block of plain text and returns a set of generated flashcards (question + answer pairs). | `{ "text": "string (50–10,000 chars)", "card_count": 5 }` | `{ "deck_id": "string (UUID)", "cards": [ { "id": "string", "question": "string", "answer": "string" } ], "generated_at": "ISO-8601 timestamp" }` |

### 4.2 Deck Persistence

| Method | Endpoint | Description | Request Payload | Response Payload |
|---|---|---|---|---|
| `POST` | `/api/decks/save` | Persists a generated deck to storage for later retrieval. | `{ "deck_id": "string", "title": "string (auto-generated or user-defined)", "cards": [ { "id": "string", "question": "string", "answer": "string" } ] }` | `{ "status": "saved", "deck_id": "string", "saved_at": "ISO-8601 timestamp" }` |
| `GET` | `/api/decks/{deck_id}` | Retrieves a previously saved deck by its unique identifier. | N/A (deck_id in URL path) | `{ "deck_id": "string", "title": "string", "cards": [ { "id": "string", "question": "string", "answer": "string" } ], "saved_at": "ISO-8601 timestamp" }` |
| `DELETE` | `/api/decks/{deck_id}` | Removes a saved deck from storage permanently. | N/A (deck_id in URL path) | `{ "status": "deleted", "deck_id": "string" }` |

### 4.3 Health & Validation

| Method | Endpoint | Description | Request Payload | Response Payload |
|---|---|---|---|---|
| `GET` | `/api/health` | Returns the operational status of the service. | N/A | `{ "status": "healthy", "uptime": "string" }` |
| `POST` | `/api/flashcards/validate` | Pre-validates input text before generation (character count, language detection, content density check). | `{ "text": "string" }` | `{ "valid": true/false, "char_count": number, "issues": ["string"] }` |

### Error Response Contract

All endpoints return errors in a consistent envelope:

| HTTP Status | Condition | Response Payload |
|---|---|---|
| `400` | Input text is blank, below minimum length, or exceeds maximum length. | `{ "error": "INVALID_INPUT", "message": "Text must be between 50 and 10,000 characters.", "field": "text" }` |
| `404` | Requested deck_id does not exist in storage. | `{ "error": "DECK_NOT_FOUND", "message": "No deck found with the specified ID." }` |
| `422` | Text is valid in length but contains no extractable concepts (e.g., random characters, single repeated word). | `{ "error": "UNPROCESSABLE_CONTENT", "message": "The submitted text does not contain sufficient informational content to generate flashcards." }` |
| `500` | Internal processing failure during flashcard generation. | `{ "error": "GENERATION_FAILED", "message": "Flashcard generation encountered an unexpected error. Please retry." }` |

---

## 5. Edge Cases

| # | Edge Case | Trigger Condition | Mitigation Strategy |
|---|---|---|---|
| 1 | **Blank or whitespace-only input** | User clicks "Generate Flashcards" with an empty textarea or text containing only spaces, tabs, and newlines. | The system trims the input before validation. If the trimmed result is empty, the "Generate Flashcards" button remains disabled. If somehow submitted, the API returns a `400 INVALID_INPUT` error and the UI displays an inline message: *"Please paste some study notes before generating flashcards."* |
| 2 | **Input below minimum length** | User pastes fewer than 50 characters of meaningful text (e.g., a single sentence fragment like "Mitosis is cell division"). | The character counter turns red and displays a warning: *"Minimum 50 characters required for meaningful flashcard generation."* The generate button remains disabled until the threshold is met. |
| 3 | **Extremely long input exceeding maximum** | User pastes an entire textbook chapter or document exceeding 10,000 characters. | The textarea enforces a hard limit of 10,000 characters. Characters beyond the limit are not accepted. The counter displays: *"10,000 / 10,000 — Maximum reached."* If the user pastes content exceeding the limit, only the first 10,000 characters are retained and the user is notified via a toast: *"Input was trimmed to 10,000 characters."* |
| 4 | **Non-informational or gibberish text** | User pastes random characters ("aslkdjfalksjdf"), code snippets with no semantic meaning, or a single word repeated 100 times. | The generation service performs a content-density check. If the text lacks sufficient informational variety to produce meaningful Q&A pairs, the API returns a `422 UNPROCESSABLE_CONTENT` error. The UI shows: *"We couldn't extract enough meaningful content from your notes. Try pasting more detailed study material."* |
| 5 | **Duplicate generation request (double-click)** | User rapidly clicks the "Generate Flashcards" button multiple times before the first request completes. | The button is immediately disabled and enters a loading state upon the first click. Subsequent clicks are ignored until the generation request resolves (success or failure). No duplicate requests are dispatched. |
| 6 | **Browser local storage unavailable or full** | User's browser has local storage disabled (private browsing mode) or the storage quota is exceeded. | Before attempting to save, the system checks local storage availability. If unavailable, the "Save Deck" button displays a tooltip: *"Saving is not available in your current browser mode."* If storage is full or the 10-deck limit is reached, the user is prompted: *"You can only save up to 10 decks. Please delete an old deck first."* |
| 7 | **Network failure during generation** | The user's internet connection drops after clicking "Generate Flashcards" but before receiving a response. | The request times out after 30 seconds. The UI exits the loading state and displays an error message: *"Generation failed — please check your connection and try again."* A "Retry" button is shown. The original text remains in the textarea. |
| 8 | **Pasting formatted or rich text** | User copies text from a word processor, PDF, or webpage that includes HTML tags, special formatting, or embedded objects. | The textarea strips all formatting on paste and accepts only plain text. Hidden HTML tags, inline styles, and non-printable characters are sanitized. The user sees only clean, unformatted text in the input field. |

---

## 6. KPIs (Success Metrics & Acceptance Criteria)

### 6.1 Success Metrics

| Metric | Definition | Target (MVP) |
|---|---|---|
| **Generation Success Rate** | Percentage of valid text submissions that successfully produce 5 flashcards without error. | ≥ 95% |
| **Time to First Card** | Elapsed time from clicking "Generate Flashcards" to the first card being rendered in the deck view. | ≤ 5 seconds |
| **Flashcard Relevance Score** | Qualitative assessment (manual review) of whether generated Q&A pairs are contextually accurate and pedagogically useful. | ≥ 4 out of 5 cards rated "relevant" per deck (based on manual review of 10 sample decks). |
| **Flip Interaction Rate** | Percentage of generated cards that the user actually flips to view the answer. | ≥ 80% of cards in a session are flipped. |
| **Deck Save Rate** | Percentage of generated decks that the user saves to local storage. | ≥ 50% of generated decks are saved. |
| **Return Visit Rate** | Percentage of users who load a saved deck on a subsequent visit. | ≥ 30% within a 7-day window (post-launch tracking). |

### 6.2 POC Acceptance Criteria

The Proof of Concept is considered **complete and validated** when all of the following conditions are demonstrably met:

| # | Acceptance Criterion | Validation Method |
|---|---|---|
| 1 | A user can paste a paragraph of study notes (minimum 50 characters) into the text area and click "Generate Flashcards" to receive exactly **5 flashcards**, each with a distinct question and answer. | Demonstrate by pasting a sample paragraph and verifying 5 unique Q&A pairs are displayed. |
| 2 | Each flashcard supports a **flip animation** — clicking the card smoothly transitions from the question (front face) to the answer (back face) and vice versa. | Visually confirm the flip animation plays on click for each of the 5 cards. |
| 3 | The user can navigate between all 5 cards using Previous/Next controls, and a progress indicator correctly reflects the current position (e.g., *"Card 3 of 5"*). | Navigate forward and backward through all cards and verify the indicator updates. |
| 4 | Clicking **"Save Deck"** persists the generated deck to local storage. On page reload, the saved deck is retrievable and displays all 5 original cards with correct content. | Save a deck, reload the browser, and confirm the saved deck loads with all cards intact. |
| 5 | At least **1 demo deck** exists in local storage at the end of the POC demonstration. | Inspect local storage to confirm a valid deck object is persisted. |

### 6.3 Submission Checklist

- [x] Flashcards generate from pasted text input.
- [x] Flip animation works on each card (front → back → front).
- [x] 1 demo deck is saved and retrievable from local storage.

---

## 7. Limitations

The following features and capabilities are **explicitly out of scope** for FlashGenius v1.0 (MVP). They are documented here to establish clear boundaries and prevent scope creep during development.

| # | Out-of-Scope Item | Rationale |
|---|---|---|
| 1 | **User authentication and accounts** | The MVP operates as a stateless, single-user tool. There are no login flows, user profiles, or multi-device sync. All data is local to the browser. |
| 2 | **Multiple deck management** | The MVP supports saving up to 10 decks at a time in local storage. Advanced features like a deck library with folder organization, tagging, or search are deferred to a future version. |
| 3 | **Custom card count selection** | The MVP generates a fixed count of 5 flashcards per submission. User-configurable card counts (e.g., 3, 10, 20) are not supported. |
| 4 | **Image, audio, or file upload input** | The MVP accepts only plain text pasted into the textarea. It does not support image-based OCR, audio transcription, PDF parsing, or file drag-and-drop. |
| 5 | **Flashcard editing or manual creation** | Users cannot modify generated Q&A content or manually author individual cards. All cards are system-generated and immutable in the MVP. |
| 6 | **Spaced repetition algorithms** | The MVP does not implement any spaced repetition scheduling (e.g., Leitner system, SM-2 algorithm). Cards are presented in a simple linear sequence without adaptive ordering. |
| 7 | **Sharing, exporting, or printing decks** | The MVP does not support sharing decks via link, exporting to external formats (PDF, CSV, Anki), or print-friendly layouts. |
| 8 | **Multi-language support** | The MVP targets English-language input only. Non-English text may produce unpredictable or low-quality flashcards. Internationalization of the UI is not implemented. |
| 9 | **Offline flashcard generation** | Flashcard generation requires an active network connection to the generation service. Offline generation via on-device models is not supported. Previously saved decks are available offline. |
| 10 | **Analytics or study tracking dashboards** | The MVP does not track study sessions, card mastery rates, time spent per card, or any form of learner analytics. |
| 11 | **Accessibility compliance (WCAG AA)** | While basic usability is maintained, full WCAG AA accessibility auditing (screen reader optimization, keyboard-only navigation, contrast ratio enforcement) is deferred to a future iteration. |
| 12 | **Server-side deck persistence** | All deck storage is browser-local. There is no server-side database, cloud backup, or cross-browser synchronization of saved decks. |

---

*End of Document*
