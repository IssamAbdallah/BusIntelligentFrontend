import api from './api';

export const login = async (email, password, userType) => {
  try {
    // Utiliser la route d'API correcte selon votre backend
    const endpoint = userType === 'admin' ? '/auth/admin/session' : '/auth/parent/session';
    const response = await api.post(endpoint, { email, password });
    
    // Stocker le token dans localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erreur de connexion');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userData');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserType = () => {
  return localStorage.getItem('userType');
};