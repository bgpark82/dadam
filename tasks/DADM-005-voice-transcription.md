# DADM-005: Voice-to-Text Transcription

- **Status:** To Do
- **Priority:** High
- **Assignee:** @username
- **Reporter:** @username
- **Due Date:** 
- **Dependencies:**

---

## 1. Summary

This task is to implement a new feature that allows users to record their voice on the web page,
convert it to text using the AssemblyAI service, and display the transcribed text in the main input area. 
This allows users to speak their answers instead of typing them.

## 2. Business Justification

This feature enhances accessibility and convenience for users. 
It provides a faster, more natural way to input interview answers, 
especially for users who are more comfortable speaking than typing or who are on mobile devices. 
This improved user experience can lead to higher engagement and satisfaction.

## 3. User Story

**As a** user practicing for an interview,
**I want to** record my answer by speaking directly into the application,
**So that I can** quickly capture my thoughts without the need for typing.

---

## 4. Acceptance Criteria (TDD Requirements)

### 4.1. Frontend Requirements (React)

- **1. Recording Process:**
    - **1-1.** Given the user is on the main page, when they click the "Start Recording" button, then the application must begin capturing audio from their microphone.
    - **1-2.** Given audio recording is in progress, when the UI is displayed, then a timer must be visible, and the button text must change to "Stop Recording".
    - **1-3.** Given the user clicks the "Stop Recording" button, when the action is processed, then the application must stop capturing audio and send the recording to the backend for transcription.
- **2. Data Handling:**
    - **2-1.** Given a successful transcription is returned from the backend, when the response is received, then the transcribed text must be populated into the text area.
- **3. Error Handling:**
    - **3-1.** Given an error occurs during recording or transcription, when the process fails, then a clear error message must be displayed to the user.

### 4.1.4. Loading Indicator
- **1-1.** Given the user clicks the "Stop Recording" button, when the application sends the audio to the backend for transcription, then a loading indicator must be displayed to the user.
- **1-2.** Given the transcription is complete (either success or error), when the response is received from the backend, then the loading indicator must be hidden.

### 4.2. Backend Requirements (Python/FastAPI)

- **1. Endpoint Definition:**
    - **1-1.** It must expose a new `POST /api/transcribe` endpoint that accepts audio data.
- **2. Success Case:**
    - **2-1.** Given the endpoint receives audio data, when it processes the request, then it must send the audio to the AssemblyAI API for transcription.
    - **2-2.** Given a successful response from AssemblyAI, it must return a `200 OK` status with the transcribed text in the JSON response (e.g., `{"transcription": "..."}`).
- **3. Error Cases:**
    - **3-1.** Given the AssemblyAI API returns an error, it must return an appropriate error status (e.g., `502 Bad Gateway`) and log the error details.
    - **3-2.** Given the AssemblyAI API key is not configured, it must return a `500 Internal Server Error` and log a configuration error message.

### 4.3. Database Requirements (Supabase)

- No changes are required for the database.

---

## 5. Technical Implementation Notes

- The frontend will use the browser's `MediaRecorder` API to capture audio.
- The backend will require the AssemblyAI API key to be stored securely as an environment variable.
- The backend will use an HTTP client library (e.g., `requests` or `httpx`) to interact with the AssemblyAI transcription endpoint.

## 6. Testing Instructions

1.  [ ] Navigate to the main application page.
2.  [ ] Click the "Start Recording" button.
3.  [ ] Speak a clear sentence (e.g., "This is a test of the voice transcription feature.").
4.  [ ] Click the "Stop Recording" button.
5.  [ ] **Verify:** The text "This is a test of the voice transcription feature." appears in the text area.
6.  [ ] **Verify:** The "Improve My Answer" button becomes active and can be used to process the transcribed text.
