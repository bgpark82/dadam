# Dadam API

This is the backend API for the Dadam application.

## Setup

1.  **Create a virtual environment:**

    ```bash
    python3 -m venv venv
    ```

2.  **Activate the virtual environment:**

    -   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
    -   On Windows:
        ```bash
        venv\Scripts\activate
        ```

3.  **Install the dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Create a `.env` file:**

    Copy the `.env.example` file to a new file named `.env`:

    ```bash
    cp .env.example .env
    ```

    Open the `.env` file and replace `your_gemini_api_key_here` with your actual Google Gemini API key.

5.  **Run the development server:**

    ```bash
    uvicorn main:app --reload
    ```

    The API will be available at `http://localhost:8000`.
