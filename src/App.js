import React, { useState } from 'react'
import './App.css'
import Start from './components/Start'
import Quiz from './components/Quiz'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [start, setStart] = useState(false);

  return (
    <div className="quiz">
      {start ? <Quiz /> : <Start props={setStart} />}
    </div>
  );
}

export default App;
