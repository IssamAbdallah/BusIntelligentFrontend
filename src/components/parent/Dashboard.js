import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import BusLocation from './BusLocation';
import TransportInfo from './TransportInfo';

export default function ParentDashboard() {
  const { handleLogout } = useAuth();

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
        <BusLocation />
        <TransportInfo />
      </main>
    </div>
  );
}