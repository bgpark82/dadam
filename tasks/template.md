
# DADM-XXX: [Feature Title]

- **Status:** To Do | In Progress | In Review | Done
- **Priority:** High | Medium | Low
- **Assignee:** @username
- **Reporter:** @username
- **Due Date:** YYYY-MM-DD
- **Dependencies:** DADM-YYY, DADM-ZZZ

---

## 1. Summary

*(A brief, one-paragraph explanation of the feature and the value it provides. This section should be easily understood by a non-technical audience.)*

## 2. Business Justification

*(Explain the "why" behind this feature. What business goal does it support? How does it benefit the user or the project? This helps everyone understand the feature's importance.)*

## 3. User Story

**As a** [type of user],
**I want to** [perform some action],
**So that I can** [achieve some goal].

*Example:*
> **As a** job seeker,
> **I want to** see a history of my past submissions,
> **So that I can** review my progress and track my improvement over time.

---

## 4. Acceptance Criteria (TDD Requirements)

*(This section defines the specific, testable requirements for the feature to be considered "done". It is broken down by application layer, just like in your `README.md`.)*

### 4.1. Frontend Requirements (React)

- **Given** [a specific context or state], **when** [a user action occurs], **then** [the expected outcome should happen].
- *Example: **Given** the user is on the new `/history` page, **when** the page loads, **then** it should make a `GET` request to `/api/history`.*
- *Example: **Given** the API has returned a list of 5 history items, **when** the data is processed, **then** 5 history cards should be rendered on the screen.*

### 4.2. Backend Requirements (Python/FastAPI)

- **Given** [a specific request], **when** [the API endpoint is called], **then** [the expected response should be returned].
- *Example: **It must** expose a `GET /api/history` endpoint.*
- *Example: **Given** a valid `user_id` in the request, **it must** return a `200 OK` status with a JSON array of history items from the database.*
- *Example: **Given** no `user_id` is provided, **it must** return a `401 Unauthorized` error.*

### 4.3. Database Requirements (Supabase)

- **It must** [describe any required schema changes or data interactions].
- *Example: The `history` table must include a `is_deleted` boolean column, defaulting to `false`.*
- *Example: When a user requests to delete a history item, the corresponding row's `is_deleted` flag must be set to `true`.*

---

## 5. Technical Implementation Notes

*(Optional: A place for developers to outline their approach, mention specific libraries, discuss potential challenges, or leave notes for future developers.)*

- *Example: We should use the `react-query` library for caching history data on the frontend.*
- *Example: The new endpoint will require adding a new scope to our Supabase RLS policies.*

## 6. Testing Instructions

*(Optional: A checklist for how to manually verify the feature works as expected. This is useful for QA or for the developer doing a final check.)*

1.  [ ] Log in as a user.
2.  [ ] Navigate to the `/history` page.
3.  [ ] Verify your past submissions are displayed correctly.
4.  [ ] Click the "delete" button on an item and confirm it disappears.
5.  [ ] Check the browser's developer console to ensure no errors were logged.
