import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Login } from '../pages/Login';

test('Navbar shows correct buttons in signup page', () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Login />
    </BrowserRouter>
  );

  const login = queryByTestId("login-button");
  const signup = queryByTestId("signup-button");
  const signout = queryByTestId("signout-button");

  expect(login).toBeInTheDocument();
  expect(signup).toBeInTheDocument();
  expect(signout).not.toBeInTheDocument();
});

test('Cannot submit empty information in signup page', () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Login />
    </BrowserRouter>
  );

  const username = queryByTestId("login-username");
  const password = queryByTestId("login-password");
  const submit = queryByTestId("login-submit");

  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("You cannot leave any field empty.");

  fireEvent.change(username, {target: {value: '0'}});

  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("You cannot leave any field empty.");

  fireEvent.change(password, {target: {value: '0'}});
  fireEvent.change(username, {target: {value: ''}});

  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("You cannot leave any field empty.");
});