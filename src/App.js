import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');

  return (
    <div className="app-container">
      <h1 className="app-title">Dadam</h1>
      <h2 className="app-subtitle">Refine your interview answers</h2>
      <textarea
        className="text-area"
        placeholder="Paste your answer here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button 
        className="submit-button" 
        disabled={text.length === 0}
      >
        Improve My Answer
      </button>
    </div>
  );
}

export default App;