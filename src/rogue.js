let constants = {}
let locJSON = {}
let rogueJSON = {}

let rogueSaveData = {
    extractedArtifacts: [],
    imageOptions: {
        avatar: "ProfileAvatar01.png",
        banner: "ProfileBanner48.png",
        name: null,
        sort: "Rarity (Ascending)"
    },
    selectedOAK: false,
    clickToCollect: false,
    artifactFilter: "All",
    artifactSort: "Name"
}

let starterArtifacts = ['BouncingProjectiles3', 'CeramicChunker2', 'FrostedTips1', 'OneShot2', 'SlowerIsHarder1', 'SpiritOfAdventure2', 'SwellingSpikes1', 'Wackywibblywavey1']
let bossArtifacts = ['EssenceOfBloonarius1','EssenceOfVortex1','EssenceOfDreadbloon1','EssenceOfPhayze1','EssenceOfBlastapopoulos1']

let starterKitNames = {
    "Quincy": "Quincy",
    "Cyber Quincy": "Cyber Quincy",
    "Wolfpack Quincy": "Wolfpack Quincy",
    "Gwendolin": "Gwendolin",
    "CircusGwendolin": "Circus Gwendolin",
    "Scientist Gwendolin": "Scientist Gwendolin",
    "StrikerJones": "Striker Jones",
    "Biker Bones": "Biker Bones",
    "Octo Jones": "Octo Jones",
    "ObynGreenfoot": "Obyn Greenfoot",
    "ObynOceanGuardian": "Ocean Guardian Obyn",
    "MoltenObyn": "Molten Obyn",
    "CaptainChurchill": "Captain Churchill",
    "Sentai Captain Churchill": "Sentai Churchill",
    "Sleigh Captain Churchill": "Sleigh Churchill",
    "Benjamin": "Benjamin",
    "BenJammin": "BenJammin",
    "SushiBento": "Sushi Bento",
    "PatFusty": "Pat Fusty",
    "FustyTheSnowman": "Fusty the Snowman",
    "KaijuPat": "Kaiju Pat",
    "Ezili": "Ezili",
    "SmudgeCatt": "Smudge Catt",
    "Galaxili": "Galaxili",
    "Adora": "Adora",
    "JoanOfArcAdora": "Joan of Arc Adora",
    "Voidora": "Voidora",
    "Etienne": "Etienne",
    "ETnEtienne": "ETn",
    "BookWyrmEtienne": "Book Wyrm Etienne",
    "Sauda": "Sauda",
    "VikingSauda": "Viking Sauda",
    "JiangshiSauda": "Jiangshi Sauda",
    "AdmiralBrickell": "Admiral Brickell",
    "DreadPirateBrickell": "Dread Pirate Brickell",
    "LifeguardBrickell": "Lifeguard Brickell",
    "Psi": "Psi",
    "Psimbals": "Psimbals",
    "DreamstatePsi": "Dreamstate Psi",
    "Geraldo": "Geraldo",
    "GeraldoGentlemanGadgeteer": "Gentleman Gadgeteer Geraldo",
    "Corvus": "Corvus",
    "Rosalia": "Rosalia",
    "RosaliaTinkerfairy": "Rosalia Tinkerfairy"
}

let artifactDivMap = {};
let totalArtifactsTxt;

showLoading();
Promise.all([
    fetch('./data/Constants.json').then(response => response.json()),
    fetch('./data/English.json').then(response => response.json()),
    fetch('./data/rogueData.json').then(response => response.json()),
])
.then(([constantsJSON, englishData, rogueData]) => {
    constants = constantsJSON;
    locJSON = englishData;
    rogueJSON = rogueData;
    loadDataFromLocalStorage();
    postProcessRogueData();
    generateRogueSelectors();
})
.catch(error => {
    console.error('Error:', error);
    errorModal(error, "js");
});

function postProcessRogueData(){
    let unusedArtifacts = ['EssenceOfLych1', 'Token']
    for (let [hero, starterKit] of Object.entries(rogueJSON.heroStarterKits)){
        rogueJSON.artifacts[starterKit.artifact].starterKitHero = hero;
    }
    for (let artifact in rogueJSON.artifacts){
        if (artifact.startsWith("Boost")){
            delete rogueJSON.artifacts[artifact];
        }
    }
    for (let artifact of unusedArtifacts){
        delete rogueJSON.artifacts[artifact];
    }
}

function showLoading() {
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

let backButton = document.createElement('img');
backButton.src = '../Assets/UI/BackBtn.png';
backButton.classList.add('back-button');
backButton.addEventListener('click', () => {
    changeRogueTab('home');
})
headerDiv.appendChild(backButton);

const title = document.createElement('h1');
title.classList.add('title');
title.innerHTML = 'Rogue Legends Artifacts';
headerDiv.appendChild(title);

const content = document.createElement('div');
content.classList.add('content');
container.appendChild(content);

const rogue = document.createElement('div');
rogue.id = "rogue-content"
rogue.classList.add('content-div', 'extras');
rogue.style.display = "flex";
content.appendChild(rogue);

const artifacts = document.createElement('div');
artifacts.id = "artifacts-content"
artifacts.classList.add('extras', 'content-div');
artifacts.style.display = "none";
content.appendChild(artifacts);

const starterKits = document.createElement('div');
starterKits.id = "starter-kits-content"
starterKits.classList.add('extras', 'content-div');
starterKits.style.display = "none";
content.appendChild(starterKits);

let rogueImageWrapper = document.createElement('div');
rogueImageWrapper.classList.add('rogue-image-wrapper');
rogueImageWrapper.style.overflow = "hidden";
container.appendChild(rogueImageWrapper);

const rogueImageContent = document.createElement('div');
rogueImageContent.id = "rogue-image-content";
rogueImageContent.classList.add('rogue-image-content');
rogueImageContent.style.display = "none";
rogueImageContent.style.opacity = "0";
rogueImageWrapper.appendChild(rogueImageContent);

function changeRogueTab(selector){
    resetScroll();
    backButton.classList.add('visible');
    switch(selector){
        case 'Artifacts':
            rogue.style.display = 'none';
            artifacts.style.display = 'flex';
            generateRogueArtifacts();
            break;
        case 'Hero Starter Kits':
            rogue.style.display = 'none';
            starterKits.style.display = 'flex';
            generateRogueHeroStarterKits();
            break;
        case 'Export Image':
            rogue.style.display = 'none';
            artifacts.style.display = 'flex';
            generateImageBuilder();
            break;
        default: 
            rogue.style.display = 'flex';
            artifacts.style.display = 'none';
            starterKits.style.display = 'none';
            rogueImageContent.style.display = 'none';
            backButton.classList.remove('visible');
            break;
    }
}

function generateRogueSelectors() {
    hideLoading();

    let rogueSelectorsPage = document.createElement('div');
    rogueSelectorsPage.classList.add('progress-page','f-wrap');
    rogue.appendChild(rogueSelectorsPage);

    let rogueSelectors = document.createElement('div');
    rogueSelectors.classList.add('selectors-div');
    rogueSelectorsPage.appendChild(rogueSelectors);

    let rogueHeaderMessage = document.createElement('p');
    rogueHeaderMessage.classList.add('sku-roundset-selector-desc');
    rogueHeaderMessage.innerHTML = "Note: At this time, the artifacts you have extracted are not available via the BTD6 Open Data API. You must manually mark them as extracted. This data will be saved in the current browsers local storage, and will not be cleared unless you clear your browsing data. If you prefer to keep a backup, use Export/Import Data.";
    rogueSelectors.appendChild(rogueHeaderMessage);

    let selectors = {
        "Artifacts": "RoguePermanantArtifactsBtn",
        "Hero Starter Kits": "RogueStarterKitsBtn",
        "Export Image": "ArtifactShareBtn"
    }
    
    Object.entries(selectors).forEach(([selector, icon]) => {
        let selectorDiv = document.createElement('div');
        selectorDiv.classList.add('rogue-bg', 'd-flex', 'jc-between', 'ai-center', 'pointer');
        selectorDiv.style.margin = "10px";
        selectorDiv.addEventListener('click', () => {
            changeRogueTab(selector);
        })
        rogueSelectors.appendChild(selectorDiv);

        let selectorImg = document.createElement('img');
        selectorImg.classList.add('selector-img');
        selectorImg.src = '../Assets/UI/' + icon + '.png';
        selectorDiv.appendChild(selectorImg);

        let selectorText = document.createElement('p');
        selectorText.classList.add('selector-text','black-outline');
        selectorText.innerHTML = selector;
        selectorDiv.appendChild(selectorText);

        let selectorGoImg = document.createElement('img');
        selectorGoImg.classList.add('selector-go-img');
        selectorGoImg.src = '../Assets/UI/ContinueBtn.png';
        selectorDiv.appendChild(selectorGoImg);
    });

    let importExportDataDiv = document.createElement('div');
    importExportDataDiv.classList.add('d-flex', 'jc-evenly');
    rogueSelectors.appendChild(importExportDataDiv);

    let exportData = document.createElement('div');
    exportData.classList.add('d-flex', 'ai-center');
    exportData.style.gap = "10px";
    importExportDataDiv.appendChild(exportData);
    
    let exportDataText = document.createElement('p');
    exportDataText.classList.add('selector-text','black-outline');
    exportDataText.innerHTML = "Export Data";
    exportData.appendChild(exportDataText);

    let exportDataGoImg = document.createElement('img');
    exportDataGoImg.classList.add('selector-go-img', 'pointer');
    exportDataGoImg.style.width = "56px"
    exportDataGoImg.src = '../Assets/UI/DownloadBtn.png';
    exportData.appendChild(exportDataGoImg);

    exportDataGoImg.addEventListener('click', () => {
        downloadArtifactsSave();
    })

    let importData = document.createElement('div');
    importData.classList.add('d-flex', 'ai-center');
    importData.style.gap = "10px";
    importExportDataDiv.appendChild(importData);

    let importDataText = document.createElement('p');
    importDataText.classList.add('selector-text','black-outline');
    importDataText.innerHTML = "Import Data";
    importData.appendChild(importDataText);

    let importDataGoImg = document.createElement('img');
    importDataGoImg.classList.add('pointer');
    importDataGoImg.style.width = "56px"
    importDataGoImg.src = '../Assets/UI/UploadBtn.png';
    importData.appendChild(importDataGoImg);

    importDataGoImg.addEventListener('click', () => {
        importArtifactsSave();
    });

    let StandaloneSiteDiv = document.createElement('div');
    StandaloneSiteDiv.classList.add('site-access-div');
    rogueSelectorsPage.appendChild(StandaloneSiteDiv);

    let StandaloneSiteText = document.createElement('p');
    StandaloneSiteText.classList.add('site-info-header', 'sites-text', 'black-outline');
    StandaloneSiteText.innerHTML = 'Other Sites';
    StandaloneSiteDiv.appendChild(StandaloneSiteText);

    let siteButtons = document.createElement('div');
    siteButtons.classList.add('standalone-site-buttons');
    StandaloneSiteDiv.appendChild(siteButtons);

    let standaloneSites = {
        "Roundsets": {
            "link": "https://btd6apiexplorer.github.io/rounds",
            "text": "Roundsets",
            "icon": "DefaultRoundSetIcon",
            "background": "BloonsBG"
        },
        "Leaderboards": {
            "link": "https://btd6apiexplorer.github.io/leaderboards",
            "text": "Leaderboards",
            "icon": "LeaderboardSiteBtn",
            "background": "TrophyStoreTiledBG"
        },
        "Insta Tracker": {
            "link": "https://btd6apiexplorer.github.io/insta",
            "text": "Insta Tracker",
            "icon": "InstaSiteBtn",
            "background": "CollectionHelp2"
        },
        "Main Site": {
            "link": "https://btd6apiexplorer.github.io/",
            "text": "Main Site",
            "icon": "SiteBtn",
            "background": "OverviewProfile"
        }
    }

    Object.entries(standaloneSites).forEach(([site, data]) => {
        let siteButtonDiv = document.createElement('div');
        siteButtonDiv.classList.add('site-button-div', 'pointer');
        siteButtonDiv.style.backgroundImage = `url(Assets/UI/${data.background}.png)`;
        siteButtons.appendChild(siteButtonDiv);
        siteButtonDiv.addEventListener('click', () => {
            window.location.href = data.link;
        })
    
        let siteButtonIcon = document.createElement('img');
        siteButtonIcon.classList.add('site-button-icon');
        siteButtonIcon.src = `./Assets/UI/${data.icon}.png`;
        siteButtonDiv.appendChild(siteButtonIcon);
    
        let profileName = document.createElement('p');
        profileName.classList.add('profile-name','readability-bg','black-outline');
        profileName.style.marginLeft = '0';
        profileName.innerHTML = data.text;
        siteButtonDiv.appendChild(profileName);
    })
}

function generateRogueArtifacts() { 
    let artifactsContent = document.getElementById('artifacts-content');
    artifactsContent.innerHTML = "";

    let artifactPage = document.createElement('div');
    artifactPage.classList.add('content-div', 'progress');
    artifactsContent.appendChild(artifactPage);

    let rogueHeaderBar = document.createElement('div');
    rogueHeaderBar.classList.add('insta-monkeys-header-bar');
    artifactsContent.appendChild(rogueHeaderBar);

    let rogueViews = document.createElement('div');
    rogueViews.classList.add('maps-progress-views');
    rogueHeaderBar.appendChild(rogueViews);

    let rogueFiltersLabel = document.createElement('p');
    rogueFiltersLabel.classList.add('maps-progress-coop-toggle-text','black-outline');
    rogueFiltersLabel.classList.add('black-outline');
    rogueFiltersLabel.innerHTML = "Filter:";
    rogueViews.appendChild(rogueFiltersLabel);

    let mapProgressFilterDifficulty = document.createElement('div');
    mapProgressFilterDifficulty.classList.add('map-progress-filter-difficulty');
    rogueViews.appendChild(mapProgressFilterDifficulty);

    let mapProgressFilterDifficultySelect = document.createElement('select');
    mapProgressFilterDifficultySelect.classList.add('map-progress-filter-difficulty-select');

    let options = ["All","Extracted","Unextracted","Starter Kit","Non Starter Kit"]
    options.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect.appendChild(difficultyOption);
    })
    mapProgressFilterDifficulty.appendChild(mapProgressFilterDifficultySelect);

    let rogueSortDiv = document.createElement('div');
    rogueSortDiv.classList.add('d-flex');
    rogueHeaderBar.appendChild(rogueSortDiv);

    let rogueFiltersLabel2 = document.createElement('p');
    rogueFiltersLabel2.classList.add('maps-progress-coop-toggle-text','black-outline');
    rogueFiltersLabel2.classList.add('black-outline');
    rogueFiltersLabel2.innerHTML = "Sort:";
    rogueSortDiv.appendChild(rogueFiltersLabel2);

    let mapProgressFilterDifficulty2 = document.createElement('div');
    mapProgressFilterDifficulty2.classList.add('map-progress-filter-difficulty');
    rogueSortDiv.appendChild(mapProgressFilterDifficulty2);

    let mapProgressFilterDifficultySelect2 = document.createElement('select');
    mapProgressFilterDifficultySelect2.classList.add('map-progress-filter-difficulty-select');

    let options2 = ["Name","Rarity (Ascending)","Rarity (Descending)","Category"]
    options2.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect2.appendChild(difficultyOption);
    })
    mapProgressFilterDifficulty2.appendChild(mapProgressFilterDifficultySelect2);
    mapProgressFilterDifficultySelect.addEventListener('change', () => {
        rogueSaveData.artifactFilter = mapProgressFilterDifficultySelect.value;
        generateArtifacts();
        saveDataToLocalStorage();
    });
    mapProgressFilterDifficultySelect2.addEventListener('change', () => {
        rogueSaveData.artifactSort = mapProgressFilterDifficultySelect2.value;
        generateArtifacts();
        saveDataToLocalStorage();
    });

    let rogueclickToCollect = document.createElement('div');
    rogueclickToCollect.classList.add('maps-progress-coop-toggle');  
    rogueHeaderBar.appendChild(rogueclickToCollect);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText.innerHTML = "Easy Extract:";
    rogueclickToCollect.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggleInput.checked = rogueSaveData.clickToCollect;
    rogueclickToCollect.appendChild(mapsProgressCoopToggleInput);

    mapsProgressCoopToggleInput.addEventListener('change', () => {
        rogueSaveData.clickToCollect = mapsProgressCoopToggleInput.checked;
        saveDataToLocalStorage();
    })

    let instaMonkeysExtras = document.createElement('div');
    instaMonkeysExtras.classList.add('maps-progress-views', 'ai-center');
    rogueHeaderBar.appendChild(instaMonkeysExtras);

    let progressText = document.createElement('p');
    progressText.classList.add('rogue-progress-text','black-outline');
    progressText.innerHTML = `${rogueSaveData.extractedArtifacts.length}/${Object.keys(rogueJSON.artifacts).length}`;
    instaMonkeysExtras.appendChild(progressText);

    totalArtifactsTxt = progressText;
    
    let artifactBag = document.createElement('img');
    artifactBag.src = `../Assets/UI/ArtifactBag.png`;
    artifactBag.classList.add('artifact-bag');
    instaMonkeysExtras.appendChild(artifactBag);

    let artifactsContainer = document.createElement('div');
    artifactsContainer.id = 'artifacts-container';
    artifactsContainer.classList.add('insta-monkeys-progress-container');
    artifactsContent.appendChild(artifactsContainer);

    generateArtifacts();
}

function generateArtifacts() {
    let artifactsContainer = document.getElementById('artifacts-container');
    artifactsContainer.innerHTML = "";
    artifactDivMap = {};

    let artifactsDiv = document.createElement('div');
    artifactsDiv.classList.add('artifacts-div');
    artifactsContainer.appendChild(artifactsDiv);

    let mainArtifactsDiv = document.createElement('div');
    mainArtifactsDiv.classList.add('artifacts-div');
    artifactsDiv.appendChild(mainArtifactsDiv);

    // let bossArtifactsDiv = document.createElement('div');
    // bossArtifactsDiv.classList.add('artifacts-div');
    // artifactsDiv.appendChild(bossArtifactsDiv);

    // bossArtifacts.forEach(artifact => {
    //     bossArtifactsDiv.appendChild(generateArtifactContainer(rogueJSON.artifacts[artifact]));
    // });

    let artifacts = {...rogueJSON.artifacts}

    switch (rogueSaveData.artifactFilter) {
        case "Extracted":
            // artifacts = Object.fromEntries(Object.entries(artifacts).filter(([key, value]) => value.starterKitHero != null))
            artifacts = Object.fromEntries(Object.entries(artifacts).filter(([key, value]) => rogueSaveData.extractedArtifacts.includes(value.nameLocKey)))
            break;
        case "Unextracted":
            // artifacts = Object.fromEntries(Object.entries(artifacts).filter(([key, value]) => value.starterKitHero == null))
            artifacts = Object.fromEntries(Object.entries(artifacts).filter(([key, value]) => !rogueSaveData.extractedArtifacts.includes(value.nameLocKey)))
            break;
        case "Starter Kit":
            artifacts = Object.fromEntries(Object.entries(artifacts).filter(([key, value]) => value.hasOwnProperty('starterKitHero')))
            break;
        case "Non Starter Kit":
            artifacts = Object.fromEntries(Object.entries(artifacts).filter(([key, value]) => !value.hasOwnProperty('starterKitHero')))
            break;
    }

    switch (rogueSaveData.artifactSort) {
        case "Name":
            // artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => a[1].title.localeCompare(b[1].title)))
            break;
        case "Rarity (Ascending)":
            artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => a[1].tier - b[1].tier))
            break;
        case "Rarity (Descending)":
            artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => b[1].tier - a[1].tier))
            break;
        case "Category":
            artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => a[1].rarityFrameType.localeCompare(b[1].rarityFrameType)))
            break;
    }

    // bossArtifacts.forEach(artifact => {
    //     mainArtifactsDiv.appendChild(generateArtifactContainer(rogueJSON.artifacts[artifact]));
    // });

    Object.values(artifacts).forEach(artifact => {
        // if (starterArtifacts.includes(artifact.nameLocKey)) { return; }
        // if (bossArtifacts.includes(artifact.nameLocKey)) { return; }

        let artifactDiv = generateArtifactContainer(artifact);
        artifactDivMap[artifact.nameLocKey] = artifactDiv;
        artifactDiv.addEventListener('click', () => {
            if (rogueSaveData.clickToCollect && !starterArtifacts.includes(artifact.nameLocKey)) {
                if (rogueSaveData.extractedArtifacts.includes(artifact.nameLocKey)) {
                    rogueSaveData.extractedArtifacts = rogueSaveData.extractedArtifacts.filter(e => e !== artifact.nameLocKey);
                    artifactDiv.classList.add('artifact-unextracted');
                    if(totalArtifactsTxt){
                        totalArtifactsTxt.innerHTML = `${rogueSaveData.extractedArtifacts.length}/${Object.keys(rogueJSON.artifacts).length}`;
                    }
                    saveDataToLocalStorage();
                } else {
                    rogueSaveData.extractedArtifacts.push(artifact.nameLocKey);
                    artifactDiv.classList.remove('artifact-unextracted');
                    if(totalArtifactsTxt){
                        totalArtifactsTxt.innerHTML = `${rogueSaveData.extractedArtifacts.length}/${Object.keys(rogueJSON.artifacts).length}`;
                    }
                    saveDataToLocalStorage();
                }
            } else {
                generateArtifactPopout(artifact.nameLocKey);
            }
        })
        mainArtifactsDiv.appendChild(artifactDiv);
    });

    // let starterArtifactsDiv = document.createElement('div');
    // starterArtifactsDiv.classList.add('artifacts-div');
    // artifactsDiv.appendChild(starterArtifactsDiv);

    // if (rogueSaveData.artifactFilter != "Unextracted") {
    //     starterArtifacts.forEach(artifact => {

    //         let starterArtifactDiv = generateArtifactContainer(rogueJSON.artifacts[artifact]);
    //         starterArtifactDiv.addEventListener('click', () => {
    //             generateArtifactPopout(artifact);
    //         })
    //         starterArtifactsDiv.appendChild(starterArtifactDiv);
    //     });
    // }

    return artifactsDiv;
}

function generateArtifactContainer(artifact, type) {
    let artifactDiv = document.createElement('div');
    artifactDiv.classList.add('artifact-container');
    if (!rogueSaveData.extractedArtifacts.includes(artifact.nameLocKey) && !starterArtifacts.includes(artifact.nameLocKey) && type != "preview") {
        artifactDiv.classList.add('artifact-unextracted');
    }

    let artifactImg = document.createElement('img');
    artifactImg.src = `../Assets/RogueArtifacts/${artifact.icon}.png`;
    artifactImg.classList.add('artifact-img');
    artifactDiv.appendChild(artifactImg);

    let artifactFrame = document.createElement('img');
    artifactFrame.src = `../Assets/RogueFrames/${getFrameIconName(artifact)}.png`;
    artifactFrame.classList.add('artifact-frame');
    artifactDiv.appendChild(artifactFrame);

    if (type != "modal" && type != "preview") {
        tippy(artifactDiv, {
            content: `<p class="artifact-title">${artifact.title}</p>${artifact.description}`,
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
    }

    return artifactDiv;
}

function getFrameIconName(artifact) {
    let rarity = artifact.tier;
    switch (rarity) {
        case 0:
            rarity = "Normal";
            break;
        case 1:
            rarity = "Rare";
            break;
        case 2:
            rarity = "Legendary";
            break;
    }
    let frameIcon = artifact.rarityFrameType;
    if (frameIcon === "AllMonkeyTowerSets") {
        frameIcon = "AllTowers";
    }
    return `Rarity${rarity}Artifact${frameIcon}`;
}

function generateArtifactPopout(key) {
    let data = rogueJSON.artifacts[key];

    let modal;
    if(!document.getElementById('artifact-popout')){
        modal = document.createElement('div');
        modal.id = 'artifact-popout';
        modal.classList.add('error-modal-overlay');
        document.body.appendChild(modal);
    } else {
        modal = document.getElementById('artifact-popout');
        modal.innerHTML = "";
    }

    let modalContent = document.createElement('div');
    modalContent.classList.add('rogue-artifact-modal', 'rogue-bg');
    modal.appendChild(modalContent);

    let modalHeaderDiv = document.createElement('div');
    modalHeaderDiv.classList.add('collection-modal-header');
    modalHeaderDiv.style.backgroundColor = 'unset';
    modalContent.appendChild(modalHeaderDiv);

    let modalBody = document.createElement('div');
    modalBody.classList.add('rogue-modal-body');
    modalContent.appendChild(modalBody);

    let collectionHeaderModalLeft = document.createElement('div');
    collectionHeaderModalLeft.classList.add('collection-header-modal-left');
    modalHeaderDiv.appendChild(collectionHeaderModalLeft);

    if(data.rarityFrameType !== "AllMonkeyTowerSets"){
        let modalCategory = document.createElement('img');
        modalCategory.src = `../Assets/UI/${data.rarityFrameType}Icon.png`;
        modalCategory.classList.add('rogue-modal-category');
        collectionHeaderModalLeft.appendChild(modalCategory);
    }

    let modalTitle = document.createElement('p');
    modalTitle.classList.add('collection-modal-header-text','black-outline', 'd-flex', 'ai-center');
    modalTitle.style.padding = "unset";
    modalTitle.style.height = "64px";
    modalTitle.innerHTML = data.title;
    modalHeaderDiv.appendChild(modalTitle);

    let modalClose = document.createElement('img');
    modalClose.classList.add('collection-modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        modal.remove();
    })
    modalHeaderDiv.appendChild(modalClose);

    let modalTop = document.createElement('div');
    modalTop.classList.add('d-flex', 'rogue-modal-top');
    modalBody.appendChild(modalTop);

    let imgAndDetails = document.createElement('div');
    imgAndDetails.classList.add('d-flex');
    modalTop.appendChild(imgAndDetails);

    let itemDiv = document.createElement('div');
    itemDiv.classList.add('modal-trophy-div');
    imgAndDetails.appendChild(itemDiv);

    let artifactDiv = generateArtifactContainer(data, 'modal');
    itemDiv.appendChild(artifactDiv);

    if (!starterArtifacts.includes(key)) {
        let extractedCheckDiv = document.createElement('div');
        extractedCheckDiv.classList.add('extracted-check-div', 'd-flex', 'jc-center');

        let mapsProgressCoopToggleText = document.createElement('p');
        mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
        mapsProgressCoopToggleText.innerHTML = "Extracted:";
        extractedCheckDiv.appendChild(mapsProgressCoopToggleText);

        let mapsProgressCoopToggleInput = document.createElement('input');
        mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
        mapsProgressCoopToggleInput.style.backgroundColor = "rgba(0,0,0,0.36)";
        mapsProgressCoopToggleInput.type = 'checkbox';
        mapsProgressCoopToggleInput.checked = rogueSaveData.extractedArtifacts.includes(data.nameLocKey);
        extractedCheckDiv.appendChild(mapsProgressCoopToggleInput);
    }

    let itemDetailsDiv = document.createElement('div');
    itemDetailsDiv.classList.add('item-details-div','jc-center','fg-1');
    itemDetailsDiv.style.margin = "10px"
    imgAndDetails.appendChild(itemDetailsDiv);

    let itemDescription = document.createElement('p');
    itemDescription.classList.add('trophy-store-item-description', 'ta-center');
    itemDescription.style.marginBottom = "unset";
    itemDescription.innerHTML = data.description;
    itemDetailsDiv.appendChild(itemDescription);

    let itemObtainMethod = document.createElement('p');
    itemObtainMethod.classList.add('trophy-store-item-obtain-method', 'ta-center');
    itemObtainMethod.style.marginTop = "unset";
    itemDetailsDiv.appendChild(itemObtainMethod);

    let starterArtifactDiv = document.createElement('div');
    starterArtifactDiv.classList.add('d-flex');
    modalTop.appendChild(starterArtifactDiv);

    let starterArtifactDivImg = document.createElement('img');
    starterArtifactDivImg.src = `../Assets/UI/RoguePermanantArtifactsBtn.png`;
    starterArtifactDivImg.classList.add('hero-starter-kit-img', 'rogue-popout-starter-icon');
    starterArtifactDiv.appendChild(starterArtifactDivImg);

    let starterArtifactDivTextDiv = document.createElement('div');
    starterArtifactDivTextDiv.classList.add('item-details-div','jc-center','fg-1');
    starterArtifactDivTextDiv.style.margin = "10px"
    starterArtifactDiv.appendChild(starterArtifactDivTextDiv);

    let extractedCheckDiv;
    let mapsProgressCoopToggleInput;
    if (starterArtifacts.includes(key)) {
        let starterArtifactDivText = document.createElement('p');
        starterArtifactDivText.classList.add('font-gardenia', 'ta-center');
        starterArtifactDivText.innerHTML = `This artifact is a starter artifact.`;
        starterArtifactDivText.style.fontSize = "18px";
        starterArtifactDivTextDiv.appendChild(starterArtifactDivText);
    } else {
        extractedCheckDiv = document.createElement('div');
        extractedCheckDiv.classList.add('extracted-check-div', 'd-flex', 'jc-center');
        starterArtifactDivTextDiv.appendChild(extractedCheckDiv);

        let mapsProgressCoopToggleText = document.createElement('p');
        mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
        mapsProgressCoopToggleText.innerHTML = "Extracted:";
        extractedCheckDiv.appendChild(mapsProgressCoopToggleText);

        mapsProgressCoopToggleInput = document.createElement('input');
        mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
        mapsProgressCoopToggleInput.style.backgroundColor = "rgba(0,0,0,0.36)";
        mapsProgressCoopToggleInput.type = 'checkbox';
        mapsProgressCoopToggleInput.checked = rogueSaveData.extractedArtifacts.includes(data.nameLocKey);
        extractedCheckDiv.appendChild(mapsProgressCoopToggleInput);
    }

    if (data.hasOwnProperty('starterKitHero')) {
        let heroStarterKit = document.createElement('div');
        heroStarterKit.classList.add('d-flex');
        modalTop.appendChild(heroStarterKit);

        let heroStarterKitImg = document.createElement('img');
        heroStarterKitImg.src = `${getHeroIconCircle(data.starterKitHero.replace(/ /g, ''))}`;
        heroStarterKitImg.classList.add('hero-starter-kit-img', 'rogue-popout-starter-icon');
        heroStarterKit.appendChild(heroStarterKitImg);

        let heroStarterKitTextDiv = document.createElement('div');
        heroStarterKitTextDiv.classList.add('item-details-div','jc-center','fg-1');
        heroStarterKitTextDiv.style.margin = "10px"
        heroStarterKit.appendChild(heroStarterKitTextDiv);

        let heroStarterKitText = document.createElement('p');
        heroStarterKitText.classList.add('font-gardenia', 'ta-center');
        heroStarterKitText.innerHTML = `This artifact is available in ${starterKitNames[data.starterKitHero]}'s starter kit.`;
        heroStarterKitText.style.fontSize = "18px";
        heroStarterKitTextDiv.appendChild(heroStarterKitText);
    }

    let variants = []
    if(rogueJSON.artifacts.hasOwnProperty(data.baseId + "1")){
        variants.push(rogueJSON.artifacts[data.baseId + "1"])
    }
    if(rogueJSON.artifacts.hasOwnProperty(data.baseId + "2")){
        variants.push(rogueJSON.artifacts[data.baseId + "2"])
    }
    if(rogueJSON.artifacts.hasOwnProperty(data.baseId + "3")){
        variants.push(rogueJSON.artifacts[data.baseId + "3"])
    }

    let currentVariant;

    if(variants.length > 1){
        let otherVariants = document.createElement('div');
        otherVariants.classList.add('other-variants');
        modalBody.appendChild(otherVariants);

        let otherVariantsTitle = document.createElement('p');
        otherVariantsTitle.classList.add('other-variants-title','black-outline', 'ta-center');
        otherVariantsTitle.style.fontSize = "24px";
        otherVariantsTitle.innerHTML = "Other Variants";
        otherVariants.appendChild(otherVariantsTitle);

        let otherVariantsDiv = document.createElement('div');
        otherVariantsDiv.classList.add('other-variants-div', 'd-flex', 'jc-center');
        otherVariants.appendChild(otherVariantsDiv);

        variants.forEach(variant => {
            let variantDiv = generateArtifactContainer(variant, 'modal');
            variantDiv.addEventListener('click', () => {
                generateArtifactPopout(variant.nameLocKey);
            })
            otherVariantsDiv.appendChild(variantDiv);

            if (variant.nameLocKey === data.nameLocKey) {
                currentVariant = variantDiv;
            }
        })
    }
    let updateArtifactStatus = () => {
        if (rogueSaveData.extractedArtifacts.includes(data.nameLocKey)) {
            rogueSaveData.extractedArtifacts = rogueSaveData.extractedArtifacts.filter(e => e !== data.nameLocKey);
            artifactDiv.classList.add('artifact-unextracted');
            if(currentVariant){
                currentVariant.classList.add('artifact-unextracted');
            }
            if(artifactDivMap[data.nameLocKey]){
                artifactDivMap[data.nameLocKey].classList.add('artifact-unextracted');
            }
            if(totalArtifactsTxt){
                totalArtifactsTxt.innerHTML = `${rogueSaveData.extractedArtifacts.length}/${Object.keys(rogueJSON.artifacts).length}`;
            }
            mapsProgressCoopToggleInput.checked = false;
            saveDataToLocalStorage();
        } else {
            rogueSaveData.extractedArtifacts.push(data.nameLocKey);
            artifactDiv.classList.remove('artifact-unextracted');
            if(currentVariant){
                currentVariant.classList.remove('artifact-unextracted');
            }
            if(artifactDivMap[data.nameLocKey]){
                artifactDivMap[data.nameLocKey].classList.remove('artifact-unextracted');
            }
            if(totalArtifactsTxt){
                totalArtifactsTxt.innerHTML = `${rogueSaveData.extractedArtifacts.length}/${Object.keys(rogueJSON.artifacts).length}`;
            }
            mapsProgressCoopToggleInput.checked = true;
            saveDataToLocalStorage();
        }
    }
    if(!starterArtifacts.includes(key)){
        extractedCheckDiv.addEventListener('click', updateArtifactStatus)
        artifactDiv.addEventListener('click', updateArtifactStatus)
    }
}

function generateRogueHeroStarterKits() {
    let starterKitContent = document.getElementById('starter-kits-content');
    starterKitContent.innerHTML = "";

    let heroStarterKits = document.createElement('div');
    heroStarterKits.classList.add('artifacts-div', 'hero-starter-kits');
    starterKitContent.appendChild(heroStarterKits);

    Object.values(rogueJSON.heroStarterKits).forEach((starterKit) => {
        let starterKitDiv = document.createElement('div');
        starterKitDiv.classList.add('starter-kit-div');
        starterKitContent.appendChild(starterKitDiv);

        let starterKitHeroSquareImg = document.createElement('img');
        starterKitHeroSquareImg.src = `${getHeroSquareIcon(starterKit.heroID.replace(/ /g, ''))}`;
        starterKitHeroSquareImg.classList.add('starter-kit-hero-square-img');
        starterKitDiv.appendChild(starterKitHeroSquareImg);


        let artifactDiv = generateArtifactContainer(rogueJSON.artifacts[starterKit.artifact]);
        artifactDiv.addEventListener('click', () => {
            generateArtifactPopout(starterKit.artifact);
        })
        starterKitDiv.appendChild(artifactDiv);

        starterKit.startingInstas.forEach((instaMonkey) => {
            starterKitDiv.appendChild(generateInstaMonkeyContainer(instaMonkey));
        });

        heroStarterKits.appendChild(starterKitDiv);
    });
}

function generateInstaMonkeyContainer(instaMonkey) {
    let tower = instaMonkey.baseId;
    let tiers = JSON.parse(instaMonkey.tiers);

    let instaMonkeyTierContainer = document.createElement('div');
    instaMonkeyTierContainer.classList.add('insta-monkey-tier-container');

    let instaMonkeyTierImg = document.createElement('img');
    instaMonkeyTierImg.classList.add('insta-monkey-tier-img');
    instaMonkeyTierImg.src = getInstaMonkeyIcon(tower,tiers);
    instaMonkeyTierContainer.appendChild(instaMonkeyTierImg);

    let instaMonkeyTierText = document.createElement('p');
    instaMonkeyTierText.classList.add('insta-monkey-tier-text','black-outline');
    instaMonkeyTierText.innerHTML = `${tiers[0]}-${tiers[1]}-${tiers[2]}`;
    instaMonkeyTierContainer.appendChild(instaMonkeyTierText);
    
    return instaMonkeyTierContainer;
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

function generateImageBuilder() {
    let artifactsContent = document.getElementById('artifacts-content');
    artifactsContent.innerHTML = "";

    let rogueHeaderBar = document.createElement('div');
    rogueHeaderBar.classList.add('insta-monkeys-header-bar', 'fd-column');
    rogueHeaderBar.style.width = "auto";
    rogueHeaderBar.style.gap = "10px";
    rogueHeaderBar.style.padding = "10px";
    artifactsContent.appendChild(rogueHeaderBar);

    let headerText = document.createElement('p');
    headerText.classList.add('black-outline');
    headerText.style.fontSize = "32px";
    headerText.innerHTML = "Export Image Options";
    rogueHeaderBar.appendChild(headerText);

    let rogueHeaderMessage = document.createElement('p');
    rogueHeaderMessage.classList.add('sku-roundset-selector-desc','ta-center');
    rogueHeaderMessage.innerHTML = "This will generate a nice image to share with others of your progress in collecting the artifacts.<br>This may not work as intended on mobile.";
    rogueHeaderBar.appendChild(rogueHeaderMessage);

    let oakDiv = document.createElement('div');
    oakDiv.classList.add('d-flex', 'fd-column');
    rogueHeaderBar.appendChild(oakDiv);

    let rogueProfileDiv = document.createElement('div');
    rogueProfileDiv.classList.add('rogue-profile-div', 'd-flex', 'fd-column');
    rogueProfileDiv.style.width = "550px";
    rogueHeaderBar.appendChild(rogueProfileDiv);

    let rogueBannerDiv = document.createElement('div');
    rogueBannerDiv.classList.add('rogue-banner-div', 'd-flex', 'ai-center');
    rogueBannerDiv.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(../Assets/ProfileBanner/${rogueSaveData.imageOptions.banner})`;
    rogueBannerDiv.style.gap = "50px"
    rogueProfileDiv.appendChild(rogueBannerDiv);

    let rogueProfileAvatar = generateAvatar(100, `Assets/ProfileAvatar/${rogueSaveData.imageOptions.avatar}`);
    rogueBannerDiv.appendChild(rogueProfileAvatar);

    let rogueProfileNameInput = document.createElement('input');
    rogueProfileNameInput.classList.add('profile-name-input','font-gardenia','ta-center');
    rogueProfileNameInput.style.fontSize = "20px";
    (rogueSaveData.imageOptions.name != null) ? rogueProfileNameInput.value = rogueSaveData.imageOptions.name : rogueProfileNameInput.placeholder = "Enter Name";
    rogueProfileNameInput.addEventListener('input', () => {
        rogueSaveData.imageOptions.name = rogueProfileNameInput.value;
        saveDataToLocalStorage();
    });
    rogueBannerDiv.appendChild(rogueProfileNameInput);

    let changeProfileButtons = document.createElement('div');
    changeProfileButtons.classList.add('d-flex', 'jc-center');
    changeProfileButtons.style.gap = "20px";
    rogueHeaderBar.appendChild(changeProfileButtons);

    let changeAvatarButton = document.createElement('div');
    changeAvatarButton.classList.add('start-button', 'black-outline');
    changeAvatarButton.innerHTML = 'Change Avatar';
    changeAvatarButton.style.width = "auto";
    changeAvatarButton.addEventListener('click', () => {
        generateAvatarSelector(rogueSaveData.imageOptions.avatar);
    })
    changeProfileButtons.appendChild(changeAvatarButton);

    let changeBannerButton = document.createElement('div');
    changeBannerButton.classList.add('start-button', 'black-outline');
    changeBannerButton.innerHTML = 'Change Banner';
    changeBannerButton.style.width = "auto";
    changeBannerButton.addEventListener('click', () => {
        generateBannerSelector(rogueSaveData.imageOptions.banner);
    })
    changeProfileButtons.appendChild(changeBannerButton);

    let rogueSortPreview = document.createElement('div');
    rogueSortPreview.classList.add('rogue-sort-preview');
    rogueHeaderBar.appendChild(rogueSortPreview);

    let rogueViews = document.createElement('div');
    rogueViews.classList.add('maps-progress-views', 'jc-center');
    rogueSortPreview.appendChild(rogueViews);

    let rogueFiltersLabel2 = document.createElement('p');
    rogueFiltersLabel2.classList.add('maps-progress-coop-toggle-text','black-outline');
    rogueFiltersLabel2.classList.add('black-outline');
    rogueFiltersLabel2.innerHTML = "Sort:";
    rogueViews.appendChild(rogueFiltersLabel2);

    let mapProgressFilterDifficulty2 = document.createElement('div');
    mapProgressFilterDifficulty2.classList.add('map-progress-filter-difficulty');
    rogueViews.appendChild(mapProgressFilterDifficulty2);

    let mapProgressFilterDifficultySelect2 = document.createElement('select');
    mapProgressFilterDifficultySelect2.classList.add('map-progress-filter-difficulty-select');
    mapProgressFilterDifficultySelect2.value = rogueSaveData.artifactSort;

    let options2 = ["Name","Rarity (Ascending)","Rarity (Descending)"]
    options2.forEach((option) => {
        let difficultyOption = document.createElement('option');
        difficultyOption.value = option;
        difficultyOption.innerHTML = option;
        mapProgressFilterDifficultySelect2.appendChild(difficultyOption);
    })
    mapProgressFilterDifficulty2.appendChild(mapProgressFilterDifficultySelect2);
    mapProgressFilterDifficultySelect2.value = rogueSaveData.imageOptions.sort;

    let sortPreviewArtifactsDiv = document.createElement('div');
    sortPreviewArtifactsDiv.classList.add('preview-artifacts-div');
    rogueSortPreview.appendChild(sortPreviewArtifactsDiv);

    let updatePreviewArtifacts = () => {
        sortPreviewArtifactsDiv.innerHTML = "";
        let previewArtifacts = [];
        let sampleArtifacts = ['SplodeyDarts', 'SquadronTogether', 'DivineIntervention'];

        sampleArtifacts.forEach(artifact => {
            previewArtifacts.push(rogueJSON.artifacts[artifact + "1"]);
            previewArtifacts.push(rogueJSON.artifacts[artifact + "2"]);
            previewArtifacts.push(rogueJSON.artifacts[artifact + "3"]);
        });

        switch (rogueSaveData.imageOptions.sort) {
            case "Name":
                // artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => a[1].title.localeCompare(b[1].title)))
                break;
            case "Rarity (Ascending)":
                previewArtifacts = previewArtifacts.sort((a, b) => a.tier - b.tier)
                break;
            case "Rarity (Descending)":
                previewArtifacts = previewArtifacts.sort((a, b) => b.tier - a.tier)
                break;
            case "Category":
                previewArtifacts = previewArtifacts.sort((a, b) => a.rarityFrameType.localeCompare(b.rarityFrameType))
                break;
        }

        previewArtifacts.forEach(artifact => {
            sortPreviewArtifactsDiv.appendChild(generateArtifactContainer(artifact, 'preview'));
        });
    }
    updatePreviewArtifacts();
    mapProgressFilterDifficultySelect2.addEventListener('change', () => {
        rogueSaveData.imageOptions.sort = mapProgressFilterDifficultySelect2.value;
        saveDataToLocalStorage();
        updatePreviewArtifacts();
    });

    let rogueDownloadButton = document.createElement('div');
    rogueDownloadButton.classList.add('start-button', 'black-outline');
    rogueDownloadButton.innerHTML = 'Download Image';
    rogueDownloadButton.style.width = "auto";
    rogueDownloadButton.addEventListener('click', () => {
        downloadImage();
    })
    rogueHeaderBar.appendChild(rogueDownloadButton);

    if (!rogueSaveData.selectedOAK) {
        Object.entries(localStorageOAK).forEach(([oak, oakdata]) => {
            let previousOAKEntry = document.createElement('div');
            previousOAKEntry.classList.add('previous-oak-entry');
            previousOAKEntry.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(${oakdata.banner})`;
            oakDiv.appendChild(previousOAKEntry);

            previousOAKEntry.appendChild(generateAvatar(100, oakdata.avatar));

            let profileName = document.createElement('p');
            profileName.classList.add('profile-name','black-outline');
            profileName.innerHTML = oakdata.displayName;
            previousOAKEntry.appendChild(profileName);

            let useButton = document.createElement('img');
            useButton.classList.add('delete-button');
            useButton.src = './Assets/UI/ContinueBtn.png';
            useButton.addEventListener('click', () => {
                rogueSaveData.imageOptions.avatar = oakdata.avatar.split('/')[2];
                rogueSaveData.imageOptions.banner = oakdata.banner.split('/')[2];
                rogueSaveData.imageOptions.name = oakdata.displayName;
                rogueProfileNameInput.value = oakdata.displayName;
                rogueBannerDiv.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(../Assets/ProfileBanner/${rogueSaveData.imageOptions.banner})`;
                rogueProfileAvatar.querySelector('.avatar-img').src = `Assets/ProfileAvatar/${rogueSaveData.imageOptions.avatar}`;
                rogueProfileNameInput.value = rogueSaveData.imageOptions.name;
                oakDiv.innerHTML = "";
                rogueSaveData.selectedOAK = true;
                saveDataToLocalStorage();
            })
            previousOAKEntry.appendChild(useButton);
        })
    }
}

function generateAvatarSelector() {
    let modal = document.createElement('div');
    modal.classList.add('error-modal-overlay');
    document.body.appendChild(modal);

    let modalContent = document.createElement('div');
    modalContent.classList.add('collection-modal', 'rogue-bg');
    modal.appendChild(modalContent);

    let modalHeaderDiv = document.createElement('div');
    modalHeaderDiv.classList.add('collection-modal-header');
    modalHeaderDiv.style.backgroundColor = 'unset';
    modalContent.appendChild(modalHeaderDiv);

    let modalBody = document.createElement('div');
    modalBody.classList.add('rogue-modal-body');
    modalContent.appendChild(modalBody);

   let modalAvatars = document.createElement('div');
    modalAvatars.classList.add('d-flex', 'jc-center', 'ai-center', 'f-wrap');
    modalBody.appendChild(modalAvatars);

    for (let i = 1; i <= constants.profileAvatars; i++) {
        if (i == 107) { continue; }
        let avatar = generateAvatar(100, `Assets/ProfileAvatar/ProfileAvatar${i < 10 ? "0" + i : i}.png`);
        avatar.addEventListener('click', () => {
            document.querySelector('.rogue-profile-div .avatar-img').src = `Assets/ProfileAvatar/ProfileAvatar${i < 10 ? "0" + i : i}.png`;
            rogueSaveData.imageOptions.avatar = `ProfileAvatar${i < 10 ? "0" + i : i}.png`;
            saveDataToLocalStorage();
            modal.remove();
        })
        modalAvatars.appendChild(avatar);
    }
}

function generateBannerSelector() {
    let modal = document.createElement('div');
    modal.classList.add('error-modal-overlay');
    document.body.appendChild(modal);

    let modalContent = document.createElement('div');
    modalContent.classList.add('collection-modal', 'rogue-bg');
    modal.appendChild(modalContent);

    let modalHeaderDiv = document.createElement('div');
    modalHeaderDiv.classList.add('collection-modal-header');
    modalHeaderDiv.style.backgroundColor = 'unset';
    modalContent.appendChild(modalHeaderDiv);

    let modalBody = document.createElement('div');
    modalBody.classList.add('rogue-modal-body');
    modalContent.appendChild(modalBody);

   let modalBanners = document.createElement('div');
    modalBanners.classList.add('d-flex', 'jc-center', 'ai-center', 'f-wrap');
    modalBody.appendChild(modalBanners);

    for (let i = 1; i <= constants.profileBanners; i++) {
        let bannerImg = document.createElement('img');
        bannerImg.src = `Assets/ProfileBanner/ProfileBanner${i}.png`;
        bannerImg.classList.add('profile-banner-img');
        bannerImg.addEventListener('click', () => {
            document.querySelector('.rogue-banner-div').style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(../Assets/ProfileBanner/ProfileBanner${i}.png)`;
            rogueSaveData.imageOptions.banner = `ProfileBanner${i}.png`;
            saveDataToLocalStorage();
            modal.remove();
        })
        modalBanners.appendChild(bannerImg);
    }

    for (let i = 1; i <= constants.teamsBanners; i++) {
        let bannerImg = document.createElement('img');
        bannerImg.src = `Assets/ProfileBanner/TeamsBanner${i}.png`;
        bannerImg.classList.add('profile-banner-img');
        bannerImg.addEventListener('click', () => {
            document.querySelector('.rogue-banner-div').style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(../Assets/ProfileBanner/TeamsBanner${i}.png)`;
            rogueSaveData.imageOptions.banner = `TeamsBanner${i}.png`;
            saveDataToLocalStorage();
            modal.remove();
        })
        modalBanners.appendChild(bannerImg);
    }
}


function downloadImage() {
    let rogueImageContent = document.getElementById('rogue-image-content');
    rogueImageContent.innerHTML = "";

    let rogueImage = document.createElement('div');
    rogueImage.classList.add('rogue-image', 'totem-bg');
    rogueImageContent.appendChild(rogueImage);

    let rogueImageHeader = document.createElement('div');
    rogueImageHeader.classList.add('rogue-image-header');
    rogueImage.appendChild(rogueImageHeader);
    rogueImageHeader.style.backgroundImage = `url(../Assets/UI/RogueTopBarLong.png)`;

    let profileDiv = document.createElement('div');
    profileDiv.classList.add('rogue-profile-div', 'rogue-header-sides');
    profileDiv.style.backgroundImage = `url(../Assets/ProfileBanner/${rogueSaveData.imageOptions.banner})`;
    rogueImageHeader.appendChild(profileDiv);

    profileDiv.appendChild(generateAvatar(100, `Assets/ProfileAvatar/${rogueSaveData.imageOptions.avatar}`));

    let profileName = document.createElement('p');
    profileName.classList.add('profile-name','black-outline');
    profileName.style.fontSize = "40px";
    profileName.innerHTML = rogueSaveData.imageOptions.name;
    profileDiv.appendChild(profileName);

    let titleDiv = document.createElement('div');
    titleDiv.classList.add('rogue-title-div');
    rogueImageHeader.appendChild(titleDiv);

    const title = document.createElement('h1');
    title.classList.add('title', 'rogue-title');
    title.innerHTML = 'Extracted Artifacts';
    titleDiv.appendChild(title);

    let rightDiv = document.createElement('div');
    rightDiv.classList.add('rogue-header-sides', 'rogue-right-div');
    rogueImageHeader.appendChild(rightDiv);

    let progressText = document.createElement('p');
    progressText.classList.add('rogue-progress-text-export','black-outline');
    progressText.innerHTML = `${rogueSaveData.extractedArtifacts.length}/${Object.keys(rogueJSON.artifacts).length}`;
    rightDiv.appendChild(progressText);
    
    let artifactBag = document.createElement('img');
    artifactBag.src = `../Assets/UI/ArtifactBag.png`;
    artifactBag.classList.add('artifact-bag-export');
    rightDiv.appendChild(artifactBag);

    let rogueImageArtifacts = document.createElement('div');
    rogueImageArtifacts.classList.add('rogue-image-artifacts');
    rogueImage.appendChild(rogueImageArtifacts);

    let artifactsDiv = document.createElement('div');
    rogueImageArtifacts.appendChild(artifactsDiv);

    let starterArtifactsDiv = document.createElement('div');
    starterArtifactsDiv.classList.add('artifacts-div');
    artifactsDiv.appendChild(starterArtifactsDiv);

    let mainArtifactsDiv = document.createElement('div');
    mainArtifactsDiv.classList.add('artifacts-div');
    mainArtifactsDiv.style.justifyContent = 'space-between';
    artifactsDiv.appendChild(mainArtifactsDiv);

    let artifacts = {...rogueJSON.artifacts}

    switch (rogueSaveData.imageOptions.sort) {
        case "Name":
            // artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => a[1].title.localeCompare(b[1].title)))
            break;
        case "Rarity (Ascending)":
            artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => a[1].tier - b[1].tier))
            break;
        case "Rarity (Descending)":
            artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => b[1].tier - a[1].tier))
            break;
        case "Category":
            artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => a[1].rarityFrameType.localeCompare(b[1].rarityFrameType)))
            break;
    }

    Object.values(artifacts).forEach(artifact => {
        if (starterArtifacts.includes(artifact.nameLocKey)) { return; }
        mainArtifactsDiv.appendChild(generateArtifactContainer(artifact,'modal'));
    });

    let bottomTextDiv = document.createElement('div');
    bottomTextDiv.classList.add('rogue-bottom-text-div', 'd-flex', 'jc-between');
    bottomTextDiv.style.fontSize = "24px";
    bottomTextDiv.style.padding = "10px 20px";
    rogueImage.appendChild(bottomTextDiv);

    let bottomTextDate = document.createElement('p');
    bottomTextDate.classList.add('rogue-bottom-text','black-outline');
    bottomTextDate.innerHTML = new Date().toLocaleDateString();
    bottomTextDiv.appendChild(bottomTextDate);

    let bottomText = document.createElement('p');
    bottomText.classList.add('rogue-bottom-text','black-outline');
    bottomText.innerHTML = "Generated From btd6apiexplorer.github.io/rogue";
    bottomTextDiv.appendChild(bottomText);

    showLoading();
    document.getElementById('rogue-image-content').style.display = "block";
    setTimeout(function () {
        htmlToImage.toJpeg(document.getElementById(`rogue-image-content`), {
            width: 1800,
            quality: 0.85,
            style: {
                opacity: 1,
            },
            pixelRatio: 2,
        }).then(function (toDataURL) {
            var a = document.createElement('a');
            a.href = toDataURL;
            a.download = `RogueLegendsArtifacts_${new Date().toLocaleDateString()}.jpeg`;
            a.click();
            hideLoading();
        }).then(function () {
            document.getElementById('rogue-image-content').style.display = "none";
        })
    }, 1000);
}

function downloadArtifactsSave() {
    let saveData = localStorage.getItem('rogueSaveData');
    let a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveData);
    a.download = `RogueLegendsArtifactsSave_${new Date().toLocaleDateString()}.json`;
    a.click();
}

function importArtifactsSave() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.click();
    input.addEventListener('change', (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
            let contents = e.target.result;
            localStorage.setItem('rogueSaveData', contents);
            console.log('Imported Save Data');
            loadDataFromLocalStorage();
        }
        reader.readAsText(file);
    })
}

function copyLoadingIcon(destination) {
    let clone = document.getElementsByClassName('loading-icon')[0].cloneNode(true)
    clone.classList.add('loading-icon-leaderboard');
    clone.style.height = "unset"
    destination.appendChild(clone)
}

function changeHexBGColor(color) {
    if (color == null) {
        document.body.style.removeProperty("background-color")
        return;
    }
    document.body.style.backgroundColor = `rgb(${color[0] * 255},${color[1] * 255},${color[2] * 255})`;
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

function saveDataToLocalStorage() {
    localStorage.setItem('rogueSaveData', JSON.stringify(rogueSaveData));
}

function loadDataFromLocalStorage() {
    let data = localStorage.getItem('rogueSaveData');
    if (data) {
        rogueSaveData = JSON.parse(data);
    }
    readLocalStorage();
}