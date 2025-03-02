import React, { useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import EventForm from './components/EventForm';
import ProgressForm from './components/ProgressForm';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [userId] = useState(1); // Simulamos un usuario con ID 1

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">GreatGym</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Registrar Entrenamiento</h2>
              <WorkoutForm userId={userId} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Registrar Evento</h2>
              <EventForm userId={userId} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Registrar Peso</h2>
              <ProgressForm userId={userId} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Tu Progreso</h2>
              <Dashboard userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;