import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home.jsx';
import Register from './views/Register.jsx';
import SignUp from './views/SignUp.jsx';
import ProfilePage from './views/ProfilePage.jsx';
import Profile from './views/Profile.jsx';
import Update from './views/Update.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profilePage" element={<ProfilePage />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/update" element={<Update/>} />
      </Routes>
    </Router>
  );
}

export default App;