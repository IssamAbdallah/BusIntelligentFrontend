import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBus, FaUserGraduate, FaBell, FaFileAlt, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function StatsSection() {
  // État pour les données dynamiques
  const [stats, setStats] = useState({
    totalBuses: 1,
    activeBuses: 1,
    students: 45,
  });

  // État pour les données des élèves (présents et absents)
  const [studentsData, setStudentsData] = useState({
    present: [
      { id: 1, name: 'Issam Abdallah' },
      { id: 2, name: 'Abir Brahem' },
      { id: 3, name: 'Zeineb Issaoui' },
      { id: 4, name: 'Nour El Imen' },
    ],
    absent: [
      { id: 5, name: 'Sara Haddad' },
      { id: 6, name: 'Mohamed Kamel' },
      { id: 7, name: 'Salah' },
      { id: 8, name: 'Arwa' },
    ],
  });

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Simuler une récupération de données via API (à remplacer par un vrai fetch)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = { totalBuses: 1, activeBuses: 1, students: 50 };
        setStats(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des stats:', error);
        toast.error('Erreur lors de la récupération des statistiques.', { position: 'top-right' });
      }
    };

    const fetchStudents = async () => {
      try {
        const response = {
          present: [
            { id: 1, name: 'Issam Abdallah' },
            { id: 2, name: 'Abir Brahem' },
            { id: 3, name: 'Zeineb Issaoui' },
            { id: 4, name: 'Nour El Imen' },
          ],
          absent: [
            { id: 5, name: 'Sara Haddad' },
            { id: 6, name: 'Mohamed Kamel' },
            { id: 7, name: 'Salah' },
            { id: 8, name: 'Arwa' },
          ],
        };
        setStudentsData(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des élèves:', error);
        toast.error('Erreur lors de la récupération des élèves.', { position: 'top-right' });
      }
    };

    fetchStats();
    fetchStudents();
  }, []);

  // Fonction pour gérer la notification
  const handleNotifyAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir notifier tous les utilisateurs ?')) {
      toast.success('Notification envoyée à tous les utilisateurs !', { position: 'top-right' });
    }
  };

  // Fonction pour générer un rapport
  const handleGenerateReport = () => {
    const reportData = `
      Rapport de Transport - ${new Date().toLocaleDateString()}
      --------------------------------
      Total des bus: ${stats.totalBuses}
      Bus actifs: ${stats.activeBuses}
      Élèves: ${stats.students}
      Élèves présents: ${studentsData.present.length}
      Élèves absents: ${studentsData.absent.length}
    `;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_transport_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Rapport généré et téléchargé !', { position: 'top-right' });
  };

  // Filtrer les élèves en fonction du terme de recherche
  const filteredPresentStudents = studentsData.present.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAbsentStudents = studentsData.absent.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Statistiques */}
      <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
          <FaBus className="mr-2" /> Statistiques
        </h3>
        <p className="text-gray-700 flex items-center mb-2">
          <FaBus className="mr-2 text-blue-500" /> Total des bus: {stats.totalBuses}
        </p>
        <p className="text-gray-700 flex items-center mb-2">
          <FaBus className="mr-2 text-green-500" /> Bus actifs: {stats.activeBuses}
        </p>
        <p className="text-gray-700 flex items-center">
          <FaUserGraduate className="mr-2 text-purple-500" /> Élèves: {stats.students}
        </p>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <FaBell className="mr-2 text-yellow-500" /> Actions rapides
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={handleNotifyAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            aria-label="Notifier tous les utilisateurs"
          >
            <FaBell className="mr-2" /> Notifier tous
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center transition-colors"
            aria-label="Générer un rapport"
          >
            <FaFileAlt className="mr-2" /> Rapport
          </button>
        </div>
      </div>

      {/* Liste des élèves (Présents et Absents) */}
      <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 col-span-1 md:col-span-2 lg:col-span-3">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-indigo-600">
          <FaUserGraduate className="mr-2" /> Liste des élèves
        </h3>

        {/* Barre de recherche */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Rechercher un élève"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Élèves présents */}
          <div>
            <h4 className="text-md font-medium mb-2 flex items-center text-green-600">
              <FaCheckCircle className="mr-2" /> Élèves présents ({filteredPresentStudents.length})
            </h4>
            {filteredPresentStudents.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {filteredPresentStudents.map((student) => (
                  <li
                    key={student.id}
                    className="p-2 bg-green-50 text-green-800 rounded-lg flex items-center"
                  >
                    <FaUserGraduate className="mr-2" /> {student.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun élève présent trouvé.</p>
            )}
          </div>

          {/* Élèves absents */}
          <div>
            <h4 className="text-md font-medium mb-2 flex items-center text-red-600">
              <FaTimesCircle className="mr-2" /> Élèves absents ({filteredAbsentStudents.length})
            </h4>
            {filteredAbsentStudents.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {filteredAbsentStudents.map((student) => (
                  <li
                    key={student.id}
                    className="p-2 bg-red-50 text-red-800 rounded-lg flex items-center"
                  >
                    <FaUserGraduate className="mr-2" /> {student.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun élève absent trouvé.</p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}