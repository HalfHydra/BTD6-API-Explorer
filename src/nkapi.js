let oak_token = ""

let btd6usersave = {};
let _btd6usersave = {}; // the model

let btd6publicprofile = {}
let _btd6publicprofile = {} // the model

let racesData = null;

let leaderboardData = null;
// let leaderboardNext = null;
// let leaderboardPrev = null;
let leaderboardLink = null;
let leaderboardPage = 1;

let localStorageOAK = {}

let refreshRateLimited = false;

let profileCache = {}

let bossesData = null;

// getSaveData(oak_token)
// getPublicProfileData(oak_token)
    // let res = await fetch(`https://data.ninjakiwi.com/btd6/save/${oak_token}`);
    // let res = await fetch(`https://data.ninjakiwi.com/btd6/users/${oak_token}`);


async function fetchData(url, onSuccess) {
    let res = await fetch(url);
    try {
        let json = await res.json();
        if(json["success"] == true){
            onSuccess(json);
        } else {
            document.getElementById("loading").style.transform = "scale(0)";
            pressedStart = false;
            errorModal(json["error"], "api")
        }
        return json;
    } catch (e) {
        errorModal(`Something went wrong with the request. Response Code: ${res.status} [${e}]`, "api")
        return `Something went wrong with the request. Response Code: ${res.status} [${e}]`;
    }
}

async function getSaveData(oak_token) {
    fetchData(`./data/PreventAPISpam_UserSave.json`, (json) => {
        btd6usersave = json["body"]
        _btd6usersave = json["model"]
        readyFlags[0] = 1
        getPublicProfileData(oak_token)
    });
}

async function getPublicProfileData(oak_token) {
    fetchData(`./data/PreventAPISpam_UserID.json`, (json) => {
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
    });
}

// async function getRacesData(){
//     if (racesData == null) {
//         fetchData(`./data/PreventAPISpam_Races.json`, (json) => {
//             racesData = json["body"];
//             let promises = Object.entries(racesData).map(([key, value]) => {
//                 console.log(`fetching ${value["metadata"]}`)
//                 return fetchData(value["metadata"], (json) => {
//                     console.log(`fetched ${value["metadata"]}`)
//                     return json["body"];
//                 }).then((json) => {
//                     value["metadata"] = json["body"];
//                 });
//             });
//             Promise.all(promises).then(() => {
//                 generateRaces();
//             });
//         });
//     } else {
//         generateRaces();
//     }
// }

async function getRacesData() {
    if (racesData == null) {
        //./data/PreventAPISpam_Races.json
        fetchData(`https://data.ninjakiwi.com/btd6/races`, (json) => {
            racesData = json["body"];
            generateRaces();
        });
    } else {
        generateRaces();
    }
}

async function getRaceMetadata(key) {
    if (racesData && racesData[key] && typeof racesData[key]["metadata"] === 'string') {
        return fetchData(racesData[key]["metadata"], (json) => {
            console.log(`fetched ${racesData[key]["metadata"]}`)
            racesData[key]["metadata"] = json["body"];
            return racesData[key];
        });
    } else {
        return racesData[key];
    }
}

async function getRaceLeaderboardData() {
    if (leaderboardLink) {
        leaderboardData = null;
        return fetchData(`${leaderboardLink}?page=${leaderboardPage}`, (json) => {
            console.log(`fetched ${leaderboardLink}?page=${leaderboardPage}`)
            leaderboardData = json["body"];
            // if (json["next"] == null) {
            //     document.getElementById("leaderboardNext").style.display = "none";
            // } else {
            //     document.getElementById("leaderboardNext").style.display = "block";
            // }
            // if (json["prev"] == null) {
            //     document.getElementById("leaderboardPrev").style.display = "none";
            // } else {
            //     document.getElementById("leaderboardPrev").style.display = "block";
            // }
            // leaderboardNext = json["next"];
            // leaderboardPrev = json["prev"];
            // leaderboardLink = racesData[key]["leaderboard"];
            // leaderboardPage = page;
            return leaderboardData;
        });
    } else {
        return errorModal("Leaderboard Fetch Error: No leaderboard data found");
    }
}

async function getBossesData() {
    if (bossesData == null) {
        fetchData(`https://data.ninjakiwi.com/btd6/bosses`, (json) => {
            bossesData = json["body"];
            generateBosses();
        });
    } else {
        generateBosses();
    }
}

async function getBossMetadata(key, elite) {
    if (bossesData && bossesData[key] && typeof bossesData[key][elite ? "metadataElite" : "metadataStandard"] === 'string') {
        return fetchData(bossesData[key][elite ? "metadataElite" : "metadataStandard"], (json) => {
            console.log(`fetched ${bossesData[key][elite ? "metadataElite" : "metadataStandard"]}`)
            bossesData[key][elite ? "metadataElite" : "metadataStandard"] = json["body"];
            return bossesData[key];
        });
    } else {
        return bossesData[key];
    }
}

async function getUserProfile(key) {
    let player = key.split("/").pop();
    if (profileCache[player] == null) {
        await fetchData(key, (json) => {
            console.log(`fetched ${key}`)
            profileCache[player] = json["body"];
        });
    } else {
        console.log(`used cache for ${player}`)
    }
    return profileCache[player];
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