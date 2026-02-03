import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './routes/Home';
import Navbar from './components/landingSite/Navbar';
import Footer from './components/landingSite/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TeacherDashboard from './components/dashboards/TeacherDashboard'; 
import AdminDashboard from './components/dashboards/AdminDashboard'; 
import ParentDashboard from './components/dashboards/ParentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/teacher-dashboard' element={<TeacherDashboard />} /> 
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/parent-dashboard' element={<ParentDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
