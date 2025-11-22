let teamColors = {
    "A": "#9C55E4",
    "B": "#E978AA",
    "C": "#00DD6B",
    "D": "#04A6F3",
    "E": "#F7D302",
    "F": "#F4413F",
    "M": "#B9E546"
}

let bossIDToName = {
    0: "Bloonarius",
    1: "Lych",
    2: "Vortex",
    3: "Dreadbloon",
    4: "Phayze",
    5: "Blastapopoulos"
}

const teamAngles = {
    "Purple": -90,
    "Pink": -30,
    "Green": 30,
    "Blue": 90,
    "Yellow": 150,
    "Red": -150,
}

let renderSettings = {
    advancedLayers: false,
    filter: "none", //banner, relic, race, leastCash, leastTiers, boss
    backgroundType: "default", //default, tileType, mapIcon, nearestTeam
    selectedTeamRotation: -90,
    searchTerm: "",
    showIds: false,
    renderLayers: {
        decor: true,
        banner: false,
        relic: false,
        map: false,
        boss: false,
        gameMode: true,
        hero: false,
        rounds: false,
    },
    roundFilterStart: 1,
    roundFilterEnd: 100,
    heroFilter: "NoFilter",
    selectedPreset: "default",
}

let renderPresets = {
    default: {
        icon: "./Assets/CTMap/PresetDefault.png",
        label: "Default",
        settings: {
            backgroundType: "default",
            renderLayers: {
                decor: true,
                banner: true,
                relic: true,
                map: false,
                boss: true,
                gameMode: false,
                hero: false,
                rounds: false,
            }
        }
    },
    gamemode: {
        icon: "./Assets/CTMap/PresetGameType.png",
        label: "Game Types",
        settings: {
            backgroundType: "tileType",
            renderLayers: {
                decor: false,
                banner: false,
                relic: false,
                map: false,
                boss: false,
                gameMode: true,
                hero: false,
                rounds: false,
            }
        }
    },
    maps: {
        icon: "./Assets/CTMap/PresetMapIcon.png",
        label: "Maps Background",
        settings: {
            backgroundType: "mapIcon",
            renderLayers: {
                decor: false,
                banner: false,
                relic: false,
                map: true,
                boss: false,
                gameMode: false,
                hero: false,
                rounds: true,
            }
        }
    },
    heroes: {
        icon: "./Assets/CTMap/PresetHeroes.png",
        label: "Heroes",
        settings: {
            backgroundType: "tileType",
            renderLayers: {
                decor: false,
                banner: false,
                relic: false,
                map: false,
                boss: false,
                gameMode: false,
                hero: true,
                rounds: true,
            }
        }
    }
}

let debugGlobalCTMap = null;
let selectedCTData = null;

async function openCTEventDetails(source, eventData) {
    let eventDates = `${new Date(eventData.start).toLocaleDateString()} - ${new Date(eventData.end).toLocaleDateString()}`;
    let data = await getCTTiles(eventData.tiles)
    if (data == null) { return; }
    document.getElementById(`${source}-content`).style.display = "none";
    let relicsContent = document.getElementById('relics-content');
    relicsContent.style.display = "flex";
    relicsContent.innerHTML = "";

    let now = new Date();
    let dayMs = 24 * 60 * 60 * 1000;

    addToBackQueue({ "source": source, "destination": "relics" });

    let relicContainer = createEl('div', { classList: ['relic-container', 'ct-panel'], style: { borderRadius: "20px 20px 10px 10px"} });
    resetScroll();

    let extData = await getExternalCTData(eventData.id);

    let isEventActive = now >= new Date(eventData.start) && now <= new Date(eventData.end);


    let relicHeader = createEl('div', { classList: ['ct-border', 'fd-column'] });
    relicsContent.appendChild(relicHeader);

    relicsContent.appendChild(relicContainer);

    let relicHeaderTop = createEl('div', { classList: ['d-flex', 'jc-center', 'w-100'] });
    relicHeader.appendChild(relicHeaderTop);

    let relicHeaderTopDiv = createEl('div', { classList: ['d-flex', 'jc-between'], style: { padding: "0px 10px", width: "800px"} });
    relicHeaderTop.appendChild(relicHeaderTopDiv);

    let relicHeaderTitle = createEl('p', { classList: ['relic-header-title', 'black-outline'], innerHTML: `Contested Territory ${CTSeedToEventNumber[eventData.id] ? "#" + CTSeedToEventNumber[eventData.id] : ''}` });
    relicHeaderTopDiv.appendChild(relicHeaderTitle);

    let relicHeaderDates = createEl('p', { classList: ['relic-header-title', 'black-outline'], innerHTML: `${eventDates}` });
    relicHeaderTopDiv.appendChild(relicHeaderDates);

    let topBar = createEl('div', { classList: ['d-flex', 'jc-evenly', 'w-100'], style: {marginTop: "10px"} });
    if (extData) relicHeader.appendChild(topBar);

    if (!extData) {
        let noDataLabel = createEl('p', { classList: ['font-gardenia', 'ta-center'], style: {fontSize: '24px', marginTop: '10px'}, innerHTML: `Additional data coming soon for this event.` });
        relicHeader.appendChild(noDataLabel);
    }

    let divStyle = { width: "260px" }

    let newTicketsDiv = createEl('div', { classList: ['d-flex', 'ai-center'], style: divStyle });
    topBar.appendChild(newTicketsDiv);

    let tileSearchDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-center'], style: divStyle });
    topBar.appendChild(tileSearchDiv);

    let viewMapDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-end'], style: divStyle });
    viewMapDiv.addEventListener('click', () => {
        openCTEventMap('relics', eventData);
    });
    topBar.appendChild(viewMapDiv);

    let iconStyle = { width: '50px', height: '50px', marginRight: '8px', objectFit: 'contain' };

    let newTicketsIcon = createEl('img', { classList: ['d-flex'], style: iconStyle, src: "./Assets/UI/CtTicketsIcon.png" });
    newTicketsDiv.appendChild(newTicketsIcon);

    let newTicketsTextDiv = createEl('div', { classList: [] });
    newTicketsDiv.appendChild(newTicketsTextDiv);

    let nextTicketsLabel = createEl('p', { classList: ['black-outline'], innerHTML: `Next Tickets in:` });
    newTicketsTextDiv.appendChild(nextTicketsLabel);

    let ticketsTimer = createEl('p', { classList: ['black-outline'], id: 'ct-tickets-timer', innerHTML: `--:--:--`, style: {fontSize: '28px'} });
    newTicketsTextDiv.appendChild(ticketsTimer);

    clearAllTimers();
    if (now >= new Date(new Date(eventData.end).getTime() - dayMs) && now < eventData.end) {
        nextTicketsLabel.innerHTML = "Event Ends In:";
        registerTimer(ticketsTimer.id, eventData.end);
    } else if (new Date(eventData.start) < now && now < new Date(eventData.end)) {
        let timeUntilNextTickets = new Date(new Date().setHours(new Date(eventData.start).getHours(), new Date(eventData.start).getMinutes(), 0, 0)) > now ? new Date(new Date().setHours(new Date(eventData.start).getHours(), new Date(eventData.start).getMinutes(), 0, 0)) : new Date(new Date().setHours(new Date(eventData.start).getHours() + 24, new Date(eventData.start).getMinutes() + 13, 0, 0));
        registerTimer(ticketsTimer.id, timeUntilNextTickets);
    } else if (now > new Date(eventData.end)) {
        ticketsTimer.innerHTML = "Event Ended";
        nextTicketsLabel.style.display = "none";
    } else {
        ticketsTimer.innerHTML = "Not Started";
        nextTicketsLabel.style.display = "none";
    }

    let tileSearchIcon = createEl('img', { classList: [], style: iconStyle, src: "./Assets/UI/CTRegularTileIconSmall.png" });
    tileSearchDiv.appendChild(tileSearchIcon);

    let rogueHeaderCenter = document.createElement('div');
    rogueHeaderCenter.classList.add('pos-rel');
    tileSearchDiv.appendChild(rogueHeaderCenter);

    let tileSearch = createEl('input', { classList: ['search-box', 'font-gardenia', 'rogue-search'], style: { width: '100px', paddingRight: '40px' }, placeholder: "Tile Search",});

    let selectorGoImg = createEl('img', {classList: ['pointer'], style: { width: '38px', height: '38px', top: '2px', right: "0px", filter: "grayscale(100%)", position: 'absolute', objectFit: 'contain' }, src: '../Assets/UI/GoBtnSmall.png' });
    selectorGoImg.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(externalCTData[eventData.id].tiles[tileSearch.value]);
        // if not found do errorModal
    });
    rogueHeaderCenter.appendChild(selectorGoImg);

    tileSearch.addEventListener('input', () => {
        tileSearch.value = tileSearch.value.toUpperCase();
        tileSearch.value = tileSearch.value.replace(/[^A-HMRX0-9]/g, '');
        if (tileSearch.value.length > 3) {
            tileSearch.value = tileSearch.value.substring(0, 3);
        } else if (tileSearch.value.length === 3) {
            selectorGoImg.style.filter = "none";
        } else {
            selectorGoImg.style.filter = "grayscale(100%)";
        }
    })

    rogueHeaderCenter.appendChild(tileSearch);

    let viewMapIcon = createEl('img', { classList: [], style: iconStyle, src: "./Assets/UI/CTTotalTilesIcon.png" });
    viewMapDiv.appendChild(viewMapIcon);
    
    let viewMapButton = generateButton("View CT Map", {width: "180px", borderWidth: "10px", fontSize: "22px", }, () => {});
    viewMapButton.classList.add("start-button")
    viewMapButton.classList.remove("where-button")
    viewMapDiv.appendChild(viewMapButton);


    let relics = data.tiles.filter(tile => tile.type.includes("Relic"))
    relics = relics.sort((a, b) => a.id.localeCompare(b.id))
    relics = relics.map(relic => {
        relic.type = relic.type.split(" ")[2];
        return relic
    });

    let relicsOuterContainer = createEl('div', { classList: ['relics-div', 'fd-column'], style: {} });
    relicContainer.appendChild(relicsOuterContainer);

    let eventRelicsDiv = createEl('div', { classList: ['d-flex', 'jc-center'], style: { marginBottom: "10px"} });
    relicsOuterContainer.appendChild(eventRelicsDiv);

    let dailyPowersDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-evenly', 'f-wrap'], style: { padding: "5px", borderRadius: "10px", backgroundColor: "#372B23" } });
    relicsOuterContainer.appendChild(dailyPowersDiv);

    let relicsDiv = createEl('div', { classList: ['d-flex', 'jc-center', 'f-wrap'], /*style: {maxWidth: "860px"}*/ });
    relicsOuterContainer.appendChild(relicsDiv);

    let eventRelics = externalCTData[eventData.id]?.event_relics || [];

    let eventRelicTimes = [
        1,
        3,
        5,
    ]

    eventRelics.forEach((relic, index) => {
        let relicDiv = createEl('div', { classList: ['d-flex', 'fd-column', 'ai-center'], style: { width: '180px', borderRadius: "10px", margin: "5px", padding: "5px", backgroundColor: "#372B23" } });
        eventRelicsDiv.appendChild(relicDiv);

        let eventRelicLabel = createEl('p', { classList: ['black-outline'], style: {fontSize: '24px', color: "gold"}, innerHTML: `Event Relic ${index + 1}` });
        relicDiv.appendChild(eventRelicLabel);

        let relicIcon = createEl('img', { classList: [], style: {width: '85px'}, src: `./Assets/RelicIcon/${relic}.png` });
        relicDiv.appendChild(relicIcon);

        let unlockTime = new Date(new Date(eventData.start).getTime() + eventRelicTimes[index] * 24 * 60 * 60 * 1000);

        let eventRelicAvailableText = createEl('p', { id: `relic-unlock-${index}`, classList: ['black-outline', 'ta-center'], style: {fontSize: '20px'} });
        if (now <= unlockTime && isEventActive) {
            registerTimer(eventRelicAvailableText.id, unlockTime);
        } else if (isEventActive) {
            eventRelicAvailableText.innerHTML = `Unlocked`;
        } else {
            // eventRelicAvailableText.innerHTML = `${unlockTime.toLocaleDateString()}`;
            eventRelicAvailableText.style.display = "none";
        }
        relicDiv.appendChild(eventRelicAvailableText);
    });

    let dailyPowers = externalCTData[eventData.id]?.daily_powers || [];
    let dailyPowerCounts = {
        "MoabMine": 1,
        "MonkeyBoost": 2,
        "CamoTrap": 1,
        "Techbot": 1,
        "RoadSpikes": 10,
        "Thrive": 2,
        "GlueTrap": 2,
        "SuperMonkeyStorm": 2,
    }

    dailyPowers.forEach((power, index) => {
        let powerDiv = createEl('div', {classList: [], style: {}});
        dailyPowersDiv.appendChild(powerDiv);

        let powerProgressDate = createEl('p', {classList: ['black-outline', 'ta-center'], style: {fontSize: '28px'}, innerHTML: `Day ${index + 1}` });
        powerDiv.appendChild(powerProgressDate);

        let powerIconDiv = createEl('div', {classList: ['power-div'], style: {width: "unset", height: "120px", margin: "unset"}});
        powerDiv.appendChild(powerIconDiv);

        let powerImg = createEl('img', {classList: ['power-img'], style: {transform: 'scale(0.75)'},src: getPowerIcon(power) });
        powerIconDiv.appendChild(powerImg);

        let powerProgressText = createEl('p', {classList: ['black-outline'], style: {position: "absolute", right: 0, bottom: '0px', fontSize: '28px'}, innerHTML: `x${dailyPowerCounts[power]}` });
        powerIconDiv.appendChild(powerProgressText);

        if (isEventActive) {
            let start = new Date(eventData.start);

            let powerActiveTime = new Date(start.getTime() + index * dayMs);

            let powerDate = createEl('p', {classList: ['black-outline', 'ta-center'], style: {fontSize: '18px'}, innerHTML: `--:--:--` });

            if (now >= new Date(powerActiveTime.getTime() + dayMs)) {
                powerDiv.style.filter = "grayscale(100%)";
            }

            if (now >= powerActiveTime && now < new Date(powerActiveTime.getTime() + dayMs)) {
                powerDiv.style.filter = "drop-shadow(0 0 10px #fff)";
                powerDate.id = "current-power-timer";
                registerTimer(powerDate.id, new Date(powerActiveTime.getTime() + dayMs));
                powerDiv.appendChild(powerDate);
            }
        }
    });

    relics.forEach(relic => {
        let relicTypeName = relic.type;

        let relicDiv = createEl('div', { classList: ['relic-div'], style: { backgroundColor: teamColors[relic.id.charAt(0)] } });
        relicsDiv.appendChild(relicDiv);

        let relicID = createEl('p', { classList: ['relic-id'], innerHTML: relic.id });
        relicDiv.appendChild(relicID);

        let relicIcon = createEl('img', { classList: ['relic-icon'], src: `./Assets/RelicIcon/${relicTypeName}.png` });
        relicDiv.appendChild(relicIcon);

        tippy(relicDiv, {
            content: `<p class="artifact-title">${getLocValue(`Relic${relicTypeName}`)}</p>${getLocValue(`Relic${relicTypeName}Description`)}`,
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
    })

    let usedRelicTypes = new Set(relics.map(r => r.type));
    let unusedRelics = constants.relicsInOrder.filter(type => !usedRelicTypes.has(type));

    unusedRelics.forEach(relicTypeName => {
        let relicDiv = createEl('div', { classList: ['relic-div'], style: { backgroundColor: "grey" } });
        relicsDiv.appendChild(relicDiv);

        let relicID = createEl('p', { classList: ['relic-id'], innerHTML: "X" });
        relicDiv.appendChild(relicID);

        let relicIcon = createEl('img', { classList: ['relic-icon'], src: `./Assets/RelicIcon/${relicTypeName}.png` });
        relicDiv.appendChild(relicIcon);

        tippy(relicDiv, {
            content: `<p class="artifact-title">${getLocValue(`Relic${relicTypeName}`)}</p>${getLocValue(`Relic${relicTypeName}Description`)}`,
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
    });
}

async function openCTEventMap(source, eventData) {
    document.getElementById(`${source}-content`).style.display = "none";
    let mapContent = document.getElementById('ct-map-content');
    mapContent.style.display = "flex";
    mapContent.innerHTML = "";
    addToBackQueue({ "source": source, "destination": "ct-map" });

    let tileData = await getExternalCTData(eventData.id);
    selectedCTData = tileData;

    let ctMapDiv = createEl('div', { id: 'ct-map-div', style: { width: '100%' } });

    let topBar = createEl('div', { classList: ['d-flex', 'jc-between', 'ai-center', 'ct-border'], style: {} });
    mapContent.appendChild(topBar);

    // let basicFilterDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'f-wrap'] });
    // topBar.appendChild(basicFilterDiv);

    // let filters = {
    //     // "none": "StrikethroughRound",
    //     "banner": "/UI/CTPointsBanner",
    //     "relic": "/UI/DefaultRelicIcon",
    //     "leastCash": "/UI/LeastCashIconSmall",
    //     "leastTiers": "/UI/LeastTiersIconSmall",
    //     "race": "/UI/StopWatch",
    //     "boss": "/BossIcon/BloonariusPortrait",
    // }

    // for (let [filterKey, filterIcon] of Object.entries(filters)) {
    //     let filterBtn = createEl('img', { classList: ['pointer'], style: { width: '40px', height: '40px', objectFit: 'contain', backgroundImage: 'url("../Assets/UI/StatsTabBlue.png")', backgroundSize: 'contain', padding: '8px', filter: renderSettings.filter === filterKey ? "drop-shadow(0 0 10px #fff)" : "none" }, src: `./Assets/${filterIcon}.png` });
    //     filterBtn.addEventListener('click', () => {
    //         if (renderSettings.filter === filterKey) {
    //             renderSettings.filter = "none";
    //             filterBtn.style.backgroundImage = 'url("../Assets/UI/StatsTabBlue.png")'
    //             if (ctMapDiv) applyCTFilter(ctMapDiv, tileData);
    //             return;
    //         }

    //         renderSettings.filter = filterKey;
    //         switch(filterKey) {
    //             case "none":
    //                 break;
    //             case "banner":
    //                 break;
    //             case "relic":
    //                 break;
    //             case "race":
    //                 break;
    //             case "leastCash":
    //                 break;
    //             case "leastTiers":
    //                 break;
    //             case "boss":
    //                 break;
    //         }
    //         basicFilterDiv.querySelectorAll('img').forEach(img => img.style.backgroundImage = 'url("../Assets/UI/StatsTabBlue.png")');
    //         filterBtn.style.backgroundImage = 'url("../Assets/UI/StatsTabYellow.png")'
    //         if (ctMapDiv) applyCTFilter(ctMapDiv, tileData);
    //     });
    //     basicFilterDiv.appendChild(filterBtn);
    // }

    let teamSelectDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-center', 'f-wrap'] });
    topBar.appendChild(teamSelectDiv);

    // let teamSelectLabel = createEl('p', { classList: ['black-outline'], innerHTML: 'My Team:' });
    // teamSelectDiv.appendChild(teamSelectLabel);

    let teamColors = ["Purple", "Pink", "Green", "Blue", "Yellow", "Red"];
    for (let team of teamColors) {
        let teamBtn = createEl('img', { classList: ['pointer'], style: { width: '40px', height: '40px', objectFit: 'contain', backgroundImage: renderSettings.selectedTeamRotation == teamAngles[team] ? 'url("../Assets/UI/StatsTabYellow.png")' :'url("../Assets/UI/StatsTabBlue.png")', backgroundSize: 'contain', padding: '8px' }, src: `./Assets/UI/TeamTileFlag${team}.png` });
        teamBtn.addEventListener('click', () => {
            renderSettings.selectedTeamRotation = teamAngles[team];
            rotateCTTo(ctMapDiv, renderSettings.selectedTeamRotation);

            teamSelectDiv.querySelectorAll('img').forEach(img => img.style.backgroundImage = 'url("../Assets/UI/StatsTabBlue.png")');
            teamBtn.style.backgroundImage = 'url("../Assets/UI/StatsTabYellow.png")'
        });
        teamSelectDiv.appendChild(teamBtn);
    }

    let centerDiv = createEl('div', { classList: ['d-flex'], style: {  gap: "12px"} });
    topBar.appendChild(centerDiv);

    let tileSearchContainerDiv = createEl('div', { classList: ['pos-rel'] });
    centerDiv.appendChild(tileSearchContainerDiv);

    let tileSearch = createEl('input', { classList: ['search-box', 'font-gardenia', 'rogue-search'], style: { width: '100px', paddingRight: '40px' }, placeholder: "Tile Search",});

    let searchIcon = createEl('img', { classList: ['search-icon'], src: '../Assets/UI/SearchIcon.png', style: {} });
    tileSearchContainerDiv.appendChild(searchIcon);
    tileSearchContainerDiv.appendChild(tileSearch);


    let rightDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
    topBar.appendChild(rightDiv);

    let tileLabelsDiv = createEl('div', { classList: ['d-flex', 'ai-center'], style: {fontSize: '24px'}});
    centerDiv.appendChild(tileLabelsDiv);

    let tileLabelsLabel = createEl('p', { classList: ['black-outline'], innerHTML: 'IDs' });
    tileLabelsDiv.appendChild(tileLabelsLabel);

    let showTileLabelsBtn = generateToggle(renderSettings.showIds, (checked) => {
        renderSettings.showIds = checked;
        updateCTRenderLayers(ctMapDiv);
    });
    tileLabelsDiv.appendChild(showTileLabelsBtn);

    // let teamSelectionToggle = generateDropdown("My Team:", ["Purple", "Pink", "Green", "Blue", "Yellow", "Red"], "Purple", (selected) => {
    //     const teamAngles = {
    //         "Purple": -90,
    //         "Pink": -30,
    //         "Green": 30,
    //         "Blue": 90,
    //         "Yellow": 150,
    //         "Red": -150,
    //     }
    //     renderSettings.selectedTeamRotation = teamAngles[selected];
    //     rotateCTTo(ctMapDiv, renderSettings.selectedTeamRotation);
    // });
    // teamSelectionToggle.querySelector('.dropdown-label').style.minWidth = '110px';
    // rightDiv.appendChild(teamSelectionToggle);

    let filteredDiv = createEl('div', { id: "map-filter-active-div", classList: ['d-flex', 'ai-center'], style: { marginRight: '16px', fontSize: '24px', backgroundColor: "var(--profile-primary)", padding: "8px", gap: "8px", borderRadius: "10px" } });
    rightDiv.appendChild(filteredDiv);

    let filterIcon = createEl('img', { id: 'top-bar-filter-icon', classList: ['blue-tab-icon', 'white-outline'], style: { width: '28px', height: '28px', padding: '4px', objectFit: 'contain' }, src: './Assets/UI/StrikethroughRound.png' });
    filteredDiv.appendChild(filterIcon);

    let filteredLabel = createEl('p', { classList: ['black-outline'], innerHTML: 'Filtered' });;
    filteredDiv.appendChild(filteredLabel);

    let filteredXBtn = createEl('img', { classList: ['pointer'], style: { width: '32px', height: '32px', objectFit: 'contain' }, src: './Assets/UI/CloseBtn.png' });
    filteredXBtn.addEventListener('click', () => {
        renderSettings.searchTerm = "";
        tileSearch.value = "";
        renderSettings.filter = "none";
        filteredDiv.style.visibility = "hidden";
        renderSettings.heroFilter = "NoFilter";
        renderSettings.roundFilterStart = 1;
        renderSettings.roundFilterEnd = 100;
        applyCTFilter(ctMapDiv, tileData);
    });
    filteredDiv.appendChild(filteredXBtn);

    let displaySettingsBtn = createEl('img', {
        classList: ['roundset-settings-btn', 'pointer'],
        style: {
            width: '50px',
            height: '50px',
        },
        src: '../Assets/UI/SettingsBtn.png',
    });
    displaySettingsBtn.addEventListener('click', () => {
        openCTSettingsModal();
    })
    rightDiv.appendChild(displaySettingsBtn);

    tileSearch.addEventListener('input', () => {
        tileSearch.value = tileSearch.value.toUpperCase();
        tileSearch.value = tileSearch.value.replace(/[^A-HMRX0-9]/g, '');
        if (tileSearch.value.length > 3) {
            tileSearch.value = tileSearch.value.substring(0, 3);
        }
        if (tileSearch.value.length == 0) {
            renderSettings.filter = "none";
        } else {
            renderSettings.filter = "search";
            filterIcon.src = './Assets/UI/SearchIcon.png';
        }
        renderSettings.searchTerm = tileSearch.value;
        applyCTFilter(ctMapDiv, tileData);
    })

    const ct = buildCTGrid();

    let ctMainDiv = createEl('div', { id: 'ct-main-div', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' } });
    mapContent.appendChild(ctMainDiv);
    ctMainDiv.appendChild(ctMapDiv);

    debugGlobalCTMap = ctMapDiv;

    renderCTMap(ctMapDiv, ct, tileData, { size: 28 });
    applyCTFilter(ctMapDiv, tileData);
    updateCTRenderLayers(ctMapDiv);
}

function buildCTGrid() {
    const R = 8, MAX_DIST = R - 1;
    const DIRS = [
        { q: 1, r: 0 }, 
        { q: 1, r: -1 },
        { q: 0, r: -1 },
        { q: -1, r: 0 },
        { q: -1, r: 1 },
        { q: 0, r: 1 },
    ];
    const SECT = ['A', 'B', 'C', 'D', 'E', 'F'];
    const key = (q, r) => `${q},${r}`;

    function hexRing(d) {
        if (d === 0) return [{ q: 0, r: 0 }];
        let pos = { q: DIRS[0].q * d, r: DIRS[0].r * d };
        const order = [4, 3, 2, 1, 0, 5];
        const out = [];
        for (const dirIdx of order) {
            for (let i = 0; i < d; i++) {
                out.push({ q: pos.q, r: pos.r });
                pos = { q: pos.q + DIRS[dirIdx].q, r: pos.r + DIRS[dirIdx].r };
            }
        }
        return out;
    }

    function secondFromOffset(off) {
        if (off === 0) return 'A';
        const n = Math.abs(off);
        const idx = off > 0 ? (2 * n - 1) : (2 * n);
        return String.fromCharCode('A'.charCodeAt(0) + idx);
    }

    const offsetAt = (i) => (i === 0 ? 0 : Math.ceil(i / 2) * (i % 2 ? 1 : -1));
    const thirdFor = (d) => String.fromCharCode('G'.charCodeAt(0) - (d - 1));

    const coordToId = new Map();
    const idToCoord = new Map();
    coordToId.set(key(0, 0), 'MRX');
    idToCoord.set('MRX', { q: 0, r: 0 });

    for (let d = 1; d <= MAX_DIST; d++) {
        const ring = hexRing(d);
        const third = thirdFor(d);
        const ringLen = ring.length;

        for (let sIdx = 0; sIdx < 6; sIdx++) {
            const corner = sIdx * d;
            const count = d === MAX_DIST ? d - 1 : d;
            for (let i = 0; i < count; i++) {
                const off = d === MAX_DIST ? offsetAt(i + 1) : offsetAt(i);
                const idx = (corner + off + ringLen) % ringLen;
                const pos = ring[idx];
                const second = secondFromOffset(off);
                let id = SECT[sIdx] + second + third;
                if (id === 'FAG') id = 'FAH';
                coordToId.set(key(pos.q, pos.r), id);
                idToCoord.set(id, { q: pos.q, r: pos.r });
            }
        }
    }

    const spawns = [];
    {
        const d = MAX_DIST;
        const ring = hexRing(d);
        for (let sIdx = 0; sIdx < 6; sIdx++) {
            const pos = ring[sIdx * d];
            spawns.push({ team: SECT[sIdx], q: pos.q, r: pos.r });
        }
    }

    const neighbors = new Map();
    for (const [id, c] of idToCoord.entries()) {
        const adj = [];
        for (const dir of DIRS) {
            const nid = coordToId.get(key(c.q + dir.q, c.r + dir.r));
            if (nid) adj.push(nid);
        }
        neighbors.set(id, adj);
    }

    const cubeDist = (q, r) => Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
    return { coordToId, idToCoord, neighbors, spawns, cubeDist };
}

function renderCTMap(container, ct, tileData, opts = {}) {
    const size = opts.size ?? 28;
    const gap = opts.gap ?? 2;
    const stroke = '#000';
    const rotationDeg = renderSettings.selectedTeamRotation;

    const SQRT3 = Math.sqrt(3);
    const axialToPixel = (q, r) => ({
        x: -size * (SQRT3 * (q + r / 2)),
        y: size * (1.5 * r),
    });

    const hexPoints = (cx, cy, s) => {
        const pts = [];
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 180 * (60 * i - 30);
            pts.push([cx + s * Math.cos(angle), cy + s * Math.sin(angle)]);
        }
        return pts;
    };

    const tiles = [];
    for (const [id, c] of ct.idToCoord.entries()) {
        const p = axialToPixel(c.q, c.r);
        tiles.push({ id, q: c.q, r: c.r, x: p.x, y: p.y });
    }
    const spawns = ct.spawns.map(s => {
        const p = axialToPixel(s.q, s.r);
        return { ...s, x: p.x, y: p.y };
    });

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const pad = size + 16;
    for (const p of [...tiles, ...spawns]) {
        minX = Math.min(minX, p.x - size);
        minY = Math.min(minY, p.y - size);
        maxX = Math.max(maxX, p.x + size);
        maxY = Math.max(maxY, p.y + size);
    }
    minX -= pad; minY -= pad; maxX += pad; maxY += pad;

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `-350 -370 700 750`);
    container.appendChild(svg);

    const defs = document.createElementNS(svg.namespaceURI, 'defs');
    svg.appendChild(defs);

    const gRot = document.createElementNS(svg.namespaceURI, 'g');
    gRot.setAttribute('transform', `rotate(${rotationDeg} ${cx} ${cy})`);
    gRot.setAttribute('data-ct-rot', '1');
    svg.appendChild(gRot);

    const gTiles = document.createElementNS(svg.namespaceURI, 'g');
    const gSpawns = document.createElementNS(svg.namespaceURI, 'g');
    gRot.appendChild(gTiles);
    gRot.appendChild(gSpawns);

    const tileIndex = new Map();
    console.log(tileData);
    let heroesSet = new Set();
    for (const t of tiles) {
        let data = tileData.tiles[t.id];
        const hexS = size - gap;
        const pts = hexPoints(t.x, t.y, hexS);
        const ptsStr = pts.map(p => p.join(',')).join(' ');

        const clipId = `tile-${t.id}`;
        const cp = document.createElementNS(svg.namespaceURI, 'clipPath');
        cp.setAttribute('id', clipId);
        cp.setAttribute('clipPathUnits', 'userSpaceOnUse');
        const cpPoly = document.createElementNS(svg.namespaceURI, 'polygon');
        cpPoly.setAttribute('points', ptsStr);
        cp.appendChild(cpPoly);
        defs.appendChild(cp);

        const gTile = document.createElementNS(svg.namespaceURI, 'g');
        gTile.classList.add('ct-tile', 'pointer');
        gTile.dataset.id = t.id;
        gTiles.appendChild(gTile);

        gTile.addEventListener('click', () => {
            console.log('Clicked tile', t.id, 'neighbors', ct.neighbors.get(t.id));
            console.log(data);
        });

        const polygon = document.createElementNS(svg.namespaceURI, 'polygon');
        polygon.setAttribute('points', ptsStr);
        polygon.setAttribute('fill', '#B9E546');
        polygon.setAttribute('stroke', stroke);
        polygon.setAttribute('stroke-width', '2');
        gTile.appendChild(polygon);

        const title = document.createElementNS(svg.namespaceURI, 'title');
        const neigh = ct.neighbors.get(t.id) || [];
        title.textContent = `${t.id}\nNeighbors: ${neigh.join(', ')}`;
        polygon.appendChild(title);

        const gUpright = document.createElementNS(svg.namespaceURI, 'g');
        gUpright.classList.add('ct-upright');
        gUpright.dataset.cx = t.x;
        gUpright.dataset.cy = t.y;
        gUpright.setAttribute('transform', `rotate(${-rotationDeg} ${t.x} ${t.y})`);
        gTile.appendChild(gUpright);

        const gBg = document.createElementNS(svg.namespaceURI, 'g');
        gBg.classList.add('ct-layer-bg');
        gUpright.appendChild(gBg);

        const gMapFill = document.createElementNS(svg.namespaceURI, 'g');
        gMapFill.setAttribute('clip-path', `polygon(32.28% 1.59%, 68.34% 1.27%, 86.27% 50%, 68.34% 99%, 32.35% 99%, 14.25% 50%)`);
        gMapFill.classList.add('ct-layer-mapicon');
        gUpright.insertBefore(gMapFill, gBg);

        const hexW = hexS * 2;
        const hexH = hexS * SQRT3;
        const imgW = hexH * 1.56;
        const imgH = hexH;
        const imgX = (t.x - hexW / 1.475).toFixed(2);
        const imgY = (t.y - hexH / 2).toFixed(2);

        const gMapIcon = document.createElementNS(svg.namespaceURI, 'image');
        gMapIcon.setAttribute('href', `./Assets/MapIcon/MapSelect${data.GameData.selectedMap}Button.png`);
        gMapIcon.setAttribute('x', imgX);
        gMapIcon.setAttribute('y', imgY);
        gMapIcon.setAttribute('width', imgW.toFixed(2));
        gMapIcon.setAttribute('height', imgH.toFixed(2));
        gMapIcon.setAttribute('preserveAspectRatio', 'none');
        gMapIcon.style.pointerEvents = 'none';
        gMapFill.appendChild(gMapIcon);

        const gDecor = document.createElementNS(svg.namespaceURI, 'g');
        gDecor.classList.add('ct-layer-decor');
        gUpright.appendChild(gDecor);

        let gTileDecor = document.createElementNS(svg.namespaceURI, 'image');
        gTileDecor.setAttribute('href', `./Assets/CTMap/${constants.mapsInOrder[data.GameData.selectedMap].theme}.png`);
        gTileDecor.setAttribute('x', (t.x - size).toFixed(2));
        gTileDecor.setAttribute('y', (t.y - size).toFixed(2));
        gTileDecor.setAttribute('width', (size * 2).toFixed(2));
        gTileDecor.setAttribute('height', (size * 2).toFixed(2));
        gDecor.appendChild(gTileDecor);

        const gRelic = document.createElementNS(svg.namespaceURI, 'g');
        gRelic.classList.add('ct-layer-relic');
        gUpright.appendChild(gRelic);

        if (data.RelicType != "None") {
            let gRelicImg = document.createElementNS(svg.namespaceURI, 'image');
            gRelicImg.setAttribute('href', `./Assets/RelicIcon/${data.RelicType}.png`);
            // gRelicImg.setAttribute('x', (t.x - size * 0.7).toFixed(2));
            // gRelicImg.setAttribute('y', (t.y - size * 0.7).toFixed(2));
            // gRelicImg.setAttribute('width', (size * 1.4).toFixed(2));
            // gRelicImg.setAttribute('height', (size * 1.4).toFixed(2));
            gRelicImg.setAttribute('x', (t.x - size * 0.625).toFixed(2));
            gRelicImg.setAttribute('y', (t.y - size * 0.625).toFixed(2));
            gRelicImg.setAttribute('width', (size * 1.25).toFixed(2));
            gRelicImg.setAttribute('height', (size * 1.25).toFixed(2));
            gRelic.appendChild(gRelicImg);
        }

        const gBanner = document.createElementNS(svg.namespaceURI, 'g');
        gBanner.classList.add('ct-layer-banner');
        gUpright.appendChild(gBanner);

        if (data.TileType === "Banner") {
            let gBannerImg = document.createElementNS(svg.namespaceURI, 'image');
            gBannerImg.setAttribute('href', `./Assets/UI/CTPointsBanner.png`);
            gBannerImg.setAttribute('x', (t.x - size * 0.6).toFixed(2));
            gBannerImg.setAttribute('y', (t.y - size * 0.6).toFixed(2));
            gBannerImg.setAttribute('width', (size * 1.2).toFixed(2));
            gBannerImg.setAttribute('height', (size * 1.2).toFixed(2));
            gBanner.appendChild(gBannerImg);
        }

        const gBoss = document.createElementNS(svg.namespaceURI, 'g');
        gBoss.classList.add('ct-layer-boss');

        if (data.GameData.subGameType == 4) {
            let gBossImg = document.createElementNS(svg.namespaceURI, 'image');
            gBossImg.setAttribute('href', `./Assets/BossIcon/${bossIDToName[data.GameData.bossData.bossBloon]}Portrait.png`);
            gBossImg.setAttribute('x', (t.x - 20).toFixed(2));
            gBossImg.setAttribute('y', (t.y - 25).toFixed(2));
            gBossImg.setAttribute('width', (size * 0.75).toFixed(2));
            gBossImg.setAttribute('height', (size * 0.75).toFixed(2));
            gBossImg.style.filter = "drop-shadow(0px 0px 2px white)",
            gBoss.appendChild(gBossImg);

            let gBossTierImg = document.createElementNS(svg.namespaceURI, 'image');
            gBossTierImg.setAttribute('href', `./Assets/UI/BossTiersIconSmall.png`);
            gBossTierImg.setAttribute('x', (t.x + 0).toFixed(2));
            gBossTierImg.setAttribute('y', (t.y - 25).toFixed(2));
            gBossTierImg.setAttribute('width', (size * 0.70).toFixed(2));
            gBossTierImg.setAttribute('height', (size * 0.70).toFixed(2));
            gBoss.appendChild(gBossTierImg);

            let gBossTierText = document.createElementNS(svg.namespaceURI, 'text');
            gBossTierText.classList.add('font-gardenia');
            gBossTierText.setAttribute('x', (t.x + 10).toFixed(2));
            gBossTierText.setAttribute('y', (t.y - 12).toFixed(2));
            gBossTierText.setAttribute('text-anchor', 'middle');
            gBossTierText.setAttribute('font-size', Math.max(10, size * 0.4));
            gBossTierText.setAttribute('fill', '#FFF');
            gBossTierText.setAttribute('paint-order', 'stroke');
            gBossTierText.setAttribute('stroke', '#111');
            gBossTierText.setAttribute('stroke-width', '2');
            gBossTierText.textContent = data.GameData.bossData.TierCount;
            gBoss.appendChild(gBossTierText);
        }

        let gGameMode = document.createElementNS(svg.namespaceURI, 'g');
        gGameMode.classList.add('ct-layer-gamemode');
        gUpright.appendChild(gGameMode);

        let gGameModeImg = document.createElementNS(svg.namespaceURI, 'image');
        let image = null;
        switch (data.GameData.subGameType) {
            case 2:  
                image = '/UI/EventRaceBtn'; 
                break;
            case 4:  
                image = `/BossIcon/${bossIDToName[data.GameData.bossData.bossBloon]}EventIcon`;
                break;
            case 8:  
                image = '/ChallengeRulesIcon/LeastCashIcon'; 
                break;
            case 9:  
                image = '/ChallengeRulesIcon/LeastTiersIcon'; 
                break;
        }
        gGameModeImg.setAttribute('href', `./Assets/${image}.png`);
        gGameModeImg.setAttribute('x', (t.x - size * 0.625).toFixed(2));
        gGameModeImg.setAttribute('y', (t.y - size * 0.625).toFixed(2));
        gGameModeImg.setAttribute('width', (size * 1.25).toFixed(2));
        gGameModeImg.setAttribute('height', (size * 1.25).toFixed(2));
        gGameMode.appendChild(gGameModeImg);

        

        if (data.GameData.subGameType == 4) {
            let gBossTierImg = document.createElementNS(svg.namespaceURI, 'image');
            gBossTierImg.setAttribute('href', `./Assets/UI/BossTiersIconSmall.png`);
            gBossTierImg.setAttribute('x', (t.x + 0).toFixed(2));
            gBossTierImg.setAttribute('y', (t.y + 3).toFixed(2));
            gBossTierImg.setAttribute('width', (size * 0.65).toFixed(2));
            gBossTierImg.setAttribute('height', (size * 0.65).toFixed(2));
            gGameMode.appendChild(gBossTierImg);

            let gBossTierText = document.createElementNS(svg.namespaceURI, 'text');
            gBossTierText.classList.add('font-gardenia');
            gBossTierText.setAttribute('x', (t.x + 10).toFixed(2));
            gBossTierText.setAttribute('y', (t.y + 16).toFixed(2));
            gBossTierText.setAttribute('text-anchor', 'middle');
            gBossTierText.setAttribute('font-size', Math.max(10, size * 0.4));
            gBossTierText.setAttribute('fill', '#FFF');
            gBossTierText.setAttribute('paint-order', 'stroke');
            gBossTierText.setAttribute('stroke', '#111');
            gBossTierText.setAttribute('stroke-width', '2');
            gBossTierText.textContent = data.GameData.bossData.TierCount;
            gGameMode.appendChild(gBossTierText);
        }

        let heroes = Object.keys(simplifyTowerData(data.GameData.dcModel).heroes);
        heroesSet = new Set([...heroesSet, JSON.stringify(heroes)]);
        if (JSON.stringify(heroes) == '["ChosenPrimaryHero"]') {
            console.log(data);
            console.log(simplifyTowerData(data.GameData.dcModel));
        }

        let selectedHero = (heroes && heroes.length == 1 && heroes[0] !== "ChosenPrimaryHero") ? `/HeroIconCircle/HeroIcon${heroes[0]}` : (heroes.length == 0) ? "/UI/NoHeroSelected" : "/UI/AllHeroesIcon";

        let gHero = document.createElementNS(svg.namespaceURI, 'g');
        gHero.classList.add('ct-layer-hero');
        gUpright.appendChild(gHero);

        let gHeroImg = document.createElementNS(svg.namespaceURI, 'image');
        gHeroImg.setAttribute('href', `./Assets/${selectedHero}.png`);
        gHeroImg.setAttribute('x', (t.x - size * 0.7).toFixed(2));
        gHeroImg.setAttribute('y', (t.y - size * 0.7).toFixed(2));
        gHeroImg.setAttribute('width', (size * 1.4).toFixed(2));
        gHeroImg.setAttribute('height', (size * 1.4).toFixed(2));
        gHero.appendChild(gHeroImg);

        gUpright.appendChild(gBoss);


        let gRoundsText = document.createElementNS(svg.namespaceURI, 'g');
        gRoundsText.classList.add('ct-layer-rounds');
        gUpright.appendChild(gRoundsText);

        let roundsLabelText = `${data.GameData.dcModel.startRules.round}/${data.GameData.dcModel.startRules.endRound}`
        if (data.GameData.dcModel.startRules.endRound == -1) {
            roundsLabelText = `${data.GameData.dcModel.startRules.round}/${20 + (data.GameData.bossData.TierCount * 20)}+`
        }

        let roundsLabel = document.createElementNS(svg.namespaceURI, 'text');
        roundsLabel.classList.add('font-gardenia', 'ct-tile-label');
        roundsLabel.setAttribute('x', t.x.toFixed(2));
        roundsLabel.setAttribute('y', (t.y - size * 0.3).toFixed(2)); //(t.y + size * 0.6
        roundsLabel.setAttribute('text-anchor', 'middle');
        roundsLabel.setAttribute('font-size', Math.max(10, size * 0.4));
        roundsLabel.setAttribute('fill', '#FFF');
        roundsLabel.setAttribute('paint-order', 'stroke');
        roundsLabel.setAttribute('stroke', '#111');
        roundsLabel.setAttribute('stroke-width', '2');
        roundsLabel.textContent = roundsLabelText;
        gRoundsText.appendChild(roundsLabel);



        const gText = document.createElementNS(svg.namespaceURI, 'g');
        gText.classList.add('ct-layer-text');
        gUpright.appendChild(gText);

            const label = document.createElementNS(svg.namespaceURI, 'text');
            label.classList.add('font-gardenia', 'ct-tile-label');
            label.setAttribute('x', t.x.toFixed(2));
            label.setAttribute('y', (t.y + 20).toFixed(2));
            // label.setAttribute('y', (t.y - 8).toFixed(2));
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', Math.max(10, size * 0.6));
            label.setAttribute('fill', '#FFF');
            label.setAttribute('paint-order', 'stroke');
            label.setAttribute('stroke', '#111');
            label.setAttribute('stroke-width', '2');
            label.textContent = t.id;
            gText.appendChild(label);

        // tileIndex.set(t.id, {
        //     gTile, gUpright, gBg, gRelic, gBanner, gText,
        //     cx: t.x, cy: t.y, clipId, hexS
        // });
        tileIndex.set(t.id, {
            gTile, gUpright, gBg, gRelic, gBanner, gText,
            cx: t.x, cy: t.y, clipId, hexS, polygon, gMapFill, gDecor, gBoss, gGameMode, gHero, gRoundsText
        });
    }
    console.log(heroesSet);

    for (const s of spawns) {
        const hexS = size - gap;
        const pts = hexPoints(s.x, s.y, hexS);
        const ptsStr = pts.map(p => p.join(',')).join(' ');
        const ring = document.createElementNS(svg.namespaceURI, 'polygon');
        ring.setAttribute('points', ptsStr);
        ring.setAttribute('cx', s.x);
        ring.setAttribute('cy', s.y);
        ring.setAttribute('r', (size - gap) * 0.75);
        ring.setAttribute('fill', teamColors[s.team] ?? '#fff');
        ring.setAttribute('stroke', 'white');
        ring.setAttribute('stroke-width', '3');
        const title = document.createElementNS(svg.namespaceURI, 'title');
        title.textContent = `Spawn: ${s.team}`;
        ring.appendChild(title);
        gSpawns.appendChild(ring);

        ring.addEventListener('click', () => {
            console.log('Clicked spawn for team', s.team);
            const dx = s.x - cx;
            const dy = s.y - cy;
            const baseAngle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360; // 0=right, CCW+, screen coords
            const targetDeg = (90 - baseAngle + 360) % 360; // 90° is down in SVG (y increases downward)
            rotateCTTo(container, targetDeg);
        });
    }

    container._ct = { rotationDeg, cx, cy, gRot, size, gap, tileIndex };
}

function rotateCT(container, deltaDeg) {
    const st = container?._ct;
    if (!st) return;
    const newDeg = ((renderSettings.selectedTeamRotation + deltaDeg) % 360 + 360) % 360;
    renderSettings.selectedTeamRotation = newDeg;

    st.gRot.setAttribute('transform', `rotate(${newDeg} ${st.cx} ${st.cy})`);

    container.querySelectorAll('.ct-upright').forEach(g => {
        g.setAttribute('transform', `rotate(${-newDeg} ${parseFloat(g.dataset.cx)} ${parseFloat(g.dataset.cy)})`);
    });
}

//currently unused
function rotateCTTo(container, targetDeg) {
    const st = container?._ct;
    if (!st) return;
    rotateCT(container, targetDeg - renderSettings.selectedTeamRotation);
}

function applyCTFilter(container, tileData) {
    const st = container?._ct;
    if (!st) return;

    const filterKey = renderSettings.filter;
    const term = (renderSettings.searchTerm || '').trim().toUpperCase();
    for (const entry of st.tileIndex.values()) {
        let tileId = entry.clipId.replace('tile-', '');
        const matchesSearch = term ? tileId.includes(term) : true;
        const data = tileData.tiles[tileId];
        let isVisible = false;
        if (matchesSearch) {
            if (filterKey === 'none') {
                isVisible = true;
            } else {
                isVisible = matchesCTFilter(filterKey, data);
            }
        } else {
            isVisible = false;
        }

        if (isVisible) {
            const { start: tStart, end: tEnd } = getTileRoundRange(data);
            const intersects = tEnd <= renderSettings.roundFilterEnd && tStart >= renderSettings.roundFilterStart;
            if (!intersects) isVisible = false;
        }

        if (isVisible && renderSettings.heroFilter !== 'NoFilter') {
            const heroes = Object.keys(simplifyTowerData(data.GameData.dcModel).heroes);
            if (renderSettings.heroFilter === 'NoHeroes') {
                if (heroes.length !== 0) isVisible = false;
            } else {
                if (!heroes.filter(h => h !== 'ChosenPrimaryHero').includes(renderSettings.heroFilter)) isVisible = false;
            }
        }

        if (isVisible) {
            entry.gTile.style.filter = '';
            entry.gTile.style.opacity = '1';
        } else {
            entry.gTile.style.filter = 'grayscale(60%) brightness(0.55)';
            entry.gTile.style.opacity = '0.6';
        }
    }

    document.getElementById('map-filter-active-div').style.visibility = filterKey !== 'none' || term ? 'visible' : 'hidden';
}

function matchesCTFilter(filterKey, data) {
    if (!data) return false;
    switch (filterKey) {
        case 'none':
        case 'search':
            return true;
        case 'banner':
            return data.TileType === 'Banner';
        case 'relic':
            return data.RelicType !== 'None';
        case 'race': {
            return data.GameData.subGameType == 2;
        }
        case 'leastCash': {
            return data.GameData.subGameType == 8;
        }
        case 'leastTiers': {
            return data.GameData.subGameType == 9;
        }
        case 'boss': {
            return data.GameData.subGameType == 4;
        }
        default:
            return false;
    }
}

function updateCTBackground(container, tileData) {
    const st = container?._ct;
    if (!st) return;

    const bg = renderSettings.backgroundType;

    for (const [tileId, entry] of st.tileIndex.entries()) {
        const data = tileData.tiles[tileId];
        if (!data) continue;

        let fillColor = '#444';
        entry.gMapFill.style.display = 'none';
        entry.gDecor.style.display = 'none';
        switch(bg) {
            case 'default':
                fillColor = '#B9E546';
                entry.gDecor.style.display = 'block';
                break;
            case 'tileType': 
                switch (data.TileType) {
                    case 'Relic': fillColor = '#D621E7'; break;
                    case 'Banner': fillColor = '#1855A5'; break;
                    case 'Regular': fillColor = '#B9E546'; break;
                    case 'TeamFirstCapture': fillColor = '#B9E546'; break;
                    default: fillColor = '#888888'; break;
                }
                break;
            case 'gameType':
                switch (data.GameData?.subGameType) {
                    case 2:  fillColor = '#E12900'; break;
                    case 4:  fillColor = '#9F00FF'; break;
                    case 8:  fillColor = '#FFCC00'; break;
                    case 9:  fillColor = '#35DA00'; break;
                    default: fillColor = '#5c6b73'; break;
                }
                break;
            case 'mapIcon':
                entry.gMapFill.style.display = 'block';
                break;
            case 'nearestTeam':
                fillColor = teamColors[tileId.charAt(0)] ?? '#888';
                break;
            default:
                continue;
        }

        entry.polygon.setAttribute('fill', fillColor);
    }
}

function updateCTRenderLayers(container) {
    const st = container?._ct;
    if (!st) return;

    for (const entry of st.tileIndex.values()) {
        entry.gBg.style.display = renderSettings.renderLayers.bg ? 'block' : 'none';
        entry.gRelic.style.display = renderSettings.renderLayers.relic ? 'block' : 'none';
        entry.gBanner.style.display = renderSettings.renderLayers.banner ? 'block' : 'none';
        entry.gText.style.display = renderSettings.showIds ? 'block' : 'none';
        entry.gDecor.style.display = renderSettings.renderLayers.decor ? 'block' : 'none';
        entry.gMapFill.style.display = renderSettings.backgroundType == "mapIcon" ? 'block' : 'none';
        entry.gBoss.style.display = renderSettings.renderLayers.boss ? 'block' : 'none';
        entry.gGameMode.style.display = renderSettings.renderLayers.gameMode ? 'block' : 'none';
        entry.gHero.style.display = renderSettings.renderLayers.hero ? 'block' : 'none';
        entry.gRoundsText.style.display = renderSettings.renderLayers.rounds ? 'block' : 'none';
    }
}

function openCTSettingsModal(){
    const container = createEl('div', {
        style: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }
    });

    const modalHeader = createEl('div', { classList: ['d-flex', 'jc-between'], style: {backgroundColor: 'var(--profile-primary)', padding: '8px 16px', borderRadius: '8px'} });
    container.appendChild(modalHeader);
    
    // const headerLeft = createEl('div', { classList: [''] });
    // modalHeader.appendChild(headerLeft);

    const modalTitle = createEl('p', {
        classList: ['collection-modal-header-text', 'black-outline'],
        innerHTML: 'CT Map Settings'
    });
    modalHeader.appendChild(modalTitle);

    let presetLayersDiv = createEl('div', { classList: ['d-flex', 'jc-between', 'f-wrap', 'fd-column'], style: { gap: '12px', display: !renderSettings.advancedLayers ? 'flex' : 'none' } });
    let advancedLayerDiv = createEl('div', { classList: ['d-flex', 'jc-between', 'f-wrap', 'fd-column'], style: { gap: '12px', display: renderSettings.advancedLayers ? 'flex' : 'none' } });
    let advancedFiltersDiv = createEl('div', { classList: ['d-flex', 'fd-column'], style: { gap: '8px' } });

    function rebuildAdvancedToggles() {
        advancedLayerDiv.innerHTML = '';
        
        let layerOptions = {
            decor: {
                label: "Tile Decorations",
                icon: "CTRegularTileIconSmall"
            },
            banner: {
                label: "Banner Icons",
                icon: "CTPointsBanner",
            },
            relic: {
                label: "Relic Icons",
                icon: "DefaultRelicIcon",
            },
            gameMode: {
                label: "Game Mode Icons",
                icon: "EventRaceBtn",
            },
            hero: {
                label: "Hero Icons",
                icon: "AllHeroesIcon",
            },
            boss: {
                label: "Small Boss Icons",
                icon: "BossTiersIconSmall",
            },
            rounds: {
                label: "Rounds Labels",
                icon: "StartRoundIconSmall",
            }
        }

        for (let [key, data] of Object.entries(layerOptions)) {
            let toggleDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-between'] });

            let toggle = generateToggle(renderSettings.renderLayers[key], (checked) => {
                renderSettings.renderLayers[key] = checked;
                updateCTRenderLayers(debugGlobalCTMap);
            });
            let iconNameDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
            toggleDiv.appendChild(iconNameDiv);

            let iconImg = createEl('img', {
                classList: ['white-outline'],
                src: `./Assets/UI/${data.icon}.png`,
                style: { width: '32px', height: '32px', marginRight: '8px' }
            });
            iconNameDiv.appendChild(iconImg);
            
            let toggleLabel = createEl('p', {
                classList: ['black-outline'],
                style: { fontSize: '24px' },
                innerHTML: data.label
            });
            iconNameDiv.appendChild(toggleLabel);
            toggleDiv.appendChild(toggle);
            advancedLayerDiv.appendChild(toggleDiv);
        }

        let bottomDiv = createEl('div', { classList: ['d-flex', 'fd-column'], style: { } });
        advancedLayerDiv.appendChild(bottomDiv);

        bottomDiv.appendChild(createEl('p', {
            classList: ['black-outline'],
            style: { fontSize: '20px' },
            innerHTML: 'Background Fill'
        }));

        let bgOptionsDiv = createEl('div', { classList: ['d-flex'], style: { gap: '8px', marginTop: '12px' } });
        bottomDiv.appendChild(bgOptionsDiv);

        let bgOptions = {
            'default': { label: 'Default', icon: 'BGDefault' },
            'tileType': { label: 'Tile Type', icon: 'BGTileType' },
            'mapIcon': { label: 'Map Icon', icon: 'BGMapIcon' },
            'nearestTeam': { label: 'Nearest', icon: 'BGNearestTeam' },
        }

        for (let [key, data] of Object.entries(bgOptions)) {
            let bgOptionDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'fd-column', 'pos-rel', 'pointer'], style: {  } });
            bgOptionsDiv.appendChild(bgOptionDiv);

            let bgImg = createEl('img', {
                classList: ['white-outline'],
                src: `./Assets/CTMap/${data.icon}.png`,
                style: { width: '75px', height: '75px' }
            });
            bgOptionDiv.appendChild(bgImg);

            let bgLabel = createEl('p', {
                classList: ['font-luckiest', 'black-outline', 'd-flex', 'ai-center', 'pointer'],
                style: {fontSize: '18px', paddingTop: "4px", color: (renderSettings.backgroundType == key) ? '#4BFF00' : 'white' },
                innerHTML: data.label
            });
            bgOptionDiv.appendChild(bgLabel);

            let bgSelectedImg = createEl('img', {
                classList: ['bg-selection-checkmark'],
                src: `./Assets/UI/SelectedTick.png`,
                style: { width: '32px', height: '32px', position: 'absolute', top: '0px', right: '0px', display: (renderSettings.backgroundType == key) ? 'block' : 'none' }
            });
            bgOptionDiv.appendChild(bgSelectedImg);

            bgOptionDiv.addEventListener('click', () => {
                renderSettings.backgroundType = key;
                updateCTBackground(debugGlobalCTMap, selectedCTData);
                bgOptionsDiv.querySelectorAll('.bg-selection-checkmark').forEach(img => {
                    img.style.display = 'none';
                });
                bgOptionsDiv.querySelectorAll('p').forEach(label => {
                    label.style.color = 'white';
                });
                bgLabel.style.color = '#4BFF00';
                bgSelectedImg.style.display = 'block';
            });
        }
    }

    let modalAdvancedDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'pointer'], style: {} });
    modalHeader.appendChild(modalAdvancedDiv);

    let modalAdvancedLabel = createEl('p', {
        classList: ['black-outline'],
        style: { fontSize: '24px' },
        innerHTML: 'Advanced Mode'
    })
    modalAdvancedDiv.appendChild(modalAdvancedLabel);

    let modalAdvancedToggle = generateToggle(renderSettings.advancedLayers, (checked) => {
        renderSettings.advancedLayers = checked;
        renderSettings.selectedPreset = null;
        if (checked) {
            presetLayersDiv.style.display = 'none';
            advancedLayerDiv.style.display = 'flex';
            advancedFiltersDiv.style.display = 'flex';
            rebuildAdvancedToggles();
        } else {
            presetLayersDiv.style.display = 'flex';
            advancedLayerDiv.style.display = 'none';
            advancedFiltersDiv.style.display = 'none';
            renderSettings.roundFilterStart = 1;
            renderSettings.roundFilterEnd = 100;
            renderSettings.heroFilter = 'NoFilter';
            applyCTFilter(debugGlobalCTMap, selectedCTData);
        }
    });
    modalAdvancedDiv.appendChild(modalAdvancedToggle);

    let mainContainer = createEl('div', { classList: ['d-flex', 'jc-evenly', 'f-wrap'], style: { gap: '24px' } });
    container.appendChild(mainContainer);

    let leftDiv = createEl('div', { classList: ['d-flex', 'f-wrap', 'fd-column'], style: { gap: '12px', width: '350px' } });
    mainContainer.appendChild(leftDiv);

    leftDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-header', 'black-outline'],
        innerHTML: 'Filter Tiles'
    }));

    let filterOptions = {
        "none": {
            label: "No Filter",
            icon: "/UI/StrikethroughRound",
        },
        "banner": {
            label: "Banner Tiles",
            icon: "/UI/CTPointsBanner",
        },
        "relic": {  
            label: "Relic Tiles",
            icon: "/UI/DefaultRelicIcon",
        },
        "leastCash": {
            label: "Least Cash Tiles",
            icon: "/UI/LeastCashIconSmall",
        },
        "leastTiers": {
            label: "Least Tiers Tiles",
            icon: "/UI/LeastTiersIconSmall",
        },
        "race": {
            label: "Race Tiles",
            icon: "/UI/StopWatch",
        },
        "boss": {
            label: "Boss Tiles",
            icon: "/BossIcon/BloonariusPortrait",
        }
    }

    let filterRadioButtonsDiv = createEl('div', { classList: ['d-flex', 'fd-column', 'jc-evenly', 'fg-1'], style: { gap: '8px' } });
    leftDiv.appendChild(filterRadioButtonsDiv);

    for (let [key, data] of Object.entries(filterOptions)) {
        let filterRadioButtonDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-between', 'pointer'], style: { width: '320px' } });
        filterRadioButtonsDiv.appendChild(filterRadioButtonDiv);

        let iconAndLabelDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
        filterRadioButtonDiv.appendChild(iconAndLabelDiv);

        let icon = createEl('img', {
            classList: ['white-outline'],
            src: `./Assets/${data.icon}.png`,
            style: { width: '32px', height: '32px', marginRight: '8px' }
        });
        iconAndLabelDiv.appendChild(icon);

        let label = createEl('label', {
            classList: ['font-luckiest', 'black-outline', 'd-flex', 'ai-center', 'pointer'],
            style: { color: "white", fontSize: '24px', gap: '8px' },
            innerHTML: data.label
        });
        iconAndLabelDiv.appendChild(label);

        let radioBtn = createEl('img', {
            classList: ['pointer', 'filter-radio-button'],
            src: (renderSettings.filter == key) ? "./Assets/UI/BlueBtnCircleSmall.png" : "./Assets/UI/PagePipOff.png",
            style: { width: '36px', height: '36px' },
            value: key,
            checked: renderSettings.filter === key,
        });
        filterRadioButtonDiv.appendChild(radioBtn);

        filterRadioButtonDiv.addEventListener('click', () => {
            document.querySelectorAll('.filter-radio-button').forEach(rb => {
                rb.src = "./Assets/UI/PagePipOff.png";
            });
            radioBtn.src = "./Assets/UI/BlueBtnCircleSmall.png";
            renderSettings.filter = key;
            applyCTFilter(debugGlobalCTMap, selectedCTData);
            document.getElementById('top-bar-filter-icon').src = `./Assets/${data.icon}.png`;
        });
    }

    // let advancedFiltersDiv = createEl('div', { classList: ['d-flex', 'fd-column'], style: { gap: '8px' } });
    advancedFiltersDiv.style.display = renderSettings.advancedLayers ? 'flex' : 'none';
    leftDiv.appendChild(advancedFiltersDiv);

    let roundFiltersDiv = createEl('div', { classList: ['d-flex', 'fd-column'], style: { gap: '8px', marginTop: '12px' } });
    advancedFiltersDiv.appendChild(roundFiltersDiv);

    roundFiltersDiv.appendChild(createEl('p', {
        classList: ['black-outline'],
        style: { fontSize: '20px' },
        innerHTML: 'Advanced Filters'
    }));

    let startRoundDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
    roundFiltersDiv.appendChild(startRoundDiv);

    let startRoundIcon = createEl('img', {
        classList: ['of-contain'],
        src: './Assets/UI/StartRoundIconSmall.png',
        style: { width: '40px', height: '40px', marginRight: '4px' }
    });
    startRoundDiv.appendChild(startRoundIcon);

    let startRoundInput = generateNumberInput("Rounds", renderSettings.roundFilterStart, 1, 100, 1, (val) => {
        renderSettings.roundFilterStart = val;
        if (renderSettings.roundFilterStart > renderSettings.roundFilterEnd) {
            renderSettings.roundFilterEnd = renderSettings.roundFilterStart;
        }
        applyCTFilter(debugGlobalCTMap, selectedCTData);
    });
    startRoundInput.style.flexGrow = '1';
    startRoundDiv.appendChild(startRoundInput);

    let endRoundInput = generateNumberInput("", renderSettings.roundFilterEnd, 1, 100, 1, (val) => {
        renderSettings.roundFilterEnd = val;
        if (renderSettings.roundFilterEnd < renderSettings.roundFilterStart) {
            renderSettings.roundFilterStart = renderSettings.roundFilterEnd;
        }
        applyCTFilter(debugGlobalCTMap, selectedCTData);
    });
    endRoundInput.style.flexGrow = '1';
    startRoundDiv.appendChild(endRoundInput);

    let heroFilterDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
    advancedFiltersDiv.appendChild(heroFilterDiv);

    let heroFilterIcon = createEl('img', {
        classList: ['of-contain'],
        style: { width: '40px', height: '40px', marginRight: '4px' }
    });
    heroFilterDiv.appendChild(heroFilterIcon);

    function updateHeroFilterIcon(selected) {
        switch(selected) {
            case "NoFilter":
                heroFilterIcon.src = './Assets/UI/StrikethroughRound.png';
                break;
            case "NoHeroes":
                heroFilterIcon.src = './Assets/UI/NoHeroSelected.png';
                break;
            default:
                heroFilterIcon.src = `./Assets/HeroIconCircle/HeroIcon${selected}.png`;
                break;
        }
    }
    updateHeroFilterIcon(renderSettings.heroFilter);

    let horriblePractice = {
        "NoFilter": "No Filter",
        "NoHeroes": "No Heroes",
        "StrikerJones": "Striker Jones",
        "AdmiralBrickell": "Admiral Brickell",
        "CaptainChurchill": "Captain Churchill",
        "PatFusty": "Pat Fusty",
        "ObynGreenfoot": "Obyn Greenfoot",
    }

    let heroFilterDropdown = generateDropdown("Hero Filter:", ["No Filter", "No Heroes", ...Object.keys(constants.heroesInOrder).map((id) => { return getLocValue(id)})], horriblePractice[renderSettings.heroFilter] || renderSettings.heroFilter, (selected) => {
        renderSettings.heroFilter = selected.replaceAll(' ', '');
        updateHeroFilterIcon(renderSettings.heroFilter);
        applyCTFilter(debugGlobalCTMap, selectedCTData);
    });
    heroFilterDropdown.querySelector('.dropdown-label').style.minWidth = '110px';
    heroFilterDiv.appendChild(heroFilterDropdown);

    let rightDiv = createEl('div', { classList: ['d-flex', 'f-wrap', 'fd-column'], style: { gap: '12px', width: '350px' } });
    mainContainer.appendChild(rightDiv);

    rightDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-header', 'black-outline'],
        innerHTML: 'Display Options'
    }));

    rightDiv.appendChild(advancedLayerDiv);
    rightDiv.appendChild(presetLayersDiv);

    rebuildAdvancedToggles();

    let presetsDiv = createEl('div', { classList: ['d-flex', 'fd-column'], style: { } });
    presetLayersDiv.appendChild(presetsDiv);

     presetsDiv.appendChild(createEl('p', {
        classList: ['black-outline'],
        style: { fontSize: '20px' },
        innerHTML: 'Layout Presets'
    }));

    let presetOptionsDiv = createEl('div', { classList: ['d-flex', 'f-wrap', 'jc-between'], style: { width: '330px', gap: '8px', marginTop: '12px' } });
    presetsDiv.appendChild(presetOptionsDiv);

    for (let [key, data] of Object.entries(renderPresets)) {
        let bgOptionDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'fd-column', 'pos-rel', 'pointer'], style: {  } });
        presetOptionsDiv.appendChild(bgOptionDiv);

        let bgImg = createEl('img', {
            classList: ['white-outline'],
            src: data.icon,
            style: { width: '150px', height: '150px' }
        });
        bgOptionDiv.appendChild(bgImg);

        let bgLabel = createEl('p', {
            classList: ['font-luckiest', 'black-outline', 'd-flex', 'ai-center', 'pointer'],
            style: {fontSize: '18px', paddingTop: "4px", color: (renderSettings.selectedPreset == key) ? '#4BFF00' : 'white' },
            innerHTML: data.label
        });
        bgOptionDiv.appendChild(bgLabel);

        let bgSelectedImg = createEl('img', {
            classList: ['bg-selection-checkmark'],
            src: `./Assets/UI/SelectedTick.png`,
            style: { width: '40px', height: '40px', position: 'absolute', top: '2px', right: '4px', display: (renderSettings.selectedPreset == key) ? 'block' : 'none' }
        });
        bgOptionDiv.appendChild(bgSelectedImg);

        bgOptionDiv.addEventListener('click', () => {
            console.log(data);
            renderSettings.backgroundType = data.settings.backgroundType;
            renderSettings.renderLayers = { ...data.settings.renderLayers };

            console.log(renderSettings)

            updateCTBackground(debugGlobalCTMap, selectedCTData);
            updateCTRenderLayers(debugGlobalCTMap);

            presetOptionsDiv.querySelectorAll('.bg-selection-checkmark').forEach(img => {
                img.style.display = 'none';
            });
            presetOptionsDiv.querySelectorAll('p').forEach(label => {
                label.style.color = 'white';
            });
            bgLabel.style.color = '#4BFF00';
            bgSelectedImg.style.display = 'block';
            renderSettings.selectedPreset = key;
        });
    }

    const footer = createEl('div', { classList: ['d-flex', 'jc-center'], style: { marginTop: '8px', gap: '10px' } });
    const closeBtn = createEl('div', {
        classList: ['maps-progress-view', 'black-outline', 'pointer'],
        innerHTML: 'Apply',
        style: { padding: '6px 14px', filter: "hue-rotate(270deg)" }
    });

    closeBtn.addEventListener('click', () => {
        closeModal && closeModal();
        goBack();
    });
    footer.appendChild(closeBtn);
    container.appendChild(footer);

    createModal({
        // header: 'Map View Settings',
        content: container
    });

    return container;
}

function simplifyTowerData(rawTileData) {
    let simplified = { towers: {}, heroes: {} };
    for (let data of rawTileData.towers._items) {
        if (data.max != 0) {
            if(data.isHero) {
                simplified.heroes[data.tower] = data.max;
            } else {
                simplified.towers[data.tower] = data.max;
            }
        }
    };
    return simplified;
}

function getTileRoundRange(data) {
    if (!data?.GameData?.dcModel?.startRules) return { start: 0, end: 0 };
    const start = data.GameData.dcModel.startRules.round;
    let end = data.GameData.dcModel.startRules.endRound;
    if (end === -1) {
        const tierCount = data.GameData?.bossData?.TierCount ?? 0;
        end = 20 + tierCount * 20;
    }
    return { start, end };
}