import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

const translations = {
  en: {
    home: "Home",
    categories: "Categories",
    createCategory: "Create Category",
    allItems: "All Items",
    createItem: "Create Item",
    profile: "Profile",
    friends: "Friends",
    catList: "CatList",
    logout: "Logout",
    login: "Login",
    lang: "Polski",
    portal: "Collection Portal",
  },
  pl: {
    home: "Strona główna",
    categories: "Kategorie",
    createCategory: "Utwórz kategorię",
    allItems: "Wszystkie przedmioty",
    createItem: "Dodaj przedmiot",
    profile: "Profil",
    friends: "Znajomi",
    catList: "Lista kategorii",
    logout: "Wyloguj",
    login: "Zaloguj",
    lang: "English",
    portal: "Portal Kolekcji",
  },
};

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  // Force re-render on language change
  const [_, setForce] = useState(0);
  useEffect(() => {
    setForce((f) => f + 1);
  }, [lang]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserId(null);
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.titleLink}>
        <h1 style={styles.title}>{t.portal}</h1>
      </Link>
      <ul style={styles.navLinks}>
        {userId ? (
          <>
            <li style={styles.navItem}>
              <Link
                to="/"
                style={{
                  ...styles.link,
                  ...(hovered === "home" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("home")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.home}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/categories"
                style={{
                  ...styles.link,
                  ...(hovered === "categories" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("categories")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.categories}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/categories/create"
                style={{
                  ...styles.link,
                  ...(hovered === "createCategory" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("createCategory")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.createCategory}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/items"
                style={{
                  ...styles.link,
                  ...(hovered === "allItems" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("allItems")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.allItems}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/items/create"
                style={{
                  ...styles.link,
                  ...(hovered === "createItem" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("createItem")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.createItem}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/profile"
                style={{
                  ...styles.link,
                  ...(hovered === "profile" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("profile")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.profile}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/friends"
                style={{
                  ...styles.link,
                  ...(hovered === "friends" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("friends")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.friends}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/catlist"
                style={{
                  ...styles.link,
                  //...(hovered === "catList" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("catList")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.catList}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="/characteristics"
                style={{
                  ...styles.link,
                  ...(hovered === "characteristics" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("characteristics")}
                onMouseLeave={() => setHovered(null)}
              >
                {lang === 'pl' ? 'Cechy' : 'Characteristics'}
              </Link>
            </li>
            <li style={styles.navItem}>
              <button
                onClick={handleLogout}
                style={{
                  ...styles.link,
                  backgroundColor: "#dc3545",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t.logout}
              </button>
            </li>
          </>
        ) : (
          <>
            <li style={styles.navItem}>
              <Link
                to="/login"
                style={{
                  ...styles.link,
                  ...(hovered === "login" ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered("login")}
                onMouseLeave={() => setHovered(null)}
              >
                {t.login}
              </Link>
            </li>
          </>
        )}
        <li style={styles.navItem}>
          <button
            onClick={() => setLang(lang === "en" ? "pl" : "en")}
            style={{
              ...styles.link,
              backgroundColor: "#f6f8fa",
              color: "#007bff",
              border: "1px solid #007bff",
              marginLeft: 8,
            }}
          >
            {t.lang}
          </button>
        </li>
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
  titleLink: {
    textDecoration: "none",
    color: "inherit",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
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
