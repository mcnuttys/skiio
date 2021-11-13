import React from 'react'
import ReactDOM from 'react-dom'
import * as helper from "../helper/helper.js";

const Leaderboard = (props) => {
    return (
        <h1>Test</h1>
    )
}

const logoutButton = () => {
    const error = (err) => {
        console.dir(err);
    }

    helper.sendGet("/logout", error).then(data => {
        if (data === undefined) return;

        window.location.assign(data.redirect);
    });
}

const setup = () => {
    ReactDOM.render(<Leaderboard />, document.querySelector("#content"));
}

window.onload = () => {
    setup();
}