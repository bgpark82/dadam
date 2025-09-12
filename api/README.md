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
    pip3 install -r requirements.txt
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

## Stopping the server

To stop the development server, press `Ctrl+C` in the terminal where the server is running.

## Testing with cURL

### Improve text

You can test the `/api/improve-text` endpoint using `curl`:

```bash
curl -X POST "http://localhost:8000/api/improve-text" \
-H "Content-Type: application/json" \
-d '{"text": "hello world"}'
```

This will send a POST request to the endpoint with the specified text and should return a JSON response with the improved text.

### List available models

You can list the available models using `curl`:

```bash
curl http://localhost:8000/api/models
```
