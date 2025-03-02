import React, { useState, useEffect } from 'react';

const ProgressForm = ({ userId }) => {
  const [weight, setWeight] = useState('');
  const [progress, setProgress] = useState([]); 

  useEffect(() => {
    fetchProgress();
  }, [userId]);

  const fetchProgress = () => {
    fetch(`http://127.0.0.1:8000/progress/${userId}`)
      .then(res => res.json())
      .then(setProgress)
      .catch(error => console.error('Error fetching progress:', error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://127.0.0.1:8000/progress/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight: parseFloat(weight) }),
    });
    if (response.ok) {
      alert('Peso guardado');
      setWeight('');
      fetchProgress(); 
    } else {
      const errorText = await response.text();
      alert(`Error al guardar el peso: ${errorText}`);
    }
  };

  const deleteProgress = async (progressId) => {
    if (window.confirm('¿Estás seguro de eliminar este progreso?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/progress/${userId}/${progressId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al eliminar: ${errorText}`);
        }
        fetchProgress(); 
        alert('Progreso eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting progress:', error);
        alert(`No se pudo eliminar el progreso: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">Peso (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="form-control"
            placeholder="Peso (kg)"
            step="0.1"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Guardar</button>
      </form>

      <h4 className="mt-4 mb-3">Tu Progreso</h4>
      <ul className="list-group">
        {progress.map((p, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            {p.weight} kg
            <button 
              className="btn btn-danger btn-sm ms-2" 
              onClick={() => deleteProgress(p.id)}
            >
              <i className="bi bi-trash"></i> Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressForm;