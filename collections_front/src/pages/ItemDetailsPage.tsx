import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import axios from "axios";
import config from "../AppConfig.json";

const API_URL = config.API_URL;

const translations = {
  en: {
    itemDetails: "Item Details",
    loading: "Loading...",
    itemNotFound: "Item not found.",
    failedToLoadItem: "Failed to load item details.",
    itemIdRequired: "Item ID is required.",
    itemIdMustBeNumber: "Item ID must be a number.",
    itemIdMustBePositive: "Item ID must be a positive number.",
    backToCategory: "Back to Category",
    itemName: "Item Name",
    itemId: "Item ID",
    category: "Category",
    characteristics: "Characteristics",
    noCharacteristics: "No characteristics available for this item.",
    noValue: "No value",
    image: "Image",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    editMode: "Edit Mode",
    changeImage: "Change Image",
    updating: "Updating...",
    updateSuccess: "Item updated successfully!",
    updateFailed: "Failed to update item.",
    fileTooLarge: "Image file is too large. Please choose a file smaller than 5MB.",
    invalidFileType: "Please select a valid image file (JPEG, PNG, GIF, or WebP).",
    failedToReadFile: "Failed to read image file.",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this item? This action cannot be undone.",
    deleting: "Deleting...",
    deleteSuccess: "Item deleted successfully!",
    deleteFailed: "Failed to delete item.",
    comments: "Comments",
    noComments: "No comments yet.",
    loadingComments: "Loading comments...",
    failedToLoadComments: "Failed to load comments.",
    commentDate: "on",
    commentsCount: "comments",
    addComment: "Add Comment",
    commentText: "Comment text",
    commentTextPlaceholder: "Enter your comment...",
    submit: "Submit",
    submittingComment: "Submitting...",
    commentAddedSuccess: "Comment added successfully!",
    failedToAddComment: "Failed to add comment.",
    failedToGetUser: "Failed to get user information.",
    commentTooShort: "Comment must be at least 1 character long.",
    closePopup: "Close",
    commentUpdatedSuccess: "Comment updated successfully!",
    commentDeletedSuccess: "Comment deleted successfully!",
    failedToUpdateComment: "Failed to update comment.",
    failedToDeleteComment: "Failed to delete comment."
  },
  pl: {
    itemDetails: "Szczegóły przedmiotu",
    loading: "Ładowanie...",
    itemNotFound: "Nie znaleziono przedmiotu.",
    failedToLoadItem: "Nie udało się załadować szczegółów przedmiotu.",
    itemIdRequired: "ID przedmiotu jest wymagane.",
    itemIdMustBeNumber: "ID przedmiotu musi być liczbą.",
    itemIdMustBePositive: "ID przedmiotu musi być liczbą dodatnią.",
    backToCategory: "Powrót do kategorii",
    itemName: "Nazwa przedmiotu",
    itemId: "ID przedmiotu",
    category: "Kategoria",
    characteristics: "Cechy",
    noCharacteristics: "Brak dostępnych cech dla tego przedmiotu.",
    noValue: "Brak wartości",
    image: "Zdjęcie",
    edit: "Edytuj",
    save: "Zapisz",
    cancel: "Anuluj",
    editMode: "Tryb edycji",
    changeImage: "Zmień zdjęcie",
    updating: "Aktualizowanie...",
    updateSuccess: "Przedmiot został pomyślnie zaktualizowany!",
    updateFailed: "Nie udało się zaktualizować przedmiotu.",
    fileTooLarge: "Plik obrazu jest za duży. Wybierz plik mniejszy niż 5MB.",
    invalidFileType: "Wybierz prawidłowy plik obrazu (JPEG, PNG, GIF lub WebP).",
    failedToReadFile: "Nie udało się odczytać pliku obrazu.",
    delete: "Usuń",
    deleteConfirm: "Czy na pewno chcesz usunąć ten przedmiot? Ta akcja nie może być cofnięta.",
    deleting: "Usuwanie...",
    deleteSuccess: "Przedmiot został pomyślnie usunięty!",
    deleteFailed: "Nie udało się usunąć przedmiotu.",
    comments: "Komentarze",
    noComments: "Brak komentarzy.",
    loadingComments: "Ładowanie komentarzy...",
    failedToLoadComments: "Nie udało się załadować komentarzy.",
    commentDate: "dnia",
    commentsCount: "komentarzy",
    addComment: "Dodaj komentarz",
    commentText: "Tekst komentarza",
    commentTextPlaceholder: "Wprowadź swój komentarz...",
    submit: "Wyślij",
    submittingComment: "Wysyłanie...",
    commentAddedSuccess: "Komentarz dodany pomyślnie!",
    failedToAddComment: "Nie udało się dodać komentarza.",
    failedToGetUser: "Nie udało się pobrać informacji o użytkowniku.",
    commentTooShort: "Komentarz musi mieć co najmniej 1 znak.",
    closePopup: "Zamknij",
    commentUpdatedSuccess: "Komentarz zaktualizowany pomyślnie!",
    commentDeletedSuccess: "Komentarz usunięty pomyślnie!",
    failedToUpdateComment: "Nie udało się zaktualizować komentarza.",
    failedToDeleteComment: "Nie udało się usunąć komentarza."
  },
};

interface ItemDetails {
  iditem: number;
  nameItem: string;
  photoItem: string;
  categoryId: number;
  categoryName: string;
  chracteristics: {
    idchracteristic: number;
    nameCharacteristic: string;
    value: string;
  }[];
}

interface CategoryDetails {
  idcategory: number;
  nameCategory: string;
  characteristics: {
    idcharacteristic: number;
    nameCharacteristic: string;
  }[];
}

interface Comment {
  iDcomment: number;
  iDitem: number;
  iDcommentator: string;
  text: string;
  createdDate: string;
  username: string;
  avatarBase64: string;
}

interface User {
  id: string;
  name: string;
  avatarBase64: string;
}

const ItemDetailsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [popup, setPopup] = useState<{ message: string; success: boolean } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Comment popup state
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  
  // Edit comment state
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [updatingComment, setUpdatingComment] = useState(false);
  
  // Edit form state
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editCharacteristics, setEditCharacteristics] = useState<{
    idchracteristic: number;
    nameCharacteristic: string;
    value: string;
  }[]>([]);

  useEffect(() => {
    setError(null);
    setLoading(true);
    
    if (!id) {
      setError(t.itemIdRequired);
      setLoading(false);
    } else if (isNaN(Number(id))) {
      setError(t.itemIdMustBeNumber);
      setLoading(false);
    } else if (Number(id) <= 0) {
      setError(t.itemIdMustBePositive);
      setLoading(false);
    } else {
      // Fetch current user info
      fetchCurrentUser();
      
      axios
        .get(`${API_URL}/Item/${id}`, { withCredentials: true })
        .then((response) => {
          if (response.data) {
            setItem(response.data);
            // Fetch category details after item is loaded
            if (response.data.categoryId) {
              fetchCategoryDetails(response.data.categoryId);
            }
            // Fetch comments after item is loaded
            fetchComments();
          } else {
            setError(t.itemNotFound);
          }
          setLoading(false);
        })
        .catch(() => {
          setError(t.failedToLoadItem);
          setLoading(false);
        });
    }
  }, [id, t]);

  // Fetch current user information
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/Account/me`, { withCredentials: true });
      setCurrentUser(response.data);
    } catch (error) {
      console.warn('Failed to fetch current user:', error);
    }
  };

  // Fetch category details
  const fetchCategoryDetails = async (categoryId: number) => {
    try {
      const response = await axios.get(`${API_URL}/Categories/${categoryId}`, { withCredentials: true });
      if (response.data && response.data.length > 0) {
        setCategory(response.data[0]);
      }
    } catch (error) {
      console.warn('Failed to fetch category details:', error);
    }
  };

  // Fetch comments for the item
  const fetchComments = async () => {
    if (!id) return;
    
    setCommentsLoading(true);
    setCommentsError(null);
    
    try {
      const response = await axios.get(`${API_URL}/Comment/item/${id}`, { 
        withCredentials: true 
      });
      setComments(response.data || []);
    } catch (err: any) {
      setCommentsError(t.failedToLoadComments);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Convert file to base64 string (without data URL prefix)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get merged characteristics (category characteristics with item values)
  const getMergedCharacteristics = () => {
    if (!category?.characteristics) {
      return item?.chracteristics || [];
    }

    return category.characteristics.map(categoryChar => {
      const itemChar = item?.chracteristics?.find(
        ic => ic.idchracteristic === categoryChar.idcharacteristic
      );
      
      return {
        idchracteristic: categoryChar.idcharacteristic,
        nameCharacteristic: categoryChar.nameCharacteristic,
        value: itemChar?.value || ''
      };
    });
  };

  // Handle opening comment popup
  const handleAddCommentClick = () => {
    setShowCommentPopup(true);
    setCommentText('');
    setCommentError(null);
  };

  // Handle closing comment popup
  const handleCloseCommentPopup = () => {
    setShowCommentPopup(false);
    setCommentText('');
    setCommentError(null);
  };

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!item) return;

    // Validate comment text
    if (!commentText.trim()) {
      setCommentError(t.commentTooShort);
      return;
    }

    setSubmittingComment(true);
    setCommentError(null);

    try {
      // First, get user information
      const userResponse = await axios.get(`${API_URL}/Account/me`, { withCredentials: true });
      const user: User = userResponse.data;

      // Then submit the comment
      const commentData = {
        iDitem: item.iditem,
        text: commentText.trim(),
        iDcommentator: user.id
      };

      await axios.post(`${API_URL}/Comment`, commentData, { withCredentials: true });

      // Close popup and refresh comments
      setShowCommentPopup(false);
      setCommentText('');
      setPopup({ message: t.commentAddedSuccess, success: true });
      
      // Refresh comments
      fetchComments();

    } catch (error: any) {
      console.error('Error adding comment:', error);
      if (error.response?.status === 401) {
        setCommentError(t.failedToGetUser);
      } else {
        setCommentError(t.failedToAddComment);
      }
    } finally {
      setSubmittingComment(false);
      setTimeout(() => setPopup(null), 2500);
    }
  };

  // Handle edit comment click
  const handleEditCommentClick = (comment: Comment) => {
    setEditingCommentId(comment.iDcomment);
    setEditCommentText(comment.text);
    setCommentError(null);
  };

  // Handle cancel edit comment
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
    setCommentError(null);
  };

  // Handle save edited comment
  const handleSaveEditComment = async (comment: Comment) => {
    if (!editCommentText.trim()) {
      setCommentError(t.commentTooShort);
      return;
    }

    setUpdatingComment(true);
    setCommentError(null);

    try {
      const updatedComment = {
        ...comment,
        text: editCommentText.trim()
      };

      await axios.put(`${API_URL}/Comment/${comment.iDcomment}`, updatedComment, { 
        withCredentials: true 
      });

      // Update the comment in the local state
      setComments(prevComments =>
        prevComments.map(c =>
          c.iDcomment === comment.iDcomment
            ? { ...c, text: editCommentText.trim() }
            : c
        )
      );

      setEditingCommentId(null);
      setEditCommentText('');
      setPopup({ message: t.commentUpdatedSuccess, success: true });

    } catch (error: any) {
      console.error('Error updating comment:', error);
      setCommentError(t.failedToUpdateComment);
    } finally {
      setUpdatingComment(false);
      setTimeout(() => setPopup(null), 2500);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm(lang === 'pl' ? 'Czy na pewno chcesz usunąć ten komentarz?' : 'Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/Comment/${commentId}`, { 
        withCredentials: true 
      });

      // Remove the comment from the local state
      setComments(prevComments =>
        prevComments.filter(c => c.iDcomment !== commentId)
      );

      setPopup({ message: t.commentDeletedSuccess, success: true });

    } catch (error: any) {
      console.error('Error deleting comment:', error);
      setCommentError(t.failedToDeleteComment);
    } finally {
      setTimeout(() => setPopup(null), 2500);
    }
  };

  const handleEditClick = () => {
    if (item) {
      setEditName(item.nameItem);
      setEditCharacteristics(getMergedCharacteristics());
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFile(null);
    setError(null);
    setPopup(null);
  };

  const handleSaveEdit = async () => {
    if (!item) return;

    setUpdating(true);
    setError(null);

    try {
      let photoItem = item.photoItem; // Keep existing image by default

      if (editFile) {
        // Validate file size (limit to 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (editFile.size > maxSize) {
          setError(t.fileTooLarge);
          setUpdating(false);
          return;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(editFile.type)) {
          setError(t.invalidFileType);
          setUpdating(false);
          return;
        }
        
        try {
          photoItem = await fileToBase64(editFile);
        } catch {
          setError(t.failedToReadFile);
          setUpdating(false);
          return;
        }
      }

      // Prepare update data
      const updateData = {
        nameItem: editName,
        iditem: item.iditem,
        photoItem,
        categoryId: item.categoryId,
        chracteristics: editCharacteristics.map(c => ({
          idchracteristic: c.idchracteristic,
          value: c.value
        }))
      };

      // Send update request
      await axios.put(`${API_URL}/Item/${id}`, updateData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Update local state
      const updatedItem = {
        ...item,
        nameItem: editName,
        photoItem,
        chracteristics: editCharacteristics
      };
      setItem(updatedItem);
      setIsEditing(false);
      setEditFile(null);
      
      // Show success message temporarily
      setPopup({ message: t.updateSuccess, success: true });
      setTimeout(() => {
        setPopup(null);
      }, 2500);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || t.updateFailed);
    }

    setUpdating(false);
  };

  const handleCharacteristicChange = (index: number, value: string) => {
    setEditCharacteristics(prev => 
      prev.map((char, i) => i === index ? { ...char, value } : char)
    );
  };

  const handleDeleteItem = async () => {
    if (!item) return;

    const confirmDelete = window.confirm(t.deleteConfirm);
    if (!confirmDelete) return;

    setDeleting(true);
    setError(null);

    try {
      await axios.delete(`${API_URL}/Item/${id}`, {
        withCredentials: true
      });

      // Show success message
      setPopup({ message: t.deleteSuccess, success: true });
      
      // Navigate back to category after a short delay
      setTimeout(() => {
        if (item.categoryId) {
          navigate(`/categories/${item.categoryId}`);
        } else {
          navigate('/items');
        }
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || t.deleteFailed);
      setDeleting(false);
    }
  };

  const handleBackToCategory = () => {
    if (item?.categoryId) {
      navigate(`/categories/${item.categoryId}`);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="home-container" style={{ maxWidth: 800 }}>
      {loading ? (
        <div style={{ color: '#007bff', fontWeight: 'bold', margin: '2rem 0', textAlign: 'center' }}>
          {t.loading}
        </div>
      ) : error ? (
        <div
          style={{
            color: "red",
            fontWeight: "bold",
            margin: "2rem 0",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : !item ? (
        <div
          style={{
            color: "red",
            fontWeight: "bold",
            margin: "2rem 0",
            textAlign: "center",
          }}
        >
          {t.itemNotFound}
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}>
            <h1 style={{ color: "#007bff", margin: 0 }}>
              {isEditing ? t.editMode : t.itemDetails}
            </h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              {isEditing ? (
                <>
                  <button 
                    className="button" 
                    onClick={handleSaveEdit}
                    disabled={updating || deleting}
                    style={{ backgroundColor: '#28a745' }}
                  >
                    {updating ? t.updating : t.save}
                  </button>
                  <button 
                    className="button" 
                    onClick={handleCancelEdit}
                    disabled={updating || deleting}
                    style={{ backgroundColor: '#6c757d' }}
                  >
                    {t.cancel}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="button" 
                    onClick={handleEditClick}
                    disabled={deleting}
                    style={{ backgroundColor: '#ffc107', color: '#212529' }}
                  >
                    {t.edit}
                  </button>
                  <button 
                    className="button" 
                    onClick={handleDeleteItem}
                    disabled={deleting}
                    style={{ backgroundColor: '#dc3545' }}
                  >
                    {deleting ? t.deleting : t.delete}
                  </button>
                  <button 
                    className="button" 
                    onClick={handleBackToCategory}
                    disabled={deleting}
                    style={{ backgroundColor: '#6c757d' }}
                  >
                    {t.backToCategory}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Item Details Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* Item Image */}
            {(item.photoItem && item.photoItem.trim() !== '') || isEditing ? (
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h3 style={{ color: '#495057', marginBottom: '12px' }}>{t.image}</h3>
                {item.photoItem && item.photoItem.trim() !== '' && (
                  <img 
                    src={`data:image/jpeg;base64,${item.photoItem}`}
                    alt={item.nameItem}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      marginBottom: isEditing ? '12px' : '0'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                {isEditing && (
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const selectedFile = e.target.files ? e.target.files[0] : null;
                        if (selectedFile) {
                          // Validate file size immediately
                          const maxSize = 5 * 1024 * 1024; // 5MB
                          if (selectedFile.size > maxSize) {
                            setError(t.fileTooLarge);
                            e.target.value = ''; // Clear the input
                            return;
                          }
                          setError(null); // Clear any previous errors
                        }
                        setEditFile(selectedFile);
                      }}
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '8px 12px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        backgroundColor: 'white'
                      }}
                    />
                    <small style={{ color: '#6c757d', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>
                      {t.changeImage} - Max: 5MB, JPEG/PNG/GIF/WebP
                    </small>
                  </div>
                )}
              </div>
            ): (null)}

            {/* Basic Information */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#495057', fontSize: '1.1rem' }}>
                  {t.itemName}:
                </strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      marginLeft: '8px',
                      fontSize: '1.1rem',
                      padding: '4px 8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      minWidth: '200px'
                    }}
                    required
                  />
                ) : (
                  <span style={{ marginLeft: '8px', fontSize: '1.1rem', color: '#212529' }}>
                    {item.nameItem}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#495057' }}>
                  {t.itemId}:
                </strong>
                <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                  {item.iditem}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#495057' }}>
                  {t.category}:
                </strong>
                <span 
                  style={{ 
                    marginLeft: '8px', 
                    color: '#007bff',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => navigate(`/categories/${item.categoryId}`)}
                >
                  {item.categoryName}
                </span>
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <h3 style={{ color: '#495057', marginBottom: '16px' }}>
                {t.characteristics}
              </h3>
              {(() => {
                const characteristics = isEditing ? editCharacteristics : getMergedCharacteristics();
                return characteristics && characteristics.length > 0 ? (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    {characteristics.map((char, index) => (
                      <div 
                        key={char.idchracteristic}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: index < characteristics.length - 1 ? '1px solid #dee2e6' : 'none'
                        }}
                      >
                        <span style={{ fontWeight: '500', color: '#495057' }}>
                          {char.nameCharacteristic}:
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={char.value || ''}
                            onChange={(e) => handleCharacteristicChange(index, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              border: '1px solid #ced4da',
                              borderRadius: '4px',
                              fontSize: '0.9rem',
                              backgroundColor: 'white',
                              minWidth: '150px',
                              textAlign: 'right'
                            }}
                            placeholder={t.noValue}
                          />
                        ) : (
                          <span style={{ color: '#6c757d', textAlign: 'right' }}>
                            {char.value || t.noValue}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    color: '#6c757d', 
                    fontStyle: 'italic',
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    {t.noCharacteristics}
                  </div>
                );
              })()}
            </div>

            {/* Comments Section */}
            <div style={{ marginTop: '32px', borderTop: '1px solid #dee2e6', paddingTop: '24px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px' 
              }}>
                <h3 style={{ color: '#495057', margin: 0 }}>
                  {t.comments}
                </h3>
                <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                  {comments.length} {t.commentsCount}
                </span>
              </div>

              {/* Add Comment Button */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={handleAddCommentClick}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#007bff';
                  }}
                >
                  {t.addComment}
                </button>
              </div>

              {commentsLoading ? (
                <div style={{ 
                  color: '#007bff', 
                  textAlign: 'center', 
                  padding: '20px',
                  fontStyle: 'italic'
                }}>
                  {t.loadingComments}
                </div>
              ) : commentsError ? (
                <div style={{ 
                  color: '#dc3545', 
                  textAlign: 'center', 
                  padding: '20px',
                  fontStyle: 'italic'
                }}>
                  {commentsError}
                </div>
              ) : comments.length === 0 ? (
                <div style={{ 
                  color: '#6c757d', 
                  textAlign: 'center', 
                  padding: '20px',
                  fontStyle: 'italic',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  {t.noComments}
                </div>
              ) : (
                <div>
                  {comments.map((comment) => (
                    <div 
                      key={comment.iDcomment}
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '12px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {comment.avatarBase64 && comment.avatarBase64.trim() !== '' ? (
                            <img
                              src={`data:image/jpeg;base64,${comment.avatarBase64}`}
                              alt={comment.username}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                marginRight: '12px',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/standart-user.png';
                              }}
                            />
                          ) : (
                            <img
                              src="/standart-user.png"
                              alt={comment.username}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                marginRight: '12px',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                          <div>
                            <div style={{ 
                              fontWeight: '500', 
                              color: '#495057',
                              fontSize: '0.95rem' 
                            }}>
                              {comment.username}
                            </div>
                            <div style={{ 
                              color: '#6c757d', 
                              fontSize: '0.85rem' 
                            }}>
                              {formatDate(comment.createdDate)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Edit and Delete buttons - only show for current user's comments */}
                        {currentUser && comment.iDcommentator === currentUser.id && editingCommentId !== comment.iDcomment && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleEditCommentClick(comment)}
                              style={{
                                backgroundColor: '#ffc107',
                                color: '#212529',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              {lang === 'pl' ? 'Edytuj' : 'Edit'}
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.iDcomment)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              {lang === 'pl' ? 'Usuń' : 'Delete'}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Comment text or edit input */}
                      {editingCommentId === comment.iDcomment ? (
                        <div>
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #ced4da',
                              borderRadius: '4px',
                              fontSize: '0.95rem',
                              resize: 'vertical',
                              minHeight: '80px',
                              fontFamily: 'inherit',
                              marginBottom: '8px'
                            }}
                          />
                          
                          {commentError && (
                            <div style={{
                              color: '#dc3545',
                              fontSize: '12px',
                              marginBottom: '8px'
                            }}>
                              {commentError}
                            </div>
                          )}
                          
                          <div style={{
                            display: 'flex',
                            gap: '8px'
                          }}>
                            <button
                              onClick={() => handleSaveEditComment(comment)}
                              disabled={updatingComment || !editCommentText.trim()}
                              style={{
                                backgroundColor: updatingComment || !editCommentText.trim() ? '#6c757d' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 12px',
                                fontSize: '12px',
                                cursor: updatingComment || !editCommentText.trim() ? 'not-allowed' : 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              {updatingComment ? (lang === 'pl' ? 'Zapisywanie...' : 'Saving...') : (lang === 'pl' ? 'Zapisz' : 'Save')}
                            </button>
                            <button
                              onClick={handleCancelEditComment}
                              disabled={updatingComment}
                              style={{
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 12px',
                                fontSize: '12px',
                                cursor: updatingComment ? 'not-allowed' : 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              {lang === 'pl' ? 'Anuluj' : 'Cancel'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          color: '#212529',
                          lineHeight: '1.5',
                          fontSize: '0.95rem'
                        }}>
                          {comment.text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Comment Popup Modal */}
      {showCommentPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #dee2e6',
              paddingBottom: '12px'
            }}>
              <h3 style={{ margin: 0, color: '#495057' }}>{t.addComment}</h3>
              <button
                onClick={handleCloseCommentPopup}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6c757d',
                  padding: '0',
                  lineHeight: '1'
                }}
              >
                ×
              </button>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057'
              }}>
                {t.commentText}
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t.commentTextPlaceholder}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical',
                  minHeight: '100px',
                  fontFamily: 'inherit'
                }}
              />
              
              {commentError && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {commentError}
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '20px',
              paddingTop: '12px',
              borderTop: '1px solid #dee2e6'
            }}>
              <button
                onClick={handleCloseCommentPopup}
                disabled={submittingComment}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: submittingComment ? 'not-allowed' : 'pointer',
                  opacity: submittingComment ? 0.6 : 1
                }}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={submittingComment || !commentText.trim()}
                style={{
                  backgroundColor: submittingComment || !commentText.trim() ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: submittingComment || !commentText.trim() ? 'not-allowed' : 'pointer',
                  opacity: submittingComment || !commentText.trim() ? 0.6 : 1
                }}
              >
                {submittingComment ? t.submittingComment : t.submit}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success/Error Popup */}
      {popup && (
        <div
          style={{
            position: 'fixed',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            background: popup.success ? '#28a745' : '#dc3545',
            color: '#fff',
            padding: '12px 32px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default ItemDetailsPage;
