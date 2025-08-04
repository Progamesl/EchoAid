import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalAuthProvider } from './contexts/LocalAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import './index.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LocalAuthProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </LocalAuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App; 