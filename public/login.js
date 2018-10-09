const loginUser = document.querySelector(".login-user");

loginUser.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginUser.querySelector(".username").value;
    const password = loginUser.querySelector(".password").value;
    request("POST", "/login", {username, password})
        .then((response) => {
            if (response.status === 200) {
                console.log("Login succes!")
                window.location.assign("/todo");
            }
            else {
                console.log("Login failed!")
                window.location.assign("/login");
            }
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
