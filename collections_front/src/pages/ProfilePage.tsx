import React, { useEffect, useState } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import { getAccountMe, updateAccountMe } from "../api/account";

const translations = {
  en: {
    profile: "My Profile",
    edit: "Edit Profile",
    userName: "User name",
    phone: "Phone number",
    loading: "Loading...",
    error: "Failed to load profile.",
  },
  pl: {
    profile: "Mój profil",
    edit: "Edytuj profil",
    userName: "Nazwa użytkownika",
    phone: "Numer telefonu",
    loading: "Ładowanie...",
    error: "Nie udało się załadować profilu.",
  },
};

const ProfilePage = () => {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Placeholder update function
  const updateProfileField = async (field: string, value: string | File) => {
    // TODO: Replace with real API call
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Helper to check uniqueness
  const checkUnique = async (field: string, value: string) => {
    const token = localStorage.getItem('token') || '';
    try {
      const res = await fetch(`/api/Account/check-unique?field=${field}&value=${encodeURIComponent(value)}`, {
        headers: { 'Authorize': `Bearer ${token}` }
      });
      if (!res.ok) {
        // User-centered, generic error for security
        throw new Error('Please choose another user name.');
      }
      const data = await res.json();
      return data.isUnique;
    } catch (e) {
      // User-centered, generic error for security
      throw new Error('Please choose another user name.');
    }
  };

  const handleEdit = (field: string) => {
    setEditField(field);
    setEditValue(profile[field] || "");
  };

  const handleSave = async (field: string) => {
    setSaving(true);
    try {
      if (field === 'userName' || field === 'email') {
        const isUnique = await checkUnique(field, editValue);
        if (!isUnique) {
          alert(`${field === 'userName' ? 'Username' : 'Email'} must be unique.`);
          setSaving(false);
          return;
        }
      }
      const token = localStorage.getItem('token') || '';
      let updateData: any = {};
      if (field === 'avatarBase64') {
        updateData.avatarBase64 = editValue;
      } else {
        updateData[field] = editValue;
      }
      const res = await fetch('/api/Account/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        let msg = 'Failed to update profile field.';
        try { msg = (await res.text()) || msg; } catch {}
        throw new Error(msg);
      }
      // Try to parse JSON, but fallback to text if not JSON
      let updated = null;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        updated = await res.json();
      } else {
        await res.text(); // ignore text, just update local state
        updated = updateData;
      }
      setProfile((prev: any) => ({ ...prev, ...updateData }));
      setEditField(null);
      setAvatarFile(null);
    } catch (e: any) {
      alert(e.message || 'Failed to update profile field.');
    }
    setSaving(false);
  };

  useEffect(() => {
    // Get token from localStorage (SPA best practice)
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] || '';
      console.log('Token from cookie:', token); // Debug: log token retrieval
    if (!token) {
      setError(t.error + '\n(No token in localStorage)');
      setLoading(false);
      return;
    }
    getAccountMe(token)
      .then((data) => {
        console.log('Profile API response:', data); // Debug: log backend response
        if (data && data.id && !data.error) {
          setProfile(data);
        } else {
          setError((data && data.error) ? data.error : t.error);
        }
      })
      .catch((err) => {
        // Show more error details for debugging
        setError(
          (err && (err.message || err.toString()))
            ? `${t.error}\n${err.message || err.toString()}`
            : t.error
        );
        console.error('Profile API error:', err);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  if (loading) return <div className="home-container">{t.loading}</div>;
  if (error || !profile) return <div className="home-container" style={{ color: "#dc3545" }}>{error || t.error}</div>;

  return (
    <div style={{
      maxWidth: 420,
      margin: '48px auto',
      background: '#f9fbfd',
      borderRadius: 18,
      boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
      padding: 36,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Segoe UI, Arial, sans-serif',
    }}>
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <img
          src={profile.avatarBase64 ? `data:image/png;base64,${profile.avatarBase64}` : 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt="avatar"
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            border: '3px solid #4f8cff',
            background: '#fff',
          }}
        />
        {editField === 'avatarBase64' ? (
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <input type="file" accept="image/*" onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setAvatarFile(e.target.files[0]);
                const reader = new FileReader();
                reader.onload = ev => setEditValue((ev.target?.result as string).split(",")[1]);
                reader.readAsDataURL(e.target.files[0]);
              }
            }} />
            <button className="button" onClick={() => handleSave('avatarBase64')} disabled={saving} style={{ marginLeft: 8 }}>Save</button>
            <button className="button" onClick={() => setEditField(null)} disabled={saving} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        ) : (
          <button style={{ position: 'absolute', right: 0, bottom: 0, background: '#fff', border: '1.5px solid #4f8cff', borderRadius: '50%', padding: 6, cursor: 'pointer', fontSize: 18 }} onClick={() => handleEdit('avatarBase64')}>✏️</button>
        )}
      </div>
      <div style={{ width: '100%' }}>
        <div style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
          <span style={{ color: '#4f8cff', minWidth: 90 }}>{t.userName}:</span>
          {editField === 'userName' ? (
            <>
              <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{ fontSize: '1.1rem', padding: 6, borderRadius: 6, border: '1px solid #b5c9e2', flex: 1 }} />
              <button className="button" onClick={() => handleSave('userName')} disabled={saving} style={{ marginLeft: 8 }}>Save</button>
              <button className="button" onClick={() => setEditField(null)} disabled={saving} style={{ marginLeft: 4 }}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ flex: 1 }}>{profile.userName}</span>
              <button style={{ marginLeft: 8, background: '#fff', border: '1.5px solid #4f8cff', borderRadius: '50%', padding: 6, cursor: 'pointer', fontSize: 18 }} onClick={() => handleEdit('userName')}>✏️</button>
            </>
          )}
        </div>
        <div style={{ color: '#4f8cff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, justifyContent: 'space-between' }}>
          <span style={{ minWidth: 90 }}>Email:</span>
          {editField === 'email' ? (
            <>
              <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{ fontSize: '1.1rem', padding: 6, borderRadius: 6, border: '1px solid #b5c9e2', flex: 1 }} />
              <button className="button" onClick={() => handleSave('email')} disabled={saving} style={{ marginLeft: 8 }}>Save</button>
              <button className="button" onClick={() => setEditField(null)} disabled={saving} style={{ marginLeft: 4 }}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, color: '#222' }}>{profile.email}</span>
              <button style={{ marginLeft: 8, background: '#fff', border: '1.5px solid #4f8cff', borderRadius: '50%', padding: 6, cursor: 'pointer', fontSize: 18 }} onClick={() => handleEdit('email')}>✏️</button>
            </>
          )}
        </div>
        {profile.phoneNumber !== undefined && (
          <div style={{ color: '#4f8cff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, justifyContent: 'space-between' }}>
            <span style={{ minWidth: 90 }}>{t.phone}:</span>
            {editField === 'phoneNumber' ? (
              <>
                <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{ fontSize: '1.1rem', padding: 6, borderRadius: 6, border: '1px solid #b5c9e2', flex: 1 }} />
                <button className="button" onClick={() => handleSave('phoneNumber')} disabled={saving} style={{ marginLeft: 8 }}>Save</button>
                <button className="button" onClick={() => setEditField(null)} disabled={saving} style={{ marginLeft: 4 }}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ flex: 1, color: '#222' }}>{profile.phoneNumber}</span>
                <button style={{ marginLeft: 8, background: '#fff', border: '1.5px solid #4f8cff', borderRadius: '50%', padding: 6, cursor: 'pointer', fontSize: 18 }} onClick={() => handleEdit('phoneNumber')}>✏️</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
