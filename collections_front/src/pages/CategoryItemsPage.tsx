import React from "react";
import { useParams } from "react-router-dom";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../AppConfig.json";
const API_URL = config.API_URL;

const translations = {
  en: {
    itemsInCategory: "Items in Category",
    createNewItem: "+ Create New Item",
    noItems: "No items found in this category.",
    search: "Search items...",
    sortAsc: "Sort: A-Z",
    sortDesc: "Sort: Z-A",
    searchBy: "Search by:",
    name: "Name",
    characteristics: "Characteristics",
    loading: "Loading..."
  },
  pl: {
    itemsInCategory: "Przedmioty w kategorii",
    createNewItem: "+ Dodaj nowy przedmiot",
    noItems: "Brak przedmiotów w tej kategorii.",
    search: "Szukaj przedmiotów...",
    sortAsc: "Sortuj: A-Z",
    sortDesc: "Sortuj: Z-A",
    searchBy: "Szukaj po:",
    name: "Nazwa",
    characteristics: "Cechy",
    loading: "Ładowanie..."
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


// Example items for a category (replace with real data)
const items = [
  {
    id: 1,
    title: "Classic Camera",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "A classic film camera from the 1960s.",
  },
  {
    id: 2,
    title: "Polaroid Snap",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Instant camera for fun moments.",
  },
];

const CategoryItemsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchBy, setSearchBy] = useState<"name" | "characteristics">("name");

  const { id } = useParams();

  useEffect(() => {
    setError(null);
    setLoading(true);
    if (!id) {
      setError("Category ID is required to display items.");
      setLoading(false);
    } else if (isNaN(Number(id))) {
      setError("Category ID must be a number.");
      setLoading(false);
    } else if (Number(id) <= 0) {
      setError("Category ID must be a positive number.");
      setLoading(false);
    } else {
      axios
        .get(`${API_URL}/Item/category/${id}`, { withCredentials: true })
        .then((response) => {
          setItems(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load items.");
          setLoading(false);
        });
    }
  }, [id]);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      
      if (searchBy === "name") {
        return item.nameItem?.toLowerCase().includes(searchLower);
      } else {
        return item.chracteristics?.some(
          char => 
            char.nameCharacteristic?.toLowerCase().includes(searchLower) ||
            char.value?.toLowerCase().includes(searchLower)
        );
      }
    });
  }, [items, searchTerm, searchBy]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const nameA = a.nameItem?.toLowerCase() || "";
      const nameB = b.nameItem?.toLowerCase() || "";
      return sortOrder === "asc" 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [filteredItems, sortOrder]);

  return (
    <div className="home-container">
      {loading ? (
        <div style={{ color: '#007bff', fontWeight: 'bold', margin: '2rem 0', textAlign: 'center' }}>
          {t.loading}
        </div>
      ) : error ? (
        <div style={{ color: "red", fontWeight: "bold", margin: "2rem 0", textAlign: "center" }}>
          {error}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ color: "#007bff" }}>{t.itemsInCategory}</h2>
            <button className="button">{t.createNewItem}</button>
          </div>

          <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span>{t.searchBy}</span>
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value as "name" | "characteristics")}
                style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
              >
                <option value="name">{t.name}</option>
                <option value="characteristics">{t.characteristics}</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #007bff",
                borderRadius: "4px",
                background: "#007bff",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {sortOrder === "asc" ? t.sortAsc : t.sortDesc}
            </button>
          </div>

          <div className="pinterest-grid">
            {sortedItems.length === 0 ? (
              <div style={{ color: "#888", fontSize: "1rem" }}>{t.noItems}</div>
            ) : (
              sortedItems.map((item) => (
                <div className="item-card" key={item.iditem}>
                  <img
                    src={
                      item.photoItem && item.photoItem.trim() !== ""
                        ? item.photoItem
                        : "/default-item.jpeg"
                    }
                    alt={item.nameItem || "No name"}
                  />
                  <div className="item-card-header">
                    <h3 className="item-title">{item.nameItem}</h3>
                    <h4 className="item-id">
                      <b>ID:</b> {item.iditem}</h4> </div>
                  <div className="item-card-content">
                    {/* Add more item details here if needed */}
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