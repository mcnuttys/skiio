import * as helper from "../helper/helper.js";
import * as leaderboard from "./leaderboard.js";
import * as market from "./market.js";
import * as profile from "./profile.js";
import * as game from "../game/game.js";

// Just the primary header bar with all the different buttons
const Main = (props) => {
    return (
        <div className="container">
            <div className="row" id="headerBar">
                <button type="button" className="button" id="marketButton" onClick={() => { market.drawMarket(); game.closeGame(); }} >Market</button>
                <button type="button" className="button" id="leaderboardButton" onClick={() => { leaderboard.drawLeaderboard(); game.closeGame(); }} >Leaderboards</button>
                <button type="button" className="button" id="gameButton" onClick={() => { drawMain(); game.closeGame(); }} >Game</button>
                <button type="button" className="button" id="profileButton" onClick={() => { profile.drawProfile(); game.closeGame(); }} >Profile</button>
            </div>
        </div>
    )
}

// The game screen before in game, lists out all available slopes
const Slopes = (props) => {
    if (!props.slopes || props.slopes.length <= 0) {
        return (
            <div className="u-full-width">
                <div className="row">
                    <h4 className="one-half column">Open Resorts</h4>
                    <div className="one-half column"><a className="button" onClick={drawSlopes}>Refresh</a></div>
                </div>
                <table className="u-full-width">
                    <thead>
                        <tr>
                            <th>Resort Name</th>
                            <th>Terrain Type</th>
                            <th>Skiier Count</th>
                            <th><a className="button button-primary" onClick={openResortButton}>Open Resort</a></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>No open resorts!</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>
            <div className="row">
                <h4 className="one-half column">Open Resorts</h4>
                <div className="one-half column"><a className="button" onClick={drawSlopes}>Refresh</a></div>
            </div>
            <table className="u-full-width">
                <thead>
                    <tr>
                        <th>Resort Name</th>
                        <th>Terrain Type</th>
                        <th>Skiier Count</th>
                        <th><button type="button" className="button-primary" onClick={openResortButton}>Open Resort</button></th>
                    </tr>
                </thead>
                <tbody>
                    {props.slopes.map(slope => {
                        return (
                            <tr key={slope.id}>
                                <td>{slope.name}</td>
                                <td>{slope.type}</td>
                                <td>{slope.players.length}</td>
                                <td><button type="button" className="button" onClick={async () => {
                                    let s = await helper.sendGet("/getSlope?id=" + slope.id);
                                    const csrf = await getToken().then(data => data.csrfToken);
                                    game.setup(s.slope.id, s.slope.seed, csrf);
                                }}>Join Slope</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// The settings for creating a slope
// The plan was to have some more but yeah
const OpenResort = (props) => {
    return (
        <div>
            <h4>Open Resort</h4>
            <label htmlFor="resortName">Resort Name:</label>
            <input type="text" id="resortName" placeholder="Enter resort name here..."></input>
            <p name="errorMessage" className="errorMessage"></p>
            <button className="button-primary" onClick={async () => {
                const errorMessage = document.querySelector(".errorMessage");

                const data = {
                    name: document.querySelector("#resortName").value,
                    type: "Alpine",
                    _csrf: props.csrf
                }

                const resortError = (err) => {
                    err.then(d => {
                        errorMessage.textContent = d.error;
                    })
                }

                const r = await helper.sendPost("/createResort", data, resortError);

                if (r.err) return;

                game.setup(r.resort.id, r.resort.seed, props.csrf);
            }}>Open Resort!</button>
        </div>
    )
}

// Gets the token from the server
const getToken = () => {
    return helper.sendGet("/getToken");
}

// Displays the create room menu
const openResortButton = async () => {
    const csrf = await getToken().then(data => data.csrfToken);

    ReactDOM.render(<OpenResort csrf={csrf} />, document.querySelector("#content"));
}

// Displays all the slopes
const drawSlopes = () => {
    ReactDOM.render(<Slopes />, document.querySelector('#content'));

    helper.sendGet("/slopes").then(data => {
        console.dir(data.slopes);
        ReactDOM.render(<Slopes slopes={data.slopes} />, document.querySelector('#content'));
    });
}

// Draws the header bar
const drawMain = () => {
    ReactDOM.render(<Main />, document.querySelector("#header"));

    drawSlopes();
}

window.onload = () => {
    drawMain();
}