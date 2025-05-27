import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle, FaComment } from 'react-icons/fa';
import axios from 'axios';

export default function AlertsSection() {
  // État pour les alertes
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'Bus 1 en retard (15 min)', timestamp: '2025-05-15 09:30:00', read: false },
  ]);

  // État pour les messages des parents
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [sendingReply, setSendingReply] = useState({});

  // Données statiques pour les visualisations
  const staticData = {
    temperature: 25, // °C (valeur statique entre -10 et 50°C)
    humidity: 60, // % (valeur statique entre 0 et 100%)
    pressure: 1013, // hPa (valeur statique entre 900 et 1100 hPa)
  };

  // Simuler une récupération de données via API pour les alertes
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = [
          { id: 1, message: 'Bus 1 en retard (15 min)', timestamp: '2025-05-15 09:30:00', read: false },
        ];
        setAlerts(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des alertes:', error);
        toast.error('Erreur lors de la récupération des alertes.', { position: 'top-right' });
      }
    };

    fetchAlerts();
  }, []);

  // Récupérer les messages des parents via API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:80/api/messages');
        // Filtrer les messages des parents (exclure les réponses de l'admin)
        const parentMessages = response.data.filter(msg => msg.sender.startsWith('Parent:') && !msg.parentMessageId);
        setMessages(parentMessages);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        toast.error('Erreur lors de la récupération des messages.', { position: 'top-right' });
      }
    };

    fetchMessages();
    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour marquer une alerte comme lue
  const markAlertAsRead = (alertId) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
    toast.success('Alerte marquée comme lue.', { position: 'top-right' });
  };

  // Fonction pour envoyer une réponse de l'admin
  const sendReply = async (messageId) => {
    if (!replyContent[messageId]?.trim()) {
      toast.error('Veuillez entrer un message de réponse.', { position: 'top-right' });
      return;
    }

    setSendingReply((prev) => ({ ...prev, [messageId]: true }));
    try {
      await axios.post(`http://localhost:80/api/messages/${messageId}/reply`, {
        content: replyContent[messageId],
        sender: 'Admin',
      });
      toast.success('Réponse envoyée avec succès.', { position: 'top-right' });
      // Actualiser les messages
      const response = await axios.get('http://localhost:80/api/messages');
      const parentMessages = response.data.filter(msg => msg.sender.startsWith('Parent:') && !msg.parentMessageId);
      setMessages(parentMessages);
      setReplyContent((prev) => ({ ...prev, [messageId]: '' }));
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      toast.error('Erreur lors de l\'envoi de la réponse.', { position: 'top-right' });
    } finally {
      setSendingReply((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  // Calcul de l'angle de l'aiguille pour la température (plage: -10°C à 50°C)
  const tempAngle = ((staticData.temperature - (-10)) / (50 - (-10))) * 180 - 90; // Convertir en angle (-90° à 90°)

  // Calcul du pourcentage pour la barre circulaire d'humidité
  const humidityPercentage = staticData.humidity; // Déjà en %

  // Calcul de la hauteur de la barre de pression (plage: 900 à 1100 hPa)
  const pressureHeight = ((staticData.pressure - 900) / (1100 - 900)) * 100; // Convertir en %

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
      {/* Section des alertes existantes */}
      <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
        <FaExclamationCircle className="mr-2" /> Alertes récentes
      </h3>
      {alerts.length > 0 ? (
        <ul className="space-y-3 max-h-40 overflow-y-auto mb-6">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`flex justify-between items-center p-2 rounded-lg ${
                alert.read ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-700'
              }`}
            >
              <div>
                <span>{alert.message}</span>
                <p className="text-xs text-gray-500">{alert.timestamp}</p>
              </div>
              {!alert.read && (
                <button
                  onClick={() => markAlertAsRead(alert.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  aria-label="Marquer l'alerte comme lue"
                >
                  Marquer comme lu
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">Aucune alerte récente.</p>
      )}

      {/* Section des messages des parents */}
      <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
        <FaComment className="mr-2" /> Messages des parents
      </h3>
      {messages.length > 0 ? (
        <ul className="space-y-4 max-h-40 overflow-y-auto mb-6">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`p-3 rounded-lg ${
                message.isRead ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{message.sender.replace('Parent:', '')}</span>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                </div>
                {!message.isRead && (
                  <button
                    onClick={() => markAlertAsRead(message.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    aria-label="Marquer le message comme lu"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tapez votre réponse..."
                  value={replyContent[message.id] || ''}
                  onChange={(e) =>
                    setReplyContent((prev) => ({ ...prev, [message.id]: e.target.value }))
                  }
                />
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                  onClick={() => sendReply(message.id)}
                  disabled={sendingReply[message.id]}
                >
                  {sendingReply[message.id] ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">Aucun message des parents.</p>
      )}

      {/* Section des visualisations */}
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Données du capteur</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Jauge de température (Aiguille) */}
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-20">
            {/* Fond de la jauge */}
            <div className="absolute w-40 h-20 bg-gray-200 rounded-t-full overflow-hidden">
              <div
                className="absolute w-full h-full"
                style={{
                  background: 'linear-gradient(to right, blue, green, red)',
                  clipPath: 'circle(50% at 50% 100%)',
                }}
              />
            </div>
            {/* Aiguille */}
            <div
              className="absolute w-1 h-16 bg-black origin-bottom"
              style={{
                left: '50%',
                bottom: '0',
                transform: `rotate(${tempAngle}deg)`,
                transformOrigin: 'bottom',
              }}
            />
            {/* Centre de l'aiguille */}
            <div className="absolute w-4 h-4 bg-black rounded-full bottom-0 left-1/2 transform -translate-x-1/2" />
          </div>
          <p className="mt-2 text-gray-700 font-medium">Température: {staticData.temperature}°C</p>
          <p className="text-xs text-gray-500">Plage: -10°C à 50°C</p>
        </div>

        {/* Jauge circulaire pour l'humidité */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Cercle de fond */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e6e6e6" strokeWidth="10" />
              {/* Cercle de progression */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="10"
                strokeDasharray={`${(humidityPercentage * 2.83)} 283`} // 2.83 = (2 * π * 45) / 100
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xl font-semibold">{staticData.humidity}%</p>
            </div>
          </div>
          <p className="mt-2 text-gray-700 font-medium">Humidité</p>
          <p className="text-xs text-gray-500">Plage: 0% à 100%</p>
        </div>

        {/* Jauge linéaire pour la pression */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-40 bg-gray-200 rounded-lg overflow-hidden">
            {/* Barre de progression */}
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-700"
              style={{ height: `${pressureHeight}%` }}
            />
            {/* Marques de graduation */}
            <div className="absolute left-0 top-0 h-full w-full">
              {[900, 950, 1000, 1050, 1100].map((value) => {
                const position = ((value - 900) / (1100 - 900)) * 100;
                return (
                  <div
                    key={value}
                    className="absolute left-0 w-full flex items-center"
                    style={{ bottom: `${position}%` }}
                  >
                    <span className="text-xs text-gray-600 mr-2">{value}</span>
                    <div className="h-px w-4 bg-gray-600" />
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-2 text-gray-700 font-medium">Pression: {staticData.pressure} hPa</p>
          <p className="text-xs text-gray-500">Plage: 900 à 1100 hPa</p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}