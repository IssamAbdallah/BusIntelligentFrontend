import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle, FaThermometerHalf, FaTint, FaCompress, FaEye, FaPaperPlane, FaBell, FaEnvelope, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

// Configuration des constantes
const CONFIG = {
  API_BASE_URL: 'http://localhost:80/api',
  REFRESH_INTERVAL: 30000,
  TEMPERATURE_RANGE: { min: -10, max: 50 },
  PRESSURE_RANGE: { min: 900, max: 1100 },
  TOAST_POSITION: 'top-right'
};

// Composant de jauge de température compact
const TemperatureGauge = ({ temperature }) => {
  const angle = useMemo(() => {
    const { min, max } = CONFIG.TEMPERATURE_RANGE;
    return ((temperature - min) / (max - min)) * 180 - 90;
  }, [temperature]);

  const getTemperatureColor = (temp) => {
    if (temp < 0) return 'text-blue-500';
    if (temp < 20) return 'text-green-500';
    if (temp < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <FaThermometerHalf className={`text-lg ${getTemperatureColor(temperature)}`} />
        <span className="text-xs text-slate-500 font-medium">TEMP</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative w-16 h-8">
          <div className="absolute w-16 h-8 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 rounded-full opacity-20" />
          <div
            className="absolute w-1 h-6 bg-slate-700 rounded-full origin-bottom transition-all duration-500"
            style={{
              left: '50%',
              bottom: '4px',
              transform: `rotate(${angle}deg) translateX(-50%)`,
              transformOrigin: 'bottom center',
            }}
          />
        </div>
        <div>
          <div className={`text-xl font-bold ${getTemperatureColor(temperature)}`}>
            {temperature}°C
          </div>
          <div className="text-xs text-slate-400">-10° à 50°</div>
        </div>
      </div>
    </div>
  );
};

// Composant de jauge d'humidité compact
const HumidityGauge = ({ humidity }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <FaTint className="text-lg text-emerald-500" />
        <span className="text-xs text-slate-500 font-medium">HUMID</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
            style={{ width: `${humidity}%` }}
          />
        </div>
        <div>
          <div className="text-xl font-bold text-emerald-600">{humidity}%</div>
          <div className="text-xs text-slate-400">0% à 100%</div>
        </div>
      </div>
    </div>
  );
};

// Composant de jauge de pression compact
const PressureGauge = ({ pressure }) => {
  const height = ((pressure - CONFIG.PRESSURE_RANGE.min) / (CONFIG.PRESSURE_RANGE.max - CONFIG.PRESSURE_RANGE.min)) * 100;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <FaCompress className="text-lg text-indigo-500" />
        <span className="text-xs text-slate-500 font-medium">PRESS</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative w-4 h-16 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="absolute bottom-2 h-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000"
            style={{ height: `${height}%` }}
          />
        </div>
        <div>
          <div className="text-xl font-bold text-indigo-600">{pressure}</div>
          <div className="text-xs text-slate-400">hPa</div>
        </div>
      </div>
    </div>
  );
};

// Composant principal
export default function CompactDashboard() {
  const { token } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts');
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 30,
    pressure: 1000
  });

  // Fetch BME280 sensor data
  const fetchBMEData = useCallback(async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/bmes`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Échec de la récupération des données BME280 : ${errorData.error || response.statusText}`);
      }
      const data = await response.json();
      setSensorData({
        temperature: parseFloat(data.temperature) || 0,
        humidity: parseFloat(data.humidity) || 0,
        pressure: parseFloat(data.pression) || 0,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données BME280:', error);
      toast.error('Impossible de charger les données BME280', { position: CONFIG.TOAST_POSITION });
    }
  }, [token]);

  // Fetch alerts with error handling
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/driveralerts`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      
      setAlerts(data.map(alert => ({
        id: alert._id,
        message: alert.message,
        timestamp: new Date(alert.timestamp).toLocaleString('fr-FR'),
        read: alert.read || false,
        severity: alert.severity || 'medium'
      })));
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      toast.error('Impossible de charger les alertes', { position: CONFIG.TOAST_POSITION });
    }
  }, [token]);

  // Fetch messages with error handling
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/messages`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      
      const parentMessages = data.filter(msg => msg.sender.startsWith('Parent:') && !msg.parentMessageId);
      setMessages(parentMessages.map(msg => ({
        id: msg._id,
        sender: msg.sender,
        content: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleString('fr-FR'),
        isRead: msg.isRead || false,
      })));
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      toast.error('Impossible de charger les messages', { position: CONFIG.TOAST_POSITION });
    }
  }, [token]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchBMEData(), fetchAlerts(), fetchMessages()]);
      setLoading(false);
    };

    if (token) {
      initializeData();
      const interval = setInterval(() => {
        fetchBMEData();
        fetchAlerts();
        fetchMessages();
      }, CONFIG.REFRESH_INTERVAL);

      return () => clearInterval(interval);
    } else {
      setLoading(false);
      toast.error('Utilisateur non authentifié', { position: CONFIG.TOAST_POSITION });
    }
  }, [fetchBMEData, fetchAlerts, fetchMessages, token]);

  // Mark alert as read
  const markAlertAsRead = async (alertId) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/driveralerts/${alertId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to mark alert as read');
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
      toast.success('Alerte marquée comme lue', { position: CONFIG.TOAST_POSITION });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du marquage', { position: CONFIG.TOAST_POSITION });
    }
  };

  // Mark message as read
  const markMessageAsRead = async (messageId) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to mark message as read');
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
      toast.success('Message marqué comme lu', { position: CONFIG.TOAST_POSITION });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du marquage', { position: CONFIG.TOAST_POSITION });
    }
  };

  // Send reply
  const sendReply = async (messageId) => {
    const content = replyContent[messageId]?.trim();
    if (!content) {
      toast.error('Veuillez entrer un message', { position: CONFIG.TOAST_POSITION });
      return;
    }

    setSendingReply(prev => ({ ...prev, [messageId]: true }));
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/messages/${messageId}/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, sender: 'Admin' }),
      });
      
      if (!response.ok) throw new Error('Failed to send reply');
      
      toast.success('Réponse envoyée avec succès', { position: CONFIG.TOAST_POSITION });
      setReplyContent(prev => ({ ...prev, [messageId]: '' }));
      await fetchMessages();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi', { position: CONFIG.TOAST_POSITION });
    } finally {
      setSendingReply(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const unreadAlerts = alerts.filter(a => !a.read).length;
  const unreadMessages = messages.filter(m => !m.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-slate-600 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header compact */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="text-slate-500 text-sm">Surveillance temps réel</p>
        </div>

        {/* Sensor Data Section - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TemperatureGauge temperature={sensorData.temperature} />
          <HumidityGauge humidity={sensorData.humidity} />
          <PressureGauge pressure={sensorData.pressure} />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'alerts'
                  ? 'text-red-600 border-b-2 border-red-500 bg-red-50'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <FaBell className="text-sm" />
              <span>Alertes</span>
              {unreadAlerts > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadAlerts}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <FaEnvelope className="text-sm" />
              <span>Messages</span>
              {unreadMessages > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadMessages}
                </span>
              )}
            </button>
          </div>

          <div className="p-4">
            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                        alert.read 
                          ? 'bg-slate-50 border-slate-200 opacity-60' 
                          : 'bg-red-50 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <FaExclamationCircle className={`${getSeverityIcon(alert.severity)} ${alert.read ? 'opacity-50' : ''}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${alert.read ? 'text-slate-500' : 'text-slate-800'}`}>
                            {alert.message}
                          </p>
                          <p className="text-xs text-slate-400">{alert.timestamp}</p>
                        </div>
                      </div>
                      {!alert.read && (
                        <button
                          onClick={() => markAlertAsRead(alert.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                        >
                          <FaEye className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaBell className="mx-auto text-4xl text-slate-300 mb-2" />
                    <p className="text-slate-500">Aucune alerte</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        message.isRead 
                          ? 'bg-slate-50 border-slate-200 opacity-60' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-xs" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-800">
                              {message.sender.replace('Parent:', '')}
                            </span>
                            <p className="text-xs text-slate-500">{message.timestamp}</p>
                          </div>
                        </div>
                        {!message.isRead && (
                          <button
                            onClick={() => markMessageAsRead(message.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            <FaEye className="text-xs" />
                          </button>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-3 leading-relaxed">{message.content}</p>
                      
                      <div className="space-y-2">
                        <textarea
                          className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white/70"
                          placeholder="Votre réponse..."
                          rows="2"
                          value={replyContent[message.id] || ''}
                          onChange={(e) =>
                            setReplyContent(prev => ({ ...prev, [message.id]: e.target.value }))
                          }
                        />
                        <button
                          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                          onClick={() => sendReply(message.id)}
                          disabled={sendingReply[message.id] || !replyContent[message.id]?.trim()}
                        >
                          <FaPaperPlane className="text-xs" />
                          <span>{sendingReply[message.id] ? 'Envoi...' : 'Envoyer'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaEnvelope className="mx-auto text-4xl text-slate-300 mb-2" />
                    <p className="text-slate-500">Aucun message</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        position={CONFIG.TOAST_POSITION}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="text-sm"
      />
    </div>
  );
}