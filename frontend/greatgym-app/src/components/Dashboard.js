import React, { useState, useEffect } from 'react';

const Dashboard = ({ userId }) => {
  const [workouts, setWorkouts] = useState([]);
  const [events, setEvents] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    fetchWorkouts();
    fetchEvents();
    fetchProgress();
  }, [userId]);

  const fetchWorkouts = () => {
    fetch(`http://127.0.0.1:8000/workouts/${userId}`)
      .then(res => res.json())
      .then(setWorkouts)
      .catch(error => console.error('Error fetching workouts:', error));
  };

  const fetchEvents = () => {
    fetch(`http://127.0.0.1:8000/events/${userId}`)
      .then(res => res.json())
      .then(setEvents)
      .catch(error => console.error('Error fetching events:', error));
  };

  const fetchProgress = () => {
    fetch(`http://127.0.0.1:8000/progress/${userId}`)
      .then(res => res.json())
      .then(setProgress)
      .catch(error => console.error('Error fetching progress:', error));
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

  const deleteEvent = async (eventId) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/events/${userId}/${eventId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al eliminar: ${errorText}`);
        }
        fetchEvents(); 
        alert('Evento eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert(`No se pudo eliminar el evento: ${error.message}`);
      }
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
      <h3 className="mb-3">Entrenamientos</h3>
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
      <h3 className="mt-4 mb-3">Eventos</h3>
      <ul className="list-group">
        {events.map((e, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            {e.title} - {e.date}
            <button 
              className="btn btn-danger btn-sm ms-2" 
              onClick={() => deleteEvent(e.id)}
            >
              <i className="bi bi-trash"></i> Eliminar
            </button>
          </li>
        ))}
      </ul>
      <h3 className="mt-4 mb-3">Progreso</h3>
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

export default Dashboard;