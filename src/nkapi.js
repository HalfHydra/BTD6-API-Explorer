let oak_token = ""

let btd6usersave = {};
let _btd6usersave = {}; // the model

let btd6publicprofile = {}
let _btd6publicprofile = {} // the model

let racesData = null;

let leaderboardData = null;
let leaderboardLink = null;
let leaderboardPage = 1;
let leaderboardPageEntryCount = null;

let localStorageOAK = {}

let refreshRateLimited = false;

let profileCache = {}

let bossesData = null;

let CTData = null;

let DCData = null;

let challengesCache = {}

let browserData = null;
let browserLink = null;
let browserPage = 1;
let browserPageEntryCount = null;

let browserFilter = "newest";

let cacheBust = false;

let isErrorModalOpen = false;

let customMapsCache = {}

// getSaveData(oak_token)
// getPublicProfileData(oak_token)
    // let res = await fetch(`https://data.ninjakiwi.com/btd6/save/${oak_token}`);
    // let res = await fetch(`https://data.ninjakiwi.com/btd6/users/${oak_token}`);


async function fetchData(url, onSuccess) {
    let res = null;
    try {
        if (cacheBust) {
            res = await fetch(url, {cache: "reload"});
            cacheBust = false;
        } else {
            res = await fetch(url);
        }
    } catch (e) {
        console.log(e)
        errorModal(`You have hit the rate limit.<br>If you are browsing the leaderboards or content browsers, please slow down!<br><br>The rate limit will clear after a short time.`, "api")
        return `You have hit the rate limit. [${e}]`;
    }
    try {
        let json = await res.json();
        if(json["success"] == true){
            onSuccess(json);
        } else {
            if(json["reason"] == "Rate limit") {
                isErrorModalOpen = true;
                errorModal("You have hit the rate limit. Please try again later.", "api");
            } else {
                document.getElementById("loading").style.transform = "scale(0)";
                pressedStart = false;
                errorModal(json["error"], "api");
            }
        }
        return json;
    } catch (e) {
        errorModal(`Something went wrong with the request. Response Code: ${res.status} [${e}]`, "api")
        return `Something went wrong with the request. Response Code: ${res.status} [${e}]`;
    }
}

async function getSaveData(oak_token) {
    cacheBust = true;
    // fetchData(`./data/PreventAPISpam_UserSave.json`, (json) => {
    fetchData(`https://data.ninjakiwi.com/btd6/save/${oak_token}`, (json) => {
        btd6usersave = json["body"]
        _btd6usersave = json["model"]
        readyFlags[0] = 1
        getPublicProfileData(oak_token)
    });
}

async function getPublicProfileData(oak_token) {
    cacheBust = true;
    // fetchData(`./data/PreventAPISpam_UserID.json`, (json) => {
    fetchData(`https://data.ninjakiwi.com/btd6/users/${oak_token}`, (json) => {
        btd6publicprofile = json["body"]
        _btd6publicprofile = json["model"]
        localStorageOAK[oak_token] = {
            "displayName": btd6publicprofile["displayName"],
            "avatar": getProfileAvatar(btd6publicprofile),
            "banner": getProfileBanner(btd6publicprofile)
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

async function getLeaderboardData() {
    if (leaderboardLink) {
        leaderboardData = null;
        return fetchData(`${leaderboardLink}?page=${leaderboardPage}`, (json) => {
            console.log(`fetched ${leaderboardLink}?page=${leaderboardPage}`)
            leaderboardData = json["body"];
            leaderboardPageEntryCount = leaderboardData.length;
            document.getElementById('leaderboard-footer-page-number').innerHTML = `Page ${leaderboardPage} (#${(leaderboardPage * leaderboardPageEntryCount) - (leaderboardPageEntryCount - 1)} - ${leaderboardPage * leaderboardPageEntryCount})`;
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
            generateBosses(showElite);
        });
    } else {
        generateBosses(showElite);
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

async function getCTData() {
    if (CTData == null) {
        fetchData(`https://data.ninjakiwi.com/btd6/ct`, (json) => {
            CTData = json["body"];
            generateCTs();
        });
    } else {
        generateCTs();
    }
}

async function getCTTiles(key) {
    let tiles = null;
    await fetchData(key, (json) => {
        console.log(`fetched ${key}`)
        tiles = json["body"];
        return tiles;
    });
    return tiles
}

async function getDailyChallengesData() {
    if (DCData == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/challenges/filter/daily`, (json) => {
            DCData = json["body"];
            return DCData;
        });
    } else {
        console.log('no bad!')
        return DCData;
    }
}

async function getChallengeMetadata(challengeId) {
    if (challengesCache[challengeId] == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/challenges/challenge/${challengeId}`, (json) => {
            console.log(`fetched ${challengeId}`)
            challengesCache[challengeId] = json["body"];
            return challengesCache[challengeId];
        });
    } else {
        console.log(`used cache for ${challengeId}`)
    }
    return challengesCache[challengeId];
}

async function getBrowserData() {
    if (browserLink) {
        browserData = null;
        return fetchData(`${browserLink}${browserFilter}?page=${browserPage}`, (json) => {
            console.log(`fetched ${browserLink}?page=${browserPage}`)
            browserData = json["body"];
            browserPageEntryCount = browserData.length;
            document.getElementById('browser-footer-page-number').innerHTML = `Page ${browserPage} of 4`;
            return leaderboardData;
        });
    } else {
        return errorModal("Content Browser Fetch Error: No data found");
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

async function getCustomMapMetadata(mapId) {
    if (customMapsCache[mapId] == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/maps/map/${mapId}`, (json) => {
            console.log(`fetched ${mapId}`)
            customMapsCache[mapId] = json["body"];
            return customMapsCache[mapId];
        });
    } else {
        console.log(`used cache for ${mapId}`)
    }
    return customMapsCache[mapId];
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

function getChallengeIDFromDate(date, advanced) {
    let baseDate = new Date(date);
    let diffInMs = new Date(2024, 4, 25).getTime() - baseDate.getTime();
    let diffInDays = Math.floor(diffInMs / 86400000);
    let diff = (advanced ? 2101 : 2114) - diffInDays;
    return (advanced ? 'adv': 'rot') + diff + date.replace(/-/g, '');
}