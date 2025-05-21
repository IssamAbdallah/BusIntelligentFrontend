import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { User, Settings, ChevronRight, Bus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UserTypeSelect() {
  const { setUserType } = useAuth();
  const navigate = useNavigate();
  const [activeOption, setActiveOption] = useState(null);
  const [loaded, setLoaded] = useState(false);
  
  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (type) => {
    setActiveOption(type);
    // Délai pour l'animation avant navigation
    setTimeout(() => {
      setUserType(type);
      navigate('/login');
    }, 600);
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
            <path d={shape} fill={Math.random() > 0.5 ? '#1E40AF' : '#F59E0B'} />
          </svg>
        </div>
      );
    }
    return elements;
  };

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
          .slide-up-1 { animation: slideUp 0.8s ease-out 0.1s forwards; }
          .slide-up-2 { animation: slideUp 0.8s ease-out 0.3s forwards; }
          .slide-up-3 { animation: slideUp 0.8s ease-out 0.5s forwards; }
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
      
      {/* Overlay avec dégradé avancé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-blue-100/30 to-yellow-300/30" />
      
      {/* Éléments flottants décoratifs */}
      {renderFloatingElements()}

      {/* Éléments graphiques en arrière-plan */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-xl" />
      
      {/* Contenu principal avec animation d'entrée */}
      <div className={`relative z-10 w-full max-w-md px-6 transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Logo flottant avec animations multiples */}
        <div className="relative mx-auto w-28 h-28 mb-8">
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-md" 
               style={{animation: "pulse 2s infinite ease-in-out"}} />
          <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full border-2 border-blue-300/30"
               style={{animation: "spin 8s linear infinite"}} />
          <div className="absolute inset-2 rounded-full border border-yellow-300/40"
               style={{animation: "spin 12s linear infinite reverse"}} />
          <div className="relative flex items-center justify-center h-full p-4 bg-white rounded-full shadow-xl border border-white/50"
               style={{animation: "glow 3s infinite ease-in-out"}}>
            <Logo size="large" variant="dark" />
          </div>
          
          {/* Icône bus décorative */}
          <div className="absolute -right-2 -bottom-2 bg-yellow-400 rounded-full p-2 shadow-lg border-2 border-white">
            <Bus size={18} className="text-white" />
          </div>
        </div>
        
        {/* Carte principale avec effet glassmorphism avancé */}
        <div className="w-full p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50"
             style={{animation: "fadeIn 1s ease-out"}}>
          <div>
            <h1 className="text-3xl font-bold mb-1 text-center text-gray-800 opacity-0 slide-up-1">Bienvenue</h1>
            <p className="text-xl mb-2 text-center font-medium text-blue-600 opacity-0 slide-up-2">Bus Scolaire Intelligent</p>
            <div className="flex items-center justify-center mb-8 opacity-0 slide-up-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
              <p className="mx-4 text-gray-600 text-center">Sélectionnez votre profil</p>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            </div>
          
            <div className="space-y-5">
              {/* Option Administrateur */}
              <button
                className={`group relative w-full bg-white/90 backdrop-blur-sm border overflow-hidden ${
                  activeOption === 'admin' ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                } p-5 rounded-xl transition-all hover:shadow-lg hover:border-blue-500 flex items-center justify-between`}
                onClick={() => handleSelect('admin')}
                disabled={activeOption !== null}
              >
                {/* Effet de sélection */}
                {activeOption === 'admin' && (
                  <div className="absolute inset-0 bg-blue-100/50" 
                       style={{animation: "fadeIn 0.5s ease-out"}} />
                )}
                
                <div className="flex items-center relative z-10">
                  <div className={`w-14 h-14 flex items-center justify-center ${
                    activeOption === 'admin' ? 'bg-blue-200' : 'bg-blue-100'
                  } rounded-full mr-4 group-hover:bg-blue-200 transition-colors shadow-md`}>
                    <Settings size={28} className={`${
                      activeOption === 'admin' ? 'text-blue-700' : 'text-blue-600'
                    } ${activeOption === 'admin' ? 'animate-spin' : ''}`} 
                    style={{animationDuration: activeOption === 'admin' ? '3s' : '0s'}} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-lg text-gray-800">Administrateur</span>
                    <span className="text-sm text-gray-500">Gestion du système</span>
                  </div>
                </div>
                {activeOption === 'admin' ? (
                  <ArrowRight className="text-blue-600 animate-pulse" size={22} />
                ) : (
                  <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                )}
                
                {/* Effet de brillance au survol */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              </button>
              
              {/* Option Parent */}
              <button
                className={`group relative w-full bg-white/90 backdrop-blur-sm border overflow-hidden ${
                  activeOption === 'parent' ? 'bg-yellow-50 border-yellow-500' : 'border-gray-200'
                } p-5 rounded-xl transition-all hover:shadow-lg hover:border-yellow-500 flex items-center justify-between`}
                onClick={() => handleSelect('parent')}
                disabled={activeOption !== null}
              >
                {/* Effet de sélection */}
                {activeOption === 'parent' && (
                  <div className="absolute inset-0 bg-yellow-100/50" 
                       style={{animation: "fadeIn 0.5s ease-out"}} />
                )}
                
                <div className="flex items-center relative z-10">
                  <div className={`w-14 h-14 flex items-center justify-center ${
                    activeOption === 'parent' ? 'bg-yellow-200' : 'bg-yellow-100'
                  } rounded-full mr-4 group-hover:bg-yellow-200 transition-colors shadow-md`}>
                    <User size={28} className={`${
                      activeOption === 'parent' ? 'text-yellow-700' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-lg text-gray-800">Parent</span>
                    <span className="text-sm text-gray-500">Suivi de transport</span>
                  </div>
                </div>
                {activeOption === 'parent' ? (
                  <ArrowRight className="text-yellow-600 animate-pulse" size={22} />
                ) : (
                  <ChevronRight className="text-gray-400 group-hover:text-yellow-500 transition-colors" size={20} />
                )}
                
                {/* Effet de brillance au survol */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Pied de page amélioré */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/80 font-medium drop-shadow-md">© 2025 Bus Scolaire Intelligent</p>
          <p className="text-xs text-white/80 drop-shadow-md">Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}