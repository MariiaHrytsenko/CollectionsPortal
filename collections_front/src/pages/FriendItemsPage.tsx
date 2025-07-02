import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import { getFriendItems } from "../api/friends";
import { getCommentsForItem, addComment, updateComment, deleteComment } from "../api/comments";
import axios from "axios";
import config from "../AppConfig.json";

const API_URL = config.API_URL;

const translations = {
  en: {
    friendsCollection: "Friend's Collection",
    noItems: "No items found.",
    search: "Search items...",
    sortBy: "Sort by:",
    sortOrder: "Sort order:",
    ascending: "Ascending",
    descending: "Descending",
    name: "Name",
    id: "ID",
    category: "Category",
    characteristics: "Characteristics",
    noValue: "No value",
    loading: "Loading...",
    failedToLoadItems: "Failed to load friend's items.",
    noItemsFound: "No items found matching your search.",
    totalItems: "Total Items:",
    viewDetails: "View Details",
    loadingComments: "Loading comments...",
    noComments: "No comments yet.",
    addComment: "Add a comment...",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    editComment: "Edit your comment:",
    comments: "Comments:",
    confirmDeleteComment: "Are you sure you want to delete this comment?"
  },
  pl: {
    friendsCollection: "Kolekcja znajomego",
    noItems: "Nie znaleziono przedmiotów.",
    search: "Szukaj przedmiotów...",
    sortBy: "Sortuj według:",
    sortOrder: "Kolejność sortowania:",
    ascending: "Rosnąco",
    descending: "Malejąco",
    name: "Nazwa",
    id: "ID",
    category: "Kategoria",
    characteristics: "Cechy",
    noValue: "Brak wartości",
    loading: "Ładowanie...",
    failedToLoadItems: "Nie udało się załadować przedmiotów znajomego.",
    noItemsFound: "Nie znaleziono przedmiotów spełniających kryteria wyszukiwania.",
    totalItems: "Łączna liczba przedmiotów:",
    viewDetails: "Zobacz szczegóły",
    loadingComments: "Ładowanie komentarzy...",
    noComments: "Brak komentarzy.",
    addComment: "Dodaj komentarz...",
    add: "Dodaj",
    edit: "Edytuj",
    delete: "Usuń",
    save: "Zapisz",
    cancel: "Anuluj",
    editComment: "Edytuj swój komentarz:",
    comments: "Komentarze:",
    confirmDeleteComment: "Czy na pewno chcesz usunąć ten komentarz?"
  },
};

interface Item {
  iditem?: number;
  iDitem?: number;
  nameItem: string;
  photoItem: string;
  categoryId?: number;
  categoryName?: string;
  title?: string;
  name?: string;
  description?: string;
  characteristics?: any;
  chracteristics?: {
    idchracteristic: number;
    nameCharacteristic: string;
    value: string;
  }[];
}

const FriendItemsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();
  const { friendId } = useParams();
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [friendName, setFriendName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [comments, setComments] = useState<{ [itemId: string]: any[] }>({});
  const [commentInputs, setCommentInputs] = useState<{ [itemId: string]: string }>({});
  const [commentLoading, setCommentLoading] = useState<{ [itemId: string]: boolean }>({});
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [editingComment, setEditingComment] = useState<any | null>(null);
  const [editText, setEditText] = useState("");
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !friendId) {
      setError(t.failedToLoadItems);
      setLoading(false);
      return;
    }
    getFriendItems(token, friendId)
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError(t.failedToLoadItems);
        setLoading(false);
      });

    // Fetch current user info
    fetchCurrentUser();
  }, [friendId, t]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/Account/me`, { withCredentials: true });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchComments = async (itemId: number) => {
    setCommentLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      const response = await axios.get(`${API_URL}/Comment/item/${itemId}`, { 
        withCredentials: true 
      });
      setComments(prev => ({ ...prev, [itemId]: response.data || [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments(prev => ({ ...prev, [itemId]: [] }));
    } finally {
      setCommentLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleAddComment = async (itemId: number) => {
    const text = commentInputs[itemId];
    if (!text || !text.trim()) return;
    
    setCommentLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      // First, get user information
      const userResponse = await axios.get(`${API_URL}/Account/me`, { withCredentials: true });
      const user = userResponse.data;

      // Then submit the comment
      const commentData = {
        iDitem: itemId,
        text: text.trim(),
        iDcommentator: user.id
      };

      await axios.post(`${API_URL}/Comment`, commentData, { withCredentials: true });
      
      setCommentInputs(prev => ({ ...prev, [itemId]: "" }));
      await fetchComments(itemId);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingComment(comment);
    setEditText(comment.text);
  };

  const handleSaveEditComment = async () => {
    if (!editingComment || !editText.trim()) return;
    
    try {
      const updatedComment = {
        ...editingComment,
        text: editText.trim()
      };

      await axios.put(`${API_URL}/Comment/${editingComment.iDcomment}`, updatedComment, { 
        withCredentials: true 
      });

      setEditingComment(null);
      setEditText("");
      await fetchComments(editingComment.iDitem);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number, itemId: number) => {
    if (!window.confirm(lang === 'pl' ? 'Czy na pewno chcesz usunąć ten komentarz?' : 'Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/Comment/${commentId}`, {
        withCredentials: true
      });
      await fetchComments(itemId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Helper function to get item ID consistently
  const getItemId = (item: Item): number => {
    return item.iDitem !== undefined ? item.iDitem : (item.iditem || 0);
  };

  // Sort options for dropdown
  const getSortOptions = () => [
    { value: "name", label: t.name },
    { value: "id", label: t.id },
    { value: "category", label: t.category }
  ];

  // Filter and sort items
  const filteredAndSortedItems = items
    .filter((item) => {
      const itemName = item.nameItem || item.title || item.name || "";
      return itemName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "name":
          aValue = (a.nameItem || a.title || a.name || "").toLowerCase();
          bValue = (b.nameItem || b.title || b.name || "").toLowerCase();
          break;
        case "id":
          aValue = getItemId(a);
          bValue = getItemId(b);
          break;
        case "category":
          aValue = a.categoryId || 0;
          bValue = b.categoryId || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  useEffect(() => {
    if (items.length > 0) {
      items.forEach(item => {
        const itemId = getItemId(item);
        if (itemId && itemId > 0) {
          fetchComments(itemId);
        }
      });
    }
  }, [items]);

  useEffect(() => {
    if (showModal && selectedItem) {
      const itemId = getItemId(selectedItem);
      if (itemId && itemId > 0) {
        fetchComments(itemId);
      }
    }
  }, [showModal, selectedItem]);

  if (loading) {
    return (
      <div className="home-container">
        <div style={{ color: '#007bff', fontWeight: 'bold', margin: '2rem 0', textAlign: 'center' }}>
          {t.loading}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div style={{ color: "#dc3545", fontWeight: "bold", margin: "2rem 0", textAlign: "center" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ color: '#007bff', marginBottom: '12px', fontSize: '1.8rem' }}>
            {t.friendsCollection}
          </h1>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#495057' }}>
              {t.totalItems} 
            </strong>
            <span style={{ marginLeft: '8px', color: '#6c757d' }}>
              {items.length}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        {/* Search Input - First Row */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontWeight: 500,
            marginBottom: '4px',
            color: '#495057',
            fontSize: '0.9rem'
          }}>
            {t.search}
          </label>
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '95%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9rem',
              backgroundColor: 'white'
            }}
          />
        </div>

        {/* Sort Controls - Second Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          {/* Sort By */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: 500,
              marginBottom: '4px',
              color: '#495057',
              fontSize: '0.9rem'
            }}>
              {t.sortBy}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.9rem',
                backgroundColor: 'white'
              }}
            >
              {getSortOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: 500,
              marginBottom: '4px',
              color: '#495057',
              fontSize: '0.9rem'
            }}>
              {t.sortOrder}
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.9rem',
                backgroundColor: 'white'
              }}
            >
              <option value="asc">{t.ascending}</option>
              <option value="desc">{t.descending}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="pinterest-grid">
        {filteredAndSortedItems.length === 0 ? (
          <div style={{ color: "#888", fontSize: "1rem" }}>
            {items.length === 0 ? t.noItems : t.noItemsFound}
          </div>
        ) : (
          filteredAndSortedItems.map((item) => {
            const itemId = getItemId(item);
            return (
              <div className="item-card" key={itemId}>
                <img 
                  src={item.photoItem && item.photoItem.trim() !== '' 
                    ? `data:image/jpeg;base64,${item.photoItem}` 
                    : '/default-item.jpeg'
                  } 
                  alt={item.nameItem || item.title || item.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-item.jpeg';
                  }}
                />
                <div className="item-card-header">
                  <h3 className="item-title">{item.nameItem || item.title || item.name}</h3>
                  <h4 className="item-id">
                    <b>ID:</b> {itemId}
                  </h4>
                </div>
                <div className="item-card-content">
                  {/* Category Info */}
                  {item.categoryId && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ 
                        color: '#495057', 
                        fontSize: '0.9rem'
                      }}>
                        {t.category}:
                      </strong>
                      <span style={{ 
                        marginLeft: '6px',
                        color: '#007bff'
                      }}>
                        {item.categoryId}
                      </span>
                    </div>
                  )}

                  {/* Characteristics */}
                  {((item.chracteristics && item.chracteristics.length > 0) || 
                    (item.characteristics && typeof item.characteristics === 'object')) && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ 
                        color: '#495057', 
                        fontSize: '0.9rem',
                        display: 'block',
                        marginBottom: '8px'
                      }}>
                        {t.characteristics}
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {item.chracteristics && item.chracteristics.length > 0 ? (
                          item.chracteristics.map((char) => (
                            <div 
                              key={char.idchracteristic}
                              style={{
                                fontSize: '0.85rem',
                                color: '#6c757d',
                                padding: '2px 0'
                              }}
                            >
                              <span style={{ fontWeight: '500', color: '#495057' }}>
                                {char.nameCharacteristic}:
                              </span>
                              <span style={{ marginLeft: '6px' }}>
                                {char.value || t.noValue}
                              </span>
                            </div>
                          ))
                        ) : item.characteristics && typeof item.characteristics === 'object' ? (
                          Object.entries(item.characteristics).map(([k, v]) => (
                            <div 
                              key={k}
                              style={{
                                fontSize: '0.85rem',
                                color: '#6c757d',
                                padding: '2px 0'
                              }}
                            >
                              <span style={{ fontWeight: '500', color: '#495057' }}>
                                {k}:
                              </span>
                              <span style={{ marginLeft: '6px' }}>
                                {String(v) || t.noValue}
                              </span>
                            </div>
                          ))
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <button 
                    className="button" 
                    onClick={() => { 
                      setSelectedItem(item); 
                      setShowModal(true); 
                      setCommentInputs(prev => ({ ...prev, [itemId]: "" })); 
                    }}
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for View Details */}
      {showModal && selectedItem && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'rgba(0,0,0,0.5)', 
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 12, 
            padding: 28, 
            minWidth: 400, 
            maxWidth: 650, 
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)', 
            position: 'relative',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <button 
              onClick={() => setShowModal(false)} 
              style={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                background: 'none', 
                border: 'none', 
                fontSize: 22, 
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              &times;
            </button>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 10 }}>
              <img
                src={selectedItem.photoItem && selectedItem.photoItem.trim() !== '' 
                  ? `data:image/jpeg;base64,${selectedItem.photoItem}` 
                  : "/default-item.jpeg"
                }
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('/default-item.jpeg')) {
                    target.src = '/default-item.jpeg';
                  }
                }}
                alt={selectedItem.nameItem || selectedItem.title || selectedItem.name}
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 8, 
                  objectFit: 'cover', 
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)' 
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '1.15rem', 
                  marginBottom: 2 
                }}>
                  {selectedItem.nameItem || selectedItem.title || selectedItem.name}
                </div>
                <div style={{ color: '#888', marginBottom: 2 }}>
                  {selectedItem.description}
                </div>
                {selectedItem.characteristics && typeof selectedItem.characteristics === 'object' && (
                  <div style={{ marginTop: 4 }}>
                    {Object.entries(selectedItem.characteristics).map(([k, v]) => (
                      <div key={k} style={{ color: '#555', fontSize: '0.98rem' }}>
                        <b>{k}:</b> {String(v)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ 
              marginTop: 16, 
              background: '#f8f9fa', 
              borderRadius: 8, 
              padding: 24, 
              minHeight: 250, 
              maxHeight: 400, 
              overflowY: 'auto' 
            }}>
              <div style={{ 
                fontWeight: 500, 
                marginBottom: 10, 
                fontSize: '1.15rem' 
              }}>
                {t.comments}
              </div>
              {(() => {
                const itemId = getItemId(selectedItem);
                return commentLoading[itemId] ? (
                  <div style={{ color: '#888' }}>{t.loadingComments}</div>
                ) : (
                  <>
                    {comments[itemId] && comments[itemId].length > 0 ? (
                      comments[itemId].map((c: any) => {
                        const isAuthor = currentUser && (c.iDcommentator === currentUser.id || c.iDcommentator === currentUser.iD);
                        // Handle different possible field names for username and avatar
                        const displayName = c.username || c.userName || 'User';
                        const avatarSrc = c.avatarBase64 || c.userAvatar;
                        
                        return (
                          <div key={c.iDcomment} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            borderBottom: '1px solid #eee', 
                            padding: '6px 0' 
                          }}>
                            <img
                              src={avatarSrc ? `data:image/jpeg;base64,${avatarSrc}` : "/standart-user.png"}
                              alt={displayName}
                              style={{ 
                                width: 32, 
                                height: 32, 
                                borderRadius: '50%', 
                                objectFit: 'cover', 
                                marginRight: 10, 
                                boxShadow: '0 1px 4px rgba(0,0,0,0.08)' 
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/standart-user.png';
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 500, fontSize: '0.98rem' }}>
                                {displayName}
                              </div>
                              <div style={{ fontSize: '0.98rem' }}>{c.text}</div>
                              <div style={{ color: '#888', fontSize: '0.85rem' }}>
                                {c.createdDate && new Date(c.createdDate).toLocaleString()}
                              </div>
                            </div>
                            {isAuthor && (
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button 
                                  className="button" 
                                  style={{ 
                                    fontSize: 12, 
                                    padding: '2px 8px',
                                    backgroundColor: '#ffc107',
                                    color: '#212529'
                                  }} 
                                  onClick={() => handleEditComment(c)}
                                >
                                  {t.edit}
                                </button>
                                <button 
                                  className="button" 
                                  style={{ 
                                    fontSize: 12, 
                                    padding: '2px 8px', 
                                    background: '#dc3545', 
                                    color: '#fff' 
                                  }} 
                                  onClick={() => handleDeleteComment(c.iDcomment, itemId)}
                                >
                                  {t.delete}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ color: '#aaa' }}>{t.noComments}</div>
                    )}
                  </>
                );
              })()}
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                {(() => {
                  const itemId = getItemId(selectedItem);
                  return (
                    <>
                      <input
                        type="text"
                        placeholder={t.addComment}
                        value={commentInputs[itemId] !== undefined ? commentInputs[itemId] : ""}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [itemId]: e.target.value }))}
                        style={{ 
                          flex: 1, 
                          padding: 6, 
                          borderRadius: 6, 
                          border: '1px solid #ced4da' 
                        }}
                      />
                      <button 
                        className="button" 
                        style={{ minWidth: 80 }} 
                        disabled={commentLoading[itemId]} 
                        onClick={() => handleAddComment(itemId)}
                      >
                        {t.add}
                      </button>
                    </>
                  );
                })()}
              </div>
              {editingComment && (
                <div style={{ 
                  marginTop: 10, 
                  background: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: 6, 
                  padding: 10 
                }}>
                  <div style={{ marginBottom: 6 }}>{t.editComment}</div>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: 6, 
                      borderRadius: 6, 
                      border: '1px solid #ced4da' 
                    }}
                  />
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button 
                      className="button" 
                      onClick={handleSaveEditComment} 
                      style={{ 
                        minWidth: 70,
                        backgroundColor: '#28a745',
                        color: 'white'
                      }}
                    >
                      {t.save}
                    </button>
                    <button 
                      className="button" 
                      onClick={() => {
                        setEditingComment(null);
                        setEditText("");
                      }} 
                      style={{ 
                        minWidth: 70,
                        backgroundColor: '#6c757d',
                        color: 'white'
                      }}
                    >
                      {t.cancel}
                    </button>
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
