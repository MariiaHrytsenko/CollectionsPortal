import pytest
import requests

BASE_URL = "http://localhost:5000/api"
AUTH_TOKEN = "тут_твій_токен"

headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}

def test_send_invitation():
    payload = {
        "inviterId": "user1-id",
        "email": "friend@example.com"
    }
    response = requests.post(f"{BASE_URL}/invitations/send", json=payload, headers=headers)
    assert response.status_code in (200, 201)

def test_get_received_invitations():
    response = requests.get(f"{BASE_URL}/invitations/received", headers=headers)
    assert response.status_code == 200
    invitations = response.json()
    assert isinstance(invitations, list)

def test_accept_invitation():
    invitation_id = 1  # заміни на актуальний ID
    response = requests.post(f"{BASE_URL}/invitations/{invitation_id}/accept", headers=headers)
    assert response.status_code == 200
