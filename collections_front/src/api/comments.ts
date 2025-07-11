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
  const iDcommentator = localStorage.getItem("userId") || ""; // Get userId from localStorage
  const res = await fetch(`${API_BASE}/Comment`, {
    method: "POST",
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ iDitem: itemId, text, iDcommentator }) // Include iDcommentator in the request
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function updateComment(token: string, comment: any) {
  // Send iDcomment, text, and iDcommentator as required by backend
  const iDcommentator = localStorage.getItem("userId") || "";
  const res = await fetch(`${API_BASE}/Comment/${comment.iDcomment}`, {
    method: "PUT",
    headers: {
      "Authorize": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ iDcomment: comment.iDcomment, text: comment.text, iDcommentator })
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
