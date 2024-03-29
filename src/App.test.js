import { render, screen } from '@testing-library/react';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';


test('renders website name', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/Personality/i);
  expect(linkElement).toBeInTheDocument();
});