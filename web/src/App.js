import React, { useState, useEffect, useRef } from 'react';
import DiffMatchPatch from 'diff-match-patch';
import './App.css';
import History from './History';

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
  const [history, setHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const timerIntervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerIntervalRef.current);
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = [];
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');

          setIsTranscribing(true); // Start loading indicator

          try {
            const response = await fetch('http://localhost:8000/api/transcribe', {
              method: 'POST',
              body: formData,
            });
            if (!response.ok) {
              throw new Error('Transcription failed');
            }
            const data = await response.json();
            setText(data.transcription);
          } catch (e) {
            setError('Something went wrong with transcription. Please try again.');
          } finally {
            setIsTranscribing(false); // Stop loading indicator
          }
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setTimer(0);
        timerIntervalRef.current = setInterval(() => {
          setTimer(prevTimer => prevTimer + 1);
        }, 1000);
      } catch (e) {
        setError('Could not start recording. Please check microphone permissions.');
      }
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/history');
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const data = await response.json();
      setHistory(data);
    } catch (e) {
      // For now, we'll just log the error
      console.error('Could not fetch history.');
    }
  };

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
      fetchHistory(); // Fetch history after successful improvement
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="app-container">
      <div className="main-panel">
        <h1 className="app-title">Dadam</h1>
        <h2 className="app-subtitle">Refine your interview answers</h2>
        <textarea
          className="text-area"
          placeholder="Paste your answer here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="button-container">
          <button
            className="submit-button"
            disabled={text.length === 0 || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Improving...' : 'Improve My Answer'}
          </button>
          <button
            className="record-button"
            onClick={handleToggleRecording}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          {isRecording && <div className="timer">{formatTime(timer)}</div>}
          {isTranscribing && <div className="loading-indicator">Transcribing...</div>}
        </div>

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
      <History history={history} />
    </div>
  );
}

export default App;