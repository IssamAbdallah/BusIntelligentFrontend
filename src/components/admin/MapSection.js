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
  const R = 6371000; // Rayon de la Terre en mètres
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Données du trajet réaliste
const trajet = [
  [35.7770, 10.8262], // Départ : Place du 7 Novembre, Monastir
  [35.7592, 10.7955], // Arrêt 1 : Mosquée Saïda, Monastir
  [35.7423, 10.7608], // Arrêt 2 : École Primaire El Fath, Jemmal
  [35.7301, 10.7312], // Arrêt 3 : Café El Hana, Jemmal
  [35.7225, 10.6978], // Arrêt 4 : Pharmacie Jemmal Centre
  [35.7151908, 10.6726028], // Arrivée : Société EMKA MED
];

const noms = [
  'Départ : Place du 7 Novembre',
  'Arrêt 1 : Mosquée Saïda',
  'Arrêt 2 : École Primaire El Fath',
  'Arrêt 3 : Café El Hana',
  'Arrêt 4 : Pharmacie Jemmal Centre',
  'Arrivée : Société EMKA MED',
];

// ObjectId pour le trajet (remplacez par l'ObjectId réel de votre collection Trip)
const tripId = '6824bf143a78e23e5b01d765'; // À remplacer par l'ObjectId réel

// Tolérance pour considérer que le bus est à une station (en mètres)
const STOP_TOLERANCE = 50;

export default function MapSection({ bus }) {
  const [busPos, setBusPos] = useState(trajet[0]); // Position initiale par défaut
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
        toast.success(`Station "${name}" enregistrée avec succès !`, {
          position: 'top-right',
        });
        const newStation = { ...data, key: `${lat},${lon},${name}` };
        setSavedStations((prev) => [...prev, newStation]);
        return newStation;
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
    const departure_time = formatTime(new Date(now.getTime() + 5000)); // 5 secondes d'arrêt

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
        toast.success(`Arrêt à "${stop.stop_name}" enregistré avec succès !`, {
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

  // Récupérer la dernière position GPS depuis MongoDB et vérifier les arrêts
  useEffect(() => {
    const fetchLastPosition = async () => {
      try {
        const response = await fetch('http://localhost:80/api/gpss', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const gpsData = await response.json();
          if (gpsData.length > 0) {
            const lastPosition = gpsData[0]; // Dernière position (la plus récente)
            const { latitude, longitude } = lastPosition;
            setBusPos([latitude, longitude]);
            toast.info(`Position du bus chargée : [${latitude}, ${longitude}]`, {
              position: 'top-right',
            });

            // Vérifier si la position correspond à une station
            trajet.forEach((pos, index) => {
              const distance = haversineDistance(latitude, longitude, pos[0], pos[1]);
              if (distance <= STOP_TOLERANCE) {
                console.log(`Bus détecté à la station : ${noms[index]}`);
                handleSaveStation(pos[0], pos[1], noms[index]).then((stop) => {
                  if (stop) {
                    handleSaveStopTime(tripId, stop, index);
                  }
                });
              }
            });
          } else {
            toast.info('Aucune position GPS trouvée, utilisation de la position par défaut.', {
              position: 'top-right',
            });
          }
        } else {
          toast.error('Erreur lors de la récupération de la dernière position.', {
            position: 'top-right',
          });
        }
      } catch (error) {
        console.error('Erreur réseau dans fetchLastPosition:', error);
        toast.error(`Erreur réseau : ${error.message}`, {
          position: 'top-right',
        });
      }
    };

    if (token) {
      fetchLastPosition();
    } else {
      toast.error('Utilisateur non authentifié. Veuillez vous connecter.', {
        position: 'top-right',
      });
    }
  }, [token]);

  return (
    <div>
      <MapContainer center={[35.746, 10.749]} zoom={12.5} className="h-screen w-full">
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueurs des arrêts pour le trajet */}
        {trajet.map((pos, i) => (
          <Marker key={`t-${i}`} position={pos} icon={customIcon}>
            <Popup>{noms[i]}</Popup>
          </Marker>
        ))}

        {/* Ligne du trajet */}
        <Polyline positions={trajet} pathOptions={{ color: 'blue', weight: 4 }} />

        {/* Marqueur du bus */}
        <Marker position={busPos} icon={busIcon}>
          <Popup>Position actuelle du bus</Popup>
        </Marker>
      </MapContainer>
      <ToastContainer />
    </div>
  );
}