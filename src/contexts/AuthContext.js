import { createContext, useContext, useState } from 'react';

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'admin' ou 'parent'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });

  // Simuler l'authentification (à remplacer par de vraies requêtes API)
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    
    // Ajouter la logique d'authentification réelle ici en utilisant fetch ou axios
    // Pour la démo, on simule une connexion réussie
    console.log(`Tentative de connexion en tant que ${userType}`, loginFormData);
    
    // Simulation d'une requête d'authentification
    setTimeout(() => {
      setIsLoggedIn(true);
    }, 500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setLoginFormData({ email: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  // Valeurs et fonctions à partager dans le contexte
  const value = {
    userType,
    setUserType,
    isLoggedIn,
    setIsLoggedIn,
    loginFormData,
    setLoginFormData,
    handleLogin,
    handleLogout,
    handleInputChange
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};