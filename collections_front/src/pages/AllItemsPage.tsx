import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import axios from "axios";
import config from "../AppConfig.json";

const API_URL = config.API_URL;

const translations = {
  en: {
    allItems: "All Items",
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
    failedToLoadItems: "Failed to load items.",
    noItemsFound: "No items found matching your search.",
    totalItems: "Total Items:",
    exportPdf: "Export to PDF",
    exportingPdf: "Generating PDF..."
  },
  pl: {
    allItems: "Wszystkie przedmioty",
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
    failedToLoadItems: "Nie udało się załadować przedmiotów.",
    noItemsFound: "Nie znaleziono przedmiotów spełniających kryteria wyszukiwania.",
    totalItems: "Łączna liczba przedmiotów:",
    exportPdf: "Eksportuj do PDF",
    exportingPdf: "Generowanie PDF..."
  },
};

interface Item {
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

const AllItemsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [exportingPdf, setExportingPdf] = useState(false);

  // PDF Export function
  const exportToPdf = async () => {
    setExportingPdf(true);
    
    try {
      // Dynamic import of jsPDF
      const { default: jsPDF } = await import('jspdf');

      // Fetch user information
      let userInfo = null;
      try {
        const userResponse = await axios.get(`${API_URL}/Account/me`, { withCredentials: true });
        userInfo = userResponse.data;
      } catch (error) {
        console.warn('Failed to fetch user info for PDF:', error);
      }
      
      // Sort items by category for export
      const itemsForExport = [...items].sort((a, b) => {
        // Sort by category ID first (ascending order)
        if (a.categoryId !== b.categoryId) {
          return a.categoryId - b.categoryId;
        }
        // If same category, sort by name
        return a.nameItem.toLowerCase().localeCompare(b.nameItem.toLowerCase());
      });

      // Group items by category
      const itemsByCategory = itemsForExport.reduce((acc, item) => {
        const categoryKey = item.categoryName || `Category ID: ${item.categoryId}` || 'Unknown Category';
        if (!acc[categoryKey]) {
          acc[categoryKey] = [];
        }
        acc[categoryKey].push(item);
        return acc;
      }, {} as Record<string, Item[]>);

      // Sort categories by ID (extract ID from category key for proper ordering)
      const sortedCategoryEntries = Object.entries(itemsByCategory).sort(([keyA], [keyB]) => {
        const getIdFromKey = (key: string) => {
          if (key.startsWith('Category ID: ')) {
            return parseInt(key.replace('Category ID: ', ''), 10);
          }
          // For named categories, find the category ID from the first item
          const items = itemsByCategory[key];
          return items.length > 0 ? items[0].categoryId : 999999;
        };
        
        const idA = getIdFromKey(keyA);
        const idB = getIdFromKey(keyB);
        return idA - idB;
      });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(t.allItems, margin, yPosition);
      yPosition += 15;

      // User Information Section
      if (userInfo) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(lang === 'pl' ? 'Informacje o użytkowniku:' : 'User Information:', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Username
        if (userInfo.userName) {
          doc.text(`${lang === 'pl' ? 'Nazwa użytkownika' : 'Username'}: ${userInfo.userName}`, margin + 5, yPosition);
          yPosition += 6;
        }
        
        // Email
        if (userInfo.email) {
          doc.text(`Email: ${userInfo.email}`, margin + 5, yPosition);
          yPosition += 6;
        }
        
        // Phone (if available)
        if (userInfo.phoneNumber) {
          doc.text(`${lang === 'pl' ? 'Telefon' : 'Phone'}: ${userInfo.phoneNumber}`, margin + 5, yPosition);
          yPosition += 6;
        }
        
        // User ID
        if (userInfo.id) {
          doc.text(`${lang === 'pl' ? 'ID użytkownika' : 'User ID'}: ${userInfo.id}`, margin + 5, yPosition);
          yPosition += 6;
        }

        yPosition += 8; // Extra spacing after user info
      }

      // Export date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const exportDate = new Date().toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-US');
      doc.text(`${lang === 'pl' ? 'Data eksportu' : 'Export Date'}: ${exportDate}`, margin, yPosition);
      yPosition += 10;

      // Total items
      doc.text(`${t.totalItems} ${items.length}`, margin, yPosition);
      yPosition += 8;
      
      // Note about images
      doc.setFontSize(8);
      doc.text(`${lang === 'pl' ? 'Uwaga: Zawiera obrazy przedmiotów, jeśli są dostępne' : 'Note: Includes item images when available'}`, margin, yPosition);
      yPosition += 12;
      

      // Process each category in sorted order
      sortedCategoryEntries.forEach(([categoryName, categoryItems]) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        // Category header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`${categoryName} (${categoryItems.length} ${lang === 'pl' ? 'przedmiotów' : 'items'})`, margin, yPosition);
        yPosition += 12;

        // Category items
        categoryItems.forEach((item, index) => {
          // Check if we need a new page (more space needed for images)
          if (yPosition > pageHeight - 80) {
            doc.addPage();
            yPosition = margin;
          }

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          
          // Item name and ID
          const itemTitle = `${index + 1}. ${item.nameItem} (ID: ${item.iditem})`;
          doc.text(itemTitle, margin + 10, yPosition);
          yPosition += 8;

          // Add image if available
          if (item.photoItem && item.photoItem.trim() !== '') {
            try {
              const imageData = `data:image/jpeg;base64,${item.photoItem}`;
              const imageWidth = 40;
              const imageHeight = 30;
              
              // Check if we need a new page for the image
              if (yPosition + imageHeight > pageHeight - 20) {
                doc.addPage();
                yPosition = margin;
              }
              
              doc.addImage(imageData, 'JPEG', margin + 15, yPosition, imageWidth, imageHeight);
              yPosition += imageHeight + 6;
            } catch (error) {
              console.warn('Failed to add image for item:', item.nameItem, error);
              // Continue without the image if there's an error
            }
          }

          // Characteristics
          if (item.chracteristics && item.chracteristics.length > 0) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            item.chracteristics.forEach(char => {
              if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = margin;
              }
              
              const charText = `   • ${char.nameCharacteristic}: ${char.value || t.noValue}`;
              doc.text(charText, margin + 15, yPosition);
              yPosition += 6;
            });
          }
          
          yPosition += 8; // More space between items due to images
        });

        yPosition += 8; // Space between categories
      });

      // Save the PDF
      const filename = `${t.allItems.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(lang === 'pl' ? 'Błąd podczas generowania PDF' : 'Error generating PDF');
    } finally {
      setExportingPdf(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios
      .get(`${API_URL}/Item`, { withCredentials: true })
      .then((response) => {
        setItems(response.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError(t.failedToLoadItems);
        setLoading(false);
      });
  }, [t]);

  // Filter and sort items
  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = items;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = items.filter(item =>
        item.nameItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.chracteristics?.some(char => 
          char.nameCharacteristic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          char.value?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort items
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortBy === "name") {
        aValue = a.nameItem.toLowerCase();
        bValue = b.nameItem.toLowerCase();
      } else if (sortBy === "id") {
        aValue = a.iditem;
        bValue = b.iditem;
      } else if (sortBy === "category") {
        aValue = a.categoryName?.toLowerCase() || "";
        bValue = b.categoryName?.toLowerCase() || "";
      } else {
        // Sort by characteristic
        const aChar = a.chracteristics?.find(c => c.nameCharacteristic === sortBy);
        const bChar = b.chracteristics?.find(c => c.nameCharacteristic === sortBy);
        aValue = aChar?.value?.toLowerCase() || "";
        bValue = bChar?.value?.toLowerCase() || "";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [items, searchTerm, sortBy, sortOrder]);

  // Get available sort options
  const getSortOptions = () => {
    const options = [
      { value: "name", label: t.name },
      { value: "id", label: t.id },
      { value: "category", label: t.category }
    ];

    // Get unique characteristics from all items
    const allCharacteristics = new Set<string>();
    items.forEach(item => {
      item.chracteristics?.forEach(char => {
        allCharacteristics.add(char.nameCharacteristic);
      });
    });

    allCharacteristics.forEach(charName => {
      options.push({
        value: charName,
        label: charName
      });
    });

    return options;
  };

  return (
    <div className="home-container">
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
      ) : (
        <>
          {/* Header Section */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h1 style={{ color: '#007bff', marginBottom: '12px', fontSize: '1.8rem' }}>
              {t.allItems}
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

          {/* Items Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}>
            <h2 style={{ color: "#007bff" }}>{t.allItems}</h2>
            <button
              onClick={exportToPdf}
              disabled={exportingPdf || items.length === 0}
              style={{
                backgroundColor: exportingPdf ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: exportingPdf || items.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
            >
              {exportingPdf ? (
                <>
                  <span>⏳</span>
                  {t.exportingPdf}
                </>
              ) : (
                <>
                  <span>📄</span>
                  {t.exportPdf}
                </>
              )}
            </button>
          </div>

          {/* Items Grid */}
          <div className="pinterest-grid">
            {filteredAndSortedItems.length === 0 ? (
              <div style={{ color: "#888", fontSize: "1rem" }}>
                {items.length === 0 ? t.noItems : t.noItemsFound}
              </div>
            ) : (
              filteredAndSortedItems.map((item) => (
                <div 
                  className="item-card" 
                  key={item.iditem}
                  onClick={() => navigate(`/items/${item.iditem}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={item.photoItem && item.photoItem.trim() !== '' 
                      ? `data:image/jpeg;base64,${item.photoItem}` 
                      : '/default-item.jpeg'
                    } 
                    alt={item.nameItem}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-item.jpeg';
                    }}
                  />
                  <div className="item-card-header">
                    <h3 className="item-title">{item.nameItem}</h3>
                    <h4 className="item-id">
                      <b>ID:</b> {item.iditem}
                    </h4>
                  </div>
                  <div className="item-card-content">
                    {/* Category Info */}
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ 
                        color: '#495057', 
                        fontSize: '0.9rem'
                      }}>
                        {t.category}:
                      </strong>
                      <span style={{ 
                        marginLeft: '6px',
                        color: '#007bff',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/categories/${item.categoryId}`);
                      }}>
                        {item.categoryId || t.noValue}
                      </span>
                    </div>

                    {/* Characteristics */}
                    {item.chracteristics && item.chracteristics.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <strong style={{ 
                          color: '#495057', 
                          fontSize: '0.9rem',
                          display: 'block',
                          marginBottom: '8px'
                        }}>
                          {t.characteristics}
                        </strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {item.chracteristics.map((char) => (
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
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AllItemsPage;