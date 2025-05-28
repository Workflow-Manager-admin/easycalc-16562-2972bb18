import React from 'react';
import './App.css';
import EasyCalc from './EasyCalc';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn" tabIndex={0}>EasyCalc</button>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{ paddingTop: "96px", paddingBottom: "36px" }}>
          <EasyCalc />
        </div>
      </main>
    </div>
  );
}

export default App;