import React, { useState } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import { addItem } from "../api/item";

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
  const [categoryId, setCategoryId] = useState<number>(0);
  const [characteristics, setCharacteristics] = useState<{ idchracteristic: number, value: string }[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For demo: allow adding characteristics
  const handleCharChange = (idx: number, value: string) => {
    setCharacteristics(cs => cs.map((c, i) => i === idx ? { ...c, value } : c));
  };
  const addCharField = () => {
    setCharacteristics(cs => [...cs, { idchracteristic: cs.length, value: "" }]);
  };
  const removeCharField = (idx: number) => {
    setCharacteristics(cs => cs.filter((_, i) => i !== idx));
  };

  // Convert file to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let photoItem = "";
    if (file) {
      try {
        photoItem = await fileToBase64(file);
      } catch {
        setError("Failed to read image file");
        return;
      }
    }
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return;
    }
    try {
      await addItem(token, {
        nameItem: name,
        photoItem,
        categoryId,
        chracteristics: [
          { idchracteristic: 0, value: desc }, // Use desc as first characteristic
          ...characteristics.filter(c => c.value.trim() !== "")
        ]
      });
      setSuccess(true);
      setName("");
      setDesc("");
      setFile(null);
      setCategoryId(0);
      setCharacteristics([]);
    } catch (err: any) {
      setError(err.message || "Failed to create item");
    }
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
        <input
          type="number"
          className="input-field"
          placeholder="Category ID"
          value={categoryId}
          onChange={e => setCategoryId(Number(e.target.value))}
          min={0}
        />
        <div style={{ margin: '12px 0' }}>
          <label style={{ fontWeight: 500 }}>Characteristics:</label>
          {characteristics.map((c, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <input
                type="text"
                className="input-field"
                placeholder={`Characteristic #${idx + 1}`}
                value={c.value}
                onChange={e => handleCharChange(idx, e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={() => removeCharField(idx)} style={{ background: '#e44', color: '#fff', border: 'none', borderRadius: 4, padding: '0 8px' }}>✕</button>
            </div>
          ))}
          <button type="button" className="button" style={{ marginTop: 4 }} onClick={addCharField}>Add Characteristic</button>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="button" style={{ flex: 1 }}>{t.save}</button>
          <button type="button" className="button" style={{ flex: 1, background: '#888' }} onClick={() => { setName(""); setDesc(""); setFile(null); setCategoryId(0); setCharacteristics([]); }}>{t.cancel}</button>
        </div>
      </form>
      {success && <div style={{ color: '#28a745', marginTop: 16 }}>{t.success}</div>}
      {error && <div style={{ color: '#e44', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default CreateItemPage;