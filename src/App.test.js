import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component Initial State', () => {
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