import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || null); // Récupérer depuis localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true' || false);
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
  const [user, setUser] = useState(null); // Stocker les infos utilisateur
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Récupérer le token depuis localStorage
  const navigate = useNavigate();

  // Sauvegarder les états dans localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem('userType', userType);
    localStorage.setItem('isLoggedIn', isLoggedIn);
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [userType, isLoggedIn, token]);

  // Fonction pour gérer la connexion avec vérification dans une base de données
  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    try {
      console.log('Envoi de la requête API avec :', { email: loginFormData.email, password: loginFormData.password, userType });

      const response = await fetch('http://localhost:5000/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginFormData.email,
          password: loginFormData.password,
        }),
        credentials: 'include',
      });

      console.log('Réponse API reçue :', response.status, response.statusText);

      const data = await response.json();
      console.log('Données de la réponse :', data);

      if (response.ok) {
        setIsLoggedIn(true);
        setUser(data);
        setToken(data.token.data);
        console.log(`Connexion réussie en tant que ${userType}`);

        if (!userType) {
          console.error('userType est null, redirection vers /user-type-select');
          alert('Erreur : Type d\'utilisateur non défini.');
          navigate('/user-type-select');
          return;
        }

        if (userType === 'admin') {
          console.log('Redirection vers /admin/dashboard');
          navigate('/admin/dashboard');
        } else if (userType === 'parent') {
          console.log('Redirection vers /parent/dashboard');
          navigate('/parent/dashboard');
        }
      } else {
        console.error('Échec de la connexion :', data.message || 'Identifiants incorrects');
        alert(`Échec de la connexion : ${data.message || 'Identifiants incorrects'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error.message);
      alert(`Une erreur est survenue : ${error.message}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUser(null);
    setToken(null);
    navigate('/user-type-select');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const value = {
    userType,
    setUserType,
    isLoggedIn,
    setIsLoggedIn,
    loginFormData,
    setLoginFormData,
    user,
    token,
    handleLogin,
    handleLogout,
    handleInputChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};