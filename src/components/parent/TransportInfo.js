export default function TransportInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Informations du transport</h3>
        <p className="mb-2"><strong>Ligne:</strong> Bus #5</p>
        <p className="mb-2"><strong>Chauffeur:</strong> Mohamed Ben Ali</p>
        <p className="mb-2"><strong>Heure de départ:</strong> 07:30</p>
        <p className="mb-2"><strong>Heure d'arrivée estimée:</strong> 08:15</p>
        <p className="mb-2 text-green-600 font-medium">En route - À l'heure</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Notifications</h3>
        <div className="mb-3 pb-3 border-b border-gray-200">
          <p className="text-sm text-gray-500">Aujourd'hui, 08:05</p>
          <p>Votre enfant est monté dans le bus</p>
        </div>
        <div className="mb-3 pb-3 border-b border-gray-200">
          <p className="text-sm text-gray-500">Aujourd'hui, 07:45</p>
          <p>Le bus a quitté le premier arrêt</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Hier, 16:30</p>
          <p>Votre enfant est descendu du bus</p>
        </div>
      </div>
    </div>
  );
}