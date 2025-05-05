// Ce fichier contient des fonctions d'aide pour l'authentification
// Dans une vraie application, vous auriez ici des fonctions pour:
// - Appeler votre API d'authentification
// - Gérer les tokens JWT
// - Vérifier si l'utilisateur est authentifié
// - Etc.

/**
 * Simule une connexion à l'API d'authentification
 * @param {string} email - Adresse email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @param {string} userType - Type d'utilisateur ('admin' ou 'parent')
 * @returns {Promise} - Une promesse qui résout avec les données de l'utilisateur
 */
export const loginUser = async (email, password, userType) => {
  // Dans une vraie application, vous enverriez ces informations à votre API
  // et recevriez un token JWT ou similaire
  
  return new Promise((resolve) => {
    // Simuler un délai réseau
    setTimeout(() => {
      // Simuler une réponse réussie
      resolve({
        success: true,
        user: {
          id: '123',
          email,
          userType,
          name: userType === 'admin' ? 'Admin Test' : 'Parent Test'
        },
        token: 'fake-jwt-token'
      });
    }, 500);
  });
};

/**
 * Sauvegarde les informations d'authentification dans le localStorage
 * @param {Object} authData - Données d'authentification
 */
export const saveAuthData = (authData) => {
  localStorage.setItem('authToken', authData.token);
  localStorage.setItem('user', JSON.stringify(authData.user));
};

/**
 * Récupère les informations d'authentification du localStorage
 * @returns {Object|null} - Données d'authentification ou null si non connecté
 */
export const getAuthData = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return null;
  }
  
  return {
    token,
    user: JSON.parse(user)
  };
};

/**
 * Supprime les informations d'authentification du localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};