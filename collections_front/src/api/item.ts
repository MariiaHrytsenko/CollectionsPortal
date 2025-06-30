// API functions for item endpoints
const API_BASE = "/api";

export async function addItem(token: string, data: {
  nameItem: string,
  photoItem: string,
  categoryId: number,
  chracteristics: { idchracteristic: number, value: string }[]
}) {
  const res = await fetch(`${API_BASE}/Item`, {
    method: "POST",
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}
