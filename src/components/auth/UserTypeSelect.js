import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';
import { User, Settings } from 'lucide-react';

export default function UserTypeSelect() {
  const { setUserType } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-card">
        <div className="flex justify-center mb-8">
          <Logo size="large" variant="dark" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Bienvenue sur Bus Scolaire Intelligent</h1>
        <p className="mb-8 text-gray-600 text-center">Sélectionnez votre type d'utilisateur pour continuer</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            className="group bg-white border border-gray-200 p-6 rounded-xl transition-all hover:shadow-card-hover hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center"
            onClick={() => setUserType('admin')}
          >
            <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
              <Settings size={32} className="text-blue-600" />
            </div>
            <span className="font-semibold text-blue-600">Administrateur</span>
          </button>
          
          <button
            className="group bg-white border border-gray-200 p-6 rounded-xl transition-all hover:shadow-card-hover hover:border-green-500 hover:bg-green-50 flex flex-col items-center"
            onClick={() => setUserType('parent')}
          >
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
              <User size={32} className="text-green-600" />
            </div>
            <span className="font-semibold text-green-600">Parent</span>
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">© 2025 Smart Bus. Tous droits réservés.</p>
    </div>
  );
}
