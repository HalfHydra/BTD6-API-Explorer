let oak_token = ""

let btd6usersave = {};
let _btd6usersave = {}; // the model

let btd6publicprofile = {}
let _btd6publicprofile = {} // the model

getSaveData(oak_token)
getPublicProfileData(oak_token)

async function getSaveData(oak_token) {
    //let res = await fetch(`https://data.ninjakiwi.com/btd6/save/${oak_token}`);
    let res = await fetch(`./data/PreventAPISpam.txt`);
    try {
        let json = await res.json();
        // console.log(json)
        btd6usersave = json["body"]
        _btd6usersave = json["model"]
        readyFlags[0] = 1
        generateIfReady()
        return json;
    } catch (e) {
        return `Something went wrong with the request. Response Code: ${res.status} [${e}]`;
    }
}

async function getPublicProfileData(oak_token) {
    //let res = await fetch(`https://data.ninjakiwi.com/btd6/users/${oak_token}`);
    let res = await fetch(`./data/PreventAPISpam_UserID.json`);
    try {
        let json = await res.json();
        // console.log(json)
        btd6publicprofile = json["body"]
        _btd6publicprofile = json["model"]
        readyFlags[1] = 1
        generateIfReady()
        return json;
    } catch (e) {
        return `Something went wrong with the request. Response Code: ${res.status} [${e}]`;
    }
}