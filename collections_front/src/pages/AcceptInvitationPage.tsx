import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AcceptInvitationPage = () => {
  const [status, setStatus] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/Invitations/Accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorize": `Bearer ${token}` // If backend expects token in header
        },
        body: JSON.stringify({ token, email })
      });
      if (res.ok) {
        setStatus("Invitation accepted! You can now log in.");
      } else {
        const msg = await res.text();
        setStatus(msg || "Failed to accept invitation.");
      }
    } catch {
      setStatus("Failed to accept invitation. Please try again later.");
    }
    setSubmitting(false);
  };

  if (!token) {
    return <div className="home-container" style={{ maxWidth: 500, margin: "48px auto", textAlign: "center" }}>
      <h2>Accept Invitation</h2>
      <div style={{ marginTop: 32, fontSize: "1.1rem", color: '#dc3545' }}>Invalid invitation link.</div>
    </div>;
  }

  return (
    <div className="home-container" style={{ maxWidth: 500, margin: "48px auto", textAlign: "center" }}>
      <h2>Accept Invitation</h2>
      <form onSubmit={handleAccept} style={{ marginTop: 32 }}>
        <input
          type="email"
          placeholder="Enter your email to accept the invitation"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #b5c9e2', width: '80%', marginBottom: 16 }}
        />
        <br />
        <button className="button" type="submit" disabled={submitting || !email} style={{ width: 180 }}>
          Accept Invitation
        </button>
      </form>
      {status && <div style={{ marginTop: 24, fontSize: "1.1rem", color: status.includes("accepted") ? '#28a745' : '#dc3545' }}>{status}</div>}
    </div>
  );
};

export default AcceptInvitationPage;
