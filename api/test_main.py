from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from .main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Dadam API is running."}

def test_improve_text_success():
    with patch('google.generativeai.GenerativeModel.generate_content') as mock_generate_content:
        mock_response = MagicMock()
        mock_response.text = "This is an improved answer."
        mock_feedback = MagicMock()
        mock_feedback.block_reason = None
        mock_response.prompt_feedback = mock_feedback
        mock_generate_content.return_value = mock_response

        response = client.post("/api/improve-text", json={"text": "hello world"})
        assert response.status_code == 200
        assert response.json() == {"improved_text": "This is an improved answer."}
        mock_generate_content.assert_called_once()

def test_improve_text_missing_text():
    response = client.post("/api/improve-text", json={})
    assert response.status_code == 422

def test_improve_text_non_string_text():
    response = client.post("/api/improve-text", json={"text": 123})
    assert response.status_code == 422

def test_improve_text_empty_text():
    response = client.post("/api/improve-text", json={"text": ""})
    assert response.status_code == 422

def test_improve_text_gemini_error():
    with patch('google.generativeai.GenerativeModel.generate_content', side_effect=Exception("Gemini API error")):
        response = client.post("/api/improve-text", json={"text": "hello world"})
        assert response.status_code == 500
        assert "An error occurred: Gemini API error" in response.json()["detail"]

def test_improve_text_content_blocked():
    with patch('google.generativeai.GenerativeModel.generate_content') as mock_generate_content:
        mock_response = MagicMock()
        mock_feedback = MagicMock()
        mock_feedback.block_reason = "SAFETY"
        mock_response.prompt_feedback = mock_feedback
        mock_response.text = None
        mock_generate_content.return_value = mock_response

        response = client.post("/api/improve-text", json={"text": "some sensitive content"})
        assert response.status_code == 400
        assert "Content blocked: SAFETY" in response.json()["detail"]

def test_prompt_generation():
    with patch('google.generativeai.GenerativeModel.generate_content') as mock_generate_content:
        mock_response = MagicMock()
        mock_response.text = "This is an improved answer."
        mock_feedback = MagicMock()
        mock_feedback.block_reason = None
        mock_response.prompt_feedback = mock_feedback
        mock_generate_content.return_value = mock_response

        client.post("/api/improve-text", json={"text": "hello world"})
        
        expected_prompt = "Rewrite the following text for a job interview, focusing on a confident and professional tone:\n\nhello world"
        mock_generate_content.assert_called_with(expected_prompt)