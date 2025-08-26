import React, { useState } from 'react';
import Modal from './Modal';
import DiffMatchPatch from 'diff-match-patch';

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


const History = ({ history }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getDiffs = (original, improved) => {
    const dmp = new DiffMatchPatch();
    const diff = dmp.diff_main(original, improved);
    dmp.diff_cleanupSemantic(diff);
    return diff;
  };

  return (
    <div data-testid="history-sidebar">
      <h2>History</h2>
      {history.length === 0 && <p>No history yet.</p>}
      {history.length > 0 && (
        <ul>
          {history.map((item) => (
            <li key={item.id} onClick={() => setSelectedItem(item)}>
              <p>{item.original_text}</p>
              <p>{formatDate(item.created_at)}</p>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={selectedItem !== null} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <>
            <h3>Original Text</h3>
            <OriginalTextViewer diffs={getDiffs(selectedItem.original_text, selectedItem.improved_text)} />
            <h3>Improved Text</h3>
            <ImprovedTextViewer diffs={getDiffs(selectedItem.original_text, selectedItem.improved_text)} />
          </>
        )}
      </Modal>
    </div>
  );
};

export default History;
