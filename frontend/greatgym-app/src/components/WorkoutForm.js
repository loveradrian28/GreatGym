import React, { useState, useEffect } from 'react';

const WorkoutForm = ({ userId }) => {
  const [type, setType] = useState('strength');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [workouts, setWorkouts] = useState([]); 

  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

  const fetchWorkouts = () => {
    fetch(`http://127.0.0.1:8000/workouts/${userId}`)
      .then(res => res.json())
      .then(setWorkouts)
      .catch(error => console.error('Error fetching workouts:', error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://127.0.0.1:8000/workouts/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, description, duration: parseInt(duration) }),
    });
    if (response.ok) {
      alert('Entrenamiento guardado');
      setDescription('');
      setDuration('');
      fetchWorkouts(); 
    } else {
      const errorText = await response.text();
      alert(`Error al guardar el entrenamiento: ${errorText}`);
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (window.confirm('¿Estás seguro de eliminar este entrenamiento?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/workouts/${userId}/${workoutId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al eliminar: ${errorText}`);
        }
        fetchWorkouts(); 
        alert('Entrenamiento eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert(`No se pudo eliminar el entrenamiento: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Tipo</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-select"
          >
            <option value="strength">Fuerza</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripción</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            placeholder="Descripción"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="duration" className="form-label">Duración (min)</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="form-control"
            placeholder="Duración (min)"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Guardar</button>
      </form>

      <h4 className="mt-4 mb-3">Tus Entrenamientos</h4>
      <ul className="list-group">
        {workouts.map((w, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            {w.type} - {w.description} ({w.duration} min)
            <button 
              className="btn btn-danger btn-sm ms-2" 
              onClick={() => deleteWorkout(w.id)}
            >
              <i className="bi bi-trash"></i> Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutForm;