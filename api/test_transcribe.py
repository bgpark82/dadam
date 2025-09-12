from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from .main import app

client = TestClient(app)

def test_transcribe_audio_success():
    with patch('api.main.aai.settings.api_key', 'test-api-key'), \
         patch('assemblyai.Transcriber.transcribe') as mock_transcribe:
        mock_transcript = MagicMock()
        mock_transcript.text = "This is a test transcription."
        mock_transcript.error = None
        mock_transcribe.return_value = mock_transcript

        with open("test.wav", "wb") as f:
            f.write(b"dummy audio data")

        with open("test.wav", "rb") as f:
            response = client.post("/api/transcribe", files={"file": ("test.wav", f, "audio/wav")})

        assert response.status_code == 200
        assert response.json() == {"transcription": "This is a test transcription."}
        mock_transcribe.assert_called_once()
