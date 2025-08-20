# DADM-001: Update Split View with Diff Highlighting

- **Status:** To Do
- **Priority:** Medium
- **Assignee:** @username
- **Reporter:** @username
- **Due Date:** 
- **Dependencies:** 

---

## 1. Summary

This task is to update the user interface that displays the comparison between the user's original text and the AI-improved text. Currently, highlighting is limited to the "improved text" panel. This update will implement a "diff" view, where removed or changed text is highlighted in the "original text" panel and added or changed text is highlighted in the "improved text" panel.

## 2. Business Justification

The core value of the Dadam application is providing clear, actionable feedback to help users improve their communication. By visually highlighting the exact changes side-by-side, we make the feedback more immediate and easier to understand. This enhanced clarity will help users learn more effectively, building their confidence faster and improving their overall experience.

## 3. User Story

**As a** non-native English speaker practicing for an interview,
**I want to** see the specific words and sentences that were changed highlighted in red in my original text and the new words highlighted in green in the improved text,
**So that I can** instantly and clearly understand the AI's suggestions side-by-side.

---

## 4. Acceptance Criteria (TDD Requirements)

### 4.1. Frontend Requirements (React)

The frontend application will be tested to ensure it behaves as follows:

- **1. Diff Calculation:**
    - **1-1.** Given a successful API response containing an original and improved text, the application must calculate the difference (diff) between the two strings.

- **2. Panel Rendering:**
    - **2-1.** When rendering the "Original Text" panel, it must apply a red highlight to any text segments identified by the diff as *removed* or *changed*.
    - **2-2.** When rendering the "Improved Text" panel, it must apply a green highlight to any text segments identified by the diff as *added* or *changed*.
    - **2-3.** It must not apply any highlight to text segments that are identical in both versions.

### 4.2. Backend Requirements (Python/FastAPI)

- No changes are required for the backend. The existing `/api/improve-text` endpoint will be used as-is.

### 4.3. Database Requirements (Supabase)

- No changes are required for the database.

---

## 5. Technical Implementation Notes

- A JavaScript library for calculating text differences will be needed. A good candidate is `diff-match-patch` or a similar, modern alternative.
- The chosen library should be able to return an array of changes (e.g., `[{ value: 'Hello', added: true }, { value: 'World', removed: false }]`) that can be mapped over to render the highlighted text segments.

## 6. Testing Instructions

1.  [ ] Enter a piece of text into the input area (e.g., "I am wanting this job").
2.  [ ] Click the "Submit" button.
3.  [ ] Wait for the API response and the split view to render.
4.  [ ] **Verify:** In the "Original Text" panel, the word "wanting" is highlighted in red.
5.  [ ] **Verify:** In the "Improved Text" panel, the word "want" (or the improved phrase) is highlighted in green.
6.  [ ] **Verify:** The parts of the sentence that were not changed (e.g., "I am", "this job") have no highlighting in either panel.
7.  [ ] Test with a longer paragraph to ensure performance and correct highlighting of multiple changes.
