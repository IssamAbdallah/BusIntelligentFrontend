import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle } from 'react-icons/fa';

export default function AlertsSection() {
  // État pour les alertes
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'Bus 1 en retard (15 min)', timestamp: '2025-05-15 09:30:00', read: false },
  ]);

  // Simuler une récupération de données via API (à remplacer par un vrai fetch)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Simuler une réponse API (à remplacer par une vraie requête)
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

  // Fonction pour marquer une alerte comme lue
  const markAlertAsRead = (alertId) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
    toast.success('Alerte marquée comme lue.', { position: 'top-right' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
        <FaExclamationCircle className="mr-2" /> Alertes récentes
      </h3>
      {alerts.length > 0 ? (
        <ul className="space-y-3 max-h-40 overflow-y-auto">
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
        <p className="text-gray-500">Aucune alerte récente.</p>
      )}
      <ToastContainer />
    </div>
  );
}