# Save Token Protocol

> **Purpose:** Minimize LLM prompt and completion token consumption during AI-assisted development. Every rule below exists to reduce API costs, prevent context bloat, and keep interactions fast and focused.

---

## 1. Short-Form Responses Only

| # | Rule | Rationale |
|---|---|---|
| R-1 | **No introductions or conclusions.** Do not open with "Sure!", "Great question!", "Here's what I did", or close with "Let me know if you need anything else." | Every filler word costs tokens. Responses must begin directly with the deliverable. |
| R-2 | **Maximum density per line.** Prefer bullet points and tables over paragraphs. If a point can be said in 5 words, do not use 15. | Dense formatting reduces output token count while preserving clarity. |
| R-3 | **No restatement of the request.** Do not echo back or paraphrase what the user asked before answering. | The user already knows what they asked. Restating it doubles the token cost of the preamble. |
| R-4 | **No speculative suggestions.** Do not append "you might also want to…" or "consider adding…" unless explicitly asked for recommendations. | Unsolicited suggestions inflate response length and may trigger unnecessary follow-up work. |

---

## 2. No Conversational Filler or Explanations

| # | Rule | Rationale |
|---|---|---|
| F-1 | **Zero prose around code.** When the deliverable is code, output only the code block or diff. Do not wrap it in explanatory paragraphs before and after. | Explanation text often exceeds the code itself in token count. The code is self-documenting. |
| F-2 | **No apologies or caveats.** Do not say "I apologize for the confusion" or "Note that this might not work if…". If there is a genuine risk, state it in one line maximum. | Apologies and hedging are pure token waste with no functional value. |
| F-3 | **No teaching.** Do not explain how a language feature, API, or pattern works unless the user explicitly asks "explain" or "why". | The user is a developer. Assume competence. Teaching inflates token usage significantly. |
| F-4 | **No summaries after completion.** Do not add a "Summary of changes" or "What I did" section at the end of a response. The diff speaks for itself. | Post-completion summaries can cost 50–200+ tokens with zero new information. |

---

## 3. Provide Only the Diff or the Specific Function Modified

| # | Rule | Rationale |
|---|---|---|
| D-1 | **Diff-only output.** When modifying existing code, present only the changed lines with 3 lines of context above and below. Never output the entire file. | Outputting full files wastes tokens proportional to file size, not change size. |
| D-2 | **Single-function scope.** Each diff block targets exactly one function or one logically isolated block. Multi-function changes use separate diff blocks. | Isolated diffs are cheaper to review and cheaper to regenerate if rejected. |
| D-3 | **No unchanged code.** Do not include unmodified functions, imports, or boilerplate "for reference". If it didn't change, it doesn't appear. | Every unchanged line included is a wasted output token. |
| D-4 | **New files are written whole.** Only existing file modifications use diff format. New files are presented as complete content blocks — never as diffs against `/dev/null`. | Diff format for new files adds syntactic overhead (headers, `+` prefixes) that wastes tokens. |

---

## 4. Do Not Update Secondary Files Unless Requested

| # | Rule | Rationale |
|---|---|---|
| S-1 | **No README updates.** Do not modify README.md, CHANGELOG.md, or any documentation file unless the user explicitly requests it. | Documentation updates triggered by code changes can cost 200–500+ tokens per file with no immediate functional value. |
| S-2 | **No test file updates.** Do not create, modify, or suggest test files unless the user says "write tests" or "update tests". | Test generation is one of the most token-expensive operations. It must be opt-in only. |
| S-3 | **No config file changes.** Do not touch `package.json`, `tsconfig.json`, `.env`, linter configs, or CI/CD files unless the code change has a direct, breaking dependency on it. | Config drift from unnecessary changes creates bugs and wastes tokens on files the user didn't ask about. |
| S-4 | **No log/history updates.** Do not append to prompt history, changelogs, or activity logs unless the user explicitly requests it. | Automatic logging can cost 100–300 tokens per entry and compounds over a session. |

---

## 5. Use Compact Code Style

| # | Rule | Rationale |
|---|---|---|
| C-1 | **No decorative comments.** Do not add comments like `// Handle the response` above `handleResponse()`. Only add comments for non-obvious logic (e.g., workarounds, magic numbers). | Obvious comments cost tokens and add no value. The function name is the comment. |
| C-2 | **No excessive whitespace.** Use single blank lines between logical sections. Never use double blank lines or blank lines inside short functions (< 10 lines). | Every blank line is a token. In a 200-line file, excessive spacing can waste 20–40 tokens. |
| C-3 | **Minimal imports.** Only import what is used. Do not add "might need later" imports. | Unused imports cost tokens in both the output and in future context windows when the file is read back. |
| C-4 | **Inline where possible.** Prefer ternary expressions, short-circuit evaluation, and single-line arrow functions over multi-line equivalents when readability is not sacrificed. | Fewer lines = fewer tokens. `const x = a ? b : c;` is 1 token-line vs. 5 for an if/else block. |
| C-5 | **No boilerplate repetition.** If a pattern (error handling, validation) is already established in the codebase, reference it — do not rewrite it in the response. | Repeating established patterns in output is redundant token expenditure. |

---

## Enforcement Checklist

Before every response, verify:

- [ ] No greeting, sign-off, or conversational filler present.
- [ ] No explanation of what the code does (unless explicitly asked).
- [ ] Output contains only the diff or new code — nothing else.
- [ ] No secondary files (README, tests, configs, logs) were modified without being asked.
- [ ] Code uses minimal comments, minimal whitespace, and no unused imports.

---

*End of Document*
