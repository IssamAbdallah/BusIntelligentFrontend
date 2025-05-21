import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icônes personnalisées
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
});

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1068/1068631.png',
  iconSize: [30, 30],
});

// Fonction utilitaire pour calculer la distance (Haversine)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fonction pour interpoler les coordonnées
function interpolateCoords(lat1, lon1, lat2, lon2, distRatio) {
  return [lat1 + (lat2 - lat1) * distRatio, lon1 + (lon2 - lon1) * distRatio];
}

// Données des trajets
const trajet1 = [
  [35.6212102, 10.759478],
  [35.6301472, 10.7469969],
  [35.6305079, 10.7319542],
  [35.6518278, 10.6935104],
  [35.7070496, 10.6750837],
  [35.7151908, 10.6726028],
];

const noms1 = [
  'Départ : Boulangerie Ben Ticha',
  'Arrêt 1 : Carrefour Market Jemmel',
  'Arrêt 2 : معهد أبو القاسم الشابي جمّال',
  'Arrêt 3 : Café Jabnoun',
  'Arrêt 4 : حانوة زياد سعد',
  'Arrivée : Société EMKA MED',
];

const trajet2 = [
  [35.6212102, 10.759478],
  [35.6332329, 10.7606344],
  [35.645564, 10.740518],
  [35.6576035, 10.7087455],
  [35.7092157, 10.6794182],
  [35.7151908, 10.6726028],
];

const noms2 = [
  'Départ : Boulangerie Ben Ticha',
  'Arrêt 1 : جامع الامام سحنون',
  'Arrêt 2 : Ste Ben Jha de ferraille',
  'Arrêt 3 : معصرة التبيني العصرية',
  'Arrêt 4 : مقبرة شهداء الإستعمار',
  'Arrivée : Société EMKA MED',
];

const speedMps = 47.87; // Vitesse en mètres par seconde (80 km/h)
const STOP_DURATION = 5000; // 5 secondes en millisecondes

// Remplacez ces valeurs par les ObjectId réels de votre collection Trip
const tripIdTrajet1 = '6824bf143a78e23e5b01d765'; // ObjectId pour Trajet 1
const tripIdTrajet2 = '6824bf143a78e23e5b01d766'; // ObjectId pour Trajet 2

export default function MapSection({ bus }) {
  const [busPos, setBusPos] = useState(trajet1[0]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [stopTimer, setStopTimer] = useState(null);
  const [currentTrajet, setCurrentTrajet] = useState('trajet1'); // État pour suivre le trajet actuel
  const [savedStations, setSavedStations] = useState([]); // Stocke les stations enregistrées avec leur _id
  const { token } = useAuth();

  // Fonction pour formater l'heure au format HH:MM:SS
  const formatTime = (date) => {
    return date.toTimeString().split(' ')[0]; // Ex: "16:21:00"
  };

  // Fonction pour enregistrer une station dans MongoDB (Stop)
  const handleSaveStation = async (lat, lon, name) => {
    if (!token) {
      toast.error('Utilisateur non authentifié. Veuillez vous connecter.', {
        position: 'top-right',
      });
      return null;
    }

    // Vérifier si la station existe déjà
    const existingStation = savedStations.find(station => station.key === `${lat},${lon},${name}`);
    if (existingStation) {
      console.log('Station déjà enregistrée:', name);
      return existingStation;
    }

    try {
      console.log('Envoi de la requête Stop:', { stop_id: uuidv4(), stop_name: name, stop_lat: lat, stop_lon: lon });

      const response = await fetch('http://localhost:80/api/stops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stop_id: uuidv4(),
          stop_name: name,
          stop_lat: lat,
          stop_lon: lon,
        }),
      });

      const data = await response.json();
      console.log('Réponse de l\'API Stop:', data);

      if (response.ok) {
        toast.success('Station enregistrée avec succès !', {
          position: 'top-right',
        });
        // Ajouter la station enregistrée avec son _id
        setSavedStations((prev) => [...prev, { ...data, key: `${lat},${lon},${name}` }]);
        return data;
      } else {
        toast.error(`Erreur lors de l'enregistrement de la station : ${data.message}`, {
          position: 'top-right',
        });
        return null;
      }
    } catch (error) {
      console.error('Erreur réseau dans handleSaveStation:', error);
      toast.error(`Erreur réseau : ${error.message}`, {
        position: 'top-right',
      });
      return null;
    }
  };

  // Fonction pour enregistrer un arrêt dans StopTime
  const handleSaveStopTime = async (trip, stop, stop_sequence) => {
    if (!token) {
      toast.error('Utilisateur non authentifié. Veuillez vous connecter.', {
        position: 'top-right',
      });
      return;
    }

    const now = new Date();
    const arrival_time = formatTime(now);
    const departure_time = formatTime(new Date(now.getTime() + STOP_DURATION));

    try {
      console.log('Envoi de la requête StopTime:', {
        trip,
        stop: stop._id,
        arrival_time,
        departure_time,
        stop_sequence,
      });

      const response = await fetch('http://localhost:80/api/stoptimes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trip,
          stop: stop._id,
          arrival_time,
          departure_time,
          stop_sequence,
        }),
      });

      const data = await response.json();
      console.log('Réponse de l\'API StopTime:', data);

      if (response.ok) {
        toast.success(`Arrêt à ${stop.stop_name} enregistré avec succès !`, {
          position: 'top-right',
        });
      } else {
        toast.error(`Erreur lors de l'enregistrement de l'arrêt : ${data.message}`, {
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Erreur réseau dans handleSaveStopTime:', error);
      toast.error(`Erreur réseau : ${error.message}`, {
        position: 'top-right',
      });
    }
  };

  // Logique de déplacement du bus
  useEffect(() => {
    let interval;
    if (!isStopped) {
      const trajets = currentTrajet === 'trajet1' ? trajet1 : trajet2.slice().reverse();
      const noms = currentTrajet === 'trajet1' ? noms1 : noms2.slice().reverse();
      const tripId = currentTrajet === 'trajet1' ? tripIdTrajet1 : tripIdTrajet2;

      interval = setInterval(() => {
        const [lat1, lon1] = trajets[segmentIndex];
        const [lat2, lon2] = trajets[segmentIndex + 1];
        const dist = haversineDistance(lat1, lon1, lat2, lon2);
        const progressMeters = segmentProgress + speedMps;

        if (progressMeters >= dist) {
          // Arrivée à la station
          setBusPos([lat2, lon2]);
          setSegmentProgress(0);
          setIsStopped(true);

          const stopIndex = segmentIndex + 1;
          if (stopIndex < trajets.length) {
            handleSaveStation(trajets[stopIndex][0], trajets[stopIndex][1], noms[stopIndex]).then((stop) => {
              if (stop) {
                handleSaveStopTime(tripId, stop, stopIndex);
              }
            });
          }

          setStopTimer(
            setTimeout(() => {
              if (segmentIndex + 1 < trajets.length - 1) {
                // Reprendre le mouvement après 5 secondes
                setSegmentIndex(segmentIndex + 1);
                setIsStopped(false);
              } else if (currentTrajet === 'trajet1') {
                // Fin de trajet1, passer à trajet2 (retour)
                setCurrentTrajet('trajet2');
                setSegmentIndex(0);
                setBusPos(trajet2[trajet2.length - 1]); // Commencer à la dernière station de trajet2
                setIsStopped(false);
                toast.info('Début du trajet de retour via Trajet 2 !', {
                  position: 'top-right',
                });
              } else {
                // Fin de trajet2, trajet complet terminé
                clearInterval(interval);
                toast.info('Trajet aller-retour terminé !', {
                  position: 'top-right',
                });
              }
            }, STOP_DURATION)
          );
        } else {
          // Déplacement entre les stations
          const ratio = progressMeters / dist;
          const [lat, lon] = interpolateCoords(lat1, lon1, lat2, lon2, ratio);
          setBusPos([lat, lon]);
          setSegmentProgress(progressMeters);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, [segmentIndex, segmentProgress, isStopped, stopTimer, currentTrajet, token]);

  // Calcul du temps estimé d'arrivée
  function getTimeToArrival(stopCoords) {
    const trajets = currentTrajet === 'trajet1' ? trajet1 : trajet2.slice().reverse();
    let totalDist = 0;
    let found = false;
    for (let i = segmentIndex; i < trajets.length - 1; i++) {
      const [start, end] = [trajets[i], trajets[i + 1]];
      totalDist += haversineDistance(...start, ...end);
      if (end[0] === stopCoords[0] && end[1] === stopCoords[1]) {
        found = true;
        break;
      }
    }
    if (!found) return null;
    totalDist -= segmentProgress;
    const timeSeconds = totalDist / speedMps + (trajets.length - segmentIndex - 1) * (STOP_DURATION / 1000);
    return Math.round(timeSeconds / 60);
  }

  // Trajets pour l'affichage
  const trajet2Reversed = trajet2.slice().reverse();
  const noms2Reversed = noms2.slice().reverse();

  return (
    <div>
      <MapContainer center={[35.67, 10.72]} zoom={12.5} className="h-screen w-full">
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueurs des arrêts pour le trajet 1 */}
        {trajet1.map((pos, i) => (
          <Marker key={`t1-${i}`} position={pos} icon={customIcon}>
            <Popup>
              {noms1[i]}
              <br />
              {currentTrajet === 'trajet1' && i > 0 && i < trajet1.length - 1
                ? `Temps estimé: ${getTimeToArrival(pos) ?? '-'} min`
                : ''}
            </Popup>
          </Marker>
        ))}

        {/* Marqueurs pour le trajet 2 (inversé pour le retour) */}
        {trajet2Reversed.map((pos, i) => (
          <Marker key={`t2-${i}`} position={pos} icon={customIcon}>
            <Popup>
              {noms2Reversed[i]}
              <br />
              {currentTrajet === 'trajet2' && i > 0 && i < trajet2Reversed.length - 1
                ? `Temps estimé: ${getTimeToArrival(pos) ?? '-'} min`
                : ''}
            </Popup>
          </Marker>
        ))}

        {/* Lignes des trajets */}
        <Polyline positions={trajet1} pathOptions={{ color: 'blue', weight: 4 }} />
        <Polyline positions={trajet2} pathOptions={{ color: 'orange', weight: 4 }} />

        {/* Marqueur du bus */}
        <Marker position={busPos} icon={busIcon}>
          <Popup>Bus en mouvement ({currentTrajet === 'trajet1' ? 'Trajet 1 Aller' : 'Trajet 2 Retour'})</Popup>
        </Marker>
      </MapContainer>
      <ToastContainer />
    </div>
  );
}