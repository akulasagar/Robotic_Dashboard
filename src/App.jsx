import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import "./App.css"

import Login from './pages/Login';
import Robots from './pages/Robots';
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts';
import Events from './pages/Events';
import ManualControlpage from './pages/ManualControlpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Robots/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path='/events' element={<Events/>}/>
        <Route path='/alerts' element={<Alerts/>}/>
        <Route path='/controls' element={<ManualControlpage/>}/>
      </Routes>
    </Router>
  );
}

export default App;