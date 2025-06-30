import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFriendItems } from "../api/friends";
import { getCommentsForItem, addComment, updateComment, deleteComment } from "../api/comments";

const FriendItemsPage = () => {
  const { friendId } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [friendName, setFriendName] = useState("");

  const [comments, setComments] = useState<{ [itemId: string]: any[] }>({});
  const [commentInputs, setCommentInputs] = useState<{ [itemId: string]: string }>({});
  const [commentLoading, setCommentLoading] = useState<{ [itemId: string]: boolean }>({});
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [editingComment, setEditingComment] = useState<any | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !friendId) {
      setError("No access or friend ID.");
      setLoading(false);
      return;
    }
    getFriendItems(token, friendId)
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load friend's items.");
        setLoading(false);
      });
  }, [friendId]);

  const fetchComments = async (iDitem: number) => {
    const token = localStorage.getItem("token") || "";
    setCommentLoading(prev => ({ ...prev, [iDitem]: true }));
    try {
      const data = await getCommentsForItem(token, iDitem);
      setComments(prev => ({ ...prev, [iDitem]: data }));
    } catch {
      setComments(prev => ({ ...prev, [iDitem]: [] }));
    }
    setCommentLoading(prev => ({ ...prev, [iDitem]: false }));
  };

  const handleAddComment = async (iDitem: number) => {
    const token = localStorage.getItem("token") || "";
    const text = commentInputs[iDitem];
    if (!text) return;
    setCommentLoading(prev => ({ ...prev, [iDitem]: true }));
    try {
      await addComment(token, iDitem, text);
      setCommentInputs(prev => ({ ...prev, [iDitem]: "" }));
      await fetchComments(iDitem);
    } catch {}
    setCommentLoading(prev => ({ ...prev, [iDitem]: false }));
  };

  const handleEditComment = (comment: any) => {
    setEditingComment(comment);
    setEditText(comment.text);
  };

  const handleSaveEditComment = async () => {
    if (!editingComment) return;
    const token = localStorage.getItem("token") || "";
    await updateComment(token, { iDcomment: editingComment.iDcomment, text: editText });
    setEditingComment(null);
    setEditText("");
    await fetchComments(editingComment.iDitem);
  };

  const handleDeleteComment = async (commentId: number, iDitem: number) => {
    const token = localStorage.getItem("token") || "";
    await deleteComment(token, commentId);
    await fetchComments(iDitem);
  };

  useEffect(() => {
    if (items.length > 0) {
      items.forEach(item => {
        const iDitem = item.iDitem !== undefined ? item.iDitem : item.iditem;
        if (iDitem && typeof iDitem === 'number' && iDitem > 0) {
          fetchComments(iDitem);
        }
      });
    }
  }, [items]);

  useEffect(() => {
    if (showModal && selectedItem && (selectedItem.iDitem || selectedItem.iditem)) {
      const iDitem = selectedItem.iDitem !== undefined ? selectedItem.iDitem : selectedItem.iditem;
      if (iDitem && typeof iDitem === 'number' && iDitem > 0) {
        fetchComments(iDitem);
      }
    }
  }, [showModal, selectedItem]);

  if (loading) return <div className="home-container">Loading...</div>;
  if (error) return <div className="home-container" style={{ color: "#dc3545" }}>{error}</div>;

  return (
    <div className="home-container" style={{ maxWidth: 800 }}>
      <h2 style={{ color: '#007bff', marginBottom: 24 }}>Friend's Collection</h2>
      <div style={{ display: 'grid', gap: 18 }}>
        {items.length === 0 ? (
          <div style={{ color: '#888' }}>No items found.</div>
        ) : (
          items.map(item => {
            const iDitem = item.iDitem !== undefined ? item.iDitem : item.iditem;
            return (
              <div key={iDitem} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 18 }}>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 10 }}>
                  <img
                    src={item.photoItem && item.photoItem.trim() !== '' ? `data:image/png;base64,${item.photoItem}` : "/default-item.png"}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.endsWith('/default-item.jpeg')) {
                        target.src = '/default-item.jpeg';
                      }
                    }}
                    alt={item.nameItem || item.title || item.name}
                    style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: 2 }}>{item.nameItem || item.title || item.name}</div>
                    <div style={{ color: '#888', marginBottom: 2 }}>{item.description}</div>
                    <div style={{ color: '#b00', fontSize: '0.95rem', marginBottom: 2 }}><b>iDitem:</b> {iDitem}</div>
                    {item.characteristics && typeof item.characteristics === 'object' && (
                      <div style={{ marginTop: 4 }}>
                        {Object.entries(item.characteristics).map(([k, v]) => (
                          <div key={k} style={{ color: '#555', fontSize: '0.98rem' }}><b>{k}:</b> {String(v)}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="button" style={{ marginLeft: 12 }} onClick={() => { setSelectedItem({ ...item, iDitem }); setShowModal(true); setCommentInputs(prev => ({ ...prev, [iDitem]: "" })); }}>View Details</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {showModal && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, minWidth: 400, maxWidth: 650, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 10 }}>
              <img
                src={selectedItem.photoItem && selectedItem.photoItem.trim() !== '' ? `data:image/png;base64,${selectedItem.photoItem}` : "/default-item.png"}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('/default-item.jpeg')) {
                    target.src = '/default-item.jpeg';
                  }
                }}
                alt={selectedItem.nameItem || selectedItem.title || selectedItem.name}
                style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: 2 }}>{selectedItem.nameItem || selectedItem.title || selectedItem.name}</div>
                <div style={{ color: '#888', marginBottom: 2 }}>{selectedItem.description}</div>
                {selectedItem.characteristics && typeof selectedItem.characteristics === 'object' && (
                  <div style={{ marginTop: 4 }}>
                    {Object.entries(selectedItem.characteristics).map(([k, v]) => (
                      <div key={k} style={{ color: '#555', fontSize: '0.98rem' }}><b>{k}:</b> {String(v)}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: 16, background: '#f9fbfd', borderRadius: 8, padding: 24, minHeight: 250, maxHeight: 500, overflowY: 'auto' }}>
              <div style={{ fontWeight: 500, marginBottom: 10, fontSize: '1.15rem' }}>Comments:</div>
              {commentLoading[selectedItem.iDitem] ? (
                <div style={{ color: '#888' }}>Loading comments...</div>
              ) : (
                <>
                  {comments[selectedItem.iDitem] && comments[selectedItem.iDitem].length > 0 ? (
                    comments[selectedItem.iDitem].map((c: any) => {
                      const isAuthor = c.iDcommentator === localStorage.getItem('userId');
                      return (
                        <div key={c.iDcomment} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '6px 0' }}>
                          <img
                            src={c.userAvatar ? `data:image/png;base64,${c.userAvatar}` : "/standart-user.png"}
                            alt={c.userName || 'User'}
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: '0.98rem' }}>{c.userName || 'User'}</div>
                            <div style={{ fontSize: '0.98rem' }}>{c.text}</div>
                            <div style={{ color: '#888', fontSize: '0.85rem' }}>{c.createdDate && new Date(c.createdDate).toLocaleString()}</div>
                          </div>
                          {isAuthor && (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="button" style={{ fontSize: 12, padding: '2px 8px' }} onClick={() => handleEditComment(c)}>
                                Edit
                              </button>
                              <button className="button" style={{ fontSize: 12, padding: '2px 8px', background: '#dc3545', color: '#fff' }} onClick={() => handleDeleteComment(c.iDcomment, selectedItem.iDitem)}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: '#aaa' }}>No comments yet.</div>
                  )}
                </>
              )}
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[selectedItem.iDitem] !== undefined ? commentInputs[selectedItem.iDitem] : ""}
                  onChange={e => setCommentInputs(prev => ({ ...prev, [selectedItem.iDitem]: e.target.value }))}
                  style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #b5c9e2' }}
                />
                <button className="button" style={{ minWidth: 80 }} disabled={commentLoading[selectedItem.iDitem]} onClick={() => handleAddComment(selectedItem.iDitem)}>
                  Add
                </button>
              </div>
              {editingComment && (
                <div style={{ marginTop: 10, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, padding: 10 }}>
                  <div style={{ marginBottom: 6 }}>Edit your comment:</div>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #b5c9e2' }}
                  />
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button className="button" onClick={handleSaveEditComment} style={{ minWidth: 70 }}>Save</button>
                    <button className="button" onClick={() => setEditingComment(null)} style={{ minWidth: 70 }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendItemsPage;
