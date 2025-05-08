import Sidebar from '../common/Sidebar';
import MapSection from './MapSection';
import StatsSection from './StatsSection';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([
    { id: 1, username: 'JohnDoe', email: 'john@example.com', role: 'conducteur', cinNumber: 'CIN001', licenseNumber: 'L001' },
    { id: 2, username: 'JaneSmith', email: 'jane@example.com', role: 'parent', cinNumber: 'CIN002', password: 'pass123' },
  ]);
  const [buses, setBuses] = useState([
    { id: 1, busNumber: 'BUS001', route: 'Route A', driver: 'JohnDoe' },
    { id: 2, busNumber: 'BUS002', route: 'Route B', driver: 'JaneSmith' },
  ]);
  const [showAddForm, setShowAddForm] = useState({ users: false, buses: false });
  const [showEditForm, setShowEditForm] = useState({ users: false, buses: false });
  const [newUser, setNewUser] = useState({ username: '', email: '', role: '', cinNumber: '', password: '', licenseNumber: '' });
  const [newBus, setNewBus] = useState({ busNumber: '', route: '', driver: '' });
  const [editUser, setEditUser] = useState(null);
  const [editBus, setEditBus] = useState(null);

  const handleAddUser = (e) => {
    e.preventDefault();
    const newId = users.length + 1;
    const userToAdd = { id: newId, username: newUser.username, email: newUser.email, role: newUser.role, cinNumber: newUser.cinNumber };
    if (newUser.role === 'parent') userToAdd.password = newUser.password;
    if (newUser.role === 'conducteur') userToAdd.licenseNumber = newUser.licenseNumber;
    setUsers([...users, userToAdd]);
    setNewUser({ username: '', email: '', role: '', cinNumber: '', password: '', licenseNumber: '' });
    setShowAddForm({ ...showAddForm, users: false });
  };

  const handleAddBus = (e) => {
    e.preventDefault();
    const newId = buses.length + 1;
    setBuses([...buses, { id: newId, ...newBus }]);
    setNewBus({ busNumber: '', route: '', driver: '' });
    setShowAddForm({ ...showAddForm, buses: false });
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user });
    setShowEditForm({ ...showEditForm, users: true });
  };

  const handleEditBus = (bus) => {
    setEditBus({ ...bus });
    setShowEditForm({ ...showEditForm, buses: true });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    setUsers(users.map(user => user.id === editUser.id ? editUser : user));
    setEditUser(null);
    setShowEditForm({ ...showEditForm, users: false });
  };

  const handleSaveBus = (e) => {
    e.preventDefault();
    setBuses(buses.map(bus => bus.id === editBus.id ? editBus : bus));
    setEditBus(null);
    setShowEditForm({ ...showEditForm, buses: false });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleDeleteBus = (id) => {
    setBuses(buses.filter(bus => bus.id !== id));
  };

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'user') {
      setNewUser({ ...newUser, [name]: value });
    } else if (type === 'editUser') {
      setEditUser({ ...editUser, [name]: value });
    } else if (type === 'bus') {
      setNewBus({ ...newBus, [name]: value });
    } else if (type === 'editBus') {
      setEditBus({ ...editBus, [name]: value });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSectionChange={setActiveSection} />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeSection === 'dashboard' ? 'Tableau de bord' : activeSection === 'users' ? 'Utilisateurs' : activeSection === 'buses' ? 'Bus' : 'Statistiques'}
            </h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {activeSection === 'dashboard' && <MapSection />}
          
          {activeSection === 'users' && (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Liste des utilisateurs</h2>
                <button
                  onClick={() => setShowAddForm({ ...showAddForm, users: true })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Ajouter
                </button>
              </div>
              
              {showAddForm.users && (
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleAddUser} className="space-y-4">
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
                        required
                      >
                        <option value="">Sélectionner un rôle</option>
                        <option value="conducteur">Conducteur</option>
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
                        type="text"
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
                    {newUser.role === 'parent' && (
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                          Mot de passe
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Mot de passe"
                          value={newUser.password}
                          onChange={(e) => handleInputChange(e, 'user')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}
                    {newUser.role === 'conducteur' && (
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="licenseNumber">
                          Numéro de permis
                        </label>
                        <input
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          placeholder="Numéro de permis"
                          value={newUser.licenseNumber}
                          onChange={(e) => handleInputChange(e, 'user')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ajouter
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm({ ...showAddForm, users: false })}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {showEditForm.users && editUser && (
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleSaveUser} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                        Rôle
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={editUser.role}
                        onChange={(e) => handleInputChange(e, 'editUser')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="conducteur">Conducteur</option>
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
                        type="text"
                        placeholder="Num CIN"
                        value={editUser.cinNumber}
                        onChange={(e) => handleInputChange(e, 'editUser')}
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
                        value={editUser.username}
                        onChange={(e) => handleInputChange(e, 'editUser')}
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
                        value={editUser.email}
                        onChange={(e) => handleInputChange(e, 'editUser')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {editUser.role === 'parent' && (
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                          Mot de passe
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Mot de passe"
                          value={editUser.password || ''}
                          onChange={(e) => handleInputChange(e, 'editUser')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}
                    {editUser.role === 'conducteur' && (
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="licenseNumber">
                          Numéro de permis
                        </label>
                        <input
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          placeholder="Numéro de permis"
                          value={editUser.licenseNumber || ''}
                          onChange={(e) => handleInputChange(e, 'editUser')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sauvegarder
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditForm({ ...showEditForm, users: false })}
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
                        Num CIN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
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
                <h2 className="text-lg font-semibold text-gray-800">Liste des bus</h2>
                <button
                  onClick={() => setShowAddForm({ ...showAddForm, buses: true })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Ajouter
                </button>
              </div>
              
              {showAddForm.buses && (
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleAddBus} className="space-y-4">
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
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ajouter
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm({ ...showAddForm, buses: false })}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {showEditForm.buses && editBus && (
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleSaveBus} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="busNumber">
                        Numéro de bus
                      </label>
                      <input
                        id="busNumber"
                        name="busNumber"
                        type="text"
                        placeholder="Numéro de bus"
                        value={editBus.busNumber}
                        onChange={(e) => handleInputChange(e, 'editBus')}
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
                        value={editBus.route}
                        onChange={(e) => handleInputChange(e, 'editBus')}
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
                        value={editBus.driver}
                        onChange={(e) => handleInputChange(e, 'editBus')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sauvegarder
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditForm({ ...showEditForm, buses: false })}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditBus(bus)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteBus(bus.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
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