import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import '../AppStyles.css';

const translations = {
  en: {
    welcome: 'Welcome to the Collection Portal!',
    intro: 'This is your personal space to manage collections, categories, and items.',
    nav: 'Use the navigation bar above to access all features:',
    categories: 'Categories',
    createCategory: 'Create Category',
    allItems: 'All Items',
    createItem: 'Create Item',
    profile: 'Profile',
    friends: 'Friends',
    catList: 'CatList',
    logout: 'Logout',
    note: 'Use the Logout button in the navigation bar to end your session.',
  },
  pl: {
    welcome: 'Witamy w Portalu Kolekcji!',
    intro: 'To Twoja przestrzeń do zarządzania kolekcjami, kategoriami i przedmiotami.',
    nav: 'Użyj paska nawigacji powyżej, aby uzyskać dostęp do wszystkich funkcji:',
    categories: 'Kategorie',
    createCategory: 'Utwórz kategorię',
    allItems: 'Wszystkie przedmioty',
    createItem: 'Dodaj przedmiot',
    profile: 'Profil',
    friends: 'Znajomi',
    catList: 'Lista kategorii',
    logout: 'Wyloguj',
    note: 'Użyj przycisku Wyloguj w pasku nawigacji, aby zakończyć sesję.',
  },
};

function HomePage() {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <>
      <nav className="main-navbar">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/categories/create">Create Category</Link>
        <Link to="/items">All Items</Link>
        <Link to="/items/create">Create Item</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/friends">Friends</Link>
        <Link to="/characteristics">Characteristics Manager</Link>
        <Link to="/login" className="logout-link">Logout</Link>
      </nav>
      <div className="home-container">
        <h2>{t.welcome}</h2>
        <p>
          {t.intro}
          <br />
          {t.nav}
        </p>
        <ul>
          <li>
            <b>{t.categories}</b>
          </li>
          <li>
            <b>{t.createCategory}</b>
          </li>
          <li>
            <b>{t.allItems}</b>
          </li>
          <li>
            <b>{t.createItem}</b>
          </li>
          <li>
            <b>{t.profile}</b>
          </li>
          <li>
            <b>{t.friends}</b>
          </li>
          <li>
            <b>{t.catList}</b>
          </li>
        </ul>
        <p style={{ marginTop: '2rem', color: '#888' }}>{t.note}</p>
      </div>
    </>
  );
}

export default HomePage;