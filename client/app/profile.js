import React from 'react'
import ReactDOM from 'react-dom'
import * as helper from "../helper/helper.js";

let profileData;

const getProfileData = async () => {
    const data = await helper.sendGet("/getProfile");
    profileData = data.profile;

    return profileData;
}

const ownsItem = (item) => {
    return profileData.ownedItems.includes(item._id);
}

export { getProfileData, ownsItem }