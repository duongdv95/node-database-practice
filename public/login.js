const loginUser = document.querySelector(".login-user");

loginUser.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginUser.querySelector(".username").value;
    const password = loginUser.querySelector(".password").value;
    request("POST", "/login", {username, password})
        .then(({ status }) => {
            (status === 200) ? alert("Login succes!") : alert("Login failed!")
        })
})

function request (type, path, data) {
    return window.fetch(path, {
        method: type,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}
