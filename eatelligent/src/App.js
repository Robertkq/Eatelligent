import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Contact from './components/Contact';
import About from './components/About';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import './App.css';

function App() {
  return (
    <Router>
      <EatelligentHeader />
      <main>
        <Routes>
            {/* Use an element to render a default home page */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </main>
    </Router>
  );
}

function EatelligentHeader() {
  return (
    <div className="EatHeader">
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
        <li><button onClick={() => navigate('/contact')}>Contact</button></li>
        <li><button onClick={() => navigate('/about')}>About Us</button></li>
        <li><button onClick={() => navigate('/signup')}>Sign Up</button></li>
        <li><button onClick={() => navigate('/signin')}>Sign In</button></li>
      </ul>
    </nav>
  );
}

function Home() {
  return <h2>Welcome to Eatelligent</h2>;
}

export default App;
