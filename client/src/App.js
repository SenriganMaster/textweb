import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import TextDisplay from './TextDisplay';
import TextRegister from './TextRegister';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <nav className="main-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>テキスト表示</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>テキスト登録</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<TextDisplay darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/register" element={<TextRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;