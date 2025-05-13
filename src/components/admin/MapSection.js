// Importation des composants nécessaires depuis react-leaflet
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// Importation de Leaflet pour gérer les icônes
import L from 'leaflet';
// Hooks React pour la gestion d'état et d'effet
import React, { useEffect, useState } from 'react';
// Importation du CSS de Leaflet pour le style de la carte
import 'leaflet/dist/leaflet.css';

// Définition d’une icône personnalisée pour les arrêts (petite icône noire)
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
});

// Définition d’une icône pour le bus (icône de bus)
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1068/1068631.png',
  iconSize: [30, 30],
});

// Fonction utilitaire pour calculer la distance entre deux points GPS (formule de Haversine)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Rayon de la Terre en mètres
  const toRad = x => (x * Math.PI) / 180; // Conversion degrés → radians
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en mètres
}

// Fonction pour interpoler une position entre deux points en fonction d’un ratio (pour simuler le déplacement du bus)
function interpolateCoords(lat1, lon1, lat2, lon2, distRatio) {
  return [
    lat1 + (lat2 - lat1) * distRatio,
    lon1 + (lon2 - lon1) * distRatio,
  ];
}

// Coordonnées GPS pour le trajet 1 (liste des arrêts)
const trajet1 = [
  [35.6212102, 10.759478],
  [35.6301472, 10.7469969],
  [35.6305079, 10.7319542],
  [35.6518278, 10.6935104],
  [35.7070496, 10.6750837],
  [35.7151908, 10.6726028],
];

// Noms correspondants aux arrêts de trajet1
const noms1 = [
  'Départ : Boulangerie Ben Ticha',
  'Arrêt 1 : Carrefour Market Jemmel',
  'Arrêt 2 : معهد أبو القاسم الشابي جمّال',
  'Arrêt 3 : Café Jabnoun',
  'Arrêt 4 : حانوة زياد سعد',
  'Arrivée : Société EMKA MED',
];

// Coordonnées GPS pour le trajet 2 (un autre itinéraire)
const trajet2 = [
  [35.6212102, 10.759478],
  [35.6332329, 10.7606344],
  [35.645564, 10.740518],
  [35.6576035, 10.7087455],
  [35.7092157, 10.6794182],
  [35.7151908, 10.6726028],
];

// Noms correspondants aux arrêts de trajet2
const noms2 = [
  'Départ : Boulangerie Ben Ticha',
  'Arrêt 1 : جامع الامام سحنون',
  'Arrêt 2 : Ste Ben Jha de ferraille',
  'Arrêt 3 : معصرة التبيني العصرية',
  'Arrêt 4 : مقبرة شهداء الإستعمار',
  'Arrivée : Société EMKA MED',
];

// Vitesse du bus en mètre par seconde (30 km/h)
const speedMps = 8.33;

// Composant principal
export default function BusMap() {
  // Position actuelle du bus (initialement le premier arrêt)
  const [busPos, setBusPos] = useState(trajet1[0]);
  // Index du segment actuellement parcouru (de i à i+1)
  const [segmentIndex, setSegmentIndex] = useState(0);
  // Progression sur le segment actuel en mètres
  const [segmentProgress, setSegmentProgress] = useState(0);

  // useEffect pour animer le déplacement du bus
  useEffect(() => {
    const interval = setInterval(() => {
      const [lat1, lon1] = trajet1[segmentIndex];
      const [lat2, lon2] = trajet1[segmentIndex + 1];
      const dist = haversineDistance(lat1, lon1, lat2, lon2);
      const progressMeters = segmentProgress + 20; // On avance de 20m par seconde

      if (progressMeters >= dist) {
        // Si on atteint la fin du segment actuel
        if (segmentIndex + 1 < trajet1.length - 1) {
          // Passer au prochain segment
          setSegmentIndex(segmentIndex + 1);
          setSegmentProgress(0);
          setBusPos([lat2, lon2]);
        } else {
          // Arrivée au dernier arrêt : on arrête l’intervalle
          clearInterval(interval);
        }
      } else {
        // Sinon, on calcule la nouvelle position interpolée
        const ratio = progressMeters / dist;
        const [lat, lon] = interpolateCoords(lat1, lon1, lat2, lon2, ratio);
        setBusPos([lat, lon]);
        setSegmentProgress(progressMeters);
      }
    }, 1000); // Exécuté chaque seconde
    return () => clearInterval(interval); // Nettoyage si le composant se démonte
  }, [segmentIndex, segmentProgress]); // Dépend des changements de segment ou de progression

  // Fonction pour estimer le temps d’arrivée à un arrêt donné
  function getTimeToArrival(stopCoords) {
    let totalDist = 0;
    let found = false;
    for (let i = segmentIndex; i < trajet1.length - 1; i++) {
      const [start, end] = [trajet1[i], trajet1[i + 1]];
      totalDist += haversineDistance(...start, ...end);
      if (end[0] === stopCoords[0] && end[1] === stopCoords[1]) {
        found = true;
        break;
      }
    }
    if (!found) return null;
    totalDist -= segmentProgress; // On retire la distance déjà parcourue
    const timeSeconds = totalDist / speedMps;
    return Math.round(timeSeconds / 60); // Retour en minutes
  }

  // Rendu du composant : la carte
  return (
    <MapContainer center={[35.67, 10.72]} zoom={12.5} className="h-screen w-full">
      {/* Fond de carte OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marqueurs des arrêts pour le trajet 1 avec temps estimé */}
      {trajet1.map((pos, i) => (
        <Marker key={`t1-${i}`} position={pos} icon={customIcon}>
          <Popup>
            {noms1[i]}<br />
            {/* Afficher temps estimé sauf pour le premier et le dernier */}
            {i > 0 && i < trajet1.length
              ? `Temps estimé: ${getTimeToArrival(pos) ?? '-'} min`
              : ''}
          </Popup>
        </Marker>
      ))}

      {/* Marqueurs pour le trajet 2 (sans estimation) */}
      {trajet2.map((pos, i) => (
        <Marker key={`t2-${i}`} position={pos} icon={customIcon}>
          <Popup>{noms2[i]}</Popup>
        </Marker>
      ))}

      {/* Ligne de trajet 1 en bleu */}
      <Polyline positions={trajet1} pathOptions={{ color: 'blue', weight: 4 }} />
      {/* Ligne de trajet 2 en orange */}
      <Polyline positions={trajet2} pathOptions={{ color: 'orange', weight: 4 }} />

      {/* Marqueur pour la position actuelle du bus */}
      <Marker position={busPos} icon={busIcon}>
        <Popup>Bus en mouvement (Trajet 1)</Popup>
      </Marker>
    </MapContainer>
  );
}