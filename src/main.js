let readyFlags = [0,0,0,0,0]

let locJSON = {}
let achievementsJSON = {}
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
        generateOverview()
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

let headers = ['Overview', 'Progress', 'Explore', 'Maps', 'Settings'];

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
}

headers.forEach((headerName) => {
    headerName = headerName.toLowerCase();
    let contentElement = document.createElement('div');
    contentElement.id = headerName + '-content';
    contentElement.classList.add('content-div');
    contentElement.style.display = 'none';
    content.appendChild(contentElement);
})

changeTab('overview');

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
    profileBottom.appendChild(generateRank(true));

    let profileStats = document.createElement('div');
    profileStats.id = 'profile-stats';
    profileStats.classList.add('profile-stats');
    document.getElementById('overview-content').appendChild(profileStats);

    let statsInOrder = [""]
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
