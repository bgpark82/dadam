# Dadam: Confident Interview Communication

## 1. Business Requirement

The primary business goal is to empower non-native English speakers to communicate more confidently and effectively during job interviews. By providing AI-powered feedback on their practice answers, the service helps users overcome language barriers, refine their professional tone, and increase their chances of securing employment.

## 2. MVP Functional Requirements (TDD-Focused)

The system's behavior will be validated by tests that confirm the following requirements.

---

### 2.1. Frontend Requirements (React)

The frontend application will be tested to ensure it behaves as follows:

- **1. Initial State:**
    - **1-1.** It should render a page containing a text input area and a submit button.
    - **1-2.** It should render the submit button in a `disabled` state initially.

- **2. User Interaction:**
    - **2-1.** When a user types text into the input area, then the submit button should become `enabled`.
    - **2-2.** When the user deletes all text from the input area, then the submit button should return to a `disabled` state.

- **3. API Call and Success State:**
    - **3-1.** When the user clicks the submit button, it should send the input text to the `POST /api/improve-text` backend endpoint.
    - **3-2.** While the API call is in progress, it should display a visual loading indicator (e.g., a spinner).
    - **3-3.** Given a successful API response, it should hide the loading indicator.
    - **3-4.** It should then display two panels side-by-side: one with the original user text and one with the `improved_text` from the API response.
    - **3-5.** It should correctly highlight the differences between the two texts.

- **4. API Call and Error State:**
    - **4-1.** Given a failed API response (e.g., a 5xx error), it should hide the loading indicator.
    - **4-2.** It should display a user-friendly error message (e.g., "Something went wrong. Please try again.").

### 2.2. Backend Requirements (Python/FastAPI)

The backend API will be tested to ensure it adheres to the following contract:

- **1. Endpoint Definition:**
    - **1-1.** It should expose a `POST /api/improve-text` endpoint.

- **2. Success Case:**
    - **2-1.** Given a valid JSON request `{"text": "some user input"}`, it should return a `200 OK` HTTP status code.
    - **2-2.** The response body must be a JSON object containing the improved text: `{"improved_text": "some ai output"}`.

- **3. Validation Error Cases:**
    - **3-1.** Given a request with a missing `text` key or a non-string value, it should return a `422 Unprocessable Entity` status with a descriptive error.
    - **3-2.** Given a request with an empty string `{"text": ""}`, it should return a `422 Unprocessable Entity` status.

- **4. External Service Error Case:**
    - **4-1.** In the event that the external Google Gemini API is unavailable or returns an error, the endpoint should return a `503 Service Unavailable` status to the client.

- **5. AI Model Selection:**
    - **5-1.** The service must dynamically select the first available Gemini model that supports content generation.

- **6. AI Prompting Logic:**
    - **6-1.** The service must create a prompt for the Gemini model that specifically instructs it to rewrite text for a job interview context, focusing on a confident and professional tone. (This can be verified by logging the prompt during tests).

### 2.3. Database Requirements (Supabase)

The application will integrate with Supabase for database and authentication services.

- **1. Data Storage:**
    - **1-1.** A `history` table must be created to store records of text improvement requests. It should have the following columns:
        - `id` (UUID, Primary Key)
        - `user_id` (UUID, Foreign Key to `auth.users.id`)
        - `original_text` (TEXT)
        - `improved_text` (TEXT)
        - `created_at` (TIMESTAMPTZ, defaults to the current time)

- **2. API Integration:**
    - **2-1.** The backend service must securely manage Supabase project URL and API keys.
    - **2-2.** The backend must use the Supabase client library to interact with the database.

## 3. Technology Stack

- **Frontend:** React
- **Backend:** Python with FastAPI
- **Database:** Supabase
- **AI Model:** Google Gemini

## 4. Future Vision

- **User Accounts:** Introduce user accounts to allow users to save their history and track progress.
- **Monetization:** Implement a freemium model where free users have a token/usage limit, and paid users have unlimited access.
- **Expanded Features:** Potentially support more languages, different interview types (technical, behavioral), or analyze spoken audio.
