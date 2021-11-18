import * as helper from "../helper/helper.js";
import * as profile from "./profile.js";

const Market = (props) => {
    return (
        <div className="container">
            <div className="row">
                <h4 className="one-half column">Ski Shop</h4>
                <select id="filterDropdown" onChange={(e) => { updateMarket(e.target.value, props.csrf) }} >
                    <option value="unset">All</option>
                    <option value="terrain">Terrain Packs</option>
                    <option value="avatar">Avatars</option>
                </select>
            </div>
            <div className="u-full-width" id="marketItems"></div>
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
        props.market.map(item => {
            return (
                <div className="marketItem" key={item._id}>
                    <div className="container">
                        <img src={"/assets/img/" + item.type + "" + item.path + "/icon.png"} />
                        <h5>{item.name}</h5>
                        {purchaseItemButton(props, item)}
                    </div>
                </div>
            )
        })
    )
}

const purchaseItemButton = (props, item) => {
    let ownsItem = profile.ownsItem(item);

    if (ownsItem) {
        return (
            <button type="button" className="button" >Owned</button>
        );
    }

    return (
        <button type="button" className="button-primary" onClick={async (e) => {
            await helper.sendPost("/buyItem", { id: item._id, _csrf: props.csrf });
            updateMarket('unset', props.csrf);
        }}>Buy</button>
    )
}

const updateMarket = (filter, csrf) => {
    const action = `/market${(filter != 'unset') ? "?filter=" + filter : ''}`;
    console.dir("update");
    helper.sendGet(action).then(async (data) => {
        await profile.getProfileData();
        ReactDOM.render(<MarketItems market={data.market} csrf={csrf} />, document.querySelector("#marketItems"));
    });
}

const getToken = () => {
    return helper.sendGet("/getToken");
}

const drawMarket = async () => {
    ReactDOM.render(<Market />, document.querySelector('#content'));

    const crsf = await getToken().then(data => data.csrfToken);
    const marketData = await helper.sendGet("/market");
    await profile.getProfileData();

    ReactDOM.render(<Market csrf={crsf} />, document.querySelector('#content'));
    ReactDOM.render(<MarketItems market={marketData.market} csrf={crsf} />, document.querySelector('#marketItems'));
}

export { drawMarket };