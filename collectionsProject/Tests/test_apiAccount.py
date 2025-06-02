import uuid
import requests

BASE_URL = "http://localhost:5057/api/Account"
registered_email = None  # глобальна змінна для збереження email після реєстрації

def test_register():
    global registered_email
    registered_email = f"user_{uuid.uuid4()}@example.com"
    payload = {
        "email": registered_email,
        "password": "stringPass123!",
        "userName": "stringUser"
    }
    response = requests.post(f"{BASE_URL}/register", json=payload)
    print("Register status code:", response.status_code)
    print("Register response:", response.text)
    assert response.status_code == 200, "Registration failed"

def test_login():
    global registered_email
    if not registered_email:
        raise Exception("No registered email found. Run test_register first.")
    payload = {
        "email": registered_email,
        "password": "stringPass123!"
    }
    response = requests.post(f"{BASE_URL}/login", json=payload)
    print("Login status code:", response.status_code)
    print("Login response:", response.json())
    assert response.status_code == 200, "Login failed"
    assert "token" in response.json(), "Token not found in login response"
