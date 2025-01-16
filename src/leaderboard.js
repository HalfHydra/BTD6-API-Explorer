let constants = {}
let locJSON = {}

showLoading();
Promise.all([
    fetch('./data/Constants.json').then(response => response.json()),
    fetch('./data/English.json').then(response => response.json()),
])
    .then(([constantsJSON, englishData]) => {
        constants = constantsJSON;
        locJSON = englishData;
        generateLeaderboards()
    })
    .catch(error => {
        console.error('Error:', error);
        errorModal(error, "js");
    });

function showLoading() {
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

function hideLoading() {
    document.getElementById("loading").style.transform = "scale(0)";
}

const container = document.createElement('div');
document.body.appendChild(container);

document.body.classList.add('hex-bg');

const header = document.createElement('div');
header.classList.add('header');
container.appendChild(header);

const headerDiv = document.createElement('div');
headerDiv.classList.add('header-div');
header.appendChild(headerDiv);

const title = document.createElement('h1');
title.classList.add('title');
title.innerHTML = 'Bloons TD 6 Leaderboards';
headerDiv.appendChild(title);

const content = document.createElement('div');
content.classList.add('content');
container.appendChild(content);

const leaderboards = document.createElement('div');
leaderboards.id = "leaderboards-content"
leaderboards.classList.add('extras', 'content-div');
leaderboards.style.display = "flex";
content.appendChild(leaderboards);

const leaderboard = document.createElement('div');
leaderboard.id = "leaderboard-content"
leaderboard.classList.add('content-div');
leaderboard.style.display = "none";
content.appendChild(leaderboard);

const publicprofile = document.createElement('div');
publicprofile.id = "publicprofile-content"
publicprofile.classList.add('extras', 'content-div');
publicprofile.style.display = "none";
content.appendChild(publicprofile);

async function generateLeaderboards() {
    if (racesData == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/races`, (json) => {
            racesData = json["body"];
        })
    }
    if (bossesData == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/bosses`, (json) => {
            bossesData = json["body"];
        });
    }
    if (CTData == null) {
        await fetchData(`https://data.ninjakiwi.com/btd6/ct`, (json) => {
            CTData = json["body"];
        });
    }
    hideLoading(); 
    let leaderboardsContent = document.getElementById('leaderboards-content');
    leaderboardsContent.innerHTML = "";

    let leaderboardPage = document.createElement('div');
    leaderboardPage.classList.add('leaderboard-page', 'page-extra');
    leaderboardsContent.appendChild(leaderboardPage);

    let currentText = document.createElement('p');
    currentText.classList.add('hero-progress-header-text', 'leaderboards-header-text');
    currentText.innerHTML = "Active Events";
    leaderboardPage.appendChild(currentText);

    let currentSelectorsDiv = document.createElement('div');
    currentSelectorsDiv.classList.add('selectors-div');
    leaderboardPage.appendChild(currentSelectorsDiv);

    let selectorsText = document.createElement('p');
    selectorsText.classList.add('hero-progress-header-text', 'leaderboards-header-text');
    selectorsText.innerHTML = "Finished Events";
    leaderboardPage.appendChild(selectorsText);

    let eventsFilter = document.createElement('div');
    eventsFilter.id = 'maps-progress-views';
    eventsFilter.classList.add('maps-progress-views');
    leaderboardPage.appendChild(eventsFilter);

    let eventsFilterText = document.createElement('p');
    eventsFilterText.classList.add('maps-progress-coop-toggle-text', 'black-outline');
    eventsFilterText.innerHTML = "Filter:";
    eventsFilter.appendChild(eventsFilterText);

    let eventsFilterAll = document.createElement('div');
    eventsFilterAll.classList.add('maps-progress-view', 'black-outline', 'stats-tab-yellow');
    eventsFilterAll.innerHTML = "All";
    eventsFilterAll.addEventListener('click', () => {
        eventsFilterAll.classList.add('stats-tab-yellow');
        eventsFilterRace.classList.remove('stats-tab-yellow');
        eventsFilterBoss.classList.remove('stats-tab-yellow');
        eventsFilterCT.classList.remove('stats-tab-yellow');
        onChangeEventFilter('all');
    })
    eventsFilter.appendChild(eventsFilterAll);

    let eventsFilterRace = document.createElement('div');
    eventsFilterRace.classList.add('maps-progress-view', 'black-outline');
    eventsFilterRace.innerHTML = "Race";
    eventsFilterRace.addEventListener('click', () => {
        eventsFilterAll.classList.remove('stats-tab-yellow');
        eventsFilterRace.classList.add('stats-tab-yellow');
        eventsFilterBoss.classList.remove('stats-tab-yellow');
        eventsFilterCT.classList.remove('stats-tab-yellow');
        onChangeEventFilter('race');
    })
    eventsFilter.appendChild(eventsFilterRace);


    let eventsFilterBoss = document.createElement('div');
    eventsFilterBoss.classList.add('maps-progress-view', 'black-outline');
    eventsFilterBoss.innerHTML = "Boss";
    eventsFilterBoss.addEventListener('click', () => {
        eventsFilterAll.classList.remove('stats-tab-yellow');
        eventsFilterRace.classList.remove('stats-tab-yellow');
        eventsFilterBoss.classList.add('stats-tab-yellow');
        eventsFilterCT.classList.remove('stats-tab-yellow');
        onChangeEventFilter('boss');
    })
    eventsFilter.appendChild(eventsFilterBoss);

    let eventsFilterCT = document.createElement('div');
    eventsFilterCT.classList.add('maps-progress-view', 'black-outline');
    eventsFilterCT.innerHTML = "Contested Territory";
    eventsFilterCT.addEventListener('click', () => {
        eventsFilterAll.classList.remove('stats-tab-yellow');
        eventsFilterRace.classList.remove('stats-tab-yellow');
        eventsFilterBoss.classList.remove('stats-tab-yellow');
        eventsFilterCT.classList.add('stats-tab-yellow');
        onChangeEventFilter('ct');
    })
    eventsFilter.appendChild(eventsFilterCT);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.id = 'leaderboard-selectors';
    selectorsDiv.classList.add('selectors-div');
    leaderboardPage.appendChild(selectorsDiv);

    let pastEvents = [];
    let now = new Date();

    racesData.forEach((data) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        (now > new Date(data.start) && now < new Date(data.end)) ? currentSelectorsDiv.appendChild(roundsetDiv) : pastEvents.push([data, roundsetDiv, data.totalScores]);
        roundsetDiv.addEventListener('click', () => {
            showLeaderboard('leaderboards', data, "Race");
            showLoading();
        })

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetDiv.appendChild(roundsetIcon);

        roundsetIcon.src = `../Assets/UI/EventRaceBtn.png`;
        roundsetDiv.classList.add("race-roundset")

        let roundsetTextDiv = document.createElement('div');
        roundsetTextDiv.classList.add('roundset-selector-text-div');
        roundsetDiv.appendChild(roundsetTextDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = `${data.name}`;
        roundsetTextDiv.appendChild(roundsetText);

        let roundsetText2 = document.createElement('p');
        roundsetText2.id = "time-left-" + data.name;
        roundsetText2.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText2);

        if (new Date() < new Date(data.start)) {
            roundsetText2.innerHTML = "Coming Soon!";
        } else if (new Date(data.end) > new Date()) {
            updateTimer(new Date(data.end), roundsetText2.id);
            timerInterval = setInterval(() => updateTimer(new Date(data.end), roundsetText2.id), 1000)
        } else {
            roundsetText2.innerHTML = `${new Date(data.start).toLocaleDateString()} - ${new Date(data.end).toLocaleDateString()}`
        }

        let roundsetText3 = document.createElement('p');
        roundsetText3.innerHTML = `Total Scores: ${data.totalScores}`;
        roundsetText3.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText3);

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/EventLeaderboardBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })

    bossesData.forEach((data) => {
        let titleCaseBoss = data.bossType.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        let bossNumber = data.name.replace(/\D/g, '');
        let bossName = `${titleCaseBoss} ${bossNumber}`;

        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        (now > new Date(data.start) && now < new Date(data.end)) ? currentSelectorsDiv.appendChild(roundsetDiv) : pastEvents.push([data, roundsetDiv, data.totalScores_standard]);
        roundsetDiv.addEventListener('click', () => {
            showLeaderboard('leaderboards', data, "Boss");
            showLoading();
        })

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetDiv.appendChild(roundsetIcon);

        roundsetIcon.src = `../Assets/BossIcon/${data.bossType[0].toUpperCase() + data.bossType.slice(1)}EventIcon.png`;
        roundsetDiv.style.backgroundImage = `url(../Assets/EventBanner/EventBannerSmall${data.bossType[0].toUpperCase() + data.bossType.slice(1)}.png)`
        roundsetDiv.classList.add("boss-roundset")

        let roundsetTextDiv = document.createElement('div');
        roundsetTextDiv.classList.add('roundset-selector-text-div');
        roundsetDiv.appendChild(roundsetTextDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = `${bossName}`;
        roundsetTextDiv.appendChild(roundsetText);

        let roundsetText2 = document.createElement('p');
        roundsetText2.id = "time-left-" + bossName;
        roundsetText2.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText2);

        if (new Date() < new Date(data.start)) {
            roundsetText2.innerHTML = "Coming Soon!";
        } else if (new Date(data.end) > new Date()) {
            updateTimer(new Date(data.end), roundsetText2.id);
            timerInterval = setInterval(() => updateTimer(new Date(data.end), roundsetText2.id), 1000)
        } else {
            roundsetText2.innerHTML = `${new Date(data.start).toLocaleDateString()} - ${new Date(data.end).toLocaleDateString()}`
        }

        let roundsetText3 = document.createElement('p');
        roundsetText3.innerHTML = `Total Scores: ${data.totalScores_standard}`;
        roundsetText3.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText3);

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/EventLeaderboardBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })

    bossesData.forEach((data) => {
        let titleCaseBoss = data.bossType.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        let bossNumber = data.name.replace(/\D/g, '');
        let bossName = `Elite ${titleCaseBoss} ${bossNumber}`;

        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        (now > new Date(data.start) && now < new Date(data.end)) ? currentSelectorsDiv.appendChild(roundsetDiv) : pastEvents.push([data, roundsetDiv, data.totalScores_elite]);
        roundsetDiv.addEventListener('click', () => {
            showLeaderboard('leaderboards', data, "BossElite");
            showLoading();
        })

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetDiv.appendChild(roundsetIcon);

        roundsetIcon.src = `../Assets/BossIcon/Elite${data.bossType[0].toUpperCase() + data.bossType.slice(1)}EventIcon.png`;
        roundsetDiv.style.backgroundImage = `url(../Assets/EventBanner/EventBannerSmall${data.bossType[0].toUpperCase() + data.bossType.slice(1)}.png)`
        roundsetDiv.classList.add("boss-roundset")

        let roundsetTextDiv = document.createElement('div');
        roundsetTextDiv.classList.add('roundset-selector-text-div');
        roundsetDiv.appendChild(roundsetTextDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = `${bossName}`;
        roundsetTextDiv.appendChild(roundsetText);

        let roundsetText2 = document.createElement('p');
        roundsetText2.id = "time-left-" + bossName;
        roundsetText2.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText2);

        if (new Date() < new Date(data.start)) {
            roundsetText2.innerHTML = "Coming Soon!";
        } else if (new Date(data.end) > new Date()) {
            updateTimer(new Date(data.end), roundsetText2.id);
            timerInterval = setInterval(() => updateTimer(new Date(data.end), roundsetText2.id), 1000)
        } else {
            roundsetText2.innerHTML = `${new Date(data.start).toLocaleDateString()} - ${new Date(data.end).toLocaleDateString()}`
        }

        let roundsetText3 = document.createElement('p');
        roundsetText3.innerHTML = `Total Scores: ${data.totalScores_elite}`;
        roundsetText3.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText3);

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/EventLeaderboardBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })

    CTData.forEach((data) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        (now > new Date(data.start) && now < new Date(data.end)) ? currentSelectorsDiv.appendChild(roundsetDiv) : pastEvents.push([data, roundsetDiv, data.totalScores_team]);
        roundsetDiv.addEventListener('click', () => {
            showLeaderboard('leaderboards', data, "CTTeam");
            showLoading();
        })

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetDiv.appendChild(roundsetIcon);

        roundsetIcon.src = `../Assets/UI/ContestedLeaderboardBtn.png`;
        roundsetDiv.classList.add("ct-leaderboard-btn")

        let roundsetTextDiv = document.createElement('div');
        roundsetTextDiv.classList.add('roundset-selector-text-div');
        roundsetDiv.appendChild(roundsetTextDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = `Contested Territory - Teams`;
        roundsetTextDiv.appendChild(roundsetText);

        let roundsetText2 = document.createElement('p');
        roundsetText2.id = "time-left-" + data.id + '-teams';
        roundsetText2.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText2);

        if (new Date() < new Date(data.start)) {
            roundsetText2.innerHTML = "Coming Soon!";
        } else if (new Date(data.end) > new Date()) {
            updateTimer(new Date(data.end), roundsetText2.id);
            timerInterval = setInterval(() => updateTimer(new Date(data.end), roundsetText2.id), 1000)
        } else {
            roundsetText2.innerHTML = `${new Date(data.start).toLocaleDateString()} - ${new Date(data.end).toLocaleDateString()}`
        }

        let roundsetText3 = document.createElement('p');
        roundsetText3.innerHTML = `Total Scores: ${data.totalScores_team}`;
        roundsetText3.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText3);

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/EventLeaderboardBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })

    CTData.forEach((data) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        (now > new Date(data.start) && now < new Date(data.end)) ? currentSelectorsDiv.appendChild(roundsetDiv) : pastEvents.push([data, roundsetDiv, data.totalScores_player]);
        roundsetDiv.addEventListener('click', () => {
            showLeaderboard('leaderboards', data, "CTPlayer");
            showLoading()
        })

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetDiv.appendChild(roundsetIcon);

        roundsetIcon.src = `../Assets/UI/ContestedTerritoryEventBtn.png`;
        roundsetDiv.classList.add("ct-leaderboard-btn")

        let roundsetTextDiv = document.createElement('div');
        roundsetTextDiv.classList.add('roundset-selector-text-div');
        roundsetDiv.appendChild(roundsetTextDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = `Contested Territory - Players`;
        roundsetTextDiv.appendChild(roundsetText);

        let roundsetText2 = document.createElement('p');
        roundsetText2.id = "time-left-" + data.id;
        roundsetText2.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText2);

        if (new Date() < new Date(data.start)) {
            roundsetText2.innerHTML = "Coming Soon!";
        } else if (new Date(data.end) > new Date()) {
            updateTimer(new Date(data.end), roundsetText2.id);
            timerInterval = setInterval(() => updateTimer(new Date(data.end), roundsetText2.id), 1000)
        } else {
            roundsetText2.innerHTML = `${new Date(data.start).toLocaleDateString()} - ${new Date(data.end).toLocaleDateString()}`
        }

        let roundsetText3 = document.createElement('p');
        roundsetText3.innerHTML = `Total Scores: ${data.totalScores_player}`;
        roundsetText3.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText3);

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/EventLeaderboardBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })

    pastEvents.sort((a, b) => new Date(b[0].end) - new Date(a[0].end))

    pastEvents.forEach(([data, roundsetDiv, totalScores]) => {
        if (now < new Date(data.start)) { return }
        if (totalScores == 0) { return }
        selectorsDiv.appendChild(roundsetDiv);
    })

    if (currentSelectorsDiv.childNodes.length == 0) {
        currentText.style.display = "none";
        currentSelectorsDiv.style.display = "none";
    }
}

function onChangeEventFilter(type) {
    let selectors = document.getElementById('leaderboard-selectors');
    switch (type) {
        case "race":
            selectors.childNodes.forEach((child) => {
                if (child.classList.contains("race-roundset")) {
                    child.style.display = "flex";
                } else {
                    child.style.display = "none";
                }
            })
            break;
        case "boss":
            selectors.childNodes.forEach((child) => {
                if (child.classList.contains("boss-roundset")) {
                    child.style.display = "flex";
                } else {
                    child.style.display = "none";
                }
            })
            break;
        case "ct":
            selectors.childNodes.forEach((child) => {
                if (child.classList.contains("ct-leaderboard-btn")) {
                    child.style.display = "flex";
                } else {
                    child.style.display = "none";
                }
            })
            break;
        default:
            selectors.childNodes.forEach((child) => {
                child.style.display = "flex";
            })
    }
}

function showLeaderboard(source, metadata, type) {
    switch (type) {
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
    leaderboardDiv.classList.add('full-leaderboard-div');
    leaderboardContent.appendChild(leaderboardDiv);

    let leaderboardTop = document.createElement('div');
    leaderboardTop.classList.add('leaderboard-top');
    leaderboardDiv.appendChild(leaderboardTop);

    let leaderboardHeader = document.createElement('div');
    leaderboardHeader.classList.add('leaderboard-header');
    leaderboardTop.appendChild(leaderboardHeader);

    let leaderboardHeaderLeft = document.createElement('div');
    leaderboardHeaderLeft.classList.add('leaderboard-header-left');
    leaderboardHeader.appendChild(leaderboardHeaderLeft);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        leaderboardContent.style.display = "none";
        document.getElementById(`${source}-content`).style.display = "flex";
    })
    leaderboardHeaderLeft.appendChild(modalClose);

    let leaderboardHeaderMiddle = document.createElement('div');
    leaderboardHeaderMiddle.classList.add(`leaderboard-header-middle-${type.toLowerCase()}`);
    leaderboardHeader.appendChild(leaderboardHeaderMiddle);

    let leaderboardHeaderTitle = document.createElement('div');
    leaderboardHeaderTitle.classList.add(`leaderboard-header-${type.toLowerCase()}`);
    leaderboardHeaderMiddle.appendChild(leaderboardHeaderTitle);

    let leaderboardHeaderTitleText = document.createElement('p');
    leaderboardHeaderTitleText.classList.add('leaderboard-header-title-text');
    leaderboardHeaderTitle.appendChild(leaderboardHeaderTitleText);

    switch (type) {
        case "Race":
            leaderboardHeaderTitleText.classList.add("black-outline");
            leaderboardHeaderTitleText.innerHTML = "Race Leaderboard"
            break;
        case "Boss":
            leaderboardHeaderTitleText.classList.add("black-outline");
            leaderboardHeaderTitleText.innerHTML = "Boss Leaderboard"
            break;
        case "BossElite":
            leaderboardHeaderTitleText.classList.add("black-outline");
            leaderboardHeaderTitleText.innerHTML = "Elite Boss Leaderboard"
            break;
        case "CTPlayer":
            leaderboardHeaderTitleText.classList.add("ct-text");
            leaderboardHeaderTitleText.innerHTML = "Contested Territory <br> Player Leaderboard"
            break;
        case "CTTeam":
            leaderboardHeaderTitleText.classList.add("ct-text");
            leaderboardHeaderTitleText.innerHTML = "Contested Territory <br> Team Leaderboard"
            break;
    }


    let leaderboardHeaderRight = document.createElement('div');
    leaderboardHeaderRight.classList.add('leaderboard-header-right');
    leaderboardHeader.appendChild(leaderboardHeaderRight);

    if (type == "Boss" || type == "BossElite") {
        let leaderboardDisclaimer = document.createElement('p');
        leaderboardDisclaimer.classList.add('leaderboard-disclaimer', 'black-outline');
        leaderboardDisclaimer.innerHTML = "Note: Only singleplayer boss leaderboards are available on the API currently.";
        leaderboardTop.appendChild(leaderboardDisclaimer);
    }

    let leaderboardColumnLabels = document.createElement('div');
    leaderboardColumnLabels.id = 'leaderboard-column-labels';
    leaderboardColumnLabels.classList.add('leaderboard-column-labels');
    leaderboardTop.appendChild(leaderboardColumnLabels);

    let leaderboardEntries = document.createElement('div');
    leaderboardEntries.id = 'leaderboard-entries';
    leaderboardEntries.classList.add('leaderboard-entries');
    leaderboardDiv.appendChild(leaderboardEntries);

    copyLoadingIcon(leaderboardEntries)
    generateLeaderboardEntries(metadata, type);
}

async function generateLeaderboardEntries(metadata, type) {
    await getAllLeaderboardData(leaderboardLink);

    let columnsType = null;
    switch (type) {
        case "CTTeam":
            columnsType = "CTTeam";
            break;
        case "CTPlayer":
            columnsType = "CTPlayer";
            break;
    }
    if (metadata.hasOwnProperty('leaderboard') && metadata.leaderboard.includes('races')) {
        columnsType = "GameTime";
    }
    if (metadata.hasOwnProperty('bossType')) {
        switch (metadata.scoringType) {
            case "GameTime":
                columnsType = "GameTime";
                break;
            case "LeastCash":
                columnsType = "LeastCash";
                break;
            case "LeastTiers":
                columnsType = "LeastTiers";
                break;
        }
    }

    leaderboardMetadata = metadata;
    leaderboardType = type;

    generateLeaderboardHeader(columnsType);

    let leaderboardEntries = document.getElementById('leaderboard-entries');
    leaderboardEntries.innerHTML = "";

    addLeaderboardEntries(leaderboardCache[leaderboardLink].entries, 1, leaderboardCache[leaderboardLink].entries.length);
}

function addLeaderboardEntries(leaderboardData, page, count) {
    let leaderboardEntries = document.getElementById('leaderboard-entries');
    let metadata = leaderboardMetadata;
    let type = leaderboardType;

    if (leaderboardData != null) {
        leaderboardData.forEach((entry, index) => {
            let scorePartsObj = {}

            if (entry.hasOwnProperty("scoreParts")) {
                entry.scoreParts.forEach((part, index) => {
                    scorePartsObj[part.name] = part;
                })
            }

            let leaderboardEntry = document.createElement('div');
            leaderboardEntry.classList.add('leaderboard-entry');
            if (type != "CTTeam") {
                leaderboardEntry.addEventListener('click', () => {
                    openProfile('leaderboard', entry.profile);
                })
            }
            leaderboardEntries.appendChild(leaderboardEntry);

            let leaderboardEntryDiv = document.createElement('div');
            leaderboardEntryDiv.classList.add('leaderboard-entry-div');
            leaderboardEntry.appendChild(leaderboardEntryDiv);

            let leaderboardEntryRank = document.createElement('p');
            leaderboardEntryRank.classList.add('leaderboard-entry-rank', 'black-outline');
            leaderboardEntryRank.innerHTML = index + ((page - 1) * count) + 1;
            leaderboardEntryDiv.appendChild(leaderboardEntryRank);

            let leaderboardEntryPlayer = document.createElement('div');
            leaderboardEntryPlayer.classList.add('leaderboard-entry-player');
            leaderboardEntryDiv.appendChild(leaderboardEntryPlayer);

            let leaderboardEntryIcon = null;
            let leaderboardEntryFrame = null;
            let leaderboardEntryEmblem = null;

            if (type == "CTTeam") {
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
            leaderboardEntryName.classList.add('leaderboard-entry-name', 'leaderboard-outline');
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
            leaderboardEntryMainScore.classList.add('leaderboard-entry-main-score', 'leaderboard-outline');
            leaderboardEntryScore.appendChild(leaderboardEntryMainScore);

            if (metadata.hasOwnProperty('leaderboard') && metadata.leaderboard.includes('races')) {
                let submittedDate = new Date(metadata.start + scorePartsObj["Time after event start"].score)

                let leaderboardEntryTimeSubmitted = document.createElement('p');
                leaderboardEntryTimeSubmitted.classList.add('leaderboard-entry-time-submitted', 'leaderboard-outline');
                leaderboardEntryTimeSubmitted.innerHTML = submittedDate.toLocaleString();
                leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmitted);

                let leaderboardEntryTimeSubmittedRelative = document.createElement('p');
                leaderboardEntryTimeSubmittedRelative.classList.add('leaderboard-entry-time-submitted-relative', 'leaderboard-outline');
                leaderboardEntryTimeSubmittedRelative.innerHTML = relativeTime(new Date(), submittedDate);
                leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmittedRelative);

                leaderboardEntryMainScore.innerHTML = formatScoreTime(entry.score);
            }
            if (metadata.hasOwnProperty('bossType')) {
                switch (metadata.scoringType) {
                    case "GameTime":
                        let submittedDate = new Date(metadata.start + scorePartsObj["Time after event start"].score)

                        let leaderboardEntryTimeSubmitted = document.createElement('p');
                        leaderboardEntryTimeSubmitted.classList.add('leaderboard-entry-time-submitted', 'leaderboard-outline');
                        leaderboardEntryTimeSubmitted.innerHTML = submittedDate.toLocaleString();
                        leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmitted);

                        let leaderboardEntryTimeSubmittedRelative = document.createElement('p');
                        leaderboardEntryTimeSubmittedRelative.classList.add('leaderboard-entry-time-submitted-relative', 'leaderboard-outline');
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
                        leaderboardEntryGameTimeValue.classList.add('leaderboard-entry-game-time-value', 'leaderboard-outline');
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
                        leaderboardEntryGameTimeTiersValue.classList.add('leaderboard-entry-game-time-value', 'leaderboard-outline');
                        leaderboardEntryGameTimeTiersValue.innerHTML = formatScoreTime(scorePartsObj["Game Time"].score);
                        leaderboardEntryGameTimeTiers.appendChild(leaderboardEntryGameTimeTiersValue);

                        leaderboardEntryScore.classList.add('leaderboard-entry-score-tiers')
                        break;
                }
            }
            if (metadata.hasOwnProperty('tiles')) {
                leaderboardEntryScoreIcon.src = `./Assets/UI/CtPointsIconSmall.png`;
                leaderboardEntryScoreIcon.classList.add('leaderboard-entry-score-icon-large');
                leaderboardEntryMainScore.innerHTML = entry.score.toLocaleString();
                leaderboardEntryPlayer.classList.add('leaderboard-entry-team');
            }

            if (!preventRateLimiting) {
                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(async observerentry => {
                        if (observerentry.isIntersecting) {
                            if (leaderboardData.length == index + 1) {
                                getLeaderboardPage(leaderboardCache[leaderboardLink].next);
                            }

                            if (page == 1 && ((index + ((page - 1) * count) + 1) < 50)) {
                                addRequestToQueue(async () => {
                                    try {
                                        let userProfile = await getUserProfile(entry.profile);
                                        if (userProfile != null) {
                                            if (userProfile.hasOwnProperty('owner')) {
                                                leaderboardEntryFrame.src = userProfile.frameURL;
                                                leaderboardEntryEmblem.src = userProfile.iconURL;
                                                leaderboardEntryDiv.style.backgroundImage = `url(${getProfileBanner(userProfile)})`;
                                            } else {
                                                leaderboardEntryIcon.src = getProfileAvatar(userProfile);
                                                leaderboardEntryDiv.style.backgroundImage = `url(${getProfileBanner(userProfile)})`;
                                            }
                                            observer.unobserve(observerentry.target);
                                        }
                                    } catch (error) {
                                        console.error("Error fetching user profile:", error);
                                    }
                                });
                            }
                        }
                    });
                });
                observer.observe(leaderboardEntryIcon);
            }
            if (profileCache[(entry.profile).split("/").pop()] != null) {
                let userProfile = profileCache[(entry.profile).split("/").pop()];
                if (userProfile.hasOwnProperty('owner')) {
                    leaderboardEntryFrame.src = userProfile.frameURL;
                    leaderboardEntryEmblem.src = userProfile.iconURL;
                    leaderboardEntryDiv.style.backgroundImage = `url(${getProfileBanner(userProfile)})`;
                } else {
                    leaderboardEntryIcon.src = getProfileAvatar(userProfile);
                    leaderboardEntryDiv.style.backgroundImage = `url(${getProfileBanner(userProfile)})`;
                }
            }
        })
    } else {
        let noDataFound = document.createElement('p');
        noDataFound.classList.add('no-data-found', 'black-outline');
        noDataFound.style.width = "250px";
        noDataFound.innerHTML = "No Data Found";
        leaderboardEntries.appendChild(noDataFound);
    }
}

function generateLeaderboardHeader(columnsType) {
    let leaderboardColumnLabels = document.getElementById('leaderboard-column-labels');
    leaderboardColumnLabels.innerHTML = "";

    let leaderboardColumnRank = document.createElement('p');
    leaderboardColumnRank.classList.add('leaderboard-column-rank', 'black-outline');
    leaderboardColumnRank.innerHTML = "Rank";
    leaderboardColumnLabels.appendChild(leaderboardColumnRank);

    let leaderboardColumnName = document.createElement('p');
    leaderboardColumnName.classList.add('leaderboard-column-name', 'black-outline');
    leaderboardColumnName.innerHTML = "Player";
    leaderboardColumnLabels.appendChild(leaderboardColumnName);

    switch (columnsType) {
        case "GameTime":
            let leaderboardColumnTimeSubmitted = document.createElement('p');
            leaderboardColumnTimeSubmitted.classList.add('leaderboard-column-time-submitted', 'black-outline');
            leaderboardColumnTimeSubmitted.innerHTML = "Time Submitted";
            leaderboardColumnLabels.appendChild(leaderboardColumnTimeSubmitted);

            let leaderboardColumnTimeScore = document.createElement('p');
            leaderboardColumnTimeScore.classList.add('leaderboard-column-time-score', 'black-outline');
            leaderboardColumnTimeScore.innerHTML = "Game Time";
            leaderboardColumnLabels.appendChild(leaderboardColumnTimeScore);
            break;
        case "LeastCash":
            let leaderboardColumnCashSpent = document.createElement('p');
            leaderboardColumnCashSpent.classList.add('leaderboard-column-cash-spent', 'black-outline');
            leaderboardColumnCashSpent.innerHTML = "Cash Spent";
            leaderboardColumnLabels.appendChild(leaderboardColumnCashSpent);

            let leaderboardColumnLCTimeScore = document.createElement('p');
            leaderboardColumnLCTimeScore.classList.add('leaderboard-column-time-score', 'black-outline');
            leaderboardColumnLCTimeScore.innerHTML = "Game Time";
            leaderboardColumnLabels.appendChild(leaderboardColumnLCTimeScore);
            break;
        case "LeastTiers":
            let leaderboardColumnTiersUsed = document.createElement('p');
            leaderboardColumnTiersUsed.classList.add('leaderboard-column-tiers-used', 'black-outline');
            leaderboardColumnTiersUsed.innerHTML = "Tiers Used";
            leaderboardColumnLabels.appendChild(leaderboardColumnTiersUsed);

            let leaderboardColumnLTTimeScore = document.createElement('p');
            leaderboardColumnLTTimeScore.classList.add('leaderboard-column-time-score', 'black-outline');
            leaderboardColumnLTTimeScore.innerHTML = "Game Time";
            leaderboardColumnLabels.appendChild(leaderboardColumnLTTimeScore);
            break;
        case "CTTeam":
            leaderboardColumnName.innerHTML = "Team";
        case "CTPlayer":
            let leaderboardColumnCTPoints = document.createElement('p');
            leaderboardColumnCTPoints.classList.add('leaderboard-column-ct-points', 'black-outline');
            leaderboardColumnCTPoints.innerHTML = "CT Points";
            leaderboardColumnLabels.appendChild(leaderboardColumnCTPoints);
            break;
    }
}

async function openProfile(source, profile) {
    profile = await getUserProfile(profile)
    if (profile == null) { return; }
    resetScroll();
    document.getElementById(`${source}-content`).style.display = "none";
    let publicProfileContent = document.getElementById('publicprofile-content');
    publicProfileContent.style.display = "flex";
    publicProfileContent.innerHTML = "";

    let publicProfileDiv = document.createElement('div');
    publicProfileDiv.classList.add('publicprofile-div');
    publicProfileContent.appendChild(publicProfileDiv);

    let modalClose = document.createElement('img');
    modalClose.classList.add('error-modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        exitProfile(source);
    })
    publicProfileDiv.appendChild(modalClose);

    let profileHeader = document.createElement('div');
    profileHeader.classList.add('profile-header', 'profile-banner');
    profileHeader.style.backgroundImage = `linear-gradient(to bottom, transparent 50%, var(--profile-primary) 70%),url('${getProfileBanner(profile)}')`;
    publicProfileDiv.appendChild(profileHeader);
    profileHeader.appendChild(generateAvatar(100, getProfileAvatar(profile)));

    let profileTopBottom = document.createElement('div');
    profileTopBottom.classList.add('profile-top-bottom');
    profileHeader.appendChild(profileTopBottom);

    let profileTop = document.createElement('div');
    profileTop.classList.add('profile-top-public');
    profileTopBottom.appendChild(profileTop);

    let profileName = document.createElement('p');
    profileName.classList.add('profile-name', 'black-outline');
    profileName.innerHTML = profile["displayName"];
    profileTop.appendChild(profileName);

    let rankStar = document.createElement('div');
    rankStar.classList.add('rank-star-public');
    profileTop.appendChild(rankStar);

    let rankImg = document.createElement('img');
    rankImg.classList.add('rank-img');
    rankImg.src = '../Assets/UI/LvlHolder.png';
    rankStar.appendChild(rankImg);

    let rankText = document.createElement('p');
    rankText.classList.add('rank-text', 'black-outline');
    rankText.innerHTML = profile.rank;
    rankStar.appendChild(rankText);

    if (profile.veteranRank > 0) {
        let rankStarVeteran = document.createElement('div');
        rankStarVeteran.classList.add('rank-star-public');
        profileTop.appendChild(rankStarVeteran);

        let rankImgVeteran = document.createElement('img');
        rankImgVeteran.classList.add('rank-img');
        rankImgVeteran.src = '../Assets/UI/LvlHolderVeteran.png';
        rankStarVeteran.appendChild(rankImgVeteran);

        let rankTextVeteran = document.createElement('p');
        rankTextVeteran.classList.add('rank-text', 'black-outline');
        rankTextVeteran.innerHTML = profile.veteranRank;
        rankStarVeteran.appendChild(rankTextVeteran);
    }

    let profileFollowers = document.createElement('div')
    profileFollowers.classList.add('profile-followers');
    profileTop.appendChild(profileFollowers);

    let followersLabel = document.createElement('p');
    followersLabel.classList.add('followers-label', 'black-outline');
    followersLabel.innerHTML = 'Followers';
    profileFollowers.appendChild(followersLabel);

    let followersCount = document.createElement('p');
    followersCount.classList.add('followers-count');
    followersCount.innerHTML = profile["followers"].toLocaleString();
    profileFollowers.appendChild(followersCount);


    let belowProfileHeader = document.createElement('div');
    belowProfileHeader.classList.add('below-profile-header');
    publicProfileDiv.appendChild(belowProfileHeader);

    let leftColumnDiv = document.createElement('div');
    leftColumnDiv.classList.add('left-column-div');
    belowProfileHeader.appendChild(leftColumnDiv);

    let leftColumnHeader = document.createElement('div');
    leftColumnHeader.classList.add('left-column-header');
    leftColumnDiv.appendChild(leftColumnHeader);

    let leftColumnHeaderText = document.createElement('p');
    leftColumnHeaderText.classList.add('column-header-text', 'black-outline');
    leftColumnHeaderText.innerHTML = 'Medals';
    leftColumnHeader.appendChild(leftColumnHeaderText);

    let publicMedals = {};
    let tempCoop = {};
    for (let [key, value] of Object.entries(medalMap)) {
        publicMedals["Medal" + value] = profile["_medalsSinglePlayer"][key] || 0;
        tempCoop["MedalCoop" + value] = profile["_medalsMultiplayer"][key] || 0;
    }
    publicMedals = { ...publicMedals, ...tempCoop };
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
    publicMedals["MedalEventDiamondMedal"] = profile["_medalsRace"]["Diamond"] || 0;
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
    publicMedals["CtLocalPlayerGoldDiamondMedal"] = profile["_medalsCTLocal"]["GoldDiamond"] || 0;
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
    publicMedals["CtGlobalPlayerRedDiamondMedal"] = profile["_medalsCTGlobal"]["RedDiamond"] || 0;
    publicMedals["CtGlobalPlayerBlackDiamondMedal"] = profile["_medalsCTGlobal"]["BlackDiamond"] || 0;

    let currencyAndMedalsDiv = document.createElement('div');
    currencyAndMedalsDiv.classList.add('currency-medals-div');
    leftColumnDiv.appendChild(currencyAndMedalsDiv);

    let medalsDiv = document.createElement('div');
    medalsDiv.classList.add('medals-div');
    currencyAndMedalsDiv.appendChild(medalsDiv);

    for (let [medal, num] of Object.entries(publicMedals)) {
        if (num === 0) { continue; }
        let medalDiv = document.createElement('div');
        medalDiv.classList.add('medal-div');
        medalDiv.title = constants.medalLabels[medal];
        medalsDiv.appendChild(medalDiv);

        let medalImg = document.createElement('img');
        medalImg.classList.add('medal-img');
        medalImg.src = getMedalIcon(medal);
        medalImg.style.display = "none";
        medalImg.addEventListener('load', () => {
            if (medalImg.width < medalImg.height) {
                medalImg.style.width = `${ratioCalc(3, 70, 256, 0, medalImg.width)}px`
            } else {
                medalImg.style.height = `${ratioCalc(3, 70, 256, 0, medalImg.height)}px`
            }
            medalImg.style.removeProperty('display');
        })
        medalDiv.appendChild(medalImg);

        let medalText = document.createElement('p');
        medalText.classList.add('medal-text', 'black-outline');
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
    topHeroesText.classList.add('top-heroes-text', 'black-outline');
    topHeroesText.innerHTML = 'Top Heroes';
    topHeroesTopRibbonDiv.appendChild(topHeroesText);

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');
    topHeroesTopDiv.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text', 'black-outline');
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

    for (let [hero, xp] of Object.entries(profile["heroesPlaced"]).sort((a, b) => b[1] - a[1])) {
        if (xp === 0) { continue; }
        if (!heroesList.includes(hero)) { continue; }
        let heroDiv = document.createElement('div');
        heroDiv.classList.add('hero-div');
        counter < 3 ? top3HeroesDiv.appendChild(heroDiv) : otherHeroesDiv.appendChild(heroDiv);

        let heroImg = document.createElement('img');
        heroImg.classList.add('hero-img');
        heroImg.src = getHeroPortrait(hero, 1);
        heroImg.style.display = "none";
        heroImg.addEventListener('load', () => {
            if (heroImg.width < heroImg.height) {
                heroImg.style.width = `${ratioCalc(3, 150, 1920, 0, heroImg.width)}px`
            } else {
                heroImg.style.height = `${ratioCalc(3, 150, 1920, 0, heroImg.height)}px`
            }
            heroImg.style.removeProperty('display');
        })
        heroDiv.appendChild(heroImg);

        let heroText = document.createElement('p');
        heroText.classList.add('hero-text', 'black-outline');
        heroText.innerHTML = xp.toLocaleString();
        heroDiv.appendChild(heroText);
        counter++;
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
    topTowersText.classList.add('top-heroes-text', 'black-outline');
    topTowersText.innerHTML = 'Top Towers';
    topTowersTopRibbonDiv.appendChild(topTowersText);

    let mapsProgressCoopToggle2 = document.createElement('div');
    mapsProgressCoopToggle2.classList.add('maps-progress-coop-toggle');
    topTowersTopDiv.appendChild(mapsProgressCoopToggle2);

    let mapsProgressCoopToggleText2 = document.createElement('p');
    mapsProgressCoopToggleText2.classList.add('maps-progress-coop-toggle-text', 'black-outline');
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

    for (let [tower, xp] of Object.entries(profile["towersPlaced"]).sort((a, b) => b[1] - a[1])) {
        if (xp === 0) { continue; }
        if (!towersList.includes(tower)) { continue; }
        let towerDiv = document.createElement('div');
        towerDiv.classList.add('hero-div');
        counter < 3 ? top3TowersDiv.appendChild(towerDiv) : otherTowersDiv.appendChild(towerDiv);

        let towerImg = document.createElement('img');
        towerImg.classList.add('hero-img');
        towerImg.src = getInstaContainerIcon(tower, "000");
        towerDiv.appendChild(towerImg);

        let towerText = document.createElement('p');
        towerText.classList.add('hero-text', 'black-outline');
        towerText.innerHTML = xp.toLocaleString();
        towerDiv.appendChild(towerText);
        counter++;
    }


    let rightColumnDiv = document.createElement('div');
    rightColumnDiv.classList.add('right-column-div');
    belowProfileHeader.appendChild(rightColumnDiv);

    let rightColumnHeader = document.createElement('div');
    rightColumnHeader.classList.add('overview-right-column-header');
    rightColumnDiv.appendChild(rightColumnHeader);

    let rightColumnHeaderText = document.createElement('p');
    rightColumnHeaderText.classList.add('column-header-text', 'black-outline');
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
    profileStatsDiv.classList.add('profile-stats');
    rightColumnDiv.appendChild(profileStatsDiv);

    for (let [key, value] of Object.entries(statsPublic)) {
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
}

function exitProfile(source) {
    document.getElementById('publicprofile-content').style.display = "none";
    document.getElementById(`${source}-content`).style.display = "flex";
}

function generateAvatar(size, src) {
    let avatar = document.createElement('div');
    avatar.style.width = `${size}px`;
    avatar.style.height = `${size}px`;
    avatar.classList.add('avatar');

    let avatarFrame = document.createElement('img');
    avatarFrame.classList.add('avatar-frame', 'noSelect');
    avatarFrame.style.width = `${size}px`;
    avatarFrame.src = '../Assets/UI/InstaTowersContainer.png';
    avatar.appendChild(avatarFrame);

    let avatarImg = document.createElement('img');
    avatarImg.classList.add('avatar-img', 'noSelect');
    avatarImg.style.width = `${size}px`;
    avatarImg.src = src;
    avatar.appendChild(avatarImg);
    return avatar;
}

function copyLoadingIcon(destination) {
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
    totalSeconds = totalSeconds % 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    remainingMilliseconds = remainingMilliseconds.toString().padStart(3, '0');

    let timeString = `${minutes}:${seconds}.${remainingMilliseconds}`;
    if (hours > 0) {
        hours = hours.toString().padStart(2, '0');
        timeString = `${hours}:${timeString}`;
    }

    return timeString;
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

function changeHexBGColor(color) {
    if (color == null) {
        document.body.style.removeProperty("background-color")
        return;
    }
    document.body.style.backgroundColor = `rgb(${color[0] * 255},${color[1] * 255},${color[2] * 255})`;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
}

function getRemainingTime(targetTime) {
    const now = new Date();
    const remainingTime = (targetTime - now) / 1000;
    return remainingTime;
}

function updateTimer(targetTime, elementId) {
    const remainingTime = getRemainingTime(targetTime);
    const timerElement = document.getElementById(elementId);

    if (remainingTime > 48 * 3600) {
        const days = Math.ceil(remainingTime / (24 * 3600));
        timerElement.textContent = `${days} days left`;
    } else if (remainingTime < 0) {
        timerElement.textContent = "Finished";
    } else {
        timerElement.textContent = formatTime(remainingTime);
    }
}


function ratioCalc(unknown, x1, x2, y1, y2) {
    switch (unknown) {
        case 1:
            // x1/x2 == y1/y2
            return x2 * (y1 / y2)
        case 2:
            // x1/x2 == y1/y2
            return x1 * (y2 / y1)
        case 3:
            // x1/x2 == y1/y2
            return y2 * (x1 / x2)
        case 4:
            // x1/x2 == y1/y2
            return y1 * (x2 / x1)
    }
}


function resetScroll() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function errorModal(body, source, force) {
    if (isErrorModalOpen && !force) { return; }
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
    modalHeaderText.classList.add('error-modal-header-text', 'black-outline');
    modalHeaderText.innerHTML = "Error";
    modalHeader.appendChild(modalHeaderText);

    let dummyElmnt = document.createElement('div');
    dummyElmnt.classList.add('error-modal-dummy');
    modalHeader.appendChild(dummyElmnt);

    let modalContent = document.createElement('div');
    modalContent.id = 'error-modal-content';
    modalContent.classList.add('error-modal-content');
    modalContent.innerHTML = (source == "api" ? "" : "") + body;
    modal.appendChild(modalContent);

    let modalContent2 = document.createElement('div');
    modalContent2.classList.add('error-modal-content');
    switch (body) {
        case "Invalid user ID / Player Does not play this game":
            modalContent2.innerHTML = "Please try again or create a new Open Access Key.";
            modal.appendChild(modalContent2);
            break;
    }

    if (source == "ratelimit") {
        let mapsProgressCoopToggle = document.createElement('div');
        mapsProgressCoopToggle.classList.add('error-toggle-div');
        modal.appendChild(mapsProgressCoopToggle);

        let mapsProgressCoopToggleText = document.createElement('p');
        mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text', 'black-outline');
        mapsProgressCoopToggleText.innerHTML = "Manually Load Profiles: ";
        mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

        let mapsProgressCoopToggleInput = document.createElement('input');
        mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
        mapsProgressCoopToggleInput.type = 'checkbox';
        mapsProgressCoopToggleInput.checked = preventRateLimiting;
        mapsProgressCoopToggleInput.addEventListener('change', () => {
            mapsProgressCoopToggleInput.checked ? preventRateLimiting = true : preventRateLimiting = false;
        })
        mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);
    }

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
