import * as helper from "../helper/helper.js";

let profileData;
let equipedAvatar;
let equipedTerrain;

const Profile = (props) => {
    return (
        <div className="container">
            <h4>{props.profile.username}</h4>
            <h5>
                Avatar: {(!equipedAvatar) ? "Default" : equipedAvatar.name}
                {(!equipedAvatar) ? "" : (<img src={"/assets/img/" + equipedAvatar.type + "" + equipedAvatar.path + "/icon.png"} />)}
            </h5>
            <h5>
                Terrain Pack: {(!equipedTerrain) ? "Default" : equipedTerrain.name}
                {(!equipedTerrain) ? "" : (<img src={"/assets/img/" + equipedTerrain.type + "" + equipedTerrain.path + "/icon.png"} />)}
            </h5>
            <h5>Owned Items</h5>
            <div className="u-full-width" id="marketItems"></div>
            <button className="button" onClick={drawChangePassword}>Change Password</button>
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
                <div className="marketItem" key={item._id}>
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

const ChangePassword = (props) => {
    return (
        <form
            id="passwordForm" name="passwordForm"
            onSubmit={handleChangePassword}
            action="/password"
            method="POST"
        >
            <label htmlFor="oldPassword">Old Password: </label>
            <input className="u-full-width" type="password" placeholder="Enter old password..." name="oldPassword" />
            <label htmlFor="newPassword1">New Password: </label>
            <input className="u-full-width" type="password" placeholder="Enter new password..." name="newPassword1" />
            <label htmlFor="newPassword2">Re-Enter New Password: </label>
            <input className="u-full-width" type="password" placeholder="Re-Enter new password..." name="newPassword2" />

            <p name="errorMessage" className="errorMessage"></p>

            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="button-primary" type="submit" value="Login" />
        </form>
    )
}

const equipItemButton = (props, item) => {
    if (item._id === profileData.equipedAvatar || item._id === profileData.equipedTerrain) {
        return (
            <button type="button" className="button" >Equiped</button>
        );
    }

    return (
        <button type="button" className="button-primary" onClick={async (e) => {
            await helper.sendPost("/equipItem", { id: item._id, type: item.type, _csrf: props.csrf });
            drawProfile();
        }}>Equip</button>
    )
}


const getProfileData = async () => {
    const data = await helper.sendGet("/getProfile");
    profileData = data.profile;

    profileData.ownedItems.splice(0, 0, { _id: "defaultavatar", name: "Default Avatar", type: "avatar", path: "/default" });
    profileData.ownedItems.splice(1, 0, { _id: "defaultterrain", name: "Default Terrain", type: "terrain", path: "/default" });

    equipedAvatar = profileData.ownedItems.find(id => id._id === profileData.equipedAvatar);
    equipedTerrain = profileData.ownedItems.find(id => id._id === profileData.equipedTerrain);

    console.dir(equipedAvatar);

    if(!equipedAvatar) {
        equipedAvatar = profileData.ownedItems[0];
    }

    if(!equipedTerrain) {
        equipedTerrain = profileData.ownedItems[1];
    }

    return profileData;
}

const handleChangePassword = async (e) => {
    e.preventDefault();

    const form = e.target;
    const oldPassword = form.elements["oldPassword"].value;
    const newPassword1 = form.elements["newPassword1"].value;
    const newPassword2 = form.elements["newPassword2"].value;
    const csrf = form.elements["_csrf"].value;
    const errorMessage = form.querySelector(".errorMessage");

    if (oldPassword === '' || newPassword1 === '' || newPassword2 === '') {
        errorMessage.textContent = "Old Password and New Password are required!";
        return false;
    }

    errorMessage.textContent = "";

    const passwordError = (err) => {
        err.then(data => {
            errorMessage.textContent = data.error;
        })
    }

    const data = { pass: oldPassword, newPass1: newPassword1, newPass2: newPassword2, _csrf: csrf }
    helper.sendPost("/password", data, passwordError).then((data) => {
        if (data === undefined) return false;
        drawProfile();
    });

    return false;
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

const drawChangePassword = async () => {
    const csrf = await getToken().then(data => data.csrfToken);

    ReactDOM.render(<ChangePassword csrf={csrf} />, document.querySelector('#content'));
}

const getEquipedAvatar = async () => {
    if (!profileData) {
        await getProfileData();
    }

    return equipedAvatar;
}

const getEquipedTerrain = async () => {
    if (!profileData) {
        await getProfileData();
    }

    return equipedTerrain;
}

const getUsername = async () => {
    if (!profileData) {
        await getProfileData();
    }

    return profileData.username;
}

export { drawProfile, getProfileData, ownsItem, getEquipedAvatar, getEquipedTerrain, getUsername }