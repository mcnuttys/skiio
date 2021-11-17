import * as helper from "../helper/helper.js";
import * as leaderboard from "./leaderboard.js";
import * as market from "./market.js";
import * as profile from "./profile.js";
import * as game from "../game/game.js";

const Main = (props) => {
    return (
        <div className="container">
            <div className="row" id="headerBar">
                <button type="button" className="button" id="marketButton" onClick={() => { console.dir("clicked market"); market.drawMarket(); }} >Market</button>
                <button type="button" className="button" id="leaderboardButton" onClick={() => { console.dir("clicked leaderboard"); leaderboard.drawLeaderboard(); }} >Leaderboards</button>
                <button type="button" className="button" id="gameButton" onClick={() => { console.dir("clicked game"); drawMain(); }} >Game</button>
                <button type="button" className="button" id="profileButton" onClick={() => { console.dir("clicked profile"); profile.drawProfile(); }} >Profile</button>
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
                            <th><a className="button button-primary">Open Resort</a></th>
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
                        <th><button type="button" className="button-primary">Create Resort</button></th>
                    </tr>
                </thead>
                <tbody>
                    {props.slopes.map(slope => {
                        return (
                            <tr>
                                <td>{slope.name}</td>
                                <td>{slope.type}</td>
                                <td>{slope.playerCount}</td>
                                <td><button type="button" className="button" onClick={() => {
                                    console.dir("Join slope: " + slope.name)
                                }}>Join Slope</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const drawSlopes = () => {
    ReactDOM.render(<Slopes />, document.querySelector('#content'));

    helper.sendGet("/slopes").then(data => {
        ReactDOM.render(<Slopes slopes={data.slopes} />, document.querySelector('#content'));
    });
}

const drawMain = () => {
    ReactDOM.render(<Main />, document.querySelector("#header"));

    // drawSlopes();

    game.setup();
}

window.onload = () => {
    drawMain();
}