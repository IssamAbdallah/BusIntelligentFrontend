import { useState, useEffect } from 'react';
import { LogOut, ChevronRight, ChevronLeft, Moon, Sun } from 'lucide-react';
import { FaUserGraduate, FaUser, FaBus, FaCar } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import { IoStatsChartSharp, IoNotifications } from "react-icons/io5";

export default function Sidebar({ onSectionChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');

  // Mise à jour de l'horloge
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Items de menu avec des métadonnées améliorées
  const menuItems = [
    { 
      id: 'dashboard', 
      icon: FaLocationDot, 
      label: 'Localisation', 
      count: null,
      badge: { text: 'LIVE', color: 'green' }
    },
    { 
      id: 'users', 
      icon: FaUser, 
      label: 'Utilisateurs', 
    },
    { 
      id: 'students', 
      icon: FaUserGraduate, 
      label: 'Élèves', 
    },
    { 
      id: 'drivers', 
      icon: FaCar, 
      label: 'Conducteurs', 
    },
    { 
      id: 'buses', 
      icon: FaBus, 
      label: 'Bus', 
    },
    { 
      id: 'stats', 
      icon: IoStatsChartSharp, 
      label: 'Statistiques', 
      count: null,
    },
    { 
      id: 'alerts', 
      icon: IoNotifications, 
      label: 'Alertes', 
      badge: { text: 'URGENT', color: 'red' }
    },
  ];

  // Regroupement des éléments du menu par catégorie
  const menuGroups = {
    "Supervision": ['dashboard', 'stats', 'alerts'],
    "Gestion": ['users', 'students', 'drivers', 'buses']
  };

  // Filtrer les éléments du menu en fonction de la recherche
  const filteredMenuItems = menuItems.filter(item => 
    searchQuery === '' || 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour basculer le mode clair/sombre
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Ici vous pouvez ajouter la logique pour changer le thème de toute l'application
  };

  // Classes conditionnelles en fonction du mode
  const themeClasses = darkMode ? 
    'bg-gray-900 text-white border-gray-700' : 
    'bg-white text-gray-700 border-gray-200';

  return (
    <div className={`${themeClasses} ${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 flex flex-col h-screen shadow-lg z-10 border-r`}>
      {/* En-tête */}
      <div className={`p-5 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {sidebarOpen ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-xl">BSI</span>
            </div>
            <div className="ml-3">
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>BusScolaireIntelligent</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Gestion de transport scolaire
              </p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="font-bold text-white text-xl">BSI</span>
          </div>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            darkMode ? 'hover:bg-gray-800 text-blue-400' : 'hover:bg-gray-100 text-blue-600'
          } transition-all`} 
          aria-label={sidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      
      {/* Date et heure */}
      {sidebarOpen && (
        <div className={`px-5 py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } border-b`}>
          <p className="font-medium">
            {time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <p>
            {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {searchQuery ? (
          // Affichage des résultats de recherche
          <div className="px-4 mb-4">
            {sidebarOpen && <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Résultats ({filteredMenuItems.length})
            </p>}
            <ul className="space-y-1">
              {filteredMenuItems.map(item => (
                <li key={item.id}>
                  <button
                    className={`flex items-center w-full rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? `${activeMenu === item.id ? 'bg-blue-900/40 text-blue-300' : 'text-gray-300 hover:bg-gray-800'}`
                        : `${activeMenu === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`
                    } ${sidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
                    onClick={() => {
                      setActiveMenu(item.id);
                      onSectionChange(item.id);
                      setSearchQuery('');
                    }}
                  >
                    <div className={`relative ${
                      darkMode
                        ? `${activeMenu === item.id ? 'text-blue-300' : 'text-gray-400'}`
                        : `${activeMenu === item.id ? 'text-blue-700' : 'text-gray-500'}`
                    }`}>
                      <item.icon size={18} />
                      {item.count > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
                          {item.count > 9 ? '9+' : item.count}
                        </span>
                      )}
                    </div>
                    {sidebarOpen && (
                      <div className="ml-3 flex-1 overflow-hidden">
                        <p className={`truncate ${activeMenu === item.id ? 'font-medium' : ''}`}>
                          {item.label}
                        </p>
                        <p className={`text-xs truncate ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Affichage normal du menu avec catégories
          <>
            {Object.entries(menuGroups).map(([groupName, itemIds]) => (
              <div key={groupName} className="mb-5">
                {sidebarOpen && (
                  <h2 className={`text-xs font-semibold uppercase tracking-wider px-5 mb-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    {groupName}
                  </h2>
                )}
                <ul className="space-y-1 px-3">
                  {menuItems
                    .filter(item => itemIds.includes(item.id))
                    .map(item => (
                      <li key={item.id}
                          onMouseEnter={() => !sidebarOpen && setShowTooltip(item.id)}
                          onMouseLeave={() => setShowTooltip('')}
                          className="relative">
                        <button
                          className={`flex items-center w-full rounded-xl transition-all duration-200 ${
                            darkMode 
                              ? `${activeMenu === item.id ? 'bg-blue-900/40 text-blue-300' : 'text-gray-300 hover:bg-gray-800'}`
                              : `${activeMenu === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`
                          } ${sidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
                          onClick={() => {
                            setActiveMenu(item.id);
                            onSectionChange(item.id);
                          }}
                        >
                          <div className={`relative ${
                            darkMode
                              ? `${activeMenu === item.id ? 'text-blue-300' : 'text-gray-400'}`
                              : `${activeMenu === item.id ? 'text-blue-700' : 'text-gray-500'}`
                          }`}>
                            <item.icon size={sidebarOpen ? 18 : 20} />
                          </div>
                          
                          {sidebarOpen && (
                            <div className="flex flex-1 items-center justify-between ml-3">
                              <span className={`${activeMenu === item.id ? 'font-medium' : ''}`}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                                  item.badge.color === 'red' ? 'bg-red-500' : 
                                  item.badge.color === 'green' ? 'bg-green-500' : 
                                  'bg-blue-500'
                                }`}>
                                  {item.badge.text}
                                </span>
                              )}
                              {item.count > 0 && !item.badge && item.id !== 'alerts' && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {item.count}
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                        
                        {/* Tooltip pour la sidebar réduite */}
                        {!sidebarOpen && showTooltip === item.id && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap z-50">
                            <div className="flex items-center mb-1">
                              <span className="font-medium">{item.label}</span>
                              {item.badge && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full text-white ${
                                  item.badge.color === 'red' ? 'bg-red-500' : 
                                  item.badge.color === 'green' ? 'bg-green-500' : 
                                  'bg-blue-500'
                                }`}>
                                  {item.badge.text}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-300">{item.description}</p>
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </nav>
      
      {/* Section du bas */}
      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {sidebarOpen && (
          <div className={`p-4 m-3 rounded-xl ${
            darkMode ? 'bg-gray-800' : 'bg-blue-50'
          }`}>
            <div className="flex items-center text-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <FaUser className="text-white" size={14} />
              </div>
              <div className="ml-3">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Administrateur
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  admin2@gmail.com
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Boutons de thème et déconnexion améliorés */}
        <div className={`p-4 flex items-center ${!sidebarOpen ? 'justify-center' : 'justify-between'}`}>
          {/* Bouton Thème */}
          <button 
            onClick={toggleDarkMode}
            className={`flex items-center justify-center ${
              sidebarOpen ? 'w-12 h-12' : 'w-10 h-10'
            } rounded-full transition-all ${
              darkMode 
                ? `${sidebarOpen ? 'bg-gray-800 hover:bg-gray-700' : 'hover:bg-gray-800'} text-blue-400` 
                : `${sidebarOpen ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100'} text-blue-600`
            }`}
            onMouseEnter={() => !sidebarOpen && setShowTooltip('theme')}
            onMouseLeave={() => setShowTooltip('')}
            aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {darkMode ? <Sun size={sidebarOpen ? 22 : 18} /> : <Moon size={sidebarOpen ? 22 : 18} />}
            {!sidebarOpen && showTooltip === 'theme' && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-50">
                {darkMode ? 'Mode clair' : 'Mode sombre'}
              </div>
            )}
          </button>
          
          {/* Bouton Déconnexion */}
          <button 
            onClick={() => window.location.href = '/user-type-select'} 
            className={`flex items-center justify-center ${
              sidebarOpen ? 'px-4 py-3' : 'w-10 h-10'
            } rounded-xl transition-all ${
              darkMode 
                ? `${sidebarOpen ? 'bg-red-900/30 hover:bg-red-900/40' : 'hover:bg-red-900/30'} text-red-300` 
                : `${sidebarOpen ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-red-50'} text-red-600`
            }`}
            onMouseEnter={() => !sidebarOpen && setShowTooltip('logout')}
            onMouseLeave={() => setShowTooltip('')}
            aria-label="Déconnexion"
          >
            <LogOut size={sidebarOpen ? 20 : 18} />
            {sidebarOpen && <span className="ml-2 font-medium">Déconnexion</span>}
            {!sidebarOpen && showTooltip === 'logout' && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-50">
                Déconnexion
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}