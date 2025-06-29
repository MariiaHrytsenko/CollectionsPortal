import React, { useEffect, useState } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import { getFriends } from "../api/friends";

const translations = {
  en: {
    friends: "Friends",
    myFriends: "My Friends",
    addFriend: "Add New Friend",
    emailPlaceholder: "Enter email",
    sendInvite: "Send Invite",
    online: "Online",
    offline: "Offline",
    loading: "Loading...",
    error: "Failed to load friends.",
  },
  pl: {
    friends: "Znajomi",
    myFriends: "Moi znajomi",
    addFriend: "Dodaj znajomego",
    emailPlaceholder: "Wpisz e-mail",
    sendInvite: "Wyślij zaproszenie",
    online: "Online",
    offline: "Offline",
    loading: "Ładowanie...",
    error: "Nie udało się załadować znajomych.",
  },
};

const FriendsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(t.error);
      setLoading(false);
      return;
    }
    getFriends(token)
      .then(data => {
        setFriends(data);
        setLoading(false);
      })
      .catch(() => {
        setError(t.error);
        setLoading(false);
      });
  }, [lang]);

  if (loading) return <div className="home-container">{t.loading}</div>;
  if (error) return <div className="home-container" style={{ color: "#dc3545" }}>{error}</div>;

  return (
    <div className="home-container" style={{ maxWidth: 600 }}>
      <h2 style={{ color: '#007bff', marginBottom: 24 }}>{t.friends}</h2>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>{t.myFriends}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {friends.map(friend => (
              <div key={friend.id} style={{ display: 'flex', alignItems: 'center', background: '#f6f8fa', borderRadius: 8, padding: '10px 14px', gap: 14 }}>
                <img src={friend.avatar || "https://randomuser.me/api/portraits/lego/2.jpg"} alt={friend.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', marginRight: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{friend.name}</div>
                  <div style={{ fontSize: '0.95rem', color: friend.status === t.online ? '#28a745' : '#888' }}>{friend.status || t.offline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>{t.addFriend}</h3>
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            className="input-field"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="button" style={{ width: '100%' }}>{t.sendInvite}</button>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;