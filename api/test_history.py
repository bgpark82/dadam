from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch

client = TestClient(app)

def test_get_history_endpoint_exists():
    response = client.get("/api/history")
    assert response.status_code != 404

def test_get_history_returns_200_ok():
    response = client.get("/api/history")
    assert response.status_code == 200

def test_get_history_returns_json_array():
    response = client.get("/api/history")
    assert isinstance(response.json(), list)

def test_get_history_returns_correct_fields():
    mock_history_data = [
        {
            "id": 1,
            "user_id": "test_user",
            "original_text": "This is the original text.",
            "improved_text": "This is the improved text.",
            "created_at": "2025-08-24T10:00:00Z",
        }
    ]

    with patch('main.supabase.table') as mock_table:
        (
            mock_table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data
        ) = mock_history_data
        response = client.get("/api/history")
        assert response.status_code == 200
        history_item = response.json()[0]
        assert "id" in history_item
        assert "user_id" in history_item
        assert "original_text" in history_item
        assert "improved_text" in history_item
        assert "created_at" in history_item
