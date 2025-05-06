/**
 * Client API pour gérer les appels à l'API avec gestion automatique des tokens
 */

const API_BASE_URL = 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Récupère le token d'authentification stocké
   * @returns {string|null} - Le token ou null si non disponible
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Prépare les en-têtes HTTP pour une requête
   * @param {object} headers - En-têtes supplémentaires à inclure
   * @returns {object} - En-têtes HTTP combinés
   */
  getHeaders(headers = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Ajoute le token d'authentification si disponible
    const token = this.getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    return { ...defaultHeaders, ...headers };
  }

  /**
   * Effectue une requête HTTP GET
   * @param {string} endpoint - Endpoint API (sans le baseUrl)
   * @param {object} options - Options de requête supplémentaires
   * @returns {Promise} - Promesse avec la réponse
   */
  async get(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include',
      ...options
    });

    return this.handleResponse(response);
  }

  /**
   * Effectue une requête HTTP POST
   * @param {string} endpoint - Endpoint API (sans le baseUrl)
   * @param {object} data - Données à envoyer
   * @param {object} options - Options de requête supplémentaires
   * @returns {Promise} - Promesse avec la réponse
   */
  async post(endpoint, data = {}, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
      ...options
    });

    return this.handleResponse(response);
  }

  /**
   * Effectue une requête HTTP PUT
   * @param {string} endpoint - Endpoint API (sans le baseUrl)
   * @param {object} data - Données à envoyer
   * @param {object} options - Options de requête supplémentaires
   * @returns {Promise} - Promesse avec la réponse
   */
  async put(endpoint, data = {}, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
      ...options
    });

    return this.handleResponse(response);
  }

  /**
   * Effectue une requête HTTP DELETE
   * @param {string} endpoint - Endpoint API (sans le baseUrl)
   * @param {object} options - Options de requête supplémentaires
   * @returns {Promise} - Promesse avec la réponse
   */
  async delete(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      ...options
    });

    return this.handleResponse(response);
  }

  /**
   * Gère la réponse HTTP et les erreurs
   * @param {Response} response - Objet Response de fetch
   * @returns {Promise} - Promesse avec les données ou l'erreur
   */
  async handleResponse(response) {
    let data;
    try {
      // Tente de parser la réponse comme JSON
      data = await response.json();
    } catch (e) {
      // Si la réponse n'est pas un JSON valide, utilise le texte
      data = { message: await response.text() };
    }

    if (!response.ok) {
      // Gestion des erreurs selon le code de statut
      if (response.status === 401) {
        // Session expirée, déconnexion
        localStorage.removeItem('authToken');
        // Redirection vers la page de connexion si nécessaire
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Lance une erreur avec les détails
      const error = new Error(data.message || `Erreur HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }
}

// Export d'une instance singleton
const apiClient = new ApiClient();
export default apiClient;