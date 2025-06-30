import React from "react";
  import axios from "axios";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import config from "../AppConfig.json";

const translations = {
  en: {
    allItems: "All Items",
    category: "Category",
    description: "Description",
    noItems: "No items found.",
    search: "Search items...",
    sortAsc: "Sort: A-Z",
    sortDesc: "Sort: Z-A",
    searchBy: "Search by:",
    name: "Name",
    characteristics: "Characteristics"
  },
  pl: {
    allItems: "Wszystkie przedmioty",
    category: "Kategoria",
    description: "Opis",
    noItems: "Nie znaleziono przedmiotów.",
    search: "Szukaj przedmiotów...",
    sortAsc: "Sortuj: A-Z",
    sortDesc: "Sortuj: Z-A",
    searchBy: "Szukaj po:",
    name: "Nazwa",
    characteristics: "Cechy"
  },
};

const API_URL = config.API_URL;

interface Item {
  iditem: number;
  nameItem: string;
  photoItem: string | null;
  categoryId: number;
  categoryName: string | null;
  characteristics: {
    idcharacteristic: number;
    nameCharacteristic: string;
    value: string | null;
  }[];
}

const AllItemsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [searchBy, setSearchBy] = React.useState<"name" | "characteristics">("name");

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/Item`, { withCredentials: true })
      .then((response) => {
        setItems(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load items.");
        setLoading(false);
      });
  }, []);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      
      if (searchBy === "name") {
        return item.nameItem?.toLowerCase().includes(searchLower);
      } else {
        // Search in characteristics
        return item.characteristics?.some(
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
      <h2 style={{ color: "#007bff", marginBottom: "1.5rem" }}>{t.allItems}</h2>
      
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

      {loading ? (
        <div
          style={{
            color: "#007bff",
            fontWeight: "bold",
            margin: "2rem 0",
            textAlign: "center",
          }}
        >
          Loading...
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
        <div className="pinterest-grid">
          {sortedItems.length === 0 ? (
            <div>{t.noItems}</div>
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
                  style={{ background: '#f6f8fa', objectFit: 'cover', width: '100%', height: 200 }}
                />
                <div className="item-card-content">
                  <div className="item-title">
                    {item.nameItem || (
                      <span style={{ color: "#888" }}>[No name]</span>
                    )}
                  </div>
                  <div className="item-info">
                    {t.category}: {item.categoryName || (
                      <span style={{ color: "#888" }}>[No category]</span>
                    )} <span style={{ color: '#aaa', fontSize: 13, marginLeft: 8 }}>
                      (ID: {item.categoryId ?? <span style={{ color: '#888' }}>[No ID]</span>})
                    </span>
                  </div>
                  <div className="item-meta">
                    <b>
                      {lang === "pl" ? "Cechy:" : "Characteristics:"}
                    </b>
                    {item.characteristics && item.characteristics.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {item.characteristics.map((char) => (
                          <li key={char.idcharacteristic}>
                            <b>
                              {char.nameCharacteristic || (
                                <span style={{ color: "#888" }}>[No name]</span>
                              )}
                              :
                            </b>{" "}
                            {char.value ? char.value : (
                              <span style={{ color: "#888" }}>[No value]</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ color: "#888" }}>
                        {lang === "pl"
                          ? "Brak cech"
                          : "No characteristics"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllItemsPage;