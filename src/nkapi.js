let oak_token = ""

let btd6usersave = {};
let _btd6usersave = {}; // the model

let btd6publicprofile = {}
let _btd6publicprofile = {} // the model

let localStorageOAK = {}

// getSaveData(oak_token)
// getPublicProfileData(oak_token)

async function getSaveData(oak_token) {
    // let res = await fetch(`https://data.ninjakiwi.com/btd6/save/${oak_token}`);
    let res = await fetch(`./data/PreventAPISpam_UserSave.json`);
    try {
        let json = await res.json();
        if(json["success"] == true){
            btd6usersave = json["body"]
            _btd6usersave = json["model"]
            readyFlags[0] = 1
            getPublicProfileData(oak_token)
        } else {
            document.getElementById("loading").style.transform = "scale(0)";
            pressedStart = false;
            errorModal(json["error"], "api")
        }
        return json;
    } catch (e) {
        return `Something went wrong with the request. Response Code: ${res.status} [${e}]`;
    }
}

async function getPublicProfileData(oak_token) {
    // let res = await fetch(`https://data.ninjakiwi.com/btd6/users/${oak_token}`);
    let res = await fetch(`./data/PreventAPISpam_UserID.json`);
    try {
        let json = await res.json();
        if(json["success"]  == true){
            btd6publicprofile = json["body"]
            _btd6publicprofile = json["model"]
            localStorageOAK[oak_token] = {
                "displayName": btd6publicprofile["displayName"],
                "avatar": btd6publicprofile["avatarURL"],
                "banner": btd6publicprofile["bannerURL"]
            }
            writeLocalStorage()
            readyFlags[1] = 1
            fetchDependencies();
        } else {
            document.getElementById("loading").style.transform = "scale(0)";
            pressedStart = false;
            errorModal(json["error"], "api")
        }
        return json;
    } catch (e) {
        return `Something went wrong with the request. Response Code: ${res.status} [${e}]`;
    }
}

function readLocalStorage(){
    if(localStorage.getItem("BTD6OAKStorage") != null){
        localStorageOAK = JSON.parse(localStorage.getItem("BTD6OAKStorage"))
    }
}
function writeLocalStorage(){
    localStorage.setItem("BTD6OAKStorage", JSON.stringify(localStorageOAK))
}

function getChallengeIdFromInt(rawId, advanced) {
    let baseDate = new Date(2024, 4, 25); //0 indexed month
    let diff = (advanced ? 2101 : 2114) - parseInt(rawId);
    baseDate.setDate(baseDate.getDate() - diff);
    let formattedDate = baseDate.toISOString().substring(0, 10).replace(/-/g, '');
    return (advanced ? 'adv': 'rot') + rawId + formattedDate;
}