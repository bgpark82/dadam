import { render, screen, fireEvent, act, within } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  describe('Initial State', () => {
    beforeEach(() => {
      render(<App />);
    });

    test('should render a text input area', () => {
      const textareaElement = screen.getByPlaceholderText(/paste your answer here.../i);
      expect(textareaElement).toBeInTheDocument();
    });

    test('should render a disabled submit button', () => {
      const buttonElement = screen.getByRole('button', { name: /improve my answer/i });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toBeDisabled();
    });
  });

  describe('User Interaction', () => {
    beforeEach(() => {
      render(<App />);
    });

    test('2-1. should enable the submit button when text is entered', () => {
      const textareaElement = screen.getByPlaceholderText(/paste your answer here.../i);
      const buttonElement = screen.getByRole('button', { name: /improve my answer/i });

      fireEvent.change(textareaElement, { target: { value: 'hello' } });

      expect(buttonElement).toBeEnabled();
    });

    test('2-2. should disable the submit button when text is cleared', () => {
      const textareaElement = screen.getByPlaceholderText(/paste your answer here.../i);
      const buttonElement = screen.getByRole('button', { name: /improve my answer/i });

      fireEvent.change(textareaElement, { target: { value: 'hello' } });
      expect(buttonElement).toBeEnabled();

      fireEvent.change(textareaElement, { target: { value: '' } });
      expect(buttonElement).toBeDisabled();
    });
  });

  describe('API Call and Success State', () => {
    beforeEach(() => {
      jest.spyOn(window, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ improved_text: 'This is an improved answer.' }),
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('3-1, 3-2, 3-3, 3-4, 3-5. should show loading, then display two panels with results', async () => {
      render(<App />);
      const buttonElement = screen.getByRole('button', { name: /improve my answer/i });
      const textareaElement = screen.getByPlaceholderText(/paste your answer here.../i);
      const originalText = 'Hello World';

      fireEvent.change(textareaElement, { target: { value: originalText } });
      fireEvent.click(buttonElement);

      // 3-2: Check for loading indicator
      expect(screen.getByText(/improving.../i)).toBeInTheDocument();
      expect(buttonElement).toBeDisabled();

      // Wait for the results
      await screen.findByText('Original Text');

      // 3-3: Check that loading indicator is hidden
      expect(screen.queryByText(/improving.../i)).not.toBeInTheDocument();

      // 3-4 & 3-5: Check for results in two panels
      const originalPanel = screen.getByText('Original Text').closest('.panel');
      expect(originalPanel).toBeInTheDocument();
      expect(within(originalPanel).getByText(originalText)).toBeInTheDocument();

      expect(screen.getByText('Improved Text')).toBeInTheDocument();
      const improvedPanel = screen.getByText('Improved Text').closest('.panel');
      expect(improvedPanel).toBeInTheDocument();
    });
  });

  describe('API Call and Error State', () => {
    beforeEach(() => {
      jest.spyOn(window, 'fetch').mockResolvedValue({
        ok: false,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('4-1, 4-2. should show error message on failed API call', async () => {
      render(<App />);
      const buttonElement = screen.getByRole('button', { name: /improve my answer/i });
      const textareaElement = screen.getByPlaceholderText(/paste your answer here.../i);

      fireEvent.change(textareaElement, { target: { value: 'some text' } });
      fireEvent.click(buttonElement);

      // Check for loading state
      expect(screen.getByText(/improving.../i)).toBeInTheDocument();
      expect(buttonElement).toBeDisabled();

      // Wait for the error message
      await screen.findByText('Something went wrong. Please try again.');

      // Check for error message
      expect(screen.queryByText(/improving.../i)).not.toBeInTheDocument();
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });
});
