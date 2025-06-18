import React, { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";



export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();
 // const user= localStorage.getItem()
 const [userId, setUserId] = useState<string | null>(null);
 useEffect(() => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
    setUserId(storedUserId);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId")
    setUserId(null);
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <Link
            to="/"
            style={{
              ...styles.link,
             
            }}
          >
            <h1 style={styles.title}>Collection Portal</h1>
            
          </Link>
      
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <Link
            to="/bikelist"
            style={{
              ...styles.link,
              ...(hovered === "BikeList" ? styles.linkHover : {}),
            }}
            onMouseEnter={() => setHovered("BikeList")}
            onMouseLeave={() => setHovered(null)}
          >
            Bike List
          </Link>
        </li>

        
 {!userId && (
          <>
        <li style={styles.navItem}>
          <Link
            to="/login"
            style={{
              ...styles.link,
              ...(hovered === "Login" ? styles.linkHover : {}),
            }}
            onMouseEnter={() => setHovered("Login")}
            onMouseLeave={() => setHovered(null)}
          >
            Login
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link
            to="/register"
            style={{
              ...styles.link,
              ...(hovered === "Register" ? styles.linkHover : {}),
            }}
            onMouseEnter={() => setHovered("Register")}
            onMouseLeave={() => setHovered(null)}
          >
            Register
          </Link>
        </li>
        </>
        )}
        {userId && (
          <li style={styles.navItem}>
            <button
              onClick={handleLogout}
              style={{
                ...styles.link,
                backgroundColor: "#dc3545", // Red color for logout
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </li>
        )}
        
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    color: "#fff",
  },
  navLinks: {
    listStyleType: "none",
    display: "flex",
    gap: "15px",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: 0,
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
    padding: "8px 15px",
    borderRadius: "5px",
    backgroundColor: "transparent",
    transition: "background-color 0.3s, transform 0.2s",
  },
  linkHover: {
    backgroundColor: "#0056b3",
    transform: "scale(1.05)",
  },
};
