import { permittedCrossDomainPolicies } from 'helmet';
import React from 'react'
import ReactDOM from 'react-dom'
import * as helper from "../helper/helper.js";

const Main = (props) => {
    return (
        <div className="container">
            <div className="row">
                <div className="two-thirds column">
                    <div className="row">
                        <h4 className="one-half column">Leaderboard</h4>
                        <select id="filterDropdown" onChange={updateLeaderboard} >
                            <option value="unset">Unset</option>
                            <option value="Alpine">Alpine</option>
                            <option value="Mountain">Mountain</option>
                        </select>
                    </div>
                    <div id="leaderboard"></div>
                </div>

                <div className="one-third column">
                    <h2>Game</h2>
                </div>
            </div>
        </div>
    )
}

const Leaderboard = (props) => {
    if (!props.leaderboard) {
        return (
            <p>No leaderboards to show!</p>
        );
    }

    if (props.leaderboard.length <= 0) {
        return (
            <p>This leaderboard has no entries to show!</p>
        );
    }

    return (
        <table className="u-full-width">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Score</th>
                </tr>
            </thead>
            {props.leaderboard.map(entry => {
                return (
                    <tbody>
                        <tr>
                            <td>{entry.name}</td>
                            <td>{entry.type}</td>
                            <td>{entry.score}</td>
                        </tr>
                    </tbody>
                );
            })}
        </table>
    )
}

const updateLeaderboard = (e) => {
    const action = `/leaderboard${(e.target.value != 'unset') ? "?filter=" + e.target.value : ''}`;
    if (e.target.value === 'unset') {
        helper.sendGet("/leaderboard").then(data => {
            ReactDOM.render(<Leaderboard leaderboard={data.leaderboard} />, document.querySelector("#leaderboard"));
        });
    } else {
        helper.sendGet("/leaderboard?filter=" + e.target.value).then(data => {
            ReactDOM.render(<Leaderboard leaderboard={data.leaderboard} />, document.querySelector("#leaderboard"));
        });
    }

}
const drawLeaderboard = () => {
    ReactDOM.render(<Leaderboard />, document.querySelector("#leaderboard"));

    helper.sendGet("/leaderboard").then(data => {
        ReactDOM.render(<Leaderboard leaderboard={data.leaderboard} />, document.querySelector("#leaderboard"));
    });
}

const setup = (csrf) => {
    ReactDOM.render(<Main />, document.querySelector("#content"));

    drawLeaderboard();

    document.querySelector("#addButton").addEventListener("click", (e) => {
        e.preventDefault();

        helper.sendPost("/leaderboard", { name: "Test", type: "Alpine", score: Math.random() * 100, _csrf: csrf });

        return false;
    })
}

const getToken = () => {
    helper.sendGet("/getToken").then((data) => setup(data.csrfToken));
}

window.onload = () => {
    getToken();
}