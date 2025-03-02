import React, { useState, useEffect } from 'react';

const EventForm = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const fetchEvents = () => {
    fetch(`http://127.0.0.1:8000/events/${userId}`)
      .then(res => res.json())
      .then(setEvents)
      .catch(error => console.error('Error fetching events:', error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://127.0.0.1:8000/events/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date }),
    });
    if (response.ok) {
      alert('Evento guardado');
      setTitle('');
      setDate('');
      fetchEvents(); 
    } else {
      const errorText = await response.text();
      alert(`Error al guardar el evento: ${errorText}`);
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

  return (
    <div>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título del evento</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Título del evento"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Fecha y Hora</label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Guardar</button>
      </form>

      <h4 className="mt-4 mb-3">Tus Eventos</h4>
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
    </div>
  );
};

export default EventForm;