import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { User, Settings } from 'lucide-react';

export default function UserTypeSelect() {
  const { setUserType } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (type) => {
    setUserType(type);
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center">
    
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-card bg-opacity-90">
        <div className="flex justify-center mb-8">
          <Logo size="large" variant="dark" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Bienvenue sur Bus Scolaire Intelligent</h1>
        <p className="mb-8 text-gray-600 text-center">Sélectionnez votre type d'utilisateur pour continuer</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            className="group bg-white border border-gray-200 p-6 rounded-xl transition-all hover:shadow-card-hover hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center"
            onClick={() => handleSelect('admin')}
          >
            <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
              <Settings size={32} className="text-blue-600" />
            </div>
            <span className="font-semibold text-blue-600">Administrateur</span>
          </button>
          
          <button
            className="group bg-white border border-gray-200 p-6 rounded-xl transition-all hover:shadow-card-hover hover:border-yellow-500 hover:bg-yellow-50 flex flex-col items-center"
            onClick={() => handleSelect('parent')}
          >
            <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
              <User size={32} className="text-yellow-600" />
            </div>
            <span className="font-semibold text-yellow-600">Parent</span>
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">© 2025 Bus Scolaire Intelligent. Tous droits réservés.</p>
    </div>
  );
}