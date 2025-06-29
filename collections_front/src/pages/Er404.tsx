import React from 'react';
import { Link } from 'react-router-dom';
import '../AppStyles.css';
import { useLanguage } from '../LanguageContext';

const translations = {
  en: {
    notFound: "404 - Page Not Found",
    sorry: "Sorry, the page you are looking for does not exist.",
    back: "Back to Home",
  },
  pl: {
    notFound: "404 - Nie znaleziono strony",
    sorry: "Przepraszamy, strona której szukasz nie istnieje.",
    back: "Powrót do strony głównej",
  },
};

function Er404() {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <div className="home-container" style={{ textAlign: 'center', maxWidth: 400 }}>
      <img src="https://illustrations.popsy.co/gray/web-error.svg" alt="404" style={{ width: 180, marginBottom: 24 }} />
      <h2 style={{ color: '#dc3545', marginBottom: 12 }}>{t.notFound}</h2>
      <p style={{ color: '#888', marginBottom: 24 }}>
        {t.sorry}
      </p>
      <Link to="/" className="button" style={{ textDecoration: 'none' }}>{t.back}</Link>
    </div>
  );
}

export default Er404;