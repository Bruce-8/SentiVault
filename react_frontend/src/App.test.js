import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SentiVault title', () => {
  render(<App />);
  const linkElement = screen.getByText(/SentiVault/i);
  expect(linkElement).toBeInTheDocument();
});
