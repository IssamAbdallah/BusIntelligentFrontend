import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserTypeSelect from './components/auth/UserTypeSelect';
import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/admin/Dashboard';
import ParentDashboard from './components/parent/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Composant principal qui détermine quelle page afficher
function Main() {
  return (
    <Routes>
      <Route path="/user-type-select" element={<UserTypeSelect />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/" element={<UserTypeSelect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Main />
      </AuthProvider>
      <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
    </Router>
    
  );
}