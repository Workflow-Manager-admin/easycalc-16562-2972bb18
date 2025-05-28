import React from 'react';
import './App.css';
import Calculator from './Calculator';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app" style={{ background: '#f0f0f0', minHeight: '100vh' }}>
      <nav className="navbar" style={{ background: '#007bff', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo" style={{ color: '#fff' }}>
              <span className="logo-symbol" style={{ color: '#fff' }}>⎈</span> EasyCalc
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div
          className="container"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh' }}
        >
          <Calculator />
        </div>
      </main>
    </div>
  );
}

export default App;