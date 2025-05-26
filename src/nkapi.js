let oak_token = ""

let btd6usersave = {};
let _btd6usersave = {};

let btd6publicprofile = {}
let _btd6publicprofile = {}

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

let rateLimited = false;
let preventRateLimiting = false;

let maxRequests = 100;
let baseInterval = 200;
let requestCount = 0;
let completedRequests = 0;
let lastResetTime = Date.now();

let requestQueue = [];
let isProcessing = false;

let leaderboardCache = {};
let leaderboardNext;
let leaderboardMetadata = {};
let leaderboardType;

function addRequestToQueue(profile, request) {
    requestQueue.push({id: profile, request: request});
    if (!isProcessing) {
        processRequestQueue();
    }
}

function removeRequestFromQueue(profile) {
    requestQueue = requestQueue.filter(request => request.id !== profile);
}

function calculateDelay() {
    const ratio = requestCount / (maxRequests / 2);
    return baseInterval + (baseInterval * Math.pow(ratio, 2));
}

async function processRequestQueue() {
    if (isProcessing) return;
    isProcessing = true;
    function process() {
        if (requestQueue.length === 0) {
            isProcessing = false;
            return;
        }
        const now = Date.now();
        if (now - lastResetTime >= 180000) {
            requestCount = 0;
            lastResetTime = now;
        }
        if (requestCount < maxRequests) {
            const request = requestQueue.shift();
            requestCount++;
            request.request();
        }
        const delay = calculateDelay();
        setTimeout(process, delay);
    }
    process();
}
processRequestQueue();

async function fetchData(url, onSuccess) {
    let res = null;
    try {
        if (cacheBust) {
            res = await fetch(url, {cache: "reload"});
            cacheBust = false;
            rateLimited = false;
        } else {
            res = await fetch(url);
            rateLimited = false;
        }
    } catch (e) {
        if (!navigator.onLine) {
            errorModal(`You are currently offline. Please check your internet connection.`, "api");
            return `You are currently offline. [${e}]`;
        }
        rateLimited = true;
        requestQueue = [];        
        errorModal(`You have hit the rate limit.<br>If you are browsing the leaderboards or content browsers, please slow down!<br><br>The rate limit will clear after a short time. You can also help prevent rate limiting by toggling the setting below which stops player profiles from loading automatically.`, "ratelimit")
        hideLoading();
        pressedStart = false;
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
    let expiryCheck = true;
    let savePromise = new Promise(async (resolve, reject) => {
        await fetchData(`https://data.ninjakiwi.com/btd6/save/${oak_token}`, (json) => {
            btd6usersave = json["body"]
            _btd6usersave = json["model"]
            readyFlags[0] = 1
            expiryCheck = false;
            resolve();
        });
    });
    await savePromise;
    if(expiryCheck && !rateLimited){
        let elements = document.getElementsByClassName("error-modal-overlay");
        for(element of elements){
            element.parentNode.removeChild(element);
        } 
        delete localStorageOAK[oak_token];
        writeLocalStorage();
        // generateFrontPage();
        errorModal("Your Open Access Key has expired. Please make a new one and try again.", "expire", true)
        return;
    }
    await getPublicProfileData(oak_token);
}

async function getPublicProfileData(oak_token) {
    cacheBust = true;
    return new Promise((resolve, reject) => {
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
            resolve();
        });
    });
}

async function getRacesData() {
    if (racesData == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/races`, (json) => {
            racesData = json["body"];
            generateRaces();
        });
    } else {
        generateRaces();
    }
    addToBackQueue({callback: generateEvents})
}

async function getRaceMetadata(key) {
    if (racesData && racesData[key] && typeof racesData[key]["metadata"] === 'string') {
        return fetchData(racesData[key]["metadata"], (json) => {
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
            leaderboardData = json["body"];
            leaderboardPageEntryCount = leaderboardData.length;
            document.getElementById('leaderboard-footer-page-number').innerHTML = `Page ${leaderboardPage} (#${(leaderboardPage * leaderboardPageEntryCount) - (leaderboardPageEntryCount - 1)} - ${leaderboardPage * leaderboardPageEntryCount})`;
            return leaderboardData;
        });
    } else {
        return errorModal("Leaderboard Fetch Error: No leaderboard data found");
    }
}

async function getAllLeaderboardData(link) {
    if (link == null) { link = leaderboardLink };
    requestQueue = [];
    if (leaderboardCache[leaderboardLink] == null) {
        leaderboardCache[leaderboardLink] = {
            "entries": []
        };
        getLeaderboardPage(link);
    }
    return leaderboardCache[leaderboardLink];
}

async function getLeaderboardPage(link) {
    if (link == null) return;
    if(leaderboardCache[leaderboardLink].nextRequested){ return };
    requestCount++;
    await fetchData(link, (json) => {
        leaderboardCache[leaderboardLink].entries = leaderboardCache[leaderboardLink].entries.concat(json["body"]);
        if(!leaderboardCache[leaderboardLink].hasOwnProperty("entryPerPage")){
            leaderboardCache[leaderboardLink]["entryPerPage"] = json["body"].length;
        }
        addLeaderboardEntries(json["body"], isNaN(link.split("=")[1]) ? 1 : parseInt(link.split("=")[1]), leaderboardCache[leaderboardLink]["entryPerPage"] ? leaderboardCache[leaderboardLink]["entryPerPage"] : json["body"].length);
        leaderboardCache[leaderboardLink]["next"] = json["next"];
        leaderboardCache[leaderboardLink].nextRequested = false;
    });
}

async function getBossesData() {
    if (bossesData == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/bosses`, (json) => {
            bossesData = json["body"];
            generateBosses(showElite);
        });
    } else {
        generateBosses(showElite);
    }
    addToBackQueue({callback: generateEvents})
}

async function getBossMetadata(key, elite) {
    if (bossesData && bossesData[key] && typeof bossesData[key][elite ? "metadataElite" : "metadataStandard"] === 'string') {
        return fetchData(bossesData[key][elite ? "metadataElite" : "metadataStandard"], (json) => {
            bossesData[key][elite ? "metadataElite" : "metadataStandard"] = json["body"];
            return bossesData[key];
        });
    } else {
        return bossesData[key];
    }
}

async function getCTData() {
    if (CTData == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/ct`, (json) => {
            CTData = json["body"];
            generateCTs();
        });
    } else {
        generateCTs();
    }
    addToBackQueue({callback: generateEvents})
}

async function getCTTiles(key) {
    let tiles = null;
    await fetchData(key, (json) => {
        tiles = json["body"];
        return tiles;
    });
    return tiles
}

async function getDailyChallengesData() {
    if (DCData == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/challenges/filter/daily`, (json) => {
            DCData = json["body"];
            addToBackQueue({callback: generateEvents})
            return DCData;
        });
    } else {
        addToBackQueue({callback: generateEvents})
        return DCData;
    }
}

async function getChallengeMetadata(challengeId) {
    if (challengesCache[challengeId] == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/challenges/challenge/${challengeId}`, (json) => {
            challengesCache[challengeId] = json["body"];
            return challengesCache[challengeId];
        });
    } else {
        // console.log(`used cache for ${challengeId}`)
    }
    return challengesCache[challengeId];
}

async function getBrowserData() {
    if (browserLink) {
        browserData = null;
        return fetchData(`${browserLink}${browserFilter}?page=${browserPage}`, (json) => {
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
            profileCache[player] = json["body"];
        });
    } else {
        // console.log(`used cache for ${player}`)
    }
    return profileCache[player];
}

async function getCustomMapMetadata(mapId) {
    if (customMapsCache[mapId] == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/maps/map/${mapId}`, (json) => {
            customMapsCache[mapId] = json["body"];
            return customMapsCache[mapId];
        });
    } else {
        // console.log(`used cache for ${mapId}`)
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

function challengeIdToDate(challengeId) {
    //sample input: rot216320240713
    //extract first 3 chars
    let advanced = challengeId.substring(0, 3) == "adv";
    //extract 4 digit numeric Id
    let rawId = parseInt(challengeId.substring(3, 7));
    //extract date
    let date = challengeId.substring(7);
    let year = parseInt(date.substring(0, 4));
    let month = parseInt(date.substring(4, 6));
    let day = parseInt(date.substring(6, 8));
    return [year, month, day]
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