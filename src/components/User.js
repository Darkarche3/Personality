export const User = () => {
    var user = null;

    if (localStorage.getItem("keepLoggedIn") == "yes") {
        user = JSON.parse(localStorage.getItem('user'));
    } else {
        user = JSON.parse(sessionStorage.getItem('user'));
    }

    return user;
};