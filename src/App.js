import React, { useState } from 'react'
import './App.css'
import Start from './components/Start'
import Quiz from './components/Quiz'
import SelectScreen from './components/SelectScreen'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [start, setStart] = useState(false);

  // Apply a style object to the div
  const appStyle = {
    backgroundColor: "var(--color-warm-orange)",
    minHeight: "100vh", // Ensure minimum height is 100% of the viewport height
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div className="quiz"
      style={appStyle}
    >
      {/* {start ? <Quiz /> : <Start props={setStart} />} */}
      <SelectScreen />
    </div>
  );
}
