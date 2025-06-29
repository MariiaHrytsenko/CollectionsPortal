import React, { useState } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";

const translations = {
  en: {
    create: "Create New Item",
    namePlaceholder: "Item name",
    descPlaceholder: "Description...",
    save: "Save",
    cancel: "Cancel",
    success: "Item created successfully!",
  },
  pl: {
    create: "Utwórz nowy przedmiot",
    namePlaceholder: "Nazwa przedmiotu",
    descPlaceholder: "Opis...",
    save: "Zapisz",
    cancel: "Anuluj",
    success: "Przedmiot został utworzony!",
  },
};

const CreateItemPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to backend
    setSuccess(true);
    setName("");
    setDesc("");
    setFile(null);
  };

  return (
    <div className="home-container" style={{ maxWidth: 480 }}>
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
        <input
          type="file"
          className="input-field"
          onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <textarea
          placeholder={t.descPlaceholder}
          className="input-field"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={{ minHeight: 80 }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="button" style={{ flex: 1 }}>{t.save}</button>
          <button type="button" className="button" style={{ flex: 1, background: '#888' }} onClick={() => { setName(""); setDesc(""); setFile(null); }}>{t.cancel}</button>
        </div>
      </form>
      {success && <div style={{ color: '#28a745', marginTop: 16 }}>{t.success}</div>}
    </div>
  );
};

export default CreateItemPage;