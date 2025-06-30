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
  },
  pl: {
    itemsInCategory: "Przedmioty w kategorii",
    createNewItem: "+ Dodaj nowy przedmiot",
    noItems: "Brak przedmiotów w tej kategorii.",
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

  return (
    <div className="home-container">
      {loading ? (
        <div style={{ color: '#007bff', fontWeight: 'bold', margin: '2rem 0', textAlign: 'center' }}>
          {lang === 'pl' ? 'Ładowanie...' : 'Loading...'}
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
                <div className="item-card" key={item.iditem}>
                  <img src={item.photoItem} alt={item.nameItem} />
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