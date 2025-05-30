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
    artifactSort: "Name",
    highlightExtracted: false,
    extractionFilter: "All",
    showStarterArtifacts: true,
    showBossArtifacts: true,
    categoryFilter: ["Common", "Rare", "Legendary"]
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
    "RosaliaTinkerfairy": "Rosalia Tinkerfairy",
    "SheRa": "She-Ra Adora"
}

let artifactDivMap = {};
let totalArtifactsTxt;
let noArtifactsMessage;

let currentArtifacts = {};

// Promise.all([
//     fetch('./data/Constants.json').then(response => response.json()),
//     fetch('./data/English.json').then(response => response.json()),
//     fetch('./data/rogueData.json').then(response => response.json()),
// ])
// .then(([constantsJSON, englishData, rogueData]) => {
//     constants = constantsJSON;
//     locJSON = englishData;
//     rogueJSON = rogueData;
//     loadRogueDataFromLocalStorage();
//     postProcessRogueData();
//     generateRogueSelectors();
// })
// .catch(error => {
//     console.error('Error:', error);
//     errorModal(error, "js");
// });
fetchRogueDependencies();
loadRogueDataFromLocalStorage();

function postProcessRogueData(){
    let unusedArtifacts = ['EssenceOfLych1', 'Token', 'ProjectileCarousel1']
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

function changeRogueTab(selector){
    resetScroll();
    switch(selector){
        case 'Artifacts':
            document.getElementById('rogue-content').style.display = 'none';
            document.getElementById('artifacts-content').style.display = 'flex';
            generateRogueArtifacts();
            addToBackQueue({source: 'rogue', destination: 'artifacts'})
            break;
        case 'Hero Starter Kits':
            document.getElementById('rogue-content').style.display = 'none';
            document.getElementById('starter-kits-content').style.display = 'flex';
            generateRogueHeroStarterKits();
            addToBackQueue({source: 'rogue', destination: 'starter-kits'})
            break;
        case 'Export Image':
            document.getElementById('rogue-content').style.display = 'none';
            document.getElementById('artifacts-content').style.display = 'flex';
            generateImageBuilder();
            addToBackQueue({source: 'rogue', destination: 'artifacts'})
            break;
        default: 
            document.getElementById('rogue-content').style.display = 'flex';
            document.getElementById('artifacts-content').style.display = 'none';
            document.getElementById('starter-kits-content').style.display = 'none';
            document.getElementById('starter-kits-content').style.display = 'none';
            break;
    }
}

function generateRogueSelectors() {
    hideLoading();
    document.getElementById('rogue-content').innerHTML = "";
    let rogueSelectorsPage = document.createElement('div');
    rogueSelectorsPage.classList.add('progress-page','f-wrap');
    document.getElementById('rogue-content').appendChild(rogueSelectorsPage);

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
}

function generateRogueArtifacts() { 
    let artifactsContent = document.getElementById('artifacts-content');
    artifactsContent.innerHTML = "";

    let rogueHeaderBar = document.createElement('div');
    rogueHeaderBar.classList.add('rogue-bg', 'd-flex', 'jc-between', 'ai-center');
    rogueHeaderBar.style.height = "20px";
    artifactsContent.appendChild(rogueHeaderBar);

    let rogueHeaderLeft = document.createElement('div');
    rogueHeaderLeft.style.width = "200px";
    rogueHeaderBar.appendChild(rogueHeaderLeft);

    let rogueSettingsBtn = document.createElement('img');
    rogueSettingsBtn.src = `../Assets/UI/SettingsBtn.png`;
    rogueSettingsBtn.style.width = "50px";
    rogueSettingsBtn.style.height = "50px";
    rogueSettingsBtn.classList.add('artifact-bag', 'pointer');
    rogueSettingsBtn.addEventListener('click', () => {
        backState = "artifactSettings";
        generateArtifactSettings();
    })
    rogueHeaderLeft.appendChild(rogueSettingsBtn);

    let rogueHeaderCenter = document.createElement('div');
    rogueHeaderCenter.classList.add('pos-rel');
    rogueHeaderBar.appendChild(rogueHeaderCenter);

    let rogueArtifactSearch = document.createElement('input');
    rogueArtifactSearch.classList.add('search-box', 'font-gardenia', 'rogue-search');
    rogueArtifactSearch.placeholder = "Search";
    rogueArtifactSearch.style.paddingRight = '40px';
    rogueArtifactSearch.addEventListener('input', () => {
        let searchValue = rogueArtifactSearch.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        Object.values(artifactDivMap).forEach(artifactDiv => {
            if (artifactDiv.alt.toLowerCase().replace(/[^a-z0-9]/g, '').includes(searchValue)) {
                artifactDiv.style.display = "flex";
            } else {
                artifactDiv.style.display = "none";
            }
        })
        noArtifactsMessage.style.display = Object.values(artifactDivMap).every(artifactDiv => artifactDiv.style.display == "none") ? "block" : "none";
        updateArtifactCount();
    })

    let searchIcon = document.createElement('img');
    searchIcon.src = `../Assets/UI/SearchIcon.png`;
    searchIcon.classList.add('search-icon');
    rogueHeaderCenter.appendChild(searchIcon);

    rogueHeaderCenter.appendChild(rogueArtifactSearch);

    let rogueHeaderRight = document.createElement('div');
    rogueHeaderRight.style.width = "200px";
    rogueHeaderRight.classList.add('d-flex', 'jc-end', 'ai-center');
    rogueHeaderBar.appendChild(rogueHeaderRight);

    let progressText = document.createElement('p');
    progressText.classList.add('rogue-progress-text','black-outline');
    progressText.innerHTML = `${rogueSaveData.extractedArtifacts.length}/${Object.keys(rogueJSON.artifacts).length}`;
    rogueHeaderRight.appendChild(progressText);

    totalArtifactsTxt = progressText;
    
    let artifactBag = document.createElement('img');
    artifactBag.src = `../Assets/UI/ArtifactBag.png`;
    artifactBag.classList.add('artifact-bag');
    rogueHeaderRight.appendChild(artifactBag);

    let artifactsContainer = document.createElement('div');
    artifactsContainer.id = 'artifacts-container';
    artifactsContainer.classList.add('insta-monkeys-progress-container');
    artifactsContent.appendChild(artifactsContainer);

    generateArtifacts();

    noArtifactsMessage = document.createElement('p');
    noArtifactsMessage.classList.add('rogue-no-results', 'font-gardenia');
    noArtifactsMessage.innerHTML = "No artifacts to display. Check your search term, or change your filter settings.";
    noArtifactsMessage.style.display = Object.values(artifactDivMap).every(artifactDiv => artifactDiv.style.display == "none") ? "block" : "none";
    artifactsContent.appendChild(noArtifactsMessage);
}

function generateArtifactSettings() {
    let artifactsContent = document.getElementById('artifacts-content');
    artifactsContent.innerHTML = "";

    addToBackQueue({callback: generateRogueArtifacts});

    let settingsDiv = document.createElement('div');
    settingsDiv.classList.add('content-div', 'rogue-bg', 'd-flex', 'ai-center');
    artifactsContent.appendChild(settingsDiv);

    let settingsHeaderBar = document.createElement('div');
    settingsDiv.appendChild(settingsHeaderBar);

    let settingsHeaderViews = document.createElement('div');
    settingsHeaderViews.classList.add('maps-progress-views');
    settingsHeaderBar.appendChild(settingsHeaderViews);


    let settingsHeader = document.createElement('p');
    settingsHeader.classList.add('settings-header','black-outline');
    settingsHeader.style.fontSize = "32px";
    settingsHeader.innerHTML = "Artifact View Settings";
    settingsHeaderViews.appendChild(settingsHeader);

    let settingsContent = document.createElement('div');
    settingsContent.classList.add('settings-content', 'd-flex', 'jc-evenly', 'f-wrap');
    settingsDiv.appendChild(settingsContent);

    let settingsExtraction = document.createElement('div');
    settingsExtraction.classList.add('settings-box', 'd-flex', 'fd-column', 'jc-between', 'fg-1');
    settingsExtraction.style.gap = "10px";
    settingsContent.appendChild(settingsExtraction);

    let settingsExtractHighlight = generateCheckbox("Highlight Extracted", rogueSaveData.highlightExtracted, (checked) => {
        rogueSaveData.highlightExtracted = checked;
        saveRogueDataToLocalStorage();
    });
    settingsExtractHighlight.classList.add('jc-between');
    settingsExtraction.appendChild(settingsExtractHighlight);

    let settingsExtractDescription = document.createElement('p');
    settingsExtractDescription.style.margin = "20px";
    settingsExtractDescription.style.lineHeight = "1.5";
    settingsExtractDescription.classList.add('font-gardenia');

    let updateExtractDescription = () => {
        switch (rogueSaveData.extractionFilter) {
            case "All":
                settingsExtractDescription.innerHTML = "Showing all artifacts extracted and not extracted.";
                break;
            case "Only Extracted":
                settingsExtractDescription.innerHTML = "Only extracted artifacts will be shown.";
                break;
            case "Only Unextracted":
                settingsExtractDescription.innerHTML = "Extracted artifacts will be hidden.";
                break;  
        }
    }
    updateExtractDescription();

    let settingsExtractionDropdown = generateDropdown("Extracted Filter:", ["All","Only Extracted","Only Unextracted"], rogueSaveData.extractionFilter, (value) => {
        rogueSaveData.extractionFilter = value;
        updateExtractDescription();
        saveRogueDataToLocalStorage();
    });
    settingsExtractionDropdown.classList.add('jc-between');

    let settingsClickToCollect = generateCheckbox("One Click Extract", rogueSaveData.clickToCollect, (checked) => {
        rogueSaveData.clickToCollect = checked;
        saveRogueDataToLocalStorage();
    });

    settingsExtraction.appendChild(settingsClickToCollect);
    
    let settingsOther = document.createElement('div');
    settingsOther.classList.add('settings-box', 'd-flex', 'fd-column', 'fg-1');
    settingsOther.style.gap = "10px";
    settingsContent.appendChild(settingsOther);


    let settingsShowStarterArtifacts = generateCheckbox("Show Starter Artifacts", rogueSaveData.showStarterArtifacts, (checked) => {
        rogueSaveData.showStarterArtifacts = checked;
        saveRogueDataToLocalStorage();
    });
    settingsShowStarterArtifacts.classList.add('jc-between');

    let settingsShowBossArtifacts = generateCheckbox("Show Boss Artifacts", rogueSaveData.showBossArtifacts, (checked) => {
        rogueSaveData.showBossArtifacts = checked;
        saveRogueDataToLocalStorage();
    });
    settingsShowBossArtifacts.classList.add('jc-between');

    settingsOther.appendChild(settingsShowStarterArtifacts);
    settingsOther.appendChild(settingsShowBossArtifacts);

    let settingsFilter = document.createElement('div');
    settingsFilter.classList.add('settings-box', 'd-flex', 'ai-center', 'fd-column', 'fg-1');
    settingsContent.appendChild(settingsFilter);

    let settingsFilterDescription = document.createElement('p');
    settingsFilterDescription.classList.add('font-gardenia');
    settingsFilterDescription.style.margin = "20px";
    settingsFilterDescription.style.lineHeight = "1.5";
    settingsFilterDescription.innerHTML = "All Artifacts will be included to start.";

    function updateDescription() {
        switch (rogueSaveData.artifactFilter) {
            case "All":
                settingsFilterDescription.innerHTML = "All Artifacts will be included to start.";
                break;
            case "Extracted":
                settingsFilterDescription.innerHTML = "Only Artifacts that have been extracted will be included to start.";
                break;
            case "Unextracted":
                settingsFilterDescription.innerHTML = "Only Artifacts that have not been extracted will be included to start.";
                break;
            case "Starter Kit":
                settingsFilterDescription.innerHTML = "Only Artifacts that are available in Hero Starter Kits will be included to start.";
                break;
            case "Non Starter Kit":
                settingsFilterDescription.innerHTML = "Only Artifacts that are not available in Hero Starter Kits will be included to start.";
                break;
            case "One Variant":
                settingsFilterDescription.innerHTML = "Only Artifacts that have only one tier will be included to start.";
                break;
            case "Two Variants":
                settingsFilterDescription.innerHTML = "Only Artifacts that have only have two tiers will be included to start.";
                break;
            case "Update 48":
                settingsFilterDescription.innerHTML = "Only Artifacts that were added in Update 48 will be included to start.";
                break;
        }
    }

    let settingsFilterDropdown = generateDropdown("Artifact Filter:", ["All", "Starter Kit", "Non Starter Kit", "One Variant", "Two Variants", "Update 48"], rogueSaveData.artifactFilter, (value) => {
        rogueSaveData.artifactFilter = value;
        updateDescription();
        saveRogueDataToLocalStorage();
    });

    updateDescription();
    
    settingsFilter.appendChild(settingsFilterDropdown);
    settingsFilter.appendChild(settingsFilterDescription);
    settingsFilter.appendChild(settingsExtractionDropdown);
    settingsFilter.appendChild(settingsExtractDescription);

    let rarityTitle = document.createElement('p');
    rarityTitle.innerHTML = "Rarity Filter:";
    rarityTitle.style.fontSize = "24px";
    rarityTitle.style.padding = "5px";
    rarityTitle.classList.add('black-outline');
    settingsFilter.appendChild(rarityTitle);

    let settingsRarity = document.createElement('div');
    settingsRarity.classList.add('d-flex', 'ai-center', 'fd-column');
    settingsFilter.appendChild(settingsRarity);

    let rarityDivs = {"Common": "RarityNormalArtifactAllTowers", "Rare": "RarityRareArtifactAllTowers", "Legendary": "RarityLegendaryArtifactAllTowers"};

    Object.entries(rarityDivs).forEach(([rarity, icon]) => {
        let rarityDiv = document.createElement('div');
        rarityDiv.classList.add('d-flex', 'ai-center', 'jc-between');
        rarityDiv.style.width = "250px";
        settingsRarity.appendChild(rarityDiv);

        let rarityImg = document.createElement('img');
        rarityImg.src = `../Assets/RogueFrames/${icon}.png`;
        rarityImg.style.width = "50px";
        rarityDiv.appendChild(rarityImg);

        let rarityCheckbox = generateCheckbox(rarity, rogueSaveData.categoryFilter.includes(rarity), (checked) => {
            if (rogueSaveData.categoryFilter.includes(rarity)) {
                rogueSaveData.categoryFilter = rogueSaveData.categoryFilter.filter(e => e !== rarity);
            } else {
                rogueSaveData.categoryFilter.push(rarity);
            }
            saveRogueDataToLocalStorage();
        });
        rarityDiv.appendChild(rarityCheckbox);
    });
    
    // let categoryDivs = {"Primary": "PrimaryIcon", "Military": "MilitaryIcon", "Magic": "MagicIcon", "Support": "SupportIcon"};

    // let categoryTitle = document.createElement('p');
    // categoryTitle.innerHTML = "Category Filter:";
    // categoryTitle.style.fontSize = "24px";
    // categoryTitle.style.padding = "5px";
    // categoryTitle.classList.add('black-outline');
    // settingsFilter.appendChild(categoryTitle);

    // let settingsCategory = document.createElement('div');
    // settingsCategory.classList.add('d-flex', 'ai-center');
    // settingsCategory.style.gap = "10px";
    // settingsFilter.appendChild(settingsCategory);

    // Object.entries(categoryDivs).forEach(([category, icon]) => {
    //     let categoryDiv = document.createElement('div');
    //     categoryDiv.classList.add('d-flex', 'ai-center', 'jc-between');
    //     settingsCategory.appendChild(categoryDiv);

    //     let categoryImg = document.createElement('img');
    //     categoryImg.src = `../Assets/UI/${icon}.png`;
    //     categoryImg.style.width = "50px";
    //     categoryDiv.appendChild(categoryImg);
    // });

    let settingsSort = document.createElement('div');
    settingsSort.classList.add('settings-box', 'd-flex', 'ai-center', 'fd-column', 'fg-1');
    settingsContent.appendChild(settingsSort);

    let sortPreviewArtifactsDiv = document.createElement('div');
    sortPreviewArtifactsDiv.classList.add('preview-artifacts-div');

    let updatePreviewArtifacts = () => {
        sortPreviewArtifactsDiv.innerHTML = "";
        let previewArtifacts = [];
        let sampleArtifacts = ['SplodeyDarts', 'SquadronTogether', 'DivineIntervention'];

        sampleArtifacts.forEach(artifact => {
            previewArtifacts.push(rogueJSON.artifacts[artifact + "1"]);
            previewArtifacts.push(rogueJSON.artifacts[artifact + "2"]);
            previewArtifacts.push(rogueJSON.artifacts[artifact + "3"]);
        });

        switch (rogueSaveData.artifactSort) {
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
    let settingsSortDropdown = generateDropdown("Sort:", ["Name","Rarity (Ascending)","Rarity (Descending)"], rogueSaveData.artifactSort, (value) => {
        rogueSaveData.artifactSort = value;
        saveRogueDataToLocalStorage();
        updatePreviewArtifacts();
    });
    settingsSort.appendChild(settingsSortDropdown);
    settingsSort.appendChild(sortPreviewArtifactsDiv);

    let rogueDownloadButton = document.createElement('div');
    rogueDownloadButton.classList.add('start-button', 'black-outline');
    rogueDownloadButton.innerHTML = 'Apply';
    rogueDownloadButton.addEventListener('click', () => {
        goBack();
    })
    settingsDiv.appendChild(rogueDownloadButton);
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

    currentArtifacts = {...rogueJSON.artifacts}

    switch (rogueSaveData.artifactFilter) {
        case "Extracted":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => rogueSaveData.extractedArtifacts.includes(value.nameLocKey)))
            break;
        case "Unextracted":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => !rogueSaveData.extractedArtifacts.includes(value.nameLocKey)))
            break;
        case "Starter Kit":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => value.hasOwnProperty('starterKitHero')))
            break;
        case "Non Starter Kit":
            let excludeArtifacts = []
            Object.values(rogueJSON.heroStarterKits).map(kit => kit.artifact).concat(starterArtifacts).forEach(artifact => {
                let artifactData = rogueJSON.artifacts[artifact]
                let lastDigit = artifact.slice(-1)
                switch(lastDigit){
                    case "1":
                        excludeArtifacts.push(artifactData.baseId + "1")
                        excludeArtifacts.push(artifactData.baseId + "2")
                        excludeArtifacts.push(artifactData.baseId + "3")
                        break;
                    case "2":
                        excludeArtifacts.push(artifactData.baseId + "2")
                        excludeArtifacts.push(artifactData.baseId + "3")
                        break;
                    case "3":
                        excludeArtifacts.push(artifactData.baseId + "3")
                        break;
                }
            })
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => !excludeArtifacts.includes(value.nameLocKey)))
            break;

        case "Two Variants":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => (rogueJSON.artifacts.hasOwnProperty(value.baseId + "1") && rogueJSON.artifacts.hasOwnProperty(value.baseId + "2") && !rogueJSON.artifacts.hasOwnProperty(value.baseId + "3"))))
            break;
        case "One Variant":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => (rogueJSON.artifacts.hasOwnProperty(value.baseId + "1") && !rogueJSON.artifacts.hasOwnProperty(value.baseId + "2") && !rogueJSON.artifacts.hasOwnProperty(value.baseId + "3"))))
            break;
        case "Update 48":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => value.added == 48))
            break;
    }

    if (!rogueSaveData.showStarterArtifacts) {
        currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => !starterArtifacts.includes(value.nameLocKey)))
    }

    if (!rogueSaveData.showBossArtifacts) {
        currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => !bossArtifacts.includes(value.nameLocKey)))
    }

    //Category filters: If no common, remove all tier 1s. If no rare, remove all tiers 2s. if no legendary, remove all tier 3s.
    const tierMap = {
        "Common": 0,
        "Rare": 1,
        "Legendary": 2
    };
    
    currentArtifacts = Object.fromEntries(
        Object.entries(currentArtifacts).filter(([key, value]) => 
            rogueSaveData.categoryFilter.includes(
                Object.keys(tierMap).find(name => tierMap[name] === value.tier)
            )
        )
    );

    switch (rogueSaveData.extractionFilter) {
        case "Only Extracted":
            let extractedArtifacts = rogueSaveData.extractedArtifacts.concat(starterArtifacts)
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => extractedArtifacts.includes(value.nameLocKey)))
            break;
        case "Only Unextracted":
            let unextractedArtifacts = rogueSaveData.extractedArtifacts.concat(starterArtifacts)
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).filter(([key, value]) => !unextractedArtifacts.includes(value.nameLocKey)))
            break;
    }

    switch (rogueSaveData.artifactSort) {
        case "Name":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).sort((a, b) => (a[1].title.replace("Legendary", "3").replace("Rare", "2").replace("Common", "1")).localeCompare(b[1].title.replace("Legendary", "3").replace("Rare", "2").replace("Common", "1"))))
            break;
        case "Rarity (Ascending)":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).sort((a, b) => a[1].tier - b[1].tier))
            break;
        case "Rarity (Descending)":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).sort((a, b) => b[1].tier - a[1].tier))
            break;
        case "Category":
            currentArtifacts = Object.fromEntries(Object.entries(currentArtifacts).sort((a, b) => a[1].rarityFrameType.localeCompare(b[1].rarityFrameType)))
            break;
    }

    Object.values(currentArtifacts).forEach(artifact => {
        if (!rogueSaveData.showStarterArtifacts && starterArtifacts.includes(artifact.nameLocKey)) { return; }
        if (!rogueSaveData.showBossArtifacts && bossArtifacts.includes(artifact.nameLocKey)) { return; }

        let artifactDiv = generateArtifactContainer(artifact);
        artifactDiv.alt = artifact.title;
        artifactDivMap[artifact.nameLocKey] = artifactDiv;
        artifactDiv.addEventListener('click', () => {
            if (rogueSaveData.clickToCollect && rogueSaveData.highlightExtracted && !starterArtifacts.includes(artifact.nameLocKey)) {
                if (rogueSaveData.extractedArtifacts.includes(artifact.nameLocKey)) {
                    rogueSaveData.extractedArtifacts = rogueSaveData.extractedArtifacts.filter(e => e !== artifact.nameLocKey);
                    artifactDiv.classList.add('artifact-unextracted');
                    updateArtifactCount();
                    saveRogueDataToLocalStorage();
                } else {
                    rogueSaveData.extractedArtifacts.push(artifact.nameLocKey);
                    artifactDiv.classList.remove('artifact-unextracted');
                    updateArtifactCount();
                    saveRogueDataToLocalStorage();
                }
            } else {
                generateArtifactPopout(artifact.nameLocKey);
            }
        })
        mainArtifactsDiv.appendChild(artifactDiv);
    });

    updateArtifactCount();

    return artifactsDiv;
}

function generateArtifactContainer(artifact, type) {
    let artifactDiv = document.createElement('div');
    artifactDiv.classList.add('artifact-container');
    if ((rogueSaveData.highlightExtracted || type == "force") && !rogueSaveData.extractedArtifacts.includes(artifact.nameLocKey) && !starterArtifacts.includes(artifact.nameLocKey) && type != "preview") {
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

    // let modal;
    // if(!document.getElementById('artifact-popout')){
    //     modal = document.createElement('div');
    //     modal.id = 'artifact-popout';
    //     modal.classList.add('error-modal-overlay');
    //     document.body.appendChild(modal);
    // } else {
    //     modal = document.getElementById('artifact-popout');
    //     modal.innerHTML = "";
    // }

    document.querySelector('.modal-overlay')?.remove();

    let modalContent = document.createElement('div');
    modalContent.classList.add('rogue-artifact-modal', 'rogue-bg');
    // modal.appendChild(modalContent);

    let modalHeaderDiv = document.createElement('div');
    modalHeaderDiv.classList.add('modal-header');
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
    modalClose.classList.add('collection-modal-close', 'pointer');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        goBack();
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
        otherVariantsDiv.classList.add('other-variants-div', 'd-flex', 'jc-center','pointer');
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
            if(rogueSaveData.highlightExtracted){
                artifactDiv.classList.add('artifact-unextracted');
                if(currentVariant){
                    currentVariant.classList.add('artifact-unextracted');
                }
                if(artifactDivMap[data.nameLocKey]){
                    artifactDivMap[data.nameLocKey].classList.add('artifact-unextracted');
                }
            }
            updateArtifactCount();
            mapsProgressCoopToggleInput.checked = false;
            saveRogueDataToLocalStorage();
        } else {
            rogueSaveData.extractedArtifacts.push(data.nameLocKey);
            if(rogueSaveData.highlightExtracted){
                artifactDiv.classList.remove('artifact-unextracted');
                if(currentVariant){
                    currentVariant.classList.remove('artifact-unextracted');
                }
                if(artifactDivMap[data.nameLocKey]){
                    artifactDivMap[data.nameLocKey].classList.remove('artifact-unextracted');
                }
            }
            updateArtifactCount();
            mapsProgressCoopToggleInput.checked = true;
            saveRogueDataToLocalStorage();
        }
    }
    if(!starterArtifacts.includes(key)){
        extractedCheckDiv.addEventListener('click', updateArtifactStatus)
        artifactDiv.addEventListener('click', updateArtifactStatus)
    }

    createModal({
        content: modalContent,
        // header: modalHeaderDiv,
    })
}

function updateArtifactCount() {
    let totalArtifacts = Object.keys(currentArtifacts).length;
    if (Object.keys(currentArtifacts).length === 0) {
        totalArtifacts = Object.keys(rogueJSON.artifacts).length;
    }
    let extractedCount = rogueSaveData.extractedArtifacts.concat(starterArtifacts).reduce((acc, artifact) => {
        if (currentArtifacts.hasOwnProperty(artifact)) {
            return acc + 1;
        }
        return acc;
    }, 0);

    let totalArtifactsContent = `${extractedCount}/${totalArtifacts}`;

    let searchHidden = 0;
    let shownObtained = 0;

    let artifactsDiv = document.querySelector('.artifacts-div');
    if (artifactsDiv) {
        let hiddenArtifacts = artifactsDiv.querySelectorAll('.artifact-container[style*="display: none"]');
        searchHidden = hiddenArtifacts.length;

        let shownUnextracted = artifactsDiv.querySelectorAll('.artifact-unextracted[style*="display: flex"]').length;
        shownObtained = totalArtifacts - searchHidden - shownUnextracted;

        if (searchHidden > 0) {
            totalArtifactsContent = `${shownObtained}/${totalArtifacts - searchHidden}`;
        }
    }


    if (totalArtifactsTxt) {
        totalArtifactsTxt.innerHTML = totalArtifactsContent;
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
    headerText.innerHTML = "Extracted Artifacts Image";
    rogueHeaderBar.appendChild(headerText);

    let rogueHeaderMessage = document.createElement('p');
    rogueHeaderMessage.classList.add('sku-roundset-selector-desc','ta-center');
    rogueHeaderMessage.innerHTML = "This will generate a nice image to share with others of your progress in extracting the artifacts.<br>This may not work as intended on mobile, and is currently broken on Firefox due to a bug with fonts.";
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
        saveRogueDataToLocalStorage();
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
        backState = "imageBuilderModal";
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
        saveRogueDataToLocalStorage();
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
            previousOAKEntry.classList.add('previous-oak-entry', 'd-flex', 'jc-between', 'ai-center');
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
                saveRogueDataToLocalStorage();
            })
            previousOAKEntry.appendChild(useButton);
        })
    }
}

function generateAvatarSelector() {
    let modal = document.createElement('div');
    modal.classList.add('error-modal-overlay');
    document.body.appendChild(modal);

    addToBackQueue({callback: () => {modal.remove()}})

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
            saveRogueDataToLocalStorage();
            modal.remove();
            backState = "home";
        })
        modalAvatars.appendChild(avatar);
    }
}

function generateBannerSelector() {
    let modal = document.createElement('div');
    modal.classList.add('error-modal-overlay');
    document.body.appendChild(modal);

    addToBackQueue({callback: () => {modal.remove()}})

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
            saveRogueDataToLocalStorage();
            modal.remove();
            backState = "home";
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
            saveRogueDataToLocalStorage();
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
        case "Rarity (Ascending)":
            artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => a[1].tier - b[1].tier))
            break;
        case "Rarity (Descending)":
            artifacts = Object.fromEntries(Object.entries(artifacts).sort((a, b) => b[1].tier - a[1].tier))
            break;
    }

    Object.values(artifacts).forEach(artifact => {
        if (starterArtifacts.includes(artifact.nameLocKey)) { return; }
        mainArtifactsDiv.appendChild(generateArtifactContainer(artifact,'force'));
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
            // skipFonts: true
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
            loadRogueDataFromLocalStorage();
        }
        reader.readAsText(file);
    })
}

function saveRogueDataToLocalStorage() {
    localStorage.setItem('rogueSaveData', JSON.stringify(rogueSaveData));
}

function loadRogueDataFromLocalStorage() {
    let data = localStorage.getItem('rogueSaveData');
    if (data) {
        rogueSaveData = JSON.parse(data);
    }
    readLocalStorage();
}