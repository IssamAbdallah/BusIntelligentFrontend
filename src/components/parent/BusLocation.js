export default function BusLocation() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Localisation actuelle du bus</h2>
      <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
        {/* Ici sera intégrée une vraie carte (Google Maps, Leaflet, etc.) */}
        <p className="text-gray-500">Carte de localisation du bus de votre enfant</p>
      </div>
    </div>
  );
}