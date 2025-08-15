import React, { useState } from 'react';
import DiffMatchPatch from 'diff-match-patch';
import './App.css';

const DiffViewer = ({ diffs }) => {
  return (
    <div>
      {diffs.map(([op, text], index) => {
        const style = {
          backgroundColor:
            op === DiffMatchPatch.DIFF_INSERT
              ? '#e6ffed'
              : op === DiffMatchPatch.DIFF_DELETE
              ? '#ffebe9'
              : 'transparent',
        };
        return (
          <span key={index} style={style}>
            {text}
          </span>
        );
      })}
    </div>
  );
};

function App() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diffs, setDiffs] = useState([]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setDiffs([]);

    setTimeout(() => {
      try {
        if (text === 'error') {
          throw new Error('Something went wrong');
        }
        const improved = 'This is an improved answer.';
        const dmp = new DiffMatchPatch();
        const diff = dmp.diff_main(text, improved);
        dmp.diff_cleanupSemantic(diff);
        setDiffs(diff);
      } catch (e) {
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
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

      {error && <div className="error-message">{error}</div>}

      {diffs.length > 0 && !isLoading && !error && (
        <div className="results-container">
          <div className="panel">
            <h3>Original Text</h3>
            <p>{text}</p>
          </div>
          <div className="panel">
            <h3>Improved Text</h3>
            <DiffViewer diffs={diffs} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
