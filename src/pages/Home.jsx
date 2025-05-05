import { useNavigate } from 'react-router-dom';
import UserTypeSelection from '../components/auth/UserTypeSelection';

function Home() {
  const navigate = useNavigate();
  
  const handleUserTypeSelect = (type) => {
    navigate(`/login/${type}`);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <UserTypeSelection onSelect={handleUserTypeSelect} />
    </div>
  );
}

export default Home;