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

let renderSettings = {
    filter: "none", //banner, relic, race, leastCash, leastTiers, boss
    showTileLabels: false,
    backgroundType: "decor", //decor, tileType, mapIcon, nearestTeam
    selectedTeamRotation: -90, //-90 default 
    searchTerm: "",
}

async function openCTEventDetails(source, eventData) {
    let eventDates = `${new Date(eventData.start).toLocaleDateString()} - ${new Date(eventData.end).toLocaleDateString()}`;
    let data = await getCTTiles(eventData.tiles)
    if (data == null) { return; }
    document.getElementById(`${source}-content`).style.display = "none";
    let relicsContent = document.getElementById('relics-content');
    relicsContent.style.display = "flex";
    relicsContent.innerHTML = "";

    let now = new Date();

    addToBackQueue({ "source": source, "destination": "relics" });

    let relicContainer = createEl('div', { classList: ['relic-container', 'ct-panel'], style: { borderRadius: "20px 20px 10px 10px"} });
    resetScroll();

    await getExternalCTData(eventData.id);

    let isEventActive = now >= new Date(eventData.start) && now <= new Date(eventData.end);


    let relicHeader = createEl('div', { classList: ['ct-border', 'fd-column'] });
    relicsContent.appendChild(relicHeader);

    relicsContent.appendChild(relicContainer);

    let relicHeaderTop = createEl('div', { classList: ['d-flex', 'jc-center', 'w-100'] });
    relicHeader.appendChild(relicHeaderTop);

    let relicHeaderTopDiv = createEl('div', { classList: ['d-flex', 'jc-between'], style: { padding: "0px 10px", width: "800px"} });
    relicHeaderTop.appendChild(relicHeaderTopDiv);

    let relicHeaderTitle = createEl('p', { classList: ['relic-header-title', 'black-outline'], innerHTML: `Contested Territory ${CTSeedToEventNumber ? "#" + CTSeedToEventNumber[eventData.id] : ''}` });
    relicHeaderTopDiv.appendChild(relicHeaderTitle);

    let relicHeaderDates = createEl('p', { classList: ['relic-header-title', 'black-outline'], innerHTML: `${eventDates}` });
    relicHeaderTopDiv.appendChild(relicHeaderDates);

    let topBar = createEl('div', { classList: ['d-flex', 'jc-evenly', 'w-100'], style: {marginTop: "10px"} });
    relicHeader.appendChild(topBar);

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

    if (new Date(eventData.start) < now && now < new Date(eventData.end)) {
        let timeUntilNextTickets = new Date(new Date().setHours(new Date(eventData.start).getHours(), new Date(eventData.start).getMinutes(), 0, 0)) > now ? new Date(new Date().setHours(new Date(eventData.start).getHours(), new Date(eventData.start).getMinutes(), 0, 0)) : new Date(new Date().setHours(new Date(eventData.start).getHours() + 24, new Date(eventData.start).getMinutes(), 0, 0));
        registerTimer(ticketsTimer.id, timeUntilNextTickets);
    } else if (now > new Date(eventData.end)) {
        ticketsTimer.innerHTML = "Event Ended";
    } else {
        ticketsTimer.innerHTML = "Not Started";
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
        1, //after 1 day
        3, //after 3 days
        5, //after 5 days
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
            eventRelicAvailableText.innerHTML = `${unlockTime.toLocaleDateString()}`;
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
            let dayMs = 24 * 60 * 60 * 1000;
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

    let ctMapDiv = createEl('div', { id: 'ct-map-div', style: { width: '100%' } });

    let topBar = createEl('div', { classList: ['d-flex', 'jc-between', 'ai-center', 'ct-border'], style: {} });
    mapContent.appendChild(topBar);

    let basicFilterDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'f-wrap'] });
    topBar.appendChild(basicFilterDiv);

    let filters = {
        // "none": "StrikethroughRound",
        "banner": "/UI/CTPointsBanner",
        "relic": "/UI/DefaultRelicIcon",
        "leastCash": "/UI/LeastCashIconSmall",
        "leastTiers": "/UI/LeastTiersIconSmall",
        "race": "/UI/StopWatch",
        "boss": "/BossIcon/BloonariusPortrait",
    }

    for (let [filterKey, filterIcon] of Object.entries(filters)) {
        let filterBtn = createEl('img', { classList: ['pointer'], style: { width: '40px', height: '40px', objectFit: 'contain', backgroundImage: 'url("../Assets/UI/StatsTabBlue.png")', backgroundSize: 'contain', padding: '8px', filter: renderSettings.filter === filterKey ? "drop-shadow(0 0 10px #fff)" : "none" }, src: `./Assets/${filterIcon}.png` });
        filterBtn.addEventListener('click', () => {
            if (renderSettings.filter === filterKey) {
                renderSettings.filter = "none";
                filterBtn.style.backgroundImage = 'url("../Assets/UI/StatsTabBlue.png")'
                if (ctMapDiv) applyCTFilter(ctMapDiv, tileData);
                return;
            }

            renderSettings.filter = filterKey;
            switch(filterKey) {
                case "none":
                    break;
                case "banner":
                    break;
                case "relic":
                    break;
                case "race":
                    break;
                case "leastCash":
                    break;
                case "leastTiers":
                    break;
                case "boss":
                    break;
            }
            basicFilterDiv.querySelectorAll('img').forEach(img => img.style.backgroundImage = 'url("../Assets/UI/StatsTabBlue.png")');
            filterBtn.style.backgroundImage = 'url("../Assets/UI/StatsTabYellow.png")'
            if (ctMapDiv) applyCTFilter(ctMapDiv, tileData);
        });
        basicFilterDiv.appendChild(filterBtn);
    }

    let centerDiv = createEl('div', { classList: ['pos-rel'], style: {padding: "20px"} });
    topBar.appendChild(centerDiv);

    let tileSearch = createEl('input', { classList: ['search-box', 'font-gardenia', 'rogue-search'], style: { width: '100px', paddingRight: '40px' }, placeholder: "Tile Search",});

    let searchIcon = createEl('img', { classList: ['search-icon'], src: '../Assets/UI/SearchIcon.png', style: {right: "28px"} });
    centerDiv.appendChild(searchIcon);

    tileSearch.addEventListener('input', () => {
        tileSearch.value = tileSearch.value.toUpperCase();
        tileSearch.value = tileSearch.value.replace(/[^A-HMRX0-9]/g, '');
        if (tileSearch.value.length > 3) {
            tileSearch.value = tileSearch.value.substring(0, 3);
        }
        renderSettings.searchTerm = tileSearch.value;
        applyCTFilter(ctMapDiv, tileData);
    })

    centerDiv.appendChild(tileSearch);


    let rightDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
    topBar.appendChild(rightDiv);

    let tileLabelsDiv = createEl('div', { classList: ['d-flex', 'ai-center'], style: {fontSize: '24px'}});
    rightDiv.appendChild(tileLabelsDiv);

    let tileLabelsLabel = createEl('p', { classList: ['black-outline'], innerHTML: 'IDs' });
    tileLabelsDiv.appendChild(tileLabelsLabel);

    let showTileLabelsBtn = generateToggle(renderSettings.showTileLabels, (checked) => {
        renderSettings.showTileLabels = checked;
        ctMapDiv.querySelectorAll('.ct-tile-label').forEach(t => {
            t.style.display = renderSettings.showTileLabels ? 'block' : 'none';
        });
    });
    tileLabelsDiv.appendChild(showTileLabelsBtn);

    let teamSelectionToggle = generateDropdown("My Team:", ["Purple", "Pink", "Green", "Blue", "Yellow", "Red"], "Purple", (selected) => {
        const teamAngles = {
            "Purple": -90,
            "Pink": -30,
            "Green": 30,
            "Blue": 90,
            "Yellow": 150,
            "Red": -150,
        }
        renderSettings.selectedTeamRotation = teamAngles[selected];
        rotateCTTo(ctMapDiv, renderSettings.selectedTeamRotation);
    });
    teamSelectionToggle.querySelector('.dropdown-label').style.minWidth = '110px';
    rightDiv.appendChild(teamSelectionToggle);

    let displaySettingsBtn = createEl('img', {
        classList: ['roundset-settings-btn', 'pointer'],
        style: {
            width: '50px',
            height: '50px',
        },
        src: '../Assets/UI/SettingsBtn.png',
    });
    displaySettingsBtn.addEventListener('click', () => {
        
    })
    rightDiv.appendChild(displaySettingsBtn);

    const ct = buildCTGrid();

    let ctMainDiv = createEl('div', { id: 'ct-main-div', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' } });
    mapContent.appendChild(ctMainDiv);
    ctMainDiv.appendChild(ctMapDiv);

    renderCTMap(ctMapDiv, ct, tileData, { size: 28 });
    applyCTFilter(ctMapDiv, tileData);
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
    for (const t of tiles) {
        let data = tileData.tiles[t.id];
        console.log(data);
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
        // polygon.setAttribute('fill', teamColors[t.id.charAt(0)] ?? '#888');
        polygon.setAttribute('fill', '#B9E546');
        // polygon.setAttribute('fill', '#444');
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

        let gTileDecor = document.createElementNS(svg.namespaceURI, 'image');
        gTileDecor.setAttribute('href', `./Assets/CTMap/${constants.mapsInOrder[data.GameData.selectedMap].theme}.png`);
        gTileDecor.setAttribute('x', (t.x - size).toFixed(2));
        gTileDecor.setAttribute('y', (t.y - size).toFixed(2));
        gTileDecor.setAttribute('width', (size * 2).toFixed(2));
        gTileDecor.setAttribute('height', (size * 2).toFixed(2));
        gBg.appendChild(gTileDecor);

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
        gUpright.appendChild(gBoss);

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
            if (!renderSettings.showTileLabels) {
                label.style.display = 'none';
            }
            gText.appendChild(label);

        tileIndex.set(t.id, {
            gTile, gUpright, gBg, gRelic, gBanner, gText,
            cx: t.x, cy: t.y, clipId, hexS
        });
    }

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
        let isVisible = false;
        if (matchesSearch) {
            if (filterKey === 'none') {
                isVisible = true;
            } else {
                const data = tileData.tiles[tileId];
                isVisible = matchesCTFilter(filterKey, data);
            }
        } else {
            isVisible = false;
        }

        if (isVisible) {
            entry.gTile.style.filter = '';
            entry.gTile.style.opacity = '1';
        } else {
            entry.gTile.style.filter = 'grayscale(60%) brightness(0.55)';
            entry.gTile.style.opacity = '0.6';
        }
    }
}

function matchesCTFilter(filterKey, data) {
    if (!data) return false;
    switch (filterKey) {
        case 'none':
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