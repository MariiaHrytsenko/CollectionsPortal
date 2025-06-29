import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../AppConfig.json";
import { exportCategoriesToPDF } from "./Exports";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";

const translations = {
  en: {
    allCategories: "All Categories",
    search: "Search by name...",
    viewDetails: "View Details",
    export: "Export this to PDF",
    noResults: "No categories match your filters.",
    id: "ID",
    characteristics: "Characteristics",
    newCategory: "New Category",
  },
  pl: {
    allCategories: "Wszystkie kategorie",
    search: "Szukaj po nazwie...",
    viewDetails: "Zobacz szczegóły",
    export: "Eksportuj do PDF",
    noResults: "Brak kategorii spełniających kryteria.",
    id: "ID",
    characteristics: "Cechy",
    newCategory: "Nowa kategoria",
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

const API_URL = config.API_URL;

const CatList = () => {
  const [cats, setCategories] = useState<category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    axios
      .get(`${API_URL}/Categories/user-categories`, { withCredentials: true })
      .then((response) => {
        setCategories(response.data);
        setFilteredCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load categories.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = cats;
    if (searchQuery) {
      filtered = filtered.filter((cat) =>
        cat.nameCategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredCategories(filtered);
  }, [searchQuery, cats]);

  if (loading) return <p className="loading-message">Loading categories...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="home-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#007bff' }}>{t.allCategories}</h2>
        <button className="button" onClick={() => navigate('/categories/create')}>+ {t.newCategory}</button>
      </div>
      <div style={{ marginBottom: 18 }}>
        <input
          type="text"
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ maxWidth: 320 }}
        />
      </div>
      <div className="pinterest-grid">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <div key={cat.idcategory} className="item-card" style={{ minHeight: 180 }}>
              <div className="item-card-content">
                <div className="item-title">{cat.nameCategory}</div>
                <div className="item-info">
                  <b>{t.id}:</b> {cat.idcategory}
                  <br />
                  <b>{t.characteristics}:</b><br />
                  {cat.characteristics && cat.characteristics.length > 0 ? (
                    cat.characteristics.map((char) => (
                      <span key={char.idcharacteristic}>
                        {char.nameCharacteristic}
                        <br />
                      </span>
                    ))
                  ) : (
                    <em>No characteristics available.</em>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/categories/${cat.idcategory}`)}
                  className="button"
                  style={{ width: '100%', marginTop: 8 }}
                >
                  {t.viewDetails}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">{t.noResults}</p>
        )}
      </div>
      <button
        onClick={() => exportCategoriesToPDF(filteredCategories)}
        className="button"
        style={{ marginTop: 32 }}
      >
        {t.export}
      </button>
    </div>
  );
};

export default CatList;
