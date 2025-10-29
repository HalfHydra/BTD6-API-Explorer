let teamColors = {
    "A": "#9C55E4",
    "B": "#E978AA",
    "C": "#00DD6B",
    "D": "#04A6F3",
    "E": "#F7D302",
    "F": "#F4413F",
    "M": "#B9E546"
}

let renderSettings = {
    filter: "none",
    showTileLabels: false,
}

async function openCTEventDetails(source, eventData) {
    let eventDates = `${new Date(eventData.start).toLocaleDateString()} - ${new Date(eventData.end).toLocaleDateString()}`;
    let data = await getCTTiles(eventData.tiles)
    if (data == null) { return; }
    document.getElementById(`${source}-content`).style.display = "none";
    let relicsContent = document.getElementById('relics-content');
    relicsContent.style.display = "flex";
    relicsContent.innerHTML = "";

    addToBackQueue({ "source": source, "destination": "relics" });

    let relicContainer = createEl('div', { classList: ['relic-container', 'ct-panel'], style: { borderRadius: "20px 20px 10px 10px"} });
    resetScroll();

    await getExternalCTData(eventData.id);

    let isEventActive = new Date() >= new Date(eventData.start) && new Date() <= new Date(eventData.end);


    let relicHeader = createEl('div', { classList: ['ct-border', 'fd-column'] });
    relicsContent.appendChild(relicHeader);

    relicsContent.appendChild(relicContainer);

    let relicHeaderTop = createEl('div', { classList: ['d-flex', 'jc-center', 'w-100'] });
    relicHeader.appendChild(relicHeaderTop);

    // let relicHeaderViews = createEl('div', { classList: ['relic-header-views'] });
    // relicHeaderTop.appendChild(relicHeaderViews);

    // let relicDetailView = createEl('div', { classList: ['maps-progress-view', 'black-outline', 'stats-tab-yellow'], innerHTML: "List" });
    // relicHeaderViews.appendChild(relicDetailView);

    // let relicTileView = createEl('div', { classList: ['maps-progress-view', 'black-outline'], innerHTML: "Tile" });
    // relicHeaderViews.appendChild(relicTileView);

    // relicDetailView.addEventListener('click', () => {
    //     relicDetailView.classList.add('stats-tab-yellow');
    //     relicTileView.classList.remove('stats-tab-yellow');
    //     document.querySelectorAll('.relic-text-div').forEach(element => {
    //         if (element.classList.contains('relic-tile-view')) {
    //             element.classList.remove('relic-tile-view');
    //         }
    //     })
    // })

    // relicTileView.addEventListener('click', () => {
    //     relicTileView.classList.add('stats-tab-yellow');
    //     relicDetailView.classList.remove('stats-tab-yellow');
    //     document.querySelectorAll('.relic-text-div').forEach(element => {
    //         if (!element.classList.contains('relic-tile-view')) {
    //             element.classList.add('relic-tile-view');
    //         }
    //     })
    // })

    let relicHeaderTopDiv = createEl('div', { classList: ['d-flex', 'jc-between'], style: { padding: "0px 10px", width: "800px"} });
    relicHeaderTop.appendChild(relicHeaderTopDiv);

    let relicHeaderTitle = createEl('p', { classList: ['relic-header-title', 'black-outline'], innerHTML: `Contested Territory ${CTSeedToEventNumber ? "#" + CTSeedToEventNumber[eventData.id] : ''}` });
    relicHeaderTopDiv.appendChild(relicHeaderTitle);

    let relicHeaderDates = createEl('p', { classList: ['relic-header-title', 'black-outline'], innerHTML: `${eventDates}` });
    relicHeaderTopDiv.appendChild(relicHeaderDates);

    // let relicHeaderRight = createEl('div', { classList: ['relic-header-right'] });
    // relicHeaderTop.appendChild(relicHeaderRight);

    // let modalClose = createEl('img', { classList: ['modal-close'], src: "./Assets/UI/CloseBtn.png" });
    // modalClose.addEventListener('click', () => {
    //     relicsContent.style.display = "none";
    //     document.getElementById(`${source}-content`).style.display = "flex";
    // })
    // relicHeaderRight.appendChild(modalClose);

    let topBar = createEl('div', { classList: ['d-flex', 'jc-evenly', 'w-100'], style: {marginTop: "10px"} });
    relicHeader.appendChild(topBar);

    let divStyle = { width: "260px" }

    let newTicketsDiv = createEl('div', { classList: ['d-flex', 'ai-center'], style: divStyle });
    topBar.appendChild(newTicketsDiv);

    let tileSearchDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-center'], style: divStyle });
    topBar.appendChild(tileSearchDiv);

    let viewMapDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-end'], style: divStyle });
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

    if (new Date(eventData.start) < new Date() && new Date() < new Date(eventData.end)) {
        let timeUntilNextTickets = new Date(new Date().setHours(new Date(eventData.start).getHours(), new Date(eventData.start).getMinutes(), 0, 0)) > new Date() ? new Date(new Date().setHours(new Date(eventData.start).getHours(), new Date(eventData.start).getMinutes(), 0, 0)) : new Date(new Date().setHours(new Date(eventData.start).getHours() + 24, new Date(eventData.start).getMinutes(), 0, 0));
        registerTimer(ticketsTimer.id, timeUntilNextTickets);
    } else if (new Date() > new Date(eventData.end)) {
        ticketsTimer.innerHTML = "Event Ended";
    } else {
        ticketsTimer.innerHTML = "Not Started";
    }

    let tileSearchIcon = createEl('img', { classList: [], style: iconStyle, src: "./Assets/UI/CTRegularTileIconSmall.png" });
    tileSearchDiv.appendChild(tileSearchIcon);

    let rogueHeaderCenter = document.createElement('div');
    rogueHeaderCenter.classList.add('pos-rel');
    tileSearchDiv.appendChild(rogueHeaderCenter);

    let rogueArtifactSearch = createEl('input', { classList: ['search-box', 'font-gardenia', 'rogue-search'], style: { width: '100px', paddingRight: '40px' }, placeholder: "Tile Search",});

    let selectorGoImg = createEl('img', {classList: ['pointer'], style: { width: '38px', height: '38px', top: '2px', right: "0px", filter: "grayscale(100%)", position: 'absolute', objectFit: 'contain' }, src: '../Assets/UI/GoBtnSmall.png' });
    selectorGoImg.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(externalCTData[eventData.id].tiles[rogueArtifactSearch.value]);
        // if not found do errorModal
    });
    rogueHeaderCenter.appendChild(selectorGoImg);

    rogueArtifactSearch.addEventListener('input', () => {
        rogueArtifactSearch.value = rogueArtifactSearch.value.toUpperCase();
        rogueArtifactSearch.value = rogueArtifactSearch.value.replace(/[^A-HMRX0-9]/g, '');
        // if the length is greater than 3, trim it to 3
        if (rogueArtifactSearch.value.length > 3) {
            rogueArtifactSearch.value = rogueArtifactSearch.value.substring(0, 3);
        } else if (rogueArtifactSearch.value.length === 3) {
            selectorGoImg.style.filter = "none";
        } else {
            selectorGoImg.style.filter = "grayscale(100%)";
        }
    })

    rogueHeaderCenter.appendChild(rogueArtifactSearch);

    // let selectorGoImg = createEl('img', {classList: [], style: { width: '40px', height: '40px', objectFit: 'contain' }, src: '../Assets/UI/GoBtnSmall.png' });
    // selectorGoImg.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     console.log(externalCTData[eventData.id].tiles[rogueArtifactSearch.value]);
    //     // if not found do errorModal
    // });
    // tileSearchDiv.appendChild(selectorGoImg);



    let viewMapIcon = createEl('img', { classList: [], style: iconStyle, src: "./Assets/UI/CTTotalTilesIcon.png" });
    viewMapDiv.appendChild(viewMapIcon);
    
    let viewMapButton = generateButton("View CT Map", {width: "180px", borderWidth: "10px", fontSize: "22px", }, () => {
        // scrollToElementById('ct-main-div');
    });
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

        let eventRelicAvailableText = createEl('p', { id: `relic-unlock-${index}`, classList: ['black-outline'], style: {fontSize: '20px'} });
        if (new Date() <= unlockTime && isEventActive) {
            eventRelicAvailableText.innerHTML = `${unlockTime.toLocaleDateString()}`;
        } else if (isEventActive) {
            eventRelicAvailableText.innerHTML = `Unlocked`;
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
            let powerActiveTime = new Date(new Date(eventData.start).getTime() + (index + 1) * 24 * 60 * 60 * 1000);
            let powerDate = createEl('p', {classList: ['black-outline', 'ta-center'], style: {fontSize: '18px'}, innerHTML: `${powerActiveTime.toLocaleDateString()}` });
            powerDiv.appendChild(powerDate);

            if (new Date() < powerActiveTime) {
                powerDiv.style.filter = "grayscale(100%)";
            }
        }

        //drop-shadow(0px 0px 20px white);
    });

    relics.forEach(relic => {
        let relicTypeName = relic.type;

        let relicDiv = createEl('div', { classList: ['relic-div'], style: { backgroundColor: teamColors[relic.id.charAt(0)] } });
        relicsDiv.appendChild(relicDiv);

        let relicID = createEl('p', { classList: ['relic-id'], innerHTML: relic.id });
        relicDiv.appendChild(relicID);

        let relicIcon = createEl('img', { classList: ['relic-icon'], src: `./Assets/RelicIcon/${relicTypeName}.png` });
        relicDiv.appendChild(relicIcon);

        // let relicTextDiv = createEl('div', { classList: ['relic-text-div'] });
        // relicDiv.appendChild(relicTextDiv);

        // let relicName = createEl('p', { classList: ['relic-name', 'black-outline'], innerHTML: getLocValue(`Relic${relicTypeName}`) });
        // relicTextDiv.appendChild(relicName);

        // let relicDescription = createEl('p', { classList: ['relic-description'], innerHTML: getLocValue(`Relic${relicTypeName}Description`) });
        // relicTextDiv.appendChild(relicDescription);

        //<p class="artifact-title">${artifactData.title}</p>${artifactData.description}
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

        // let relicTextDiv = createEl('div', { classList: ['relic-text-div'] });
        // relicDiv.appendChild(relicTextDiv);

        // let relicName = createEl('p', { classList: ['relic-name', 'black-outline'], innerHTML: getLocValue(`Relic${relicTypeName}`) });
        // relicTextDiv.appendChild(relicName);

        // let relicDescription = createEl('p', { classList: ['relic-description'], innerHTML: getLocValue(`Relic${relicTypeName}Description`) });
        // relicTextDiv.appendChild(relicDescription);

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

    // relicsContent.innerHTML = "";

    // const ct = buildCTGrid();

    // let ctMainDiv = createEl('div', { id: 'ct-main-div', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' } });
    // relicsContent.appendChild(ctMainDiv);

    // const controls = createEl('div', { classList: ['ct-rotate-controls'], style: { display: 'flex', gap: '8px', margin: '8px 0' } });

    // const btnLeft = createEl('button', { textContent: '⟲ 60°' });
    // const btnRight =createEl('button', { textContent: '60° ⟳' });
    // controls.appendChild(btnLeft);
    // controls.appendChild(btnRight);
    // ctMainDiv.appendChild(controls);

    // let ctMapDiv = createEl('div', { id: 'ct-map-div', style: { width: '100%' } });
    // ctMainDiv.appendChild(ctMapDiv);

    // console.log(eventData);

    // renderCTMap(ctMapDiv, ct, await getExternalCTData(eventData.id), { size: 28 });

    // btnLeft.addEventListener('click', () => rotateCT(ctMapDiv, -60));
    // btnRight.addEventListener('click', () => rotateCT(ctMapDiv, +60));
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
    const rotationDeg = opts.rotationDeg ?? -90;

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

        const clipId = `clip-${t.id}`;
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
            gRelicImg.setAttribute('x', (t.x - size * 0.7).toFixed(2));
            gRelicImg.setAttribute('y', (t.y - size * 0.7).toFixed(2));
            gRelicImg.setAttribute('width', (size * 1.4).toFixed(2));
            gRelicImg.setAttribute('height', (size * 1.4).toFixed(2));
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

        const gText = document.createElementNS(svg.namespaceURI, 'g');
        gText.classList.add('ct-layer-text');
        gUpright.appendChild(gText);

        if (renderSettings.showTileLabels) {
            const label = document.createElementNS(svg.namespaceURI, 'text');
            label.classList.add('font-gardenia');
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
        }

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
    }

    container._ct = { rotationDeg, cx, cy, gRot, size, gap, tileIndex };
}

function rotateCT(container, deltaDeg) {
    const st = container?._ct;
    if (!st) return;
    st.rotationDeg = ((st.rotationDeg + deltaDeg) % 360 + 360) % 360;

    st.gRot.setAttribute('transform', `rotate(${st.rotationDeg} ${st.cx} ${st.cy})`);

    container.querySelectorAll('.ct-upright').forEach(g => {
        g.setAttribute('transform', `rotate(${-st.rotationDeg} ${parseFloat(g.dataset.cx)} ${parseFloat(g.dataset.cy)})`);
    });
}

function rotateCTTo(container, targetDeg) {
    const st = container?._ct;
    if (!st) return;
    rotateCT(container, targetDeg - st.rotationDeg);
}