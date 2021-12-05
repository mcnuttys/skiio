import * as helper from "../helper/helper.js";
import * as leaderboard from "./leaderboard.js";
import * as market from "./market.js";
import * as profile from "./profile.js";
import * as game from "../game/game.js";

const Main = (props) => {
    return (
        <div className="container">
            <div className="row" id="headerBar">
                <button type="button" className="button" id="marketButton" onClick={() => { console.dir("clicked market"); market.drawMarket(); game.closeGame(); }} >Market</button>
                <button type="button" className="button" id="leaderboardButton" onClick={() => { console.dir("clicked leaderboard"); leaderboard.drawLeaderboard(); game.closeGame(); }} >Leaderboards</button>
                <button type="button" className="button" id="gameButton" onClick={() => { console.dir("clicked game"); drawMain(); game.closeGame(); }} >Game</button>
                <button type="button" className="button" id="profileButton" onClick={() => { console.dir("clicked profile"); profile.drawProfile(); game.closeGame(); }} >Profile</button>
            </div>
        </div>
    )
}

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
                                <td>{slope.playerCount}</td>
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

const OpenResort = (props) => {
    return (
        <div className="u-full-width">
            <h4>Open Resort</h4>
            <label htmlFor="resortName">Resort Name:</label>
            <input type="text" id="resortName" placeholder="Enter resort name here..."></input>
            <label htmlFor="resortType">Resort Type:</label>
            <select id="resortType">
                <option value="alpine">Alpine</option>
                <option value="mountain">Mountain</option>
            </select>
            <button className="button-primary" onClick={async () => {
                const data = {
                    name: document.querySelector("#resortName").value,
                    type: document.querySelector("#resortType").value,
                    _csrf: props.csrf
                }

                const r = await helper.sendPost("/createResort", data);
                const csrf = await getToken().then(data => data.csrfToken);

                game.setup(r.resort.id, r.resort.seed, csrf);
            }}>Open Resort!</button>
        </div>
    )
}

const getToken = () => {
    return helper.sendGet("/getToken");
}

const openResortButton = async () => {
    const csrf = await getToken().then(data => data.csrfToken);

    ReactDOM.render(<OpenResort csrf={csrf} />, document.querySelector("#content"));
}

const drawSlopes = () => {
    ReactDOM.render(<Slopes />, document.querySelector('#content'));

    helper.sendGet("/slopes").then(data => {
        ReactDOM.render(<Slopes slopes={data.slopes} />, document.querySelector('#content'));
    });
}

const drawMain = () => {
    ReactDOM.render(<Main />, document.querySelector("#header"));

    drawSlopes();
}

window.onload = () => {
    drawMain();
}