let constants = {}

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

fetch('./data/Constants.json')
    .then(response => response.json())
    .then(data => {
        constants = data;
        generateRoundsets()
    })
    .catch(error => {
        console.error('Error:', error)
        errorModal(error, "js")
});

function showLoading(){
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

function hideLoading(){
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
title.innerHTML = 'Bloons TD 6 Roundsets';
headerDiv.appendChild(title);

const content = document.createElement('div');
content.classList.add('content');
container.appendChild(content);

const leaderboards = document.createElement('div');
leaderboards.id = "extras-content"
leaderboards.classList.add('extras', 'content-div');
leaderboards.style.display = "flex";
content.appendChild(leaderboards);

const roundsetsContent = document.createElement('div');
roundsetsContent.id = "roundset-content"
roundsetsContent.classList.add('roundset', 'sub-content-div');
content.appendChild(roundsetsContent);

function generateRoundsets() {
    let roundsetsContent = document.getElementById('extras-content');
    roundsetsContent.innerHTML = "";

    let roundsetPage = document.createElement('div');
    roundsetPage.classList.add('progress-page', 'page-extra');
    roundsetsContent.appendChild(roundsetPage);

    let roundsetHeadertext = document.createElement('p');
    roundsetHeadertext.classList.add('roundset-header-text', 'black-outline');
    roundsetHeadertext.innerHTML = "Select a roundset to view:";
    roundsetPage.appendChild(roundsetHeadertext);

    let selectorsDiv = document.createElement('div');
    selectorsDiv.classList.add('selectors-div');
    roundsetPage.appendChild(selectorsDiv);

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
            showRoundsetModel('extras', data.roundset);
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
            updateTimer(new Date(data.end), roundsetText2.id);
            timerInterval = setInterval(() => updateTimer(new Date(data.end), roundsetText2.id), 1000)
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
            showRoundsetModel('extras', roundset);
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

    // let legendsRoundsetText = document.createElement('p');
    // legendsRoundsetText.classList.add('other-roundsets-selector-text', 'black-outline');
    // legendsRoundsetText.innerHTML = "Legends Custom Rounds";
    // selectorsDiv.appendChild(legendsRoundsetText);

    Object.entries(legendsRoundsets).forEach(([roundset, data]) => {
        let roundsetDiv = document.createElement('div');
        roundsetDiv.classList.add('roundset-selector-div','veteran-container'); 
        roundsetDiv.addEventListener('click', () => {
            showLoading();
            showRoundsetModel('extras', roundset);
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
            showRoundsetModel('extras', roundset);
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
            showRoundsetModel('extras', roundset);
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
            showRoundsetModel('extras', data.roundset);
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
            updateTimer(new Date(data.end), roundsetText2.id);
            timerInterval = setInterval(() => updateTimer(new Date(data.end), roundsetText2.id), 1000)
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
            showRoundsetModel('extras', roundset);
        })
        skuRoundsetsDiv.appendChild(roundsetDiv);

        let roundsetText = document.createElement('p');
        roundsetText.classList.add('sku-roundset-selector-text', 'black-outline');
        roundsetText.innerHTML = roundset;
        roundsetDiv.appendChild(roundsetText);
    });

    let roundsetDescriptionText = document.createElement('p');
    roundsetDescriptionText.classList.add('sku-roundset-selector-desc');
    roundsetDescriptionText.style.textAlign = "center";
    roundsetDescriptionText.innerHTML = `This is a standalone form of the roundset viewer from a project called Bloons TD 6 API Explorer which allows you to view current and previous event data available on the API as well as track your progress. You can view it here: <a href="https://BTD6APIExplorer.github.io">Bloons TD 6 API Explorer</a>`;
    roundsetPage.appendChild(roundsetDescriptionText);

}

async function showRoundsetModel(source, roundset) {
    let roundsetContent = document.getElementById('roundset-content');
    roundsetContent.style.display = "flex";
    roundsetContent.innerHTML = "";
    document.getElementById(`${source}-content`).style.display = "none";
    resetScroll();

    let roundsetData = await fetch(`./data/${roundset}.json`).then(response => response.json());
    let roundsetType = "unknown";
    if(constants.roundSets[roundset]) {
        roundsetType = constants.roundSets[roundset].type;
    }
    // Might be used later for other roundsets that use the addToRound feature, but for now obsolete.
    // if (roundsetType == "boss") {
    //     let defaultRoundsetData = await fetch(`./data/DefaultRoundSet.json`).then(response => response.json());
    //     roundsetProcessed =  processRoundset(defaultRoundsetData, roundsetData);
    // } else {
    //     roundsetProcessed =  processRoundset(roundsetData);
    // }
    roundsetProcessed = addRoundHints(roundset, roundsetData);
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
        roundsetContent.style.display = "none";
        document.getElementById(`${source}-content`).style.display = "flex";
    })
    rightDiv.appendChild(modalClose);

    if(roundset.startsWith("Rogue")) {
        let rogueHeaderBar = document.createElement('div');
        rogueHeaderBar.classList.add('d-flex', 'jc-evenly');
        headerBar.appendChild(rogueHeaderBar);

        let rogueRoundsets = ["RogueRoundSet", "RogueBloonierSet", "RogueDenseSet",  "RoguePinkSet", "RoguePurpleSet", "RogueImmuneSet", "RogueLeadSet"]

        rogueRoundsets.forEach(rs => {
            let roundsetDiv = document.createElement('div');
            roundsetDiv.classList.add('pointer');
            roundsetDiv.addEventListener('click', () => {
                showLoading();
                showRoundsetModel(source, rs);
            })
            rogueHeaderBar.appendChild(roundsetDiv);

            if (rs == roundset) {
                roundsetDiv.style.border = "5px #00ff00 solid";
                roundsetDiv.style.borderRadius = "20px";
            }

            let roundsetIcon = document.createElement('img');
            roundsetIcon.classList.add('roundset-header-rogue-img');
            roundsetIcon.style.width = "100px";
            roundsetIcon.src = `../Assets/UI/${rs}.png`;
            roundsetDiv.appendChild(roundsetIcon);
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

    let mapsProgressFilter = document.createElement('div');
    mapsProgressFilter.classList.add('maps-progress-filter');
    mapsProgressHeaderBar.appendChild(mapsProgressFilter);

    let mapProgressFilterDifficulty = document.createElement('div');
    mapProgressFilterDifficulty.classList.add('map-progress-filter-difficulty');

    let mapsProgressFilterDifficultyText = document.createElement('p');
    mapsProgressFilterDifficultyText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapProgressFilterDifficulty.appendChild(mapsProgressFilterDifficultyText);

    let onlyModifiedToggleInput = document.createElement('input');
    onlyModifiedToggleInput.id = "roundset-modified-checkbox"
    onlyModifiedToggleInput.classList.add('maps-progress-coop-toggle-input');
    onlyModifiedToggleInput.type = 'checkbox';
    mapProgressFilterDifficulty.appendChild(onlyModifiedToggleInput);

    if (roundsetType == "boss") {
        currentModifiedRounds = [];
        roundsetProcessed.rounds.forEach((round, index) => {
            if (round.hasOwnProperty("modified")) {
                currentModifiedRounds.push(round.roundNumber);
            }
        });
        onlyModifiedToggleInput.checked = true;
        mapsProgressFilter.appendChild(mapProgressFilterDifficulty);

        mapsProgressFilterDifficultyText.innerHTML = "Only Modified:";
        roundPreviewFilterType = "modified";

        previewModified = onlyModifiedToggleInput;
    } else if (roundsetType == "quest") {
        currentModifiedRounds = [];
        roundsetProcessed.rounds.forEach((round, index) => {
            if(round.roundNumber > constants.roundSets[roundset].endRound) { return; }
            currentModifiedRounds.push(round.roundNumber);
        });
        mapsProgressFilterDifficultyText.innerHTML = "Hide Unused:";
        roundPreviewFilterType = "unused";
        currentRoundsetEndRound = constants.roundSets[roundset].endRound;
        mapsProgressFilter.appendChild(mapProgressFilterDifficulty);
        onlyModifiedToggleInput.checked = true;

        previewModified = onlyModifiedToggleInput;
    } else  {
        previewModified = null;
    }

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    mapsProgressFilter.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText.innerHTML = "Reverse:";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.id = "roundset-reverse-checkbox"
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);


    let roundsContent = document.createElement('div');
    roundsContent.id = 'rounds-content';
    roundsContent.classList.add('rounds-content');
    roundsetContent.appendChild(roundsContent);

    mapsProgressGrid.addEventListener('click', () => {
        mapsProgressGrid.classList.add('stats-tab-yellow');
        mapsProgressList.classList.remove('stats-tab-yellow');
        mapsProgressGame.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Simple";
        generateRounds(currentRoundsetView, mapsProgressCoopToggleInput.checked, onlyModifiedToggleInput.checked);
    })
    mapsProgressList.addEventListener('click', () => {
        mapsProgressList.classList.add('stats-tab-yellow');
        mapsProgressGrid.classList.remove('stats-tab-yellow');
        mapsProgressGame.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Topper";
        generateRounds(currentRoundsetView, mapsProgressCoopToggleInput.checked, onlyModifiedToggleInput.checked);
    })
    mapsProgressGame.addEventListener('click', () => {
        mapsProgressGame.classList.add('stats-tab-yellow');
        mapsProgressGrid.classList.remove('stats-tab-yellow');
        mapsProgressList.classList.remove('stats-tab-yellow');
        currentRoundsetView = "Preview";
        generateRounds(currentRoundsetView, mapsProgressCoopToggleInput.checked, onlyModifiedToggleInput.checked);
    })


    mapsProgressCoopToggleInput.addEventListener('change', () => {
        onChangeReverse(mapsProgressCoopToggleInput.checked)
    })
    onlyModifiedToggleInput.addEventListener('change', () => {
        onChangeModified(onlyModifiedToggleInput.checked)
    })
    currentPreviewRound = 0;
    currentRoundsetView = "Simple";
    generateRounds(currentRoundsetView, mapsProgressCoopToggleInput.checked, onlyModifiedToggleInput.checked)
    onChangeModified(onlyModifiedToggleInput.checked)
}

function processRoundset(data, defaultAppend){
    if(defaultAppend != null) {
        defaultAppend.rounds.forEach((round, index) => {
            let roundIndex = data.rounds.findIndex(round_b => round_b.roundNumber == round.roundNumber);
            if(round.addToRound) {
                if (roundIndex != -1) {
                    data.rounds[roundIndex].bloonGroups = data.rounds[roundIndex].bloonGroups.concat(round.bloonGroups);
                    data.rounds[roundIndex].addToRound = true;
                }
            } else {
                if (roundIndex != -1) {
                    data.rounds[roundIndex] = round;
                }
            }
        })
    }
    return data;
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

async function generateRounds(type, reverse, modified) {
    let roundsContent = document.getElementById('rounds-content');
    roundsContent.innerHTML = "";

    //get if all the round numbers don't have any gaps between them
    let roundsetHasNoGaps = true;
    let roundsetHasNoGapsArray = [];
    roundsetProcessed.rounds.forEach((round, index) => {
        roundsetHasNoGapsArray.push(round.roundNumber);
    });
    for (let i = 0; i < roundsetHasNoGapsArray.length; i++) {
        if (roundsetHasNoGapsArray[i] != i + 1) {
            roundsetHasNoGaps = false;
            break;
        }
    }

    switch(type) {
        case "Simple":
            resetPreview();
            let alternate = false;
            roundsetProcessed.rounds.forEach(async (round, index) => {
                // if (modified && !round.hasOwnProperty("addToRound")) { return; }
                let roundDiv = document.createElement('div');
                roundDiv.id = `round-${round.roundNumber}`;
                roundDiv.classList.add('round-div');
                if (alternate) { roundDiv.classList.add('round-div-alt') }
            
                let roundNumber = document.createElement('p');
                roundNumber.classList.add('round-number', 'black-outline');
                roundNumber.innerHTML = round.roundNumber;
                roundDiv.appendChild(roundNumber);
            
                let roundBloonGroups = document.createElement('div');
                roundBloonGroups.id = `round-${round.roundNumber}-groups`;
                roundBloonGroups.classList.add('round-bloon-groups');
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
                roundsContent.appendChild(roundDiv);
                alternate = !alternate;
            })
            if (document.getElementById('roundset-reverse-checkbox').checked) { onChangeReverse() }
            if (previewModified != null && previewModified.checked) { onChangeModified(true) }
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
                let roundDiv = document.createElement('div');
                roundDiv.id = `round-${round.roundNumber}`;
                roundDiv.classList.add('round-div-detailed');
                if (reverse) { roundDiv.classList.add('round-div-reverse') }

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

                if(round.hint) {
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
            if (document.getElementById('roundset-reverse-checkbox').checked) { onChangeReverse() }
            if (previewModified != null && previewModified.checked) { onChangeModified(true) }
            }, 0)
            break;
        case "Preview":
            resetPreview();
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
            selectRoundNum.max = roundsetProcessed.rounds.length;
            selectRoundNum.value = currentPreviewRound + 1;
            selectRoundNum.addEventListener('change', () => {
                if (selectRoundNum.value < 1) { selectRoundNum.value = 1 }
                if (selectRoundNum.value > roundsetProcessed.rounds.length) { selectRoundNum.value = roundsetProcessed.rounds.length }
                roundNumber.innerHTML = `Round ${roundsetProcessed.rounds[currentPreviewRound].roundNumber}`;
                currentPreviewRound = selectRoundNum.value - 1;
                updatePreviewRoundTimeline()
            })
            previewHeader.appendChild(selectRoundNum);
            
            let previewRightDiv = document.createElement('div');
            previewRightDiv.classList.add('preview-right-div');
            previewHeader.appendChild(previewRightDiv);

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
            previewFooterDiv.classList.add('preview-footer-div');
            previewDiv.appendChild(previewFooterDiv);

            let difficultyDiv = document.createElement('div');
            difficultyDiv.classList.add('difficulty-div');
            previewFooterDiv.appendChild(difficultyDiv);

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
            previewFooterDiv.appendChild(nextPrevDiv);

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
                selectRoundNum.value = currentPreviewRound + 1;
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
                selectRoundNum.value = currentPreviewRound + 1;
                clearPreview();
                updatePreviewRoundTimeline()
            })
            nextPrevDiv.appendChild(nextRound);
            
            let roundInfoDiv = document.createElement('div');
            roundInfoDiv.id = 'preview-round-info-div';
            roundInfoDiv.classList.add('round-info-div');
            previewDiv.appendChild(roundInfoDiv);

            ctx = canvas.getContext('2d');

            let lastFrameTime = performance.now();

            function previewRender() {
                if (!previewActive) {
                    return;
                }

                const now = performance.now();
                const deltaTime = (now - lastFrameTime) / 1000;
                lastFrameTime = now;
                
                update(deltaTime);
                render();
                requestAnimationFrame(previewRender);
            }

            previewActive = true;

            requestAnimationFrame(previewRender);

            if (previewModified != null && previewModified.checked) { onChangeModified(true) }
            updatePreviewRoundTimeline()
            if (document.getElementById('roundset-reverse-checkbox').checked) { onChangeReverse() }
            break;
    }
}

function onChangeModified(modified) {
    switch(currentRoundsetView) {
        case "Simple":
            let alternate = false;
            roundsetProcessed.rounds.forEach(async (round, index) => {
                let roundDiv = document.getElementById(`round-${round.roundNumber}`);
                if (modified && roundPreviewFilterType === "modified" && !round.hasOwnProperty("modified")) {
                    roundDiv.style.display = "none";
                } else if (modified && roundPreviewFilterType === "unused" && round.roundNumber > currentRoundsetEndRound) {
                    roundDiv.style.display = "none";
                } else {
                    roundDiv.style.display = "flex";
                    if (alternate) { roundDiv.classList.add('round-div-alt') } else if (Array.from(roundDiv.classList).includes('round-div-alt')) { roundDiv.classList.remove('round-div-alt') }
                    alternate = !alternate;
                }
            })
            break;
        case "Topper":
            roundsetProcessed.rounds.forEach(async (round, index) => {
                let roundDiv = document.getElementById(`round-${round.roundNumber}`);
                if (modified && roundPreviewFilterType === "modified" && !round.hasOwnProperty("modified")) {
                    roundDiv.style.display = "none";
                } else if (modified && roundPreviewFilterType === "unused" && round.roundNumber > currentRoundsetEndRound) {
                    roundDiv.style.display = "none";
                } else {
                    roundDiv.style.display = "flex";
                }
            })
            break;
        case "Preview":
            switch(roundPreviewFilterType){
                case "modified":
                    if(modified) {
                        currentIndexInModifiedRounds = 0;
                        currentPreviewRound = currentModifiedRounds[0] - 1;
                        document.getElementById('round-number-preview').innerHTML = `Round ${currentModifiedRounds[0]}`;
                        document.getElementById('select-round-num-preview').value = currentModifiedRounds[0];
                        updatePreviewRoundTimeline()
                    } else {
                        currentPreviewRound = 0;
                        document.getElementById('round-number-preview').innerHTML = `Round ${currentPreviewRound + 1}`;
                        document.getElementById('select-round-num-preview').value = currentPreviewRound + 1;
                        updatePreviewRoundTimeline()
                    }
                    break;
                case "unused":
                    if(modified) {
                        if (currentRoundsetEndRound < currentPreviewRound + 1) {
                            currentPreviewRound = 0;
                            document.getElementById('round-number-preview').innerHTML = `Round ${currentPreviewRound + 1}`;
                            document.getElementById('select-round-num-preview').value = currentPreviewRound + 1;
                            updatePreviewRoundTimeline()
                        }
                    } else {
                        currentPreviewRound = 0;
                        document.getElementById('round-number-preview').innerHTML = `Round ${currentPreviewRound + 1}`;
                        document.getElementById('select-round-num-preview').value = currentPreviewRound + 1;
                        updatePreviewRoundTimeline()
                    }
                    break;
            }
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

    if(round.hint) {
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
    if (document.getElementById('roundset-reverse-checkbox').checked) { onChangeReverse() }
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

function resetPreview() {
    previewActive = false;
    clearPreview();
}

function copyLoadingIcon(destination){
    let clone = document.getElementsByClassName('loading-icon')[0].cloneNode(true)
    clone.classList.add('loading-icon-leaderboard');
    clone.style.height = "unset"
    destination.appendChild(clone)
}

function changeHexBGColor(color){
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


function ratioCalc(unknown, x1, x2, y1, y2){
    switch(unknown){
        case 1:
            // x1/x2 == y1/y2
            return x2 * (y1/y2)
        case 2:
            // x1/x2 == y1/y2
            return x1 * (y2/y1)
        case 3:
            // x1/x2 == y1/y2
            return y2 * (x1/x2)
        case 4:
            // x1/x2 == y1/y2
            return y1 * (x2/x1)
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
    modalHeaderText.classList.add('error-modal-header-text','black-outline');
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

    let modalContent2  = document.createElement('div');
    modalContent2.classList.add('error-modal-content');
    switch(body) {
        case "Invalid user ID / Player Does not play this game":
            modalContent2.innerHTML = "Please try again or create a new Open Access Key.";
            modal.appendChild(modalContent2);
            break;
    }

    if(source == "ratelimit") {
        let mapsProgressCoopToggle = document.createElement('div');
        mapsProgressCoopToggle.classList.add('error-toggle-div');  
        modal.appendChild(mapsProgressCoopToggle);

        let mapsProgressCoopToggleText = document.createElement('p');
        mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
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
