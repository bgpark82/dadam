import { render, screen, fireEvent, act } from '@testing-library/react';
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

  describe('API Call', () => {
    jest.useFakeTimers();

    test('3-1. should show loading indicator and then hide it', () => {
      render(<App />);
      const buttonElement = screen.getByRole('button', { name: /improve my answer/i });
      const textareaElement = screen.getByPlaceholderText(/paste your answer here.../i);

      fireEvent.change(textareaElement, { target: { value: 'hello' } });
      fireEvent.click(buttonElement);

      expect(screen.getByText(/improving.../i)).toBeInTheDocument();
      expect(buttonElement).toBeDisabled();

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByText(/improve my answer/i)).toBeInTheDocument();
      expect(screen.queryByText(/improving.../i)).not.toBeInTheDocument();
    });
  });
});