import React from "react";
import axios from "axios";
import config from "../AppConfig.json";
import { useEffect, useState } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";

const API_URL = config.API_URL;

const translations = {
  en: {
    categories: "Categories",
    newCategory: "New Category",
    characteristics: "Characteristics",
    viewItems: "View Items",
  },
  pl: {
    categories: "Kategorie",
    newCategory: "Nowa kategoria",
    characteristics: "Cechy",
    viewItems: "Zobacz przedmioty",
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

const CategoriesPage = () => {
  const { lang } = useLanguage();
  const [cats, setCategories] = useState<category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const t = translations[lang];
  return (
    <div className="home-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ color: "#007bff" }}>{t.categories}</h2>
        <button
          className="button"
          onClick={() => navigate("/categories/create")}
        >
          + {t.newCategory}
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : cats.length === 0 ? (
        <div
          style={{
            color: "#888",
            fontSize: 18,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          {lang === "pl"
            ? "Brak kategorii do wyświetlenia."
            : "No categories to display."}
        </div>
      ) : (
        <div className="pinterest-grid">
          {cats.map((cat) => (
            <div
              key={cat.idcategory}
              className="item-card"
              style={{ cursor: "pointer", position: "relative" }}
            >
              {/* Edit button in upper right corner */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/categories/edit/${cat.idcategory}`);
                }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#ffc107",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                }}
                title={lang === "pl" ? "Edytuj kategorię" : "Edit category"}
              >
                ✎
              </button>
              <div className="item-card-content">
                <div className="item-title">{cat.nameCategory}</div>
                <b>{"ID"}: {cat.idcategory}</b>
                <b>{t.characteristics}:</b>
                <br />
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
                <button
                  className="button"
                  onClick={() => navigate(`/categories/info/${cat.idcategory}`)}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  {t.viewItems}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;