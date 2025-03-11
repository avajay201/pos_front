import React, { createContext, useState } from 'react';

export const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
    const [cart, setCart] = useState({});
    const [language, setLanguage] = useState(null);
    const languages = ['Switch Language', 'Hindi', 'English', 'Urdu'];

    return (
        <MainContext.Provider value={{ cart, setCart, languages, language, setLanguage }}>
            {children}
        </MainContext.Provider>
    );
};