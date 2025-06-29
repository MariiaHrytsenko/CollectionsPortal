// API functions for friends endpoints

const API_BASE = "/api";

export async function getFriends(token: string) {
  const res = await fetch(`${API_BASE}/Friends`, {
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json();
}

export async function getFriendItems(token: string, friendId: string) {
  const res = await fetch(`/api/Friends/${friendId}/items`, {
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch friend's items");
  return res.json();
}

// Add more friends-related API functions as needed
