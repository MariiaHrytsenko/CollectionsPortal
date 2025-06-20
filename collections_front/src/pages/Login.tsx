import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import axios from "axios";
import config from "../AppConfig.json"

const API_URL = config.API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
 

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = formData.email;
      const password = formData.password;
      const response = await axios.post<string>(`${API_URL}/Account/login`, {
      email,
      password,
    }, {withCredentials:true});
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };
  /*
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
   const storedUserId = localStorage.getItem("userId");
   if (storedUserId) {
     setUserId(storedUserId);
   }
 }, []);

  

  

  
*/
  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
