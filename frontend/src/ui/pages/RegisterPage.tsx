import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const { register, error } = useAuth();
  const [form, setForm] = useState({ email: '', userName: '', password: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await register(form.email, form.userName, form.password);
      setSuccess(true);
      setForm({ email: '', userName: '', password: '' });
    } catch {
      // error is handled in hook state
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="userName" // ✅ не "username"
          type="text"
          placeholder="UserName"
          value={form.userName}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
