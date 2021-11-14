import React from 'react'
import ReactDOM from 'react-dom'
import * as helper from "../helper/helper.js";

const Market = (props) => {
    return (
        <div className="container">
            <div className="row">
                <h4 className="one-half column">Ski Shop</h4>
                <select id="filterDropdown" onChange={updateMarket} >
                    <option value="unset">All</option>
                    <option value="terrain">Terrain Packs</option>
                    <option value="avatar">Avatars</option>
                </select>
            </div>
            <div className="u-full-width">
                {MarketItems(props)}
            </div>
        </div>
    );
}

const MarketItems = (props) => {
    if (!props.market || props.market.length <= 0) {
        return (
            <p>Nothing was found in the Ski Shop!</p>
        )
    }

    return (
        <div id="marketItems">
            {props.market.map(item => {
                return (
                    <div className="marketItem">
                        <div className="container">
                            <img src={item.path + "/icon.png"} />
                            <h5>{item.name}</h5>
                            <button type="button" class="button-primary" onClick={(e) => {
                                console.log("Purchase " + item.name);
                            }}>Buy</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const updateMarket = () => {

}

const drawMarket = () => {
    ReactDOM.render(<Market />, document.querySelector('#content'));

    helper.sendGet("/market").then(data => {
        ReactDOM.render(<Market market={data.market} />, document.querySelector('#content'));
    })
}

export { drawMarket };