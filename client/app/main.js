import React from 'react'
import ReactDOM from 'react-dom'
import * as helper from "../helper/helper.js";

const Main = (props) => {
    return (
        <div className="container">
            <div class="row" id="headerBar">
                <a class="button" id="marketButton" onClick={() => { console.dir("clicked market") }} >Market</a>
                <a class="button" id="gameButton" onClick={() => { console.dir("clicked game") }} >Game</a>
                <a class="button" id="profileButton" onClick={() => { console.dir("clicked profile") }} >Profile</a>
            </div>
            <div className="row">
                <div className="one-half column">
                    <div className="row">
                        <h4 className="one-half column">Leaderboard</h4>
                        <select id="filterDropdown" onChange={updateLeaderboard} >
                            <option value="unset">All</option>
                            <option value="Alpine">Alpine</option>
                            <option value="Mountain">Mountain</option>
                        </select>
                    </div>
                    <div id="leaderboard"></div>
                </div>

                <div className="one-half column">
                    <div className="row">
                        <h4 className="one-half column">Open Resorts</h4>
                        <a className="button" onClick={drawSlopes}>Refresh</a>
                    </div>
                    <div id="slopesList"></div>
                </div>
            </div>
        </div>
    )
}

const Slopes = (props) => {
    if (!props.slopes || props.slopes.length <= 0) {
        return (
            <p>No slopes are open right now!</p>
        );
    }

    return (
        <table className="u-full-wdith">
            <thead>
                <tr>
                    <th>Resort Name</th>
                    <th>Terrain Type</th>
                    <th>Skiier Count</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {props.slopes.map(slope => {
                    return (
                        <tr>
                            <td>{slope.name}</td>
                            <td>{slope.type}</td>
                            <td>{slope.playerCount}</td>
                            <td><a className="button" onClick={() => {
                                console.dir("Join slope: " + slope.name)
                            }}>Join Slope</a></td>
                        </tr>
                    );
                })}
            </tbody>
        </table >
    );
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
            <tbody>
                {props.leaderboard.map(entry => {
                    return (
                        <tr>
                            <td>{entry.name}</td>
                            <td>{entry.type}</td>
                            <td>{entry.score}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

const updateLeaderboard = (e) => {
    const action = `/leaderboard${(e.target.value != 'unset') ? "?filter=" + e.target.value : ''}`;
    helper.sendGet(action).then(data => {
        ReactDOM.render(<Leaderboard leaderboard={data.leaderboard} />, document.querySelector("#leaderboard"));
    });
}

const drawLeaderboard = () => {
    ReactDOM.render(<Leaderboard />, document.querySelector("#leaderboard"));

    helper.sendGet("/leaderboard").then(data => {
        ReactDOM.render(<Leaderboard leaderboard={data.leaderboard} />, document.querySelector("#leaderboard"));
    });
}

const drawSlopes = () => {
    ReactDOM.render(<Slopes />, document.querySelector('#slopesList'));

    helper.sendGet("/slopes").then(data => {
        console.dir(data.slopes);
        ReactDOM.render(<Slopes slopes={data.slopes} />, document.querySelector('#slopesList'));
    });
}

const setup = (csrf) => {
    ReactDOM.render(<Main />, document.querySelector("#content"));

    drawLeaderboard();
    drawSlopes();
}

const getToken = () => {
    helper.sendGet("/getToken").then((data) => setup(data.csrfToken));
}

window.onload = () => {
    setup();
}