import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home.jsx';
import Register from './views/Register.jsx';
import SignIN from './views/SignIn.jsx';
import Dashboard from './views/Dashboard.jsx';
import Profile from './views/Profile.jsx';
import Update from './views/Update.jsx';
import Reservations from './views/Rerservations.jsx';
import AdminUsers from './views/Admin_users.jsx';
import AdminReservations from './views/Admin_reservations.jsx';
import Statistics from './views/Statistics.jsx';
import NewReservation from './views/New_reservation.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIN />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/update" element={<Update/>} />
        <Route path="/reservations" element={<Reservations/>} />
        <Route path="/new" element={<NewReservation/>} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/admin/users" element={<AdminUsers/>} />
        <Route path="/admin/reservations" element={<AdminReservations/>} />
      </Routes>
    </Router>
  );
}

export default App;  