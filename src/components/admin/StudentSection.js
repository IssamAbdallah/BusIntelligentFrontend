import { useState, useEffect } from 'react';

export default function StudentSection({ token, navigate, users, setErrorMsg, students, setStudents }) {
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    id: null,
    username: '',
    badgeId: '',
    cinParent: '',
    phoneParent: '',
    level: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) {
        setErrorMsg('Token manquant, veuillez vous reconnecter');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:80/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Fetched students:', data);

        if (response.ok) {
          setStudents(data.map(student => ({
            id: student._id,
            username: student.username,
            badgeId: student.badgeId,
            cinParent: student.cinParent,
            phoneParent: student.phoneParent,
            level: student.level,
            parent: student.parent ? student.parent.username : 'N/A',
          })));
        } else {
          console.error('Failed to fetch students:', data.message);
          setErrorMsg(`Erreur: ${data.message || 'Impossible de charger les élèves'}`);
        }
      } catch (error) {
        console.error('Error fetching students:', error.message);
        setErrorMsg(`Erreur réseau: ${error.message}`);
      }
    };

    fetchStudents();
  }, [token, navigate, setErrorMsg, setStudents]);

  const countStudentsByParent = (cinParent) => {
    return students.filter(student => student.cinParent === cinParent).length;
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.username || !newStudent.badgeId || !newStudent.cinParent || !newStudent.phoneParent || !newStudent.level) {
      console.error('Tous les champs obligatoires sont requis');
      setErrorMsg('Veuillez remplir tous les champs obligatoires (Nom, Badge ID, CIN Parent, Téléphone Parent, Niveau)');
      return;
    }

    const parentExists = users.some(user => user.cinNumber === newStudent.cinParent && user.role === 'parent');
    if (!parentExists) {
      setErrorMsg('Le CIN du parent sélectionné n\'existe pas ou ne correspond pas à un parent.');
      return;
    }

    const studentToAdd = {
      username: newStudent.username,
      badgeId: newStudent.badgeId,
      cinParent: newStudent.cinParent,
      phoneParent: newStudent.phoneParent,
      level: newStudent.level,
    };

    console.log('Sending student data:', studentToAdd);

    try {
      if (!token) {
        setErrorMsg('Token manquant, veuillez vous reconnecter');
        navigate('/login');
        return;
      }

      const method = newStudent.id ? 'PUT' : 'POST';
      const url = newStudent.id
        ? `http://localhost:80/api/students/${newStudent.id}`
        : 'http://localhost:80/api/students';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(studentToAdd),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        if (newStudent.id) {
          setStudents(students.map(student => student.id === newStudent.id ? {
            id: newStudent.id,
            username: data.username,
            badgeId: data.badgeId,
            cinParent: data.cinParent,
            phoneParent: data.phoneParent,
            level: data.level,
            parent: data.parent ? data.parent.username : 'N/A',
          } : student));
        } else {
          setStudents([...students, {
            id: data._id,
            username: data.username,
            badgeId: data.badgeId,
            cinParent: data.cinParent,
            phoneParent: data.phoneParent,
            level: data.level,
            parent: data.parent ? data.parent.username : 'N/A',
          }]);
        }
        setNewStudent({ id: null, username: '', badgeId: '', cinParent: '', phoneParent: '', level: '' });
        setShowForm(false);
        setErrorMsg('');
      } else {
        console.error('Failed to save student:', data.message);
        setErrorMsg(`Erreur: ${data.message || 'Impossible d\'enregistrer l\'élève'}`);
      }
    } catch (error) {
      console.error('Error saving student:', error.message);
      setErrorMsg(`Erreur réseau: ${error.message}`);
    }
  };

  const handleEditStudent = (student) => {
    setNewStudent({
      id: student.id,
      username: student.username,
      badgeId: student.badgeId,
      cinParent: student.cinParent,
      phoneParent: student.phoneParent,
      level: student.level,
    });
    setShowForm(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:80/api/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Delete response status:', response.status);
      const data = await response.json();
      console.log('Delete response data:', data);

      if (response.ok) {
        setStudents(students.filter(student => student.id !== id));
      } else {
        console.error('Failed to delete student:', data.message);
        setErrorMsg(`Erreur: ${data.message || 'Impossible de supprimer l\'élève'}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error.message);
      setErrorMsg(`Erreur réseau: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Liste des élèves</h1>
        <button
          onClick={() => {
            setNewStudent({ id: null, username: '', badgeId: '', cinParent: '', phoneParent: '', level: '' });
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Ajouter
        </button>
      </div>

      {showForm && (
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSubmitStudent} className="space-y-4">
            <p className="text-sm text-gray-600 italic">
              Note : Un parent peut être associé à plusieurs élèves. Sélectionnez un parent existant ci-dessous.
            </p>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Nom d'utilisateur"
                value={newStudent.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="badgeId">
                Badge ID
              </label>
              <input
                id="badgeId"
                name="badgeId"
                type="text"
                placeholder="Badge ID"
                value={newStudent.badgeId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cinParent">
                CIN du Parent
              </label>
              <select
                id="cinParent"
                name="cinParent"
                value={newStudent.cinParent}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un parent</option>
                {users.filter(user => user.role === 'parent').map(user => (
                  <option key={user.id} value={user.cinNumber}>
                    {user.username} (CIN: {user.cinNumber}) - {countStudentsByParent(user.cinNumber)} élève(s)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phoneParent">
                Téléphone du Parent
              </label>
              <input
                id="phoneParent"
                name="phoneParent"
                type="text"
                placeholder="Téléphone du Parent"
                value={newStudent.phoneParent}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="level">
                Niveau
              </label>
              <input
                id="level"
                name="level"
                type="text"
                placeholder="Niveau (ex: 5ème année)"
                value={newStudent.level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {newStudent.id ? 'Sauvegarder' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
                Badge ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CIN du Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone du Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.badgeId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.parent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.cinParent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.phoneParent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
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
  );
}