import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';

// Mocking fetch
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockImplementation((url) => {
      if (url.endsWith('/api/history')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error(`unhandled fetch request to ${url}`));
    });
  });

  describe('Initial State', () => {
    test('1-1. should render a text input area and a submit button', () => {
      render(<App />);
      expect(screen.getByPlaceholderText(/paste your answer here.../i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /improve my answer/i })).toBeInTheDocument();
    });

    test('1-2. should render the submit button in a disabled state initially', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /improve my answer/i })).toBeDisabled();
    });
  });

  describe('User Interaction', () => {
    test('2-1. enables submit button when user types', () => {
      render(<App />);
      const textarea = screen.getByPlaceholderText(/paste your answer here.../i);
      fireEvent.change(textarea, { target: { value: 'Some text' } });
      expect(screen.getByRole('button', { name: /improve my answer/i })).toBeEnabled();
    });

    test('2-2. disables submit button when text is cleared', () => {
      render(<App />);
      const textarea = screen.getByPlaceholderText(/paste your answer here.../i);
      fireEvent.change(textarea, { target: { value: 'Some text' } });
      fireEvent.change(textarea, { target: { value: '' } });
      expect(screen.getByRole('button', { name: /improve my answer/i })).toBeDisabled();
    });
  });

  describe('API Call and State Changes', () => {
    test('3-1 to 3-5. handles API call, loading, and displays diff results correctly', async () => {
      const originalText = 'I is a boy.';
      const improvedText = 'I am a boy.';

      fetch.mockImplementation((url) => {
        if (url.endsWith('/api/improve-text')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ improved_text: improvedText }),
          });
        }
        if (url.endsWith('/api/history')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.reject(new Error(`unhandled fetch request to ${url}`));
      });

      render(<App />);

      const textarea = screen.getByPlaceholderText(/paste your answer here.../i);
      const button = screen.getByRole('button', { name: /improve my answer/i });

      fireEvent.change(textarea, { target: { value: originalText } });
      fireEvent.click(button);

      // 3-2. Loading state is shown
      expect(screen.getByText(/improving.../i)).toBeInTheDocument();
      expect(button).toBeDisabled();

      // Wait for the results to appear
      await waitFor(() => expect(screen.getByText('Original Text')).toBeInTheDocument());

      // 3-3. Loading state is hidden
      expect(screen.queryByText(/improving.../i)).not.toBeInTheDocument();

      // 3-4 & 3-5. Panels with highlighted diffs are shown
      const originalPanel = screen.getByText('Original Text').parentElement;
      const improvedPanel = screen.getByText('Improved Text').parentElement;

      // Check Original Text Panel
      const deletedPart = originalPanel.querySelector('.diff-deleted');
      expect(deletedPart).toBeInTheDocument();
      expect(deletedPart.textContent).toBe('is');
      // Check that the common parts are still there
      expect(originalPanel.textContent).toContain('I');
      expect(originalPanel.textContent).toContain('a boy.');

      // Check Improved Text Panel
      const insertedPart = improvedPanel.querySelector('.diff-inserted');
      expect(insertedPart).toBeInTheDocument();
      expect(insertedPart.textContent).toBe('am');
      expect(improvedPanel.textContent).toContain('I');
      expect(improvedPanel.textContent).toContain('a boy.');
    });

    test('4-1, 4-2. handles API error state', async () => {
      fetch.mockImplementation((url) => {
        if (url.endsWith('/api/improve-text')) {
          return Promise.reject(new Error('API failure'));
        }
        if (url.endsWith('/api/history')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.reject(new Error(`unhandled fetch request to ${url}`));
      });

      render(<App />);

      const textarea = screen.getByPlaceholderText(/paste your answer here.../i);
      const button = screen.getByRole('button', { name: /improve my answer/i });

      fireEvent.change(textarea, { target: { value: 'Some text' } });
      fireEvent.click(button);

      // Wait for error message
      await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());

      expect(screen.queryByText(/improving.../i)).not.toBeInTheDocument();
    });
  });

  describe('Voice Recording', () => {
    beforeAll(() => {
      global.MediaRecorder = jest.fn().mockImplementation(stream => ({
        start: jest.fn(),
        stop: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        state: 'inactive',
      }));

      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: jest.fn().mockResolvedValue({}),
        },
        configurable: true,
      });
    });

    test('1-1, 1-2. starts and stops recording', async () => {
      render(<App />);
      
      const startButton = screen.getByRole('button', { name: /start recording/i });
      expect(startButton).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument();
      });
      expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();

      const stopButton = screen.getByRole('button', { name: /stop recording/i });
      await act(async () => {
        fireEvent.click(stopButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
      });
      expect(screen.queryByText(/\d{2}:\d{2}/)).not.toBeInTheDocument();
    });

    test('1-3, 2-1. sends audio data and displays transcription', async () => {
      const transcribedText = 'This is a test transcription.';
      fetch.mockImplementation((url) => {
        if (url.endsWith('/api/transcribe')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ transcription: transcribedText }),
          });
        }
        if (url.endsWith('/api/history')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.reject(new Error(`unhandled fetch request to ${url}`));
      });

      render(<App />);
      
      const startButton = screen.getByRole('button', { name: /start recording/i });
      await act(async () => {
        fireEvent.click(startButton);
      });

      const stopButton = await screen.findByRole('button', { name: /stop recording/i });
      await act(async () => {
        fireEvent.click(stopButton);
      });

      await waitFor(() => {
        expect(global.MediaRecorder).toHaveBeenCalled();
      });

      // Check that fetch was called for transcription
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/transcribe'),
          expect.any(Object)
        );
      });

      // Check that the textarea is updated
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/paste your answer here.../i)).toHaveValue(transcribedText);
      });
    });
  });
});