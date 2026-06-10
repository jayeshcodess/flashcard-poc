# Prompt History — FlashGenius

> This file tracks every prompt issued during the development of the FlashGenius project, in chronological order. Each entry includes the timestamp, a short label, the target artifact produced, and the full prompt text.

---

## Prompt #1 — PRD Generation

- **Timestamp:** 2026-06-10T10:16:26+05:30
- **Artifact Produced:** `PRD.md`

```
[ROLE]
Act as an expert Senior Product Manager who excels at translating business objectives, MVP constraints, and core user goals into a clean, highly deterministic, and structured Product Requirements Document (PRD).

[TASK]
Generate a comprehensive Product Requirements Document (PRD.md) based strictly on the parameters provided in the [CONTEXT] section. The output must contain only the 7 sections specified in the [FORMAT] section, without any technical stack definitions, infrastructure setup, or code folder structures.

[CONTEXT]
- Domain: EdTech
- Name: FlashGenius
- Business Problem: Students struggle to revise notes before exams. A teacher wants to paste any text or notes and auto-generate flashcards (question + answer pairs) from it.
- MVP Scope (What to build):
  * Paste notes textarea
  * Generate flashcards button (React + Gemini API)
  * CSS flip animation (front/back)
  * No database needed (fully client-side storage)
- POC Goal (Prove This Works): Show: paste a paragraph, get 5 flashcards, flip them in the UI
- Submission Checklist:
  [ ] Flashcards generate from text
  [ ] CSS flip animation works
  [ ] 1 demo deck saved (client-side, no database)

Key constraints to enforce:
- Focus purely on functional product specifications and business logic.
- Do not mention specific frameworks, programming languages, databases, or directory layouts.
- Avoid vague placeholders or "TBDs."

[FORMAT]
Generate the output as a clean PRD.md file using standard Markdown headers. You must strictly follow this 7-section schema and nothing else:

1. Problem Statement
- A clear description of the pain points and operational inefficiencies students and teachers face during exam preparation.

2. Solution Overview
- A high-level conceptual description of the FlashGenius platform, target user personas, and the core goals of the platform.

3. User Flow
- A step-by-step, text-based description of the end-to-end user journey from pasting the text to interacting with and saving the generated deck.

4. API Design
- A structured table outlining the necessary conceptual RESTful API endpoints required to handle text submission and flashcard generation (including columns for Method, Endpoint, Description, conceptual Request Payload, and conceptual Response Payload).

5. Edge Cases
- List at least 4 operational or input-based edge cases (e.g., pasting blank text, extremely long notes, or character limits) along with the system's graceful mitigation strategy for each.

6. KPIs (Success Metrics & Acceptance Criteria)
- Specific success metrics to track system effectiveness, alongside a definitive acceptance checklist for the POC matching the submission checklist criteria.

7. Limitations
- Explicitly list features and requirements that are strictly out-of-scope for this version to prevent scope creep.
```

---

## Prompt #2 — KPI Document Generation

- **Timestamp:** 2026-06-10T10:24:45+05:30
- **Artifact Produced:** `KPI.md`
- **Reference Input:** `PRD.md`

```
[ROLE]
You are a Senior Product Manager and Business Analyst.

[TASK]
Analyze the provided project context and generate a comprehensive KPI.md document based strictly on the specified structure.

[CONTEXT]
- Domain: EdTech
- Name: FlashGenius
- Business Problem: Students struggle to revise notes before exams. A teacher wants to paste any text or notes and auto-generate flashcards (question + answer pairs) from it.
- MVP Scope (What to build):
  * Paste notes textarea
  * Generate flashcards button (React + Gemini API)
  * CSS flip animation (front/back)
  * No database needed (fully client-side storage)
- POC Goal (Prove This Works): Show: paste a paragraph, get 5 flashcards, flip them in the UI
- Submission Checklist:
  [ ] Flashcards generate from text
  [ ] CSS flip animation works
  [ ] 1 demo deck saved (client-side, no database)

[FORMAT]
Generate the output as a clean markdown file (`KPI.md`). Every KPI section must feature a Markdown table adhering strictly to these column definitions:
| KPI Number | KPI Name | Verification Method | Criteria |

The output must follow this exact structural schema:

# KPI Document

## Project Overview
[Provide a brief overview of FlashGenius, the target users, and the core problem being solved.]

## Business Objectives
[List the high-level business goals behind automating flashcard creation for revision.]

## Success Metrics
[Define the immediate parameters that signify a successful validation of the platform.]

## Key Performance Indicators
[Provide the primary KPI table using the 4 columns: KPI Number, KPI Name, Verification Method, Criteria.]

## Operational KPIs
[Provide a KPI table focused on operational performance, such as generation success and basic rendering speeds.]

## User Adoption KPIs
[Provide a KPI table focused on initial user interaction metrics like card flipping and saving actions.]

## Financial KPIs
[Provide a KPI table evaluating the localized MVP cost or indicating why transactional costs are zero for this phase.]

## Risk Indicators
[Provide a KPI table capturing failure risks, such as local storage limit errors or unparseable input text.]

## Reporting Dashboard Recommendations
[Suggest simple visual widgets or status flags required to track the system's performance metrics.]

## Assumptions
[List explicit assumptions made regarding user behaviors, input sizes, or local storage limits.]

## Future KPIs
[List metrics reserved for future iterations, such as card retention tracking, space-repetition intervals, or multi-device sync.]

[CRITICAL INSTRUCTIONS]
- Do not assume business requirements that are not explicitly stated in the context.
- Keep metrics hyper-focused on the MVP scope (local storage, textarea, 5-card generation, flip mechanics).
- Ensure KPIs are SMART (Specific, Measurable, Achievable, Relevant, Time-Bound) and tailored to the POC goals.
- Do not include technical stack code implementations, directory trees, or deployment architecture.
```

---

## Prompt #3 — Prompt History File

- **Timestamp:** 2026-06-10T10:39:28+05:30
- **Artifact Produced:** `PROMPT_HISTORY.md`

```
maintain a prompt history file please
```

---

## Prompt #4 — Save Token Protocol

- **Timestamp:** 2026-06-10T10:43:10+05:30
- **Artifact Produced:** `agent/save_token.md`

```
[ROLE]
You are a Senior Product Manager and Software Architect.

[TASK]
Generate a highly focused `save_token.md` protocol document based strictly on the parameters provided in the [CONTEXT] section and following the exact rules in the [FORMAT] section.

[CONTEXT]
- Domain: EdTech / LLM Integrations
- Name: FlashGenius
- Core Feature: Secure persistence of API tokens or session states required for automated flashcard generation.
- Objective: Define the strict runtime code boundaries and modification protocols for editing authentication state handlers without breaking the local storage footprint.

[FORMAT]
Generate the output as a clean markdown file (`save_token.md`). The document must begin directly with the following operational rules header verbatim, followed by the specific protocol definitions:

# Save Token Protocol

> **Vibe Coding Protocol Active:**
> 1. Short-form responses only.
> 2. No conversational filler or explanations.
> 3. Provide only the diff or the specific function modified.
> 4. Do not update secondary files (README, logs, tests) unless requested.
> 5. Use compact code style (no excessive whitespace/comments).

## 1. Token Serialization Schema
[Define a concise, key-value table structure for how tokens are represented conceptually.]

## 2. Persistence Constraints
[List the strict operational rules for writing to local/session context safely.]

## 3. Targeted Code Modifications (Diff Rules)
[Provide abstract instructions on how code changes to token components must be presented as precise diff blocks with zero conversational overhead.]

also maintain prompt history on every req
```

---

## Prompt #5 — Project Scope Document (v1 — Vanilla Stack)

- **Timestamp:** 2026-06-10T11:03:21+05:30
- **Artifact Produced:** `agent/project_scope.md` (v1)
- **Reference Inputs:** `agent/PRD.md`, `agent/KPI.md`, `agent/save_token.md`
- **Note:** This version used Vanilla HTML5 + CSS3 + JavaScript. Superseded by Prompt #6.

```
[ROLE]
You are a Senior Product Manager and Lead Systems Architect.

[TASK]
Generate a definitive project scope document (`project_scope.md`) for the FlashGenius platform.
Synthesize PRD, KPI, and token protocol into a single source of truth.

[CONTEXT]
- Tech Stack: HTML5, Vanilla CSS3, Vanilla JavaScript (ES2020+)
- MVP Scope: Paste notes textarea, generate flashcards button (React + Gemini API), CSS flip animation (front/back), no database needed (client-side storage).
- POC Goal: Paste a paragraph, get 5 flashcards, flip them with CSS animation, verify 1 demo deck saved client-side.

[FORMAT]
5 sections: Goal & Overview, Tech Stack, Core Features, Design System, Out of Scope.
```

---

## Prompt #6 — Project Scope Document (v2 — React/Next.js/Tailwind, Desktop-Only)

- **Timestamp:** 2026-06-10T11:09:45+05:30
- **Artifact Produced:** `agent/project_scope.md` (v2 — overwrote v1)
- **Reference Inputs:** `agent/PRD.md`, `agent/KPI.md`, `agent/save_token.md`

```
[ROLE]
You are a Senior Product Manager and Lead Systems Architect. You specialize in defining strict, unshakeable technical boundaries and execution roadmaps for engineering teams.

[TASK]
Generate a definitive project scope document (`project_scope.md`) for the FlashGenius platform. You must seamlessly synthesize the business rules from the PRD, the measurement parameters from the KPI document, and the operational constraints of the token protocol into a single source of truth for the development lifecycle.

[CONTEXT]
- Domain: EdTech
- Name: FlashGenius
- Business Problem: Students struggle to revise notes before exams. A teacher wants to paste any text or notes and auto-generate flashcards (question + answer pairs) from it.
- MVP Scope: Paste notes textarea, generate flashcards button, CSS flip animation (front/back), and no database needed (fully client-side storage).
- Platform Constraints: Desktop/Laptop Web-only interface. Strictly NO mobile/phone application layouts or responsive native wrappers.
- Tech Stack: React, Next.js (App Router client-side execution), Tailwind CSS, Web Storage API (localStorage), Gemini API.
- POC Goal: Paste a paragraph, get 5 flashcards, flip them with CSS animation, and verify 1 demo deck is saved client-side.
- Unified Constraints: No infrastructure overhead, no server-side folder setup defaults, and absolute adherence to the active Vibe Coding rules (compact style, zero conversational filler, targeted changes).

[FORMAT]
5 sections: Goal & Overview, Tech Stack Details, Core Features & Requirements, Design System & UX Standards, Out of Scope (Strict Boundaries).

[CRITICAL INSTRUCTIONS]
- Ensure this document acts as a hard contract for the developer—anything not documented in the Core Features is strictly forbidden from being built.
- Do not add conversational introductions or conclusions to the output text; start directly with the markdown header.
```

---

## Prompt #9 — Project Boundary Document (Stateless, No localStorage)

- **Timestamp:** 2026-06-10T12:51:18+05:30
- **Artifact Produced:** `agent/project_boundary.md`
- **Reference Inputs:** `agent/KPI.md`, `agent/project_scope.md`, `agent/save_token.md`

```
[ROLE]
You are a Principal Software Architect and Technical Lead.

[TASK]
Generate a definitive project boundary document (`project_boundary.md`) for the FlashGenius platform.
Synthesize PRD/KPI constraints into a hard engineering contract governing workspace interaction and code writing.

[CONTEXT]
- Core Scope: Desktop web-only text-to-flashcard generator. React, Next.js client-side execution, Tailwind CSS.
- Stateless in-memory application state only, fetching directly from client-side Gemini API.
- No database, no localStorage.
- Active Paradigm: Vibe Coding.

[FORMAT]
4 sections: Boundary Overview, Release Boundary (MVP), Acceptance Criteria / Stopping Point, Constraints & Assumptions.
Begins with Developer Execution Protocol (do not commit, do not run commands, do not write without full picture, modular code only).
Out-of-Scope: localStorage, sessionStorage, databases, mobile viewports, authentication, learning analytics.

[CRITICAL PROTOCOL]
Vibe Coding Protocol Active. Zero conversational filler.
```

---

## Prompt #10 — Re-allow Local Storage & Adjust Scope Documents

- **Timestamp:** 2026-06-10T12:55:33+05:30
- **Artifacts Updated:** `agent/project_boundary.md`, `agent/project_scope.md`

```
but for Deck Persistence: we need local storage, aslo may be we need out of scope and onscope in @[agent/project_scope.md] not in @[agent/project_boundary.md]
```

---

## Prompt #12 — Implementation Walkthrough Generation

- **Timestamp:** 2026-06-10T15:00:37+05:30
- **Artifact Produced:** `IMPLEMENTATION_WALKTHROUGH.md`
- **Reference Inputs:** None explicitly linked, but references the project context and FlashGenius architectural constraints (strict statelessness).

```
[ROLE]
Act as the Lead Software Architect for FlashGenius.

[TASK]
Generate a complete, comprehensive implementation walkthrough document and save it directly to the workspace filesystem as `IMPLEMENTATION_WALKTHROUGH.md`. 

[CONTEXT]
- Project: FlashGenius (Desktop Web-only automated text-to-flashcard generator).
- Target Stack: React, Next.js ('use client' App Router paradigm), Tailwind CSS.
- Key Constraint: Absolutely NO database and NO local storage usage. The application must be entirely memory-volatile and stateless, using temporary React states and hitting external Gemini APIs directly via client-side fetch calls.
- Active Protocol: Vibe Coding. Use compact formatting and concise code structural representations.

[FORMAT]
Write the content using high-level technical Markdown directly into the `IMPLEMENTATION_WALKTHROUGH.md` file. It must systematically cover these 5 precise sections to ensure perfect structural alignment before we begin coding:
1. Core Architectural Paradigm
2. In-Memory State Model
3. End-To-End Execution Flow
4. Modular File Allocation Matrix
5. Volatility Event Behavior

[CRITICAL INSTRUCTIONS]
- Do not run any compilation, build, or deployment commands yet.
- Do not add any conversational introductions, filler text, or conversational sign-offs. 
- Create only the single file `IMPLEMENTATION_WALKTHROUGH.md` and report back when the file is written.
```

---

## Prompt #13 — Make Personas Generic

- **Timestamp:** 2026-06-10T16:06:41+05:30
- **Artifacts Updated:** `agent/personas/persona_frontend.md`, `agent/personas/persona_backend_api.md`, `agent/personas/persona_qa.md`, `agent/personas/persona_devops.md`

```
do 1 thing make all the files generic and not project specific
```

---

## Prompt #14 — Complete Implementation of Application Layers

- **Timestamp:** 2026-06-10T16:18:32+05:30
- **Artifacts Updated:** `src/utils/apiService.ts`, `src/components/FlashcardUI.tsx`, `src/components/NavigationOverlay.tsx`

```
[ROLE]
You are a Full-Stack Developer 

[TASK]
Complete the implementation of the FlashGenius application within the `./flashgenius-app/` directory by generating the remaining modular files required for a fully functional, running system. 

[WORKSPACE CONTEXT ALIGNMENT]
You must read, cross-reference, and respect the specifications inside these exact workspace files before writing any code:
1.  @[agent/personas/persona_frontend.md]
2. @[agent/personas/persona_backend_api.md]
3. @[agent/PRD.md]
4. @[agent/KPI.md]
5. @[agent/PROJECT_BOUNDARY.md]
6. @[agent/PROJECT_SCOPE.md]
7. @[IMPLEMENTATION_WALKTHROUGH.md]

[IMPLEMENTATION REQUIREMENTS]
Generate the remaining core application layers cleanly using TypeScript and Tailwind CSS:
1. **API Utility Engine (`src/utils/apiService.ts`)**
2. **Interactive Presentation UI (`src/components/FlashcardUI.tsx`)**
3. **Navigation Mechanics (`src/components/NavigationOverlay.tsx`)**
```

---

## User Manual Modifications — Gemini Migration & Local Storage implementation

- **Timestamp:** 2026-06-10T17:45:00+05:30
- **Artifacts Updated:** `app/page.tsx`, `app/globals.css`, `utils/apiService.ts`, `IMPLEMENTATION_WALKTHROUGH.md`, `PROMPT_HISTORY.md`
- **Description:** The user manually updated the application to use the Gemini API (`gemini-2.5-flash`) instead of OpenAI. User also manually implemented deck saving/loading via local storage in `page.tsx`, and added a Toast and ConfirmDialog UI.

---

## Prompt #15 — Knowledge Transfer (KT) Document Generation

- **Timestamp:** 2026-06-10T18:10:51+05:30
- **Artifacts Updated:** `flashgenius-app/KT_SUMMARY.md`

```
[ROLE]
You are a Principal Software Architect and Technical Writer.

[TASK]
Generate a highly detailed Knowledge Transfer (KT) Summary Document and write it directly to the workspace filesystem as `flashgenius-app/KT_SUMMARY.md`. This file will serve as the onboarding blueprint for new engineering team members.

[CONTEXT]
- Project: FlashGenius
- Architectural Reality: Purely stateless client-side lifecycle. 0% data persistence. No database, no local storage. Everything runs on volatile React component states in memory and communicates directly via client browser fetch calls to the OpenAI Chat Completions API.
- Current Status: 100% Fully Functional.

[FORMAT]
Write the content using structured, technical Markdown. Avoid high-level generic descriptions; write specific implementation details. The document must strictly include the following 6 sections:
1. Project Mission & Core Architecture
2. In-Memory State & Lifecycle Management
3. API Contract & Payload Pipeline
4. Component Topology & UI Architecture
5. High-Performance UX & CSS Mechanics
6. Developer Verification & Hard Boundaries
```

---

<!-- NEXT PROMPT: Append new entries below this line -->
