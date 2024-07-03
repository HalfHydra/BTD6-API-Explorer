let readyFlags = [0,0,0,0,0]
let pressedStart = false;
// let isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
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

let allHeroesShown = false;
let allTowersShown = false;

let currentMapView = "grid";
let coopEnabled = false;
let currentDifficultyFilter = "All";
let mapPage = 0;

let currentInstaView = "game";

let currentAchievementFilter = "game";
let currentAchievementRewardFilter = "None";

let processedInstaData = {
    "TowerTotal": {},
    "TowerTierTotals": {},
    "TowerMissingByTier": {},
    "TowerBorders": {}
}

let timerInterval = null;

let rulesMap = {
    "Monkey Knowledge Disabled": "NoKnowledgeIcon",
    "No Lives Lost": "NoLivesLostIcon",
    "Selling Disabled": "SellingDisabledIcon",
    "Powers Disabled": "PowersDisabledIcon",
    "No Continues": "NoContinuesIcon",
    "All Camo": "AllCamoIcon",
    "All Regrow": "AllRegenIcon",
    "Double Cash Disabled": "NoDoubleCashIcon",
    "No Round 100 Reward": "NoInstaMonkeys",
    "Custom Rounds": "CustomRoundIcon",
    "Paragon Limit": "ParagonLimitIcon"
}

let showElite = false;

let currentBrowserView = "grid";

let currentRoundsetView = "Simple";
let roundsetProcessed = null;
let currentPreviewRound = 0;
let currentIndexInModifiedRounds = 0;
let previewActive = false;
let previewModified = null;
let currentModifiedRounds = []

fetch('./data/Constants.json')
        .then(response => response.json())
        .then(data => {
            constants = data;
            readyFlags[4] = 1
            generateIfReady()
            generateVersionInfo()
        })
        .catch(error => console.error('Error:', error));

function fetchDependencies(){
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
    showLoading();
    generateIfReady()
}

function generateIfReady(){
    if (readyFlags.every(flag => flag === 1)){
        document.getElementById("front-page").style.display = "none";
        document.body.classList.add('transition-bg')
        generateHeaderTabs();
        generateRankInfo()
        generateVeteranRankInfo()
        generateAchievementsHelper()
        generateStats()
        generateMedals()
        generateExtras()
        generateInstaData()
        generateMapData()
        generateProgressSubText()
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
    profileStats["Monkeys Placed"] = btd6publicprofile.gameplay["monkeysPlaced"];
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
    profileStats["DDTs Popped"] = btd6publicprofile.bloonsPopped["ddtsPopped"];
    profileStats["BADs Popped"] = btd6publicprofile.bloonsPopped["badsPopped"];
    profileStats["Bloons Leaked"] = btd6publicprofile.bloonsPopped["bloonsLeaked"];
    profileStats["Cash Generated"] = btd6publicprofile.gameplay["cashEarned"];
    profileStats["Cash Gifted"] = btd6publicprofile.gameplay["coopCashGiven"];
    profileStats["Abilities Used"] = btd6publicprofile.gameplay["abilitiesUsed"];
    profileStats["Powers Used"] = btd6publicprofile.gameplay["powersUsed"];
    profileStats["Insta Monkeys Used"] = btd6publicprofile.gameplay["instaMonkeysUsed"];
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
    profileStats["Most Experienced Monkey"] = getLocValue(profileStats["Most Experienced Monkey"]);
    profileStats["Insta Monkey Collection"] = `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
    profileStats["Collection Chests Opened"] = btd6publicprofile.gameplay["collectionChestsOpened"];
    profileStats["Golden Bloons Popped"] = btd6publicprofile.bloonsPopped["goldenBloonsPopped"];
    profileStats["Monkey Teams Wins"] = btd6publicprofile.gameplay["monkeyTeamsWins"];
    profileStats["Bosses Popped"] = btd6publicprofile.bloonsPopped["bossesPopped"];
    profileStats["Damage Done To Bosses"] = btd6publicprofile.gameplay["damageDoneToBosses"];

    //stats from usersave
    profileStats["Daily Challenges Completed"] = btd6usersave["totalDailyChallengesCompleted"];
    profileStats["Consecutive DCs Completed"] = btd6usersave["consecutiveDailyChallengesCompleted"];
    profileStats["Race Attempts"] = btd6usersave["totalRacesEntered"];
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
    medalsInOrder["PhayzeEliteBadge"] = btd6publicprofile["bossBadgesElite"]["Phayze"] || 0;
    medalsInOrder["PhayzeBadge"] = btd6publicprofile["bossBadgesNormal"]["Phayze"] || 0;
    medalsInOrder["DreadbloonEliteBadge"] = btd6publicprofile["bossBadgesElite"]["Dreadbloon"] || 0;
    medalsInOrder["DreadbloonBadge"] = btd6publicprofile["bossBadgesNormal"]["Dreadbloon"] || 0;
    medalsInOrder["VortexEliteBadge"] = btd6publicprofile["bossBadgesElite"]["Vortex"] || 0;
    medalsInOrder["VortexBadge"] = btd6publicprofile["bossBadgesNormal"]["Vortex"] || 0;
    medalsInOrder["LychEliteBadge"] = btd6publicprofile["bossBadgesElite"]["Lych"] || 0;
    medalsInOrder["LychBadge"] = btd6publicprofile["bossBadgesNormal"]["Lych"] || 0;
    medalsInOrder["BloonariusEliteBadge"] = btd6publicprofile["bossBadgesElite"]["Bloonarius"] || 0;
    medalsInOrder["BloonariusBadge"] = btd6publicprofile["bossBadgesNormal"]["Bloonarius"] || 0;
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
    //but in the mean time now we can do this:
    extrasUnlocked["Small Bosses"] = btd6usersave.achievementsClaimed.includes("25 to Life");
}

function generateProgressSubText(){
    let towersCount = Object.keys(btd6usersave.unlockedTowers).filter(k => btd6usersave.unlockedTowers[k]).length;
    progressSubText["Towers"] = `${towersCount}/${Object.keys(btd6usersave.unlockedTowers).length} Towers Unlocked`;
    let upgrades = Object.keys(btd6usersave.acquiredUpgrades);
    let upgradesUnlocked = upgrades.filter(k => btd6usersave.acquiredUpgrades[k]);
    progressSubText["Upgrades"] = `${upgradesUnlocked.length}/${upgrades.length} Upgrades Unlocked`;
    let paragons = upgrades.filter(k => k.includes("Paragon"));
    let paragonsUnlocked = paragons.filter(k => btd6usersave.acquiredUpgrades[k]);
    if (paragonsUnlocked.length > 0) { progressSubText["Paragons"] = `${paragonsUnlocked.length}/${paragons.length} Paragon${paragonsUnlocked.length != 1 ? "s" : ""} Unlocked` }
    let heroesUnlocked = Object.keys(btd6usersave.unlockedHeros).filter(k => btd6usersave.unlockedHeros[k]).length;
    progressSubText["Heroes"] = `${heroesUnlocked}/${Object.keys(btd6usersave.unlockedHeros).length} Hero${heroesUnlocked != 1 ? "es" : ""} Unlocked`;
    let skinsUnlocked = Object.keys(btd6usersave.unlockedSkins).filter(k => !Object.keys(constants.heroesInOrder).includes(k)).filter(k => btd6usersave.unlockedSkins[k]).length
    progressSubText["Skins"] = `${skinsUnlocked}/${Object.keys(btd6usersave.unlockedSkins).filter(k => !Object.keys(constants.heroesInOrder).includes(k)).length} Hero Skin${skinsUnlocked != 1 ? "s" : ""} Unlocked`;
    progressSubText["Knowledge"] = `${Object.keys(btd6usersave.acquiredKnowledge).filter(k => btd6usersave.acquiredKnowledge[k]).length}/${Object.keys(btd6usersave.acquiredKnowledge).length} Knowledge Unlocked`;
    let mapsPlayed = Object.keys(btd6usersave.mapProgress).filter(k => btd6usersave.mapProgress[k]).length
    progressSubText["MapProgress"] = `${mapsPlayed} Map${mapsPlayed != 1 ? "s" : ""} Played`;
    let chimpsTotal = Object.values(processedMapData.Medals.single).map(map => map["Clicks"]).filter(medal => medal).length;
    if (chimpsTotal > 0) { progressSubText["CHIMPS"] = `${chimpsTotal} CHIMPS Medal${chimpsTotal != 1 ? "s" : ""} Earned` }
    let powersTotal = Object.values(btd6usersave.powers).map(power => power.quantity).reduce((acc, amount) => acc + amount)
    progressSubText["Powers"] = `${powersTotal} Power${powersTotal != 1 ? "s" : ""} Accumulated`
    let instaTotal = Object.values(processedInstaData.TowerTotal).reduce((acc, amount) => acc + amount)
    progressSubText["InstaMonkeys"] = `${instaTotal} Insta${instaTotal != 1 ? "s" : ""} Accumulated`;
    progressSubText["Achievements"] = `${btd6publicprofile.achievements}/${constants.achievements + constants.hiddenAchievements} Achievement${btd6publicprofile.achievements != 1 ? "s" : ""} Earned`;
    let extrasTotal = Object.keys(extrasUnlocked).filter(k => extrasUnlocked[k]).length;
    progressSubText["Extras"] = `${extrasTotal} Extra${extrasTotal != 1 ? "s" : ""} Unlocked`;
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

function generateInstaData(){
    let towerTotal = {};
    let towerTierTotals = {};
    let towerMissingByTier = {};
    let towerBorders = {};
    for (let [tower, data] of Object.entries(btd6usersave.instaTowers)){
        towerTotal[tower] = 0;
        let towerTiersTemplate = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0
        }
        towerTierTotals[tower] = towerTierTotals[tower] || towerTiersTemplate;
        let missingInstasTemplate = {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": []
        }
        towerMissingByTier[tower] = towerMissingByTier[tower] || missingInstasTemplate;
        for (let [tier, count] of Object.entries(data)){
            towerTotal[tower] += count;
            if (constants.instaTiers["5"].includes(tier)) {
                towerTierTotals[tower]["5"] += 1;
            }
            if (constants.instaTiers["4"].includes(tier)) {
                towerTierTotals[tower]["4"] += 1;
            }
            if (constants.instaTiers["3"].includes(tier)) {
                towerTierTotals[tower]["3"] += 1;
            }
            if (constants.instaTiers["2"].includes(tier)) {
                towerTierTotals[tower]["2"] += 1;
            }
            if (constants.instaTiers["1"].includes(tier)) {
                towerTierTotals[tower]["1"] += 1;
            }
        }

        constants.collectionOrder.forEach((tier) => {
            if (data[tier] == null){
                if (constants.instaTiers["5"].includes(tier)){
                    towerMissingByTier[tower]["5"].push(tier);
                }
                if (constants.instaTiers["4"].includes(tier)){
                    towerMissingByTier[tower]["4"].push(tier);
                }
                if (constants.instaTiers["3"].includes(tier)){
                    towerMissingByTier[tower]["3"].push(tier);
                }
                if (constants.instaTiers["2"].includes(tier)){
                    towerMissingByTier[tower]["2"].push(tier);
                }
                if (constants.instaTiers["1"].includes(tier)){
                    towerMissingByTier[tower]["1"].push(tier);
                }
            }
        })

        if (towerTierTotals[tower]["4"] == constants.instaTiers["4"].length && towerTierTotals[tower]["3"] == constants.instaTiers["3"].length && towerTierTotals[tower]["2"] == constants.instaTiers["2"].length && towerTierTotals[tower]["1"] == constants.instaTiers["1"].length){
            if (towerTierTotals[tower]["5"] == constants.instaTiers["5"].length) {
                towerBorders[tower] = "Black";
                continue;
            }
            towerBorders[tower] = "Gold";
        } else {
            towerBorders[tower] = "";
        }
    }
    processedInstaData["TowerTotal"] = towerTotal;
    processedInstaData["TowerTierTotals"] = towerTierTotals;
    processedInstaData["TowerMissingByTier"] = towerMissingByTier;
    processedInstaData["TowerBorders"] = towerBorders;
}

function showLoading(){
    let imagesToLoad = 0;
    function imageLoaded() {
        imagesToLoad--;
        if (imagesToLoad === 0) {
            document.getElementById("loading").style.transform = "scale(0)";
        }
    }
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'IMG') {
                        imagesToLoad++;
                        node.addEventListener('load', imageLoaded);
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.getElementById("loading").style.removeProperty("transform")
}

function hideLoading(){
    document.getElementById("loading").style.transform = "scale(0)";
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
title.innerHTML = 'Bloons TD 6 API Explorer';
headerDiv.appendChild(title);

// const titleImg = document.createElement('img');
// titleImg.id = 'title-img';
// titleImg.classList.add('title-img');
// titleImg.src = './Assets/UI/TitleContainer.png';
// headerDiv.appendChild(titleImg);

const content = document.createElement('div');
content.id = 'content';
content.classList.add('content');
container.appendChild(content);

readLocalStorage()
generateFrontPage()
function generateFrontPage(){
    const frontPage = document.createElement('div');
    frontPage.id = 'front-page';
    frontPage.classList.add('front-page');
    content.appendChild(frontPage);

    // const frontPageTitle = document.createElement('h1');
    // frontPageTitle.id = 'front-page-title';
    // frontPageTitle.classList.add('front-page-title');
    // frontPageTitle.innerHTML = 'Bloons TD 6 API Explorer';
    // frontPage.appendChild(frontPageTitle);

    const frontPageText = document.createElement('p');
    frontPageText.id = 'front-page-text';
    frontPageText.classList.add('front-page-text');
    frontPageText.innerHTML = 'Enter your Open Access Key (OAK) to get started: ';
    frontPage.appendChild(frontPageText);

    //previousies entered OAK
    let previousOAK = document.createElement('div');
    previousOAK.id = 'previous-oak';
    previousOAK.classList.add('previous-oak');
    frontPage.appendChild(previousOAK);

    Object.entries(localStorageOAK).forEach(([oak, oakdata]) => {
        let previousOAKEntry = document.createElement('div');
        previousOAKEntry.id = 'previous-oak-entry';
        previousOAKEntry.classList.add('previous-oak-entry');
        previousOAKEntry.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(${oakdata.banner})`;
        previousOAK.appendChild(previousOAKEntry);

        previousOAKEntry.appendChild(generateAvatar(100, oakdata.avatar));

        let profileName = document.createElement('p');
        profileName.id = 'profile-name';
        profileName.classList.add('profile-name');
        profileName.classList.add('black-outline');
        profileName.innerHTML = oakdata.displayName;
        previousOAKEntry.appendChild(profileName);

        let useButton = document.createElement('img');
        useButton.id = 'use-button';
        useButton.classList.add('use-button');
        useButton.src = './Assets/UI/ContinueBtn.png';
        useButton.addEventListener('click', () => {
            if (!pressedStart){
                pressedStart = true;
                document.getElementById("loading").style.removeProperty("transform");
                oak_token = oak;
                getSaveData(oak);
            }
        })
        previousOAKEntry.appendChild(useButton);

        let deleteButton = document.createElement('img');
        deleteButton.id = 'delete-button';
        deleteButton.classList.add('delete-button');
        deleteButton.src = './Assets/UI/CloseBtn.png'
        deleteButton.addEventListener('click', () => {
            delete localStorageOAK[oak];
            writeLocalStorage();
            previousOAK.removeChild(previousOAKEntry);
        })
        previousOAKEntry.appendChild(deleteButton);
    })

    //key entry
    let keyEntry = document.createElement('input');
    keyEntry.id = 'key-entry';
    keyEntry.classList.add('key-entry');
    keyEntry.placeholder = 'Enter your OAK here';
    frontPage.appendChild(keyEntry);
    //start button
    let startButton = document.createElement('div');
    startButton.id = 'start-button';
    startButton.classList.add('start-button');
    startButton.classList.add('black-outline');
    startButton.innerHTML = 'Start';
    startButton.addEventListener('click', () => {
        let key = document.getElementById('key-entry').value;
        if (key.length < 5 || key.length > 30 || !key.startsWith('oak_')){
            alert('Please enter a valid OAK! This will start with "oak_".');
            return;
        }
        if (!pressedStart){
            document.getElementById("loading").style.removeProperty("transform");
            pressedStart = true;
            oak_token = keyEntry.value;
            getSaveData(oak_token);
        }
    })
    frontPage.appendChild(startButton);

    let infoButtons = document.createElement('div');
    infoButtons.id = 'info-buttons';
    infoButtons.classList.add('info-buttons');
    frontPage.appendChild(infoButtons);

    //where do I get it button
    let whereButton = document.createElement('p');
    whereButton.id = 'where-button';
    whereButton.classList.add('where-button');
    whereButton.classList.add('black-outline');
    whereButton.innerHTML = 'How do I get it?';
    infoButtons.appendChild(whereButton);

    let faqButton = document.createElement('p');
    faqButton.id = 'faq-button';
    faqButton.classList.add('where-button')
    faqButton.classList.add('faq-button');
    faqButton.classList.add('black-outline');
    faqButton.innerHTML = 'FAQ';
    infoButtons.appendChild(faqButton);

    let privacyButton = document.createElement('p');
    privacyButton.id = 'privacy-button';
    privacyButton.classList.add('where-button');
    privacyButton.classList.add('privacy-button');
    privacyButton.classList.add('black-outline');
    privacyButton.innerHTML = 'Privacy Policy';
    infoButtons.appendChild(privacyButton);

    let OAKInstructionsDiv = document.createElement('div');
    OAKInstructionsDiv.id = 'oak-instructions-div';
    OAKInstructionsDiv.classList.add('oak-instructions-div');
    OAKInstructionsDiv.style.display = 'none';
    frontPage.appendChild(OAKInstructionsDiv);

    let FAQDiv = document.createElement('div');
    FAQDiv.id = 'faq-div';
    FAQDiv.classList.add('faq-div');
    FAQDiv.style.display = 'none';
    frontPage.appendChild(FAQDiv);

    let privacyDiv = document.createElement('div');
    privacyDiv.id = 'privacy-div';
    privacyDiv.classList.add('privacy-div');
    privacyDiv.style.display = 'none';
    frontPage.appendChild(privacyDiv);

    let versionDiv = document.createElement('div');
    versionDiv.id = 'version-div';
    versionDiv.classList.add('version-div');
    frontPage.appendChild(versionDiv);

    whereButton.addEventListener('click', () => {
        hideAllButOne('oak-instructions')
    })

    faqButton.addEventListener('click', () => {
        hideAllButOne('faq')
    })

    privacyButton.addEventListener('click', () => {
        hideAllButOne('privacy')
    })

    function hideAllButOne(tab){
        ["oak-instructions", "faq", "privacy"].forEach((tabName) => {
            let tabDiv = document.getElementById(tabName + '-div');
            if (tabName === tab) {
                tabDiv.style.display = (tabDiv.style.display === 'none') ? 'block' : 'none';
            } else {
                tabDiv.style.display = 'none';
            }
        });
    }

    let OAKInstructionsHeader = document.createElement('p');
    OAKInstructionsHeader.id = 'oak-instructions-header';
    OAKInstructionsHeader.classList.add('oak-instructions-header');
    OAKInstructionsHeader.classList.add('black-outline');
    OAKInstructionsHeader.innerHTML = 'What is an Open Access Key?';
    OAKInstructionsDiv.appendChild(OAKInstructionsHeader);

    let OAKInstructionsText = document.createElement('p');
    OAKInstructionsText.id = 'oak-instructions-text';
    OAKInstructionsText.classList.add('oak-instructions-text');
    OAKInstructionsText.innerHTML = 'An Open Access Key (OAK) is a unique key that allows you to access your Bloons TD 6 data from Ninja Kiwi\'s Open Data API.';
    OAKInstructionsDiv.appendChild(OAKInstructionsText);

    let OAKInstructionsHeader2 = document.createElement('p');
    OAKInstructionsHeader2.id = 'oak-instructions-header';
    OAKInstructionsHeader2.classList.add('oak-instructions-header');
    OAKInstructionsHeader2.classList.add('black-outline');
    OAKInstructionsHeader2.innerHTML = 'How do I get one?';
    OAKInstructionsDiv.appendChild(OAKInstructionsHeader2);

    let OAKInstructionsText2 = document.createElement('p');
    OAKInstructionsText2.id = 'oak-instructions-text2';
    OAKInstructionsText2.classList.add('oak-instructions-text');
    OAKInstructionsText2.innerHTML = 'Step 1: Login and Backup your progress with a Ninja Kiwi Account. You can do this by going to settings from the main menu and clicking on the Account button. NOTE: This is not available for BTD6+ on Apple Arcade and BTD6 Netflix. ';
    OAKInstructionsDiv.appendChild(OAKInstructionsText2);

    let OAKInstuctionImg = document.createElement('img');
    OAKInstuctionImg.id = 'oak-instruction-img';
    OAKInstuctionImg.classList.add('oak-instruction-img');
    OAKInstuctionImg.src = './Assets/UI/OAKTutorial1.jpg';
    OAKInstructionsDiv.appendChild(OAKInstuctionImg);

    let OAKInstructionsText3 = document.createElement('p');
    OAKInstructionsText3.id = 'oak-instructions-text3';
    OAKInstructionsText3.classList.add('oak-instructions-text');
    OAKInstructionsText3.innerHTML = 'Step 2: Select "Open Data API" at the bottom right of the account screen.';
    OAKInstructionsDiv.appendChild(OAKInstructionsText3);

    let OAKInstuctionImg2 = document.createElement('img');
    OAKInstuctionImg2.id = 'oak-instruction-img2';
    OAKInstuctionImg2.classList.add('oak-instruction-img');
    OAKInstuctionImg2.src = './Assets/UI/OAKTutorial2.jpg';
    OAKInstructionsDiv.appendChild(OAKInstuctionImg2);

    let OAKInstructionsText4 = document.createElement('p');
    OAKInstructionsText4.id = 'oak-instructions-text4';
    OAKInstructionsText4.classList.add('oak-instructions-text');
    OAKInstructionsText4.innerHTML = 'Step 3: Generate a key and copy that in to the above text field. It should start with "oak_". Then click "Start" to begin!';
    OAKInstructionsDiv.appendChild(OAKInstructionsText4);

    let OAKInstuctionImg3 = document.createElement('img');
    OAKInstuctionImg3.id = 'oak-instruction-img3';
    OAKInstuctionImg3.classList.add('oak-instruction-img');
    OAKInstuctionImg3.src = './Assets/UI/OAKTutorial3.jpg';
    OAKInstructionsDiv.appendChild(OAKInstuctionImg3);

    let faqHeader = document.createElement('p');
    faqHeader.id = 'faq-header';
    faqHeader.classList.add('oak-instructions-header');
    faqHeader.classList.add('black-outline');
    faqHeader.innerHTML = 'Frequently Asked Questions';
    FAQDiv.appendChild(faqHeader);

    let FAQ = {
        "What can I do with this?": "You can view more detailed stats and progress than you can see in the game such as your highest round for every mode on every map you've played. You can also view your Insta Monkey collection and use this as a tracker as the data pulled is always up to date! You'll eventually be able to explore the API for leaderboards, more advanced challenge stats and more!",
        "How long does the API take to update after I do something in the game?": "15 minutes is the most I've seen. Be sure to press the save button in settings if you want to minimize the time it takes to update!",
        "Why is this not available for BTD6+ and Netflix?": "This is because the data is stored differently for these versions such as using iCloud for BTD6+. This is not compatible with the Open Data API."
    }

    for (let [question, answer] of Object.entries(FAQ)){
        let FAQEntryDiv = document.createElement('div');
        FAQEntryDiv.classList.add('faq-entry-div');
        FAQDiv.appendChild(FAQEntryDiv);

        let FAQQuestionDiv = document.createElement('div');
        FAQQuestionDiv.classList.add('faq-question-div');
        FAQEntryDiv.appendChild(FAQQuestionDiv);

        let FAQQuestion = document.createElement('p');
        FAQQuestion.classList.add('faq-question');
        FAQQuestion.innerHTML = question;
        FAQQuestionDiv.appendChild(FAQQuestion);

        let arrowHideBtn = document.createElement('img');
        arrowHideBtn.classList.add('arrow-hide-btn');
        arrowHideBtn.src = './Assets/UI/ArrowHideBtn.png';
        FAQQuestionDiv.appendChild(arrowHideBtn);

        let FAQAnswerDiv = document.createElement('div');
        FAQAnswerDiv.classList.add('faq-answer-div');
        FAQAnswerDiv.style.display = 'none';
        FAQEntryDiv.appendChild(FAQAnswerDiv);

        let FAQAnswer = document.createElement('p');
        FAQAnswer.classList.add('faq-answer');
        FAQAnswer.innerHTML = answer;
        FAQAnswerDiv.appendChild(FAQAnswer);

        FAQQuestionDiv.addEventListener('click', () => {
            if (FAQAnswerDiv.style.display === 'none'){
                FAQAnswerDiv.style.display = 'block';
                arrowHideBtn.style.transform = 'rotate(180deg)';
            } else {
                FAQAnswerDiv.style.display = 'none';
                arrowHideBtn.style.transform = 'rotate(0deg)';
            }
        })
    }

    let privacyHeader = document.createElement('p');
    privacyHeader.id = 'privacy-header';
    privacyHeader.classList.add('oak-instructions-header');
    privacyHeader.classList.add('black-outline');
    privacyHeader.innerHTML = 'Privacy Policy';
    privacyDiv.appendChild(privacyHeader);

    let privacyText = document.createElement('p');
    privacyText.id = 'privacy-text';
    privacyText.classList.add('oak-instructions-text');
    privacyText.innerHTML = 'This app does not store any data being sent to or retrieved from Ninja Kiwi\'s servers outside of your browser/device. localStorage is used to prevent users from having to re-enter their OAK every time they visit the site. If you would like to delete this stored data, you can do so by clicking the "X" on the profile you would like to delete on this page.';
    privacyDiv.appendChild(privacyText);
}

function generateVersionInfo(){
    let versionDiv = document.getElementById('version-div');

    let toolVersionText = document.createElement('p');
    toolVersionText.id = 'tool-version-text';
    toolVersionText.classList.add('tool-version-text');
    toolVersionText.innerHTML = `App Version: ${constants.version} / Game Content Version: v${constants.projectContentVersion}`;
    versionDiv.appendChild(toolVersionText);

    // let toolVersionText2 = document.createElement('p');
    // toolVersionText2.id = 'tool-version-text2';
    // toolVersionText2.classList.add('tool-version-text');
    // toolVersionText2.innerHTML = `Game Content Version: v${constants.projectContentVersion}`;
    // versionDiv.appendChild(toolVersionText2);
}

function generateHeaderTabs(){
    const headerContainer = document.createElement('div');
    headerContainer.id = 'header';
    headerContainer.classList.add('header-container');
    header.appendChild(headerContainer);

    let headers = ['Overview', 'Progress', 'Events', 'Explore', 'Extras'];

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

    headers.forEach((headerName) => {
        headerName = headerName.toLowerCase();
        let contentElement = document.createElement('div');
        contentElement.id = headerName + '-content';
        contentElement.classList.add(`content-div`);
        contentElement.classList.add(headerName)
        contentElement.style.display = 'none';
        content.appendChild(contentElement);
    })

    let extraContent = ['Challenge', "Map", 'PublicProfile', 'Leaderboard', "Browser", 'Relics', 'Roundset'];
    extraContent.forEach((headerName) => {
        headerName = headerName.toLowerCase();
        let contentElement = document.createElement('div');
        contentElement.id = headerName + '-content';
        contentElement.classList.add(`sub-content-div`);
        contentElement.classList.add(headerName)
        contentElement.style.display = 'none';
        content.appendChild(contentElement);
    })

}

function changeTab(tab) {
    resetScroll();
    if(timerInterval) { clearInterval(timerInterval); }
    changeHexBGColor(constants.BGColor)
    let tabs = document.getElementsByClassName('content-div');
    for (let tab of tabs){
        tab.style.display = 'none';
        document.getElementById(tab.id.replace('-content', '')).classList.remove('selected');
    }
    for (let subtab of document.getElementsByClassName('sub-content-div')){
        subtab.style.display = 'none';
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
            case 'events':
                generateEvents();
                break;
            case "explore":
                generateExplore();
                break;
            case 'extras':
                generateExtrasPage();
                break;
            case 'settings':
                generateSettings();
                break;
        }
    }
}

let tempXP = 0;

function generateOverview(){

    let profileHeader = document.createElement('div');
    profileHeader.id = 'profile-header';
    profileHeader.classList.add('profile-header');
    profileHeader.classList.add('profile-banner');
    profileHeader.style.backgroundImage = `linear-gradient(to bottom, transparent 50%, var(--profile-primary) 70%),url('${btd6publicprofile["bannerURL"]}')`;
    document.getElementById('overview-content').appendChild(profileHeader);
    profileHeader.appendChild(generateAvatar(100, btd6publicprofile["avatarURL"]));

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

    let profileFollowers = document.createElement('div')
    profileFollowers.classList.add('profile-followers');
    profileTop.appendChild(profileFollowers);

    let followersLabel = document.createElement('p');
    followersLabel.classList.add('followers-label');
    followersLabel.classList.add('black-outline');
    followersLabel.innerHTML = 'Followers';
    profileFollowers.appendChild(followersLabel);

    if ( btd6publicprofile["followers"] > 0 ) {
        let followersCount = document.createElement('p');
        followersCount.classList.add('followers-count');
        followersCount.innerHTML = btd6publicprofile["followers"].toLocaleString();
        profileFollowers.appendChild(followersCount);
    }

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

    let topHeroesMonkesyDiv = document.createElement('div');
    topHeroesMonkesyDiv.id = 'top-heroes-monkeys-div';
    topHeroesMonkesyDiv.classList.add('top-heroes-monkeys-div');
    leftColumnDiv.appendChild(topHeroesMonkesyDiv);
    
    /*let topColumnDiv = document.createElement('div');
    topColumnDiv.id = 'top-column-div';
    topColumnDiv.classList.add('right-column-div');
    leftColumnDiv.appendChild(topColumnDiv);*/

    let topHeroesDiv = document.createElement('div');
    topHeroesDiv.id = 'top-heroes-div';
    topHeroesDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topHeroesDiv);

    let topHeroesTopDiv = document.createElement('div');
    topHeroesTopDiv.id = 'top-heroes-top-div';
    topHeroesTopDiv.classList.add('top-heroes-top-div');
    topHeroesDiv.appendChild(topHeroesTopDiv);

    let topHeroesTopRibbonDiv = document.createElement('div');
    topHeroesTopRibbonDiv.id = 'top-heroes-top-div';
    topHeroesTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topHeroesTopDiv.appendChild(topHeroesTopRibbonDiv);

    let topHeroesText = document.createElement('p');
    topHeroesText.id = 'top-heroes-text';
    topHeroesText.classList.add('top-heroes-text');
    topHeroesText.classList.add('black-outline');
    topHeroesText.innerHTML = 'Top Heroes';
    topHeroesTopRibbonDiv.appendChild(topHeroesText);

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.id = 'maps-progress-coop-toggle';
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    topHeroesTopDiv.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.id = 'maps-progress-coop-toggle-text';
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressCoopToggleText.classList.add('black-outline');
    mapsProgressCoopToggleText.innerHTML = "Show All: ";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggleInput.addEventListener('change', () => {
        mapsProgressCoopToggleInput.checked ? document.getElementById('other-heroes-div').style.display = 'flex' : document.getElementById('other-heroes-div').style.display = 'none';
    })
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);


    let topHeroesList = document.createElement('div');
    topHeroesList.id = 'top-heroes-list';
    topHeroesList.classList.add('top-heroes-list');
    topHeroesDiv.appendChild(topHeroesList);

    let top3HeroesDiv = document.createElement('div');
    top3HeroesDiv.id = 'top-3-heroes-div';
    top3HeroesDiv.classList.add('top-3-heroes-div');
    topHeroesList.appendChild(top3HeroesDiv);

    let otherHeroesDiv = document.createElement('div');
    otherHeroesDiv.id = 'other-heroes-div';
    otherHeroesDiv.classList.add('other-heroes-div');
    otherHeroesDiv.style.display = 'none';
    topHeroesList.appendChild(otherHeroesDiv);

    let counter = 0;

    for (let [hero, xp] of Object.entries(btd6publicprofile["heroesPlaced"]).sort((a, b) => b[1] - a[1])){
        let heroDiv = document.createElement('div');
        heroDiv.id = 'hero-div';
        heroDiv.classList.add('hero-div');
        counter < 3 ? top3HeroesDiv.appendChild(heroDiv) : otherHeroesDiv.appendChild(heroDiv);

        let heroImg = document.createElement('img');
        heroImg.id = 'hero-img';
        heroImg.classList.add('hero-img');
        heroImg.src = getHeroPortrait(hero,1);
        heroImg.style.display = "none";
        heroImg.addEventListener('load', () => {
            if(heroImg.width < heroImg.height){
                heroImg.style.width = `${ratioCalc(3,150,1920,0,heroImg.width)}px`
            } else {
                heroImg.style.height = `${ratioCalc(3,150,1920,0,heroImg.height)}px`
            }
            heroImg.style.removeProperty('display');
        })
        heroDiv.appendChild(heroImg);

        let heroText = document.createElement('p');
        heroText.id = 'hero-text';
        heroText.classList.add('hero-text');
        heroText.classList.add('black-outline');
        heroText.innerHTML = xp.toLocaleString();
        heroDiv.appendChild(heroText);
        counter++;
    }

    let topTowersDiv = document.createElement('div');
    topTowersDiv.id = 'top-towers-div';
    topTowersDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topTowersDiv);

    let topTowersTopDiv = document.createElement('div');
    topTowersTopDiv.id = 'top-towers-top-div';
    topTowersTopDiv.classList.add('top-heroes-top-div');
    topTowersDiv.appendChild(topTowersTopDiv);

    let topTowersTopRibbonDiv = document.createElement('div');
    topTowersTopRibbonDiv.id = 'top-towers-top-div';
    topTowersTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topTowersTopDiv.appendChild(topTowersTopRibbonDiv);

    let topTowersText = document.createElement('p');
    topTowersText.id = 'top-towers-text';
    topTowersText.classList.add('top-heroes-text');
    topTowersText.classList.add('black-outline');
    topTowersText.innerHTML = 'Top Towers';
    topTowersTopRibbonDiv.appendChild(topTowersText);

    let mapsProgressCoopToggle2 = document.createElement('div');
    mapsProgressCoopToggle2.id = 'maps-progress-coop-toggle';
    mapsProgressCoopToggle2.classList.add('maps-progress-coop-toggle');
    topTowersTopDiv.appendChild(mapsProgressCoopToggle2);

    let mapsProgressCoopToggleText2 = document.createElement('p');
    mapsProgressCoopToggleText2.id = 'maps-progress-coop-toggle-text';
    mapsProgressCoopToggleText2.classList.add('maps-progress-coop-toggle-text');
    mapsProgressCoopToggleText2.classList.add('black-outline');
    mapsProgressCoopToggleText2.innerHTML = "Show All: ";
    mapsProgressCoopToggle2.appendChild(mapsProgressCoopToggleText2);

    let mapsProgressCoopToggleInput2 = document.createElement('input');
    mapsProgressCoopToggleInput2.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput2.type = 'checkbox';
    mapsProgressCoopToggleInput2.addEventListener('change', () => {
        mapsProgressCoopToggleInput2.checked ? document.getElementById('other-towers-div').style.display = 'flex' : document.getElementById('other-towers-div').style.display = 'none';
    })
    mapsProgressCoopToggle2.appendChild(mapsProgressCoopToggleInput2);

    
    let topTowersList = document.createElement('div');
    topTowersList.id = 'top-towers-list';
    topTowersList.classList.add('top-heroes-list');
    topTowersDiv.appendChild(topTowersList);

    let top3TowersDiv = document.createElement('div');
    top3TowersDiv.id = 'top-3-towers-div';
    top3TowersDiv.classList.add('top-3-heroes-div');
    topTowersList.appendChild(top3TowersDiv);

    let otherTowersDiv = document.createElement('div');
    otherTowersDiv.id = 'other-towers-div';
    otherTowersDiv.classList.add('other-heroes-div');
    otherTowersDiv.style.display = 'none';
    topTowersList.appendChild(otherTowersDiv);

    counter = 0;

    for (let [tower, xp] of Object.entries(btd6publicprofile["towersPlaced"]).sort((a, b) => b[1] - a[1])){
        let towerDiv = document.createElement('div');
        towerDiv.id = 'tower-div';
        towerDiv.classList.add('hero-div');
        counter < 3 ? top3TowersDiv.appendChild(towerDiv) : otherTowersDiv.appendChild(towerDiv);

        let towerImg = document.createElement('img');
        towerImg.id = 'tower-img';
        towerImg.classList.add('hero-img');
        towerImg.src = getInstaContainerIcon(tower,"000");
        towerDiv.appendChild(towerImg);

        let towerText = document.createElement('p');
        towerText.id = 'tower-text';
        towerText.classList.add('hero-text');
        towerText.classList.add('black-outline');
        towerText.innerHTML = xp.toLocaleString();
        towerDiv.appendChild(towerText);
        counter++;
    }

    let quickStatsDiv = document.createElement('div');
    quickStatsDiv.classList.add('quick-stats-div');
    leftColumnDiv.appendChild(quickStatsDiv);

    let quickStatsHeader = document.createElement('div');
    quickStatsHeader.classList.add('quick-stats-header');
    quickStatsDiv.appendChild(quickStatsHeader);

    let quickStatsHeaderText = document.createElement('p');
    quickStatsHeaderText.classList.add('column-header-text','black-outline');
    quickStatsHeaderText.innerHTML = 'Quick Stats';
    quickStatsHeader.appendChild(quickStatsHeaderText);

    let quickStatsContent = document.createElement('div');
    quickStatsContent.classList.add('quick-stats-content');
    quickStatsDiv.appendChild(quickStatsContent);

    let statIcons = {
        "Towers": "../Assets/UI/MaxMonkeysIcon.png",
        "Heroes": "../Assets/UI/AllHeroesIcon.png",
        "Extras": "../Assets/UI/SmallBloonsModeIcon.png",
        "Achievements": "../Assets/AchievementIcon/AchievementsIcon.png",
        "CHIMPS": "../Assets/MedalIcon/MedalImpoppableRuby.png",
        "InstaMonkeys": "../Assets/UI/InstaIcon.png",
        "MapProgress": "../Assets/UI/StartRoundIconSmall.png",
        "Paragons": "../Assets/UI/ParagonPip.png",
        "Powers": "../Assets/UI/PowerContainer.png",
        "Skins": "../Assets/UI/TopHatSprite.png",
        "Upgrades": "../Assets/UI/UpgradeIcon.png",
        "Knowledge": "../Assets/UI/KnowledgeIcon.png"
    }

    Object.entries(progressSubText).forEach(([stat,text]) => {
        if(text.includes("0 Extras") || text.includes("0 CHIMPS")) { return }
        if(text.match(/0\/[0-9]+ Paragons/)) { return }
        let quickStat = document.createElement('div');
        quickStat.classList.add('quick-stat');
        quickStatsContent.appendChild(quickStat);

        let statIcon = document.createElement('img');
        statIcon.classList.add('quick-stat-icon');
        statIcon.src = statIcons[stat];
        quickStat.appendChild(statIcon);

        let statName = document.createElement('p');
        statName.classList.add('quick-stat-name');
        statName.innerHTML = text;
        quickStat.appendChild(statName);
    })



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

function generateAvatar(size, src){
    let avatar = document.createElement('div');
    avatar.style.width = `${size}px`;
    avatar.style.height = `${size}px`;
    avatar.classList.add('avatar');

    let avatarFrame = document.createElement('img');
    avatarFrame.id = 'avatar-frame';
    avatarFrame.classList.add('avatar-frame','noSelect');
    avatarFrame.style.width = `${size}px`;
    avatarFrame.src = '../Assets/UI/InstaTowersContainer.png';
    avatar.appendChild(avatarFrame);

    let avatarImg = document.createElement('img');
    avatarImg.id = 'avatar-img';
    avatarImg.classList.add('avatar-img','noSelect');
    avatarImg.style.width = `${size}px`;
    avatarImg.src = src;
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

    // let progressClipboard = document.createElement('img');
    // progressClipboard.id = 'progress-clipboard';
    // progressClipboard.classList.add('progress-clipboard');
    // progressClipboard.src = '../Assets/UI/ClipboardTop.png';
    // progressContent.appendChild(progressClipboard);

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
    resetScroll();
    if(timerInterval) { clearInterval(timerInterval); }
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
            currentMapView = "grid";
            coopEnabled = false;
            currentDifficultyFilter = "All";
            mapPage = 0;
            generateMapsProgress();
            break;
        case "Powers":
            generatePowersProgress();
            break;
        case "InstaMonkeys":
            generateInstaMonkeysProgress();
            break;
        case "Achievements":
            generateAchievementsProgress();
            break;
        case "Extras":
            generateExtrasProgress();
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
    towerSelectorHeaderText.innerHTML = `Towers - ${Object.keys(btd6usersave.unlockedTowers).filter(k => btd6usersave.unlockedTowers[k]).length}/${Object.keys(btd6usersave.unlockedTowers).length}`;
    towerSelectorHeaderTop.appendChild(towerSelectorHeaderText);

    let towerSelectorHeaderText2 = document.createElement('p');
    towerSelectorHeaderText2.id = 'tower-selector-header-text';
    towerSelectorHeaderText2.classList.add('tower-selector-header-text');
    towerSelectorHeaderText2.classList.add('black-outline');
    towerSelectorHeaderText2.innerHTML = `Upgrades - ${Object.keys(btd6usersave.acquiredUpgrades).filter(k => btd6usersave.acquiredUpgrades[k]).length}/${Object.keys(btd6usersave.acquiredUpgrades).length}`;
    towerSelectorHeaderTop.appendChild(towerSelectorHeaderText2);

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
    towerProgressContentText.innerHTML = getLocValue(tower);
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
    towerProgressContentDesc.innerHTML = getLocValue(`${tower} Description`);
    towerProgressContentTop.appendChild(towerProgressContentDesc);

    let towerNameAndPortrait = document.createElement('div');
    towerNameAndPortrait.id = 'tower-name-and-portrait';
    towerNameAndPortrait.classList.add('tower-name-and-portrait');
    towerProgressContent.appendChild(towerNameAndPortrait);

    let towerPortraitName = document.createElement('p');
    towerPortraitName.id = 'tower-portrait-name';
    towerPortraitName.classList.add('tower-portrait-name');
    towerPortraitName.classList.add('black-outline');
    towerPortraitName.innerHTML = getLocValue(tower);
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

    let upgradeTooltip = document.createElement('div');
    upgradeTooltip.id = `upgrade-tooltip`;
    upgradeTooltip.classList.add('upgrade-tooltip');
    upgradeTooltip.innerHTML = getLocValue(`${tower} Description`);
    towerProgressContent.appendChild(upgradeTooltip);

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
    paragonUnlocked ? changeHexBGColor(constants.ParagonBGColor) : changeHexBGColor()

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

    upgradeDiv.addEventListener('click', () => {
        onSelectTowerUpgrade(tower, upgrade, towerUpgrade);
        document.getElementById("upgrade-tooltip").innerHTML = getLocValue(`${upgrade} Description`);
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

    paragonDiv.addEventListener('click', () => {
        onSelectTowerUpgradeParagon(tower, upgrade, "Paragon");
        document.getElementById("upgrade-tooltip").innerHTML = getLocValue(`${upgrade} Description`);
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
    heroSelectorHeaderTop.id = 'hero-selector-header-top';
    heroSelectorHeaderTop.classList.add('hero-selector-header-top');
    heroProgressDiv.appendChild(heroSelectorHeaderTop);

    let heroSelectorHeaderText = document.createElement('p');
    heroSelectorHeaderText.id = 'hero-selector-header-text';
    heroSelectorHeaderText.classList.add('hero-selector-header-text');
    heroSelectorHeaderText.classList.add('black-outline');
    heroSelectorHeaderText.innerHTML = `Heroes - ${Object.keys(btd6usersave.unlockedHeros).filter(k => btd6usersave.unlockedHeros[k]).length}/${Object.keys(btd6usersave.unlockedHeros).length}`;
    heroSelectorHeaderTop.appendChild(heroSelectorHeaderText);

    let heroSelectorHeaderText2 = document.createElement('p');
    heroSelectorHeaderText2.id = 'hero-selector-header-text';
    heroSelectorHeaderText2.classList.add('hero-selector-header-text');
    heroSelectorHeaderText2.classList.add('black-outline');
    heroSelectorHeaderText2.innerHTML = `Skins - ${Object.keys(btd6usersave.unlockedSkins).filter(k => btd6usersave.unlockedSkins[k]).length}/${Object.keys(btd6usersave.unlockedSkins).length}`;
    heroSelectorHeaderTop.appendChild(heroSelectorHeaderText2);

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
    heroProgressTrailFX.src = './Assets/UI/TrailFx.png'; 
    heroProgressHeader.appendChild(heroProgressTrailFX);

    //header hero name text
    let heroProgressHeaderText = document.createElement('p');
    heroProgressHeaderText.id = 'hero-progress-header-text';
    heroProgressHeaderText.classList.add('hero-progress-header-text');
    heroProgressHeaderText.style.backgroundImage = `url('../Assets/UI/${nameColor}TxtTextureMain.png')`;
    // heroProgressHeaderText.classList.add('black-outline');
    heroProgressHeaderText.innerHTML = getLocValue(hero);
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
        if ((btd6usersave.unlockedSkins[saveSkintoSkinMap[skin] || skin] == false || btd6usersave.unlockedSkins[saveSkintoSkinMap[skin] || skin] == null) && skin != hero) { return; }

        // || skin == hero

        let heroSkin = document.createElement('img');
        heroSkin.id = `${hero}-${skin}-skin`;
        heroSkin.classList.add('hero-skin');
        heroSkin.src = getHeroIconCircle(skin);
        heroSkin.addEventListener('click', () => {
            let colorToUse = constants.HeroBGColors[skin] ? constants.HeroBGColors[skin] : constants.HeroBGColors[hero];
            changeHexBGColor(colorToUse);
            changeHeroSkin(skin, hero == skin);
            document.getElementById("hero-portrait-glow").style.background = `radial-gradient(circle, rgb(${colorToUse[0] * 255},${colorToUse[1] * 255},${colorToUse[2] * 255}) 0%, transparent 70%)`
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
    changeHexBGColor(constants.HeroBGColors[hero]);

    return heroProgressContent;
}

function changeHeroSkin(skin, isOriginal){
    currentlySelectedHero = skin;
    let heroProgressHeaderSubtitle = document.getElementById('hero-progress-header-subtitle');
    heroProgressHeaderSubtitle.innerHTML = isOriginal ? getLocValue(`${skin} Short Description`) : getLocValue(`${skin}SkinName`);
    let heroProgressDesc = document.getElementById('hero-progress-desc');
    heroProgressDesc.innerHTML = isOriginal ? getLocValue(`${skin} Description`) : getLocValue(`${skin}SkinDescription`);
    changeHeroLevelPortrait(1);
    //stupid hack to fix ios redraw
    document.body.style.display = "none"
    document.body.offsetHeight;
    document.body.style.removeProperty("display")
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
    mapsProgressList.classList.add('maps-progress-view-list');
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
    mapProgressContainer.style.display = "none";
    progressContent.appendChild(mapProgressContainer);

    onChangeMapView("grid");
}

function onChangeMapView(view){
    currentMapView = view;
    switch(view){
        case "grid":
            document.getElementById('maps-progress-grid').classList.add('stats-tab-yellow');
            document.getElementById('maps-progress-list').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-game').classList.remove('stats-tab-yellow');
            generateMapsGridView();
            break;
        case "list":
            document.getElementById('maps-progress-grid').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-list').classList.add('stats-tab-yellow');
            document.getElementById('maps-progress-game').classList.remove('stats-tab-yellow');
            generateMapsListView();
            break;
        case "game":
            document.getElementById('maps-progress-grid').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-list').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-game').classList.add('stats-tab-yellow');
            generateMapsGameView();
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
            generateMapsListView();
            break;
        case "game":
            generateMapsGameView();
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
            generateMapsListView();
            break;
        case "game":
            generateMapsGameView();
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

    // let mapProgressExitBtn = document.createElement('div');
    // mapProgressExitBtn.id = 'map-progress-exit-btn';
    // mapProgressExitBtn.classList.add('maps-progress-view');
    // mapProgressExitBtn.classList.add('black-outline');
    // mapProgressExitBtn.innerHTML = "Exit";
    // mapProgressExitBtn.addEventListener('click', () => {
    //     onExitMap();
    // })
    // mapProgressHeaderBar.appendChild(mapProgressExitBtn);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        onExitMap();
    })
    mapProgressHeaderBar.appendChild(modalClose);

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
        if (processedMapData.Borders["single"][map] == "Black") {
            medalImg.classList.add("medal-glow")
        }
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
        if (processedMapData.Borders["coop"][map] == "Black") {
            medalImg.classList.add("medal-glow")
        }
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
        // determine if every value of the map is undefined
        if (Object.entries(coopEnabled ? processedMapData.Maps[map].coop : processedMapData.Maps[map].single).every(([key, value]) => value == undefined)) { continue;}

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
            mapSectionMedalImg.src = getMedalIcon(difficulty == "Clicks" && data.completedWithoutLoadingSave ? `Medal${coopEnabled ? "Coop" : ""}${medalMap["CHIMPS-BLACK"]}` : `Medal${coopEnabled ? "Coop" : ""}${medalMap[difficulty]}`);
            mapSectionMedalImg.style.display = "none";
            // if the medal is not obtained
            if (!data.completed && data.bestRound < constants.modeBestRoundFix[difficulty] && !data.completedWithoutLoadingSave) { mapSectionMedalImg.style.filter = "brightness(0.5)" } ;
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

function generateMapsGameView() {
    let mapsProgressContainer = document.getElementById('maps-progress-container');
    mapsProgressContainer.innerHTML = "";

    let mapsGameContainer = document.createElement('div');
    mapsGameContainer.id = 'maps-game-container';
    mapsGameContainer.classList.add('maps-game-container');
    mapsProgressContainer.appendChild(mapsGameContainer);

    //generate 6 maps based on the current page
    let maps = Object.keys(constants.mapsInOrder).filter(value => Object.keys(btd6usersave.mapProgress).includes(value)); //Object.keys(constants.mapsInOrder);
    if (currentDifficultyFilter != "All") { maps = maps.filter(map => constants.mapsInOrder[map] == currentDifficultyFilter) }
    let maxPage = Math.ceil(maps.length / 6) - 1;
    if (mapPage > maxPage) { mapPage = 0; }
    if (mapPage < 0) { mapPage = maxPage; }
    let mapsToDisplay = maps.slice(mapPage * 6, mapPage * 6 + 6);

    let mapPrevArrow = document.createElement('div');
    mapPrevArrow.id = 'map-prev-arrow';
    mapPrevArrow.classList.add('map-arrow');
    mapsGameContainer.appendChild(mapPrevArrow);

    let mapPrevArrowImg = document.createElement('img');
    mapPrevArrowImg.id = 'map-prev-arrow-img';
    mapPrevArrowImg.classList.add('map-arrow-img');
    mapPrevArrowImg.src = "./Assets/UI/PrevArrow.png";
    mapPrevArrow.appendChild(mapPrevArrowImg);

    let mapsGameGrid = document.createElement('div');
    mapsGameGrid.id = 'maps-game-grid';
    mapsGameGrid.classList.add('maps-game-grid');
    mapsGameContainer.appendChild(mapsGameGrid);

    for (let map of mapsToDisplay) {
        let mapDiv = document.createElement('div');
        mapDiv.id = `${map}-div`;
        mapDiv.classList.add('map-div-ingame');
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
        mapsGameGrid.appendChild(mapDiv);

        let mapImg = document.createElement('img');
        mapImg.id = `${map}-img`;
        mapImg.classList.add('map-img-ingame');
        mapImg.src = getMapIcon(map);
        mapDiv.appendChild(mapImg);

        let mapName = document.createElement('p');
        mapName.id = `${map}-name`;
        mapName.classList.add(`map-name`);
        mapName.classList.add('black-outline');
        mapName.innerHTML = getLocValue(map);
        mapDiv.appendChild(mapName);

        //medals
        for (let [difficulty, completed] of (coopEnabled ? Object.entries(processedMapData.Medals.coop[map]) : Object.entries(processedMapData.Medals.single[map]))) {
            if (completed == null) { continue; }
            let medalDiv = document.createElement('div');
            medalDiv.id = `${difficulty}-div`;
            let largeMedals = ["Easy", "Medium", "Hard", "Impoppable"]
            largeMedals.includes(difficulty) ? medalDiv.classList.add('medal-div-large') : medalDiv.classList.add('medal-div-small');
            medalDiv.classList.add(`medal-div-${difficulty.toLowerCase()}`);
            mapDiv.appendChild(medalDiv);
    
            let medalImg = document.createElement('img');
            medalImg.id = `${difficulty}-img`;
            medalImg.classList.add('medal-img');
            medalImg.src = getMedalIcon(completed ? `Medal${medalMap[difficulty]}` : "MedalEmpty");
            if(!completed) { medalImg.classList.add("medal-div-unobtained") }
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

        mapDiv.addEventListener('click', () => {
            onSelectMap(map);
        })
    }

    let mapNextArrow = document.createElement('div');
    mapNextArrow.id = 'map-next-arrow';
    mapNextArrow.classList.add('map-arrow');
    mapsGameContainer.appendChild(mapNextArrow);

    let mapNextArrowImg = document.createElement('img');
    mapNextArrowImg.id = 'map-next-arrow-img';
    mapNextArrowImg.classList.add('map-arrow-img');
    mapNextArrowImg.src = "./Assets/UI/NextArrow.png";
    mapNextArrow.appendChild(mapNextArrowImg);

    mapPrevArrow.addEventListener('click', () => {
        mapPage--;
        generateMapsGameView();
    })

    mapNextArrow.addEventListener('click', () => {
        mapPage++;
        generateMapsGameView();
    })

    let mapPageDots = document.createElement('div');
    mapPageDots.id = 'map-page-dots';
    mapPageDots.classList.add('map-page-dots');
    mapsProgressContainer.appendChild(mapPageDots);

    for (let i = 0; i <= maxPage; i++) {
        let mapPageDot = document.createElement('div');
        mapPageDot.id = `map-page-dot-${i}`;
        mapPageDot.classList.add('map-page-dot');
        if (i == mapPage) { mapPageDot.classList.add('map-page-dot-active'); }
        mapPageDots.appendChild(mapPageDot);

        mapPageDot.addEventListener('click', () => {
            mapPage = i;
            generateMapsGameView();
        })
    }
}

function generatePowersProgress() {
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let powersProgressContainer = document.createElement('div');
    powersProgressContainer.id = 'powers-progress-container';
    powersProgressContainer.classList.add('powers-progress-container');
    progressContent.appendChild(powersProgressContainer);

    for (let [power, value] of Object.entries(btd6usersave.powers)) {
        let powerDiv = document.createElement('div');
        powerDiv.id = `${power}-div`;
        powerDiv.classList.add('power-div');
        powersProgressContainer.appendChild(powerDiv);

        let powerImg = document.createElement('img');
        powerImg.id = `${power}-img`;
        powerImg.classList.add('power-img');
        powerImg.src = getPowerIcon(power);
        powerDiv.appendChild(powerImg);

        let powerName = document.createElement('p');
        powerName.id = `${power}-name`;
        powerName.classList.add('power-name');
        powerName.classList.add('black-outline');
        powerName.innerHTML = getLocValue(power);
        powerDiv.appendChild(powerName);

        let powerProgress = document.createElement('div');
        powerProgress.id = `${power}-progress`;
        powerProgress.classList.add('power-progress');
        powerDiv.appendChild(powerProgress);

        let powerProgressText = document.createElement('p');
        powerProgressText.id = `${power}-progress-text`;
        powerProgressText.classList.add('power-progress-text');
        powerProgressText.classList.add('black-outline');
        powerProgressText.innerHTML = `${value.quantity}`;
        powerProgress.appendChild(powerProgressText);
    }
}

function generateInstaMonkeysProgress() {
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let instaMonkeysHeaderBar = document.createElement('div');
    instaMonkeysHeaderBar.id = 'insta-monkeys-header-bar';
    instaMonkeysHeaderBar.classList.add('insta-monkeys-header-bar');
    progressContent.appendChild(instaMonkeysHeaderBar);

    let instaMonkeysViews = document.createElement('div');
    instaMonkeysViews.id = 'insta-monkeys-views';
    instaMonkeysViews.classList.add('maps-progress-views');
    instaMonkeysHeaderBar.appendChild(instaMonkeysViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.id = 'maps-progress-views-text';
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressViewsText.classList.add('black-outline');
    mapsProgressViewsText.innerHTML = "Display Type:";
    instaMonkeysViews.appendChild(mapsProgressViewsText);


    let instaMonkeysGameView = document.createElement('div');
    instaMonkeysGameView.id = 'insta-monkeys-game-view';
    instaMonkeysGameView.classList.add('maps-progress-view');
    instaMonkeysGameView.classList.add('black-outline');
    instaMonkeysGameView.innerHTML = "Game";
    instaMonkeysGameView.addEventListener('click', () => {
        onChangeInstaMonkeysView("game");
    })
    instaMonkeysViews.appendChild(instaMonkeysGameView);

    let instaMonkeysListView = document.createElement('div');
    instaMonkeysListView.id = 'insta-monkeys-list-view';
    instaMonkeysListView.classList.add('maps-progress-view');
    instaMonkeysListView.classList.add('black-outline');
    instaMonkeysListView.innerHTML = "List";
    instaMonkeysListView.addEventListener('click', () => {
        onChangeInstaMonkeysView("list");
    })
    instaMonkeysViews.appendChild(instaMonkeysListView);

    // let instaMonkeysMissingView = document.createElement('div');
    // instaMonkeysMissingView.id = 'insta-monkeys-missing-view';
    // instaMonkeysMissingView.classList.add('maps-progress-view');
    // instaMonkeysMissingView.classList.add('black-outline');
    // instaMonkeysMissingView.innerHTML = "Missing";
    // instaMonkeysMissingView.addEventListener('click', () => {
    //     onChangeInstaMonkeysView("missing");
    // })
    // instaMonkeysViews.appendChild(instaMonkeysMissingView);

    let instaMonkeysExtras = document.createElement('div');
    instaMonkeysExtras.id = 'insta-monkeys-extras';
    instaMonkeysExtras.classList.add('maps-progress-views');
    instaMonkeysHeaderBar.appendChild(instaMonkeysExtras);

    let instaMonkeysObtainView = document.createElement('div');
    instaMonkeysObtainView.id = 'insta-monkeys-obtain-view';
    instaMonkeysObtainView.classList.add('maps-progress-view');
    instaMonkeysObtainView.classList.add('black-outline');
    // instaMonkeysObtainView.innerHTML = "Where To Get";
    instaMonkeysObtainView.innerHTML = "Coming Soon";
    instaMonkeysObtainView.addEventListener('click', () => {
        onChangeInstaMonkeysView("obtain");
    })
    instaMonkeysExtras.appendChild(instaMonkeysObtainView);

    let instaMonkeysRotationsView = document.createElement('div');
    instaMonkeysRotationsView.id = 'insta-monkeys-rotations-view';
    instaMonkeysRotationsView.classList.add('maps-progress-view');
    instaMonkeysRotationsView.classList.add('black-outline');
    // instaMonkeysRotationsView.innerHTML = "Event Rotations";
    instaMonkeysRotationsView.innerHTML = "Coming Soon";
    instaMonkeysRotationsView.addEventListener('click', () => {
        onChangeInstaMonkeysView("rotations");
    })
    instaMonkeysExtras.appendChild(instaMonkeysRotationsView);

    let instaMonkeysProgressContainer = document.createElement('div');
    instaMonkeysProgressContainer.id = 'insta-monkeys-progress-container';
    instaMonkeysProgressContainer.classList.add('insta-monkeys-progress-container');
    progressContent.appendChild(instaMonkeysProgressContainer);

    let instaMonkeyProgressContainer = document.createElement('div');
    instaMonkeyProgressContainer.id = 'insta-monkey-progress-container';
    instaMonkeyProgressContainer.classList.add('insta-monkey-progress-container');
    instaMonkeyProgressContainer.style.display = "none";
    progressContent.appendChild(instaMonkeyProgressContainer);

    onChangeInstaMonkeysView("game");
}

function onChangeInstaMonkeysView(view) {
    currentInstaView = view;
    document.getElementById('insta-monkeys-progress-container').style.removeProperty('display');
    document.getElementById('insta-monkey-progress-container').style.display = "none";
    switch (view) {
        case "game":
            document.getElementById('insta-monkeys-game-view').classList.add('stats-tab-yellow');
            document.getElementById('insta-monkeys-list-view').classList.remove('stats-tab-yellow');
            generateInstaGameView();
            break;
        case "list":
            document.getElementById('insta-monkeys-game-view').classList.remove('stats-tab-yellow');
            document.getElementById('insta-monkeys-list-view').classList.add('stats-tab-yellow');
            generateInstaListView();
            break;
        // case "missing":
        //     break;
        case "obtain":
            break;
        case "rotations":
            break;
    }
}

function generateInstaGameView(){
    let instaMonkeysProgressContainer = document.getElementById('insta-monkeys-progress-container');
    instaMonkeysProgressContainer.innerHTML = "";

    let instaMonkeyGameContainer = document.createElement('div');
    instaMonkeyGameContainer.id = 'insta-monkey-game-container';
    instaMonkeyGameContainer.classList.add('insta-monkey-game-container');
    instaMonkeysProgressContainer.appendChild(instaMonkeyGameContainer);

    let towersContainer = document.createElement('div');
    towersContainer.id = 'towers-container';
    towersContainer.classList.add('towers-container');
    instaMonkeyGameContainer.appendChild(towersContainer);

    Object.keys(constants.towersInOrder).forEach(tower => {
        let towerContainer = document.createElement('div');
        towerContainer.id = `${tower}-container`;
        towerContainer.classList.add('tower-container');
        towerContainer.style.backgroundImage = `url(./Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower]}.png)`
        towerContainer.addEventListener('click', () => {
            onSelectInstaTower(tower);
        })
        towersContainer.appendChild(towerContainer);

        let towerImg = document.createElement('img');
        towerImg.id = `${tower}-img`;
        towerImg.classList.add(`tower-img`);
        towerImg.src = getInstaContainerIcon(tower,'000');
        towerContainer.appendChild(towerImg);

        let towerName = document.createElement('p');
        towerName.id = `${tower}-name`;
        towerName.classList.add(`tower-name`);
        towerName.classList.add('black-outline');
        towerName.innerHTML = getLocValue(tower);
        towerContainer.appendChild(towerName);

        let towerTotalDiv = document.createElement('p');
        towerTotalDiv.id = `${tower}-total-div`;
        towerTotalDiv.classList.add(`insta-progress`);
        towerContainer.appendChild(towerTotalDiv);

        let towerTotal = document.createElement('p');
        towerTotal.id = `${tower}-total`;
        towerTotal.classList.add(`power-progress-text`);
        towerTotal.classList.add('black-outline');
        towerTotal.innerHTML = processedInstaData.TowerTotal[tower];
        towerTotalDiv.appendChild(towerTotal);
    }) 
}

function onSelectInstaTower(tower) {
    document.getElementById('insta-monkeys-progress-container').style.display = "none";
    document.getElementById('insta-monkey-progress-container').style.display = "flex";
    generateSingleInstaTower(tower);
}

function generateSingleInstaTower(tower) {
    let instaMonkeyProgressContainer = document.getElementById('insta-monkey-progress-container');
    instaMonkeyProgressContainer.innerHTML = "";

    let instaMonkeyDiv = document.createElement('div');
    // instaMonkeyDiv.classList.add('insta-monkey-div');
    instaMonkeyProgressContainer.appendChild(instaMonkeyDiv);
    
    let instaMonkeyTopBar = document.createElement('div');
    instaMonkeyTopBar.id = `${tower}-top-bar`;
    instaMonkeyTopBar.classList.add('insta-monkey-top-bar');
    instaMonkeyDiv.appendChild(instaMonkeyTopBar);

    let instaPrevArrow = document.createElement('div');
    instaPrevArrow.id = 'map-prev-arrow';
    instaPrevArrow.classList.add('insta-arrow');
    instaPrevArrow.addEventListener('click', () => {
        onSelectInstaPrevArrow(tower);
    })
    instaMonkeyTopBar.appendChild(instaPrevArrow);

    let instaPrevArrowImg = document.createElement('img');
    instaPrevArrowImg.id = 'map-prev-arrow-img';
    instaPrevArrowImg.classList.add('map-arrow-img');
    instaPrevArrowImg.src = "./Assets/UI/PrevArrow.png";
    instaPrevArrow.appendChild(instaPrevArrowImg);

    let instaMonkeyHeaderDiv = document.createElement('div');
    instaMonkeyHeaderDiv.id = `${tower}-header-div`;
    instaMonkeyHeaderDiv.classList.add('insta-monkey-header-div');
    switch(processedInstaData.TowerBorders[tower]) {
        case "Gold":
            instaMonkeyHeaderDiv.classList.add("insta-topbar-gold")
            break;
        case "Black":
            instaMonkeyHeaderDiv.classList.add("insta-topbar-black")
            break;
    }
    instaMonkeyTopBar.appendChild(instaMonkeyHeaderDiv);

    let instaNextArrow = document.createElement('div');
    instaNextArrow.id = 'map-next-arrow';
    instaNextArrow.classList.add('insta-arrow');
    instaNextArrow.addEventListener('click', () => {
        onSelectInstaNextArrow(tower);
    })
    instaMonkeyTopBar.appendChild(instaNextArrow);

    let instaNextArrowImg = document.createElement('img');
    instaNextArrowImg.id = 'map-next-arrow-img';
    instaNextArrowImg.classList.add('map-arrow-img');
    instaNextArrowImg.src = "./Assets/UI/NextArrow.png";
    instaNextArrow.appendChild(instaNextArrowImg);


    let instaProgressMissingToggle = document.createElement('div');
    instaProgressMissingToggle.id = 'maps-progress-coop-toggle';
    instaProgressMissingToggle.classList.add('maps-progress-coop-toggle');  
    instaMonkeyHeaderDiv.appendChild(instaProgressMissingToggle);

    let instaProgressMissingToggleText = document.createElement('p');
    instaProgressMissingToggleText.id = 'maps-progress-coop-toggle-text';
    instaProgressMissingToggleText.classList.add('maps-progress-coop-toggle-text');
    instaProgressMissingToggleText.classList.add('black-outline');
    instaProgressMissingToggleText.innerHTML = "Missing: ";
    instaProgressMissingToggle.appendChild(instaProgressMissingToggleText);

    let instaProgressMissingToggleInput = document.createElement('input');
    instaProgressMissingToggleInput.id = 'insta-progress-missing-toggle-input';
    instaProgressMissingToggleInput.classList.add('insta-progress-missing-toggle-input');
    instaProgressMissingToggleInput.classList.add('MkOffRed');
    instaProgressMissingToggleInput.type = 'checkbox';
    instaProgressMissingToggleInput.addEventListener('change', () => {
        onSelectMissingToggle()
    })
    instaProgressMissingToggleInput.checked = coopEnabled;
    instaProgressMissingToggle.appendChild(instaProgressMissingToggleInput);

    let instaMonkeyName = document.createElement('p');
    instaMonkeyName.id = `${tower}-name`;
    instaMonkeyName.classList.add('insta-monkey-name');
    instaMonkeyName.classList.add('black-outline');
    instaMonkeyName.innerHTML = getLocValue(tower);
    instaMonkeyHeaderDiv.appendChild(instaMonkeyName);

    let instaMonkeyProgress = document.createElement('div');
    instaMonkeyProgress.id = `${tower}-progress`;
    instaMonkeyProgress.classList.add('insta-monkey-progress');
    instaMonkeyHeaderDiv.appendChild(instaMonkeyProgress);

    let instaMonkeyProgressText = document.createElement('p');
    instaMonkeyProgressText.id = `${tower}-progress-text`;
    instaMonkeyProgressText.classList.add('insta-monkey-progress-text');
    instaMonkeyProgressText.classList.add('black-outline');
    instaMonkeyProgressText.innerHTML = `${Object.values(processedInstaData.TowerTierTotals[tower]).reduce((a, b) => a + b, 0)}/64`;
    instaMonkeyProgress.appendChild(instaMonkeyProgressText);

    let instaMonkeyMainContainer = document.createElement('div');
    instaMonkeyMainContainer.id = `${tower}-main-container`;
    instaMonkeyMainContainer.classList.add('insta-monkey-main-container');
    instaMonkeyDiv.appendChild(instaMonkeyMainContainer);

    generateInstaMonkeyIcons(tower);
}

function generateInstaMonkeyIcons(tower){
    let instaMonkeyMainContainer = document.getElementById(`${tower}-main-container`);
    instaMonkeyMainContainer.innerHTML = "";

    let instaMonkeyIconsContainer = document.createElement('div');
    instaMonkeyIconsContainer.id = `${tower}-icons-container`;
    instaMonkeyIconsContainer.classList.add('insta-monkey-icons-container');
    instaMonkeyMainContainer.appendChild(instaMonkeyIconsContainer);

    constants.collectionOrder.forEach(tiers => {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.id = `${tower}-${tiers}-container`;
        instaMonkeyTierContainer.classList.add('insta-monkey-tier-container');
        if (!btd6usersave.instaTowers[tower][tiers]) { 
            instaMonkeyTierContainer.style.display = "none";
            instaMonkeyTierContainer.classList.add('insta-monkey-unobtained');
        }
        instaMonkeyIconsContainer.appendChild(instaMonkeyTierContainer);

        if (btd6usersave.instaTowers[tower][tiers] > 1){
            let towerTotalDiv = document.createElement('p');
            towerTotalDiv.id = `${tower}-total-div`;
            towerTotalDiv.classList.add(`insta-progress`);
            towerTotalDiv.classList.add('insta-tier-scale')
            instaMonkeyTierContainer.appendChild(towerTotalDiv);

            let towerTotal = document.createElement('p');
            towerTotal.id = `${tower}-total`;
            towerTotal.classList.add(`power-progress-text`);
            towerTotal.classList.add('black-outline');
            towerTotal.innerHTML = btd6usersave.instaTowers[tower][tiers];
            towerTotalDiv.appendChild(towerTotal);
        }

        let instaMonkeyTierImg = document.createElement('img');
        instaMonkeyTierImg.id = `${tower}-${tiers}-img`;
        instaMonkeyTierImg.classList.add('insta-monkey-tier-img');
        instaMonkeyTierImg.src = btd6usersave.instaTowers[tower][tiers] ? getInstaMonkeyIcon(tower,tiers) : "./Assets/UI/InstaUncollected.png";
        instaMonkeyTierContainer.appendChild(instaMonkeyTierImg);

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.id = `${tower}-${tiers}-text`;
        instaMonkeyTierText.classList.add('insta-monkey-tier-text');
        instaMonkeyTierText.classList.add('black-outline');
        instaMonkeyTierText.innerHTML = `${tiers[0]}-${tiers[1]}-${tiers[2]}`;
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);
    })
}

function onSelectMissingToggle(){
    for (let element of document.getElementsByClassName('insta-monkey-unobtained')) {
        element.style.display = document.getElementById('insta-progress-missing-toggle-input').checked ? "block" : "none";
    }
}

function onSelectInstaPrevArrow(tower){
    let towers = Object.keys(constants.towersInOrder);
    let index = towers.indexOf(tower);
    index == 0 ? index = towers.length - 1 : index--
    onSelectInstaTower(towers[index]);
}

function onSelectInstaNextArrow(tower){
    let towers = Object.keys(constants.towersInOrder);
    let index = towers.indexOf(tower);
    index == towers.length - 1 ? index = 0 : index++
    onSelectInstaTower(towers[index]);
}

function generateInstaListView(){
    let instaMonkeysProgressContainer = document.getElementById('insta-monkeys-progress-container');
    instaMonkeysProgressContainer.innerHTML = "";

    let instaMonkeysListContainer = document.createElement('div');
    instaMonkeysListContainer.id = 'insta-monkeys-list-container';
    instaMonkeysListContainer.classList.add('insta-monkeys-list-container');
    instaMonkeysProgressContainer.appendChild(instaMonkeysListContainer);

    let instaMonkeysList = document.createElement('div');
    instaMonkeysList.id = 'insta-monkeys-list';
    instaMonkeysList.classList.add('insta-monkeys-list');
    instaMonkeysListContainer.appendChild(instaMonkeysList);

    Object.keys(constants.towersInOrder).forEach(tower => {
        if(processedInstaData.TowerTierTotals[tower] == null) { return; }
        let instaMonkeyDiv = document.createElement('div');
        instaMonkeyDiv.id = `${tower}-div`;
        instaMonkeyDiv.classList.add('insta-monkey-div');
        instaMonkeysList.appendChild(instaMonkeyDiv);

        let instaTowerContainer = document.createElement('div');
        instaTowerContainer.id = `${tower}-container`;
        instaTowerContainer.classList.add('tower-container');
        instaTowerContainer.style.backgroundImage = `url(./Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower]}.png)`
        instaTowerContainer.addEventListener('click', () => {
            onSelectInstaTower(tower);
        })
        instaMonkeyDiv.appendChild(instaTowerContainer);

        let instaMonkeyImg = document.createElement('img');
        instaMonkeyImg.id = `${tower}-img`;
        instaMonkeyImg.classList.add('tower-img');
        instaMonkeyImg.src = getInstaContainerIcon(tower,'000');
        instaTowerContainer.appendChild(instaMonkeyImg);

        let instaMonkeyName = document.createElement('p');
        instaMonkeyName.id = `${tower}-name`;
        instaMonkeyName.classList.add(`tower-name`);
        instaMonkeyName.classList.add('black-outline');
        instaMonkeyName.innerHTML = getLocValue(tower);
        instaTowerContainer.appendChild(instaMonkeyName);

        let instaMonkeyTopBottom = document.createElement('div');
        instaMonkeyTopBottom.id = `${tower}-top-bottom`;
        instaMonkeyTopBottom.classList.add('insta-monkey-top-bottom');
        instaMonkeyDiv.appendChild(instaMonkeyTopBottom);

        let instaMonkeyProgress = document.createElement('div');
        instaMonkeyProgress.id = `${tower}-progress`;
        instaMonkeyProgress.classList.add('insta-monkey-progress-list');
        instaMonkeyTopBottom.appendChild(instaMonkeyProgress);

        let instaMonkeyTotal = document.createElement('div');
        instaMonkeyTotal.classList.add('insta-monkey-total');
        instaMonkeyProgress.appendChild(instaMonkeyTotal);

        let instaMonkeysTotalLabelText = document.createElement('p');
        instaMonkeysTotalLabelText.id = `${tower}-total-label-text`;
        instaMonkeysTotalLabelText.classList.add('insta-monkey-progress-label-text');
        instaMonkeysTotalLabelText.classList.add('black-outline');
        instaMonkeysTotalLabelText.innerHTML = "Total Instas:";
        instaMonkeyTotal.appendChild(instaMonkeysTotalLabelText);

        let instaMonkeysTotalText = document.createElement('p');
        instaMonkeysTotalText.id = `${tower}-total-text`;
        instaMonkeysTotalText.classList.add('insta-monkey-total-text');
        instaMonkeysTotalText.classList.add('black-outline');
        instaMonkeysTotalText.innerHTML = processedInstaData.TowerTotal[tower];
        instaMonkeyTotal.appendChild(instaMonkeysTotalText);

        let instaMonkeyTierProgress = document.createElement('div');
        instaMonkeyTierProgress.id = `${tower}-tier-progress`;
        instaMonkeyTierProgress.classList.add('insta-monkey-tier-progress');
        instaMonkeyProgress.appendChild(instaMonkeyTierProgress);

        let instaMonkeyProgressLabelText = document.createElement('p');
        instaMonkeyProgressLabelText.id = `${tower}-progress-label-text`;
        instaMonkeyProgressLabelText.classList.add('insta-monkey-progress-label-text');
        instaMonkeyProgressLabelText.classList.add('black-outline');
        instaMonkeyProgressLabelText.innerHTML = "Unique Instas:";
        instaMonkeyTierProgress.appendChild(instaMonkeyProgressLabelText);

        let instaMonkeyProgressText = document.createElement('p');
        instaMonkeyProgressText.id = `${tower}-progress-text`;
        instaMonkeyProgressText.classList.add('insta-monkey-progress-text');
        instaMonkeyProgressText.classList.add('black-outline');
        instaMonkeyProgressText.innerHTML = `${Object.values(processedInstaData.TowerTierTotals[tower]).reduce((a, b) => a + b, 0)}/64`;
        instaMonkeyTierProgress.appendChild(instaMonkeyProgressText);

        let instaMonkeyTiersContainer = document.createElement('div');
        instaMonkeyTiersContainer.id = `${tower}-tiers-container`;
        instaMonkeyTiersContainer.classList.add('insta-monkey-tiers-container');
        instaMonkeyTopBottom.appendChild(instaMonkeyTiersContainer);

        let instaMonkeyTiersLabel = document.createElement('p');
        instaMonkeyTiersLabel.id = `${tower}-tiers-label`;
        instaMonkeyTiersLabel.classList.add('insta-monkey-tiers-label');
        instaMonkeyTiersLabel.classList.add('black-outline');
        instaMonkeyTiersLabel.innerHTML = "Unique By Tier:";
        instaMonkeyTiersContainer.appendChild(instaMonkeyTiersLabel);

        for (let [tier, tierTotal] of Object.entries(processedInstaData.TowerTierTotals[tower])) {
            let instaMonkeyTierDiv = document.createElement('div');
            instaMonkeyTierDiv.classList.add('insta-monkey-tier-div');
            instaMonkeyTiersContainer.appendChild(instaMonkeyTierDiv);

            // let instaMonkeyTierImg = document.createElement('img');
            // instaMonkeyTierImg.classList.add('insta-monkey-tier-img');
            // instaMonkeyTierImg.src = tierTotal == 0 ? "./Assets/UI/InstaUncollected.png" : getInstaMonkeyIcon(tower,constants.collectionOrder[index]);
            // instaMonkeyTierDiv.appendChild(instaMonkeyTierImg);

            let instaMonkeyTierText = document.createElement('p');
            instaMonkeyTierText.classList.add('insta-monkey-tier-text-list');
            instaMonkeyTierText.classList.add(`insta-tier-text-${tier}`)
            tier == "5" ? instaMonkeyTierText.classList.add('t5-insta-outline') : instaMonkeyTierText.classList.add('black-outline');
            instaMonkeyTierDiv.style.backgroundImage = `url(./Assets/UI/InstaTier${tier}Container.png)`
            instaMonkeyTierText.innerHTML = `${tierTotal}/${constants.instaTiers[tier].length}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierText);
        }
    })
}

function generateInstaObtainGuide() {
    let progressContent = document.getElementById('insta-monkeys-progress-container');
    progressContent.innerHTML = "";

    let titleGuideText = document.createElement('p');
    titleGuideText.id = 'insta-monkeys-guide-title-text';
    titleGuideText.classList.add('insta-monkeys-guide-title-text');
    titleGuideText.classList.add('black-outline');
    titleGuideText.innerHTML = "Where To Get More Insta Monkeys";
    progressContent.appendChild(titleGuideText);

    let titleGuideDesc = document.createElement('p');
    titleGuideDesc.id = 'insta-monkeys-guide-title-desc';
    titleGuideDesc.classList.add('insta-monkeys-guide-title-desc');
    titleGuideDesc.classList.add('black-outline');
    titleGuideDesc.innerHTML = "Select a button to read more about that method.";
    progressContent.appendChild(titleGuideDesc);
}

function generateAchievementsProgress() {
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let achievementsProgressContainer = document.createElement('div');
    achievementsProgressContainer.id = 'achievements-progress-container';
    achievementsProgressContainer.classList.add('achievements-progress-container');
    progressContent.appendChild(achievementsProgressContainer);

    //headerbar
    let achievementsHeaderBar = document.createElement('div');
    achievementsHeaderBar.id = 'achievements-header-bar';
    achievementsHeaderBar.classList.add('achievements-header-bar');
    achievementsProgressContainer.appendChild(achievementsHeaderBar);
    //buttons for grid and list view for achievements
    let achievementsViews = document.createElement('div');
    achievementsViews.id = 'achievements-views';
    achievementsViews.classList.add('maps-progress-views');
    achievementsHeaderBar.appendChild(achievementsViews);
    //filter for all, locked, or unlocked
    // let achievementsFilters = document.createElement('div');
    // achievementsFilters.id = 'achievements-filters';
    // achievementsFilters.classList.add('maps-progress-views');
    // achievementsHeaderBar.appendChild(achievementsFilters);

    // let achievementStatusFilter = document.createElement('div');
    // achievementStatusFilter.id = 'achievement-status-filter';
    // achievementStatusFilter.classList.add('maps-progress-views');
    // achievementStatusFilter.classList.add('black-outline');
    // achievementStatusFilter.innerHTML = "All";
    // achievementStatusFilter.addEventListener('click', () => {
    //     onChangeAchievementsFilter("all");
    // })
    // achievementsFilters.appendChild(achievementStatusFilter);

    // let mapsProgressViewsText = document.createElement('p');
    // mapsProgressViewsText.id = 'maps-progress-views-text';
    // mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text');
    // mapsProgressViewsText.classList.add('black-outline');
    // mapsProgressViewsText.innerHTML = "Filter:";
    // achievementsViews.appendChild(mapsProgressViewsText);

    // let achievementsGameView = document.createElement('div');
    // achievementsGameView.id = 'achievements-game-view';
    // achievementsGameView.classList.add('maps-progress-view');
    // achievementsGameView.classList.add('black-outline');
    // achievementsGameView.innerHTML = "Monkey Money";
    // achievementsGameView.addEventListener('click', () => {
    //     onChangeAchievementsRewardFilter("Monkey Money");
    // })
    // achievementsViews.appendChild(achievementsGameView);

    // let achievementsListView = document.createElement('div');
    // achievementsListView.id = 'achievements-list-view';
    // achievementsListView.classList.add('maps-progress-view');
    // achievementsListView.classList.add('black-outline');
    // achievementsListView.innerHTML = "Knowledge";
    // achievementsListView.addEventListener('click', () => {
    //     onChangeAchievementsRewardFilter("knowledge");
    // })
    // achievementsViews.appendChild(achievementsListView);

    let mapProgressFilterDifficulty2 = document.createElement('div');
    mapProgressFilterDifficulty2.id = 'map-progress-filter-difficulty';
    mapProgressFilterDifficulty2.classList.add('map-progress-filter-difficulty');
    achievementsViews.appendChild(mapProgressFilterDifficulty2);

    let mapsProgressFilterDifficultyText2 = document.createElement('p');
    mapsProgressFilterDifficultyText2.id = 'maps-progress-filter-difficulty-text';
    mapsProgressFilterDifficultyText2.classList.add('maps-progress-coop-toggle-text');
    mapsProgressFilterDifficultyText2.classList.add('black-outline');
    mapsProgressFilterDifficultyText2.innerHTML = "Filter:";
    mapProgressFilterDifficulty2.appendChild(mapsProgressFilterDifficultyText2);

    let mapProgressFilterDifficultySelect2 = document.createElement('select');
    mapProgressFilterDifficultySelect2.id = 'map-progress-filter-difficulty-select';
    mapProgressFilterDifficultySelect2.classList.add('map-progress-filter-difficulty-select');

    let options2 = ["None","Monkey Money","Knowledge Points","Insta Monkeys","Hidden Achievements"]
    options2.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect2.appendChild(difficultyOption);
    })
    mapProgressFilterDifficulty2.appendChild(mapProgressFilterDifficultySelect2);


    let mapsProgressFilter = document.createElement('div');
    mapsProgressFilter.id = 'maps-progress-filter';
    mapsProgressFilter.classList.add('maps-progress-filter');
    achievementsHeaderBar.appendChild(mapsProgressFilter);

    let mapProgressFilterDifficulty = document.createElement('div');
    mapProgressFilterDifficulty.id = 'map-progress-filter-difficulty';
    mapProgressFilterDifficulty.classList.add('map-progress-filter-difficulty');
    mapsProgressFilter.appendChild(mapProgressFilterDifficulty);

    let mapsProgressFilterDifficultyText = document.createElement('p');
    mapsProgressFilterDifficultyText.id = 'maps-progress-filter-difficulty-text';
    mapsProgressFilterDifficultyText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressFilterDifficultyText.classList.add('black-outline');
    mapsProgressFilterDifficultyText.innerHTML = "Display:";
    mapProgressFilterDifficulty.appendChild(mapsProgressFilterDifficultyText);

    let mapProgressFilterDifficultySelect = document.createElement('select');
    mapProgressFilterDifficultySelect.id = 'map-progress-filter-difficulty-select';
    mapProgressFilterDifficultySelect.classList.add('map-progress-filter-difficulty-select');
    mapProgressFilterDifficultySelect.addEventListener('change', () => {
        onChangeAchievementsFilter(mapProgressFilterDifficultySelect.value);
    })
    let options = ["All","Locked","Unlocked"]
    options.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect.appendChild(difficultyOption);
    })
    mapProgressFilterDifficulty.appendChild(mapProgressFilterDifficultySelect);

    let AchievementsContainer = document.createElement('div');
    AchievementsContainer.id = 'achievements-container';
    AchievementsContainer.classList.add('achievements-container');
    progressContent.appendChild(AchievementsContainer);

    mapProgressFilterDifficultySelect2.addEventListener('change', () => {
        onChangeAchievementRewardFilter(mapProgressFilterDifficultySelect2.value);
    })

    onChangeAchievementsFilter("All");
    onChangeAchievementRewardFilter("None")
    generateAchievementsGameView();
}

function generateAchievementsGameView(){
    //grid view
    let AchievementsContainer = document.getElementById('achievements-container');
    AchievementsContainer.innerHTML = "";

    let achievements = constants.achievementGameOrder;
    switch(currentAchievementFilter){
        case "Locked":
            achievements = achievements.filter(achievement => !btd6usersave.achievementsClaimed.includes(reverseAchievementNameFixMap[achievementsJSON[achievement].name] || achievementsJSON[achievement].name));
            break;
        case "Unlocked":
            achievements = achievements.filter(achievement => btd6usersave.achievementsClaimed.includes(reverseAchievementNameFixMap[achievementsJSON[achievement].name] || achievementsJSON[achievement].name));
            break;
        case "All":
            achievements = achievements.sort((a,b) => btd6usersave.achievementsClaimed.includes(reverseAchievementNameFixMap[achievementsJSON[a].name] || achievementsJSON[a].name) - btd6usersave.achievementsClaimed.includes(reverseAchievementNameFixMap[achievementsJSON[b].name] || achievementsJSON[b].name));
            break;
    }

    switch(currentAchievementRewardFilter){
        case "Monkey Money":
            achievements = achievements.filter(achievement => achievementsJSON[achievement].model.loot.includes("MonkeyMoney"));
            achievements = achievements.sort((a,b) => Object.values(processRewardsString(achievementsJSON[a].model.loot)).find(reward => reward.type == 'MonkeyMoney').amount - Object.values(processRewardsString(achievementsJSON[b].model.loot)).find(reward => reward.type == 'MonkeyMoney').amount)
            break;
        case "Knowledge Points":
            achievements = achievements.filter(achievement => achievementsJSON[achievement].model.loot.includes("KnowledgePoints"));
            break;
        case "Insta Monkeys":
            achievements = achievements.filter(achievement => achievementsJSON[achievement].model.loot.includes("InstaMonkey"));
            break;
        case "Hidden Achievements":
            achievements = achievements.filter(achievement => achievementsJSON[achievement].model.hidden);
            break;
    }

    if (achievements.length == 0) {
        let noDataFound = document.createElement('p');
        noDataFound.id = 'no-data-found';
        noDataFound.classList.add('no-data-found');
        noDataFound.classList.add('black-outline');
        noDataFound.innerHTML = "No Data Found.";
        noDataFound.style.width = "100%";
        AchievementsContainer.appendChild(noDataFound);
    }

    let fragment = document.createDocumentFragment();

    for (let id of achievements) {
        let achievementData = achievementsJSON[id];
        let achievementClaimed = btd6usersave.achievementsClaimed.includes(reverseAchievementNameFixMap[achievementData.name] || achievementData.name);

        let achievementDiv = document.createElement('div');
        achievementDiv.classList.add('achievement-div');
        fragment.appendChild(achievementDiv);

        let achievementTopDiv = document.createElement('div');
        achievementTopDiv.classList.add('achievement-top-div');
        achievementDiv.appendChild(achievementTopDiv);

        let achievementIconDiv = document.createElement('div');
        achievementIconDiv.classList.add('achievement-icon-div');
        achievementTopDiv.appendChild(achievementIconDiv);

        let achievementIconImg = document.createElement('img');
        achievementIconImg.classList.add('achievement-icon-img');
        achievementIconImg.src = getAchievementIcon(achievementData.model.achievementIcon, achievementClaimed ? false : achievementData.model.hidden);
        achievementIconDiv.appendChild(achievementIconImg);

        let achievementTextDiv = document.createElement('div');
        achievementTextDiv.classList.add('achievement-text-div');
        achievementTopDiv.appendChild(achievementTextDiv);

        let achievementNameText = document.createElement('p');
        achievementNameText.classList.add('achievement-name-text');
        achievementNameText.classList.add('black-outline');
        achievementNameText.innerHTML = achievementClaimed ? getLocValue(`Achievement ${achievementData.model.achievementId} Name`) : achievementData.model.hidden ? "???" : getLocValue(`Achievement ${achievementData.model.achievementId} Name`);
        achievementTextDiv.appendChild(achievementNameText);

        let achievementDescText = document.createElement('p');
        achievementDescText.classList.add('achievement-desc-text');
        let achievementDesc = achievementClaimed ? getLocValue(`Achievement ${achievementData.model.achievementId} Description`) : achievementData.model.hidden ? "???" : getLocValue(`Achievement ${achievementData.model.achievementId} Description`);
        achievementDescText.innerHTML = achievementDesc.indexOf("{0}") != -1 ? achievementDesc.replace("{0}", achievementData.model.achievementGoal.toLocaleString()) : achievementDesc;
        achievementTextDiv.appendChild(achievementDescText);

        let achievementBottomDiv = document.createElement('div');
        achievementBottomDiv.classList.add('achievement-bottom-div');
        achievementDiv.appendChild(achievementBottomDiv);

        let achievementRewardsDiv = document.createElement('div');
        achievementRewardsDiv.classList.add('achievement-rewards-div');
        achievementBottomDiv.appendChild(achievementRewardsDiv);

        for (let [index, data] of Object.entries(processRewardsString(achievementData.model.loot))) {
            let achievementRewardDiv = document.createElement('div');
            achievementRewardDiv.classList.add('achievement-reward-div');
            achievementRewardsDiv.appendChild(achievementRewardDiv);

            let achievementRewardImg = document.createElement('img');
            achievementRewardImg.classList.add('achievement-reward-img');
            achievementRewardImg.src = getRewardIcon(data);
            achievementRewardDiv.appendChild(achievementRewardImg);

            let achievementRewardText = document.createElement('p');
            achievementRewardText.classList.add('achievement-reward-text');
            achievementRewardText.classList.add('black-outline');
            let text = "";
            switch (data.type) {
                case "InstaMonkey":
                    text = data.tiers.split("").join("-")
                    break;
                case "Knowledge":
                    text = "+ " + data.amount.toLocaleString()
                    break;
                case "Power":
                case "RandomInstaMonkey":
                    text = "X " + data.amount.toLocaleString()
                    break;
                default:
                    text = data.amount ? data.amount.toLocaleString() : "";
                    break;
            }
            achievementRewardText.innerHTML = text;
            achievementRewardDiv.appendChild(achievementRewardText);
        }

        if(achievementClaimed) {
            let achievementCompletedCheck = document.createElement('img');
            achievementCompletedCheck.classList.add('achievement-completed-check');
            achievementCompletedCheck.src = "./Assets/UI/TickGreenIcon.png";
            achievementBottomDiv.appendChild(achievementCompletedCheck);
        }
    }

    AchievementsContainer.appendChild(fragment);
    //top div
    //icon div
    //icon img
    //name text
    //desc text
    //bottom div
    //rewards div
    //looped reward div
    //looped reward img
    //looped reward text
    //completed check
}

function generateExtrasProgress() {
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let extrasProgressContainer = document.createElement('div');
    extrasProgressContainer.id = 'extras-progress-container';
    extrasProgressContainer.classList.add('extras-progress-container');
    progressContent.appendChild(extrasProgressContainer);

    let extras = [["Big Bloons", "BigBloonsMode"],["Small Bloons", "SmallBloonsMode"],["Big Monkey Towers","BigTowersMode"],["Small Monkey Towers", "SmallTowersMode"],["Small Bosses","SmallBossesMode"]]

    for (let [name, loc] of extras) {
        if (!extrasUnlocked[name]) { continue; }
        let extraProgressDiv = document.createElement('div');
        extraProgressDiv.classList.add('extra-progress-div');
        extrasProgressContainer.appendChild(extraProgressDiv);

        let extraProgressImg = document.createElement('img');
        extraProgressImg.classList.add('extra-progress-img');
        extraProgressImg.src = `./Assets/UI/${loc}Icon.png`;
        extraProgressDiv.appendChild(extraProgressImg);

        let extraProgressText = document.createElement('p');
        extraProgressText.classList.add('extra-progress-text');
        extraProgressText.classList.add('black-outline');
        extraProgressText.innerHTML = getLocValue(loc);
        extraProgressDiv.appendChild(extraProgressText);
    }
}

function onChangeAchievementsFilter(filter){
    currentAchievementFilter = filter;
    generateAchievementsGameView();
}

function onChangeAchievementRewardFilter(filter){
    currentAchievementRewardFilter = filter;
    generateAchievementsGameView();
}

function generateEvents(){
    let eventsContent = document.getElementById('events-content');
    eventsContent.innerHTML = "";

    // let noDataFound = document.createElement('p');
    // noDataFound.id = 'no-data-found';
    // noDataFound.classList.add('no-data-found');
    // noDataFound.classList.add('black-outline');
    // noDataFound.innerHTML = "Coming Soon";
    // extrasContent.appendChild(noDataFound);

    let eventsPage = document.createElement('div');
    eventsPage.id = 'events-page';
    eventsPage.classList.add('progress-page');
    eventsContent.appendChild(eventsPage);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.id = 'selectors-div-events';
    selectorsDiv.classList.add('selectors-div');
    eventsPage.appendChild(selectorsDiv);

    let selectors = {
        'Races': {
            'img': 'EventRaceBtn',
            'text': "Races",
            'bgimg': 'EventBannerSmallRaces'
        },
        'Bosses': {
            'img': 'BossesBtn',
            'text': "Bosses",
            'bgimg': 'EventBannerSmallNoBoss'
        },
        'Odyssey': {
            'img': 'OdysseyEventBtn',
            'text': "Odyssey (Coming Soon)",
            'bgimg': 'EventBannerSmallOdyssey'
        },
        'ContestedTerritory': {
            'img': 'ContestedTerritoryEventBtn',
            'text': "Contested Territory",
            'bgimg': 'EventBannerSmallCT'
        },
        'DailyChallenges': {
            'img': 'DailyChallengeBtn',
            'text': "Daily Challenges",
            'bgcolor': 'radial-gradient(circle, transparent 50%, rgba(0,0,0,1) 100%),linear-gradient(45deg, rgb(70,148,213), rgb(70,148,213))'
        },
        'AdvancedDailyChallenges': {
            'img': 'DailyChallengeBtn',
            'text': "Advanced Daily Challenges",
            'bgcolor': 'radial-gradient(circle, transparent 50%, rgba(0,0,0,1) 100%),linear-gradient(45deg, rgb(234,99,52), rgb(234,99,52))'
        },
        'CoopDailyChallenges': {
            'img': 'DailyChallengeBtn',
            'text': "Coop Challenges",
            'bgcolor': 'radial-gradient(circle, transparent 50%, rgba(0,0,0,1) 100%),linear-gradient(45deg, rgb(255,150,0), rgb(255,150,0))'
        }
    }

    Object.entries(selectors).forEach(([selector,object]) => {
        let selectorDiv = document.createElement('div');
        selectorDiv.id = selector.toLowerCase() + '-div';
        selectorDiv.classList.add('events-selector-div');
        object.bgcolor ? selectorDiv.style.background = object.bgcolor : selectorDiv.style.backgroundImage = `url(../Assets/EventBanner/${object.bgimg}.png)`;
        /*selectorDiv.innerHTML = progressSubText[selector];*/
        selectorDiv.addEventListener('click', () => {
            changeEventTab(selector);
        })
        selectorsDiv.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
        selectorImg.id = selector.toLowerCase() + '-img';
        selectorImg.classList.add('selector-img');
        selectorImg.src = `../Assets/UI/${object.img}.png`;
        selectorDiv.appendChild(selectorImg);

        let selectorText = document.createElement('p');
        selectorText.id = selector.toLowerCase() + '-text';
        selectorText.classList.add('event-selector-text');
        selectorText.classList.add('black-outline');
        selectorText.innerHTML = object.text;
        selectorDiv.appendChild(selectorText);

        let selectorGoImg = document.createElement('img');
        selectorGoImg.id = selector.toLowerCase() + '-go-img';
        selectorGoImg.classList.add('selector-go-img');
        selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
        selectorDiv.appendChild(selectorGoImg);
    })
}

function changeEventTab(selector){
    resetScroll();
    if(timerInterval) { clearInterval(timerInterval); }
    switch(selector){
        case 'Races':
            showLoading();
            getRacesData();
            break;
        case 'Bosses':
            showLoading();
            getBossesData();
            break;
        case "Odyssey":
            break;
        case "ContestedTerritory":
            getCTData();
            break;
        case "DailyChallenges":
            showLoading();
            generateChallenges("DailyChallenges");
            break;
        case "AdvancedDailyChallenges":
            showLoading();
            generateChallenges("AdvancedDailyChallenges");
            break;
        case "CoopDailyChallenges":
            showLoading();
            generateChallenges("CoopDailyChallenges");
            break;
    }
}

function generateRaces(){
    let eventsContent = document.getElementById('events-content');
    eventsContent.innerHTML = "";

    Object.values(racesData).forEach((race, index) => {
        let raceDiv = document.createElement('div');
        raceDiv.classList.add("race-div");
        eventsContent.appendChild(raceDiv);

        let raceMapDiv = document.createElement('div');
        raceMapDiv.classList.add("race-map-div", "silver-border");
        raceDiv.appendChild(raceMapDiv);

        let raceMapImg = document.createElement('img');
        raceMapImg.classList.add("race-map-img");
        raceMapImg.src = "./Assets/MapIcon/MapLoadingImage.png"
        raceMapDiv.appendChild(raceMapImg);

        let raceChallengeIcons = document.createElement('div');
        raceChallengeIcons.classList.add("race-challenge-icons");
        raceMapDiv.appendChild(raceChallengeIcons);

        let raceMapRounds = document.createElement('p');
        raceMapRounds.classList.add("race-map-rounds", 'black-outline');
        raceMapDiv.appendChild(raceMapRounds);

        let raceInfoDiv = document.createElement('div');
        raceInfoDiv.classList.add("race-info-div");
        raceDiv.appendChild(raceInfoDiv);

        let raceInfoTopDiv = document.createElement('div');
        raceInfoTopDiv.classList.add("race-info-top-div");
        raceInfoDiv.appendChild(raceInfoTopDiv);

        let raceInfoMiddleDiv = document.createElement('div');
        raceInfoMiddleDiv.classList.add("race-info-middle-div");
        raceInfoDiv.appendChild(raceInfoMiddleDiv);

        let raceInfoBottomDiv = document.createElement('div');
        raceInfoBottomDiv.classList.add("race-info-bottom-div");
        raceInfoDiv.appendChild(raceInfoBottomDiv);

        let raceInfoName = document.createElement('p');
        raceInfoName.classList.add("race-info-name", "black-outline");
        raceInfoName.innerHTML = race.name;
        raceInfoTopDiv.appendChild(raceInfoName);

        let raceTimeLeft = document.createElement('p');
        raceTimeLeft.id = 'race-time-left';
        raceTimeLeft.classList.add("race-time-left", "black-outline");
        raceTimeLeft.innerHTML = "Finished";
        raceInfoTopDiv.appendChild(raceTimeLeft);    
        if(new Date() < new Date(race.start)) {
            raceTimeLeft.innerHTML = "Coming Soon!";
        } else if (new Date(race.end) > new Date()) {
            updateTimer(new Date(race.end), raceTimeLeft.id);
            timerInterval = setInterval(() => updateTimer(new Date(race.end), raceTimeLeft.id), 1000)
        }

        let raceInfoDates = document.createElement('p');
        raceInfoDates.classList.add("race-info-dates", "black-outline");
        //formatted as "XX/XX/XX XX:XX - XX/XX/XX XX:XX"
        raceInfoDates.innerHTML = `${new Date(race.start).toLocaleDateString()} - ${new Date(race.end).toLocaleDateString()}`;
        raceInfoMiddleDiv.appendChild(raceInfoDates);

        let raceInfoTotalScores = document.createElement('p');
        raceInfoTotalScores.classList.add("race-info-total-scores", "black-outline");
        raceInfoTotalScores.innerHTML = `Total Scores: ${race.totalScores == 0 ? "No Data" : race.totalScores.toLocaleString()}`
        raceInfoMiddleDiv.appendChild(raceInfoTotalScores);

        let raceInfoRules = document.createElement('div');
        raceInfoRules.classList.add("race-info-rules", "start-button", "black-outline");
        raceInfoRules.innerHTML = "Details"
        raceInfoRules.addEventListener('click', () => {
            showLoading();
            showChallengeModel('events', race.metadata, "Race");
        })
        raceInfoBottomDiv.appendChild(raceInfoRules);

        let raceInfoLeaderboard = document.createElement('div');
        raceInfoLeaderboard.classList.add("race-info-leaderboard", "where-button", "black-outline");
        raceInfoLeaderboard.innerHTML = "Leaderboard"
        raceInfoLeaderboard.addEventListener('click', () => {
            showLeaderboard('events', race, "Race");
        })
        raceInfoBottomDiv.appendChild(raceInfoLeaderboard);

        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(async entry => {
                if (entry.isIntersecting) {
                    await getRaceMetadata(index);
                    if (typeof racesData[index]["metadata"] != 'string') {
                        console.log(race.metadata)
                        observer.unobserve(entry.target);
                        raceMapImg.src = Object.keys(constants.mapsInOrder).includes(race.metadata.map) ? getMapIcon(race.metadata.map) : race.metadata.mapURL;
                        let modifiers = challengeModifiers(race.metadata);
                        let rules = challengeRules(race.metadata)
                        for (let modifier of Object.values(modifiers)) {
                            console.log(modifier)
                            let challengeModifierIcon = document.createElement('img');
                            challengeModifierIcon.classList.add('challenge-modifier-icon-event');
                            challengeModifierIcon.src = `./Assets/ChallengeRulesIcon/${modifier.icon}.png`;
                            raceChallengeIcons.appendChild(challengeModifierIcon);
                        }
                        for (let rule of rules) {
                            console.log(rule)
                            if (rule == "No Round 100 Reward") { continue; }
                            if (rule == "Paragon Limit") { continue; }
                            let challengeRuleIcon = document.createElement('img');
                            challengeRuleIcon.classList.add('challenge-rule-icon-event');
                            challengeRuleIcon.src = `./Assets/ChallengeRulesIcon/${rulesMap[rule]}.png`;
                            raceChallengeIcons.appendChild(challengeRuleIcon);
                        }
                        raceMapRounds.innerHTML = `Rounds ${race.metadata.startRound}/${race.metadata.endRound}`
                    }
                }
            });
        });
        observer.observe(raceMapDiv);
    })
}

function generateBosses(elite){
    let eventsContent = document.getElementById('events-content');
    eventsContent.innerHTML = "";

    let switchBanner = document.createElement('div');
    switchBanner.classList.add('switch-banner');
    switchBanner.style.backgroundImage = `url(../Assets/UI/${!showElite ? "Elite" : ""}Ribbon.png)`;
    eventsContent.appendChild(switchBanner);

    let switchBossDiv = document.createElement('div');
    switchBossDiv.classList.add("switch-boss-div");
    switchBanner.appendChild(switchBossDiv);

    let bosses = ["Bloonarius", "Lych", "Vortex", "Dreadbloon", "Phayze"]

    for (let boss of bosses) {
        let bossIcon = document.createElement('img')
        bossIcon.classList.add("switch-boss-img");
        bossIcon.src = `./Assets/BossIcon/${boss}Portrait${!showElite ? "Elite" : ""}.png`
        switchBossDiv.appendChild(bossIcon);
    }

    let switchText = document.createElement('p');
    switchText.classList.add('switch-text', 'black-outline');
    switchText.innerHTML = `Switch to ${!showElite ? "Elite" : "Standard"}  Bosses`;
    switchBanner.appendChild(switchText);

    switchBanner.addEventListener('click', () => {
        showElite = !showElite;
        if (timerInterval) { clearInterval(timerInterval); }
        generateBosses(showElite);
    })

    // let switchRightDiv = document.createElement('div');
    // switchRightDiv.classList.add("switch-right-div");
    // switchBanner.appendChild(switchRightDiv);

    // let switchGoImg = document.createElement('img');
    // switchGoImg.classList.add('leaderboard-go-img');
    // switchGoImg.src = '../Assets/UI/ContinueBtn.png';
    // switchRightDiv.appendChild(switchGoImg);


    Object.values(bossesData).forEach((race, index) => {
        //get only the numbers
        let titleCaseBoss = race.bossType.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        let bossNumber = race.name.replace(/\D/g,'');
        let bossName = `${elite ? "Elite" : ""} ${titleCaseBoss} ${bossNumber}`;

        let eventData = {
            'name': titleCaseBoss,
            'elite': elite,
            'eventNumber': bossNumber,
            'scoringType': race.scoringType
        }

        let raceDiv = document.createElement('div');
        raceDiv.classList.add("race-div");
        raceDiv.style.backgroundImage = `url(../Assets/EventBanner/EventBannerSmall${titleCaseBoss}.png)`;
        eventsContent.appendChild(raceDiv);

        let raceMapDiv = document.createElement('div');
        raceMapDiv.classList.add("race-map-div", "boss-border");
        raceDiv.appendChild(raceMapDiv);

        let raceMapImg = document.createElement('img');
        raceMapImg.classList.add("race-map-img");
        raceMapImg.src = "./Assets/MapIcon/MapLoadingImage.png"
        raceMapDiv.appendChild(raceMapImg);

        let bossMapBossIcon = document.createElement('img')
        bossMapBossIcon.classList.add("boss-map-boss-icon");
        //make race.bossType title case
        bossMapBossIcon.src = `./Assets/BossIcon/${titleCaseBoss}Portrait${elite ? "Elite" : ""}.png`
        raceMapDiv.appendChild(bossMapBossIcon);

        let raceChallengeIcons = document.createElement('div');
        raceChallengeIcons.classList.add("race-challenge-icons");
        raceMapDiv.appendChild(raceChallengeIcons);

        let raceMapRounds = document.createElement('p');
        raceMapRounds.classList.add("race-map-rounds");
        raceMapDiv.appendChild(raceMapRounds);

        let raceInfoDiv = document.createElement('div');
        raceInfoDiv.classList.add("race-info-div","boss-info-div");
        raceDiv.appendChild(raceInfoDiv);

        let raceInfoTopDiv = document.createElement('div');
        raceInfoTopDiv.classList.add("race-info-top-div");
        raceInfoDiv.appendChild(raceInfoTopDiv);

        let raceInfoMiddleDiv = document.createElement('div');
        raceInfoMiddleDiv.classList.add("race-info-middle-div");
        raceInfoDiv.appendChild(raceInfoMiddleDiv);

        let raceInfoBottomDiv = document.createElement('div');
        raceInfoBottomDiv.classList.add("race-info-bottom-div", elite ? "btn-rotate-boss-elite" : "btn-rotate-boss");
        raceInfoDiv.appendChild(raceInfoBottomDiv);

        let raceInfoName = document.createElement('p');
        raceInfoName.classList.add("race-info-name", "black-outline");
        raceInfoName.innerHTML = bossName;
        raceInfoTopDiv.appendChild(raceInfoName);

        let bossTimeLeft = document.createElement('p');
        bossTimeLeft.id = 'boss-time-left';
        bossTimeLeft.classList.add("race-time-left", "black-outline");
        bossTimeLeft.innerHTML = "Finished";
        raceInfoTopDiv.appendChild(bossTimeLeft);    
        if(new Date() < new Date(race.start)) {
            bossTimeLeft.innerHTML = "Coming Soon!";
        } else if (new Date(race.end) > new Date()) {
            updateTimer(new Date(race.end), bossTimeLeft.id);
            timerInterval = setInterval(() => updateTimer(new Date(race.end), bossTimeLeft.id), 1000)
        }

        let raceInfoDates = document.createElement('p');
        raceInfoDates.classList.add("race-info-dates", "black-outline");
        //formatted as "XX/XX/XX XX:XX - XX/XX/XX XX:XX"
        raceInfoDates.innerHTML = `${new Date(race.start).toLocaleDateString()} - ${new Date(race.end).toLocaleDateString()}`;
        raceInfoMiddleDiv.appendChild(raceInfoDates);

        let raceInfoTotalScores = document.createElement('p');
        raceInfoTotalScores.classList.add("race-info-total-scores", "black-outline");
        raceInfoTotalScores.innerHTML = `Total Scores: ${(elite ? race.totalScores_elite : race.totalScores_standard) == 0 ? "No Data" : (elite ? race.totalScores_elite : race.totalScores_standard).toLocaleString()}`
        raceInfoMiddleDiv.appendChild(raceInfoTotalScores);

        let raceInfoRules = document.createElement('div');
        raceInfoRules.classList.add("race-info-rules", "start-button", "black-outline");
        raceInfoRules.innerHTML = "Details"
        raceInfoRules.addEventListener('click', () => {
            showLoading();
            showChallengeModel('events', (elite ? race.metadataElite : race.metadataStandard),"Boss", eventData);
        })
        raceInfoBottomDiv.appendChild(raceInfoRules);

        let raceInfoLeaderboard = document.createElement('div');
        raceInfoLeaderboard.classList.add("race-info-leaderboard", "start-button", "black-outline");
        raceInfoLeaderboard.innerHTML = "Leaderboard"
        raceInfoLeaderboard.addEventListener('click', () => {
            showLeaderboard('events', race, elite ? "BossElite" : "Boss");
        })
        raceInfoBottomDiv.appendChild(raceInfoLeaderboard);

        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(async entry => {
                if (entry.isIntersecting) {
                    await getBossMetadata(index, elite);
                    if (typeof bossesData[index][elite ? "metadataElite" : "metadataStandard"] != 'string') {
                        let challengeScoreTypeIcon = document.createElement('img');
                        challengeScoreTypeIcon.classList.add('challenge-modifier-icon-event');
                        switch(race.scoringType){
                            case "LeastCash":
                                challengeScoreTypeIcon.src = `./Assets/ChallengeRulesIcon/LeastCashIcon.png`;
                                raceChallengeIcons.appendChild(challengeScoreTypeIcon);
                                break;
                            case "LeastTiers":
                                challengeScoreTypeIcon.src = `./Assets/ChallengeRulesIcon/LeastTiersIcon.png`;
                                raceChallengeIcons.appendChild(challengeScoreTypeIcon);
                                break;
                        }
                        console.log(elite ? race.metadataElite : race.metadataStandard)
                        observer.unobserve(entry.target);
                        let modifiers = challengeModifiers(elite ? race.metadataElite : race.metadataStandard);
                        let rules = challengeRules(elite ? race.metadataElite : race.metadataStandard)
                        for (let modifier of Object.values(modifiers)) {
                            console.log(modifier)
                            let challengeModifierIcon = document.createElement('img');
                            challengeModifierIcon.classList.add('challenge-modifier-icon-event');
                            challengeModifierIcon.src = `./Assets/ChallengeRulesIcon/${modifier.icon}.png`;
                            raceChallengeIcons.appendChild(challengeModifierIcon);
                        }
                        for (let rule of rules) {
                            console.log(rule)
                            if (rule == "No Round 100 Reward") { continue; }
                            let challengeRuleIcon = document.createElement('img');
                            challengeRuleIcon.classList.add('challenge-rule-icon-event');
                            challengeRuleIcon.src = `./Assets/ChallengeRulesIcon/${rulesMap[rule]}.png`;
                            raceChallengeIcons.appendChild(challengeRuleIcon);
                        }
                        raceMapImg.src = Object.keys(constants.mapsInOrder).includes(elite ? race.metadataElite.map : race.metadataStandard.map) ? getMapIcon(elite ? race.metadataElite.map : race.metadataStandard.map) : elite ? race.metadataElite.mapURL : race.metadataStandard.mapURL;
                    }
                }
            });
        });
        observer.observe(raceMapDiv);
    })
}

function generateCTs(){
    let eventsContent = document.getElementById('events-content');
    eventsContent.innerHTML = "";

    Object.values(CTData).forEach((race, index) => {
        let raceDiv = document.createElement('div');
        raceDiv.classList.add("race-div", "ct-div");
        raceDiv.style.backgroundImage = `url(../Assets/ProfileBanner/TeamsBanner8.png)`;
        eventsContent.appendChild(raceDiv);

        // let raceMapDiv = document.createElement('div');
        // raceMapDiv.classList.add("race-map-div", "silver-border");
        // raceDiv.appendChild(raceMapDiv);

        // let raceMapImg = document.createElement('img');
        // raceMapImg.classList.add("race-map-img");
        // raceMapImg.src = "./Assets/EventBanner/EventBannerSmallCT.png"
        // raceMapDiv.appendChild(raceMapImg);

        let raceInfoDiv = document.createElement('div');
        raceInfoDiv.classList.add("ct-info-div");
        raceDiv.appendChild(raceInfoDiv);

        let raceInfoTopDiv = document.createElement('div');
        raceInfoTopDiv.classList.add("ct-info-top-div");
        raceInfoDiv.appendChild(raceInfoTopDiv);

        let raceInfoBottomDiv = document.createElement('div');
        raceInfoBottomDiv.classList.add("ct-info-bottom-div");
        raceInfoDiv.appendChild(raceInfoBottomDiv);

        let raceInfoName = document.createElement('p');
        raceInfoName.classList.add("race-info-name", "black-outline");
        raceInfoName.innerHTML = "Contested Territory";
        raceInfoTopDiv.appendChild(raceInfoName);

        let raceTimeLeft = document.createElement('p');
        raceTimeLeft.id = 'race-time-left';
        raceTimeLeft.classList.add("race-time-left", "black-outline");
        raceTimeLeft.innerHTML = "Finished";
        raceInfoTopDiv.appendChild(raceTimeLeft);    
        if(new Date() < new Date(race.start)) {
            raceTimeLeft.innerHTML = "Coming Soon!";
        } else if (new Date(race.end) > new Date()) {
            updateTimer(new Date(race.end), raceTimeLeft.id);
            timerInterval = setInterval(() => updateTimer(new Date(race.end), raceTimeLeft.id), 1000)
        }

        let ctInfoLeftDiv = document.createElement('div');
        ctInfoLeftDiv.classList.add("ct-info-left-div");
        raceInfoBottomDiv.appendChild(ctInfoLeftDiv);

        let raceInfoDates = document.createElement('p');
        raceInfoDates.classList.add("race-info-dates", "ct-info-dates", "black-outline");
        //formatted as "XX/XX/XX XX:XX - XX/XX/XX XX:XX"
        raceInfoDates.innerHTML = `${new Date(race.start).toLocaleDateString()} - ${new Date(race.end).toLocaleDateString()}`;
        ctInfoLeftDiv.appendChild(raceInfoDates);

        let raceInfoRules = document.createElement('div');
        raceInfoRules.classList.add("race-info-rules", "start-button", "currency-trophies-div", "black-outline");
        raceInfoRules.innerHTML = "Relic Reveal"
        raceInfoRules.addEventListener('click', () => {
            // showChallengeModel('events', race.metadata, "CT");
            console.log(race);
            showLoading();
            openRelics('events', race.tiles, `${new Date(race.start).toLocaleDateString()} - ${new Date(race.end).toLocaleDateString()}`)
        })
        ctInfoLeftDiv.appendChild(raceInfoRules);

        let CTLeaderboardsDiv = document.createElement('div');
        CTLeaderboardsDiv.classList.add("ct-leaderboards-div");
        raceInfoBottomDiv.appendChild(CTLeaderboardsDiv);

        let CTLeaderboardsHeader = document.createElement('p');
        CTLeaderboardsHeader.classList.add("ct-leaderboards-header", "black-outline");
        CTLeaderboardsHeader.innerHTML = "Leaderboards";
        CTLeaderboardsDiv.appendChild(CTLeaderboardsHeader);

        let CTLeaderboardsBtns = document.createElement('div');
        CTLeaderboardsBtns.classList.add("ct-leaderboards-btns");
        CTLeaderboardsDiv.appendChild(CTLeaderboardsBtns);

        let ctPlayerLeaderboard = document.createElement('div');
        ctPlayerLeaderboard.classList.add("race-info-leaderboard", "ct-info-leaderboard", "start-button", "blue-btn", "black-outline");
        ctPlayerLeaderboard.innerHTML = "Players"
        ctPlayerLeaderboard.addEventListener('click', () => {
            showLeaderboard('events', race, "CTPlayer");
        })
        CTLeaderboardsBtns.appendChild(ctPlayerLeaderboard);

        let ctTeamsLeaderboard = document.createElement('div');
        ctTeamsLeaderboard.classList.add("race-info-leaderboard", "ct-info-leaderboard", "start-button", "blue-btn", "black-outline");
        ctTeamsLeaderboard.innerHTML = "Teams"
        ctTeamsLeaderboard.addEventListener('click', () => {
            showLeaderboard('events', race, "CTTeam");
        })
        CTLeaderboardsBtns.appendChild(ctTeamsLeaderboard);

        let raceInfoMiddleDiv = document.createElement('div');
        raceInfoMiddleDiv.classList.add("race-info-middle-div", "ct-info-middle-div");
        CTLeaderboardsDiv.appendChild(raceInfoMiddleDiv);

        let raceInfoTotalScores = document.createElement('p');
        raceInfoTotalScores.classList.add("race-info-total-scores", "black-outline");
        raceInfoTotalScores.innerHTML = `Total Scores: ${race.totalScores_player == 0 ? "No Data" : race.totalScores_player.toLocaleString()}`
        raceInfoMiddleDiv.appendChild(raceInfoTotalScores);

        let raceInfoTotalScores2 = document.createElement('p');
        raceInfoTotalScores2.classList.add("race-info-total-scores", "black-outline");
        raceInfoTotalScores2.innerHTML = `Total Scores: ${race.totalScores_team == 0 ? "No Data" : race.totalScores_team.toLocaleString()}`
        raceInfoMiddleDiv.appendChild(raceInfoTotalScores2);
    })
}

async function generateChallenges(type) {
    let eventsContent = document.getElementById('events-content');
    eventsContent.innerHTML = "";

    await getDailyChallengesData();

    //filter the challenges that include "Standard", "Advanced", "coop" as the beginning of the name key if the type is DailyChallenges, AdvancedDailyChallenges, CoopDailyChallenges
    let challenges = Object.values(DCData).filter(challenge => {
        switch (type) {
            case "DailyChallenges":
                return challenge.name.startsWith("Standard");
            case "AdvancedDailyChallenges":
                return challenge.name.startsWith("Advanced");
            case "CoopDailyChallenges":
                return challenge.name.startsWith("coop");
        }
    })

    // if CoopDailyChallenges, filter challenge.createdAt at a new Date and check if it less than the current day
    let now = new Date();

    if (type == "CoopDailyChallenges") {
        challenges = challenges.filter(challenge => new Date(challenge.createdAt) < now);
        challenges = challenges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    let latestChallenge = 0;

    Object.values(challenges).forEach((challenge, index) => {
        let regex = /^(Standard|Advanced|coop)(?: (\d+))?: (.*)$/;
        let match = challenge.name.match(regex);

        let challengeType = "";
        let challengeNumber = "";
        let challengeName = "";

        if (match) {
            challengeType = match[1] || null;
            challengeNumber = match[2] || null;
            challengeName = match[3] || null;

            if (challengeNumber != null && challengeNumber > latestChallenge) {
                latestChallenge = challengeNumber;
            }
        }

        let challengeDiv = document.createElement('div');
        challengeDiv.classList.add("race-div", "event-challenge-div");
        eventsContent.appendChild(challengeDiv);

        let challengeMapDiv = document.createElement('div');
        challengeMapDiv.classList.add("race-map-div", "silver-border");
        challengeDiv.appendChild(challengeMapDiv);

        let challengeMapImg = document.createElement('img');
        challengeMapImg.classList.add("race-map-img");
        challengeMapImg.src = "./Assets/MapIcon/MapLoadingImage.png"
        challengeMapDiv.appendChild(challengeMapImg);

        let challengeChallengeIcons = document.createElement('div');
        challengeChallengeIcons.classList.add("race-challenge-icons");
        challengeMapDiv.appendChild(challengeChallengeIcons);

        let challengeMapRounds = document.createElement('p');
        challengeMapRounds.classList.add("race-map-rounds", 'black-outline');
        challengeMapDiv.appendChild(challengeMapRounds);

        let challengeInfoDiv = document.createElement('div');
        challengeInfoDiv.classList.add("race-info-div");
        challengeDiv.appendChild(challengeInfoDiv);

        let challengeInfoTopDiv = document.createElement('div');
        challengeInfoTopDiv.classList.add("challenge-info-top-div");
        challengeInfoDiv.appendChild(challengeInfoTopDiv);

        let challengeInfoLeftRight = document.createElement('div');
        challengeInfoLeftRight.classList.add("challenge-info-left-right");
        challengeInfoDiv.appendChild(challengeInfoLeftRight);

        let challengeInfoMiddleDiv = document.createElement('div');
        challengeInfoMiddleDiv.classList.add("challenge-info-middle-div");
        challengeInfoLeftRight.appendChild(challengeInfoMiddleDiv);

        let challengeInfoBottomDiv = document.createElement('div');
        challengeInfoBottomDiv.classList.add("challenge-info-bottom-div");
        challengeInfoLeftRight.appendChild(challengeInfoBottomDiv);

        let challengeInfoName = document.createElement('p');
        challengeInfoName.classList.add("challenge-info-name", "black-outline");
        // challengeInfoName.innerHTML = challenge.name.replace("Standard ", "#").replace("Advanced ", "#").replace("coop - ", "");
        challengeInfoName.innerHTML = type == "CoopDailyChallenges" ? challenge.name.replace("coop - ", "") : challengeName;
        challengeInfoTopDiv.appendChild(challengeInfoName);

        //challengeDate
        let challengeDate = document.createElement('p');
        challengeDate.classList.add("challenge-date", "black-outline");
        challengeDate.innerHTML = `${new Date(challenge.createdAt).toLocaleDateString()}`;
        challengeInfoMiddleDiv.appendChild(challengeDate);

        let challengeTypeText = document.createElement('p');
        challengeTypeText.classList.add("challenge-date", "black-outline");
        challengeTypeText.innerHTML = type == "CoopDailyChallenges" ? "Coop" : `${challengeType} ${challengeNumber}`;
        challengeInfoMiddleDiv.appendChild(challengeTypeText);

        // if (challengeNumber != null) {
        //     let challengeNumberText = document.createElement('p');
        //     challengeNumberText.classList.add("challenge-date", "black-outline");
        //     challengeNumberText.innerHTML = challengeNumber;
        //     challengeInfoMiddleDiv.appendChild(challengeNumberText);
        // }

        let challengeInfoRules = document.createElement('div');
        challengeInfoRules.classList.add("challenge-info-rules", "start-button", "black-outline");
        challengeInfoRules.innerHTML = "Details"
        challengeInfoRules.addEventListener('click', async () => {
            showLoading();
            showChallengeModel('events', await getChallengeMetadata(challenge.id), type);
        })
        challengeInfoMiddleDiv.appendChild(challengeInfoRules);

        let challengeStats = ["Attempts", "Wins", "Fails", "Unique Players", "Victorious Players"]

        let challengeStatsDiv = document.createElement('div');
        challengeStatsDiv.classList.add("challenge-stats-div");
        challengeInfoBottomDiv.appendChild(challengeStatsDiv);

        for (let value of challengeStats) {
            let challengeStat = document.createElement('div');
            challengeStat.classList.add("challenge-stat");
            challengeStatsDiv.appendChild(challengeStat);

            let challengeStatKey = document.createElement('p');
            challengeStatKey.classList.add("challenge-stat-key");
            challengeStatKey.innerHTML = value;
            challengeStat.appendChild(challengeStatKey);

            let challengeStatValue = document.createElement('p');
            challengeStatValue.id = `${challenge.id}-${value}`
            challengeStatValue.classList.add("challenge-stat-value");
            challengeStatValue.innerHTML = "Loading...";
            challengeStat.appendChild(challengeStatValue);
        }

        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(async entry => {
                if (entry.isIntersecting) {
                    let challengeData = await getChallengeMetadata(challenge.id);
                    observer.unobserve(entry.target);
                    if (challengeData != null) {
                        let modifiers = challengeModifiers(challengeData);
                        let rules = challengeRules(challengeData)
                        for (let modifier of Object.values(modifiers)) {
                            console.log(modifier)
                            let challengeModifierIcon = document.createElement('img');
                            challengeModifierIcon.classList.add('challenge-modifier-icon-event');
                            challengeModifierIcon.src = `./Assets/ChallengeRulesIcon/${modifier.icon}.png`;
                            challengeChallengeIcons.appendChild(challengeModifierIcon);
                        }
                        for (let rule of rules) {
                            console.log(rule)
                            if (rule == "No Round 100 Reward" && type != "AdvancedDailyChallenges") { continue; }
                            if (rule == "Paragon Limit") { continue; }
                            let challengeRuleIcon = document.createElement('img');
                            challengeRuleIcon.classList.add('challenge-rule-icon-event');
                            challengeRuleIcon.src = `./Assets/ChallengeRulesIcon/${rulesMap[rule]}.png`;
                            challengeChallengeIcons.appendChild(challengeRuleIcon);
                        }
                        challengeMapImg.src = Object.keys(constants.mapsInOrder).includes(challengeData.map) ? getMapIcon(challengeData.map) : challengeData.mapURL;
                        challengeMapRounds.innerHTML = `Rounds ${challengeData.startRound}/${challengeData.endRound}`
                        challengeStats = {
                            "Attempts": challengeData.plays + challengeData.restarts,
                            "Wins": challengeData.winsUnique,
                            "Fails": challengeData.lossesUnique + challengeData.restarts,
                            "Unique Players": challengeData.playsUnique,
                            "Victorious Players": challengeData.winsUnique,
                        }
                        for (let [key, value] of Object.entries(challengeStats)) {
                            document.getElementById(`${challenge.id}-${key}`).innerHTML = value.toLocaleString();
                        }
                    }
                }
            });
        });
        observer.observe(challengeMapDiv);
    })

    if (type == "DailyChallenges" || type == "AdvancedDailyChallenges") {
        let challengeDiv = document.createElement('div');
        challengeDiv.classList.add("race-div", "event-select-challenge-div");
        eventsContent.appendChild(challengeDiv);

        //title text
        let challengeInfoName = document.createElement('p');
        challengeInfoName.classList.add("challenge-select-info-name", "black-outline");
        challengeInfoName.innerHTML = `Older ${type == "DailyChallenges" ? "Standard" : "Advanced"} Challenges (Unstable)`;
        challengeDiv.appendChild(challengeInfoName);

        //desc text
        let challengeInfoDesc = document.createElement('p');
        challengeInfoDesc.classList.add("challenge-info-desc");
        challengeInfoDesc.innerHTML = `Select a challenge by entering a date or ID below. IDs can be no less than 1000, and the date cannot be earlier than ${type == "DailyChallenges" ? new Date(Date.UTC(2021, 4, 7)).toISOString().split('T')[0] : new Date(Date.UTC(2021, 4, 20)).toISOString().split('T')[0]} for ${type == "DailyChallenges" ? "Standard" : "Advanced"} challenges.`;
        challengeDiv.appendChild(challengeInfoDesc);

        let challengeSelectors = document.createElement('div');
        challengeSelectors.classList.add("challenge-selectors");
        challengeDiv.appendChild(challengeSelectors);

        let challengeSelectorDate = document.createElement('div');
        challengeSelectorDate.classList.add("challenge-selector-date");
        challengeSelectors.appendChild(challengeSelectorDate);

        let challengeSelectorDateText = document.createElement('p');
        challengeSelectorDateText.classList.add("challenge-selector-date-text", "black-outline");
        challengeSelectorDateText.innerHTML = "Date";
        challengeSelectorDate.appendChild(challengeSelectorDateText);

        //input for day selector
        let challengeSelectorDateInput = document.createElement('input');
        challengeSelectorDateInput.classList.add("challenge-selector-date-input");
        challengeSelectorDateInput.type = "date";//earlier selectable date is 05/07/2021 for regular dailychallenges and 05/20/2021 for AdvancedDailyChallenges
        // challengeSelectorDateInput.min = type == "DailyChallenges" ? "2021-05-07" : "2021-05-20";
        // challengeSelectorDateInput.max = new Date();
        challengeSelectorDateInput.value =  new Date(Date.now()).toISOString().split('T')[0];
        challengeSelectorDateInput.addEventListener('change', () => {
            if (new Date(challengeSelectorDateInput.value) > new Date()) { challengeSelectorDateInput.value = new Date().toISOString().split('T')[0] }
            if (new Date(challengeSelectorDateInput.value) < new Date(type == "DailyChallenges" ? "2021-05-07" : "2021-05-20")) { challengeSelectorDateInput.value = type == "DailyChallenges" ? "2021-05-07" : "2021-05-20"; }
        })
        // challengeSelectorDateInput.value = new Date().toISOString().split('T')[0];
        challengeSelectorDate.appendChild(challengeSelectorDateInput);

        let challengeSelectorDateImg = document.createElement('img');
        challengeSelectorDateImg.classList.add("challenge-selector-date-img");
        challengeSelectorDateImg.src = "../Assets/UI/ContinueBtn.png";
        challengeSelectorDateImg.addEventListener('click', async () => {
            console.log(challengeSelectorDateInput.value)
            console.log(getChallengeIDFromDate(challengeSelectorDateInput.value), type)
            showLoading();
            showChallengeModel('events', await getChallengeMetadata(getChallengeIDFromDate(challengeSelectorDateInput.value,type == "AdvancedDailyChallenges")), type);
        })
        challengeSelectorDate.appendChild(challengeSelectorDateImg);

        let challengeSelectorOR = document.createElement('p');
        challengeSelectorOR.classList.add("challenge-selector-or", "black-outline");
        challengeSelectorOR.innerHTML = "OR";
        challengeSelectors.appendChild(challengeSelectorOR);

        let challengeSelectorID = document.createElement('div');
        challengeSelectorID.classList.add("challenge-selector-id");
        challengeSelectors.appendChild(challengeSelectorID);

        let challengeSelectorIDText = document.createElement('p');
        challengeSelectorIDText.classList.add("challenge-selector-id-text", "black-outline");
        challengeSelectorIDText.innerHTML = "Challenge ID";
        challengeSelectorID.appendChild(challengeSelectorIDText);

        //input for ID selector
        let challengeSelectorIDInput = document.createElement('input');
        challengeSelectorIDInput.classList.add("challenge-selector-id-input");
        challengeSelectorIDInput.type = "number";
        //keep the value above 1000 and below the latest challenge number
        challengeSelectorIDInput.min = 1000;
        challengeSelectorIDInput.max = latestChallenge;
        challengeSelectorIDInput.value = latestChallenge;
        challengeSelectorIDInput.addEventListener('change', () => {
            if (challengeSelectorIDInput.value < 1000) { challengeSelectorIDInput.value = 1000; }
            if (challengeSelectorIDInput.value > latestChallenge) { challengeSelectorIDInput.value = latestChallenge; }
        })
        challengeSelectorID.appendChild(challengeSelectorIDInput);

        let challengeSelectorIDImg = document.createElement('img');
        challengeSelectorIDImg.classList.add("challenge-selector-id-img");
        challengeSelectorIDImg.src = "../Assets/UI/ContinueBtn.png";
        challengeSelectorIDImg.addEventListener('click', async () => {
            console.log(challengeSelectorIDInput.value)
            showLoading();
            showChallengeModel('events', await getChallengeMetadata(getChallengeIdFromInt(challengeSelectorIDInput.value, type == "AdvancedDailyChallenges")), type);
        })
        challengeSelectorID.appendChild(challengeSelectorIDImg);
    }
}

function processChallenge(metadata, map){
    let result = {};
    console.log(map);
    if (map == null) {
        if (metadata.leastCashUsed != "-1") {
            result.scoringType = "Least Cash"
        } else if (metadata.leastTiersUsed != "-1") {
            result.scoringType = "Least Tiers"
        } else {
            result.scoringType = null;
        }
        result["Random Seed"] = metadata.seed;
    }

    result["Date Created"] = new Date(metadata.createdAt).toLocaleDateString();
    result["ID"] = metadata.id;
    result["Creator"] = metadata.creator;
    result["Game Version"] = metadata.gameVersion;

    result["Stats"] = {
        "Plays": metadata.plays,
        "Wins": metadata.wins,
        "Losses": metadata.losses,
        "Restarts": metadata.restarts,
        "Unique Plays": metadata.playsUnique,
        "Unique Wins": metadata.winsUnique,
        "Unique Losses": metadata.lossesUnique
    }

    result["Upvotes"] = metadata.upvotes;
    result["Player Completion Rate"] = metadata.playsUnique == 0 ? "0%" : metadata.winsUnique - metadata.playsUnique == 0 ? "100%" : `${((metadata.winsUnique / metadata.playsUnique) * 100).toFixed(2)}%`;
    result["Player Win Rate"] = metadata.playsUnique == 0 ? "0%" : `${((metadata.wins / (metadata.plays + metadata.restarts)) * 100).toFixed(2)}%`;

    result.statsValid = false;
    //if all of result['Stats'] is not zero
    if (metadata.id != "n/a") {
        result.statsValid = true;
    }
    console.log(result);
    return result;
}

async function showChallengeModel(source, metadata, challengeType, eventData){
    if (metadata == null) { return; }
    document.getElementById('challenge-content').style.display = "flex";
    document.getElementById('challenge-content').innerHTML = "";
    document.getElementById(`${source}-content`).style.display = "none";
    resetScroll();
    console.log(eventData)

    let challengeExtraData = processChallenge(metadata);
    if (challengeType == "Boss" && eventData.scoringType != "GameTime") {
        switch(eventData.scoringType){
            case "LeastCash":
                challengeExtraData.scoringType = "Least Cash";
                break;
            case "LeastTiers":
                challengeExtraData.scoringType = "Least Tiers";
                break;
        }
    }

    let challengeModel = document.createElement('div');
    challengeModel.classList.add('challenge-model');
    document.getElementById('challenge-content').appendChild(challengeModel);

    let challengeModelHeader = document.createElement('div');
    challengeModelHeader.classList.add('challenge-model-header');
    challengeModel.appendChild(challengeModelHeader);

    let challengeModelHeaderIcons = document.createElement('div');
    challengeModelHeaderIcons.classList.add('challenge-model-header-icons');
    challengeModelHeader.appendChild(challengeModelHeaderIcons);

    let challengeModelHeaderIcon = document.createElement('img');
    challengeModelHeaderIcon.classList.add('challenge-model-header-difficulty');
    challengeModelHeaderIcons.appendChild(challengeModelHeaderIcon);

    // let challengeModelHeaderDifficulty = document.createElement('img');
    // challengeModelHeaderDifficulty.classList.add('challenge-model-header-difficulty');
    // challengeModelHeaderDifficulty.src = getModeIcon(metadata.difficulty);
    // challengeModelHeaderIcons.appendChild(challengeModelHeaderDifficulty);

    // if (metadata.mode != "Standard"){
    //     let challengeModelHeaderMode = document.createElement('img');
    //     challengeModelHeaderMode.classList.add('challenge-model-header-difficulty');
    //     challengeModelHeaderMode.src = getModeIcon(metadata.mode);
    //     challengeModelHeaderIcons.appendChild(challengeModelHeaderMode);
    // }

    let challengeModelHeaderTexts = document.createElement('div');
    challengeModelHeaderTexts.classList.add('challenge-model-header-texts');
    challengeModelHeader.appendChild(challengeModelHeaderTexts);

    let challengeModelHeaderName = document.createElement('p');
    challengeModelHeaderName.classList.add('challenge-model-header-name','black-outline');
    challengeModelHeaderName.innerHTML = metadata.name;
    challengeModelHeaderTexts.appendChild(challengeModelHeaderName);

    let challengeModelHeaderModeDiff = document.createElement('p');
    challengeModelHeaderModeDiff.classList.add('challenge-model-header-mode-diff','black-outline');
    challengeModelHeaderModeDiff.innerHTML = `${metadata.difficulty} - ${getLocValue("Mode " + metadata.mode)} ${challengeExtraData.scoringType == null ? "" : ` - ${challengeExtraData.scoringType}`}`;
    challengeModelHeaderTexts.appendChild(challengeModelHeaderModeDiff);

    let challengeHeaderRightContainer = document.createElement('div');
    challengeHeaderRightContainer.classList.add('challenge-header-right-container');
    challengeModelHeader.appendChild(challengeHeaderRightContainer);

    // let challengeHeaderExitBtn = document.createElement('div');
    // challengeHeaderExitBtn.classList.add('challenge-header-exit-btn');
    // challengeHeaderExitBtn.classList.add('maps-progress-view','black-outline');
    // challengeHeaderExitBtn.innerHTML = "Exit";
    // challengeHeaderExitBtn.addEventListener('click', () => {
    //     exitChallengeModel(source);
    // })
    // challengeHeaderRightContainer.appendChild(challengeHeaderExitBtn);

    let challengeHeaderRightTop = document.createElement('div');
    challengeHeaderRightTop.classList.add('challenge-header-right-top');
    challengeHeaderRightContainer.appendChild(challengeHeaderRightTop);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        exitChallengeModel(source);
    })
    challengeHeaderRightTop.appendChild(modalClose);

    let challengeHeaderRightBottom = document.createElement('div');
    challengeHeaderRightBottom.classList.add('challenge-header-right-bottom');
    challengeHeaderRightContainer.appendChild(challengeHeaderRightBottom);

    // let challengeHeaderStatsBtn = document.createElement('div');
    // challengeHeaderStatsBtn.classList.add('challenge-header-stats-btn');
    // challengeHeaderStatsBtn.classList.add('maps-progress-view','black-outline');
    // challengeHeaderStatsBtn.innerHTML = "Stats";
    // challengeHeaderStatsBtn.addEventListener('click', () => {
    //     showChallengeStats(metadata, challengeType);
    // })
    // challengeHeaderRightContainer.appendChild(challengeHeaderStatsBtn);

    let challengeModelTop = document.createElement('div');
    challengeModelTop.classList.add('challenge-model-top');
    challengeModel.appendChild(challengeModelTop);

    let challengeModelMapIcon = document.createElement('img');
    challengeModelMapIcon.classList.add('challenge-model-map-icon', 'boss-border');
    challengeModelMapIcon.src = Object.keys(constants.mapsInOrder).includes(metadata.map) ? getMapIcon(metadata.map) : metadata.mapURL;
    challengeModelTop.appendChild(challengeModelMapIcon);

    let challengeModelSettings = document.createElement('div');
    challengeModelSettings.classList.add('challenge-model-settings');
    challengeModelTop.appendChild(challengeModelSettings);

    let challengeModelSettingsLeft = document.createElement('div');
    challengeModelSettingsLeft.classList.add('challenge-model-settings-left');
    challengeModelSettings.appendChild(challengeModelSettingsLeft);

    let challengeModelSettingsRight = document.createElement('div');
    challengeModelSettingsRight.classList.add('challenge-model-settings-right');
    challengeModelSettings.appendChild(challengeModelSettingsRight);

    let challengeSettings = {
        'Starting Cash': {
            "icon": "CoinIcon",
            "key": "startingCash",
        },
        'Start Round': {
            "icon": "StartRoundIconSmall",
            "key": "startRound",
        },
        'Starting Lives': {
            "icon": "LivesIcon",
            "key": "lives",
        },
        'End Round': {
            "icon": "EndRoundIconSmall",
            "key": "endRound",
        },
        'Max Lives': {
            "icon": "LivesIcon",
            "key": "maxLives",
        },
        'Max Monkeys': {
            "icon": "MaxMonkeysIcon",
            "key": "maxTowers",
        }
    }
console.log(metadata)
    Object.entries(challengeSettings).forEach(([setting,data], index) => {
        let challengeSetting = document.createElement('div');
        challengeSetting.classList.add('challenge-setting');

        index % 2 ? challengeModelSettingsRight.appendChild(challengeSetting) : challengeModelSettingsLeft.appendChild(challengeSetting);
        // challengeModelSettings.appendChild(challengeSetting);

        let challengeSettingIcon = document.createElement('img');
        challengeSettingIcon.classList.add('challenge-setting-icon');
        challengeSettingIcon.src = `./Assets/UI/${data.icon}.png`;
        challengeSetting.appendChild(challengeSettingIcon);

        let challengeSettingTexts = document.createElement('div');
        challengeSettingTexts.classList.add('challenge-setting-texts');
        challengeSetting.appendChild(challengeSettingTexts);

        let challengeSettingText = document.createElement('p');
        challengeSettingText.classList.add('challenge-setting-text', 'black-outline');
        challengeSettingText.innerHTML = setting + ":";
        challengeSettingTexts.appendChild(challengeSettingText);

        let challengeSettingValue = document.createElement('p');
        challengeSettingValue.classList.add('challenge-setting-value', 'black-outline');
        challengeSettingValue.innerHTML = metadata[data.key];
        challengeSettingTexts.appendChild(challengeSettingValue);
        if (data.key == "maxTowers" && (metadata[data.key] == 0 || metadata[data.key] == 9999)) { challengeSettingValue.innerHTML = "Unlimited"; }
        if((data.key == "maxLives" || data.key == "lives" || data.key == "startingCash" || data.key == "startRound" || data.key == "endRound") && metadata[data.key] == 0) { challengeSettingValue.innerHTML = "Default"; }
    })

    let challengeSetting = document.createElement('div');
    challengeSetting.classList.add('challenge-setting');
    challengeModelSettings.appendChild(challengeSetting);

    let challengeSettingIcon = document.createElement('img');
    challengeSettingIcon.classList.add('challenge-setting-icon');
    challengeSetting.appendChild(challengeSettingIcon);

    let challengeSettingTexts = document.createElement('div');
    challengeSettingTexts.classList.add('challenge-setting-texts');
    challengeSetting.appendChild(challengeSettingTexts);

    let challengeSettingText = document.createElement('p');
    challengeSettingText.classList.add('challenge-setting-text', 'black-outline');
    challengeSettingTexts.appendChild(challengeSettingText);

    switch(challengeType) {
        case "Race":
            challengeModelHeaderIcon.src = "./Assets/UI/EventRaceBtn.png";

            challengeSettingText.innerHTML = "Race Event";
            challengeSettingIcon.src = `./Assets/UI/RaceIcon.png`;
            challengeModelHeader.style.backgroundColor = "#FFC300";
            break;
        case "Boss":
            //get actual boss type
            challengeModelHeaderIcon.src = `./Assets/BossIcon/${eventData.name}EventIcon.png`;
            challengeSettingText.innerHTML = `${eventData.elite ? "Elite " : ""}Boss Event`;
            challengeSettingIcon.src = `./Assets/BossIcon/${eventData.name}Portrait${eventData.elite ? "Elite" : ""}.png`;
            challengeModelHeaderName.innerHTML = `${eventData.elite ? "Elite " : ""}${eventData.name} ${eventData.eventNumber}`;
            challengeModelHeader.style.background = eventData.elite ? "linear-gradient(180deg, #401DB4, #A144E2)" : "linear-gradient(180deg, #1882A5, #07A4CB)";
            break;
        case "Odyssey":
            challengeModelHeaderIcon.src = "./Assets/UI/OdysseyEventBtn.png";
            break;
        case "ContestedTerritory":
            challengeModelHeaderIcon.src = "./Assets/UI/ContestedTerritoryEventBtn.png";
            break;
        case "DailyChallenges":
            challengeSettingText.innerHTML = "Daily Challenge";
            challengeSettingIcon.src = `./Assets/UI/ChallengesIcon.png`;
            challengeModelHeaderIcon.src = "./Assets/UI/DailyChallengeBtn.png";
            challengeModelHeader.style.backgroundColor = "rgb(70,148,213)";
            break;
        case "AdvancedDailyChallenges":
            challengeSettingText.innerHTML = "Advanced Daily";
            challengeSettingIcon.src = `./Assets/UI/ChallengesIcon.png`;
            challengeModelHeaderIcon.src = "./Assets/UI/DailyChallengeBtn.png";
            challengeModelHeader.style.backgroundColor = "rgb(234,99,52)";
            break;
        case "CoopDailyChallenges":
            challengeSettingText.innerHTML = "Coop Challenge";
            challengeSettingIcon.src = `./Assets/UI/ChallengesIcon.png`;
            challengeModelHeaderIcon.src = "./Assets/UI/DailyChallengeBtn.png";
            challengeModelHeader.style.backgroundColor = "rgb(255,150,0)";
            break;
        case "Custom":
            challengeSettingText.innerHTML = "Custom Challenge";
            challengeSettingIcon.src = `./Assets/UI/CustomChallenge.png`;
            challengeModelHeaderIcon.src = "./Assets/UI/CreateChallengeIcon.png";

            let challengeID = document.createElement('p');
            challengeID.classList.add('challenge-id', 'black-outline');
            challengeID.innerHTML = metadata.id;
            challengeID.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                copyID(metadata.id, challengeID)
            })
            challengeHeaderRightBottom.appendChild(challengeID);

            let selectorCopyImg = document.createElement('img');
            selectorCopyImg.classList.add('browser-copy-img');
            selectorCopyImg.src = '../Assets/UI/CopyClipboardBtn.png';
            selectorCopyImg.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                copyID(metadata.id, challengeID)
            });
            challengeHeaderRightBottom.appendChild(selectorCopyImg);

            let selectorGoImg = document.createElement('img');
            selectorGoImg.classList.add('browser-go-img');
            selectorGoImg.src = '../Assets/UI/GoBtnSmall.png';
            selectorGoImg.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                window.open(`btd6://Challenge/${metadata.id}`, '_blank');
            });
            challengeHeaderRightBottom.appendChild(selectorGoImg);
            break;
    }

    //special conditions
    if (challengeExtraData.scoringType != null) {
        let hideScoringValue = (challengeType == "Boss");
        console.log(hideScoringValue)

        let challengeSetting = document.createElement('div');
        challengeSetting.classList.add('challenge-setting');
        challengeModelSettings.appendChild(challengeSetting);

        let challengeSettingIcon = document.createElement('img');
        challengeSettingIcon.classList.add('challenge-setting-icon');
        challengeSetting.appendChild(challengeSettingIcon);

        let challengeSettingTexts = document.createElement('div');
        challengeSettingTexts.classList.add('challenge-setting-texts');
        challengeSetting.appendChild(challengeSettingTexts);

        let challengeSettingText = document.createElement('p');
        challengeSettingText.classList.add('challenge-setting-text', 'black-outline');
        challengeSettingTexts.appendChild(challengeSettingText);

        let challengeSettingValue = document.createElement('p');
        challengeSettingValue.classList.add('challenge-setting-value', 'black-outline');
        challengeSettingValue.innerHTML = 'ERROR';
        if (!hideScoringValue) {
            challengeSettingTexts.appendChild(challengeSettingValue);
        }

        switch (challengeExtraData.scoringType) {
            case "Least Cash":
                challengeSettingText.innerHTML = hideScoringValue ? "Least Cash" :  "Least Cash:";
                challengeSettingIcon.src = `./Assets/UI/LeastCashIconSmall.png`;
                challengeSettingValue.innerHTML = metadata.leastCashUsed;
                break;
            case "Least Tiers":
                challengeSettingText.innerHTML = hideScoringValue ? "Least Tiers" :  "Least Tiers:";
                challengeSettingIcon.src = `./Assets/UI/LeastTiersIconSmall.png`;
                challengeSettingValue.innerHTML =  metadata.leastTiersUsed;
                break;
        }
    }

    let heroesToDisplay = {};
    let towersToDisplay = {};
    let shouldUseHeroList = false;

    Object.entries(metadata._towers).forEach(([tower, data]) => {
        if (data.max == 0) { return; }
        if (data.tower === "ChosenPrimaryHero" && data.max != 0) { shouldUseHeroList = true; }
        data.isHero ? heroesToDisplay[data.tower] = data : towersToDisplay[data.tower] = data;
    })

    console.log(heroesToDisplay)
    console.log(towersToDisplay)
    console.log(shouldUseHeroList)

    if (shouldUseHeroList) {
        let heroSelectorHeader = document.createElement('div');
        heroSelectorHeader.classList.add('challenge-tower-selector');
        challengeModel.appendChild(heroSelectorHeader);
    }

    let towerSelectorHeader = document.createElement('div');
    towerSelectorHeader.classList.add('challenge-tower-selector');
    challengeModel.appendChild(towerSelectorHeader);

    if (shouldUseHeroList) {
        let towerSelector = document.createElement('div');
        towerSelector.classList.add(`tower-selector-hero`);
        towerSelectorHeader.appendChild(towerSelector)

        let towerSelectorImg = document.createElement('img');
        towerSelectorImg.classList.add('hero-selector-img');
        towerSelectorImg.src = `./Assets/UI/AllHeroesIcon.png`;
        towerSelector.appendChild(towerSelectorImg);
    } else {
        for (let [tower, nameColor] of Object.entries(constants.heroesInOrder)) {
            if (!heroesToDisplay[tower]) { continue; }
            let towerSelector = document.createElement('div');
            towerSelector.id = tower + '-selector';
            towerSelector.classList.add(`tower-selector-hero`);

            let towerSelectorImg = document.createElement('img');
            towerSelectorImg.id = tower + '-selector-img';
            towerSelectorImg.classList.add('hero-selector-img');
            towerSelectorImg.src = getInstaContainerIcon(tower,"000");
            towerSelector.appendChild(towerSelectorImg);

            towerSelectorHeader.appendChild(towerSelector)

            // shouldUseHeroList ?  heroSelectorHeader.appendChild(towerSelector) : towerSelectorHeader.appendChild(towerSelector);
        }
    }

    for (let [tower, category] of Object.entries(constants.towersInOrder)) {
        if (!towersToDisplay[tower]) { continue; }
        let towerSelector = document.createElement('div');
        towerSelector.id = tower + '-selector';
        towerSelector.classList.add(`tower-selector-${category.toLowerCase()}`);
        towerSelectorHeader.appendChild(towerSelector);

        let towerSelectorImg = document.createElement('img');
        towerSelectorImg.id = tower + '-selector-img';
        towerSelectorImg.classList.add('tower-selector-img');
        towerSelectorImg.src = getInstaContainerIcon(tower,"000");
        towerSelector.appendChild(towerSelectorImg);

        if (towersToDisplay[tower].path1NumBlockedTiers != 0 || towersToDisplay[tower].path2NumBlockedTiers != 0  || towersToDisplay[tower].path3NumBlockedTiers != 0 ) {
            let towerSelectorTiers = document.createElement('p');
            towerSelectorTiers.classList.add('tower-selector-tiers', 'black-outline');
            towerSelectorTiers.innerHTML = `${towersToDisplay[tower].path1NumBlockedTiers == -1 ? "0" : 5 - towersToDisplay[tower].path1NumBlockedTiers}-${towersToDisplay[tower].path2NumBlockedTiers == -1 ? "0" : 5- towersToDisplay[tower].path2NumBlockedTiers}-${towersToDisplay[tower].path3NumBlockedTiers == -1 ? "0" : 5 - towersToDisplay[tower].path3NumBlockedTiers}`;
            towerSelector.appendChild(towerSelectorTiers);
        } else if (towersToDisplay[tower].hasOwnProperty('restrictParagon') && towersToDisplay[tower].restrictParagon) {
            let towerSelectorTiers = document.createElement('p');
            towerSelectorTiers.classList.add('tower-selector-tiers', 'black-outline');
            towerSelectorTiers.innerHTML = "5-5-5";
            towerSelector.appendChild(towerSelectorTiers);
        }
    }

    let challengeModelColumns = document.createElement('div');
    challengeModelColumns.classList.add('challenge-model-columns');
    challengeModel.appendChild(challengeModelColumns);

    let challengeModelLeft = document.createElement('div');
    challengeModelLeft.classList.add('challenge-model-left');
    challengeModelColumns.appendChild(challengeModelLeft);

    let challengeModelRight = document.createElement('div');
    challengeModelRight.classList.add('challenge-model-right');
    challengeModelColumns.appendChild(challengeModelRight);

    let modifiers = challengeModifiers(metadata);

    let challengeModifiersDiv = document.createElement('div');
    challengeModifiersDiv.classList.add('challenge-modifiers-div');
    challengeModelLeft.appendChild(challengeModifiersDiv);

    let challengeModifiersHeader = document.createElement('p');
    challengeModifiersHeader.classList.add('challenge-modifiers-header');
    challengeModifiersHeader.classList.add('black-outline');
    challengeModifiersHeader.innerHTML = "Modifiers";
    challengeModifiersDiv.appendChild(challengeModifiersHeader);

    Object.entries(modifiers).forEach(([modifier, data]) => {
        let challengeModifier = document.createElement('div');
        challengeModifier.classList.add('challenge-modifier');
        challengeModifiersDiv.appendChild(challengeModifier);

        let challengeModifierIcon = document.createElement('img');
        challengeModifierIcon.classList.add('challenge-modifier-icon');
        challengeModifierIcon.src = `./Assets/ChallengeRulesIcon/${data.icon}.png`;
        challengeModifier.appendChild(challengeModifierIcon);

        let challengeModifierTexts = document.createElement('div');
        challengeModifierTexts.classList.add('challenge-modifier-texts');
        challengeModifier.appendChild(challengeModifierTexts);

        let challengeModifierLabel = document.createElement('p');
        challengeModifierLabel.classList.add('challenge-modifier-text');
        challengeModifierLabel.classList.add('black-outline');
        challengeModifierLabel.innerHTML = `${modifier}:`;
        challengeModifierTexts.appendChild(challengeModifierLabel);

        let challengeModifierValue = document.createElement('p');
        challengeModifierValue.classList.add('challenge-modifier-value');
        challengeModifierValue.classList.add('black-outline');
        challengeModifierValue.innerHTML = isNaN(data.value) ? data.value : `${(data.value * 100).toFixed(0)}%`;
        challengeModifierTexts.appendChild(challengeModifierValue);
    })

    let rules = challengeRules(metadata);

    let challengeRulesHeader = document.createElement('p');
    challengeRulesHeader.classList.add('challenge-rules-header');
    challengeRulesHeader.classList.add('black-outline');
    challengeRulesHeader.innerHTML = "Rules";
    challengeModelRight.appendChild(challengeRulesHeader);

    let challengeRulesDiv = document.createElement('div');
    challengeRulesDiv.classList.add('challenge-rules-div');
    challengeModelRight.appendChild(challengeRulesDiv);

    rules.forEach(rule => {
        if (rule == "No Round 100 Reward" && challengeType != "AdvancedDailyChallenges") { return; }
        if (rule == "Paragon Limit" && metadata.maxParagons == 0 && challengeType != "Boss") { return; }
        let challengeRule = document.createElement('div');
        challengeRule.classList.add('challenge-rule');
        challengeRulesDiv.appendChild(challengeRule);

        let challengeRuleIcon = document.createElement('img');
        challengeRuleIcon.classList.add('challenge-modifier-icon');
        challengeRuleIcon.src = `./Assets/ChallengeRulesIcon/${rulesMap[rule]}.png`;
        challengeRule.appendChild(challengeRuleIcon);

        let challengeRuleTextDiv = document.createElement('div');
        challengeRuleTextDiv.classList.add('challenge-rule-text-div');
        challengeRule.appendChild(challengeRuleTextDiv);

        let challengeRuleText = document.createElement('p');
        challengeRuleText.classList.add('challenge-rule-text');
        challengeRuleText.classList.add('black-outline');
        challengeRuleText.innerHTML = rule;
        challengeRuleTextDiv.appendChild(challengeRuleText);

        if(rule == "Paragon Limit") {
            let challengeRuleValue = document.createElement('p');
            challengeRuleValue.classList.add('challenge-rule-value');
            challengeRuleValue.classList.add('black-outline');
            challengeRuleValue.innerHTML = metadata.maxParagons;
            challengeRuleTextDiv.appendChild(challengeRuleValue);
        }
    });

    if(challengeExtraData.statsValid) {
        let challengeStatsDiv = document.createElement('div');
        challengeStatsDiv.classList.add('challenge-model-stats-div');
        challengeStatsDiv.style.display = "none";
        challengeModel.appendChild(challengeStatsDiv);

        let challengeStatsHeader = document.createElement('p');
        challengeStatsHeader.classList.add('challenge-stats-header', 'black-outline');
        challengeStatsHeader.innerHTML = "Challenge Stats";
        challengeStatsDiv.appendChild(challengeStatsHeader);

        let challengeStatsLeftRight = document.createElement('div');
        challengeStatsLeftRight.classList.add('challenge-stats-left-right');
        challengeStatsDiv.appendChild(challengeStatsLeftRight);

        let challengeStatsLeft = document.createElement('div');
        challengeStatsLeft.classList.add('challenge-stats-left');
        challengeStatsLeftRight.appendChild(challengeStatsLeft);

        //ID

        //Upvote Trophy Skull
        let challengeUSVDiv = document.createElement('div');
        challengeUSVDiv.classList.add('challenge-usv-div');
        challengeStatsLeft.appendChild(challengeUSVDiv);

        if (challengeExtraData["Upvotes"] != 0) {
            let challengeUpvoteDiv = document.createElement('div');
            challengeUpvoteDiv.classList.add('challenge-upvote-div');
            challengeUSVDiv.appendChild(challengeUpvoteDiv);

            let challengeUpvoteIcon = document.createElement('img');
            challengeUpvoteIcon.classList.add('challenge-upvote-icon');
            challengeUpvoteIcon.src = "./Assets/UI/ChallengeThumbsUpIcon.png";
            challengeUpvoteDiv.appendChild(challengeUpvoteIcon);

            let challengeUpvoteValue = document.createElement('p');
            challengeUpvoteValue.classList.add('challenge-upvote-value');
            challengeUpvoteValue.innerHTML = challengeExtraData["Upvotes"];
            challengeUpvoteDiv.appendChild(challengeUpvoteValue);
        }

        let challengeTrophyDiv = document.createElement('div');
        challengeTrophyDiv.classList.add('challenge-trophy-div');
        challengeUSVDiv.appendChild(challengeTrophyDiv);

        let challengeTrophyIcon = document.createElement('img');
        challengeTrophyIcon.classList.add('challenge-trophy-icon');
        challengeTrophyIcon.src = "./Assets/UI/ChallengeTrophyIcon.png";
        challengeTrophyDiv.appendChild(challengeTrophyIcon);

        let challengeTrophyValue = document.createElement('p');
        challengeTrophyValue.classList.add('challenge-trophy-value');
        challengeTrophyValue.innerHTML = challengeExtraData["Player Completion Rate"];
        challengeTrophyDiv.appendChild(challengeTrophyValue);

        let challengeSkullDiv = document.createElement('div');
        challengeSkullDiv.classList.add('challenge-skull-div');
        challengeUSVDiv.appendChild(challengeSkullDiv);

        let challengeSkullIcon = document.createElement('img');
        challengeSkullIcon.classList.add('challenge-skull-icon');
        challengeSkullIcon.src = "./Assets/UI/DeathRateIcon.png";
        challengeSkullDiv.appendChild(challengeSkullIcon);

        let challengeSkullValue = document.createElement('p');
        challengeSkullValue.classList.add('challenge-skull-value');
        challengeSkullValue.innerHTML = challengeExtraData["Player Win Rate"];
        challengeSkullDiv.appendChild(challengeSkullValue);
        //Creator
        if(challengeExtraData["Creator"] != "n/a" && challengeExtraData["Creator"] != null) {
            let challengeCreator = document.createElement('div');
            challengeCreator.classList.add('challenge-creator');
            challengeStatsLeft.appendChild(challengeCreator);

            let avatar = document.createElement('div');
            avatar.classList.add('avatar');
            challengeCreator.appendChild(avatar);

            let width = 50;

            let avatarFrame = document.createElement('img');
            avatarFrame.classList.add('avatar-frame','noSelect');
            avatarFrame.style.width = `${width}px`;
            avatarFrame.src = '../Assets/UI/InstaTowersContainer.png';
            avatar.appendChild(avatarFrame);

            let avatarImg = document.createElement('img');
            avatarImg.classList.add('avatar-img','noSelect');
            avatarImg.style.width = `${width}px`;
            avatarImg.src = getProfileIcon("ProfileAvatar01");
            avatar.appendChild(avatarImg);

            let challengeCreatorName = document.createElement('p');
            challengeCreatorName.classList.add('challenge-creator-name', 'black-outline');
            challengeCreatorName.innerHTML = "Loading...";
            challengeCreator.appendChild(challengeCreatorName);
            //async function to change avatar to actual src
            await getUserProfile(challengeExtraData["Creator"]).then(data => {
                challengeCreatorName.innerHTML = data.displayName;
                avatarImg.src = getProfileIcon(data.avatar);
                challengeCreator.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(data.banner)})`;
            });
        }

        let leftStats = ["Date Created", "Game Version", "Random Seed"]
        leftStats.forEach(stat => {
            if(stat == "Game Version" && challengeExtraData[stat] == 0){ return; }
            let challengeStat = document.createElement('div');
            challengeStat.classList.add('challenge-stat');
            challengeStatsLeft.appendChild(challengeStat);

            let challengeStatLabel = document.createElement('p');
            challengeStatLabel.classList.add('challenge-stat-label');
            challengeStatLabel.innerHTML = `${stat}: ${challengeExtraData[stat]}`;
            challengeStat.appendChild(challengeStatLabel);
        })

        // if (stat == "Player Completion Rate" || stat == "Player Win Rate") {
        //     let challengeStatIcon = document.createElement('img');
        //     challengeStatIcon.classList.add('challenge-stat-icon');
        //     challengeStatIcon.src = `./Assets/ChallengeStatsIcon/${stat.replace(" ", "")}Icon.png`;
        //     challengeStat.appendChild(challengeStatIcon);

        //     let challengeStatIconValue = document.createElement('p');
        //     challengeStatIconValue.classList.add('challenge-stat-icon-value');
        //     challengeStatIconValue.classList.add('black-outline');
        //     challengeStatIconValue.innerHTML = value;
        //     challengeStat.appendChild(challengeStatIconValue);
        // }

        let challengeStatsRight = document.createElement('div');
        challengeStatsRight.classList.add('challenge-stats-right');
        challengeStatsLeftRight.appendChild(challengeStatsRight);

        Object.entries(challengeExtraData["Stats"]).forEach(([stat, value]) => {
            let challengeStat = document.createElement('div');
            challengeStat.classList.add('challenge-stat');
            challengeStatsRight.appendChild(challengeStat);

            let challengeStatLabel = document.createElement('p');
            challengeStatLabel.classList.add('challenge-stat-label');
            challengeStatLabel.innerHTML = stat;
            challengeStat.appendChild(challengeStatLabel);

            let challengeStatValue = document.createElement('p');
            challengeStatValue.classList.add('challenge-model-stat-value');
            challengeStatValue.innerHTML = value.toLocaleString();
            challengeStat.appendChild(challengeStatValue);
        })

        let challengeStatsBtn = document.createElement('img');
        challengeStatsBtn.classList.add('challenge-stats-btn');
        challengeStatsBtn.src = "./Assets/UI/InfoBtn.png";
        challengeStatsBtn.addEventListener('click', () => {
            challengeStatsDiv.style.display = challengeStatsDiv.style.display == "none" ? "flex" : "none";
        });
        challengeHeaderRightTop.appendChild(challengeStatsBtn);
    }
}

function challengeModifiers(metadata){
    let result = {}
    if (metadata._bloonModifiers.speedMultiplier != 1) {
        result["Bloon Speed"] = {
            "value": metadata._bloonModifiers.speedMultiplier,
            "icon": metadata._bloonModifiers.speedMultiplier > 1 ? "FasterBloonsIcon" : "SlowerBloonsIcon"
        }
    }
    if (metadata._bloonModifiers.moabSpeedMultiplier != 1) {
        result["MOAB Speed"] = {
            "value": metadata._bloonModifiers.moabSpeedMultiplier,
            "icon": metadata._bloonModifiers.moabSpeedMultiplier > 1 ? "FasterMoabIcon" : "SlowerMoabIcon"
        }
    }
    //regrowRateMultiplier
    if (metadata._bloonModifiers.hasOwnProperty('regrowRateMultiplier') && metadata._bloonModifiers.regrowRateMultiplier != 1) {
        result["Regrow Rate"] = {
            "value": metadata._bloonModifiers.regrowRateMultiplier,
            "icon": metadata._bloonModifiers.regrowRateMultiplier > 1 ? "RegrowRateIncreaseIcon" : "RegrowRateDecreaseIcon"
        }
    }
    //abilityCooldownReductionMultiplier
    if (metadata.hasOwnProperty('abilityCooldownReductionMultiplier') && metadata.abilityCooldownReductionMultiplier != 1) {
        result["Ability Cooldown Rate"] = {
            "value": metadata.abilityCooldownReductionMultiplier,
            "icon": metadata.abilityCooldownReductionMultiplier > 1 ? "AbilityCooldownReductionIncreaseIcon" : "AbilityCooldownReductionDecreaseIcon"
        }
    }
    //removeableCostMultiplier
    if (metadata.removeableCostMultiplier != 1 && metadata.removeableCostMultiplier != -1) {
        result["Removeable Cost"] = {
            "value": metadata.removeableCostMultiplier == 0 ? "Free" : metadata.removeableCostMultiplier == 12 ? "Disabled" : metadata.removeableCostMultiplier,
            "icon": metadata.removeableCostMultiplier > 1 ? "RemovableCostIncreaseIcon" : "RemovableCostDecreaseIcon"
        }
    }
    //healthMultipliers
    if (metadata._bloonModifiers.healthMultipliers.bloons != 1) {
        result["Ceramic Health"] = {
            "value": metadata._bloonModifiers.healthMultipliers.bloons,
            "icon": metadata._bloonModifiers.healthMultipliers.bloons > 1 ? "CeramicIncreaseHPIcon.png" : "CeramicDecreaseHPIcon"
        }
    }
    //moabs
    if (metadata._bloonModifiers.healthMultipliers.moabs != 1) {
        result["MOAB Health"] = {
            "value": metadata._bloonModifiers.healthMultipliers.moabs,
            "icon": metadata._bloonModifiers.healthMultipliers.moabs > 1 ? "MoabBoostIcon" : "MoabDecreaseHPIcon"
        }
    }
    //boss
    if (metadata._bloonModifiers.healthMultipliers.hasOwnProperty('boss') && metadata._bloonModifiers.healthMultipliers.boss != 1) {
        result["Boss Health"] = {
            "value": metadata._bloonModifiers.healthMultipliers.boss,
            "icon": metadata._bloonModifiers.healthMultipliers.boss > 1 ? "BossBoostIcon" : "BossDecreaseHPIcon"
        }
    }
    //boss speed
    if (metadata._bloonModifiers.hasOwnProperty('bossSpeedMultiplier') && metadata._bloonModifiers.bossSpeedMultiplier != 1) {
        result["Boss Speed"] = {
            "value": metadata._bloonModifiers.bossSpeedMultiplier,
            "icon": metadata._bloonModifiers.bossSpeedMultiplier > 1 ? "FasterBossIcon" : "SlowerBossIcon"
        }
    }
    return result;
}

function challengeRules(metadata){
    let result = [];
    if(metadata.disableMK) {
        result.push("Monkey Knowledge Disabled");
    }
    if(metadata.lives == 1) {
        result.push("No Lives Lost");
    }
    if(metadata.disableSelling) {
        result.push("Selling Disabled");
    }
    if(metadata.disablePowers) {
        result.push("Powers Disabled");
    }
    if(metadata.noContinues) {
        result.push("No Continues");
    }
    if(metadata._bloonModifiers.allCamo) {
        result.push("All Camo");
    }
    if(metadata._bloonModifiers.allRegen) {
        result.push("All Regrow");
    }
    if(metadata.disableDoubleCash) {
        result.push("Double Cash Disabled");
    }
    result.push("No Round 100 Reward")
    if((metadata.roundSets.includes("default") && metadata.roundSets.length > 1) || metadata.roundSets.length == 1 && metadata.roundSets[0] != "default") {
        result.push("Custom Rounds");
    }
    if(metadata.maxParagons != 10) {
        result.push("Paragon Limit");
    }
    return result;
}

function showLeaderboard(source, metadata, type) {
    switch(type){
        case "Boss":
            if (leaderboardLink != metadata.leaderboard_standard_players_1) { leaderboardPage = 1 }
            leaderboardLink = metadata.leaderboard_standard_players_1;
            break;
        case "BossElite":
            if (leaderboardLink != metadata.leaderboard_elite_players_1) { leaderboardPage = 1 }
            leaderboardLink = metadata.leaderboard_elite_players_1;
            break
        case "CTPlayer":
            if (leaderboardLink != metadata.leaderboard_player) { leaderboardPage = 1 }
            leaderboardLink = metadata.leaderboard_player;
            break;
        case "CTTeam":
            if (leaderboardLink != metadata.leaderboard_team) { leaderboardPage = 1 }
            leaderboardLink = metadata.leaderboard_team;
            break;
        default:
            if (leaderboardLink != metadata.leaderboard) { leaderboardPage = 1 }
            leaderboardLink = metadata.leaderboard;
    }

    let leaderboardContent = document.getElementById('leaderboard-content');
    leaderboardContent.style.display = "flex";
    leaderboardContent.innerHTML = "";
    document.getElementById(`${source}-content`).style.display = "none";

    let leaderboardDiv = document.createElement('div');
    leaderboardDiv.classList.add('leaderboard-div');
    leaderboardContent.appendChild(leaderboardDiv);

    let leaderboardTop = document.createElement('div');
    leaderboardTop.classList.add('leaderboard-top');
    leaderboardDiv.appendChild(leaderboardTop);

    let leaderboardHeader = document.createElement('div');
    leaderboardHeader.classList.add('leaderboard-header');
    leaderboardTop.appendChild(leaderboardHeader);

    //left div
    let leaderboardHeaderLeft = document.createElement('div');
    leaderboardHeaderLeft.classList.add('leaderboard-header-left');
    leaderboardHeader.appendChild(leaderboardHeaderLeft);
    //exit button (should clear the leaderboard timer)
    // let leaderboardHeaderExit = document.createElement('div');
    // leaderboardHeaderExit.classList.add('leaderboard-header-exit','maps-progress-view','black-outline');
    // leaderboardHeaderExit.innerHTML = "Exit";
    // leaderboardHeaderExit.addEventListener('click', () => {
    //     leaderboardContent.style.display = "none";
    //     document.getElementById(`${source}-content`).style.display = "flex";
    // })
    // leaderboardHeaderLeft.appendChild(leaderboardHeaderExit);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        leaderboardContent.style.display = "none";
        document.getElementById(`${source}-content`).style.display = "flex";
    })
    leaderboardHeaderLeft.appendChild(modalClose);

    //middle div
    let leaderboardHeaderMiddle = document.createElement('div');
    leaderboardHeaderMiddle.classList.add(`leaderboard-header-middle-${type.toLowerCase()}`);
    leaderboardHeader.appendChild(leaderboardHeaderMiddle);
    //header

    let leaderboardHeaderTitle = document.createElement('div');
    leaderboardHeaderTitle.classList.add(`leaderboard-header-${type.toLowerCase()}`, 'black-outline');
    leaderboardHeaderMiddle.appendChild(leaderboardHeaderTitle);

    switch(type) {
        case "Race":
            leaderboardHeaderTitle.innerHTML = "Race Leaderboard"
            break;
        case "Boss":
            leaderboardHeaderTitle.innerHTML = "Boss Leaderboard"
            break;
        case "BossElite":
            leaderboardHeaderTitle.innerHTML = "Elite Boss Leaderboard"
            break;
        case "CTPlayer":
            leaderboardHeaderTitle.innerHTML = "Contested Territory <br> Player Leaderboard"
            break;
        case "CTTeam":
            leaderboardHeaderTitle.innerHTML = "Contested Territory <br> Team Leaderboard"
            break;
    }
    //img

    //right div
    let leaderboardHeaderRight = document.createElement('div');
    leaderboardHeaderRight.classList.add('leaderboard-header-right');
    leaderboardHeader.appendChild(leaderboardHeaderRight);
    //time left

    let leaderboardColumnLabels = document.createElement('div');
    leaderboardColumnLabels.classList.add('leaderboard-column-labels');
    leaderboardTop.appendChild(leaderboardColumnLabels);

    let leaderboardEntries = document.createElement('div');
    leaderboardEntries.id = 'leaderboard-entries';
    leaderboardEntries.classList.add('leaderboard-entries');
    leaderboardDiv.appendChild(leaderboardEntries);

    let leaderboardFooter = document.createElement('div');
    leaderboardFooter.classList.add('leaderboard-footer');
    leaderboardDiv.appendChild(leaderboardFooter);

    //left div
    let leaderboardFooterLeft = document.createElement('div');
    leaderboardFooterLeft.classList.add('leaderboard-footer-left');
    leaderboardFooter.appendChild(leaderboardFooterLeft);
    //refresh button
    let leaderboardFooterRefresh = document.createElement('img');
    leaderboardFooterRefresh.classList.add('leaderboard-footer-refresh');
    leaderboardFooterRefresh.src = "./Assets/UI/RefreshBtn.png";
    leaderboardFooterRefresh.addEventListener('click', () => {
        if(!refreshRateLimited) {
        generateLeaderboardEntries(metadata)
        leaderboardFooterRefresh.style.filter = "grayscale(1) brightness(0.5)"
        setTimeout(() => {
            leaderboardFooterRefresh.style.filter = "none";
            refreshRateLimited = false;
        }, 10000)
        refreshRateLimited = true;
        }
    })
    leaderboardFooterLeft.appendChild(leaderboardFooterRefresh);

    //middle div
    let leaderboardFooterMiddle = document.createElement('div');
    leaderboardFooterMiddle.classList.add('leaderboard-footer-middle');
    leaderboardFooter.appendChild(leaderboardFooterMiddle);
    //page left

    let leaderboardFooterPageLeft = document.createElement('img');
    leaderboardFooterPageLeft.classList.add('leaderboard-footer-page-left','black-outline');
    leaderboardFooterPageLeft.src = "./Assets/UI/NextArrowSmallYellow.png";
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageLeft);
    //page number
    let leaderboardFooterPageNumber = document.createElement('div');
    leaderboardFooterPageNumber.id = 'leaderboard-footer-page-number';
    leaderboardFooterPageNumber.classList.add('leaderboard-footer-page-number','black-outline');
    leaderboardFooterPageNumber.innerHTML = `Loading...`;
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageNumber);
    //page right
    let leaderboardFooterPageRight = document.createElement('img');
    leaderboardFooterPageRight.classList.add('leaderboard-footer-page-right','black-outline');
    leaderboardFooterPageRight.src = "./Assets/UI/NextArrowSmallYellow.png";
    leaderboardFooterPageLeft.addEventListener('click', () => {
        leaderboardPage--;
        leaderboardFooterPageNumber.innerHTML = `Page ${leaderboardPage} (#${(leaderboardPage * leaderboardPageEntryCount) - (leaderboardPageEntryCount - 1)} - ${leaderboardPage * leaderboardPageEntryCount})`;
        leaderboardEntries.innerHTML = "";
        copyLoadingIcon(leaderboardEntries)

        generateLeaderboardEntries(metadata)
    })
    leaderboardFooterPageRight.addEventListener('click', () => {
        leaderboardPage++;
        leaderboardFooterPageNumber.innerHTML = `Page ${leaderboardPage} (#${(leaderboardPage * leaderboardPageEntryCount) - (leaderboardPageEntryCount - 1)} - ${leaderboardPage * leaderboardPageEntryCount})`;
        leaderboardEntries.innerHTML = "";
        copyLoadingIcon(leaderboardEntries)

        generateLeaderboardEntries(metadata)
    })
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageRight);

    //right div
    let leaderboardFooterRight = document.createElement('div');
    leaderboardFooterRight.classList.add('leaderboard-footer-right');
    leaderboardFooter.appendChild(leaderboardFooterRight);

    //Goto label
    // let leaderboardFooterGoto = document.createElement('p');
    // leaderboardFooterGoto.classList.add('leaderboard-footer-goto','black-outline');
    // leaderboardFooterGoto.innerHTML = "Go to:";
    // leaderboardFooterRight.appendChild(leaderboardFooterGoto);

    //enter a page number
    let leaderboardFooterPageInput = document.createElement('input');
    leaderboardFooterPageInput.classList.add('leaderboard-footer-page-input');
    leaderboardFooterPageInput.type = "number";
    leaderboardFooterPageInput.min = "1";
    leaderboardFooterPageInput.max = 1000 / leaderboardPageEntryCount;
    leaderboardFooterPageInput.value = `${leaderboardPage}`;
    //keep the value above 0 and below 21
    leaderboardFooterPageInput.addEventListener('change', () => {
        if (leaderboardFooterPageInput.value < 1) { leaderboardFooterPageInput.value = 1; }
        if (leaderboardFooterPageInput.value > (1000 / leaderboardPageEntryCount)) { leaderboardFooterPageInput.value = (1000 / leaderboardPageEntryCount) }
    })
    leaderboardFooterRight.appendChild(leaderboardFooterPageInput);

    let selectorGoImg = document.createElement('img');
    selectorGoImg.classList.add('leaderboard-go-img');
    selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
    selectorGoImg.addEventListener('click', () => {
        leaderboardPage = leaderboardFooterPageInput.value;
        leaderboardFooterPageNumber.innerHTML = `Page ${leaderboardPage} (#${(leaderboardPage * leaderboardPageEntryCount) - (leaderboardPageEntryCount - 1)} - ${leaderboardPage * leaderboardPageEntryCount})`;
        leaderboardEntries.innerHTML = "";
        copyLoadingIcon(leaderboardEntries)
        generateLeaderboardEntries(metadata)
    })
    leaderboardFooterRight.appendChild(selectorGoImg);

    copyLoadingIcon(leaderboardEntries)
    generateLeaderboardEntries(metadata, type);
}

async function generateLeaderboardEntries(metadata, type){
    await getLeaderboardData();
    console.log(leaderboardData)

    let leaderboardEntries = document.getElementById('leaderboard-entries');
    leaderboardEntries.innerHTML = "";

    if(leaderboardData != null) {
        leaderboardData.forEach((entry, index) => {
            let scorePartsObj = {}
            
            if(entry.hasOwnProperty("scoreParts")) {
                entry.scoreParts.forEach((part, index) => {
                    scorePartsObj[part.name] = part;
                })
            }

            let leaderboardEntry = document.createElement('div');
            leaderboardEntry.classList.add('leaderboard-entry');
            if(type != "CTTeam") {
            leaderboardEntry.addEventListener('click', () => {
                openProfile('leaderboard', entry);
            })
        }
            leaderboardEntries.appendChild(leaderboardEntry);

            let leaderboardEntryDiv = document.createElement('div');
            leaderboardEntryDiv.classList.add('leaderboard-entry-div');
            leaderboardEntry.appendChild(leaderboardEntryDiv);

            let leaderboardEntryRank = document.createElement('p');
            leaderboardEntryRank.classList.add('leaderboard-entry-rank');
            leaderboardEntryRank.classList.add('black-outline');
            leaderboardEntryRank.innerHTML = index + ((leaderboardPage - 1)  * leaderboardPageEntryCount) + 1;
            leaderboardEntryDiv.appendChild(leaderboardEntryRank);

            let leaderboardEntryPlayer = document.createElement('div');
            leaderboardEntryPlayer.classList.add('leaderboard-entry-player');
            leaderboardEntryDiv.appendChild(leaderboardEntryPlayer);

            let leaderboardEntryIcon = null;
            let leaderboardEntryFrame = null;
            let leaderboardEntryEmblem = null;

            if(type == "CTTeam") {
                leaderboardEntryIcon = document.createElement('div');
                leaderboardEntryIcon.classList.add('leaderboard-entry-icon-ct');
                leaderboardEntryPlayer.appendChild(leaderboardEntryIcon);

                leaderboardEntryFrame = document.createElement('img');
                leaderboardEntryFrame.classList.add('leaderboard-entry-frame');
                leaderboardEntryFrame.src = `./Assets/UI/TeamFrame1.png`;
                leaderboardEntryIcon.appendChild(leaderboardEntryFrame);

                leaderboardEntryEmblem = document.createElement('img');
                leaderboardEntryEmblem.classList.add('leaderboard-entry-emblem');
                leaderboardEntryEmblem.src = `./Assets/UI/TeamIcon1.png`;
                leaderboardEntryIcon.appendChild(leaderboardEntryEmblem);
            } else {
                leaderboardEntryIcon = document.createElement('img');
                leaderboardEntryIcon.classList.add('leaderboard-entry-icon');
                leaderboardEntryIcon.src = `./Assets/ProfileAvatar/ProfileAvatar01.png`;
                leaderboardEntryPlayer.appendChild(leaderboardEntryIcon);
            }

            let leaderboardEntryName = document.createElement('p');
            leaderboardEntryName.classList.add('leaderboard-entry-name','leaderboard-outline');
            leaderboardEntryName.innerHTML = entry.displayName;
            leaderboardEntryPlayer.appendChild(leaderboardEntryName);

            let leaderboardEntryTimeSubmitDiv = document.createElement('div');
            leaderboardEntryTimeSubmitDiv.classList.add('leaderboard-entry-time-submit-div');
            leaderboardEntryDiv.appendChild(leaderboardEntryTimeSubmitDiv);

            let leaderboardEntryScore = document.createElement('div')
            leaderboardEntryScore.classList.add('leaderboard-entry-score');
            leaderboardEntryDiv.appendChild(leaderboardEntryScore);

            let leaderboardEntryScoreIcon = document.createElement('img');
            leaderboardEntryScoreIcon.classList.add('leaderboard-entry-score-icon');
            leaderboardEntryScoreIcon.src = "./Assets/UI/StopWatch.png";
            leaderboardEntryScore.appendChild(leaderboardEntryScoreIcon);
            
            let leaderboardEntryMainScore = document.createElement('p');
            leaderboardEntryMainScore.classList.add('leaderboard-entry-main-score','leaderboard-outline');
            leaderboardEntryScore.appendChild(leaderboardEntryMainScore);

            console.log(metadata)

            if(metadata.hasOwnProperty('leaderboard') && metadata.leaderboard.includes('races')) {
                let submittedDate = new Date(metadata.start + scorePartsObj["Time after event start"].score)

                let leaderboardEntryTimeSubmitted = document.createElement('p');
                leaderboardEntryTimeSubmitted.classList.add('leaderboard-entry-time-submitted','leaderboard-outline');
                leaderboardEntryTimeSubmitted.innerHTML = submittedDate.toLocaleString();
                leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmitted);

                let leaderboardEntryTimeSubmittedRelative = document.createElement('p');
                leaderboardEntryTimeSubmittedRelative.classList.add('leaderboard-entry-time-submitted-relative','leaderboard-outline');
                leaderboardEntryTimeSubmittedRelative.innerHTML = relativeTime(new Date(), submittedDate);
                leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmittedRelative);

                leaderboardEntryMainScore.innerHTML = formatScoreTime(entry.score);
            }
            if(metadata.hasOwnProperty('bossType')) {
                switch(metadata.scoringType) {
                    case "GameTime":
                        let submittedDate = new Date(metadata.start + scorePartsObj["Time after event start"].score)

                        let leaderboardEntryTimeSubmitted = document.createElement('p');
                        leaderboardEntryTimeSubmitted.classList.add('leaderboard-entry-time-submitted','leaderboard-outline');
                        leaderboardEntryTimeSubmitted.innerHTML = submittedDate.toLocaleString();
                        leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmitted);

                        let leaderboardEntryTimeSubmittedRelative = document.createElement('p');
                        leaderboardEntryTimeSubmittedRelative.classList.add('leaderboard-entry-time-submitted-relative','leaderboard-outline');
                        leaderboardEntryTimeSubmittedRelative.innerHTML = relativeTime(new Date(), submittedDate);
                        leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmittedRelative);

                        leaderboardEntryMainScore.innerHTML = formatScoreTime(entry.score);
                        break;
                    case "LeastCash":
                        leaderboardEntryMainScore.innerHTML = entry.score.toLocaleString();
                        leaderboardEntryScoreIcon.src = `./Assets/UI/LeastCashIconSmall.png`;
                        leaderboardEntryScoreIcon.classList.add('leaderboard-entry-score-icon-large');

                        let leaderboardEntryGameTime = document.createElement('div');
                        leaderboardEntryGameTime.classList.add('leaderboard-entry-game-time');
                        leaderboardEntryDiv.appendChild(leaderboardEntryGameTime);

                        let leaderboardEntryGameTimeIcon = document.createElement('img');
                        leaderboardEntryGameTimeIcon.classList.add('leaderboard-entry-score-icon');
                        leaderboardEntryGameTimeIcon.src = "./Assets/UI/StopWatch.png";
                        leaderboardEntryGameTime.appendChild(leaderboardEntryGameTimeIcon);

                        let leaderboardEntryGameTimeValue = document.createElement('p');
                        leaderboardEntryGameTimeValue.classList.add('leaderboard-entry-game-time-value','leaderboard-outline');
                        leaderboardEntryGameTimeValue.innerHTML = formatScoreTime(scorePartsObj["Game Time"].score);
                        leaderboardEntryGameTime.appendChild(leaderboardEntryGameTimeValue);

                        break;
                    case "LeastTiers":
                        leaderboardEntryMainScore.innerHTML = entry.score.toLocaleString();
                        leaderboardEntryScoreIcon.src = `./Assets/UI/LeastTiersIconSmall.png`;
                        leaderboardEntryScoreIcon.classList.add('leaderboard-entry-score-icon-large');

                        let leaderboardEntryGameTimeTiers = document.createElement('div');
                        leaderboardEntryGameTimeTiers.classList.add('leaderboard-entry-game-time');
                        leaderboardEntryDiv.appendChild(leaderboardEntryGameTimeTiers);

                        let leaderboardEntryGameTimeTiersIcon = document.createElement('img');
                        leaderboardEntryGameTimeTiersIcon.classList.add('leaderboard-entry-score-icon');
                        leaderboardEntryGameTimeTiersIcon.src = "./Assets/UI/StopWatch.png";
                        leaderboardEntryGameTimeTiers.appendChild(leaderboardEntryGameTimeTiersIcon);

                        let leaderboardEntryGameTimeTiersValue = document.createElement('p');
                        leaderboardEntryGameTimeTiersValue.classList.add('leaderboard-entry-game-time-value','leaderboard-outline');
                        leaderboardEntryGameTimeTiersValue.innerHTML = formatScoreTime(scorePartsObj["Game Time"].score);
                        leaderboardEntryGameTimeTiers.appendChild(leaderboardEntryGameTimeTiersValue);

                        leaderboardEntryScore.classList.add('leaderboard-entry-score-tiers')
                        break;
                }
            }
            if(metadata.hasOwnProperty('tiles')) {
                leaderboardEntryScoreIcon.src = `./Assets/UI/CtPointsIconSmall.png`;
                leaderboardEntryScoreIcon.classList.add('leaderboard-entry-score-icon-large');
                leaderboardEntryMainScore.innerHTML = entry.score.toLocaleString();
                leaderboardEntryPlayer.classList.add('leaderboard-entry-team');
            }

            // let leaderboardProfileBtn = document.createElement('img');
            // leaderboardProfileBtn.classList.add('leaderboard-profile-btn');
            // leaderboardProfileBtn.src = "./Assets/UI/InfoBtn.png";
            // leaderboardProfileBtn.addEventListener('click', () => {
            //     openProfile('leaderboard', entry);
            // })
            // if (type != "CTTeam") {
            //     leaderboardEntry.appendChild(leaderboardProfileBtn);
            // }

            //observer to check for if profile should be queried
            let observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(async observerentry => {
                    if (observerentry.isIntersecting) {
                        let userProfile = await getUserProfile(entry.profile);
                        if (userProfile != null) {
                            console.log(userProfile)
                            if(userProfile.hasOwnProperty('owner')) {
                                leaderboardEntryFrame.src = userProfile.frameURL;
                                leaderboardEntryEmblem.src = userProfile.iconURL;
                                leaderboardEntryDiv.style.backgroundImage = `url(${parseInt(userProfile.banner.replace(/\D/g,'')) <= constants.profileBanners ? getProfileBanner(userProfile.banner) : userProfile.bannerURL})`;
                                // leaderboardEntryPlayer.style.width = "470px";
                                observer.unobserve(observerentry.target);
                            } else {
                                leaderboardEntryIcon.src = parseInt(userProfile.avatar.replace(/\D/g,'')) <= constants.profileAvatars ? getProfileIcon(userProfile.avatar) : userProfile.avatarURL;
                                leaderboardEntryDiv.style.backgroundImage = `url(${(parseInt(userProfile.banner.replace(/\D/g,'')) <= constants.profileBanners) ? getProfileBanner(userProfile.banner) : userProfile.bannerURL})`;
                                observer.unobserve(observerentry.target);
                            }
                        }
                    }
                });
            });
            observer.observe(leaderboardEntryIcon);
        })
    } else {
        let noDataFound = document.createElement('p');
        noDataFound.classList.add('no-data-found');
        noDataFound.classList.add('black-outline');
        noDataFound.style.width = "250px";
        noDataFound.innerHTML = "No Data Found";
        leaderboardEntries.appendChild(noDataFound);
    }
}

function exitChallengeModel(source){
    document.getElementById('challenge-content').style.display = "none";
    document.getElementById(`${source}-content`).style.display = "flex";
}

function exitMapModel(source){
    document.getElementById('map-content').style.display = "none";
    document.getElementById(`${source}-content`).style.display = "flex";
}

async function openProfile(source, profile){
    profile = await getUserProfile(profile.profile)
    if (profile == null) { return; }
    resetScroll();
    document.getElementById(`${source}-content`).style.display = "none";
    let publicProfileContent = document.getElementById('publicprofile-content');
    publicProfileContent.style.display = "flex";
    publicProfileContent.innerHTML = "";
    
    let publicProfileDiv = document.createElement('div');
    publicProfileDiv.classList.add('publicprofile-div');
    publicProfileContent.appendChild(publicProfileDiv);

    // let challengeHeaderExitBtn = document.createElement('div');
    // challengeHeaderExitBtn.classList.add('challenge-header-exit-btn');
    // challengeHeaderExitBtn.classList.add('maps-progress-view','black-outline');
    // challengeHeaderExitBtn.innerHTML = "Exit";
    // challengeHeaderExitBtn.addEventListener('click', () => {
    //     exitProfile(source);
    // })
    // publicProfileDiv.appendChild(challengeHeaderExitBtn);

    let modalClose = document.createElement('img');
    modalClose.classList.add('error-modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        exitProfile(source);
    })
    publicProfileDiv.appendChild(modalClose);

    let profileHeader = document.createElement('div');
    profileHeader.id = 'profile-header';
    profileHeader.classList.add('profile-header');
    profileHeader.classList.add('profile-banner');
    profileHeader.style.backgroundImage = `linear-gradient(to bottom, transparent 50%, var(--profile-primary) 70%),url('${profile["bannerURL"]}')`;
    publicProfileDiv.appendChild(profileHeader);
    profileHeader.appendChild(generateAvatar(100, profile["avatarURL"]));

    let profileTopBottom = document.createElement('div');
    profileTopBottom.id = 'profile-top-bottom';
    profileTopBottom.classList.add('profile-top-bottom');
    profileHeader.appendChild(profileTopBottom);

    let profileTop = document.createElement('div');
    profileTop.id = 'profile-top';
    profileTop.classList.add('profile-top-public');
    profileTopBottom.appendChild(profileTop);

    let profileName = document.createElement('p');
    profileName.id = 'profile-name';
    profileName.classList.add('profile-name');
    profileName.classList.add('black-outline');
    profileName.innerHTML = profile["displayName"];
    profileTop.appendChild(profileName);

    let rankStar = document.createElement('div');
    rankStar.id = 'rank-star';
    rankStar.classList.add('rank-star-public');
    profileTop.appendChild(rankStar);

    let rankImg = document.createElement('img');
    rankImg.id = 'rank-img';
    rankImg.classList.add('rank-img');
    rankImg.src = '../Assets/UI/LvlHolder.png';
    rankStar.appendChild(rankImg);

    let rankText = document.createElement('p');
    rankText.id = 'rank-text';
    rankText.classList.add('rank-text');
    rankText.classList.add('black-outline');
    rankText.innerHTML = profile.rank;
    rankStar.appendChild(rankText);

    let rankStarVeteran = document.createElement('div');
    rankStarVeteran.id = 'rank-star';
    rankStarVeteran.classList.add('rank-star-public');
    profileTop.appendChild(rankStarVeteran);

    let rankImgVeteran = document.createElement('img');
    rankImgVeteran.id = 'rank-img';
    rankImgVeteran.classList.add('rank-img');
    rankImgVeteran.src = '../Assets/UI/LvlHolderVeteran.png';
    rankStarVeteran.appendChild(rankImgVeteran);

    let rankTextVeteran = document.createElement('p');
    rankTextVeteran.id = 'rank-text';
    rankTextVeteran.classList.add('rank-text');
    rankTextVeteran.classList.add('black-outline');
    rankTextVeteran.innerHTML = profile.veteranRank;
    rankStarVeteran.appendChild(rankTextVeteran);

    let profileFollowers = document.createElement('div')
    profileFollowers.classList.add('profile-followers');
    profileTop.appendChild(profileFollowers);

    let followersLabel = document.createElement('p');
    followersLabel.classList.add('followers-label');
    followersLabel.classList.add('black-outline');
    followersLabel.innerHTML = 'Followers';
    profileFollowers.appendChild(followersLabel);

    let followersCount = document.createElement('p');
    followersCount.classList.add('followers-count');
    followersCount.innerHTML = profile["followers"].toLocaleString();
    profileFollowers.appendChild(followersCount);


    let belowProfileHeader = document.createElement('div');
    belowProfileHeader.id = 'below-profile-header';
    belowProfileHeader.classList.add('below-profile-header');
    publicProfileDiv.appendChild(belowProfileHeader);

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
    leftColumnHeaderText.innerHTML = 'Medals';
    leftColumnHeader.appendChild(leftColumnHeaderText);

    let publicMedals = {};
    let tempCoop = {};
    for (let [key, value] of Object.entries(medalMap)){
        publicMedals["Medal" + value] = profile["_medalsSinglePlayer"][key] || 0;
        tempCoop["MedalCoop" + value] = profile["_medalsMultiplayer"][key] || 0;
    }
    publicMedals = {...publicMedals, ...tempCoop};
    publicMedals["PhayzeEliteBadge"] = profile["bossBadgesElite"]["Phayze"] || 0;
    publicMedals["PhayzeBadge"] = profile["bossBadgesNormal"]["Phayze"] || 0;
    publicMedals["DreadbloonEliteBadge"] = profile["bossBadgesElite"]["Dreadbloon"] || 0;
    publicMedals["DreadbloonBadge"] = profile["bossBadgesNormal"]["Dreadbloon"] || 0;
    publicMedals["VortexEliteBadge"] = profile["bossBadgesElite"]["Vortex"] || 0;
    publicMedals["VortexBadge"] = profile["bossBadgesNormal"]["Vortex"] || 0;
    publicMedals["LychEliteBadge"] = profile["bossBadgesElite"]["Lych"] || 0;
    publicMedals["LychBadge"] = profile["bossBadgesNormal"]["Lych"] || 0;
    publicMedals["BloonariusEliteBadge"] = profile["bossBadgesElite"]["Bloonarius"] || 0;
    publicMedals["BloonariusBadge"] = profile["bossBadgesNormal"]["Bloonarius"] || 0;
    publicMedals["MedalEventBronzeMedal"] = profile["_medalsRace"]["Bronze"] || 0;
    publicMedals["MedalEventSilverMedal"] = profile["_medalsRace"]["Silver"] || 0;
    publicMedals["MedalEventGoldSilverMedal"] = profile["_medalsRace"]["GoldSilver"] || 0;
    publicMedals["MedalEventDoubleGoldMedal"] = profile["_medalsRace"]["DoubleGold"] || 0;
    publicMedals["MedalEventGoldDiamondMedal"] = profile["_medalsRace"]["GoldDiamond"] || 0;
    publicMedals["MedalEventRedDiamondMedal"] = profile["_medalsRace"]["RedDiamond"] || 0;
    publicMedals["MedalEventBlackDiamondMedal"] = profile["_medalsRace"]["BlackDiamond"] || 0;
    publicMedals["OdysseyStarIcon"] = profile.gameplay["totalOdysseyStars"] || 0;
    publicMedals["BossMedalEventBronzeMedal"] = profile["_medalsBoss"]["Bronze"] || 0;
    publicMedals["BossMedalEventSilverMedal"] = profile["_medalsBoss"]["Silver"] || 0;
    publicMedals["BossMedalEventDoubleSilverMedal"] = profile["_medalsBoss"]["DoubleSilver"] || 0;
    publicMedals["BossMedalEventGoldSilverMedal"] = profile["_medalsBoss"]["GoldSilver"] || 0;
    publicMedals["BossMedalEventDoubleGoldMedal"] = profile["_medalsBoss"]["DoubleGold"] || 0;
    publicMedals["BossMedalEventGoldDiamondMedal"] = profile["_medalsBoss"]["GoldDiamond"] || 0;
    publicMedals["BossMedalEventDiamondMedal"] = profile["_medalsBoss"]["Diamond"] || 0;
    publicMedals["BossMedalEventRedDiamondMedal"] = profile["_medalsBoss"]["RedDiamond"] || 0;
    publicMedals["BossMedalEventBlackDiamondMedal"] = profile["_medalsBoss"]["BlackDiamond"] || 0;
    publicMedals["EliteBossMedalEventBronzeMedal"] = profile["_medalsBossElite"]["Bronze"] || 0;
    publicMedals["EliteBossMedalEventSilverMedal"] = profile["_medalsBossElite"]["Silver"] || 0;
    publicMedals["EliteBossMedalEventDoubleSilverMedal"] = profile["_medalsBossElite"]["DoubleSilver"] || 0;
    publicMedals["EliteBossMedalEventGoldSilverMedal"] = profile["_medalsBossElite"]["GoldSilver"] || 0;
    publicMedals["EliteBossMedalEventDoubleGoldMedal"] = profile["_medalsBossElite"]["DoubleGold"] || 0;
    publicMedals["EliteBossMedalEventGoldDiamondMedal"] = profile["_medalsBossElite"]["GoldDiamond"] || 0;
    publicMedals["EliteBossMedalEventDiamondMedal"] = profile["_medalsBossElite"]["Diamond"] || 0;
    publicMedals["EliteBossMedalEventRedDiamondMedal"] = profile["_medalsBossElite"]["RedDiamond"] || 0;
    publicMedals["EliteBossMedalEventBlackDiamondMedal"] = profile["_medalsBossElite"]["BlackDiamond"] || 0;
    publicMedals["CtLocalPlayerBronzeMedal"] = profile["_medalsCTLocal"]["Bronze"] || 0;
    publicMedals["CtLocalPlayerSilverMedal"] = profile["_medalsCTLocal"]["Silver"] || 0;
    publicMedals["CtLocalPlayerDoubleGoldMedal"] = profile["_medalsCTLocal"]["DoubleGold"] || 0;
    publicMedals["CtLocalPlayerDiamondMedal"] = profile["_medalsCTLocal"]["Diamond"] || 0;
    publicMedals["CtLocalPlayerRedDiamondMedal"] = profile["_medalsCTLocal"]["RedDiamond"] || 0;
    publicMedals["CtLocalPlayerBlackDiamondMedal"] = profile["_medalsCTLocal"]["BlackDiamond"] || 0;
    publicMedals["CtGlobalPlayerBronzeMedal"] = profile["_medalsCTGlobal"]["Bronze"] || 0;
    publicMedals["CtGlobalPlayerSilverMedal"] = profile["_medalsCTGlobal"]["Silver"] || 0;
    publicMedals["CtGlobalPlayerDoubleSilverMedal"] = profile["_medalsCTGlobal"]["DoubleSilver"] || 0;
    publicMedals["CtGlobalPlayerGoldSilverMedal"] = profile["_medalsCTGlobal"]["GoldSilver"] || 0;
    publicMedals["CtGlobalPlayerDoubleGoldMedal"] = profile["_medalsCTGlobal"]["DoubleGold"] || 0;
    publicMedals["CtGlobalPlayerGoldDiamondMedal"] = profile["_medalsCTGlobal"]["GoldDiamond"] || 0;
    publicMedals["CtGlobalPlayerDiamondMedal"] = profile["_medalsCTGlobal"]["Diamond"] || 0;

    let currencyAndMedalsDiv = document.createElement('div');
    currencyAndMedalsDiv.id = 'currency-medals-div';
    currencyAndMedalsDiv.classList.add('currency-medals-div');
    leftColumnDiv.appendChild(currencyAndMedalsDiv);

    let medalsDiv = document.createElement('div');
    medalsDiv.id = 'medals-div';
    medalsDiv.classList.add('medals-div');
    currencyAndMedalsDiv.appendChild(medalsDiv);

    for (let [medal, num] of Object.entries(publicMedals)){
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

    let topHeroesMonkesyDiv = document.createElement('div');
    topHeroesMonkesyDiv.id = 'top-heroes-monkeys-div';
    topHeroesMonkesyDiv.classList.add('top-heroes-monkeys-div');
    leftColumnDiv.appendChild(topHeroesMonkesyDiv);
    
    /*let topColumnDiv = document.createElement('div');
    topColumnDiv.id = 'top-column-div';
    topColumnDiv.classList.add('right-column-div');
    leftColumnDiv.appendChild(topColumnDiv);*/

    let topHeroesDiv = document.createElement('div');
    topHeroesDiv.id = 'top-heroes-div';
    topHeroesDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topHeroesDiv);

    let topHeroesTopDiv = document.createElement('div');
    topHeroesTopDiv.id = 'top-heroes-top-div';
    topHeroesTopDiv.classList.add('top-heroes-top-div');
    topHeroesDiv.appendChild(topHeroesTopDiv);

    let topHeroesTopRibbonDiv = document.createElement('div');
    topHeroesTopRibbonDiv.id = 'top-heroes-top-div';
    topHeroesTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topHeroesTopDiv.appendChild(topHeroesTopRibbonDiv);

    let topHeroesText = document.createElement('p');
    topHeroesText.id = 'top-heroes-text';
    topHeroesText.classList.add('top-heroes-text');
    topHeroesText.classList.add('black-outline');
    topHeroesText.innerHTML = 'Top Heroes';
    topHeroesTopRibbonDiv.appendChild(topHeroesText);

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.id = 'maps-progress-coop-toggle';
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    topHeroesTopDiv.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.id = 'maps-progress-coop-toggle-text';
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressCoopToggleText.classList.add('black-outline');
    mapsProgressCoopToggleText.innerHTML = "Show All: ";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggleInput.addEventListener('change', () => {
        mapsProgressCoopToggleInput.checked ? document.getElementById('other-heroes-div-public').style.display = 'flex' : document.getElementById('other-heroes-div-public').style.display = 'none';
    })
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);


    let topHeroesList = document.createElement('div');
    topHeroesList.id = 'top-heroes-list';
    topHeroesList.classList.add('top-heroes-list');
    topHeroesDiv.appendChild(topHeroesList);

    let top3HeroesDiv = document.createElement('div');
    top3HeroesDiv.id = 'top-3-heroes-div';
    top3HeroesDiv.classList.add('top-3-heroes-div');
    topHeroesList.appendChild(top3HeroesDiv);

    let otherHeroesDiv = document.createElement('div');
    otherHeroesDiv.id = 'other-heroes-div-public';
    otherHeroesDiv.classList.add('other-heroes-div');
    otherHeroesDiv.style.display = 'none';
    topHeroesList.appendChild(otherHeroesDiv);

    let counter = 0;

    for (let [hero, xp] of Object.entries(profile["heroesPlaced"]).sort((a, b) => b[1] - a[1])){
        let heroDiv = document.createElement('div');
        heroDiv.id = 'hero-div';
        heroDiv.classList.add('hero-div');
        counter < 3 ? top3HeroesDiv.appendChild(heroDiv) : otherHeroesDiv.appendChild(heroDiv);

        let heroImg = document.createElement('img');
        heroImg.id = 'hero-img';
        heroImg.classList.add('hero-img');
        heroImg.src = getHeroPortrait(hero,1);
        heroImg.style.display = "none";
        heroImg.addEventListener('load', () => {
            if(heroImg.width < heroImg.height){
                heroImg.style.width = `${ratioCalc(3,150,1920,0,heroImg.width)}px`
            } else {
                heroImg.style.height = `${ratioCalc(3,150,1920,0,heroImg.height)}px`
            }
            heroImg.style.removeProperty('display');
        })
        heroDiv.appendChild(heroImg);

        let heroText = document.createElement('p');
        heroText.id = 'hero-text';
        heroText.classList.add('hero-text');
        heroText.classList.add('black-outline');
        heroText.innerHTML = xp.toLocaleString();
        heroDiv.appendChild(heroText);
        counter++;
    }

    let topTowersDiv = document.createElement('div');
    topTowersDiv.id = 'top-towers-div';
    topTowersDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topTowersDiv);

    let topTowersTopDiv = document.createElement('div');
    topTowersTopDiv.id = 'top-towers-top-div';
    topTowersTopDiv.classList.add('top-heroes-top-div');
    topTowersDiv.appendChild(topTowersTopDiv);

    let topTowersTopRibbonDiv = document.createElement('div');
    topTowersTopRibbonDiv.id = 'top-towers-top-div';
    topTowersTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topTowersTopDiv.appendChild(topTowersTopRibbonDiv);

    let topTowersText = document.createElement('p');
    topTowersText.id = 'top-towers-text';
    topTowersText.classList.add('top-heroes-text');
    topTowersText.classList.add('black-outline');
    topTowersText.innerHTML = 'Top Towers';
    topTowersTopRibbonDiv.appendChild(topTowersText);

    let mapsProgressCoopToggle2 = document.createElement('div');
    mapsProgressCoopToggle2.id = 'maps-progress-coop-toggle';
    mapsProgressCoopToggle2.classList.add('maps-progress-coop-toggle');
    topTowersTopDiv.appendChild(mapsProgressCoopToggle2);

    let mapsProgressCoopToggleText2 = document.createElement('p');
    mapsProgressCoopToggleText2.id = 'maps-progress-coop-toggle-text';
    mapsProgressCoopToggleText2.classList.add('maps-progress-coop-toggle-text');
    mapsProgressCoopToggleText2.classList.add('black-outline');
    mapsProgressCoopToggleText2.innerHTML = "Show All: ";
    mapsProgressCoopToggle2.appendChild(mapsProgressCoopToggleText2);

    let mapsProgressCoopToggleInput2 = document.createElement('input');
    mapsProgressCoopToggleInput2.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput2.type = 'checkbox';
    mapsProgressCoopToggleInput2.addEventListener('change', () => {
        mapsProgressCoopToggleInput2.checked ? document.getElementById('other-towers-div-public').style.display = 'flex' : document.getElementById('other-towers-div-public').style.display = 'none';
    })
    mapsProgressCoopToggle2.appendChild(mapsProgressCoopToggleInput2);

    
    let topTowersList = document.createElement('div');
    topTowersList.id = 'top-towers-list';
    topTowersList.classList.add('top-heroes-list');
    topTowersDiv.appendChild(topTowersList);

    let top3TowersDiv = document.createElement('div');
    top3TowersDiv.id = 'top-3-towers-div';
    top3TowersDiv.classList.add('top-3-heroes-div');
    topTowersList.appendChild(top3TowersDiv);

    let otherTowersDiv = document.createElement('div');
    otherTowersDiv.id = 'other-towers-div-public';
    otherTowersDiv.classList.add('other-heroes-div');
    otherTowersDiv.style.display = 'none';
    topTowersList.appendChild(otherTowersDiv);

    counter = 0;

    for (let [tower, xp] of Object.entries(profile["towersPlaced"]).sort((a, b) => b[1] - a[1])){
        let towerDiv = document.createElement('div');
        towerDiv.id = 'tower-div';
        towerDiv.classList.add('hero-div');
        counter < 3 ? top3TowersDiv.appendChild(towerDiv) : otherTowersDiv.appendChild(towerDiv);

        let towerImg = document.createElement('img');
        towerImg.id = 'tower-img';
        towerImg.classList.add('hero-img');
        towerImg.src = getInstaContainerIcon(tower,"000");
        towerDiv.appendChild(towerImg);

        let towerText = document.createElement('p');
        towerText.id = 'tower-text';
        towerText.classList.add('hero-text');
        towerText.classList.add('black-outline');
        towerText.innerHTML = xp.toLocaleString();
        towerDiv.appendChild(towerText);
        counter++;
    }


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

    let statsPublic = {};
    statsPublic["Games Played"] = profile.gameplay["gameCount"];
    statsPublic["Games Won"] = profile.gameplay["gamesWon"];
    statsPublic["Highest Round (All Time)"] = profile.gameplay["highestRound"];
    statsPublic["Highest Round (CHIMPS)"] = profile.gameplay["highestRoundCHIMPS"];
    statsPublic["Highest Round (Deflation)"] = profile.gameplay["highestRoundDeflation"];
    statsPublic["Monkeys Placed"] = profile.gameplay["monkeysPlaced"];
    statsPublic["Total Pop Count"] = profile.bloonsPopped["bloonsPopped"];
    statsPublic["Total Co-Op Pop Count"] = profile.bloonsPopped["coopBloonsPopped"];
    statsPublic["Camo Bloons Popped"] = profile.bloonsPopped["camosPopped"];
    statsPublic["Lead Bloons Popped"] = profile.bloonsPopped["leadsPopped"];
    statsPublic["Purple Bloons Popped"] = profile.bloonsPopped["purplesPopped"];
    statsPublic["Regrow Bloons Popped"] = profile.bloonsPopped["regrowsPopped"];
    statsPublic["Ceramic Bloons Popped"] = profile.bloonsPopped["ceramicsPopped"];
    statsPublic["MOABs Popped"] = profile.bloonsPopped["moabsPopped"];
    statsPublic["BFBs Popped"] = profile.bloonsPopped["bfbsPopped"];
    statsPublic["ZOMGs Popped"] = profile.bloonsPopped["zomgsPopped"];
    statsPublic["DDTs Popped"] = profile.bloonsPopped["ddtsPopped"];
    statsPublic["BADs Popped"] = profile.bloonsPopped["badsPopped"];
    statsPublic["Bloons Leaked"] = profile.bloonsPopped["bloonsLeaked"];
    statsPublic["Cash Generated"] = profile.gameplay["cashEarned"];
    statsPublic["Cash Gifted"] = profile.gameplay["coopCashGiven"];
    statsPublic["Abilities Used"] = profile.gameplay["abilitiesUsed"];
    statsPublic["Powers Used"] = profile.gameplay["powersUsed"];
    statsPublic["Insta Monkeys Used"] = profile.gameplay["instaMonkeysUsed"];
    statsPublic["Daily Reward Chests Opened"] = profile.gameplay["dailyRewards"];
    statsPublic["Challenges Completed"] = profile.gameplay["challengesCompleted"];
    statsPublic["Achievements"] = `${profile["achievements"]}/150`;
    statsPublic["Odysseys Completed"] = profile.gameplay["totalOdysseysCompleted"];
    statsPublic["Lifetime Trophies"] = profile.gameplay["totalTrophiesEarned"];
    statsPublic["Necro Bloons Reanimated"] = profile.bloonsPopped["necroBloonsReanimated"];
    statsPublic["Transforming Tonics Used"] = profile.bloonsPopped["transformingTonicsUsed"];
    statsPublic["Most Experienced Monkey"] = getLocValue(profile["mostExperiencedMonkey"]);
    statsPublic["Insta Monkey Collection"] = `${profile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
    statsPublic["Collection Chests Opened"] = profile.gameplay["collectionChestsOpened"];
    statsPublic["Golden Bloons Popped"] = profile.bloonsPopped["goldenBloonsPopped"];
    statsPublic["Monkey Teams Wins"] = profile.gameplay["monkeyTeamsWins"];
    statsPublic["Bosses Popped"] = profile.bloonsPopped["bossesPopped"];
    statsPublic["Damage Done To Bosses"] = profile.gameplay["damageDoneToBosses"];

    let profileStatsDiv = document.createElement('div');
    profileStatsDiv.id = 'profile-stats';
    profileStatsDiv.classList.add('profile-stats');
    rightColumnDiv.appendChild(profileStatsDiv);

    for (let [key, value] of Object.entries(statsPublic)){
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

function exitProfile(source){
    document.getElementById('publicprofile-content').style.display = "none";
    document.getElementById(`${source}-content`).style.display = "flex";
}

async function openRelics(source, tilesLink, eventDates) {
    console.log(tilesLink)
    let data = await getCTTiles(tilesLink)
    console.log(data)
    if (data == null) { return; }
    document.getElementById(`${source}-content`).style.display = "none";
    let relicsContent = document.getElementById('relics-content');
    relicsContent.style.display = "flex";
    relicsContent.innerHTML = "";

    let relicContainer = document.createElement('div');
    relicContainer.classList.add('relic-container');
    relicsContent.appendChild(relicContainer);
    resetScroll();

    let relicHeader = document.createElement('div');
    relicHeader.classList.add('relic-header');
    relicContainer.appendChild(relicHeader);

    let relicHeaderViews = document.createElement('div');
    relicHeaderViews.classList.add('relic-header-views');
    relicHeader.appendChild(relicHeaderViews);

    let relicDetailView = document.createElement('div');
    relicDetailView.classList.add('maps-progress-view', 'black-outline', 'stats-tab-yellow');
    relicDetailView.innerHTML = "List";
    relicHeaderViews.appendChild(relicDetailView);

    let relicTileView = document.createElement('div');
    relicTileView.classList.add('maps-progress-view','black-outline');
    relicTileView.innerHTML = "Tile";
    relicHeaderViews.appendChild(relicTileView);

    relicDetailView.addEventListener('click', () => {
        relicDetailView.classList.add('stats-tab-yellow');
        relicTileView.classList.remove('stats-tab-yellow');
        document.querySelectorAll('.relic-text-div').forEach(element => {
            if (element.classList.contains('relic-tile-view')) {
                element.classList.remove('relic-tile-view');
            }
        })
    })

    relicTileView.addEventListener('click', () => {
        relicTileView.classList.add('stats-tab-yellow');
        relicDetailView.classList.remove('stats-tab-yellow');
        document.querySelectorAll('.relic-text-div').forEach(element => {
            if (!element.classList.contains('relic-tile-view')) {
                element.classList.add('relic-tile-view');
            }
        })
    })

    let relicHeaderTitle = document.createElement('p');
    relicHeaderTitle.classList.add('relic-header-title','black-outline');
    relicHeaderTitle.innerHTML = `Contested Territory<br>${eventDates}`;
    relicHeader.appendChild(relicHeaderTitle);

    let relicHeaderRight = document.createElement('div');
    relicHeaderRight.classList.add('relic-header-right');
    relicHeader.appendChild(relicHeaderRight);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        relicsContent.style.display = "none";
        document.getElementById(`${source}-content`).style.display = "flex";
    })
    relicHeaderRight.appendChild(modalClose);

    //get only elements with "Relic" in the key "type" in data.tiles entries of .type
    let relics =  data.tiles.filter(tile => tile.type.includes("Relic"))
    console.log(relics)
    // sort the relics alphabetically by "id"
    relics.sort((a, b) => a.id.localeCompare(b.id))
    console.log(relics)

    let relicsDiv = document.createElement('div');
    relicsDiv.classList.add('relics-div');
    relicContainer.appendChild(relicsDiv);

    relics.forEach(relic => {
        let relicTypeName = relic.type.split(" ")[2];
        console.log(relicTypeName)

        let relicDiv = document.createElement('div');
        relicDiv.classList.add('relic-div');
        relicsDiv.appendChild(relicDiv);

        switch(relic.id.charAt(0)){
            case "A":
                relicDiv.style.backgroundColor = "#9C55E4"
                break;
            case "B":
                relicDiv.style.backgroundColor = "#E978AA"
                break;
            case "C":
                relicDiv.style.backgroundColor = "#00DD6B"
                break;
            case "D":
                relicDiv.style.backgroundColor = "#04A6F3"
                break;
            case "E":
                relicDiv.style.backgroundColor = "#F7D302"
                break;
            case "F":
                relicDiv.style.backgroundColor = "#F4413F"
                break;
            case "M":
                relicDiv.style.backgroundColor = "#B9E546"
                break;
        }

        //relicID
        let relicID = document.createElement('p');
        relicID.classList.add('relic-id');
        relicID.innerHTML = relic.id;
        relicDiv.appendChild(relicID);
        //relicIcon
        let relicIcon = document.createElement('img');
        relicIcon.classList.add('relic-icon');
        relicIcon.src = `./Assets/RelicIcon/${relicTypeName}.png`
        relicDiv.appendChild(relicIcon);

        let relicTextDiv = document.createElement('div');
        relicTextDiv.classList.add('relic-text-div');
        relicDiv.appendChild(relicTextDiv);
        //relicName
        let relicName = document.createElement('p');
        relicName.classList.add('relic-name');
        relicName.classList.add('black-outline');
        relicName.innerHTML = getLocValue(`Relic${relicTypeName}`);
        relicTextDiv.appendChild(relicName);
        //relicDescription
        let relicDescription = document.createElement('p');
        relicDescription.classList.add('relic-description');
        relicDescription.innerHTML = getLocValue(`Relic${relicTypeName}Description`);
        relicTextDiv.appendChild(relicDescription);
    })

}

function generateExplore() {
    let exploreContent = document.getElementById('explore-content');
    exploreContent.innerHTML = "";

    let explorePage = document.createElement('div');
    explorePage.classList.add('progress-page');
    exploreContent.appendChild(explorePage);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.classList.add('selectors-div');
    explorePage.appendChild(selectorsDiv);

    let selectors = ['Challenge Browser', 'Map Browser'];

    selectors.forEach((selector) => {
        let selectorDiv = document.createElement('div');
        selectorDiv.id = selector.toLowerCase() + '-div';
        selectorDiv.classList.add('selector-div');
        selectorDiv.addEventListener('click', () => {
            exploreContent.style.display = "none";
            document.getElementById('browser-content').style.display = "flex"
            changeBrowserTab(selector);
        })
        selectorsDiv.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
        selectorImg.id = selector.toLowerCase() + '-img';
        selectorImg.classList.add('selector-img');
        selectorDiv.appendChild(selectorImg);

        switch(selector){
            case 'Challenge Browser':
                selectorImg.src = '../Assets/UI/PatchNotesMonkeyIcon.png';
                selectorDiv.classList.add('blueprint-bg');
                break;
            case 'Map Browser':
                selectorImg.src = '../Assets/UI/MapEditorBtn.png';
                selectorDiv.classList.add('map-model-bg', 'map-browser-selector');
                break;
        }

        let selectorText = document.createElement('p');
        selectorText.id = selector.toLowerCase() + '-text';
        selectorText.classList.add('selector-text','black-outline');
        selectorText.innerHTML = selector;
        selectorDiv.appendChild(selectorText);

        let selectorGoImg = document.createElement('img');
        selectorGoImg.id = selector.toLowerCase() + '-go-img';
        selectorGoImg.classList.add('selector-go-img');
        selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
        selectorDiv.appendChild(selectorGoImg);
    })
}

function changeBrowserTab(selected){
    resetScroll();
    currentBrowserView = "Grid";
    switch(selected){
        case 'Challenge Browser':
            browserLink = "https://data.ninjakiwi.com/btd6/challenges/filter/"
            break;
        case 'Map Browser':
            browserLink = "https://data.ninjakiwi.com/btd6/maps/filter/"
            break;
    }
    generateBrowser(selected);
}

function generateBrowser(type){
    let browserContent = document.getElementById('browser-content');
    browserContent.innerHTML = "";

    let browserDiv = document.createElement('div');
    browserDiv.classList.add('browser-div');
    browserContent.appendChild(browserDiv);

    let mapsProgressHeaderBar = document.createElement('div');
    mapsProgressHeaderBar.classList.add('maps-progress-header-bar', 'browser-header-bar');
    browserDiv.appendChild(mapsProgressHeaderBar);

    let mapProgressHeaderTop = document.createElement('div');
    mapProgressHeaderTop.classList.add('map-progress-header-top');
    mapsProgressHeaderBar.appendChild(mapProgressHeaderTop);

    let mapsProgressHeaderTitle = document.createElement('p');
    mapsProgressHeaderTitle.classList.add('browser-header-title','black-outline');
    mapsProgressHeaderTitle.innerHTML = type;
    mapProgressHeaderTop.appendChild(mapsProgressHeaderTitle);

    let mapsProgressHeaderDesc = document.createElement('p');
    mapsProgressHeaderDesc.classList.add('browser-header-desc');
    mapsProgressHeaderDesc.innerHTML = "Only 100 entries (4 pages) are available on the API. You can enter a specific ID at the bottom right";
    mapProgressHeaderTop.appendChild(mapsProgressHeaderDesc);

    let mapProgressHeaderBottom = document.createElement('div');
    mapProgressHeaderBottom.classList.add('map-progress-header-bottom');
    mapsProgressHeaderBar.appendChild(mapProgressHeaderBottom);

    let mapsProgressViews = document.createElement('div');
    mapsProgressViews.id = 'maps-progress-views';
    mapsProgressViews.classList.add('maps-progress-views');
    mapProgressHeaderBottom.appendChild(mapsProgressViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.id = 'maps-progress-views-text';
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressViewsText.classList.add('black-outline');
    mapsProgressViewsText.innerHTML = "Display Type:";
    mapsProgressViews.appendChild(mapsProgressViewsText);

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
    mapsProgressFilterDifficultyText.innerHTML = "Category Type:";
    mapProgressFilterDifficulty.appendChild(mapsProgressFilterDifficultyText);

    let mapProgressFilterDifficultySelect = document.createElement('select');
    mapProgressFilterDifficultySelect.id = 'map-progress-filter-difficulty-select';
    mapProgressFilterDifficultySelect.classList.add('map-progress-filter-difficulty-select');
    mapProgressFilterDifficultySelect.addEventListener('change', () => {
        changeBrowserFilter(type, mapProgressFilterDifficultySelect.value);
    })
    mapProgressFilterDifficulty.appendChild(mapProgressFilterDifficultySelect);

    let leaderboardEntries = document.createElement('div');
    leaderboardEntries.id = 'browser-entries';
    // leaderboardEntries.classList.add('leaderboard-entries');
    browserDiv.appendChild(leaderboardEntries);

    let leaderboardFooter = document.createElement('div');
    leaderboardFooter.classList.add('browser-footer');
    browserDiv.appendChild(leaderboardFooter);

    //left div
    let leaderboardFooterLeft = document.createElement('div');
    leaderboardFooterLeft.classList.add('leaderboard-footer-left', 'browser-footer-left');
    leaderboardFooter.appendChild(leaderboardFooterLeft);
    //refresh button
    let leaderboardFooterRefresh = document.createElement('img');
    leaderboardFooterRefresh.classList.add('leaderboard-footer-refresh');
    leaderboardFooterRefresh.src = "./Assets/UI/RefreshBtn.png";
    leaderboardFooterRefresh.addEventListener('click', () => {
        if(!refreshRateLimited) {
        cacheBust = true;
        generateBrowserEntries(type)
        leaderboardFooterRefresh.style.filter = "grayscale(1) brightness(0.5)"
        setTimeout(() => {
            leaderboardFooterRefresh.style.filter = "none";
            refreshRateLimited = false;
        }, 10000)
        refreshRateLimited = true;
        }
    })
    leaderboardFooterLeft.appendChild(leaderboardFooterRefresh);

    //middle div
    let leaderboardFooterMiddle = document.createElement('div');
    leaderboardFooterMiddle.classList.add('leaderboard-footer-middle', 'browser-footer-middle');
    leaderboardFooter.appendChild(leaderboardFooterMiddle);
    //page left

    let leaderboardFooterPageLeft = document.createElement('img');
    leaderboardFooterPageLeft.classList.add('leaderboard-footer-page-left','black-outline');
    leaderboardFooterPageLeft.src = "./Assets/UI/NextArrowSmallYellow.png";
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageLeft);
    //page number
    let leaderboardFooterPageNumber = document.createElement('div');
    leaderboardFooterPageNumber.id = 'browser-footer-page-number';
    leaderboardFooterPageNumber.classList.add('leaderboard-footer-page-number','black-outline');
    leaderboardFooterPageNumber.innerHTML = `Loading...`;
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageNumber);
    //page right
    let leaderboardFooterPageRight = document.createElement('img');
    leaderboardFooterPageRight.classList.add('leaderboard-footer-page-right','black-outline');
    leaderboardFooterPageRight.src = "./Assets/UI/NextArrowSmallYellow.png";
    leaderboardFooterPageLeft.addEventListener('click', () => {
        if (browserPage <= 1) { return; }
        browserPage--;
        leaderboardFooterPageNumber.innerHTML = `Page ${browserPage} of 4`;
        leaderboardEntries.innerHTML = "";
        copyLoadingIcon(leaderboardEntries)
        generateBrowserEntries(type)
    })
    leaderboardFooterPageRight.addEventListener('click', () => {
        if (browserPage >= 4) { return; }
        browserPage++;
        leaderboardFooterPageNumber.innerHTML = `Page ${browserPage} of 4`;
        leaderboardEntries.innerHTML = "";
        copyLoadingIcon(leaderboardEntries)
        generateBrowserEntries(type)
    })
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageRight);

    //right div
    let leaderboardFooterRight = document.createElement('div');
    leaderboardFooterRight.classList.add('leaderboard-footer-right', 'browser-footer-right');
    leaderboardFooter.appendChild(leaderboardFooterRight);

    //Goto label
    let leaderboardFooterGoto = document.createElement('p');
    leaderboardFooterGoto.classList.add('leaderboard-footer-goto','black-outline');
    leaderboardFooterGoto.innerHTML = "ID:";
    leaderboardFooterRight.appendChild(leaderboardFooterGoto);

    //enter a page number
    let leaderboardFooterPageInput = document.createElement('input');
    leaderboardFooterPageInput.classList.add('leaderboard-footer-page-input', 'browser-footer-input');
    leaderboardFooterPageInput.type = "text";
    leaderboardFooterPageInput.value = type == "Map Browser" ? "ZMYXDVU" : "ZMGVLCF";
    leaderboardFooterRight.appendChild(leaderboardFooterPageInput);

    let selectorGoImg = document.createElement('img');
    selectorGoImg.classList.add('leaderboard-go-img');
    selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
    selectorGoImg.addEventListener('click', async () => {
        showLoading();
        type == "Map Browser" ? showMapModel('browser', await getCustomMapMetadata(leaderboardFooterPageInput.value)) : showChallengeModel('browser', await getChallengeMetadata(leaderboardFooterPageInput.value), "Custom");
    })
    leaderboardFooterRight.appendChild(selectorGoImg);

    // copyLoadingIcon(leaderboardEntries)

    switch(type) {
        case "Challenge Browser":
            let mapsProgressGrid = document.createElement('div');
            mapsProgressGrid.id = 'maps-progress-grid';
            mapsProgressGrid.classList.add('maps-progress-view');
            mapsProgressGrid.classList.add('black-outline')
            mapsProgressGrid.classList.add('maps-progress-view-selected');
            mapsProgressGrid.innerHTML = "Grid";
            mapsProgressGrid.addEventListener('click', () => {
                currentBrowserView = "Grid";
                generateBrowserEntries(type)
            })
            mapsProgressViews.appendChild(mapsProgressGrid);
            

            let mapsProgressGame = document.createElement('div');
            mapsProgressGame.id = 'maps-progress-game';
            mapsProgressGame.classList.add('maps-progress-view');
            mapsProgressGame.classList.add('black-outline')
            mapsProgressGame.innerHTML = "List";
            mapsProgressGame.addEventListener('click', () => {
                currentBrowserView = "List";
                generateBrowserEntries(type)
            })
            mapsProgressViews.appendChild(mapsProgressGame);


            let options = ["Featured", "Newest"]
            options.forEach((option) => {
                let difficultyOption = document.createElement('option');
                difficultyOption.value = option;
                difficultyOption.innerHTML = option;
                mapProgressFilterDifficultySelect.appendChild(difficultyOption);
            })
            changeBrowserFilter(type, "Featured")
            break;
        case "Map Browser":
            let mapsProgressGameMap = document.createElement('div');
            mapsProgressGameMap.id = 'maps-progress-game';
            mapsProgressGameMap.classList.add('maps-progress-view', 'black-outline');
            mapsProgressGameMap.innerHTML = "Grid";
            mapsProgressGameMap.addEventListener('click', () => {
                currentBrowserView = "Grid";
                generateBrowserEntries(type);
            })
            mapsProgressViews.appendChild(mapsProgressGameMap);

            let mapsProgressGallery = document.createElement('div');
            mapsProgressGallery.id = 'maps-progress-gallery';
            mapsProgressGallery.classList.add('maps-progress-view', 'black-outline');
            mapsProgressGallery.innerHTML = "Gallery";
            mapsProgressGallery.addEventListener('click', () => {
                currentBrowserView = "Gallery";
                generateBrowserEntries(type)
            })
            mapsProgressViews.appendChild(mapsProgressGallery);

            let optionsMap = ["Most Liked", "Trending", "Newest"]
            optionsMap.forEach((option) => {
                let difficultyOption = document.createElement('option');
                difficultyOption.value = option;
                difficultyOption.innerHTML = option;
                mapProgressFilterDifficultySelect.appendChild(difficultyOption);
            })
            changeBrowserFilter(type, "Most Liked")
            break;
    }
    leaderboardEntries.classList.add('challenge-card-entries');
    copyLoadingIcon(leaderboardEntries)
}

function changeBrowserFilter(type, filter){
    switch(filter) {
        case "Newest":
            browserFilter = "newest";
            break;
        case "Featured":
            browserFilter = "trending";
            break;
        case "Trending":
            browserFilter = "trending";
            break;
        case "Most Liked":
            browserFilter = "mostLiked";
            break;
    }
    browserPage = 1;
    generateBrowserEntries(type);
}

async function generateBrowserEntries(type){
    await getBrowserData();
    console.log(browserData)

    let browserEntries = document.getElementById('browser-entries');
    browserEntries.innerHTML = "";

    if(browserData != null) {
        switch(type) {
            case "Challenge Browser":
                generateChallengeEntries(browserEntries);
                break;
            case "Map Browser":
                generateMapGameEntries(browserEntries);
                break;
        }
    } else {
        let noDataFound = document.createElement('p');
        noDataFound.classList.add('no-data-found');
        noDataFound.classList.add('black-outline');
        noDataFound.style.width = "250px";
        noDataFound.innerHTML = "No Data Found";
        browserEntries.appendChild(noDataFound);
    }
}

function generateChallengeEntries(destination) {
    browserData.forEach(async (entry, index) => {
        let challengeEntry = document.createElement('div');
        challengeEntry.addEventListener('click', async () => {
            showLoading();
            showChallengeModel('browser', await getChallengeMetadata(entry.id), "Custom");
        })
        destination.appendChild(challengeEntry);

        switch(currentBrowserView) {
            case "Grid":
                challengeEntry.classList.add('challenge-entry');
                
                let challengeTop = document.createElement('div');
                challengeTop.classList.add('challenge-top');
                challengeEntry.appendChild(challengeTop);
                
                let challengeName = document.createElement('p');
                challengeName.classList.add('challenge-name','black-outline');
                challengeName.innerHTML = entry.name;
                if (entry.name.length > 30) { challengeName.style.fontSize = '18px' } 
                challengeTop.appendChild(challengeName);

                let challengeMiddle = document.createElement('div');
                challengeMiddle.classList.add('challenge-middle');
                challengeEntry.appendChild(challengeMiddle);
                
                let challengeLeft = document.createElement('div');
                challengeLeft.classList.add('challenge-left');
                challengeMiddle.appendChild(challengeLeft);

                let challengeMapDiv = document.createElement('div');
                challengeMapDiv.classList.add("race-map-div", "silver-border");
                challengeLeft.appendChild(challengeMapDiv);

                let challengeMapImg = document.createElement('img');
                challengeMapImg.classList.add("race-map-img");
                challengeMapImg.src = "./Assets/MapIcon/MapLoadingImage.png"
                challengeMapDiv.appendChild(challengeMapImg);

                let challengeChallengeIcons = document.createElement('div');
                challengeChallengeIcons.classList.add("race-challenge-icons");
                challengeMapDiv.appendChild(challengeChallengeIcons);

                let challengeMapRounds = document.createElement('p');
                challengeMapRounds.classList.add("race-map-rounds", 'black-outline');
                challengeMapDiv.appendChild(challengeMapRounds);
                
                let challengeUSVDiv = document.createElement('div');
                challengeUSVDiv.classList.add('browser-usv-div');
                challengeMiddle.appendChild(challengeUSVDiv);

                let challengeUpvoteDiv = document.createElement('div');
                challengeUpvoteDiv.classList.add('challenge-upvote-div');
                challengeUSVDiv.appendChild(challengeUpvoteDiv);

                let challengeUpvoteIcon = document.createElement('img');
                challengeUpvoteIcon.classList.add('browser-upvote-icon');
                challengeUpvoteIcon.src = "./Assets/UI/ChallengeThumbsUpIcon.png";
                challengeUpvoteDiv.appendChild(challengeUpvoteIcon);

                let challengeUpvoteValue = document.createElement('p');
                challengeUpvoteValue.classList.add('browser-upvote-value');
                challengeUpvoteValue.innerHTML = 0;
                challengeUpvoteDiv.appendChild(challengeUpvoteValue);

                let challengeTrophyDiv = document.createElement('div');
                challengeTrophyDiv.classList.add('challenge-trophy-div');
                challengeUSVDiv.appendChild(challengeTrophyDiv);

                let challengeTrophyIcon = document.createElement('img');
                challengeTrophyIcon.classList.add('browser-trophy-icon');
                challengeTrophyIcon.src = "./Assets/UI/ChallengeTrophyIcon.png";
                challengeTrophyDiv.appendChild(challengeTrophyIcon);

                let challengeTrophyValue = document.createElement('p');
                challengeTrophyValue.classList.add('browser-trophy-value');
                challengeTrophyValue.innerHTML = 0;
                challengeTrophyDiv.appendChild(challengeTrophyValue);

                let challengeSkullDiv = document.createElement('div');
                challengeSkullDiv.classList.add('challenge-skull-div');
                challengeUSVDiv.appendChild(challengeSkullDiv);

                let challengeSkullIcon = document.createElement('img');
                challengeSkullIcon.classList.add('browser-skull-icon');
                challengeSkullIcon.src = "./Assets/UI/DeathRateIcon.png";
                challengeSkullDiv.appendChild(challengeSkullIcon);

                let challengeSkullValue = document.createElement('p');
                challengeSkullValue.classList.add('browser-skull-value');
                challengeSkullValue.innerHTML = 0;
                challengeSkullDiv.appendChild(challengeSkullValue);

                let challengeBottom = document.createElement('div');
                challengeBottom.classList.add('challenge-bottom');
                challengeEntry.appendChild(challengeBottom);


                let challengeCreator = document.createElement('div');
                challengeCreator.classList.add('challenge-creator');
                challengeBottom.appendChild(challengeCreator);
    
                let avatar = document.createElement('div');
                avatar.classList.add('avatar');
                challengeCreator.appendChild(avatar);
    
                let width = 50;
    
                let avatarFrame = document.createElement('img');
                avatarFrame.classList.add('avatar-frame','noSelect');
                avatarFrame.style.width = `${width}px`;
                avatarFrame.src = '../Assets/UI/InstaTowersContainer.png';
                avatar.appendChild(avatarFrame);
    
                let avatarImg = document.createElement('img');
                avatarImg.classList.add('avatar-img','noSelect');
                avatarImg.style.width = `${width}px`;
                avatarImg.src = getProfileIcon("ProfileAvatar01");
                avatar.appendChild(avatarImg);
    
                let challengeCreatorName = document.createElement('p');
                challengeCreatorName.classList.add('browser-creator-name', 'black-outline');
                challengeCreatorName.innerHTML = "Loading...";
                challengeCreator.appendChild(challengeCreatorName);

                let challengeIDandPlay = document.createElement('div');
                challengeIDandPlay.classList.add('challenge-id-and-play');
                challengeBottom.appendChild(challengeIDandPlay);

                let challengeID = document.createElement('p');
                challengeID.classList.add('browser-id', 'black-outline');
                challengeID.innerHTML = entry.id;
                challengeID.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    copyID(entry.id, challengeID)
                })
                challengeIDandPlay.appendChild(challengeID);

                let selectorCopyImg = document.createElement('img');
                selectorCopyImg.classList.add('browser-copy-img');
                selectorCopyImg.src = '../Assets/UI/CopyClipboardBtn.png';
                selectorCopyImg.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    copyID(entry.id, challengeID)
                });
                challengeIDandPlay.appendChild(selectorCopyImg);

                let selectorGoImg = document.createElement('img');
                selectorGoImg.classList.add('browser-go-img');
                selectorGoImg.src = '../Assets/UI/GoBtnSmall.png';
                selectorGoImg.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(`btd6://Challenge/${entry.id}`, '_blank');
                });
                challengeIDandPlay.appendChild(selectorGoImg);

                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(async observerentry => {
                        if (observerentry.isIntersecting) {
                            observer.unobserve(observerentry.target);
                            let challengeData = await getChallengeMetadata(entry.id);
                            if (challengeData == null) { return; }
                            console.log(challengeData)
                            challengeMapImg.src = challengeData.mapURL;
                            let modifiers = challengeModifiers(challengeData);
                            let rules = challengeRules(challengeData)
                            for (let modifier of Object.values(modifiers)) {
                                console.log(modifier)
                                let challengeModifierIcon = document.createElement('img');
                                challengeModifierIcon.classList.add('challenge-modifier-icon-event');
                                challengeModifierIcon.src = `./Assets/ChallengeRulesIcon/${modifier.icon}.png`;
                                challengeChallengeIcons.appendChild(challengeModifierIcon);
                            }
                            for (let rule of rules) {
                                if (rule == "No Round 100 Reward") { continue; }
                                if (rule == "Paragon Limit") { continue; }
                                let challengeRuleIcon = document.createElement('img');
                                challengeRuleIcon.classList.add('challenge-rule-icon-event');
                                challengeRuleIcon.src = `./Assets/ChallengeRulesIcon/${rulesMap[rule]}.png`;
                                challengeChallengeIcons.appendChild(challengeRuleIcon);
                            }
                            challengeMapRounds.innerHTML = `Rounds ${challengeData.startRound == 0 ? constants.startRound[challengeData.difficulty] : challengeData.startRound}/${challengeData.endRound == 0 ? constants.endRound[challengeData.difficulty] : challengeData.endRound}`
                            challengeUpvoteValue.innerHTML = challengeData.upvotes.toLocaleString();
                            challengeTrophyValue.innerHTML = challengeData.playsUnique == 0 ? "0%" : challengeData.winsUnique - challengeData.playsUnique == 0 ? "0%" : `${((challengeData.winsUnique / challengeData.playsUnique) * 100).toFixed(2)}%`;
                            challengeSkullValue.innerHTML = challengeData.playsUnique == 0 ? "0%" : `${((challengeData.wins / (challengeData.plays + challengeData.restarts)) * 100).toFixed(2)}%`;
                            let creatorData = await getUserProfile(challengeData.creator);
                            if ( creatorData == null ) { return; }
                            challengeCreatorName.innerHTML = creatorData.displayName;
                            if (creatorData.displayName.length > 13) { challengeCreatorName.style.fontSize = '17px' }
                            avatarImg.src = getProfileIcon(creatorData.avatar);
                            challengeBottom.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(creatorData.banner)})`;
                        }
                    });
                });
                observer.observe(challengeEntry);
                break;
            case "List":
                challengeEntry.classList.add('browser-list-entry');

                let challengeMapImg2 = document.createElement('img');
                challengeMapImg2.classList.add("browser-list-map-img");
                challengeMapImg2.src = "./Assets/MapIcon/MapLoadingImage.png"
                challengeEntry.appendChild(challengeMapImg2);

                let browserTopBottom = document.createElement('div');
                browserTopBottom.classList.add('browser-top-bottom');
                challengeEntry.appendChild(browserTopBottom);

                let browserListEntryTop = document.createElement('div');
                browserListEntryTop.classList.add('browser-list-entry-top');
                browserTopBottom.appendChild(browserListEntryTop);

                let browserListEntryBottom = document.createElement('div');
                browserListEntryBottom.classList.add('browser-list-entry-bottom');
                browserTopBottom.appendChild(browserListEntryBottom);

                let challengeNameList = document.createElement('p');
                challengeNameList.classList.add('challenge-name', 'browser-list-name', 'black-outline');
                challengeNameList.innerHTML = entry.name;
                if (entry.name.length > 30) { challengeNameList.style.fontSize = '18px' } 
                browserListEntryTop.appendChild(challengeNameList);

                let challengeCreator2 = document.createElement('div');
                challengeCreator2.classList.add('challenge-creator','browser-challenge-creator');
                browserListEntryTop.appendChild(challengeCreator2);
    
                let avatar2 = document.createElement('div');
                avatar2.classList.add('avatar');
                challengeCreator2.appendChild(avatar2);
    
                let width2 = 45;
    
                let avatarFrame2 = document.createElement('img');
                avatarFrame2.classList.add('avatar-frame','noSelect');
                avatarFrame2.style.width = `${width2}px`;
                avatarFrame2.src = '../Assets/UI/InstaTowersContainer.png';
                avatar2.appendChild(avatarFrame2);
    
                let avatarImg2 = document.createElement('img');
                avatarImg2.classList.add('avatar-img','noSelect');
                avatarImg2.style.width = `${width2}px`;
                avatarImg2.src = getProfileIcon("ProfileAvatar01");
                avatar2.appendChild(avatarImg2);
    
                let challengeCreatorName2 = document.createElement('p');
                challengeCreatorName2.classList.add('browser-creator-name', 'black-outline');
                challengeCreatorName2.innerHTML = "Loading...";
                challengeCreator2.appendChild(challengeCreatorName2);

                let challengeUSVDiv2 = document.createElement('div');
                challengeUSVDiv2.classList.add('browser-usv-list-div');
                browserListEntryBottom.appendChild(challengeUSVDiv2);

                let challengeUpvoteDiv2 = document.createElement('div');
                challengeUpvoteDiv2.classList.add('challenge-upvote-div');
                challengeUSVDiv2.appendChild(challengeUpvoteDiv2);

                let challengeUpvoteIcon2 = document.createElement('img');
                challengeUpvoteIcon2.classList.add('browser-upvote-icon');
                challengeUpvoteIcon2.src = "./Assets/UI/ChallengeThumbsUpIcon.png";
                challengeUpvoteDiv2.appendChild(challengeUpvoteIcon2);

                let challengeUpvoteValue2 = document.createElement('p');
                challengeUpvoteValue2.classList.add('browser-upvote-value');
                challengeUpvoteValue2.innerHTML = 0;
                // challengeUpvoteValue.innerHTML = challengeExtraData["Upvotes"];
                challengeUpvoteDiv2.appendChild(challengeUpvoteValue2);

                let challengeTrophyDiv2 = document.createElement('div');
                challengeTrophyDiv2.classList.add('challenge-trophy-div');
                challengeUSVDiv2.appendChild(challengeTrophyDiv2);

                let challengeTrophyIcon2 = document.createElement('img');
                challengeTrophyIcon2.classList.add('browser-trophy-icon');
                challengeTrophyIcon2.src = "./Assets/UI/ChallengeTrophyIcon.png";
                challengeTrophyDiv2.appendChild(challengeTrophyIcon2);

                let challengeTrophyValue2 = document.createElement('p');
                challengeTrophyValue2.classList.add('browser-trophy-value');
                // challengeTrophyValue.innerHTML = challengeExtraData["Player Completion Rate"];
                challengeTrophyValue2.innerHTML = 0;
                challengeTrophyDiv2.appendChild(challengeTrophyValue2);

                let challengeSkullDiv2 = document.createElement('div');
                challengeSkullDiv2.classList.add('challenge-skull-div');
                challengeUSVDiv2.appendChild(challengeSkullDiv2);

                let challengeSkullIcon2 = document.createElement('img');
                challengeSkullIcon2.classList.add('browser-skull-icon');
                challengeSkullIcon2.src = "./Assets/UI/DeathRateIcon.png";
                challengeSkullDiv2.appendChild(challengeSkullIcon2);

                let challengeSkullValue2 = document.createElement('p');
                challengeSkullValue2.classList.add('browser-skull-value');
                // challengeSkullValue.innerHTML = challengeExtraData["Player Win Rate"];
                challengeSkullValue2.innerHTML = 0;
                challengeSkullDiv2.appendChild(challengeSkullValue2);

                let challengeIDandPlay2 = document.createElement('div');
                challengeIDandPlay2.classList.add('challenge-id-and-play');
                browserListEntryBottom.appendChild(challengeIDandPlay2);

                let challengeID2 = document.createElement('p');
                challengeID2.classList.add('browser-id', 'black-outline');
                challengeID2.innerHTML = entry.id;
                challengeID2.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    copyID(entry.id, challengeID2)
                });
                challengeIDandPlay2.appendChild(challengeID2);

                let selectorCopyImg2 = document.createElement('img');
                selectorCopyImg2.classList.add('browser-copy-img');
                selectorCopyImg2.src = '../Assets/UI/CopyClipboardBtn.png';
                selectorCopyImg2.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    copyID(entry.id, challengeID2)
                });
                challengeIDandPlay2.appendChild(selectorCopyImg2);

                let selectorGoImg2 = document.createElement('img');
                selectorGoImg2.classList.add('browser-go-img');
                selectorGoImg2.src = '../Assets/UI/GoBtnSmall.png';
                selectorGoImg2.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(`btd6://Challenge/${entry.id}`, '_blank');
                });
                challengeIDandPlay2.appendChild(selectorGoImg2);

                let observer2 = new IntersectionObserver((entries, observer) => {
                    entries.forEach(async observerentry => {
                        if (observerentry.isIntersecting) {
                            observer.unobserve(observerentry.target);
                            let challengeData = await getChallengeMetadata(entry.id);
                            if (challengeData == null) { return; }
                            console.log(challengeData)
                            challengeMapImg2.src = challengeData.mapURL;
                            challengeUpvoteValue2.innerHTML = challengeData.upvotes.toLocaleString();
                            challengeTrophyValue2.innerHTML = challengeData.playsUnique == 0 ? "0%" : challengeData.winsUnique - challengeData.playsUnique == 0 ? "0%" : `${((challengeData.winsUnique / challengeData.playsUnique) * 100).toFixed(2)}%`;
                            challengeSkullValue2.innerHTML = challengeData.playsUnique == 0 ? "0%" : `${((challengeData.wins / (challengeData.plays + challengeData.restarts)) * 100).toFixed(2)}%`;
                            let creatorData = await getUserProfile(challengeData.creator);
                            if ( creatorData == null ) { return; }
                            challengeCreatorName2.innerHTML = creatorData.displayName;
                            if (creatorData.displayName.length > 13) { challengeCreatorName2.style.fontSize = '17px' }
                            avatarImg2.src = getProfileIcon(creatorData.avatar);
                            challengeCreator2.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(${getProfileBanner(creatorData.banner)})`;
                        }
                    });
                });
                observer2.observe(challengeEntry);
                break;
        }
    })
}

function copyID(ID, copiedTextDest) {
    navigator.clipboard.writeText(ID).then(function() {
        console.log('Copying to clipboard was successful!');
        copiedTextDest.innerHTML = "Copied!";
        setTimeout(() => {
            copiedTextDest.innerHTML = ID;
        }, 2000);
    }, function(err) {
        console.log('Could not copy text: ', err);
    });
}

function generateMapGameEntries(destination) {
    browserData.forEach((entry, index) => {
        let mapEntry = document.createElement('div');
        // mapEntry.classList.add('map-entry');
        mapEntry.addEventListener('click', async () => {
            showLoading();
            showMapModel('browser', await getCustomMapMetadata(entry.id));
        })
        destination.appendChild(mapEntry);
        console.log(currentBrowserView)
        switch(currentBrowserView) {
            case "Grid":
                mapEntry.classList.add('challenge-entry', "map-browser-bg");
                
                let challengeTop = document.createElement('div');
                challengeTop.classList.add('challenge-top');
                mapEntry.appendChild(challengeTop);
                
                let challengeName = document.createElement('p');
                challengeName.classList.add('challenge-name','black-outline');
                challengeName.innerHTML = entry.name;
                if (entry.name.length > 30) { challengeName.style.fontSize = '18px' } 
                if (entry.name.length > 35) { challengeName.style.fontSize = '17px' } 
                challengeTop.appendChild(challengeName);

                let challengeMiddle = document.createElement('div');
                challengeMiddle.classList.add('challenge-middle');
                mapEntry.appendChild(challengeMiddle);
                
                let challengeLeft = document.createElement('div');
                challengeLeft.classList.add('challenge-left');
                challengeMiddle.appendChild(challengeLeft);

                let challengeMapDiv = document.createElement('div');
                challengeMapDiv.classList.add("race-map-div", "silver-border");
                challengeLeft.appendChild(challengeMapDiv);

                let challengeMapImg = document.createElement('img');
                challengeMapImg.classList.add("race-map-img");
                challengeMapImg.src = getCustomMapIcon(entry.id);
                challengeMapImg.onerror = function() {
                    this.onerror = null;
                    this.src = "./Assets/MapIcon/MapLoadingImage.png";
                };
                challengeMapDiv.appendChild(challengeMapImg);
                
                let challengeUSVDiv = document.createElement('div');
                challengeUSVDiv.classList.add('browser-usv-div');
                challengeMiddle.appendChild(challengeUSVDiv);

                let challengeUpvoteDiv = document.createElement('div');
                challengeUpvoteDiv.classList.add('challenge-upvote-div');
                challengeUSVDiv.appendChild(challengeUpvoteDiv);

                let challengeUpvoteIcon = document.createElement('img');
                challengeUpvoteIcon.classList.add('browser-upvote-icon');
                challengeUpvoteIcon.src = "./Assets/UI/ChallengeThumbsUpIcon.png";
                challengeUpvoteDiv.appendChild(challengeUpvoteIcon);

                let challengeUpvoteValue = document.createElement('p');
                challengeUpvoteValue.classList.add('browser-upvote-value');
                challengeUpvoteValue.innerHTML = 0;
                challengeUpvoteDiv.appendChild(challengeUpvoteValue);

                let challengeTrophyDiv = document.createElement('div');
                challengeTrophyDiv.classList.add('challenge-trophy-div');
                challengeUSVDiv.appendChild(challengeTrophyDiv);

                let challengeTrophyIcon = document.createElement('img');
                challengeTrophyIcon.classList.add('browser-trophy-icon');
                challengeTrophyIcon.src = "./Assets/UI/ChallengeTrophyIcon.png";
                challengeTrophyDiv.appendChild(challengeTrophyIcon);

                let challengeTrophyValue = document.createElement('p');
                challengeTrophyValue.classList.add('browser-trophy-value');
                challengeTrophyValue.innerHTML = 0;
                challengeTrophyDiv.appendChild(challengeTrophyValue);

                let challengeSkullDiv = document.createElement('div');
                challengeSkullDiv.classList.add('challenge-skull-div');
                challengeUSVDiv.appendChild(challengeSkullDiv);

                let challengeSkullIcon = document.createElement('img');
                challengeSkullIcon.classList.add('browser-skull-icon');
                challengeSkullIcon.src = "./Assets/UI/DeathRateIcon.png";
                challengeSkullDiv.appendChild(challengeSkullIcon);

                let challengeSkullValue = document.createElement('p');
                challengeSkullValue.classList.add('browser-skull-value');
                challengeSkullValue.innerHTML = 0;
                challengeSkullDiv.appendChild(challengeSkullValue);

                let challengeBottom = document.createElement('div');
                challengeBottom.classList.add('challenge-bottom');
                mapEntry.appendChild(challengeBottom);


                let challengeCreator = document.createElement('div');
                challengeCreator.classList.add('challenge-creator');
                challengeBottom.appendChild(challengeCreator);
    
                let avatar = document.createElement('div');
                avatar.classList.add('avatar');
                challengeCreator.appendChild(avatar);
    
                let width = 50;
    
                let avatarFrame = document.createElement('img');
                avatarFrame.classList.add('avatar-frame','noSelect');
                avatarFrame.style.width = `${width}px`;
                avatarFrame.src = '../Assets/UI/InstaTowersContainer.png';
                avatar.appendChild(avatarFrame);
    
                let avatarImg = document.createElement('img');
                avatarImg.classList.add('avatar-img','noSelect');
                avatarImg.style.width = `${width}px`;
                avatarImg.src = getProfileIcon("ProfileAvatar01");
                avatar.appendChild(avatarImg);
    
                let challengeCreatorName = document.createElement('p');
                challengeCreatorName.classList.add('browser-creator-name', 'black-outline');
                challengeCreatorName.innerHTML = "Loading...";
                challengeCreator.appendChild(challengeCreatorName);

                let challengeIDandPlay = document.createElement('div');
                challengeIDandPlay.classList.add('challenge-id-and-play');
                challengeBottom.appendChild(challengeIDandPlay);

                let challengeID = document.createElement('p');
                challengeID.classList.add('browser-id', 'black-outline');
                challengeID.innerHTML = entry.id;
                challengeID.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    copyID(entry.id, challengeID)
                })
                challengeIDandPlay.appendChild(challengeID);

                let selectorCopyImg = document.createElement('img');
                selectorCopyImg.classList.add('browser-copy-img');
                selectorCopyImg.src = '../Assets/UI/CopyClipboardBtn.png';
                selectorCopyImg.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    copyID(entry.id, challengeID)
                });
                challengeIDandPlay.appendChild(selectorCopyImg);

                let selectorGoImg = document.createElement('img');
                selectorGoImg.classList.add('browser-go-img');
                selectorGoImg.src = '../Assets/UI/GoBtnSmall.png';
                selectorGoImg.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(`btd6://Challenge/${entry.id}`, '_blank');
                });
                challengeIDandPlay.appendChild(selectorGoImg);

                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(async observerentry => {
                        if (observerentry.isIntersecting) {
                            observer.unobserve(observerentry.target);
                            let customMapData = await getCustomMapMetadata(entry.id);
                            if (customMapData == null) { return; }
                            console.log(customMapData)
                            challengeUpvoteValue.innerHTML = customMapData.upvotes.toLocaleString();
                            challengeTrophyValue.innerHTML = customMapData.playsUnique == 0 ? "0%" : customMapData.winsUnique - customMapData.playsUnique == 0 ? "0%" : `${((customMapData.winsUnique / customMapData.playsUnique) * 100).toFixed(2)}%`;
                            challengeSkullValue.innerHTML = customMapData.playsUnique == 0 ? "0%" : `${((customMapData.wins / (customMapData.plays + customMapData.restarts)) * 100).toFixed(2)}%`;
                            let creatorData = await getUserProfile(customMapData.creator);
                            if ( creatorData == null ) { return; }
                            challengeCreatorName.innerHTML = creatorData.displayName;
                            if (creatorData.displayName.length > 13) { challengeCreatorName.style.fontSize = '17px' }
                            avatarImg.src = getProfileIcon(creatorData.avatar);
                            challengeBottom.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(creatorData.banner)})`;
                        }
                    });
                });
                observer.observe(mapEntry);
                break;
            case "Gallery":
                let galleryMapDiv = document.createElement('div');
                galleryMapDiv.classList.add("race-map-div", "silver-border");
                mapEntry.appendChild(galleryMapDiv);

                let galleryID = document.createElement('p');
                galleryID.classList.add('browser-id', 'gallery-id', 'black-outline');
                galleryID.innerHTML = entry.id;
                galleryID.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    copyID(entry.id, galleryID)
                })
                galleryMapDiv.appendChild(galleryID);

                let galleryMapImg = document.createElement('img');
                galleryMapImg.classList.add("race-map-img");
                galleryMapImg.src = getCustomMapIcon(entry.id);
                galleryMapImg.onerror = function() {
                    this.onerror = null;
                    this.src = "./Assets/MapIcon/MapLoadingImage.png";
                };
                galleryMapDiv.appendChild(galleryMapImg);
                break;
        }


        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(async observerentry => {
                if (observerentry.isIntersecting) {
                    // let mapData = await getMapData(entry.id);
                    // console.log(mapData)
                    observer.unobserve(observerentry.target);
                }
            });
        });
        observer.observe(mapEntry);
    })
}

async function showMapModel(source, metadata) {
    if (metadata == null) { return; }
    resetScroll();
    let mapContent = document.getElementById('map-content');
    mapContent.style.display = "flex";
    mapContent.innerHTML = "";
    document.getElementById(`${source}-content`).style.display = "none";

    let challengeExtraData = processChallenge(metadata);

    let challengeModel = document.createElement('div');
    challengeModel.classList.add('challenge-model');
    mapContent.appendChild(challengeModel);

    let challengeModelHeader = document.createElement('div');
    challengeModelHeader.classList.add('challenge-model-header');
    challengeModel.appendChild(challengeModelHeader);

    let challengeModelHeaderIcons = document.createElement('div');
    challengeModelHeaderIcons.classList.add('challenge-model-header-icons');
    challengeModelHeader.appendChild(challengeModelHeaderIcons);

    let challengeModelHeaderIcon = document.createElement('img');
    challengeModelHeaderIcon.classList.add('challenge-model-header-difficulty');
    challengeModelHeaderIcon.src = "./Assets/UI/EditMapIcon.png";
    challengeModelHeaderIcons.appendChild(challengeModelHeaderIcon);

    let challengeModelHeaderTexts = document.createElement('div');
    challengeModelHeaderTexts.classList.add('challenge-model-header-texts');
    challengeModelHeader.appendChild(challengeModelHeaderTexts);

    let challengeModelHeaderName = document.createElement('p');
    challengeModelHeaderName.classList.add('challenge-model-header-name','black-outline');
    challengeModelHeaderName.innerHTML = metadata.name;
    challengeModelHeaderTexts.appendChild(challengeModelHeaderName);

    let challengeHeaderRightContainer = document.createElement('div');
    challengeHeaderRightContainer.classList.add('challenge-header-right-container');
    challengeModelHeader.appendChild(challengeHeaderRightContainer);

    let challengeHeaderRightTop = document.createElement('div');
    challengeHeaderRightTop.classList.add('challenge-header-right-top');
    challengeHeaderRightContainer.appendChild(challengeHeaderRightTop);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        exitMapModel(source);
    })
    challengeHeaderRightTop.appendChild(modalClose);

    let challengeHeaderRightBottom = document.createElement('div');
    challengeHeaderRightBottom.classList.add('challenge-header-right-bottom');
    challengeHeaderRightContainer.appendChild(challengeHeaderRightBottom);

    let challengeID = document.createElement('p');
    challengeID.classList.add('challenge-id', 'black-outline');
    challengeID.innerHTML = metadata.id;
    challengeID.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        copyID(metadata.id, challengeID)
    })
    challengeHeaderRightBottom.appendChild(challengeID);

    let selectorCopyImg = document.createElement('img');
    selectorCopyImg.classList.add('browser-copy-img');
    selectorCopyImg.src = '../Assets/UI/CopyClipboardBtn.png';
    selectorCopyImg.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        copyID(metadata.id, challengeID)
    });
    challengeHeaderRightBottom.appendChild(selectorCopyImg);

    let selectorGoImg = document.createElement('img');
    selectorGoImg.classList.add('browser-go-img');
    selectorGoImg.src = '../Assets/UI/GoBtnSmall.png';
    selectorGoImg.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(`btd6://Challenge/${metadata.id}`, '_blank');
    });
    challengeHeaderRightBottom.appendChild(selectorGoImg);

    let challengeModelTop = document.createElement('div');
    challengeModelTop.classList.add('map-model-top', 'map-model-bg');
    challengeModel.appendChild(challengeModelTop);

    let challengeModelMapIcon = document.createElement('img');
    challengeModelMapIcon.classList.add('map-model-img', 'boss-border');
    challengeModelMapIcon.src = Object.keys(constants.mapsInOrder).includes(metadata.map) ? getMapIcon(metadata.map) : metadata.mapURL;
    challengeModelTop.appendChild(challengeModelMapIcon);

    if(challengeExtraData.statsValid) {
        let challengeStatsDiv = document.createElement('div');
        challengeStatsDiv.classList.add('map-model-stats-div');
        challengeModelTop.appendChild(challengeStatsDiv);

        let challengeStatsHeader = document.createElement('p');
        challengeStatsHeader.classList.add('challenge-stats-header', 'black-outline');
        challengeStatsHeader.innerHTML = "Challenge Stats";
        challengeStatsDiv.appendChild(challengeStatsHeader);

        let challengeStatsLeftRight = document.createElement('div');
        challengeStatsLeftRight.classList.add('challenge-stats-left-right');
        challengeStatsDiv.appendChild(challengeStatsLeftRight);

        let challengeStatsLeft = document.createElement('div');
        challengeStatsLeft.classList.add('challenge-stats-left');
        challengeStatsLeftRight.appendChild(challengeStatsLeft);

        //ID

        //Upvote Trophy Skull
        let challengeUSVDiv = document.createElement('div');
        challengeUSVDiv.classList.add('challenge-usv-div');
        challengeStatsLeft.appendChild(challengeUSVDiv);

        if (challengeExtraData["Upvotes"] != 0) {
            let challengeUpvoteDiv = document.createElement('div');
            challengeUpvoteDiv.classList.add('challenge-upvote-div');
            challengeUSVDiv.appendChild(challengeUpvoteDiv);

            let challengeUpvoteIcon = document.createElement('img');
            challengeUpvoteIcon.classList.add('challenge-upvote-icon');
            challengeUpvoteIcon.src = "./Assets/UI/ChallengeThumbsUpIcon.png";
            challengeUpvoteDiv.appendChild(challengeUpvoteIcon);

            let challengeUpvoteValue = document.createElement('p');
            challengeUpvoteValue.classList.add('challenge-upvote-value');
            challengeUpvoteValue.innerHTML = challengeExtraData["Upvotes"];
            challengeUpvoteDiv.appendChild(challengeUpvoteValue);
        }

        let challengeTrophyDiv = document.createElement('div');
        challengeTrophyDiv.classList.add('challenge-trophy-div');
        challengeUSVDiv.appendChild(challengeTrophyDiv);

        let challengeTrophyIcon = document.createElement('img');
        challengeTrophyIcon.classList.add('challenge-trophy-icon');
        challengeTrophyIcon.src = "./Assets/UI/ChallengeTrophyIcon.png";
        challengeTrophyDiv.appendChild(challengeTrophyIcon);

        let challengeTrophyValue = document.createElement('p');
        challengeTrophyValue.classList.add('challenge-trophy-value');
        challengeTrophyValue.innerHTML = challengeExtraData["Player Completion Rate"];
        challengeTrophyDiv.appendChild(challengeTrophyValue);

        let challengeSkullDiv = document.createElement('div');
        challengeSkullDiv.classList.add('challenge-skull-div');
        challengeUSVDiv.appendChild(challengeSkullDiv);

        let challengeSkullIcon = document.createElement('img');
        challengeSkullIcon.classList.add('challenge-skull-icon');
        challengeSkullIcon.src = "./Assets/UI/DeathRateIcon.png";
        challengeSkullDiv.appendChild(challengeSkullIcon);

        let challengeSkullValue = document.createElement('p');
        challengeSkullValue.classList.add('challenge-skull-value');
        challengeSkullValue.innerHTML = challengeExtraData["Player Win Rate"];
        challengeSkullDiv.appendChild(challengeSkullValue);
        //Creator
        if(challengeExtraData["Creator"] != "n/a" && challengeExtraData["Creator"] != null) {
            let challengeCreator = document.createElement('div');
            challengeCreator.classList.add('challenge-creator');
            challengeStatsLeft.appendChild(challengeCreator);

            let avatar = document.createElement('div');
            avatar.classList.add('avatar');
            challengeCreator.appendChild(avatar);

            let width = 50;

            let avatarFrame = document.createElement('img');
            avatarFrame.classList.add('avatar-frame','noSelect');
            avatarFrame.style.width = `${width}px`;
            avatarFrame.src = '../Assets/UI/InstaTowersContainer.png';
            avatar.appendChild(avatarFrame);

            let avatarImg = document.createElement('img');
            avatarImg.classList.add('avatar-img','noSelect');
            avatarImg.style.width = `${width}px`;
            avatarImg.src = getProfileIcon("ProfileAvatar01");
            avatar.appendChild(avatarImg);

            let challengeCreatorName = document.createElement('p');
            challengeCreatorName.classList.add('challenge-creator-name', 'black-outline');
            challengeCreatorName.innerHTML = "Loading...";
            challengeCreator.appendChild(challengeCreatorName);
            //async function to change avatar to actual src
            await getUserProfile(challengeExtraData["Creator"]).then(data => {
                challengeCreatorName.innerHTML = data.displayName;
                avatarImg.src = getProfileIcon(data.avatar);
                challengeCreator.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(data.banner)})`;
            });
        }

        let leftStats = ["Date Created", "Game Version"]
        leftStats.forEach(stat => {
            if(stat == "Game Version" && challengeExtraData[stat] == 0){ return; }
            let challengeStat = document.createElement('div');
            challengeStat.classList.add('challenge-stat');
            challengeStatsLeft.appendChild(challengeStat);

            let challengeStatLabel = document.createElement('p');
            challengeStatLabel.classList.add('challenge-stat-label');
            challengeStatLabel.innerHTML = `${stat}: ${challengeExtraData[stat]}`;
            challengeStat.appendChild(challengeStatLabel);
        })

        let challengeStatsRight = document.createElement('div');
        challengeStatsRight.classList.add('challenge-stats-right');
        challengeStatsLeftRight.appendChild(challengeStatsRight);

        Object.entries(challengeExtraData["Stats"]).forEach(([stat, value]) => {
            let challengeStat = document.createElement('div');
            challengeStat.classList.add('challenge-stat');
            challengeStatsRight.appendChild(challengeStat);

            let challengeStatLabel = document.createElement('p');
            challengeStatLabel.classList.add('challenge-stat-label');
            challengeStatLabel.innerHTML = stat;
            challengeStat.appendChild(challengeStatLabel);

            let challengeStatValue = document.createElement('p');
            challengeStatValue.classList.add('challenge-model-stat-value');
            challengeStatValue.innerHTML = value.toLocaleString();
            challengeStat.appendChild(challengeStatValue);
        })
    }
}

function generateExtrasPage() {
    let extrasContent = document.getElementById('extras-content');
    extrasContent.innerHTML = "";

    // let noDataFound = document.createElement('p');
    // noDataFound.id = 'no-data-found';
    // noDataFound.classList.add('no-data-found');
    // noDataFound.classList.add('black-outline');
    // noDataFound.innerHTML = "Coming Soon";
    // extrasContent.appendChild(noDataFound);

    let explorePage = document.createElement('div');
    explorePage.classList.add('progress-page');
    extrasContent.appendChild(explorePage);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.classList.add('selectors-div');
    explorePage.appendChild(selectorsDiv);

    let selectors = ['Custom Round Sets', 'Monkey Money Helper', 'Export Data', 'Send Feedback', 'Settings'];

    selectors.forEach((selector) => {
        let selectorDiv = document.createElement('div');
        selectorDiv.id = selector.toLowerCase() + '-div';
        selectorDiv.classList.add('selector-div', 'blueprint-bg');
        selectorDiv.addEventListener('click', () => {
            extrasContent.style.display = "none";
            document.getElementById('extras-content').style.display = "flex"
            changeExtrasTab(selector);
        })
        selectorsDiv.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
        selectorImg.id = selector.toLowerCase() + '-img';
        selectorImg.classList.add('selector-img');
        selectorDiv.appendChild(selectorImg);

        switch(selector){
            case 'Custom Round Sets':
                selectorImg.src = '../Assets/ChallengeRulesIcon/CustomRoundIcon.png';
                break;
            case 'Monkey Money Helper':
                selectorImg.src = '../Assets/UI/WoodenRoundButton.png';
                break;
            default: 
                selectorImg.src = '../Assets/UI/WoodenRoundButton.png';
                break;
        }

        let selectorText = document.createElement('p');
        selectorText.id = selector.toLowerCase() + '-text';
        selectorText.classList.add('selector-text','black-outline');
        selectorText.innerHTML = selector;
        selectorDiv.appendChild(selectorText);

        let selectorGoImg = document.createElement('img');
        selectorGoImg.id = selector.toLowerCase() + '-go-img';
        selectorGoImg.classList.add('selector-go-img');
        selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
        selectorDiv.appendChild(selectorGoImg);
    })
}

function changeExtrasTab(selected){
    resetScroll();
    switch(selected){
        case 'Custom Round Sets':
            generateRoundsets();
            break;
    }
}

function generateRoundsets() {
    let roundsetsContent = document.getElementById('extras-content');
    roundsetsContent.innerHTML = "";

    let roundsetPage = document.createElement('div');
    roundsetPage.classList.add('progress-page');
    roundsetsContent.appendChild(roundsetPage);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.classList.add('selectors-div');
    roundsetPage.appendChild(selectorsDiv);;
    
    let normalRoundsets = Object.fromEntries(Object.entries(constants.roundSets).filter(([key, value]) => value.type != "quest"));
    let otherRoundsets = Object.fromEntries(Object.entries(constants.roundSets).filter(([key, value]) => value.type === "quest"));

    Object.entries(normalRoundsets).forEach(([roundset, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        data.type == "boss" ? roundsetDiv.classList.add('veteran-container') : roundsetDiv.classList.add('wood-container');
        roundsetDiv.addEventListener('click', () => {
            showLoading();
            showRoundsetModel('extras', roundset);
        })
        selectorsDiv.appendChild(roundsetDiv);

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetIcon.src = `../Assets/UI/${data.icon}.png`;
        roundsetDiv.appendChild(roundsetIcon);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = data.name;
        roundsetDiv.appendChild(roundsetText);

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/ContinueBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })

    let otherRoundsetText = document.createElement('p');
    otherRoundsetText.classList.add('other-roundsets-selector-text', 'black-outline');
    otherRoundsetText.innerHTML = "Quest Custom Rounds";
    selectorsDiv.appendChild(otherRoundsetText);

    let otherRoundsetDiv = document.createElement('div');
    otherRoundsetDiv.classList.add('other-roundsets-selector-div');
    selectorsDiv.appendChild(otherRoundsetDiv);


    Object.entries(otherRoundsets).forEach(([roundset, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('other-roundset-selector-div');
        roundsetDiv.addEventListener('click', () => {
            showRoundsetModel('extras', roundset);
        })
        otherRoundsetDiv.appendChild(roundsetDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('other-roundset-selector-text', 'black-outline');
        // roundsetText.innerHTML = roundset;
        let stage = roundset.match(/(Part|Stage)(\d+)/i);
        if (stage != null) {
            roundsetText.innerHTML = `${stage[1]} ${stage[2]}`;
            roundsetDiv.appendChild(roundsetText);
        }

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('other-roundset-selector-img');
        roundsetIcon.src = `../Assets/QuestIcon/${data.icon}.png`;
        roundsetDiv.appendChild(roundsetIcon);
    })
}

async function showRoundsetModel(source, roundset) {
    let roundsetContent = document.getElementById('roundset-content');
    roundsetContent.style.display = "flex";
    roundsetContent.innerHTML = "";
    document.getElementById(`${source}-content`).style.display = "none";
    resetScroll();

    let roundsetData = await fetch(`./data/${roundset}.json`).then(response => response.json());
    let bossRoundset = ["BloonariusRoundSet", "LychRoundSet", "VortexRoundSet", "DreadbloonRoundSet", "PhayzeRoundSet"].includes(roundset);
    // Might be used later for other roundsets that use the addToRound feature, but for now obsolete.
    // if (bossRoundset) {
    //     let defaultRoundsetData = await fetch(`./data/DefaultRoundSet.json`).then(response => response.json());
    //     roundsetProcessed =  processRoundset(defaultRoundsetData, roundsetData);
    // } else {
    //     roundsetProcessed =  processRoundset(roundsetData);
    // }
    roundsetProcessed =  processRoundset(roundsetData);
    console.log(roundsetProcessed)

    let headerBar = document.createElement('div');
    headerBar.classList.add('roundset-header-bar');
    roundsetContent.appendChild(headerBar);

    let roundsetHeaderTitle = document.createElement('div');
    roundsetHeaderTitle.classList.add('roundset-header-title');
    headerBar.appendChild(roundsetHeaderTitle);

    let leftDiv = document.createElement('div');
    leftDiv.classList.add('roundset-header-left');
    roundsetHeaderTitle.appendChild(leftDiv);

    let roundsetHeaderText = document.createElement('p');
    roundsetHeaderText.classList.add('roundset-header-text', 'black-outline');
    roundsetHeaderText.innerHTML = constants.roundSets[roundset].name;
    roundsetHeaderTitle.appendChild(roundsetHeaderText);

    let rightDiv = document.createElement('div');
    rightDiv.classList.add('roundset-header-right');
    roundsetHeaderTitle.appendChild(rightDiv);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        roundsetContent.style.display = "none";
        document.getElementById(`${source}-content`).style.display = "flex";
    })
    rightDiv.appendChild(modalClose);

    let mapsProgressHeaderBar = document.createElement('div');
    mapsProgressHeaderBar.classList.add('roundset-header-bar-bottom');
    headerBar.appendChild(mapsProgressHeaderBar);

    let mapsProgressViews = document.createElement('div');
    mapsProgressViews.classList.add('maps-progress-views');
    mapsProgressHeaderBar.appendChild(mapsProgressViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressViewsText.innerHTML = "Display Type:";
    mapsProgressViews.appendChild(mapsProgressViewsText);

    let mapsProgressGrid = document.createElement('div');
    mapsProgressGrid.classList.add('maps-progress-view', 'stats-tab-yellow', 'black-outline');
    mapsProgressGrid.innerHTML = "Simple";
    mapsProgressViews.appendChild(mapsProgressGrid);

    let mapsProgressList = document.createElement('div');
    mapsProgressList.classList.add('maps-progress-view','black-outline');
    mapsProgressList.innerHTML = "Detailed";
    mapsProgressViews.appendChild(mapsProgressList);

    let mapsProgressGame = document.createElement('div');
    mapsProgressGame.classList.add('maps-progress-view','maps-progress-view-list','black-outline');
    mapsProgressGame.innerHTML = "Preview";
    mapsProgressViews.appendChild(mapsProgressGame);

    let mapsProgressFilter = document.createElement('div');
    mapsProgressFilter.classList.add('maps-progress-filter');
    mapsProgressHeaderBar.appendChild(mapsProgressFilter);

    let mapProgressFilterDifficulty = document.createElement('div');
    mapProgressFilterDifficulty.classList.add('map-progress-filter-difficulty');

    let mapsProgressFilterDifficultyText = document.createElement('p');
    mapsProgressFilterDifficultyText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressFilterDifficultyText.classList.add('black-outline');
    mapsProgressFilterDifficultyText.innerHTML = "Only Modified:";
    mapProgressFilterDifficulty.appendChild(mapsProgressFilterDifficultyText);

    let onlyModifiedToggleInput = document.createElement('input');
    onlyModifiedToggleInput.id = "roundset-modified-checkbox"
    onlyModifiedToggleInput.classList.add('maps-progress-coop-toggle-input');
    onlyModifiedToggleInput.type = 'checkbox';
    mapProgressFilterDifficulty.appendChild(onlyModifiedToggleInput);

    if (bossRoundset) {
        //get all rounds that have the key "modified" and append their roundNumber to currentModifiedRounds
        currentModifiedRounds = [];
        roundsetProcessed.rounds.forEach((round, index) => {
            if (round.hasOwnProperty("modified")) {
                currentModifiedRounds.push(round.roundNumber);
            }
        });
        onlyModifiedToggleInput.checked = true;
        mapsProgressFilter.appendChild(mapProgressFilterDifficulty);

        previewModified = onlyModifiedToggleInput;
    } else  {
        previewModified = null;
    }

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    mapsProgressFilter.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text');
    mapsProgressCoopToggleText.classList.add('black-outline');
    mapsProgressCoopToggleText.innerHTML = "Reverse:";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.id = "roundset-reverse-checkbox"
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);


    let roundsContent = document.createElement('div');
    roundsContent.id = 'rounds-content';
    roundsContent.classList.add('rounds-content');
    roundsetContent.appendChild(roundsContent);

    mapsProgressGrid.addEventListener('click', () => {
        mapsProgressGrid.classList.add('stats-tab-yellow');
        mapsProgressList.classList.remove('stats-tab-yellow');
        mapsProgressGame.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Simple";
        generateRounds(currentRoundsetView, mapsProgressCoopToggleInput.checked, onlyModifiedToggleInput.checked);
    })
    mapsProgressList.addEventListener('click', () => {
        mapsProgressList.classList.add('stats-tab-yellow');
        mapsProgressGrid.classList.remove('stats-tab-yellow');
        mapsProgressGame.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Topper";
        generateRounds(currentRoundsetView, mapsProgressCoopToggleInput.checked, onlyModifiedToggleInput.checked);
    })
    mapsProgressGame.addEventListener('click', () => {
        mapsProgressGame.classList.add('stats-tab-yellow');
        mapsProgressGrid.classList.remove('stats-tab-yellow');
        mapsProgressList.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Preview";
        generateRounds(currentRoundsetView, mapsProgressCoopToggleInput.checked, onlyModifiedToggleInput.checked);
    })


    mapsProgressCoopToggleInput.addEventListener('change', () => {
        onChangeReverse(mapsProgressCoopToggleInput.checked)
    })
    onlyModifiedToggleInput.addEventListener('change', () => {
        onChangeModified(onlyModifiedToggleInput.checked)
    })
    currentRoundsetView = "Simple";
    generateRounds(currentRoundsetView, mapsProgressCoopToggleInput.checked, onlyModifiedToggleInput.checked)
    onChangeModified(onlyModifiedToggleInput.checked)
}

function processRoundset(data, defaultAppend){
    if(defaultAppend != null) {
        defaultAppend.rounds.forEach((round, index) => {
            let roundIndex = data.rounds.findIndex(round_b => round_b.roundNumber == round.roundNumber);
            if(round.addToRound) {
                if (roundIndex != -1) {
                    data.rounds[roundIndex].bloonGroups = data.rounds[roundIndex].bloonGroups.concat(round.bloonGroups);
                    data.rounds[roundIndex].addToRound = true;
                }
            } else {
                if (roundIndex != -1) {
                    data.rounds[roundIndex] = round;
                }
            }
        })
    }
    return data;
}

async function generateRounds(type, reverse, modified) {
    let roundsContent = document.getElementById('rounds-content');
    roundsContent.innerHTML = "";

    switch(type) {
        case "Simple":
            resetPreview();
            let alternate = false;
            roundsetProcessed.rounds.forEach(async (round, index) => {
                // if (modified && !round.hasOwnProperty("addToRound")) { return; }
                let roundDiv = document.createElement('div');
                roundDiv.id = `round-${round.roundNumber}`;
                roundDiv.classList.add('round-div');
                if (alternate) { roundDiv.classList.add('round-div-alt') }
            
                let roundNumber = document.createElement('p');
                roundNumber.classList.add('round-number', 'black-outline');
                roundNumber.innerHTML = round.roundNumber;
                roundDiv.appendChild(roundNumber);
            
                let roundBloonGroups = document.createElement('div');
                roundBloonGroups.id = `round-${round.roundNumber}-groups`;
                roundBloonGroups.classList.add('round-bloon-groups');
                roundDiv.appendChild(roundBloonGroups);

                let fragment = document.createDocumentFragment();
                round.bloonGroups.sort((a, b) => a.start - b.start).forEach((bloonGroup, index) => {
                    let bloonGroupDiv = document.createElement('div');
                    bloonGroupDiv.classList.add('bloon-group-div');
            
                    let bloonGroupNumber = document.createElement('p');
                    bloonGroupNumber.classList.add('bloon-group-number', 'black-outline');
                    bloonGroupNumber.innerHTML = "x" + bloonGroup.count;
                    bloonGroupDiv.appendChild(bloonGroupNumber);
            
                    let bloonGroupBloon = document.createElement('img');
                    bloonGroupBloon.classList.add('bloon-group-bloon');
                    bloonGroupBloon.src = `../Assets/BloonIcon/${bloonGroup.bloon}.png`;
                    bloonGroupBloon.loading = 'lazy';
                    bloonGroupDiv.appendChild(bloonGroupBloon);
            
                    fragment.appendChild(bloonGroupDiv);
                })
            
                roundBloonGroups.appendChild(fragment);
                roundsContent.appendChild(roundDiv);
                alternate = !alternate;
            })
            if (document.getElementById('roundset-reverse-checkbox').checked) { onChangeReverse() }
            if (previewModified != null && previewModified.checked) { onChangeModified(true) }
            break;
        case "Topper":
            resetPreview();
            let roundsDetailedDiv = document.createElement('div');
            roundsDetailedDiv.classList.add('rounds-detailed-div');
            roundsContent.appendChild(roundsDetailedDiv);

            copyLoadingIcon(roundsDetailedDiv);

            setTimeout(() => {
            let fragment = document.createDocumentFragment();

            let minWidthPercentage = (30 / 600) * 100;

            roundsetProcessed.rounds.forEach(async (round, index) => {
                let roundDiv = document.createElement('div');
                roundDiv.id = `round-${round.roundNumber}`;
                roundDiv.classList.add('round-div-detailed');
                if (reverse) { roundDiv.classList.add('round-div-reverse') }

                let roundsDivHeader = document.createElement('div');
                roundsDivHeader.classList.add('rounds-div-header');
                roundDiv.appendChild(roundsDivHeader);

                let roundNumber = document.createElement('p');
                roundNumber.classList.add('round-number', 'round-number-detailed', 'black-outline');
                roundNumber.innerHTML = `Round ${round.roundNumber}`;
                roundsDivHeader.appendChild(roundNumber);

                let rbeDiv = document.createElement('div');
                rbeDiv.classList.add('rbe-div');
                roundsDivHeader.appendChild(rbeDiv);

                let rbeImg = document.createElement('img');
                rbeImg.classList.add('rbe-img');
                rbeImg.src = "../Assets/BloonIcon/Red.png";
                rbeDiv.appendChild(rbeImg);

                let rbeTextDiv = document.createElement('div');
                rbeTextDiv.classList.add('rbe-text-div');
                rbeDiv.appendChild(rbeTextDiv);

                let roundRBE = document.createElement('p');
                roundRBE.classList.add('round-rbe', 'black-outline');
                roundRBE.innerHTML = `RBE: ${round.rbe.toLocaleString()}`;
                rbeTextDiv.appendChild(roundRBE);
                
                let roundRBETotal = document.createElement('p');
                roundRBETotal.classList.add('round-rbe-total', 'black-outline');
                roundRBETotal.innerHTML = `Total: ${round.rbeSum.toLocaleString()}`;
                rbeTextDiv.appendChild(roundRBETotal);

                let incomeDiv = document.createElement('div');
                incomeDiv.classList.add('income-div');
                roundsDivHeader.appendChild(incomeDiv);

                let incomeImg = document.createElement('img');
                incomeImg.classList.add('income-img');
                incomeImg.src = "../Assets/UI/CoinIcon.png";
                incomeDiv.appendChild(incomeImg);

                let incomeTextDiv = document.createElement('div');
                incomeTextDiv.classList.add('income-text-div');
                incomeDiv.appendChild(incomeTextDiv);
                
                let roundIncome = document.createElement('p');
                roundIncome.classList.add('round-income', 'black-outline');
                roundIncome.innerHTML = `Income: ${round.income.toLocaleString()}`;
                incomeTextDiv.appendChild(roundIncome);
                
                let roundIncomeTotal = document.createElement('p');
                roundIncomeTotal.classList.add('round-income-total', 'black-outline');
                roundIncomeTotal.innerHTML = `Total: ${round.incomeSum.toLocaleString()}`;
                incomeTextDiv.appendChild(roundIncomeTotal);

                let roundDuration = Math.max(...round.bloonGroups.map(group => group.duration));

                let roundDurationText = document.createElement('p');
                roundDurationText.classList.add('round-duration', 'black-outline');
                roundDurationText.innerHTML = `Duration: ${roundDuration.toFixed(2)}s`;
                roundsDivHeader.appendChild(roundDurationText);

                let timelineDiv = document.createElement('div');
                timelineDiv.classList.add('timeline-div');
                roundDiv.appendChild(timelineDiv);
                round.bloonGroups.forEach((bloonGroup, index) => {
                    let bloonGroupDiv = document.createElement('div');
                    bloonGroupDiv.classList.add('bloon-group-div-detailed');
                    timelineDiv.appendChild(bloonGroupDiv);

                    let leftDiv = document.createElement('div');
                    leftDiv.classList.add('left-div');
                    bloonGroupDiv.appendChild(leftDiv);

                    let bloonImage = document.createElement('img');
                    bloonImage.classList.add('bloon-image');
                    bloonImage.src = `../Assets/BloonIcon/${bloonGroup.bloon}.png`;
                    leftDiv.appendChild(bloonImage);

                    let bloonCount = document.createElement('p');
                    bloonCount.classList.add('bloon-count', 'black-outline');
                    bloonCount.innerHTML = "x" + bloonGroup.count;
                    leftDiv.appendChild(bloonCount);
                    
                    let rightDiv = document.createElement('div');
                    rightDiv.classList.add('timeline-right-div');
                    bloonGroupDiv.appendChild(rightDiv);
                    
                    let bloonBar = document.createElement('div');
                    bloonBar.classList.add('bloon-bar');
                    rightDiv.appendChild(bloonBar);

                    let bloonBarFill = document.createElement('div');
                    bloonBarFill.classList.add('bloon-bar-fill');
                    bloonBarFill.style.background = bloonsData[bloonGroup.bloon.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].color;
                    if (!bloonGroup.bloon.includes("Rainbow")) {
                        bloonBarFill.style.border = `4px solid ${bloonsData[bloonGroup.bloon.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].border}`;
                    }

                    let widthPercentage = ((bloonGroup.duration - bloonGroup.start) / roundDuration) * 100;
                    let leftPercentage = (bloonGroup.start / roundDuration) * 100;
            
                    if (widthPercentage < minWidthPercentage) {
                        widthPercentage = minWidthPercentage;
                    }
            
                    if (leftPercentage + widthPercentage > 100) {
                        leftPercentage = 100 - widthPercentage;
                    }
            
                    bloonBarFill.style.width = `${widthPercentage}%`;
                    bloonBarFill.style.left = `${leftPercentage}%`;

                    bloonBar.appendChild(bloonBarFill);
                })
                fragment.appendChild(roundDiv);
            })
            roundsDetailedDiv.innerHTML = "";
            roundsDetailedDiv.appendChild(fragment);
            if (document.getElementById('roundset-reverse-checkbox').checked) { onChangeReverse() }
            if (previewModified != null && previewModified.checked) { onChangeModified(true) }
            }, 0)
            break;
        case "Preview":
            let previewContainerDiv = document.createElement('div');
            previewContainerDiv.classList.add('preview-container-div');
            roundsContent.appendChild(previewContainerDiv);

            let previewDiv = document.createElement('div');
            previewDiv.classList.add('preview-div');
            previewContainerDiv.appendChild(previewDiv);

            let previewHeader = document.createElement('div');
            previewHeader.classList.add('preview-header');
            previewDiv.appendChild(previewHeader);

            let roundNumber = document.createElement('p');
            roundNumber.id = 'round-number-preview';
            roundNumber.classList.add('round-number', 'round-number-preview', 'black-outline');
            roundNumber.innerHTML = `Round ${currentPreviewRound + 1}`;
            previewHeader.appendChild(roundNumber);

            let selectRoundNum = document.createElement('input');
            selectRoundNum.id = 'select-round-num-preview';
            selectRoundNum.classList.add('select-round-num');
            selectRoundNum.type = 'number';
            selectRoundNum.min = 1;
            selectRoundNum.max = roundsetProcessed.rounds.length;
            selectRoundNum.value = currentPreviewRound + 1;
            selectRoundNum.addEventListener('change', () => {
                if (selectRoundNum.value < 1) { selectRoundNum.value = 1 }
                if (selectRoundNum.value > roundsetProcessed.rounds.length) { selectRoundNum.value = roundsetProcessed.rounds.length }
                roundNumber.innerHTML = `Round ${selectRoundNum.value}`;
                currentPreviewRound = selectRoundNum.value - 1;
                updatePreviewRoundTimeline()
            })
            previewHeader.appendChild(selectRoundNum);
            
            let previewRightDiv = document.createElement('div');
            previewRightDiv.classList.add('preview-right-div');
            previewHeader.appendChild(previewRightDiv);

            //clear button
            let clearButton = document.createElement('img');
            clearButton.classList.add('clear-button');
            clearButton.src = "../Assets/UI/DestroyBloonsBtn.png";
            clearButton.addEventListener('click', () => {
                clearPreview()
            })
            previewRightDiv.appendChild(clearButton);

            //play normal
            let playNormalButton = document.createElement('img');
            playNormalButton.classList.add('play-normal-button');
            playNormalButton.src = "../Assets/UI/GoBtnSmall.png";
            playNormalButton.addEventListener('click', () => {
                speedMultiplier = 1;
                roundNumber.innerHTML = `Round ${currentPreviewRound + 1}`;
                clearPreview()
                startRound(roundsetProcessed.rounds[currentPreviewRound])
            })
            previewRightDiv.appendChild(playNormalButton);

            //play fast forward
            let playFastButton = document.createElement('img');
            playFastButton.classList.add('play-fast-button');
            playFastButton.src = "../Assets/UI/FastForwardBtn.png";
            playFastButton.addEventListener('click', () => {
                speedMultiplier = 3;
                roundNumber.innerHTML = `Round ${currentPreviewRound + 1}`;
                clearPreview()
                startRound(roundsetProcessed.rounds[currentPreviewRound])
            })
            previewRightDiv.appendChild(playFastButton);

            canvas = document.createElement('canvas');
            canvas.id = 'roundset-canvas';
            canvas.classList.add('roundset-canvas')
            canvas.width = 800;
            canvas.height = 300;
            previewDiv.appendChild(canvas);

            let previewFooterDiv = document.createElement('div');
            previewFooterDiv.classList.add('preview-footer-div');
            previewDiv.appendChild(previewFooterDiv);

            let difficultyDiv = document.createElement('div');
            difficultyDiv.classList.add('difficulty-div');
            previewFooterDiv.appendChild(difficultyDiv);

            let difficultyEasy = document.createElement('div');
            difficultyEasy.classList.add('maps-progress-view', 'stats-tab-yellow', 'black-outline');
            difficultyEasy.innerHTML = "Easy";
            difficultyDiv.appendChild(difficultyEasy);

            let difficultyMedium = document.createElement('div');
            difficultyMedium.classList.add('maps-progress-view', 'black-outline');
            difficultyMedium.innerHTML = "Medium";
            difficultyDiv.appendChild(difficultyMedium);

            let difficultyHard = document.createElement('div');
            difficultyHard.classList.add('maps-progress-view', 'black-outline');
            difficultyHard.innerHTML = "Hard";
            difficultyDiv.appendChild(difficultyHard);

            difficultyEasy.addEventListener('click', () => {
                difficultySpeedModifier = 1;
                difficultyEasy.classList.add('stats-tab-yellow');
                difficultyMedium.classList.remove('stats-tab-yellow');
                difficultyHard.classList.remove('stats-tab-yellow');
            })
            difficultyMedium.addEventListener('click', () => {
                difficultySpeedModifier = 1.1;
                difficultyEasy.classList.remove('stats-tab-yellow');
                difficultyMedium.classList.add('stats-tab-yellow');
                difficultyHard.classList.remove('stats-tab-yellow');
            })
            difficultyHard.addEventListener('click', () => {
                difficultySpeedModifier = 1.26;
                difficultyEasy.classList.remove('stats-tab-yellow');
                difficultyMedium.classList.remove('stats-tab-yellow');
                difficultyHard.classList.add('stats-tab-yellow');
            })

            let nextPrevDiv = document.createElement('div');
            nextPrevDiv.classList.add('next-prev-div');
            previewFooterDiv.appendChild(nextPrevDiv);

            let prevRound = document.createElement('div');
            prevRound.classList.add('maps-progress-view', 'black-outline');
            prevRound.innerHTML = "Previous";
            prevRound.addEventListener('click', () => {
                if (previewModified != null && previewModified.checked) {
                    currentIndexInModifiedRounds--;
                    if (currentIndexInModifiedRounds < 0) { currentIndexInModifiedRounds = currentModifiedRounds.length - 1 }
                    currentPreviewRound = currentModifiedRounds[currentIndexInModifiedRounds] - 1;
                } else {
                    currentPreviewRound--;
                    if (currentPreviewRound < 0) { currentPreviewRound = roundsetProcessed.rounds.length - 1 }
                }
                selectRoundNum.value = currentPreviewRound + 1;
                updatePreviewRoundTimeline()
            })
            nextPrevDiv.appendChild(prevRound);

            let nextRound = document.createElement('div');
            nextRound.classList.add('maps-progress-view', 'black-outline');
            nextRound.innerHTML = "Next";
            nextRound.addEventListener('click', () => {
                if (previewModified != null && previewModified.checked) {
                    currentIndexInModifiedRounds++;
                    if (currentIndexInModifiedRounds >= currentModifiedRounds.length) { currentIndexInModifiedRounds = 0 }
                    currentPreviewRound = currentModifiedRounds[currentIndexInModifiedRounds] - 1;
                } else {
                    currentPreviewRound++;
                    if (currentPreviewRound >= roundsetProcessed.rounds.length) { currentPreviewRound = 0 }
                }
                selectRoundNum.value = currentPreviewRound + 1;
                updatePreviewRoundTimeline()
            })
            nextPrevDiv.appendChild(nextRound);
            
            let roundInfoDiv = document.createElement('div');
            roundInfoDiv.id = 'preview-round-info-div';
            roundInfoDiv.classList.add('round-info-div');
            previewDiv.appendChild(roundInfoDiv);

            ctx = canvas.getContext('2d');

            // if (previewInterval != null) { clearInterval(previewInterval); }
            // previewInterval = setInterval(()=>{
            //     update();
            //     render();
            // }, 1000/60);

            let lastFrameTime = performance.now();

            function previewRender() {
                if (!previewActive) {
                    console.log('stopping')
                    return;
                }

                const now = performance.now();
                const deltaTime = (now - lastFrameTime) / 1000;
                lastFrameTime = now;
                
                update(deltaTime);
                render();
                requestAnimationFrame(previewRender);
            }

            previewActive = true;

            requestAnimationFrame(previewRender);

            if (previewModified != null && previewModified.checked) { onChangeModified(true) }
            updatePreviewRoundTimeline()
            if (document.getElementById('roundset-reverse-checkbox').checked) { onChangeReverse() }
            break;
    }
}

function onChangeModified(modified) {
    switch(currentRoundsetView) {
        case "Simple":
            let alternate = false;
            roundsetProcessed.rounds.forEach(async (round, index) => {
                let roundDiv = document.getElementById(`round-${round.roundNumber}`);
                if (modified && !round.hasOwnProperty("modified")) {
                    roundDiv.style.display = "none";
                } else {
                    roundDiv.style.display = "flex";
                    if (alternate) { roundDiv.classList.add('round-div-alt') } else if (Array.from(roundDiv.classList).includes('round-div-alt')) { roundDiv.classList.remove('round-div-alt') }
                    alternate = !alternate;
                }

            })
            break;
        case "Topper":
            roundsetProcessed.rounds.forEach(async (round, index) => {
                let roundDiv = document.getElementById(`round-${round.roundNumber}`);
                if (modified && !round.hasOwnProperty("modified")) {
                    roundDiv.style.display = "none";
                } else {
                    roundDiv.style.display = "flex";
                }
            })
            break;
        case "Preview":
            if(modified) {
                currentPreviewRound = currentModifiedRounds[0] - 1;
                document.getElementById('round-number-preview').innerHTML = `Round ${currentModifiedRounds[0]}`;
                document.getElementById('select-round-num-preview').value = currentModifiedRounds[0];
                updatePreviewRoundTimeline()
            } else {
                currentPreviewRound = 0;
                document.getElementById('round-number-preview').innerHTML = `Round ${currentPreviewRound + 1}`;
                document.getElementById('select-round-num-preview').value = currentPreviewRound + 1;
                updatePreviewRoundTimeline()
            }
            break;
    }
}

function onChangeReverse() {
    switch(currentRoundsetView) {
        case "Simple":
            roundsetProcessed.rounds.forEach((round, index) => {
                let groupsDiv = document.getElementById(`round-${round.roundNumber}-groups`); 
                let groups = Array.from(groupsDiv.children);
                groups.reverse().forEach(group => groupsDiv.appendChild(group));
            });
            break;
        case "Topper":
            let timelineDivs = document.getElementsByClassName('timeline-div');
            for (let timelineDiv of timelineDivs) {
                timelineDiv.classList.toggle('timeline-div-reverse');
            }
            let timelineDivss = document.getElementsByClassName('timeline-right-div');
            for (let timelineDiv of timelineDivss) {
                timelineDiv.classList.toggle('flip-horizontal');
            }
            break;
        case "Preview":
            document.getElementById('preview-timeline-div').classList.toggle('timeline-div-reverse');
            let timelineDivssPreview = document.getElementsByClassName('preview-timeline-right-div');
            for (let timelineDiv of timelineDivssPreview) {
                timelineDiv.classList.toggle('flip-horizontal');
            }
    }
}

function updatePreviewRoundTimeline() {
    let contentDiv = document.getElementById('preview-round-info-div');
    contentDiv.innerHTML = "";

    let round = roundsetProcessed.rounds[currentPreviewRound];

    let roundDiv = document.createElement('div');
    roundDiv.classList.add('round-div-detailed');
    contentDiv.appendChild(roundDiv);

    let roundsDivHeader = document.createElement('div');
    roundsDivHeader.classList.add('rounds-div-header');
    roundDiv.appendChild(roundsDivHeader);

    
    let roundNumber = document.createElement('p');
    roundNumber.classList.add('round-number', 'round-number-detailed', 'black-outline');
    roundNumber.innerHTML = `Round ${round.roundNumber}`;
    roundsDivHeader.appendChild(roundNumber);
    
    let rbeDiv = document.createElement('div');
    rbeDiv.classList.add('rbe-div');
    roundsDivHeader.appendChild(rbeDiv);

    let rbeImg = document.createElement('img');
    rbeImg.classList.add('rbe-img');
    rbeImg.src = "../Assets/BloonIcon/Red.png";
    rbeDiv.appendChild(rbeImg);

    let rbeTextDiv = document.createElement('div');
    rbeTextDiv.classList.add('rbe-text-div');
    rbeDiv.appendChild(rbeTextDiv);
    
    let roundRBE = document.createElement('p');
    roundRBE.classList.add('round-rbe', 'black-outline');
    roundRBE.innerHTML = `RBE: ${round.rbe.toLocaleString()}`;
    rbeTextDiv.appendChild(roundRBE);
    
    let roundRBETotal = document.createElement('p');
    roundRBETotal.classList.add('round-rbe-total', 'black-outline');
    roundRBETotal.innerHTML = `Total: ${round.rbeSum.toLocaleString()}`;
    rbeTextDiv.appendChild(roundRBETotal);

    let incomeDiv = document.createElement('div');
    incomeDiv.classList.add('income-div');
    roundsDivHeader.appendChild(incomeDiv);

    let incomeImg = document.createElement('img');
    incomeImg.classList.add('income-img');
    incomeImg.src = "../Assets/UI/CoinIcon.png";
    incomeDiv.appendChild(incomeImg);

    let incomeTextDiv = document.createElement('div');
    incomeTextDiv.classList.add('income-text-div');
    incomeDiv.appendChild(incomeTextDiv);
    
    let roundIncome = document.createElement('p');
    roundIncome.classList.add('round-income', 'black-outline');
    roundIncome.innerHTML = `Income: ${round.income.toLocaleString()}`;
    incomeTextDiv.appendChild(roundIncome);
    
    let roundIncomeTotal = document.createElement('p');
    roundIncomeTotal.classList.add('round-income-total', 'black-outline');
    roundIncomeTotal.innerHTML = `Total: ${round.incomeSum.toLocaleString()}`;
    incomeTextDiv.appendChild(roundIncomeTotal);

    let roundDuration = Math.max(...round.bloonGroups.map(group => group.duration));

    let roundDurationText = document.createElement('p');
    roundDurationText.classList.add('round-duration', 'black-outline');
    roundDurationText.innerHTML = `Duration: ${roundDuration.toFixed(2)}s`;
    roundsDivHeader.appendChild(roundDurationText);

    let timelineDiv = document.createElement('div');
    timelineDiv.id = "preview-timeline-div"
    timelineDiv.classList.add('timeline-div');
    roundDiv.appendChild(timelineDiv);

    let minWidthPercentage = (30 / 600) * 100; 
    round.bloonGroups.forEach((bloonGroup, index) => {
        let bloonGroupDiv = document.createElement('div');
        bloonGroupDiv.classList.add('bloon-group-div-detailed');
        timelineDiv.appendChild(bloonGroupDiv);

        let leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        bloonGroupDiv.appendChild(leftDiv);
        
        let bloonImage = document.createElement('img');
        bloonImage.classList.add('bloon-image');
        bloonImage.src = `../Assets/BloonIcon/${bloonGroup.bloon}.png`;
        leftDiv.appendChild(bloonImage);
        
        let bloonCount = document.createElement('p');
        bloonCount.classList.add('bloon-count', 'black-outline');
        bloonCount.innerHTML = "x" + bloonGroup.count;
        leftDiv.appendChild(bloonCount);
        
        let rightDiv = document.createElement('div');
        rightDiv.classList.add('timeline-right-div','preview-timeline-right-div');
        bloonGroupDiv.appendChild(rightDiv);
        
        let bloonBar = document.createElement('div');
        bloonBar.classList.add('bloon-bar');
        rightDiv.appendChild(bloonBar);

        let bloonBarFill = document.createElement('div');
        bloonBarFill.classList.add('bloon-bar-fill');
        bloonBarFill.style.background = bloonsData[bloonGroup.bloon.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].color;
        if (!bloonGroup.bloon.includes("Rainbow")) {
            bloonBarFill.style.border = `4px solid ${bloonsData[bloonGroup.bloon.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].border}`;
        }

        let widthPercentage = ((bloonGroup.duration - bloonGroup.start) / roundDuration) * 100;
        let leftPercentage = (bloonGroup.start / roundDuration) * 100;

        if (widthPercentage < minWidthPercentage) {
            widthPercentage = minWidthPercentage;
        }

        if (leftPercentage + widthPercentage > 100) {
            leftPercentage = 100 - widthPercentage;
        }

        bloonBarFill.style.width = `${widthPercentage}%`;
        bloonBarFill.style.left = `${leftPercentage}%`;

        bloonBar.appendChild(bloonBarFill);
    })
    if (document.getElementById('roundset-reverse-checkbox').checked) { onChangeReverse() }
}

function addTimelinePlayhead(duration) {
    let timelineDiv = document.getElementById('preview-timeline-div');
    let playhead = document.createElement('div');
    playhead.id = 'preview-playhead'
    playhead.classList.add('playhead');
    timelineDiv.appendChild(playhead);
    playhead.style.animation = `playhead ${duration}s linear`;
    playhead.addEventListener('animationend', function() {
        playhead.remove();
    });
}

function clearPreview(){
    if (document.getElementById('preview-playhead')) { document.getElementById('preview-playhead').remove() }
    currentRoundGroups = null;
    bloons.length = 0;
}

function resetPreview() {
    previewActive = false;
    clearPreview();
}

function generateSettings(){
    let settingsContent = document.getElementById('settings-content');
    settingsContent.innerHTML = "";

    let noDataFound = document.createElement('p');
    noDataFound.classList.add('no-data-found','black-outline');
    noDataFound.innerHTML = "Coming Soon";
    settingsContent.appendChild(noDataFound);

    let settingsContainer = document.createElement('div');
    settingsContainer.id = 'settings-container';
    settingsContainer.classList.add('settings-container');
    settingsContent.appendChild(settingsContainer);

    let settingsOptionsContainer = document.createElement('div');
    settingsOptionsContainer.id = 'settings-options-container';
    settingsOptionsContainer.classList.add('settings-options-container');
    settingsContainer.appendChild(settingsOptionsContainer);

    let whereButton = document.createElement('p');
    whereButton.id = 'where-button';
    whereButton.classList.add('where-button');
    whereButton.classList.add('return-entry-button');
    whereButton.classList.add('black-outline');
    whereButton.innerHTML = 'Clear Local Storage';
    whereButton.addEventListener('click', () => {
        // document.getElementById('front-page').style.display = "block";
        // document.getElementById('settings-content').style.display = "none";
        localStorage.clear();
    })
    // settingsOptionsContainer.appendChild(whereButton);

}

function processRewardsString(input){
    let result = {};
    let rewards = input.split("#");
    let counter = 0;
    for (let reward of rewards) {
        result[counter] = {};
        let rewardData = reward.split(":");
        let rewardType = rewardData[0];
        if (!["MonkeyMoney","Power","InstaMonkey","KnowledgePoints","RandomInstaMonkey","Trophy"].includes(rewardType)) {
            result[counter].type = "Other";
            result[counter].value = rewardType;
            counter++;
            continue;
        }
        let params = rewardData[1].split(",");
        switch (rewardType) {
            case "MonkeyMoney":
                result[counter].type = "MonkeyMoney";
                result[counter].amount = parseInt(params[0]);
                break;
            case "Power":
                result[counter].type = "Power";
                result[counter].power = params[0];
                result[counter].amount = parseInt(params[1]);
                if(params[1] == null) { result[counter].amount = 1;}
                break;
            case "InstaMonkey":
                result[counter].type = "InstaMonkey";
                result[counter].tower = params[0];
                result[counter].tiers = params[1];
                break;
            case "KnowledgePoints":
                result[counter].type = "KnowledgePoints";
                result[counter].amount = parseInt(params[0]);
                break;
            case "RandomInstaMonkey":
                result[counter].type = "RandomInstaMonkey";
                result[counter].tier = params[0];
                result[counter].amount = parseInt(params[1]);
                break;
            case "Trophy":
                result[counter].type = "Trophy";
                result[counter].trophy = params[0];
                break;
        }
        counter++;
    }
    return result;
}

function copyLoadingIcon(destination){
    let clone = document.getElementsByClassName('loading-icon')[0].cloneNode(true)
    clone.classList.add('loading-icon-leaderboard');
    clone.style.height = "unset"
    destination.appendChild(clone)
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
}

function formatScoreTime(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let remainingMilliseconds = milliseconds % 1000;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600; // Subtract the hours
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // Pad minutes, seconds and milliseconds with leading zeros if necessary
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    remainingMilliseconds = remainingMilliseconds.toString().padStart(3, '0');

    // Only include hours in the output if they are greater than 0
    let timeString = `${minutes}:${seconds}.${remainingMilliseconds}`;
    if (hours > 0) {
        hours = hours.toString().padStart(2, '0');
        timeString = `${hours}:${timeString}`;
    }

    return timeString;
}

function getRemainingTime(targetTime) {
    const now = new Date();
    const remainingTime = (targetTime - now) / 1000; // convert to seconds
    return remainingTime;
}

function updateTimer(targetTime, elementId) {
    const remainingTime = getRemainingTime(targetTime);
    const timerElement = document.getElementById(elementId);

    if (remainingTime > 48 * 3600) {
        const days = Math.ceil(remainingTime / (24 * 3600));
        timerElement.textContent = `${days} days`;
    } else {
        timerElement.textContent = formatTime(remainingTime);
    }
}

function relativeTime(current, previous) {
    const units = [
        { name: "year", ms: 365 * 24 * 60 * 60 * 1000 },
        { name: "month", ms: 30 * 24 * 60 * 60 * 1000 },
        { name: "day", ms: 24 * 60 * 60 * 1000 },
        { name: "hour", ms: 60 * 60 * 1000 },
        { name: "minute", ms: 60 * 1000 },
        { name: "second", ms: 1000 }
    ];

    const elapsed = current - previous;

    for (const unit of units) {
        if (elapsed < unit.ms) continue;
        let time = Math.round(elapsed / unit.ms);
        return `${time} ${unit.name}${time > 1 ? 's' : ''} ago`;
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

function resetScroll() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function errorModal(body, source) {
    if (isErrorModalOpen) { return; }
    let modalOverlay = document.createElement('div');
    modalOverlay.classList.add('error-modal-overlay');
    document.body.appendChild(modalOverlay);

    let modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.classList.add('error-modal');
    modalOverlay.appendChild(modal);

    let modalHeader = document.createElement('div');
    modalHeader.id = 'error-modal-header';
    modalHeader.classList.add('error-modal-header');
    modal.appendChild(modalHeader);

    let modalHeaderImg = document.createElement('img');
    modalHeaderImg.id = 'error-modal-header-img';
    modalHeaderImg.classList.add('error-modal-header-img');
    modalHeaderImg.src = "./Assets/UI/BadConnectionBtn.png";
    modalHeader.appendChild(modalHeaderImg);

    let modalHeaderText = document.createElement('p');
    modalHeaderText.id = 'error-modal-header-text';
    modalHeaderText.classList.add('error-modal-header-text');
    modalHeaderText.classList.add('black-outline');
    modalHeaderText.innerHTML = "Error";
    modalHeader.appendChild(modalHeaderText);

    let dummyElmnt = document.createElement('div');
    dummyElmnt.classList.add('error-modal-dummy');
    modalHeader.appendChild(dummyElmnt);

    let modalContent = document.createElement('div');
    modalContent.id = 'error-modal-content';
    modalContent.classList.add('error-modal-content');
    modalContent.innerHTML = (source == "api" ? "" : "") + body; //Ninja Kiwi API Error: 
    modal.appendChild(modalContent);

    let modalContent2  = document.createElement('div');
    modalContent2.id = 'error-modal-content2';
    modalContent2.classList.add('error-modal-content');
    switch(body) {
        case "Invalid user ID / Player Does not play this game":
            modalContent2.innerHTML = "Please try again or create a new Open Access Key.";
            break;
    }
    modal.appendChild(modalContent2);

    let okButtonDiv = document.createElement('div');
    okButtonDiv.classList.add('error-modal-ok-button-div');
    modal.appendChild(okButtonDiv);

    let okButton = document.createElement('div');
    okButton.classList.add('start-button', 'modal-ok-button', 'black-outline');
    okButton.innerHTML = 'OK';
    okButton.addEventListener('click', () => {
        isErrorModalOpen = false;
        document.body.removeChild(modalOverlay);
    })
    okButtonDiv.appendChild(okButton);

    let modalClose = document.createElement('img');
    modalClose.classList.add('error-modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        isErrorModalOpen = false;
        document.body.removeChild(modalOverlay);
    })
    modalContent.appendChild(modalClose);

    isErrorModalOpen = true;
    
}
