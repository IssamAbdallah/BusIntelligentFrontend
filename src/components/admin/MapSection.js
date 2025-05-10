import { Search, Filter, RefreshCw } from 'lucide-react';

export default function MapSection() {
  const position = [36.8065, 10.1815]; // Tunis, Tunisie (peut être utilisé pour personnaliser l'URL si nécessaire)

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden h-full flex flex-col">
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
        <div className="flex w-full">
          
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
      
      <div className="relative flex-1 w-full">
        <div className="h-full w-full">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345095696!2d144.95373631531598!3d-37.816279179751824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f2f5e1d1%3A0x1efcf2c273153b14!2sGoogle!5e0!3m2!1sen!2sus!4v1630645032032!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        
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