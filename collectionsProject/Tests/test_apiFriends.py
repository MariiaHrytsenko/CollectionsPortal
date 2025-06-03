import pytest
import requests

BASE_URL = "http://localhost:5000/api"
AUTH_TOKEN = "тут_твій_токен"

headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}

def test_get_friends():
    response = requests.get(f"{BASE_URL}/friends", headers=headers)
    assert response.status_code == 200
    friends = response.json()
    assert isinstance(friends, list)

def test_remove_friend():
    friend_id = "friend-user-id"  # заміни на актуальний ID друга
    response = requests.delete(f"{BASE_URL}/friends/{friend_id}", headers=headers)
    assert response.status_code == 204
