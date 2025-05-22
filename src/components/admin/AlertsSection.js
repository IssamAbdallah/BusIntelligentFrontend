import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle, FaFire } from 'react-icons/fa';

export default function AlertsSection() {
  // État pour les alertes
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'Bus 1 en retard (15 min)', timestamp: '2025-05-15 09:30:00', read: false },
  ]);

  // Données statiques pour les visualisations
  const staticData = {
    temperature: 25, // °C (valeur statique entre -10 et 50°C)
    humidity: 60, // % (valeur statique entre 0 et 100%)
    pressure: 1013, // hPa (valeur statique entre 900 et 1100 hPa)
    flameDetected: true, // true ou false pour la détection de flamme
  };

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

      {/* Section des visualisations */}
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Données du capteur (Statique)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Indicateur de détection de flamme */}
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              staticData.flameDetected ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            <FaFire
              className={`text-3xl ${staticData.flameDetected ? 'text-white' : 'text-gray-200'}`}
            />
          </div>
          <p className="mt-2 text-gray-700 font-medium">
            Flamme: {staticData.flameDetected ? 'Détectée' : 'Non détectée'}
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}