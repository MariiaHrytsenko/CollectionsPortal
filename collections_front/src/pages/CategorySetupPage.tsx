import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../AppConfig.json";
import "../AppStyles.css";

const API_URL = config.API_URL;

interface category {
  idcategory: number;
  nameCategory: string;
  characteristics: characteristic[];
}

interface characteristic {
  idcharacteristic: number;
  nameCharacteristic: string;
}

const CategorySetupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState<category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);
  const [allCharacteristics, setAllCharacteristics] = useState<characteristic[]>([]);
  const [assigning, setAssigning] = useState<number | null>(null);
  const [popup, setPopup] = useState<{ message: string; success: boolean } | null>(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newCharName, setNewCharName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/Categories/${id}`, { withCredentials: true })
      .then((response) => {
        setCat({
          ...response.data[0],
          characteristics: Array.isArray(response.data[0]?.characteristics)
            ? response.data[0].characteristics
            : [],
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load category.");
        setLoading(false);
      });
    // Fetch all characteristics
    axios
      .get(`${API_URL}/Characteristics`, { withCredentials: true })
      .then((response) => {
        setAllCharacteristics(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        setAllCharacteristics([]);
      });
  }, [id]);

  const handleRemove = async (idcharacteristic: number) => {
    if (!cat) return;
    setRemoving(idcharacteristic);
    try {
      await axios.post(
        `${API_URL}/Characteristics/remove`,
        {
          idcategory: cat.idcategory,
          idcharacteristic,
        },
        { withCredentials: true }
      );
      // Remove from UI after successful removal
      setCat({
        ...cat,
        characteristics: cat.characteristics.filter(
          (c) => c.idcharacteristic !== idcharacteristic
        ),
      });
    } catch {
      setError("Failed to remove characteristic.");
    } finally {
      setRemoving(null);
    }
  };

  const handleAssign = async (idcharacteristic: number) => {
    if (!cat || !idcharacteristic || !allCharacteristics.find(c => c.idcharacteristic === idcharacteristic)) {
      setPopup({ message: "Invalid characteristic or category.", success: false });
      return;
    }
    setAssigning(idcharacteristic);
    try {
      await axios.post(
        `${API_URL}/Characteristics/assign`,
        {
          idcategory: cat.idcategory,
          idcharacteristic,
        },
        { withCredentials: true }
      );
      setCat({
        ...cat,
        characteristics: [
          ...cat.characteristics,
          allCharacteristics.find((c) => c.idcharacteristic === idcharacteristic)!,
        ],
      });
      setPopup({ message: "Characteristic assigned successfully!", success: true });
    } catch {
      setError("Failed to assign characteristic.");
      setPopup({ message: "Failed to assign characteristic.", success: false });
    } finally {
      setAssigning(null);
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
      setAllCharacteristics(Array.isArray(updated.data) ? updated.data : []);
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

  const handleRenameCategory = async () => {
    if (!cat || !newCategoryName.trim()) {
      setPopup({ message: "Name cannot be empty.", success: false });
      return;
    }
    setRenaming(true);
    try {
      await axios.put(
        `${API_URL}/Categories/rename`,
        {
          idcategory: cat.idcategory,
          newName: newCategoryName.trim()
        },
        { withCredentials: true }
      );
      // Update local state
      setCat({
        ...cat,
        nameCategory: newCategoryName.trim()
      });
      setPopup({ message: "Category renamed successfully!", success: true });
      setShowRenamePopup(false);
      setNewCategoryName("");
    } catch {
      setPopup({ message: "Failed to rename category.", success: false });
    } finally {
      setRenaming(false);
      setTimeout(() => setPopup(null), 2500);
    }
  };

  return (
    <div className="home-container" style={{ maxWidth: 600 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ color: "#007bff" }}>Category Setup</h2>
        <button className="button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>
      {loading ? (
        <div
          style={{
            color: "#007bff",
            fontWeight: "bold",
            margin: "2rem 0",
            textAlign: "center",
          }}
        >
          Loading...
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
      ) : cat ? (
        <>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <b>ID:</b> {cat.idcategory} <br />
                <b>Name:</b> {cat.nameCategory}
              </div>
              <button
                className="button"
                style={{ 
                  background: '#ffc107', 
                  color: '#212529',
                  fontSize: '0.9rem',
                  padding: '6px 12px',
                  minWidth: 'auto'
                }}
                onClick={() => {
                  setNewCategoryName(cat.nameCategory);
                  setShowRenamePopup(true);
                }}
              >
                Edit Name
              </button>
            </div>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 24,
            }}
          >
            <thead>
              <tr style={{ background: "#f6f8fa" }}>
                <th
                  style={{
                    padding: 8,
                    border: "1px solid #ddd",
                    textAlign: "left",
                  }}
                >
                  Characteristic
                </th>
                <th
                  style={{
                    padding: 8,
                    border: "1px solid #ddd",
                  }}
                ></th>
              </tr>
            </thead>
            <tbody>
              {(cat.characteristics?.length ?? 0) === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      color: "#888",
                      padding: 16,
                    }}
                  >
                    No characteristics available.
                  </td>
                </tr>
              ) : (
                cat.characteristics.map((char) => (
                  <tr key={char.idcharacteristic}>
                    <td
                      style={{
                        padding: 8,
                        border: "1px solid #ddd",
                      }}
                    >
                      {char.nameCharacteristic}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      <button
                        className="button"
                        style={{
                          background: "#dc3545",
                          color: "#fff",
                          minWidth: 80,
                        }}
                        disabled={removing === char.idcharacteristic}
                        onClick={() => handleRemove(char.idcharacteristic)}
                      >
                        {removing === char.idcharacteristic
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Table of all characteristics for assignment */}
          <h3 style={{ marginTop: 32, marginBottom: 12, color: '#007bff' }}>All Characteristics</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 24,
            }}
          >
            <thead>
              <tr style={{ background: "#f6f8fa" }}>
                <th
                  style={{
                    padding: 8,
                    border: "1px solid #ddd",
                    textAlign: "left",
                  }}
                >
                  Characteristic
                </th>
                <th
                  style={{
                    padding: 8,
                    border: "1px solid #ddd",
                  }}
                ></th>
              </tr>
            </thead>
            <tbody>
              {allCharacteristics.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", color: "#888", padding: 16 }}>
                    No characteristics available.
                  </td>
                </tr>
              ) : (
                allCharacteristics.map((char) => (
                  <tr key={char.idcharacteristic}>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{char.nameCharacteristic}</td>
                    <td style={{ padding: 8, border: "1px solid #ddd", textAlign: "right" }}>
                      <button
                        className="button"
                        style={{ background: '#28a745', color: '#fff', minWidth: 80 }}
                        disabled={assigning === char.idcharacteristic || (cat?.characteristics?.some(c => c.idcharacteristic === char.idcharacteristic))}
                        onClick={() => handleAssign(char.idcharacteristic)}
                      >
                        {assigning === char.idcharacteristic ? 'Assigning...' : (cat?.characteristics?.some(c => c.idcharacteristic === char.idcharacteristic) ? 'Assigned' : 'Assign')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Create new characteristic button and popup */}
          <button
            className="button"
            style={{ margin: '24px 0 12px 0', background: '#007bff', color: '#fff' }}
            onClick={() => setShowCreatePopup(true)}
          >
            Create new characteristic
          </button>
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
          
          {/* Rename category popup */}
          {showRenamePopup && (
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
              onClick={() => setShowRenamePopup(false)}
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
                <h4 style={{ marginBottom: 16 }}>Rename Category</h4>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  style={{ width: '100%', marginBottom: 16 }}
                  disabled={renaming}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    className="button"
                    style={{ background: '#6c757d', color: '#fff' }}
                    onClick={() => { 
                      setShowRenamePopup(false); 
                      setNewCategoryName(""); 
                    }}
                    disabled={renaming}
                  >
                    Cancel
                  </button>
                  <button
                    className="button"
                    style={{ background: '#28a745', color: '#fff' }}
                    onClick={handleRenameCategory}
                    disabled={renaming}
                  >
                    {renaming ? 'Renaming...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}

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

export default CategorySetupPage;