import React from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";

const translations = {
  en: {
    itemsInCategory: "Items in Category",
    createNewItem: "+ Create New Item",
    noItems: "No items found in this category.",
  },
  pl: {
    itemsInCategory: "Przedmioty w kategorii",
    createNewItem: "+ Dodaj nowy przedmiot",
    noItems: "Brak przedmiotów w tej kategorii.",
  },
};

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
        <h2 style={{ color: "#007bff" }}>{t.itemsInCategory}</h2>
        <button className="button">{t.createNewItem}</button>
      </div>
      <div className="pinterest-grid">
        {items.length === 0 ? (
          <div style={{ color: "#888", fontSize: "1rem" }}>{t.noItems}</div>
        ) : (
          items.map((item) => (
            <div className="item-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="item-card-content">
                <div className="item-title">{item.title}</div>
                <div className="item-info">{item.description}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryItemsPage;