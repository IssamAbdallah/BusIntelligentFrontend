import React, { useState, useEffect } from 'react';
import { FaBus, FaClock, FaMapMarkerAlt, FaUserGraduate, FaSearch, FaCheckCircle, FaTimesCircle, FaBell, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Calculer la durée en secondes entre arrival_time et departure_time
const calculateDuration = (arrival, departure) => {
  if (!arrival || !departure) return 0;
  const [arrH, arrM, arrS] = arrival.split(':').map(Number);
  const [depH, depM, depS] = departure.split(':').map(Number);
  const arrivalSeconds = arrH * 3600 + arrM * 60 + arrS;
  const departureSeconds = depH * 3600 + depM * 60 + depS;
  return departureSeconds - arrivalSeconds;
};

// Formater la durée en minutes et secondes
const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}min ${remainingSeconds}s` : `${minutes}min`;
};

// Formater une date ISO en DD-MM-YYYY
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  if (isNaN(date)) return 'Date invalide';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Normaliser les chaînes (supprimer espaces, ignorer casse)
const normalizeString = (str) => {
  return str ? String(str).trim().toLowerCase() : '';
};

// Normaliser la date en DD-MM-YYYY
const normalizeDate = (dateStr) => {
  if (!dateStr) {
    console.warn('Date reçue est vide ou nulle');
    return '';
  }
  console.log('Date brute reçue :', dateStr);
  const formats = [
    { regex: /^(\d{2})-(\d{2})-(\d{4})$/, parse: (d, m, y) => `${d}-${m}-${y}` }, // DD-MM-YYYY
    { regex: /^(\d{4})-(\d{2})-(\d{2})$/, parse: (y, m, d) => `${d}-${m}-${y}` }, // YYYY-MM-DD
    { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, parse: (d, m, y) => `${d}-${m}-${y}` }, // DD/MM/YYYY
    { regex: /^(\d{2})\.(\d{2})\.(\d{4})$/, parse: (d, m, y) => `${d}-${m}-${y}` }, // DD.MM.YYYY
  ];
  for (const { regex, parse } of formats) {
    const match = String(dateStr).match(regex);
    if (match) {
      const [, a, b, c] = match;
      const normalized = parse(a, b, c);
      console.log(`Date normalisée de ${dateStr} à ${normalized}`);
      return normalized;
    }
  }
  const date = new Date(dateStr);
  if (!isNaN(date)) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const normalized = `${day}-${month}-${year}`;
    console.log(`Date normalisée via Date de ${dateStr} à ${normalized}`);
    return normalized;
  }
  console.warn(`Impossible de normaliser la date : ${dateStr}`);
  return dateStr;
};

// Obtenir la date actuelle en DD-MM-YYYY
const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function StatsSection() {
  const { token } = useAuth();
  const [stopsData, setStopsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentsData, setStudentsData] = useState({
    present: [],
    absent: [],
    allStudents: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const currentDate = getCurrentDate();
    console.log('Date actuelle utilisée :', currentDate);

    const fetchStopsData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Récupération des stops...');
        const stopsResponse = await fetch('http://localhost:80/api/stops', {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!stopsResponse.ok) {
          const errorData = await stopsResponse.json();
          throw new Error(`Échec récupération stops : ${errorData.message || stopsResponse.statusText}`);
        }
        const stops = await stopsResponse.json();
        console.log('Stops récupérés :', stops);

        console.log('Récupération des stoptimes...');
        const stopTimesResponse = await fetch('http://localhost:80/api/stoptimes', {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!stopTimesResponse.ok) {
          const errorData = await stopTimesResponse.json();
          throw new Error(`Échec récupération stoptimes : ${errorData.message || stopTimesResponse.statusText}`);
        }
        const stopTimes = await stopTimesResponse.json();
        console.log('Stoptimes récupérés :', stopTimes);

        const combinedData = stopTimes.map((stopTime) => {
          const stop = stops.find((s) => s._id === stopTime.stop);
          return {
            station: stop ? stop.stop_name : 'Inconnu',
            duration: calculateDuration(stopTime.arrival_time, stopTime.departure_time),
            arrivalTime: stopTime.arrival_time,
            departureTime: stopTime.departure_time,
            stopSequence: stopTime.stop_sequence,
            timestamp: new Date().toISOString(),
          };
        });

        combinedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setStopsData(combinedData);
      } catch (err) {
        console.error('Erreur fetchStopsData :', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudents = async () => {
      try {
        console.log('Récupération des élèves...');
        const studentsResponse = await fetch('http://localhost:80/api/students', {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!studentsResponse.ok) {
          const errorData = await studentsResponse.json();
          throw new Error(`Échec récupération élèves : ${errorData.message || studentsResponse.statusText}`);
        }
        const students = await studentsResponse.json();
        console.log('Élèves récupérés :', JSON.stringify(students, null, 2));
        return students;
      } catch (err) {
        console.error('Erreur fetchStudents :', err);
        throw err;
      }
    };

    const fetchEvents = async () => {
      try {
        console.log('Récupération des événements...');
        const eventsResponse = await fetch('http://localhost:80/api/datas', {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!eventsResponse.ok) {
          const errorData = await eventsResponse.json();
          throw new Error(`Échec récupération événements : ${errorData.error || eventsResponse.statusText}`);
        }
        const events = await eventsResponse.json();
        console.log('Réponse brute événements :', JSON.stringify(events, null, 2));
        const eventData = Array.isArray(events.data) ? events.data : Array.isArray(events) ? events : [];
        console.log('Événements extraits :', JSON.stringify(eventData, null, 2));
        return eventData;
      } catch (err) {
        console.error('Erreur fetchEvents :', err);
        throw err;
      }
    };

    const fetchStudentsAndEvents = async () => {
      try {
        setStudentsLoading(true);
        const students = await fetchStudents();
        const events = await fetchEvents();

        if (!Array.isArray(students)) {
          console.error('Données élèves non valides :', students);
          throw new Error('Données élèves invalides');
        }
        if (!Array.isArray(events)) {
          console.error('Données événements non valides :', events);
          throw new Error('Données événements invalides');
        }

        const presentBadgeIds = events
          .filter(event => {
            if (!event || !event.badgeID || !event.date || !event.event) {
              console.warn('Événement invalide :', event);
              return false;
            }
            const isInEvent = normalizeString(event.event) === 'in';
            const eventDate = normalizeDate(event.date);
            const current = normalizeDate(currentDate);
            const badgeID = normalizeString(event.badgeID);
            console.log(`Vérification événement : badgeID=${event.badgeID}, normalized=${badgeID}, event=${event.event}, date=${event.date}, normalized=${eventDate}, match=${eventDate === current && isInEvent}`);
            return isInEvent && eventDate === current;
          })
          .map(event => normalizeString(event.badgeID));

        console.log('Badge IDs présents :', presentBadgeIds);

        const presentStudents = students
          .filter(student => {
            if (!student || !student.badgeId || !student.username) {
              console.warn('Élève invalide :', student);
              return false;
            }
            const studentBadge = normalizeString(student.badgeId);
            const isPresent = presentBadgeIds.includes(studentBadge);
            console.log(`Vérification élève : name=${student.username}, badgeId=${student.badgeId}, normalized=${studentBadge}, présent=${isPresent}`);
            return isPresent;
          })
          .map(student => ({
            id: student._id,
            name: student.username,
            busNumber: 'Bus 001',
            time: events.find(e => normalizeString(e.badgeID) === normalizeString(student.badgeId) && normalizeString(e.event) === 'in' && normalizeDate(e.date) === normalizeDate(currentDate))?.time || 'N/A'
          }));

        const absentStudents = students
          .filter(student => {
            if (!student || !student.badgeId || !student.username) {
              console.warn('Élève invalide :', student);
              return false;
            }
            const studentBadge = normalizeString(student.badgeId);
            const isAbsent = !presentBadgeIds.includes(studentBadge);
            console.log(`Vérification élève : name=${student.username}, badgeId=${student.badgeId}, normalized=${studentBadge}, absent=${isAbsent}`);
            return isAbsent;
          })
          .map(student => ({
            id: student._id,
            name: student.username,
            busNumber: 'Bus 001'
          }));

        setStudentsData({
          present: presentStudents,
          absent: absentStudents,
          allStudents: students.map(student => ({
            id: student._id,
            name: student.username || 'Nom inconnu',
            busNumber: 'Bus 001'
          }))
        });

        const notificationsData = events
          .filter(event => event && normalizeDate(event.date) === normalizeDate(currentDate))
          .map(event => ({
            id: event._id,
            message: event.rawMessage || 'Message manquant',
            timestamp: new Date(event.createdAt || Date.now()),
            type: normalizeString(event.event) === 'in' ? 'success' : 'info'
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setNotifications(notificationsData);

        if (presentStudents.length === 0 && events.length > 0) {
          console.warn('Aucun élève présent détecté. Vérifiez date, badgeID ou événement.');
        }
      } catch (err) {
        console.error('Erreur fetchStudentsAndEvents :', err);
        toast.error(`Erreur récupération données élèves : ${err.message}`, { position: 'top-right' });
      } finally {
        setStudentsLoading(false);
      }
    };

    if (token) {
      console.log('Token utilisé :', token);
      fetchStopsData();
      fetchStudentsAndEvents();
    } else {
      setError('Utilisateur non authentifié');
      setLoading(false);
      setStudentsLoading(false);
      toast.error('Utilisateur non authentifié', { position: 'top-right' });
    }
  }, [token]);

  const handleGenerateReport = () => {
    const reportData = `
      Rapport Transport Scolaire - ${new Date().toLocaleDateString()}
      ========================================================
      
      STATISTIQUES GÉNÉRALES:
      - Nombre d'arrêts: ${stopsData.length}
      - Élèves présents: ${studentsData.present.length}
      - Élèves absents: ${studentsData.absent.length}
      - Total élèves: ${studentsData.allStudents.length}
      
      DÉTAIL DES ARRÊTS:
      ${stopsData.map((stop, index) => `
      ${index + 1}. ${stop.station}
         - Durée: ${formatDuration(stop.duration)}
         - Arrivée: ${stop.arrivalTime}
         - Départ: ${stop.departureTime}
         - Séquence: ${stop.stopSequence}
      `).join('')}
      
      ÉLÈVES PRÉSENTS:
      ${studentsData.present.map((student, index) => `
      ${index + 1}. ${student.name} (${student.busNumber}) - Monté à: ${student.time}
      `).join('')}
      
      ÉLÈVES ABSENTS:
      ${studentsData.absent.map((student, index) => `
      ${index + 1}. ${student.name} (${student.busNumber})
      `).join('')}
    `;
    
    const blob = new Blob([reportData], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_transport_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Rapport généré !', { position: 'top-right' });
  };

  const filteredPresentStudents = studentsData.present.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAbsentStudents = studentsData.absent.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <FaBus className="text-3xl mb-2" />
              <h3 className="text-lg font-semibold">Arrêts Enregistrés</h3>
              <p className="text-2xl font-bold">{stopsData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <FaCheckCircle className="text-3xl mb-2" />
              <h3 className="text-lg font-semibold">Élèves Présents</h3>
              <p className="text-2xl font-bold">{studentsData.present.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <FaTimesCircle className="text-3xl mb-2" />
              <h3 className="text-lg font-semibold">Élèves Absents</h3>
              <p className="text-2xl font-bold">{studentsData.absent.length}</p>
            </div>
            <button
              onClick={handleGenerateReport}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-3 py-2 rounded-lg transition-colors flex items-center text-sm"
            >
              <FaFileAlt className="mr-1" /> Rapport
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-4 text-white">
          <div className="flex items-center">
            <FaBell className="text-2xl mr-3" />
            <div>
              <h3 className="text-xl font-bold">Notifications Récentes</h3>
              <p className="text-yellow-100 text-sm">Activités en temps réel</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <FaBell className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500">Aucune notification récente</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`flex items-start p-3 rounded-lg border-l-4 ${
                    notification.type === 'success' 
                      ? 'bg-green-50 border-green-500' 
                      : notification.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : notification.type === 'error'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-blue-50 border-blue-500'
                  } animate-fadeIn`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaUserGraduate className="text-3xl mr-3" />
              <div>
                <h3 className="text-2xl font-bold">Liste des Élèves</h3>
                <p className="text-indigo-100">Suivi de présence en temps réel</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{studentsData.allStudents.length}</div>
              <div className="text-indigo-100 text-sm">Total Élèves</div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Rechercher un élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-4 text-gray-400" />
            </div>
          </div>
          {studentsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500">Chargement des élèves...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-4 flex items-center text-green-700">
                  <FaCheckCircle className="mr-2" /> 
                  Élèves Présents ({filteredPresentStudents.length})
                </h4>
                {filteredPresentStudents.length > 0 ? (
                  <div className="bg-white rounded-lg overflow-hidden border border-green-200">
                    <table className="w-full">
                      <thead className="bg-green-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-green-800">#</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-green-800">Nom</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-green-800">Bus</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-green-800">Heure</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-100">
                        {filteredPresentStudents.map((student, index) => (
                          <tr key={student.id} className="hover:bg-green-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-green-700">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-800">{student.name}</td>
                            <td className="px-4 py-3 text-sm text-green-600">{student.busNumber}</td>
                            <td className="px-4 py-3 text-sm text-green-600">{student.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaUserGraduate className="mx-auto text-green-400 text-3xl mb-2" />
                    <p className="text-green-600">Aucun élève présent trouvé</p>
                  </div>
                )}
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-4 flex items-center text-red-700">
                  <FaTimesCircle className="mr-2" /> 
                  Élèves Absents ({filteredAbsentStudents.length})
                </h4>
                {filteredAbsentStudents.length > 0 ? (
                  <div className="bg-white rounded-lg overflow-hidden border border-red-200">
                    <table className="w-full">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-red-800">#</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-red-800">Nom</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-red-800">Bus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-100">
                        {filteredAbsentStudents.map((student, index) => (
                          <tr key={student.id} className="hover:bg-red-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-red-700">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-red-800">{student.name}</td>
                            <td className="px-4 py-3 text-sm text-red-600">{student.busNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaUserGraduate className="mx-auto text-red-400 text-3xl mb-2" />
                    <p className="text-red-600">Aucun élève absent trouvé</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaBus className="text-3xl mr-3" />
              <div>
                <h3 className="text-2xl font-bold">Arrêts du Bus</h3>
                <p className="text-blue-100">Suivi des temps d'arrêt</p>
              </div>
            </div>
            {!loading && !error && (
              <div className="text-right">
                <div className="text-2xl font-bold">{stopsData.length}</div>
                <div className="text-blue-100 text-sm">Total Arrêts</div>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 text-lg">Chargement des données...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <p className="text-red-700 font-medium">Erreur de chargement</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : stopsData.length === 0 ? (
            <div className="text-center py-12">
              <FaBus className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucun arrêt enregistré</p>
              <p className="text-gray-400 text-sm mt-1">Les données apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="block lg:hidden space-y-4">
                {stopsData.map((stop, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-blue-600 mr-2" />
                        <h4 className="text-lg font-semibold text-gray-800 truncate">{stop.station}</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <FaClock className="text-green-600 mr-2 text-xs" />
                        <div>
                          <div className="text-gray-500">Durée d'arrêt</div>
                          <div className="font-medium text-gray-800">{formatDuration(stop.duration)}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Horaires</div>
                        <div className="font-medium text-gray-800 text-xs">
                          {stop.arrivalTime} → {stop.departureTime}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Date</div>
                        <div className="font-medium text-gray-800 text-xs">
                          {formatDate(stop.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden lg:block">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              Station
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                            <div className="flex items-center">
                              <FaClock className="mr-1" />
                              Durée
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                            Arrivée
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                            Départ
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stopsData.map((stop, index) => (
                          <tr
                            key={index}
                            className="hover:bg-blue-50 transition-colors duration-200 animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={stop.station}>
                                {stop.station}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                stop.duration > 60 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {formatDuration(stop.duration)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                              {stop.arrivalTime}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                              {stop.departureTime}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                              {formatDate(stop.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .max-w-full {
          max-width: calc(100vw - 2rem);
        }
        @media (min-width: 1024px) {
          .max-w-full {
            max-width: calc(100vw - 280px);
          }
        }
        @media (max-width: 1280px) {
          .max-w-full {
            max-width: calc(100vw - 1rem);
          }
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}