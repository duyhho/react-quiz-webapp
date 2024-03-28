import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SelectScreen from './components/SelectScreen';
import Examples from './components/Examples';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const appStyle = {
    backgroundColor: "var(--color-warm-orange)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (

    <div className="quiz" style={appStyle}>
      <Routes>
        <Route exact path="/" element={<SelectScreen />} />
        <Route path="/examples" element={<Examples />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>

  );
}
