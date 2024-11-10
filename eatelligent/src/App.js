import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul className="navbar">
            <li><a href="/">Home</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/about">About Us</a></li>
            <li><button>Sign Up</button></li>
            <li><button>Sign In</button></li>
          </ul>
        </nav>
        <h1>Eatelligent</h1>
      </header>
    </div>
  );
}

export default App;