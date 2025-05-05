import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/admin/Sidebar';
import MapDisplay from '../components/dashboard/admin/MapDisplay';
import StatisticsCard from '../components/dashboard/admin/StatisticsCard';
import AlertsCard from '../components/dashboard/admin/AlertsCard';
import { isAuthenticated, getUserType, logout } from '../services/authService';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated() || getUserType() !== 'admin') {
      navigate('/login/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Données pour les cartes (à récupérer depuis l'API)
  const stats = { totalBuses: 12, activeBuses: 8, students: 245 };
  const alerts = [
    { id: 1, severity: 'high', message: 'Bus #3 en retard (15 min)', color: 'text-red-500' },
    { id: 2, severity: 'medium', message: 'Bus #7 hors itinéraire', color: 'text-yellow-500' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} activeItem="map" />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <MapDisplay />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatisticsCard stats={stats} />
            <AlertsCard alerts={alerts} />
            
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
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;