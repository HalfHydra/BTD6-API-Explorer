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

async function openRelics(source, eventData) {
    let eventDates = `${new Date(eventData.start).toLocaleDateString()} - ${new Date(eventData.end).toLocaleDateString()}`;
    let data = await getCTTiles(eventData.tiles)
    if (data == null) { return; }
    document.getElementById(`${source}-content`).style.display = "none";
    let relicsContent = document.getElementById('relics-content');
    relicsContent.style.display = "flex";
    relicsContent.innerHTML = "";

    addToBackQueue({ "source": source, "destination": "relics" });

    let relicContainer = createEl('div', { classList: ['relic-container'] });
    relicsContent.appendChild(relicContainer);
    resetScroll();

    let relicHeader = createEl('div', { classList: ['relic-header'] });
    relicContainer.appendChild(relicHeader);

    let relicHeaderViews = createEl('div', { classList: ['relic-header-views'] });
    relicHeader.appendChild(relicHeaderViews);

    let relicDetailView = createEl('div', { classList: ['maps-progress-view', 'black-outline', 'stats-tab-yellow'], innerHTML: "List" });
    relicHeaderViews.appendChild(relicDetailView);

    let relicTileView = createEl('div', { classList: ['maps-progress-view', 'black-outline'], innerHTML: "Tile" });
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

    let relicHeaderTitle = createEl('p', { classList: ['relic-header-title', 'black-outline'], innerHTML: `Contested Territory<br>${eventDates}` });
    relicHeader.appendChild(relicHeaderTitle);

    let relicHeaderRight = createEl('div', { classList: ['relic-header-right'] });
    relicHeader.appendChild(relicHeaderRight);

    let modalClose = createEl('img', { classList: ['modal-close'], src: "./Assets/UI/CloseBtn.png" });
    modalClose.addEventListener('click', () => {
        relicsContent.style.display = "none";
        document.getElementById(`${source}-content`).style.display = "flex";
    })
    relicHeaderRight.appendChild(modalClose);

    let relics = data.tiles.filter(tile => tile.type.includes("Relic"))
    relics = relics.sort((a, b) => a.id.localeCompare(b.id))
    relics = relics.map(relic => {
        relic.type = relic.type.split(" ")[2];
        return relic
    });

    let relicsDiv = createEl('div', { classList: ['relics-div'] });
    relicContainer.appendChild(relicsDiv);

    relics.forEach(relic => {
        let relicTypeName = relic.type;

        let relicDiv = createEl('div', { classList: ['relic-div'], style: { backgroundColor: teamColors[relic.id.charAt(0)] } });
        relicsDiv.appendChild(relicDiv);

        let relicID = createEl('p', { classList: ['relic-id'], innerHTML: relic.id });
        relicDiv.appendChild(relicID);

        let relicIcon = createEl('img', { classList: ['relic-icon'], src: `./Assets/RelicIcon/${relicTypeName}.png` });
        relicDiv.appendChild(relicIcon);

        let relicTextDiv = createEl('div', { classList: ['relic-text-div'] });
        relicDiv.appendChild(relicTextDiv);

        let relicName = createEl('p', { classList: ['relic-name', 'black-outline'], innerHTML: getLocValue(`Relic${relicTypeName}`) });
        relicTextDiv.appendChild(relicName);

        let relicDescription = createEl('p', { classList: ['relic-description'], innerHTML: getLocValue(`Relic${relicTypeName}Description`) });
        relicTextDiv.appendChild(relicDescription);
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

        let relicTextDiv = createEl('div', { classList: ['relic-text-div'] });
        relicDiv.appendChild(relicTextDiv);

        let relicName = createEl('p', { classList: ['relic-name', 'black-outline'], innerHTML: getLocValue(`Relic${relicTypeName}`) });
        relicTextDiv.appendChild(relicName);

        let relicDescription = createEl('p', { classList: ['relic-description'], innerHTML: getLocValue(`Relic${relicTypeName}Description`) });
        relicTextDiv.appendChild(relicDescription);
    });

    relicsContent.innerHTML = "";

    const ct = buildCTGrid();

    let ctMainDiv = createEl('div', { id: 'ct-main-div', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' } });
    relicsContent.appendChild(ctMainDiv);

    const controls = createEl('div', { classList: ['ct-rotate-controls'], style: { display: 'flex', gap: '8px', margin: '8px 0' } });

    const btnLeft = createEl('button', { textContent: '⟲ 60°' });
    const btnRight =createEl('button', { textContent: '60° ⟳' });
    controls.appendChild(btnLeft);
    controls.appendChild(btnRight);
    ctMainDiv.appendChild(controls);

    let ctMapDiv = createEl('div', { id: 'ct-map-div', style: { width: '100%' } });
    ctMainDiv.appendChild(ctMapDiv);

    console.log(eventData);

    renderCTMap(ctMapDiv, ct, await getExternalCTData(eventData.id), { size: 28 });

    btnLeft.addEventListener('click', () => rotateCT(ctMapDiv, -60));
    btnRight.addEventListener('click', () => rotateCT(ctMapDiv, +60));
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