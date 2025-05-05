import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import BusTracker from '../components/dashboard/parent/BusTracker';
import TransportInfo from '../components/dashboard/parent/TransportInfo';
import NotificationsList from '../components/dashboard/parent/NotificationsList';
import { isAuthenticated, getUserType, logout } from '../services/authService';

function ParentDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated() || getUserType() !== 'parent') {
      navigate('/login/parent');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Données pour les composants (à récupérer depuis l'API)
  const transportInfo = {
    line: 'Bus #5',
    driver: 'Mohamed Ben Ali',
    departureTime: '07:30',
    arrivalTime: '08:15',
    status: 'En route - À l\'heure',
    statusColor: 'text-green-600'
  };

  const notifications = [
    { id: 1, time: 'Aujourd\'hui, 08:05', message: 'Votre enfant est monté dans le bus' },
    { id: 2, time: 'Aujourd\'hui, 07:45', message: 'Le bus a quitté le premier arrêt' },
    { id: 3, time: 'Hier, 16:30', message: 'Votre enfant est descendu du bus' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Bus - Espace Parent</h1>
          <button 
            onClick={handleLogout}
            className="bg-green-700 px-4 py-2 rounded-lg hover:bg-green-800 flex items-center"
          >
            <LogOut size={18} className="mr-2" />
            Déconnexion
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <BusTracker />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TransportInfo info={transportInfo} />
          <NotificationsList notifications={notifications} />
        </div>
      </main>
    </div>
  );
}

export default ParentDashboard;