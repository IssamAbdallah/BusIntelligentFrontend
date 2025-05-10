export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-2">Statistiques</h3>
        <p className="text-gray-700">Total des bus: 1</p>
        <p className="text-gray-700">Bus actifs: 1</p>
        <p className="text-gray-700">Élèves: 45</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-2">Alertes récentes</h3>
        <div className="text-red-500">Bus 1 en retard (15 min)</div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-2">Actions rapides</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2">
          Notifier tous
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
          Rapport
        </button>
      </div>
    </div>
  );
}