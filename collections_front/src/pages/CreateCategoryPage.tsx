import React, { useState } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to backend
    setSuccess(true);
    setName("");
  };

  return (
    <div className="home-container" style={{ maxWidth: 420 }}>
      <h2 style={{ color: '#007bff', marginBottom: 24 }}>{t.create}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t.namePlaceholder}
          className="input-field"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit" className="button" style={{ width: '100%' }}>{t.createBtn}</button>
      </form>
      {success && <div style={{ color: '#28a745', marginTop: 16 }}>{t.success}</div>}
    </div>
  );
};

export default CreateCategoryPage;