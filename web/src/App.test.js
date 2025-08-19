import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mocking fetch
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
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

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ improved_text: improvedText }),
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
      fetch.mockRejectedValueOnce(new Error('API failure'));

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
});