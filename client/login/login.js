import * as helper from '../helper/helper.js'

const handleLogin = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.elements["username"].value;
    const password = form.elements["password"].value;
    const csrf = form.elements["_csrf"].value;
    const errorMessage = form.querySelector(".errorMessage");

    if (username === '' || password === '') {
        errorMessage.textContent = "Username and Password are required!";
        return false;
    }

    errorMessage.textContent = "";

    const loginError = (err) => {
        err.then(data => {
            errorMessage.textContent = data.error;
        })
    }

    const data = { username: username, pass: password, _csrf: csrf };
    helper.sendPost("/login", data, loginError).then((data) => {
        if (data === undefined) return false;

        window.location.assign(data.redirect);
    });

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.elements["username"].value;
    const password = form.elements["password"].value;
    const password2 = form.elements["password2"].value;
    const csrf = form.elements["_csrf"].value;
    const errorMessage = form.querySelector(".errorMessage");

    if (username === '' || password === '') {
        errorMessage.textContent = "Username and Password are required!";
        return false;
    }

    if (password != password2) {
        errorMessage.textContent = "Passwords do not match!";
        return false;
    }
    errorMessage.textContent = "";

    const signupError = (err) => {
        err.then(data => {
            errorMessage.textContent = data.error;
        })
    }

    const data = { username: username, pass: password, pass2: password2, _csrf: csrf };
    helper.sendPost("/signup", data, signupError).then(data => {
        if (data === undefined) return;

        window.location.assign(data.redirect);
    });

    return false;
}

const Login = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
        >

            <label htmlFor="username">Username:</label>
            <input className="u-full-width" type="text" placeholder="Enter Username Here..." name="username" />

            <label htmlFor="username">Password:</label>
            <input className="u-full-width" type="password" placeholder="Enter Password Here..." name="password" />

            <p name="errorMessage" className="errorMessage"></p>

            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="button-primary" type="submit" value="Login" />
        </form>
    );
}

const Signup = (props) => {
    return (
        <form id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
        >

            <label htmlFor="username">Username:</label>
            <input className="u-full-width" type="text" placeholder="Type Username here..." name="username" />

            <label htmlFor="username">Password:</label>
            <input className="u-full-width" type="password" placeholder="Type Password here..." name="password" />

            <label htmlFor="username">Re-Type Password:</label>
            <input className="u-full-width" type="password" placeholder="Re-Type Password Here..." name="password2" />

            <p className="errorMessage"></p>

            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="button-primary" type="submit" value="Sign up" />
        </form>
    );
}

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <Login csrf={csrf} />,
        document.querySelector("#content")
    );
}

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <Signup csrf={csrf} />,
        document.querySelector("#content")
    );
}

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
}

const getToken = () => {
    helper.sendGet("/getToken").then((data) => setup(data.csrfToken));
}

window.onload = () => {
    getToken();
}