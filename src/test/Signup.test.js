import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Signup } from '../pages/Signup';

test('Navbar shows correct buttons in signup page', () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
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
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const submit = queryByTestId("signup-submit");

  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("You cannot leave any field empty.");

  fireEvent.change(fullname, {target: {value: '0'}});

  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("You cannot leave any field empty.");

  fireEvent.change(email, {target: {value: '0'}});

  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("You cannot leave any field empty.");

  fireEvent.change(username, {target: {value: '0'}});

  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("You cannot leave any field empty.");

  fireEvent.change(password, {target: {value: '0'}});

  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("You cannot leave any field empty.");
});

test("Cannot submit full name with numbers", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson 2'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'Griddy'}});
  fireEvent.change(password, {target: {value: 'Schwarzkopf23'}});
  fireEvent.change(confirmpass, {target: {value: 'Schwarzkopf23'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("The name should only contain letters!");
});

test("Cannot submit invalid email", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'j.jettas2@google.com'}});
  fireEvent.change(username, {target: {value: 'Griddy'}});
  fireEvent.change(password, {target: {value: 'Schwarzkopf23'}});
  fireEvent.change(confirmpass, {target: {value: 'Schwarzkopf23'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Please enter a valid email.");
});

test("Cannot submit username that is too short", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'john'}});
  fireEvent.change(password, {target: {value: 'Schwarzkopf23'}});
  fireEvent.change(confirmpass, {target: {value: 'Schwarzkopf23'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");
});

test("Cannot submit username that is too long", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'HelloMyFullNameIsJohnJeffersonTheSecond'}});
  fireEvent.change(password, {target: {value: 'Schwarzkopf23'}});
  fireEvent.change(confirmpass, {target: {value: 'Schwarzkopf23'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");
});

test("Cannot submit username containing non-alphanumeric characters", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'Griddy.123'}});
  fireEvent.change(password, {target: {value: 'Schwarzkopf23'}});
  fireEvent.change(confirmpass, {target: {value: 'Schwarzkopf23'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");

  fireEvent.change(username, {target: {value: 'Griddy{}[]123'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");

  fireEvent.change(username, {target: {value: 'Griddy<\/>123'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");

  fireEvent.change(username, {target: {value: 'Griddy!*_=+;"123'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");
});

test("Cannot submit username that contains spaces", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'Griddy Iron'}});
  fireEvent.change(password, {target: {value: 'Schwarzkopf23'}});
  fireEvent.change(confirmpass, {target: {value: 'Schwarzkopf23'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");

  fireEvent.change(username, {target: {value: 'Griddy Iron Jettas'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");
});

test("Cannot submit password that is too short", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'Griddy'}});
  fireEvent.change(password, {target: {value: 'jettas1'}});
  fireEvent.change(confirmpass, {target: {value: 'jettas1'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Password must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, and number.");
});

test("Cannot submit password without an uppercase letter, lowercase letter, or number", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'Griddy'}});
  fireEvent.change(password, {target: {value: 'jettas123'}});
  fireEvent.change(confirmpass, {target: {value: 'jettas123'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Password must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, and number.");

  fireEvent.change(password, {target: {value: 'JETTAS123'}});
  fireEvent.change(confirmpass, {target: {value: 'JETTAS123'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Password must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, and number.");

  fireEvent.change(password, {target: {value: 'JettasOneTwoThree'}});
  fireEvent.change(confirmpass, {target: {value: 'JettasOneTwoThree'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Password must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, and number.");
});

test("Cannot submit non-matching password and confirm password", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'Griddy'}});
  fireEvent.change(password, {target: {value: 'Jettas123'}});
  fireEvent.change(confirmpass, {target: {value: 'Jettas1234'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Passwords do not match.");

  fireEvent.change(confirmpass, {target: {value: 'Jettas123'}});
  fireEvent.change(password, {target: {value: 'Jettas1234'}});
  fireEvent.click(submit);

  expect(screen.getByRole('alert')).toHaveTextContent("Passwords do not match.");
});

test("No error shows up when submitting all fields properly", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <Navbar />
      <Signup />
    </BrowserRouter>
  );

  const fullname = queryByTestId("signup-fullname");
  const email = queryByTestId("signup-email");
  const username = queryByTestId("signup-username");
  const password = queryByTestId("signup-password");
  const confirmpass = queryByTestId("signup-confirmpass");
  const submit = queryByTestId("signup-submit");

  fireEvent.change(fullname, {target: {value: 'John Jefferson II'}});
  fireEvent.change(email, {target: {value: 'jjettas2@gmail.com'}});
  fireEvent.change(username, {target: {value: 'Griddy'}});
  fireEvent.change(password, {target: {value: 'Jettas1234'}});
  fireEvent.change(confirmpass, {target: {value: 'Jettas1234'}});
  fireEvent.click(submit);

  expect(screen.queryByRole('alert')).toBeNull();
});