import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import History from './History';

describe('History Feature', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([]),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('1-1: The main view should render a two-column layout, with the history sidebar visible on the right', async () => {
    await act(async () => {
      render(<App />);
    });
    const historySidebar = screen.getByTestId('history-sidebar');
    expect(historySidebar).toBeInTheDocument();
  });

  test('1-2: On initial load, the history sidebar should be empty or show a "No history yet" message', () => {
    render(<History history={[]} />);
    const noHistoryMessage = screen.getByText(/no history yet/i);
    expect(noHistoryMessage).toBeInTheDocument();
  });

  test('2-1: After a successful text improvement submission, a GET request should be made to the /api/history endpoint', async () => {
    await act(async () => {
      render(<App />);
    });

    const textArea = screen.getByPlaceholderText('Paste your answer here...');
    const submitButton = screen.getByText('Improve My Answer');

    // Mock a successful text improvement submission
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ improved_text: 'This is the improved text.' }),
    });

    // Simulate user input and submission
    await act(async () => {
      fireEvent.change(textArea, { target: { value: 'This is the original text.' } });
      fireEvent.click(submitButton);
    });

    // Wait for the component to update
    await screen.findByText('Improved Text');

    // Check if fetch was called to get the history
    expect(window.fetch).toHaveBeenCalledWith('http://localhost:8000/api/history');
  });

  test('2-2: Given a successful response from the API, the history sidebar should render a list of history items', async () => {
    const mockHistory = [
      { id: 1, original_text: 'This is the first history item.' },
      { id: 2, original_text: 'This is the second history item.' },
    ];

    render(<History history={mockHistory} />);

    const historyItems = await screen.findAllByRole('listitem');
    expect(historyItems).toHaveLength(2);
  });

  test('2-3: The items in the list must be ordered with the newest entry at the top', async () => {
    const mockHistory = [
      { id: 2, original_text: 'New history item', created_at: '2025-08-24T10:00:00Z' },
      { id: 1, original_text: 'Old history item', created_at: '2025-08-23T10:00:00Z' },
    ];

    render(<History history={mockHistory} />);

    const historyItems = await screen.findAllByRole('listitem');
    expect(historyItems[0]).toHaveTextContent('New history item');
    expect(historyItems[1]).toHaveTextContent('Old history item');
  });

  test('2-4: Each item in the list should be rendered as a card containing a snippet of the original text and the creation date', async () => {
    const mockHistory = [
      { id: 1, original_text: 'This is the first history item.', created_at: '2025-08-24T10:00:00Z' },
    ];

    render(<History history={mockHistory} />);

    const historyItem = await screen.findByRole('listitem');
    expect(historyItem).toHaveTextContent('This is the first history item.');
    expect(historyItem).toHaveTextContent('8/24/2025');
  });

  test('3-1: When a user clicks on a history card, a popup modal should appear', async () => {
    const mockHistory = [
      { id: 1, original_text: 'This is the first history item.', improved_text: 'This is the improved first history item.', created_at: '2025-08-24T10:00:00Z' },
    ];

    render(<History history={mockHistory} />);

    const historyItem = await screen.findByRole('listitem');
    fireEvent.click(historyItem);

    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  test('3-2: The modal must display the full original_text and improved_text for the selected item', async () => {
    const mockHistory = [
      { id: 1, original_text: 'This is the original text.', improved_text: 'This is the improved text.', created_at: '2025-08-24T10:00:00Z' },
    ];

    render(<History history={mockHistory} />);

    const historyItem = await screen.findByRole('listitem');
    fireEvent.click(historyItem);

    const modal = await screen.findByRole('dialog');
    expect(modal).toHaveTextContent('This is the original text.');
    expect(modal).toHaveTextContent('This is the improved text.');
  });

  test('3-3: The differences between the two texts should be correctly highlighted within the modal', async () => {
    const mockHistory = [
      { id: 1, original_text: 'This is the original text.', improved_text: 'This is the improved text.', created_at: '2025-08-24T10:00:00Z' },
    ];

    render(<History history={mockHistory} />);

    const historyItem = await screen.findByRole('listitem');
    fireEvent.click(historyItem);

    const modal = await screen.findByRole('dialog');
    const deletedText = modal.querySelector('.diff-deleted');
    const insertedText = modal.querySelector('.diff-inserted');

    expect(deletedText).toBeInTheDocument();
    expect(insertedText).toBeInTheDocument();
  });
});
