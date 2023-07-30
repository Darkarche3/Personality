/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Signup from "../pages/Signup";

describe('Registration', () => {
  it('should submit fullname, email, username, password and confirmpassword', async () => {
    const mockRegister = jest.fn();
    const { getByTestId } = render(<Signup onSubmit={mockRegister} />);
    const fullNameInput = getByTestId('fullname-input')
    const emailInput = getByTestId('email-input');
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const confirmPasswordInput = getByTestId('password-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(fullNameInput, 'myfullname');
    fireEvent.changeText(emailInput, 'myemail@gmail.com');
    fireEvent.changeText(usernameInput, 'myusername');
    fireEvent.changeText(passwordInput, 'mypassword');
    fireEvent.changeText(confirmPasswordInput, 'mypassword');
    fireEvent.press(submitButton);

    expect(mockRegister).toHaveBeenCalledWith('myfullname', 'myemail@gmail.com','myusername','mypassword' , 'mypassword');
  });
});
