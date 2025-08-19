
import React, { useState } from 'react';
import DiffMatchPatch from 'diff-match-patch';
import './App.css';

// A component to render the original text with deletions highlighted
const OriginalTextViewer = ({ diffs }) => {
  return (
    <p>
      {diffs.map(([op, text], index) => {
        if (op === DiffMatchPatch.DIFF_INSERT) {
          return null; // Don't show insertions in the original text view
        }
        const className = op === DiffMatchPatch.DIFF_DELETE ? 'diff-deleted' : '';
        return (
          <span key={index} className={className}>
            {text}
          </span>
        );
      })}
    </p>
  );
};

// A component to render the improved text with insertions highlighted
const ImprovedTextViewer = ({ diffs }) => {
  return (
    <p>
      {diffs.map(([op, text], index) => {
        if (op === DiffMatchPatch.DIFF_DELETE) {
          return null; // Don't show deletions in the improved text view
        }
        const className = op === DiffMatchPatch.DIFF_INSERT ? 'diff-inserted' : '';
        return (
          <span key={index} className={className}>
            {text}
          </span>
        );
      })}
    </p>
  );
};

function App() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diffs, setDiffs] = useState([]);
  const [originalText, setOriginalText] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setDiffs([]);
    setOriginalText(text); // Keep a copy of the original text

    try {
      const response = await fetch('http://localhost:8000/api/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      const improved = data.improved_text;
      const dmp = new DiffMatchPatch();
      const diff = dmp.diff_main(text, improved);
      dmp.diff_cleanupSemantic(diff);
      setDiffs(diff);
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

      {error && <div className="error-message">{error}</div>}

      {diffs.length > 0 && !isLoading && !error && (
        <div className="results-container">
          <div className="panel">
            <h3>Original Text</h3>
            <OriginalTextViewer diffs={diffs} />
          </div>
          <div className="panel">
            <h3>Improved Text</h3>
            <ImprovedTextViewer diffs={diffs} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
