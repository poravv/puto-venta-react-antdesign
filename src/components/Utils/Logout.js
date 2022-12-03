
export const Logout = () => {
    window.localStorage.removeItem('loggedSiswebUser');
    // eslint-disable-next-line
    window.location.href = window.location.href;
}