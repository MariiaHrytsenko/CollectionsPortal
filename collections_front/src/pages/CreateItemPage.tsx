import React, { useState, useEffect } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppConfig from "../AppConfig.json";

const translations = {
  en: {
    create: "Create New Item",
    namePlaceholder: "Item name",
    save: "Save",
    cancel: "Cancel",
    backToCategoryButton: "Back to",
    success: "Item created successfully!",
    nameLabel: "Item Name",
    imageLabel: "Item Image",
    characteristicsLabel: "Characteristics",
    loading: "Loading...",
    categoryNotFound: "Category not found or no characteristics available.",
    successPopupTitle: "Success!",
    successPopupMessage: "Your item has been created successfully.",
    backToCategory: "Back to Category",
    close: "Close",
  },
  pl: {
    create: "Utwórz nowy przedmiot",
    namePlaceholder: "Nazwa przedmiotu",
    save: "Zapisz",
    cancel: "Anuluj",
    backToCategoryButton: "Powrót do",
    success: "Przedmiot został utworzony!",
    nameLabel: "Nazwa przedmiotu",
    imageLabel: "Zdjęcie przedmiotu",
    characteristicsLabel: "Cechy",
    loading: "Ładowanie...",
    categoryNotFound: "Kategoria nie została znaleziona lub nie ma dostępnych cech.",
    successPopupTitle: "Sukces!",
    successPopupMessage: "Twój przedmiot został pomyślnie utworzony.",
    backToCategory: "Powrót do kategorii",
    close: "Zamknij",
  },
};

interface Category {
  idcategory: number;
  nameCategory: string;
  characteristics: {
    idcharacteristic: number;
    nameCharacteristic: string;
  }[];
}

const CreateItemPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [characteristics, setCharacteristics] = useState<{ idchracteristic: number, nameCharacteristic: string, value: string }[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch category data on component mount
  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      setError(null);
      axios
        .get(`${AppConfig.API_URL}/Categories/${categoryId}`, { withCredentials: true })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const categoryData = response.data[0];
            setCategory(categoryData);
            // Initialize characteristics with empty values
            const initCharacteristics = categoryData.characteristics.map((char: any) => ({
              idchracteristic: char.idcharacteristic,
              nameCharacteristic: char.nameCharacteristic,
              value: ""
            }));
            setCharacteristics(initCharacteristics);
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load category data");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [categoryId]);

  // For demo: allow adding characteristics
  const handleCharChange = (idx: number, value: string) => {
    setCharacteristics(cs => cs.map((c, i) => i === idx ? { ...c, value } : c));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let photoItem = "";
    
    if (file) {
      // Validate file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError("Image file is too large. Please choose a file smaller than 5MB.");
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP).");
        return;
      }
      
      try {
        photoItem = await fileToBase64(file);
        console.log("Image file converted to base64, length:", photoItem.length);
      } catch {
        setError("Failed to read image file");
        return;
      }
    }
    
    try {
      await axios.post(`${AppConfig.API_URL}/Item`, {
        nameItem: name,
        photoItem,
        categoryId: Number(categoryId),
        chracteristics: characteristics.filter(c => c.value.trim() !== "").map(c => ({
          idchracteristic: c.idchracteristic,
          value: c.value
        }))
      }, {
        withCredentials: true, // This enables cookie authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSuccess(true);
      setName("");
      setFile(null);
      setCharacteristics(prev => prev.map(c => ({ ...c, value: "" })));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create item");
    }
  };

  const handleSuccessRedirect = () => {
    navigate(`/categories/${categoryId}`);
  };

  const handleClosePopup = () => {
    setSuccess(false);
  };

  return (
    <div className="home-container" style={{ maxWidth: 480 }}>
      <h2 style={{ color: '#007bff', marginBottom: 24 }}>{t.create}</h2>
      {loading ? (
        <div style={{ color: '#007bff', fontWeight: 'bold', margin: '2rem 0', textAlign: 'center' }}>
          {t.loading}
        </div>
      ) : error ? (
        <div style={{ color: '#e44', marginTop: 16 }}>{error}</div>
      ) : !category ? (
        <div style={{ color: '#e44', marginTop: 16 }}>{t.categoryNotFound}</div>
      ) : (
        <>
          {/* Category Info */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h3 style={{ color: '#007bff', marginBottom: '8px' }}>
              {category.nameCategory}
            </h3>
            <small style={{ color: '#6c757d' }}>
              {lang === 'pl' ? 'Kategoria ID:' : 'Category ID:'} {category.idcategory}
            </small>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', color: '#495057' }}>
                {t.nameLabel}
              </label>
              <input
                type="text"
                placeholder={t.namePlaceholder}
                className="input-field"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', color: '#495057' }}>
                {t.imageLabel}
              </label>
              <input
                type="file"
                className="input-field"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={e => {
                  const selectedFile = e.target.files ? e.target.files[0] : null;
                  if (selectedFile) {
                    // Validate file size immediately
                    const maxSize = 5 * 1024 * 1024; // 5MB
                    if (selectedFile.size > maxSize) {
                      setError("Image file is too large. Please choose a file smaller than 5MB.");
                      e.target.value = ''; // Clear the input
                      return;
                    }
                    setError(null); // Clear any previous errors
                  }
                  setFile(selectedFile);
                }}
              />
              <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
              </small>
            </div>
            
            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#495057' }}>
                {t.characteristicsLabel}
              </label>
              {characteristics.map((c, idx) => (
                <div key={c.idchracteristic} style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 400, marginBottom: '4px', color: '#6c757d' }}>
                    {c.nameCharacteristic}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={`Enter ${c.nameCharacteristic}`}
                    value={c.value}
                    onChange={e => handleCharChange(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="button" style={{ flex: 1 }}>{t.save}</button>
              <button 
                type="button" 
                className="button" 
                style={{ flex: 1, background: '#6c757d' }} 
                onClick={() => navigate(`/categories/${categoryId}`)}
              >
                {t.backToCategoryButton} {category.nameCategory}
              </button>
            </div>
          </form>
        </>
      )}
      
      {/* Success Popup */}
      {success && (
        <div 
          style={{
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
          }}
          onClick={handleClosePopup} // Click outside to close
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close button */}
            <button
              onClick={handleClosePopup}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                color: '#6c757d',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => (e.target as HTMLButtonElement).style.backgroundColor = '#f8f9fa'}
              onMouseLeave={e => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
            >
              ×
            </button>
            
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#28a745',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px',
              color: 'white'
            }}>
              ✓
            </div>
            <h3 style={{
              color: '#28a745',
              marginBottom: '12px',
              fontSize: '1.5rem'
            }}>
              {t.successPopupTitle}
            </h3>
            <p style={{
              color: '#6c757d',
              marginBottom: '24px',
              fontSize: '1rem'
            }}>
              {t.successPopupMessage}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="button"
                onClick={handleSuccessRedirect}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {t.backToCategory}
              </button>
              <button
                className="button"
                onClick={handleClosePopup}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateItemPage;