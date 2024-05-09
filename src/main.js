let readyFlags = [0,0,0,0,0]
let isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
let isGenerated = []
let locJSON = {}
let achievementsJSON = {}
let achievementsHelper = {}
let constants = {}

let rankInfo = {
    "rank": 1,
    "xp": null,
    "xpGoal": null
};

let xpNeededPerVeteranRank = 20000000;
let rankInfoVeteran = {
    "rank": 1,
    "xp": null,
    "xpGoal": 20000000
};

let profileStats = {}
let medalsInOrder = {}
let extrasUnlocked = {}

let progressSubText = {}
let processedMapData = {
    "Maps": {},
    "Medals": {
        "single": {},
        "coop": {}
    },
    "Borders": {
        "single": {},
        "coop": {}
    }
}

let currentlySelectedHero = "";

fetch('./data/English.json')
    .then(response => response.json())
    .then(data => {
        locJSON = data;
        readyFlags[2] = 1
        generateIfReady()
    })
    .catch(error => console.error('Error:', error));

fetch('./data/Achievements150.json')
    .then(response => response.json())
    .then(data => {
        achievementsJSON = data;
        readyFlags[3] = 1
        generateIfReady()
    })
    .catch(error => console.error('Error:', error));

fetch('./data/Constants.json')
    .then(response => response.json())
    .then(data => {
        constants = data;
        readyFlags[4] = 1
        generateIfReady()
    })
    .catch(error => console.error('Error:', error));


function generateIfReady(){
    if (readyFlags.every(flag => flag === 1)){
        document.body.classList.add('transition-bg')
        generateRankInfo()
        generateVeteranRankInfo()
        generateAchievementsHelper()
        generateStats()
        generateMedals()
        generateExtras()
        generateProgressSubText()
        generateMapData()
        generateOverview()
        isGenerated.push('overview');
        changeTab('overview');
        // document.getElementById("loading").style.transform = "scale(0)";
    }
}

function generateRankInfo(){
    // btd6usersave["xp"] = 125235498
    if (btd6usersave["xp"] === 180000000){
        rankInfo["rank"] = 155;
        rankInfo["xp"] = null;
        rankInfo["xpGoal"] = null;
        return;
    }
    let subtractableXP = parseInt(btd6usersave["xp"]);
    for (let [rank, model] of Object.entries(constants.Rank)) {
        rank = parseInt(rank);
        if (subtractableXP < model["totalXpNeeded"]){
            subtractableXP = subtractableXP - parseInt(constants.Rank[rank - 1].totalXpNeeded);
            xpGoal = parseInt(model["totalXpNeeded"]) - parseInt(constants.Rank[rank - 1].totalXpNeeded);
            rankInfo["rank"] = rank - 1;
            rankInfo["xp"] = subtractableXP;
            rankInfo["xpGoal"] = xpGoal;
            return;
        }
    }
}

function generateVeteranRankInfo(){
    let subtractableXPVeteran = parseInt(btd6usersave["veteranXp"]);
    while (subtractableXPVeteran >= xpNeededPerVeteranRank){
        subtractableXPVeteran -= xpNeededPerVeteranRank;
        rankInfoVeteran["rank"] += 1;
    }
    rankInfoVeteran["xp"] = subtractableXPVeteran;
}

function generateAchievementsHelper(){
    for (let [key, model] of Object.entries(achievementsJSON)) {
        achievementsHelper[model.name] = model;
    }
}

function generateStats(){
    profileStats["Games Played"] = btd6publicprofile.gameplay["gameCount"];
    profileStats["Games Won"] = btd6publicprofile.gameplay["gamesWon"];
    profileStats["Highest Round (All Time)"] = btd6publicprofile.gameplay["highestRound"];
    profileStats["Highest Round (CHIMPS)"] = btd6publicprofile.gameplay["highestRoundCHIMPS"];
    profileStats["Highest Round (Deflation)"] = btd6publicprofile.gameplay["highestRoundDeflation"];
    profileStats["Total Pop Count"] = btd6publicprofile.bloonsPopped["bloonsPopped"];
    profileStats["Total Co-Op Pop Count"] = btd6publicprofile.bloonsPopped["coopBloonsPopped"];
    profileStats["Camo Bloons Popped"] = btd6publicprofile.bloonsPopped["camosPopped"];
    profileStats["Lead Bloons Popped"] = btd6publicprofile.bloonsPopped["leadsPopped"];
    profileStats["Purple Bloons Popped"] = btd6publicprofile.bloonsPopped["purplesPopped"];
    profileStats["Regrow Bloons Popped"] = btd6publicprofile.bloonsPopped["regrowsPopped"];
    profileStats["Ceramic Bloons Popped"] = btd6publicprofile.bloonsPopped["ceramicsPopped"];
    profileStats["MOABs Popped"] = btd6publicprofile.bloonsPopped["moabsPopped"];
    profileStats["BFBs Popped"] = btd6publicprofile.bloonsPopped["bfbsPopped"];
    profileStats["ZOMGs Popped"] = btd6publicprofile.bloonsPopped["zomgsPopped"];
    profileStats["BADs Popped"] = btd6publicprofile.bloonsPopped["badsPopped"];
    profileStats["Bloons Leaked"] = btd6publicprofile.bloonsPopped["bloonsLeaked"];
    profileStats["Cash Generated"] = btd6publicprofile.gameplay["cashEarned"];
    profileStats["Cash Gifted"] = btd6publicprofile.gameplay["coopCashGiven"];
    profileStats["Powers Used"] = btd6publicprofile.gameplay["powersUsed"];
    profileStats["Daily Reward Chests Opened"] = btd6publicprofile.gameplay["dailyRewards"];
    profileStats["Challenges Completed"] = btd6publicprofile.gameplay["challengesCompleted"];
    profileStats["Achievements"] = btd6publicprofile.gameplay["achievements"];
    profileStats["Hidden Achievements"] = 0;
    profileStats["Odysseys Completed"] = btd6publicprofile.gameplay["totalOdysseysCompleted"];
    profileStats["Lifetime Trophies"] = btd6publicprofile.gameplay["totalTrophiesEarned"];
    profileStats["Necro Bloons Reanimated"] = btd6publicprofile.bloonsPopped["necroBloonsReanimated"];
    profileStats["Transforming Tonics Used"] = btd6publicprofile.bloonsPopped["transformingTonicsUsed"];
    profileStats["Most Experienced Monkey"] = btd6publicprofile["mostExperiencedMonkey"];
    profileStats["Most Experienced Monkey XP"] = btd6usersave.towerXP[btd6publicprofile["mostExperiencedMonkey"]];
    profileStats["Most Experienced Monkey"] = locJSON[profileStats["Most Experienced Monkey"]];
    profileStats["Insta Monkey Collection"] = `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
    profileStats["Collection Chests Opened"] = btd6publicprofile.gameplay["collectionChestsOpened"];
    profileStats["Golden Bloons Popped"] = btd6publicprofile.bloonsPopped["goldenBloonsPopped"];
    profileStats["Monkey Teams Wins"] = btd6publicprofile.gameplay["monkeyTeamsWins"];
    profileStats["Damage Done To Bosses"] = btd6publicprofile.gameplay["damageDoneToBosses"];

    //stats from usersave
    profileStats["Daily Challenges Completed"] = btd6usersave["totalDailyChallengesCompleted"];
    profileStats["Consecutive DCs Completed"] = btd6usersave["consecutiveDailyChallengesCompleted"];
    profileStats["Races Entered"] = btd6usersave["totalRacesEntered"];
    profileStats["Challenges Played"] = btd6usersave["challengesPlayed"];
    profileStats["Challenges Shared"] = btd6usersave["challengesShared"];
    profileStats["Continues Used"] = btd6usersave["continuesUsed"];

    //Calculate the hidden and normal achievements
    let hiddenAchievements = 0;
    let normalAchievements = 0;
    //for (let [name, model] of Object.entries(achievementsHelper)){
    btd6usersave.achievementsClaimed.forEach((achievement) => {
        let model = achievementsHelper[fixAchievementName(achievement)];
        if (model.model.hidden){
            hiddenAchievements += 1;
        } else {
            normalAchievements += 1;
        }
    })
    profileStats["Hidden Achievements"] = `${hiddenAchievements}/${constants.hiddenAchievements}`;
    profileStats["Achievements"] = `${normalAchievements}/${constants.achievements}`;
}

function generateMedals(){
    let tempCoop = {};
    for (let [key, value] of Object.entries(medalMap)){
        medalsInOrder["Medal" + value] = btd6publicprofile["_medalsSinglePlayer"][key] || 0;
        tempCoop["MedalCoop" + value] = btd6publicprofile["_medalsMultiplayer"][key] || 0;
    }
    medalsInOrder = {...medalsInOrder, ...tempCoop};
    //boss badges when they are added
    medalsInOrder["MedalEventBronzeMedal"] = btd6publicprofile["_medalsRace"]["Bronze"] || 0;
    medalsInOrder["MedalEventSilverMedal"] = btd6publicprofile["_medalsRace"]["Silver"] || 0;
    medalsInOrder["MedalEventGoldSilverMedal"] = btd6publicprofile["_medalsRace"]["GoldSilver"] || 0;
    medalsInOrder["MedalEventDoubleGoldMedal"] = btd6publicprofile["_medalsRace"]["DoubleGold"] || 0;
    medalsInOrder["MedalEventGoldDiamondMedal"] = btd6publicprofile["_medalsRace"]["GoldDiamond"] || 0;
    medalsInOrder["MedalEventRedDiamondMedal"] = btd6publicprofile["_medalsRace"]["RedDiamond"] || 0;
    medalsInOrder["MedalEventBlackDiamondMedal"] = btd6publicprofile["_medalsRace"]["BlackDiamond"] || 0;
    medalsInOrder["OdysseyStarIcon"] = btd6publicprofile.gameplay["totalOdysseyStars"] || 0;
    medalsInOrder["BossMedalEventBronzeMedal"] = btd6publicprofile["_medalsBoss"]["Bronze"] || 0;
    medalsInOrder["BossMedalEventSilverMedal"] = btd6publicprofile["_medalsBoss"]["Silver"] || 0;
    medalsInOrder["BossMedalEventDoubleSilverMedal"] = btd6publicprofile["_medalsBoss"]["DoubleSilver"] || 0;
    medalsInOrder["BossMedalEventGoldSilverMedal"] = btd6publicprofile["_medalsBoss"]["GoldSilver"] || 0;
    medalsInOrder["BossMedalEventDoubleGoldMedal"] = btd6publicprofile["_medalsBoss"]["DoubleGold"] || 0;
    medalsInOrder["BossMedalEventGoldDiamondMedal"] = btd6publicprofile["_medalsBoss"]["GoldDiamond"] || 0;
    medalsInOrder["BossMedalEventDiamondMedal"] = btd6publicprofile["_medalsBoss"]["Diamond"] || 0;
    medalsInOrder["BossMedalEventRedDiamondMedal"] = btd6publicprofile["_medalsBoss"]["RedDiamond"] || 0;
    medalsInOrder["BossMedalEventBlackDiamondMedal"] = btd6publicprofile["_medalsBoss"]["BlackDiamond"] || 0;
    medalsInOrder["EliteBossMedalEventBronzeMedal"] = btd6publicprofile["_medalsBossElite"]["Bronze"] || 0;
    medalsInOrder["EliteBossMedalEventSilverMedal"] = btd6publicprofile["_medalsBossElite"]["Silver"] || 0;
    medalsInOrder["EliteBossMedalEventDoubleSilverMedal"] = btd6publicprofile["_medalsBossElite"]["DoubleSilver"] || 0;
    medalsInOrder["EliteBossMedalEventGoldSilverMedal"] = btd6publicprofile["_medalsBossElite"]["GoldSilver"] || 0;
    medalsInOrder["EliteBossMedalEventDoubleGoldMedal"] = btd6publicprofile["_medalsBossElite"]["DoubleGold"] || 0;
    medalsInOrder["EliteBossMedalEventGoldDiamondMedal"] = btd6publicprofile["_medalsBossElite"]["GoldDiamond"] || 0;
    medalsInOrder["EliteBossMedalEventDiamondMedal"] = btd6publicprofile["_medalsBossElite"]["Diamond"] || 0;
    medalsInOrder["EliteBossMedalEventRedDiamondMedal"] = btd6publicprofile["_medalsBossElite"]["RedDiamond"] || 0;
    medalsInOrder["EliteBossMedalEventBlackDiamondMedal"] = btd6publicprofile["_medalsBossElite"]["BlackDiamond"] || 0;
    medalsInOrder["CtLocalPlayerBronzeMedal"] = btd6publicprofile["_medalsCTLocal"]["Bronze"] || 0;
    medalsInOrder["CtLocalPlayerSilverMedal"] = btd6publicprofile["_medalsCTLocal"]["Silver"] || 0;
    medalsInOrder["CtLocalPlayerDoubleGoldMedal"] = btd6publicprofile["_medalsCTLocal"]["DoubleGold"] || 0;
    medalsInOrder["CtLocalPlayerDiamondMedal"] = btd6publicprofile["_medalsCTLocal"]["Diamond"] || 0;
    medalsInOrder["CtLocalPlayerRedDiamondMedal"] = btd6publicprofile["_medalsCTLocal"]["RedDiamond"] || 0;
    medalsInOrder["CtLocalPlayerBlackDiamondMedal"] = btd6publicprofile["_medalsCTLocal"]["BlackDiamond"] || 0;
    medalsInOrder["CtGlobalPlayerBronzeMedal"] = btd6publicprofile["_medalsCTGlobal"]["Bronze"] || 0;
    medalsInOrder["CtGlobalPlayerSilverMedal"] = btd6publicprofile["_medalsCTGlobal"]["Silver"] || 0;
    medalsInOrder["CtGlobalPlayerDoubleSilverMedal"] = btd6publicprofile["_medalsCTGlobal"]["DoubleSilver"] || 0;
    medalsInOrder["CtGlobalPlayerGoldSilverMedal"] = btd6publicprofile["_medalsCTGlobal"]["GoldSilver"] || 0;
    medalsInOrder["CtGlobalPlayerDoubleGoldMedal"] = btd6publicprofile["_medalsCTGlobal"]["DoubleGold"] || 0;
    medalsInOrder["CtGlobalPlayerGoldDiamondMedal"] = btd6publicprofile["_medalsCTGlobal"]["GoldDiamond"] || 0;
    medalsInOrder["CtGlobalPlayerDiamondMedal"] = btd6publicprofile["_medalsCTGlobal"]["Diamond"] || 0;
}

function generateExtras(){
    extrasUnlocked["Big Bloons"] = btd6usersave["unlockedBigBloons"];
    extrasUnlocked["Small Bloons"] = btd6usersave["unlockedSmallBloons"];
    extrasUnlocked["Big Monkey Towers"] = btd6usersave["seenBigTowers"];
    extrasUnlocked["Small Monkey Towers"] = btd6usersave["unlockedSmallTowers"];
    //extrasUnlocked["Small Bosses"] = btd6usersave["unlockedSmallBosses"]; hopefully this gets implemented
}

function generateProgressSubText(){
    progressSubText["Towers"] = `${Object.keys(btd6usersave.unlockedTowers).filter(k => btd6usersave.unlockedTowers[k]).length}/${Object.keys(btd6usersave.unlockedTowers).length} Towers Unlocked`;
    progressSubText["Heroes"] = `${Object.keys(btd6usersave.unlockedHeros).filter(k => btd6usersave.unlockedHeros[k]).length}/${Object.keys(btd6usersave.unlockedHeros).length} Heroes Unlocked`;
    progressSubText["Knowledge"] = `${Object.keys(btd6usersave.acquiredKnowledge).filter(k => btd6usersave.acquiredKnowledge[k]).length}/${Object.keys(btd6usersave.acquiredKnowledge).length} Knowledge Unlocked`;
    progressSubText["MapProgress"] = `${Object.keys(btd6usersave.mapProgress).filter(k => btd6usersave.mapProgress[k]).length}/${constants.totalMaps} Maps Played`;
    progressSubText["Powers"] = `${Object.values(btd6usersave.powers).map(power => power.quantity).reduce((acc, amount) => acc + amount)} Powers Accumulated`
    progressSubText["InstaMonkeys"] = `${btd6publicprofile.gameplay.instaMonkeyCollection}/${constants.totalInstaMonkeys} Instas Collected`;
    progressSubText["Achievements"] = `${btd6publicprofile.achievements}/${constants.achievements + constants.hiddenAchievements} Achievements`;
    progressSubText["Extras"] = `${Object.keys(extrasUnlocked).filter(k => extrasUnlocked[k]).length} Extras Unlocked`;
}

function generateMapData() {
    for (let [map, data] of Object.entries(btd6usersave.mapProgress)) {
        let mapData = {"single": {}, "coop": {}}
        mapData["single"]["Easy"] = data.difficulty?.Easy?.single?.["Standard"];
        mapData["single"]["PrimaryOnly"] = data.difficulty?.Easy?.single?.["PrimaryOnly"];
        mapData["single"]["Deflation"] = data.difficulty?.Easy?.single?.["Deflation"];
        mapData["single"]["Medium"] = data.difficulty?.Medium?.single?.["Standard"];
        mapData["single"]["MilitaryOnly"] = data.difficulty?.Medium?.single?.["MilitaryOnly"];
        mapData["single"]["Apopalypse"] = data.difficulty?.Medium?.single?.["Apopalypse"];
        mapData["single"]["Reverse"] = data.difficulty?.Medium?.single?.["Reverse"];
        mapData["single"]["Hard"] = data.difficulty?.Hard?.single?.["Standard"];
        mapData["single"]["MagicOnly"] = data.difficulty?.Hard?.single?.["MagicOnly"];
        mapData["single"]["DoubleMoabHealth"] = data.difficulty?.Hard?.single?.["DoubleMoabHealth"];
        mapData["single"]["HalfCash"] = data.difficulty?.Hard?.single?.["HalfCash"];
        mapData["single"]["AlternateBloonsRounds"] = data.difficulty?.Hard?.single?.["AlternateBloonsRounds"];
        mapData["single"]["Impoppable"] = data.difficulty?.Hard?.single?.["Impoppable"];
        mapData["single"]["Clicks"] = data.difficulty?.Hard?.single?.["Clicks"];
        mapData["coop"]["Easy"] = data.difficulty?.Easy?.coop?.["Standard"];
        mapData["coop"]["PrimaryOnly"] = data.difficulty?.Easy?.coop?.["PrimaryOnly"];
        mapData["coop"]["Deflation"] = data.difficulty?.Easy?.coop?.["Deflation"];
        mapData["coop"]["Medium"] = data.difficulty?.Medium?.coop?.["Standard"];
        mapData["coop"]["MilitaryOnly"] = data.difficulty?.Medium?.coop?.["MilitaryOnly"];
        mapData["coop"]["Apopalypse"] = data.difficulty?.Medium?.coop?.["Apopalypse"];
        mapData["coop"]["Reverse"] = data.difficulty?.Medium?.coop?.["Reverse"];
        mapData["coop"]["Hard"] = data.difficulty?.Hard?.coop?.["Standard"];
        mapData["coop"]["MagicOnly"] = data.difficulty?.Hard?.coop?.["MagicOnly"];
        mapData["coop"]["DoubleMoabHealth"] = data.difficulty?.Hard?.coop?.["DoubleMoabHealth"];
        mapData["coop"]["HalfCash"] = data.difficulty?.Hard?.coop?.["HalfCash"];
        mapData["coop"]["AlternateBloonsRounds"] = data.difficulty?.Hard?.coop?.["AlternateBloonsRounds"];
        mapData["coop"]["Impoppable"] = data.difficulty?.Hard?.coop?.["Impoppable"];
        mapData["coop"]["Clicks"] = data.difficulty?.Hard?.coop?.["Clicks"];

        //this is necessary because sometimes maps will randomly show up as incomplete despite having parameters such as a completed best round number or "completedWithoutLoadSave" is true.
        //this is a workaround to ensure that the map is marked as completed if it meets the requirements for a bronze/silver/gold/black border
        for (let [difficulty, diffData] of Object.entries(mapData["single"])) {
            if (diffData && diffData["completed"] === false && (diffData["bestRound"] >= constants.modeBestRoundFix[difficulty] || diffData.completedWithoutLoadingSave) ) {
                diffData["completed"] = true;
            }
        }

        for (let [difficulty, diffData] of Object.entries(mapData["coop"])) {
            if (diffData && diffData["completed"] === false && (diffData["bestRound"] >= constants.modeBestRoundFix[difficulty] || diffData.completedWithoutLoadingSave) ) {
                diffData["completed"] = true;
            }
        }

        processedMapData.Medals.single[map] = {};
        processedMapData.Medals.coop[map] = {};

        for (let [difficulty, diffData] of Object.entries(mapData["single"])) {
            (diffData && diffData["completed"]) ? processedMapData.Medals.single[map][difficulty] = true : processedMapData.Medals.single[map][difficulty] = false;
        }

        for (let [difficulty, diffData] of Object.entries(mapData["coop"])) {
            (diffData && diffData["completed"]) ? processedMapData.Medals.coop[map][difficulty] = true : processedMapData.Medals.coop[map][difficulty] = false;
        }

        processedMapData.Medals.single[map]["CHIMPS-BLACK"] = mapData["single"]["Clicks"] ? mapData["single"]["Clicks"].completedWithoutLoadingSave : false;
        processedMapData.Medals.coop[map]["CHIMPS-BLACK"] = mapData["coop"]["Clicks"] ? mapData["coop"]["Clicks"].completedWithoutLoadingSave : false;

        let bronzeBorder = ["Easy", "PrimaryOnly", "Deflation"].every(key => 
            mapData["single"][key] && mapData["single"][key]["completed"] === true
        );
        let silverBorder = bronzeBorder && ["Medium", "MilitaryOnly", "Apopalypse", "Reverse"].every(key =>
            mapData["single"][key] && mapData["single"][key]["completed"] === true
        );
        let goldBorder = silverBorder && ["Hard", "MagicOnly", "DoubleMoabHealth", "HalfCash", "AlternateBloonsRounds", "Impoppable", "Clicks"].every(key =>
            mapData["single"][key] && mapData["single"][key]["completed"] === true
        );
        let blackBorder = goldBorder && mapData["single"]["Clicks"].completedWithoutLoadingSave;
        
        processedMapData["Borders"]["single"][map] = blackBorder ? "Black" : goldBorder ? "Gold" : silverBorder ? "Silver" : bronzeBorder ? "Bronze" : "None";
        
        bronzeBorder = ["Easy", "PrimaryOnly", "Deflation"].every(key =>
            mapData["coop"][key] && mapData["coop"][key]["completed"] === true
        );
        silverBorder = bronzeBorder && ["Medium", "MilitaryOnly", "Apopalypse", "Reverse"].every(key =>
            mapData["coop"][key] && mapData["coop"][key]["completed"] === true
        );
        goldBorder = silverBorder && ["Hard", "MagicOnly", "DoubleMoabHealth", "HalfCash", "AlternateBloonsRounds", "Impoppable", "Clicks"].every(key =>
            mapData["coop"][key] && mapData["coop"][key]["completed"] === true
        );
        blackBorder = goldBorder && mapData["coop"]["Clicks"].completedWithoutLoadingSave;

        processedMapData["Borders"]["coop"][map] = blackBorder ? "Black" : goldBorder ? "Gold" : silverBorder ? "Silver" : bronzeBorder ? "Bronze" : "None";
        
        processedMapData["Maps"][map] = mapData;


    }
}

const container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container);

document.body.classList.add('hex-bg');

const header = document.createElement('div');
header.id = 'header';
header.classList.add('header');
container.appendChild(header);

const headerDiv = document.createElement('div');
headerDiv.id = 'header-div';
headerDiv.classList.add('header-div');
header.appendChild(headerDiv);

const title = document.createElement('h1');
title.id = 'title';
title.classList.add('title');
title.classList.add('black-outline');
title.innerHTML = 'Bloons TD 6 OAK Tool';
headerDiv.appendChild(title);

// const titleImg = document.createElement('img');
// titleImg.id = 'title-img';
// titleImg.classList.add('title-img');
// titleImg.src = './Assets/UI/TitleContainer.png';
// headerDiv.appendChild(titleImg);

const headerContainer = document.createElement('div');
headerContainer.id = 'header';
headerContainer.classList.add('header-container');
header.appendChild(headerContainer);

let headers = ['Overview', 'Progress', 'Explore', 'FAQ', 'Settings'];

headers.forEach((headerName) => {
    headerName = headerName.toLowerCase();
    let headerElement = document.createElement('p');
    headerElement.classList.add('header-label');
    headerElement.classList.add('black-outline');
    headerElement.id = headerName.toLowerCase();
    headerElement.innerHTML = headerName;
    headerElement.addEventListener('click', () => {
        changeTab(headerName.toLowerCase());
    })
    headerContainer.appendChild(headerElement);
})

const content = document.createElement('div');
content.id = 'content';
content.classList.add('content');
container.appendChild(content);

function changeTab(tab) {
    changeHexBGColor(constants.BGColor)
    let tabs = document.getElementsByClassName('content-div');
    for (let tab of tabs){
        tab.style.display = 'none';
        document.getElementById(tab.id.replace('-content', '')).classList.remove('selected');
    }
    document.getElementById(tab + '-content').style.display = 'flex';
    document.getElementById(tab).classList.add('selected');
    if(!isGenerated.includes(tab)){
        switch(tab){
            case 'overview':
                generateOverview();
                isGenerated.push(tab);
                break;
            case 'progress':
                generateProgress();
                break;
            case 'explore':
                //generateExplore();
                //isGenerated.push(tab);
                break;
            case 'maps':
                //generateMaps();
                //isGenerated.push(tab);
                break;
            case 'settings':
                //generateSettings();
                //isGenerated.push(tab);
                break;
        }
    }
}

headers.forEach((headerName) => {
    headerName = headerName.toLowerCase();
    let contentElement = document.createElement('div');
    contentElement.id = headerName + '-content';
    contentElement.classList.add(`content-div`);
    contentElement.classList.add(headerName)
    contentElement.style.display = 'none';
    content.appendChild(contentElement);
})

let tempXP = 0;

function generateOverview(){

    let profileHeader = document.createElement('div');
    profileHeader.id = 'profile-header';
    profileHeader.classList.add('profile-header');
    profileHeader.classList.add('profile-banner');
    profileHeader.style.backgroundImage = `linear-gradient(to bottom, transparent 50%, var(--profile-primary) 70%),url('${btd6publicprofile["bannerURL"]}')`;
    document.getElementById('overview-content').appendChild(profileHeader);
    profileHeader.appendChild(generateAvatar(100));

    let profileTopBottom = document.createElement('div');
    profileTopBottom.id = 'profile-top-bottom';
    profileTopBottom.classList.add('profile-top-bottom');
    profileHeader.appendChild(profileTopBottom);

    let profileTop = document.createElement('div');
    profileTop.id = 'profile-top';
    profileTop.classList.add('profile-top');
    profileTopBottom.appendChild(profileTop);

    let profileName = document.createElement('p');
    profileName.id = 'profile-name';
    profileName.classList.add('profile-name');
    profileName.classList.add('black-outline');
    profileName.innerHTML = btd6publicprofile["displayName"];
    profileTop.appendChild(profileName);

    let profileBottom = document.createElement('div');
    profileBottom.id = 'profile-bottom';
    profileBottom.classList.add('profile-bottom');
    profileTopBottom.appendChild(profileBottom);

    profileBottom.appendChild(generateRank());
    if(btd6usersave["veteranXp"] > 0){
        profileBottom.appendChild(generateRank(true));
    }

    let belowProfileHeader = document.createElement('div');
    belowProfileHeader.id = 'below-profile-header';
    belowProfileHeader.classList.add('below-profile-header');
    document.getElementById('overview-content').appendChild(belowProfileHeader);

    let leftColumnDiv = document.createElement('div');
    leftColumnDiv.id = 'left-column-div';
    leftColumnDiv.classList.add('left-column-div');
    belowProfileHeader.appendChild(leftColumnDiv);

    let leftColumnHeader = document.createElement('div');
    leftColumnHeader.id = 'left-column-header';
    leftColumnHeader.classList.add('left-column-header');
    leftColumnDiv.appendChild(leftColumnHeader);

    let leftColumnHeaderText = document.createElement('p');
    leftColumnHeaderText.id = 'left-column-header-text';
    leftColumnHeaderText.classList.add('column-header-text');
    leftColumnHeaderText.classList.add('black-outline');
    leftColumnHeaderText.innerHTML = 'Currency and Medals';
    leftColumnHeader.appendChild(leftColumnHeaderText);

    let currencyAndMedalsDiv = document.createElement('div');
    currencyAndMedalsDiv.id = 'currency-medals-div';
    currencyAndMedalsDiv.classList.add('currency-medals-div');
    leftColumnDiv.appendChild(currencyAndMedalsDiv);

    let currencyDiv = document.createElement('div');
    currencyDiv.id = 'currency-div';
    currencyDiv.classList.add('currency-div');
    currencyAndMedalsDiv.appendChild(currencyDiv);

    let currencyMMDiv = document.createElement('div');
    currencyMMDiv.id = 'currency-mm-div';
    currencyMMDiv.classList.add('currency-mm-div');
    currencyDiv.appendChild(currencyMMDiv);

    let currencyMMImg = document.createElement('img');
    currencyMMImg.id = 'currency-mm-img';
    currencyMMImg.classList.add('currency-mm-img');
    currencyMMImg.src = '../Assets/UI/BloonjaminsIcon.png';
    currencyMMDiv.appendChild(currencyMMImg);

    let currencyMMText = document.createElement('p');
    currencyMMText.id = 'currency-mm-text';
    currencyMMText.classList.add('currency-mm-text');
    currencyMMText.classList.add('mm-outline');
    currencyMMText.innerHTML = "$" + btd6usersave["monkeyMoney"].toLocaleString();
    currencyMMDiv.appendChild(currencyMMText);

    let currencyKnowledgeDiv = document.createElement('div');
    currencyKnowledgeDiv.id = 'currency-knowledge-div';
    currencyKnowledgeDiv.classList.add('currency-knowledge-div');
    currencyDiv.appendChild(currencyKnowledgeDiv);

    let currencyKnowledgeImg = document.createElement('img');
    currencyKnowledgeImg.id = 'currency-knowledge-img';
    currencyKnowledgeImg.classList.add('currency-knowledge-img');
    currencyKnowledgeImg.src = '../Assets/UI/KnowledgeIcon.png';
    currencyKnowledgeDiv.appendChild(currencyKnowledgeImg);

    let currencyKnowledgeText = document.createElement('p');
    currencyKnowledgeText.id = 'currency-knowledge-text';
    currencyKnowledgeText.classList.add('currency-knowledge-text');
    currencyKnowledgeText.classList.add('knowledge-outline');
    currencyKnowledgeText.innerHTML = btd6usersave["knowledgePoints"].toLocaleString();
    currencyKnowledgeDiv.appendChild(currencyKnowledgeText);

    let currencyTrophiesDiv = document.createElement('div');
    currencyTrophiesDiv.id = 'currency-trophies-div';
    currencyTrophiesDiv.classList.add('currency-trophies-div');
    currencyDiv.appendChild(currencyTrophiesDiv);

    let currencyTrophiesImg = document.createElement('img');
    currencyTrophiesImg.id = 'currency-trophies-img';
    currencyTrophiesImg.classList.add('currency-trophies-img');
    currencyTrophiesImg.src = '../Assets/UI/TrophyIcon.png';
    currencyTrophiesDiv.appendChild(currencyTrophiesImg);

    let currencyTrophiesText = document.createElement('p');
    currencyTrophiesText.id = 'currency-trophies-text';
    currencyTrophiesText.classList.add('currency-trophies-text');
    currencyTrophiesText.classList.add('black-outline');
    currencyTrophiesText.innerHTML = btd6usersave["trophies"].toLocaleString();
    currencyTrophiesDiv.appendChild(currencyTrophiesText);

    let medalsDiv = document.createElement('div');
    medalsDiv.id = 'medals-div';
    medalsDiv.classList.add('medals-div');
    currencyAndMedalsDiv.appendChild(medalsDiv);

    for (let [medal, num] of Object.entries(medalsInOrder)){
        if(num === 0) { continue; }
        let medalDiv = document.createElement('div');
        medalDiv.id = 'medal-div';
        medalDiv.classList.add('medal-div');
        medalsDiv.appendChild(medalDiv);

        let medalImg = document.createElement('img');
        medalImg.id = 'medal-img';
        medalImg.classList.add('medal-img');
        medalImg.src = getMedalIcon(medal);
        medalImg.style.display = "none";
        medalImg.addEventListener('load', () => {
            if(medalImg.width < medalImg.height){
                medalImg.style.width = `${ratioCalc(3,70,256,0,medalImg.width)}px`
            } else {
                medalImg.style.height = `${ratioCalc(3,70,256,0,medalImg.height)}px`
            }
            medalImg.style.removeProperty('display');
        })
        medalDiv.appendChild(medalImg);

        let medalText = document.createElement('p');
        medalText.id = 'medal-text';
        medalText.classList.add('medal-text');
        medalText.classList.add('black-outline');
        medalText.innerHTML = num.toLocaleString();
        medalDiv.appendChild(medalText);
    }

    /*let topColumnDiv = document.createElement('div');
    topColumnDiv.id = 'top-column-div';
    topColumnDiv.classList.add('right-column-div');
    leftColumnDiv.appendChild(topColumnDiv);

    let topHeroesDiv = document.createElement('div');
    topHeroesDiv.id = 'top-heroes-div';
    topHeroesDiv.classList.add('top-heroes-div');
    topColumnDiv.appendChild(topHeroesDiv);*/

    /*let topHeroesHeaderText = document.createElement('p');
    topColumnHeaderText.id = 'top-column-header-text';
    topColumnHeaderText.classList.add('top-header-text');
    topColumnHeaderText.classList.add('black-outline');
    topColumnHeaderText.innerHTML = 'Top Heroes';
    leftColumnHeader.appendChild(topColumnHeaderText);*/

    let rightColumnDiv = document.createElement('div');
    rightColumnDiv.id = 'right-column-div';
    rightColumnDiv.classList.add('right-column-div');
    belowProfileHeader.appendChild(rightColumnDiv);

    let rightColumnHeader = document.createElement('div');
    rightColumnHeader.id = 'right-column-header';
    rightColumnHeader.classList.add('right-column-header');
    rightColumnDiv.appendChild(rightColumnHeader);

    let rightColumnHeaderText = document.createElement('p');
    rightColumnHeaderText.id = 'right-column-header-text';
    rightColumnHeaderText.classList.add('column-header-text');
    rightColumnHeaderText.classList.add('black-outline');
    rightColumnHeaderText.innerHTML = 'Overall Stats';
    rightColumnHeader.appendChild(rightColumnHeaderText);

    let profileStatsDiv = document.createElement('div');
    profileStatsDiv.id = 'profile-stats';
    profileStatsDiv.classList.add('profile-stats');
    rightColumnDiv.appendChild(profileStatsDiv);

    for (let [key, value] of Object.entries(profileStats)){
        let stat = document.createElement('div');
        stat.id = 'stat';
        stat.classList.add('stat');
        profileStatsDiv.appendChild(stat);

        let statName = document.createElement('p');
        statName.id = 'stat-name';
        statName.classList.add('stat-name');
        statName.innerHTML = key;
        stat.appendChild(statName);

        let statValue = document.createElement('p');
        statValue.id = 'stat-value';
        statValue.classList.add('stat-value');
        statValue.innerHTML = value.toLocaleString();
        stat.appendChild(statValue);
    }
}

function generateAvatar(width){
    let avatar = document.createElement('div');
    avatar.id = 'avatar';
    avatar.classList.add('avatar');

    let avatarFrame = document.createElement('img');
    avatarFrame.id = 'avatar-frame';
    avatarFrame.classList.add('avatar-frame');
    avatarFrame.classList.add('noSelect')
    avatarFrame.style.width = `${width}px`;
    avatarFrame.src = '../Assets/UI/InstaTowersContainer.png';
    avatar.appendChild(avatarFrame);

    let avatarImg = document.createElement('img');
    avatarImg.id = 'avatar-img';
    avatarImg.classList.add('avatar-img');
    avatarImg.classList.add('noSelect')
    avatarImg.style.width = `${width}px`;
    avatarImg.src = btd6publicprofile["avatarURL"];
    avatar.appendChild(avatarImg);
    return avatar;
}

function generateRank(veteran){
    let rank = document.createElement('div');
    rank.id = 'rank';
    rank.classList.add('rank');

    let rankStar = document.createElement('div');
    rankStar.id = 'rank-star';
    rankStar.classList.add('rank-star');
    rank.appendChild(rankStar);

    let rankImg = document.createElement('img');
    rankImg.id = 'rank-img';
    rankImg.classList.add('rank-img');
    rankImg.src = veteran ? '../Assets/UI/LvlHolderVeteran.png' : '../Assets/UI/LvlHolder.png';
    rankStar.appendChild(rankImg);

    let rankText = document.createElement('p');
    rankText.id = 'rank-text';
    rankText.classList.add('rank-text');
    rankText.classList.add('black-outline');
    rankText.innerHTML = veteran ? rankInfoVeteran["rank"] : rankInfo["rank"];
    rankStar.appendChild(rankText);

    let rankBar = document.createElement('div');
    rankBar.id = 'rank-bar';
    rankBar.classList.add('rank-bar');
    rank.appendChild(rankBar);

    let rankBarFill = document.createElement('div');
    rankBarFill.id = 'rank-bar-fill';
    rankBarFill.classList.add('rank-bar-fill');
    if (veteran) { 
        rankBar.classList.add('rank-bar-veteran');
        rankBarFill.classList.add('rank-bar-fill-veteran');
        rankBarFill.style.width = rankInfoVeteran["xp"] === null ? "100%" : `${(rankInfoVeteran["xp"]/rankInfoVeteran["xpGoal"]) * 100}%`;
    } else {
        rankBarFill.style.width = rankInfo["xp"] === null ? "100%" : `${(rankInfo["xp"]/rankInfo["xpGoal"]) * 100}%`;
    }
    rankBar.appendChild(rankBarFill);

    // let rankBarFrameImg = document.createElement('img');
    // rankBarFrameImg.id = 'rank-bar-frame-img';
    // rankBarFrameImg.classList.add('rank-bar-frame-img');
    // rankBarFrameImg.src = '../Assets/UI/XPBarFrame.png';
    // rankBar.appendChild(rankBarFrameImg);

    let rankBarText = document.createElement('p');
    rankBarText.id = 'rank-bar-text';
    rankBarText.classList.add('rank-bar-text');
    if (veteran) {
        rankBarText.innerHTML = rankInfoVeteran["xp"] === null ? "Max Level" : `${rankInfoVeteran["xp"].toLocaleString()}/${rankInfoVeteran["xpGoal"].toLocaleString()}`;
    } else {
        rankBarText.innerHTML = rankInfo["xp"] === null ? "Max Level" : `${rankInfo["xp"].toLocaleString()}/${rankInfo["xpGoal"].toLocaleString()}`;
    }
    if (rankInfo["xp"] == null && !veteran) { rankBarText.classList.add("rank-bar-text-max") }
    rankBar.appendChild(rankBarText);

    return rank;
}

function generateProgress(){
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";
    /*let progressClipboardTop = document.createElement('div');
    progressClipboardTop.id = 'progress-clipboard-top';
    progressClipboardTop.classList.add('progress-clipboard-top');
    progressContent.appendChild(progressClipboardTop);*/

    let progressClipboard = document.createElement('img');
    progressClipboard.id = 'progress-clipboard';
    progressClipboard.classList.add('progress-clipboard');
    progressClipboard.src = '../Assets/UI/ClipboardTop.png';
    progressContent.appendChild(progressClipboard);

    let progressPage = document.createElement('div');
    progressPage.id = 'progress-page';
    progressPage.classList.add('progress-page');
    progressContent.appendChild(progressPage);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.id = 'selectors-div';
    selectorsDiv.classList.add('selectors-div');
    progressPage.appendChild(selectorsDiv);

    let selectors = ['Towers', 'Heroes', 'Knowledge', 'MapProgress', 'Powers', 'InstaMonkeys', 'Achievements', 'Extras'];

    selectors.forEach((selector) => {
        if(progressSubText[selector].includes("0 Extras")) { return; }
        let selectorDiv = document.createElement('div');
        selectorDiv.id = selector.toLowerCase() + '-div';
        selectorDiv.classList.add('selector-div');
        /*selectorDiv.innerHTML = progressSubText[selector];*/
        selectorDiv.addEventListener('click', () => {
            changeProgressTab(selector);
        })
        selectorsDiv.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
        selectorImg.id = selector.toLowerCase() + '-img';
        selectorImg.classList.add('selector-img');
        selectorImg.src = selector == "Heroes" ? `../Assets/HeroIconCircle/HeroIcon${btd6usersave.primaryHero}.png` : '../Assets/UI/' + selector.replace(" ","") + 'Btn.png';
        selectorDiv.appendChild(selectorImg);

        let selectorText = document.createElement('p');
        selectorText.id = selector.toLowerCase() + '-text';
        selectorText.classList.add('selector-text');
        selectorText.classList.add('black-outline');
        selectorText.innerHTML = progressSubText[selector];
        selectorDiv.appendChild(selectorText);

        let selectorGoImg = document.createElement('img');
        selectorGoImg.id = selector.toLowerCase() + '-go-img';
        selectorGoImg.classList.add('selector-go-img');
        selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
        selectorDiv.appendChild(selectorGoImg);
    })
}

function changeProgressTab(selector){
    switch(selector){
        case 'Towers':
            generateTowerProgress();
            break;
        case 'Heroes':
            generateHeroesProgress();
            break;
        case "Knowledge":
            changeHexBGColor(constants.ParagonBGColor)
            generateKnowledgeProgress();
            break;
        case "MapProgress":
            generateMapsProgress();
            break;
        case "Powers":
            //generatePowersProgress();
            break;
        case "InstaMonkeys":
            //generateInstaMonkeysProgress();
            break;
        case "Achievements":
            //generateAchievementsProgress();
            break;
        case "Extras":
            //generateExtrasProgress();
            break;
    }
}

function generateTowerProgress(){
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let towerProgressContainer = document.createElement('div');
    towerProgressContainer.id = 'tower-progress-container';
    towerProgressContainer.classList.add('tower-progress-container');
    progressContent.appendChild(towerProgressContainer);

    let towerProgressDiv = document.createElement('div');
    towerProgressDiv.id = 'tower-progress-div';
    towerProgressDiv.classList.add('tower-progress-div');
    towerProgressContainer.appendChild(towerProgressDiv);

    let towerSelectorHeaderTop = document.createElement('div');
    towerSelectorHeaderTop.id = 'tower-selector-header-top';
    towerSelectorHeaderTop.classList.add('tower-selector-header-top');
    towerProgressDiv.appendChild(towerSelectorHeaderTop);

    let towerSelectorHeaderText = document.createElement('p');
    towerSelectorHeaderText.id = 'tower-selector-header-text';
    towerSelectorHeaderText.classList.add('tower-selector-header-text');
    towerSelectorHeaderText.classList.add('black-outline');
    towerSelectorHeaderText.innerHTML = 'Towers';
    towerSelectorHeaderTop.appendChild(towerSelectorHeaderText);

    let towerSelectorHeader = document.createElement('div');
    towerSelectorHeader.id = 'tower-selector-header';
    towerSelectorHeader.classList.add('tower-selector-header');
    towerProgressDiv.appendChild(towerSelectorHeader);

    for (let [tower, category] of Object.entries(constants.towersInOrder)) {
        let towerSelector = document.createElement('div');
        towerSelector.id = tower + '-selector';
        towerSelector.classList.add(`tower-selector-${category.toLowerCase()}`);
        if(!btd6usersave.unlockedTowers[tower]){
            towerSelector.classList.add('hero-selector-div-disabled');
        }
        towerSelector.addEventListener('click', () => {
            if(btd6usersave.unlockedTowers[tower]){
                generateTowerProgressTower(tower);
            }
        })
        towerSelectorHeader.appendChild(towerSelector);

        let towerSelectorImg = document.createElement('img');
        towerSelectorImg.id = tower + '-selector-img';
        towerSelectorImg.classList.add('tower-selector-img');
        towerSelectorImg.src = getInstaContainerIcon(tower,"000");
        towerSelector.appendChild(towerSelectorImg);

        let towerSelectorHighlight = document.createElement('div');
        towerSelectorHighlight.id = tower + '-selector-highlight';
        towerSelectorHighlight.classList.add('tower-selector-highlight');
        towerSelector.appendChild(towerSelectorHighlight);
    }

    let towerProgressContent = document.createElement('div');
    towerProgressContent.id = 'tower-progress-content';
    towerProgressContent.classList.add('tower-progress-content');
    towerProgressContainer.appendChild(towerProgressContent);

    towerProgressContainer.append(generateTowerProgressTower("DartMonkey"));
}

function generateTowerProgressTower(tower){
    let towerProgressContent = document.getElementById('tower-progress-content');
    towerProgressContent.innerHTML = "";

    let unlockedAllT5 = 0;
    for (let path of Object.values(constants.towerPaths[tower])){
        for (let upgrade of Object.keys(path)){
            if (btd6usersave.acquiredUpgrades[upgrade]){
                unlockedAllT5 += 1;
            }
        }
    }
    unlockedAllT5 = unlockedAllT5 === 15;

    let paragonUnlocked = constants.paragonsAvailable.includes(tower) ? btd6usersave.acquiredUpgrades[`${tower} Paragon`] : false;
    paragonUnlocked ? changeHexBGColor(constants.ParagonBGColor) : changeHexBGColor()

    let towerProgressTop = document.createElement('div');
    towerProgressTop.id = 'tower-progress-top';
    towerProgressTop.classList.add('tower-progress-top');
    if (paragonUnlocked) { towerProgressTop.classList.add('tower-progress-top-paragon') }
    towerProgressContent.appendChild(towerProgressTop);

    let towerProgressContentTop = document.createElement('div');
    towerProgressContentTop.id = 'tower-progress-content-top';
    towerProgressContentTop.classList.add('tower-progress-content-top');
    towerProgressTop.appendChild(towerProgressContentTop);

    let towerProgressInfoContainer = document.createElement('div');
    towerProgressInfoContainer.id = 'tower-progress-info-container';
    towerProgressInfoContainer.classList.add('tower-progress-info-container');
    towerProgressContentTop.appendChild(towerProgressInfoContainer);

    let towerProgressContentText = document.createElement('p');
    towerProgressContentText.id = 'tower-progress-content-text';
    towerProgressContentText.classList.add('tower-progress-content-text');
    towerProgressContentText.classList.add(paragonUnlocked ? 'knowledge-outline' : 'black-outline');
    towerProgressContentText.innerHTML = locJSON[tower];
    towerProgressInfoContainer.appendChild(towerProgressContentText);

    let towerProgressContentXP = document.createElement('p');
    towerProgressContentXP.id = 'tower-progress-content-xp';
    towerProgressContentXP.classList.add('tower-progress-content-xp');
    towerProgressContentXP.classList.add('mm-outline');
    towerProgressContentXP.innerHTML = `XP: ${btd6usersave.towerXP[tower].toLocaleString()}`;
    towerProgressInfoContainer.appendChild(towerProgressContentXP);

    let towerProgressContentDesc = document.createElement('p');
    towerProgressContentDesc.id = 'tower-progress-content-desc';
    towerProgressContentDesc.classList.add('tower-progress-content-desc'+ (paragonUnlocked ? '-paragon' : ''));
    towerProgressContentDesc.innerHTML = locJSON[`${tower} Description`];;
    towerProgressContentTop.appendChild(towerProgressContentDesc);

    let towerNameAndPortrait = document.createElement('div');
    towerNameAndPortrait.id = 'tower-name-and-portrait';
    towerNameAndPortrait.classList.add('tower-name-and-portrait');
    towerProgressContent.appendChild(towerNameAndPortrait);

    let towerPortraitName = document.createElement('p');
    towerPortraitName.id = 'tower-portrait-name';
    towerPortraitName.classList.add('tower-portrait-name');
    towerPortraitName.classList.add('black-outline');
    towerPortraitName.innerHTML = locJSON[tower];
    towerNameAndPortrait.appendChild(towerPortraitName);

    let towerProgressPortraitDiv = document.createElement('div');
    towerProgressPortraitDiv.id = 'tower-progress-portrait';
    towerProgressPortraitDiv.classList.add('tower-progress-portrait');
    towerProgressPortraitDiv.classList.add(`tower-progress-portrait-${constants.towersInOrder[tower].toLowerCase()}`)
    towerNameAndPortrait.appendChild(towerProgressPortraitDiv);

    let towerProgressPortrait = document.createElement('img');
    towerProgressPortrait.id = 'tower-progress-portrait-img';
    towerProgressPortrait.classList.add('tower-progress-portrait-img');
    towerProgressPortrait.src = getTowerAssetPath(tower,"000");
    towerProgressPortraitDiv.appendChild(towerProgressPortrait);

    let towerProgressMainDiv = document.createElement('div');
    towerProgressMainDiv.id = 'tower-progress-main-div';
    towerProgressMainDiv.classList.add('tower-progress-main-div');
    towerProgressContent.appendChild(towerProgressMainDiv);

    towerProgressMainDiv.appendChild(makeUpgradeButtons(tower, unlockedAllT5, paragonUnlocked));

    let towerProgressBottom = document.createElement('div');
    towerProgressBottom.id = 'tower-progress-bottom';
    towerProgressBottom.classList.add('tower-progress-bottom');
    towerProgressContent.appendChild(towerProgressBottom);

    for (let selector of document.getElementsByClassName('tower-selector-highlight')){
        selector.style.display = "none";
    }
    document.getElementById(`${tower}-selector-highlight`).style.display = "block";

    return towerProgressContent;
}

function makeUpgradeButtons(tower, unlockedAllT5, paragonUnlocked){
    let upgradeContainer = document.createElement('div');
    upgradeContainer.id = 'upgrade-container';
    upgradeContainer.classList.add('upgrade-container');

    let upgradeRows = document.createElement('div');
    upgradeRows.id = 'upgrade-rows';
    upgradeRows.classList.add('upgrade-rows');
    upgradeContainer.appendChild(upgradeRows);

    let row1 = document.createElement('div');
    row1.id = 'upgrade-row-1';
    row1.classList.add('upgrade-row');
    upgradeRows.appendChild(row1);

    let row2 = document.createElement('div');
    row2.id = 'upgrade-row-2';
    row2.classList.add('upgrade-row');
    upgradeRows.appendChild(row2);

    let row3 = document.createElement('div');
    row3.id = 'upgrade-row-3';
    row3.classList.add('upgrade-row');
    upgradeRows.appendChild(row3);

    let index = 0;
    let grayOut = false;
    for (let [upgrade, model] of Object.entries(constants.towerPaths[tower].path1)) {
        let unlockStatus = btd6usersave.acquiredUpgrades[upgrade] ? "unlocked" : "locked";
        row1.appendChild(generateUpgradeIcon(tower, upgrade, unlockStatus, 1, index, paragonUnlocked, grayOut));
        if (unlockStatus == "locked") { grayOut = true }
        index++;
    }

    index = 0;
    grayOut = false;
    for (let [upgrade, model] of Object.entries(constants.towerPaths[tower].path2)) {
        let unlockStatus = btd6usersave.acquiredUpgrades[upgrade] ? "unlocked" : "locked";
        row2.appendChild(generateUpgradeIcon(tower, upgrade, unlockStatus, 2, index, paragonUnlocked, grayOut));
        if (unlockStatus == "locked") { grayOut = true }
        index++;
    }

    index = 0;
    grayOut = false;
    for (let [upgrade, model] of Object.entries(constants.towerPaths[tower].path3)) {
        let unlockStatus = btd6usersave.acquiredUpgrades[upgrade] ? "unlocked" : "locked";
        row3.appendChild(generateUpgradeIcon(tower, upgrade, unlockStatus, 3, index, paragonUnlocked, grayOut));
        if (unlockStatus == "locked") { grayOut = true }
        index++;
    }

    if (constants.paragonsAvailable.includes(tower) && unlockedAllT5){

        let upgradeContainerParagon = document.createElement('div');
        upgradeContainerParagon.id = 'upgrade-container-paragon';
        upgradeContainerParagon.classList.add('upgrade-container-paragon');
        upgradeContainer.appendChild(upgradeContainerParagon);

        upgradeContainerParagon.appendChild(generateParagonIcon(tower, `${tower} Paragon`, btd6usersave.acquiredUpgrades[`${tower} Paragon`] ? "unlocked" : "locked"));
    }

    // constants.towerPaths[tower].path1.forEach((upgrade) => {

    //     generateUpgradeIcon(tower, upgrade, upgradeStatus);
    // })
    return upgradeContainer;
}

function generateUpgradeIcon(tower, upgrade, status, row, tier, paragon, grayOut){
    let upgradeDiv = document.createElement('div');
    upgradeDiv.id = `${tower}-${upgrade}-div`;
    upgradeDiv.classList.add('upgrade-div');
    let towerUpgrade = ``;
    switch (row){
        case 1:
            towerUpgrade = `${tier + 1}00`;
            break;
        case 2:
            towerUpgrade = `0${tier + 1}0`;
            break;
        case 3:
            towerUpgrade = `00${tier + 1}`;
            break;
    }

    let upgradeGlow = document.createElement('div');
    upgradeGlow.id = `${tower}-${upgrade}-glow`;
    // upgradeGlow.classList.add('upgrade-glow');
    upgradeDiv.appendChild(upgradeGlow);

    let upgradeBGImg = document.createElement('div');
    upgradeBGImg.id = `${tower}-${upgrade}-bg-img`;
    upgradeBGImg.classList.add('upgrade-bg-img');
    let enoughXP = btd6usersave.towerXP[tower] >= constants.towerPaths[tower][`path${row}`][upgrade];
    tier == 4 ? btd6usersave.acquiredUpgrades[upgrade] ? upgradeBGImg.classList.add(`upgrade-t5`) : upgradeBGImg.classList.add(`upgrade-t5-locked`) : upgradeBGImg.classList.add(`upgrade-${paragon ? "paragon" : status == "unlocked" ? status : (enoughXP ? "green" : "red")}`);
    upgradeDiv.appendChild(upgradeBGImg);

    let upgradeImg = document.createElement('img');
    upgradeImg.id = `${tower}-${upgrade}-img`;
    upgradeImg.classList.add('upgrade-img');
    upgradeImg.src = getUpgradeAssetPath(upgrade);
    if (!btd6usersave.acquiredUpgrades[upgrade] && tier == 4) { upgradeImg.style.visibility = "hidden";}
    upgradeDiv.appendChild(upgradeImg);

    let upgradeText = document.createElement('p');
    upgradeText.id = `${tower}-${upgrade}-text`;
    upgradeText.classList.add('upgrade-text');
    upgradeText.innerHTML = getLocValue(upgrade);
    upgradeDiv.appendChild(upgradeText);

    let upgradeTooltip = document.createElement('div');
    upgradeTooltip.id = `${tower}-${upgrade}-tooltip`;
    upgradeTooltip.classList.add('upgrade-tooltip');
    upgradeTooltip.innerHTML = getLocValue(`${upgrade} Description`);
    upgradeDiv.appendChild(upgradeTooltip);

    upgradeDiv.addEventListener('click', () => {
        onSelectTowerUpgrade(tower, upgrade, towerUpgrade);
        Array.from(document.getElementsByClassName('upgrade-glow')).forEach((glow) => {
            glow.classList.remove('upgrade-glow');
        });
        if (document.getElementsByClassName("upgrade-glow-paragon").length > 0) {
            document.getElementsByClassName("upgrade-glow-paragon")[0].classList.remove('upgrade-glow-paragon');
        }
        upgradeGlow.classList.add('upgrade-glow');
    })
    if (grayOut) {
        upgradeBGImg.classList.add('upgrade-after-locked');
        upgradeImg.classList.add('upgrade-after-locked');
    }

    return upgradeDiv;
}

function generateParagonIcon(tower, upgrade, status){
    let paragonDiv = document.createElement('div');
    paragonDiv.id = `${tower}-paragon-div`;
    paragonDiv.classList.add('upgrade-div');


    let paragonBGImg = document.createElement('div');
    paragonBGImg.id = `${tower}-${upgrade}-bg-img`;
    paragonBGImg.classList.add('upgrade-bg-img');
    paragonBGImg.classList.add(`upgrade-paragon-special${btd6usersave.acquiredUpgrades[upgrade] ? "" : "-locked"}`);
    paragonDiv.appendChild(paragonBGImg);

    let paragonGlow = document.createElement('div');
    paragonGlow.id = `paragon-glow`;
    // upgradeGlow.classList.add('upgrade-glow');
    paragonDiv.appendChild(paragonGlow);

    let paragonImg = document.createElement('img');
    paragonImg.id = `${tower}-paragon-img`;
    paragonImg.classList.add('upgrade-img');
    paragonImg.src = getUpgradeAssetPath(`${tower} Paragon`);
    if (!btd6usersave.acquiredUpgrades[upgrade]) { paragonImg.style.visibility = "hidden";}
    paragonDiv.appendChild(paragonImg);

    let paragonText = document.createElement('p');
    paragonText.id = `${tower}-${upgrade}-text`;
    paragonText.classList.add('upgrade-text');
    paragonText.innerHTML = getLocValue(upgrade);
    paragonDiv.appendChild(paragonText);

    let paragonTooltip = document.createElement('div');
    paragonTooltip.id = `${tower}-${upgrade}-tooltip`;
    paragonTooltip.classList.add('upgrade-tooltip');
    paragonTooltip.innerHTML = getLocValue(`${upgrade} Description`);
    paragonDiv.appendChild(paragonTooltip);

    paragonDiv.addEventListener('click', () => {
        onSelectTowerUpgradeParagon(tower, upgrade, "Paragon");
        Array.from(document.getElementsByClassName('upgrade-glow')).forEach((glow) => {
            glow.classList.remove('upgrade-glow');
        });
        paragonGlow.classList.add('upgrade-glow-paragon');
    })

    return paragonDiv;
}

function onSelectTowerUpgrade(tower, upgrade, tiers){
    let portrait_div = document.getElementById('tower-progress-portrait');
    let portrait_name = document.getElementById('tower-portrait-name');
    let portrait_img = document.getElementById('tower-progress-portrait-img');

    portrait_name.innerHTML = getLocValue(upgrade);

    if(tiers.includes("5") && !btd6usersave.acquiredUpgrades[upgrade]) {
        portrait_div.classList.add(`tower-progress-portrait-t5-locked`);
        portrait_img.src = "";
        return;
    } 

    if (portrait_div.classList.contains(`tower-progress-portrait-t5-locked`)) {
        portrait_div.classList.remove(`tower-progress-portrait-t5-locked`);
    }

    if (portrait_div.classList.contains('tower-progress-portrait-paragon')) {
        portrait_div.classList.remove('tower-progress-portrait-paragon');
    }

    if (portrait_div.classList.contains('tower-progress-portrait-paragon-locked')) {
        portrait_div.classList.remove('tower-progress-portrait-paragon-locked');
    }

    portrait_div.classList.add(`tower-progress-portrait-${constants.towersInOrder[tower].toLowerCase()}`);

    for (let upgrade of document.getElementsByClassName('upgrade-div')){
        upgrade.classList.remove('selected');
    }
    if (document.getElementById(`${tower}-paragon-div`) != null) {
        document.getElementById(`${tower}-paragon-div`).classList.remove('selected-paragon');
    }

    portrait_img.src = getTowerAssetPath(tower,tiers);
}

function onSelectTowerUpgradeParagon(tower, upgrade, tiers){
    let portrait_div = document.getElementById('tower-progress-portrait');
    let portrait_name = document.getElementById('tower-portrait-name');
    let portrait_img = document.getElementById('tower-progress-portrait-img');

    portrait_name.innerHTML = getLocValue(upgrade);

    if(tiers.includes("Paragon") && !btd6usersave.acquiredUpgrades[upgrade]) {
        portrait_div.classList.add(`tower-progress-portrait-paragon-locked`);
        portrait_img.src = "";
        return;
    } 

    if (portrait_div.classList.contains(`tower-progress-portrait-${constants.towersInOrder[tower].toLowerCase()}`)) {
        portrait_div.classList.remove(`tower-progress-portrait-${constants.towersInOrder[tower].toLowerCase()}`);
    }
    portrait_div.classList.add('tower-progress-portrait-paragon')

    for (let upgrade of document.getElementsByClassName('upgrade-div')){
        upgrade.classList.remove('selected');
    }

    portrait_img.src = getTowerAssetPath(tower,tiers);
}

function generateHeroesProgress(){
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let heroProgressContainer = document.createElement('div');
    heroProgressContainer.id = 'tower-progress-container';
    heroProgressContainer.classList.add('tower-progress-container');
    progressContent.appendChild(heroProgressContainer);

    let heroProgressDiv = document.createElement('div');
    heroProgressDiv.id = 'hero-progress-div';
    heroProgressDiv.classList.add('hero-progress-div');
    heroProgressContainer.appendChild(heroProgressDiv);

    let heroSelectorHeaderTop = document.createElement('div');
    heroSelectorHeaderTop.id = 'tower-selector-header-top';
    heroSelectorHeaderTop.classList.add('tower-selector-header-top');
    heroProgressDiv.appendChild(heroSelectorHeaderTop);

    let heroSelectorHeaderText = document.createElement('p');
    heroSelectorHeaderText.id = 'hero-selector-header-text';
    heroSelectorHeaderText.classList.add('hero-selector-header-text');
    heroSelectorHeaderText.classList.add('black-outline');
    heroSelectorHeaderText.innerHTML = 'Heroes';
    heroSelectorHeaderTop.appendChild(heroSelectorHeaderText);

    let heroSelectorHeader = document.createElement('div');
    heroSelectorHeader.id = 'hero-selector-header';
    heroSelectorHeader.classList.add('hero-selector-header');
    heroProgressDiv.appendChild(heroSelectorHeader);

    for (let [hero, nameColor] of Object.entries(constants.heroesInOrder)) {
        let heroSelector = document.createElement('div');
        heroSelector.id = hero + '-selector';
        heroSelector.classList.add(`hero-selector-div`);
        if(!btd6usersave.unlockedHeros[hero]){ 
            heroSelector.classList.add(`hero-selector-div-disabled`);
        }
        heroSelector.addEventListener('click', () => {
            if(btd6usersave.unlockedHeros[hero]){ 
                generateHeroProgressHero(hero, nameColor);
            }
        })
        heroSelectorHeader.appendChild(heroSelector);

        let heroSelectorImg = document.createElement('img');
        heroSelectorImg.id = hero + '-selector-img';
        heroSelectorImg.classList.add('hero-selector-img');
        heroSelectorImg.src = getHeroSquareIcon(hero);
        heroSelector.appendChild(heroSelectorImg);

        let heroSelectorHighlight = document.createElement('div');
        heroSelectorHighlight.id = hero + '-selector-highlight';
        heroSelectorHighlight.classList.add('hero-selector-highlight');
        heroSelector.appendChild(heroSelectorHighlight);
    }

    let heroProgressContent = document.createElement('div');
    heroProgressContent.id = 'hero-progress-content';
    heroProgressContent.classList.add('hero-progress-content');
    heroProgressContainer.appendChild(heroProgressContent);

    generateHeroProgressHero(btd6usersave.primaryHero, constants.heroesInOrder[btd6usersave.primaryHero])
}

function generateHeroProgressHero(hero, nameColor){
    currentlySelectedHero = hero;
    changeHexBGColor(constants.HeroBGColors[hero]);

    let heroProgressContent = document.getElementById('hero-progress-content');
    heroProgressContent.innerHTML = "";

    //a div for containing the top, middle, and bottom divs
    let heroProgressContainer = document.createElement('div');
    heroProgressContainer.id = 'hero-progress-container';
    heroProgressContainer.classList.add('hero-progress-container');
    heroProgressContent.appendChild(heroProgressContainer);

    //top div
    let heroProgressTop = document.createElement('div');
    heroProgressTop.id = 'hero-progress-top';
    heroProgressTop.classList.add('hero-progress-top');
    heroProgressContainer.appendChild(heroProgressTop);

    //header text div
    let heroProgressHeader = document.createElement('div');
    heroProgressHeader.id = 'hero-progress-header';
    heroProgressHeader.classList.add('hero-progress-header');
    heroProgressTop.appendChild(heroProgressHeader);

    let heroProgressTrailFX = document.createElement('img');
    heroProgressTrailFX.id = 'hero-progress-trail-fx';
    heroProgressTrailFX.classList.add('hero-progress-trail-fx');
    heroProgressTrailFX.src = './Assets/UI/TrailFX.png'; 
    heroProgressHeader.appendChild(heroProgressTrailFX);

    //header hero name text
    let heroProgressHeaderText = document.createElement('p');
    heroProgressHeaderText.id = 'hero-progress-header-text';
    heroProgressHeaderText.classList.add('hero-progress-header-text');
    heroProgressHeaderText.style.backgroundImage = `url('../Assets/UI/${nameColor}TxtTextureMain.png')`;
    // heroProgressHeaderText.classList.add('black-outline');
    heroProgressHeaderText.innerHTML = locJSON[hero];
    heroProgressHeader.appendChild(heroProgressHeaderText);

    //header hero name subtitle
    let heroProgressHeaderSubtitle = document.createElement('p');
    heroProgressHeaderSubtitle.id = 'hero-progress-header-subtitle';
    heroProgressHeaderSubtitle.classList.add('hero-progress-header-subtitle');
    heroProgressHeaderSubtitle.classList.add('subtitle-outline');
    heroProgressHeaderSubtitle.innerHTML = getLocValue(`${hero} Short Description`);
    heroProgressHeader.appendChild(heroProgressHeaderSubtitle);

    //middle div
    let heroProgressMiddle = document.createElement('div');
    heroProgressMiddle.id = 'hero-progress-middle';
    heroProgressMiddle.classList.add('hero-progress-middle');
    heroProgressContainer.appendChild(heroProgressMiddle);

    let heroPortraitLevelSelectBtns = document.createElement('div');
    heroPortraitLevelSelectBtns.id = 'hero-portrait-level-select-btns';
    heroPortraitLevelSelectBtns.classList.add('hero-portrait-level-select-btns');
    heroProgressMiddle.appendChild(heroPortraitLevelSelectBtns);

    updatePortraitLevelButtons(hero)

    //hero portrait div
    let heroPortraitDiv = document.createElement('div');
    heroPortraitDiv.id = 'hero-portrait-div';
    heroPortraitDiv.classList.add('hero-portrait-div');
    heroProgressMiddle.appendChild(heroPortraitDiv);

    //hero portrait img
    let heroPortraitImg = document.createElement('img');
    heroPortraitImg.id = 'hero-portrait-img';
    heroPortraitImg.classList.add('hero-portrait-img');
    heroPortraitImg.src = getHeroPortrait(hero, 1);
    heroPortraitDiv.appendChild(heroPortraitImg);

    //hero portrait bar
    let heroPortraitBar = document.createElement('div');
    heroPortraitBar.id = 'hero-portrait-bar';
    heroPortraitBar.classList.add('hero-portrait-bar');
    heroPortraitDiv.appendChild(heroPortraitBar);

    //hero portrait glow
    let heroPortraitGlow = document.createElement('div');
    heroPortraitGlow.id = 'hero-portrait-glow';
    heroPortraitGlow.classList.add('hero-portrait-glow');
    heroPortraitGlow.style.background = `radial-gradient(circle, rgb(${constants.HeroBGColors[hero][0] * 255},${constants.HeroBGColors[hero][1] * 255},${constants.HeroBGColors[hero][2] * 255}) 0%, transparent 70%)`
    // heroPortraitGlow.src = './Assets/UI/GlowUi.png';
    heroPortraitDiv.appendChild(heroPortraitGlow);

    //hero skins div
    let heroSkinsDiv = document.createElement('div');
    heroSkinsDiv.id = 'hero-skins-div';
    heroSkinsDiv.classList.add('hero-skins-div');
    heroProgressMiddle.appendChild(heroSkinsDiv);

    constants.heroSkins[hero].forEach((skin) => {
        console.log(`${skin}, ${btd6usersave.unlockedSkins[saveSkintoSkinMap[skin] || skin]}`)
        if ((btd6usersave.unlockedSkins[saveSkintoSkinMap[skin] || skin] == false || btd6usersave.unlockedSkins[saveSkintoSkinMap[skin] || skin] == null) && skin != hero) { return; }

        // || skin == hero

        let heroSkin = document.createElement('img');
        heroSkin.id = `${hero}-${skin}-skin`;
        heroSkin.classList.add('hero-skin');
        heroSkin.src = getHeroIconCircle(skin);
        heroSkin.addEventListener('click', () => {
            let colorToUse = constants.HeroBGColors[skin] ? constants.HeroBGColors[skin] : constants.HeroBGColors[hero];
            document.getElementById("hero-portrait-glow").style.background = `radial-gradient(circle, rgb(${colorToUse[0] * 255},${colorToUse[1] * 255},${colorToUse[2] * 255}) 0%, transparent 70%)`
            changeHexBGColor(colorToUse);
            changeHeroSkin(skin, hero == skin);
        })
        heroSkinsDiv.appendChild(heroSkin);
    })

    //bottom div
    let heroProgressBottom = document.createElement('div');
    heroProgressBottom.id = 'hero-progress-bottom';
    heroProgressBottom.classList.add('hero-progress-bottom');
    heroProgressContainer.appendChild(heroProgressBottom);

    //hero desc text
    let heroProgressDesc = document.createElement('p');
    heroProgressDesc.id = 'hero-progress-desc';
    heroProgressDesc.classList.add('hero-progress-desc');
    heroProgressDesc.innerHTML = getLocValue(`${hero} Description`);
    heroProgressBottom.appendChild(heroProgressDesc);

    //hero level descs div
    let heroLevelDescs = document.createElement('div');
    heroLevelDescs.id = 'hero-level-descs';
    heroLevelDescs.classList.add('hero-level-descs');
    heroProgressBottom.appendChild(heroLevelDescs);

    for (let i = 1; i<21; i++){
        let heroLevelDescDiv = document.createElement('div');
        heroLevelDescDiv.id = `hero-level-desc-div-${i}`;
        heroLevelDescDiv.classList.add('hero-level-desc-div');
        heroLevelDescs.appendChild(heroLevelDescDiv);

        let heroLevelDescIconDiv = document.createElement('div');
        heroLevelDescIconDiv.id = `hero-level-desc-icon-div-${i}`;
        heroLevelDescIconDiv.classList.add('hero-level-desc-icon-div');
        i == 20 ? heroLevelDescIconDiv.classList.add('hero-level-desc-image-purple') : constants.heroLevelIcons[hero].includes(i) ? heroLevelDescIconDiv.classList.add("hero-level-desc-image-gold")  : heroLevelDescIconDiv.classList.add('hero-level-desc-image');
        heroLevelDescDiv.appendChild(heroLevelDescIconDiv);

        let heroLevelDescText = document.createElement('p');
        heroLevelDescText.id = `hero-level-desc-text-${i}`;
        heroLevelDescText.classList.add('hero-level-desc-text');
        heroLevelDescText.classList.add('black-outline');
        heroLevelDescText.innerHTML = i;
        heroLevelDescIconDiv.appendChild(heroLevelDescText);

        // let heroLevelDescImage = document.createElement('img');
        // heroLevelDescImage.id = `hero-level-desc-image-${i}`;
        // switch (i){
        //     case 20:
        //         heroLevelDescImage.classList.add('hero-level-desc-image-purple');
        //         heroLevelDescImage.src = "./Assets/UI/HeroLevelBadge07.png"
        //         break;
        //     case constants.heroLevelIcons[hero].includes(i):
        //         heroLevelDescImage.classList.add('hero-level-desc-image-gold');
        //         heroLevelDescImage.src = "./Assets/UI/HeroLevelBadge06.png"
        //         break;
        //     default:
        //         heroLevelDescImage.classList.add('hero-level-desc-image');
        //         heroLevelDescImage.src = "./Assets/UI/HeroLevelBadge04.png"
        //         break;
        // }
        // heroLevelDescIconDiv.appendChild(heroLevelDescImage);

        let heroLevelDesc = document.createElement('p');
        heroLevelDesc.id = `hero-level-desc-${i}`;
        heroLevelDesc.classList.add('hero-level-desc');
        heroLevelDesc.innerHTML = getLocValue(`${hero} Level ${i} Description`);
        heroLevelDescDiv.appendChild(heroLevelDesc);
    }

    for (let selector of document.getElementsByClassName('hero-selector-highlight')){
        selector.style.display = "none";
    }
    document.getElementById(`${hero}-selector-highlight`).style.display = "block";

    return heroProgressContent;
}

function changeHeroSkin(skin, isOriginal){
    currentlySelectedHero = skin;
    let heroProgressHeaderSubtitle = document.getElementById('hero-progress-header-subtitle');
    heroProgressHeaderSubtitle.innerHTML = isOriginal ? getLocValue(`${skin} Short Description`) : getLocValue(`${skin}SkinName`);
    let heroProgressDesc = document.getElementById('hero-progress-desc');
    heroProgressDesc.innerHTML = isOriginal ? getLocValue(`${skin} Description`) : getLocValue(`${skin}SkinDescription`);
    changeHeroLevelPortrait(1);
}

function changeHeroLevelPortrait(level){
    let heroPortraitImg = document.getElementById('hero-portrait-img');
    heroPortraitImg.src = getSkinAssetPath(currentlySelectedHero, level);
    updatePortraitLevelButtons(currentlySelectedHero);
    for (let btn of document.getElementsByClassName('hero-level-select-btn')){
        btn.classList.remove('selected-level-btn');
    }
    document.getElementById(`${level}-level-select-btn`).classList.add('selected-level-btn');
}

function updatePortraitLevelButtons(hero){
    let heroPortraitLevelSelectBtns = document.getElementById('hero-portrait-level-select-btns');
    heroPortraitLevelSelectBtns.innerHTML = "";

    constants.HeroPortraitLevels[hero].forEach((level) => {
        if (level == "20SunGod" && !btd6usersave.acquiredUpgrades["True Sun God"]) { return; }
        if ((level == "20SunGodVengeful" || level == "20SunGodVengful") && !btd6usersave.achievementsClaimed.includes("Strangely Adorable")) { return; }
        let heroLevelSelectBtnDiv = document.createElement('div');
        heroLevelSelectBtnDiv.id = `${level}-level-select-div`;
        heroLevelSelectBtnDiv.classList.add('hero-level-select-div');
        heroPortraitLevelSelectBtns.appendChild(heroLevelSelectBtnDiv);

        let heroLevelSelectBtn = document.createElement('div');
        heroLevelSelectBtn.id = `${level}-level-select-btn`;
        heroLevelSelectBtn.classList.add('hero-level-select-btn');
        heroLevelSelectBtnDiv.appendChild(heroLevelSelectBtn);

        if(level == "20SunGod" || level == "20SunGodVengeful" || level == "20SunGodVengful") { 
            let heroLevelSelectImg = document.createElement('img');
            heroLevelSelectImg.id = `${level}-level-select-img`;
            heroLevelSelectImg.classList.add('hero-level-select-img');
            heroLevelSelectImg.src = level == "20SunGod" ? "./Assets/UI/BuffIconTrueSunGod5xx.png" : "./Assets/UI/BuffIconTrueSunGod555.png";
            heroLevelSelectBtnDiv.appendChild(heroLevelSelectImg);
        } else {
            let heroLevelSelectBtnText = document.createElement('p');
            heroLevelSelectBtnText.id = `${level}-level-select-text`;
            heroLevelSelectBtnText.classList.add('hero-level-select-text');
            heroLevelSelectBtnText.classList.add('black-outline');
            heroLevelSelectBtnText.innerHTML = level;
            heroLevelSelectBtnDiv.appendChild(heroLevelSelectBtnText);
        }
        heroLevelSelectBtnDiv.addEventListener('click', () => {
            changeHeroLevelPortrait(level);
        })
    })
    document.getElementById(`1-level-select-btn`).classList.add('selected-level-btn');
}

function generateKnowledgeProgress(){
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let knowledgeProgressContainer = document.createElement('div');
    knowledgeProgressContainer.id = 'knowledge-progress-container';
    knowledgeProgressContainer.classList.add('knowledge-progress-container');
    progressContent.appendChild(knowledgeProgressContainer);

    let recommendedKnowledgeContainerDiv = document.createElement('div');
    recommendedKnowledgeContainerDiv.id = 'recommended-knowledge-container-div';
    recommendedKnowledgeContainerDiv.classList.add('knowledge-progress-container-div');
    knowledgeProgressContainer.appendChild(recommendedKnowledgeContainerDiv);

    let recommendedKnowledgeHeader = document.createElement('p');
    recommendedKnowledgeHeader.id = 'left-column-header-text';
    recommendedKnowledgeHeader.classList.add('column-header-text');
    recommendedKnowledgeHeader.classList.add('black-outline');
    recommendedKnowledgeHeader.innerHTML = 'Recommended Knowledge Points';
    recommendedKnowledgeContainerDiv.appendChild(recommendedKnowledgeHeader);

    let recommendedKnowledgeDiv = document.createElement('div');
    recommendedKnowledgeDiv.id = 'recommended-knowledge-div';
    recommendedKnowledgeDiv.classList.add('knowledge-progress-div');
    recommendedKnowledgeContainerDiv.appendChild(recommendedKnowledgeDiv);

    let knowledgeProgressUnlockedContainerDiv = document.createElement('div');
    knowledgeProgressUnlockedContainerDiv.classList.add('knowledge-progress-container-div');
    knowledgeProgressContainer.appendChild(knowledgeProgressUnlockedContainerDiv);

    let knowledgeProgressUnlockedHeader = document.createElement('p');
    knowledgeProgressUnlockedHeader.id = 'right-column-header-text';
    knowledgeProgressUnlockedHeader.classList.add('column-header-text');
    knowledgeProgressUnlockedHeader.classList.add('black-outline');
    knowledgeProgressUnlockedHeader.innerHTML = 'Unlocked Knowledge Points';
    knowledgeProgressUnlockedContainerDiv.appendChild(knowledgeProgressUnlockedHeader);

    let knowledgeProgressUnlockedDiv = document.createElement('div');
    knowledgeProgressUnlockedDiv.id = 'knowledge-progress-unlocked-div';
    knowledgeProgressUnlockedDiv.classList.add('knowledge-progress-div');
    knowledgeProgressUnlockedContainerDiv.appendChild(knowledgeProgressUnlockedDiv);

    let knowledgeProgressLockedContainerDiv = document.createElement('div');
    knowledgeProgressLockedContainerDiv.classList.add('knowledge-progress-container-div');
    knowledgeProgressContainer.appendChild(knowledgeProgressLockedContainerDiv);

    let knowledgeProgressLockedHeader = document.createElement('p');
    knowledgeProgressLockedHeader.id = 'right-column-header-text';
    knowledgeProgressLockedHeader.classList.add('column-header-text');
    knowledgeProgressLockedHeader.classList.add('black-outline');
    knowledgeProgressLockedHeader.innerHTML = 'Locked Knowledge Points';
    knowledgeProgressLockedContainerDiv.appendChild(knowledgeProgressLockedHeader);

    let knowledgeProgressLockedDiv = document.createElement('div');
    knowledgeProgressLockedDiv.id = 'knowledge-progress-locked-div';
    knowledgeProgressLockedDiv.classList.add('knowledge-progress-div');
    knowledgeProgressLockedContainerDiv.appendChild(knowledgeProgressLockedDiv);

    for (let [knowledge, obtained] of Object.entries(btd6usersave.acquiredKnowledge)) {
        let knowledgeIconDiv = document.createElement('div');
        knowledgeIconDiv.id = `${knowledge}-icon-div`;
        knowledgeIconDiv.classList.add('knowledge-icon-div');
        obtained ? knowledgeProgressUnlockedDiv.appendChild(knowledgeIconDiv) : constants.RecommendedKnowledge.includes(knowledge) ? recommendedKnowledgeDiv.appendChild(knowledgeIconDiv) : knowledgeProgressLockedDiv.appendChild(knowledgeIconDiv);

        let knowledgeGlow = document.createElement('div');
        knowledgeGlow.id = `${knowledge}-glow`;
        // upgradeGlow.classList.add('upgrade-glow');
        knowledgeIconDiv.appendChild(knowledgeGlow);

        let knowledgeIcon = document.createElement('img');
        knowledgeIcon.id = `${knowledge}-icon`;
        knowledgeIcon.classList.add('knowledge-icon');
        knowledgeIcon.src = getKnowledgeAssetPath(knowledge);
        knowledgeIconDiv.appendChild(knowledgeIcon);

        knowledgeIconDiv.addEventListener('click', () => {
            onSelectKnowledgePoint(knowledge);
            Array.from(document.getElementsByClassName('knowledge-glow')).forEach((glow) => {
                glow.classList.remove('knowledge-glow');
            });
            knowledgeGlow.classList.add('knowledge-glow');
        })
    }

    if (recommendedKnowledgeDiv.innerHTML == "") {
        recommendedKnowledgeHeader.style.display = "none";
    }
    if (knowledgeProgressLockedDiv.innerHTML == "") {
        knowledgeProgressLockedHeader.style.display = "none";
    }
    if (knowledgeProgressUnlockedDiv.innerHTML == "") {
        knowledgeProgressUnlockedHeader.style.display = "none";
    }


    let tooltipContainerHelpMe = document.createElement('div');
    tooltipContainerHelpMe.id = 'tooltip-container-help-me';
    tooltipContainerHelpMe.classList.add('tooltip-container-help-me');
    knowledgeProgressContainer.appendChild(tooltipContainerHelpMe);

    let knowledgeProgressFloatingTooltip = document.createElement('div');
    knowledgeProgressFloatingTooltip.id = 'knowledge-progress-floating-tooltip';
    knowledgeProgressFloatingTooltip.classList.add('knowledge-progress-floating-tooltip');
    tooltipContainerHelpMe.appendChild(knowledgeProgressFloatingTooltip);

    let knowledgeNameText = document.createElement('p');
    knowledgeNameText.id = `knowledge-name-text`;
    knowledgeNameText.classList.add('knowledge-name-text');
    knowledgeNameText.classList.add('black-outline');
    // knowledgeNameText.innerHTML = getLocValue(knowledge);
    knowledgeProgressFloatingTooltip.appendChild(knowledgeNameText);

    let knowledgeDescText = document.createElement('p');
    knowledgeDescText.id = `knowledge-desc-text`;
    knowledgeDescText.classList.add('knowledge-desc-text');
    // knowledgeDescText.innerHTML = getLocValue(`${knowledge}Description`);
    knowledgeProgressFloatingTooltip.appendChild(knowledgeDescText);
}

function onSelectKnowledgePoint(knowledge){
    let knowledgeProgressFloatingTooltip = document.getElementById('knowledge-progress-floating-tooltip');
    knowledgeProgressFloatingTooltip.style.display = "block";

    let knowledgeNameText = document.getElementById('knowledge-name-text');
    knowledgeNameText.innerHTML = getLocValue(knowledge);

    let knowledgeDescText = document.getElementById('knowledge-desc-text');
    knowledgeDescText.innerHTML = getLocValue(`${knowledge}Description`);
}

function generateMapsProgress(){
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let mapsProgressHeaderBar = document.createElement('div');
    mapsProgressHeaderBar.id = 'maps-progress-header-bar';
    mapsProgressHeaderBar.classList.add('maps-progress-header-bar');
    progressContent.appendChild(mapsProgressHeaderBar);

    let mapsProgressViews = document.createElement('div');
    mapsProgressViews.id = 'maps-progress-views';
    mapsProgressViews.classList.add('maps-progress-views');
    mapsProgressHeaderBar.appendChild(mapsProgressViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.id = 'maps-progress-views-text';
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressViewsText.classList.add('black-outline');
    mapsProgressViewsText.innerHTML = "Display Type:";
    mapsProgressViews.appendChild(mapsProgressViewsText);

    let mapsProgressGrid = document.createElement('div');
    mapsProgressGrid.id = 'maps-progress-grid';
    mapsProgressGrid.classList.add('maps-progress-view');
    mapsProgressGrid.classList.add('black-outline')
    mapsProgressGrid.classList.add('maps-progress-view-selected');
    mapsProgressGrid.innerHTML = "Grid";
    mapsProgressGrid.addEventListener('click', () => {
        onChangeMapView("grid");
    })
    mapsProgressViews.appendChild(mapsProgressGrid);

    let mapsProgressList = document.createElement('div');
    mapsProgressList.id = 'maps-progress-list';
    mapsProgressList.classList.add('maps-progress-view');
    mapsProgressList.classList.add('black-outline')
    mapsProgressList.innerHTML = "List";
    mapsProgressList.addEventListener('click', () => {
        onChangeMapView("list");
    })
    mapsProgressViews.appendChild(mapsProgressList);

    let mapsProgressGame = document.createElement('div');
    mapsProgressGame.id = 'maps-progress-game';
    mapsProgressGame.classList.add('maps-progress-view');
    mapsProgressGame.classList.add('black-outline')
    mapsProgressGame.innerHTML = "Game";
    mapsProgressGame.addEventListener('click', () => {
        onChangeMapView("game");
    })
    mapsProgressViews.appendChild(mapsProgressGame);


    let mapsProgressFilter = document.createElement('div');
    mapsProgressFilter.id = 'maps-progress-filter';
    mapsProgressFilter.classList.add('maps-progress-filter');
    mapsProgressHeaderBar.appendChild(mapsProgressFilter);

    let mapProgressFilterDifficulty = document.createElement('div');
    mapProgressFilterDifficulty.id = 'map-progress-filter-difficulty';
    mapProgressFilterDifficulty.classList.add('map-progress-filter-difficulty');
    mapsProgressFilter.appendChild(mapProgressFilterDifficulty);

    let mapsProgressFilterDifficultyText = document.createElement('p');
    mapsProgressFilterDifficultyText.id = 'maps-progress-filter-difficulty-text';
    mapsProgressFilterDifficultyText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressFilterDifficultyText.classList.add('black-outline');
    mapsProgressFilterDifficultyText.innerHTML = "Filter Difficulty:";
    mapProgressFilterDifficulty.appendChild(mapsProgressFilterDifficultyText);

    let mapProgressFilterDifficultySelect = document.createElement('select');
    mapProgressFilterDifficultySelect.id = 'map-progress-filter-difficulty-select';
    mapProgressFilterDifficultySelect.classList.add('map-progress-filter-difficulty-select');
    mapProgressFilterDifficultySelect.addEventListener('change', () => {
        console.log(mapProgressFilterDifficultySelect.value);
        onChangeDifficultyFilter(mapProgressFilterDifficultySelect.value);
    })
    let options = ["All","Beginner","Intermediate","Advanced","Expert"]
    options.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect.appendChild(difficultyOption);
    })
    mapProgressFilterDifficulty.appendChild(mapProgressFilterDifficultySelect);

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.id = 'maps-progress-coop-toggle';
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    mapsProgressFilter.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.id = 'maps-progress-coop-toggle-text';
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressCoopToggleText.classList.add('black-outline');
    mapsProgressCoopToggleText.innerHTML = "Co-op: ";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.id = 'maps-progress-coop-toggle-input';
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggleInput.addEventListener('change', () => {
        onChangeCoopToggle(mapsProgressCoopToggleInput.checked);
    })
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);


    let mapsProgressContainer = document.createElement('div');
    mapsProgressContainer.id = 'maps-progress-container';
    mapsProgressContainer.classList.add('maps-progress-container');
    progressContent.appendChild(mapsProgressContainer);

    let mapProgressContainer = document.createElement('div');
    mapProgressContainer.id = 'map-progress-container';
    mapProgressContainer.classList.add('map-progress-container');
    progressContent.appendChild(mapProgressContainer);

    onChangeMapView("grid");
}
let currentMapView = "grid";
let coopEnabled = false;
let currentDifficultyFilter = "All";
function onChangeMapView(view){
    switch(view){
        case "grid":
            currentMapView = "grid";
            generateMapsGridView(coopEnabled);
            break;
        case "list":
            currentMapView = "list";
            generateMapsListView(coopEnabled);
            break;
        case "game":
            currentMapView = "game";
            //generateMapsGameView(coopEnabled);
            break;
    }
}

function onChangeCoopToggle(coop){
    coopEnabled = coop;
    document.getElementById('maps-progress-coop-toggle-input').checked = coop;
    switch(currentMapView) {
        case "grid":
            generateMapsGridView();
            break;
        case "list":
            //generateMapsListView(coopEnabled);
            break;
        case "game":
            //generateMapsGameView(coopEnabled);
            break;
    }
}

function onChangeDifficultyFilter(difficulty){
    currentDifficultyFilter = difficulty;
    switch(currentMapView) {
        case "grid":
            generateMapsGridView();
            break;
        case "list":
            //generateMapsListView(difficulty);
            break;
        case "game":
            //generateMapsGameView(difficulty);
            break;
    }
}

function onSelectMap(map){
    document.getElementById('maps-progress-container').style.display = "none";
    document.getElementById('maps-progress-header-bar').style.display = "none";
    document.getElementById('map-progress-container').style.display = "flex";
    generateMapDetails(map);
}

function onExitMap(){
    document.getElementById('map-progress-container').style.display = "none";
    document.getElementById('maps-progress-header-bar').style.display = "flex";
    document.getElementById('maps-progress-container').style.display = "block";
}

function generateMapDetails(map){
    let mapProgressContainer = document.getElementById('map-progress-container');
    mapProgressContainer.innerHTML = "";

    let mapProgressHeaderBar = document.createElement('div');
    mapProgressHeaderBar.id = 'map-progress-header-bar';
    mapProgressHeaderBar.classList.add('single-map-progress-header-bar');
    mapProgressContainer.appendChild(mapProgressHeaderBar);

    let mapNextAndPrev = document.createElement('div');
    mapNextAndPrev.id = 'map-next-and-prev';
    mapNextAndPrev.classList.add('map-next-and-prev');
    mapProgressHeaderBar.appendChild(mapNextAndPrev);

    let mapProgressPrevBtn = document.createElement('div');
    mapProgressPrevBtn.id = 'map-progress-prev-btn';
    mapProgressPrevBtn.classList.add('maps-progress-view');
    mapProgressPrevBtn.classList.add('black-outline');
    mapProgressPrevBtn.innerHTML = "Previous";
    mapProgressPrevBtn.addEventListener('click', () => {
        let maps = Object.keys(constants.mapsInOrder).filter(value => Object.keys(btd6usersave.mapProgress).includes(value));; //Object.keys(constants.mapsInOrder);
        if (maps.indexOf(map) == 0) {
            onSelectMap(maps[maps.length - 1]);
        } else {
            onSelectMap(maps[maps.indexOf(map) - 1])
        }
    })
    mapNextAndPrev.appendChild(mapProgressPrevBtn);

    let mapProgressNextBtn = document.createElement('div');
    mapProgressNextBtn.id = 'map-progress-next-btn';
    mapProgressNextBtn.classList.add('maps-progress-view');
    mapProgressNextBtn.classList.add('black-outline');
    mapProgressNextBtn.innerHTML = "Next";
    mapProgressNextBtn.addEventListener('click', () => {
        let maps = Object.keys(constants.mapsInOrder).filter(value => Object.keys(btd6usersave.mapProgress).includes(value));; //Object.keys(constants.mapsInOrder);
        if (maps.indexOf(map) == maps.length - 1) {
            onSelectMap(maps[0]);
        } else {
            onSelectMap(maps[maps.indexOf(map) + 1])
        }
    })
    mapNextAndPrev.appendChild(mapProgressNextBtn);

    let mapProgressExitBtn = document.createElement('div');
    mapProgressExitBtn.id = 'map-progress-exit-btn';
    mapProgressExitBtn.classList.add('maps-progress-view');
    mapProgressExitBtn.classList.add('black-outline');
    mapProgressExitBtn.innerHTML = "Exit";
    mapProgressExitBtn.addEventListener('click', () => {
        onExitMap();
    })
    mapProgressHeaderBar.appendChild(mapProgressExitBtn);

    let mapBelowHeaderBar = document.createElement('div');
    mapBelowHeaderBar.id = 'map-below-header-bar';
    mapBelowHeaderBar.classList.add('map-below-header-bar');
    mapProgressContainer.appendChild(mapBelowHeaderBar);

    let mapLeftColumn = document.createElement('div');
    mapLeftColumn.id = 'map-left-column';
    mapLeftColumn.classList.add('map-left-column');
    mapBelowHeaderBar.appendChild(mapLeftColumn);

    let mapNameAndIcon = document.createElement('div');
    mapNameAndIcon.id = 'map-progress-div';
    mapNameAndIcon.classList.add('map-progress-div');
    mapLeftColumn.appendChild(mapNameAndIcon);

    let mapNameTop = document.createElement('div');
    mapNameTop.id = 'map-name-top';
    mapNameTop.classList.add('map-name-top');
    mapNameAndIcon.appendChild(mapNameTop);

    //difficulty icon
    let mapDifficultyIcon = document.createElement('img');
    mapDifficultyIcon.id = 'map-difficulty-icon';
    mapDifficultyIcon.classList.add('map-difficulty-icon');
    mapDifficultyIcon.src = `./Assets/DifficultyIcon/Map${constants.mapsInOrder[map]}Btn.png`;
    mapNameTop.appendChild(mapDifficultyIcon);

    let mapNameAndMedals = document.createElement('div');
    mapNameAndMedals.id = 'map-name-and-medals';
    mapNameAndMedals.classList.add('map-name-and-medals');
    mapNameTop.appendChild(mapNameAndMedals);
    //map name
    let mapName = document.createElement('p');
    mapName.id = 'map-name';
    mapName.classList.add('map-name-large');
    mapName.classList.add('black-outline');
    mapName.innerHTML = getLocValue(map);
    mapNameAndMedals.appendChild(mapName);
    //map progress single
    let mapProgressSingle = document.createElement('div');
    mapProgressSingle.id = 'map-progress-single';
    mapProgressSingle.classList.add('map-progress-subtext');
    mapProgressSingle.innerHTML = `${Object.values(processedMapData.Medals.single[map]).filter(a=>a==true).length}/15 Single Player Medals`;
    mapNameAndMedals.appendChild(mapProgressSingle);

    //map progress coop
    let mapProgressCoop = document.createElement('div');
    mapProgressCoop.id = 'map-progress-coop';
    mapProgressCoop.classList.add('map-progress-subtext');
    mapProgressCoop.innerHTML = `${Object.values(processedMapData.Medals.coop[map]).filter(a=>a==true).length}/15 Coop Medals`;
    mapNameAndMedals.appendChild(mapProgressCoop);

    //map icon with border
    let mapIcon = document.createElement('img');
    mapIcon.id = 'map-icon';
    mapIcon.classList.add('map-icon');
    mapIcon.src = getMapIcon(map);
    mapNameAndIcon.appendChild(mapIcon);

    //single medals 5x3
    let mapProgressSingleMedals = document.createElement('div');
    mapProgressSingleMedals.id = 'map-progress-single-medals';
    mapProgressSingleMedals.classList.add('map-progress-medals');
    mapLeftColumn.appendChild(mapProgressSingleMedals);

    switch(processedMapData.Borders["single"][map]) {
        case "None":
            mapProgressSingleMedals.classList.add('none-border');
            break;
        case "Bronze":
            mapProgressSingleMedals.classList.add('bronze-border');
            break;
        case "Silver":
            mapProgressSingleMedals.classList.add('silver-border');
            break;
        case "Gold":
            mapProgressSingleMedals.classList.add('gold-border');
            break;
        case "Black":
            mapProgressSingleMedals.classList.add('black-border');
            break;
    }

    for (let [difficulty, completed] of Object.entries(processedMapData.Medals.single[map])) {
        if (completed == null) { continue; }
        let medalDiv = document.createElement('div');
        medalDiv.id = `${difficulty}-div`;
        medalDiv.classList.add('medal-div');
        mapProgressSingleMedals.appendChild(medalDiv);

        let medalImg = document.createElement('img');
        medalImg.id = `${difficulty}-img`;
        medalImg.classList.add('medal-img');
        medalImg.src = getMedalIcon(completed ? `Medal${medalMap[difficulty]}` : "MedalEmpty");
        medalImg.style.display = "none";
        medalImg.addEventListener('load', () => {
            if(medalImg.width < medalImg.height){
                medalImg.style.width = `${ratioCalc(3,70,256,0,medalImg.width)}px`
            } else {
                medalImg.style.height = `${ratioCalc(3,70,256,0,medalImg.height)}px`
            }
            medalImg.style.removeProperty('display');
        })
        medalDiv.appendChild(medalImg);
    }

    //coop medals 5x3
    let mapProgressCoopMedals = document.createElement('div');
    mapProgressCoopMedals.id = 'map-progress-coop-medals';
    mapProgressCoopMedals.classList.add('map-progress-medals');
    mapLeftColumn.appendChild(mapProgressCoopMedals);

    for (let [difficulty, completed] of Object.entries(processedMapData.Medals.coop[map])) {
        if (completed == null) { continue; }
        let medalDiv = document.createElement('div');
        medalDiv.id = `${difficulty}-div`;
        medalDiv.classList.add('medal-div');
        mapProgressCoopMedals.appendChild(medalDiv);

        let medalImg = document.createElement('img');
        medalImg.id = `${difficulty}-img`;
        medalImg.classList.add('medal-img');
        medalImg.src = getMedalIcon(completed ? `Medal${medalMap[difficulty]}` : "MedalCoopEmpty");
        medalImg.style.display = "none";
        medalImg.addEventListener('load', () => {
            if(medalImg.width < medalImg.height){
                medalImg.style.width = `${ratioCalc(3,70,256,0,medalImg.width)}px`
            } else {
                medalImg.style.height = `${ratioCalc(3,70,256,0,medalImg.height)}px`
            }
            medalImg.style.removeProperty('display');
        })
        medalDiv.appendChild(medalImg);
    }

    switch(processedMapData.Borders["coop"][map]) {
        case "None":
            mapProgressCoopMedals.classList.add('coop-border');
            break;
        case "Bronze":
            mapProgressCoopMedals.classList.add('bronze-border');
            break;
        case "Silver":
            mapProgressCoopMedals.classList.add('silver-border');
            break;
        case "Gold":
            mapProgressCoopMedals.classList.add('gold-border');
            break;
        case "Black":
            mapProgressCoopMedals.classList.add('black-border');
            break;
    }

    let mapRightColumn = document.createElement('div');
    mapRightColumn.id = 'map-right-column';
    mapRightColumn.classList.add('map-right-column');
    mapBelowHeaderBar.appendChild(mapRightColumn);

    
    //Stats
    let rightColumnHeader = document.createElement('div');
    rightColumnHeader.id = 'right-column-header';
    rightColumnHeader.classList.add('right-column-header');
    mapRightColumn.appendChild(rightColumnHeader);

    let rightColumnHeaderText = document.createElement('p');
    rightColumnHeaderText.id = 'right-column-header-text';
    rightColumnHeaderText.classList.add('column-header-text');
    rightColumnHeaderText.classList.add('black-outline');
    rightColumnHeaderText.innerHTML = 'Mode Stats';
    rightColumnHeader.appendChild(rightColumnHeaderText);

    let mapProgressCoopToggle = document.createElement('div');
    mapProgressCoopToggle.id = 'maps-progress-coop-toggle';
    mapProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    rightColumnHeader.appendChild(mapProgressCoopToggle);

    let mapProgressCoopToggleText = document.createElement('p');
    mapProgressCoopToggleText.id = 'maps-progress-coop-toggle-text';
    mapProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text');
    mapProgressCoopToggleText.classList.add('black-outline');
    mapProgressCoopToggleText.innerHTML = "Co-op: ";
    mapProgressCoopToggle.appendChild(mapProgressCoopToggleText);

    let mapProgressCoopToggleInput = document.createElement('input');
    mapProgressCoopToggleInput.id = 'maps-progress-coop-toggle-input';
    mapProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapProgressCoopToggleInput.type = 'checkbox';
    mapProgressCoopToggleInput.addEventListener('change', () => {
        onChangeCoopToggle(mapProgressCoopToggleInput.checked);
        generateMapRightColStats(map, coopEnabled)
    })
    mapProgressCoopToggleInput.checked = coopEnabled;
    mapProgressCoopToggle.appendChild(mapProgressCoopToggleInput);



    let mapStatsContainer = document.createElement('div');
    mapStatsContainer.id = 'map-stats-container';
    mapStatsContainer.classList.add('map-stats-container');
    mapRightColumn.appendChild(mapStatsContainer);

    generateMapRightColStats(map, coopEnabled);
}

function generateMapRightColStats(map,coop){
    let mapStatsContainer = document.getElementById('map-stats-container');
    mapStatsContainer.innerHTML = "";

    for (let [difficulty, data] of Object.entries(coop ? processedMapData.Maps[map].coop : processedMapData.Maps[map].single)) {
        if (data == undefined) { continue; }
        let mapStatsDiv = document.createElement('div');
        mapStatsDiv.id = `${difficulty}-div`;
        mapStatsDiv.classList.add('map-stats-div');
        mapStatsContainer.appendChild(mapStatsDiv);

        let mapStatsIcon = document.createElement('img');
        mapStatsIcon.id = `${difficulty}-icon`;
        mapStatsIcon.classList.add('map-stats-icon');
        mapStatsIcon.src = getModeIcon(difficulty);
        mapStatsDiv.appendChild(mapStatsIcon);

        let mapStatsTextDiv = document.createElement('div');
        mapStatsTextDiv.id = `${difficulty}-text-div`;
        mapStatsTextDiv.classList.add('map-stats-text-div');
        mapStatsDiv.appendChild(mapStatsTextDiv);

        let mapStatsDifficultyText = document.createElement('p');
        mapStatsDifficultyText.id = `${difficulty}-text`;
        mapStatsDifficultyText.classList.add('map-stats-text-mode');
        mapStatsDifficultyText.classList.add('black-outline');
        mapStatsDifficultyText.innerHTML = getLocValue(`Mode ${difficulty}`);
        mapStatsTextDiv.appendChild(mapStatsDifficultyText);

        let mapStatsText = document.createElement('p');
        mapStatsText.id = `${difficulty}-text`;
        mapStatsText.classList.add('map-stats-text');
        mapStatsText.innerHTML = `Times Completed: ${data.timesCompleted}`;
        mapStatsTextDiv.appendChild(mapStatsText);

        let mapStatsBestRound = document.createElement('p');
        mapStatsBestRound.id = `${difficulty}-best-round`;
        mapStatsBestRound.classList.add('map-stats-text');
        mapStatsBestRound.innerHTML = `Best Round: ${data.bestRound}`;
        mapStatsTextDiv.appendChild(mapStatsBestRound);
    }

    if (mapStatsContainer.innerHTML == "") {
        let noDataFound = document.createElement('p');
        noDataFound.id = 'no-data-found';
        noDataFound.classList.add('no-data-found');
        noDataFound.classList.add('black-outline');
        noDataFound.innerHTML = "No Data Found.";
        mapStatsContainer.appendChild(noDataFound);
    }
}

function generateMapsGridView(){
    let mapsProgressContainer = document.getElementById('maps-progress-container');
    mapsProgressContainer.innerHTML = "";

    let mapsGridContainer = document.createElement('div');
    mapsGridContainer.id = 'maps-grid-container';
    mapsGridContainer.classList.add('maps-grid-container');
    mapsProgressContainer.appendChild(mapsGridContainer);

    for (let [map, difficulty] of Object.entries(constants.mapsInOrder)) {
        if (!_btd6usersave.parameters.mapProgress.default.allowed.includes(map)) { continue; }
        if (processedMapData.Borders[coopEnabled ? "coop" : "single"][map] == null) { continue; }
        if (currentDifficultyFilter != "All" && difficulty != currentDifficultyFilter) { continue; }


        let mapDiv = document.createElement('div');
        mapDiv.id = `${map}-div`;
        mapDiv.classList.add('map-div');
        switch(processedMapData.Borders[coopEnabled ? "coop" : "single"][map]) {
            case "None":
                coopEnabled ? mapDiv.classList.add('coop-border') : mapDiv.classList.add('none-border');
                break;
            case "Bronze":
                mapDiv.classList.add('bronze-border');
                break;
            case "Silver":
                mapDiv.classList.add('silver-border');
                break;
            case "Gold":
                mapDiv.classList.add('gold-border');
                break;
            case "Black":
                mapDiv.classList.add('black-border');
                break;
        }
        mapsGridContainer.appendChild(mapDiv);

        let mapImg = document.createElement('img');
        mapImg.id = `${map}-img`;
        mapImg.classList.add('map-img');
        mapImg.src = getMapIcon(map);
        mapDiv.appendChild(mapImg);

        let mapName = document.createElement('p');
        mapName.id = `${map}-name`;
        mapName.classList.add(`map-name`);
        mapName.classList.add('black-outline');
        mapName.innerHTML = getLocValue(map);
        mapDiv.appendChild(mapName);

        let mapProgress = document.createElement('div');
        mapProgress.id = `${map}-progress`;
        mapProgress.classList.add(`map-progress`);
        mapDiv.appendChild(mapProgress);

        mapDiv.addEventListener('click', () => {
            onSelectMap(map);
        })
    }
}

function generateMapsListView(){
    let mapsProgressContainer = document.getElementById('maps-progress-container');
    mapsProgressContainer.innerHTML = "";

    let mapsListContainer = document.createElement('div');
    mapsListContainer.id = 'maps-list-container';
    mapsListContainer.classList.add('maps-list-container');
    mapsProgressContainer.appendChild(mapsListContainer);

    let colorToggle = false;
    for (let [map, difficulty] of Object.entries(constants.mapsInOrder)) {
        if (!_btd6usersave.parameters.mapProgress.default.allowed.includes(map)) { continue; }
        if (processedMapData.Borders[coopEnabled ? "coop" : "single"][map] == null) { continue; }
        if (currentDifficultyFilter != "All" && difficulty != currentDifficultyFilter) { continue; }

        let mapContainer = document.createElement('div');
        mapContainer.id = `${map}-container`;
        mapContainer.classList.add('map-container');
        colorToggle ? mapContainer.style.backgroundColor = "var(--profile-secondary)" : mapContainer.style.backgroundColor = "var(--profile-tertiary)"; ;
        colorToggle = !colorToggle;
        mapsListContainer.appendChild(mapContainer);

        let mapDiv = document.createElement('div');
        mapDiv.id = `${map}-div`;
        mapDiv.classList.add('map-div');
        switch(processedMapData.Borders[coopEnabled ? "coop" : "single"][map]) {
            case "None":
                coopEnabled ? mapDiv.classList.add('coop-border') : mapDiv.classList.add('none-border');
                break;
            case "Bronze":
                mapDiv.classList.add('bronze-border');
                break;
            case "Silver":
                mapDiv.classList.add('silver-border');
                break;
            case "Gold":
                mapDiv.classList.add('gold-border');
                break;
            case "Black":
                mapDiv.classList.add('black-border');
                break;
        }
        mapContainer.appendChild(mapDiv);

        let mapImg = document.createElement('img');
        mapImg.id = `${map}-img`;
        mapImg.classList.add('map-img');
        mapImg.src = getMapIcon(map);
        mapDiv.appendChild(mapImg);

        let mapName = document.createElement('p');
        mapName.id = `${map}-name`;
        mapName.classList.add(`map-name`);
        mapName.classList.add('black-outline');
        mapName.innerHTML = getLocValue(map);
        mapDiv.appendChild(mapName);

        let mapSections = document.createElement('div');
        mapSections.id = `${map}-sections`;
        mapSections.classList.add(`map-sections`);
        mapContainer.appendChild(mapSections);

        let mapSection = document.createElement('div');
        mapSection.id = `${map}-section`;
        mapSection.classList.add(`map-section`);
        mapSections.appendChild(mapSection);

        let mapLabelMedals = document.createElement('p');
        mapLabelMedals.id = `${map}-label-medals`;
        mapLabelMedals.classList.add(`map-label-medals`);
        mapLabelMedals.classList.add('black-outline');
        // mapLabelMedals.innerHTML = "Medals:";
        mapSection.appendChild(mapLabelMedals);

        let mapLabelBestRound = document.createElement('p');
        mapLabelBestRound.id = `${map}-label-best-round`;
        mapLabelBestRound.classList.add(`map-label-rounds`);
        mapLabelBestRound.classList.add('black-outline');
        mapLabelBestRound.innerHTML = "Best Round:";
        mapSection.appendChild(mapLabelBestRound);

        let mapLabelTimesCompleted = document.createElement('p');
        mapLabelTimesCompleted.id = `${map}-label-times-completed`;
        mapLabelTimesCompleted.classList.add(`map-label-completed`);
        mapLabelTimesCompleted.classList.add('black-outline');
        mapLabelTimesCompleted.innerHTML = "Times Completed:";
        mapSection.appendChild(mapLabelTimesCompleted);

        for (let [difficulty, data] of Object.entries(coopEnabled ? processedMapData.Maps[map].coop : processedMapData.Maps[map].single)) {
            if (data == undefined) { continue; }
            let mapSectionColumn = document.createElement('div');
            mapSectionColumn.id = `${map}-${difficulty}-column`;
            mapSectionColumn.classList.add(`map-section-column`);
            mapSections.appendChild(mapSectionColumn);

            let mapSectionMedal = document.createElement('div');
            mapSectionMedal.id = `${map}-${difficulty}-medal`;
            mapSectionMedal.classList.add(`map-section-medal`);
            mapSectionColumn.appendChild(mapSectionMedal);

            let mapSectionMedalImg = document.createElement('img');
            mapSectionMedalImg.id = `${map}-${difficulty}-medal-img`;
            mapSectionMedalImg.classList.add(`map-section-medal-img`);
            mapSectionMedalImg.src = getMedalIcon(data.bestRound == 0 ? "MedalEmpty" : `Medal${medalMap[difficulty]}`);
            mapSectionMedalImg.style.display = "none";
            mapSectionMedalImg.addEventListener('load', () => {
                if(mapSectionMedalImg.width < mapSectionMedalImg.height){
                    mapSectionMedalImg.style.width = `${ratioCalc(3,70,256,0,mapSectionMedalImg.width)}px`
                } else {
                    mapSectionMedalImg.style.height = `${ratioCalc(3,70,256,0,mapSectionMedalImg.height)}px`
                }
                mapSectionMedalImg.style.removeProperty('display');
            })
            mapSectionMedal.appendChild(mapSectionMedalImg);

            let mapSectionBestRound = document.createElement('p');
            mapSectionBestRound.id = `${map}-${difficulty}-best-round`;
            mapSectionBestRound.classList.add(`map-section-text`);
            mapSectionBestRound.classList.add('black-outline');
            mapSectionBestRound.innerHTML = data.bestRound;
            mapSectionColumn.appendChild(mapSectionBestRound);

            let mapSectionTimesCompleted = document.createElement('p');
            mapSectionTimesCompleted.id = `${map}-${difficulty}-times-completed`;
            mapSectionTimesCompleted.classList.add(`map-section-text`);
            mapSectionTimesCompleted.classList.add('black-outline');
            mapSectionTimesCompleted.innerHTML = data.timesCompleted;
            mapSectionColumn.appendChild(mapSectionTimesCompleted);
        }

        mapDiv.addEventListener('click', () => {
            onSelectMap(map);
        })
    }
}

function changeHexBGColor(color){
    if (color == null) { 
        document.body.style.removeProperty("background-color")
        return; 
    }
    document.body.style.backgroundColor = `rgb(${color[0] * 255},${color[1] * 255},${color[2] * 255})`;
}

function ratioCalc(unknown, x1, x2, y1, y2){
    switch(unknown){
        case 1:
            // x1/x2 == y1/y2
            return x2 * (y1/y2)
        case 2:
            // x1/x2 == y1/y2
            return x1 * (y2/y1)
        case 3:
            // x1/x2 == y1/y2
            return y2 * (x1/x2)
        case 4:
            // x1/x2 == y1/y2
            return y1 * (x2/x1)
    }
}

