import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from "../pages/Login"

describe('Login', () => {
  it('should submit username and password', async () => {
    const mockLogin = jest.fn();
    const { getByTestId } = render(<Login onSubmit={mockLogin} />);
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const usernameInput = getByTestId('username-input');
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const passwordInput = getByTestId('password-input');
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(usernameInput, 'myusername');
    fireEvent.changeText(passwordInput, 'mypassword');
    fireEvent.press(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('myusername', 'mypassword');
  });
});
