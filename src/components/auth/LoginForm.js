import { ChevronLeft, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { userType, setUserType, loginFormData, handleInputChange, handleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler une requête réseau
    setTimeout(() => {
      handleLogin();
      setIsLoading(false);
    }, 800);
  };

  const primaryColor = userType === 'admin' ? 'blue' : 'green';
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-card">
        <button 
          className={`flex items-center text-${primaryColor}-600 mb-6 hover:text-${primaryColor}-700 transition-colors`}
          onClick={() => navigate('/user-type-select')}
        >
          <ChevronLeft size={20} className="mr-1" />
          Retour
        </button>
        
        <div className="flex justify-center mb-6">
          <Logo size="default" variant={userType === 'admin' ? 'admin' : 'parent'} />
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Connexion {userType === 'admin' ? 'Administrateur' : 'Parent'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 transition-colors`}
                id="email"
                name="email"
                type="email"
                placeholder="Votre email"
                value={loginFormData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 transition-colors`}
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'} // Basculer entre text et password
                placeholder="Votre mot de passe"
                value={loginFormData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={`h-4 w-4 text-${primaryColor}-600 focus:ring-${primaryColor}-500 border-gray-300 rounded`}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            
            <a href="#" className={`text-sm text-${primaryColor}-600 hover:text-${primaryColor}-700`}>
              Mot de passe oublié?
            </a>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center
              ${userType === 'admin' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-green-600 hover:bg-green-700'
              } transition-colors`}
          >
            {isLoading ? (
              <div className="spinner border-2 w-5 h-5"></div>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Se connecter
              </>
            )}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">© 2025 Smart Bus. Tous droits réservés.</p>
    </div>
  );
}