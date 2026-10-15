import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('adds, completes, filters, and removes tasks through shared state', () => {
  render(<App />);

  const input = screen.getByLabelText('New task');
  fireEvent.change(input, { target: { value: '  Plan the week  ' } });
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByText('Plan the week')).toBeInTheDocument();
  expect(input).toHaveValue('');

  const completionCheckbox = screen.getByRole('checkbox', {
    name: 'Mark Plan the week complete',
  });
  fireEvent.click(completionCheckbox);
  expect(completionCheckbox).toBeChecked();
  expect(screen.getByText('1 of 1 done')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Active' }));
  expect(screen.getByText('Nothing in this view.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
  expect(screen.getByText('Plan the week')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Remove Plan the week' }));
  expect(screen.queryByText('Plan the week')).not.toBeInTheDocument();
  expect(screen.getByText('A clear page. A good place to begin.')).toBeInTheDocument();
});

test('ignores empty task submissions', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByRole('heading', { name: /tasks/i })).toBeInTheDocument();
  expect(screen.getByText('A clear page. A good place to begin.')).toBeInTheDocument();
});
