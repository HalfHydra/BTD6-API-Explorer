async function generateLeaderboards() {
    showLoading();
    let leaderboardsContent = document.getElementById('leaderboards-content');
    leaderboardsContent.innerHTML = "";

    let leaderboardPage = document.createElement('div');
    leaderboardPage.classList.add('leaderboard-page', 'page-extra', 'fd-column', 'ai-center');
    leaderboardsContent.appendChild(leaderboardPage);

    // let workInProgressText = document.createElement('p');
    // workInProgressText.classList.add('site-info-header', 'sites-text', 'black-outline');
    // workInProgressText.innerHTML = 'Note: Update 48 changed leaderboards and broke the site. It will be fixed sometime soon.';
    // leaderboardPage.appendChild(workInProgressText);

    let currentText = document.createElement('p');
    currentText.classList.add('hero-progress-header-text', 'leaderboards-header-text');
    currentText.style.backgroundImage = "url('../Assets/UI/BlueTxtTextureMain.png')"
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

    let promises = [];

    if (racesData == null) {
        promises.push(fetchData(`https://data.ninjakiwi.com/btd6/races`, (json) => {
            racesData = json["body"];
        }))
    }
    if (bossesData == null) {
        promises.push(fetchData(`https://data.ninjakiwi.com/btd6/bosses`, (json) => {
            bossesData = json["body"];
        }));
    }
    if (CTData == null) {
        promises.push(fetchData(`https://data.ninjakiwi.com/btd6/ct`, (json) => {
            CTData = json["body"];
        }));
    }
    await Promise.all(promises).then(() => {
        hideLoading(); 
    });

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
        roundsetTextDiv.classList.add('roundset-selector-text-div', 'd-flex', 'fd-column', 'ai-center');
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
        roundsetTextDiv.classList.add('roundset-selector-text-div', 'd-flex', 'fd-column', 'ai-center');
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
        roundsetTextDiv.classList.add('roundset-selector-text-div', 'd-flex', 'fd-column', 'ai-center');
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
        roundsetTextDiv.classList.add('roundset-selector-text-div', 'd-flex', 'fd-column', 'ai-center');
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
        roundsetTextDiv.classList.add('roundset-selector-text-div', 'd-flex', 'fd-column', 'ai-center');
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

    addToBackQueue({ source: source, destination: 'leaderboard' })

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

    if (leaderboardData.length > 0) {
        hideLoading();
    }

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
                    addToBackQueue({ source: 'leaderboard', destination: 'publicprofile' });
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
                        let submittedDate = new Date(metadata.start + scorePartsObj["Game Time"].score)

                        let leaderboardEntryTimeSubmitted = document.createElement('p');
                        leaderboardEntryTimeSubmitted.classList.add('leaderboard-entry-time-submitted', 'leaderboard-outline');
                        leaderboardEntryTimeSubmitted.innerHTML = submittedDate.toLocaleString();
                        leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmitted);

                        let leaderboardEntryTimeSubmittedRelative = document.createElement('p');
                        leaderboardEntryTimeSubmittedRelative.classList.add('leaderboard-entry-time-submitted-relative', 'leaderboard-outline');
                        leaderboardEntryTimeSubmittedRelative.innerHTML = relativeTime(new Date(), submittedDate);
                        leaderboardEntryTimeSubmitDiv.appendChild(leaderboardEntryTimeSubmittedRelative);

                        leaderboardEntryMainScore.innerHTML = formatScoreTime(scorePartsObj["Least Cash"].score); //entry.score
                        break;
                    case "LeastCash":
                        leaderboardEntryMainScore.innerHTML =  scorePartsObj["Least Cash"].score.toLocaleString();
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
                        leaderboardEntryMainScore.innerHTML = scorePartsObj["Tier Count"].score.toLocaleString();
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
                                leaderboardCache[leaderboardLink].nextRequested = true;
                            }

                            if (page == 1 && ((index + ((page - 1) * count) + 1) <= 50)) {
                                addRequestToQueue(entry.profile, async () => {
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
                        } else {
                            removeRequestFromQueue(entry.profile);
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