import React, { useEffect, useState } from "react";
import "../AppStyles.css";
import { useLanguage } from "../LanguageContext";
import { getFriends } from "../api/friends";
import { getAccountMe } from "../api/account";
import { useLocation, useNavigate } from "react-router-dom";

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
  const [userId, setUserId] = useState<string>("");
  const [inviteStatus, setInviteStatus] = useState<string>("");
  const [acceptToken, setAcceptToken] = useState<string>("");
  const [acceptEmail, setAcceptEmail] = useState<string>("");
  const [acceptStatus, setAcceptStatus] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(t.error);
      setLoading(false);
      return;
    }
    // Get current user id for invitations
    getAccountMe(token)
      .then(user => {
        setUserId(user.id);
        return getFriends(token);
      })
      .then(data => {
        setFriends(data);
        setLoading(false);
      })
      .catch(() => {
        setError(t.error);
        setLoading(false);
      });
  }, [lang]);

  const sendInvite = async () => {
    setInviteStatus("");
    if (!email) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/Invitations/send", {
        method: "POST",
        headers: {
          "Authorize": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inviterId: userId, email })
      });
      if (!res.ok) throw new Error();
      setInviteStatus("Invitation sent!");
      setEmail("");
    } catch {
      setInviteStatus("Failed to send invitation.");
    }
  };

  // Check for invitation token in URL
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) setAcceptToken(token);
  }, [location.search]);

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAcceptStatus("");
    if (!acceptToken || !acceptEmail) return;
    try {
      const res = await fetch("/api/Invitations/Accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorize": `Bearer ${acceptToken}`
        },
        body: JSON.stringify({ token: acceptToken, email: acceptEmail })
      });
      if (res.ok) {
        setAcceptStatus("Invitation accepted! You can now log in.");
      } else {
        const msg = await res.text();
        setAcceptStatus(msg || "Failed to accept invitation.");
      }
    } catch {
      setAcceptStatus("Failed to accept invitation. Please try again later.");
    }
  };

  if (loading) return <div className="home-container">{t.loading}</div>;
  if (error) return <div className="home-container" style={{ color: "#dc3545" }}>{error}</div>;

  return (
    <div className="home-container" style={{ maxWidth: 900, padding: 24 }}>
      <h2 style={{ color: '#007bff', marginBottom: 24 }}>{t.friends}</h2>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 320 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>{t.myFriends}</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 18,
          }}>
            {friends.map(friend => (
              <div
                key={friend.id}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 210,
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
                onClick={() => navigate(`/friends/${friend.id}/items`)}
                title="View collection"
              >
                <img src={friend.avatarBase64 ? `data:image/png;base64,${friend.avatarBase64}` : "https://randomuser.me/api/portraits/lego/2.jpg"} alt={friend.userName} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 10, border: '2px solid #4f8cff' }} />
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>{friend.userName}</div>
                <div style={{ color: '#888', fontSize: '0.97rem', marginBottom: 4 }}>{friend.email}</div>
                <div style={{ fontSize: '0.95rem', color: friend.status === t.online ? '#28a745' : '#888' }}>{friend.status || t.offline}</div>
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
            style={{ marginBottom: 10 }}
          />
          <button className="button" style={{ width: '100%' }} onClick={sendInvite}>{t.sendInvite}</button>
          {inviteStatus && <div style={{ marginTop: 10, color: inviteStatus.includes('sent') ? '#28a745' : '#dc3545' }}>{inviteStatus}</div>}
        </div>
      </div>
      {acceptToken && (
        <div style={{ margin: '32px 0', textAlign: 'center', background: '#f9fbfd', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3>Accept Invitation</h3>
          <form onSubmit={handleAcceptInvitation} style={{ marginTop: 12 }}>
            <input
              type="email"
              placeholder="Enter your email to accept the invitation"
              value={acceptEmail}
              onChange={e => setAcceptEmail(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #b5c9e2', width: '80%', marginBottom: 12 }}
            />
            <br />
            <button className="button" type="submit" disabled={!acceptEmail} style={{ width: 180 }}>
              Accept Invitation
            </button>
          </form>
          {acceptStatus && <div style={{ marginTop: 16, fontSize: "1.1rem", color: acceptStatus.includes("accepted") ? '#28a745' : '#dc3545' }}>{acceptStatus}</div>}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;