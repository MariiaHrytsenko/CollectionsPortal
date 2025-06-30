const API_BASE = "/api";

export async function getCommentsForItem(token: string, itemId: string | number) {
  const res = await fetch(`${API_BASE}/Comment/item/${itemId}`, {
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(token: string, itemId: string | number, text: string) {
  const res = await fetch(`${API_BASE}/Comment`, {
    method: "POST",
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ iDitem: itemId, text }) // Use lowercase keys as required by backend
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function updateComment(token: string, comment: any) {
  const res = await fetch(`${API_BASE}/Comment/${comment.iDcomment}`, {
    method: "PUT",
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(comment)
  });
  if (!res.ok) throw new Error("Failed to update comment");
  return res.json();
}

export async function deleteComment(token: string, commentId: string | number) {
  const res = await fetch(`${API_BASE}/Comment/${commentId}`, {
    method: "DELETE",
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}
