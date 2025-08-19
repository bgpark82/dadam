# DODAM-001: History Feature

## 1. Summary

This document outlines the requirements for implementing a feature that allows users to view a history of their past text improvement submissions. The requirements are structured for a Test-Driven Development (TDD) approach.

## 2. Frontend Requirements

The frontend application will be tested to ensure it behaves as follows:

-   **1. Layout and Initial State:**
    -   **1-1.** The main view should render a two-column layout, with the history sidebar visible on the right.
    -   **1-2.** On initial load, the history sidebar should be empty or show a "No history yet" message.

-   **2. Displaying History:**
    -   **2-1.** After a successful text improvement submission, a `GET` request should be made to the `/api/history` endpoint.
    -   **2-2.** Given a successful response from the API, the history sidebar should render a list of history items.
    -   **2-3.** The items in the list must be ordered with the newest entry at the top.
    -   **2-4.** Each item in the list should be rendered as a card containing a snippet of the original text and the creation date.

-   **3. Viewing a History Item:**
    -   **3-1.** When a user clicks on a history card, a popup modal should appear.
    -   **3-2.** The modal must display the full `original_text` and `improved_text` for the selected item.
    -   **3-3.** The differences between the two texts should be correctly highlighted within the modal.

## 3. Backend Requirements

The backend API will be tested to ensure it adheres to the following contract:

-   **1. Endpoint Definition:**
    -   **1-1.** It should expose a `GET /api/history` endpoint.

-   **2. Success Case:**
    -   **2-1.** The endpoint should return a `200 OK` HTTP status code.
    -   **2-2.** The response body must be a JSON array of history items.
    -   **2-3.** Each object in the array must contain `id`, `user_id`, `original_text`, `improved_text`, and `created_at` fields.
    -   **2-4.** The array must be sorted by `created_at` in descending order.
    -   **2-5.** The endpoint should only return history items belonging to the hardcoded dummy user ID.

-   **3. Error Cases:**
    -   **3-1.** In the event of a database error, the endpoint should return a `500 Internal Server Error` status.