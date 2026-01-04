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
let exclusiveStats = {}
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

let useNamedMonkeys = true;

let currentlySelectedHero = "";

let allHeroesShown = false;
let allTowersShown = false;

let currentMapView = "grid";
let coopEnabled = false;
let currentDifficultyFilter = "All";
let mapPage = 0;

let currentInstaView = "game";
let instasMissingToggle = false;

let currentAchievementFilter = "game";
let currentAchievementRewardFilter = "None";

let processedInstaData = {
    "TowerTotal": {},
    "TowerTierTotals": {},
    "TowerMissingByTier": {},
    "TowerBorders": {},
    "TowerObtained": {}
}

let showElite = false;

let currentBrowserView = "grid";

let currentCollectionChest = "None";
let currentCollectionTower = "All";
let collectionMissingToggle = true;
let collectionListSortType = "Highest Total Chance";

let chestSelectorMap = {
    "wood": "Wooden",
    "bronze": "Bronze",
    "silver": "Silver",
    "gold": "Gold",
    "diamond": "Diamond"
}

let showFeaturedFilter = false;
let currentFeaturedTower = "All";

let trophyStoreSubFilter = "All";
let subFiltersMap = {
    "Heroes": ["All", "HeroPlacementUpgrades", "HeroPets"],
    "Monkeys": ["All", "TowerPlacementUpgrades", "TowerPets", "Projectiles", "Flags"],
    "Bloons": ["All", "PopFX", "AllBloonSkins", "RegularSkins", "MoabSkins"],
    "Coop": ["All", "StandardEmotes", "TextEmotes", "SoundEmotes", "FullScreenEmotes"],
    "GameUI": ["All", "MusicTracks","Avatars", "ProfileBanners", "PowerSkins", "Misc"]
}

let showTeamsItems = false;

let abilitiesFilter = "Most Used";
let allInstaFilter = "Tier (Ascending)";

let loggedIn = false;

let imageScroll = [
    {
        "title": "New Site Update!",
        "text": `Site Update 2.4.0:<br>
        - Contested Territory Map<br>
        - Automatic Collection Events<br>
        <br>
        Recent Updates:<br>
        - Added Roundset Filtering<br>
        - Contested Territory Groups<br>
        <br>
        Try the <a href="https://btd6store.ninjakiwi.com/" target="_blank" style="color: white;">Official BTD6 Webshop</a>!<br>
        Creator Code: 'HalfHydra' - TY!<br>
        Report Bugs: <a href="https://discord.gg/wep2RDmcqZ" target="_blank" style="color: white;">Discord Server</a><br>
        `,
        "image": "/LandingScroll/Update52&CTMap"
    },
    {
        "title": "View Your Profile!",
        "text": "- View API exclusive stats<br>- Full Top Heroes/Towers list<br>- Top Paragons counts<br>- Ability usage counts<br>- Detailed map statistics<br>- Track your insta monkey collection",
        "image": "OverviewProfile"
    },
    {
        "title": "View Events!",
        "text": "- Recent events details<br>- Race event details<br>- Boss event details<br>- Odyssey event details<br>- Contested Territory details<br>- Daily Challenge details<br>- Collection event details",
        "image": "/LandingScroll/Events"
    },
    {
        "title": "Featured Insta Schedule!",
        "text": "- View Collection Event's rotation and schedule<br>- View in your local timezone<br>- Filter schedule by tower type",
        "image": "/LandingScroll/CollectionEvent"
    },
    {
        "title": "Contested Territory Map!",
        "text": "- Accurate depiction of the latest CT map<br>- Simple tile summaries<br>- Customizable map<br>- Identify relic locations relative to your team",
        "image": "/LandingScroll/CTMap"
    },
    {
        "title": "View Leaderboards!",
        "text": "- View event leaderboards<br>- Up to 1000 entries<br>- View extra score information<br>- View user profiles<br>- Contested Territory groups",
        "image": "/LandingScroll/Leaderboards"
    },
    {
        "title": "View Roundsets!",
        "text": "- Detailed round information<br>- Advanced round filtering<br>- Preview rounds visually<br>- Boss custom rounds<br>- Custom event rounds<br>- Rogue Legends special rounds included",
        "image": "/LandingScroll/Roundsets"
    },
    {
        "title": "Rogue Legends Helper!",
        "text": "- View all artifacts<br>- Search, sort, and filtering<br>- Hero Starter Kits reference<br>- Track extracted artifacts<br>- Export progress image (desktop only)",
        "image": "/LandingScroll/RogueLegends"
    }
]
let imageScrollIndex = 0;

fetchConstants().then(() => {
    generateVersionInfo();
});

function generateIfReady(){
    if (readyFlags.every(flag => flag === 1)){
        if(document.getElementById("home-content")){
            document.getElementById("home-content").style.display = "none";
        }
        document.body.classList.add('transition-bg')
        generateRankInfo()
        generateVeteranRankInfo()
        generateAchievementsHelper()
        generateStats()
        generateMedals()
        generateExtras()
        generateInstaData()
        generateMapData()
        generateProgressSubText()
        changeTab('profile');
        if(parseInt(btd6usersave.latestGameVersion.split(".")[0]) > constants.projectContentVersion) {
            errorModal(`The content of this site (v${constants.projectContentVersion}.0) is out of date with the current version (v${btd6usersave.latestGameVersion.split(".")[0]}.0). New content might be missing, but everything else should remain functional.`, "api", true)
        }
    } else if(!loggedIn && readyFlags.slice(2).every(flag => flag === 1)){
        document.getElementById("home-content").style.display = "none";
        document.body.classList.add('transition-bg')
        generateHeaderTabs();
        changeTab('profile');
    }
}

function previewSite(){
   fetchMainDependencies(true); 
}

function generateRankInfo(){
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

    //stats not in game
    exclusiveStats["Daily Challenges Completed"] = btd6usersave["totalDailyChallengesCompleted"];
    exclusiveStats["Consecutive DCs Completed"] = btd6usersave["consecutiveDailyChallengesCompleted"];
    exclusiveStats["Race Attempts"] = btd6usersave["totalRacesEntered"];
    exclusiveStats["Contested Territory Tiles Captured"] = btd6publicprofile.stats["ctCapturedTiles"];
    exclusiveStats["Challenges Played"] = btd6usersave["challengesPlayed"];
    exclusiveStats["Challenges Shared"] = btd6usersave["challengesShared"];
    exclusiveStats["Continues Used"] = btd6usersave["continuesUsed"];
    exclusiveStats["Towers Sold"] = btd6publicprofile.stats["totalTowersSold"];
    exclusiveStats["Total Tier 1 Upgrades"] = btd6publicprofile.stats["upgradesPurchasedByTier"]["1"];
    exclusiveStats["Total Tier 2 Upgrades"] = btd6publicprofile.stats["upgradesPurchasedByTier"]["2"];
    exclusiveStats["Total Tier 3 Upgrades"] = btd6publicprofile.stats["upgradesPurchasedByTier"]["3"];
    exclusiveStats["Total Tier 4 Upgrades"] = btd6publicprofile.stats["upgradesPurchasedByTier"]["4"];
    exclusiveStats["Total Tier 5 Upgrades"] = btd6publicprofile.stats["upgradesPurchasedByTier"]["5"];

    //Calculate the hidden and normal achievements
    let hiddenAchievements = 0;
    let normalAchievements = 0;
    btd6usersave.achievementsClaimed.forEach((achievement) => {
        let achievementModel = achievementsHelper[fixAchievementName(achievement)];
        if(!achievementModel) { return }
        if (achievementModel.model.hidden){
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
    medalsInOrder["BlastapopoulosEliteBadge"] = btd6publicprofile["bossBadgesElite"]["Blastapopoulos"] || 0;
    medalsInOrder["BlastapopoulosBadge"] = btd6publicprofile["bossBadgesNormal"]["Blastapopoulos"] || 0;
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
    medalsInOrder["MedalEventDoubleSilverMedal"] = btd6publicprofile["_medalsRace"]["DoubleSilver"] || 0;
    medalsInOrder["MedalEventGoldSilverMedal"] = btd6publicprofile["_medalsRace"]["GoldSilver"] || 0;
    medalsInOrder["MedalEventDoubleGoldMedal"] = btd6publicprofile["_medalsRace"]["DoubleGold"] || 0;
    medalsInOrder["MedalEventGoldDiamondMedal"] = btd6publicprofile["_medalsRace"]["GoldDiamond"] || 0;
    medalsInOrder["MedalEventBlueDiamondMedal"] = btd6publicprofile["_medalsRace"]["BlueDiamond"] || 0;
    medalsInOrder["MedalEventRedDiamondMedal"] = btd6publicprofile["_medalsRace"]["RedDiamond"] || 0;
    medalsInOrder["MedalEventBlackDiamondMedal"] = btd6publicprofile["_medalsRace"]["BlackDiamond"] || 0;
    medalsInOrder["OdysseyStarIcon"] = btd6publicprofile.gameplay["totalOdysseyStars"] || 0;
    medalsInOrder["BossMedalEventBronzeMedal"] = btd6publicprofile["_medalsBoss"]["Bronze"] || 0;
    medalsInOrder["BossMedalEventSilverMedal"] = btd6publicprofile["_medalsBoss"]["Silver"] || 0;
    medalsInOrder["BossMedalEventDoubleSilverMedal"] = btd6publicprofile["_medalsBoss"]["DoubleSilver"] || 0;
    medalsInOrder["BossMedalEventGoldSilverMedal"] = btd6publicprofile["_medalsBoss"]["GoldSilver"] || 0;
    medalsInOrder["BossMedalEventDoubleGoldMedal"] = btd6publicprofile["_medalsBoss"]["DoubleGold"] || 0;
    medalsInOrder["BossMedalEventGoldDiamondMedal"] = btd6publicprofile["_medalsBoss"]["GoldDiamond"] || 0;
    medalsInOrder["BossMedalEventBlueDiamondMedal"] = btd6publicprofile["_medalsBoss"]["BlueDiamond"] || 0;
    medalsInOrder["BossMedalEventRedDiamondMedal"] = btd6publicprofile["_medalsBoss"]["RedDiamond"] || 0;
    medalsInOrder["BossMedalEventBlackDiamondMedal"] = btd6publicprofile["_medalsBoss"]["BlackDiamond"] || 0;
    medalsInOrder["EliteBossMedalEventBronzeMedal"] = btd6publicprofile["_medalsBossElite"]["Bronze"] || 0;
    medalsInOrder["EliteBossMedalEventSilverMedal"] = btd6publicprofile["_medalsBossElite"]["Silver"] || 0;
    medalsInOrder["EliteBossMedalEventDoubleSilverMedal"] = btd6publicprofile["_medalsBossElite"]["DoubleSilver"] || 0;
    medalsInOrder["EliteBossMedalEventGoldSilverMedal"] = btd6publicprofile["_medalsBossElite"]["GoldSilver"] || 0;
    medalsInOrder["EliteBossMedalEventDoubleGoldMedal"] = btd6publicprofile["_medalsBossElite"]["DoubleGold"] || 0;
    medalsInOrder["EliteBossMedalEventGoldDiamondMedal"] = btd6publicprofile["_medalsBossElite"]["GoldDiamond"] || 0;
    medalsInOrder["EliteBossMedalEventBlueDiamondMedal"] = btd6publicprofile["_medalsBossElite"]["BlueDiamond"] || 0;
    medalsInOrder["EliteBossMedalEventRedDiamondMedal"] = btd6publicprofile["_medalsBossElite"]["RedDiamond"] || 0;
    medalsInOrder["EliteBossMedalEventBlackDiamondMedal"] = btd6publicprofile["_medalsBossElite"]["BlackDiamond"] || 0;
    medalsInOrder["CtLocalPlayerBronzeMedal"] = btd6publicprofile["_medalsCTLocal"]["Bronze"] || 0;
    medalsInOrder["CtLocalPlayerSilverMedal"] = btd6publicprofile["_medalsCTLocal"]["Silver"] || 0;
    medalsInOrder["CtLocalPlayerDoubleGoldMedal"] = btd6publicprofile["_medalsCTLocal"]["DoubleGold"] || 0;
    medalsInOrder["CtLocalPlayerGoldDiamondMedal"] = btd6publicprofile["_medalsCTLocal"]["GoldDiamond"] || 0;
    medalsInOrder["CtLocalPlayerBlueDiamondMedal"] = btd6publicprofile["_medalsCTLocal"]["BlueDiamond"] || 0;
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
    if (btd6usersave["unlockedBigBloons"]){ extrasUnlocked["Big Bloons"] = btd6usersave["bigBloonsActive"] }
    if (btd6usersave["unlockedSmallBloons"]){ extrasUnlocked["Small Bloons"] = btd6usersave["smallBloonsActive"] }
    if (btd6usersave["seenBigTowers"]){ extrasUnlocked["Big Monkey Towers"] = btd6usersave["bigTowersActive"] }
    if (btd6usersave["unlockedSmallTowers"]){ extrasUnlocked["Small Monkey Towers"] = btd6usersave["smallTowersActive"] }
    if (btd6usersave["unlockedSmallBosses"]){ extrasUnlocked["Small Bosses"] = btd6usersave["smallBossesActive"] }
}

function generateProgressSubText(){
    let towersCount = Object.keys(btd6usersave.unlockedTowers).filter(k => btd6usersave.unlockedTowers[k]).length;
    progressSubText["Towers"] = `${towersCount}/${Object.keys(btd6usersave.unlockedTowers).length} Towers Unlocked`;
    let upgrades = Object.keys(btd6usersave.acquiredUpgrades);
    let upgradesUnlocked = upgrades.filter(k => btd6usersave.acquiredUpgrades[k]);
    let paragons = upgrades.filter(k => k.includes("Paragon") && k != "Sentry Paragon");
    let paragonsUnlocked = paragons.filter(k => btd6usersave.acquiredUpgrades[k]);
    progressSubText["Upgrades"] = `${upgradesUnlocked.length - paragonsUnlocked.length}/${upgrades.length - paragons.length} Upgrades Unlocked`;
    if (paragonsUnlocked.length > 0) { progressSubText["Paragons"] = `${paragonsUnlocked.length}/${paragons.length} Paragon${paragonsUnlocked.length != 1 ? "s" : ""} Unlocked` }
    let heroesUnlocked = Object.keys(btd6usersave.unlockedHeros).filter(k => btd6usersave.unlockedHeros[k]).length;
    progressSubText["Heroes"] = `${heroesUnlocked}/${Object.keys(btd6usersave.unlockedHeros).length} Hero${heroesUnlocked != 1 ? "es" : ""} Unlocked`;
    let skinsUnlocked = Object.keys(btd6usersave.unlockedSkins).filter(k => !Object.keys(constants.heroesInOrder).includes(k)).filter(k => btd6usersave.unlockedSkins[k]).length
    progressSubText["Skins"] = `${skinsUnlocked}/${Object.keys(btd6usersave.unlockedSkins).filter(k => !Object.keys(constants.heroesInOrder).includes(k)).length} Hero Skin${skinsUnlocked != 1 ? "s" : ""} Unlocked`;
    progressSubText["ActivatedAbilities"] = `${Object.keys(btd6publicprofile.stats["abilitiesActivatedByName"]).filter(key => key in constants.abilities).length} Unique Abilities Used`;
    progressSubText["Knowledge"] = `${Object.keys(btd6usersave.acquiredKnowledge).filter(k => btd6usersave.acquiredKnowledge[k]).length}/${Object.keys(btd6usersave.acquiredKnowledge).length} Knowledge Points Unlocked`;
    let mapsPlayed = Object.keys(btd6usersave.mapProgress).filter(k => btd6usersave.mapProgress[k]).length
    progressSubText["MapProgress"] = `${mapsPlayed} Map${mapsPlayed != 1 ? "s" : ""} Played`;
    let chimpsTotal = Object.values(processedMapData.Medals.single).map(map => map["Clicks"]).filter(medal => medal).length;
    let chimpsTotalCoop = Object.values(processedMapData.Medals.coop).map(map => map["Clicks"]).filter(medal => medal).length;
    if (chimpsTotal + chimpsTotalCoop > 0) { progressSubText["CHIMPS"] = `${chimpsTotal + chimpsTotalCoop} CHIMPS Medal${chimpsTotal + chimpsTotalCoop != 1 ? "s" : ""} Earned` }
    let powersTotal = Object.values(btd6usersave.powers).map(power => (typeof power === 'object' && power.quantity) ? power.quantity : 0).reduce((acc, amount) => acc + amount) + btd6publicprofile.gameplay.powersUsed;
    progressSubText["Powers"] = `${powersTotal} Power${powersTotal != 1 ? "s" : ""} Collected`
    let instaTotal = Object.values(processedInstaData.TowerTotal).reduce((acc, amount) => acc + amount) + btd6publicprofile.gameplay.instaMonkeysUsed;
    progressSubText["InstaMonkeys"] = `${instaTotal} Insta${instaTotal != 1 ? "s" : ""} Collected`;
    progressSubText["Achievements"] = `${btd6usersave.achievementsClaimed.length}/${constants.achievements + constants.hiddenAchievements} Achievement${btd6publicprofile.achievements != 1 ? "s" : ""} Earned`;
    let extrasTotal = Object.keys(extrasUnlocked).length;
    progressSubText["TrophyStore"] = `${Object.keys(trophyStoreItemsJSON).filter(k => getTrophyItemObtained(k)).length} Trophy Store Items Collected`
    progressSubText["TeamsStore"] = `${Object.keys(btd6usersave.trophyStoreItems).filter(k => btd6usersave.trophyStoreItems[k] && teamsStoreItemsJSON[k]).length} Team Store Items Unlocked`
    progressSubText["Quests"] = `${btd6usersave.quests.filter(q => q.complete).length} Quests Complete`;
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

        mapData["highestRound"] = Math.max(...Object.values(mapData["single"]).map(diffData => diffData ? diffData["bestRound"] : 0), ...Object.values(mapData["coop"]).map(diffData => diffData ? diffData["bestRound"] : 0));
        mapData["totalWins"] = Object.values(mapData["single"]).map(diffData => diffData ? diffData["timesCompleted"] : 0).reduce((acc, amount) => acc + amount) + Object.values(mapData["coop"]).map(diffData => diffData ? diffData["timesCompleted"] : 0).reduce((acc, amount) => acc + amount);

        //this is necessary because sometimes maps will randomly show up as incomplete despite having parameters such as a completed best round number or "completedWithoutLoadSave" is true.
        //this is a workaround to ensure that the map is marked as completed if it meets the requirements for a bronze/silver/gold/black border
        for (let [difficulty, diffData] of Object.entries(mapData["single"])) {
            if (diffData && diffData["completed"] === false && (diffData["bestRound"] >= constants.endRound[difficulty] || diffData.completedWithoutLoadingSave) ) {
                diffData["completed"] = true;
            }
        }

        //the opposite is also true, sometimes "completed" will be true even when the highest round is not of the required amount for it to even be considered completed
        for (let [difficulty, diffData] of Object.entries(mapData["single"])) {
            if (diffData && diffData["completed"] === true && (diffData["bestRound"] < constants.endRound[difficulty]) && diffData.timesCompleted == 0) {
                diffData["completed"] = false;
            }
        }

        for (let [difficulty, diffData] of Object.entries(mapData["coop"])) {
            if (diffData && diffData["completed"] === false && (diffData["bestRound"] >= constants.endRound[difficulty] || diffData.completedWithoutLoadingSave) ) {
                diffData["completed"] = true;
            }
        }

        for (let [difficulty, diffData] of Object.entries(mapData["coop"])) {
            if (diffData && diffData["completed"] === true && (diffData["bestRound"] < constants.endRound[difficulty]) && diffData.timesCompleted  == 0) {
                diffData["completed"] = false;
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

        processedMapData.Medals.single[map]["CHIMPS-BLACK"] = mapData["single"]["Clicks"] && mapData["single"]["Clicks"].completed ? mapData["single"]["Clicks"].completedWithoutLoadingSave : false;
        processedMapData.Medals.coop[map]["CHIMPS-BLACK"] = mapData["coop"]["Clicks"] && mapData["coop"]["Clicks"].completed ? mapData["coop"]["Clicks"].completedWithoutLoadingSave : false;

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
    let towerObtained = {};
    let towerTotalUsableByTier = {};
    for (let [tower, data] of Object.entries(btd6usersave.instaTowers)){
        towerObtained[tower] = [],
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
        towerTotalUsableByTier[tower] = {...towerTiersTemplate};
        for (let [tier, count] of Object.entries(data)){
            towerTotal[tower] += count;
            if (constants.instaTiers["5"].includes(tier)) {
                towerTierTotals[tower]["5"] += 1;
                towerTotalUsableByTier[tower]["5"] += count;
            }
            if (constants.instaTiers["4"].includes(tier)) {
                towerTierTotals[tower]["4"] += 1;
                towerTotalUsableByTier[tower]["4"] += count;
            }
            if (constants.instaTiers["3"].includes(tier)) {
                towerTierTotals[tower]["3"] += 1;
                towerTotalUsableByTier[tower]["3"] += count;
            }
            if (constants.instaTiers["2"].includes(tier)) {
                towerTierTotals[tower]["2"] += 1;
                towerTotalUsableByTier[tower]["2"] += count;
            }
            if (constants.instaTiers["1"].includes(tier)) {
                towerTierTotals[tower]["1"] += 1;
                towerTotalUsableByTier[tower]["1"] += count;
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
    processedInstaData["TowerObtained"] = towerObtained;
    processedInstaData["TowerUsableByTier"] = towerTotalUsableByTier;
}

function calculateInstaBorder(tower) {
    if (processedInstaData.TowerTierTotals[tower]["4"] == constants.instaTiers["4"].length && processedInstaData.TowerTierTotals[tower]["3"] == constants.instaTiers["3"].length && processedInstaData.TowerTierTotals[tower]["2"] == constants.instaTiers["2"].length && processedInstaData.TowerTierTotals[tower]["1"] == constants.instaTiers["1"].length){
        if (processedInstaData.TowerTierTotals[tower]["5"] == constants.instaTiers["5"].length) {
            processedInstaData.TowerBorders[tower] = "Black";
        } else {
            processedInstaData.TowerBorders[tower] = "Gold";
        }
    } else {
        processedInstaData.TowerBorders[tower] = "";
    }
}

const header = document.querySelector('.header');
const headerDiv = document.querySelector('.header-div');
const title = document.querySelector('.title');
const content = document.querySelector('.content');

readLocalStorage()
function generateFrontPage(){
    const frontPage = document.getElementById('home-content');

    frontPage.appendChild(createEl('p', { classList: ['disclaimer-text', 'font-gardenia'], style: {
        fontSize: "18px",
        textAlign: "center",
        lineHeight: "1.5",
    }, innerHTML: 'A fanmade viewer for the Ninja Kiwi <a href="https://data.ninjakiwi.com/" target="_blank" style="color: white;">Open Data API</a> plus other features.<br>This site is not affiliated with Ninja Kiwi. All game assets belong to Ninja Kiwi.' }));
    // frontPage.appendChild(createEl('p', { classList: ['front-page-text', 'font-gardenia', 'ta-center'], innerHTML: 'Access your profile using an OAK token for the best experience!' }));
    // frontPage.appendChild(generateLoginDiv());

    frontPage.appendChild(createEl('p', { classList: ['site-info-header', 'black-outline'], innerHTML: 'Site Features and Information' }));

    let siteImageScroll = createEl('div', { classList: ['d-flex', 'jc-between'], style: {width: "700px", height: "400px", paddingTop: "20px"}});
    frontPage.appendChild(siteImageScroll);

    let siteImageScrollLeft = createEl('div', { classList: ['d-flex', 'fd-column'], style: {width: "300px", background: "rgba(0,0,0,0.36)", padding: "10px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", gap: "1rem"}});
    siteImageScroll.appendChild(siteImageScrollLeft);

    let siteImageScrollTitle = createEl('p', { classList: ['font-luckiest', 'black-outline'], style: {fontSize: "28px", textAlign: "center"}, innerHTML: 'BTD6 API Explorer' });
    siteImageScrollLeft.appendChild(siteImageScrollTitle);

    let siteImageScrollOverlayText = createEl('p', { classList: ['font-gardenia'], style: {fontSize: "20px", lineHeight: "1.5"}, innerHTML: 'Click on the images to access the sites!' });
    siteImageScrollLeft.appendChild(siteImageScrollOverlayText);

    let siteImageScrollImage = createEl('img', { classList: ['site-image-scroll'], style: { borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", transition: "background-image 0.5s ease-in-out", width: "400px"}});
    siteImageScroll.appendChild(siteImageScrollImage);

    let sitePageDots = createEl('div', { classList: ['d-flex', 'jc-center'], style: {paddingTop: "20px"}});
    frontPage.appendChild(sitePageDots);

    function updateSiteImageScroll(index) {
        let data = imageScroll[index]

        siteImageScrollImage.src = `Assets/UI/${data.image}.png`;
        siteImageScrollTitle.innerHTML = data.title;
        siteImageScrollOverlayText.innerHTML = data.text;

        sitePageDots.innerHTML = '';
        for (let i = 0; i <= imageScroll.length - 1; i++) {
            let sitePageDot = document.createElement('div');
            sitePageDot.classList.add('map-page-dot');
            if (index == i) { sitePageDot.classList.add('map-page-dot-active'); }
            sitePageDots.appendChild(sitePageDot);

            sitePageDot.addEventListener('click', () => {
                imageScrollIndex = i;
                updateSiteImageScroll(i);
            })
        }
    } 
    updateSiteImageScroll(0);
    siteImageScroll.addEventListener('click', () => {
        imageScrollIndex = (imageScrollIndex + 1) % imageScroll.length;
        updateSiteImageScroll(imageScrollIndex);
    });

    // let OtherInfoHeader = document.createElement('p');
    // OtherInfoHeader.classList.add('site-info-header','black-outline');
    // OtherInfoHeader.innerHTML = 'Site Information';
    // frontPage.appendChild(OtherInfoHeader);

    let infoButtons = document.createElement('div');
    infoButtons.classList.add('d-flex', 'jc-evenly', 'w-100');
    infoButtons.style.margin = "10px"
    frontPage.appendChild(infoButtons);

    let faqButton = document.createElement('p');
    faqButton.classList.add('where-button','black-outline')
    faqButton.innerHTML = 'FAQ';

    let knownIssuesButton = document.createElement('p');
    knownIssuesButton.classList.add('where-button','black-outline');
    knownIssuesButton.innerHTML = 'Known Issues';

    let changelogButton = document.createElement('p');
    changelogButton.classList.add('where-button','black-outline');
    changelogButton.innerHTML = 'Changelog';
    infoButtons.appendChild(changelogButton);
    infoButtons.appendChild(faqButton);
    infoButtons.appendChild(knownIssuesButton);

    let FAQDiv = document.createElement('div');
    FAQDiv.id = 'faq-div';
    FAQDiv.classList.add('faq-div');
    FAQDiv.style.display = 'none';
    frontPage.appendChild(FAQDiv);

    let knownIssuesDiv = document.createElement('div');
    knownIssuesDiv.id = 'known-issues-div';
    knownIssuesDiv.classList.add('known-issues-div');
    knownIssuesDiv.style.display = 'none';
    frontPage.appendChild(knownIssuesDiv);

    let changelogDiv = document.createElement('div');
    changelogDiv.id = 'changelog-div';
    changelogDiv.classList.add('changelog-div');
    changelogDiv.style.display = 'none';
    frontPage.appendChild(changelogDiv);

    let StandaloneSiteText = document.createElement('p');
    StandaloneSiteText.classList.add('site-info-header', 'sites-text', 'black-outline');
    StandaloneSiteText.innerHTML = 'Standalone Sites';
    frontPage.appendChild(StandaloneSiteText);

    let sitesText = document.createElement('p');
    sitesText.classList.add('where-text');
    sitesText.innerHTML = 'Separate pages with just one module of this site:';
    frontPage.appendChild(sitesText);

    let StandaloneSiteDiv = document.createElement('div');
    StandaloneSiteDiv.classList.add('site-access-div');
    frontPage.appendChild(StandaloneSiteDiv);

    let siteButtons = document.createElement('div');
    siteButtons.classList.add('standalone-site-buttons');
    StandaloneSiteDiv.appendChild(siteButtons);

    let standaloneSites = {
        "CT Map": {
            "link": "https://btd6apiexplorer.github.io/ct",
            "text": "Current CT Map",
            "icon": "CTSiteBtn",
            "background": "CTMapBG"
        },
        "Leaderboards": {
            "link": "https://btd6apiexplorer.github.io/leaderboards",
            "text": "Leaderboards",
            "icon": "LeaderboardSiteBtn",
            "background": "TrophyStoreTiledBG"
        },
        "Roundsets": {
            "link": "https://btd6apiexplorer.github.io/rounds",
            "text": "Roundsets",
            "icon": "DefaultRoundSetIcon",
            "background": "BloonsBG"
        },
        "Rogue Artifacts": {
            "link": "https://btd6apiexplorer.github.io/rogue",
            "text": "Rogue Artifacts",
            "icon": "RogueSiteBtn",
            "background": "RogueBG"
        },
        "Insta Tracker": {
            "link": "https://btd6apiexplorer.github.io/insta",
            "text": "Insta Tracker",
            "icon": "InstaSiteBtn",
            "background": "CollectionHelp2"
        }
    }

    Object.entries(standaloneSites).forEach(([site, data]) => {
        let siteButtonDiv = document.createElement('div');
        siteButtonDiv.classList.add('site-button-div', 'pointer');
        siteButtonDiv.style.backgroundImage = `url(Assets/UI/${data.background}.png)`;
        siteButtons.appendChild(siteButtonDiv);
        siteButtonDiv.addEventListener('click', () => {
            window.location.href = data.link;
        })
    
        let siteButtonIcon = document.createElement('img');
        siteButtonIcon.classList.add('site-button-icon');
        siteButtonIcon.src = `./Assets/UI/${data.icon}.png`;
        siteButtonDiv.appendChild(siteButtonIcon);
    
        let profileName = document.createElement('p');
        profileName.classList.add('profile-name','readability-bg','black-outline');
        profileName.style.marginLeft = '0';
        profileName.innerHTML = data.text;
        siteButtonDiv.appendChild(profileName);
    })

    let versionDiv = document.createElement('div');
    versionDiv.id = 'version-div';
    versionDiv.classList.add('version-div');
    frontPage.appendChild(versionDiv);

    faqButton.id = 'faq-button';
    faqButton.addEventListener('click', () => {
        hideAllButOne('faq')
    })

    knownIssuesButton.id = 'known-issues-button';
    knownIssuesButton.addEventListener('click', () => {
        hideAllButOne('known-issues')
    })

    changelogButton.id = 'changelog-button';
    changelogButton.addEventListener('click', () => {
        hideAllButOne('changelog')
    })

    let faqHeader = document.createElement('p');
    faqHeader.classList.add('oak-instructions-header','black-outline');
    faqHeader.innerHTML = 'Frequently Asked Questions';
    FAQDiv.appendChild(faqHeader);

    let FAQ = {
        "How long does the API take to update after I do something in the game?": "15 minutes is the most I've seen. Be sure to press the save button in settings if you want to minimize the time it takes to update! It should not take more than 24 hours to update in any circumstance (browser caching, etc).",
        "Why is logging in not available for BTD6+ and Netflix?": "This is because the data is stored differently for these versions such as using iCloud for BTD6+. This is not compatible with the Open Data API.",
        "How do I leave feedback?": 'If you have any feedback including features to add or change on the site or bug reports, please join the project\'s <a href="https://discord.gg/wep2RDmcqZ" target="_blank" style="color: white;">Discord Server</a>. Alternatively, you can create an issue on <a href="https://github.com/HalfHydra/BTD6-API-Explorer/issues" target="_blank" style="color: white;">GitHub</a'
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

    let knownIsseusHeader = document.createElement('p');
    knownIsseusHeader.classList.add('oak-instructions-header','black-outline');
    knownIsseusHeader.innerHTML = 'Known Issues';
    knownIssuesDiv.appendChild(knownIsseusHeader);

    let knownIssuesText = document.createElement('p');
    knownIssuesText.classList.add('oak-instructions-text');
    knownIssuesText.innerHTML = `None Currently!`;
    knownIssuesDiv.appendChild(knownIssuesText);
    
    let changelogHeader = document.createElement('p');
    changelogHeader.classList.add('oak-instructions-header','black-outline');
    changelogHeader.innerHTML = 'Changelog';
    changelogDiv.appendChild(changelogHeader);

    let changelogText = document.createElement('p');
    changelogText.classList.add('oak-instructions-text');
    changelogText.innerHTML = `v2.4.0 (12/10/25): Update 52 and Contested Territory Map!<br>- New Contested Territory Map and Event Details revamp! Big thanks to a certain dataminer for hosting the generated CT tile data as that is not available on the Open Data API currently.<br>- Added a <a href="./ct" target="_blank" style="color: white;">standalone CT site</a> that will host only the current events information<br>Collection Events will now automatically be added<br>- Collection events now display when the event ends at the bottom of the schedule<br>- Any time a new update happens, there will now be text hinting that the update is not available on the API yet.<br>- Fixed Fortified DDTs not showing up on "Lead and DDT" preset filter<br>- Events with multiple custom roundsets will now show correctly<br>- Filtering now works on the standalone rounds site<br>- Roundsets will now show the currently listed rounds at the top<br>- Added a link to the Discord server in the extras tab.<br><br>
    v2.3.1 (10/26/25): Minor fixes<br>- Updated trophy store items to use newer structure on the Open Data API, which should prevent this from being as inaccurate as before - still testing though.<br>- Games played text now shows up with the correct value<br>- SheRa Adora skin will now show up correctly.<br>- Other minor UI tweaks<br><br>
    v2.3.0 (10/16/25): Update 51 and Minor Updates<br>- Added Update 51 content including new Rogue changes <br>- You can now navigate to the more detailed menus from Quick Stats<br>- Towers menu now shows related Monkey Knowledge points (rework coming eventually)<br>- Added total of each tier to the game-like view of Insta Monkeys collection when "Missing" is toggled.<br>- Unavailable Relics will now displayed on the CT Relics page in prepration for a CT rework<br>- Duplicate (IAP/Special) Rogue starter kits will now show at the bottom<br>- The leaderboard refresh button will now only appear for currently active events<br>- Fixed a bug causing the Clear Filters button to break some roundsets functionality.<br>- Top Paragons will no longer show if there aren't any<br>- Events will now refetch their information from the API after 10 minutes.<br>- The scrollbar is no longer accidentally unstyled. Whoops<br>- Fixed numerous bugs with the back button not clearing when going back<br><br>
    v2.2.0 (9/29/25): Leaderboard Revamp + Rogue Improvements<br>- Leaderboards have been revamped with better loading times.<br>- Clicking a team on the Contested Territory leaderboard will now show their group of competing teams and their scores.<br>- Leaderboards will now refresh the next time you access them if it's been a while and you don't refresh the page.<br>- A manual refresh button has been added to the top of individual leaderboards.<br>- Leaderboards now show text indicating if it is loading new entries and if it has reached the end.<br>- Fixed a bug causing the timers on events to freeze after going back and forward to various menus.<br>- Rogue Artifacts now has a clear filter button.<br>- Rogue Artifacts count should now correctly display if the collection mode is turned off.<br>- Rogue Legends artifact popout updated to include the update that the artifact was added in as well as display an insta monkey that is added if it has one.<br>- Rogue legends starter kits now also show the insta monkey that is added via a starter artifact.<br>- Fixed numerous UI bugs including a missing Fortified DDT Icon, the rogue legends artifact sorting preview not working anymore.<br><br>
    v2.1.0 (9/23/25): Roundsets Revamp + Quests!<br>- The roundset viewer now has options for filtering. This includes a round range (good for Rogue Legends), starting cash, as well as filtering by bloons. There are 6 basic filters and then a toggle for an advanced mode that allows you to filter down to specific bloons.<br>- Bloon Group timings in the detailed view of rounds now has a tooltip that will show the exact timings on hover.<br>- Clicking the round number in simple or detailed will now take you to the previewer for that round.<br>- The roundset previewer has been fixed, and the UI has been rearranged. No more lag issues causing inaccurate previews, it should always be accurate now no matter the capabilities of your device.<br>- You can now turn off round hints.<br>- A helpful message describing the boss roundset changes has been added for each boss.<br>- Quests have been added under the Profile tab. You can also view the custom roundset (if it has one) from there.<br>- Fixed boss details showing the incorrect scoring type.<br>- Fixed some UI issues in Collection Event menus.<br>- You can now reveal hidden achievement descriptions. This will be complimented later with a guide for a select few taht are tougher or less straight forward in the future.<br>- Fixed the download for Rogue artifacts on Firefox.<br>- Fixed a bug that enabled XSS with named monkeys.<br>- New heroes should no longer break the site before I add them. Oops.<br>- 2 variant artifacts filtering has been fixed to include all of them.<br>- Rogue Artifact popout should no longer make you jump to the top of the scrollbar.<br>- Fixed a bug involving reverse mode in the detailed section of roundsets.<br>- Fixed a bug where the list view on map stats would not show any maps after update 45. Whoops, thank you @200e200w for reporting this on the Discord Server.<br><br>
    v2.0.0 (7/5/25): Major Update and Update 49!<br>- The site has been completely reworked and redesigned, allowing for less focus on logging in.<br>- A global back button has been implemented at the top left that will always immediately take you back to wherever you just were.<br>- A way of viewing and filtering the current schedule for collection event featured instas has been added.<br>- Top 1% Boss medal was renamed to Top 100.<br>- Roundsets simple view now shows the time per round on the right.<br>- The full time information for events can now be found via a tooltip on the events list.<br>- Rogue Artifacts search now correctly changes the total count for searching.<br>- Special Rogue Roundsets now show their tooltip of what you would see in game for the associated roundset.<br>- Fixed Hero Skin count. NK wasn't the only one who somehow had issues with that...<br>- Fixed ordering for artifacts using internal name instead of alphabetical name.<br>- You can now logout of your profile and use another OAK token without refreshing the page.<br>- Profiles from leaderboards should no longer be missing many medals.<br>- Standalone pages now only load what's essential for them.<br>- The new achievement was added. <br>- Leaderboards have been fixed.<br><br>
    v1.9.1 (5/16/25): Many Bug Fixes<br>- Fixed Voidora's hero starter kit being incorrect<br>- Fixed CT Local Medals not appearing and Global medals being incorrectly labeled<br>- Fixed the normal Rogue Legends roundset not being updated with the Update 48 changes<br>- Fixed a bug causing modded paragons to show up and error out<br><br>
    v.1.9.0 (4/3/25): Update 48 Content, Abilites Used Section, Top Paragons<br>- Added all content from Update 48 (there was a lot)<br>- You are now able to view how many times you've used each ability. You can find this under Progress -> Unqiue Abilities Used<br>- Top Paragons will now appear under Top Towers and Top Heroes on the overview<br>- Rogue Legends received an update with 6 new roundset variations, those have been added as a top bar with an icon of what bloons on the tile the roundset correlates to.<br>- Rogue Legends Artifacts has been updated to include all the artifacts added, as well as be able to sort for only Update 48 artifacts.<br><br>
    v1.8.1 (3/23/25): Rogue Artifacts Updates<br>- Filter & Sort has been reworked into a new settings menu that adds lots of new filtering options<br>- A search bar has been added to find artifacts quickly<br>- The total count of artifacts should now always be accurate<br>- The back button now correctly returns you to where you were prior<br><br>
    v1.8.0 (3/8/25): Rogue Legends Artifacts<br>- Added Rogue Legends Artifacts standalone site. Allows you to track and share your artifacts collection with others, as well as reference Hero Starter Kits for each artifact<br>- Unfortunately the Open Data API does not have the extracted artifacts available for your profile, so all entry will be manual<br>- Updated the standalone site buttons to be simpler<br><br>
    v.1.7.1 (2/17/25): Inevitable bug fixes<br>- Rogue Legends Stats will no longer show up if you don't own it<br>- Tooltips now render HTML entities, have larger text, and have the arrow centered<br>- Added missing tooltips from leaderboards site<br><br>
    v.1.7.0 (2/16/25): Update 47 and Tooltips!<br>- Added Update 47.1 content including the new Rogue Legends roundset<br>- Added proper tooltips to medals and a few other places like the Towers section.<br>- Added Rogue Legends stats to the overview page<br>- Added Round Hints to the roundset viewer<br>- Added Overall Highest Round and Total Games Won on the map specific details menu<br>- Added missing Adora + Battle Cat Roundsets, and a few older Odysseys courtesy of @jessiepatch<br>- The standalone site buttons got a glow up.<br>- The roundset selection screen has been condensed and cleaned up.<br>- Fixed a bug involving leaderboard requests that result in incorrect placements and duplicated entries<br>- Leaderboard entries should only have the profiles loaded if they are currently rendered on screen.<br><br>
    v1.6.1 (1/16/25): Inevitable Leaderboard Fixes<br>- The site no longer infinite loads when there are no active events<br>- The site no longer has any leaderboards with 0 scores shown (some older events get their leaderboards wiped early)<br>- Events that aren't started won't show up until they are active<br>- The initial load was improved, and the loading icon now shows correctly when clicking a leaderboard for the first time<br><br>
    v1.6.0 (1/12/25): Leaderboards improvements and page!<br>- There is now a <a href="./leaderboards" target="_blank" style="color: white;">Leaderboards Page</a> made specifically for viewing them all in one place.<br>- Loading profiles automatically has been turned back on because...<br>- Improved the handling of automatically loading leaderboard profiles to not be rate limited as quickly. This system should hopefully prevent any rate limiting at all.<br><br>
    v1.5.1 (12/19/24): Bug fixes! <br>- Zero limited or excluded towers/heroes like the upcoming Bloonarius 56 will no longer show an empty box<br>- The timer no longer jumps to the first event of the list assuming there is only one active at a time.<br><br>
    v1.5.0 (12/15/24): Trophy Store Items and Update 46!<br>- Added Update 46 content<br>- Added the Trophy Store Items menu for those who want to see all that exist and your collection.<br>- Team Store items have also been added, but since I am unable to test how that works, it is hidden in settings by default.<br>- Settings should now save when reloading the page using the same system that saves the OAK tokens you've used.<br>- Fixed a bug that prevented newer maps from showing up<br>- Added missing badges<br><br>
    v1.4.0 (12/7/24): Extras and Events in Roundsets<br>- User profiles on the leaderboards and content browser no longer load by default. This caused too many rate limiting issues.<br>- Added a setting in Settings to toggle automatic profile loading back on if you wanted to see the profile avatar and banner of users on the leaderboard.<br>- Added known previous events with custom roundsets to the Roundsets section.<br>- Fixed a bug involving timers going weirdly negative<br>- Added Creator Support instructions<br><br>
    v1.3.0 (11/31/24): QoL Changes<br>- Added Update 45 images and content<br>- You can now toggle to see just the excluded towers and heroes of a challenge or event<br>- You can now swap between Normal/Elite on the details for a boss<br>- Bloon groups can now be hidden in the round previewer by clicking on them<br>- Added a checkmark in the Collection Event list to categories that were completely collected<br>- Updated Endurance Rounds to use updated round thresholds<br>- Resolved an issue when applying a filter to content browser content and not refreshing<br>- Added Ceramic Flood Roundset (very late)<br><br>
    v1.2.3 (9/3/24): Collection Event Menu Upgrade<br>- Added a how to use guide at the top of the Collection Event Menu<br>- Added the Insta Chest odds to the Collection Event Menu<br>- Clicking on a missing Insta will now temporarily mark it as obtained<br><br>
    v1.2.2 (8/29/24): Missing Medals<br>- Added a few missing medals from the overview/leaderboard profile pages<br>- Added mouse hover tooltips to various elements<br><br>
    v1.2.1 (8/22/24): Insta Monkey Collection Improvements<br>- Resolved an issue preventing the collected but used Insta Monkeys from being displayed.<br>- Add a new list of all the Insta Monkey tower chances in the Collection Event Helper for efficient checking of what the best Featured Insta Monkey to choose is.<br>- The trailer video no longer plays in the background after previewing the site or logging in! Thanks for the feedback.<br><br>
    v1.2.0 (8/5/24): Preview Mode and UI Improvements <br>- Added a way to use the site without an OAK token. Useful when you don\'t have it accessible or can\'t make one<br>- The site now prompts when your data has new content that the site doesn\'t have updated yet<br>- Challenge details now correctly shows the max amount of specific monkeys if limited<br>- Other UI fixes<br><br>
    v1.1.0 (7/16/24): Insta Monkey Collection Features<br>- Added Insta Monkey Collection Event Helper. This displays the odds of getting a new Insta Monkey for each chest type and when selecting a featured tower.<br>- Also added a page documentating all of the continuous sources of Insta Monkeys<br>- UI fixes and improvements<br><br>
    v1.0.1 (7/13/24): Bug Fixes<br>- Daily challenges now show the correct associated date<br>- Rework roundset processing to fix numerous bugs<br>- Add extra one-off roundsets to the list for completion sake<br>- Other minor UI fixes<br><br>
    v1.0.0 (7/7/24): Initial Release <br>- The Odyssey tab is still being worked on and will be added in the near future.<br>- An Insta Monkeys Rotation helper will also be added soon.`;
    changelogDiv.appendChild(changelogText);

    // let feedbackHeader = document.createElement('p');
    // feedbackHeader.classList.add('oak-instructions-header','black-outline');
    // feedbackHeader.innerHTML = 'Send Feedback';
    // frontPage.appendChild(feedbackHeader);

    // let feedbackText = document.createElement('p');
    // feedbackText.classList.add('tool-version-text');
    // feedbackText.innerHTML = 'If you have any feedback, things to add or change on the site, or most importantly bug reports, please fill out this anonymous form: <a href="https://forms.gle/Tg1PuRNj2ftojMde6" target="_blank" style="color: white;">Feedback Form</a>';
    // frontPage.appendChild(feedbackText);

    function hideAllButOne(selectedTab){
        const tabs = ['faq', 'known-issues', 'changelog'];
        
        tabs.forEach((tabName) => {
            const contentDiv = document.getElementById(tabName + '-div');
            const tabButton = document.getElementById(tabName + '-button');
            
            if (tabName === selectedTab) {
                const isCurrentlyHidden = contentDiv.style.display === 'none';
                if (isCurrentlyHidden) {
                    tabButton.classList.add('square-btn-yellow');
                    contentDiv.style.display = 'block';
                } else {
                    tabButton.classList.remove('square-btn-yellow');
                    contentDiv.style.display = 'none';
                }
            } else {
                tabButton.classList.remove('square-btn-yellow');
                contentDiv.style.display = 'none';
            }
        });
    }
}

function generateVersionInfo(){
    let versionDiv = document.getElementById('version-div');

    let toolVersionText = document.createElement('p');
    toolVersionText.classList.add('tool-version-text');
    toolVersionText.innerHTML = `App Version: ${constants.version} / Game Content Version: v${constants.projectContentVersion}`;
    versionDiv?.appendChild(toolVersionText);
}

let headerTabs = ['home', 'profile', 'events', 'leaderboards', 'rounds', 'extras'];
function generateHeaderTabs(){
    const headerContainer = document.querySelector('.header-container');

    headerTabs.forEach((headerName) => {
        headerName = headerName.toLowerCase();
        let headerElement = document.createElement('p');
        headerElement.classList.add('header-label','black-outline');
        headerElement.id = headerName.toLowerCase();
        headerElement.innerHTML = headerName;
        headerElement.addEventListener('click', () => {
            changeTab(headerName.toLowerCase());
        })
        headerContainer.appendChild(headerElement);
    })
}

function changeTitle(newTitle) {
    document.querySelector('.title').innerHTML = newTitle;
}

function changeTab(tab) {
    clearBackQueue();
    resetScroll();
    if(timerInterval) { clearInterval(timerInterval); }
    changeHexBGColor(constants.BGColor)

    for (let tabDiv of document.querySelector('.content').children) {
        tabDiv.id === (tab + "-content") ? tabDiv.style.display = "flex" : tabDiv.style.display = 'none';
    }
    for(let tab of headerTabs){
        if(document.getElementById(tab)){
            document.getElementById(tab).classList.remove('selected');
        }
    }
    if(document.getElementById(tab)){
        document.getElementById(tab).classList.add('selected');
    }
    for (let subtab of document.getElementsByClassName('sub-content-div')){
        subtab.style.display = 'none';
    }
    changeTitle("Bloons TD 6 API Explorer")
    switch(tab){
        case 'overview':
            generateOverview();
            break;
        case 'profile':
            generateProgress();
            break;
        case 'events':
            generateEvents();
            break;
        case "explore":
            generateExplore();
            break;
        case "leaderboards":
            // changeTitle("Bloons TD 6 Leaderboards")
            generateLeaderboards();
            break;
        case "rounds":
            changeTitle("Bloons TD 6 Roundsets")
            generateRoundsets();
            break;
        case 'extras':
            generateExtrasPage();
            break;
    }
}

let tempXP = 0;

function generateOverview(){
    let overviewContent = document.getElementById('profile-content');
    overviewContent.innerHTML = '';

    addToBackQueue({source: 'profile', destination: 'profile', callback: generateProgress});
    
    if(loggedIn){
    let profileContainer = document.createElement('div');
    profileContainer.classList.add('profile-container', 'bg-color-primary', 'w-100', 'content-div', 'overview');
    overviewContent.appendChild(profileContainer);

    let profileHeader = document.createElement('div');
    profileHeader.classList.add('profile-header');
    profileHeader.classList.add('profile-banner');
    profileHeader.style.backgroundImage = `linear-gradient(to bottom, transparent 50%, var(--profile-primary) 70%),url('${getProfileBanner(btd6publicprofile)}')`;
    profileContainer.appendChild(profileHeader);
    profileHeader.appendChild(generateAvatar(100, getProfileAvatar(btd6publicprofile)));

    let profileTopBottom = document.createElement('div');
    profileTopBottom.classList.add('profile-top-bottom');
    profileHeader.appendChild(profileTopBottom);

    let profileTop = document.createElement('div');
    profileTop.classList.add('profile-top');
    profileTopBottom.appendChild(profileTop);

    let profileName = document.createElement('p');
    profileName.classList.add('profile-name','black-outline');
    profileName.innerHTML = btd6publicprofile["displayName"];
    profileTop.appendChild(profileName);

    if (btd6publicprofile["followers"] > 0 ) {
        let profileFollowers = document.createElement('div')
        profileFollowers.classList.add('profile-followers');
        profileTop.appendChild(profileFollowers);

        let followersLabel = document.createElement('p');
        followersLabel.classList.add('followers-label','black-outline');
        followersLabel.innerHTML = 'Followers';
        profileFollowers.appendChild(followersLabel);

        let followersCount = document.createElement('p');
        followersCount.classList.add('followers-count');
        followersCount.innerHTML = btd6publicprofile["followers"].toLocaleString();
        profileFollowers.appendChild(followersCount);
    }

    let profileBottom = document.createElement('div');
    profileBottom.classList.add('profile-bottom');
    profileTopBottom.appendChild(profileBottom);

    profileBottom.appendChild(generateRank());
    if(btd6usersave["veteranXp"] > 0){
        profileBottom.appendChild(generateRank(true));
    }

    let belowProfileHeader = document.createElement('div');
    belowProfileHeader.classList.add('below-profile-header');
    profileContainer.appendChild(belowProfileHeader);

    let leftColumnDiv = document.createElement('div');
    leftColumnDiv.classList.add('left-column-div');
    belowProfileHeader.appendChild(leftColumnDiv);

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
        "Knowledge": "../Assets/UI/KnowledgeIcon.png",
        "TrophyStore": "../Assets/UI/LimitedRunIcon.png",
        'TeamsStore': "../Assets/UI/TeamTrophyIconSmall.png",
        "ActivatedAbilities": "../Assets/UI/RapidShotIcon.png",
        "Quests": "../Assets/UI/QuestIcon.png",
    }

    Object.entries(progressSubText).forEach(([stat,text]) => {
        if(text.includes("0 Extras") || text.includes("Team Store")) { return }
        if(text.match(/(^|[^0-9])0\/\d{1,2}(?!\d)/)) { return }
        let quickStat = document.createElement('div');
        quickStat.classList.add('quick-stat', 'pointer');
        quickStatsContent.appendChild(quickStat);

        let statIcon = document.createElement('img');
        statIcon.classList.add('quick-stat-icon');
        statIcon.src = statIcons[stat];
        quickStat.appendChild(statIcon);

        let statName = document.createElement('p');
        statName.classList.add('quick-stat-name');
        statName.innerHTML = text;
        quickStat.appendChild(statName);

        quickStat.addEventListener('click', () => {
            addToBackQueue({source: 'profile', destination: 'profile', callback: generateOverview});
            switch(stat){
                case 'Towers':
                case "Upgrades":
                case "Paragons":
                    generateTowerProgress();
                    break;
                case 'Heroes':
                case "Skins":
                    generateHeroesProgress();
                    break;
                case "ActivatedAbilities":
                    generateAbilities();
                    break;
                case "Knowledge":
                    generateKnowledgeProgress();
                    break;
                case "MapProgress":
                case "CHIMPS":
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
                case "TrophyStore":
                    generateTrophyStoreProgress();
                    break;
                case "TeamsStore":
                    generateTeamsStoreProgress();
                    break;
                case "Logout":
                    logoutProgress();
                    break;
                case 'Quests':
                    generateQuestsPage();
                    break;
            }
        });
    })

    let currencyAndMedalsDiv = document.createElement('div');
    currencyAndMedalsDiv.classList.add('currency-medals-div');
    leftColumnDiv.appendChild(currencyAndMedalsDiv);

    let leftColumnHeader = document.createElement('div');
    leftColumnHeader.classList.add('left-column-header');
    currencyAndMedalsDiv.appendChild(leftColumnHeader);

    let leftColumnHeaderText = document.createElement('p');
    leftColumnHeaderText.classList.add('column-header-text','black-outline');
    leftColumnHeaderText.innerHTML = 'Currency and Medals';
    leftColumnHeader.appendChild(leftColumnHeaderText);

    let currencyDiv = document.createElement('div');
    currencyDiv.classList.add('currency-div');
    currencyAndMedalsDiv.appendChild(currencyDiv);

    let currencyMMDiv = document.createElement('div');
    currencyMMDiv.classList.add('currency-mm-div');
    currencyDiv.appendChild(currencyMMDiv);

    let currencyMMImg = document.createElement('img');
    currencyMMImg.classList.add('currency-mm-img');
    currencyMMImg.src = '../Assets/UI/BloonjaminsIcon.png';
    currencyMMDiv.appendChild(currencyMMImg);

    let currencyMMText = document.createElement('p');
    currencyMMText.classList.add('currency-mm-text','mm-outline');
    currencyMMText.innerHTML = "$" + btd6usersave["monkeyMoney"].toLocaleString();
    currencyMMDiv.appendChild(currencyMMText);

    let currencyKnowledgeDiv = document.createElement('div');
    currencyKnowledgeDiv.classList.add('currency-knowledge-div');
    currencyDiv.appendChild(currencyKnowledgeDiv);

    let currencyKnowledgeImg = document.createElement('img');
    currencyKnowledgeImg.classList.add('currency-knowledge-img');
    currencyKnowledgeImg.src = '../Assets/UI/KnowledgeIcon.png';
    currencyKnowledgeDiv.appendChild(currencyKnowledgeImg);

    let currencyKnowledgeText = document.createElement('p');
    currencyKnowledgeText.classList.add('currency-knowledge-text','knowledge-outline');
    currencyKnowledgeText.innerHTML = btd6usersave["knowledgePoints"].toLocaleString();
    currencyKnowledgeDiv.appendChild(currencyKnowledgeText);

    let currencyTrophiesDiv = document.createElement('div');
    currencyTrophiesDiv.classList.add('currency-trophies-div');
    currencyDiv.appendChild(currencyTrophiesDiv);

    let currencyTrophiesImg = document.createElement('img');
    currencyTrophiesImg.classList.add('currency-trophies-img');
    currencyTrophiesImg.src = '../Assets/UI/TrophyIcon.png';
    currencyTrophiesDiv.appendChild(currencyTrophiesImg);

    let currencyTrophiesText = document.createElement('p');
    currencyTrophiesText.classList.add('currency-trophies-text','black-outline');
    currencyTrophiesText.innerHTML = btd6usersave["trophies"].toLocaleString();
    currencyTrophiesDiv.appendChild(currencyTrophiesText);

    let medalsDiv = document.createElement('div');
    medalsDiv.classList.add('medals-div');
    currencyAndMedalsDiv.appendChild(medalsDiv);

    for (let [medal, num] of Object.entries(medalsInOrder)){
        if(num === 0) { continue; }
        let medalDiv = document.createElement('div');
        medalDiv.classList.add('medal-div');
        // medalDiv.title = constants.medalLabels[medal];
        medalsDiv.appendChild(medalDiv);

        tippy(medalDiv, {
            content: constants.medalLabels[medal],
            placement: 'top',
            theme: 'speech_bubble',
            // hideOnClick: false,
            // trigger: 'click'
        })

        let medalImg = document.createElement('img');
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
        medalText.classList.add('medal-text','black-outline');
        medalText.innerHTML = num.toLocaleString();
        medalDiv.appendChild(medalText);
    }

    let topHeroesMonkesyDiv = document.createElement('div');
    topHeroesMonkesyDiv.classList.add('top-heroes-monkeys-div');
    leftColumnDiv.appendChild(topHeroesMonkesyDiv);

    let topHeroesDiv = document.createElement('div');
    topHeroesDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topHeroesDiv);

    let topHeroesTopDiv = document.createElement('div');
    topHeroesTopDiv.classList.add('top-heroes-top-div');
    topHeroesDiv.appendChild(topHeroesTopDiv);

    let topHeroesTopRibbonDiv = document.createElement('div');
    topHeroesTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topHeroesTopDiv.appendChild(topHeroesTopRibbonDiv);

    let topHeroesText = document.createElement('p');
    topHeroesText.classList.add('top-heroes-text','black-outline');
    topHeroesText.innerHTML = 'Top Heroes';
    topHeroesTopRibbonDiv.appendChild(topHeroesText);

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    topHeroesTopDiv.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText.innerHTML = "Show All: ";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);

    let topHeroesList = document.createElement('div');
    topHeroesList.classList.add('top-heroes-list');
    topHeroesDiv.appendChild(topHeroesList);

    let top3HeroesDiv = document.createElement('div');
    top3HeroesDiv.classList.add('top-3-heroes-div');
    topHeroesList.appendChild(top3HeroesDiv);

    let otherHeroesDiv = document.createElement('div');
    otherHeroesDiv.classList.add('other-heroes-div');
    otherHeroesDiv.style.display = 'none';
    topHeroesList.appendChild(otherHeroesDiv);

    mapsProgressCoopToggleInput.addEventListener('change', () => {
        mapsProgressCoopToggleInput.checked ? otherHeroesDiv.style.display = 'flex' : otherHeroesDiv.style.display = 'none';
    })

    let counter = 0;
    let heroesList = Object.keys(constants.heroesInOrder);

    for (let [hero, xp] of Object.entries(btd6publicprofile["heroesPlaced"]).sort((a, b) => b[1] - a[1])){
        if(xp === 0) { continue; }
        if(!heroesList.includes(hero)) { continue; }
        let heroDiv = document.createElement('div');
        heroDiv.classList.add('hero-div');
        heroDiv.title = getLocValue(hero);
        counter < 3 ? top3HeroesDiv.appendChild(heroDiv) : otherHeroesDiv.appendChild(heroDiv);

        let heroImg = document.createElement('img');
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
        heroText.classList.add('hero-text','black-outline');
        heroText.innerHTML = xp.toLocaleString();
        heroDiv.appendChild(heroText);
        counter++;

        tippy(heroDiv, {
            content: `${getLocValue(hero)} Placed ${xp.toLocaleString()} Times`,
            placement: 'top',
            theme: 'speech_bubble'
        })
    }

    let topTowersDiv = document.createElement('div');
    topTowersDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topTowersDiv);

    let topTowersTopDiv = document.createElement('div');
    topTowersTopDiv.classList.add('top-heroes-top-div');
    topTowersDiv.appendChild(topTowersTopDiv);

    let topTowersTopRibbonDiv = document.createElement('div');
    topTowersTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topTowersTopDiv.appendChild(topTowersTopRibbonDiv);

    let topTowersText = document.createElement('p');
    topTowersText.classList.add('top-heroes-text','black-outline');
    topTowersText.innerHTML = 'Top Towers';
    topTowersTopRibbonDiv.appendChild(topTowersText);

    let mapsProgressCoopToggle2 = document.createElement('div');
    mapsProgressCoopToggle2.classList.add('maps-progress-coop-toggle');
    topTowersTopDiv.appendChild(mapsProgressCoopToggle2);

    let mapsProgressCoopToggleText2 = document.createElement('p');
    mapsProgressCoopToggleText2.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText2.innerHTML = "Show All: ";
    mapsProgressCoopToggle2.appendChild(mapsProgressCoopToggleText2);

    let mapsProgressCoopToggleInput2 = document.createElement('input');
    mapsProgressCoopToggleInput2.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput2.type = 'checkbox';
    mapsProgressCoopToggle2.appendChild(mapsProgressCoopToggleInput2);

    let topTowersList = document.createElement('div');
    topTowersList.classList.add('top-heroes-list');
    topTowersDiv.appendChild(topTowersList);

    let top3TowersDiv = document.createElement('div');
    top3TowersDiv.classList.add('top-3-heroes-div');
    topTowersList.appendChild(top3TowersDiv);

    let otherTowersDiv = document.createElement('div');
    otherTowersDiv.classList.add('other-heroes-div');
    otherTowersDiv.style.display = 'none';
    topTowersList.appendChild(otherTowersDiv);

    mapsProgressCoopToggleInput2.addEventListener('change', () => {
        mapsProgressCoopToggleInput2.checked ? otherTowersDiv.style.display = 'flex' : otherTowersDiv.style.display = 'none';
    })

    counter = 0;
    let towersList = Object.keys(constants.towersInOrder);

    for (let [tower, xp] of Object.entries(btd6publicprofile["towersPlaced"]).sort((a, b) => b[1] - a[1])){
        if(xp === 0) { continue; }
        if(!towersList.includes(tower)) { continue; }
        let towerDiv = document.createElement('div');
        towerDiv.classList.add('hero-div');
        towerDiv.style.backgroundImage = `url(../Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower]}.png)`;
        towerDiv.title = getLocValue(tower);
        counter < 3 ? top3TowersDiv.appendChild(towerDiv) : otherTowersDiv.appendChild(towerDiv);

        switch(processedInstaData.TowerBorders[tower]){
            case "Gold":
                break;
            case "Black":
                towerDiv.style.backgroundImage = "url(../Assets/UI/InstaTowersContainerBlack.png)";
                break;
            case "":
                towerDiv.style.backgroundImage = "url(../Assets/UI/InstaTowersContainer.png)";
                break;
        }

        let towerImg = document.createElement('img');
        towerImg.classList.add('hero-img');
        towerImg.src = getInstaContainerIcon(tower,"000");
        towerDiv.appendChild(towerImg);

        let towerText = document.createElement('p');
        towerText.classList.add('hero-text','black-outline');
        towerText.innerHTML = xp.toLocaleString();
        towerDiv.appendChild(towerText);
        counter++;

        tippy(towerDiv, {
            content: `${getLocValue(tower)} Placed ${xp.toLocaleString()} Times`,
            placement: 'top',
            theme: 'speech_bubble',
        })
    }

    let topParagonsDiv = document.createElement('div');
    topParagonsDiv.classList.add('top-heroes-div');
    if (Object.entries(btd6publicprofile.stats["paragonsPurchasedByName"]).length > 0) {
        topHeroesMonkesyDiv.appendChild(topParagonsDiv);
    }

    let topParagonsTopDiv = document.createElement('div');
    topParagonsTopDiv.classList.add('top-heroes-top-div');
    topParagonsDiv.appendChild(topParagonsTopDiv);

    let topParagonsTopRibbonDiv = document.createElement('div');
    topParagonsTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topParagonsTopRibbonDiv.style.filter = 'hue-rotate(250deg)';
    topParagonsTopDiv.appendChild(topParagonsTopRibbonDiv);

    let topParagonsText = document.createElement('p');
    topParagonsText.classList.add('top-heroes-text','black-outline');
    topParagonsText.innerHTML = 'Top Paragons';
    topParagonsTopRibbonDiv.appendChild(topParagonsText);

    let mapsProgressCoopToggle3 = document.createElement('div');
    mapsProgressCoopToggle3.classList.add('maps-progress-coop-toggle');
    topParagonsTopDiv.appendChild(mapsProgressCoopToggle3);

    let mapsProgressCoopToggleText3 = document.createElement('p');
    mapsProgressCoopToggleText3.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText3.innerHTML = "Show All: ";
    mapsProgressCoopToggle3.appendChild(mapsProgressCoopToggleText3);

    let mapsProgressCoopToggleInput3 = document.createElement('input');
    mapsProgressCoopToggleInput3.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput3.type = 'checkbox';
    mapsProgressCoopToggle3.appendChild(mapsProgressCoopToggleInput3);
    
    let topParagonsList = document.createElement('div');
    topParagonsList.classList.add('top-heroes-list');
    topParagonsDiv.appendChild(topParagonsList);

    let top3ParagonsDiv = document.createElement('div');
    top3ParagonsDiv.classList.add('top-3-heroes-div');
    topParagonsList.appendChild(top3ParagonsDiv);

    let otherParagonsDiv = document.createElement('div');
    otherParagonsDiv.classList.add('other-heroes-div');
    otherParagonsDiv.style.display = 'none';
    topParagonsList.appendChild(otherParagonsDiv);

    mapsProgressCoopToggleInput3.addEventListener('change', () => {
        mapsProgressCoopToggleInput3.checked ? otherParagonsDiv.style.display = 'flex' : otherParagonsDiv.style.display = 'none';
    })

    counter = 0;

    for (let [tower, xp] of Object.entries(btd6publicprofile.stats["paragonsPurchasedByName"]).sort((a, b) => b[1] - a[1])){
        
        if(xp === 0) { continue; }
        if(!constants.paragonsAvailable.includes(tower)) { continue; }
        let towerDiv = document.createElement('div');
        towerDiv.classList.add('hero-div');
        towerDiv.style.backgroundImage = "url(../Assets/UI/ParagonContainer.png)";
        counter < 3 ? top3ParagonsDiv.appendChild(towerDiv) : otherParagonsDiv.appendChild(towerDiv);

        let towerImg = document.createElement('img');
        towerImg.classList.add('hero-img');
        towerImg.src = getTowerAssetPath(tower,"Paragon");
        towerDiv.appendChild(towerImg);

        let towerText = document.createElement('p');
        towerText.classList.add('hero-text','black-outline');
        towerText.innerHTML = xp.toLocaleString();
        towerDiv.appendChild(towerText);
        counter++;

        tippy(towerDiv, {
            content: `${getLocValue(tower + " Paragon")} Placed ${xp.toLocaleString()} Times`,
            placement: 'top',
            theme: 'speech_bubble'
        })
    }

    let rightColumnDiv = document.createElement('div');
    rightColumnDiv.classList.add('right-column-div');
    belowProfileHeader.appendChild(rightColumnDiv);

    let profileStatsDiv = document.createElement('div');
    profileStatsDiv.classList.add('profile-stats');
    rightColumnDiv.appendChild(profileStatsDiv);

    let rightColumnHeader = document.createElement('div');
    rightColumnHeader.classList.add('overview-right-column-header');
    profileStatsDiv.appendChild(rightColumnHeader);

    let rightColumnHeaderText = document.createElement('p');
    rightColumnHeaderText.classList.add('column-header-text','black-outline');
    rightColumnHeaderText.innerHTML = 'Profile Stats';
    rightColumnHeader.appendChild(rightColumnHeaderText);

    for (let [key, value] of Object.entries(profileStats)){
        let stat = document.createElement('div');
        stat.classList.add('stat');
        profileStatsDiv.appendChild(stat);

        let statName = document.createElement('p');
        statName.classList.add('stat-name');
        statName.innerHTML = key;
        stat.appendChild(statName);

        let statValue = document.createElement('p');
        statValue.classList.add('stat-value');
        statValue.innerHTML = value.toLocaleString();
        stat.appendChild(statValue);
    }

    let exclusiveStatDiv = document.createElement('div');
    exclusiveStatDiv.classList.add('profile-stats');
    rightColumnDiv.appendChild(exclusiveStatDiv);

    let exclusiveStatColumnHeader = document.createElement('div');
    exclusiveStatColumnHeader.classList.add('overview-right-column-header');
    exclusiveStatDiv.appendChild(exclusiveStatColumnHeader);

    let exclusiveColumnHeaderText = document.createElement('p');
    exclusiveColumnHeaderText.classList.add('column-header-text','black-outline');
    exclusiveColumnHeaderText.innerHTML = 'API Exclusive Stats';
    exclusiveStatColumnHeader.appendChild(exclusiveColumnHeaderText);

    for (let [key, value] of Object.entries(exclusiveStats)){
        if (value == null) { continue; }
        let stat = document.createElement('div');
        stat.classList.add('stat');
        exclusiveStatDiv.appendChild(stat);

        let statName = document.createElement('p');
        statName.classList.add('stat-name');
        statName.innerHTML = key;
        stat.appendChild(statName);

        let statValue = document.createElement('p');
        statValue.classList.add('stat-value');
        statValue.innerHTML = value.toLocaleString();
        stat.appendChild(statValue);
    }

    if (btd6usersave.hasOwnProperty("rogueLegends")) {

        let rogueDiv = document.createElement('div');
        rogueDiv.classList.add('profile-stats');
        rightColumnDiv.appendChild(rogueDiv);

        let rogueColumnHeader = document.createElement('div');
        rogueColumnHeader.classList.add('overview-right-column-header');
        rogueDiv.appendChild(rogueColumnHeader);

        let rogueColumnHeaderText = document.createElement('p');
        rogueColumnHeaderText.classList.add('column-header-text','black-outline');
        rogueColumnHeaderText.innerHTML = 'Rogue Legends Stats';
        rogueColumnHeader.appendChild(rogueColumnHeaderText);

        let rogueStats = {};
        rogueStats["Tiles Captured"] = btd6usersave["rogueLegends"].tilesCaptured;
        rogueStats["Campaign Maps Won"] = btd6usersave["rogueLegends"].bossesDefeated;
        rogueStats["Common Artifacts Collected"] = btd6usersave["rogueLegends"].commonArtifactsCollected;
        rogueStats["Rare Artifacts Collected"] = btd6usersave["rogueLegends"].rareArtifactsCollected;
        rogueStats["Legendary Artifacts Collected"] = btd6usersave["rogueLegends"].legendaryArtifactsCollected;
        // rogueStats["Extracted Artifacts"] = btd6usersave["rogueLegends"];
        // rogueStats["Bloon Encounters Won"] = btd6usersave["rogueLegends"];
        // rogueStats["Mini Games Won"] = btd6usersave["rogueLegends"];
        // rogueStats["Mini Bosses Won"] = btd6usersave["rogueLegends"];
        rogueStats["Common Boosts Collected"] = btd6usersave["rogueLegends"].commonBoostsCollected;
        rogueStats["Rare Boosts Collected"] = btd6usersave["rogueLegends"].rareBoostsCollected;
        rogueStats["Legendary Boosts Collected"] = btd6usersave["rogueLegends"].legendaryBoostsCollected;

        for (let [key, value] of Object.entries(rogueStats)){
            let stat = document.createElement('div');
            stat.classList.add('stat');
            rogueDiv.appendChild(stat);

            let statName = document.createElement('p');
            statName.classList.add('stat-name');
            statName.innerHTML = key;
            stat.appendChild(statName);

            let statValue = document.createElement('p');
            statValue.classList.add('stat-value');
            statValue.innerHTML = value.toLocaleString();
            stat.appendChild(statValue);
        }
    }
    }
    // } else {
    //     let notLoggedInText = document.createElement('p');
    //     notLoggedInText.classList.add('not-logged-in-text');
    //     notLoggedInText.innerHTML = "You're in preview mode.<br>The Events, Explore, and Extras tabs can be used without an OAK token.";
    //     overviewContent.appendChild(notLoggedInText);

    //     let OtherInfoHeader = document.createElement('p');
    //     OtherInfoHeader.classList.add('site-info-header','black-outline');
    //     OtherInfoHeader.innerHTML = 'When an OAK token is entered:';
    //     overviewContent.appendChild(OtherInfoHeader);

    //     let panels = {
    //         "Profile": {
    //             "name": "View Your Profile!",
    //             "desc": "You can see anything you can see on your in-game profile plus some extra Quick Stats"},
    //         "FullMonkeyUses": {
    //             "name": "Full Top Heroes and Top Monkeys List!",
    //             "desc": "The in-game profiles only show the top 3 heroes and towers, but here you can see the full list!"
    //         },
    //         "ExtraStats": {
    //             "name": "View Extra Stats!",
    //             "desc": "In addition to the in-game profile stats, you can view extra stats such as Total Race Attempts, Total Challenges Played, and even Continues Used"
    //         }
    //     }

    //     let instaMonkeyGuideContainer = document.createElement('div');
    //     instaMonkeyGuideContainer.classList.add('insta-monkey-guide-container');
    //     overviewContent.appendChild(instaMonkeyGuideContainer);

    //     Object.keys(panels).forEach(method => {
    //         let instaMonkeyGuideMethod = document.createElement('div');
    //         instaMonkeyGuideMethod.classList.add('insta-monkey-guide-method');
    //         instaMonkeyGuideContainer.appendChild(instaMonkeyGuideMethod);

    //         let instaMonkeyGuideMethodText = document.createElement('p');
    //         instaMonkeyGuideMethodText.classList.add('insta-monkey-guide-method-text','black-outline');
    //         instaMonkeyGuideMethodText.innerHTML = panels[method].name;
    //         instaMonkeyGuideMethod.appendChild(instaMonkeyGuideMethodText);

    //         let instaMonkeyGuideMethodDesc = document.createElement('p');
    //         instaMonkeyGuideMethodDesc.classList.add('insta-monkey-guide-method-desc');
    //         instaMonkeyGuideMethodDesc.innerHTML = panels[method].desc;
    //         instaMonkeyGuideMethod.appendChild(instaMonkeyGuideMethodDesc);

    //         let instaMonkeyImage = document.createElement('img');
    //         instaMonkeyImage.classList.add('insta-monkey-guide-method-img');
    //         instaMonkeyImage.src = `./Assets/UI/Overview${method}.png`;
    //         instaMonkeyGuideMethod.appendChild(instaMonkeyImage);
    //     })
    // }
}

function generateRank(veteran){
    let rank = document.createElement('div');
    rank.classList.add('rank');

    let rankStar = document.createElement('div');
    rankStar.classList.add('rank-star');
    rank.appendChild(rankStar);

    let rankImg = document.createElement('img');
    rankImg.classList.add('rank-img');
    rankImg.src = veteran ? '../Assets/UI/LvlHolderVeteran.png' : '../Assets/UI/LvlHolder.png';
    rankStar.appendChild(rankImg);

    let rankText = document.createElement('p');
    rankText.classList.add('rank-text','black-outline');
    rankText.innerHTML = veteran ? rankInfoVeteran["rank"] : rankInfo["rank"];
    rankStar.appendChild(rankText);

    let rankBar = document.createElement('div');
    rankBar.classList.add('rank-bar');
    rank.appendChild(rankBar);

    let rankBarFill = document.createElement('div');
    rankBarFill.classList.add('rank-bar-fill');
    if (veteran) { 
        rankBar.classList.add('rank-bar-veteran');
        rankBarFill.classList.add('rank-bar-fill-veteran');
        rankBarFill.style.width = rankInfoVeteran["xp"] === null ? "100%" : `${(rankInfoVeteran["xp"]/rankInfoVeteran["xpGoal"]) * 100}%`;
    } else {
        rankBarFill.style.width = rankInfo["xp"] === null ? "100%" : `${(rankInfo["xp"]/rankInfo["xpGoal"]) * 100}%`;
    }
    rankBar.appendChild(rankBarFill);

    let rankBarText = document.createElement('p');
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
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    if(loggedIn){
        let progressPage = document.createElement('div');
        progressPage.classList.add('progress-page');
        progressContent.appendChild(progressPage);

        let selectorsDiv = document.createElement('div');
        selectorsDiv.classList.add('selectors-div');
        progressPage.appendChild(selectorsDiv);

        currentInstaView = "game";

        let logoutDiv = createEl('div', { classList: ['d-flex', 'jc-between', 'ai-center', 'bg-color-tertiary', 'pointer'], style: {padding: "10px", margin: "10px", borderRadius: "10px"} });
        logoutDiv.addEventListener('click', () => {
            logoutProgress();
        })
        logoutDiv.appendChild(createEl('p', { classList: ['profile-name', 'tc-white', 'font-luckiest', 'black-outline'], innerHTML: 'Logged in as: ' + btd6publicprofile.displayName }));
        const logoutBtn = createEl('img', { style:{height: "50px"}, src: './Assets/UI/BackBtn.png' });
        logoutDiv.appendChild(logoutBtn);
        selectorsDiv.appendChild(logoutDiv);

        let profileSelectorDiv = document.createElement('div');
        profileSelectorDiv.classList.add('d-flex', 'jc-between', 'ai-center', 'view-profile', 'pointer', 'transparent-border');
        profileSelectorDiv.style.backgroundImage = `url(${getProfileBanner(btd6publicprofile)})`;
        profileSelectorDiv.addEventListener('click', () => {
            generateOverview();
        })
        selectorsDiv.appendChild(profileSelectorDiv);

        let profileSelectorImg = document.createElement('img');
        profileSelectorImg.classList.add('selector-img');
        profileSelectorImg.src = getProfileAvatar(btd6publicprofile);
        profileSelectorDiv.appendChild(profileSelectorImg);

        let profileSelectorText = document.createElement('p');
        profileSelectorText.classList.add('selector-text','black-outline');
        profileSelectorText.innerHTML = "View Your Profile Stats";
        profileSelectorDiv.appendChild(profileSelectorText);

        let profileSelectorGoImg = document.createElement('img');
        profileSelectorGoImg.classList.add('selector-go-img');
        profileSelectorGoImg.src = '../Assets/UI/ContinueBtn.png';
        profileSelectorDiv.appendChild(profileSelectorGoImg);

        let selectors = ['Towers', 'Heroes', 'ActivatedAbilities', 'MapProgress', 'Powers', 'InstaMonkeys', 'Knowledge', 'Achievements', 'Quests', 'TrophyStore', 'TeamsStore', 'Extras'];

        selectors.forEach((selector) => {
            if(progressSubText[selector].includes("0 Extras")) { return; }
            if(progressSubText[selector].includes("Team Store") && !showTeamsItems) { return; }
            let selectorDiv = document.createElement('div');
            selectorDiv.classList.add('selector-div', 'progress-selector-div');
            selectorDiv.addEventListener('click', () => {
                changeProgressTab(selector);
            })
            selectorsDiv.appendChild(selectorDiv);

            let selectorImg = document.createElement('img');
            selectorImg.classList.add('selector-img');
            selectorImg.src = selector == "Heroes" ? `../Assets/HeroIconCircle/HeroIcon${btd6usersave.primaryHero}.png` : '../Assets/UI/' + selector.replace(" ","") + 'Btn.png';
            selectorDiv.appendChild(selectorImg);

            let selectorText = document.createElement('p');
            selectorText.classList.add('selector-text','black-outline');
            selectorText.innerHTML = progressSubText[selector];
            selectorDiv.appendChild(selectorText);

            let selectorGoImg = document.createElement('img');
            selectorGoImg.classList.add('selector-go-img');
            selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
            selectorDiv.appendChild(selectorGoImg);
        })
    } else {
        let notLoggedInContent = document.createElement('div');
        notLoggedInContent.classList.add('bg-color-primary', 'content-div', 'progress', 'd-flex');
        progressContent.appendChild(notLoggedInContent);

        let loginDiv = generateLoginDiv();
        notLoggedInContent.appendChild(loginDiv)

        // let notLoggedInText = document.createElement('p');
        // notLoggedInText.classList.add('not-logged-in-text');
        // notLoggedInText.innerHTML = "You're in preview mode.<br>The Events, Explore, and Extras tabs can be used without an OAK token.";
        // notLoggedInContent.appendChild(notLoggedInText);

        // progressContent.classList.add("overview")

        let OtherInfoHeader = document.createElement('p');
        OtherInfoHeader.classList.add('site-info-header','black-outline');
        OtherInfoHeader.innerHTML = 'When an OAK token is entered:';
        notLoggedInContent.appendChild(OtherInfoHeader);

        let panels = {
            "Maps": {
                "name": "View Extra Map Stats!",
                "desc": "You can view your highest round and times completed count for every map on every mode!"
            },
            "InstaMonkeys": {
                "name": "View Your Insta Monkeys Collection!",
                "desc": "You can view how many of each Insta Monkey you've accumulated here as well as track your collection."
            },
            "CollectionEvent": {
                "name": "Collection Event Helper!",
                "desc": "Using your current inventory, you can view the odds of getting a new Insta Monkey for each chest type in general and when selecting a featured tower."
            },
            "Achievements": {
                "name": "View Achievements!",
                "desc": "You can view your achievement progress here as well as use a few useful filters such as finding Monkey Knowledge points as rewards."
            },
            "Towers": {
                "name": "View Your Towers!",
                "desc": "You can view portait art and total xp for every tower you've unlocked here."},
            "Heroes": {
                "name": "View Your Heroes!",
                "desc": "You can view all portrait art for all heroes and skins you've unlocked as well as hero level information here."
            },
            "Powers": {
                "name": "View Your Powers!",
                "desc": "You can view how many of each power you've accumulated here."
            },
            "Knowledge": {
                "name": "View Your Knowledge!",
                "desc": "You can view your Monkey Knowledge point unlock progress here."
            }
        }

        let instaMonkeyGuideContainer = document.createElement('div');
        instaMonkeyGuideContainer.classList.add('insta-monkey-guide-container');
        instaMonkeyGuideContainer.style.width = "800px";
        notLoggedInContent.appendChild(instaMonkeyGuideContainer);

        Object.keys(panels).forEach(method => {
            let instaMonkeyGuideMethod = document.createElement('div');
            instaMonkeyGuideMethod.classList.add('insta-monkey-guide-method');
            instaMonkeyGuideContainer.appendChild(instaMonkeyGuideMethod);

            let instaMonkeyGuideMethodText = document.createElement('p');
            instaMonkeyGuideMethodText.classList.add('insta-monkey-guide-method-text','black-outline');
            instaMonkeyGuideMethodText.innerHTML = panels[method].name;
            instaMonkeyGuideMethod.appendChild(instaMonkeyGuideMethodText);

            let instaMonkeyGuideMethodDesc = document.createElement('p');
            instaMonkeyGuideMethodDesc.classList.add('insta-monkey-guide-method-desc');
            instaMonkeyGuideMethodDesc.innerHTML = panels[method].desc;
            instaMonkeyGuideMethod.appendChild(instaMonkeyGuideMethodDesc);

            let instaMonkeyImage = document.createElement('img');
            instaMonkeyImage.classList.add('insta-monkey-guide-method-img');
            instaMonkeyImage.src = `./Assets/UI/Progress${method}.png`;
            instaMonkeyGuideMethod.appendChild(instaMonkeyImage);
        })
    }
}

function logoutProgress() {
    loggedIn = false;
    pressedStart = false;
    generateProgress();
}

function changeProgressTab(selector){
    resetScroll();
    if(timerInterval) { clearInterval(timerInterval); }
    addToBackQueue({source: 'profile', destination: 'profile', callback: generateProgress});
    switch(selector){
        case 'Towers':
            generateTowerProgress();
            break;
        case 'Heroes':
            generateHeroesProgress();
            break;
        case "ActivatedAbilities":
            generateAbilities();
            break;
        case "Knowledge":
            generateKnowledgeProgress();
            break;
        case "MapProgress":
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
        case "TrophyStore":
            generateTrophyStoreProgress();
            break;
        case "TeamsStore":
            generateTeamsStoreProgress();
            break;
        case "Logout":
            logoutProgress();
            break;
        case 'Quests':
            generateQuestsPage();
            break;
    }
}

function generateTowerProgress(){
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    let towerProgressContainer = document.createElement('div');
    towerProgressContainer.classList.add('tower-progress-container');
    progressContent.appendChild(towerProgressContainer);

    let towerProgressDiv = document.createElement('div');
    towerProgressDiv.classList.add('tower-progress-div');
    towerProgressContainer.appendChild(towerProgressDiv);

    let towerSelectorHeaderTop = document.createElement('div');
    towerSelectorHeaderTop.classList.add('tower-selector-header-top');
    towerProgressDiv.appendChild(towerSelectorHeaderTop);

    let towerSelectorHeaderText = document.createElement('p');
    towerSelectorHeaderText.classList.add('tower-selector-header-text','black-outline');
    towerSelectorHeaderText.innerHTML = `Towers - ${Object.keys(btd6usersave.unlockedTowers).filter(k => btd6usersave.unlockedTowers[k]).length}/${Object.keys(btd6usersave.unlockedTowers).length}`;
    towerSelectorHeaderTop.appendChild(towerSelectorHeaderText);

    let towerSelectorHeaderText2 = document.createElement('p');
    towerSelectorHeaderText2.classList.add('tower-selector-header-text','black-outline');
    towerSelectorHeaderText2.innerHTML = `Upgrades - ${Object.keys(btd6usersave.acquiredUpgrades).filter(k => btd6usersave.acquiredUpgrades[k]).length}/${Object.keys(btd6usersave.acquiredUpgrades).length}`;
    towerSelectorHeaderTop.appendChild(towerSelectorHeaderText2);

    let towerSelectorHeader = document.createElement('div');
    towerSelectorHeader.classList.add('tower-selector-header');
    towerProgressDiv.appendChild(towerSelectorHeader);

    let towersInSave = btd6usersave.unlockedTowers;
    for (let [tower, category] of Object.entries(constants.towersInOrder)) {
        if(!Object.keys(btd6usersave.unlockedTowers).includes(tower)) {continue}
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
    towerProgressTop.classList.add('tower-progress-top');
    if (paragonUnlocked) { towerProgressTop.classList.add('tower-progress-top-paragon') }
    towerProgressContent.appendChild(towerProgressTop);

    let towerProgressContentTop = document.createElement('div');
    towerProgressContentTop.classList.add('tower-progress-content-top');
    towerProgressTop.appendChild(towerProgressContentTop);

    let towerProgressInfoContainer = document.createElement('div');
    towerProgressInfoContainer.classList.add('tower-progress-info-container');
    towerProgressContentTop.appendChild(towerProgressInfoContainer);

    let towerProgressContentText = document.createElement('p');
    towerProgressContentText.classList.add('tower-progress-content-text', paragonUnlocked ? 'knowledge-outline' : 'black-outline');
    let towerName = (useNamedMonkeys && btd6usersave.namedMonkeys[tower]) ? btd6usersave.namedMonkeys[tower] : getLocValue(tower)
    towerProgressContentText.appendChild(document.createTextNode(towerName));
    towerProgressInfoContainer.appendChild(towerProgressContentText);

    let towerProgressContentXP = document.createElement('p');
    towerProgressContentXP.classList.add('tower-progress-content-xp','mm-outline');
    towerProgressContentXP.innerHTML = `XP: ${btd6usersave.towerXP[tower].toLocaleString()}`;
    towerProgressInfoContainer.appendChild(towerProgressContentXP);

    let towerProgressContentDesc = document.createElement('p');
    towerProgressContentDesc.classList.add('tower-progress-content-desc'+ (paragonUnlocked ? '-paragon' : ''));
    towerProgressContentDesc.innerHTML = getLocValue(`${tower} Description`);
    towerProgressContentTop.appendChild(towerProgressContentDesc);

    let towerNameAndPortrait = document.createElement('div');
    towerNameAndPortrait.classList.add('tower-name-and-portrait');
    towerProgressContent.appendChild(towerNameAndPortrait);

    let towerPortraitName = document.createElement('p');
    towerPortraitName.id = 'tower-portrait-name';
    towerPortraitName.classList.add('tower-portrait-name','black-outline');
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

    // let upgradeTooltip = document.createElement('div');
    // upgradeTooltip.id = `upgrade-tooltip`;
    // upgradeTooltip.classList.add('upgrade-tooltip');
    // upgradeTooltip.innerHTML = getLocValue(`${tower} Description`);
    // towerProgressContent.appendChild(upgradeTooltip);

    let towerProgressMainDiv = document.createElement('div');
    towerProgressMainDiv.classList.add('tower-progress-main-div', 'fd-column');
    towerProgressContent.appendChild(towerProgressMainDiv);

    towerProgressMainDiv.appendChild(makeUpgradeButtons(tower, unlockedAllT5, paragonUnlocked));

    let towerProgressBottom = document.createElement('div');
    // towerProgressBottom.classList.add('tower-progress-bottom');
    towerProgressBottom.style.maxWidth = "720px";

    let relatedKnowledgePointsHeader = createEl('p', { classList: ['black-outline', 'ta-center'], style:{fontSize: "28px"}, innerHTML: 'Knowledge Points:' });
    towerProgressMainDiv.appendChild(relatedKnowledgePointsHeader);

    towerProgressMainDiv.appendChild(towerProgressBottom);

    let relatedKnowledgePointsDiv = createEl('div', { classList: [] });
    towerProgressBottom.appendChild(relatedKnowledgePointsDiv);

    let relatedKnowledgePoints = Object.keys(constants.knowledgeTags).filter(k => constants.knowledgeTags[k].includes(tower) || constants.knowledgeTags[k].includes("All" + constants.towersInOrder[tower]));

    if (relatedKnowledgePoints.length === 0) {
        relatedKnowledgePointsHeader.style.display = "none";
    } else {
        for (let knowledgePoint of relatedKnowledgePoints) {
            let knowledgeIcon = document.createElement('img');
            knowledgeIcon.classList.add('knowledge-icon');
            knowledgeIcon.src = getKnowledgeAssetPath(knowledgePoint);
            relatedKnowledgePointsDiv.appendChild(knowledgeIcon);

            tippy(knowledgeIcon, {
                content: `<p class="artifact-title">${getLocValue(knowledgePoint)}</p>${getLocValue(knowledgePoint + "Description")}`,
                allowHTML: true,
                placement: 'top',
                hideOnClick: false,
                theme: 'speech_bubble',
                popperOptions: {
                    modifiers: [
                        {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'viewport',
                            padding: {right: 18},
                        },
                        },
                    ],
                },
            });
        }
    }

    for (let selector of document.getElementsByClassName('tower-selector-highlight')){
        selector.style.display = "none";
    }
    document.getElementById(`${tower}-selector-highlight`).style.display = "block";
    paragonUnlocked ? changeHexBGColor(constants.ParagonBGColor) : changeHexBGColor()

    return towerProgressContent;
}

function makeUpgradeButtons(tower, unlockedAllT5, paragonUnlocked){
    let upgradeContainer = document.createElement('div');
    upgradeContainer.classList.add('upgrade-container');

    let upgradeRows = document.createElement('div');
    upgradeRows.classList.add('upgrade-rows');
    upgradeContainer.appendChild(upgradeRows);

    let row1 = document.createElement('div');
    row1.classList.add('upgrade-row');
    upgradeRows.appendChild(row1);

    let row2 = document.createElement('div');
    row2.classList.add('upgrade-row');
    upgradeRows.appendChild(row2);

    let row3 = document.createElement('div');
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
        upgradeContainerParagon.classList.add('upgrade-container-paragon');
        upgradeContainer.appendChild(upgradeContainerParagon);

        upgradeContainerParagon.appendChild(generateParagonIcon(tower, `${tower} Paragon`, btd6usersave.acquiredUpgrades[`${tower} Paragon`] ? "unlocked" : "locked"));
    }
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
    upgradeDiv.appendChild(upgradeGlow);

    let upgradeBGImg = document.createElement('div');
    upgradeBGImg.classList.add('upgrade-bg-img');
    let enoughXP = btd6usersave.towerXP[tower] >= constants.towerPaths[tower][`path${row}`][upgrade];
    tier == 4 ? btd6usersave.acquiredUpgrades[upgrade] ? upgradeBGImg.classList.add(`upgrade-t5`) : upgradeBGImg.classList.add(`upgrade-t5-locked`) : upgradeBGImg.classList.add(`upgrade-${paragon ? "paragon" : status == "unlocked" ? status : (enoughXP ? "green" : "red")}`);
    upgradeDiv.appendChild(upgradeBGImg);

    let upgradeImg = document.createElement('img');
    upgradeImg.classList.add('upgrade-img');
    upgradeImg.src = getUpgradeAssetPath(upgrade);
    if (!btd6usersave.acquiredUpgrades[upgrade] && tier == 4) { upgradeImg.style.visibility = "hidden";}
    upgradeDiv.appendChild(upgradeImg);

    let upgradeText = document.createElement('p');
    upgradeText.classList.add('upgrade-text');
    upgradeText.innerHTML = getLocValue(upgrade);
    upgradeDiv.appendChild(upgradeText);

    upgradeDiv.addEventListener('click', () => {
        onSelectTowerUpgrade(tower, upgrade, towerUpgrade);
        // document.getElementById("upgrade-tooltip").innerHTML = getLocValue(`${upgrade} Description`);
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

    tippy(upgradeDiv, {
        content: getLocValue(`${upgrade} Description`),
        placement: 'top',
        theme: 'speech_bubble',
        hideOnClick: false,
        allowHTML: true
    })

    return upgradeDiv;
}

function generateParagonIcon(tower, upgrade, status){
    let paragonDiv = document.createElement('div');
    paragonDiv.id = `${tower}-paragon-div`;
    paragonDiv.classList.add('upgrade-div');

    let paragonBGImg = document.createElement('div');
    paragonBGImg.classList.add('upgrade-bg-img');
    paragonBGImg.classList.add(`upgrade-paragon-special${btd6usersave.acquiredUpgrades[upgrade] ? "" : "-locked"}`);
    paragonDiv.appendChild(paragonBGImg);

    let paragonGlow = document.createElement('div');
    paragonGlow.id = `paragon-glow`;
    paragonDiv.appendChild(paragonGlow);

    let paragonImg = document.createElement('img');
    paragonImg.classList.add('upgrade-img');
    paragonImg.src = getUpgradeAssetPath(`${tower} Paragon`);
    if (!btd6usersave.acquiredUpgrades[upgrade]) { paragonImg.style.visibility = "hidden";}
    paragonDiv.appendChild(paragonImg);

    let paragonText = document.createElement('p');
    paragonText.classList.add('upgrade-text');
    paragonText.innerHTML = getLocValue(upgrade);
    paragonDiv.appendChild(paragonText);

    paragonDiv.addEventListener('click', () => {
        onSelectTowerUpgradeParagon(tower, upgrade, "Paragon");
        // document.getElementById("upgrade-tooltip").innerHTML = getLocValue(`${upgrade} Description`);
        Array.from(document.getElementsByClassName('upgrade-glow')).forEach((glow) => {
            glow.classList.remove('upgrade-glow');
        });
        paragonGlow.classList.add('upgrade-glow-paragon');
    })

    tippy(paragonDiv, {
        content: getLocValue(`${upgrade} Description`),
        placement: 'top',
        theme: 'speech_bubble',
        popperOptions: {
            modifiers: [
                {
                name: 'preventOverflow',
                options: {
                    boundary: 'viewport',
                    padding: {right: 18},
                },
                },
            ],
        },
        hideOnClick: false
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
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    let heroProgressContainer = document.createElement('div');
    heroProgressContainer.classList.add('tower-progress-container');
    progressContent.appendChild(heroProgressContainer);

    let heroProgressDiv = document.createElement('div');
    heroProgressDiv.classList.add('hero-progress-div');
    heroProgressContainer.appendChild(heroProgressDiv);

    let heroSelectorHeaderTop = document.createElement('div');
    heroSelectorHeaderTop.classList.add('hero-selector-header-top');
    heroProgressDiv.appendChild(heroSelectorHeaderTop);

    let correctedHeroesList = Object.keys(btd6usersave.unlockedSkins).filter(k => !constants.heroesInOrder[k]);

    let heroSelectorHeaderText = document.createElement('p');
    heroSelectorHeaderText.classList.add('hero-selector-header-text','black-outline');
    heroSelectorHeaderText.innerHTML = `Heroes - ${Object.keys(btd6usersave.unlockedHeros).filter(k => btd6usersave.unlockedHeros[k]).length}/${Object.keys(btd6usersave.unlockedHeros).length}`;
    heroSelectorHeaderTop.appendChild(heroSelectorHeaderText);

    let heroSelectorHeaderText2 = document.createElement('p');
    heroSelectorHeaderText2.classList.add('hero-selector-header-text','black-outline');
    heroSelectorHeaderText2.innerHTML = `Skins - ${Object.keys(btd6usersave.unlockedSkins).filter(k => btd6usersave.unlockedSkins[k] && correctedHeroesList.includes(k)).length}/${correctedHeroesList.length}`;
    heroSelectorHeaderTop.appendChild(heroSelectorHeaderText2);

    let heroSelectorHeader = document.createElement('div');
    heroSelectorHeader.classList.add('hero-selector-header');
    heroProgressDiv.appendChild(heroSelectorHeader);

    for (let [hero, nameColor] of Object.entries(constants.heroesInOrder)) {
        let heroSelector = document.createElement('div');
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

    let heroProgressContainer = document.createElement('div');
    heroProgressContainer.classList.add('hero-progress-container');
    heroProgressContent.appendChild(heroProgressContainer);

    let heroProgressTop = document.createElement('div');
    heroProgressTop.classList.add('hero-progress-top');
    heroProgressContainer.appendChild(heroProgressTop);

    let heroProgressHeader = document.createElement('div');
    heroProgressHeader.classList.add('hero-progress-header');
    heroProgressTop.appendChild(heroProgressHeader);

    let heroProgressTrailFX = document.createElement('img');
    heroProgressTrailFX.classList.add('hero-progress-trail-fx');
    heroProgressTrailFX.src = './Assets/UI/TrailFx.png'; 
    heroProgressHeader.appendChild(heroProgressTrailFX);

    let heroProgressHeaderText = document.createElement('p');
    heroProgressHeaderText.id = 'hero-progress-header-text';
    heroProgressHeaderText.classList.add('hero-progress-header-text');
    heroProgressHeaderText.style.backgroundImage = `url('../Assets/UI/${nameColor}TxtTextureMain.png')`;
    heroProgressHeaderText.innerHTML = getLocValue(hero);
    heroProgressHeader.appendChild(heroProgressHeaderText);

    let heroProgressHeaderSubtitle = document.createElement('p');
    heroProgressHeaderSubtitle.id = 'hero-progress-header-subtitle';
    heroProgressHeaderSubtitle.classList.add('hero-progress-header-subtitle','subtitle-outline');
    heroProgressHeaderSubtitle.innerHTML = getLocValue(`${hero} Short Description`);
    heroProgressHeader.appendChild(heroProgressHeaderSubtitle);

    let heroProgressMiddle = document.createElement('div');
    heroProgressMiddle.classList.add('hero-progress-middle');
    heroProgressContainer.appendChild(heroProgressMiddle);

    let heroPortraitLevelSelectBtns = document.createElement('div');
    heroPortraitLevelSelectBtns.id = 'hero-portrait-level-select-btns';
    heroPortraitLevelSelectBtns.classList.add('hero-portrait-level-select-btns');
    heroProgressMiddle.appendChild(heroPortraitLevelSelectBtns);

    updatePortraitLevelButtons(hero)

    let heroPortraitDiv = document.createElement('div');
    heroPortraitDiv.classList.add('hero-portrait-div');
    heroProgressMiddle.appendChild(heroPortraitDiv);

    let heroPortraitImg = document.createElement('img');
    heroPortraitImg.id = 'hero-portrait-img';
    heroPortraitImg.classList.add('hero-portrait-img');
    heroPortraitImg.src = getHeroPortrait(hero, 1);
    heroPortraitDiv.appendChild(heroPortraitImg);

    let heroPortraitBar = document.createElement('div');
    heroPortraitBar.classList.add('hero-portrait-bar');
    heroPortraitDiv.appendChild(heroPortraitBar);

    let heroPortraitGlow = document.createElement('div');
    heroPortraitGlow.id = 'hero-portrait-glow';
    heroPortraitGlow.classList.add('hero-portrait-glow');
    heroPortraitGlow.style.background = `radial-gradient(circle, rgb(${constants.HeroBGColors[hero][0] * 255},${constants.HeroBGColors[hero][1] * 255},${constants.HeroBGColors[hero][2] * 255}) 0%, transparent 70%)`
    heroPortraitDiv.appendChild(heroPortraitGlow);

    let heroSkinsDiv = document.createElement('div');
    heroSkinsDiv.classList.add('hero-skins-div');
    heroProgressMiddle.appendChild(heroSkinsDiv);

    constants.heroSkins[hero].forEach((skin) => {
        if ((btd6usersave.unlockedSkins[saveSkintoSkinMap[skin] || skin] == null) && skin != hero) { return; }

        let heroSkin = document.createElement('img');
        heroSkin.id = `${hero}-${skin}-skin`;
        heroSkin.classList.add('hero-skin');
        heroSkin.src = getHeroIconCircle(skin);

        if (btd6usersave.unlockedSkins[saveSkintoSkinMap[skin] || skin] == false) {
            heroSkin.classList.add('insta-tower-container-none');
        } else {
            heroSkin.addEventListener('click', () => {
                let colorToUse = constants.HeroBGColors[skin] ? constants.HeroBGColors[skin] : constants.HeroBGColors[hero];
                changeHexBGColor(colorToUse);
                changeHeroSkin(skin, hero == skin);
                document.getElementById("hero-portrait-glow").style.background = `radial-gradient(circle, rgb(${colorToUse[0] * 255},${colorToUse[1] * 255},${colorToUse[2] * 255}) 0%, transparent 70%)`
            })
        }
        heroSkinsDiv.appendChild(heroSkin);
    })

    let heroProgressBottom = document.createElement('div');
    heroProgressBottom.classList.add('hero-progress-bottom');
    heroProgressContainer.appendChild(heroProgressBottom);

    let heroProgressDesc = document.createElement('p');
    heroProgressDesc.id = 'hero-progress-desc';
    heroProgressDesc.classList.add('hero-progress-desc');
    heroProgressDesc.innerHTML = getLocValue(`${hero} Description`);
    heroProgressBottom.appendChild(heroProgressDesc);

    let heroLevelDescs = document.createElement('div');
    heroLevelDescs.classList.add('hero-level-descs');
    heroProgressBottom.appendChild(heroLevelDescs);

    for (let i = 1; i<21; i++){
        let heroLevelDescDiv = document.createElement('div');
        heroLevelDescDiv.classList.add('hero-level-desc-div');
        heroLevelDescs.appendChild(heroLevelDescDiv);

        let heroLevelDescIconDiv = document.createElement('div');
        heroLevelDescIconDiv.classList.add('hero-level-desc-icon-div');
        i == 20 ? heroLevelDescIconDiv.classList.add('hero-level-desc-image-purple') : constants.heroLevelIcons[hero].includes(i) ? heroLevelDescIconDiv.classList.add("hero-level-desc-image-gold")  : heroLevelDescIconDiv.classList.add('hero-level-desc-image');
        heroLevelDescDiv.appendChild(heroLevelDescIconDiv);

        let heroLevelDescText = document.createElement('p');
        heroLevelDescText.classList.add('hero-level-desc-text','black-outline');
        heroLevelDescText.innerHTML = i;
        heroLevelDescIconDiv.appendChild(heroLevelDescText);

        let heroLevelDesc = document.createElement('p');
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
    // if(skin == "AdoraSheRa") { heroProgressDesc.innerHTML = getLocValue(`SheRaAdoraSkinDescription`) }
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
            heroLevelSelectBtnText.classList.add('hero-level-select-text','black-outline');
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
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    changeHexBGColor(constants.ParagonBGColor)

    let totals = [0,0,0]
    for (let [knowledge, obtained] of Object.entries(btd6usersave.acquiredKnowledge)) {
        obtained ? totals[0] += 1 : constants.RecommendedKnowledge.includes(knowledge) ? totals[1] += 1 : totals[2] += 1;
    }

    let knowledgeProgressContainer = document.createElement('div');
    knowledgeProgressContainer.id = 'knowledge-progress-container';
    knowledgeProgressContainer.classList.add('knowledge-progress-container');
    progressContent.appendChild(knowledgeProgressContainer);

    // let recommendedKnowledgeContainerDiv = document.createElement('div');
    // recommendedKnowledgeContainerDiv.id = 'recommended-knowledge-container-div';
    // recommendedKnowledgeContainerDiv.classList.add('knowledge-progress-container-div');
    // knowledgeProgressContainer.appendChild(recommendedKnowledgeContainerDiv);

    // let recommendedKnowledgeHeader = document.createElement('p');
    // recommendedKnowledgeHeader.id = 'left-column-header-text';
    // recommendedKnowledgeHeader.classList.add('column-header-text');
    // recommendedKnowledgeHeader.classList.add('black-outline');
    // recommendedKnowledgeHeader.innerHTML = `${totals[1]} Recommended Knowledge Points`;
    // recommendedKnowledgeContainerDiv.appendChild(recommendedKnowledgeHeader);

    // let recommendedKnowledgeDiv = document.createElement('div');
    // recommendedKnowledgeDiv.id = 'recommended-knowledge-div';
    // recommendedKnowledgeDiv.classList.add('knowledge-progress-div');
    // recommendedKnowledgeContainerDiv.appendChild(recommendedKnowledgeDiv);

    let knowledgeProgressUnlockedContainerDiv = document.createElement('div');
    knowledgeProgressUnlockedContainerDiv.classList.add('knowledge-progress-container-div');
    knowledgeProgressContainer.appendChild(knowledgeProgressUnlockedContainerDiv);

    let knowledgeProgressUnlockedHeader = document.createElement('p');
    knowledgeProgressUnlockedHeader.classList.add('column-header-text','black-outline');
    knowledgeProgressUnlockedHeader.innerHTML = `${totals[0]} Unlocked Knowledge Points`;
    knowledgeProgressUnlockedContainerDiv.appendChild(knowledgeProgressUnlockedHeader);

    let knowledgeProgressUnlockedDiv = document.createElement('div');
    knowledgeProgressUnlockedDiv.classList.add('knowledge-progress-div');
    knowledgeProgressUnlockedContainerDiv.appendChild(knowledgeProgressUnlockedDiv);

    let knowledgeProgressLockedContainerDiv = document.createElement('div');
    knowledgeProgressLockedContainerDiv.classList.add('knowledge-progress-container-div');
    knowledgeProgressContainer.appendChild(knowledgeProgressLockedContainerDiv);

    let knowledgeProgressLockedHeader = document.createElement('p');
    knowledgeProgressLockedHeader.classList.add('column-header-text','black-outline');
    knowledgeProgressLockedHeader.innerHTML = `${totals[2] + totals[1]} Locked Knowledge Points`;
    knowledgeProgressLockedContainerDiv.appendChild(knowledgeProgressLockedHeader);

    let knowledgeProgressLockedDiv = document.createElement('div');
    knowledgeProgressLockedDiv.classList.add('knowledge-progress-div');
    knowledgeProgressLockedContainerDiv.appendChild(knowledgeProgressLockedDiv);

    for (let [knowledge, obtained] of Object.entries(btd6usersave.acquiredKnowledge)) {
        if (!getLocValue(knowledge)) { continue; }
        let knowledgeIconDiv = document.createElement('div');
        knowledgeIconDiv.classList.add('knowledge-icon-div');
        // obtained ? knowledgeProgressUnlockedDiv.appendChild(knowledgeIconDiv) : constants.RecommendedKnowledge.includes(knowledge) ? recommendedKnowledgeDiv.appendChild(knowledgeIconDiv) : knowledgeProgressLockedDiv.appendChild(knowledgeIconDiv);
        obtained ? knowledgeProgressUnlockedDiv.appendChild(knowledgeIconDiv) : knowledgeProgressLockedDiv.appendChild(knowledgeIconDiv);


        let knowledgeGlow = document.createElement('div');
        knowledgeGlow.id = `${knowledge}-glow`;
        // upgradeGlow.classList.add('upgrade-glow');
        knowledgeIconDiv.appendChild(knowledgeGlow);

        let knowledgeIcon = document.createElement('img');
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

    // if (recommendedKnowledgeDiv.innerHTML == "") {
    //     recommendedKnowledgeHeader.style.display = "none";
    // }
    if (knowledgeProgressLockedDiv.innerHTML == "") {
        knowledgeProgressLockedHeader.style.display = "none";
    }
    if (knowledgeProgressUnlockedDiv.innerHTML == "") {
        knowledgeProgressUnlockedHeader.style.display = "none";
    }


    let tooltipContainerDiv = document.createElement('div');
    tooltipContainerDiv.classList.add('tooltip-container-div');
    knowledgeProgressContainer.appendChild(tooltipContainerDiv);

    let knowledgeProgressFloatingTooltip = document.createElement('div');
    knowledgeProgressFloatingTooltip.id = 'knowledge-progress-floating-tooltip';
    knowledgeProgressFloatingTooltip.classList.add('knowledge-progress-floating-tooltip');
    tooltipContainerDiv.appendChild(knowledgeProgressFloatingTooltip);

    let knowledgeNameText = document.createElement('p');
    knowledgeNameText.id = `knowledge-name-text`;
    knowledgeNameText.classList.add('knowledge-name-text','black-outline');
    knowledgeProgressFloatingTooltip.appendChild(knowledgeNameText);

    let knowledgeDescText = document.createElement('p');
    knowledgeDescText.id = `knowledge-desc-text`;
    knowledgeDescText.classList.add('knowledge-desc-text');
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
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    currentMapView = "grid";
    coopEnabled = false;
    currentDifficultyFilter = "All";
    mapPage = 0;

    let mapsProgressHeaderBar = document.createElement('div');
    mapsProgressHeaderBar.id = 'maps-progress-header-bar';
    mapsProgressHeaderBar.classList.add('maps-progress-header-bar');
    progressContent.appendChild(mapsProgressHeaderBar);

    let mapsProgressViews = document.createElement('div');
    mapsProgressViews.id = 'maps-progress-views';
    mapsProgressViews.classList.add('maps-progress-views');
    mapsProgressHeaderBar.appendChild(mapsProgressViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressViewsText.innerHTML = "Display Type:";
    mapsProgressViews.appendChild(mapsProgressViewsText);

    let mapsProgressGame = document.createElement('div');
    mapsProgressGame.id = 'maps-progress-game';
    mapsProgressGame.classList.add('maps-progress-view','black-outline');
    mapsProgressGame.innerHTML = "Game";
    mapsProgressGame.addEventListener('click', () => {
        onChangeMapView("game");
    })
    mapsProgressViews.appendChild(mapsProgressGame);


    let mapsProgressGrid = document.createElement('div');
    mapsProgressGrid.id = 'maps-progress-grid';
    mapsProgressGrid.classList.add('maps-progress-view','black-outline','maps-progress-view-selected');
    mapsProgressGrid.innerHTML = "Grid";
    mapsProgressGrid.addEventListener('click', () => {
        onChangeMapView("grid");
    })
    mapsProgressViews.appendChild(mapsProgressGrid);

    let mapsProgressList = document.createElement('div');
    mapsProgressList.id = 'maps-progress-list';
    mapsProgressList.classList.add('maps-progress-view','black-outline', 'maps-progress-view-list');
    mapsProgressList.innerHTML = "List";
    mapsProgressList.addEventListener('click', () => {
        onChangeMapView("list");
    })
    mapsProgressViews.appendChild(mapsProgressList);


    let mapsProgressFilter = document.createElement('div');
    mapsProgressFilter.classList.add('maps-progress-filter');
    mapsProgressHeaderBar.appendChild(mapsProgressFilter);

    let mapProgressFilterDifficulty = document.createElement('div');
    mapProgressFilterDifficulty.classList.add('map-progress-filter-difficulty');
    mapsProgressFilter.appendChild(mapProgressFilterDifficulty);

    let mapsProgressFilterDifficultyText = document.createElement('p');
    mapsProgressFilterDifficultyText.classList.add('maps-progress-coop-toggle-text','black-outline');
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
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    mapsProgressFilter.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
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

    onChangeMapView("game");
}

function onChangeMapView(view){
    currentMapView = view;
    switch(view){
        case "grid":
            document.getElementById('maps-progress-grid').classList.add('stats-tab-yellow');
            document.getElementById('maps-progress-list').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-game').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-header-bar').classList.add('border-top-only');
            generateMapsGridView();
            break;
        case "list":
            document.getElementById('maps-progress-grid').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-list').classList.add('stats-tab-yellow');
            document.getElementById('maps-progress-game').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-header-bar').classList.add('border-top-only');
            generateMapsListView();
            break;
        case "game":
            document.getElementById('maps-progress-grid').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-list').classList.remove('stats-tab-yellow');
            document.getElementById('maps-progress-game').classList.add('stats-tab-yellow');
            document.getElementById('maps-progress-header-bar').classList.remove('border-top-only');
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
    resetScroll();
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
    mapProgressHeaderBar.classList.add('single-map-progress-header-bar');
    mapProgressContainer.appendChild(mapProgressHeaderBar);

    let mapNextAndPrev = document.createElement('div');
    mapNextAndPrev.classList.add('map-next-and-prev');
    mapProgressHeaderBar.appendChild(mapNextAndPrev);

    let mapProgressPrevBtn = document.createElement('div');
    mapProgressPrevBtn.classList.add('maps-progress-view','black-outline');
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
    mapProgressNextBtn.classList.add('maps-progress-view','black-outline');
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

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        // onExitMap();
        goBack();
    })
    mapProgressHeaderBar.appendChild(modalClose);

    let mapBelowHeaderBar = document.createElement('div');
    mapBelowHeaderBar.classList.add('map-below-header-bar');
    mapProgressContainer.appendChild(mapBelowHeaderBar);

    let mapLeftColumn = document.createElement('div');
    mapLeftColumn.classList.add('map-left-column');
    mapBelowHeaderBar.appendChild(mapLeftColumn);

    let mapNameAndIcon = document.createElement('div');
    mapNameAndIcon.classList.add('map-progress-div');
    mapLeftColumn.appendChild(mapNameAndIcon);

    let mapNameTop = document.createElement('div');
    mapNameTop.classList.add('map-name-top');
    mapNameAndIcon.appendChild(mapNameTop);

    let mapDifficultyIcon = document.createElement('img');
    mapDifficultyIcon.classList.add('map-difficulty-icon');
    mapDifficultyIcon.src = `./Assets/DifficultyIcon/Map${constants.mapsInOrder[map].difficulty}Btn.png`;
    mapNameTop.appendChild(mapDifficultyIcon);

    let mapNameAndMedals = document.createElement('div');
    mapNameAndMedals.classList.add('map-name-and-medals');
    mapNameTop.appendChild(mapNameAndMedals);
    
    let mapName = document.createElement('p');
    mapName.classList.add('map-name-large','black-outline');
    mapName.innerHTML = getLocValue(map);
    mapNameAndMedals.appendChild(mapName);
    
    let mapProgressSingle = document.createElement('div');
    mapProgressSingle.classList.add('map-progress-subtext');
    mapProgressSingle.innerHTML = `${Object.values(processedMapData.Medals.single[map]).filter(a=>a==true).length}/15 Single Player Medals`;
    mapNameAndMedals.appendChild(mapProgressSingle);

    let mapProgressCoop = document.createElement('div');
    mapProgressCoop.classList.add('map-progress-subtext');
    mapProgressCoop.innerHTML = `${Object.values(processedMapData.Medals.coop[map]).filter(a=>a==true).length}/15 Coop Medals`;
    mapNameAndMedals.appendChild(mapProgressCoop);

    let overallHighestRound = document.createElement('div');
    overallHighestRound.classList.add('map-progress-subtext');
    overallHighestRound.innerHTML = `Overall Highest Round: ${processedMapData.Maps[map].highestRound}`;
    mapNameAndMedals.appendChild(overallHighestRound);

    let totalWins = document.createElement('div');
    totalWins.classList.add('map-progress-subtext');
    totalWins.innerHTML = `Total Wins: ${processedMapData.Maps[map].totalWins}`;
    mapNameAndMedals.appendChild(totalWins);

    let mapIcon = document.createElement('img');
    mapIcon.classList.add('map-icon');
    mapIcon.src = getMapIcon(map);
    mapNameAndIcon.appendChild(mapIcon);

    let mapProgressSingleMedals = document.createElement('div');
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
        medalDiv.classList.add('medal-div');
        mapProgressSingleMedals.appendChild(medalDiv);

        let medalImg = document.createElement('img');
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
        tippy(medalDiv, {
            content: constants.medalLabels[`Medal${medalMap[difficulty]}`],
            placement: 'top',
            theme: 'speech_bubble'
        })
    }

    let mapProgressCoopMedals = document.createElement('div');
    mapProgressCoopMedals.classList.add('map-progress-medals');
    mapLeftColumn.appendChild(mapProgressCoopMedals);

    for (let [difficulty, completed] of Object.entries(processedMapData.Medals.coop[map])) {
        if (completed == null) { continue; }
        let medalDiv = document.createElement('div');
        medalDiv.classList.add('medal-div');
        mapProgressCoopMedals.appendChild(medalDiv);

        let medalImg = document.createElement('img');
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
        tippy(medalDiv, {
            content: constants.medalLabels[`MedalCoop${medalMap[difficulty]}`],
            placement: 'top',
            theme: 'speech_bubble'
        })
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
    mapRightColumn.classList.add('map-right-column');
    mapBelowHeaderBar.appendChild(mapRightColumn);

    let rightColumnHeader = document.createElement('div');
    rightColumnHeader.classList.add('right-column-header');
    mapRightColumn.appendChild(rightColumnHeader);

    let rightColumnHeaderText = document.createElement('p');
    rightColumnHeaderText.classList.add('column-header-text','black-outline');
    rightColumnHeaderText.innerHTML = 'Mode Stats';
    rightColumnHeader.appendChild(rightColumnHeaderText);

    let mapProgressCoopToggle = document.createElement('div');
    mapProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    rightColumnHeader.appendChild(mapProgressCoopToggle);

    let mapProgressCoopToggleText = document.createElement('p');
    mapProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
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
        mapStatsDiv.classList.add('map-stats-div');
        mapStatsContainer.appendChild(mapStatsDiv);

        let mapStatsIcon = document.createElement('img');
        mapStatsIcon.classList.add('map-stats-icon');
        mapStatsIcon.src = getModeIcon(difficulty);
        mapStatsDiv.appendChild(mapStatsIcon);

        let mapStatsTextDiv = document.createElement('div');
        mapStatsTextDiv.classList.add('map-stats-text-div');
        mapStatsDiv.appendChild(mapStatsTextDiv);

        let mapStatsDifficultyText = document.createElement('p');
        mapStatsDifficultyText.classList.add('map-stats-text-mode','black-outline');
        mapStatsDifficultyText.innerHTML = getLocValue(`Mode ${difficulty}`);
        mapStatsTextDiv.appendChild(mapStatsDifficultyText);

        let mapStatsText = document.createElement('p');
        mapStatsText.classList.add('map-stats-text');
        mapStatsText.innerHTML = `Times Completed: ${data.timesCompleted}`;
        mapStatsTextDiv.appendChild(mapStatsText);

        let mapStatsBestRound = document.createElement('p');
        mapStatsBestRound.classList.add('map-stats-text');
        mapStatsBestRound.innerHTML = `Best Round: ${data.bestRound}`;
        mapStatsTextDiv.appendChild(mapStatsBestRound);
    }

    if (mapStatsContainer.innerHTML == "") {
        let noDataFound = document.createElement('p');
        noDataFound.classList.add('no-data-found','black-outline');
        noDataFound.innerHTML = "No Data Available. Try switching the Coop Toggle";
        mapStatsContainer.appendChild(noDataFound);
    }
}

function generateMapsGridView(){
    let mapsProgressContainer = document.getElementById('maps-progress-container');
    mapsProgressContainer.innerHTML = "";

    let mapsGridContainer = document.createElement('div');
    mapsGridContainer.classList.add('maps-grid-container');
    mapsProgressContainer.appendChild(mapsGridContainer);

    for (let [map, difficulty] of Object.entries(constants.mapsInOrder)) {
        if (processedMapData.Borders[coopEnabled ? "coop" : "single"][map] == null) { continue; }
        if (currentDifficultyFilter != "All" && difficulty != currentDifficultyFilter) { continue; }


        let mapDiv = document.createElement('div');
        mapDiv.classList.add('map-div', 'pointer');
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
        mapImg.classList.add('map-img');
        mapImg.src = getMapIcon(map);
        mapDiv.appendChild(mapImg);

        let mapName = document.createElement('p');
        mapName.classList.add(`map-name`,'black-outline');
        mapName.innerHTML = getLocValue(map);
        mapDiv.appendChild(mapName);

        let mapProgress = document.createElement('div');
        mapProgress.classList.add(`map-progress`);
        mapDiv.appendChild(mapProgress);

        mapDiv.addEventListener('click', () => {
            onSelectMap(map);
            addToBackQueue({callback: onExitMap});
        })
    }
}

function generateMapsListView(){
    let mapsProgressContainer = document.getElementById('maps-progress-container');
    mapsProgressContainer.innerHTML = "";

    let mapsListContainer = document.createElement('div');
    mapsListContainer.classList.add('maps-list-container');
    mapsProgressContainer.appendChild(mapsListContainer);

    let fragment = document.createDocumentFragment();

    let colorToggle = false;
    for (let [map, difficulty] of Object.entries(constants.mapsInOrder)) {
        if (processedMapData.Borders[coopEnabled ? "coop" : "single"][map] == null) { continue; }
        if (currentDifficultyFilter != "All" && difficulty != currentDifficultyFilter) { continue; }
        if (Object.entries(coopEnabled ? processedMapData.Maps[map].coop : processedMapData.Maps[map].single).every(([key, value]) => value == undefined)) { continue;}

        let mapContainer = document.createElement('div');
        mapContainer.classList.add('map-container');
        colorToggle ? mapContainer.style.backgroundColor = "var(--profile-secondary)" : mapContainer.style.backgroundColor = "var(--profile-tertiary)"; ;
        colorToggle = !colorToggle;
        fragment.appendChild(mapContainer);

        let mapDiv = document.createElement('div');
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
        mapImg.classList.add('map-img');
        mapImg.src = getMapIcon(map);
        mapDiv.appendChild(mapImg);

        let mapName = document.createElement('p');
        mapName.classList.add(`map-name`,'black-outline');
        mapName.innerHTML = getLocValue(map);
        mapDiv.appendChild(mapName);

        let mapSections = document.createElement('div');
        mapSections.classList.add(`map-sections`);
        mapContainer.appendChild(mapSections);

        let mapSection = document.createElement('div');
        mapSection.classList.add(`map-section`);
        mapSections.appendChild(mapSection);

        let mapLabelMedals = document.createElement('p');
        mapLabelMedals.classList.add(`map-label-medals`,'black-outline');
        mapSection.appendChild(mapLabelMedals);

        let mapLabelBestRound = document.createElement('p');
        mapLabelBestRound.classList.add(`map-label-rounds`,'black-outline');
        mapLabelBestRound.innerHTML = "Best Round:";
        mapSection.appendChild(mapLabelBestRound);

        let mapLabelTimesCompleted = document.createElement('p');
        mapLabelTimesCompleted.classList.add(`map-label-completed`,'black-outline');
        mapLabelTimesCompleted.innerHTML = "Times Completed:";
        mapSection.appendChild(mapLabelTimesCompleted);

        for (let [difficulty, data] of Object.entries(coopEnabled ? processedMapData.Maps[map].coop : processedMapData.Maps[map].single)) {
            if (data == undefined) { continue; }
            let mapSectionColumn = document.createElement('div');
            mapSectionColumn.classList.add(`map-section-column`);
            mapSections.appendChild(mapSectionColumn);

            let mapSectionMedal = document.createElement('div');
            mapSectionMedal.classList.add(`map-section-medal`);
            mapSectionColumn.appendChild(mapSectionMedal);

            let mapSectionMedalImg = document.createElement('img');
            mapSectionMedalImg.classList.add(`map-section-medal-img`);
            mapSectionMedalImg.src = getMedalIcon(difficulty == "Clicks" && data.completedWithoutLoadingSave ? `Medal${coopEnabled ? "Coop" : ""}${medalMap["CHIMPS-BLACK"]}` : `Medal${coopEnabled ? "Coop" : ""}${medalMap[difficulty]}`);
            mapSectionMedalImg.style.display = "none";

            if (!data.completed && data.bestRound < constants.endRound[difficulty] && !data.completedWithoutLoadingSave) { mapSectionMedalImg.style.filter = "brightness(0.5)" } ;
             mapSectionMedalImg.addEventListener('load', () => {
                if(mapSectionMedalImg.width < mapSectionMedalImg.height){
                    mapSectionMedalImg.style.width = `${ratioCalc(3,70,256,0,mapSectionMedalImg.width)}px`
                } else {
                    mapSectionMedalImg.style.height = `${ratioCalc(3,70,256,0,mapSectionMedalImg.height)}px`
                }
                mapSectionMedalImg.style.removeProperty('display');
            })
            mapSectionMedal.appendChild(mapSectionMedalImg);

            tippy(mapSectionMedal, {
                content: constants.medalLabels[`Medal${coopEnabled ? "Coop" : ""}${medalMap[difficulty]}`],
                placement: 'top',
                theme: 'speech_bubble'
            })

            let mapSectionBestRound = document.createElement('p');
            mapSectionBestRound.classList.add(`map-section-text`,'black-outline');
            mapSectionBestRound.innerHTML = data.bestRound;
            mapSectionColumn.appendChild(mapSectionBestRound);

            let mapSectionTimesCompleted = document.createElement('p');
            mapSectionTimesCompleted.classList.add(`map-section-text`,'black-outline');
            mapSectionTimesCompleted.innerHTML = data.timesCompleted;
            mapSectionColumn.appendChild(mapSectionTimesCompleted);
        }

        mapDiv.addEventListener('click', () => {
            onSelectMap(map);
            addToBackQueue({callback: onExitMap});
        })
    }
    mapsListContainer.appendChild(fragment);
}

function generateMapsGameView() {
    let mapsProgressContainer = document.getElementById('maps-progress-container');
    mapsProgressContainer.innerHTML = "";

    let mapsGameContainer = document.createElement('div');
    mapsGameContainer.classList.add('maps-game-container');
    mapsProgressContainer.appendChild(mapsGameContainer);

    let maps = Object.keys(constants.mapsInOrder).filter(value => Object.keys(btd6usersave.mapProgress).includes(value)); //Object.keys(constants.mapsInOrder);
    if (currentDifficultyFilter != "All") { maps = maps.filter(map => constants.mapsInOrder[map] == currentDifficultyFilter) }
    let maxPage = Math.ceil(maps.length / 6) - 1;
    if (mapPage > maxPage) { mapPage = 0; }
    if (mapPage < 0) { mapPage = maxPage; }
    let mapsToDisplay = maps.slice(mapPage * 6, mapPage * 6 + 6);

    let mapPrevArrow = document.createElement('div');
    mapPrevArrow.classList.add('map-arrow');
    mapsGameContainer.appendChild(mapPrevArrow);

    let mapPrevArrowImg = document.createElement('img');
    mapPrevArrowImg.classList.add('map-arrow-img');
    mapPrevArrowImg.src = "./Assets/UI/PrevArrow.png";
    mapPrevArrow.appendChild(mapPrevArrowImg);

    let mapsGameGrid = document.createElement('div');
    mapsGameGrid.classList.add('maps-game-grid');
    mapsGameContainer.appendChild(mapsGameGrid);

    for (let map of mapsToDisplay) {
        let mapDiv = document.createElement('div');
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
        mapImg.classList.add('map-img-ingame');
        mapImg.src = getMapIcon(map);
        mapDiv.appendChild(mapImg);

        let mapName = document.createElement('p');
        mapName.classList.add(`map-name`,'black-outline');
        mapName.innerHTML = getLocValue(map);
        mapDiv.appendChild(mapName);

        for (let [difficulty, completed] of (coopEnabled ? Object.entries(processedMapData.Medals.coop[map]) : Object.entries(processedMapData.Medals.single[map]))) {
            if (completed == null) { continue; }
            let medalDiv = document.createElement('div');
            let largeMedals = ["Easy", "Medium", "Hard", "Impoppable"]
            largeMedals.includes(difficulty) ? medalDiv.classList.add('medal-div-large') : medalDiv.classList.add('medal-div-small');
            medalDiv.classList.add(`medal-div-${difficulty.toLowerCase()}`);
            mapDiv.appendChild(medalDiv);
    
            let medalImg = document.createElement('img');
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
            addToBackQueue({callback: onExitMap});
        })
    }

    let mapNextArrow = document.createElement('div');
    mapNextArrow.classList.add('map-arrow');
    mapsGameContainer.appendChild(mapNextArrow);

    let mapNextArrowImg = document.createElement('img');
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
    mapPageDots.classList.add('map-page-dots');
    mapsProgressContainer.appendChild(mapPageDots);

    for (let i = 0; i <= maxPage; i++) {
        let mapPageDot = document.createElement('div');
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
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    let powersProgressContainer = document.createElement('div');
    powersProgressContainer.classList.add('powers-progress-container');
    progressContent.appendChild(powersProgressContainer);

    for (let power of constants.powersInOrder) {
        if(!btd6usersave.powers.hasOwnProperty(power)) { continue; }
        let powerDiv = document.createElement('div');
        powerDiv.classList.add('power-div');
        powersProgressContainer.appendChild(powerDiv);

        if(constants.powersIAP.includes(power)) { powerDiv.style.backgroundImage = "url(../Assets/UI/PowerIAPContainer.png)"}

        let powerImg = document.createElement('img');
        powerImg.classList.add('power-img');
        powerImg.src = getPowerIcon(power);
        powerDiv.appendChild(powerImg);

        let powerName = document.createElement('p');
        powerName.classList.add('power-name','black-outline');
        powerName.innerHTML = getLocValue(power);
        powerDiv.appendChild(powerName);

        let powerProgress = document.createElement('div');
        powerProgress.classList.add('power-progress');
        powerDiv.appendChild(powerProgress);

        let powerProgressText = document.createElement('p');
        powerProgressText.classList.add('power-progress-text','black-outline');
        powerProgressText.innerHTML = `${btd6usersave.powers[power].quantity || 0}`;
        powerProgress.appendChild(powerProgressText);
    }
}

function generateInstaMonkeysProgress() {
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    let instaMonkeysHeaderBar = document.createElement('div');
    instaMonkeysHeaderBar.classList.add('insta-monkeys-header-bar');
    progressContent.appendChild(instaMonkeysHeaderBar);

    let instaMonkeysViews = document.createElement('div');
    instaMonkeysViews.classList.add('maps-progress-views');
    instaMonkeysHeaderBar.appendChild(instaMonkeysViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressViewsText.classList.add('black-outline');
    mapsProgressViewsText.innerHTML = "View Type:";
    instaMonkeysViews.appendChild(mapsProgressViewsText);


    let instaMonkeysGameView = document.createElement('div');
    instaMonkeysGameView.id = 'insta-monkeys-game-view';
    instaMonkeysGameView.classList.add('maps-progress-view','black-outline');
    instaMonkeysGameView.innerHTML = "Game";
    instaMonkeysGameView.addEventListener('click', () => {
        currentInstaView = "game";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysViews.appendChild(instaMonkeysGameView);

    let instaMonkeysListView = document.createElement('div');
    instaMonkeysListView.id = 'insta-monkeys-list-view';
    instaMonkeysListView.classList.add('maps-progress-view','black-outline');
    instaMonkeysListView.innerHTML = "List";
    instaMonkeysListView.addEventListener('click', () => {
        currentInstaView = "list";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysViews.appendChild(instaMonkeysListView);

    let instaMonkeysAllView = createEl('div', {
        classList: ['maps-progress-view','black-outline'],
        id: 'insta-monkeys-all-view',
        innerHTML: 'All'
    })
    instaMonkeysAllView.addEventListener('click', () => {
        currentInstaView = "all";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysViews.appendChild(instaMonkeysAllView);

    let instaMonkeyProgressText = document.createElement('p');
    instaMonkeyProgressText.id = "insta-total-counter";
    instaMonkeyProgressText.classList.add('insta-monkey-progress-text','insta-total-counter','black-outline');
    instaMonkeyProgressText.innerHTML = `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
    instaMonkeysHeaderBar.appendChild(instaMonkeyProgressText);

    let instaMonkeysExtras = document.createElement('div');
    instaMonkeysExtras.classList.add('maps-progress-views');
    instaMonkeysHeaderBar.appendChild(instaMonkeysExtras);

    let instaMonkeysObtainView = document.createElement('div');
    instaMonkeysObtainView.id = 'insta-monkeys-obtain-view';
    instaMonkeysObtainView.classList.add('maps-progress-view','black-outline');
    // instaMonkeysObtainView.innerHTML = "Where To Get";
    instaMonkeysObtainView.innerHTML = "Get More";
    instaMonkeysObtainView.addEventListener('click', () => {
        currentInstaView = "obtain";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysExtras.appendChild(instaMonkeysObtainView);

    let instaMonkeysCollectionView = document.createElement('div');
    instaMonkeysCollectionView.id = 'insta-monkeys-collection-view';
    instaMonkeysCollectionView.classList.add('maps-progress-view','black-outline');
    instaMonkeysCollectionView.innerHTML = "Collection Event";
    instaMonkeysCollectionView.addEventListener('click', () => {
        currentInstaView = "collection";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysExtras.appendChild(instaMonkeysCollectionView);

    let instaMonkeysProgressContainer = document.createElement('div');
    instaMonkeysProgressContainer.id = 'insta-monkeys-progress-container';
    instaMonkeysProgressContainer.classList.add('insta-monkeys-progress-container');
    progressContent.appendChild(instaMonkeysProgressContainer);

    let instaMonkeyProgressContainer = document.createElement('div');
    instaMonkeyProgressContainer.id = 'insta-monkey-progress-container';
    instaMonkeyProgressContainer.classList.add('insta-monkey-progress-container');
    instaMonkeyProgressContainer.style.display = "none";
    progressContent.appendChild(instaMonkeyProgressContainer);

    onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
}

function onChangeInstaMonkeysView(instaMonkeysHeaderBar, view) {
    document.getElementById('insta-monkeys-progress-container').style.removeProperty('display');
    document.getElementById('insta-monkey-progress-container').style.display = "none";
    let instaTabs = ['game','list','all','obtain','collection'];
    instaTabs.forEach(tab => {
        document.getElementById(`insta-monkeys-${tab}-view`).classList.remove('stats-tab-yellow');
    })
    document.getElementById(`insta-monkeys-${view}-view`).classList.add('stats-tab-yellow');
    switch (view) {
        case "game":
            instaMonkeysHeaderBar.classList.remove('border-top-only');
            generateInstaGameView();
            break;
        case "list":
            instaMonkeysHeaderBar.classList.remove('border-top-only');
            generateInstaListView();
            break;
        case "all": 
            instaMonkeysHeaderBar.classList.remove('border-top-only');
            generateInstaAllView();
            break;
        case "obtain":
            instaMonkeysHeaderBar.classList.add('border-top-only');
            generateInstaObtainGuide();
            break;
        case "collection":
            instaMonkeysHeaderBar.classList.add('border-top-only');
            generateInstaCollectionEventHelper();
            break;
    }
}

function generateInstaGameView(){
    let instaMonkeysProgressContainer = document.getElementById('insta-monkeys-progress-container');
    instaMonkeysProgressContainer.innerHTML = "";

    let instaMonkeyGameContainer = document.createElement('div');
    instaMonkeyGameContainer.classList.add('insta-monkey-game-container');
    instaMonkeysProgressContainer.appendChild(instaMonkeyGameContainer);

    let towersContainer = document.createElement('div');
    towersContainer.classList.add('towers-container');
    instaMonkeyGameContainer.appendChild(towersContainer);


    let firstInstas = [], grayInstas = [];
    Object.keys(constants.towersInOrder).forEach(key => {
        if(!Object.keys(btd6usersave.unlockedTowers).includes(key)) {return}
        if (processedInstaData.TowerTotal[key] !== undefined) {
            firstInstas.push(key);
        } else {
            grayInstas.push(key);
        }
    });

    firstInstas.concat(grayInstas).forEach(tower => {
        let towerContainer = document.createElement('div');
        towerContainer.classList.add('tower-container');
        towerContainer.style.backgroundImage = `url(./Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower] || ""}.png)`
        towerContainer.addEventListener('click', () => {
            onSelectInstaTower(tower);
        })
        towersContainer.appendChild(towerContainer);

        let towerImg = document.createElement('img');
        towerImg.classList.add(`tower-img`);
        towerImg.src = getInstaContainerIcon(tower,'000');
        towerContainer.appendChild(towerImg);

        let towerName = document.createElement('p');
        towerName.classList.add(`tower-name`,'black-outline');
        towerName.innerHTML = getLocValue(tower);
        towerContainer.appendChild(towerName);

        if (processedInstaData.TowerTotal[tower] != undefined) { 
            let towerTotalDiv = document.createElement('p');
            towerTotalDiv.classList.add(`insta-progress`);
            towerContainer.appendChild(towerTotalDiv);

            let towerTotal = document.createElement('p');
            towerTotal.classList.add(`power-progress-text`,'black-outline');
            towerTotal.innerHTML = processedInstaData.TowerTotal[tower] || 0;
            towerTotalDiv.appendChild(towerTotal);
        } else {
            towerContainer.classList.add('insta-tower-container-none');
        }
    }) 
}

function generateInstaAllView() {
    let instaMonkeysProgressContainer = document.getElementById('insta-monkeys-progress-container');
    instaMonkeysProgressContainer.innerHTML = "";

    let instaMonkeysAllDiv = createEl('div', {
        classList: ['d-flex', 'fd-column', 'ai-center', 'w-100'],
        style: {
            // padding: "0px 20px"
        }
    })
    instaMonkeysProgressContainer.appendChild(instaMonkeysAllDiv);

    let allTopBar = createEl('div', {
        classList: ["d-flex", 'ai-center', 'jc-between', 'w-100'],
        style: {
            margin: "10px 90px 0px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.25)"
        }
    })
    instaMonkeysAllDiv.appendChild(allTopBar);
    

    let tierCounts = {}
    for(let tierIndex = 1; tierIndex<6; tierIndex++){
        tierCounts[tierIndex] = 0;
        Object.entries(processedInstaData.TowerUsableByTier).forEach(([tower, tiers]) => {
            tierCounts[tierIndex] += parseInt(tiers[tierIndex]);
        })
    }
    
    let tierCountsDiv = createEl('div', {
        classList: ['d-flex'],
        style: {
            gap: "20px",
            padding: "0 10px"
        }
    })
    allTopBar.appendChild(tierCountsDiv);

    Object.entries(tierCounts).forEach(([tier, count]) => {
        let tierLabelDiv = createEl('div', {
            classList: ['d-flex'],
            style: {
                gap: "4px"
            }
        })
        tierCountsDiv.appendChild(tierLabelDiv);

        let tierLabelText = createEl('p', {
            classList: [tier == 6 ? "t5-insta-outline" : 'black-outline', `insta-tier-text-${tier}`],
            style: {
                fontSize: '24px'
            },
            innerHTML: `T${tier}:`
        })
        tierLabelDiv.appendChild(tierLabelText);

        let tierLabelCount = createEl('p', {
            classList: ['black-outline'],
            style: {
                fontSize: '24px'
            },
            innerHTML: `${count}`
        })
        tierLabelDiv.appendChild(tierLabelCount);
    })

    let dropdownSort = generateDropdown("Sort By:", ["Highest Count", "Tier (Ascending)", "Tier (Descending)", "Tower Type"], allInstaFilter, (value) => {
        allInstaFilter = value;
        generateInstaAllView();
    })
    allTopBar.appendChild(dropdownSort);

    let allInstas = []
    Object.entries(btd6usersave.instaTowers).forEach(([tower, data]) => {
        constants.collectionOrder.forEach(tiers => {
            if (data.hasOwnProperty(tiers)) {
                let count = data[tiers];
                if(count == 0) return;
                allInstas.push({
                    tower: tower,
                    tiers: tiers,
                    count: count,
                    instaTier: Math.max(...tiers) || 1
                })
            }
        })
    })

    switch(allInstaFilter) {
        case "Highest Count":
            allInstas.sort((a, b) => {
                return b.count - a.count;
            })
            break;
        case "Tier (Ascending)":
            allInstas.sort((a, b) => {
                return b.instaTier - a.instaTier;
            })
            break;
        case "Tier (Descending)":
            allInstas.sort((a, b) => {
                return a.instaTier - b.instaTier;
            })
            break;
    }

    let instaMonkeyIconsContainer = createEl('div', {
        classList: ['insta-monkey-icons-container']
    })
    instaMonkeysAllDiv.appendChild(instaMonkeyIconsContainer);

    allInstas.forEach((insta) => {
        let instaMonkeyContainer = createEl('div', {
            classList: ['insta-monkey-tier-container'],
        })
        instaMonkeyIconsContainer.appendChild(instaMonkeyContainer)

        let towerTotalDiv = createEl('p', {
            classList: [`insta-progress`,'insta-tier-scale']
        });
        instaMonkeyContainer.appendChild(towerTotalDiv);

        let towerTotal = createEl('p', {
            classList: [`power-progress-text`,'black-outline'],
            innerHTML: insta.count
        });
        towerTotalDiv.appendChild(towerTotal);

        let instaMonkeyTierImg = createEl('img', {
            classList: ['insta-monkey-tier-img'],
            src: getInstaMonkeyIcon(insta.tower,insta.tiers),
            loading: 'lazy'
        });
        instaMonkeyContainer.appendChild(instaMonkeyTierImg);

        let instaMonkeyTierText = createEl('p', {
            classList: ['insta-monkey-tier-text','black-outline'],
            innerHTML: `${insta.tiers[0]}-${insta.tiers[1]}-${insta.tiers[2]}`
        });
        instaMonkeyContainer.appendChild(instaMonkeyTierText);
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
    instaMonkeyProgressContainer.appendChild(instaMonkeyDiv);
    
    let instaMonkeyTopBar = document.createElement('div');
    instaMonkeyTopBar.classList.add('insta-monkey-top-bar');
    instaMonkeyDiv.appendChild(instaMonkeyTopBar);

    let instaPrevArrow = document.createElement('div');
    instaPrevArrow.classList.add('insta-arrow');
    instaPrevArrow.addEventListener('click', () => {
        onSelectInstaPrevArrow(tower);
    })
    instaMonkeyTopBar.appendChild(instaPrevArrow);

    let instaPrevArrowImg = document.createElement('img');
    instaPrevArrowImg.classList.add('map-arrow-img');
    instaPrevArrowImg.src = "./Assets/UI/PrevArrow.png";
    instaPrevArrow.appendChild(instaPrevArrowImg);

    let instaMonkeyHeaderDiv = document.createElement('div');
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
    instaNextArrow.classList.add('insta-arrow');
    instaNextArrow.addEventListener('click', () => {
        onSelectInstaNextArrow(tower);
    })
    instaMonkeyTopBar.appendChild(instaNextArrow);

    let instaNextArrowImg = document.createElement('img');
    instaNextArrowImg.classList.add('map-arrow-img');
    instaNextArrowImg.src = "./Assets/UI/NextArrow.png";
    instaNextArrow.appendChild(instaNextArrowImg);


    let instaProgressMissingToggle = document.createElement('div');
    instaProgressMissingToggle.classList.add('maps-progress-coop-toggle');  
    instaMonkeyHeaderDiv.appendChild(instaProgressMissingToggle);

    let instaProgressMissingToggleText = document.createElement('p');
    instaProgressMissingToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
    instaProgressMissingToggleText.innerHTML = "Missing: ";
    instaProgressMissingToggle.appendChild(instaProgressMissingToggleText);

    let instaProgressMissingToggleInput = document.createElement('input');
    instaProgressMissingToggleInput.classList.add('insta-progress-missing-toggle-input','MkOffRed');
    instaProgressMissingToggleInput.type = 'checkbox';
    instaProgressMissingToggleInput.addEventListener('change', () => {
        onSelectMissingToggle(instaProgressMissingToggleInput.checked)
    })
    instaProgressMissingToggleInput.checked = instasMissingToggle;
    instaProgressMissingToggle.appendChild(instaProgressMissingToggleInput);

    let instaMonkeyName = document.createElement('p');
    instaMonkeyName.classList.add('insta-monkey-name','black-outline');
    instaMonkeyName.innerHTML = getLocValue(tower);
    instaMonkeyHeaderDiv.appendChild(instaMonkeyName);

    let instaMonkeyProgress = document.createElement('div');
    instaMonkeyProgress.classList.add('insta-monkey-progress');
    instaMonkeyHeaderDiv.appendChild(instaMonkeyProgress);

    let instaMonkeyProgressText = document.createElement('p');
    instaMonkeyProgressText.classList.add('insta-monkey-progress-text','black-outline');
    instaMonkeyProgressText.innerHTML = `${processedInstaData.TowerTierTotals[tower] ? Object.values(processedInstaData.TowerTierTotals[tower]).reduce((a, b) => a + b, 0) : 0}/64`;
    instaMonkeyProgress.appendChild(instaMonkeyProgressText);

    let instaMonkeyMainContainer = document.createElement('div');
    instaMonkeyMainContainer.id = `${tower}-main-container`;
    instaMonkeyMainContainer.classList.add('insta-monkey-main-container', 'fd-column');
    instaMonkeyDiv.appendChild(instaMonkeyMainContainer);

    generateInstaMonkeyIcons(tower);
    onSelectMissingToggle(instaProgressMissingToggleInput.checked);
}

function generateInstaMonkeyIcons(tower){
    let instaMonkeyMainContainer = document.getElementById(`${tower}-main-container`);
    instaMonkeyMainContainer.innerHTML = "";

    let instaMonkeyTierTotalsTextDiv = createEl('div', {
        id: 'main-container-tier-totals',
        classList: ['d-flex', 'jc-evenly'],
        style: { display: "none", margin: '10px 90px 0 90px', padding: "10px", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.25)" }
    });
    instaMonkeyMainContainer.appendChild(instaMonkeyTierTotalsTextDiv);

    for (let [tier, tierTotal] of Object.entries(processedInstaData.TowerTierTotals[tower])) {
        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-tier-text-list', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
        instaMonkeyTierText.innerHTML = `${tierTotal}/${constants.instaTiers[tier].length}`;
        instaMonkeyTierTotalsTextDiv.appendChild(instaMonkeyTierText);
    }

    let instaMonkeyIconsContainer = document.createElement('div');
    instaMonkeyIconsContainer.classList.add('insta-monkey-icons-container');
    instaMonkeyMainContainer.appendChild(instaMonkeyIconsContainer);

    constants.collectionOrder.forEach(tiers => {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.classList.add('insta-monkey-tier-container');
        if (!btd6usersave.instaTowers.hasOwnProperty(tower) || !btd6usersave.instaTowers[tower][tiers]) { 
            instaMonkeyTierContainer.style.display = "none";
            instaMonkeyTierContainer.classList.add('insta-monkey-unobtained');
        }
        instaMonkeyIconsContainer.appendChild(instaMonkeyTierContainer);

        if (btd6usersave.instaTowers.hasOwnProperty(tower) && btd6usersave.instaTowers[tower][tiers] > 1){
            let towerTotalDiv = document.createElement('p');
            towerTotalDiv.classList.add(`insta-progress`,'insta-tier-scale');
            instaMonkeyTierContainer.appendChild(towerTotalDiv);

            let towerTotal = document.createElement('p');
            towerTotal.classList.add(`power-progress-text`,'black-outline');
            towerTotal.innerHTML = btd6usersave.instaTowers[tower][tiers];
            towerTotalDiv.appendChild(towerTotal);
        }

        let instaMonkeyTierImg = document.createElement('img');
        instaMonkeyTierImg.classList.add('insta-monkey-tier-img');
        instaMonkeyTierImg.src = btd6usersave.instaTowers.hasOwnProperty(tower) && btd6usersave.instaTowers[tower][tiers] != undefined ? getInstaMonkeyIcon(tower,tiers) : "./Assets/UI/InstaUncollected.png";
        instaMonkeyTierContainer.appendChild(instaMonkeyTierImg);

        if (btd6usersave.instaTowers.hasOwnProperty(tower) && btd6usersave.instaTowers[tower][tiers] == 0) {
            instaMonkeyTierImg.classList.add('upgrade-after-locked');
        }

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-tier-text','black-outline');
        instaMonkeyTierText.innerHTML = `${tiers[0]}-${tiers[1]}-${tiers[2]}`;
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);
    })
}

function onSelectMissingToggle(enabled){
    instasMissingToggle = enabled;
    for (let element of document.getElementsByClassName('insta-monkey-unobtained')) {
        element.style.display = instasMissingToggle ? "block" : "none";
    }
    document.getElementById('main-container-tier-totals').style.display = instasMissingToggle ? "flex" : "none";
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
    instaMonkeysListContainer.classList.add('insta-monkeys-list-container');
    instaMonkeysProgressContainer.appendChild(instaMonkeysListContainer);

    let instaMonkeysList = document.createElement('div');
    instaMonkeysList.classList.add('insta-monkeys-list');
    instaMonkeysListContainer.appendChild(instaMonkeysList);

    Object.keys(constants.towersInOrder).forEach(tower => {
        if(processedInstaData.TowerTierTotals[tower] == null) { return; }
        let instaMonkeyDiv = document.createElement('div');
        instaMonkeyDiv.classList.add('insta-monkey-div');
        instaMonkeysList.appendChild(instaMonkeyDiv);

        switch(processedInstaData.TowerBorders[tower]) {
            case "Gold":
                instaMonkeyDiv.classList.add("insta-list-gold");
                break;
            case "Black":
                instaMonkeyDiv.classList.add("insta-list-black");
                break;
        }

        let instaTowerContainer = document.createElement('div');
        instaTowerContainer.classList.add('tower-container');
        instaTowerContainer.style.backgroundImage = `url(./Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower] || ""}.png)`
        instaTowerContainer.addEventListener('click', () => {
            onSelectInstaTower(tower);
        })
        instaMonkeyDiv.appendChild(instaTowerContainer);

        let instaMonkeyImg = document.createElement('img');
        instaMonkeyImg.classList.add('tower-img');
        instaMonkeyImg.src = getInstaContainerIcon(tower,'000');
        instaTowerContainer.appendChild(instaMonkeyImg);

        let instaMonkeyName = document.createElement('p');
        instaMonkeyName.classList.add(`tower-name`,'black-outline');
        instaMonkeyName.innerHTML = getLocValue(tower);
        instaTowerContainer.appendChild(instaMonkeyName);

        let instaMonkeyTopBottom = document.createElement('div');
        instaMonkeyTopBottom.classList.add('insta-monkey-top-bottom');
        instaMonkeyDiv.appendChild(instaMonkeyTopBottom);

        let instaMonkeyProgress = document.createElement('div');
        instaMonkeyProgress.classList.add('insta-monkey-progress-list');
        instaMonkeyTopBottom.appendChild(instaMonkeyProgress);

        let instaMonkeyTotal = document.createElement('div');
        instaMonkeyTotal.classList.add('insta-monkey-total', 'd-flex', 'ai-center');
        instaMonkeyTotal.style.gap = "8px";
        instaMonkeyProgress.appendChild(instaMonkeyTotal);

        let instaMonkeysTotalLabelText = document.createElement('p');
        instaMonkeysTotalLabelText.classList.add('insta-monkey-progress-label-text','black-outline');
        instaMonkeysTotalLabelText.innerHTML = "Usable Instas:";
        instaMonkeyTotal.appendChild(instaMonkeysTotalLabelText);

        let instaMonkeysTotalText = document.createElement('p');
        instaMonkeysTotalText.classList.add('insta-monkey-total-text','black-outline');
        instaMonkeysTotalText.innerHTML = processedInstaData.TowerTotal[tower];
        instaMonkeyTotal.appendChild(instaMonkeysTotalText);

        let instaMonkeyTierProgress = document.createElement('div');
        instaMonkeyTierProgress.classList.add('insta-monkey-tier-progress', 'd-flex', 'ai-center');
        instaMonkeyTierProgress.style.gap = "8px";
        instaMonkeyProgress.appendChild(instaMonkeyTierProgress);

        let instaMonkeyProgressLabelText = document.createElement('p');
        instaMonkeyProgressLabelText.classList.add('insta-monkey-progress-label-text','black-outline');
        instaMonkeyProgressLabelText.innerHTML = "Unique Instas:";
        instaMonkeyTierProgress.appendChild(instaMonkeyProgressLabelText);

        let instaMonkeyProgressText = document.createElement('p');
        instaMonkeyProgressText.classList.add('insta-monkey-progress-text','black-outline');
        instaMonkeyProgressText.innerHTML = `${Object.values(processedInstaData.TowerTierTotals[tower]).reduce((a, b) => a + b, 0)}/64`;
        instaMonkeyTierProgress.appendChild(instaMonkeyProgressText);

        let instaMonkeyTiersContainer = document.createElement('div');
        instaMonkeyTiersContainer.classList.add('insta-monkey-tiers-container');
        instaMonkeyTopBottom.appendChild(instaMonkeyTiersContainer);

        let instaMonkeyTiersLabel = document.createElement('p');
        instaMonkeyTiersLabel.classList.add('insta-monkey-tiers-label','black-outline');
        instaMonkeyTiersLabel.innerHTML = "Unique By Tier:";
        instaMonkeyTiersContainer.appendChild(instaMonkeyTiersLabel);

        for (let [tier, tierTotal] of Object.entries(processedInstaData.TowerTierTotals[tower])) {
            let instaMonkeyTierDiv = document.createElement('div');
            instaMonkeyTierDiv.classList.add('insta-monkey-tier-div');
            instaMonkeyTiersContainer.appendChild(instaMonkeyTierDiv);

            let instaMonkeyTierText = document.createElement('p');
            instaMonkeyTierText.classList.add('insta-monkey-tier-text-list', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierDiv.style.backgroundImage = `url(./Assets/UI/InstaTier${tier}Container.png)`
            instaMonkeyTierText.innerHTML = `${tierTotal}/${constants.instaTiers[tier].length}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierText);
        }
    })
}

function generateInstaObtainGuide() {
    let progressContent = document.getElementById('insta-monkeys-progress-container');
    progressContent.innerHTML = "";

    let obtainGuideDiv = document.createElement('div');
    obtainGuideDiv.classList.add('insta-monkeys-obtain-guide');
    progressContent.appendChild(obtainGuideDiv);

    let titleGuideText = document.createElement('p');
    titleGuideText.classList.add('insta-monkeys-guide-title-text','black-outline');
    titleGuideText.innerHTML = "Where To Get More Insta Monkeys";
    obtainGuideDiv.appendChild(titleGuideText);

    let methods = {
        "Collection": {
            "name": "Collection Events",
            "desc": "Collection events are the main way to get Insta Monkeys. They usually happen around holidays. During the event, collect as much of the event currency as possible to open crates that contain random Insta Monkeys. You can use the Collection Event tab to help you view the odds of getting a new Insta Monkey from each of the chest types."},
        "Daily": {
            "name": "Daily Challenges",
            "desc": "Daily Challenges often have random Insta Monkeys ranging from T1 to T3 as a reward. Coop Daily Challenges also give a random T1-T3 Insta Monkey. During a Collection event, these will give event currency for opening Insta Monkey chests."
        },
        "Boss": {
            "name": "Boss Events",
            "desc": "Boss events happen every week. Defeating the Tier 4 and Tier 5 bosses in these events give random Insta Monkeys. The Normal Boss rewards include a T2 and T3 Insta Monkey, and the Elite Boss rewards include a T3 and T4 Insta Monkey."
        },
        "Odyssey": {
            "name": "Odyssey Events",
            "desc": "Odyssey events give Insta Monkeys for completing the event and opening the chest. Medium difficulty usually gives a predetermined T3 Insta, and Hard gives a predetermined T4 Insta. During Collection events, Odysseys will give collection event currency instead for Insta Monkey chests."
        },
        "Ranked" : {
            "name": "Ranked Events",
            "desc": "Ranked events give random Insta Monkeys depending on your leaderboard placement. You can view Races, Bosses, and Contested Territory leaderboard rewards at the bottom right of the leaderboard. There is also a Mini Leaderboard for each event which gives extra rewards including Insta Monkeys."
        },
        "R100": {
            "name": "100 Rounds Rewards",
            "desc": "Every 100 rounds you complete in a game, you get a random Insta Monkey. The tier of the Insta Monkey is dependent on the difficulty of the map. Beginner gives T0-T2, Intermediate gives T1-T3, Advanced gives T2-T4, Expert gives T3-T4. Round 200 and beyond also guarantees T3-T4 regardless of difficulty."
        },
        "Chest": {
            "name": "Daily Chest",
            "desc": "The daily chest gives a random Insta Monkey on some days. The tiers range from T1-T4."
        },
        "Shop": {
            "name": "Shop",
            "desc": "Need more Instas? The shop has some Insta packs you can purchase."
        }
    }

    let instaMonkeyGuideContainer = document.createElement('div');
    instaMonkeyGuideContainer.classList.add('insta-monkey-guide-container');
    obtainGuideDiv.appendChild(instaMonkeyGuideContainer);

    Object.keys(methods).forEach(method => {
        let instaMonkeyGuideMethod = document.createElement('div');
        instaMonkeyGuideMethod.classList.add('insta-monkey-guide-method');
        instaMonkeyGuideContainer.appendChild(instaMonkeyGuideMethod);

        let instaMonkeyGuideTextDiv = document.createElement('div');
        instaMonkeyGuideTextDiv.classList.add('insta-monkey-guide-text-div');
        instaMonkeyGuideMethod.appendChild(instaMonkeyGuideTextDiv);

        let instaMonkeyGuideMethodText = document.createElement('p');
        instaMonkeyGuideMethodText.classList.add('insta-monkey-guide-method-text','black-outline');
        instaMonkeyGuideMethodText.innerHTML = methods[method].name;
        instaMonkeyGuideTextDiv.appendChild(instaMonkeyGuideMethodText);

        let instaMonkeyGuideMethodDesc = document.createElement('p');
        instaMonkeyGuideMethodDesc.classList.add('insta-monkey-guide-method-desc');
        instaMonkeyGuideMethodDesc.innerHTML = methods[method].desc;
        instaMonkeyGuideTextDiv.appendChild(instaMonkeyGuideMethodDesc);

        let instaMonkeyImage = document.createElement('img');
        instaMonkeyImage.classList.add('insta-monkey-guide-method-img');
        instaMonkeyImage.src = `./Assets/UI/Obtain${method}.png`;
        instaMonkeyGuideMethod.appendChild(instaMonkeyImage);
    })
}

function generateChestOddsModal() {
    let modalContent = document.createElement('div');

    let modalChestDesc = document.createElement('p');
    modalChestDesc.classList.add('collection-desc-text');
    modalChestDesc.innerHTML = "These are the standard odds. Certain events may change these, but they will be updated to be accurate when I update the site. Accurate as of 8/30/2024";
    modalContent.appendChild(modalChestDesc);

    let modalChestDivs = document.createElement('div');
    // modalChestDivs.classList.add('modal-help-divs');
    modalContent.appendChild(modalChestDivs);

    Object.entries(constants.collection.crateRewards.instaMonkey).forEach(([chest,data]) => {
        let chestContainer = document.createElement('div');
        chestContainer.classList.add('chest-container');
        modalChestDivs.appendChild(chestContainer);

        let chestImg = document.createElement('img');
        chestImg.classList.add('collection-event-chest-selector');
        chestImg.src = `./Assets/UI/EventMysteryBox${chestSelectorMap[chest]}Icon.png`;
        chestContainer.appendChild(chestImg);
        
        let chestTierDiv = document.createElement('div');
        chestTierDiv.classList.add('chest-tier-div');
        chestContainer.appendChild(chestTierDiv);

        Object.entries(data.tierChance).forEach(([tier, chance]) => {
            let tierContainer = document.createElement('div');
            tierContainer.classList.add('tier-container');
            chestTierDiv.appendChild(tierContainer);

            let tierImg = document.createElement('img');
            tierImg.classList.add('insta-monkey-tier-img');
            tierImg.src = `./Assets/UI/InstaRandomTier${tier}.png`;
            tierContainer.appendChild(tierImg);

            let tierText = document.createElement('p');
            tierText.classList.add('tier-text','black-outline');
            tierText.innerHTML = `${(chance * 100).toFixed(2)}%`;
            tierContainer.appendChild(tierText);
        })

        let chestQuantityDiv = document.createElement('div');
        chestQuantityDiv.classList.add('chest-quantity-div');
        chestContainer.appendChild(chestQuantityDiv);

        Object.entries(data.quantityChance).forEach(([quantity, chance]) => {
            let quantityContainer = document.createElement('div');
            quantityContainer.classList.add('quantity-container');
            chestQuantityDiv.appendChild(quantityContainer);

            let instaIconDiv = document.createElement('div');
            instaIconDiv.classList.add('insta-icon-div');
            quantityContainer.appendChild(instaIconDiv);

            let instaIcon = document.createElement('img');
            instaIcon.classList.add('insta-quantity-icon');
            instaIcon.src = `./Assets/UI/InstaIcon.png`;
            instaIconDiv.appendChild(instaIcon);

            let quantityLabel = document.createElement('p');
            quantityLabel.classList.add('bloon-group-number','black-outline');
            quantityLabel.innerHTML = `X${quantity}`;
            instaIconDiv.appendChild(quantityLabel);

            let quantityText = document.createElement('p');
            quantityText.classList.add('quantity-text','black-outline');
            quantityText.innerHTML = `${(chance * 100)}%`;
            quantityContainer.appendChild(quantityText);
        })
    })
    createModal({
        header: "Chest Base Odds",
        content: modalContent,
        classList: ['error-modal-overlay']
    });
}

function generateHowToUseModal() {
    let modalContent = document.createElement('div');

    let modalHelpDivs = document.createElement('div');
    // modalHelpDivs.classList.add('modal-help-divs');
    modalContent.appendChild(modalHelpDivs);

    let modelHelpText = {
        "What is a Collection Event?": "These are events that occur approximately every other month (usually around holidays) that allow you to earn some form of currency that count towards unlocking Insta Monkey chests. This is the best way for collectors to work on their Insta Monkey collection.",
        "What is a Featured Insta?": "Every 8 hours, a rotating select rotation of 4 Featured Insta Monkeys are available to select in collection events. Selecting a Featured Insta Monkey in-game will guarantee that Insta Monkeys recieved from the chest are of that tower type.",
        "What does this helper do?": "When opening chests, how do you know which Featured Insta Monkey is best to pick to have the highest chance of getting a new Insta Monkey for your collection? This helps you choose what to pick, read below to learn how.",
        "Start by Selecting a Chest": "Choose your current Collection Event chest type to set the type of chest to calculate the odds for.",
        "Choose a Featured Insta Monkey (Optional)": "If you choose a featured Insta Monkey below the chests, you will see the odds by tier and total chance for that Insta Monkey. Select the same one again to go back to All Towers.",
        "Entering Obtained Insta Monkeys": "At the bottom of selecting a featured Insta, you can see the missing Instas. Click on an Insta that you were missing to mark it as obtained manually until the API updates (takes at most 15 minutes).",
        "All Towers": "All Towers displays the chances of getting a new Insta Monkey relative to your entire collection in the selected chest as well as a combined list of all the chances you will see when selecting each Featured Insta.",
        "Featured Insta Odds List": "This is a great way to see which Featured Insta Monkey will be more likely to get a new Insta Monkey for your current chest type, including if it's better to let it go completely random with none selected!",
        "How are the chances calculated?": "The chances are calculated by first taking how likely a specific Insta is out of random Insta Tier roll, and then multiplying it by the chest's likelihood of getting that random tier as a roll. This chance is for each individual roll of an Insta, and does not account for the varying quantities of Instas in chests. For example, using this sample Monkey Sub information, we can calculate how likely getting a missing Tier 2 is from a Silver Chest by first taking the chance of rolling that Insta Monkey when rolling a Tier 2 Insta from the chest, and then multiplying it by the chance of getting a Tier 2 Insta from the chest. In reality, this is 1/12 * 40% which is equivalent to 3.33%."
    }

    Object.entries(modelHelpText).forEach(([text, desc], index) => {
        let modalHelpDiv = document.createElement('div');
        modalHelpDiv.classList.add('modal-help-div');
        modalHelpDivs.appendChild(modalHelpDiv);

        let modalHelpText = document.createElement('p');
        modalHelpText.classList.add('collection-header-title-text','black-outline');
        modalHelpText.innerHTML = text;
        modalHelpDiv.appendChild(modalHelpText);

        let modalHelpDesc = document.createElement('p');
        modalHelpDesc.classList.add('collection-desc-text');
        modalHelpDesc.innerHTML = desc;
        modalHelpDiv.appendChild(modalHelpDesc);

        let modalHelpImg = document.createElement('img');
        modalHelpImg.classList.add('collection-help-img');
        modalHelpImg.src = `./Assets/UI/CollectionHelp${index + 1}.png`;
        modalHelpDiv.appendChild(modalHelpImg);
    });
    
    createModal({
        header: 'How to Use This Helper',
        content: modalContent,
    })
}

async function generateInstaCollectionEventHelper(){
    let instaMonkeysProgressContainer = document.getElementById('insta-monkeys-progress-container');
    instaMonkeysProgressContainer.innerHTML = "";

    currentCollectionChest = "None"

    let instaMonkeyCollectionContainer = document.createElement('div');
    instaMonkeyCollectionContainer.classList.add('insta-monkey-collection-container');
    instaMonkeysProgressContainer.appendChild(instaMonkeyCollectionContainer);
    
    // let collectionHeaderTitleText = document.createElement('p');
    // collectionHeaderTitleText.classList.add('collection-header-title-text', 'black-outline');
    // collectionHeaderTitleText.innerHTML = "New Insta Monkey Chances";
    // instaMonkeyCollectionContainer.appendChild(collectionHeaderTitleText); 

    let instaMonkeyCollectionTopBtns = document.createElement('div');
    instaMonkeyCollectionTopBtns.classList.add('insta-monkey-collection-top-btns');
    instaMonkeyCollectionContainer.appendChild(instaMonkeyCollectionTopBtns);

    let howButton = document.createElement('p');
    howButton.classList.add('where-button','black-outline');
    howButton.style.width = "230px";
    howButton.innerHTML = 'How to Use This';
    howButton.addEventListener('click', () => {
        generateHowToUseModal();
    })
    instaMonkeyCollectionTopBtns.appendChild(howButton);

    let chestOddsButton = document.createElement('p');
    chestOddsButton.classList.add('where-button','black-outline');
    chestOddsButton.style.width = "230px";
    chestOddsButton.innerHTML = 'View Chest Odds';
    chestOddsButton.addEventListener('click', () => {
        generateChestOddsModal();
    })
    instaMonkeyCollectionTopBtns.appendChild(chestOddsButton);

    let current = await getLatestCollectionEvent();

    let now = new Date();
    if (current != null && now < new Date(current.end)) {
        let featuredInstaButton = document.createElement('p');
        featuredInstaButton.classList.add('where-button','black-outline');
        featuredInstaButton.style.width = "230px";
        featuredInstaButton.innerHTML = 'Featured Instas';
        featuredInstaButton.addEventListener('click', () => {
            addToBackQueue({ source: "profile", destination: "featured" });
            generateInstaSchedule();
            document.getElementById('profile-content').style.display = "none";
            document.getElementById('featured-content').style.display = "flex";
        })
        instaMonkeyCollectionTopBtns.appendChild(featuredInstaButton);
    }


    let instaMonkeyCollectionDescText = document.createElement('p');
    instaMonkeyCollectionDescText.classList.add('collection-desc-text');
    instaMonkeyCollectionDescText.innerHTML = "Select a chest to see the chances of obtaining a new Insta Monkey based on your current collection. You can also view the Featured list or select a Featured Insta below to check the odds for selecting them in the event. The percentages represent the odds for each Insta Monkey received, so if a chest yields 2 Insta Monkeys, the odds are for 1 Insta Monkey roll.";
    //instaMonkeyCollectionContainer.appendChild(instaMonkeyCollectionDescText);

    let collectionEventChestSelectors = document.createElement('div');
    collectionEventChestSelectors.classList.add('collection-event-chest-selectors');
    instaMonkeyCollectionContainer.appendChild(collectionEventChestSelectors);

    Object.keys(chestSelectorMap).forEach(chest => {
        let collectionEventChestSelector = document.createElement('img');
        collectionEventChestSelector.id = `collection-event-chest-selector-${chest}`;
        collectionEventChestSelector.classList.add('collection-event-chest-selector');
        collectionEventChestSelector.src = `./Assets/UI/EventMysteryBox${chestSelectorMap[chest]}Icon.png`;
        collectionEventChestSelector.addEventListener('click', () => {
            onSelectCollectionEventChest(chest);
        })
        collectionEventChestSelectors.appendChild(collectionEventChestSelector);
    })

    let collectionEventTowerSelectors = document.createElement('div');
    collectionEventTowerSelectors.classList.add('collection-event-tower-selectors');
    instaMonkeyCollectionContainer.appendChild(collectionEventTowerSelectors);

    Object.keys(constants.towersInOrder).forEach(tower => {
        if(!Object.keys(btd6usersave.unlockedTowers).includes(tower)) {return}
        let collectionEventTowerSelector = document.createElement('div');
        collectionEventTowerSelector.classList.add('collection-event-tower-selector');
        collectionEventTowerSelector.addEventListener('click', () => {
            currentCollectionTower === tower ? currentCollectionTower = "All" : currentCollectionTower = tower;
            for (element of document.getElementsByClassName('collection-event-tower-selector')) {
                element.classList.remove('collection-event-tower-selector-active');
            }
            if (currentCollectionTower != "All") { collectionEventTowerSelector.classList.add('collection-event-tower-selector-active') }
            generateCollectionEventTowerInfo(currentCollectionTower);
        })
        collectionEventTowerSelectors.appendChild(collectionEventTowerSelector);

        let collectionEventTowerImg = document.createElement('img');
        collectionEventTowerImg.classList.add('collection-tower-icon');
        collectionEventTowerImg.src = getInstaMonkeyIcon(tower,'000');
        collectionEventTowerSelector.appendChild(collectionEventTowerImg);
    })

    let collectionEventTowerInfo = document.createElement('div');
    collectionEventTowerInfo.id = 'collection-event-tower-info';
    collectionEventTowerInfo.classList.add('collection-event-tower-info');
    instaMonkeyCollectionContainer.appendChild(collectionEventTowerInfo);

    generateCollectionEventTowerInfo(currentCollectionTower);
}

function generateChances(tower){
    let chances = [];
    if(tower == "All") {
        for(let i = 1; i<6; i++) {
            let value = 0;
            Object.keys(constants.towersInOrder).forEach(tower => {
                if(!Object.keys(btd6usersave.unlockedTowers).includes(tower)) {return}
                value += processedInstaData.TowerMissingByTier[tower][i].length || 0;
            })
            chances.push(value > 0 ? value / (constants.instaTiers[i].length * Object.keys(btd6usersave.unlockedTowers).length) : 0);
        }
    } else {
        for(let i = 1; i<6; i++) {
            let value = processedInstaData.TowerMissingByTier[tower][i].length || 0;
            chances.push(value > 0 ? value / constants.instaTiers[i].length : 0);
        }
    }
    let tierChances = constants.collection.crateRewards.instaMonkey[currentCollectionChest].tierChance;
    chances.forEach((chance, index) => {
        let chestTierChance = tierChances[index + 1] || 0;
        chances[index] = chance * chestTierChance;
    })
    return chances;
}

function generateCollectionEventTowerInfo(tower) {
    if(currentCollectionChest == "None") {
        onSelectCollectionEventChest("wood");
    }

    let chances = generateChances(tower);

    let collectionEventTowerInfo = document.getElementById('collection-event-tower-info');
    collectionEventTowerInfo.innerHTML = "";

    let instaMonkeyAndMissingDiv = document.createElement('div');
    instaMonkeyAndMissingDiv.classList.add('insta-monkey-div', 'insta-monkey-collection-div');
    collectionEventTowerInfo.appendChild(instaMonkeyAndMissingDiv);

    let instaMonkeyDiv = document.createElement('div');
    instaMonkeyDiv.classList.add('insta-monkey-collection-main-div');
    instaMonkeyAndMissingDiv.appendChild(instaMonkeyDiv);

    if (tower != "All") {
        switch(processedInstaData.TowerBorders[tower]) {
            case "Gold":
                instaMonkeyAndMissingDiv.classList.add("insta-list-gold");
                break;
            case "Black":
                instaMonkeyAndMissingDiv.classList.add("insta-list-black");
                break;
        }
    }

    let instaTowerAndMissingToggle = document.createElement('div');
    instaTowerAndMissingToggle.classList.add('insta-tower-and-missing-toggle');
    if(tower == "All") { instaTowerAndMissingToggle.classList.add('insta-collection-all') }
    instaMonkeyDiv.appendChild(instaTowerAndMissingToggle);

    let instaTowerContainer = document.createElement('div');
    instaTowerContainer.classList.add('tower-container-collection');
    instaTowerContainer.style.backgroundImage = `url(./Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower] || ""}.png)`
    if(tower != "All") {
        instaTowerContainer.addEventListener('click', () => {
            onSelectInstaTower(tower);
        })
    }
    instaTowerAndMissingToggle.appendChild(instaTowerContainer);

    let instaMonkeyImg = document.createElement('img');
    instaMonkeyImg.classList.add('tower-img');
    instaMonkeyImg.src = tower == "All" ? "./Assets/UI/AllTowersIcon.png" : getInstaContainerIcon(tower,'000');
    instaTowerContainer.appendChild(instaMonkeyImg);

    let instaMonkeyName = document.createElement('p');
    instaMonkeyName.classList.add(`tower-name`,'black-outline');
    instaMonkeyName.innerHTML = tower == "All" ? "All Towers" : getLocValue(tower);
    instaTowerContainer.appendChild(instaMonkeyName);
    
    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.classList.add('insta-missing-toggle-div');  

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('insta-collection-missing-label','black-outline');
    mapsProgressCoopToggleText.innerHTML = "Show Missing: ";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggleInput.checked = collectionMissingToggle;
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);
    if(tower != "All") {
        instaTowerAndMissingToggle.appendChild(mapsProgressCoopToggle);
    }

    let instaMonkeyTopBottom = document.createElement('div');
    instaMonkeyTopBottom.classList.add('insta-monkey-top-bottom');
    instaMonkeyDiv.appendChild(instaMonkeyTopBottom);

    let instaMonkeyProgress = document.createElement('div');
    instaMonkeyProgress.classList.add('insta-monkey-progress-list');
    instaMonkeyTopBottom.appendChild(instaMonkeyProgress);

    let instaMonkeyTotal = document.createElement('div');
    instaMonkeyTotal.classList.add('insta-monkey-total');
    instaMonkeyProgress.appendChild(instaMonkeyTotal);

    let instaMonkeysTotalLabelText = document.createElement('p');
    instaMonkeysTotalLabelText.classList.add('insta-monkey-progress-label-text','black-outline');
    instaMonkeysTotalLabelText.innerHTML = "Usable Instas:";
    instaMonkeyTotal.appendChild(instaMonkeysTotalLabelText);

    let instaMonkeysTotalText = document.createElement('p');
    instaMonkeysTotalText.classList.add('insta-monkey-total-text','black-outline');
    instaMonkeysTotalText.innerHTML = tower == "All" ? Object.values(processedInstaData.TowerTotal).reduce((acc, amount) => acc + amount) : processedInstaData.TowerTotal[tower];
    instaMonkeyTotal.appendChild(instaMonkeysTotalText);

    let instaMonkeyTierProgress = document.createElement('div');
    instaMonkeyTierProgress.classList.add('insta-monkey-tier-progress');
    instaMonkeyProgress.appendChild(instaMonkeyTierProgress);

    let instaMonkeyProgressLabelText = document.createElement('p');
    instaMonkeyProgressLabelText.classList.add('insta-monkey-progress-label-text','black-outline');
    instaMonkeyProgressLabelText.innerHTML = "Unique Instas:";
    instaMonkeyTierProgress.appendChild(instaMonkeyProgressLabelText);

    let instaMonkeyProgressText = document.createElement('p');
    instaMonkeyProgressText.classList.add('insta-monkey-progress-text','black-outline');
    instaMonkeyProgressText.innerHTML = tower == "All" ? `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}` : `${Object.values(processedInstaData.TowerTierTotals[tower]).reduce((a, b) => a + b, 0)}/64`;
    instaMonkeyTierProgress.appendChild(instaMonkeyProgressText);

    let instaMonkeyNewChance = document.createElement('div');
    instaMonkeyNewChance.classList.add('insta-monkey-new-chance');
    instaMonkeyProgress.appendChild(instaMonkeyNewChance);

    let instaMonkeyNewChanceText = document.createElement('p');
    instaMonkeyNewChanceText.classList.add('insta-monkey-progress-label-text','black-outline');
    instaMonkeyNewChanceText.innerHTML = "Total New Chance:";
    instaMonkeyNewChance.appendChild(instaMonkeyNewChanceText);

    let instaMonkeyNewChanceValue = document.createElement('p');
    instaMonkeyNewChanceValue.classList.add('insta-monkey-total-chance-text','black-outline');
    instaMonkeyNewChance.appendChild(instaMonkeyNewChanceValue);

    let instaMonkeyTiersContainer = document.createElement('div');
    instaMonkeyTiersContainer.classList.add('insta-monkey-tiers-container');
    instaMonkeyTopBottom.appendChild(instaMonkeyTiersContainer);

    let instaMonkeyTiersLabel = document.createElement('p');
    instaMonkeyTiersLabel.classList.add('insta-monkey-tiers-label','black-outline');
    instaMonkeyTiersLabel.innerHTML = "Unique By Tier:";
    instaMonkeyTiersContainer.appendChild(instaMonkeyTiersLabel);

    let tierCounts = tower == "All" ? Object.entries([1, 2, 3, 4, 5].reduce((acc, key) => ({ ...acc, [key]: Object.values(processedInstaData.TowerTierTotals).map(tower => tower[key] || 0).reduce((a, b) => a + b, 0) }), {})) : Object.entries(processedInstaData.TowerTierTotals[tower]);
    for (let [tier, tierTotal] of tierCounts) {
        let instaMonkeyTierDiv = document.createElement('div');
        instaMonkeyTierDiv.classList.add('insta-monkey-tier-div');
        instaMonkeyTiersContainer.appendChild(instaMonkeyTierDiv);

        if (tower == "All") {
            let instaMonkeyTierText = document.createElement('p');
            instaMonkeyTierText.classList.add('insta-monkey-tier-text-list', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierDiv.style.backgroundImage = `url(./Assets/UI/InstaTier${tier}Container.png)`
            instaMonkeyTierText.innerHTML = `${tierTotal}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierText);

            let fractionBar = document.createElement('p');
            fractionBar.classList.add('insta-monkey-tier-fraction-bar', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierDiv.appendChild(fractionBar);

            let instaMonkeyTierTextBottom = document.createElement('p');
            instaMonkeyTierTextBottom.classList.add('insta-monkey-tier-text-list',`insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierTextBottom.innerHTML = `${constants.instaTiers[tier].length * Object.keys(constants.towersInOrder).length}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierTextBottom);
        } else {
            let instaMonkeyTierText = document.createElement('p');
            instaMonkeyTierText.classList.add('insta-monkey-tier-text-list', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierDiv.style.backgroundImage = `url(./Assets/UI/InstaTier${tier}Container.png)`
            instaMonkeyTierText.innerHTML = `${tierTotal}/${constants.instaTiers[tier].length}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierText);
        }
    }

    let instaMonkeyChanceContainer = document.createElement('div');
    instaMonkeyChanceContainer.classList.add('insta-monkey-chance-container');
    instaMonkeyTopBottom.appendChild(instaMonkeyChanceContainer);

    let instaMonkeyChanceText = document.createElement('p');
    instaMonkeyChanceText.classList.add('insta-monkey-tiers-label','black-outline');
    instaMonkeyChanceText.innerHTML = "New Chance:";
    instaMonkeyChanceContainer.appendChild(instaMonkeyChanceText);

    let outlineColor = "black-outline";

    if (tower != "All") {
        switch(processedInstaData.TowerBorders[tower]) {
            case "Gold":
                outlineColor = "knowledge-outline";
                break;
            case "Black":
                outlineColor = "leaderboard-outline";
                break;
        }
    }

    let chestTierChances = constants.collection.crateRewards.instaMonkey[currentCollectionChest].tierChance;

    for (let [tier, tierTotal] of tierCounts) {
        let instaMonkeyChance = document.createElement('div');
        instaMonkeyChance.classList.add('insta-monkey-chance-div');
        instaMonkeyChanceContainer.appendChild(instaMonkeyChance);

        let instaMonkeyChanceTier = document.createElement('p');
        instaMonkeyChanceTier.classList.add('insta-monkey-chance-text-list',outlineColor);
        instaMonkeyChanceTier.innerHTML = (chances[tier - 1] * 100).toFixed(2) + "%";
        instaMonkeyChance.appendChild(instaMonkeyChanceTier);
        if (chestTierChances.hasOwnProperty(tier) && chances[tier - 1] == 0) {
            let instaMonkeyImpossibleSlash = document.createElement('img');
            instaMonkeyImpossibleSlash.classList.add('insta-monkey-completed-tick');
            instaMonkeyImpossibleSlash.src = "./Assets/UI/TickGreenIcon.png";
            instaMonkeyChance.appendChild(instaMonkeyImpossibleSlash);
        } else if (chances[tier - 1] == 0) {
            instaMonkeyChanceTier.classList.add('insta-monkey-chance-zero');
        }
    }
    instaMonkeyNewChanceValue.innerHTML = `${(chances.reduce((a, b) => a + b, 0) * 100).toFixed(2)}%`;
    if (chances.reduce((a, b) => a + b, 0) == 0) {
        instaMonkeyNewChanceValue.classList.add('insta-monkey-chance-zero');
    } 

    let instaMonkeysMissingContainer = document.createElement('div');
    instaMonkeysMissingContainer.style.display = "none";
    instaMonkeysMissingContainer.classList.add('insta-monkeys-missing-container');
    instaMonkeyAndMissingDiv.appendChild(instaMonkeysMissingContainer);

    if(tower != "All") {
        mapsProgressCoopToggleInput.addEventListener('change', () => {
            instaMonkeysMissingContainer.style.display = mapsProgressCoopToggleInput.checked ? "flex" : "none";
            instaMonkeysMissingContainer.innerHTML = "";
            collectionMissingToggle = mapsProgressCoopToggleInput.checked;
            onSelectCollectionEventMissingToggle(instaMonkeysMissingContainer, tower, chances);
        })
    } else {
        // mapsProgressCoopToggleText.innerHTML = "Show Full List: ";
        // mapsProgressCoopToggleInput.addEventListener('change', () => {
        //     instaMonkeysMissingContainer.style.display = mapsProgressCoopToggleInput.checked ? "flex" : "none";
        //     collectionMissingToggle = mapsProgressCoopToggleInput.checked;
        //     openAllTowersList(instaMonkeysMissingContainer);
        // })
        instaMonkeysMissingContainer.style.display = "flex";
        openAllTowersList(instaMonkeysMissingContainer);
    }

    if(collectionMissingToggle && tower != "All") {
        instaMonkeysMissingContainer.style.display = "flex";
        onSelectCollectionEventMissingToggle(instaMonkeysMissingContainer, tower, chances);
    }
}

function onSelectCollectionEventChest(type) {
    currentCollectionChest = type;
    for (let element of document.getElementsByClassName('collection-event-chest-selector')) {
        element.classList.remove('chest-selected');
        element.classList.add('chest-unselected');
    }
    document.getElementById(`collection-event-chest-selector-${type}`).classList.add('chest-selected');
    generateCollectionEventTowerInfo(currentCollectionTower);
}

function onSelectCollectionEventMissingToggle(instaMonkeysMissingContainer, tower, chances) {
    function addInstaMonkeyIcon(towerType, tiers, obtained) {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.classList.add('insta-monkey-tier-container','insta-monkey-unobtained');
        instaMonkeysMissingContainer.appendChild(instaMonkeyTierContainer);

        let instaMonkeyTierImg = document.createElement('img');
        instaMonkeyTierImg.classList.add('insta-monkey-tier-img');
        instaMonkeyTierImg.src = getInstaMonkeyIcon(towerType,tiers);
        instaMonkeyTierContainer.appendChild(instaMonkeyTierImg);
        
        instaMonkeyTierImg.classList.add('upgrade-after-locked');

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-tier-text','black-outline');
        instaMonkeyTierText.innerHTML = `${tiers[0]}-${tiers[1]}-${tiers[2]}`;
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);

        if (obtained) {
            let instaMonkeyTierObtained = document.createElement('img');
            instaMonkeyTierObtained.classList.add('insta-monkey-tier-obtained');
            instaMonkeyTierObtained.src = "./Assets/UI/TickGreenIcon.png";
            instaMonkeyTierContainer.appendChild(instaMonkeyTierObtained);

            instaMonkeyTierContainer.addEventListener('click', () => {
                processedInstaData.TowerObtained[towerType] = processedInstaData.TowerObtained[towerType].filter(value => value != tiers);
                let key = Object.keys(constants.instaTiers).find(key => constants.instaTiers[key].includes(tiers));
                processedInstaData.TowerMissingByTier[towerType][key].push(tiers);
                delete btd6usersave.instaTowers[towerType][tiers];
                processedInstaData.TowerTierTotals[towerType][key] -= 1;
                btd6publicprofile.gameplay["instaMonkeyCollection"] -= 1;
                document.getElementById('insta-total-counter').innerHTML = `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
                calculateInstaBorder(towerType);
                generateCollectionEventTowerInfo(towerType);
            });
        } else {
            instaMonkeyTierContainer.addEventListener('click', () => {
                processedInstaData.TowerObtained[towerType].push(tiers);
                let key = Object.keys(constants.instaTiers).find(key => constants.instaTiers[key].includes(tiers));
                processedInstaData.TowerMissingByTier[towerType][key] = processedInstaData.TowerMissingByTier[towerType][key].filter(value => value != tiers);
                btd6usersave.instaTowers[towerType][tiers] = 0;
                processedInstaData.TowerTierTotals[towerType][key] += 1;
                btd6publicprofile.gameplay["instaMonkeyCollection"] += 1;
                document.getElementById('insta-total-counter').innerHTML = `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
                calculateInstaBorder(towerType);
                generateCollectionEventTowerInfo(towerType);
            })
        }
    }

    if (tower == "All") {
        Object.entries(processedInstaData.TowerMissingByTier).forEach(([tower, instas]) => {
            Object.entries(instas).forEach(([tier, missing]) => {
                if(chances[tier - 1] > 0) {
                    for(let value of missing) {
                        addInstaMonkeyIcon(tower, value);
                    }
                }
            })
        })
    } else {
        let missingInstas = Object.entries(processedInstaData.TowerMissingByTier[tower])
        .map(([key, insta]) => ({tier: key, insta}))
        .filter(({tier, insta}) => chances[tier - 1] > 0)
        .map(({insta}) => insta)
        .flat();

        missingInstas.forEach(tiers => {
            addInstaMonkeyIcon(tower, tiers, false);
        })

        let manualEntry = processedInstaData.TowerObtained[tower];

        manualEntry.forEach(tiers => {
            addInstaMonkeyIcon(tower, tiers, true);
        });

        if (missingInstas.length == 0 && manualEntry.length == 0) {
            let noneMissing = document.createElement('p');
            noneMissing.classList.add('no-data-found','none-collection','black-outline');
            noneMissing.innerHTML = "None Missing in this Chest Type!";
            instaMonkeysMissingContainer.appendChild(noneMissing);
        }
    }
}

function openAllTowersList(instaMonkeysMissingContainer){
    instaMonkeysMissingContainer.innerHTML = "";

    let chancesDict = {};
    chancesDict["NoFeatured"] = generateChances("All");
    Object.keys(constants.towersInOrder).forEach(tower => {
        chancesDict[tower] = generateChances(tower);
    })

    let sortedTowers = Object.keys(constants.towersInOrder);
    switch(collectionListSortType) {
        case "Highest Total Chance":
            sortedTowers = Object.keys(chancesDict).sort((a, b) => {
                let sumA = chancesDict[a].reduce((a, b) => a + b, 0);
                let sumB = chancesDict[b].reduce((a, b) => a + b, 0);
                return sumB - sumA;
            })
            break;
        case "In-Game Tower Order":
            break;
        case "Alphabetical Towers":
            sortedTowers = Object.keys(constants.towersInOrder).sort();
            break;
    }

    let titleAndSortDiv = document.createElement('div');
    titleAndSortDiv.classList.add('insta-monkey-title-container');
    instaMonkeysMissingContainer.appendChild(titleAndSortDiv);

    let titleText = document.createElement('p');
    titleText.classList.add('collection-header-list-text','black-outline');
    titleText.innerHTML = `Featured Insta Odds (${currentCollectionChest.toLocaleUpperCase()} ${currentCollectionChest == "wood" ? "Crate" : "Chest"})`;
    titleAndSortDiv.appendChild(titleText);

    let sortFilterDiv = document.createElement('div');
    sortFilterDiv.classList.add('insta-monkey-sort-container');
    titleAndSortDiv.appendChild(sortFilterDiv);

    let sortFilterText = document.createElement('p');
    sortFilterText.classList.add('insta-monkey-sort-label','black-outline');
    sortFilterText.innerHTML = "Sort By:";
    sortFilterDiv.appendChild(sortFilterText);

    let sortFilterSelect = document.createElement('select');
    sortFilterSelect.classList.add('map-progress-filter-difficulty-select');
    sortFilterSelect.addEventListener('change', () => {
    })
    sortFilterDiv.appendChild(sortFilterSelect);

    let sortOptions = ["Highest Total Chance", "In-Game Tower Order", "Alphabetical Towers"];
    sortOptions.forEach(option => {
        let sortOption = document.createElement('option');
        sortOption.value = option;
        sortOption.innerHTML = option;
        sortFilterSelect.appendChild(sortOption); 
    })

    sortFilterSelect.value = collectionListSortType;
    sortFilterSelect.addEventListener('change', () => {
        collectionListSortType = sortFilterSelect.value;
        openAllTowersList(instaMonkeysMissingContainer);
    })

    let headerRow = {
        "Tower Type": "white",
        "Tier 1 Chance": "insta-tier-text-1",
        "Tier 2 Chance": "insta-tier-text-2",
        "Tier 3 Chance": "insta-tier-text-3",
        "Tier 4 Chance": "insta-tier-text-4",
        "Tier 5 Chance": "insta-tier-text-5",
        "Total Chance": "white"
    }

    let instaMonkeyHeaderRow = document.createElement('div');
    instaMonkeyHeaderRow.classList.add('insta-monkey-header-container','insta-monkey-unobtained');
    instaMonkeysMissingContainer.appendChild(instaMonkeyHeaderRow);

    Object.entries(headerRow).forEach(([key, value]) => {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.classList.add('insta-monkey-header-container','insta-monkey-unobtained');
        instaMonkeyHeaderRow.appendChild(instaMonkeyTierContainer);

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-small-name-text','black-outline', value);
        instaMonkeyTierText.innerHTML = key;
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);
    })

    let chestTierChances = constants.collection.crateRewards.instaMonkey[currentCollectionChest].tierChance;

    sortedTowers.forEach(tower => {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.classList.add('insta-monkey-list-container','insta-monkey-unobtained');
        instaMonkeysMissingContainer.appendChild(instaMonkeyTierContainer);

        let instaMonkeyTierImg = document.createElement('img');
        instaMonkeyTierImg.classList.add('insta-monkey-list-img');
        instaMonkeyTierImg.src = tower == "NoFeatured" ? "./Assets/UI/InstaRandomTier1.png" : getInstaMonkeyIcon(tower,'000');
        instaMonkeyTierContainer.appendChild(instaMonkeyTierImg);

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-small-name-text','black-outline');
        instaMonkeyTierText.innerHTML = tower == "NoFeatured" ? "No Featured Selected" : getLocValue(tower);
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);

        let instaMonkeyTierChanceContainer = document.createElement('div');
        instaMonkeyTierChanceContainer.classList.add('insta-monkey-list-chance-container');
        instaMonkeyTierContainer.appendChild(instaMonkeyTierChanceContainer);

        chancesDict[tower].forEach((chance, index) => {
            let instaMonkeyChance = document.createElement('div');
            instaMonkeyChance.classList.add('insta-monkey-chance-div');
            instaMonkeyTierChanceContainer.appendChild(instaMonkeyChance);

            let instaMonkeyChanceTier = document.createElement('p');
            instaMonkeyChanceTier.classList.add('insta-monkey-chance-text-list','black-outline');
            instaMonkeyChanceTier.innerHTML = (chance * 100).toFixed(2) + "%";
            if (chestTierChances.hasOwnProperty(index + 1) && chance == 0) {
                let instaMonkeyImpossibleSlash = document.createElement('img');
                instaMonkeyImpossibleSlash.classList.add('insta-monkey-completed-tick');
                instaMonkeyImpossibleSlash.src = "./Assets/UI/TickGreenIcon.png";
                instaMonkeyChance.appendChild(instaMonkeyImpossibleSlash);
            } else if (chance == 0) {
                instaMonkeyChanceTier.classList.add('insta-monkey-chance-zero');
            }
            instaMonkeyChance.appendChild(instaMonkeyChanceTier);
        })

        let instaMonkeyTotalChance = document.createElement('div');
        instaMonkeyTotalChance.classList.add('insta-monkey-chance-div');
        instaMonkeyTierChanceContainer.appendChild(instaMonkeyTotalChance);

        let sumOfChances = chancesDict[tower].reduce((a, b) => a + b, 0);

        let instaMonkeyTotalChanceTier = document.createElement('p');
        instaMonkeyTotalChanceTier.classList.add('insta-monkey-chance-text-list','black-outline');
        instaMonkeyTotalChanceTier.innerHTML = (sumOfChances * 100).toFixed(2) + "%";
        if(sumOfChances == 0) {
            instaMonkeyTotalChanceTier.classList.add('insta-monkey-chance-zero');
        }
        instaMonkeyTotalChance.appendChild(instaMonkeyTotalChanceTier);
    })
}

function generateAbilities() {
    let abilitiesContent = document.getElementById('profile-content');
    abilitiesContent.innerHTML = "";

    let abilitiesHeaderBar = document.createElement('div');
    abilitiesHeaderBar.classList.add('insta-monkeys-header-bar', 'd-flex', 'jc-between', 'ai-center', 'w-100');
    abilitiesContent.appendChild(abilitiesHeaderBar);

    let abilities = {...btd6publicprofile.stats.abilitiesActivatedByName};
    switch(abilitiesFilter) {
        case "Most Used":
            abilities = Object.fromEntries(Object.entries(abilities).sort((a, b) => b[1] - a[1]));
            break;
        case "Least Used":
            abilities = Object.fromEntries(Object.entries(abilities).sort((a, b) => a[1] - b[1]));
            break;
    }

    let dropdownSort = generateDropdown("Sort By:", ["Most Used", "Least Used"], abilitiesFilter, (value) => {
        abilitiesFilter = value;
        generateAbilities();
    })
    dropdownSort.style.padding = "10px";
    abilitiesHeaderBar.appendChild(dropdownSort);

    let abilitiesTotalText = document.createElement('p');
    abilitiesTotalText.classList.add('abilities-total-text','black-outline');
    abilitiesTotalText.style.padding = "10px";
    abilitiesTotalText.style.fontSize = "22px";
    abilitiesTotalText.innerHTML = `Total Abilities Used: ${profileStats["Abilities Used"].toLocaleString()}`;
    abilitiesHeaderBar.appendChild(abilitiesTotalText);

    let abilitiesDiv = document.createElement('div');
    abilitiesDiv.classList.add('d-flex', 'f-wrap', 'ai-center', 'jc-center');
    abilitiesContent.appendChild(abilitiesDiv);

    Object.entries(abilities).forEach(([ability, uses]) => {
        if(constants.abilities[ability] == undefined) {return}
        let abilityData = constants.abilities[ability];

        let abilityContainer = document.createElement('div');
        // abilityContainer.style.width = '150px';
        // abilityContainer.style.height = '150px';
        abilityContainer.classList.add('ability-container');
        abilitiesDiv.appendChild(abilityContainer);

        let abilityImg = document.createElement('img');
        abilityImg.classList.add('ability-img','of-contain');
        abilityImg.style.width = "100px";
        abilityImg.style.height = "100px";
        abilityImg.src = `./Assets/AbilityIcon/${abilityData.icon}.png`;
        abilityContainer.appendChild(abilityImg);

        let abilityText = document.createElement('p');
        abilityText.classList.add('ability-text','black-outline');
        abilityText.style.width = "100px";
        abilityText.innerHTML = abilityData.displayName;
        abilityContainer.appendChild(abilityText);

        let usesCounter = document.createElement('p');
        usesCounter.classList.add('ability-uses-counter','black-outline');
        usesCounter.innerHTML = `${uses.toLocaleString()} uses`;
        abilityContainer.appendChild(usesCounter);

        tippy(abilityContainer, {
            content: abilityData.description,
            placement: 'top',
            theme: 'speech_bubble',
            popperOptions: {
                modifiers: [
                    {
                    name: 'preventOverflow',
                    options: {
                        boundary: 'viewport',
                        padding: {right: 18},
                    },
                    },
                ],
            },
        })
    });
}

function generateAchievementsProgress() {
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    let achievementsProgressContainer = document.createElement('div');
    achievementsProgressContainer.classList.add('achievements-progress-container');
    progressContent.appendChild(achievementsProgressContainer);

    let achievementsHeaderBar = document.createElement('div');
    achievementsHeaderBar.classList.add('achievements-header-bar');
    achievementsProgressContainer.appendChild(achievementsHeaderBar);
    
    let achievementsViews = document.createElement('div');
    achievementsViews.classList.add('maps-progress-views');
    achievementsHeaderBar.appendChild(achievementsViews);

    let mapProgressFilterDifficulty2 = document.createElement('div');
    mapProgressFilterDifficulty2.classList.add('map-progress-filter-difficulty');
    achievementsViews.appendChild(mapProgressFilterDifficulty2);

    let mapsProgressFilterDifficultyText2 = document.createElement('p');
    mapsProgressFilterDifficultyText2.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressFilterDifficultyText2.innerHTML = "Filter:";
    mapProgressFilterDifficulty2.appendChild(mapsProgressFilterDifficultyText2);

    let mapProgressFilterDifficultySelect2 = document.createElement('select');
    mapProgressFilterDifficultySelect2.classList.add('map-progress-filter-difficulty-select');

    let options2 = ["None",/*"Monkey Money",*/"Knowledge Points","Insta Monkeys","Hidden Achievements"]
    options2.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect2.appendChild(difficultyOption);
    })
    mapProgressFilterDifficulty2.appendChild(mapProgressFilterDifficultySelect2);


    let mapsProgressFilter = document.createElement('div');
    mapsProgressFilter.classList.add('maps-progress-filter');
    achievementsHeaderBar.appendChild(mapsProgressFilter);

    let mapProgressFilterDifficulty = document.createElement('div');
    mapProgressFilterDifficulty.classList.add('map-progress-filter-difficulty');
    mapsProgressFilter.appendChild(mapProgressFilterDifficulty);

    let mapsProgressFilterDifficultyText = document.createElement('p');
    mapsProgressFilterDifficultyText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressFilterDifficultyText.innerHTML = "Display:";
    mapProgressFilterDifficulty.appendChild(mapsProgressFilterDifficultyText);

    let mapProgressFilterDifficultySelect = document.createElement('select');
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
    let AchievementsContainer = document.getElementById('achievements-container');
    AchievementsContainer.innerHTML = "";

    let achievementGuides = {
        5: "https://steamcommunity.com/sharedfiles/filedetails/?id=3601481780",
        28: "https://www.bloonswiki.com/Inflated",
        64: "https://www.bloonswiki.com/2TC",
        65: "https://www.bloonswiki.com/Snap_of_your_fingers",
        77: "https://www.bloonswiki.com/All_for_one_and_one_for_one",
        78: "https://www.bloonswiki.com/Master_of_life",
        80: "https://www.bloonswiki.com/Strangely_Adorable",
        82: "https://www.bloonswiki.com/What_did_it_cost%3F_-_Everything",
        83: "https://www.bloonswiki.com/2_MegaPops",
        89: "https://www.bloonswiki.com/Candy_Falls#Easter_eggs",
        99: "https://www.bloonswiki.com/Chunky_Monkeys",
        101: "https://www.bloonswiki.com/Living_on_the_Edge",
        113: "https://www.bloonswiki.com/Stubborn_Strategy",
        120: "https://www.bloonswiki.com/Golden_Bloon_(BTD6)#Popping_Golden_Bloons",
        121: "https://www.bloonswiki.com/Golden_Bloon_(BTD6)#Popping_Golden_Bloons",
        130: "https://www.bloonswiki.com/Perfect_Paragon",
        150: "https://www.bloonswiki.com/Nah,_I'd_Win",
        151: "https://www.bloonswiki.com/They_call_me_Cave_Monkey!",
        62: "https://www.bloonswiki.com/Big_Bloons",
        63: "https://www.bloonswiki.com/Alchermistman_and_Bloonacleboy"
    }

    let achievements = Object.keys(achievementsJSON);
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
        noDataFound.classList.add('no-data-found','black-outline');
        noDataFound.innerHTML = "No achievements match the filters!";
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
        achievementNameText.classList.add('achievement-name-text','black-outline');
        achievementNameText.innerHTML = achievementClaimed ? getLocValue(`Achievement ${achievementData.model.achievementId} Name`) : achievementData.model.hidden ? "???" : getLocValue(`Achievement ${achievementData.model.achievementId} Name`);
        achievementTextDiv.appendChild(achievementNameText);

        let achievementDescText = document.createElement('p');
        achievementDescText.classList.add('achievement-desc-text');
        let achievementDesc = achievementClaimed ? getLocValue(`Achievement ${achievementData.model.achievementId} Description`) : achievementData.model.hidden ? "???" : getLocValue(`Achievement ${achievementData.model.achievementId} Description`);
        achievementDescText.innerHTML = achievementDesc.indexOf("{0}") != -1 ? achievementDesc.replace("{0}", " " + achievementData.model.achievementGoal.toLocaleString()) : achievementDesc;
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
            achievementRewardText.classList.add('achievement-reward-text','black-outline');
            let text = "";
            switch (data.type) {
                case "InstaMonkey":
                    text = data.tiers.split("").join("-")
                    break;
                case "Knowledge":
                    text = "+ " + data.amount.toLocaleString()
                    break;
                case "Trophy":
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
        } else {
            let guideBtn;
            if (achievementGuides.hasOwnProperty(id)) {
                guideBtn = generateButton("Guide", {width: "unset"}, function() {
                    openBTD6Site(achievementGuides[id])
                })
                achievementBottomDiv.appendChild(guideBtn);

                if (achievementData.model.hidden) {
                    guideBtn.style.display = "none";
                }
            }

            if (achievementData.model.hidden) {
                achievementBottomDiv.appendChild(generateButton("Reveal", {width: "unset"}, function() {
                    achievementNameText.innerHTML = getLocValue(`Achievement ${achievementData.model.achievementId} Name`);
                    achievementDescText.innerHTML = getLocValue(`Achievement ${achievementData.model.achievementId} Description`);
                    achievementIconImg.src = getAchievementIcon(achievementData.model.achievementIcon, false);
                    achievementData.model.hidden = false;
                    achievementBottomDiv.removeChild(achievementBottomDiv.lastChild);
                    if (achievementGuides.hasOwnProperty(id)) {
                        guideBtn.style.display = 'unset';
                    }
                }))
            }
        }
    }

    AchievementsContainer.appendChild(fragment);
}

function generateExtrasProgress() {
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    let extrasProgressContainer = document.createElement('div');
    extrasProgressContainer.classList.add('extras-progress-container');
    progressContent.appendChild(extrasProgressContainer);

    let extras = [["Big Bloons", "BigBloonsMode"],["Small Bloons", "SmallBloonsMode"],["Big Monkey Towers","BigTowersMode"],["Small Monkey Towers", "SmallTowersMode"],["Small Bosses","SmallBossesMode"]]

    for (let [name, loc] of extras) {
        let locked = extrasUnlocked[name] == undefined;

        let extraProgressDiv = document.createElement('div');
        extraProgressDiv.classList.add('extra-progress-div');
        extrasProgressContainer.appendChild(extraProgressDiv);

        let extraProgressImg = document.createElement('img');
        extraProgressImg.classList.add('extra-progress-img');
        extraProgressImg.src = locked ? `./Assets/AchievementIcon/HiddenIcon.png` : `./Assets/UI/${loc}Icon.png`;
        extraProgressDiv.appendChild(extraProgressImg);

        let extraProgressText = document.createElement('p');
        extraProgressText.classList.add('extra-progress-text','black-outline');
        extraProgressText.innerHTML = locked ? "???" : getLocValue(loc);
        extraProgressDiv.appendChild(extraProgressText);

        if(!locked) {
            let extraProgressTick = document.createElement('img');
            extraProgressTick.classList.add('extra-progress-tick');
            extraProgressTick.src = "./Assets/UI/TickGreenIcon.png";
            extraProgressDiv.appendChild(extraProgressTick);
        }
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

async function generateEvents(){
    let eventsContent = document.getElementById('events-content');
    eventsContent.innerHTML = "";

    let eventsPage = document.createElement('div');
    eventsPage.classList.add('progress-page');
    eventsContent.appendChild(eventsPage);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.classList.add('selectors-div');
    eventsPage.appendChild(selectorsDiv);

    showLoading();
    let current = await getLatestCollectionEvent();

    let selectors = {
        'Collection': {
            'img': getCollectionEventSkinIcon(current),
            'text': "Collection Event Schedule",
            'bgimg': 'EventBanner/EventBannerSmallTotem'
        },
        'Races': {
            'img': 'EventRaceBtn',
            'text': "Race Events",
            'bgimg': 'EventBanner/EventBannerSmallRaces'
        },
        'Bosses': {
            'img': 'BossesBtn',
            'text': "Boss Events",
            'bgimg': 'EventBanner/EventBannerSmallBossChallenge'
        },
        'Odyssey': {
            'img': 'OdysseyEventBtn',
            'text': "Odyssey Events (Coming Soon)",
            'bgimg': 'EventBanner/EventBannerSmallOdyssey'
        },
        'ContestedTerritory': {
            'img': 'ContestedTerritoryEventBtn',
            'text': "Contested Territory",
            'bgimg': 'ProfileBanner/TeamsBanner8'
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

    let now = new Date();
    if (current == null || now > new Date(current.end)) {
        delete selectors['Collection'];
    }

    Object.entries(selectors).forEach(([selector,object]) => {
        let selectorDiv = createEl('div', { classList: ['events-selector-div', 'transparent-border'], style: {borderWidth: "5px", borderStyle: "solid"} });
        object.bgcolor ? selectorDiv.style.background = object.bgcolor : selectorDiv.style.backgroundImage = `url(../Assets/${object.bgimg}.png)`;
        /*selectorDiv.innerHTML = progressSubText[selector];*/
        selectorDiv.addEventListener('click', () => {
            changeEventTab(selector);
        })
        selectorsDiv.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
        selectorImg.classList.add('selector-img');
        selectorImg.src = `../Assets/UI/${object.img}.png`;
        selectorDiv.appendChild(selectorImg);

        let selectorText = document.createElement('p');
        selectorText.classList.add('event-selector-text','black-outline');
        selectorText.innerHTML = object.text;
        selectorDiv.appendChild(selectorText);

        let selectorGoImg = document.createElement('img');
        selectorGoImg.classList.add('selector-go-img');
        if(selector == 'Odyssey') { selectorGoImg.classList.add('hero-selector-div-disabled'); }
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
            showLoading();
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
        case "Collection":
            addToBackQueue({ source: "events", destination: "featured" });
            generateInstaSchedule();
            document.getElementById('events-content').style.display = "none";
            document.getElementById('featured-content').style.display = "flex";
    }
    // addToBackQueue({callback: generateEvents})
}

function generateRaces(){
    let eventsContent = document.getElementById('events-content');
    eventsContent.innerHTML = "";

    clearAllTimers();

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
        raceTimeLeft.id = `Race-${race.id}-TimeLeft`;
        raceTimeLeft.classList.add("race-time-left", "black-outline");
        raceTimeLeft.innerHTML = "Finished";
        raceInfoTopDiv.appendChild(raceTimeLeft);    
        if(new Date() < new Date(race.start)) {
            raceTimeLeft.innerHTML = "Coming Soon!";
        } else if (new Date(race.end) > new Date()) {
            registerTimer(raceTimeLeft.id, new Date(race.end));
        } else if (new Date() > new Date(race.end)) {
            raceTimeLeft.innerHTML = "Finished";
        }

        let raceInfoDates = document.createElement('p');
        raceInfoDates.classList.add("race-info-dates", "black-outline");
        raceInfoDates.innerHTML = `${new Date(race.start).toLocaleDateString()} - ${new Date(race.end).toLocaleDateString()}`;
        raceInfoMiddleDiv.appendChild(raceInfoDates);

        tippy(raceInfoDates, {
            content: `${new Date(race.start).toLocaleString()}<br>${new Date(race.end).toLocaleString()}`,
            placement: 'top',
            theme: 'speech_bubble',
            allowHTML: true,
        })

        let raceInfoTotalScores = document.createElement('p');
        raceInfoTotalScores.classList.add("race-info-total-scores", "black-outline");
        raceInfoTotalScores.innerHTML = `Total Scores: ${race.totalScores == 0 ? "No Data" : race.totalScores.toLocaleString()}`
        raceInfoMiddleDiv.appendChild(raceInfoTotalScores);

        let raceInfoRules = document.createElement('div');
        raceInfoRules.classList.add("race-info-rules", "start-button", 'hero-selector-div-disabled', "black-outline");
        raceInfoRules.innerHTML = "Details"
        raceInfoRules.addEventListener('click', () => {
            if (typeof racesData[index]["metadata"] == 'string') { return; }
            showLoading();
            showChallengeModel('events',  race.metadata, "Race");
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
                        observer.unobserve(entry.target);
                        raceInfoRules.classList.remove('hero-selector-div-disabled');
                        raceMapImg.src = Object.keys(constants.mapsInOrder).includes(race.metadata.map) ? getMapIcon(race.metadata.map) : race.metadata.mapURL;
                        let modifiers = challengeModifiers(race.metadata);
                        let rules = challengeRules(race.metadata)
                        for (let modifier of Object.values(modifiers)) {
                            let challengeModifierIcon = document.createElement('img');
                            challengeModifierIcon.classList.add('challenge-modifier-icon-event');
                            challengeModifierIcon.src = `./Assets/ChallengeRulesIcon/${modifier.icon}.png`;
                            raceChallengeIcons.appendChild(challengeModifierIcon);
                        }
                        for (let rule of rules) {
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

    clearAllTimers();

    let switchBanner = document.createElement('div');
    switchBanner.classList.add('switch-banner');
    switchBanner.style.backgroundImage = `url(../Assets/UI/${!showElite ? "Elite" : ""}Ribbon.png)`;
    eventsContent.appendChild(switchBanner);

    let switchBossDiv = document.createElement('div');
    switchBossDiv.classList.add("switch-boss-div");
    switchBanner.appendChild(switchBossDiv);

    let bosses = ["Bloonarius", "Lych", "Vortex", "Dreadbloon", "Phayze", "Blastapopoulos"]

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

    Object.values(bossesData).forEach((race, index) => {
        let titleCaseBoss = race.bossType.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        let bossNumber = race.name.replace(/\D/g,'');
        let bossName = `${elite ? "Elite" : ""} ${titleCaseBoss} ${bossNumber}`;

        let eventData = {
            'name': titleCaseBoss,
            'elite': elite,
            'eventNumber': bossNumber,
            'scoringType': race.normalScoringType,
            'eliteScoringType': race.eliteScoringType,
            'index': index
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
        raceInfoBottomDiv.classList.add("race-info-bottom-div");
        raceInfoDiv.appendChild(raceInfoBottomDiv);

        let raceInfoName = document.createElement('p');
        raceInfoName.classList.add("race-info-name", "black-outline");
        raceInfoName.innerHTML = bossName;
        raceInfoTopDiv.appendChild(raceInfoName);

        let bossTimeLeft = document.createElement('p');
        bossTimeLeft.id = `Boss-${race.id}-TimeLeft`;
        bossTimeLeft.classList.add("race-time-left", "black-outline");
        bossTimeLeft.innerHTML = "Finished";
        raceInfoTopDiv.appendChild(bossTimeLeft);    
        if(new Date() < new Date(race.start)) {
            bossTimeLeft.innerHTML = "Coming Soon!";
        } else if (new Date(race.end) > new Date()) {
            registerTimer(bossTimeLeft.id, new Date(race.end));
        } else if (new Date() > new Date(race.end)) {
            bossTimeLeft.innerHTML = "Finished";
        }

        let raceInfoDates = document.createElement('p');
        raceInfoDates.classList.add("race-info-dates", "black-outline");
        raceInfoDates.innerHTML = `${new Date(race.start).toLocaleDateString()} - ${new Date(race.end).toLocaleDateString()}`;
        raceInfoMiddleDiv.appendChild(raceInfoDates);

        tippy(raceInfoDates, {
            content: `${new Date(race.start).toLocaleString()}<br>${new Date(race.end).toLocaleString()}`,
            placement: 'top',
            theme: 'speech_bubble',
            allowHTML: true,
        })

        let raceInfoTotalScores = document.createElement('p');
        raceInfoTotalScores.classList.add("race-info-total-scores", "black-outline");
        raceInfoTotalScores.innerHTML = `Total Scores: ${(elite ? race.totalScores_elite : race.totalScores_standard) == 0 ? "No Data" : (elite ? race.totalScores_elite : race.totalScores_standard).toLocaleString()}`
        raceInfoMiddleDiv.appendChild(raceInfoTotalScores);

        let raceInfoRules = document.createElement('div');
        raceInfoRules.classList.add("race-info-rules", "start-button", 'hero-selector-div-disabled', elite ? "btn-rotate-boss-elite" : "btn-rotate-boss", "black-outline");
        raceInfoRules.innerHTML = "Details"
        raceInfoRules.addEventListener('click', () => {
            if (typeof bossesData[index][elite ? "metadataElite" : "metadataStandard"] == 'string') { return; }
            showLoading();
            showChallengeModel('events', (elite ? race.metadataElite : race.metadataStandard),"Boss", eventData);
        })
        raceInfoBottomDiv.appendChild(raceInfoRules);

        let raceInfoLeaderboard = document.createElement('div');
        raceInfoLeaderboard.classList.add("race-info-leaderboard", "start-button", elite ? "btn-rotate-boss-elite" : "btn-rotate-boss", "black-outline");
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
                        raceInfoRules.classList.remove('hero-selector-div-disabled');
                        let challengeScoreTypeIcon = document.createElement('img');
                        challengeScoreTypeIcon.classList.add('challenge-modifier-icon-event');
                        switch(elite ? race.eliteScoringType : race.normalScoringType){
                            case "LeastCash":
                                challengeScoreTypeIcon.src = `./Assets/ChallengeRulesIcon/LeastCashIcon.png`;
                                raceChallengeIcons.appendChild(challengeScoreTypeIcon);
                                break;
                            case "LeastTiers":
                                challengeScoreTypeIcon.src = `./Assets/ChallengeRulesIcon/LeastTiersIcon.png`;
                                raceChallengeIcons.appendChild(challengeScoreTypeIcon);
                                break;
                        }
                        observer.unobserve(entry.target);
                        let modifiers = challengeModifiers(elite ? race.metadataElite : race.metadataStandard);
                        let rules = challengeRules(elite ? race.metadataElite : race.metadataStandard)
                        for (let modifier of Object.values(modifiers)) {
                            let challengeModifierIcon = document.createElement('img');
                            challengeModifierIcon.classList.add('challenge-modifier-icon-event');
                            challengeModifierIcon.src = `./Assets/ChallengeRulesIcon/${modifier.icon}.png`;
                            raceChallengeIcons.appendChild(challengeModifierIcon);
                        }
                        for (let rule of rules) {
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

async function generateChallenges(type) {
    let eventsContent = document.getElementById('events-content');
    eventsContent.innerHTML = "";

    await getDailyChallengesData();

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

    let now = new Date();

    if (type == "CoopDailyChallenges") {
        challenges = challenges.filter(challenge => new Date(challenge.createdAt) < now);
        challenges = challenges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    let latestChallenge = 0;

    Object.values(challenges).forEach((challenge, index) => {
        let regex = /^(Standard|Advanced|coop)(?: (\d+))?: (.*)$/;
        let match = challenge.name.match(regex);

        let challengeNumber = "";

        if (match) {
            challengeNumber = match[2] || null;

            if (challengeNumber != null && challengeNumber > latestChallenge) {
                latestChallenge = challengeNumber;
            }
        }
    })

    if (type == "DailyChallenges" || type == "AdvancedDailyChallenges") {
        let challengeDiv = document.createElement('div');
        challengeDiv.classList.add("race-div", "event-select-challenge-div");
        eventsContent.appendChild(challengeDiv);

        let challengeInfoName = document.createElement('p');
        challengeInfoName.classList.add("challenge-select-info-name", "black-outline");
        challengeInfoName.innerHTML = `${type == "DailyChallenges" ? "Standard" : "Advanced"} Challenges`;
        challengeDiv.appendChild(challengeInfoName);

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

        let challengeSelectorDateInput = document.createElement('input');
        challengeSelectorDateInput.classList.add("challenge-selector-date-input");
        challengeSelectorDateInput.type = "date";
        let dateForSelect = challengeIdToDate(getChallengeIdFromInt(latestChallenge, type == "AdvancedDailyChallenges"));
        challengeSelectorDateInput.value =  new Date(dateForSelect[0], dateForSelect[1] - 1, dateForSelect[2]).toISOString().split('T')[0];
        challengeSelectorDateInput.addEventListener('change', () => {
            if (new Date(challengeSelectorDateInput.value) > new Date()) { challengeSelectorDateInput.value = new Date().toISOString().split('T')[0] }
            if (new Date(challengeSelectorDateInput.value) < new Date(type == "DailyChallenges" ? "2021-05-07" : "2021-05-20")) { challengeSelectorDateInput.value = type == "DailyChallenges" ? "2021-05-07" : "2021-05-20"; }
        })
        challengeSelectorDate.appendChild(challengeSelectorDateInput);

        let challengeSelectorDateImg = document.createElement('img');
        challengeSelectorDateImg.classList.add("challenge-selector-date-img");
        challengeSelectorDateImg.src = "../Assets/UI/ContinueBtn.png";
        challengeSelectorDateImg.addEventListener('click', async () => {
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

        let challengeSelectorIDInput = document.createElement('input');
        challengeSelectorIDInput.classList.add("challenge-selector-id-input");
        challengeSelectorIDInput.type = "number";
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
            showLoading();
            showChallengeModel('events', await getChallengeMetadata(getChallengeIdFromInt(challengeSelectorIDInput.value, type == "AdvancedDailyChallenges")), type);
        })
        challengeSelectorID.appendChild(challengeSelectorIDImg);
    }

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
        challengeInfoName.innerHTML = type == "CoopDailyChallenges" ? challenge.name.replace("coop - ", "") : challengeName;
        challengeInfoTopDiv.appendChild(challengeInfoName);

        let challengeDate = document.createElement('p');
        challengeDate.classList.add("challenge-date", "black-outline");
        let dateForSelect = type == "CoopDailyChallenges" ? false : challengeIdToDate(getChallengeIdFromInt(challengeNumber, type == "AdvancedDailyChallenges"));
        challengeDate.innerHTML = `${type == "CoopDailyChallenges" ? new Date(challenge.createdAt).toLocaleDateString() : new Date(dateForSelect[0], dateForSelect[1] - 1, dateForSelect[2]).toLocaleDateString()}`;
        challengeInfoMiddleDiv.appendChild(challengeDate);

        let challengeTypeText = document.createElement('p');
        challengeTypeText.classList.add("challenge-date", "black-outline");
        challengeTypeText.innerHTML = type == "CoopDailyChallenges" ? "Coop" : `${challengeType} ${challengeNumber}`;
        challengeInfoMiddleDiv.appendChild(challengeTypeText);

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
                            let challengeModifierIcon = document.createElement('img');
                            challengeModifierIcon.classList.add('challenge-modifier-icon-event');
                            challengeModifierIcon.src = `./Assets/ChallengeRulesIcon/${modifier.icon}.png`;
                            challengeChallengeIcons.appendChild(challengeModifierIcon);
                        }
                        for (let rule of rules) {
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
                            "Wins": challengeData.wins,
                            "Fails": challengeData.losses + challengeData.restarts,
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
}

function processChallenge(metadata, map){
    let result = {};
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
    result["Player Completion Rate"] = metadata.playsUnique == 0 ? "0.00%" : metadata.winsUnique - metadata.playsUnique == 0 ? "100%" : `${((metadata.winsUnique / metadata.playsUnique) * 100).toFixed(2)}%`;
    result["Player Win Rate"] = metadata.playsUnique == 0 ? "0.00%" : `${((metadata.wins / (metadata.plays + metadata.restarts)) * 100).toFixed(2)}%`;

    result.statsValid = false;
    if (metadata.id != "n/a") {
        result.statsValid = true;
    }
    return result;
}

async function showChallengeModel(source, metadata, challengeType, eventData){
    if (metadata == null) { return; }
    document.getElementById('challenge-content').style.display = "flex";
    document.getElementById('challenge-content').innerHTML = "";
    document.getElementById(`${source}-content`).style.display = "none";
    resetScroll();

    addToBackQueue({"source": source, "destination": "challenge"});

    let challengeExtraData = processChallenge(metadata);
    if (challengeType == "Boss") {
        let scoringType = eventData.elite ? eventData.eliteScoringType : eventData.scoringType;
        switch(scoringType){
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

    let challengeHeaderRightTop = document.createElement('div');
    challengeHeaderRightTop.classList.add('challenge-header-right-top');
    challengeHeaderRightContainer.appendChild(challengeHeaderRightTop);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        // exitChallengeModel(source);
        goBack();
    })
    challengeHeaderRightTop.appendChild(modalClose);

    let challengeHeaderRightBottom = document.createElement('div');
    challengeHeaderRightBottom.classList.add('challenge-header-right-bottom');
    challengeHeaderRightContainer.appendChild(challengeHeaderRightBottom);

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

    Object.entries(challengeSettings).forEach(([setting,data], index) => {
        let challengeSetting = document.createElement('div');
        challengeSetting.classList.add('challenge-setting');

        index % 2 ? challengeModelSettingsRight.appendChild(challengeSetting) : challengeModelSettingsLeft.appendChild(challengeSetting);

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
            challengeModelHeaderIcon.src = `./Assets/BossIcon/${eventData.name}EventIcon.png`;
            challengeSettingText.innerHTML = `${eventData.elite ? "Elite " : ""}Boss Event`;
            challengeSettingIcon.src = `./Assets/BossIcon/${eventData.name}Portrait${eventData.elite ? "Elite" : ""}.png`;
            challengeModelHeaderName.innerHTML = `${eventData.elite ? "Elite " : ""}${eventData.name} ${eventData.eventNumber}`;
            challengeModelHeader.style.background = eventData.elite ? "linear-gradient(180deg, #401DB4, #A144E2)" : "linear-gradient(180deg, #1882A5, #07A4CB)";

            let bossTypeSwapButton = document.createElement('div');
            bossTypeSwapButton.classList.add('start-button', 'black-outline', eventData.elite ? "btn-rotate-boss" : "btn-rotate-boss-elite");
            bossTypeSwapButton.innerHTML = "Swap";
            bossTypeSwapButton.addEventListener('click', async () => {
                eventData.elite = !eventData.elite;
                showLoading();
                if (typeof bossesData[eventData.index][eventData.elite ? "metadataElite" : "metadataStandard"] == 'string') {
                    await getBossMetadata(eventData.index, eventData.elite)
                }
                goBack();
                showChallengeModel('events', bossesData[eventData.index][eventData.elite ? "metadataElite" : "metadataStandard"], challengeType, eventData);
                hideLoading();
            })
            challengeHeaderRightContainer.appendChild(bossTypeSwapButton);
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
                // openBTD6Link(`btd6://Challenge/${metadata.id}`);
                openBTD6Site(`https://join.btd6.com/Challenge/${metadata.id}`);
            });
            challengeHeaderRightBottom.appendChild(selectorGoImg);
            break;
    }

    if (challengeExtraData.scoringType != null) {
        let hideScoringValue = (challengeType == "Boss");

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

    let towersExcluded = {};
    let heroesExcluded = {};
    let towersLimited = {};

    Object.entries(metadata._towers).forEach(([tower, data]) => {
        if (data.max == 0) { 
            data.isHero ? heroesExcluded[data.tower] = data : towersExcluded[data.tower] = data;
            return; 
        }
        if (data.tower === "ChosenPrimaryHero" && data.max != 0) { shouldUseHeroList = true; }
        data.isHero ? heroesToDisplay[data.tower] = data : towersToDisplay[data.tower] = data;
    })

    let towerSelector = document.createElement('div');
    towerSelector.classList.add('challenge-towers-list');
    challengeModel.appendChild(towerSelector);

    let towerSelectorTop = document.createElement('div');
    towerSelectorTop.classList.add('challenge-tower-selector-top');
    towerSelector.appendChild(towerSelectorTop);

    let towerSelectorTitle = document.createElement('p');
    towerSelectorTitle.classList.add('challenge-tower-selector-title', 'black-outline');
    towerSelectorTitle.innerHTML = "Monkeys Available:";
    towerSelectorTop.appendChild(towerSelectorTitle);

    let towerSelectorCheckboxes = document.createElement('div');
    towerSelectorCheckboxes.classList.add('challenge-tower-selector-checkboxes');
    towerSelectorTop.appendChild(towerSelectorCheckboxes);

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    towerSelectorCheckboxes.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText.innerHTML = "Only Excluded & Limited: ";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);

    mapsProgressCoopToggleInput.addEventListener('change', () => {
        towerSelectorExcluded.style.display = towerSelectorExcluded.style.display == "none" ? "flex" : "none";
        towerSelectorAvailable.style.display = towerSelectorAvailable.style.display == "none" ? "flex" : "none";
        if (mapsProgressCoopToggleInput.checked) { towerSelectorTitle.innerHTML = "Monkeys Limited:" } else { towerSelectorTitle.innerHTML = "Monkeys Available:" }
    })

    let towerSelectorShowHeroesToggle = document.createElement('div');
    towerSelectorShowHeroesToggle.classList.add('maps-progress-coop-toggle');  
    towerSelectorCheckboxes.appendChild(towerSelectorShowHeroesToggle);

    let towerSelectorShowHeroesToggleText = document.createElement('p');
    towerSelectorShowHeroesToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
    towerSelectorShowHeroesToggleText.innerHTML = "Hide Heroes: ";
    towerSelectorShowHeroesToggle.appendChild(towerSelectorShowHeroesToggleText);

    let towerSelectorShowHeroesInput = document.createElement('input');
    towerSelectorShowHeroesInput.classList.add('maps-progress-coop-toggle-input');
    towerSelectorShowHeroesInput.type = 'checkbox';
    towerSelectorShowHeroesToggle.appendChild(towerSelectorShowHeroesInput);

    towerSelectorShowHeroesInput.addEventListener('change', () => {
        let heroSelectors = document.getElementsByClassName('tower-selector-hero');
        for (let heroSelector of heroSelectors) {
            heroSelector.style.display = heroSelector.style.display == "none" ? "flex" : "none";
        }
    })



    let towerSelectorAvailable = document.createElement('div');
    towerSelectorAvailable.classList.add('challenge-tower-selector');
    towerSelector.appendChild(towerSelectorAvailable);

    let towerSelectorExcluded = document.createElement('div');
    towerSelectorExcluded.style.display = "none";
    towerSelectorExcluded.classList.add('challenge-tower-selector');
    towerSelector.appendChild(towerSelectorExcluded);

    if (shouldUseHeroList) {
        let towerSelector = document.createElement('div');
        towerSelector.classList.add(`tower-selector-hero`);
        towerSelectorAvailable.appendChild(towerSelector)

        let towerSelectorImg = document.createElement('img');
        towerSelectorImg.classList.add('hero-selector-img');
        towerSelectorImg.src = `./Assets/UI/AllHeroesIcon.png`;
        towerSelector.appendChild(towerSelectorImg);
    } else {
        for (let [tower, nameColor] of Object.entries(constants.heroesInOrder)) {
            if (!heroesToDisplay[tower]) { continue; }
            let towerSelector = document.createElement('div');
            towerSelector.classList.add(`tower-selector-hero`);

            let towerSelectorImg = document.createElement('img');
            towerSelectorImg.classList.add('hero-selector-img');
            towerSelectorImg.src = getInstaContainerIcon(tower,"000");
            towerSelector.appendChild(towerSelectorImg);

            towerSelectorAvailable.appendChild(towerSelector)
        }
    }

    for (let [tower, category] of Object.entries(constants.towersInOrder)) {
        if (!towersExcluded[tower]) { continue; }
        let towerSelector = document.createElement('div');
        towerSelector.classList.add(`tower-selector-${category.toLowerCase()}`);
        towerSelectorExcluded.appendChild(towerSelector)

        let towerSelectorImg = document.createElement('img');
        towerSelectorImg.classList.add('tower-selector-img');
        towerSelectorImg.src = getInstaContainerIcon(tower,"000");
        towerSelector.appendChild(towerSelectorImg);

        let maxCount = document.createElement('div');
        maxCount.classList.add('max-count','towerTopLeft','towerExcluded');
        towerSelector.appendChild(maxCount);
    }

    for (let [tower, category] of Object.entries(constants.towersInOrder)) {
        if (!towersToDisplay[tower]) { continue; }
        let towerSelector = document.createElement('div');
        towerSelector.classList.add(`tower-selector-${category.toLowerCase()}`);
        towerSelectorAvailable.appendChild(towerSelector)

        let towerSelectorImg = document.createElement('img');
        towerSelectorImg.classList.add('tower-selector-img');
        towerSelectorImg.src = getInstaContainerIcon(tower,"000");
        towerSelector.appendChild(towerSelectorImg);

        let isLimited = false;

        if (towersToDisplay[tower].path1NumBlockedTiers != 0 || towersToDisplay[tower].path2NumBlockedTiers != 0  || towersToDisplay[tower].path3NumBlockedTiers != 0 ) {
            isLimited = true;

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

        if(towersToDisplay[tower].max != -1) {
            isLimited = true;

            let maxCount = document.createElement('div');
            maxCount.classList.add('max-count','towerTopLeft');
            towerSelector.appendChild(maxCount);

            let maxCountText = document.createElement('p');
            maxCountText.classList.add('towerTopLeftText','black-outline');
            maxCountText.innerHTML = `${towersToDisplay[tower].max}`;
            maxCount.appendChild(maxCountText);
        }

        if (isLimited) {
            towerSelectorExcluded.appendChild(towerSelector.cloneNode(true));
        }
    }

    if (!shouldUseHeroList) {
        for (let [tower, nameColor] of Object.entries(constants.heroesInOrder)) {
            if (!heroesExcluded[tower]) { continue; }
            let towerSelector = document.createElement('div');
            towerSelector.classList.add(`tower-selector-hero`);

            let towerSelectorImg = document.createElement('img');
            towerSelectorImg.classList.add('hero-selector-img');
            towerSelectorImg.src = getInstaContainerIcon(tower,"000");
            towerSelector.appendChild(towerSelectorImg);

            let maxCount = document.createElement('div');
            maxCount.classList.add('max-count','towerTopLeft','towerExcluded');
            towerSelector.appendChild(maxCount);

            towerSelectorExcluded.appendChild(towerSelector)
        }
    }

    let noLimitedOrExcluded = false;
    if (towerSelectorExcluded.children.length == 0) {
        let none = document.createElement('p');
        none.classList.add('challenge-modifier-none');
        none.style.width = "100%"
        none.innerHTML = "No Excluded or Limited Towers!";
        towerSelectorExcluded.appendChild(none);
        noLimitedOrExcluded = true;
    }

    if (challengeType == "Boss" && !noLimitedOrExcluded) {
        mapsProgressCoopToggleInput.checked = true;
        towerSelectorExcluded.style.display = towerSelectorExcluded.style.display == "none" ? "flex" : "none";
        towerSelectorAvailable.style.display = towerSelectorAvailable.style.display == "none" ? "flex" : "none";
        if (mapsProgressCoopToggleInput.checked) { towerSelectorTitle.innerHTML = "Monkeys Limited:" } else { towerSelectorTitle.innerHTML = "Monkeys Available:" }
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
    challengeModifiersHeader.classList.add('challenge-modifiers-header','black-outline');
    challengeModifiersHeader.innerHTML = "Modifiers";


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
        challengeModifierLabel.classList.add('challenge-modifier-text','black-outline');
        challengeModifierLabel.innerHTML = `${modifier}:`;
        challengeModifierTexts.appendChild(challengeModifierLabel);

        let challengeModifierValue = document.createElement('p');
        challengeModifierValue.classList.add('challenge-modifier-value','black-outline');
        challengeModifierValue.innerHTML = isNaN(data.value) ? data.value : `${(data.value * 100).toFixed(0)}%`;
        challengeModifierTexts.appendChild(challengeModifierValue);
    })

    if (challengeModifiersDiv.children.length == 0) {
        let none = document.createElement('p');
        none.classList.add('challenge-modifier-none');
        none.innerHTML = "Default";
        challengeModifiersDiv.appendChild(none);
    }

    challengeModifiersDiv.prepend(challengeModifiersHeader);

    let rules = challengeRules(metadata);

    let challengeRulesHeader = document.createElement('p');
    challengeRulesHeader.classList.add('challenge-rules-header','black-outline');
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
        challengeRuleText.classList.add('challenge-rule-text','black-outline');
        challengeRuleText.innerHTML = rule;
        challengeRuleTextDiv.appendChild(challengeRuleText);

        if(rule == "Custom Rounds" && challengeType == "Boss")  {
            let roundset = null;
            if (metadata.roundSets.includes("bloonarius")) {
                roundset = "BloonariusRoundSet";
            }
            if (metadata.roundSets.includes("lych")) {
                roundset = "LychRoundSet";
            }
            if (metadata.roundSets.includes("vortex")) {
                roundset = "VortexRoundSet";
            }
            if (metadata.roundSets.includes("dreadbloon")) {
                roundset = "DreadbloonRoundSet";
            }
            if (metadata.roundSets.includes("phayze")) {
                roundset = "PhayzeRoundSet";
            }
            if(metadata.roundSets.includes("blastapopoulos")) {
                roundset = "BlastapopoulosRoundSet";
            }

            if(roundset != null) {
                let challengeRuleValue = document.createElement('div');
                challengeRuleValue.classList.add('challenge-rule-subtext','start-button','black-outline');
                challengeRuleValue.innerHTML = "Open";
                challengeRuleTextDiv.appendChild(challengeRuleValue);

                challengeRuleValue.addEventListener('click', () => {
                    showRoundsetModel('challenge', roundset);
                })
            }
        }

        let roundset = metadata.roundSets.filter(value => value !== 'default' && value !== 'bloonarius' && value !== 'lych' && value !== 'vortex' && value !== 'dreadbloon' && value !== 'phayze')
        if (rule == "Custom Rounds" && constants.skuRoundsets.includes(roundset[0]) && metadata.mode != "AlternateBloonsRounds") {
            let challengeRuleValue = document.createElement('div');
            challengeRuleValue.classList.add('challenge-rule-subtext','start-button','black-outline');
            challengeRuleValue.innerHTML = "Open";
            challengeRuleTextDiv.appendChild(challengeRuleValue);

            challengeRuleValue.addEventListener('click', () => {
                showRoundsetModel('challenge', roundset[0]);
            })
        }

        if(rule == "Paragon Limit") {
            let challengeRuleValue = document.createElement('p');
            challengeRuleValue.classList.add('challenge-rule-value', 'black-outline');
            challengeRuleValue.innerHTML = metadata.maxParagons;
            challengeRuleTextDiv.appendChild(challengeRuleValue);
        }
    });

    if (challengeRulesDiv.children.length == 0) {
        let none = document.createElement('p');
        none.classList.add('challenge-modifier-none');
        none.innerHTML = "Default";
        challengeRulesDiv.appendChild(none);
    }

    challengeModelRight.prepend(challengeRulesHeader);


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

        let challengeStatsX = document.createElement('p');
        challengeStatsX.classList.add('challenge-stats-x');
        challengeStatsX.innerHTML = "X";
        challengeStatsX.addEventListener('click', () => {
            challengeStatsDiv.style.display = "none";
        })
        challengeStatsDiv.appendChild(challengeStatsX);

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
            avatarImg.src = "../Assets/ProfileAvatar/ProfileAvatar01.png";
            avatar.appendChild(avatarImg);

            let challengeCreatorName = document.createElement('p');
            challengeCreatorName.classList.add('challenge-creator-name', 'black-outline');
            challengeCreatorName.innerHTML = preventRateLimiting ? "Click to Load Creator" : "Loading...";
            challengeCreator.appendChild(challengeCreatorName);
            
            challengeCreator.addEventListener('click', async () => {
                challengeCreatorName.innerHTML = "Loading...";
                let data = await getUserProfile(challengeExtraData["Creator"])
                if (data == null) { 
                    challengeCreatorName.innerHTML = "Click to Load Creator";
                    return; 
                }
                challengeCreatorName.innerHTML = data.displayName;
                avatarImg.src = getProfileAvatar(data);
                challengeCreator.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(data)})`;
                challengeCreator.removeEventListener('click', arguments.callee);
                challengeCreator.addEventListener('click', () => {
                    openProfile('challenge', challengeExtraData["Creator"]);
                })
            });
            if(!preventRateLimiting) {
                challengeCreator.click();
            }
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
    if (metadata._bloonModifiers.hasOwnProperty('regrowRateMultiplier') && metadata._bloonModifiers.regrowRateMultiplier != 1) {
        result["Regrow Rate"] = {
            "value": metadata._bloonModifiers.regrowRateMultiplier,
            "icon": metadata._bloonModifiers.regrowRateMultiplier > 1 ? "RegrowRateIncreaseIcon" : "RegrowRateDecreaseIcon"
        }
    }
    if (metadata.hasOwnProperty('abilityCooldownReductionMultiplier') && metadata.abilityCooldownReductionMultiplier != 1) {
        result["Ability Cooldown Rate"] = {
            "value": metadata.abilityCooldownReductionMultiplier,
            "icon": metadata.abilityCooldownReductionMultiplier > 1 ? "AbilityCooldownReductionIncreaseIcon" : "AbilityCooldownReductionDecreaseIcon"
        }
    }
    if (metadata.removeableCostMultiplier != 1 && metadata.removeableCostMultiplier != -1) {
        result["Removeable Cost"] = {
            "value": metadata.removeableCostMultiplier == 0 ? "Free" : metadata.removeableCostMultiplier == 12 ? "Disabled" : metadata.removeableCostMultiplier,
            "icon": metadata.removeableCostMultiplier > 1 ? "RemovableCostIncreaseIcon" : "RemovableCostDecreaseIcon"
        }
    }
    if (metadata._bloonModifiers.healthMultipliers.bloons != 1) {
        result["Ceramic Health"] = {
            "value": metadata._bloonModifiers.healthMultipliers.bloons,
            "icon": metadata._bloonModifiers.healthMultipliers.bloons > 1 ? "CeramicIncreaseHPIcon.png" : "CeramicDecreaseHPIcon"
        }
    }
    if (metadata._bloonModifiers.healthMultipliers.moabs != 1) {
        result["MOAB Health"] = {
            "value": metadata._bloonModifiers.healthMultipliers.moabs,
            "icon": metadata._bloonModifiers.healthMultipliers.moabs > 1 ? "MoabBoostIcon" : "MoabDecreaseHPIcon"
        }
    }
    if (metadata._bloonModifiers.healthMultipliers.hasOwnProperty('boss') && metadata._bloonModifiers.healthMultipliers.boss != 1) {
        result["Boss Health"] = {
            "value": metadata._bloonModifiers.healthMultipliers.boss,
            "icon": metadata._bloonModifiers.healthMultipliers.boss > 1 ? "BossBoostIcon" : "BossDecreaseHPIcon"
        }
    }
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

function exitChallengeModel(source){
    document.getElementById('challenge-content').style.display = "none";
    document.getElementById(`${source}-content`).style.display = "flex";
}

function exitMapModel(source){
    document.getElementById('map-content').style.display = "none";
    document.getElementById(`${source}-content`).style.display = "flex";
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
        selectorDiv.classList.add('selector-div');
        selectorDiv.addEventListener('click', () => {
            exploreContent.style.display = "none";
            document.getElementById('browser-content').style.display = "flex"
            changeBrowserTab(selector);
        })
        selectorsDiv.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
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
        selectorText.classList.add('selector-text','black-outline');
        selectorText.innerHTML = selector;
        selectorDiv.appendChild(selectorText);

        let selectorGoImg = document.createElement('img');
        selectorGoImg.classList.add('selector-go-img');
        selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
        selectorDiv.appendChild(selectorGoImg);
    })

    let enterCodeSelectors = ['Enter Challenge ID', 'Enter Map ID']

    enterCodeSelectors.forEach((selector) => {
        let selectorDiv = document.createElement('div');
        selectorDiv.classList.add('selector-div');
        selectorsDiv.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
        selectorImg.classList.add('selector-img');
        selectorDiv.appendChild(selectorImg);

        let enterCodeMiddleDiv = document.createElement('div');
        enterCodeMiddleDiv.classList.add('enter-code-middle-div');
        selectorDiv.appendChild(enterCodeMiddleDiv);

        let selectorText = document.createElement('p');
        selectorText.classList.add('selector-text','selector-text-code','black-outline');
        selectorText.innerHTML = selector;
        enterCodeMiddleDiv.appendChild(selectorText);

        let selectorInput = document.createElement('input');
        selectorInput.classList.add('selector-input');
        selectorInput.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
        })
        enterCodeMiddleDiv.appendChild(selectorInput);

        let selectorGoImg = document.createElement('img');
        selectorGoImg.classList.add('selector-go-img');
        selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
        selectorDiv.appendChild(selectorGoImg);

        switch(selector){
            case 'Enter Challenge ID':
                selectorImg.src = '../Assets/UI/EnterCodeIcon.png';
                selectorDiv.classList.add('blueprint-bg');
                selectorInput.value = "ZMGVLCF";
                selectorGoImg.addEventListener('click', async () => {
                    showLoading();
                    let challengeID = selectorInput.value.trim();
                    if(challengeID.length > 6){
                        showChallengeModel('explore', await getChallengeMetadata(challengeID), "Custom");
                    }
                })
                break;
            case 'Enter Map ID':
                selectorImg.src = '../Assets/UI/EnterCodeIcon.png';
                selectorDiv.classList.add('map-model-bg', 'map-browser-selector');
                selectorInput.value = "ZMYXDVU";
                selectorGoImg.addEventListener('click', async () => {
                    showLoading();
                    let mapID = selectorInput.value.trim();
                    if(mapID.length > 6){
                        showMapModel('explore', await getCustomMapMetadata(mapID));
                    }
                })
                break;
        }
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
    addToBackQueue({"source": "explore", "destination": 'browser'});
}

function generateBrowser(type){
    let browserContent = document.getElementById('browser-content');
    browserContent.innerHTML = "";

    let browserDiv = document.createElement('div');
    browserDiv.classList.add('browser-div');
    browserContent.appendChild(browserDiv);

    let mapsProgressHeaderBar = document.createElement('div');
    mapsProgressHeaderBar.classList.add('maps-progress-header-bar', 'browser-header-bar', 'border-top-only');
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
    mapsProgressHeaderDesc.innerHTML = "This is not a replacement for the in-game browser, this exists to show what's available on the API.<br>Only 100 entries (4 pages) are available on the API. You can enter a specific ID at the bottom right.";
    mapProgressHeaderTop.appendChild(mapsProgressHeaderDesc);

    let mapProgressHeaderBottom = document.createElement('div');
    mapProgressHeaderBottom.classList.add('map-progress-header-bottom');
    mapsProgressHeaderBar.appendChild(mapProgressHeaderBottom);

    let mapsProgressViews = document.createElement('div');
    mapsProgressViews.classList.add('maps-progress-views');
    mapProgressHeaderBottom.appendChild(mapsProgressViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressViewsText.innerHTML = "Display Type:";
    mapsProgressViews.appendChild(mapsProgressViewsText);

    let mapsProgressFilter = document.createElement('div');
    mapsProgressFilter.classList.add('maps-progress-filter');
    mapsProgressHeaderBar.appendChild(mapsProgressFilter);

    let mapProgressFilterDifficulty = document.createElement('div');
    mapProgressFilterDifficulty.classList.add('map-progress-filter-difficulty');
    mapsProgressFilter.appendChild(mapProgressFilterDifficulty);

    let mapsProgressFilterDifficultyText = document.createElement('p');
    mapsProgressFilterDifficultyText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressFilterDifficultyText.innerHTML = "Category Type:";
    mapProgressFilterDifficulty.appendChild(mapsProgressFilterDifficultyText);

    let mapProgressFilterDifficultySelect = document.createElement('select');
    mapProgressFilterDifficultySelect.classList.add('map-progress-filter-difficulty-select');
    mapProgressFilterDifficultySelect.addEventListener('change', () => {
        changeBrowserFilter(type, mapProgressFilterDifficultySelect.value);
    })
    mapProgressFilterDifficulty.appendChild(mapProgressFilterDifficultySelect);

    let leaderboardEntries = document.createElement('div');
    leaderboardEntries.id = 'browser-entries';
    browserDiv.appendChild(leaderboardEntries);

    let leaderboardFooter = document.createElement('div');
    leaderboardFooter.classList.add('browser-footer');
    browserDiv.appendChild(leaderboardFooter);

    let leaderboardFooterLeft = document.createElement('div');
    leaderboardFooterLeft.classList.add('leaderboard-footer-left', 'browser-footer-left');
    leaderboardFooter.appendChild(leaderboardFooterLeft);
    
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

    let leaderboardFooterMiddle = document.createElement('div');
    leaderboardFooterMiddle.classList.add('leaderboard-footer-middle', 'browser-footer-middle');
    leaderboardFooter.appendChild(leaderboardFooterMiddle);

    let leaderboardFooterPageLeft = document.createElement('img');
    leaderboardFooterPageLeft.classList.add('leaderboard-footer-page-left','black-outline');
    leaderboardFooterPageLeft.src = "./Assets/UI/NextArrowSmallYellow.png";
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageLeft);
    
    let leaderboardFooterPageNumber = document.createElement('div');
    leaderboardFooterPageNumber.id = 'browser-footer-page-number';
    leaderboardFooterPageNumber.classList.add('leaderboard-footer-page-number','black-outline');
    leaderboardFooterPageNumber.innerHTML = `Loading...`;
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageNumber);
    
    let leaderboardFooterPageRight = document.createElement('img');
    leaderboardFooterPageRight.classList.add('leaderboard-footer-page-right','black-outline');
    leaderboardFooterPageRight.src = "./Assets/UI/NextArrowSmallYellow.png";
    leaderboardFooterPageLeft.addEventListener('click', () => {
        if (browserPage <= 1) { return; }
        if(refreshRateLimited) { return }
        browserPage--;
        leaderboardFooterPageNumber.innerHTML = `Page ${browserPage} of 4`;
        leaderboardEntries.innerHTML = "";
        copyLoadingIcon(leaderboardEntries)
        generateBrowserEntries(type)
        leaderboardFooterPageRight.style.filter = "grayscale(1) brightness(0.5)";
        leaderboardFooterPageLeft.style.filter = "grayscale(1) brightness(0.5)";
        setTimeout(() => {
            leaderboardFooterPageRight.style.filter = "none";
            leaderboardFooterPageLeft.style.filter = "none";
            refreshRateLimited = false;
        }, 5000)
        refreshRateLimited = true;
    })
    leaderboardFooterPageRight.addEventListener('click', () => {
        if (browserPage >= 4) { return; }
        if(refreshRateLimited) { return }
        browserPage++;
        leaderboardFooterPageNumber.innerHTML = `Page ${browserPage} of 4`;
        leaderboardEntries.innerHTML = "";
        copyLoadingIcon(leaderboardEntries)
        generateBrowserEntries(type)
        leaderboardFooterPageRight.style.filter = "grayscale(1) brightness(0.5)";
        leaderboardFooterPageLeft.style.filter = "grayscale(1) brightness(0.5)";
        setTimeout(() => {
            leaderboardFooterPageRight.style.filter = "none";
            leaderboardFooterPageLeft.style.filter = "none";
            refreshRateLimited = false;
        }, 5000)
        refreshRateLimited = true;
    })
    leaderboardFooterMiddle.appendChild(leaderboardFooterPageRight);

    let leaderboardFooterRight = document.createElement('div');
    leaderboardFooterRight.classList.add('leaderboard-footer-right', 'browser-footer-right');
    leaderboardFooter.appendChild(leaderboardFooterRight);

    let leaderboardFooterGoto = document.createElement('p');
    leaderboardFooterGoto.classList.add('leaderboard-footer-goto','black-outline');
    leaderboardFooterGoto.innerHTML = "ID:";
    leaderboardFooterRight.appendChild(leaderboardFooterGoto);

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
        type == "Map Browser" ? showMapModel('browser', await getCustomMapMetadata(leaderboardFooterPageInput.value.trim())) : showChallengeModel('browser', await getChallengeMetadata(leaderboardFooterPageInput.value.trim()), "Custom");
    })
    leaderboardFooterRight.appendChild(selectorGoImg);

    switch(type) {
        case "Challenge Browser":
            let mapsProgressGrid = document.createElement('div');
            mapsProgressGrid.classList.add('maps-progress-view', 'stats-tab-yellow', 'black-outline');
            mapsProgressGrid.innerHTML = "Grid";
            mapsProgressViews.appendChild(mapsProgressGrid);
            

            let mapsProgressGame = document.createElement('div');
            mapsProgressGame.classList.add('maps-progress-view', 'black-outline');
            mapsProgressGame.innerHTML = "List";
            mapsProgressViews.appendChild(mapsProgressGame);

            mapsProgressGrid.addEventListener('click', () => {
                currentBrowserView = "Grid";
                mapsProgressGrid.classList.add('stats-tab-yellow');
                mapsProgressGame.classList.remove('stats-tab-yellow');
                generateBrowserEntries(type)
            })

            mapsProgressGame.addEventListener('click', () => {
                currentBrowserView = "List";
                mapsProgressGame.classList.add('stats-tab-yellow');
                mapsProgressGrid.classList.remove('stats-tab-yellow');
                generateBrowserEntries(type)
            })


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
            mapsProgressGameMap.classList.add('maps-progress-view', 'stats-tab-yellow', 'black-outline');
            mapsProgressGameMap.innerHTML = "Grid";
            mapsProgressViews.appendChild(mapsProgressGameMap);

            let mapsProgressGallery = document.createElement('div');
            mapsProgressGallery.classList.add('maps-progress-view', 'black-outline');
            mapsProgressGallery.innerHTML = "Gallery";
            mapsProgressViews.appendChild(mapsProgressGallery);

            mapsProgressGameMap.addEventListener('click', () => {
                currentBrowserView = "Grid";
                mapsProgressGameMap.classList.add('stats-tab-yellow');
                mapsProgressGallery.classList.remove('stats-tab-yellow');
                generateBrowserEntries(type);
            })
            mapsProgressGallery.addEventListener('click', () => {
                currentBrowserView = "Gallery";
                mapsProgressGallery.classList.add('stats-tab-yellow');
                mapsProgressGameMap.classList.remove('stats-tab-yellow');
                generateBrowserEntries(type)
            })

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
    showLoading();
    document.getElementById('browser-entries').innerHTML = "";
    generateBrowserEntries(type);
}

async function generateBrowserEntries(type){
    await getBrowserData();

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
        noDataFound.classList.add('no-data-found','black-outline');
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
                avatarImg.src = "../Assets/ProfileAvatar/ProfileAvatar01.png";
                avatar.appendChild(avatarImg);
    
                let challengeCreatorName = document.createElement('p');
                challengeCreatorName.classList.add('browser-creator-name', 'black-outline');
                challengeCreatorName.innerHTML = preventRateLimiting ? "Click to Load Creator" : "Loading...";
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
                    // openBTD6Link(`btd6://Challenge/${entry.id}`)
                    openBTD6Site(`https://join.btd6.com/Challenge/${entry.id}`);
                });
                challengeIDandPlay.appendChild(selectorGoImg);

                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(async observerentry => {
                        if (observerentry.isIntersecting) {
                            observer.unobserve(observerentry.target);
                            let challengeData = await getChallengeMetadata(entry.id);
                            if (challengeData == null) { return; }
                            challengeMapImg.src = Object.keys(constants.mapsInOrder).includes(challengeData.map) ? getMapIcon(challengeData.map) : challengeData.mapURL;
                            let modifiers = challengeModifiers(challengeData);
                            let rules = challengeRules(challengeData)
                            for (let modifier of Object.values(modifiers)) {
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
                            challengeTrophyValue.innerHTML = challengeData.playsUnique == 0 ? "0.00%" : challengeData.winsUnique - challengeData.playsUnique == 0 ? "0.00%" : `${((challengeData.winsUnique / challengeData.playsUnique) * 100).toFixed(2)}%`;
                            challengeSkullValue.innerHTML = challengeData.playsUnique == 0 ? "0.00%" : `${((challengeData.wins / (challengeData.plays + challengeData.restarts)) * 100).toFixed(2)}%`;
                            challengeCreator.addEventListener('click', async (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                challengeCreatorName.innerHTML = "Loading...";
                                let creatorData = await getUserProfile(challengeData.creator);
                                if (creatorData == null) { 
                                    challengeCreatorName.innerHTML = "Click to Load Creator";
                                    return; 
                                }
                                challengeCreatorName.innerHTML = creatorData.displayName;
                                if (creatorData.displayName.length > 13) { challengeCreatorName.style.fontSize = '17px' }
                                avatarImg.src = getProfileAvatar(creatorData);
                                challengeBottom.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(creatorData)})`;
                                challengeCreator.removeEventListener('click', arguments.callee);
                                challengeCreator.addEventListener('click', () => openProfile("browser", challengeData.creator));
                            })
                            if (!preventRateLimiting) {
                                challengeCreator.click();
                            }
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
                avatarImg2.src = "../Assets/ProfileAvatar/ProfileAvatar01.png";
                avatar2.appendChild(avatarImg2);
    
                let challengeCreatorName2 = document.createElement('p');
                challengeCreatorName2.classList.add('browser-creator-name', 'black-outline');
                challengeCreatorName2.innerHTML = preventRateLimiting ? "Click to Load Creator" : "Loading...";
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
                    // openBTD6Link(`btd6://Challenge/${entry.id}`)
                    openBTD6Site(`https://join.btd6.com/Challenge/${entry.id}`);
                });
                challengeIDandPlay2.appendChild(selectorGoImg2);

                let observer2 = new IntersectionObserver((entries, observer) => {
                    entries.forEach(async observerentry => {
                        if (observerentry.isIntersecting) {
                            observer.unobserve(observerentry.target);
                            let challengeData = await getChallengeMetadata(entry.id);
                            if (challengeData == null) { return; }
                            challengeMapImg2.src = Object.keys(constants.mapsInOrder).includes(challengeData.map) ? getMapIcon(challengeData.map) : challengeData.mapURL;
                            challengeUpvoteValue2.innerHTML = challengeData.upvotes.toLocaleString();
                            challengeTrophyValue2.innerHTML = challengeData.playsUnique == 0 ? "0.00%" : challengeData.winsUnique - challengeData.playsUnique == 0 ? "0.00%" : `${((challengeData.winsUnique / challengeData.playsUnique) * 100).toFixed(2)}%`;
                            challengeSkullValue2.innerHTML = challengeData.playsUnique == 0 ? "0.00%" : `${((challengeData.wins / (challengeData.plays + challengeData.restarts)) * 100).toFixed(2)}%`;
                            challengeCreator2.addEventListener('click', async (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                challengeCreatorName2.innerHTML = "Loading...";
                                let creatorData = await getUserProfile(challengeData.creator);
                                if ( creatorData == null ) { 
                                    challengeCreatorName2.innerHTML = "Click to Load Creator";
                                    return; 
                                }
                                challengeCreatorName2.innerHTML = creatorData.displayName;
                                if (creatorData.displayName.length > 13) { challengeCreatorName2.style.fontSize = '17px' }
                                avatarImg2.src = getProfileAvatar(creatorData);
                                challengeCreator2.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(${getProfileBanner(creatorData)})`;
                                challengeCreator2.removeEventListener('click', arguments.callee);
                                challengeCreator2.addEventListener('click', () => openProfile("browser", challengeData.creator));
                            })
                            if (!preventRateLimiting) {
                                challengeCreator2.click();
                            }
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
        errorModal(`Failed to copy text "${ID}" to clipboard. ${err}`);
    });
}

function generateMapGameEntries(destination) {
    browserData.forEach((entry, index) => {
        let mapEntry = document.createElement('div');
        mapEntry.addEventListener('click', async () => {
            showLoading();
            showMapModel('browser', await getCustomMapMetadata(entry.id));
        })
        destination.appendChild(mapEntry);
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
                avatarImg.src = "../Assets/ProfileAvatar/ProfileAvatar01.png";
                avatar.appendChild(avatarImg);
    
                let challengeCreatorName = document.createElement('p');
                challengeCreatorName.classList.add('browser-creator-name', 'black-outline');
                challengeCreatorName.innerHTML = preventRateLimiting ? "Click to Load Creator" : "Loading...";
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
                    // openBTD6Link(`btd6://Map/${entry.id}`)
                    openBTD6Site(`https://join.btd6.com/Map/${entry.id}`);
                });
                challengeIDandPlay.appendChild(selectorGoImg);

                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(async observerentry => {
                        if (observerentry.isIntersecting) {
                            observer.unobserve(observerentry.target);
                            let customMapData = await getCustomMapMetadata(entry.id);
                            if (customMapData == null) { return; }
                            challengeUpvoteValue.innerHTML = customMapData.upvotes.toLocaleString();
                            challengeTrophyValue.innerHTML = customMapData.playsUnique == 0 ? "0.00%" : customMapData.winsUnique - customMapData.playsUnique == 0 ? "0.00%" : `${((customMapData.winsUnique / customMapData.playsUnique) * 100).toFixed(2)}%`;
                            challengeSkullValue.innerHTML = customMapData.playsUnique == 0 ? "0.00%" : `${((customMapData.wins / (customMapData.plays + customMapData.restarts)) * 100).toFixed(2)}%`;
                            challengeCreator.addEventListener('click', async (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                challengeCreatorName.innerHTML = "Loading...";
                                let creatorData = await getUserProfile(customMapData.creator);
                                if ( creatorData == null ) { 
                                    challengeCreatorName.innerHTML = "Click to Load Creator";
                                    return; 
                                }
                                challengeCreatorName.innerHTML = creatorData.displayName;
                                if (creatorData.displayName.length > 13) { challengeCreatorName.style.fontSize = '17px' }
                                avatarImg.src = getProfileAvatar(creatorData);
                                challengeBottom.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(creatorData)})`;
                                challengeCreator.removeEventListener('click', arguments.callee);
                                challengeCreator.addEventListener('click', () => openProfile("browser", customMapData.creator));
                            })
                            if (!preventRateLimiting) {
                                challengeCreator.click();
                            }
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

    addToBackQueue({ source: source, destination: 'map' })

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
        // exitMapModel(source);
        goBack();
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
        // openBTD6Link(`btd6://Map/${metadata.id}`);
        openBTD6Site(`https://join.btd6.com/Map/${metadata.id}`);
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
            avatarImg.src = "../Assets/ProfileAvatar/ProfileAvatar01.png";
            avatar.appendChild(avatarImg);

            let challengeCreatorName = document.createElement('p');
            challengeCreatorName.classList.add('challenge-creator-name', 'black-outline');
            challengeCreatorName.innerHTML = preventRateLimiting ? "Click to Load Creator" : "Loading...";
            challengeCreator.appendChild(challengeCreatorName);
            
            challengeCreator.addEventListener('click', async () => {
                challengeCreatorName.innerHTML = "Loading...";
                let data = await getUserProfile(challengeExtraData["Creator"])
                if (data == null) { 
                    challengeCreatorName.innerHTML = "Click to Load Creator";
                    return; 
                }
                challengeCreatorName.innerHTML = data.displayName;
                avatarImg.src = getProfileAvatar(data);
                challengeCreator.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(data)})`;
                challengeCreator.removeEventListener('click', arguments.callee);
                challengeCreator.addEventListener('click', () => {
                    openProfile('map', challengeExtraData["Creator"]);
                })
            });
            if(!preventRateLimiting) {
                challengeCreator.click();
            }
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

    changeTitle("Bloons TD 6 API Explorer")

    let explorePage = document.createElement('div');
    explorePage.classList.add('progress-page');
    extrasContent.appendChild(explorePage);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.classList.add('selectors-div');
    explorePage.appendChild(selectorsDiv);

    let selectors = [
        // 'Collection Event Odds',
        // 'Export Data', 
        'Rogue Legends Artifacts',
        'Challenge & Map Browser',
        'Settings',
        // 'Send Feedback',
        "Use Code 'HalfHydra' <br>in the BTD6 Shop!",
        "Discord Server"
    ];

    if (!loggedIn) {
        selectors = selectors.filter(selector => selector != 'Collection Event Odds');
    }

    selectors.forEach((selector) => {
        let selectorDiv = document.createElement('div');
        selectorDiv.classList.add('selector-div', 'blueprint-bg');
        selectorDiv.addEventListener('click', () => {
            extrasContent.style.display = "none";
            document.getElementById('extras-content').style.display = "flex"
            changeExtrasTab(selector);
        })
        selectorsDiv.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
        selectorImg.classList.add('selector-img');
        selectorDiv.appendChild(selectorImg);

        switch(selector){
            case 'Custom Round Sets':
                selectorImg.src = '../Assets/ChallengeRulesIcon/CustomRoundIcon.png';
                break;
            case 'Featured Insta Schedule':
                selectorImg.src = '../Assets/UI/InstaBtn.png';
                break;
            case 'Collection Event Odds':
                selectorImg.src = '../Assets/UI/CollectingEventTotemBtn.png';
                break;
            case 'Monkey Money Helper':
                selectorImg.src = '../Assets/UI/WoodenRoundButton.png';
                break;
            case "Send Feedback":
                selectorImg.src = '../Assets/UI/FeedbackBtn.png';
                break;
            case "Settings":
                selectorImg.src = '../Assets/UI/OptionsBtn.png';
                break;
            case "Use Code 'HalfHydra' <br>in the BTD6 Shop!":
                selectorImg.src = '../Assets/UI/CreatorSupportBtn.png';
                break;
            case "Rogue Legends Artifacts":
                selectorDiv.classList.add("rogue-bg")
                selectorImg.src = '../Assets/UI/RogueBtn.png';
                break;
            case "Challenge & Map Browser":
                selectorImg.src = '../Assets/UI/PatchNotesMonkeyIcon.png';
                break;
            case "Discord Server":
                selectorImg.src = '../Assets/UI/DiscordBtn.png';
                break;
            default: 
                selectorImg.src = '../Assets/UI/WoodenRoundButton.png';
                break;
        }

        let selectorText = document.createElement('p');
        selectorText.classList.add('selector-text','black-outline');
        selectorText.innerHTML = selector;
        selectorDiv.appendChild(selectorText);

        let selectorGoImg = document.createElement('img');
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
        case "Featured Insta Schedule":
            addToBackQueue({ source: "extras", destination: "featured" });
            generateInstaSchedule();
            document.getElementById('extras-content').style.display = "none";
            document.getElementById('featured-content').style.display = "flex";
            break;
        case "Collection Event Odds": 
            changeTab('profile');
            currentInstaView = "collection";
            changeProgressTab('InstaMonkeys');
            break;
        case "CreatorSupport":
        case "Use Code 'HalfHydra' <br>in the BTD6 Shop!":
            addToBackQueue({ callback: generateExtrasPage });
            generateArticle("CreatorSupport")
            break;
        case 'Settings':
            addToBackQueue({ callback: generateExtrasPage });
            generateSettings();
            break;
        case "Rogue Legends Artifacts":
            changeTitle("Rogue Legends Artifacts")
            addToBackQueue({source: "extras", destination: "rogue", callback: generateExtrasPage });
            generateRogueSelectors();
            document.getElementById('extras-content').style.display = "none";
            document.getElementById('rogue-content').style.display = "flex";
            break;
        case "Challenge & Map Browser":
            addToBackQueue({source: "extras", destination: "explore", callback: generateExtrasPage });
            generateExplore();
            document.getElementById('extras-content').style.display = "none";
            document.getElementById('explore-content').style.display = "flex";
            break;
        case "Discord Server":
            window.open("https://discord.gg/BSpSeXrAQy", "_blank");
            break;
    }
}

function generateArticle(content){
    let articleContent = document.getElementById('extras-content');
    articleContent.innerHTML = "";

    let articlePage = document.createElement('div');
    articlePage.classList.add('article-page');
    articleContent.appendChild(articlePage);

    let articleContentDiv = document.createElement('div');
    articleContentDiv.classList.add('d-flex', 'fd-column', 'ai-center');
    articlePage.appendChild(articleContentDiv);

    let articles = {
        "CreatorSupport": [
            {
                "type": "text",
                "class": "oak-instructions-text",
                "content": "Creator support is a program offered by Ninja Kiwi that allows players to give a cut of the purchases you make in game to the creator who's code you've entered in the Bloons TD 6 shop. You can support me and my site by using the code \"HalfHydra\""
            },
            {
                "type": "text",
                "class": "site-info-header black-outline",
                "content": "How to enter a creator code:"
            },
            {
                "type": "panels",
                "content": {
                    "1": {
                        "name": "Step 1",
                        "desc": "On the main menu after pressing start, navigate to the shop",
                        "img": "CS1"
                    },
                    "2": {
                        "name": "Step 2",
                        "desc": "Press the creator support button on the bottom left",
                        "img": "CS2"
                    },
                    "3": {
                        "name": "Step 3",
                        "desc": "Enter code \"HalfHydra\" (or any other creators code) and press submit. When purchasing anything in the store, a cut will go to the creator chosen.",
                        "img": "CS3"
                    }
                }
            },
            {
                "type": "text",
                "class": "site-info-header black-outline ta-center",
                "content": "Try the Official Bloons TD 6 Web Store!"
            },
            {
                "type": "text",
                "class": "oak-instructions-text",
                "content": "In addition to frequent sales exclusive to the web store, purchasing in game items on the web store will give you bonus rewards such as extra Monkey Money. You can also leave a tip if wish to support me further! <a href='https://btd6store.ninjakiwi.com/' target='_blank' rel='noopener noreferrer'>Official Bloons TD 6 Web Store</a>"
            },
            {
                "type": "img",
                "class": "insta-monkey-guide-method-img",
                "content": "CS4.png",
            }
        ]
    }

    articles[content].forEach((section) => {
        switch(section.type){
            case "text":
                let articleText = document.createElement('p');
                if (section.class) { articleText.className = section.class };
                articleText.innerHTML = section.content;
                articleContentDiv.appendChild(articleText);
                break;
            case "img":
                let articleImg = document.createElement('img');
                if (section.class) { articleImg.className = section.class };
                articleImg.style.width = "800px";
                articleImg.src = `../Assets/UI/${section.content}`;
                articleContentDiv.appendChild(articleImg);
                break;
            case "panels":
                let panels = section.content;

                let panelContainer = document.createElement('div');
                panelContainer.classList.add('insta-monkey-guide-container');
                articleContentDiv.appendChild(panelContainer);

                Object.keys(panels).forEach(method => {
                    let panel = document.createElement('div');
                    panel.classList.add('insta-monkey-guide-method');
                    panelContainer.appendChild(panel);

                    let panelName = document.createElement('p');
                    panelName.classList.add('insta-monkey-guide-method-text','black-outline');
                    panelName.innerHTML = panels[method].name;
                    panel.appendChild(panelName);

                    let panelDesc = document.createElement('p');
                    panelDesc.classList.add('insta-monkey-guide-method-desc');
                    panelDesc.innerHTML = panels[method].desc;
                    panel.appendChild(panelDesc);

                    let panelImg = document.createElement('img');
                    panelImg.classList.add('insta-monkey-guide-method-img');
                    panelImg.src = `./Assets/UI/${panels[method].img}.png`;
                    panel.appendChild(panelImg);
                })
        }
    })

}

function generateSettings(){
    let settingsContent = document.getElementById('extras-content');
    settingsContent.innerHTML = "";

    let settings = {
        "ProfileLoading": {
            "name": "Load Profiles Automatically",
            "description": "When switched on, user profiles on leaderboards and the content browser will load and display user cosmetics. Otherwise user profiles will need to be clicked to be loaded. This option may cause you to be rate limited much faster (you will need to wait a few minutes before loading any new content from the Ninja Kiwi API on the site if you reach a threshold).",
            "input": "toggle"
        },
        "UseNamedMonkeys": {
            "name": "Use Named Monkeys Nicknames",
            "description": "When switched on, the site will use the nicknames you've set for towers instead of the tower names.",
            "input": "toggle"
        },
        "TeamsStoreItems": {
            "name": "Show Teams Store Items in Progress Tab",
            "description": "When switched on, the progress tab will show collected team store items. I don't have a way to test this so it may not work.",
            "input": "toggle"
        }
    }

    let settingsContainer = document.createElement('div');
    settingsContainer.classList.add('article-page');
    settingsContent.appendChild(settingsContainer);

    let settingsTitle = document.createElement('p');
    settingsTitle.classList.add('hero-progress-header-text', 'settings-text');
    settingsTitle.innerHTML = "Settings";
    settingsContainer.appendChild(settingsTitle);

    let settingsOptionsContainer = document.createElement('div');
    settingsOptionsContainer.classList.add('settings-options-container');
    settingsContainer.appendChild(settingsOptionsContainer);

    for (let setting in settings) {
        let settingDiv = document.createElement('div');
        settingDiv.classList.add('setting-div');
        settingsOptionsContainer.appendChild(settingDiv);

        let settingName = document.createElement('p');
        settingName.classList.add('insta-monkey-guide-method-text', 'black-outline');
        settingName.innerHTML = settings[setting].name;
        settingDiv.appendChild(settingName);

        let settingInfoDiv = document.createElement('div');
        settingInfoDiv.classList.add('setting-info-div');
        settingDiv.appendChild(settingInfoDiv);

        let settingDescription = document.createElement('p');
        settingDescription.classList.add('insta-monkey-guide-method-desc', 'setting-desc');
        settingDescription.innerHTML = settings[setting].description;
        settingInfoDiv.appendChild(settingDescription);

        let settingInputDiv = document.createElement('label');
        settingInputDiv.classList.add('setting-input-label');
        settingInfoDiv.appendChild(settingInputDiv);

        let settingInput = document.createElement('input');
        settingInput.classList.add('setting-input');
        settingInputDiv.appendChild(settingInput);

        switch (settings[setting].input){
            case "toggle":
                let toggleImg = document.createElement('span');
                toggleImg.classList.add('toggle-img', 'slider');
                toggleImg.src = "../Assets/UI/BlueBtnCircleSmall.png";
                settingInputDiv.appendChild(toggleImg);

                settingInput.type = "checkbox";

                settingInputDiv.classList.add('switch');
                break;
        }
        

        switch (setting){
            case "ProfileLoading":
                settingInput.checked = !preventRateLimiting;
                settingInput.addEventListener('change', () => { 
                    preventRateLimiting = !settingInput.checked;
                    saveSettings();
                })
                break;
            case "UseNamedMonkeys":
                settingInput.checked = useNamedMonkeys;
                settingInput.addEventListener('change', () => {
                    useNamedMonkeys = !useNamedMonkeys;
                    saveSettings();
                });
                break;
            case "TeamsStoreItems":
                settingInput.checked = showTeamsItems;
                settingInput.addEventListener('change', () => {
                    showTeamsItems = !showTeamsItems;
                    saveSettings();
                });
        }
    }
    // let whereButton = document.createElement('p');
    // whereButton.classList.add('where-button','return-entry-button','black-outline');
    // whereButton.innerHTML = 'Clear Local Storage';
    // whereButton.addEventListener('click', () => {
    //     localStorage.clear();
    //     location.reload();
    // })
    // settingsOptionsContainer.appendChild(whereButton);
}

function generateTrophyStoreProgress() {
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    let progressContainer = document.createElement('div');
    progressContainer.classList.add('trophy-store-progress-container');
    progressContent.appendChild(progressContainer);

    let achievementsHeaderBar = document.createElement('div');
    achievementsHeaderBar.classList.add('trophy-store-header-bar');
    progressContainer.appendChild(achievementsHeaderBar);

    let headerTop = document.createElement('div');
    headerTop.classList.add('achievements-header-bar');
    achievementsHeaderBar.appendChild(headerTop);

    let headerBottom = document.createElement('div');
    achievementsHeaderBar.appendChild(headerBottom);

    let trophyStoreItemDisclaimer = createEl('p', {classList: ['font-gardenia', 'ta-center'], style: {marginBottom: "10px"}, innerHTML: "This is being tested, not all items may show up as collected properly."});
    headerBottom.appendChild(trophyStoreItemDisclaimer);

    let subFilterContainer = document.createElement('div');
    subFilterContainer.classList.add('sub-filter-container');
    subFilterContainer.style.display = "none";
    headerBottom.appendChild(subFilterContainer);

    let achievementsViews = document.createElement('div');
    achievementsViews.classList.add('maps-progress-views');
    headerTop.appendChild(achievementsViews);

    let mapProgressFilterDifficulty2 = document.createElement('div');
    mapProgressFilterDifficulty2.classList.add('map-progress-filter-difficulty');
    achievementsViews.appendChild(mapProgressFilterDifficulty2);

    let mapsProgressFilterDifficultyText2 = document.createElement('p');
    mapsProgressFilterDifficultyText2.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressFilterDifficultyText2.innerHTML = "Filter:";
    mapProgressFilterDifficulty2.appendChild(mapsProgressFilterDifficultyText2);

    let mapProgressFilterDifficultySelect2 = document.createElement('select');
    mapProgressFilterDifficultySelect2.classList.add('map-progress-filter-difficulty-select');

    let options2 = ["All", "Heroes","Monkeys","Bloons","Coop","Game & UI"]
    options2.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option === "Game & UI" ? "GameUI" : option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect2.appendChild(difficultyOption);
    })
    mapProgressFilterDifficulty2.appendChild(mapProgressFilterDifficultySelect2);


    let trophyStoreItemCounter = document.createElement('p');
    trophyStoreItemCounter.classList.add('trophy-store-item-counter', 'black-outline');
    trophyStoreItemCounter.innerHTML = "0/0";
    headerTop.appendChild(trophyStoreItemCounter);

    mapProgressFilterDifficultySelect2.addEventListener('change', () => {
        trophyStoreSubFilter = "All"
        if (mapProgressFilterDifficultySelect2.value !== "All") {
            generateSubFilterButtons(mapProgressFilterDifficultySelect2.value);
        } else {
            subFilterContainer.style.display = "none";
        }
        generateTrophyStoreContainer(mapProgressFilterDifficultySelect2.value, mapProgressFilterDifficultySelect.value, trophyStoreItemCounter);
    })

    let mapsProgressFilter = document.createElement('div');
    mapsProgressFilter.classList.add('maps-progress-filter');
    headerTop.appendChild(mapsProgressFilter);

    let displayFilterToggles = document.createElement('div');
    displayFilterToggles.classList.add('map-progress-filter-difficulty');
    mapsProgressFilter.appendChild(displayFilterToggles);

    let displayFiltersText = document.createElement('p');
    displayFiltersText.classList.add('maps-progress-coop-toggle-text','black-outline');
    displayFiltersText.innerHTML = "Display:";
    displayFilterToggles.appendChild(displayFiltersText);

    let mapProgressFilterDifficultySelect = document.createElement('select');
    mapProgressFilterDifficultySelect.classList.add('map-progress-filter-difficulty-select');
    mapProgressFilterDifficultySelect.addEventListener('change', () => {
        generateTrophyStoreContainer(mapProgressFilterDifficultySelect2.value, mapProgressFilterDifficultySelect.value, trophyStoreItemCounter);
    })
    let options = ["All","Owned","Unowned","Hidden"]
    options.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect.appendChild(difficultyOption);
    })
    displayFilterToggles.appendChild(mapProgressFilterDifficultySelect);

    let itemsContainer = document.createElement('div');
    itemsContainer.id = 'trophy-store-items-container';
    itemsContainer.classList.add('trophy-store-items-container');
    progressContainer.appendChild(itemsContainer);

    function generateSubFilterButtons(subFilter) {
        subFilterContainer.innerHTML = "";
        subFilterContainer.style.display = "flex";
        subFiltersMap[subFilter].forEach((subFilterOption) => {
            let subFilterButton = document.createElement('div');
            subFilterButton.classList.add('maps-progress-view', 'sub-filter', 'black-outline');
            if (subFilterOption === "All") {
                subFilterButton.classList.add('stats-tab-yellow');
            }
            subFilterButton.innerHTML = getLocValue(`Filter${subFilterOption}`);
            subFilterButton.addEventListener('click', () => {
                trophyStoreSubFilter = subFilterOption;
                //add "stats-tab-yellow" to the selected button and remove it from all others
                Array.from(subFilterContainer.children).forEach((button) => {
                    if (button === subFilterButton) {
                        button.classList.add('stats-tab-yellow');
                    } else {
                        button.classList.remove('stats-tab-yellow');
                    }
                })
                generateTrophyStoreContainer(mapProgressFilterDifficultySelect2.value, mapProgressFilterDifficultySelect.value, trophyStoreItemCounter);
            })
            subFilterContainer.appendChild(subFilterButton);
        })
    
    }

    generateTrophyStoreContainer("All", "All", trophyStoreItemCounter);
}

function getTrophyItemObtained(key) {
    if (btd6usersave.trophyStoreItems.hasOwnProperty(key) && btd6usersave.trophyStoreItems[key] == true) {
        return true;
    } else if (btd6usersave.trophyStoreItems.hasOwnProperty(trophyStoreKeyFixes[key])) {
        return btd6usersave.trophyStoreItems[trophyStoreKeyFixes[key]];
    } else {
        return false;
    }
}

function generateTrophyStoreContainer(filter, display, counter) {
    let itemsContainer = document.getElementById('trophy-store-items-container');
    itemsContainer.innerHTML = "";

    let trophyStoreItemsToDisplay = JSON.parse(JSON.stringify(trophyStoreItemsJSON));
    
    for (let key of constants.unreleasedContent.trophyStoreItems) {
        delete trophyStoreItemsToDisplay[key];
    }
    if (filter !== "All") {
        trophyStoreItemsToDisplay = Object.fromEntries(Object.entries(trophyStoreItemsToDisplay).filter(([key, data]) => data.storeFilter === filter));
    }
    if (trophyStoreSubFilter !== "All") {
        trophyStoreItemsToDisplay = Object.fromEntries(Object.entries(trophyStoreItemsToDisplay).filter(([key, data]) => data.subFilter === trophyStoreSubFilter));
    }

    switch(display) {
        case "All":
            break;
        case "Unowned":
            trophyStoreItemsToDisplay = Object.fromEntries(Object.entries(trophyStoreItemsToDisplay).filter(([key, data]) => !getTrophyItemObtained(key)));
            break;
        case "Owned":
            trophyStoreItemsToDisplay = Object.fromEntries(Object.entries(trophyStoreItemsToDisplay).filter(([key, data]) => getTrophyItemObtained(key)));
            break;
        case "Hidden":
            trophyStoreItemsToDisplay = Object.fromEntries(Object.entries(trophyStoreItemsToDisplay).filter(([key, data]) => data.hidden));
            trophyStoreItemsToDisplay = Object.fromEntries(Object.entries(trophyStoreItemsToDisplay).sort(([key1, data1], [key2, data2]) => {
                if (btd6usersave.trophyStoreItems.hasOwnProperty(key1) && btd6usersave.trophyStoreItems[key1] && (!btd6usersave.trophyStoreItems.hasOwnProperty(key2) || !btd6usersave.trophyStoreItems[key2])) {
                    return 1;
                } else if ((!btd6usersave.trophyStoreItems.hasOwnProperty(key1) || !btd6usersave.trophyStoreItems[key1]) && btd6usersave.trophyStoreItems.hasOwnProperty(key2) && btd6usersave.trophyStoreItems[key2]) {
                    return -1;
                } else {
                    return 0;
                }
            }));
            break;
    }

    switch(display){
        case "Unowned":
        case "Owned":
            counter.innerHTML = `${Object.keys(trophyStoreItemsToDisplay).length} Items`;
            break;
        default:
            counter.innerHTML = `${Object.keys(trophyStoreItemsToDisplay).filter(key => getTrophyItemObtained(key)).length}/${Object.keys(trophyStoreItemsToDisplay).length} Owned`;
    }

    if (Object.keys(trophyStoreItemsToDisplay).length == 0) {
        counter.innerHTML = "No Items Match";
    }

    for (let [key, data] of Object.entries(trophyStoreItemsToDisplay)) {
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('trophy-store-item-div');
        itemsContainer.appendChild(itemDiv);

        let itemImg = document.createElement('img');
        itemImg.classList.add('trophy-store-item-img', 'trophy-store-item-div');
        itemImg.src = data.itemType === "Avatar"?  `../Assets/ProfileAvatar/${data.icon}.png` : `../Assets/TrophyStoreIcon/${data.icon}.png`;
        itemDiv.appendChild(itemImg);
        itemImg.loading = "lazy";
        itemDiv.addEventListener('click', () => {
            generateTrophyStorePopout(key);
        })

        let itemText = document.createElement('p');
        itemText.classList.add('trophy-store-item-text');
        itemText.innerHTML = getLocValue(`${key}ShortName`);
        itemDiv.appendChild(itemText);

        if (data.subFilter === "TextEmotes") {
            let itemTextEmote = document.createElement('p');
            itemTextEmote.classList.add('trophy-store-item-text-emote', 'black-outline');
            itemTextEmote.innerHTML = key === "CoopEmoteAnimationHappyHolidays" ? getLocValue(`${key}ShortName`) : getLocValue(`${key}Word`);
            itemDiv.appendChild(itemTextEmote);
        }

        if (getTrophyItemObtained(key)) {
            // let collectedTick = document.createElement('img');
            // collectedTick.classList.add('trophy-store-collected');
            // collectedTick.src = "../Assets/UI/SelectedTick.png";
            // itemDiv.appendChild(collectedTick);

            let collectedText = document.createElement('p');
            collectedText.classList.add('trophy-store-collected-text', 'black-outline');
            collectedText.innerHTML = "Owned";
            itemDiv.appendChild(collectedText);

            itemImg.style.borderImageSource = "url(../Assets/UI/TrophyBGPanelBlue.png)";
        }

        let itemTypeIcon = document.createElement('img');
        itemTypeIcon.classList.add('trophy-store-item-type-icon');
        itemTypeIcon.src = `../Assets/UI/Trophy${data.storeFilter}Icon.png`;
        itemDiv.appendChild(itemTypeIcon);
    }
}

function generateTrophyStorePopout(key) {
    let data = trophyStoreItemsJSON[key];

    let modalContent = document.createElement('div');
    // modalContent.classList.add('collection-modal');
    // modal.appendChild(modalContent);

    //getLocValue(`${key}ShortName`);

    let imgAndDetails = document.createElement('div');
    imgAndDetails.classList.add('item-img-and-details');
    modalContent.appendChild(imgAndDetails);

    let itemDiv = document.createElement('div');
    itemDiv.classList.add('modal-trophy-div');
    imgAndDetails.appendChild(itemDiv);

    let itemImg = document.createElement('img');
    itemImg.classList.add('trophy-store-item-img', 'trophy-store-item-div', 'modal-trophy-item');
    itemImg.src = data.itemType === "Avatar"?  `../Assets/ProfileAvatar/${data.icon}.png` : `../Assets/TrophyStoreIcon/${data.icon}.png`;
    itemDiv.appendChild(itemImg);

    if (data.subFilter === "TextEmotes") {
        let itemTextEmote = document.createElement('p');
        itemTextEmote.classList.add('trophy-store-item-text-emote-popout', 'black-outline');
        itemTextEmote.innerHTML = key === "CoopEmoteAnimationHappyHolidays" ? getLocValue(`${key}ShortName`) : getLocValue(`${key}Word`);
        itemDiv.appendChild(itemTextEmote);
    }

    if (btd6usersave.trophyStoreItems.hasOwnProperty(key) && btd6usersave.trophyStoreItems[key]) {
        itemImg.style.borderImageSource = "url(../Assets/UI/TrophyBGPanelBlue.png)";
    }

    let itemDetailsDiv = document.createElement('div');
    itemDetailsDiv.classList.add('item-details-div');
    imgAndDetails.appendChild(itemDetailsDiv);

    // let itemTypeIcon = document.createElement('img');
    // itemTypeIcon.classList.add('trophy-store-item-type-icon');
    // itemTypeIcon.src = `../Assets/UI/Trophy${data.storeFilter}Icon.png`;
    // itemDetailsDiv.appendChild(itemTypeIcon);

    let itemFullName = document.createElement('p');
    itemFullName.classList.add('trophy-store-item-full-name', 'black-outline');
    itemFullName.innerHTML = getLocValue(`${key}Name`);
    itemDetailsDiv.appendChild(itemFullName);

    let itemDescription = document.createElement('p');
    itemDescription.classList.add('trophy-store-item-description');
    itemDescription.innerHTML = getLocValue(`${key}Description`);
    itemDetailsDiv.appendChild(itemDescription);

    let itemObtainMethod = document.createElement('p');
    itemObtainMethod.classList.add('trophy-store-item-obtain-method');
    itemDetailsDiv.appendChild(itemObtainMethod);

    if (data.hasOwnProperty("obtainMethod")) {
        switch(data.obtainMethod) {
            case "Quest":
                itemObtainMethod.innerHTML = "Obtained by completing a quest";
                break;
            case "Limited":
                itemObtainMethod.innerHTML = "Obtained during a limited time event";
                break;
            case "Rogue":
                itemObtainMethod.innerHTML = "Obtained by unlocking a feat in Rogue Legends";
                break;
            case "Nexus":
                itemObtainMethod.innerHTML = "Obtained by purchasing anything in the store with a Nexus Creator Code applied";
                break;
            case "Purchase":
                itemObtainMethod.innerHTML = "Obtained by purchasing the associated bundle in the store";
                break;
        }
    }
    if (data.hidden && !data.hasOwnProperty("obtainMethod")) {
        itemObtainMethod.innerHTML = "This item is hidden and may show up in the featured tab during the related seasonal rotation.";
    }

    createModal({
        content: modalContent,
        header: getLocValue(`${key}ShortName`),
    })
}

function generateTeamsStoreProgress() {
    let progressContent = document.getElementById('profile-content');
    progressContent.innerHTML = "";

    let progressContainer = document.createElement('div');
    progressContainer.classList.add('powers-progress-container');
    progressContent.appendChild(progressContainer);

    let teamsStoreItemsToDisplay = JSON.parse(JSON.stringify(teamsStoreItemsJSON));

    for (let key of constants.unreleasedContent.teamsStoreItems) {
        delete teamsStoreItemsToDisplay[key];
    }

    for (let [key, data] of Object.entries(teamsStoreItemsToDisplay)) {
        if (data.isDefault) { continue; }
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('trophy-store-item-div');
        progressContainer.appendChild(itemDiv);
        itemDiv.addEventListener('click', () => {
            generateTeamsStorePopout(key);
        })

        let itemImg = document.createElement('img');
        itemImg.classList.add('trophy-store-item-img', 'trophy-store-item-div', 'teams-store-unowned');
        itemImg.src = data.itemType === "Avatar"?  `../Assets/ProfileAvatar/${data.icon}.png` : `../Assets/TeamsStoreIcon/${data.icon}.png`;
        itemDiv.appendChild(itemImg);

        let itemText = document.createElement('p');
        itemText.classList.add('trophy-store-item-text');
        itemText.innerHTML = getLocValue(`${key}ShortName`);
        itemDiv.appendChild(itemText);

        if (btd6usersave.trophyStoreItems.hasOwnProperty(key) && btd6usersave.trophyStoreItems[key]) {
            let collectedText = document.createElement('p');
            collectedText.classList.add('trophy-store-collected-text', 'black-outline');
            collectedText.innerHTML = "Owned";
            itemDiv.appendChild(collectedText);

            itemImg.classList.add('teams-store-owned');
        }
    }
}

function generateTeamsStorePopout(key) {
    let data = teamsStoreItemsJSON[key];

    let modalContent = document.createElement('div');

    let imgAndDetails = document.createElement('div');
    imgAndDetails.classList.add('item-img-and-details');
    imgAndDetails.style.backgroundImage = `url(../Assets/UI/TeamStoreTiledBg.png)`;
    modalContent.appendChild(imgAndDetails);

    let itemDiv = document.createElement('div');
    itemDiv.classList.add('modal-trophy-div');
    imgAndDetails.appendChild(itemDiv);

    let itemImg = document.createElement('img');
    itemImg.classList.add('trophy-store-item-img', 'trophy-store-item-div', 'modal-trophy-item', 'teams-store-unowned');
    itemImg.src = `../Assets/TeamsStoreIcon/${data.icon}.png`;
    itemDiv.appendChild(itemImg);

    if (btd6usersave.trophyStoreItems.hasOwnProperty(key) && btd6usersave.trophyStoreItems[key]) {
        itemImg.classList.add('teams-store-owned');
    }

    let itemDetailsDiv = document.createElement('div');
    itemDetailsDiv.classList.add('item-details-div');
    imgAndDetails.appendChild(itemDetailsDiv);

    let itemFullName = document.createElement('p');
    itemFullName.classList.add('trophy-store-item-full-name', 'black-outline');
    itemFullName.innerHTML = getLocValue(`${key}Name`);
    itemDetailsDiv.appendChild(itemFullName);

    let itemDescription = document.createElement('p');
    itemDescription.classList.add('trophy-store-item-description');
    itemDescription.innerHTML = getLocValue(`${key}Description`);
    itemDetailsDiv.appendChild(itemDescription);

    let itemObtainMethod = document.createElement('p');
    itemObtainMethod.classList.add('trophy-store-item-obtain-method');
    itemDetailsDiv.appendChild(itemObtainMethod);

    if (data.hasOwnProperty("obtainMethod")) {
        switch(data.obtainMethod) {
            case "Quest":
                itemObtainMethod.innerHTML = "Obtained by completing a quest";
                break;
            case "Limited":
                itemObtainMethod.innerHTML = "Obtained during a limited time event";
                break;
            case "Rogue":
                itemObtainMethod.innerHTML = "Obtained by unlocking a feat in Rogue Legends";
                break;
            case "Nexus":
                itemObtainMethod.innerHTML = "Obtained by purchasing anything in the store with a Nexus Creator Code applied";
                break;
            case "Purchase":
                itemObtainMethod.innerHTML = "Obtained by purchasing the associated bundle in the store";
                break;
        }
    }
    if (data.hidden && !data.hasOwnProperty("obtainMethod")) {
        itemObtainMethod.innerHTML = "This item is hidden and may show up in the featured tab during the related seasonal rotation.";
    }

    createModal({
        content: modalContent,
        header: getLocValue(`${key}ShortName`),
    });

}

async function generateInstaSchedule() {
    let current = await getLatestCollectionEvent();
    current = processCollectionEvent(current);

    let featuredContent = document.getElementById('featured-content');
    featuredContent.innerHTML = "";

    currentFeaturedTower = "All";

    let instaScheduleContent = createEl('div', {
        classList: ['totem-bg'],
        style: {
            width: "800px",
            borderRadius: "20px",
            backgroundColor: "#7a674b"
        }
    });
    featuredContent.appendChild(instaScheduleContent);

    let instaScheduleHeader = createEl('div', {
        classList: ['d-flex', 'jc-between', 'ai-center', 'grey-border', 'fd-column'],
    });
    instaScheduleContent.appendChild(instaScheduleHeader);

    let instaHeaderTop = createEl('div', {
        classList: ['d-flex', 'jc-between', 'ai-center', 'w-100']
    })
    instaScheduleHeader.appendChild(instaHeaderTop);

    let startDate = new Date(current.start);
    let endDate = new Date(current.end);
    let instaScheduleTitle = createEl('p', {
        classList: ['black-outline', 'fg-1'],
        style: {
            fontSize: "32px",
            padding: "10px 20px",
        },
        innerHTML: `Featured Insta Schedule<br>${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    });
    instaHeaderTop.appendChild(instaScheduleTitle);

    let instaHeaderFilterBtn = generateButton("Filter", { width: "150px"})
    instaHeaderTop.appendChild(instaHeaderFilterBtn);

    let collectionEventTowerSelectors = createEl('div', {
        classList: ['d-flex', 'f-wrap'],
        style: {
            width: "800px",
            display: "none"
        }
    });
    instaScheduleHeader.appendChild(collectionEventTowerSelectors);

    let instaHeaderDescription = createEl('p', {
        classList: ['font-gardenia'],
        style: {
            fontSize: "18px",
            padding: "10px 20px",
            textAlign: "center",
            lineHeight: "1.5",
        },
        innerHTML: "Times are your local timezone. Event list and times may change. Special thanks to Minecool for helping me find what broke my list generator!"
    });
    instaScheduleHeader.appendChild(instaHeaderDescription);

    let scheduleContainer = createEl('div', {
        classList: ['insta-schedule-container'],
        style: {
            width: "800px"
        }
    });

    Object.keys(constants.towersInOrder).forEach(tower => {
        let collectionEventTowerSelector = document.createElement('div');
        collectionEventTowerSelector.classList.add('featured-insta-filter-selector');
        collectionEventTowerSelector.addEventListener('click', () => {
            currentFeaturedTower === tower ? currentFeaturedTower = "All" : currentFeaturedTower = tower;
            for (element of document.getElementsByClassName('featured-insta-filter-selector')) {
                element.classList.remove('collection-event-tower-selector-active');
            }
            if (currentFeaturedTower != "All") { collectionEventTowerSelector.classList.add('collection-event-tower-selector-active') }
            generateRotations(scheduleContainer, current);
        })
        collectionEventTowerSelectors.appendChild(collectionEventTowerSelector);

        let collectionEventTowerImg = document.createElement('img');
        collectionEventTowerImg.style.width = "88px";
        collectionEventTowerImg.style.height = "88px";
        collectionEventTowerImg.src = getInstaMonkeyIcon(tower,'000');
        collectionEventTowerSelector.appendChild(collectionEventTowerImg);
    })

    instaHeaderFilterBtn.addEventListener('click', () => {
        showFeaturedFilter = !showFeaturedFilter;
        collectionEventTowerSelectors.style.display = showFeaturedFilter ? "flex" : "none";
        instaHeaderFilterBtn.classList.toggle('square-btn-yellow', showFeaturedFilter);
    });

    instaScheduleContent.appendChild(scheduleContainer);


    let timeUntilNextRotation = (current.start + (28800000 * (Math.floor((Date.now() - current.start) / 28800000) + 1))) - Date.now();
    setTimeout(() => {
        generateInstaSchedule();
    }, timeUntilNextRotation);

    generateRotations(scheduleContainer, current);
}

function generateRotations(scheduleContainer, current){
    scheduleContainer.innerHTML = "";
    let iterate = 0;
    let currentRotation = Math.floor((Date.now() - current.start) / 28800000);

    Object.values(current.rotations).forEach((rotation, index) => {
        if(!rotation.includes(currentFeaturedTower) && currentFeaturedTower !== "All") { return; }
        if (index < currentRotation) { return; }
        let rotationDiv = createEl('div', {
            classList: ['d-flex', 'jc-between', 'ai-center'],
            style: {
                borderTop: "2px solid black"
            }
        });
        if (iterate % 2) {
            rotationDiv.style.backgroundColor = "#00000040";
        }
        scheduleContainer.appendChild(rotationDiv);

        let date = new Date(current.start + (28800000 * index));
        let rotationDate = createEl('p', {
            classList: ['insta-schedule-rotation-date', 'black-outline'],
            style: {
                fontSize: "28px",
                textAlign: "center",
                flexGrow: "1",
            },
            innerHTML: currentRotation == index ? "Active Selection" : `${date.toLocaleDateString()}<br>${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        });
        rotationDiv.appendChild(rotationDate);

        let rotationContent = createEl('div', {
            classList: ['d-flex']
        });
        rotationDiv.appendChild(rotationContent);

        rotation.forEach((item) => {
            let itemDiv = createEl('div', {
                classList: ['insta-schedule-item'],
                style: {
                    backgroundImage: `url(../Assets/UI/TowerContainer${constants.towersInOrder[item]}.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 130px",
                    height: "75px",
                    width: "150px",
                    position: 'relative',
                }
            });
            rotationContent.appendChild(itemDiv);

            let itemImg = createEl('img', {
                classList: ['insta-schedule-item-img'],
                style: {
                    width: "150px",
                    height: "75px"
                },
                src: `../Assets/UI/FaceEntry/${item}.png`
            });
            itemDiv.appendChild(itemImg);

            // let itemName = createEl('p', {
            //     classList: ['ta-center', 'black-outline'],
            //     style: {
            //         position: "absolute",
            //         bottom: "0px",
            //         width: "150px",
            //     },
            //     innerHTML: getLocValue(`${item}`)
            // });
            // itemDiv.appendChild(itemName);
        })
        firstRotation = false;
        iterate++;
    })

    let endRotationDiv = createEl('div', {
        classList: ['d-flex', 'jc-between', 'ai-center'],
        style: {
            borderTop: "2px solid black",
            borderRadius: "0px 0px 20px 20px",
            padding: "10px"
        }
    });
    if (iterate % 2) {
        endRotationDiv.style.backgroundColor = "#00000040";
    }
    scheduleContainer.appendChild(endRotationDiv);
    let endDate = new Date(current.end);
    let endRotationDate = createEl('p', {
        classList: ['insta-schedule-rotation-date', 'black-outline'],
        style: {
            fontSize: "28px",
            textAlign: "center",
            flexGrow: "1",
        },
        innerHTML: `Event Ends: ${endDate.toLocaleString()}`
    });
    endRotationDiv.appendChild(endRotationDate);
}

function generateQuestsPage() {
    let questsContent = document.getElementById('profile-content');
    questsContent.innerHTML = "";

    let questsContainer = createEl('div', {
        style: {
            width: "750px",
        }
    });
    questsContent.appendChild(questsContainer);

    let questsHeader = createEl('div', {
        classList: ['d-flex', 'jc-center', 'ai-center', 'coop-border', 'fd-column'],
        style: {
            // borderRadius: "20px",
            // backgroundColor: "#7a674b",
            // padding: "10px 20px",
            // marginBottom: "20px"
        }
    });
    questsContainer.appendChild(questsHeader);
    
    let questsTitle = createEl('p', {
        classList: ['black-outline'],
        style: {
            fontSize: "32px",
            textAlign: "center",
            marginBottom: "10px"
        },
        innerHTML: "Quests"
    });
    questsHeader.appendChild(questsTitle);

    let questsDisclaimer = createEl('p', {
        classList: ['font-gardenia'],
        style: {
            fontSize: "18px",
            lineHeight: "1.5",
            textAlign: "center",
            marginBottom: "10px"
        },
        innerHTML: "Completion status will be inaccurate for quests that were completed before NK changed the quest system internally. Replaying and clearing the quests will fix the completion status. Note: If you click 'Replay' on a quest, this will make it 'incomplete' as well."
    });
    questsHeader.appendChild(questsDisclaimer);

    const iconToRoundsets = {};
    Object.entries(constants.roundSets).forEach(([key, rs]) => {
        if (rs && rs.type === 'quest' && rs.icon) {
            (iconToRoundsets[rs.icon] ||= []).push(key);
        }
    });

    btd6usersave.quests.forEach((quest) => {
        let constantsQuest = constants.quests[quest.id];

        let questDiv = createEl('div', {
            classList: ['d-flex', 'ai-center', 'jc-between', 'wood-container'],
            style: {
                margin: "10px 0px"
            }
        });
        questsContainer.appendChild(questDiv);

        let questImg = createEl('img', {
            classList: ['quest-img'],
            style: {
                width: "100px"
            },
            src: `../Assets/QuestIcon/${constantsQuest.icon || "QuestIconPhayzeOne"}.png`
        });
        questDiv.appendChild(questImg);

        let questCenterDiv = createEl('div', {
            classList: ['d-flex', 'fd-column', 'jc-center', 'ai-center'],
            style: { gap: "10px"}
        });
        questDiv.appendChild(questCenterDiv);

        let questTitle = createEl('p', {
            classList: ['quest-title', 'black-outline'],
            style: {
                fontSize: "28px",
            },
            innerHTML: getLocValue(`${constantsQuest.nameLocKey}`) || quest.id
        });
        questCenterDiv.appendChild(questTitle);

        if (constantsQuest?.icon && iconToRoundsets[constantsQuest.icon]?.length) {
            const stages = iconToRoundsets[constantsQuest.icon];
            if (stages.length) {
                const row = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-start'], });
                questCenterDiv.appendChild(row);

                stages.forEach((key, idx) => {
                    let n = constants.roundSets[key]?.part || null;
                    const btn = createEl('div', { classList: ['maps-progress-view', 'black-outline', 'pointer'], style: {filter: 'hue-rotate(270deg)'}});
                    btn.innerHTML = n ? `Stage ${n}` : (stages.length > 1 ? `Stage ${idx + 1}` : 'Open Rounds');
                    btn.addEventListener('click', (e) => {
                        showLoading();
                        showRoundsetModel('profile', constants.roundSets[key]?.roundset || key);
                    });
                    row.appendChild(btn);
                });
            }
        }

        if (quest.complete) {
            let questTick = createEl('img', {
                classList: [],
                style: {
                    width: "100px",
                    height: "100px",
                    transform: "scale(0.75)"
                },
                src: "../Assets/UI/TickGreenIcon.png"
            });
            questDiv.appendChild(questTick);
        } else {
            let questProgress = createEl('p', {
                classList: ['quest-progress', 'ta-center', 'black-outline'],
                style: {
                    width: "100px",
                    fontSize: "36px",
                },
                innerHTML: `${quest.partsComplete}/${quest.parts}`
            });
            questDiv.appendChild(questProgress);
        } 
    });
}