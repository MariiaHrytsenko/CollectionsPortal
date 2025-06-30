import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../AppConfig.json";
import "./css/Login.css";
import axios from "axios";

const API_URL = config.API_URL;

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // перемикач login / register
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    avatar: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files) {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLoginSuccess = (userId: string | undefined) => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
    // Force a state update in Navbar by reloading the page or using a global state
    window.location.href = "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!API_URL) {
      setError("API URL is not configured.");
      return;
    }
    try {
      if (isLogin) {
        const response = await axios.post(
          `${API_URL}/Account/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );

        const token = response.data.token;
        const userId = response.data.userId;
        if (token) {
          localStorage.setItem("token", token);
          // Set token as a cookie for use in ProfilePage
          document.cookie = `token=${token}; path=/;`;
          handleLoginSuccess(userId);
        } else {
          setError("Invalid login response");
        }
      } else {
        // Registration with userName, phone, and avatarBase64
        let avatarBase64 = "";
        if (formData.avatar) {
          const file = formData.avatar;
          avatarBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
        await axios.post(`${API_URL}/Account/register`, {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phone,
          avatarBase64,
        });
        setIsLogin(true); // після реєстрації — перемикаємося на login
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">
        {isLogin ? "Login to your account" : "Register a new account"}
      </h2>
      <form onSubmit={handleSubmit} className="login-form">
        {!isLogin && (
          <>
            <input
              name="userName"
              type="text"
              placeholder="User name"
              value={formData.userName}
              onChange={handleChange}
              className="input-field"
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              required
            />
            <input
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="input-field"
            />
          </>
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />
        <button type="submit" className="login-button">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="switch-button"
          type="button"
        >
          {isLogin
            ? "Don't have an account? Register here"
            : "Already have an account? Login here"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginRegister;
