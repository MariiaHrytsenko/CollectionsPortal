import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../AppConfig.json";
import "../AppStyles.css";

const API_URL = config.API_URL;

interface Characteristic {
  idcharacteristic: number;
  nameCharacteristic: string;
}

const CharacteristicsManagerPage = () => {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [popup, setPopup] = useState<{ message: string; success: boolean } | null>(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newCharName, setNewCharName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/Characteristics`, { withCredentials: true })
      .then((response) => {
        setCharacteristics(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load characteristics.");
        setLoading(false);
      });
  }, []);

  const handleEdit = (char: Characteristic) => {
    setEditingId(char.idcharacteristic);
    setEditName(char.nameCharacteristic);
  };

  const handleEditConfirm = async (idcharacteristic: number) => {
    if (!editName.trim()) {
      setPopup({ message: "Name cannot be empty.", success: false });
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        `${API_URL}/Characteristics`,
        { idcharacteristic, newName: editName.trim() },
        { withCredentials: true }
      );
      setCharacteristics((prev) =>
        prev.map((c) =>
          c.idcharacteristic === idcharacteristic
            ? { ...c, nameCharacteristic: editName.trim() }
            : c
        )
      );
      setPopup({ message: "Characteristic updated!", success: true });
      setEditingId(null);
      setEditName("");
    } catch {
      setPopup({ message: "Failed to update characteristic.", success: false });
    } finally {
      setSaving(false);
      setTimeout(() => setPopup(null), 2500);
    }
  };

  const handleDelete = async (idcharacteristic: number) => {
    setDeletingId(idcharacteristic);
    try {
      await axios.delete(`${API_URL}/Characteristics/${idcharacteristic}`, { withCredentials: true });
      setCharacteristics((prev) => prev.filter((c) => c.idcharacteristic !== idcharacteristic));
      setPopup({ message: "Characteristic deleted!", success: true });
    } catch {
      setPopup({ message: "Failed to delete characteristic.", success: false });
    } finally {
      setDeletingId(null);
      setTimeout(() => setPopup(null), 2500);
    }
  };

  const handleCreateCharacteristic = async () => {
    if (!newCharName.trim()) {
      setPopup({ message: "Name cannot be empty.", success: false });
      return;
    }
    setCreating(true);
    try {
      await axios.post(
        `${API_URL}/Characteristics`,
        { nameCharacteristic: newCharName.trim() },
        { withCredentials: true }
      );
      // Fetch updated list to ensure unique keys
      const updated = await axios.get(`${API_URL}/Characteristics`, { withCredentials: true });
      setCharacteristics(Array.isArray(updated.data) ? updated.data : []);
      setPopup({ message: "Characteristic created!", success: true });
      setShowCreatePopup(false);
      setNewCharName("");
    } catch {
      setPopup({ message: "Failed to create characteristic.", success: false });
    } finally {
      setCreating(false);
      setTimeout(() => setPopup(null), 2500);
    }
  };

  return (
    <div className="home-container" style={{ maxWidth: 700 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ color: "#007bff" }}>Manage Characteristics</h2>
      </div>
      {loading ? (
        <div style={{ color: "#007bff", fontWeight: "bold", margin: "2rem 0", textAlign: "center" }}>Loading...</div>
      ) : error ? (
        <div style={{ color: "red", fontWeight: "bold", margin: "2rem 0", textAlign: "center" }}>{error}</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 24,
          }}
        >
          <thead>
            <tr style={{ background: "#f6f8fa" }}>
              <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "left" }}>ID</th>
              <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "left" }}>Name</th>
            </tr>
          </thead>
          <tbody>
            {characteristics.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: "center", color: "#888", padding: 16 }}>
                  No characteristics found.
                </td>
              </tr>
            ) : (
              characteristics.map((char) => (
                <tr key={char.idcharacteristic}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{char.idcharacteristic}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {editingId === char.idcharacteristic ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        disabled={saving}
                        style={{ width: '80%' }}
                      />
                    ) : (
                      char.nameCharacteristic
                    )}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ddd", textAlign: 'right', minWidth: 160 }}>
                    {editingId === char.idcharacteristic ? (
                      <>
                        <button
                          className="button"
                          style={{ background: '#28a745', color: '#fff', marginRight: 8 }}
                          onClick={() => handleEditConfirm(char.idcharacteristic)}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Confirm'}
                        </button>
                        <button
                          className="button"
                          style={{ background: '#6c757d', color: '#fff' }}
                          onClick={() => { setEditingId(null); setEditName(""); }}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="button"
                          style={{ background: '#ffc107', color: '#333', marginRight: 8 }}
                          onClick={() => handleEdit(char)}
                          disabled={deletingId === char.idcharacteristic}
                        >
                          Edit
                        </button>
                        <button
                          className="button"
                          style={{ background: '#dc3545', color: '#fff' }}
                          onClick={() => handleDelete(char.idcharacteristic)}
                          disabled={deletingId === char.idcharacteristic}
                        >
                          {deletingId === char.idcharacteristic ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      
      {/* Create new characteristic button */}
      <button
        className="button"
        style={{ margin: '24px 0 12px 0', background: '#007bff', color: '#fff' }}
        onClick={() => setShowCreatePopup(true)}
      >
        Create new characteristic
      </button>
      
      {/* Create characteristic popup */}
      {showCreatePopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowCreatePopup(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: 32,
              borderRadius: 10,
              minWidth: 320,
              boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h4 style={{ marginBottom: 16 }}>Create New Characteristic</h4>
            <input
              type="text"
              className="input-field"
              placeholder="Characteristic name"
              value={newCharName}
              onChange={e => setNewCharName(e.target.value)}
              style={{ width: '100%', marginBottom: 16 }}
              disabled={creating}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                className="button"
                style={{ background: '#6c757d', color: '#fff' }}
                onClick={() => { setShowCreatePopup(false); setNewCharName(""); }}
                disabled={creating}
              >
                Cancel
              </button>
              <button
                className="button"
                style={{ background: '#28a745', color: '#fff' }}
                onClick={handleCreateCharacteristic}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {popup && (
        <div
          style={{
            position: 'fixed',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            background: popup.success ? '#28a745' : '#dc3545',
            color: '#fff',
            padding: '12px 32px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default CharacteristicsManagerPage;
