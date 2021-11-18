import * as helper from "../helper/helper.js";

const Leaderboard = (props) => {
    if (!props.leaderboard) {
        return (
            <div>
                <div className="row">
                    <h4 className="one-half column">Leaderboard</h4>
                    <select id="filterDropdown" onChange={updateLeaderboard} >
                        <option value="unset">All</option>
                        <option value="Alpine">Alpine</option>
                        <option value="Mountain">Mountain</option>
                    </select>
                </div>
                <p>No leaderboards to show!</p>
            </div>
        );
    }

    if (props.leaderboard.length <= 0) {
        return (
            <div>
                <div className="row">
                    <h4 className="one-half column">Leaderboard</h4>
                    <select id="filterDropdown" onChange={updateLeaderboard} >
                        <option value="unset">All</option>
                        <option value="Alpine">Alpine</option>
                        <option value="Mountain">Mountain</option>
                    </select>
                </div>
                <p>This leaderboard has no records to show!</p>
            </div>
        );
    }

    return (
        <div>
            <div className="row">
                <h4 className="one-half column">Leaderboard</h4>
                <select id="filterDropdown" onChange={updateLeaderboard} >
                    <option value="unset">All</option>
                    <option value="Alpine">Alpine</option>
                    <option value="Mountain">Mountain</option>
                </select>
            </div>
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
                            <tr key={entry._id}>
                                <td>{entry.name}</td>
                                <td>{entry.type}</td>
                                <td>{entry.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

const updateLeaderboard = (e) => {
    const action = `/leaderboard${(e.target.value != 'unset') ? "?filter=" + e.target.value : ''}`;
    helper.sendGet(action).then(data => {
        ReactDOM.render(<Leaderboard leaderboard={data.leaderboard} />, document.querySelector("#content"));
    });
}

const drawLeaderboard = () => {
    ReactDOM.render(<Leaderboard />, document.querySelector("#content"));

    helper.sendGet("/leaderboard").then(data => {
        ReactDOM.render(<Leaderboard leaderboard={data.leaderboard} />, document.querySelector("#content"));
    });
}

export { drawLeaderboard };