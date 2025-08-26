# DADM-002: History Feature

- **Status:** To Do
- **Priority:** [TBD: High | Medium | Low]
- **Assignee:** [TBD: @username]
- **Reporter:** [TBD: @username]
- **Due Date:** [TBD: YYYY-MM-DD]
- **Dependencies:** None

---

## 1. Summary

This document outlines the requirements for implementing a feature that allows users to view a history of their past text improvement submissions. This feature will provide all users with a way to track their progress and review previous versions of their text.

## 2. Business Justification

The primary goals of this feature are to improve user satisfaction and drive user behavior. By providing a clear and easily accessible history of their submissions, users can see the value of the text improvements over time. This tangible record of their progress is intended to increase their confidence in the tool and encourage more frequent use. The feature is intended for all users.

## 3. User Story

**As a** user,
**I want to** see a history of my past submissions with a clear comparison of the original and improved text,
**So that I can** track my progress and see the value of the improvements.

---

## 4. Acceptance Criteria (TDD Requirements)

### 4.1. Frontend Requirements (React)

The frontend application will be tested to ensure it behaves as follows:

- **1. Layout and Initial State:**
    - **1-1.** The main view should render a two-column layout, with the history sidebar visible on the right.
    - **1-2.** On initial load, the history sidebar should be empty or show a "No history yet" message.

- **2. Displaying History:**
    - **2-1.** After a successful text improvement submission, a `GET` request should be made to the `/api/history` endpoint.
    - **2-2.** Given a successful response from the API, the history sidebar should render a list of history items.
    - **2-3.** The items in the list must be ordered with the newest entry at the top.
    - **2-4.** Each item in the list should be rendered as a card containing a snippet of the original text and the creation date.

- **3. Viewing a History Item:**
    - **3-1.** When a user clicks on a history card, a popup modal should appear.
    - **3-2.** The modal must display the full `original_text` and `improved_text` for the selected item.
    - **3-3.** The differences between the two texts should be correctly highlighted within the modal.

### 4.2. Backend Requirements (Python/FastAPI)

The backend API will be tested to ensure it adheres to the following contract:

- **1. Endpoint Definition:**
    - **1-1.** It should expose a `GET /api/history` endpoint.

- **2. Success Case:**
    - **2-1.** The endpoint should return a `200 OK` HTTP status code.
    - **2-2.** The response body must be a JSON array of history items.
    - **2-3.** Each object in the array must contain `id`, `user_id`, `original_text`, `improved_text`, and `created_at` fields.
    - **2-4.** The array must be sorted by `created_at` in descending order.
    - **2-5.** The endpoint should only return history items belonging to the hardcoded dummy user ID.

- **3. Error Cases:**
    - **3-1.** In the event of a database error, the endpoint should return a `500 Internal Server Error` status.

### 4.3. Database Requirements (Supabase)

- **1. Schema:**
    - **1-1.** The `history` table must include `id`, `user_id`, `original_text`, `improved_text`, and `created_at` columns.

---

## 5. Technical Implementation Notes

- We can use the `diff-match-patch` library to highlight the differences between the original and improved text.

## 6. Testing Instructions

1.  [ ] Submit a text for improvement.
2.  [ ] Verify that the new history item appears in the history sidebar.
3.  [ ] Click on the history item.
4.  [ ] Verify that the modal appears with the correct text and highlighting.
5.  [ ] Refresh the page and verify that the history is still present.

## 7. Open Questions 

- How should we handle pagination if a user has a large number of history items?
- What is the exact format for the `created_at` timestamp on the frontend?

## 8. Success Metrics (To Be Defined)

- [ ] Define and track key metrics to measure the success of this feature after release.
