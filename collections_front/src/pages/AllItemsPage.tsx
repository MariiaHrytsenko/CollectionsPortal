import React from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";

const translations = {
  en: {
    allItems: "All Items",
    category: "Category",
    description: "Description",
    noItems: "No items found.",
  },
  pl: {
    allItems: "Wszystkie przedmioty",
    category: "Kategoria",
    description: "Opis",
    noItems: "Nie znaleziono przedmiotów.",
  },
};

// Example data (replace with real data from API)
const items = [
  {
    id: 1,
    title: "Vintage Camera",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "A classic film camera from the 1960s.",
    category: "Photography",
  },
  {
    id: 2,
    title: "Rare Book",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    description: "First edition of a famous novel.",
    category: "Books",
  },
  {
    id: 3,
    title: "Antique Vase",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Hand-painted porcelain vase.",
    category: "Decor",
  },
  // ...more items
];

const AllItemsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <div className="home-container">
      <h2 style={{ color: "#007bff", marginBottom: "1.5rem" }}>
        {t.allItems}
      </h2>
      <div className="pinterest-grid">
        {items.length === 0 ? (
          <div>{t.noItems}</div>
        ) : (
          items.map((item) => (
            <div className="item-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="item-card-content">
                <div className="item-title">{item.title}</div>
                <div className="item-info">
                  {t.description}: {item.description}
                </div>
                <div className="item-meta">
                  {t.category}: {item.category}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllItemsPage;