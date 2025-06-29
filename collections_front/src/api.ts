// Central API utility for backend communication

const API_BASE = "/api";

export async function getProfile(token: string) {
  const res = await fetch(`${API_BASE}/Account/profile`, {
    headers: {
      "Authorizate": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

// Add more API functions as needed
