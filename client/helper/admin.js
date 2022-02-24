import * as helper from "../helper/helper.js";

const addLeaderboardEntry = (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.elements["name"].value;
    const type = form.elements["typeSelect"].value;
    const score = form.elements["score"].value;
    const csrf = form.elements["_csrf"].value;

    const data = { name: name, type: type, score: score, _csrf: csrf };
    helper.sendPost("/leaderboard", data);

    return false;
}

const addMarketItem = (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.elements["name"].value;
    const type = form.elements["typeSelect"].value;
    const path = form.elements["path"].value;
    const csrf = form.elements["_csrf"].value;

    const data = { name: name, type: type, path: path, _csrf: csrf };
    helper.sendPost("/market", data);

    return false;
}

const Admin = (props) => {
    return (
        <div>
            <form id="leaderboardForm" name="leaderboardForm"
                onSubmit={addLeaderboardEntry}
                action="/leaderboard"
                method="POST"
            >

                <label htmlFor="name">Entry Name:</label>
                <input className="u-full-width" type="text" placeholder="Type Name here..." name="name" />

                <select name="typeSelect">
                    <option value="Alpine">Alpine</option>
                    <option value="Mountain">Mountain</option>
                </select>

                <label htmlFor="score">Score:</label>
                <input className="u-full-width" type="number" placeholder="Type Score here..." name="score" />


                <p className="errorMessage"></p>

                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="button-primary" type="submit" value="Add Entry" />
            </form>

            <form id="marketForm" name="marketForm"
                onSubmit={addMarketItem}
                action="/market"
                method="POST"
            >

                <label htmlFor="name">Entry Name:</label>
                <input className="u-full-width" type="text" placeholder="Type Name here..." name="name" />

                <select name="typeSelect">
                    <option value="terrain">Terrain</option>
                    <option value="avatar">Avatar</option>
                </select>

                <label htmlFor="path">Path:</label>
                <input className="u-full-width" type="text" placeholder="/test" name="path" />

                <p className="errorMessage"></p>

                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="button-primary" type="submit" value="Add Item" />
            </form>
        </div>
    )
}

const setup = (csrf) => {
    ReactDOM.render(<Admin csrf={csrf} />, document.querySelector("#content"));
}

const getToken = () => {
    helper.sendGet("/getToken").then((data) => setup(data.csrfToken));
}

window.onload = () => {
    getToken();
}