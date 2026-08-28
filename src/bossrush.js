let currentBossRushResult = null;
let showAllTowers = false;

const WATER_MAPS = new Set(['Peninsula', 'SpiceIslands']);
const WATER_TOWERS = new Set(['MonkeySub', 'MonkeyBuccaneer']);

class CompatPrng {
    constructor(seed) {
        this._seedArray = null;
        this._inext = 0;
        this._inextp = 0;
        this.ensureInitialized(seed);
    }
    ensureInitialized(seed) { if (this._seedArray === null) this.initialize(seed); }
    initialize(seed) {
        const seedArray = new Array(56);
        const INT_MIN = -2147483648, INT_MAX = 2147483647;
        let subtraction = seed === INT_MIN ? INT_MAX : Math.abs(seed);
        let mj = 161803398 - subtraction;
        if (mj < 0) mj += INT_MAX;
        seedArray[55] = mj;
        let mk = 1, ii = 0;
        for (let i = 1; i < 55; i++) {
            ii += 21;
            if (ii >= 55) ii -= 55;
            seedArray[ii] = mk;
            mk = mj - mk;
            if (mk < 0) mk += INT_MAX;
            mj = seedArray[ii];
        }
        for (let k = 1; k < 5; k++) {
            for (let i = 1; i < 56; i++) {
                let n = i + 30;
                if (n >= 55) n -= 55;
                seedArray[i] -= seedArray[1 + n];
                if (seedArray[i] < 0) seedArray[i] += INT_MAX;
            }
        }
        this._seedArray = seedArray;
        this._inext = 0;
        this._inextp = 21;
    }
    internalSample() {
        const INT_MAX = 2147483647;
        const seedArray = this._seedArray;
        let locINext = this._inext + 1;
        if (locINext >= 56) locINext = 1;
        let locINextp = this._inextp + 1;
        if (locINextp >= 56) locINextp = 1;
        let retVal = seedArray[locINext] - seedArray[locINextp];
        if (retVal === INT_MAX) retVal--;
        if (retVal < 0) retVal += INT_MAX;
        seedArray[locINext] = retVal;
        this._inext = locINext;
        this._inextp = locINextp;
        return retVal;
    }
    sample() { return this.internalSample() * (1.0 / 2147483647); }
}

class DotNetRandomCompatSeed {
    constructor(seed) { this._prng = new CompatPrng(seed | 0); }
    nextDouble() { return this._prng.sample(); }
    next(min, max) {
        if (max === undefined) { max = min; min = 0; }
        if (max <= min) return min;
        const range = max - min;
        return Math.min(Math.trunc(this._prng.sample() * range) + min, max - 1);
    }
}

function convertBossRushSeed(seedstr) {
    seedstr = seedstr.toLowerCase().split('').reverse().join('');
    let accumulator = 0;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let counter = 0; counter < seedstr.length; counter++) {
        const char = seedstr[counter];
        const ind = chars.indexOf(char);
        if (ind === -1) throw new Error(`Invalid character in seed string: ${char}`);
        accumulator += ind * (36 ** counter);
    }
    while (accumulator > 0x7fffffff) accumulator = Math.floor(accumulator / 10);
    return accumulator;
}

function reservoirPick(rng, values, fallback = null) {
    let result = fallback, n = 0;
    for (const v of values) {
        n++;
        const roll = rng.next(n);
        if (roll === 0) result = v;
    }
    return result;
}

function weightedIndex(rng, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const roll = rng.nextDouble() * total;
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (roll <= cumulative) return i;
    }
    throw new Error('weightedIndex: no index selected');
}

function weightedItem(rng, items, getWeight) {
    if (items.length === 0) return null;
    const weighted = items.map(i => [i, getWeight(i)]);
    const total = weighted.reduce((a, [, w]) => a + w, 0);
    if (total <= 0) return null;
    const roll = rng.nextDouble() * total;
    let cumulative = 0, fallback = null;
    for (const [item, weight] of weighted) {
        fallback = item;
        cumulative += weight;
        if (roll <= cumulative) return item;
    }
    return fallback;
}

function weightedFromMap(rng, map) {
    let total = 0;
    for (const w of map.values()) total += w;
    const roll = rng.nextDouble() * total;
    let cumulative = 0, fallback = null;
    for (const [item, weight] of map) {
        fallback = item;
        cumulative += weight;
        if (roll <= cumulative) return item;
    }
    return fallback;
}

function rollDifficulty(rng, stage, invalid) {
    const DIFFICULTY_NAMES = { 0: 'Beginner', 1: 'Intermediate', 2: 'Advanced', 3: 'Expert' };
    let chances = constants.bossRush.RandomSettings.MapDifficultyChances;
    let row = stage < chances.length ? chances[stage] : chances[chances.length - 1];
    let weights = [0, 1, 2, 3].map(d => invalid.has(d) ? 0 : Number(row[DIFFICULTY_NAMES[d]] ?? 0));
    return weightedIndex(rng, weights);
}

function generateMaps(rng, count) {
    const DIFFICULTY_BY_NAME = { Beginner: 0, Intermediate: 1, Advanced: 2, Expert: 3 };
    let banned = new Set(constants.bossRush.RandomSettings.BannedMaps ?? []);
    let selected = [];
    const bossRushGameMaps = Object.entries(constants.mapsInOrder).filter(([, m]) => m.difficulty in DIFFICULTY_BY_NAME).map(([id, m]) => ({ mapId: id, difficulty: DIFFICULTY_BY_NAME[m.difficulty], hasWater: !!m.hasWater, isStandard: true }));
    while (selected.length < count) {
        let candidates = [], previous = null;
        let invalid = new Set();
        for (let attempt = 0; attempt < 100 && candidates.length === 0; attempt++) {
            if (previous !== null) invalid.add(previous);
            let difficulty = rollDifficulty(rng, selected.length, invalid);
            previous = difficulty;
            candidates = bossRushGameMaps.filter(m => m.isStandard && m.difficulty === difficulty && !banned.has(m.mapId) && !selected.includes(m));
        }
        if (candidates.length === 0) throw new Error('generateMaps: no candidate found');
        selected.push(candidates[rng.next(candidates.length)]);
    }
    return selected;
}

function generateBossesBR(rng, count) {
    let available = constants.bossRush.RandomSettings.AvailableBosses ?? [];
    let generated = [], pool = [...available];
    while (generated.length < count) {
        if (pool.length === 0) {
            pool = [...available];
            let lastIndex = pool.indexOf(generated[generated.length - 1]);
            if (lastIndex !== -1) pool.splice(lastIndex, 1);
        }
        let selected = reservoirPick(rng, pool);
        if (selected === null) throw new Error('generateBossesBR: empty pool');
        pool.splice(pool.indexOf(selected), 1);
        generated.push(selected);
    }
    return generated;
}

function readCategoryLists(entry) {
    let read = k => (entry[k] ?? []).map(String);
    return [read('Primary'), read('Military'), read('Magic'), read('Support'), read('AllTowers')];
}

function getBossSpecialTowers(rng, boss, chances) {
    let raw = constants.bossRush.RandomSettings.BossSpecialTowers[boss] ?? [];
    if (raw.length === 0) return [];
    let entries = raw.map(readCategoryLists);
    let validIds = new Set(chances.keys());
    let result = [];
    let usedPrimary = false, usedMilitary = false, usedMagic = false, usedSupport = false;
    for (let current of entries) {
        let overlaps = result.some(s => current[0].includes(s) || current[1].includes(s) || current[2].includes(s) || current[3].includes(s));
        let lists = overlaps ? entries[0] : current;
        let pool = [];
        if (!usedPrimary) pool.push(...lists[0]);
        if (!usedMilitary) pool.push(...lists[1]);
        if (!usedMagic) pool.push(...lists[2]);
        if (!usedSupport) pool.push(...lists[3]);
        pool.push(...lists[4]);
        let chosenSoFar = new Set(result);
        let candidates = pool.filter(id => !chosenSoFar.has(id) && validIds.has(id));
        let selected = weightedItem(rng, candidates, id => chances.get(id) ?? 0);
        if (selected === null) continue;
        result.push(selected);
        usedPrimary = lists[0].includes(selected);
        usedMilitary = lists[1].includes(selected);
        usedMagic = lists[2].includes(selected);
        usedSupport = lists[3].includes(selected);
    }
    return result;
}

function isValidTowerSet(towers, towerSettings, mapId) {
    if (towers.length < 3) return false;
    let hasLead = towers.some(id => towerSettings[id]?.canPopLead);
    let hasCamo = towers.some(id => towerSettings[id]?.canPopCamo);
    let cheapCount = towers.filter(id => towerSettings[id]?.isCheapTower).length;
    if (!hasLead || !hasCamo || cheapCount <= 1) return false;
    if (WATER_MAPS.has(mapId)) return towers.some(id => WATER_TOWERS.has(id));
    return true;
}

function pickHero(rng) {
    const HERO_IDS = Object.keys(constants.heroesInOrder);
    let override = constants.bossRush.Overrides?.Hero ?? null;
    if (override) return override === "ChosenPrimaryHero" ? "ChosenPrimaryHero" : (HERO_IDS.includes(override) ? override : null);
    let banned = new Set(constants.bossRush.RandomSettings.BannedHeroes ?? []);
    let candidates = [];
    if (!banned.has("ChosenPrimaryHero")) candidates.push("ChosenPrimaryHero");
    candidates.push(...HERO_IDS.filter(h => !banned.has(h)));
    return weightedItem(rng, candidates, h => constants.bossRush.RandomSettings.HeroChances[h] ?? 0);
}

function generateStageTowers(rng, boss, map, nextStageTowers) {
    const TOWER_IDS = Object.keys(constants.towersInOrder);
    let towerSettings = constants.bossRush.RandomSettings.TowerSettings;
    let chances = new Map(Object.keys(towerSettings).map(id => [id, towerSettings[id]?.chance ?? 0]));
    let bossTowers = getBossSpecialTowers(rng, boss, chances);
    let banned = new Set(constants.bossRush.RandomSettings.BannedTowers ?? []);
    let available = TOWER_IDS.filter(id => !banned.has(id) && (chances.get(id) ?? 0) > 0);
    let proposed = [];

    if (nextStageTowers !== null) {
        proposed.push(...nextStageTowers);
        let target = nextStageTowers.length + constants.bossRush.RandomSettings.StageTowerIncrement;
        let bossCandidates = TOWER_IDS.filter(id =>
            bossTowers.includes(id) && !proposed.includes(id) && (chances.get(id) ?? 0) > 0
        );
        if (bossCandidates.length > 0) {
            let sel = weightedItem(rng, bossCandidates, id => chances.get(id) ?? 0);
            if (sel !== null) proposed.push(sel);
        }
        while (proposed.length < target) {
            let candidates = available.filter(id => !proposed.includes(id));
            let sel = weightedItem(rng, candidates, id => chances.get(id) ?? 0);
            if (sel === null) break;
            proposed.push(sel);
        }
        return proposed;
    }

    let availableSet = new Set(available);
    let baseTowerSet = constants.bossRush.Overrides?.BaseTowerSet ?? null;
    proposed.push(...(baseTowerSet ?? []).map(String).filter(id => id && availableSet.has(id)));
    if (proposed.length === 0) proposed.push(...TOWER_IDS.filter(id => bossTowers.includes(id)));

    if (proposed.length === 0) {
        let leadCandidates = available.filter(id => towerSettings[id]?.canPopLead);
        let camoCandidates = available.filter(id => towerSettings[id]?.canPopCamo);
        let lead = weightedItem(rng, leadCandidates, id => chances.get(id) ?? 0);
        if (lead !== null) proposed.push(lead);
        if (lead === null || !camoCandidates.includes(lead)) {
            let camo = weightedItem(rng, camoCandidates, id => chances.get(id) ?? 0);
            if (camo !== null && !proposed.includes(camo)) proposed.push(camo);
        }
    }

    if (WATER_MAPS.has(map.mapId) && !proposed.some(id => WATER_TOWERS.has(id))) {
        let waterCandidates = available.filter(id => WATER_TOWERS.has(id));
        let water = weightedItem(rng, waterCandidates, id => chances.get(id) ?? 0);
        if (water !== null) proposed.push(water);
    }

    while (proposed.length < constants.bossRush.RandomSettings.FinalStageTowerCount) {
        let candidates = available.filter(id => !proposed.includes(id));
        let sel = weightedItem(rng, candidates, id => chances.get(id) ?? 0);
        if (sel === null) break;
        proposed.push(sel);
    }

    let hero = pickHero(rng);
    if (hero !== null) proposed.unshift(hero);
    return proposed;
}

function generateTowers(rng, stageCount, maps, bosses) {
    let lastMap = maps[stageCount - 1];
    let lastBoss = bosses[stageCount - 1];
    let final = null;
    for (let attempt = 0; attempt < 100; attempt++) {
        let candidate = generateStageTowers(rng, lastBoss, lastMap, null);
        if (isValidTowerSet(candidate, constants.bossRush.RandomSettings.TowerSettings, lastMap.mapId)) {
            final = candidate;
            break;
        }
    }
    if (!final) throw new Error('generateTowers: no valid final tower set after 100 attempts');
    let generated = [final];
    for (let i = stageCount - 2; i >= 0; i--) {
        generated.unshift(generateStageTowers(rng, bosses[i], maps[i], generated[0]));
    }
    return generated;
}

function generateRelics(rng, stageCount, relicOrder) {
    let banned = new Set(constants.bossRush.RandomSettings.BannedRelics ?? []);
    let available = new Map(relicOrder.filter(r => !banned.has(r)).map(r => [r, Number(constants.bossRush.RandomSettings.RelicChances[r] ?? 0)]));
    let generated = [];
    while (generated.length < stageCount) {
        let stageRelics = generated.length > 0 ? [...generated[generated.length - 1]] : [];
        let total = 0;
        for (let w of available.values()) total += w;
        if (total > 0) {
            let selected = weightedFromMap(rng, available);
            if (selected !== null) { available.delete(selected); stageRelics.push(selected); }
        }
        generated.push(stageRelics);
    }
    return generated;
}

function generateBossRush(seed) {
    let numericSeed = convertBossRushSeed(seed);
    let stageCount = constants.bossRush.StageScores.length;
    let rng = new DotNetRandomCompatSeed(numericSeed);

    let maps = generateMaps(rng, stageCount);
    let bosses = generateBossesBR(rng, stageCount);
    let towers = generateTowers(rng, stageCount, maps, bosses);
    let relics = generateRelics(rng, stageCount, Object.keys(constants.bossRush.RandomSettings.RelicChances));

    let isHero = id => id === "ChosenPrimaryHero" || HERO_IDS.includes(id);
    let hero = towers[0].length > 0 && isHero(towers[0][0]) ? towers[0][0] : null;
    const towerDisplayIndex = new Map(Object.keys(constants.towersInOrder).map((t, i) => [t, i]));
    const byDisplayOrder = (a, b) => (towerDisplayIndex.get(a) ?? 99) - (towerDisplayIndex.get(b) ?? 99);
    let towersOnly = towers.map(s => (hero !== null ? s.slice(1) : [...s]).sort(byDisplayOrder));

    let stages = towersOnly.map((set, i) => {
        let previous = i > 0 ? new Set(towersOnly[i - 1]) : null;
        let current = new Set(set);
        return {
            stage: i + 1,
            map: maps[i].mapId,
            boss: bosses[i],
            towers: set,
            removed: previous ? [...previous].filter(x => !current.has(x)).sort(byDisplayOrder) : [],
            relics: relics[i],
            newRelic: i === 0 ? (relics[0][relics[0].length - 1] ?? null) : relics[i].length > relics[i - 1].length ? relics[i][relics[i].length - 1] : null,
        };
    });

    return { seed, numericSeed, hero, availableTowers: towersOnly[0], stages };
}

async function openBossRushDetails(eventData) {
    if (eventData == null) {
        if (latestEvents == null) {
            await getLatestEvents();
        }
        let now = new Date();
        let activeEvent = latestEvents.find(e => e.type === 'bossRush' && now >= new Date(e.start) && now < new Date(e.end));
        if (!activeEvent) {
            activeEvent = latestEvents.find(e => e.type === 'bossRush' && now < new Date(e.start));
        }
        eventData = activeEvent;
    }
    addToBackQueue({ callback: generateEvents });

    let bossRushContent = document.getElementById('events-content');
    bossRushContent.style.display = 'flex';
    bossRushContent.innerHTML = '';
    resetScroll();

    await fetchConstants();

    let bossRushEvents = latestEvents.filter(e => e.type === 'bossRush').sort((a, b) => b.start - a.start);

    let relicHeader = createEl('div', { classList: ['ct-border', 'fd-column', 'w-100', 'bs-box'], style: { maxWidth: '800px' } });
    bossRushContent.appendChild(relicHeader);

    let relicHeaderTop = createEl('div', { classList: ['d-flex', 'jc-between', 'w-100'] });
    relicHeader.appendChild(relicHeaderTop);

    let relicHeaderTopDiv = createEl('div', { classList: ['d-flex', 'jc-between', 'w-100'], style: { padding: '0px 10px' } });
    relicHeaderTop.appendChild(relicHeaderTopDiv);

    if (!eventData) {
        let notActiveDiv = createEl('div', { classList: ['d-flex', 'fd-column', 'ai-center'], style: { gap: '8px' } });
        relicHeader.appendChild(notActiveDiv);

        let noUpcomingLabel = createEl('p', {
            classList: ['relic-header-title', 'black-outline'],
            innerHTML: 'No Active or Upcoming Boss Rush Event Found.'
        });
        notActiveDiv.appendChild(noUpcomingLabel);

        let descriptionLabel = createEl('p', {
            classList: ['font-gardenia', 'lh-add-half'],
            innerHTML: 'Boss Rush occurs on weeks when Contested Territory is not active. The Open Data API sometimes breaks and new events don\'t show up until it is fixed. Past events still on the API will appear below.'
        });
        notActiveDiv.appendChild(descriptionLabel);

        let previousEventsTitle = createEl('p', {
            classList: ['relic-header-title', 'black-outline'],
            innerHTML: 'Previous Boss Rush Events'
        });
        notActiveDiv.appendChild(previousEventsTitle);

        let previousEventsDiv = createEl('div', { classList: ['d-flex', 'fd-column', 'w-100'], style: { maxWidth: "800px", gap: "12px" } });
        notActiveDiv.appendChild(previousEventsDiv);

        bossRushEvents.forEach(event => {
            let eventDiv = createEl('div', {
                classList: ['d-flex', 'jc-between', 'ai-center', 'pointer'],
                style: {
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                }
            });
            eventDiv.addEventListener('click', () => {
                openBossRushDetails(event);
            });
            previousEventsDiv.appendChild(eventDiv);

            let eventIcon = createEl('img', {
                classList: ['of-contain'],
                style: {
                    width: "70px",
                },
                src: `../Assets/UI/BossRushBtn.png`
            });
            eventDiv.appendChild(eventIcon);

            let eventNameId = createEl('p', {
                classList: ['black-outline'],
                style: {
                    fontSize: "20px",
                    width: "220px"
                },
                innerHTML: `Boss Rush (${event.id})`
            });
            eventDiv.appendChild(eventNameId);

            let eventDates = createEl('p', {
                classList: ['black-outline', 'ta-center'],
                style: {
                    width: "230px",
                    fontSize: "20px"
                },
                innerHTML: `${new Date(event.start).toLocaleString()}<br>${new Date(event.end).toLocaleString()}`
            })
            eventDiv.appendChild(eventDates);

            let goBtnImg = createEl('img', {
                src: "../Assets/UI/ContinueBtn.png",
                classList: ['of-contain'],
                style: {
                    width: "50px",
                    height: "50px",
                }
            });
            eventDiv.appendChild(goBtnImg);
        });

        if (bossRushEvents.length === 0) {
            let noPreviousLabel = createEl('p', {
                classList: ['black-outline'],
                style: { fontSize: "20px" },
                innerHTML: 'No previous events found.'
            });
            previousEventsDiv.appendChild(noPreviousLabel);
        }
        return;
    }

    let relicHeaderTitle = createEl('p', {
        classList: ['relic-header-title', 'black-outline'],
        innerHTML: `Boss Rush`
    });
    relicHeaderTopDiv.appendChild(relicHeaderTitle);

    let eventDates = `${new Date(eventData.start).toLocaleDateString()} - ${new Date(eventData.end).toLocaleDateString()}`;
    let relicHeaderDates = createEl('p', { classList: ['relic-header-title', 'black-outline'], innerHTML: `${eventDates}` });
    relicHeaderTopDiv.appendChild(relicHeaderDates);

    let options = bossRushEvents.map(e => `${e.id} (${new Date(e.start).toLocaleDateString()})`);

    let eventDropdown = generateDropdown('', options, `${eventData.id} (${new Date(eventData.start).toLocaleDateString()})`, (value) => {
        let selectedEvent = bossRushEvents.find(e => `${e.id} (${new Date(e.start).toLocaleDateString()})` === value);
        if (selectedEvent) {
            openBossRushDetails(selectedEvent);
        }
    });
    relicHeaderTopDiv.appendChild(eventDropdown);

    let relicHeaderBottomDiv = createEl('div', { classList: ['d-flex', 'jc-between', 'w-100'], style: { padding: '0px 10px' } });
    relicHeader.appendChild(relicHeaderBottomDiv);

    let newTicketsDiv = createEl('div', { classList: ['d-flex', 'ai-center'], style: { width: "260px" } });
    relicHeaderBottomDiv.appendChild(newTicketsDiv);

    let newTicketsIcon = createEl('img', { classList: ['d-flex'], style: { width: '50px', height: '50px', marginRight: '8px', objectFit: 'contain' }, src: "./Assets/UI/CtTicketsIcon.png" });
    newTicketsDiv.appendChild(newTicketsIcon);

    let newTicketsTextDiv = createEl('div', { classList: [] });
    newTicketsDiv.appendChild(newTicketsTextDiv);

    let nextTicketsLabel = createEl('p', { classList: ['black-outline'], innerHTML: `Slots Refresh in:` });
    newTicketsTextDiv.appendChild(nextTicketsLabel);

    let ticketsTimer = createEl('p', { classList: ['black-outline'], id: 'ct-tickets-timer', innerHTML: `--:--:--`, style: { fontSize: '28px' } });
    newTicketsTextDiv.appendChild(ticketsTimer);

    clearAllTimers();
    let now = new Date();
    let dayMs = 24 * 60 * 60 * 1000;
    if (now >= new Date(new Date(eventData.end).getTime() - dayMs) && now < eventData.end) {
        nextTicketsLabel.innerHTML = "Event Ends In:";
        registerTimer(ticketsTimer.id, eventData.end);
    } else if (new Date(eventData.start) < now && now < new Date(eventData.end)) {
        let timeUntilNextTickets = new Date(new Date().setHours(new Date(eventData.start).getHours(), new Date(eventData.start).getMinutes(), 0, 0)) > now ? new Date(new Date().setHours(new Date(eventData.start).getHours(), new Date(eventData.start).getMinutes(), 0, 0)) : new Date(new Date().setHours(new Date(eventData.start).getHours() + 24, new Date(eventData.start).getMinutes(), 0, 0));
        registerTimer(ticketsTimer.id, timeUntilNextTickets);
    } else if (now > new Date(eventData.end)) {
        ticketsTimer.innerHTML = "Event Ended";
        nextTicketsLabel.style.display = "none";
    } else {
        ticketsTimer.innerHTML = "Not Started";
        nextTicketsLabel.style.display = "none";
    }

    let result = generateBossRush(eventData.id);
    currentBossRushResult = result;

    let tileLabelsDiv = createEl('div', { classList: ['d-flex', 'ai-center'], style: { fontSize: '24px' } });
    relicHeaderBottomDiv.appendChild(tileLabelsDiv);

    let tileLabelsLabel = createEl('p', { classList: ['black-outline'], innerHTML: 'Show All Stage Towers' });
    tileLabelsDiv.appendChild(tileLabelsLabel);

    let showAllTowersToggle = generateToggle(showAllTowers, checked => {
        showAllTowers = checked;
        document.querySelectorAll('.relic-container').forEach(container => {
            container.querySelectorAll('.br-stage-towers').forEach(towersDiv => {
                towersDiv.style.display = showAllTowers ? 'grid' : 'none';
            });
            container.querySelectorAll('.br-all-towers').forEach(towersDiv => {
                towersDiv.style.display = showAllTowers ? 'none' : 'grid';
            });
        });
    });
    tileLabelsDiv.appendChild(showAllTowersToggle);

    let creditLabel = createEl('p', {
        classList: ['font-gardenia', 'lh-add-half', 'ta-center'],
        innerHTML: `Stage details available thanks to Lucy's implementation of the Boss Rush generator.`
    });
    relicHeader.appendChild(creditLabel);

    let stagePanels = [];

    let relicContainer = createEl('div', { classList: ['relic-container', 'ct-panel', 'd-flex', 'fd-column'], style: { maxWidth: "800px", borderRadius: '10px', gap: "12px" } });
    bossRushContent.appendChild(relicContainer);

    let towersListAllDiv = createEl('div', {
        classList: ['br-all-towers'],
        style: { margin: '0 18px', padding: '6px', borderRadius: '10px', backgroundColor: '#4B3B2F', display: showAllTowers ? 'none' : 'grid', gridTemplateColumns: "repeat(8, auto)" }
    });
    relicContainer.appendChild(towersListAllDiv);

    result.stages[0].towers.forEach(towerID => {
        let towerDiv = createEl('div', {
            classList: ['d-flex', 'ai-center', `tower-selector-${constants.towersInOrder.hasOwnProperty(towerID) ? constants.towersInOrder[towerID].category.toLowerCase() : 'hero'}`],
            style: { width: '90px', height: '108px' }
        });
        towersListAllDiv.appendChild(towerDiv);

        let towerImg = createEl('img', { classList: ['tower-selector-img'], src: getInstaContainerIcon(towerID, '000'), style: { width: '90px' } });
        towerDiv.appendChild(towerImg);
    });

    result.stages.forEach((stage, i) => {
        let stagePanel = createEl('div', {
            classList: ['d-flex', 'fd-column'],
            style: { width: "800px" }
        });
        stagePanels.push(stagePanel);
        relicContainer.appendChild(stagePanel);

        let mapAndBossDiv = createEl('div', {
            classList: ['d-flex', 'ai-center', 'jc-between', 'f-wrap'],
            style: { borderRadius: '10px', backgroundColor: '#5C4B3E', }
        });
        stagePanel.appendChild(mapAndBossDiv);

        let ctMapDiv = document.createElement('div');
        ctMapDiv.classList.add('race-map-div', 'silver-border');
        mapAndBossDiv.appendChild(ctMapDiv);

        let ctMapIcon = document.createElement('img');
        ctMapIcon.classList.add('race-map-img');
        ctMapIcon.src = getMapIcon(stage.map);
        ctMapDiv.appendChild(ctMapIcon);

        let ctMapRounds = createEl('p', {
            classList: ['black-outline', 'pos-abs'],
            style: {
                fontSize: '24px',
                top: '4px',
                left: '6px'
            },
            innerHTML: `Stage ${stage.stage}`
        });
        ctMapDiv.appendChild(ctMapRounds);

        let ctMapLabel = createEl('p', {
            classList: ['black-outline', 'pos-abs', 'w-100', 'ta-center'],
            style: {
                fontSize: '24px',
                bottom: '4px',
            },
            innerHTML: getLocValue(stage.map) || stage.map
        });
        ctMapDiv.appendChild(ctMapLabel);

        let bossMapBossIcon = document.createElement('img')
        bossMapBossIcon.classList.add("boss-map-boss-icon");
        bossMapBossIcon.src = `./Assets/BossIcon/${stage.boss}Portrait.png`
        ctMapDiv.appendChild(bossMapBossIcon);

        let towersListDiv = createEl('div', {
            classList: ['br-stage-towers'],
            style: { marginTop: '4px', padding: '8px', borderRadius: '10px', backgroundColor: '#4B3B2F', display: showAllTowers ? "grid " : "none", gridTemplateColumns: "repeat(8, auto)" }
        });
        stagePanel.appendChild(towersListDiv);

        stage.towers.forEach(towerID => {
            let towerDiv = createEl('div', {
                classList: ['d-flex', 'ai-center', `tower-selector-${constants.towersInOrder.hasOwnProperty(towerID) ? constants.towersInOrder[towerID].category.toLowerCase() : 'hero'}`],
                style: { width: '90px', height: '108px' }
            });
            towersListDiv.appendChild(towerDiv);

            let towerImg = createEl('img', { classList: ['tower-selector-img'], src: getInstaContainerIcon(towerID, '000'), style: { width: '90px' } });
            towerDiv.appendChild(towerImg);
        });

        let rightDiv = createEl('div', { classList: ['d-flex', 'fd-column', 'ai-center', 'fg-1'], style: { gap: '6px' } });
        mapAndBossDiv.appendChild(rightDiv);

        let topBar = createEl('div', { classList: ['d-flex', 'jc-center', 'ai-center', 'w-100'], style: { gap: '12px' } });
        rightDiv.appendChild(topBar);

        let barItems = {
            "/UI/BossRushKills": `${constants.bossRush.StageScores[i]} Kills Needed`,
            "/UI/CoinIcon": `${constants.bossRush.BalanceSettings.StartingCash[stage.boss]}`,
            "/UI/MaxMonkeysIcon": `${constants.bossRush.BalanceSettings.MaxTowerCount} Max Monkeys`
        }

        Object.entries(barItems).forEach(([icon, value]) => {
            let barItem = createEl('div', {
                classList: ['d-flex', 'ai-center', 'jc-center'],
                style: {
                    gap: "8px"
                },
            });
            topBar.appendChild(barItem);

            let barItemIcon = createEl('img', {
                classList: ['of-contain'],
                style: {
                    width: "36px",
                    height: "36px"
                },
                src: `../Assets${icon}.png`
            });
            barItem.appendChild(barItemIcon);

            let barItemText = createEl('p', {
                classList: ['black-outline'],
                style: {
                    fontSize: "20px",
                },
                innerHTML: value
            });
            barItem.appendChild(barItemText);
        });

        let bottomBar = createEl('div', { classList: ['d-flex', 'jc-between', 'ai-start', 'w-100'], style: { gap: '6px' } });
        rightDiv.appendChild(bottomBar);

        let relicsDiv = createEl('div', {
            classList: ['d-flex', 'ai-center', 'f-wrap'],
            style: { marginTop: '12px', marginLeft: "8px", borderRadius: '10px', backgroundColor: '#4B3B2F' }
        });
        bottomBar.appendChild(relicsDiv);

        stage.relics.forEach(relicTypeName => {
            let isNew = relicTypeName === stage.newRelic;
            let relicDiv = createEl('div', {
                classList: ['relic-div', 'pos-rel'],
                style: {
                    backgroundColor: isNew ? '#7C3C9C' : '#5C3B2F',
                    outline: isNew ? '4px solid gold' : '4px solid rgba(255,255,255,0.25)',
                    outlineOffset: '-4px',
                    margin: "0px",
                    height: "90px"
                }
            });
            relicsDiv.appendChild(relicDiv);

            let relicIcon = createEl('img', { classList: [], style: { width: "60px" }, src: `./Assets/RelicIcon/${relicTypeName}.png` });
            relicDiv.appendChild(relicIcon);

            if (isNew && stage.stage > 1) {
                let newIcon = createEl('img', {
                    classList: [],
                    style: {
                        position: "absolute",
                        width: "60px",
                        top: "-4px"
                    },
                    src: '../Assets/UI/NewRibbon.png'
                })
                relicDiv.appendChild(newIcon);
            }

            addTooltip(relicDiv,
                `<p class="artifact-title">${getLocValue('Relic' + relicTypeName)}</p>${getLocValue('Relic' + relicTypeName + 'Description')}`,
                { allowHTML: true, hideOnClick: false }
            );
        });

        let removedTowersDiv = createEl('div', {
            classList: ['d-flex', 'f-wrap'],
            style: { borderRadius: '10px', backgroundColor: '#3B2B2B', width: "170px", height: "120px" }
        });
        let removedLabel = createEl('p', { classList: ['black-outline', 'ta-center'], style: { fontSize: '18px', color: '#FF6666', width: '100%' }, innerHTML: `Monkeys Lost:` });
        removedTowersDiv.appendChild(removedLabel);
        bottomBar.appendChild(removedTowersDiv);
        if (stage.removed.length > 0) {
            stage.removed.forEach(towerID => {
                let towerDiv = createEl('div', {
                    classList: ['d-flex', 'ai-center', `tower-selector-${constants.towersInOrder.hasOwnProperty(towerID) ? constants.towersInOrder[towerID].category.toLowerCase() : 'hero'}`],
                    style: { width: '80px', height: '96px' }
                });
                removedTowersDiv.appendChild(towerDiv);

                let towerImg = createEl('img', { classList: ['tower-selector-img'], src: getInstaContainerIcon(towerID, '000'), style: { width: '80px' } });
                towerDiv.appendChild(towerImg);

                let maxCount = createEl('p', { classList: ['max-count', 'towerTopLeft', 'towerExcluded'], style: { width: '40px', height: '40px' } });
                towerDiv.appendChild(maxCount);
            });
        } else {
            let noRemovedLabel = createEl('p', { classList: ['black-outline', 'ta-center'], style: { fontSize: '28px', width: '100%' }, innerHTML: `None Yet` });
            removedTowersDiv.appendChild(noRemovedLabel);
        }
    });
}