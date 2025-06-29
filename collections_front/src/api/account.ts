// API functions for account endpoints
const API_BASE = "/api";

export async function getAccountMe(token: string) {
  try {
    const res = await fetch(`${API_BASE}/Account/me`, {
      headers: {
        "Authorize": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      // Try to parse error message from JSON, fallback to text
      if (contentType && contentType.includes("application/json")) {
        const errData = await res.json();
        throw new Error(errData.error || JSON.stringify(errData));
      } else {
        const errText = await res.text();
        throw new Error(errText);
      }
    }
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      // Not JSON, probably HTML error page
      const text = await res.text();
      throw new Error("Unexpected response: " + text.slice(0, 100));
    }
  } catch (err: any) {
    throw new Error(err.message || "Unknown error");
  }
}

export async function updateAccountMe(token: string, data: any) {
  const res = await fetch(`${API_BASE}/Account/me`, {
    method: "PUT",
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update user profile");
  // Try to parse JSON, but fallback to text if not JSON
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    await res.text();
    return data;
  }
}
