import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import axios from "axios";
import config from "../AppConfig.json";
const API_URL = config.API_URL;

const translations = {
  en: {
    itemsInCategory: "Items in ",
    createNewItem: "+ Create New Item",
    noItems: "No items found in this category.",
    search: "Search items...",
    sortAsc: "Sort: A-Z",
    sortDesc: "Sort: Z-A",
    searchBy: "Search by:",
    name: "Name",
    characteristics: "Characteristics",
    loading: "Loading...",
    sortBy: "Sort by:",
    sortOrder: "Sort order:",
    ascending: "Ascending",
    descending: "Descending",
    id: "ID",
    noItemsFound: "No items found matching your search.",
    categoryIdRequired: "Category ID is required to display items.",
    categoryIdMustBeNumber: "Category ID must be a number.",
    categoryIdMustBePositive: "Category ID must be a positive number.",
    failedToLoadItems: "Failed to load items.",
    errorUnableToDetermineCategory: "Error: Unable to determine category.",
    loadingCategory: "Loading category...",
    categoryId: "Category ID:",
    categoryCharacteristics: "Category Characteristics:",
    noValue: "No value"
  },
  pl: {
    itemsInCategory: "Przedmioty w ",
    createNewItem: "+ Dodaj nowy przedmiot",
    noItems: "Brak przedmiotów w tej kategorii.",
    search: "Szukaj przedmiotów...",
    sortAsc: "Sortuj: A-Z",
    sortDesc: "Sortuj: Z-A",
    searchBy: "Szukaj po:",
    name: "Nazwa",
    characteristics: "Cechy",
    loading: "Ładowanie...",
    sortBy: "Sortuj według:",
    sortOrder: "Kolejność sortowania:",
    ascending: "Rosnąco",
    descending: "Malejąco",
    id: "ID",
    noItemsFound: "Nie znaleziono przedmiotów spełniających kryteria wyszukiwania.",
    categoryIdRequired: "ID kategorii jest wymagane do wyświetlenia przedmiotów.",
    categoryIdMustBeNumber: "ID kategorii musi być liczbą.",
    categoryIdMustBePositive: "ID kategorii musi być liczbą dodatnią.",
    failedToLoadItems: "Nie udało się załadować przedmiotów.",
    errorUnableToDetermineCategory: "Błąd: Nie można określić kategorii.",
    loadingCategory: "Ładowanie kategorii...",
    categoryId: "ID Kategorii:",
    categoryCharacteristics: "Cechy kategorii:",
    noValue: "Brak wartości"
  },
};

interface category {
  idcategory: number;
  nameCategory: string;
  characteristics: {
    idcharacteristic: number;
    nameCharacteristic: string;
  }[];
}

interface item {
    iditem: number;
    nameItem: string;
    photoItem: string;
    categoryId: number;
    categoryName: string;
    chracteristics: 
      {
        idchracteristic: number;
        nameCharacteristic: string;
        value: string;
      }[];
    
  }

const CategoryItemsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<item[]>([]);
  const [category, setCategory] = useState<category | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    setError(null);
    setLoading(true);
    setCategoryLoading(true);
    
    if (!id) {
      setError(t.categoryIdRequired);
      setLoading(false);
      setCategoryLoading(false);
    } else if (isNaN(Number(id))) {
      setError(t.categoryIdMustBeNumber);
      setLoading(false);
      setCategoryLoading(false);
    } else if (Number(id) <= 0) {
      setError(t.categoryIdMustBePositive);
      setLoading(false);
      setCategoryLoading(false);
    } else {
      // Fetch category details
      axios
        .get(`${API_URL}/Categories/${id}`, { withCredentials: true })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setCategory(response.data[0]);
          }
          setCategoryLoading(false);
        })
        .catch(() => {
          setCategoryLoading(false);
        });

      // Fetch items in category
      axios
        .get(`${API_URL}/Item/category/${id}`, { withCredentials: true })
        .then((response) => {
          setItems(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError(t.failedToLoadItems);
          setLoading(false);
        });
    }
  }, [id]);

  // Filter and sort items
  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = items;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = items.filter(item =>
        item.nameItem.toLowerCase().includes(searchTerm.toLowerCase())
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
      { value: "id", label: t.id }
    ];

    if (category?.characteristics) {
      category.characteristics.forEach(char => {
        options.push({
          value: char.nameCharacteristic,
          label: char.nameCharacteristic
        });
      });
    }

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
      ) : !categoryLoading && !category ? (
        <div
          style={{
            color: "red",
            fontWeight: "bold",
            margin: "2rem 0",
            textAlign: "center",
          }}
        >
          {t.errorUnableToDetermineCategory}
        </div>
      ) : (
        <>
          {/* Category Summary Section */}
          {categoryLoading ? (
            <div style={{ color: '#007bff', fontWeight: 'bold', margin: '1rem 0', textAlign: 'center' }}>
              {t.loadingCategory}
            </div>
          ) : category ? (
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h1 style={{ color: '#007bff', marginBottom: '12px', fontSize: '1.8rem' }}>
                {category.nameCategory}
              </h1>
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#495057' }}>
                  {t.categoryId} 
                </strong>
                <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                  {category.idcategory}
                </span>
              </div>
              {category.characteristics && category.characteristics.length > 0 && (
                <div>
                  <strong style={{ color: '#495057', display: 'block', marginBottom: '8px' }}>
                    {t.categoryCharacteristics}
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {category.characteristics.map((char) => (
                      <span
                        key={char.idcharacteristic}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        {char.nameCharacteristic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h2 style={{ color: "#007bff" }}>{t.itemsInCategory+category?.nameCategory}</h2>
            <button 
              className="button" 
              onClick={() => {
                const categoryId = category?.idcategory;
                if (!categoryId) {
                  alert(t.errorUnableToDetermineCategory);
                  return;
                }
                navigate(`/items/create/${categoryId}`);
              }}
            >
              {t.createNewItem}
            </button>
          </div>
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
                      <b>ID:</b> {item.iditem}</h4> </div>
                  <div className="item-card-content">
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

export default CategoryItemsPage;