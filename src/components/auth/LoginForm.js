import { ChevronLeft, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { userType, loginFormData, handleInputChange, handleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [formFocus, setFormFocus] = useState(null);
  const navigate = useNavigate();

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      handleLogin();
      setIsLoading(false);
    }, 800);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordMessage('');
    setForgotPasswordError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:80/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordMessage('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
        setForgotPasswordEmail('');
      } else {
        setForgotPasswordError(data.message || 'Erreur lors de l\'envoi de la demande de réinitialisation.');
      }
    } catch (error) {
      setForgotPasswordError('Erreur réseau : ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Génération d'éléments flottants décoratifs pour l'arrière-plan
  const renderFloatingElements = () => {
    const elements = [];
    const shapes = [
      "M10,0 L20,20 L0,20 Z", // triangle
      "M10,0 C0,0 0,10 10,10 C20,10 20,0 10,0 Z", // goutte
      "M0,0 L20,0 L20,20 L0,20 Z" // carré
    ];
    
    for (let i = 0; i < 10; i++) {
      const size = Math.floor(Math.random() * 20) + 10;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const opacity = (Math.random() * 0.15) + 0.05;
      const delay = Math.random() * 5;
      const duration = (Math.random() * 5) + 10;
      
      elements.push(
        <div 
          key={i}
          className="absolute z-0"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: opacity,
            animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`
          }}
        >
          <svg width={size} height={size} viewBox="0 0 20 20">
            <path 
              d={shape} 
              fill={userType === 'admin' ? 
                (Math.random() > 0.5 ? '#1E40AF' : '#60A5FA') : 
                (Math.random() > 0.5 ? '#F59E0B' : '#FCD34D')
              } 
            />
          </svg>
        </div>
      );
    }
    return elements;
  };

  const primaryColor = userType === 'admin' ? 'blue' : 'yellow';
  const primaryColorShade = userType === 'admin' ? 'blue-600' : 'yellow-600';
  const primaryColorLight = userType === 'admin' ? 'blue-100' : 'yellow-100';
  const primaryColorMid = userType === 'admin' ? 'blue-300' : 'yellow-300';
  
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Animation keyframes */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(-20px) rotate(10deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 5px 2px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.5); }
            100% { box-shadow: 0 0 5px 2px rgba(59, 130, 246, 0.3); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .slide-up-1 { animation: slideUp 0.8s ease-out 0.1s forwards; }
          .slide-up-2 { animation: slideUp 0.8s ease-out 0.3s forwards; }
          .slide-up-3 { animation: slideUp 0.8s ease-out 0.5s forwards; }
          
          .input-focus-effect {
            position: relative;
            overflow: hidden;
          }
          
          .input-focus-effect::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(to right, 
              ${userType === 'admin' ? '#2563EB, #60A5FA' : '#F59E0B, #FCD34D'});
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }
          
          .input-focus-effect.active::after {
            transform: scaleX(1);
            transform-origin: left;
          }
          
          .spinner {
            border-radius: 50%;
            border-top-color: transparent;
            border-left-color: transparent;
            animation: spin 0.8s linear infinite;
          }
          
          .shimmer {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            animation: shimmer 2s infinite;
            transform: skewX(-20deg);
          }
        `}
      </style>

      {/* Arrière-plan dynamique avec image et effet de parallaxe */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center" 
        style={{
          backgroundImage: "url('/api/placeholder/1920/1080')",
          filter: "blur(8px)",
          transform: "scale(1.1)",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(255, 255, 255, 0.2)"
        }}
      />
      
      {/* Overlay avec dégradé avancé adapté au type d'utilisateur */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        userType === 'admin' ? 
          'from-blue-600/20 via-blue-100/30 to-gray-100/30' : 
          'from-yellow-600/20 via-yellow-100/30 to-gray-100/30'
      }`} />
      
      {/* Éléments flottants décoratifs */}
      {renderFloatingElements()}

      {/* Éléments graphiques en arrière-plan */}
      <div className={`absolute top-0 left-0 w-40 h-40 bg-${primaryColor}-500/10 rounded-full blur-2xl`} />
      <div className={`absolute bottom-0 right-0 w-60 h-60 bg-${primaryColor}-500/10 rounded-full blur-3xl`} />
      <div className={`absolute bottom-10 left-10 w-32 h-32 bg-${primaryColor}-300/20 rounded-full blur-xl`} />
      
      {/* Contenu principal avec animation d'entrée */}
      <div className={`relative z-10 w-full max-w-md px-6 transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>

        {/* Carte principale avec effet glassmorphism avancé */}
        <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden"
             style={{animation: "fadeIn 1s ease-out"}}>
          {/* Barre de progression design */}
          <div className={`h-1 w-full bg-gradient-to-r ${
            userType === 'admin' ? 
              'from-blue-300 via-blue-600 to-blue-300' : 
              'from-yellow-300 via-yellow-600 to-yellow-300'
          }`}>
            <div 
              className="h-full w-1/3 bg-white/30"
              style={{animation: "shimmer 2s infinite linear"}}
            ></div>
          </div>
          
          <div className="p-8">
            <button 
              className={`flex items-center text-${primaryColorShade} mb-6 hover:text-${userType === 'admin' ? 'blue-700' : 'yellow-700'} transition-colors opacity-0 slide-up-1 group`}
              onClick={() => navigate('/user-type-select')}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center bg-${primaryColorLight} mr-2 transition-all duration-300 group-hover:bg-${primaryColorMid}/50`}>
                <ChevronLeft size={18} />
              </span>
              <span>Retour</span>
            </button>
            
            <div className="flex justify-center mb-6 opacity-0 slide-up-2">
              <div className={`relative p-4 rounded-full bg-gradient-to-br from-${primaryColorLight} to-white`}>
                <Logo size="default" variant={userType === 'admin' ? 'admin' : 'parent'} />
              </div>
            </div>
            
            <h2 className={`text-2xl font-bold mb-2 text-center text-${primaryColorShade} opacity-0 slide-up-3`}>
              Connexion {userType === 'admin' ? 'Administrateur' : 'Parent'}
            </h2>
            
            <p className="text-center text-gray-500 mb-6 opacity-0 slide-up-3">
              Accédez à votre espace {userType === 'admin' ? 'de gestion' : 'de suivi'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="opacity-0 slide-up-3">
                <label className={`block text-${primaryColorShade} text-sm font-medium mb-2`} htmlFor="email">
                  Adresse email
                </label>
                <div className={`relative input-focus-effect ${formFocus === 'email' ? 'active' : ''}`}>
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 ${formFocus === 'email' ? `text-${primaryColorShade}` : 'text-gray-400'}`}>
                    <Mail size={18} />
                  </div>
                  <input
                    className={`w-full pl-10 pr-3 py-3 border bg-white/80 backdrop-blur-sm ${
                      formFocus === 'email' ? `border-${primaryColorShade}` : 'border-gray-300'
                    } rounded-lg focus:outline-none transition-colors`}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Votre email"
                    value={loginFormData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFormFocus('email')}
                    onBlur={() => setFormFocus(null)}
                    required
                  />
                  {formFocus === 'email' && (
                    <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-${primaryColorShade} text-xs font-medium`}>
                      @email.com
                    </span>
                  )}
                </div>
              </div>
              
              <div className="opacity-0 slide-up-3" style={{animationDelay: "0.2s"}}>
                <label className={`block text-${primaryColorShade} text-sm font-medium mb-2`} htmlFor="password">
                  Mot de passe
                </label>
                <div className={`relative input-focus-effect ${formFocus === 'password' ? 'active' : ''}`}>
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 ${formFocus === 'password' ? `text-${primaryColorShade}` : 'text-gray-400'}`}>
                    <Lock size={18} />
                  </div>
                  <input
                    className={`w-full pl-10 pr-10 py-3 border bg-white/80 backdrop-blur-sm ${
                      formFocus === 'password' ? `border-${primaryColorShade}` : 'border-gray-300'
                    } rounded-lg focus:outline-none transition-colors`}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={loginFormData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFormFocus('password')}
                    onBlur={() => setFormFocus(null)}
                    required
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                      formFocus === 'password' ? `text-${primaryColorShade}` : 'text-gray-400'
                    } hover:text-gray-600`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between opacity-0 slide-up-3" style={{animationDelay: "0.3s"}}>
                <div className="flex items-center">
                  <div className={`relative w-4 h-4 mr-2 flex items-center justify-center group transition-all duration-300`}>
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className={`h-4 w-4 text-${primaryColorShade} focus:ring-${primaryColor}-500 border-gray-300 rounded peer`}
                    />
                    <span className={`absolute inset-0 scale-0 peer-checked:scale-110 transition-transform duration-200 opacity-20 rounded-sm`}></span>
                  </div>
                  <label htmlFor="remember-me" className="block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                
                <button
                  type="button"
                  className={`text-sm text-${primaryColorShade} hover:text-${userType === 'admin' ? 'blue-700' : 'yellow-700'} relative`}
                  onClick={() => setShowForgotPasswordModal(true)}
                >
                  <span>Mot de passe oublié ?</span>
                  <span className={`absolute -bottom-0.5 left-0 w-0 h-0.5 bg-${primaryColorShade} transition-all duration-300 group-hover:w-full`}></span>
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center
                  overflow-hidden relative
                  ${userType === 'admin' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                  } transition-all duration-300 opacity-0 slide-up-3`}
                style={{animationDelay: "0.4s"}}
              >
                {isLoading ? (
                  <div className="spinner border-2 w-6 h-6 border-white"></div>
                ) : (
                  <>
                    <LogIn size={18} className="mr-2" />
                    Se connecter
                    <div className="shimmer"></div>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Pied de page amélioré */}
        <div className="mt-6 text-center opacity-0 slide-up-3" style={{animationDelay: "0.5s"}}>
          <p className="text-sm text-white/80 font-medium drop-shadow-md">© 2025 Bus Scolaire Intelligent</p>
          <p className="text-xs text-white/80 drop-shadow-md">Tous droits réservés</p>
        </div>
      </div>
      
      {/* Modale pour "Mot de passe oublié ?" avec animation améliorée */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
             style={{animation: "fadeIn 0.3s ease-out"}}>
          <div className={`bg-white backdrop-blur-md rounded-xl shadow-2xl p-6 w-full max-w-sm border border-${primaryColorLight} transform transition-all`}
               style={{animation: "slideUp 0.4s ease-out"}}>
            <div className={`w-12 h-1 bg-${primaryColorShade} rounded-full mx-auto mb-6`}></div>
            
            <h3 className={`text-lg font-bold mb-6 text-${primaryColorShade} text-center`}>
              Réinitialiser le mot de passe
            </h3>
            
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className={`block text-${primaryColorShade} text-sm font-medium mb-2`} htmlFor="forgot-email">
                  Adresse email
                </label>
                <div className={`relative input-focus-effect ${formFocus === 'forgot-email' ? 'active' : ''}`}>
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 ${formFocus === 'forgot-email' ? `text-${primaryColorShade}` : 'text-gray-400'}`}>
                    <Mail size={18} />
                  </div>
                  <input
                    className={`w-full pl-10 pr-3 py-3 border bg-white/80 ${
                      formFocus === 'forgot-email' ? `border-${primaryColorShade}` : 'border-gray-300'
                    } rounded-lg focus:outline-none transition-colors`}
                    id="forgot-email"
                    name="forgot-email"
                    type="email"
                    placeholder="Votre email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    onFocus={() => setFormFocus('forgot-email')}
                    onBlur={() => setFormFocus(null)}
                    required
                  />
                </div>
              </div>

              {forgotPasswordMessage && (
                <div className="p-4 bg-green-100/80 backdrop-blur-sm border border-green-400 text-green-700 rounded-lg flex items-start">
                  <div className="w-1 h-full bg-green-500 rounded-full mr-3"></div>
                  <p>{forgotPasswordMessage}</p>
                </div>
              )}

              {forgotPasswordError && (
                <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-400 text-red-700 rounded-lg flex items-start">
                  <div className="w-1 h-full bg-red-500 rounded-full mr-3"></div>
                  <p>{forgotPasswordError}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium relative overflow-hidden
                    ${userType === 'admin' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-yellow-600 hover:bg-yellow-700'
                    } transition-colors`}
                >
                  {isLoading ? (
                    <div className="spinner border-2 w-5 h-5 border-white"></div>
                  ) : (
                    <>
                      Envoyer le lien
                      <div className="shimmer"></div>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}