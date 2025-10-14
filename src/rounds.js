let currentRoundsetView = "Simple";
let roundsetProcessed = null;
let selectedRoundset = null;
let currentPreviewRound = 0;
let currentIndexInModifiedRounds = 0;
let previewActive = false;
let previewModified = null;
let currentModifiedRounds = []
let roundPreviewFilterType;
let currentRoundsetEndRound = 140;
let hiddenGroups = [];

let roundsetFilterSettings = {};

let currentRoundsetData = null;
let bloonToRounds = new Map();

let roundsetPreviewButton = null;

const BloonTraitBits = {
    Camo:        1 << 0,
    Regrow:      1 << 1,
    Fortified:   1 << 2,
    Lead:        1 << 3,
    Purple:      1 << 4,
    DDT:         1 << 5,
    MOABClass:   1 << 6
};

function generateRoundsets() {
    let roundsetsContent = document.getElementById('rounds-content');
    roundsetsContent.innerHTML = "";

    clearAllTimers();

    let roundsetPage = document.createElement('div');
    roundsetPage.classList.add('progress-page');
    roundsetsContent.appendChild(roundsetPage);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.classList.add('selectors-div');
    roundsetPage.appendChild(selectorsDiv);

    // let roundsetHeaderText = createEl('p', {
    //     classList: ['sku-roundset-selector-desc', 'ta-center'],
    //     style: {
    //         fontSize: "18px",
    //         lineHeight: "1.5",
    //     },
    //     innerHTML: "Roundset information is not available on the Open Data API"
    // });
    // selectorsDiv.appendChild(roundsetHeaderText);

    let limitedRoundsets = {};
    let expiredRoundsets = {};
    Object.entries(constants.limitedTimeEvents).forEach(([roundset, data]) => {
        if (data.end > Date.now()) {
            limitedRoundsets[roundset] = data;
        } else {
            expiredRoundsets[roundset] = data;
        }
    })

    Object.entries(limitedRoundsets).forEach(([event, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        roundsetDiv.addEventListener('click', () => {
            showLoading();
            showRoundsetModel('rounds', data.roundset);
        })
        selectorsDiv.appendChild(roundsetDiv);

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetDiv.appendChild(roundsetIcon);

        switch(data.type) {
            case "Race":
                roundsetIcon.src = `../Assets/UI/EventRaceBtn.png`;
                roundsetDiv.classList.add("race-roundset")
                break;
            case "Odyssey":
                roundsetIcon.src = `../Assets/UI/OdysseyEventBtn.png`;
                roundsetDiv.classList.add("odyssey-roundset")
                break;
            case "Boss":
                roundsetIcon.src = `../Assets/BossIcon/${data.boss[0].toUpperCase() + data.boss.slice(1)}EventIcon.png`;
                roundsetDiv.classList.add("boss-roundset")
                break;
        }

        let roundsetTextDiv = document.createElement('div');
        roundsetTextDiv.classList.add('roundset-selector-text-div');
        roundsetDiv.appendChild(roundsetTextDiv);
    
        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = `${data.type} Event - ${event}`;
        roundsetTextDiv.appendChild(roundsetText);

        let roundsetText2 = document.createElement('p');
        roundsetText2.id = "time-left-" + event;
        roundsetText2.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText2);

        if(new Date() < new Date(data.start)) {
            roundsetText2.innerHTML = "Coming Soon!";
        } else if (new Date(data.end) > new Date()) {
            registerTimer(roundsetText2.id, new Date(data.end));
        }

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/ContinueBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })
    
    
    let normalRoundsets = Object.fromEntries(Object.entries(constants.roundSets).filter(([key, value]) => value.type === "normal"));
    let bossRoundsets = Object.fromEntries(Object.entries(constants.roundSets).filter(([key, value]) => value.type === "boss"));
    let legendsRoundsets = Object.fromEntries(Object.entries(constants.roundSets).filter(([key, value]) => value.type === "legends"));
    let otherRoundsets = Object.fromEntries(Object.entries(constants.roundSets).filter(([key, value]) => value.type === "quest"));

    Object.entries(normalRoundsets).forEach(([roundset, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div', 'wood-container');
        roundsetDiv.addEventListener('click', () => {
            showLoading();
            showRoundsetModel('rounds', roundset);
        })
        selectorsDiv.appendChild(roundsetDiv);

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetIcon.src = `../Assets/UI/${data.icon}.png`;
        roundsetDiv.appendChild(roundsetIcon);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = data.name;
        roundsetDiv.appendChild(roundsetText);

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/ContinueBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })

    Object.entries(legendsRoundsets).forEach(([roundset, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div','veteran-container'); 
        roundsetDiv.addEventListener('click', () => {
            showLoading();
            showRoundsetModel('rounds', roundset);
        })
        selectorsDiv.appendChild(roundsetDiv);

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetIcon.src = `../Assets/UI/${data.icon}.png`;
        roundsetDiv.appendChild(roundsetIcon);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = data.name;
        roundsetDiv.appendChild(roundsetText);

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/ContinueBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })


    let bossRoundsetText = document.createElement('p');
    bossRoundsetText.classList.add('other-roundsets-selector-text', 'black-outline');
    bossRoundsetText.innerHTML = "Boss Custom Rounds";
    selectorsDiv.appendChild(bossRoundsetText);

    let bossRoundsetDiv = document.createElement('div');
    bossRoundsetDiv.classList.add('other-roundsets-selector-div');
    selectorsDiv.appendChild(bossRoundsetDiv);

    Object.entries(bossRoundsets).forEach(([roundset, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('other-roundset-selector-div');
        roundsetDiv.addEventListener('click', () => {
            showRoundsetModel('rounds', roundset);
        })
        bossRoundsetDiv.appendChild(roundsetDiv);

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('other-roundset-selector-img');
        roundsetIcon.src = `../Assets/UI/${data.icon}.png`;
        roundsetDiv.appendChild(roundsetIcon);
    })

    let otherRoundsetText = document.createElement('p');
    otherRoundsetText.classList.add('other-roundsets-selector-text', 'black-outline');
    otherRoundsetText.innerHTML = "Quest Custom Rounds";
    selectorsDiv.appendChild(otherRoundsetText);

    let otherRoundsetDiv = document.createElement('div');
    otherRoundsetDiv.classList.add('other-roundsets-selector-div');
    selectorsDiv.appendChild(otherRoundsetDiv);

    Object.entries(otherRoundsets).forEach(([roundset, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('other-roundset-selector-div');
        roundsetDiv.addEventListener('click', () => {
            showRoundsetModel('rounds', roundset);
        })
        otherRoundsetDiv.appendChild(roundsetDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('other-roundset-selector-text', 'black-outline');

        let stage = roundset.match(/(Part|Stage)(\d+)/i);
        if (stage != null) {
            roundsetText.innerHTML = `${stage[1]} ${stage[2]}`;
            roundsetDiv.appendChild(roundsetText);
        }

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('other-roundset-selector-img');
        roundsetIcon.src = `../Assets/QuestIcon/${data.icon}.png`;
        roundsetDiv.appendChild(roundsetIcon);
    })

    let knownPreviousEventsDiv = document.createElement('div');
    knownPreviousEventsDiv.classList.add('known-previous-events-div');
    selectorsDiv.appendChild(knownPreviousEventsDiv);

    let knownPreviousEventsText = document.createElement('p');
    knownPreviousEventsText.classList.add('other-roundsets-selector-text', 'black-outline');
    knownPreviousEventsText.innerHTML = "Known Previous Events";
    knownPreviousEventsDiv.appendChild(knownPreviousEventsText);

    Object.entries(expiredRoundsets).forEach(([event, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div');
        roundsetDiv.addEventListener('click', () => {
            showLoading();
            showRoundsetModel('rounds', data.roundset);
        })
        selectorsDiv.appendChild(roundsetDiv);

        let roundsetIcon = document.createElement('img');
        roundsetIcon.classList.add('roundset-selector-img');
        roundsetDiv.appendChild(roundsetIcon);

        switch(data.type) {
            case "Race":
                roundsetIcon.src = `../Assets/UI/EventRaceBtn.png`;
                roundsetDiv.classList.add("race-roundset")
                break;
            case "Odyssey":
                roundsetIcon.src = `../Assets/UI/OdysseyEventBtn.png`;
                roundsetDiv.classList.add("odyssey-roundset")
                break;
            case "Boss":
                roundsetIcon.src = `../Assets/BossIcon/${data.boss[0].toUpperCase() + data.boss.slice(1)}EventIcon.png`;
                roundsetDiv.style.backgroundImage = `url(../Assets/EventBanner/EventBannerSmall${data.boss[0].toUpperCase() + data.boss.slice(1)}.png)`
                roundsetDiv.classList.add("boss-roundset")
                break;
        }

        let roundsetTextDiv = document.createElement('div');
        roundsetTextDiv.classList.add('roundset-selector-text-div');
        roundsetDiv.appendChild(roundsetTextDiv);
    
        let roundsetText = document.createElement('p');
        roundsetText.classList.add('selector-text', 'black-outline');
        roundsetText.innerHTML = `${data.type} Event - ${event}`;
        roundsetTextDiv.appendChild(roundsetText);

        let roundsetText2 = document.createElement('p');
        roundsetText2.id = "time-left-" + event;
        roundsetText2.classList.add('selector-text', 'black-outline');
        roundsetTextDiv.appendChild(roundsetText2);

        if(new Date() < new Date(data.start)) {
            roundsetText2.innerHTML = "Coming Soon!";
        } else if (new Date(data.end) > new Date()) {
            registerTimer(roundsetText2.id, new Date(data.end));
        } else {
            roundsetText2.innerHTML = `${new Date(data.start).toLocaleDateString()} - ${new Date(data.end).toLocaleDateString()}`
        }

        let roundsetGoImg = document.createElement('img');
        roundsetGoImg.classList.add('selector-go-img');
        roundsetGoImg.src = '../Assets/UI/ContinueBtn.png';
        roundsetDiv.appendChild(roundsetGoImg);
    })

    let skuRoundsetDiv = document.createElement('div');
    skuRoundsetDiv.classList.add('sku-roundset-selector-div');
    selectorsDiv.appendChild(skuRoundsetDiv);

    let skuRoundsetText = document.createElement('p');
    skuRoundsetText.classList.add('other-roundsets-selector-text', 'black-outline');
    skuRoundsetText.innerHTML = "Other Custom Rounds";
    skuRoundsetDiv.appendChild(skuRoundsetText);

    let skuRoundsetDesc = document.createElement('p');
    skuRoundsetDesc.classList.add('sku-roundset-selector-desc');
    skuRoundsetDesc.innerHTML = "These mostly old roundsets will have only been used in one-off events such as Odysseys, Races, or Bosses and may not have ended up being used for their intended purpose despite their name. Take these roundsets with a grain of salt. I'm including them on the viewer for completeness sake.";
    skuRoundsetDiv.appendChild(skuRoundsetDesc);

    let skuRoundsetsDiv = document.createElement('div');
    skuRoundsetsDiv.classList.add('sku-roundsets-selector-div');
    skuRoundsetDiv.appendChild(skuRoundsetsDiv);

    constants.skuRoundsets.forEach(roundset => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('sku-roundset-selector-div');
        roundsetDiv.addEventListener('click', () => {
            showRoundsetModel('rounds', roundset);
        })
        skuRoundsetsDiv.appendChild(roundsetDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('sku-roundset-selector-text', 'black-outline');
        roundsetText.innerHTML = roundset;
        roundsetDiv.appendChild(roundsetText);
    });
}

async function showRoundsetModel(source, roundset) {
    roundsetProcessed = null;
    currentRoundsetData = null;

    roundsetFilterSettings = {
        roundFilterStart: 1,
        roundFilterEnd: null,
        roundsetStartingCash: 650,
        roundFilterPreset: "All",
        roundsetReversed: false,
        roundsetHideUnused: true,
        roundsetShowModified: true,
        roundsetFilteredBloons: [],
        roundsetAdvancedFilterMode: false,
        roundsetBasicFilter: null,
        roundsetAdvancedFilterLogic: 'ANY',
        roundsetShowHints: true
    }
    
    let roundsetContent = document.getElementById('roundsets-content');
    roundsetContent.style.display = "flex";
    roundsetContent.innerHTML = "";
    document.getElementById(`${source}-content`).style.display = "none";
    addToBackQueue({"source": source, "destination": "roundsets"});
    resetScroll();

    let roundsetData = await fetch(`./data/${roundset}.json`).then(response => response.json());
    let roundsetType = "unknown";
    if(constants.roundSets[roundset]) {
        roundsetType = constants.roundSets[roundset].type;
    }

    currentRoundsetData = processRoundset(roundset, roundsetData);
    if (roundsetFilterSettings.roundFilterEnd === null) {
        roundsetFilterSettings.roundFilterEnd = currentRoundsetData.rounds[currentRoundsetData.rounds.length - 1].roundNumber;
    }

    selectedRoundset = roundset;

    let headerBar = document.createElement('div');
    headerBar.classList.add('roundset-header-bar');
    roundsetContent.appendChild(headerBar);

    let roundsetHeaderTitle = document.createElement('div');
    roundsetHeaderTitle.classList.add('roundset-header-title');
    headerBar.appendChild(roundsetHeaderTitle);

    let leftDiv = document.createElement('div');
    leftDiv.classList.add('roundset-header-left');
    roundsetHeaderTitle.appendChild(leftDiv);

    let roundSettingsBtn = createEl('img', {
        classList: ['roundset-settings-btn', 'pointer'],
        style: {
            width: '50px',
            height: '50px',
        },
        src: '../Assets/UI/SettingsBtn.png',
    });
    roundSettingsBtn.addEventListener('click', () => {
        openRoundsetSettingsModal(roundsetType);
    })
    leftDiv.appendChild(roundSettingsBtn);

    let roundsetHeaderText = document.createElement('p');
    roundsetHeaderText.classList.add('roundset-header-text', 'black-outline');
    roundsetHeaderText.innerHTML = constants.roundSets[roundset] ? constants.roundSets[roundset].name : roundset;
    roundsetHeaderTitle.appendChild(roundsetHeaderText);

    let rightDiv = document.createElement('div');
    rightDiv.classList.add('roundset-header-right');
    roundsetHeaderTitle.appendChild(rightDiv);

    let modalClose = document.createElement('img');
    modalClose.classList.add('modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        goBack()
    })
    rightDiv.appendChild(modalClose);

    if(roundset.startsWith("Rogue")) {
        let rogueHeaderBar = document.createElement('div');
        rogueHeaderBar.classList.add('d-flex', 'jc-evenly');
        headerBar.appendChild(rogueHeaderBar);

        let rogueRoundsets = {
            "RogueRoundSet": "Rogue Legends Default Roundset",
            "RogueBloonierSet": "Now with more Bloons!",
            "RogueDenseSet": "Bloons spawn more densely",
            "RoguePinkSet": "Bloons start fast and end slow",
            "RoguePurpleSet": "More Purples and faster Bloons. Bloon health is reduced",
            "RogueImmuneSet": "Alternate rounds with more Bloons with immunities",
            "RogueLeadSet": "More Lead Bloons and DDTs"
        }

        Object.entries(rogueRoundsets).forEach(([rs, desc]) => {
            let roundsetDiv = document.createElement('div');
            roundsetDiv.classList.add('pointer');
            roundsetDiv.addEventListener('click', () => {
                showLoading();
                goBack();
                showRoundsetModel(source, rs);
            })
            rogueHeaderBar.appendChild(roundsetDiv);

            if (rs == roundset) {
                roundsetDiv.classList.add('rogue-roundset-selector-active');
            }

            let roundsetIcon = document.createElement('img');
            roundsetIcon.classList.add('roundset-header-rogue-img');
            roundsetIcon.style.width = "100px";
            roundsetIcon.src = `../Assets/UI/${rs}.png`;
            roundsetDiv.appendChild(roundsetIcon);

            tippy(roundsetDiv, {
                content: desc,
                placement: 'top',
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
            })
        });
    }

    let mapsProgressHeaderBar = document.createElement('div');
    mapsProgressHeaderBar.classList.add('roundset-header-bar-bottom');
    headerBar.appendChild(mapsProgressHeaderBar);

    let mapsProgressViews = document.createElement('div');
    mapsProgressViews.classList.add('maps-progress-views');
    mapsProgressHeaderBar.appendChild(mapsProgressViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text','maps-progress-view-list','black-outline');
    mapsProgressViewsText.innerHTML = "Display Type:";
    mapsProgressViews.appendChild(mapsProgressViewsText);

    let mapsProgressGrid = document.createElement('div');
    mapsProgressGrid.classList.add('maps-progress-view', 'stats-tab-yellow', 'black-outline');
    mapsProgressGrid.innerHTML = "Simple";
    mapsProgressViews.appendChild(mapsProgressGrid);

    let mapsProgressList = document.createElement('div');
    mapsProgressList.classList.add('maps-progress-view','black-outline');
    mapsProgressList.innerHTML = "Detailed";
    mapsProgressViews.appendChild(mapsProgressList);

    let mapsProgressGame = document.createElement('div');
    mapsProgressGame.classList.add('maps-progress-view','black-outline');
    mapsProgressGame.innerHTML = "Preview";
    mapsProgressViews.appendChild(mapsProgressGame);
    roundsetPreviewButton = mapsProgressGame;

    let headerRightControls = document.createElement('div');
    headerRightControls.classList.add('maps-progress-views');
    let clearFiltersBtn = document.createElement('div');
    clearFiltersBtn.classList.add('maps-progress-view','black-outline','pointer');
    clearFiltersBtn.innerHTML = 'Clear Filters';
    clearFiltersBtn.id = 'clear-filters-btn';
    clearFiltersBtn.style.display = 'none';
    clearFiltersBtn.addEventListener('click', () => {
        roundsetFilterSettings.roundFilterStart = 1;
        roundsetFilterSettings.roundFilterEnd = currentRoundsetData.rounds[currentRoundsetData.rounds.length - 1].roundNumber;
        roundsetFilterSettings.roundFilterPreset = "All";
        roundsetFilterSettings.roundsetBasicFilter = null;
        roundsetFilterSettings.roundsetFilteredBloons = [];
        roundsetFilterSettings.roundsetAdvancedFilterMode = false;
        roundsetFilterSettings.roundsetAdvancedFilterLogic = 'ANY';
        roundsetFilterSettings.roundsetReversed = false;
        roundsetFilterSettings.roundsetHideUnused = true;
        roundsetFilterSettings.roundsetShowModified = false;
        applyRoundFilters(roundsetType);
        generateRounds(currentRoundsetView, roundsetFilterSettings.roundsetReversed, roundsetType);
    });
    headerRightControls.appendChild(clearFiltersBtn);
    mapsProgressHeaderBar.appendChild(headerRightControls)

    let roundsContent = document.createElement('div');
    roundsContent.id = 'roundset-content';
    roundsContent.classList.add('rounds-content');
    roundsetContent.appendChild(roundsContent);

    mapsProgressGrid.addEventListener('click', () => {
        mapsProgressGrid.classList.add('stats-tab-yellow');
        mapsProgressList.classList.remove('stats-tab-yellow');
        mapsProgressGame.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Simple";
        generateRounds(currentRoundsetView, roundsetFilterSettings.roundsetReversed, roundsetType);
    })
    mapsProgressList.addEventListener('click', () => {
        mapsProgressList.classList.add('stats-tab-yellow');
        mapsProgressGrid.classList.remove('stats-tab-yellow');
        mapsProgressGame.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Topper";
        generateRounds(currentRoundsetView, roundsetFilterSettings.roundsetReversed, roundsetType);
    })
    mapsProgressGame.addEventListener('click', () => {
        mapsProgressGame.classList.add('stats-tab-yellow');
        mapsProgressGrid.classList.remove('stats-tab-yellow');
        mapsProgressList.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Preview";
        generateRounds(currentRoundsetView, roundsetFilterSettings.roundsetReversed, roundsetType);
    })

    currentPreviewRound = 0;
    currentRoundsetView = "Simple";
    generateRounds(currentRoundsetView, roundsetFilterSettings.roundsetReversed, roundsetType)
}

function processRoundset(name, data){
    const MOAB_CLASS_PREFIXES = ["Moab","Bfb","Zomg","Ddt","Bad"];

    let processed = JSON.parse(JSON.stringify(data));

    processed = addRoundHints(name, processed);

    let incomeRunning = 0;
    let rbeRunning = 0;
    processed.rounds.forEach(r => {
        let traitMask = 0;
        r.bloonGroups.forEach(bg => {
            const bloon = bg.bloon.toLowerCase();
            if (bloon.includes('camo')) traitMask |= BloonTraitBits.Camo; 
            if (bloon.includes('regrow')) traitMask |= BloonTraitBits.Regrow;
            if (bloon.includes('fortified')) traitMask |= BloonTraitBits.Fortified;
            if (bloon.includes('lead')) traitMask |= BloonTraitBits.Lead;
            if (bloon.includes('purple')) traitMask |= BloonTraitBits.Purple;
            if (bloon.includes('ddt')) { traitMask |= (BloonTraitBits.DDT | BloonTraitBits.MOABClass); }
            else if (MOAB_CLASS_PREFIXES.some(prefix => bg.bloon.includes(prefix))) {
                traitMask |= BloonTraitBits.MOABClass;
            }

            if (!bloonToRounds.has(bg.bloon)) bloonToRounds.set(bg.bloon, new Set());
            bloonToRounds.get(bg.bloon).add(r.roundNumber);
        });

        r.traitMask = traitMask;

        if (typeof r.income === 'number') {
            incomeRunning += r.income;
            r.incomeSum = incomeRunning;
        }
        if (typeof r.rbe === 'number') {
            rbeRunning += r.rbe;
            r.rbeSum = rbeRunning;
        }
    });
    return processed;
}

function applyRoundFilters(type){
    if (!currentRoundsetData) return;
    const effectiveEnd = (roundsetFilterSettings.roundFilterEnd ?? currentRoundsetData.rounds[currentRoundsetData.rounds.length - 1].roundNumber);
    let filtered = JSON.parse(JSON.stringify(currentRoundsetData));
    filtered.rounds = filtered.rounds.filter(r => r.roundNumber >= roundsetFilterSettings.roundFilterStart && r.roundNumber <= effectiveEnd);

    let incomeRunning = roundsetFilterSettings.roundsetStartingCash;
    let rbeRunning = 0;
    filtered.rounds.forEach(r => {
        (roundsetFilterSettings.roundsetReversed) ? r.bloonGroups.sort((a, b) => a.end - b.end) : r.bloonGroups.sort((a, b) => a.start - b.start)
        if (typeof r.income === 'number'){
            incomeRunning += r.income;
            r.incomeSum = incomeRunning;
        }
        if (typeof r.rbe === 'number'){
            rbeRunning += r.rbe;
            r.rbeSum = rbeRunning;
        }
    });

    if(type != null) {
        switch(type) {
            case "quest":
                if (roundsetFilterSettings.roundsetHideUnused) {
                    let questEndRound = constants.roundSets[selectedRoundset].endRound;
                    filtered.rounds = filtered.rounds.filter(r => r.roundNumber <= questEndRound);
                }
                break;
            case "boss":
                if (roundsetFilterSettings.roundsetShowModified) {
                    let modifiedRounds = constants.roundSets[selectedRoundset].modifiedRounds;
                    filtered.rounds = filtered.rounds.filter(r => modifiedRounds.includes(r.roundNumber));
                }
                break;
        }
    }

    let requiredMask = 0;
    switch (roundsetFilterSettings.roundsetBasicFilter) {
        case 'Any Camo':
            requiredMask |= BloonTraitBits.Camo;
            break;
        case 'Any Regrow':
            requiredMask |= BloonTraitBits.Regrow;
            break;
        case 'Any Fortified':
            requiredMask |= BloonTraitBits.Fortified;
            break;
        case 'Lead & DDT':
            requiredMask |= BloonTraitBits.Lead;
            break;
        case 'Purple':
            requiredMask |= BloonTraitBits.Purple;
            break;
        case 'MOAB-Class':
            requiredMask |= BloonTraitBits.MOABClass;
            break;
    }

    if (requiredMask !== 0) {
        filtered.rounds = filtered.rounds.filter(r => (r.traitMask & requiredMask) === requiredMask);
    }

    if (roundsetFilterSettings.roundsetFilteredBloons.length > 0) {
        let sets = roundsetFilterSettings.roundsetFilteredBloons
            .map(b => bloonToRounds.get(b))
            .filter(s => s && s.size > 0);

        if (sets.length === 0) {
            filtered.rounds = [];
        } else if (roundsetFilterSettings.roundsetAdvancedFilterLogic === 'COMBO') {
            sets.sort((a,b) => a.size - b.size);
            let intersection = new Set(sets[0]);
            for (let i=1;i<sets.length;i++){
                for (let val of Array.from(intersection)) {
                    if (!sets[i].has(val)) intersection.delete(val);
                }
                if (intersection.size === 0) break;
            }
            filtered.rounds = filtered.rounds.filter(r => intersection.has(r.roundNumber));
        } else {
            let union = new Set();
            sets.forEach(s => s.forEach(v => union.add(v)));
            filtered.rounds = filtered.rounds.filter(r => union.has(r.roundNumber));
        }
    }

    roundsetProcessed = filtered;

    const btn = document.getElementById('clear-filters-btn');
    if (btn) btn.style.display = isFiltersActive() ? '' : 'none';
}

function addRoundHints(roundset, data) {
    if(["DefaultRoundSet", "AlternateRoundSet", "RogueRoundSet"].includes(roundset)) {
        data.rounds.forEach((round, index) => {
            switch(roundset) {
                case "DefaultRoundSet":
                    if(constants.roundHints.hasOwnProperty("Hint " + (round.roundNumber - 1))) {
                        round.hint = constants.roundHints["Hint " + (round.roundNumber - 1)];
                    }
                    break;
                case "AlternateRoundSet":
                    if (constants.roundHints.hasOwnProperty("Alternate Hint " + (round.roundNumber - 1))) {
                        round.hint = constants.roundHints["Alternate Hint " + (round.roundNumber - 1)];
                    }
                    break;
                case "RogueRoundSet":
                    if (constants.roundHints.hasOwnProperty("Rogue Hint " + (round.roundNumber - 1))) {
                        round.hint = constants.roundHints["Rogue Hint " + (round.roundNumber - 1)];
                    }
                    break;
            }
        })
    }
    return data;
}

async function generateRounds(type, reverse, roundsetType) {
    let roundsContent = document.getElementById('roundset-content');
    roundsContent.innerHTML = "";

    if (!roundsetProcessed && currentRoundsetData) {
        applyRoundFilters(roundsetType);
    }

    let roundsetHasNoGaps = roundsetProcessed.rounds.every((r,i,a) => i === 0 || r.roundNumber === a[i-1].roundNumber + 1);

    switch(type) {
        case "Simple":
            resetPreview();

            if (roundsetType === 'boss' && roundsetFilterSettings.roundsetShowModified) {

                let bossExplanations = {
                    "BloonariusRoundSet": "Bloonarius Changes: Only rounds that the boss spawns from are changed. They now spawn Bloons that are one tier lower than normal with 10 seconds of delay.",
                    "LychRoundSet": "Lych Changes: Rounds 40 to 48 have extra MOABs added in for Lych to resurrect when hitting a skull. Rounds that Lych spawns from are changed to spawn Bloons that are one tier lower than normal with 10 seconds of delay.",
                    "VortexRoundSet": "Vortex Changes: A small group of rounds have Bloons upgraded to speedier ones as well as adding some extra faster bloons. Rounds that Vortex spawns from are changed to spawn Bloons that are one tier lower than normal with 10 seconds of delay.",
                    "DreadbloonRoundSet": "Dreadbloon Changes: In general summary, Zebra -> Lead, Lead -> Fortified Lead, Rainbow -> Ceramic, Ceramic -> Fortified Ceramic. After Round 50, every other Blue MOAB is fortified, and after round 70 all Blue MOABs are fortified. There are some exceptions. Rounds that Dreadbloon spawns from are changed to spawn Bloons that are one tier lower than normal with 10 seconds of delay.",
                    "PhayzeRoundSet": "Phayze Changes: Only rounds that the boss spawns from are changed. They now spawn Bloons that are one tier lower than normal with 10 seconds of delay.",
                    "BlastapopoulosRoundSet": "Blastapopoulos Changes: Only rounds that the boss spawns from are changed. They now spawn Bloons that are one tier lower than normal with 10 seconds of delay.",
                }
                
                const infoDiv = document.createElement('div');
                infoDiv.classList.add('disclaimer-div');
                const infoP = document.createElement('p');
                infoP.classList.add('disclaimer');
                infoP.style.fontSize = "24px";
                infoP.style.padding = "1rem";
                infoP.style.lineHeight = "1.5";
                infoP.innerHTML = 'Showing modified rounds. Disable "Only Modified" in Roundset Settings to show all rounds.<br>' + bossExplanations[selectedRoundset];
                infoDiv.appendChild(infoP);
                roundsContent.appendChild(infoDiv);
            }

            let alternate = false;
            roundsetProcessed.rounds.forEach(async (round, index) => {
                let roundDiv = document.createElement('div');
                roundDiv.id = `round-${round.roundNumber}`;
                roundDiv.classList.add('round-div', 'jc-between');
                if (alternate) { roundDiv.classList.add('round-div-alt') }
            
                let roundNumber = document.createElement('p');
                roundNumber.classList.add('round-number', 'black-outline', 'pointer');
                roundNumber.innerHTML = round.roundNumber;
                roundNumber.addEventListener('click', () => {
                    currentPreviewRound = indexOfRoundNumberOrNearest(round.roundNumber);
                    currentRoundsetView = "Preview";
                    roundsetPreviewButton.click();
                });
                roundDiv.appendChild(roundNumber);
            
                let roundBloonGroups = document.createElement('div');
                roundBloonGroups.id = `round-${round.roundNumber}-groups`;
                roundBloonGroups.classList.add('round-bloon-groups', 'fg-1');
                roundDiv.appendChild(roundBloonGroups);

                let fragment = document.createDocumentFragment();
                round.bloonGroups.sort((a, b) => a.start - b.start).forEach((bloonGroup, index) => {
                    let bloonGroupDiv = document.createElement('div');
                    bloonGroupDiv.classList.add('bloon-group-div');
            
                    let bloonGroupNumber = document.createElement('p');
                    bloonGroupNumber.classList.add('bloon-group-number', 'black-outline');
                    bloonGroupNumber.innerHTML = "x" + bloonGroup.count;
                    bloonGroupDiv.appendChild(bloonGroupNumber);
            
                    let bloonGroupBloon = document.createElement('img');
                    bloonGroupBloon.classList.add('bloon-group-bloon');
                    bloonGroupBloon.src = `../Assets/BloonIcon/${bloonGroup.bloon}.png`;
                    bloonGroupBloon.loading = 'lazy';
                    bloonGroupDiv.appendChild(bloonGroupBloon);
            
                    fragment.appendChild(bloonGroupDiv);
                })
            
                roundBloonGroups.appendChild(fragment);

                let roundTimeDiv = document.createElement('div');
                roundTimeDiv.classList.add('d-flex', 'ai-center');
                roundTimeDiv.style.minWidth = "120px";
                roundDiv.appendChild(roundTimeDiv);

                let stopwatchIcon = document.createElement('img');
                stopwatchIcon.classList.add('leaderboard-entry-score-icon');
                stopwatchIcon.src = "./Assets/UI/StopWatch.png";
                roundTimeDiv.appendChild(stopwatchIcon);

                let roundTime = document.createElement('p');
                roundTime.classList.add('round-number', 'black-outline');
                let roundDuration = round.bloonGroups.length ? Math.max(...round.bloonGroups.map(group => group.end)) : 0;
                roundTime.innerHTML = roundDuration.toFixed(2);
                roundTimeDiv.appendChild(roundTime);

                roundsContent.appendChild(roundDiv);

                if(!isRoundInFilter(round.roundNumber)){
                    roundDiv.style.display = "none";
                } else {
                    if (alternate) { roundDiv.classList.add('round-div-alt') }
                    alternate = !alternate;
                }
            })
            if (roundsetFilterSettings.roundsetReversed) { onChangeReverse() }
            break;
        case "Topper":
            resetPreview();
            let roundsDetailedDiv = document.createElement('div');
            roundsDetailedDiv.classList.add('rounds-detailed-div');
            roundsContent.appendChild(roundsDetailedDiv);

            copyLoadingIcon(roundsDetailedDiv);

            setTimeout(() => {
            let fragment = document.createDocumentFragment();

            let disclaimerDiv = document.createElement('div');
            disclaimerDiv.classList.add('disclaimer-div');
            fragment.appendChild(disclaimerDiv);

            let disclaimer = document.createElement('p');
            disclaimer.classList.add('disclaimer');
            disclaimer.innerHTML = "This layout is based on Topper's website:";
            disclaimerDiv.appendChild(disclaimer);

            let disclaimerLink = document.createElement('a');
            disclaimerLink.classList.add('disclaimer-link');
            disclaimerLink.href = "https://topper64.co.uk/nk/btd6/rounds/";
            disclaimerLink.target = "_blank";
            disclaimerLink.innerHTML = "Topper's Round Information";
            disclaimerDiv.appendChild(disclaimerLink);

            let minWidthPercentage = (30 / 600) * 100;

            roundsetProcessed.rounds.forEach(async (round, index) => {
                if(!isRoundInFilter(round.roundNumber)){
                    return;
                }
                let roundDiv = document.createElement('div');
                roundDiv.id = `round-${round.roundNumber}`;
                roundDiv.classList.add('round-div-detailed');
                if (reverse) { roundDiv.classList.add('round-div-reverse') }

                let roundsDivHeader = document.createElement('div');
                roundsDivHeader.classList.add('rounds-div-header');
                roundDiv.appendChild(roundsDivHeader);

                let roundNumber = document.createElement('p');
                roundNumber.classList.add('round-number', 'round-number-detailed', 'black-outline', 'pointer');
                roundNumber.innerHTML = `Round ${round.roundNumber}`;
                roundNumber.addEventListener('click', () => {             // open in preview
                    currentPreviewRound = indexOfRoundNumberOrNearest(round.roundNumber);
                    currentRoundsetView = "Preview";
                    roundsetPreviewButton.click();
                });
                roundsDivHeader.appendChild(roundNumber);

                let incomeDiv = document.createElement('div');
                incomeDiv.classList.add('income-div');
                roundsDivHeader.appendChild(incomeDiv);

                let incomeImg = document.createElement('img');
                incomeImg.classList.add('income-img');
                incomeImg.src = "../Assets/UI/CoinIcon.png";
                incomeDiv.appendChild(incomeImg);

                let incomeTextDiv = document.createElement('div');
                incomeTextDiv.classList.add('income-text-div');
                incomeDiv.appendChild(incomeTextDiv);
                
                let roundIncome = document.createElement('p');
                roundIncome.classList.add('round-income', 'black-outline');
                roundIncome.innerHTML = `Income: ${round.income.toLocaleString()}`;
                incomeTextDiv.appendChild(roundIncome);
                
                let roundIncomeTotal = document.createElement('p');
                roundIncomeTotal.classList.add('round-income-total', 'black-outline');
                roundIncomeTotal.innerHTML = `Total: ${round.incomeSum.toLocaleString()}`;
                if (roundsetHasNoGaps){ incomeTextDiv.appendChild(roundIncomeTotal); }

                let rbeDiv = document.createElement('div');
                rbeDiv.classList.add('rbe-div');
                roundsDivHeader.appendChild(rbeDiv);

                let rbeImg = document.createElement('img');
                rbeImg.classList.add('rbe-img');
                rbeImg.src = "../Assets/BloonIcon/Red.png";
                rbeDiv.appendChild(rbeImg);

                let rbeTextDiv = document.createElement('div');
                rbeTextDiv.classList.add('rbe-text-div');
                rbeDiv.appendChild(rbeTextDiv);

                let roundRBE = document.createElement('p');
                roundRBE.classList.add('round-rbe', 'black-outline');
                roundRBE.innerHTML = `RBE: ${round.rbe.toLocaleString()}`;
                rbeTextDiv.appendChild(roundRBE);
                
                let roundRBETotal = document.createElement('p');
                roundRBETotal.classList.add('round-rbe-total', 'black-outline');
                roundRBETotal.innerHTML = `Total: ${round.rbeSum.toLocaleString()}`;
                if (roundsetHasNoGaps){ rbeTextDiv.appendChild(roundRBETotal); }

                let roundDuration = round.bloonGroups.length ? Math.max(...round.bloonGroups.map(group => group.end)) : 0;

                let roundDurationText = document.createElement('p');
                roundDurationText.classList.add('round-duration', 'black-outline');
                roundDurationText.innerHTML = `Duration: ${roundDuration.toFixed(2)}s`;
                roundsDivHeader.appendChild(roundDurationText);

                if(round.hint  && roundsetFilterSettings.roundsetShowHints) {
                    let roundHintDiv = document.createElement('div');
                    roundHintDiv.classList.add('round-hint-div','coop-border');
                    roundDiv.appendChild(roundHintDiv);

                    let roundHintX = document.createElement('p');
                    roundHintX.classList.add('round-hint-x');
                    roundHintX.innerHTML = "X";
                    roundHintX.addEventListener('click', () => {
                        roundHintDiv.style.display = "none";
                    })
                    roundHintDiv.appendChild(roundHintX);

                    let roundHint = document.createElement('p');
                    roundHint.classList.add('round-hint');
                    roundHint.innerHTML = round.hint;
                    roundHintDiv.appendChild(roundHint);
                }

                let timelineDiv = document.createElement('div');
                timelineDiv.classList.add('timeline-div');
                roundDiv.appendChild(timelineDiv);
                round.bloonGroups.forEach((bloonGroup, index) => {
                    let bloonGroupDiv = document.createElement('div');
                    bloonGroupDiv.classList.add('bloon-group-div-detailed');
                    timelineDiv.appendChild(bloonGroupDiv);

                    let leftDiv = document.createElement('div');
                    leftDiv.classList.add('left-div');
                    bloonGroupDiv.appendChild(leftDiv);

                    let bloonImage = document.createElement('img');
                    bloonImage.classList.add('bloon-image');
                    bloonImage.src = `../Assets/BloonIcon/${bloonGroup.bloon}.png`;
                    leftDiv.appendChild(bloonImage);

                    let bloonCount = document.createElement('p');
                    bloonCount.classList.add('bloon-count', 'black-outline');
                    bloonCount.innerHTML = "x" + bloonGroup.count;
                    leftDiv.appendChild(bloonCount);
                    
                    let rightDiv = document.createElement('div');
                    rightDiv.classList.add('timeline-right-div');
                    bloonGroupDiv.appendChild(rightDiv);
                    
                    let bloonBar = document.createElement('div');
                    bloonBar.classList.add('bloon-bar');
                    rightDiv.appendChild(bloonBar);

                    let bloonBarFill = document.createElement('div');
                    bloonBarFill.classList.add('bloon-bar-fill');
                    bloonBarFill.style.background = bloonsData[bloonGroup.bloon.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].color;
                    if (!bloonGroup.bloon.includes("Rainbow")) {
                        bloonBarFill.style.border = `4px solid ${bloonsData[bloonGroup.bloon.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].border}`;
                    }

                    tippy(bloonBarFill, {
                        content: `${bloonGroup.start.toFixed(2)}s - ${bloonGroup.end.toFixed(2)}s`,
                        placement: 'top',
                        theme: 'speech_bubble',
                        popperOptions: {
                            modifiers: [
                                {
                                    name: 'preventOverflow',
                                    options: {
                                        boundary: 'viewport',
                                        padding: { right: 18 },
                                    },
                                },
                            ],
                        },
                    });

                    let widthPercentage = ((bloonGroup.end - bloonGroup.start) / roundDuration) * 100;
                    let leftPercentage = (bloonGroup.start / roundDuration) * 100;
            
                    if (widthPercentage < minWidthPercentage) {
                        widthPercentage = minWidthPercentage;
                    }
            
                    if (leftPercentage + widthPercentage > 100) {
                        leftPercentage = 100 - widthPercentage;
                    }
            
                    bloonBarFill.style.width = `${widthPercentage}%`;
                    bloonBarFill.style.left = `${leftPercentage}%`;

                    bloonBar.appendChild(bloonBarFill);
                })
                fragment.appendChild(roundDiv);
            })
            roundsDetailedDiv.innerHTML = "";
            roundsDetailedDiv.appendChild(fragment);
            if (roundsetFilterSettings.roundsetReversed) { onChangeReverse() }
            }, 0)
            break;
        case "Preview":
            resetPreview();
            if (roundsetProcessed.rounds[currentPreviewRound] == null) {
                currentPreviewRound = 0;
            }
            if (roundsetProcessed.rounds[currentPreviewRound].roundNumber < roundsetFilterSettings.roundFilterStart ||
                roundsetProcessed.rounds[currentPreviewRound].roundNumber > roundsetFilterSettings.roundFilterEnd) {
                currentPreviewRound = Math.max(0, roundsetFilterSettings.roundFilterStart - 1);
            }

            let previewContainerDiv = document.createElement('div');
            previewContainerDiv.classList.add('preview-container-div');
            roundsContent.appendChild(previewContainerDiv);

            let previewDiv = document.createElement('div');
            previewDiv.classList.add('preview-div');
            previewContainerDiv.appendChild(previewDiv);

            let previewHeader = document.createElement('div');
            previewHeader.classList.add('preview-header');
            previewDiv.appendChild(previewHeader);

            let roundNumber = document.createElement('p');
            roundNumber.id = 'round-number-preview';
            roundNumber.classList.add('round-number', 'round-number-preview', 'black-outline');
            roundNumber.innerHTML = `Round ${roundsetProcessed.rounds[currentPreviewRound].roundNumber}`;
            previewHeader.appendChild(roundNumber);

            let selectRoundNum = document.createElement('input');
            selectRoundNum.id = 'select-round-num-preview';
            selectRoundNum.classList.add('select-round-num');
            selectRoundNum.type = 'number';
            selectRoundNum.min = 1;
            selectRoundNum.max = roundsetFilterSettings.roundFilterEnd;
            selectRoundNum.value = roundsetProcessed.rounds[currentPreviewRound].roundNumber;
            selectRoundNum.addEventListener('change', () => {
                let val = parseInt(selectRoundNum.value);
                if (val < roundsetFilterSettings.roundFilterStart) val = roundsetFilterSettings.roundFilterStart;
                if (val > roundsetFilterSettings.roundFilterEnd) val = roundsetFilterSettings.roundFilterEnd;
                selectRoundNum.value = val;
                currentPreviewRound = indexOfRoundNumberOrNearest(val);
                roundNumber.innerHTML = `Round ${roundsetProcessed.rounds[currentPreviewRound].roundNumber}`;
                updatePreviewRoundTimeline()
            })
            previewHeader.appendChild(selectRoundNum);
            
            let previewRightDiv = document.createElement('div');
            previewRightDiv.classList.add('preview-right-div');
            // previewHeader.appendChild(previewRightDiv);

            let clearButton = document.createElement('img');
            clearButton.classList.add('clear-button');
            clearButton.src = "../Assets/UI/DestroyBloonsBtn.png";
            clearButton.addEventListener('click', () => {
                clearPreview()
            })
            previewRightDiv.appendChild(clearButton);

            let playNormalButton = document.createElement('img');
            playNormalButton.classList.add('play-normal-button');
            playNormalButton.src = "../Assets/UI/GoBtnSmall.png";
            playNormalButton.addEventListener('click', () => {
                speedMultiplier = 1;
                roundNumber.innerHTML = `Round ${roundsetProcessed.rounds[currentPreviewRound].roundNumber}`;
                clearPreview()
                startRound(roundsetProcessed.rounds[currentPreviewRound])
            })
            previewRightDiv.appendChild(playNormalButton);

            let playFastButton = document.createElement('img');
            playFastButton.classList.add('play-fast-button');
            playFastButton.src = "../Assets/UI/FastForwardBtn.png";
            playFastButton.addEventListener('click', () => {
                speedMultiplier = 3;
                roundNumber.innerHTML = `Round ${roundsetProcessed.rounds[currentPreviewRound].roundNumber}`;
                clearPreview()
                startRound(roundsetProcessed.rounds[currentPreviewRound])
            })
            previewRightDiv.appendChild(playFastButton);

            canvas = document.createElement('canvas');
            canvas.classList.add('roundset-canvas')
            canvas.width = 800;
            canvas.height = 300;
            previewDiv.appendChild(canvas);

            let previewFooterDiv = document.createElement('div');
            previewFooterDiv.classList.add('preview-footer-div', 'ai-center');
            previewDiv.appendChild(previewFooterDiv);

            let difficultyDiv = document.createElement('div');
            difficultyDiv.classList.add('d-flex', 'ai-center');
            previewFooterDiv.appendChild(difficultyDiv);

            let difficultyLabel = createEl('p', {classList: ['black-outline'], innerHTML: "Bloon Speed:", style: {
                fontSize: '28px',
            }});
            difficultyDiv.appendChild(difficultyLabel);

            let difficultyEasy = document.createElement('div');
            difficultyEasy.classList.add('maps-progress-view', 'stats-tab-yellow', 'black-outline');
            difficultyEasy.innerHTML = "Easy";
            difficultyDiv.appendChild(difficultyEasy);

            let difficultyMedium = document.createElement('div');
            difficultyMedium.classList.add('maps-progress-view', 'black-outline');
            difficultyMedium.innerHTML = "Medium";
            difficultyDiv.appendChild(difficultyMedium);

            let difficultyHard = document.createElement('div');
            difficultyHard.classList.add('maps-progress-view', 'black-outline');
            difficultyHard.innerHTML = "Hard";
            difficultyDiv.appendChild(difficultyHard);

            difficultyEasy.addEventListener('click', () => {
                difficultySpeedModifier = 1;
                difficultyEasy.classList.add('stats-tab-yellow');
                difficultyMedium.classList.remove('stats-tab-yellow');
                difficultyHard.classList.remove('stats-tab-yellow');
            })
            difficultyMedium.addEventListener('click', () => {
                difficultySpeedModifier = 1.1;
                difficultyEasy.classList.remove('stats-tab-yellow');
                difficultyMedium.classList.add('stats-tab-yellow');
                difficultyHard.classList.remove('stats-tab-yellow');
            })
            difficultyHard.addEventListener('click', () => {
                difficultySpeedModifier = 1.26;
                difficultyEasy.classList.remove('stats-tab-yellow');
                difficultyMedium.classList.remove('stats-tab-yellow');
                difficultyHard.classList.add('stats-tab-yellow');
            })

            switch(selectedRoundset) {
                case "AlternateRoundSet":
                    difficultyHard.click();
                    break;
                case "AcceleratedRoundSet":
                case "EnduranceRoundSet":
                case "FastUpgradesRoundSet":
                case "MOABMadnessRoundSet":
                case "RogueRoundSet":
                case "RogueBloonierSet":
                case "RogueDenseSet":
                case "RoguePinkSet":
                case "RoguePurpleSet":
                case "RogueImmuneSet":
                case "RogueLeadSet":
                    difficultyMedium.click();
                    break;
            }

            let nextPrevDiv = document.createElement('div');
            nextPrevDiv.classList.add('next-prev-div');
            previewHeader.appendChild(nextPrevDiv);

            previewFooterDiv.appendChild(previewRightDiv);

            let prevRound = document.createElement('div');
            prevRound.classList.add('maps-progress-view', 'black-outline');
            prevRound.innerHTML = "Previous";
            prevRound.addEventListener('click', () => {
                if (previewModified != null && previewModified.checked) {
                    currentIndexInModifiedRounds--;
                    if (currentIndexInModifiedRounds < 0) { currentIndexInModifiedRounds = currentModifiedRounds.length - 1 }
                    currentPreviewRound = currentModifiedRounds[currentIndexInModifiedRounds] - 1;
                } else {
                    currentPreviewRound--;
                    if (currentPreviewRound < 0) { currentPreviewRound = roundsetProcessed.rounds.length - 1 }
                }
                selectRoundNum.value = roundsetProcessed.rounds[currentPreviewRound].roundNumber;
                clearPreview();
                updatePreviewRoundTimeline()
            })
            nextPrevDiv.appendChild(prevRound);

            let nextRound = document.createElement('div');
            nextRound.classList.add('maps-progress-view', 'black-outline');
            nextRound.innerHTML = "Next";
            nextRound.addEventListener('click', () => {
                if (previewModified != null && previewModified.checked) {
                    currentIndexInModifiedRounds++;
                    if (currentIndexInModifiedRounds >= currentModifiedRounds.length) { currentIndexInModifiedRounds = 0 }
                    currentPreviewRound = currentModifiedRounds[currentIndexInModifiedRounds] - 1;
                } else {
                    currentPreviewRound++;
                    if (currentPreviewRound >= roundsetProcessed.rounds.length) { currentPreviewRound = 0 }
                }
                selectRoundNum.value = roundsetProcessed.rounds[currentPreviewRound].roundNumber;
                clearPreview();
                updatePreviewRoundTimeline()
            })
            nextPrevDiv.appendChild(nextRound);
            
            let roundInfoDiv = document.createElement('div');
            roundInfoDiv.id = 'preview-round-info-div';
            roundInfoDiv.classList.add('round-info-div');
            previewDiv.appendChild(roundInfoDiv);

            ctx = canvas.getContext('2d');

            startPreviewLoop();
            updatePreviewRoundTimeline()
            break;
    }
}

function onChangeReverse() {
    switch(currentRoundsetView) {
        case "Simple":
            roundsetProcessed.rounds.forEach((round, index) => {
                let groupsDiv = document.getElementById(`round-${round.roundNumber}-groups`); 
                let groups = Array.from(groupsDiv.children);
                groups.reverse().forEach(group => groupsDiv.appendChild(group));
            });
            break;
        case "Topper":
            let timelineDivs = document.getElementsByClassName('timeline-div');
            for (let timelineDiv of timelineDivs) {
                timelineDiv.classList.toggle('timeline-div-reverse');
            }
            let timelineDivss = document.getElementsByClassName('timeline-right-div');
            for (let timelineDiv of timelineDivss) {
                timelineDiv.classList.toggle('flip-horizontal');
            }
            break;
        case "Preview":
            document.getElementById('preview-timeline-div').classList.toggle('timeline-div-reverse');
            let timelineDivssPreview = document.getElementsByClassName('preview-timeline-right-div');
            for (let timelineDiv of timelineDivssPreview) {
                timelineDiv.classList.toggle('flip-horizontal');
            }
    }
    clearPreview();
}

function updatePreviewRoundTimeline() {
    let contentDiv = document.getElementById('preview-round-info-div');
    contentDiv.innerHTML = "";

    let round = roundsetProcessed.rounds[currentPreviewRound];
    hiddenGroups = []

    let roundDiv = document.createElement('div');
    roundDiv.classList.add('round-div-detailed');
    contentDiv.appendChild(roundDiv);

    let roundsDivHeader = document.createElement('div');
    roundsDivHeader.classList.add('rounds-div-header');
    roundDiv.appendChild(roundsDivHeader);

    
    let roundNumber = document.createElement('p');
    roundNumber.classList.add('round-number', 'round-number-detailed', 'black-outline');
    roundNumber.innerHTML = `Round ${round.roundNumber}`;
    roundsDivHeader.appendChild(roundNumber);

    let incomeDiv = document.createElement('div');
    incomeDiv.classList.add('income-div');
    roundsDivHeader.appendChild(incomeDiv);

    let incomeImg = document.createElement('img');
    incomeImg.classList.add('income-img');
    incomeImg.src = "../Assets/UI/CoinIcon.png";
    incomeDiv.appendChild(incomeImg);

    let incomeTextDiv = document.createElement('div');
    incomeTextDiv.classList.add('income-text-div');
    incomeDiv.appendChild(incomeTextDiv);
    
    let roundIncome = document.createElement('p');
    roundIncome.classList.add('round-income', 'black-outline');
    roundIncome.innerHTML = `Income: ${round.income.toLocaleString()}`;
    incomeTextDiv.appendChild(roundIncome);
    
    let roundIncomeTotal = document.createElement('p');
    roundIncomeTotal.classList.add('round-income-total', 'black-outline');
    roundIncomeTotal.innerHTML = `Total: ${round.incomeSum.toLocaleString()}`;
    incomeTextDiv.appendChild(roundIncomeTotal);

    let rbeDiv = document.createElement('div');
    rbeDiv.classList.add('rbe-div');
    roundsDivHeader.appendChild(rbeDiv);

    let rbeImg = document.createElement('img');
    rbeImg.classList.add('rbe-img');
    rbeImg.src = "../Assets/BloonIcon/Red.png";
    rbeDiv.appendChild(rbeImg);

    let rbeTextDiv = document.createElement('div');
    rbeTextDiv.classList.add('rbe-text-div');
    rbeDiv.appendChild(rbeTextDiv);
    
    let roundRBE = document.createElement('p');
    roundRBE.classList.add('round-rbe', 'black-outline');
    roundRBE.innerHTML = `RBE: ${round.rbe.toLocaleString()}`;
    rbeTextDiv.appendChild(roundRBE);
    
    let roundRBETotal = document.createElement('p');
    roundRBETotal.classList.add('round-rbe-total', 'black-outline');
    roundRBETotal.innerHTML = `Total: ${round.rbeSum.toLocaleString()}`;
    rbeTextDiv.appendChild(roundRBETotal);

    let roundDuration = round.bloonGroups.length ? Math.max(...round.bloonGroups.map(group => group.end)) : 0;

    let roundDurationText = document.createElement('p');
    roundDurationText.classList.add('round-duration', 'black-outline');
    roundDurationText.innerHTML = `Duration: ${roundDuration.toFixed(2)}s`;
    roundsDivHeader.appendChild(roundDurationText);

    if(round.hint  && roundsetFilterSettings.roundsetShowHints) {
        let roundHintDiv = document.createElement('div');
        roundHintDiv.classList.add('round-hint-div','coop-border');
        roundDiv.appendChild(roundHintDiv);

        let roundHintX = document.createElement('p');
        roundHintX.classList.add('round-hint-x');
        roundHintX.innerHTML = "X";
        roundHintX.addEventListener('click', () => {
            roundHintDiv.style.display = "none";
        })
        roundHintDiv.appendChild(roundHintX);

        let roundHint = document.createElement('p');
        roundHint.classList.add('round-hint');
        roundHint.innerHTML = round.hint;
        roundHintDiv.appendChild(roundHint);
    }

    let timelineDiv = document.createElement('div');
    timelineDiv.id = "preview-timeline-div"
    timelineDiv.classList.add('timeline-div');
    roundDiv.appendChild(timelineDiv);

    let minWidthPercentage = (30 / 600) * 100; 
    round.bloonGroups.forEach((bloonGroup, index) => {
        let bloonGroupDiv = document.createElement('div');
        bloonGroupDiv.classList.add('bloon-group-div-detailed');
        bloonGroupDiv.addEventListener('click', () => {
            if (hiddenGroups.includes(index)) {
                bloonGroupDiv.style.filter = "";
                hiddenGroups.splice(hiddenGroups.indexOf(index), 1);
            } else {
                hiddenGroups.push(index);
                bloonGroupDiv.style.filter = "brightness(0.5)";
            }
        })
        timelineDiv.appendChild(bloonGroupDiv);

        let leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        bloonGroupDiv.appendChild(leftDiv);
        
        let bloonImage = document.createElement('img');
        bloonImage.classList.add('bloon-image');
        bloonImage.src = `../Assets/BloonIcon/${bloonGroup.bloon}.png`;
        leftDiv.appendChild(bloonImage);
        
        let bloonCount = document.createElement('p');
        bloonCount.classList.add('bloon-count', 'black-outline');
        bloonCount.innerHTML = "x" + bloonGroup.count;
        leftDiv.appendChild(bloonCount);
        
        let rightDiv = document.createElement('div');
        rightDiv.classList.add('timeline-right-div','preview-timeline-right-div');
        bloonGroupDiv.appendChild(rightDiv);
        
        let bloonBar = document.createElement('div');
        bloonBar.classList.add('bloon-bar');
        rightDiv.appendChild(bloonBar);

        let bloonBarFill = document.createElement('div');
        bloonBarFill.classList.add('bloon-bar-fill');
        bloonBarFill.style.background = bloonsData[bloonGroup.bloon.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].color;
        if (!bloonGroup.bloon.includes("Rainbow")) {
            bloonBarFill.style.border = `4px solid ${bloonsData[bloonGroup.bloon.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].border}`;
        }

        tippy(bloonBarFill, {
            content: `${bloonGroup.start.toFixed(2)}s - ${bloonGroup.end.toFixed(2)}s`,
            placement: 'top',
            theme: 'speech_bubble',
            popperOptions: {
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'viewport',
                            padding: { right: 18 },
                        },
                    },
                ],
            },
        });

        let widthPercentage = ((bloonGroup.end - bloonGroup.start) / roundDuration) * 100;
        let leftPercentage = (bloonGroup.start / roundDuration) * 100;

        if (widthPercentage < minWidthPercentage) {
            widthPercentage = minWidthPercentage;
        }

        if (leftPercentage + widthPercentage > 100) {
            leftPercentage = 100 - widthPercentage;
        }

        bloonBarFill.style.width = `${widthPercentage}%`;
        bloonBarFill.style.left = `${leftPercentage}%`;

        bloonBar.appendChild(bloonBarFill);
    })
    if (roundsetFilterSettings.roundsetReversed) { onChangeReverse() }
}

function addTimelinePlayhead(duration) {
    let timelineDiv = document.getElementById('preview-timeline-div');
    let playhead = document.createElement('div');
    playhead.id = 'preview-playhead'
    playhead.classList.add('playhead');
    timelineDiv.appendChild(playhead);
    playhead.style.animation = `playhead ${duration}s linear`;
    playhead.addEventListener('animationend', function() {
        playhead.remove();
    });
}

function clearPreview(){
    if (document.getElementById('preview-playhead')) { document.getElementById('preview-playhead').remove() }
    currentRoundGroups = null;
    bloons.length = 0;
}

function openRoundsetSettingsModal(type){
    if (!roundsetProcessed) return;

    if (roundsetFilterSettings.roundFilterEnd === null) {
        roundsetFilterSettings.roundFilterEnd = roundsetProcessed.rounds[roundsetProcessed.rounds.length - 1].roundNumber;
    }

    const container = createEl('div', {
        style: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }
    });

    // container.appendChild(createEl('p', {
    //     classList: ['oak-instructions-header', 'black-outline'],
    //     innerHTML: 'Roundset Settings'
    // }));

    let roundModalTopDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-between'], style: { gap: '8px' } });
    container.appendChild(roundModalTopDiv);

    let roundFiltersDiv = createEl('div', { classList: ['d-flex'], style: { gap: '8px', flexDirection: 'column' } });
    roundModalTopDiv.appendChild(roundFiltersDiv);

    let presetsDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-center'], style: { gap: '8px', flexWrap: 'wrap', width: '55%' } });

    let firstRound = currentRoundsetData.rounds[0].roundNumber;
    let lastRound = currentRoundsetData.rounds[currentRoundsetData.rounds.length - 1].roundNumber;

    let startRoundDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
    roundFiltersDiv.appendChild(startRoundDiv);

    let startRoundIcon = createEl('img', {
        classList: ['of-contain'],
        src: './Assets/UI/StartRoundIconSmall.png',
        style: { width: '40px', height: '40px', marginRight: '4px' }
    });
    startRoundDiv.appendChild(startRoundIcon);

    let startRoundInput = generateNumberInput("Start Round", roundsetFilterSettings.roundFilterStart, firstRound, lastRound, 1, (val) => {
        roundsetFilterSettings.roundFilterStart = val;
        presetsDiv.querySelectorAll('div').forEach(d => d.classList.remove('stats-tab-yellow'));
    });
    startRoundDiv.appendChild(startRoundInput);

    let endRoundDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
    roundFiltersDiv.appendChild(endRoundDiv);

    let endRoundIcon = createEl('img', {
        classList: ['of-contain'],
        src: './Assets/UI/EndRoundIconSmall.png',
        style: { width: '40px', height: '40px', marginRight: '4px' }
    });
    endRoundDiv.appendChild(endRoundIcon);

    let endRoundInput = generateNumberInput("End Round", roundsetFilterSettings.roundFilterEnd, firstRound, lastRound, 1, (val) => {
        roundsetFilterSettings.roundFilterEnd = val;
        presetsDiv.querySelectorAll('div').forEach(d => d.classList.remove('stats-tab-yellow'));
    });
    endRoundInput.style.flexGrow = '1';
    endRoundDiv.appendChild(endRoundInput);

    if (selectedRoundset === "DefaultRoundSet") {
        let roundPresets = ["All", "Easy", "Medium", "Hard", "Impoppable", "CHIMPS"];
        // if (selectedRoundset === "DefaultRoundSet") roundPresets.push("Easy", "Medium", "Hard", "Impoppable", "CHIMPS")
        roundPresets.forEach(preset => {
            const presetBtn = generateSelectorTab(preset, preset === roundsetFilterSettings.roundFilterPreset);
            presetBtn.addEventListener('click', () => {
                roundsetFilterSettings.roundFilterPreset = preset;
                // highlight
                Array.from(presetsDiv.children).forEach(c => c.classList.remove('stats-tab-yellow'));
                presetBtn.classList.add('stats-tab-yellow');

                switch(preset){
                    case "All": roundsetFilterSettings.roundFilterStart = 1; roundsetFilterSettings.roundFilterEnd = lastRound; break;
                    case "Easy": roundsetFilterSettings.roundFilterStart = 1; roundsetFilterSettings.roundFilterEnd = Math.min(40, lastRound); break;
                    case "Medium": roundsetFilterSettings.roundFilterStart = 1; roundsetFilterSettings.roundFilterEnd = Math.min(60, lastRound); break;
                    case "Hard": roundsetFilterSettings.roundFilterStart = 3; roundsetFilterSettings.roundFilterEnd = Math.min(80, lastRound); break;
                    case "Impoppable":
                    case "CHIMPS": roundsetFilterSettings.roundFilterStart = 6; roundsetFilterSettings.roundFilterEnd = Math.min(100, lastRound); break;
                    case "Custom": break;
                }
                // update input UI
                const sIn = startRoundInput.querySelector('input');
                const eIn = endRoundInput.querySelector('input');
                if (sIn) sIn.value = roundsetFilterSettings.roundFilterStart;
                if (eIn && roundsetFilterSettings.roundFilterEnd) eIn.value = roundsetFilterSettings.roundFilterEnd;
            });
            presetsDiv.appendChild(presetBtn);
        })
        roundModalTopDiv.appendChild(presetsDiv);
    } else {
        roundFiltersDiv.style.flexDirection = 'row';
        roundFiltersDiv.style.gap = '50px';
    }

    let rogueReverseDesc = createEl('p', {
        classList: ['font-gardenia'],
        style: { fontSize: '22px',  display: roundsetFilterSettings.roundsetReversed ? 'block' : 'none' },
        innerHTML: 'In Rogue Legends, the rounds are not reversed even when the track path is.'
    });

    let otherSettingsDiv = createEl('div', { classList: ['d-flex'] });
    container.appendChild(otherSettingsDiv);

    let startingCashDiv = createEl('div', { classList: ['d-flex', 'ai-center'] });
    otherSettingsDiv.appendChild(startingCashDiv);

    let startingCashIcon = createEl('img', {
        classList: ['of-contain'],
        src: './Assets/UI/CoinIcon.png',
        style: { width: '40px', height: '40px', marginRight: '4px' }
    });
    startingCashDiv.appendChild(startingCashIcon);

    let startingCashInput = generateNumberInput("Starting Cash", roundsetFilterSettings.roundsetStartingCash, 0, 99999999, 50, (val) => {
        roundsetFilterSettings.roundsetStartingCash = val;
    });
    startingCashDiv.appendChild(startingCashInput);

    let reverseModeInput = generateCheckbox("Reverse Mode", roundsetFilterSettings.roundsetReversed, (checked) => {
        roundsetFilterSettings.roundsetReversed = checked;
        rogueReverseDesc.style.display = selectedRoundset.startsWith("Rogue") && checked ? 'block' : 'none';
    });
    otherSettingsDiv.appendChild(reverseModeInput);

    if (type === "quest") {
        let showUnusedInput = generateCheckbox("Hide Unused", roundsetFilterSettings.roundsetHideUnused, (checked) => {
            roundsetFilterSettings.roundsetHideUnused = checked;
        });
        otherSettingsDiv.appendChild(showUnusedInput);
        otherSettingsDiv.classList.add('jc-between');
    } else if (type === 'boss') {
        let showBossInput = generateCheckbox("Only Modified", roundsetFilterSettings.roundsetShowModified, (checked) => {
            roundsetFilterSettings.roundsetShowModified = checked;
        });
        otherSettingsDiv.appendChild(showBossInput);
        otherSettingsDiv.classList.add('jc-between');
    } else if (selectedRoundset === "DefaultRoundSet" || selectedRoundset.startsWith("Rogue")) {
        let showHintsInput = generateCheckbox("Round Hints", roundsetFilterSettings.roundsetShowHints, (checked) => {
            roundsetFilterSettings.roundsetShowHints = checked;
        });
        otherSettingsDiv.appendChild(showHintsInput);
        otherSettingsDiv.classList.add('jc-between');
    } else {
        otherSettingsDiv.style.gap = '32px';
    }

    container.appendChild(rogueReverseDesc);

    let bloonsFilterTitleDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-between'], style: { gap: '8px' } });
    container.appendChild(bloonsFilterTitleDiv);

    let bloonsFilterTitle = createEl('p', {
        classList: ['dropdown-label', 'black-outline'],
        innerHTML: 'Filter by Bloons'
    });
    bloonsFilterTitleDiv.appendChild(bloonsFilterTitle);

    let logicSelectorDiv = createEl('div', { classList:['d-flex','ai-center'], style:{ gap:'6px', display: roundsetFilterSettings.roundsetAdvancedFilterMode ? 'flex':'none' } });
    bloonsFilterTitleDiv.appendChild(logicSelectorDiv);

    let logicLabel = createEl('p', { classList:['black-outline'], style:{ fontSize:'24px' }, innerHTML:'Logic:' });
    logicSelectorDiv.appendChild(logicLabel);

    const makeLogicBtn = (label) => {
        let btn = createEl('div', {
            classList:['maps-progress-view','black-outline','pointer'],
            innerHTML: label
        });
        if (roundsetFilterSettings.roundsetAdvancedFilterLogic === label) {
            btn.classList.add('stats-tab-yellow');
        }
        btn.addEventListener('click', () => {
            if (roundsetFilterSettings.roundsetAdvancedFilterLogic === label) return;
            roundsetFilterSettings.roundsetAdvancedFilterLogic = label;
            Array.from(logicSelectorDiv.querySelectorAll('.maps-progress-view')).forEach(b => b.classList.remove('stats-tab-yellow'));
            btn.classList.add('stats-tab-yellow');
        });
        return btn;
    }

    logicSelectorDiv.appendChild(makeLogicBtn('ANY'));
    logicSelectorDiv.appendChild(makeLogicBtn('COMBO'));

    let advancedToggleDiv = createEl('div', { classList: ['tooltip-container', 'd-flex', 'ai-center'], style: { gap: '8px' }});
    bloonsFilterTitleDiv.appendChild(advancedToggleDiv);

    let advancedToggleLabel = createEl('p', {
        classList: ['black-outline'],
        style: { fontSize: '24px' },
        innerHTML: 'Advanced'
    });
    advancedToggleDiv.appendChild(advancedToggleLabel);

    let advancedToggle = generateToggle(roundsetFilterSettings.roundsetAdvancedFilterMode, (checked) => {
        roundsetFilterSettings.roundsetAdvancedFilterMode = checked;
        roundsetFilterSettings.roundsetBasicFilter = null;
        roundsetFilterSettings.roundsetFilteredBloons = [];
        logicSelectorDiv.style.display = checked ? 'flex' : 'none';
        buildBloonFilters();
    });
    advancedToggleDiv.appendChild(advancedToggle);

    let bloonsFileredDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-start'], style: { gap: '8px' } });
    container.appendChild(bloonsFileredDiv);

    let filtersContentDiv = createEl('div', { classList: ['d-flex', 'jc-center'], style: { gap: '6px', flexWrap: 'wrap' } });
    bloonsFileredDiv.appendChild(filtersContentDiv);

    // let bloonsSelectorDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-center'], style: { gap: '6px', flexWrap: 'wrap' } });
    // bloonsFileredDiv.appendChild(bloonsSelectorDiv);

    let bloons = ["Red", "Blue", "Green", "Yellow", "Pink", "Black", "White", "Purple", "Lead", "Zebra", "Rainbow", "Ceramic"];
    let blimps = ["Moab", "Bfb", "Zomg", "DdtCamo", "Bad"];


    const createBloonTypeBtn = (bloonType) => {
        let bloonDiv = createEl('div', {
            classList: ['pointer'],
            style: { 
                backgroundImage: `url(../Assets/UI/StatsTabBlue.png)`,
                backgroundSize: 'contain',
                width: '60px', 
                height: '60px' 
            },
        }) 
        
        let bloonImg = createEl('img', {
            classList: ['bloon-filter-img'],
            style: {
                width: '50px', 
                height: '50px',
                padding: '5px',
                objectFit: 'contain',
            },
            src: `../Assets/BloonIcon/${bloonType}.png`
        })
        bloonDiv.appendChild(bloonImg);

        if (roundsetFilterSettings.roundsetFilteredBloons.includes(bloonType)) {
            bloonDiv.style.backgroundImage = `url(../Assets/UI/StatsTabYellow.png)`;
        }

        bloonDiv.addEventListener('click', () => {
            let arr = roundsetFilterSettings.roundsetFilteredBloons;
            if (arr.includes(bloonType)) {
                roundsetFilterSettings.roundsetFilteredBloons = arr.filter(b => b !== bloonType);
                bloonDiv.style.backgroundImage = `url(../Assets/UI/StatsTabBlue.png)`;
            } else {
                arr.push(bloonType);
                bloonDiv.style.backgroundImage = `url(../Assets/UI/StatsTabYellow.png)`;
            }
        });
        return bloonDiv;
    }

    function buildBloonFilters() {
        filtersContentDiv.innerHTML = "";

        if(!roundsetFilterSettings.roundsetAdvancedFilterMode){
            const basicFilters = {
                "Any Camo": "GreenCamo",
                "Any Regrow": "PinkRegrow",
                "Any Fortified": "CeramicFortified",
                "Purple": "Purple",
                "Lead & DDT": "Lead",
                "MOAB-Class": "Moab"
            };
            let basicFiltersDiv = createEl('div', { classList: ['d-flex','ai-center'], style: { gap:'6px', flexWrap:'wrap' } });
            Object.keys(basicFilters).forEach(label => {
                let wrapper = createEl('div', { classList:['d-flex','ai-center'], style:{ gap:'2px', width:'250px' } });
                let iconHolder = createEl('div', {
                    classList:['pointer'],
                    style:{
                        backgroundImage:`url(../Assets/UI/StatsTabBlue.png)`,
                        backgroundSize:'contain',
                        width:'60px',
                        height:'60px'
                    }
                });
                wrapper._iconHolder = iconHolder;
                let img = createEl('img', {
                    classList:['bloon-filter-img'],
                    style:{ width:'50px', height:'50px', padding:'5px', objectFit:'contain' },
                    src:`../Assets/BloonIcon/${basicFilters[label]}.png`
                });
                iconHolder.appendChild(img);
                let txt = createEl('p', { classList:['black-outline'], style:{ fontSize:'20px' }, innerHTML: label });
                wrapper.appendChild(iconHolder);
                wrapper.appendChild(txt);
                if (roundsetFilterSettings.roundsetBasicFilter === label) {
                    iconHolder.style.backgroundImage = `url(../Assets/UI/StatsTabYellow.png)`;
                }
                basicFiltersDiv.appendChild(wrapper);
                wrapper.addEventListener('click', () => {
                    if (roundsetFilterSettings.roundsetBasicFilter === label) {
                        roundsetFilterSettings.roundsetBasicFilter = null;
                        iconHolder.style.backgroundImage = `url(../Assets/UI/StatsTabBlue.png)`;
                    } else {
                        Array.from(basicFiltersDiv.children).forEach(w => {
                            if (w._iconHolder) {
                                w._iconHolder.style.backgroundImage = `url(../Assets/UI/StatsTabBlue.png)`;
                            }
                        });
                        roundsetFilterSettings.roundsetBasicFilter = label;
                        iconHolder.style.backgroundImage = `url(../Assets/UI/StatsTabYellow.png)`;
                    }
                });
            });
            filtersContentDiv.appendChild(basicFiltersDiv);
        } else {
            let all = [];
            bloons.forEach(b => {
                all.push(b, `${b}Regrow`, `${b}Camo`, `${b}RegrowCamo`);
            });
            let fortifiedBlimps = blimps.map(blimp => `${blimp}Fortified`);
            fortifiedBlimps[3] = "DdtFortifiedCamo";
            let bottomDivTop = ["LeadFortified","LeadFortifiedCamo","CeramicFortified","CeramicFortifiedCamo", ...blimps];
            let bottomDivBottom = ["LeadRegrowFortified","LeadRegrowFortifiedCamo","CeramicRegrowFortified","CeramicRegrowFortifiedCamo", ...fortifiedBlimps];

            let allDiv = createEl('div', { classList:['d-flex','ai-center'], style:{ gap:'6px', flexWrap:'wrap', width:'530px' } });
            all.forEach(b => allDiv.appendChild(createBloonTypeBtn(b)));
            filtersContentDiv.appendChild(allDiv);

            let bottomDiv = createEl('div', { classList:['d-flex','ai-center','jc-center'], style:{ gap:'6px', flexWrap:'wrap' } });
            let topRow = createEl('div', { classList:['d-flex','ai-center'], style:{ gap:'6px', flexWrap:'wrap' } });
            bottomDivTop.forEach(b => topRow.appendChild(createBloonTypeBtn(b)));
            bottomDiv.appendChild(topRow);
            let bottomRow = createEl('div', { classList:['d-flex','ai-center'], style:{ gap:'6px', flexWrap:'wrap' } });
            bottomDivBottom.forEach(b => bottomRow.appendChild(createBloonTypeBtn(b)));
            bottomDiv.appendChild(bottomRow);
            filtersContentDiv.appendChild(bottomDiv);
        }
    }
    buildBloonFilters();

    const footer = createEl('div', { classList: ['d-flex', 'jc-end'], style: { marginTop: '8px', gap: '10px' } });
    const closeBtn = createEl('div', {
        classList: ['maps-progress-view', 'black-outline', 'pointer'],
        innerHTML: 'Apply',
        style: { padding: '6px 14px', filter: "hue-rotate(270deg)" }
    });

    closeBtn.addEventListener('click', () => {
        if (!currentRoundsetData) { closeModal && closeModal(); return; }
        if (roundsetFilterSettings.roundFilterEnd === null) {
            roundsetFilterSettings.roundFilterEnd = roundsetProcessed.rounds[roundsetProcessed.rounds.length - 1].roundNumber;
        }
        if (roundsetFilterSettings.roundFilterStart > roundsetFilterSettings.roundFilterEnd){
            const tmp = roundsetFilterSettings.roundFilterStart;
            roundsetFilterSettings.roundFilterStart = roundsetFilterSettings.roundFilterEnd;
            roundsetFilterSettings.roundFilterEnd = tmp;
        }

        applyRoundFilters(type);

        generateRounds(currentRoundsetView, roundsetFilterSettings.roundsetReversed);

        const previewInput = document.getElementById('select-round-num-preview');
        if (previewInput){
            previewInput.min = roundsetFilterSettings.roundFilterStart;
            previewInput.max = roundsetFilterSettings.roundFilterEnd;
            let curNum = roundsetProcessed.rounds[currentPreviewRound].roundNumber;
            if (!isRoundInFilter(curNum)){
                currentPreviewRound = roundsetFilterSettings.roundFilterStart - 1;
                previewInput.value = roundsetFilterSettings.roundFilterStart;
                updatePreviewRoundTimeline();
            }
        }
        closeModal && closeModal();
        goBack();
    });
    footer.appendChild(closeBtn);
    container.appendChild(footer);

    createModal({
        header: 'Roundset Settings',
        content: container
    });

    return container;
}


function isRoundInFilter(roundNumber){
    return roundNumber >= roundsetFilterSettings.roundFilterStart && roundNumber <= (roundsetFilterSettings.roundFilterEnd ?? Infinity);
}

function indexOfRoundNumberOrNearest(target){
    const rounds = roundsetProcessed?.rounds ?? [];
    if (rounds.length === 0) return -1;

    const exact = rounds.findIndex(r => r.roundNumber === target);
    if (exact !== -1) return exact;

    return rounds.reduce((bestIdx, r, i) => {
        const best = rounds[bestIdx].roundNumber;
        const dBest = Math.abs(best - target);
        const dCur = Math.abs(r.roundNumber - target);
        return (dCur < dBest || (dCur === dBest && r.roundNumber < best)) ? i : bestIdx;
    }, 0);
}

function isFiltersActive(){
    if (!currentRoundsetData) return false;

    const lastRound = currentRoundsetData.rounds[currentRoundsetData.rounds.length - 1]?.roundNumber ?? Infinity;
    const endIsDefault = (roundsetFilterSettings.roundFilterEnd == null) || (roundsetFilterSettings.roundFilterEnd === lastRound);
    const bossOnlyModifiedActive = (constants.roundSets[selectedRoundset]?.type === 'boss') && !!roundsetFilterSettings.roundsetShowModified;

    const conditions = [
        roundsetFilterSettings.roundFilterStart !== 1,
        !endIsDefault,
        roundsetFilterSettings.roundFilterPreset !== 'All',
        roundsetFilterSettings.roundsetBasicFilter !== null,
        (roundsetFilterSettings.roundsetFilteredBloons?.length ?? 0) > 0,
        roundsetFilterSettings.roundsetAdvancedFilterMode === true,
        bossOnlyModifiedActive,
        roundsetFilterSettings.roundsetReversed === true,
    ];

    return conditions.some(Boolean);
}