import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setWithExpiry, getWithExpiry } from '../utils/localstorage';

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true' || false);
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getWithExpiry('TOKEN') || null); // Récupérer le token au démarrage
  const navigate = useNavigate();

  // Sauvegarder les états dans localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem('userType', userType || '');
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [userType, isLoggedIn]);

  // Fonction pour gérer la connexion
  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    try {
      console.log('Envoi de la requête API avec :', { email: loginFormData.email, password: loginFormData.password, userType });

      const response = await fetch('http://localhost:80/api/session', {
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
        // Mettre à jour l'utilisateur et le token
        setUser(data);
        setToken(data.token.data);
        setIsLoggedIn(true);

        // Stocker le token dans localStorage avec expiration
        setWithExpiry('TOKEN', data.token.data, data.token.expiresIn);

        console.log(`Connexion réussie en tant que ${userType}`);

        if (!userType) {
          console.error('userType est null, redirection vers /user-type-select');
          alert('Erreur : Type d\'utilisateur non défini.');
          navigate('/user-type-select');
          return;
        }

        if (userType === 'admin') {
          console.log('Redirection vers /admin/dashboard?section=users');
          navigate('/admin/dashboard?section=users'); // Rediriger vers la section utilisateurs
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
    localStorage.removeItem('TOKEN');
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