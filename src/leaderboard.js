async function generateLeaderboards() {
    showLoading();
    let leaderboardsContent = document.getElementById('leaderboards-content');
    leaderboardsContent.innerHTML = "";

    let leaderboardPage = document.createElement('div');
    leaderboardPage.classList.add('leaderboard-page', 'page-extra', 'fd-column', 'ai-center');
    leaderboardPage.style.display = "none";
    // leaderboardPage.style.minHeight = "800px";
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

    clearAllTimers();

    let promises = [];

    if (isStale(racesDataCachedAt)) {
        promises.push(fetchData(`https://data.ninjakiwi.com/btd6/races`, (json) => {
            racesData = json["body"];
            racesDataCachedAt = Date.now();
        }));
    }
    if (isStale(bossesDataCachedAt)) {
        promises.push(fetchData(`https://data.ninjakiwi.com/btd6/bosses`, (json) => {
            bossesData = json["body"];
            bossesDataCachedAt = Date.now();
        }));
    }
    if (isStale(CTDataCachedAt)) {
        promises.push(fetchData(`https://data.ninjakiwi.com/btd6/ct`, (json) => {
            CTData = json["body"];
            CTDataCachedAt = Date.now();
        }));
    }
    await Promise.all(promises).then(() => {
        leaderboardPage.style.display = "flex";
        hideLoading();
    });

    racesData.forEach((data) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        (now > new Date(data.start) && now < new Date(data.end)) ? currentSelectorsDiv.appendChild(roundsetDiv) : pastEvents.push([data, roundsetDiv, data.totalScores]);
        roundsetDiv.addEventListener('click', () => {
            showLeaderboard('leaderboards', data, "Race");
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
            registerTimer(roundsetText2.id, new Date(data.end));
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
            registerTimer(roundsetText2.id, new Date(data.end));
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
            registerTimer(roundsetText2.id, new Date(data.end));
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
            registerTimer(roundsetText2.id, new Date(data.end));
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
            registerTimer(roundsetText2.id, new Date(data.end));
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
    showLoading(true);

    leaderboardActiveToken++;
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

    addToBackQueue({ source: source, destination: 'leaderboard', callback: () => { leaderboardLink = null; leaderboardActiveToken++ } })

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
        goBack();
        leaderboardActiveToken++;
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


    let leaderboardHeaderRight = createEl('div', {
        classList: ['d-flex', 'jc-end'],
        style: {
            width: '80px',
        }
    });
    leaderboardHeader.appendChild(leaderboardHeaderRight);

    let leaderboardRefreshBtn = createEl('img', {
        classList: [],
        style: {
            cursor: 'pointer',
            width: '50px',
            height: '50px',
        },
        src: './Assets/UI/RefreshBtn.png',
    })
    leaderboardRefreshBtn.addEventListener('click', () => {
        if (leaderboardLink) {
            delete leaderboardCache[leaderboardLink];
        }
        leaderboardActiveToken++;
        showLoading();
        generateLeaderboardEntries(metadata, type, leaderboardActiveToken);
    });
    leaderboardHeaderRight.appendChild(leaderboardRefreshBtn);

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

    generateLeaderboardEntries(metadata, type, leaderboardActiveToken);
}

async function generateLeaderboardEntries(metadata, type, token = leaderboardActiveToken) {
    await getAllLeaderboardData(leaderboardLink, token);

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
        switch ((type == "BossElite") ? metadata.eliteScoringType : metadata.normalScoringType) {
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
            } else {
                leaderboardEntry.addEventListener('click', () => {
                    openTeamModalPopout(entry.group);
                });
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
                switch ((type == "BossElite") ? metadata.eliteScoringType : metadata.normalScoringType) {
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
                        leaderboardEntryMainScore.innerHTML = scorePartsObj["Least Cash"].score.toLocaleString();
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
                                if (leaderboardCache[leaderboardLink].next != null) {
                                    if (leaderboardEntries.getElementsByClassName('loading-text-leaderboard').length == 0) {
                                        let loadingEntriesText = createEl('p', { classList: ['loading-text-leaderboard', 'black-outline'], style: { fontSize: '32px', paddingBottom: '50px' }, innerHTML: "Loading more entries..." });
                                        leaderboardEntries.appendChild(loadingEntriesText);
                                    }
                                    clearProfileRequestQueue();
                                    getLeaderboardPage(leaderboardCache[leaderboardLink].next, leaderboardActiveToken);
                                    leaderboardCache[leaderboardLink].nextRequested = true;
                                } else {
                                    if (!leaderboardCache[leaderboardLink].ended) {
                                        leaderboardCache[leaderboardLink].ended = true;
                                        let endOfLeaderboard = createEl('p', { classList: ['black-outline'], style: { fontSize: '32px', paddingBottom: '50px' }, innerHTML: "End of Leaderboard" });
                                        leaderboardEntries.appendChild(endOfLeaderboard);
                                    }
                                }
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

        Array.from(leaderboardEntries.getElementsByClassName('loading-text-leaderboard')).forEach((icon) => {
            icon.remove();
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

function openTeamModalPopout(groupUrl) {
    const container = createEl('div', { classList: ['d-flex', 'jc-center'], style: { padding: '10px 0', minHeight: "550px" } });
    const list = createEl('div', { classList: [] });
    container.appendChild(list);

    createModal({
        header: 'Contested Territory - Team Group',
        content: container
    });

    let loading = null;

    (async () => {
        try {
            loading = copyLoadingIcon(container);
            const res = await fetch(groupUrl);
            if (!res.ok) throw new Error(`Failed to fetch group: ${res.status}`);
            const json = await res.json();

            let entries = [];
            if (Array.isArray(json)) entries = json;
            else if (Array.isArray(json.body)) entries = json.body;
            else if (Array.isArray(json?.body?.entries)) entries = json.body.entries;

            if (!entries || entries.length === 0) {
                list.innerHTML = '';
                list.appendChild(createEl('p', {
                    classList: ['no-data-found', 'black-outline'],
                    textContent: 'No teams found for this group.'
                }));
                return;
            }

            entries.sort((a, b) => (b.score || 0) - (a.score || 0));

            const rowMap = new Map();

            entries.forEach((e, idx) => {
                const wrapper = createEl('div', { classList: ['d-flex', 'fd-column'] });

                const entryOuter = createEl('div', { classList: ['leaderboard-entry', 'team-group-entry'] });
                const entryDiv = createEl('div', { classList: ['leaderboard-entry-div'] });

                const caret = createEl('img', {
                    src: './Assets/UI/ArrowHideBtn.png',
                    style: { width: '40px', height: '40px', cursor: 'pointer', transition: 'transform .2s' },
                    classList: ['team-group-caret']
                });

                const rank = createEl('p', {
                    classList: ['leaderboard-entry-rank', 'black-outline'],
                    textContent: (idx + 1)
                });

                const leftWrap = createEl('div', { classList: ['team-group-rank-wrap'] });
                leftWrap.appendChild(rank);

                const playerDiv = createEl('div', { classList: ['leaderboard-entry-player', 'leaderboard-entry-team'] });
                const iconWrap = createEl('div', { classList: ['leaderboard-entry-icon-ct'] });

                const frame = createEl('img', {
                    classList: ['leaderboard-entry-frame'],
                    src: './Assets/UI/TeamFrame1.png'
                });
                const emblem = createEl('img', {
                    classList: ['leaderboard-entry-emblem'],
                    src: './Assets/UI/TeamIcon1.png'
                });
                iconWrap.appendChild(frame);
                iconWrap.appendChild(emblem);

                const name = createEl('p', {
                    classList: ['leaderboard-entry-name', 'leaderboard-outline'],
                    textContent: e.displayName || 'Unknown Team'
                });

                playerDiv.appendChild(iconWrap);
                playerDiv.appendChild(name);

                const scoreDiv = createEl('div', { classList: ['leaderboard-entry-score'] });
                const scoreIcon = createEl('img', {
                    classList: ['leaderboard-entry-score-icon', 'leaderboard-entry-score-icon-large'],
                    src: './Assets/UI/CtPointsIconSmall.png'
                });
                const scoreVal = createEl('p', {
                    classList: ['leaderboard-entry-main-score', 'leaderboard-outline', 'fg-1', 'ta-center'],
                    textContent: (e.score || 0).toLocaleString()
                });
                scoreDiv.appendChild(scoreIcon);
                scoreDiv.appendChild(scoreVal);

                entryDiv.appendChild(leftWrap);
                entryDiv.appendChild(playerDiv);
                entryDiv.appendChild(scoreDiv);
                entryOuter.appendChild(entryDiv);
                entryOuter.appendChild(caret);

                const extra = createEl('div', {
                    classList: ['d-flex', 'ai-center', 'jc-between'],
                    style: { display: 'none', margin: '0px 60px 0px 20px' }
                });

                const membersP = createEl('p', {
                    classList: ['black-outline', 'team-group-members'],
                    style: { fontSize: '22px' },
                    innerHTML: `<span class="team-group-members-value">?</span>/15 Members`
                });

                const ownerContainer = createEl('div', { classList: ['d-flex', 'ai-center'], style: { gap: '8px' } });

                const ownerLabel = createEl('p', {
                    classList: ['black-outline'],
                    style: { fontSize: '22px' },
                    textContent: 'Owner:'
                });
                ownerContainer.appendChild(ownerLabel);

                const ownerBlock = createEl('div', { classList: ['challenge-creator', 'team-owner-block', 'pointer'], style: { width: '300px' } });
                ownerContainer.appendChild(ownerBlock);

                const ownerAvatar = createEl('div', { classList: ['avatar'] });
                ownerBlock.appendChild(ownerAvatar);

                const ownerFrame = createEl('img', {
                    classList: ['avatar-frame', 'noSelect'],
                    style: { width: '50px' },
                    src: '../Assets/UI/InstaTowersContainer.png'
                });
                ownerAvatar.appendChild(ownerFrame);

                const ownerImg = createEl('img', {
                    classList: ['avatar-img', 'noSelect'],
                    style: { width: '50px' },
                    src: '../Assets/ProfileAvatar/ProfileAvatar01.png'
                });
                ownerAvatar.appendChild(ownerImg);

                const ownerName = createEl('p', {
                    classList: ['black-outline'],
                    textContent: preventRateLimiting ? 'Click to Load Owner' : 'Loading...'
                });
                ownerBlock.appendChild(ownerName);

                const statusP = createEl('p', {
                    classList: ['black-outline'],
                    style: { fontSize: '22px' },
                    innerHTML: '<span class="team-group-status-value">Loading...</span>'
                });

                extra.appendChild(statusP);
                extra.appendChild(membersP);
                extra.appendChild(ownerContainer);

                caret.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const open = extra.style.display === 'flex';
                    extra.style.display = open ? 'none' : 'flex';
                    caret.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
                    if (!open) {
                        const ref = rowMap.get(e.profile);
                        if (ref && !ref.ownerLoaded && ref.teamProfile) {
                            loadOwner(ref, groupUrl);
                        }
                    }
                });
                entryDiv.addEventListener('click', () => caret.click());

                wrapper.appendChild(entryOuter);
                wrapper.appendChild(extra);
                list.appendChild(wrapper);

                rowMap.set(e.profile, {
                    entryDiv,
                    frameEl: frame,
                    emblemEl: emblem,
                    iconWrap,
                    membersSpan: membersP.querySelector('.team-group-members-value'),
                    statusSpan: statusP.querySelector('.team-group-status-value'),
                    ownerBlock,
                    ownerImg,
                    ownerFrame,
                    ownerName,
                    extra,
                    ownerLoaded: false,
                    teamProfile: null
                });
            });

            if (entries.length < 6) {
                for (let i = entries.length; i < 6; i++) {
                    const rankNumber = i + 1;

                    const wrapper = createEl('div', { classList: ['d-flex', 'fd-column'] });

                    const entryOuter = createEl('div', { classList: ['leaderboard-entry', 'team-group-entry', 'placeholder-entry'] });
                    const entryDiv = createEl('div', { classList: ['leaderboard-entry-div'], style: { marginRight: '40px' } });

                    const leftWrap = createEl('div', { classList: ['team-group-rank-wrap'] });
                    const rank = createEl('p', {
                        classList: ['leaderboard-entry-rank', 'black-outline'],
                        textContent: rankNumber
                    });
                    leftWrap.appendChild(rank);

                    const playerDiv = createEl('div', { classList: ['leaderboard-entry-player', 'leaderboard-entry-team'] });

                    const iconWrap = createEl('div', { classList: ['leaderboard-entry-icon-ct'] });
                    const frame = createEl('img', {
                        classList: ['leaderboard-entry-frame'],
                        src: './Assets/UI/StrikethroughRound.png'
                    });
                    iconWrap.appendChild(frame);

                    const name = createEl('p', {
                        classList: ['leaderboard-entry-name', 'leaderboard-outline'],
                        textContent: 'Team has no score or no longer exists'
                    });

                    playerDiv.appendChild(iconWrap);
                    playerDiv.appendChild(name);

                    const scoreDiv = createEl('div', { classList: ['leaderboard-entry-score'] });
                    const scoreIcon = createEl('img', {
                        classList: ['leaderboard-entry-score-icon', 'leaderboard-entry-score-icon-large'],
                        src: './Assets/UI/CtPointsIconSmall.png'
                    });
                    const scoreVal = createEl('p', {
                        classList: ['leaderboard-entry-main-score', 'leaderboard-outline', 'fg-1', 'ta-center'],
                        textContent: '0'
                    });
                    scoreDiv.appendChild(scoreIcon);
                    scoreDiv.appendChild(scoreVal);

                    entryDiv.appendChild(leftWrap);
                    entryDiv.appendChild(playerDiv);
                    entryDiv.appendChild(scoreDiv);
                    entryOuter.appendChild(entryDiv);

                    wrapper.appendChild(entryOuter);
                    list.appendChild(wrapper);
                }
            }

            setTimeout(() => enrichTeams(entries, rowMap), 20);
        } catch (err) {
            console.error(err);
            list.innerHTML = '';
            list.appendChild(createEl('p', {
                classList: ['no-data-found', 'black-outline'],
                textContent: 'Failed to load team group.'
            }));
        } finally {
            loading?.remove();
        }
    })();

    async function enrichTeams(entries, rowMap) {
        const concurrency = preventRateLimiting ? 1 : 4;
        let i = 0;
        async function worker() {
            while (i < entries.length) {
                const current = entries[i++];
                const ref = rowMap.get(current.profile);
                if (!ref) continue;
                try {
                    const key = current.profile.split('/').pop();
                    const cached = profileCache[key];
                    const profileData = cached ? cached : await getUserProfile(current.profile);
                    if (!profileData) continue;

                    ref.teamProfile = profileData;

                    if (profileData.frameURL) ref.frameEl.src = profileData.frameURL;
                    if (profileData.iconURL) ref.emblemEl.src = profileData.iconURL;
                    if (profileData.numMembers != null) ref.membersSpan.textContent = profileData.numMembers;
                    if (profileData.status) {
                        switch (profileData.status) {
                            case "OPEN":
                                ref.statusSpan.textContent = "Public";
                                break;
                            case "CLOSED":
                                ref.statusSpan.textContent = "Invite Only";
                                break;
                            case "FILTERED":
                                ref.statusSpan.textContent = "Private";
                                break;
                            default:
                                ref.statusSpan.textContent = profileData.status;
                        }
                    }
                    if (profileData.banner || profileData.bannerURL) {
                        ref.entryDiv.style.backgroundImage = `url(${getProfileBanner(profileData)})`;
                    }
                } catch {
                    // ignore
                }
            }
        }
        await Promise.all(Array.from({ length: concurrency }, () => worker()));
    }

    function loadOwner(ref, groupUrl) {
        if (!ref.teamProfile || !ref.teamProfile.owner) {
            ref.ownerName.textContent = 'No Owner';
            return;
        }
        const ownerURL = ref.teamProfile.owner;
        const doLoad = async () => {
            ref.ownerName.textContent = 'Loading...';
            try {
                const key = ownerURL.split('/').pop();
                const cached = profileCache[key];
                const ownerData = cached ? cached : await getUserProfile(ownerURL);
                if (!ownerData) {
                    ref.ownerName.textContent = 'Click to Load Owner';
                    return;
                }
                ref.ownerName.textContent = ownerData.displayName;
                ref.ownerImg.src = getProfileAvatar(ownerData);
                ref.ownerBlock.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-secondary) 100%),url(${getProfileBanner(ownerData)})`;
                ref.ownerBlock.onclick = () => {
                    goBack();
                    openProfile('leaderboard', ownerURL, () => openTeamModalPopout(groupUrl));
                }
                ref.ownerLoaded = true;
            } catch {
                ref.ownerName.textContent = 'Error Loading Owner';
            }
        };
        if (preventRateLimiting) {
            ref.ownerName.textContent = 'Click to Load Owner';
            ref.ownerBlock.onclick = () => {
                if (!ref.ownerLoaded) doLoad();
            };
        } else {
            doLoad();
        }
    }
}