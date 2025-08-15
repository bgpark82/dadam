import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    // This is where the API call will be made.
    // For now, we'll simulate it with a timeout.
    setTimeout(() => {
      setImprovedText('This is an improved answer.');
      setIsLoading(false);
    }, 1000);
  };

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
        disabled={text.length === 0 || isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? 'Improving...' : 'Improve My Answer'}
      </button>

      {improvedText && !isLoading && (
        <div className="results-container">
          <div className="panel">
            <h3>Original Text</h3>
            <p>{text}</p>
          </div>
          <div className="panel">
            <h3>Improved Text</h3>
            <p>{improvedText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;