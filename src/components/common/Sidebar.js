import { useState } from 'react';
import { MapPin, Menu, LogOut, User, Bus, School, ChevronRight, ChevronLeft, Settings, BarChart, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('map');
  const { handleLogout } = useAuth();

  const menuItems = [
    { id: 'map', icon: MapPin, label: 'Carte' },
    { id: 'bus', icon: Bus, label: 'Bus' },
    { id: 'schools', icon: School, label: 'Écoles' },
    { id: 'users', icon: User, label: 'Utilisateurs' },
    { id: 'stats', icon: BarChart, label: 'Statistiques' },
    { id: 'alerts', icon: Bell, label: 'Alertes' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
  ];

  return (
    <div className={`bg-blue-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col h-screen`}>
      <div className="p-4 flex items-center justify-between border-b border-blue-700">
        {sidebarOpen && <Logo size={sidebarOpen ? 'default' : 'small'} variant="primary" />}
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
                onClick={() => setActiveMenu(item.id)}
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
          onClick={handleLogout}
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
