import { Search, Filter, MapPin, RefreshCw } from 'lucide-react';

export default function MapSection() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Carte des bus en temps réel</h2>
        
        <div className="flex space-x-2">
          <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
            <RefreshCw size={18} className="mr-1" />
            <span className="text-sm">Actualiser</span>
          </button>
          
          <div className="h-5 border-r border-gray-300 mx-2"></div>
          
          <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
            <Filter size={18} className="mr-1" />
            <span className="text-sm">Filtres</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Rechercher un bus, une école, un trajet..." 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="ml-4 flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Tous les bus
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              Arrêts
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              Écoles
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative h-96">
        <div className="bg-gray-200 h-full w-full">
          {/* Ici sera intégrée une vraie carte (Google Maps, Leaflet, etc.) */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <MapPin size={48} className="text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">Carte interactive des bus</p>
            <p className="text-gray-400 text-sm">Intégration avec Google Maps ou Leaflet</p>
          </div>
        </div>
        
        {/* Légende en overlay */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="text-sm font-semibold mb-2">Légende</h4>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">Bus à l'heure</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs text-gray-600">Bus en léger retard</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-gray-600">Bus en retard important</span>
          </div>
        </div>
      </div>
    </div>
  );
}