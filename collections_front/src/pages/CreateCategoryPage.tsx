import React, { useState } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import axios from "axios";
import config from "../AppConfig.json";

const API_URL = config.API_URL;

const translations = {
  en: {
    create: "Create New Category",
    namePlaceholder: "Category name",
    createBtn: "Create",
    success: "Category created successfully!",
  },
  pl: {
    create: "Utwórz nową kategorię",
    namePlaceholder: "Nazwa kategorii",
    createBtn: "Utwórz",
    success: "Kategoria została utworzona!",
  },
};

const CreateCategoryPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await axios.post(
        `${API_URL}/Categories/add`,
        {
          nameCategory: name,
        },
        { withCredentials: true }
      );
      setSuccess(true);
      setName("");
    } catch (err: any) {
      setSuccess(false);
      setError(
        err?.response?.data?.message ||
          (lang === "pl"
            ? "Wystąpił błąd podczas tworzenia kategorii."
            : "An error occurred while creating the category.")
      );
    }
  };

  return (
    <div className="home-container" style={{ maxWidth: 420 }}>
      <h2 style={{ color: "#007bff", marginBottom: 24 }}>{t.create}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t.namePlaceholder}
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="button"
          style={{ width: "100%" }}
        >
          {t.createBtn}
        </button>
      </form>
      {success && (
        <div style={{ color: "#28a745", marginTop: 16 }}>{t.success}</div>
      )}
      {error && (
        <div style={{ color: "#dc3545", marginTop: 16 }}>{error}</div>
      )}
    </div>
  );
};

export default CreateCategoryPage;