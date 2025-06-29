// src/App.tsx
import React from 'react';
// index.tsx або App.tsx

import { LoginPage } from './ui/pages/LoginPage';
import { RegisterPage } from './ui/pages/RegisterPage';

const App: React.FC = () => {
    return (
        <div>
            <h1>Auth System</h1>
            <LoginPage />
            <RegisterPage />
        </div>
    );
};

export default App;
