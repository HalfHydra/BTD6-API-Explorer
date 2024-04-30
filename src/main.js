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
        generateRankInfo()
        generateVeteranRankInfo()
        generateAchievementsHelper()
        generateStats()
        generateMedals()
        generateExtras()
        generateProgressSubText()
        generateOverview()
        isGenerated.push('overview');
        changeTab('overview');
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
            console.log(rankInfo)
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
    console.log(rankInfoVeteran)
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
    progressSubText["Map Progress"] = `${Object.keys(btd6usersave.mapProgress).filter(k => btd6usersave.mapProgress[k]).length}/${constants.totalMaps} Maps Played`;
    progressSubText["Powers"] = `${Object.values(btd6usersave.powers).map(power => power.quantity).reduce((acc, amount) => acc + amount)} Powers Accumulated`
    progressSubText["Insta Monkeys"] = `${btd6publicprofile.gameplay.instaMonkeyCollection}/${constants.totalInstaMonkeys} Instas Collected`;
    progressSubText["Achievements"] = `${btd6publicprofile.achievements}/${constants.achievements + constants.hiddenAchievements} Achievements`;
    progressSubText["Extras"] = `${Object.keys(extrasUnlocked).filter(k => extrasUnlocked[k]).length} Extras Unlocked`;
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
    console.log(tab)
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
                isGenerated.push(tab);
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
    // progressContent.innerHTML = "";
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

    let selectors = ['Towers', 'Heroes', 'Knowledge', 'Map Progress', 'Powers', 'Insta Monkeys', 'Achievements', 'Extras'];

    selectors.forEach((selector) => {
        if(progressSubText[selector].includes("0 Extras")) { return; }
        let selectorDiv = document.createElement('div');
        selectorDiv.id = selector.toLowerCase() + '-div';
        selectorDiv.classList.add('selector-div');
        /*selectorDiv.innerHTML = progressSubText[selector];*/
        selectorDiv.addEventListener('click', () => {
            changeProgressTab(selector.toLowerCase());
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

