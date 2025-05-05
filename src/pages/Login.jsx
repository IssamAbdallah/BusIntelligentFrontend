import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { login } from '../services/authService';

function Login() {
  const { userType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si userType est valide
    if (userType !== 'admin' && userType !== 'parent') {
      navigate('/');
    }
  }, [userType, navigate]);

  const handleLogin = async (email, password) => {
    try {
      await login(email, password, userType);
      
      // Rediriger vers le dashboard approprié
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/parent/dashboard');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      // Gérer l'erreur (afficher un message, etc.)
      alert('Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <LoginForm 
        userType={userType} 
        onSubmit={handleLogin} 
        onBack={handleBack} 
      />
    </div>
  );
}

export default Login;