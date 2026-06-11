# Project Scope: FlashGenius

> **Domain:** EdTech · **Version:** 1.0 (MVP) · **Platform:** Desktop Web Only

---

## 1. Goal & Overview

### Primary Mission
Prove the core viability of automated text-to-flashcard generation within a localized, desktop-only, single-page Next.js client interface. The product operates entirely inside a desktop browser: text goes in, flashcards come out, and the deck persists locally.

### Target Milestone
Deliver a fully working desktop Web-only Proof of Concept (POC) that satisfies the following 3-item submission checklist without backend or mobile device creep:

| # | Checklist Item | Pass Condition |
|---|---|---|
| 1 | Flashcards generate from text | Pasting text and clicking "Generate" produces exactly 5 Q&A flashcards. |
| 2 | CSS flip animation works | Every card responds to a click with a front-to-back CSS flip transition. |
| 3 | No database needed | Up to 10 decks persist fully client-side in localStorage, surviving a full page reload without a database. |

---

## 2. Tech Stack Details

### 2.1 Core Technologies
- **Core Stack:** React + Gemini API
- **Animations:** CSS flip animation for flashcard interactions
- **Data Storage:** No database needed (fully client-side storage)

### 2.2 State & Storage
- **Deck Persistence:** Fully client-side storage (`window.localStorage`) under the key `fg_saved_deck`. No database needed. Single-deck model only (last-write-wins).
- **Token Persistence:** Fully client-side storage (`window.localStorage`) under the key `fg_auth_token` to securely handle user-provided API keys without a backend database.

### 2.3 Generation Layer
- **Primary Mode:** Client-side LLM API call via `fetch` directly to the Gemini API from the browser using the stored `fg_auth_token`.
- **Fallback Mode:** A local, deterministic JavaScript fallback function that parses text into 5 static fallback cards if no API token is present, enabling instant offline validation.

### 2.4 Runtime Environment
- **Target Viewport:** Desktop/Laptop web only (minimum width 1024px). 
- **Mobile/Tablet:** Explicitly unsupported. No responsive mobile layout optimization or touch gestures.

---

## 3. Core Features & Requirements

### 3.1 Text Input Engine
- **Textarea UI:** A simple multi-line text input block accepting student or teacher notes.
- **Validation:** Minimum threshold of 50 characters required to activate generation. Hard character ceiling set at 10,000 characters.
- **Counter:** A simple live character counter displaying `{current} / 10,000`.

### 3.2 Generation Processor
- Parses the validated text input and outputs an array of exactly 5 structured flashcard objects containing unique IDs, questions, and answers.
- Manages button interaction states: Ready, Loading (spinning indicator), and Error fallback triggers.

### 3.3 Interactive Card Component
- **Flip Trigger:** Clicking anywhere on the card container toggles its state between Front (Question) and Back (Answer).
- **Navigation Controls:** "Previous" and "Next" buttons to cycle linearly through the 5 generated cards, accompanied by a text indicator (`Card X of 5`).

### 3.4 Local Persistence Layer
- **Save Operations:** Encodes the active deck array into a clean JSON string and writes it straight to `localStorage`.
- **Load Operations:** On component mount, automatically checks for `fg_saved_deck` and restores the study session state if valid data exists.

---

## 4. Design System & UX Standards
- **Layout Architecture:** A single-page, distraction-free layout centered on the desktop screen. Includes an Input View (textarea state) and a Deck View (active study state).
- **Typography:** Uses clean sans-serif fonts optimized strictly for desktop reading legibility.
- **Component States:** Explicit visual styles for Hover, Active Click, Disabled, and Active Loading selectors.

---

## 5. In-Scope

| Component | Description |
|---|---|
| **Textarea Input** | A single multi-line text input block accepting pasted study notes (50–10,000 characters). |
| **Generation Button** | An explicit action trigger that sends the validated text to the Gemini API via a client-side `fetch` call and receives 5 structured Q&A objects. |
| **Flip Card Element** | An interactive card component with a CSS flip animation toggling between the question (front) and answer (back) on click. |
| **Navigation Controls** | Previous/Next buttons for cycling through the 5 generated cards, with a progress indicator ("Card X of 5"). |
| **Direct API Fetch** | Browser-based `fetch` calls routed directly to the Gemini API endpoint. |

---

## 6. Out of Scope

- **Mobile Optimization:** No responsive phone viewports, touch swiping, or native mobile wrappers.
- **Infrastructure:** No external backend servers, remote databases, cloud hosting setups, or user authentication accounts.
- **Advanced Learning Features:** No spaced-repetition algorithms (SM-2/Leitner), study analytics trackers, multi-deck libraries, manual card editing, or custom card counts (hard-coded to 5).
- **Multi-Modal Support:** No text-to-speech audio, PDF/file document parsing, or image OCR uploads.