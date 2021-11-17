import React from 'react'
import ReactDOM from 'react-dom'
import * as helper from "../helper/helper.js";

let profileData;
let equipedAvatar;
let equipedTerrain;

const Profile = (props) => {
    return (
        <div className="container">
            <h4>{props.profile.username}</h4>
            <h5>
                Avatar: {equipedAvatar.name || "Default"}
                <img src={"/assets/img/" + equipedAvatar.type + "" + equipedAvatar.path + "/icon.png"} />
            </h5>
            <h5>
                Terrain Pack: {equipedTerrain.name || "Default"}
                <img src={"/assets/img/" + equipedAvatar.type + "" + equipedAvatar.path + "/icon.png"} />
            </h5>
            <h5>Owned Items</h5>
            <div className="u-full-width" id="marketItems">
            </div>
        </div>
    );
}

const OwnedItems = (props) => {
    if (!props.profile.ownedItems || props.profile.ownedItems <= 0) {
        return (
            <div>
                <p>There are no items to show!</p>
            </div>
        )
    }

    return (
        props.profile.ownedItems.map(item => {
            return (
                <div className="marketItem">
                    <div className="container">
                        <img src={"/assets/img/" + item.type + "" + item.path + "/icon.png"} />
                        <h5>{item.name}</h5>
                        {equipItemButton(props, item)}
                    </div>
                </div>
            )
        })
    )
}

const equipItemButton = (props, item) => {
    if (item._id === profileData.equipedAvatar || item._id === profileData.equipedTerrain) {
        return (
            <button type="button" class="button" >Equiped</button>
        );
    }

    return (
        <button type="button" class="button-primary" onClick={async (e) => {
            await helper.sendPost("/equipItem", { id: item._id, type: item.type, _csrf: props.csrf });
            drawProfile();
        }}>Equip</button>
    )
}


const getProfileData = async () => {
    const data = await helper.sendGet("/getProfile");
    profileData = data.profile;
    equipedAvatar = profileData.ownedItems.find(id => id._id === profileData.equipedAvatar);
    equipedTerrain = profileData.ownedItems.find(id => id._id === profileData.equipedTerrain);

    return profileData;
}

const ownsItem = (item) => {
    return profileData.ownedItems.find(id => id._id === item._id);
}

const getToken = () => {
    return helper.sendGet("/getToken");
}

const drawProfile = async () => {
    await getProfileData();
    const crsf = await getToken().then(data => data.csrfToken);

    ReactDOM.render(<Profile profile={profileData} />, document.querySelector("#content"));
    ReactDOM.render(<OwnedItems profile={profileData} csrf={crsf} />, document.querySelector("#marketItems"));
}

export { drawProfile, getProfileData, ownsItem }