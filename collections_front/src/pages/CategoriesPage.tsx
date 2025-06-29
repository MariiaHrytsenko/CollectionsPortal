import React from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";

const translations = {
  en: {
    categories: "Categories",
    newCategory: "New Category",
    viewItems: "View Items",
  },
  pl: {
    categories: "Kategorie",
    newCategory: "Nowa kategoria",
    viewItems: "Zobacz przedmioty",
  },
};

const categories = [
  { id: 1, name: "Photography", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Decor", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
];

const CategoriesPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <div className="home-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#007bff' }}>{t.categories}</h2>
        <button className="button">+ {t.newCategory}</button>
      </div>
      <div className="pinterest-grid">
        {categories.map(cat => (
          <div key={cat.id} className="item-card" style={{ cursor: 'pointer' }}>
            <img src={cat.image} alt={cat.name} />
            <div className="item-card-content">
              <div className="item-title">{cat.name}</div>
              <button className="button" style={{ width: '100%', marginTop: 8 }}>{t.viewItems}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default CategoriesPage;