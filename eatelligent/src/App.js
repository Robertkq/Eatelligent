import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Diets from './components/Diets';
import About from './components/About';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ViewDiet from './components/ViewDiet';
import './App.css';

function App() {
  return (
    <Router>
      <EatelligentHeader />
      <main>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diets" element={<Diets />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/view-diet/:dietId" element={<ViewDiet />} />
          </Routes>
        </main>
    </Router>
  );
}

function EatelligentHeader() {
  return (
    <div className="App-header">
      <header>
        <h1>Eatelligent</h1>
        <Navigation />
      </header>
    </div>
  );
}

function Navigation() {
  const navigate = useNavigate();

  return (
    <nav>
      <ul className="navbar">
        <li><button onClick={() => navigate('/diets')}>Diets</button></li>
        <li><button onClick={() => navigate('/about')}>About Us</button></li>
        <li><button onClick={() => navigate('/signup')}>Sign Up</button></li>
        <li><button onClick={() => navigate('/signin')}>Sign In</button></li>
      </ul>
    </nav>
  );
}

function Home() {
  return (
<div className="centered-div">
    <h2>Welcome to Eatelligent</h2>
</div>
  );
}

export default App;
