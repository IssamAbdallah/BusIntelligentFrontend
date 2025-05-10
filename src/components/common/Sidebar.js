import { useState } from 'react';
import { MapPin, Users, BarChart2, Bus, Bell, LogOut, ChevronRight, ChevronLeft, CarFront} from 'lucide-react';

export default function Sidebar({ onSectionChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: MapPin, label: 'Localisation' },
    { id: 'users', icon: Users, label: 'Utilisateurs' },
    { id: 'drivers', icon: CarFront, label: 'Conducteurs'},
    { id: 'buses', icon: Bus, label: 'Bus' },
    { id: 'stats', icon: BarChart2, label: 'Statistiques' },
    { id: 'notifications', icon: Bell, label: 'Alertes' },
  
  ];

  return (
    <div className={`bg-blue-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col h-screen`}>
      <div className="p-4 flex items-center justify-between border-b border-blue-700">
        {sidebarOpen && <h1 className="text-xl font-bold text-white">Dashboard</h1>}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
          aria-label={sidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
        >
          {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.id} className="px-3">
              <button
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeMenu === item.id 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-700/50'
                }`}
                onClick={() => {
                  setActiveMenu(item.id);
                  onSectionChange(item.id);
                }}
              >
                <item.icon size={22} className={`${!sidebarOpen && 'mx-auto'}`} />
                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-700">
        <button 
          onClick={() => window.location.href = '/user-type-select'}
          className="flex items-center p-2 w-full hover:bg-blue-700/70 rounded-lg transition-colors text-blue-100"
          aria-label="Déconnexion"
        >
          <LogOut size={22} className={`${!sidebarOpen && 'mx-auto'}`} />
          {sidebarOpen && <span className="ml-2 font-medium">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}