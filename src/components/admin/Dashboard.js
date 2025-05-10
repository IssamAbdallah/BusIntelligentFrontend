import { Eye, EyeOff } from 'lucide-react';
import Sidebar from '../common/Sidebar';
import MapSection from './MapSection';
import StatsSection from './StatsSection';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard({ _userId }) {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialSection = queryParams.get('section') || 'location';

  const [activeSection, setActiveSection] = useState('location');
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState({ users: false, buses: false, drivers: false });
  const [newUser, setNewUser] = useState({ id: null, username: '', email: '', role: 'parent', cinNumber: '', password: '' });
  const [newBus, setNewBus] = useState({ id: null, busNumber: '', route: '', driver: '', temperature: '', humidity: '', pression: '', flame: false, latitude: '', longitude: ''});
  const [newDriver, setNewDriver] = useState({ id: null, username: '', email: '', cinNumber: '', phoneNumber: '' });
  const [options, setOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [opening, setOpening] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.pathname === '/dashboard' && !queryParams.get('section')) {
      setActiveSection('dashboard');
      navigate('/dashboard?section=dashboard', { replace: true });
    } else {
      setActiveSection(initialSection);
    }
  }, [location, navigate, initialSection]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setErrorMsg('Token manquant, veuillez vous reconnecter');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Fetched users:', data);

        if (response.ok) {
          setUsers(data.map(user => ({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            cinNumber: user.cinNumber || '',
            password: '',
          })).filter(user => user.role !== 'admin'));
        } else {
          console.error('Failed to fetch users:', data.message);
          setErrorMsg(`Erreur: ${data.message || 'Impossible de charger les utilisateurs'}`);
        }
      } catch (error) {
        console.error('Error fetching users:', error.message);
        setErrorMsg(`Erreur réseau: ${error.message}`);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicles');
        const data = await response.json();
        console.log('Fetched buses:', data);
        if (response.ok) {
          setBuses(data.map(bus => ({
            id: bus._id,
            busNumber: bus.uniqueId,
            route: bus.name,
            driver: bus.driver || '',
            temperature: bus.temperature || '',
            humidity: bus.humidity || '',
            pression: bus.pression || '',
            flame: bus.flame || false,
            latitude: bus.latitude || '',
            longitude: bus.longitude || ''
          })));
        } else {
          console.error('Failed to fetch buses:', data.message);
          setErrorMsg(`Erreur: ${data.message || 'Impossible de charger les bus'}`);
        }
      } catch (error) {
        console.error('Error fetching buses:', error.message);
        setErrorMsg(`Erreur réseau: ${error.message}`);
      }
    };
    fetchBuses();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      if (!token) {
        setErrorMsg('Token manquant, veuillez vous reconnecter');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/drivers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched drivers:', data);
        if (response.ok) {
          setDrivers(data.map(driver => ({
            id: driver._id,
            username: driver.username,
            email: driver.email,
            cinNumber: driver.cinNumber || '',
            phoneNumber: driver.phoneNumber || ''
          })));
        } else if (response.status === 401) {
          setErrorMsg('Non autorisé, veuillez vous reconnecter');
          navigate('/login');
        } else {
          console.error('Failed to fetch drivers:', data.message);
          setErrorMsg(`Erreur: ${data.message || 'Impossible de charger les conducteurs'}`);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error.message);
        setErrorMsg(`Erreur réseau: ${error.message}`);
      }
    };
    fetchDrivers();
  }, [token, navigate]);

  useEffect(() => {
    const fetchAgencies = async () => {
      setLoading(true);
      try {
        if (!token) {
          setErrorMsg('Token expiré ou non trouvé');
          setOpening(true);
          navigate('/login');
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_URL_NAME}/useragences?userId=${_userId}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Agencies::', data);
          setOptions([]);
          const newOption = [];
          for (let i = 0; i < data.length; i++) {
            console.log('data agency:', data[i].agence_name);
            newOption.push({ value: data[i].agence_name, label: data[i].agence_name });
          }
          setOptions(newOption);
          setItems(data);
        } else if (response.status === 401) {
          setErrorMsg('UNAUTHORIZED');
          setOpening(true);
          navigate('/login');
        } else {
          setErrorMsg(await response.text());
          setOpening(true);
          throw new Error(await response.text());
        }
      } catch (error) {
        console.error('Error fetching agencies:', error.message);
        setErrorMsg(`Erreur: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (_userId) fetchAgencies();
  }, [_userId, token, navigate]);

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.cinNumber || !newUser.password) {
      console.error('Tous les champs obligatoires sont requis');
      setErrorMsg('Veuillez remplir tous les champs obligatoires (Nom, Email, Num CIN, Mot de passe)');
      return;
    }

    if (user?.role === 'admin' && newUser.role !== 'parent') {
      setErrorMsg('Seuls les utilisateurs de type "parent" peuvent être créés par un admin');
      return;
    }

    const userToAdd = {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      cinNumber: newUser.cinNumber,
      password: newUser.password,
    };

    console.log('Sending user data:', userToAdd);

    try {
      if (!token) {
        setErrorMsg('Token manquant, veuillez vous reconnecter');
        navigate('/login');
        return;
      }

      const method = newUser.id ? 'PUT' : 'POST';
      const url = newUser.id 
        ? `http://localhost:5000/api/users/${newUser.id}`
        : 'http://localhost:5000/api/users';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userToAdd),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        if (newUser.id) {
          setUsers(users.map(user => user.id === newUser.id ? {
            id: newUser.id,
            username: data.username,
            email: data.email,
            role: data.role,
            cinNumber: data.cinNumber || '',
            password: '',
          } : user));
        } else {
          setUsers([...users, {
            id: data._id,
            username: data.username,
            email: data.email,
            role: data.role,
            cinNumber: data.cinNumber || '',
            password: '',
          }]);
        }
        setNewUser({ id: null, username: '', email: '', role: 'parent', cinNumber: '', password: '' });
        setShowForm({ ...showForm, users: false });
        setErrorMsg('');
      } else {
        console.error('Failed to save user:', data.message);
        setErrorMsg(`Erreur: ${data.message || 'Impossible d\'enregistrer l\'utilisateur'}`);
      }
    } catch (error) {
      console.error('Error saving user:', error.message);
      setErrorMsg(`Erreur réseau: ${error.message}`);
    }
  };

  const handleSubmitBus = async (e) => {
    e.preventDefault();
    if (!newBus.busNumber || !newBus.route) {
      console.error('Numéro de bus et Itinéraire sont requis');
      setErrorMsg('Veuillez remplir le numéro de bus et l\'itinéraire');
      return;
    }

    const busToAdd = {
      uniqueId: newBus.busNumber,
      name: newBus.route,
      driver: newBus.driver,
      temperature: newBus.temperature,
      humidity: newBus.humidity,
      pression: newBus.pression,
      flame: newBus.flame,
      latitude: newBus.latitude,
      longitude: newBus.longitude
    };

    console.log('Sending bus data:', busToAdd);

    try {
      const method = newBus.id ? 'PUT' : 'POST';
      const url = newBus.id 
        ? `http://localhost:5000/api/vehicles/${newBus.id}`
        : 'http://localhost:5000/api/vehicles';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(busToAdd),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        if (newBus.id) {
          setBuses(buses.map(bus => bus.id === newBus.id ? {
            id: newBus.id,
            busNumber: data.uniqueId,
            route: data.name,
            driver: data.driver,
            temperature: data.temperature,
            humidity: data.humidity,
            pression: data.pression,
            flame: data.flame,
            latitude: data.latitude,
            longitude: data.longitude
          } : bus));
        } else {
          setBuses([...buses, {
            id: data._id,
            busNumber: data.uniqueId,
            route: data.name,
            driver: data.driver,
            temperature: data.temperature,
            humidity: data.humidity,
            pression: data.pression,
            flame: data.flame,
            latitude: data.latitude,
            longitude: data.longitude
          }]);
        }
        setNewBus({ id: null, busNumber: '', route: '', driver: '', temperature: '', humidity: '', pression: '', flame: false, latitude: '', longitude: '' });
        setShowForm({ ...showForm, buses: false });
        setErrorMsg('');
      } else {
        console.error('Failed to save bus:', data.message);
        setErrorMsg(`Erreur: ${data.message || 'Impossible d\'enregistrer le bus'}`);
      }
    } catch (error) {
      console.error('Error saving bus:', error.message);
      setErrorMsg(`Erreur réseau: ${error.message}`);
    }
  };

  const handleSubmitDriver = async (e) => {
    e.preventDefault();
    if (!newDriver.email || !newDriver.cinNumber) {
      console.error('Email et Numéro CIN sont requis');
      setErrorMsg('Veuillez remplir email et numéro de CIN');
      return;
    }

    const driverToAdd = {
      username: newDriver.username,
      email: newDriver.email,
      cinNumber: newDriver.cinNumber,
      phoneNumber: newDriver.phoneNumber
    };

    console.log('Sending driver data:', driverToAdd);

    try {
      if (!token) {
        setErrorMsg('Token manquant, veuillez vous reconnecter');
        navigate('/login');
        return;
      }

      const method = newDriver.id ? 'PUT' : 'POST';
      const url = newDriver.id 
        ? `http://localhost:5000/api/drivers/${newDriver.id}`
        : 'http://localhost:5000/api/drivers';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(driverToAdd),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        if (newDriver.id) {
          setDrivers(drivers.map(driver => driver.id === newDriver.id ? {
            id: newDriver.id,
            username: data.username,
            email: data.email,
            cinNumber: data.cinNumber,
            phoneNumber: data.phoneNumber
          } : driver));
        } else {
          setDrivers([...drivers, {
            id: data._id,
            username: data.username,
            email: data.email,
            cinNumber: data.cinNumber,
            phoneNumber: data.phoneNumber
          }]);
        }
        setNewDriver({ id: null, username: '', email: '', cinNumber: '', phoneNumber: '' });
        setShowForm({ ...showForm, drivers: false });
        setErrorMsg('');
      } else {
        console.error('Failed to save driver:', data.message);
        setErrorMsg(`Erreur: ${data.message || 'Impossible d\'enregistrer le conducteur'}`);
      }
    } catch (error) {
      console.error('Error saving driver:', error.message);
      setErrorMsg(`Erreur réseau: ${error.message}`);
    }
  };

  const handleEditUser = (user) => {
    setNewUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      cinNumber: user.cinNumber,
      password: user.password || '',
    });
    setShowForm({ ...showForm, users: true });
  };

  const handleEditBus = (bus) => {
    setNewBus({
      id: bus.id,
      busNumber: bus.busNumber,
      route: bus.route,
      driver: bus.driver,
      temperature: bus.temperature,
      humidity: bus.humidity,
      pression: bus.pression,
      flame: bus.flame,
      latitude: bus.latitude,
      longitude: bus.longitude
    });
    setShowForm({ ...showForm, buses: true });
  };

  const handleEditDriver = (driver) => {
    setNewDriver({
      id: driver.id,
      username: driver.username,
      email: driver.email,
      cinNumber: driver.cinNumber,
      phoneNumber: driver.phoneNumber
    });
    setShowForm({ ...showForm, drivers: true });
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Delete response status:', response.status);
      const data = await response.json();
      console.log('Delete response data:', data);

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        console.error('Failed to delete user:', data.message);
        setErrorMsg(`Erreur: ${data.message || 'Impossible de supprimer l\'utilisateur'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
      setErrorMsg(`Erreur réseau: ${error.message}`);
    }
  };

  const handleDeleteBus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: 'DELETE',
      });
      console.log('Delete response status:', response.status);
      const data = await response.json();
      console.log('Delete response data:', data);

      if (response.ok) {
        setBuses(buses.filter(bus => bus.id !== id));
      } else {
        console.error('Failed to delete bus:', data.message);
        setErrorMsg(`Erreur: ${data.message || 'Impossible de supprimer le bus'}`);
      }
    } catch (error) {
      console.error('Error deleting bus:', error.message);
      setErrorMsg(`Erreur réseau: ${error.message}`);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/drivers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }, // Add token for auth
      });
      console.log('Delete response status:', response.status);
      const data = await response.json();
      console.log('Delete response data:', data);

      if (response.ok) {
        setDrivers(drivers.filter(driver => driver.id !== id));
      } else {
        console.error('Failed to delete driver:', data.message);
        setErrorMsg(`Erreur: ${data.message || 'Impossible de supprimer le conducteur'}`);
      }
    } catch (error) {
      console.error('Error deleting driver:', error.message);
      setErrorMsg(`Erreur réseau: ${error.message}`);
    }
  };

  const handleInputChange = (e, type) => {
    const { name, value, type: inputType, checked } = e.target;
    if (type === 'user') {
      setNewUser({ ...newUser, [name]: value });
    } else if (type === 'bus') {
      setNewBus({ ...newBus, [name]: inputType === 'checkbox' ? checked : value });
    } else if (type === 'driver') {
      setNewDriver({ ...newDriver, [name]: value });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col w-full">
        <header className="bg-white shadow-sm">
          <div className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeSection === 'dashboard' ? 'Tableau de bord' : activeSection === 'users' ? 'Utilisateurs' : activeSection === 'buses' ? 'Bus' : activeSection === 'drivers' ? 'Conducteurs' : 'Statistiques'}
            </h1>
          </div>
        </header>
        
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">
          {activeSection === 'dashboard' && <MapSection />}
          
          {activeSection === 'users' && (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Liste des utilisateurs</h2>
                <button
                  onClick={() => {
                    setNewUser({ id: null, username: '', email: '', role: 'parent', cinNumber: '', password: '' });
                    setShowForm({ ...showForm, users: true });
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Ajouter
                </button>
              </div>
              
              {errorMsg && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                  {errorMsg}
                </div>
              )}

              {showForm.users && (
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleSubmitUser} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                        Rôle
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={newUser.role}
                        onChange={(e) => handleInputChange(e, 'user')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={user?.role === 'admin'}
                        required
                      >
                        <option value="parent">Parent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cinNumber">
                        Num CIN
                      </label>
                      <input
                        id="cinNumber"
                        name="cinNumber"
                        type="number"
                        placeholder="Num CIN"
                        value={newUser.cinNumber}
                        onChange={(e) => handleInputChange(e, 'user')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                        Nom d'utilisateur
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={newUser.username}
                        onChange={(e) => handleInputChange(e, 'user')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => handleInputChange(e, 'user')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mot de passe"
                        value={newUser.password}
                        onChange={(e) => handleInputChange(e, 'user')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {newUser.id ? 'Sauvegarder' : 'Ajouter'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm({ ...showForm, users: false })}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom d'utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Numéro Cin
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.cinNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeSection === 'buses' && (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-800">Liste des bus</h1>
                <button
                  onClick={() => {
                    setNewBus({ id: null, busNumber: '', route: '', driver: '', temperature: '', humidity: '', pression: '', flame: false, latitude: ''});
                    setShowForm({ ...showForm, buses: true });
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Ajouter
                </button>
              </div>
              
              {errorMsg && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                  {errorMsg}
                </div>
              )}

              {showForm.buses && (
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleSubmitBus} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="busNumber">
                        Numéro de bus
                      </label>
                      <input
                        id="busNumber"
                        name="busNumber"
                        type="text"
                        placeholder="Numéro de bus"
                        value={newBus.busNumber}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="route">
                        Itinéraire
                      </label>
                      <input
                        id="route"
                        name="route"
                        type="text"
                        placeholder="Itinéraire"
                        value={newBus.route}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="driver">
                        Conducteur
                      </label>
                      <input
                        id="driver"
                        name="driver"
                        type="text"
                        placeholder="Conducteur"
                        value={newBus.driver}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="temperature">
                        Température
                      </label>
                      <input
                        id="temperature"
                        name="temperature"
                        type="text"
                        placeholder="Température"
                        value={newBus.temperature}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="humidity">
                        Humidité
                      </label>
                      <input
                        id="humidity"
                        name="humidity"
                        type="text"
                        placeholder="Humidité"
                        value={newBus.humidity}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="pression">
                        Pression
                      </label>
                      <input
                        id="pression"
                        name="pression"
                        type="text"
                        placeholder="Pression"
                        value={newBus.pression}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="flame">
                        Flamme
                      </label>
                      <input
                        id="flame"
                        name="flame"
                        type="checkbox"
                        checked={newBus.flame}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="latitude">
                        Latitude
                      </label>
                      <input
                        id="latitude"
                        name="latitude"
                        type="text"
                        placeholder="Latitude"
                        value={newBus.latitude}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="longitude">
                        Longitude
                      </label>
                      <input
                        id="longitude"
                        name="longitude"
                        type="text"
                        placeholder="Longitude"
                        value={newBus.longitude}
                        onChange={(e) => handleInputChange(e, 'bus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {newBus.id ? 'Sauvegarder' : 'Ajouter'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm({ ...showForm, buses: false })}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Numéro de bus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Itinéraire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conducteur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Temp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pression
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flamme
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Long
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {buses.map((bus) => (
                      <tr key={bus.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.busNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.route}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.driver}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.temperature}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.humidity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.pression}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.flame ? 'Oui' : 'Non'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.latitude}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.longitude}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditBus(bus)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteBus(bus.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'drivers' && (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-800">Liste des conducteurs</h1>
                <button
                  onClick={() => {
                    setNewDriver({ id: null, username: '', email: '', cinNumber: '', phoneNumber: '' });
                    setShowForm({ ...showForm, drivers: true });
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Ajouter
                </button>
              </div>
              
              {errorMsg && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                  {errorMsg}
                </div>
              )}

              {showForm.drivers && (
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleSubmitDriver} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                        Nom d'utilisateur
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={newDriver.username}
                        onChange={(e) => handleInputChange(e, 'driver')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={newDriver.email}
                        onChange={(e) => handleInputChange(e, 'driver')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cinNumber">
                        Numéro du CIN
                      </label>
                      <input
                        id="cinNumber"
                        name="cinNumber"
                        type="text"
                        placeholder="Numéro du CIN"
                        value={newDriver.cinNumber}
                        onChange={(e) => handleInputChange(e, 'driver')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phoneNumber">
                        Téléphone
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        placeholder="Num téléphone"
                        value={newDriver.phoneNumber}
                        onChange={(e) => handleInputChange(e, 'driver')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {newDriver.id ? 'Sauvegarder' : 'Ajouter'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm({ ...showForm, drivers: false })}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom d'utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Num CIN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Num téléphone
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver) => (
                      <tr key={driver.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.cinNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.phoneNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditDriver(driver)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteDriver(driver.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeSection === 'stats' && <StatsSection />}
        </main>
      </div>
    </div>
  );
}