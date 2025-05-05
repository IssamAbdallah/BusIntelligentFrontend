import { AuthProvider, useAuth } from './contexts/AuthContext';
import UserTypeSelect from './components/auth/UserTypeSelect';
import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/admin/Dashboard';
import ParentDashboard from './components/parent/Dashboard';

// Composant principal qui détermine quelle page afficher
function Main() {
  const { userType, isLoggedIn } = useAuth();

  // Sélection du type d'utilisateur
  if (!userType) {
    return <UserTypeSelect />;
  }

  // Formulaire de connexion
  if (!isLoggedIn) {
    return <LoginForm />;
  }

  // Dashboard selon le type d'utilisateur
  if (userType === 'admin') {
    return <AdminDashboard />;
  }

  if (userType === 'parent') {
    return <ParentDashboard />;
  }

  return <div>Chargement...</div>;
}

// App avec le contexte d'authentification
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}