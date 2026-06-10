# Save Token Protocol

> **Vibe Coding Protocol Active:**
> 1. Short-form responses only.
> 2. No conversational filler or explanations.
> 3. Provide only the diff or the specific function modified.
> 4. Do not update secondary files (README, logs, tests) unless requested.
> 5. Use compact code style (no excessive whitespace/comments).

---

## 1. Token Serialization Schema

All tokens and session state artifacts are represented as flat key-value pairs within a single serializable object. No nested structures are permitted at the persistence layer.

### Schema Definition

| Key | Type | Required | Description |
|---|---|---|---|
| `token_id` | `string (UUID v4)` | Yes | Unique identifier for this token entry. Generated at write-time; immutable once persisted. |
| `api_key` | `string` | Yes | The API key or bearer token used to authenticate against the flashcard generation service. Stored as an opaque string — never parsed, decoded, or logged by the client. |
| `issued_at` | `string (ISO-8601)` | Yes | Timestamp of when the token was first persisted to storage. Set once at creation; never overwritten on refresh. |
| `expires_at` | `string (ISO-8601)` | Yes | Timestamp of when the token becomes invalid. The client must check this value before every generation request. |
| `scope` | `string` | Yes | Permission scope granted by the token. MVP value: `"flashcard:generate"`. Used for client-side gating of UI features. |
| `status` | `string (enum)` | Yes | Current lifecycle state. Allowed values: `active`, `expired`, `revoked`. Only `active` tokens are used for API calls. |
| `refresh_token` | `string \| null` | No | Optional opaque refresh token for obtaining a new `api_key` without re-authentication. `null` if the provider does not support refresh flows. |
| `provider` | `string` | Yes | Identifier of the generation service provider (e.g., `"openai"`, `"gemini"`, `"custom"`). Used to route requests to the correct API handler. |

### Serialization Rules

- **Format:** JSON string (via `JSON.stringify` equivalent).
- **Encoding:** UTF-8 only. No Base64 wrapping at the storage layer.
- **Key Ordering:** Not enforced. Consumers must access by key name, never by position.
- **Null Handling:** Optional fields with no value are set to `null`, never omitted from the object.

---

## 2. Persistence Constraints

### Storage Target

All token state is persisted fully client-side to `localStorage` under a single, reserved key. No backend database is used or needed.

| Parameter | Value |
|---|---|
| **Storage Key** | `fg_auth_token` |
| **Storage Medium** | `window.localStorage` |
| **Max Payload Size** | ≤ 2 KB per token entry |
| **Entries Allowed** | Exactly 1 (single-token model; last-write-wins) |

### Write Rules

| # | Constraint | Enforcement |
|---|---|---|
| W-1 | **Availability Check First.** Before any write, verify `localStorage` is accessible. If the browser blocks storage (private mode, quota exceeded), abort the write and surface a user-facing error — never swallow silently. | Call a `storageAvailable()` guard before every `setItem`. |
| W-2 | **Atomic Writes Only.** The entire token object is written in a single `setItem` call. Partial field updates (read → mutate → write) must complete without yielding to other async operations between read and write. | Wrap read-mutate-write in a synchronous block. No `await` between `getItem` and `setItem`. |
| W-3 | **No Duplicate Keys.** Only one token exists in storage at any time. Writing a new token silently overwrites the previous entry under the same key (`fg_auth_token`). | Single-key design; no key-per-token indexing. |
| W-4 | **Sanitize Before Write.** Strip any fields not present in the schema (Section 1) before persisting. Reject objects missing any required field — do not write incomplete tokens. | Validate against schema before `setItem`. |
| W-5 | **No Sensitive Logging.** The `api_key` and `refresh_token` values must never appear in console logs, error messages, or telemetry payloads. | Redact token fields in all log output: `api_key: "[REDACTED]"`. |

### Read Rules

| # | Constraint | Enforcement |
|---|---|---|
| R-1 | **Parse Defensively.** Wrap `JSON.parse` in a try-catch. If the stored value is malformed or corrupted, treat it as absent — return `null`, do not throw. | Catch `SyntaxError` and return `null`. |
| R-2 | **Validate After Parse.** After parsing, verify all required fields exist and have correct types. If validation fails, delete the corrupted entry and return `null`. | Run schema validation immediately after parse. Call `removeItem` on failure. |
| R-3 | **Expiry Check on Read.** Every read must compare `expires_at` against the current time. If the token is expired, update `status` to `"expired"`, persist the status change, and return the token with the updated status — do not silently serve expired tokens as active. | Inline expiry check in the read path. |

### Delete Rules

| # | Constraint | Enforcement |
|---|---|---|
| D-1 | **Full Removal.** Deleting a token removes the entire `fg_auth_token` key from localStorage. There is no soft-delete or tombstone mechanism. | Single `removeItem("fg_auth_token")` call. |
| D-2 | **Idempotent.** Deleting a non-existent key is a no-op. No errors are thrown if the key does not exist. | Guard with `getItem` check or rely on `removeItem` idempotency. |

### Isolation Rules

| # | Constraint | Rationale |
|---|---|---|
| I-1 | **Separate from Deck Storage.** The token key (`fg_auth_token`) must never collide with the deck storage key (`fg_saved_deck`). These are independent data domains. | Prevents a deck save/delete operation from accidentally wiping auth state. |
| I-2 | **No Cross-Tab Sync.** Token state is not synchronized across browser tabs. Each tab reads from localStorage independently. If a token is revoked in one tab, other tabs will detect this on their next read cycle. | Avoids `storage` event listener complexity in the MVP. |

---

## 3. Targeted Code Modifications (Diff Rules)

All code changes to token persistence components must follow these strict presentation and scoping rules. These rules apply to any agent, developer, or automated system modifying the token handler codebase.

### 3.1 Diff Presentation Format

- **Output Format:** Every modification is presented as a fenced diff block using standard unified diff syntax.
- **No Prose:** Do not include explanatory text before, after, or between diff blocks. The diff is the response.
- **Context Lines:** Include exactly 3 unchanged context lines above and below each change for orientation. No more, no fewer.

```
Example structure (do not treat as real code):

```diff
 unchanged line (context)
 unchanged line (context)
 unchanged line (context)
-removed line
+added line
 unchanged line (context)
 unchanged line (context)
 unchanged line (context)
```

### 3.2 Scope Restrictions

| # | Rule | Description |
|---|---|---|
| S-1 | **Single-Function Scope.** Each diff block targets exactly one function or one logically isolated block. If a change spans multiple functions, present separate diff blocks per function. | Prevents entangled multi-function diffs that obscure intent. |
| S-2 | **No File Creations in Diffs.** If a new file is required, state the filename and full content separately — do not present new files as diffs against `/dev/null`. | New files are written whole; only modifications to existing files use diff format. |
| S-3 | **No Unrelated Changes.** A diff block must contain only lines relevant to the token persistence change. Do not include formatting fixes, comment rewording, or import reordering unless they are direct dependencies of the functional change. | Zero noise policy — every changed line must be justifiable. |
| S-4 | **No Secondary File Updates.** Do not modify README, CHANGELOG, test files, or configuration files unless explicitly requested. Token handler changes are self-contained. | Matches Vibe Coding Protocol Rule #4. |

### 3.3 Modification Categories

When a code change is requested against a token component, classify it into exactly one of the following categories and apply the corresponding constraints:

| Category | Scope | Constraint |
|---|---|---|
| **WRITE** | Changes to `setItem` calls, serialization logic, or pre-write validation. | Must not alter the storage key (`fg_auth_token`). Must preserve schema validation. Diff must show the full updated write function. |
| **READ** | Changes to `getItem` calls, deserialization logic, or post-read validation. | Must not remove the expiry check (R-3). Must retain defensive parsing (R-1). Diff must show the full updated read function. |
| **DELETE** | Changes to `removeItem` calls or token revocation flows. | Must remain idempotent (D-2). Must not affect deck storage keys (I-1). |
| **SCHEMA** | Adding, removing, or renaming fields in the token object. | Must update the schema table in Section 1 of this document. Must update both the write validator and read validator in the same changeset. |
| **GUARD** | Changes to the `storageAvailable()` check or pre-condition functions. | Must not weaken the check (e.g., removing private-browsing detection). Must surface failures to the UI layer. |

### 3.4 Validation Checklist (Per Diff)

Before any diff is accepted, verify:

- [ ] The storage key `fg_auth_token` is unchanged (unless a SCHEMA change explicitly renames it).
- [ ] No `api_key` or `refresh_token` value appears in any log statement, error message, or console output within the diff.
- [ ] The write path still validates all required schema fields before calling `setItem`.
- [ ] The read path still wraps `JSON.parse` in a try-catch and returns `null` on failure.
- [ ] The read path still checks `expires_at` and updates `status` if expired.
- [ ] The diff contains no changes to files outside the token handler module.
- [ ] The diff includes exactly 3 context lines above and below each change.

---

*End of Document*
