let readyFlags = [0,0,0,0,0]
let pressedStart = false;
let locJSON = {}
let constants = {}

let currentInstaView = "game";
let instasMissingToggle = false;

let processedInstaData = {
    "TowerTotal": {},
    "TowerTierTotals": {},
    "TowerMissingByTier": {},
    "TowerBorders": {},
    "TowerObtained": {}
}

let currentCollectionChest = "None";
let currentCollectionTower = "All";
let collectionMissingToggle = true;
let collectionListSortType = "Highest Total Chance";

let chestSelectorMap = {
    "wood": "Wooden",
    "bronze": "Bronze",
    "silver": "Silver",
    "gold": "Gold",
    "diamond": "Diamond"
}

let loggedIn = false;

fetch('./data/Constants.json')
    .then(response => response.json())
    .then(data => {
        constants = data;
        readyFlags[4] = 1
    })
    .catch(error => {
        console.error('Error:', error)
        errorModal(error, "js")
});

function fetchDependencies() {
    Promise.all([
        fetch('./data/English.json').then(response => response.json()),    ])
    .then(([englishData]) => {
        locJSON = englishData;
        readyFlags[2] = 1;
        readyFlags[3] = 1;
        generateIfReady();
    })
    .catch(error => {
        console.error('Error:', error);
        errorModal(error, "js");
    });

    showLoading();
}

function generateIfReady(){
    if (readyFlags.every(flag => flag === 1)){
        document.getElementById("front-page").style.display = "none";
        document.body.classList.add('transition-bg')
        generateInstaData()
        generateInstaMonkeysProgress();
    }
}

function previewSite(){
   fetchDependencies(true); 
}

function generateInstaData(){
    let towerTotal = {};
    let towerTierTotals = {};
    let towerMissingByTier = {};
    let towerBorders = {};
    let towerObtained = {};
    for (let [tower, data] of Object.entries(btd6usersave.instaTowers)){
        towerObtained[tower] = [],
        towerTotal[tower] = 0;
        let towerTiersTemplate = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0
        }
        towerTierTotals[tower] = towerTierTotals[tower] || towerTiersTemplate;
        let missingInstasTemplate = {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": []
        }
        towerMissingByTier[tower] = towerMissingByTier[tower] || missingInstasTemplate;
        for (let [tier, count] of Object.entries(data)){
            towerTotal[tower] += count;
            if (constants.instaTiers["5"].includes(tier)) {
                towerTierTotals[tower]["5"] += 1;
            }
            if (constants.instaTiers["4"].includes(tier)) {
                towerTierTotals[tower]["4"] += 1;
            }
            if (constants.instaTiers["3"].includes(tier)) {
                towerTierTotals[tower]["3"] += 1;
            }
            if (constants.instaTiers["2"].includes(tier)) {
                towerTierTotals[tower]["2"] += 1;
            }
            if (constants.instaTiers["1"].includes(tier)) {
                towerTierTotals[tower]["1"] += 1;
            }
        }

        constants.collectionOrder.forEach((tier) => {
            if (data[tier] == null){
                if (constants.instaTiers["5"].includes(tier)){
                    towerMissingByTier[tower]["5"].push(tier);
                }
                if (constants.instaTiers["4"].includes(tier)){
                    towerMissingByTier[tower]["4"].push(tier);
                }
                if (constants.instaTiers["3"].includes(tier)){
                    towerMissingByTier[tower]["3"].push(tier);
                }
                if (constants.instaTiers["2"].includes(tier)){
                    towerMissingByTier[tower]["2"].push(tier);
                }
                if (constants.instaTiers["1"].includes(tier)){
                    towerMissingByTier[tower]["1"].push(tier);
                }
            }
        })

        if (towerTierTotals[tower]["4"] == constants.instaTiers["4"].length && towerTierTotals[tower]["3"] == constants.instaTiers["3"].length && towerTierTotals[tower]["2"] == constants.instaTiers["2"].length && towerTierTotals[tower]["1"] == constants.instaTiers["1"].length){
            if (towerTierTotals[tower]["5"] == constants.instaTiers["5"].length) {
                towerBorders[tower] = "Black";
                continue;
            }
            towerBorders[tower] = "Gold";
        } else {
            towerBorders[tower] = "";
        }
    }
    processedInstaData["TowerTotal"] = towerTotal;
    processedInstaData["TowerTierTotals"] = towerTierTotals;
    processedInstaData["TowerMissingByTier"] = towerMissingByTier;
    processedInstaData["TowerBorders"] = towerBorders;
    processedInstaData["TowerObtained"] = towerObtained;
}

function calculateInstaBorder(tower) {
    if (processedInstaData.TowerTierTotals[tower]["4"] == constants.instaTiers["4"].length && processedInstaData.TowerTierTotals[tower]["3"] == constants.instaTiers["3"].length && processedInstaData.TowerTierTotals[tower]["2"] == constants.instaTiers["2"].length && processedInstaData.TowerTierTotals[tower]["1"] == constants.instaTiers["1"].length){
        if (processedInstaData.TowerTierTotals[tower]["5"] == constants.instaTiers["5"].length) {
            processedInstaData.TowerBorders[tower] = "Black";
        } else {
            processedInstaData.TowerBorders[tower] = "Gold";
        }
    } else {
        processedInstaData.TowerBorders[tower] = "";
    }
}

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

function generateAvatar(size, src){
    let avatar = document.createElement('div');
    avatar.style.width = `${size}px`;
    avatar.style.height = `${size}px`;
    avatar.classList.add('avatar');

    let avatarFrame = document.createElement('img');
    avatarFrame.classList.add('avatar-frame','noSelect');
    avatarFrame.style.width = `${size}px`;
    avatarFrame.src = '../Assets/UI/InstaTowersContainer.png';
    avatar.appendChild(avatarFrame);

    let avatarImg = document.createElement('img');
    avatarImg.classList.add('avatar-img','noSelect');
    avatarImg.style.width = `${size}px`;
    avatarImg.src = src;
    avatar.appendChild(avatarImg);
    return avatar;
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
title.innerHTML = 'Bloons TD 6 Insta Tracker';
headerDiv.appendChild(title);

const content = document.createElement('div');
content.classList.add('content');
container.appendChild(content);

let contentElement = document.createElement('div');
contentElement.id = 'progress-content';
contentElement.classList.add(`content-div`);
contentElement.classList.add(`progress`)
content.appendChild(contentElement);

readLocalStorage()
generateFrontPage()
function generateFrontPage(){
    if(document.getElementById('front-page') != null){
        document.getElementById('front-page').remove();
    }

    const frontPage = document.createElement('div');
    frontPage.id = 'front-page';
    frontPage.classList.add('front-page');
    content.appendChild(frontPage);

    let frontPageText = document.createElement('p');
    frontPageText.classList.add('front-page-text');
    frontPageText.innerHTML = 'Access your profile using an OAK token to track your instas!';
    frontPage.appendChild(frontPageText);

    let previousOAK = document.createElement('div');
    previousOAK.classList.add('previous-oak');
    frontPage.appendChild(previousOAK);

    Object.entries(localStorageOAK).forEach(([oak, oakdata]) => {
        let previousOAKEntry = document.createElement('div');
        previousOAKEntry.classList.add('previous-oak-entry');
        previousOAKEntry.style.backgroundImage = `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(${oakdata.banner})`;
        previousOAK.appendChild(previousOAKEntry);

        previousOAKEntry.appendChild(generateAvatar(100, oakdata.avatar));

        let profileName = document.createElement('p');
        profileName.classList.add('profile-name','black-outline');
        profileName.innerHTML = oakdata.displayName;
        previousOAKEntry.appendChild(profileName);

        let useButton = document.createElement('img');
        useButton.classList.add('use-button');
        useButton.src = './Assets/UI/ContinueBtn.png';
        useButton.addEventListener('click', () => {
            if (!pressedStart){
                pressedStart = true;
                document.getElementById("loading").style.removeProperty("transform");
                loggedIn = true;
                oak_token = oak;
                getSaveData(oak);
            }
        })
        previousOAKEntry.appendChild(useButton);

        let deleteButton = document.createElement('img');
        deleteButton.classList.add('delete-button');
        deleteButton.src = './Assets/UI/CloseBtn.png'
        deleteButton.addEventListener('click', () => {
            delete localStorageOAK[oak];
            writeLocalStorage();
            previousOAK.removeChild(previousOAKEntry);
        })
        previousOAKEntry.appendChild(deleteButton);
    })

    //two buttons
    //use without oak
    let siteAccessDiv = document.createElement('div');
    siteAccessDiv.classList.add('site-access-div');
    frontPage.appendChild(siteAccessDiv);

    let oakEntryDiv = document.createElement('div');
    oakEntryDiv.classList.add('oak-entry-div');
    frontPage.appendChild(oakEntryDiv);
    
    let keyEntry = document.createElement('input');
    keyEntry.classList.add('key-entry');
    keyEntry.placeholder = 'Enter your OAK here';
    oakEntryDiv.appendChild(keyEntry);
    
    let startButton = document.createElement('div');
    startButton.classList.add('start-button','black-outline');
    startButton.innerHTML = 'Start';
    startButton.addEventListener('click', () => {
        let key = keyEntry.value;
        if (key.length < 5 || key.length > 30 || !key.startsWith('oak_')){
            errorModal('Please enter a valid OAK! This will start with "oak_".');
            return;
        }
        if (!pressedStart){
            document.getElementById("loading").style.removeProperty("transform");
            pressedStart = true;
            loggedIn = true;
            oak_token = keyEntry.value;
            getSaveData(oak_token);
        }
    })
    oakEntryDiv.appendChild(startButton);

    let getOakDiv = document.createElement('div');
    getOakDiv.classList.add('get-oak-div');
    frontPage.appendChild(getOakDiv);

    let whereText = document.createElement('p');
    whereText.classList.add('where-text');
    whereText.innerHTML = 'Don\'t have an OAK token? Read here:';
    getOakDiv.appendChild(whereText);

    let whereButton = document.createElement('p');
    whereButton.classList.add('where-button','black-outline');
    whereButton.innerHTML = 'View OAK Guide';
    getOakDiv.appendChild(whereButton);

    let OAKInstructionsDiv = document.createElement('div');
    OAKInstructionsDiv.id = 'oak-instructions-div';
    OAKInstructionsDiv.classList.add('oak-instructions-div');
    OAKInstructionsDiv.style.display = 'none';
    frontPage.appendChild(OAKInstructionsDiv);

    let disclaimerText = document.createElement('p');
    disclaimerText.classList.add('disclaimer-text');
    disclaimerText.style.textAlign = 'center';
    disclaimerText.style.lineHeight = '20px';
    disclaimerText.innerHTML = 'This is a standalone form of the Insta Monkey section from a larger project. <br>You can view it here: <a href="https://BTD6APIExplorer.github.io">Bloons TD 6 API Explorer</a>';
    frontPage.appendChild(disclaimerText);

    let OtherInfoHeader = document.createElement('p');
    OtherInfoHeader.classList.add('site-info-header','black-outline');
    OtherInfoHeader.innerHTML = 'Site Information';
    // frontPage.appendChild(OtherInfoHeader);

    let infoButtons = document.createElement('div');
    infoButtons.classList.add('info-buttons');
    // frontPage.appendChild(infoButtons);

    let trailerButton = document.createElement('p');
    trailerButton.classList.add('where-button','black-outline');
    trailerButton.innerHTML = 'Watch Trailer';
    // infoButtons.appendChild(trailerButton);

    let faqButton = document.createElement('p');
    faqButton.classList.add('where-button','black-outline')
    faqButton.innerHTML = 'FAQ';
    // infoButtons.appendChild(faqButton);

    let knownIssuesButton = document.createElement('p');
    knownIssuesButton.classList.add('where-button','black-outline');
    knownIssuesButton.innerHTML = 'Known Issues';
    // infoButtons.appendChild(knownIssuesButton);

    let changelogButton = document.createElement('p');
    changelogButton.classList.add('where-button','black-outline');
    changelogButton.innerHTML = 'Changelog';
    // infoButtons.appendChild(changelogButton);

    let privacyButton = document.createElement('p');
    privacyButton.classList.add('where-button', 'black-outline');
    privacyButton.innerHTML = 'Privacy Policy';
    // infoButtons.appendChild(privacyButton);

    let feedbackButton = document.createElement('p');
    feedbackButton.classList.add('where-button','black-outline');
    feedbackButton.innerHTML = 'Send Feedback';
    // infoButtons.appendChild(feedbackButton);

    let FAQDiv = document.createElement('div');
    FAQDiv.id = 'faq-div';
    FAQDiv.classList.add('faq-div');
    FAQDiv.style.display = 'none';
    frontPage.appendChild(FAQDiv);

    let privacyDiv = document.createElement('div');
    privacyDiv.id = 'privacy-div';
    privacyDiv.classList.add('privacy-div');
    privacyDiv.style.display = 'none';
    frontPage.appendChild(privacyDiv);

    let knownIssuesDiv = document.createElement('div');
    knownIssuesDiv.id = 'known-issues-div';
    knownIssuesDiv.classList.add('known-issues-div');
    knownIssuesDiv.style.display = 'none';
    frontPage.appendChild(knownIssuesDiv);

    let changelogDiv = document.createElement('div');
    changelogDiv.id = 'changelog-div';
    changelogDiv.classList.add('changelog-div');
    changelogDiv.style.display = 'none';
    frontPage.appendChild(changelogDiv);

    let trailerDiv = document.createElement('div');
    trailerDiv.id = 'trailer-div';
    trailerDiv.classList.add('trailer-div');
    trailerDiv.style.display = 'none';
    frontPage.appendChild(trailerDiv);

    let feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'feedback-div';
    feedbackDiv.classList.add('feedback-div');
    feedbackDiv.style.display = 'none';
    frontPage.appendChild(feedbackDiv);

    let versionDiv = document.createElement('div');
    versionDiv.id = 'version-div';
    versionDiv.classList.add('version-div');
    frontPage.appendChild(versionDiv);

    whereButton.id = 'oak-instructions-button';
    whereButton.addEventListener('click', () => {
        hideAllButOne('oak-instructions')
    })

    faqButton.id = 'faq-button';
    faqButton.addEventListener('click', () => {
        hideAllButOne('faq')
    })

    privacyButton.id = 'privacy-button';
    privacyButton.addEventListener('click', () => {
        hideAllButOne('privacy')
    })

    knownIssuesButton.id = 'known-issues-button';
    knownIssuesButton.addEventListener('click', () => {
        hideAllButOne('known-issues')
    })

    changelogButton.id = 'changelog-button';
    changelogButton.addEventListener('click', () => {
        hideAllButOne('changelog')
    })

    trailerButton.id = 'trailer-button';

    feedbackButton.id = 'feedback-button';
    feedbackButton.addEventListener('click', () => {
        hideAllButOne('feedback')
    })

    let OAKInstructionsHeader = document.createElement('p');
    OAKInstructionsHeader.classList.add('oak-instructions-header','black-outline');
    OAKInstructionsHeader.innerHTML = 'What is an Open Access Key?';
    OAKInstructionsDiv.appendChild(OAKInstructionsHeader);

    let OAKInstructionsText = document.createElement('p');
    OAKInstructionsText.classList.add('oak-instructions-text');
    OAKInstructionsText.innerHTML = 'An Open Access Key (OAK) is a unique key that allows you to access your Bloons TD 6 data from Ninja Kiwi\'s Open Data API. The site will use this to fetch your information from the API. <br><br>NOTE: This site is unfortunately not available for BTD6+ on Apple Arcade and BTD6 Netflix as OAK tokens are unavailable.';
    OAKInstructionsDiv.appendChild(OAKInstructionsText);

    let OAKInstructionsHeader2 = document.createElement('p');
    OAKInstructionsHeader2.classList.add('oak-instructions-header','black-outline');
    OAKInstructionsHeader2.innerHTML = 'How do I get one?';
    OAKInstructionsDiv.appendChild(OAKInstructionsHeader2);

    let OAKInstructionsText2 = document.createElement('p');
    OAKInstructionsText2.classList.add('oak-instructions-text');
    OAKInstructionsText2.innerHTML = 'Step 1: Login and Backup your progress with a Ninja Kiwi Account in BTD6. You can do this by going to settings from the main menu and clicking on the Account button.';
    OAKInstructionsDiv.appendChild(OAKInstructionsText2);

    let OAKInstuctionImg = document.createElement('img');
    OAKInstuctionImg.classList.add('oak-instruction-img');
    OAKInstuctionImg.src = './Assets/UI/OAKTutorial1.jpg';
    OAKInstructionsDiv.appendChild(OAKInstuctionImg);

    let OAKInstructionsText3 = document.createElement('p');
    OAKInstructionsText3.classList.add('oak-instructions-text');
    OAKInstructionsText3.innerHTML = 'Step 2: Select "Open Data API" at the bottom right of the account screen.';
    OAKInstructionsDiv.appendChild(OAKInstructionsText3);

    let OAKInstuctionImg2 = document.createElement('img');
    OAKInstuctionImg2.classList.add('oak-instruction-img');
    OAKInstuctionImg2.src = './Assets/UI/OAKTutorial2.jpg';
    OAKInstructionsDiv.appendChild(OAKInstuctionImg2);

    let OAKInstructionsText4 = document.createElement('p');
    OAKInstructionsText4.classList.add('oak-instructions-text');
    OAKInstructionsText4.innerHTML = 'Step 3: Generate a key and copy that in to the above text field. It should start with "oak_". Then click "Start" to begin!';
    OAKInstructionsDiv.appendChild(OAKInstructionsText4);

    let OAKInstuctionImg3 = document.createElement('img');
    OAKInstuctionImg3.classList.add('oak-instruction-img');
    OAKInstuctionImg3.src = './Assets/UI/OAKTutorial3.jpg';
    OAKInstructionsDiv.appendChild(OAKInstuctionImg3);

    let oakInstructionFooter = document.createElement('p');
    oakInstructionFooter.classList.add('oak-instructions-text');
    oakInstructionFooter.innerHTML = 'You can read more about the Open Data API here: <a href="https://ninja.kiwi/opendatafaq" target="_blank", style="color:white";>Open Data API Article</a>';
    OAKInstructionsDiv.appendChild(oakInstructionFooter);

    let faqHeader = document.createElement('p');
    faqHeader.classList.add('oak-instructions-header','black-outline');
    faqHeader.innerHTML = 'Frequently Asked Questions';
    FAQDiv.appendChild(faqHeader);

    let FAQ = {
        "What can I do with this?": "Some primary uses are tracking your progress automatically, viewing events and leaderboards up to two months in the past, browsing user generated content, and as a bonus feature: viewing round information. You can also view more detailed stats and progress than you can see in the game such as your highest round for every mode on every map you've played. Those who are working on their Insta Monkey collection can use this as a tracker as the data pulled is always up to date!",
        "How long does the API take to update after I do something in the game?": "15 minutes is the most I've seen. Be sure to press the save button in settings if you want to minimize the time it takes to update! It should not take more than 24 hours to update in any circumstance (browser caching, etc).",
        "Why is this not available for BTD6+ and Netflix?": "This is because the data is stored differently for these versions such as using iCloud for BTD6+. This is not compatible with the Open Data API."
    }

    for (let [question, answer] of Object.entries(FAQ)){
        let FAQEntryDiv = document.createElement('div');
        FAQEntryDiv.classList.add('faq-entry-div');
        FAQDiv.appendChild(FAQEntryDiv);

        let FAQQuestionDiv = document.createElement('div');
        FAQQuestionDiv.classList.add('faq-question-div');
        FAQEntryDiv.appendChild(FAQQuestionDiv);

        let FAQQuestion = document.createElement('p');
        FAQQuestion.classList.add('faq-question');
        FAQQuestion.innerHTML = question;
        FAQQuestionDiv.appendChild(FAQQuestion);

        let arrowHideBtn = document.createElement('img');
        arrowHideBtn.classList.add('arrow-hide-btn');
        arrowHideBtn.src = './Assets/UI/ArrowHideBtn.png';
        FAQQuestionDiv.appendChild(arrowHideBtn);

        let FAQAnswerDiv = document.createElement('div');
        FAQAnswerDiv.classList.add('faq-answer-div');
        FAQAnswerDiv.style.display = 'none';
        FAQEntryDiv.appendChild(FAQAnswerDiv);

        let FAQAnswer = document.createElement('p');
        FAQAnswer.classList.add('faq-answer');
        FAQAnswer.innerHTML = answer;
        FAQAnswerDiv.appendChild(FAQAnswer);

        FAQQuestionDiv.addEventListener('click', () => {
            if (FAQAnswerDiv.style.display === 'none'){
                FAQAnswerDiv.style.display = 'block';
                arrowHideBtn.style.transform = 'rotate(180deg)';
            } else {
                FAQAnswerDiv.style.display = 'none';
                arrowHideBtn.style.transform = 'rotate(0deg)';
            }
        })
    }

    let privacyHeader = document.createElement('p');
    privacyHeader.classList.add('oak-instructions-header','black-outline');
    privacyHeader.innerHTML = 'Privacy Policy';
    privacyDiv.appendChild(privacyHeader);

    let privacyText = document.createElement('p');
    privacyText.classList.add('oak-instructions-text');
    privacyText.innerHTML = 'This app does not store any data being sent to or retrieved from Ninja Kiwi\'s Open Data API outside of your browser/device. The localStorage browser feature is used to prevent users from having to re-enter their OAK token every time they visit the site. If you would like to delete this stored data, you can do so by clicking the "X" on the profile you would like to delete on this homepage or clearing your browsing data.';
    privacyDiv.appendChild(privacyText);

    let knownIsseusHeader = document.createElement('p');
    knownIsseusHeader.classList.add('oak-instructions-header','black-outline');
    knownIsseusHeader.innerHTML = 'Known Issues';
    knownIssuesDiv.appendChild(knownIsseusHeader);

    let knownIssuesText = document.createElement('p');
    knownIssuesText.classList.add('oak-instructions-text');
    knownIssuesText.innerHTML = '- Insta Monkeys that are collected but used do not show up<br>- Mermonkey does not show up in the Top Towers section of profiles';
    knownIssuesDiv.appendChild(knownIssuesText);
    
    let trailerVideo = document.createElement('video');
    trailerVideo.preload = 'none';
    trailerVideo.classList.add('trailer-video');
    trailerVideo.src = './Assets/Trailer/Trailer.mp4';
    trailerVideo.controls = true;
    trailerDiv.appendChild(trailerVideo);

    trailerButton.addEventListener('click', () => {
        hideAllButOne('trailer')
        trailerVideo.play();
    })

    let changelogHeader = document.createElement('p');
    changelogHeader.classList.add('oak-instructions-header','black-outline');
    changelogHeader.innerHTML = 'Changelog';
    changelogDiv.appendChild(changelogHeader);

    let changelogText = document.createElement('p');
    changelogText.classList.add('oak-instructions-text');
    changelogText.innerHTML = 'v1.2.0: Preview Mode and UI Improvements <br>- Added a way to use the site without an OAK token. Useful when you don\'t have it accessible or can\'t make one<br>- The site now prompts when your data has new content that the site doesn\'t have updated yet<br>- Challenge details now correctly shows the max amount of specific monkeys if limited<br>- Other UI fixes<br><br> v1.1.0: Insta Monkey Collection Features<br>- Added Insta Monkey Collection Event Helper. This displays the odds of getting a new Insta Monkey for each chest type and when selecting a featured tower.<br>- Also added a page documentating all of the continuous sources of Insta Monkeys<br>- UI fixes and improvements<br><br>v1.0.1: Bug Fixes<br>- Daily challenges now show the correct associated date<br>- Rework roundset processing to fix numerous bugs<br>- Add extra one-off roundsets to the list for completion sake<br>- Other minor UI fixes<br><br>v1.0.0: Initial Release<br>- The Odyssey tab is still being worked on and will be added in the near future.<br>- An Insta Monkeys Rotation helper will also be added soon.';
    changelogDiv.appendChild(changelogText);

    let feedbackHeader = document.createElement('p');
    feedbackHeader.classList.add('oak-instructions-header','black-outline');
    feedbackHeader.innerHTML = 'Send Feedback';
    feedbackDiv.appendChild(feedbackHeader);

    let feedbackText = document.createElement('p');
    feedbackText.classList.add('oak-instructions-text');
    feedbackText.innerHTML = 'If you have any feedback, things to add or change on the site, or most importantly bug reports, please fill out this anonymous form: <a href="https://forms.gle/Tg1PuRNj2ftojMde6" target="_blank" style="color: white;">Feedback Form</a>';
    feedbackDiv.appendChild(feedbackText);

    function hideAllButOne(tab){
        ["oak-instructions"].forEach((tabName) => {
            let contentDiv = document.getElementById(tabName + '-div');
            let tabButton = document.getElementById(tabName + '-button');
            if (tabName === tab && contentDiv.style.display == 'none') {
                tabButton.classList.add('square-btn-yellow');
                contentDiv.style.display = 'block';
                activeTab = tab;
            } else {
                tabButton.classList.remove('square-btn-yellow');
                contentDiv.style.display = 'none';
            }
        });
    }

    let StandaloneSiteDiv = document.createElement('div');
    StandaloneSiteDiv.classList.add('site-access-div');
    frontPage.appendChild(StandaloneSiteDiv);

    let StandaloneSiteText = document.createElement('p');
    StandaloneSiteText.classList.add('site-info-header', 'sites-text', 'black-outline');
    StandaloneSiteText.innerHTML = 'Other Sites';
    StandaloneSiteDiv.appendChild(StandaloneSiteText);

    let siteButtons = document.createElement('div');
    siteButtons.classList.add('standalone-site-buttons');
    StandaloneSiteDiv.appendChild(siteButtons);

    let standaloneSites = {
        "Main Site": {
            "link": "https://btd6apiexplorer.github.io/",
            "text": "Main Site",
            "icon": "SiteBtn",
            "background": "OverviewProfile"
        },
        "Roundsets": {
            "link": "https://btd6apiexplorer.github.io/rounds",
            "text": "Roundsets",
            "icon": "DefaultRoundSetIcon",
            "background": "BloonsBG"
        },
        "Rogue Artifacts": {
            "link": "https://btd6apiexplorer.github.io/rogue",
            "text": "Rogue Artifacts",
            "icon": "RogueSiteBtn",
            "background": "RogueBG"
        },
        "Leaderboards": {
            "link": "https://btd6apiexplorer.github.io/leaderboards",
            "text": "Leaderboards",
            "icon": "LeaderboardSiteBtn",
            "background": "TrophyStoreTiledBG"
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

function generateInstaMonkeysProgress() {
    let progressContent = document.getElementById('progress-content');
    progressContent.innerHTML = "";

    let instaMonkeysHeaderBar = document.createElement('div');
    instaMonkeysHeaderBar.classList.add('insta-monkeys-header-bar');
    progressContent.appendChild(instaMonkeysHeaderBar);

    let instaMonkeysViews = document.createElement('div');
    instaMonkeysViews.classList.add('maps-progress-views');
    instaMonkeysHeaderBar.appendChild(instaMonkeysViews);

    let mapsProgressViewsText = document.createElement('p');
    mapsProgressViewsText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressViewsText.classList.add('black-outline');
    mapsProgressViewsText.innerHTML = "View Inventory:";
    instaMonkeysViews.appendChild(mapsProgressViewsText);


    let instaMonkeysGameView = document.createElement('div');
    instaMonkeysGameView.id = 'insta-monkeys-game-view';
    instaMonkeysGameView.classList.add('maps-progress-view','black-outline');
    instaMonkeysGameView.innerHTML = "Game";
    instaMonkeysGameView.addEventListener('click', () => {
        currentInstaView = "game";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysViews.appendChild(instaMonkeysGameView);

    let instaMonkeysListView = document.createElement('div');
    instaMonkeysListView.id = 'insta-monkeys-list-view';
    instaMonkeysListView.classList.add('maps-progress-view','black-outline');
    instaMonkeysListView.innerHTML = "List";
    instaMonkeysListView.addEventListener('click', () => {
        currentInstaView = "list";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysViews.appendChild(instaMonkeysListView);

    let instaMonkeyProgressText = document.createElement('p');
    instaMonkeyProgressText.id = "insta-total-counter";
    instaMonkeyProgressText.classList.add('insta-monkey-progress-text','insta-total-counter','black-outline');
    instaMonkeyProgressText.innerHTML = `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
    instaMonkeysHeaderBar.appendChild(instaMonkeyProgressText);

    let instaMonkeysExtras = document.createElement('div');
    instaMonkeysExtras.classList.add('maps-progress-views');
    instaMonkeysHeaderBar.appendChild(instaMonkeysExtras);

    let instaMonkeysObtainView = document.createElement('div');
    instaMonkeysObtainView.id = 'insta-monkeys-obtain-view';
    instaMonkeysObtainView.classList.add('maps-progress-view','black-outline');
    // instaMonkeysObtainView.innerHTML = "Where To Get";
    instaMonkeysObtainView.innerHTML = "Get More";
    instaMonkeysObtainView.addEventListener('click', () => {
        currentInstaView = "obtain";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysExtras.appendChild(instaMonkeysObtainView);

    let instaMonkeysCollectionView = document.createElement('div');
    instaMonkeysCollectionView.id = 'insta-monkeys-collection-view';
    instaMonkeysCollectionView.classList.add('maps-progress-view','black-outline');
    instaMonkeysCollectionView.innerHTML = "Collection Event";
    instaMonkeysCollectionView.addEventListener('click', () => {
        currentInstaView = "collection";
        onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
    })
    instaMonkeysExtras.appendChild(instaMonkeysCollectionView);

    let instaMonkeysProgressContainer = document.createElement('div');
    instaMonkeysProgressContainer.id = 'insta-monkeys-progress-container';
    instaMonkeysProgressContainer.classList.add('insta-monkeys-progress-container');
    progressContent.appendChild(instaMonkeysProgressContainer);

    let instaMonkeyProgressContainer = document.createElement('div');
    instaMonkeyProgressContainer.id = 'insta-monkey-progress-container';
    instaMonkeyProgressContainer.classList.add('insta-monkey-progress-container');
    instaMonkeyProgressContainer.style.display = "none";
    progressContent.appendChild(instaMonkeyProgressContainer);

    onChangeInstaMonkeysView(instaMonkeysHeaderBar, currentInstaView);
}

function onChangeInstaMonkeysView(instaMonkeysHeaderBar, view) {
    document.getElementById('insta-monkeys-progress-container').style.removeProperty('display');
    document.getElementById('insta-monkey-progress-container').style.display = "none";
    let instaTabs = ['game','list','obtain','collection'];
    instaTabs.forEach(tab => {
        document.getElementById(`insta-monkeys-${tab}-view`).classList.remove('stats-tab-yellow');
    })
    document.getElementById(`insta-monkeys-${view}-view`).classList.add('stats-tab-yellow');
    switch (view) {
        case "game":
            instaMonkeysHeaderBar.classList.remove('border-top-only');
            generateInstaGameView();
            break;
        case "list":
            instaMonkeysHeaderBar.classList.remove('border-top-only');
            generateInstaListView();
            break;
        case "obtain":
            instaMonkeysHeaderBar.classList.add('border-top-only');
            generateInstaObtainGuide();
            break;
        case "collection":
            instaMonkeysHeaderBar.classList.add('border-top-only');
            generateInstaCollectionEventHelper();
            break;
    }
}

function generateInstaGameView(){
    let instaMonkeysProgressContainer = document.getElementById('insta-monkeys-progress-container');
    instaMonkeysProgressContainer.innerHTML = "";

    let instaMonkeyGameContainer = document.createElement('div');
    instaMonkeyGameContainer.classList.add('insta-monkey-game-container');
    instaMonkeysProgressContainer.appendChild(instaMonkeyGameContainer);

    let towersContainer = document.createElement('div');
    towersContainer.classList.add('towers-container');
    instaMonkeyGameContainer.appendChild(towersContainer);


    let firstInstas = [], grayInstas = [];
    Object.keys(constants.towersInOrder).forEach(key => {
        if(!Object.keys(btd6usersave.unlockedTowers).includes(key)) {return}
        if (processedInstaData.TowerTotal[key] !== undefined) {
            firstInstas.push(key);
        } else {
            grayInstas.push(key);
        }
    });

    firstInstas.concat(grayInstas).forEach(tower => {
        let towerContainer = document.createElement('div');
        towerContainer.classList.add('tower-container');
        towerContainer.style.backgroundImage = `url(./Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower] || ""}.png)`
        towerContainer.addEventListener('click', () => {
            onSelectInstaTower(tower);
        })
        towersContainer.appendChild(towerContainer);

        let towerImg = document.createElement('img');
        towerImg.classList.add(`tower-img`);
        towerImg.src = getInstaContainerIcon(tower,'000');
        towerContainer.appendChild(towerImg);

        let towerName = document.createElement('p');
        towerName.classList.add(`tower-name`,'black-outline');
        towerName.innerHTML = getLocValue(tower);
        towerContainer.appendChild(towerName);

        if (processedInstaData.TowerTotal[tower] != undefined) { 
            let towerTotalDiv = document.createElement('p');
            towerTotalDiv.classList.add(`insta-progress`);
            towerContainer.appendChild(towerTotalDiv);

            let towerTotal = document.createElement('p');
            towerTotal.classList.add(`power-progress-text`,'black-outline');
            towerTotal.innerHTML = processedInstaData.TowerTotal[tower] || 0;
            towerTotalDiv.appendChild(towerTotal);
        } else {
            towerContainer.classList.add('insta-tower-container-none');
        }
    }) 
}

function onSelectInstaTower(tower) {
    document.getElementById('insta-monkeys-progress-container').style.display = "none";
    document.getElementById('insta-monkey-progress-container').style.display = "flex";
    generateSingleInstaTower(tower);
}

function generateSingleInstaTower(tower) {
    let instaMonkeyProgressContainer = document.getElementById('insta-monkey-progress-container');
    instaMonkeyProgressContainer.innerHTML = "";

    let instaMonkeyDiv = document.createElement('div');
    instaMonkeyProgressContainer.appendChild(instaMonkeyDiv);
    
    let instaMonkeyTopBar = document.createElement('div');
    instaMonkeyTopBar.classList.add('insta-monkey-top-bar');
    instaMonkeyDiv.appendChild(instaMonkeyTopBar);

    let instaPrevArrow = document.createElement('div');
    instaPrevArrow.classList.add('insta-arrow');
    instaPrevArrow.addEventListener('click', () => {
        onSelectInstaPrevArrow(tower);
    })
    instaMonkeyTopBar.appendChild(instaPrevArrow);

    let instaPrevArrowImg = document.createElement('img');
    instaPrevArrowImg.classList.add('map-arrow-img');
    instaPrevArrowImg.src = "./Assets/UI/PrevArrow.png";
    instaPrevArrow.appendChild(instaPrevArrowImg);

    let instaMonkeyHeaderDiv = document.createElement('div');
    instaMonkeyHeaderDiv.classList.add('insta-monkey-header-div');
    switch(processedInstaData.TowerBorders[tower]) {
        case "Gold":
            instaMonkeyHeaderDiv.classList.add("insta-topbar-gold")
            break;
        case "Black":
            instaMonkeyHeaderDiv.classList.add("insta-topbar-black")
            break;
    }
    instaMonkeyTopBar.appendChild(instaMonkeyHeaderDiv);

    let instaNextArrow = document.createElement('div');
    instaNextArrow.classList.add('insta-arrow');
    instaNextArrow.addEventListener('click', () => {
        onSelectInstaNextArrow(tower);
    })
    instaMonkeyTopBar.appendChild(instaNextArrow);

    let instaNextArrowImg = document.createElement('img');
    instaNextArrowImg.classList.add('map-arrow-img');
    instaNextArrowImg.src = "./Assets/UI/NextArrow.png";
    instaNextArrow.appendChild(instaNextArrowImg);


    let instaProgressMissingToggle = document.createElement('div');
    instaProgressMissingToggle.classList.add('maps-progress-coop-toggle');  
    instaMonkeyHeaderDiv.appendChild(instaProgressMissingToggle);

    let instaProgressMissingToggleText = document.createElement('p');
    instaProgressMissingToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
    instaProgressMissingToggleText.innerHTML = "Missing: ";
    instaProgressMissingToggle.appendChild(instaProgressMissingToggleText);

    let instaProgressMissingToggleInput = document.createElement('input');
    instaProgressMissingToggleInput.classList.add('insta-progress-missing-toggle-input','MkOffRed');
    instaProgressMissingToggleInput.type = 'checkbox';
    instaProgressMissingToggleInput.addEventListener('change', () => {
        onSelectMissingToggle(instaProgressMissingToggleInput.checked)
    })
    instaProgressMissingToggleInput.checked = instasMissingToggle;
    instaProgressMissingToggle.appendChild(instaProgressMissingToggleInput);

    let instaMonkeyName = document.createElement('p');
    instaMonkeyName.classList.add('insta-monkey-name','black-outline');
    instaMonkeyName.innerHTML = getLocValue(tower);
    instaMonkeyHeaderDiv.appendChild(instaMonkeyName);

    let instaMonkeyProgress = document.createElement('div');
    instaMonkeyProgress.classList.add('insta-monkey-progress');
    instaMonkeyHeaderDiv.appendChild(instaMonkeyProgress);

    let instaMonkeyProgressText = document.createElement('p');
    instaMonkeyProgressText.classList.add('insta-monkey-progress-text','black-outline');
    instaMonkeyProgressText.innerHTML = `${processedInstaData.TowerTierTotals[tower] ? Object.values(processedInstaData.TowerTierTotals[tower]).reduce((a, b) => a + b, 0) : 0}/64`;
    instaMonkeyProgress.appendChild(instaMonkeyProgressText);

    let instaMonkeyMainContainer = document.createElement('div');
    instaMonkeyMainContainer.id = `${tower}-main-container`;
    instaMonkeyMainContainer.classList.add('insta-monkey-main-container');
    instaMonkeyDiv.appendChild(instaMonkeyMainContainer);

    generateInstaMonkeyIcons(tower);
    onSelectMissingToggle(instaProgressMissingToggleInput.checked);
}

function generateInstaMonkeyIcons(tower){
    let instaMonkeyMainContainer = document.getElementById(`${tower}-main-container`);
    instaMonkeyMainContainer.innerHTML = "";

    let instaMonkeyIconsContainer = document.createElement('div');
    instaMonkeyIconsContainer.classList.add('insta-monkey-icons-container');
    instaMonkeyMainContainer.appendChild(instaMonkeyIconsContainer);

    constants.collectionOrder.forEach(tiers => {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.classList.add('insta-monkey-tier-container');
        if (!btd6usersave.instaTowers.hasOwnProperty(tower) || !btd6usersave.instaTowers[tower][tiers]) { 
            instaMonkeyTierContainer.style.display = "none";
            instaMonkeyTierContainer.classList.add('insta-monkey-unobtained');
        }
        instaMonkeyIconsContainer.appendChild(instaMonkeyTierContainer);

        if (btd6usersave.instaTowers.hasOwnProperty(tower) && btd6usersave.instaTowers[tower][tiers] > 1){
            let towerTotalDiv = document.createElement('p');
            towerTotalDiv.classList.add(`insta-progress`,'insta-tier-scale');
            instaMonkeyTierContainer.appendChild(towerTotalDiv);

            let towerTotal = document.createElement('p');
            towerTotal.classList.add(`power-progress-text`,'black-outline');
            towerTotal.innerHTML = btd6usersave.instaTowers[tower][tiers];
            towerTotalDiv.appendChild(towerTotal);
        }

        let instaMonkeyTierImg = document.createElement('img');
        instaMonkeyTierImg.classList.add('insta-monkey-tier-img');
        instaMonkeyTierImg.src = btd6usersave.instaTowers.hasOwnProperty(tower) && btd6usersave.instaTowers[tower][tiers] != undefined ? getInstaMonkeyIcon(tower,tiers) : "./Assets/UI/InstaUncollected.png";
        instaMonkeyTierContainer.appendChild(instaMonkeyTierImg);

        if (btd6usersave.instaTowers.hasOwnProperty(tower) && btd6usersave.instaTowers[tower][tiers] == 0) {
            instaMonkeyTierImg.classList.add('upgrade-after-locked');
        }

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-tier-text','black-outline');
        instaMonkeyTierText.innerHTML = `${tiers[0]}-${tiers[1]}-${tiers[2]}`;
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);
    })
}

function onSelectMissingToggle(enabled){
    instasMissingToggle = enabled;
    for (let element of document.getElementsByClassName('insta-monkey-unobtained')) {
        element.style.display = instasMissingToggle ? "block" : "none";
    }
}

function onSelectInstaPrevArrow(tower){
    let towers = Object.keys(constants.towersInOrder);
    let index = towers.indexOf(tower);
    index == 0 ? index = towers.length - 1 : index--
    onSelectInstaTower(towers[index]);
}

function onSelectInstaNextArrow(tower){
    let towers = Object.keys(constants.towersInOrder);
    let index = towers.indexOf(tower);
    index == towers.length - 1 ? index = 0 : index++
    onSelectInstaTower(towers[index]);
}

function generateInstaListView(){
    let instaMonkeysProgressContainer = document.getElementById('insta-monkeys-progress-container');
    instaMonkeysProgressContainer.innerHTML = "";

    let instaMonkeysListContainer = document.createElement('div');
    instaMonkeysListContainer.classList.add('insta-monkeys-list-container');
    instaMonkeysProgressContainer.appendChild(instaMonkeysListContainer);

    let instaMonkeysList = document.createElement('div');
    instaMonkeysList.classList.add('insta-monkeys-list');
    instaMonkeysListContainer.appendChild(instaMonkeysList);

    Object.keys(constants.towersInOrder).forEach(tower => {
        if(processedInstaData.TowerTierTotals[tower] == null) { return; }
        let instaMonkeyDiv = document.createElement('div');
        instaMonkeyDiv.classList.add('insta-monkey-div');
        instaMonkeysList.appendChild(instaMonkeyDiv);

        switch(processedInstaData.TowerBorders[tower]) {
            case "Gold":
                instaMonkeyDiv.classList.add("insta-list-gold");
                break;
            case "Black":
                instaMonkeyDiv.classList.add("insta-list-black");
                break;
        }

        let instaTowerContainer = document.createElement('div');
        instaTowerContainer.classList.add('tower-container');
        instaTowerContainer.style.backgroundImage = `url(./Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower] || ""}.png)`
        instaTowerContainer.addEventListener('click', () => {
            onSelectInstaTower(tower);
        })
        instaMonkeyDiv.appendChild(instaTowerContainer);

        let instaMonkeyImg = document.createElement('img');
        instaMonkeyImg.classList.add('tower-img');
        instaMonkeyImg.src = getInstaContainerIcon(tower,'000');
        instaTowerContainer.appendChild(instaMonkeyImg);

        let instaMonkeyName = document.createElement('p');
        instaMonkeyName.classList.add(`tower-name`,'black-outline');
        instaMonkeyName.innerHTML = getLocValue(tower);
        instaTowerContainer.appendChild(instaMonkeyName);

        let instaMonkeyTopBottom = document.createElement('div');
        instaMonkeyTopBottom.classList.add('insta-monkey-top-bottom');
        instaMonkeyDiv.appendChild(instaMonkeyTopBottom);

        let instaMonkeyProgress = document.createElement('div');
        instaMonkeyProgress.classList.add('insta-monkey-progress-list');
        instaMonkeyTopBottom.appendChild(instaMonkeyProgress);

        let instaMonkeyTotal = document.createElement('div');
        instaMonkeyTotal.classList.add('insta-monkey-total');
        instaMonkeyProgress.appendChild(instaMonkeyTotal);

        let instaMonkeysTotalLabelText = document.createElement('p');
        instaMonkeysTotalLabelText.classList.add('insta-monkey-progress-label-text','black-outline');
        instaMonkeysTotalLabelText.innerHTML = "Usable Instas:";
        instaMonkeyTotal.appendChild(instaMonkeysTotalLabelText);

        let instaMonkeysTotalText = document.createElement('p');
        instaMonkeysTotalText.classList.add('insta-monkey-total-text','black-outline');
        instaMonkeysTotalText.innerHTML = processedInstaData.TowerTotal[tower];
        instaMonkeyTotal.appendChild(instaMonkeysTotalText);

        let instaMonkeyTierProgress = document.createElement('div');
        instaMonkeyTierProgress.classList.add('insta-monkey-tier-progress');
        instaMonkeyProgress.appendChild(instaMonkeyTierProgress);

        let instaMonkeyProgressLabelText = document.createElement('p');
        instaMonkeyProgressLabelText.classList.add('insta-monkey-progress-label-text','black-outline');
        instaMonkeyProgressLabelText.innerHTML = "Unique Instas:";
        instaMonkeyTierProgress.appendChild(instaMonkeyProgressLabelText);

        let instaMonkeyProgressText = document.createElement('p');
        instaMonkeyProgressText.classList.add('insta-monkey-progress-text','black-outline');
        instaMonkeyProgressText.innerHTML = `${Object.values(processedInstaData.TowerTierTotals[tower]).reduce((a, b) => a + b, 0)}/64`;
        instaMonkeyTierProgress.appendChild(instaMonkeyProgressText);

        let instaMonkeyTiersContainer = document.createElement('div');
        instaMonkeyTiersContainer.classList.add('insta-monkey-tiers-container');
        instaMonkeyTopBottom.appendChild(instaMonkeyTiersContainer);

        let instaMonkeyTiersLabel = document.createElement('p');
        instaMonkeyTiersLabel.classList.add('insta-monkey-tiers-label','black-outline');
        instaMonkeyTiersLabel.innerHTML = "Unique By Tier:";
        instaMonkeyTiersContainer.appendChild(instaMonkeyTiersLabel);

        for (let [tier, tierTotal] of Object.entries(processedInstaData.TowerTierTotals[tower])) {
            let instaMonkeyTierDiv = document.createElement('div');
            instaMonkeyTierDiv.classList.add('insta-monkey-tier-div');
            instaMonkeyTiersContainer.appendChild(instaMonkeyTierDiv);

            let instaMonkeyTierText = document.createElement('p');
            instaMonkeyTierText.classList.add('insta-monkey-tier-text-list', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierDiv.style.backgroundImage = `url(./Assets/UI/InstaTier${tier}Container.png)`
            instaMonkeyTierText.innerHTML = `${tierTotal}/${constants.instaTiers[tier].length}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierText);
        }
    })
}

function generateInstaObtainGuide() {
    let progressContent = document.getElementById('insta-monkeys-progress-container');
    progressContent.innerHTML = "";

    let obtainGuideDiv = document.createElement('div');
    obtainGuideDiv.classList.add('insta-monkeys-obtain-guide');
    progressContent.appendChild(obtainGuideDiv);

    let titleGuideText = document.createElement('p');
    titleGuideText.classList.add('insta-monkeys-guide-title-text','black-outline');
    titleGuideText.innerHTML = "Where To Get More Insta Monkeys";
    obtainGuideDiv.appendChild(titleGuideText);

    let methods = {
        "Collection": {
            "name": "Collection Events",
            "desc": "Collection events are the main way to get Insta Monkeys. They usually happen around holidays. During the event, collect as much of the event currency as possible to open crates that contain random Insta Monkeys. You can use the Collection Event tab to help you view the odds of getting a new Insta Monkey from each of the chest types."},
        "Daily": {
            "name": "Daily Challenges",
            "desc": "Daily Challenges often have random Insta Monkeys ranging from T1 to T3 as a reward. Coop Daily Challenges also give a random T1-T3 Insta Monkey. During a Collection event, these will give event currency for opening Insta Monkey chests."
        },
        "Boss": {
            "name": "Boss Events",
            "desc": "Boss events happen every week. Defeating the Tier 4 and Tier 5 bosses in these events give random Insta Monkeys. The Normal Boss rewards include a T2 and T3 Insta Monkey, and the Elite Boss rewards include a T3 and T4 Insta Monkey."
        },
        "Odyssey": {
            "name": "Odyssey Events",
            "desc": "Odyssey events give Insta Monkeys for completing the event and opening the chest. Medium difficulty usually gives a predetermined T3 Insta, and Hard gives a predetermined T4 Insta. During Collection events, Odysseys will give collection event currency instead for Insta Monkey chests."
        },
        "Ranked" : {
            "name": "Ranked Events",
            "desc": "Ranked events give random Insta Monkeys depending on your leaderboard placement. You can view Races, Bosses, and Contested Territory leaderboard rewards at the bottom right of the leaderboard. There is also a Mini Leaderboard for each event which gives extra rewards including Insta Monkeys."
        },
        "R100": {
            "name": "100 Rounds Rewards",
            "desc": "Every 100 rounds you complete in a game, you get a random Insta Monkey. The tier of the Insta Monkey is dependent on the difficulty of the map. Beginner gives T0-T2, Intermediate gives T1-T3, Advanced gives T2-T4, Expert gives T3-T4. Round 200 and beyond also guarantees T3-T4 regardless of difficulty."
        },
        "Chest": {
            "name": "Daily Chest",
            "desc": "The daily chest gives a random Insta Monkey on some days. The tiers range from T1-T4."
        },
        "Shop": {
            "name": "Shop",
            "desc": "Need more Instas? The shop has some Insta packs you can purchase."
        }
    }

    let instaMonkeyGuideContainer = document.createElement('div');
    instaMonkeyGuideContainer.classList.add('insta-monkey-guide-container');
    obtainGuideDiv.appendChild(instaMonkeyGuideContainer);

    Object.keys(methods).forEach(method => {
        let instaMonkeyGuideMethod = document.createElement('div');
        instaMonkeyGuideMethod.classList.add('insta-monkey-guide-method');
        instaMonkeyGuideContainer.appendChild(instaMonkeyGuideMethod);

        let instaMonkeyGuideTextDiv = document.createElement('div');
        instaMonkeyGuideTextDiv.classList.add('insta-monkey-guide-text-div');
        instaMonkeyGuideMethod.appendChild(instaMonkeyGuideTextDiv);

        let instaMonkeyGuideMethodText = document.createElement('p');
        instaMonkeyGuideMethodText.classList.add('insta-monkey-guide-method-text','black-outline');
        instaMonkeyGuideMethodText.innerHTML = methods[method].name;
        instaMonkeyGuideTextDiv.appendChild(instaMonkeyGuideMethodText);

        let instaMonkeyGuideMethodDesc = document.createElement('p');
        instaMonkeyGuideMethodDesc.classList.add('insta-monkey-guide-method-desc');
        instaMonkeyGuideMethodDesc.innerHTML = methods[method].desc;
        instaMonkeyGuideTextDiv.appendChild(instaMonkeyGuideMethodDesc);

        let instaMonkeyImage = document.createElement('img');
        instaMonkeyImage.classList.add('insta-monkey-guide-method-img');
        instaMonkeyImage.src = `./Assets/UI/Obtain${method}.png`;
        instaMonkeyGuideMethod.appendChild(instaMonkeyImage);
    })
}

function generateChestOddsModal() {
    let modal = document.createElement('div');
    modal.classList.add('error-modal-overlay');
    document.body.appendChild(modal);

    let modalContent = document.createElement('div');
    modalContent.classList.add('collection-modal');
    modal.appendChild(modalContent);

    let modalHeaderDiv = document.createElement('div');
    modalHeaderDiv.classList.add('collection-modal-header');
    modalContent.appendChild(modalHeaderDiv);

    let collectionHeaderModalLeft = document.createElement('div');
    collectionHeaderModalLeft.classList.add('collection-header-modal-left');
    modalHeaderDiv.appendChild(collectionHeaderModalLeft);

    let modalTitle = document.createElement('p');
    modalTitle.classList.add('collection-modal-header-text','black-outline');
    modalTitle.innerHTML = "Standard Chest Base Odds";
    modalHeaderDiv.appendChild(modalTitle);

    let modalClose = document.createElement('img');
    modalClose.classList.add('collection-modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        modal.remove();
    })
    modalHeaderDiv.appendChild(modalClose);

    let modalChestDesc = document.createElement('p');
    modalChestDesc.classList.add('collection-desc-text');
    modalChestDesc.innerHTML = "These are the standard odds. Certain events may change these, but they will be updated to be accurate when I update the site. Accurate as of 8/30/2024";
    modalContent.appendChild(modalChestDesc);

    let modalChestDivs = document.createElement('div');
    modalChestDivs.classList.add('modal-help-divs');
    modalContent.appendChild(modalChestDivs);

    Object.entries(constants.collection.crateRewards.instaMonkey).forEach(([chest,data]) => {
        let chestContainer = document.createElement('div');
        chestContainer.classList.add('chest-container');
        modalChestDivs.appendChild(chestContainer);

        let chestImg = document.createElement('img');
        chestImg.classList.add('collection-event-chest-selector');
        chestImg.src = `./Assets/UI/EventMysteryBox${chestSelectorMap[chest]}Icon.png`;
        chestContainer.appendChild(chestImg);
        
        let chestTierDiv = document.createElement('div');
        chestTierDiv.classList.add('chest-tier-div');
        chestContainer.appendChild(chestTierDiv);

        Object.entries(data.tierChance).forEach(([tier, chance]) => {
            let tierContainer = document.createElement('div');
            tierContainer.classList.add('tier-container');
            chestTierDiv.appendChild(tierContainer);

            let tierImg = document.createElement('img');
            tierImg.classList.add('insta-monkey-tier-img');
            tierImg.src = `./Assets/UI/InstaRandomTier${tier}.png`;
            tierContainer.appendChild(tierImg);

            let tierText = document.createElement('p');
            tierText.classList.add('tier-text','black-outline');
            tierText.innerHTML = `${(chance * 100).toFixed(2)}%`;
            tierContainer.appendChild(tierText);
        })

        let chestQuantityDiv = document.createElement('div');
        chestQuantityDiv.classList.add('chest-quantity-div');
        chestContainer.appendChild(chestQuantityDiv);

        Object.entries(data.quantityChance).forEach(([quantity, chance]) => {
            let quantityContainer = document.createElement('div');
            quantityContainer.classList.add('quantity-container');
            chestQuantityDiv.appendChild(quantityContainer);

            let instaIconDiv = document.createElement('div');
            instaIconDiv.classList.add('insta-icon-div');
            quantityContainer.appendChild(instaIconDiv);

            let instaIcon = document.createElement('img');
            instaIcon.classList.add('insta-quantity-icon');
            instaIcon.src = `./Assets/UI/InstaIcon.png`;
            instaIconDiv.appendChild(instaIcon);

            let quantityLabel = document.createElement('p');
            quantityLabel.classList.add('bloon-group-number','black-outline');
            quantityLabel.innerHTML = `X${quantity}`;
            instaIconDiv.appendChild(quantityLabel);

            let quantityText = document.createElement('p');
            quantityText.classList.add('quantity-text','black-outline');
            quantityText.innerHTML = `${(chance * 100)}%`;
            quantityContainer.appendChild(quantityText);
        })
    })

}

function generateHowToUseModal() {
    let modal = document.createElement('div');
    modal.classList.add('error-modal-overlay');
    document.body.appendChild(modal);

    let modalContent = document.createElement('div');
    modalContent.classList.add('collection-modal');
    modal.appendChild(modalContent);

    let modalHeaderDiv = document.createElement('div');
    modalHeaderDiv.classList.add('collection-modal-header');
    modalContent.appendChild(modalHeaderDiv);

    let collectionHeaderModalLeft = document.createElement('div');
    collectionHeaderModalLeft.classList.add('collection-header-modal-left');
    modalHeaderDiv.appendChild(collectionHeaderModalLeft);

    let modalTitle = document.createElement('p');
    modalTitle.classList.add('collection-modal-header-text','black-outline');
    modalTitle.innerHTML = "How to Use This Helper";
    modalHeaderDiv.appendChild(modalTitle);

    let modalClose = document.createElement('img');
    modalClose.classList.add('collection-modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        modal.remove();
    })
    modalHeaderDiv.appendChild(modalClose);

    let modalHelpDivs = document.createElement('div');
    modalHelpDivs.classList.add('modal-help-divs');
    modalContent.appendChild(modalHelpDivs);

    let modelHelpText = {
        "What is a Collection Event?": "These are events that occur approximately every other month (usually around holidays) that allow you to earn some form of currency that count towards unlocking Insta Monkey chests. This is the best way for collectors to work on their Insta Monkey collection.",
        "What is a Featured Insta?": "Every 8 hours, a rotating select rotation of 4 Featured Insta Monkeys are available to select in collection events. Selecting a Featured Insta Monkey in-game will guarantee that Insta Monkeys recieved from the chest are of that tower type.",
        "What does this helper do?": "When opening chests, how do you know which Featured Insta Monkey is best to pick to have the highest chance of getting a new Insta Monkey for your collection? This helps you choose what to pick, read below to learn how.",
        "Start by Selecting a Chest": "Choose your current Collection Event chest type to set the type of chest to calculate the odds for.",
        "Choose a Featured Insta Monkey (Optional)": "If you choose a featured Insta Monkey below the chests, you will see the odds by tier and total chance for that Insta Monkey. Select the same one again to go back to All Towers.",
        "Entering Obtained Insta Monkeys": "At the bottom of selecting a featured Insta, you can see the missing Instas. Click on an Insta that you were missing to mark it as obtained manually until the API updates (takes at most 15 minutes).",
        "All Towers": "All Towers displays the chances of getting a new Insta Monkey relative to your entire collection in the selected chest as well as a combined list of all the chances you will see when selecting each Featured Insta.",
        "Featured Insta Odds List": "This is a great way to see which Featured Insta Monkey will be more likely to get a new Insta Monkey for your current chest type, including if it's better to let it go completely random with none selected!",
        "How are the chances calculated?": "The chances are calculated by first taking how likely a specific Insta is out of random Insta Tier roll, and then multiplying it by the chest's likelihood of getting that random tier as a roll. This chance is for each individual roll of an Insta, and does not account for the varying quantities of Instas in chests. For example, using this sample Monkey Sub information, we can calculate how likely getting a missing Tier 2 is from a Silver Chest by first taking the chance of rolling that Insta Monkey when rolling a Tier 2 Insta from the chest, and then multiplying it by the chance of getting a Tier 2 Insta from the chest. In reality, this is 1/12 * 40% which is equivalent to 3.33%."
    }

    Object.entries(modelHelpText).forEach(([text, desc], index) => {
        let modalHelpDiv = document.createElement('div');
        modalHelpDiv.classList.add('modal-help-div');
        modalHelpDivs.appendChild(modalHelpDiv);

        let modalHelpText = document.createElement('p');
        modalHelpText.classList.add('collection-header-title-text','black-outline');
        modalHelpText.innerHTML = text;
        modalHelpDiv.appendChild(modalHelpText);

        let modalHelpDesc = document.createElement('p');
        modalHelpDesc.classList.add('collection-desc-text');
        modalHelpDesc.innerHTML = desc;
        modalHelpDiv.appendChild(modalHelpDesc);

        let modalHelpImg = document.createElement('img');
        modalHelpImg.classList.add('collection-help-img');
        modalHelpImg.src = `./Assets/UI/CollectionHelp${index + 1}.png`;
        modalHelpDiv.appendChild(modalHelpImg);
    });
}

function generateInstaCollectionEventHelper(){
    let instaMonkeysProgressContainer = document.getElementById('insta-monkeys-progress-container');
    instaMonkeysProgressContainer.innerHTML = "";

    currentCollectionChest = "None"

    let instaMonkeyCollectionContainer = document.createElement('div');
    instaMonkeyCollectionContainer.classList.add('insta-monkey-collection-container');
    instaMonkeysProgressContainer.appendChild(instaMonkeyCollectionContainer);
    
    let collectionHeaderTitleText = document.createElement('p');
    collectionHeaderTitleText.classList.add('collection-header-title-text', 'black-outline');
    collectionHeaderTitleText.innerHTML = "New Insta Monkey Chances";
    instaMonkeyCollectionContainer.appendChild(collectionHeaderTitleText); 

    let instaMonkeyCollectionTopBtns = document.createElement('div');
    instaMonkeyCollectionTopBtns.classList.add('insta-monkey-collection-top-btns');
    instaMonkeyCollectionContainer.appendChild(instaMonkeyCollectionTopBtns);

    let howButton = document.createElement('p');
    howButton.classList.add('where-button','black-outline');
    howButton.innerHTML = 'How to Use This';
    howButton.addEventListener('click', () => {
        generateHowToUseModal();
    })
    instaMonkeyCollectionTopBtns.appendChild(howButton);

    let chestOddsButton = document.createElement('p');
    chestOddsButton.classList.add('where-button','black-outline');
    chestOddsButton.style.width = "230px";
    chestOddsButton.innerHTML = 'View Chest Odds';
    chestOddsButton.addEventListener('click', () => {
        generateChestOddsModal();
    })
    instaMonkeyCollectionTopBtns.appendChild(chestOddsButton);

    let instaMonkeyCollectionDescText = document.createElement('p');
    instaMonkeyCollectionDescText.classList.add('collection-desc-text');
    instaMonkeyCollectionDescText.innerHTML = "Select a chest to see the chances of obtaining a new Insta Monkey based on your current collection. You can also view the Featured list or select a Featured Insta below to check the odds for selecting them in the event. The percentages represent the odds for each Insta Monkey received, so if a chest yields 2 Insta Monkeys, the odds are for 1 Insta Monkey roll.";
    // instaMonkeyCollectionContainer.appendChild(instaMonkeyCollectionDescText);

    let collectionEventChestSelectors = document.createElement('div');
    collectionEventChestSelectors.classList.add('collection-event-chest-selectors');
    instaMonkeyCollectionContainer.appendChild(collectionEventChestSelectors);

    Object.keys(chestSelectorMap).forEach(chest => {
        let collectionEventChestSelector = document.createElement('img');
        collectionEventChestSelector.id = `collection-event-chest-selector-${chest}`;
        collectionEventChestSelector.classList.add('collection-event-chest-selector');
        collectionEventChestSelector.src = `./Assets/UI/EventMysteryBox${chestSelectorMap[chest]}Icon.png`;
        collectionEventChestSelector.addEventListener('click', () => {
            onSelectCollectionEventChest(chest);
        })
        collectionEventChestSelectors.appendChild(collectionEventChestSelector);
    })

    let collectionEventTowerSelectors = document.createElement('div');
    collectionEventTowerSelectors.classList.add('collection-event-tower-selectors');
    instaMonkeyCollectionContainer.appendChild(collectionEventTowerSelectors);

    Object.keys(constants.towersInOrder).forEach(tower => {
        if(!Object.keys(btd6usersave.unlockedTowers).includes(tower)) {return}
        let collectionEventTowerSelector = document.createElement('div');
        collectionEventTowerSelector.classList.add('collection-event-tower-selector');
        collectionEventTowerSelector.addEventListener('click', () => {
            currentCollectionTower === tower ? currentCollectionTower = "All" : currentCollectionTower = tower;
            for (element of document.getElementsByClassName('collection-event-tower-selector')) {
                element.classList.remove('collection-event-tower-selector-active');
            }
            if (currentCollectionTower != "All") { collectionEventTowerSelector.classList.add('collection-event-tower-selector-active') }
            generateCollectionEventTowerInfo(currentCollectionTower);
        })
        collectionEventTowerSelectors.appendChild(collectionEventTowerSelector);

        let collectionEventTowerImg = document.createElement('img');
        collectionEventTowerImg.classList.add('collection-tower-icon');
        collectionEventTowerImg.src = getInstaMonkeyIcon(tower,'000');
        collectionEventTowerSelector.appendChild(collectionEventTowerImg);
    })

    let collectionEventTowerInfo = document.createElement('div');
    collectionEventTowerInfo.id = 'collection-event-tower-info';
    collectionEventTowerInfo.classList.add('collection-event-tower-info');
    instaMonkeyCollectionContainer.appendChild(collectionEventTowerInfo);

    generateCollectionEventTowerInfo(currentCollectionTower);
}

function generateChances(tower){
    let chances = [];
    if(tower == "All") {
        for(let i = 1; i<6; i++) {
            let value = 0;
            Object.keys(constants.towersInOrder).forEach(tower => {
                if(!Object.keys(btd6usersave.unlockedTowers).includes(tower)) {return}
                value += processedInstaData.TowerMissingByTier[tower][i].length || 0;
            })
            chances.push(value > 0 ? value / (constants.instaTiers[i].length * Object.keys(btd6usersave.unlockedTowers).length) : 0);
        }
    } else {
        for(let i = 1; i<6; i++) {
            let value = processedInstaData.TowerMissingByTier[tower][i].length || 0;
            chances.push(value > 0 ? value / constants.instaTiers[i].length : 0);
        }
    }
    let tierChances = constants.collection.crateRewards.instaMonkey[currentCollectionChest].tierChance;
    chances.forEach((chance, index) => {
        let chestTierChance = tierChances[index + 1] || 0;
        chances[index] = chance * chestTierChance;
    })
    return chances;
}

function generateCollectionEventTowerInfo(tower) {
    if(currentCollectionChest == "None") {
        onSelectCollectionEventChest("wood");
    }

    let chances = generateChances(tower);

    let collectionEventTowerInfo = document.getElementById('collection-event-tower-info');
    collectionEventTowerInfo.innerHTML = "";

    let instaMonkeyAndMissingDiv = document.createElement('div');
    instaMonkeyAndMissingDiv.classList.add('insta-monkey-div', 'insta-monkey-collection-div');
    collectionEventTowerInfo.appendChild(instaMonkeyAndMissingDiv);

    let instaMonkeyDiv = document.createElement('div');
    instaMonkeyDiv.classList.add('insta-monkey-collection-main-div');
    instaMonkeyAndMissingDiv.appendChild(instaMonkeyDiv);

    if (tower != "All") {
        switch(processedInstaData.TowerBorders[tower]) {
            case "Gold":
                instaMonkeyAndMissingDiv.classList.add("insta-list-gold");
                break;
            case "Black":
                instaMonkeyAndMissingDiv.classList.add("insta-list-black");
                break;
        }
    }

    let instaTowerAndMissingToggle = document.createElement('div');
    instaTowerAndMissingToggle.classList.add('insta-tower-and-missing-toggle');
    if(tower == "All") { instaTowerAndMissingToggle.classList.add('insta-collection-all') }
    instaMonkeyDiv.appendChild(instaTowerAndMissingToggle);

    let instaTowerContainer = document.createElement('div');
    instaTowerContainer.classList.add('tower-container-collection');
    instaTowerContainer.style.backgroundImage = `url(./Assets/UI/InstaTowersContainer${processedInstaData.TowerBorders[tower] || ""}.png)`
    if(tower != "All") {
        instaTowerContainer.addEventListener('click', () => {
            onSelectInstaTower(tower);
        })
    }
    instaTowerAndMissingToggle.appendChild(instaTowerContainer);

    let instaMonkeyImg = document.createElement('img');
    instaMonkeyImg.classList.add('tower-img');
    instaMonkeyImg.src = tower == "All" ? "./Assets/UI/AllTowersIcon.png" : getInstaContainerIcon(tower,'000');
    instaTowerContainer.appendChild(instaMonkeyImg);

    let instaMonkeyName = document.createElement('p');
    instaMonkeyName.classList.add(`tower-name`,'black-outline');
    instaMonkeyName.innerHTML = tower == "All" ? "All Towers" : getLocValue(tower);
    instaTowerContainer.appendChild(instaMonkeyName);
    
    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.classList.add('insta-missing-toggle-div');  

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('insta-collection-missing-label','black-outline');
    mapsProgressCoopToggleText.innerHTML = "Show Missing: ";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggleInput.checked = collectionMissingToggle;
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);
    if(tower != "All") {
        instaTowerAndMissingToggle.appendChild(mapsProgressCoopToggle);
    }

    let instaMonkeyTopBottom = document.createElement('div');
    instaMonkeyTopBottom.classList.add('insta-monkey-top-bottom');
    instaMonkeyDiv.appendChild(instaMonkeyTopBottom);

    let instaMonkeyProgress = document.createElement('div');
    instaMonkeyProgress.classList.add('insta-monkey-progress-list');
    instaMonkeyTopBottom.appendChild(instaMonkeyProgress);

    let instaMonkeyTotal = document.createElement('div');
    instaMonkeyTotal.classList.add('insta-monkey-total');
    instaMonkeyProgress.appendChild(instaMonkeyTotal);

    let instaMonkeysTotalLabelText = document.createElement('p');
    instaMonkeysTotalLabelText.classList.add('insta-monkey-progress-label-text','black-outline');
    instaMonkeysTotalLabelText.innerHTML = "Usable Instas:";
    instaMonkeyTotal.appendChild(instaMonkeysTotalLabelText);

    let instaMonkeysTotalText = document.createElement('p');
    instaMonkeysTotalText.classList.add('insta-monkey-total-text','black-outline');
    instaMonkeysTotalText.innerHTML = tower == "All" ? Object.values(processedInstaData.TowerTotal).reduce((acc, amount) => acc + amount) : processedInstaData.TowerTotal[tower];
    instaMonkeyTotal.appendChild(instaMonkeysTotalText);

    let instaMonkeyTierProgress = document.createElement('div');
    instaMonkeyTierProgress.classList.add('insta-monkey-tier-progress');
    instaMonkeyProgress.appendChild(instaMonkeyTierProgress);

    let instaMonkeyProgressLabelText = document.createElement('p');
    instaMonkeyProgressLabelText.classList.add('insta-monkey-progress-label-text','black-outline');
    instaMonkeyProgressLabelText.innerHTML = "Unique Instas:";
    instaMonkeyTierProgress.appendChild(instaMonkeyProgressLabelText);

    let instaMonkeyProgressText = document.createElement('p');
    instaMonkeyProgressText.classList.add('insta-monkey-progress-text','black-outline');
    instaMonkeyProgressText.innerHTML = tower == "All" ? `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}` : `${Object.values(processedInstaData.TowerTierTotals[tower]).reduce((a, b) => a + b, 0)}/64`;
    instaMonkeyTierProgress.appendChild(instaMonkeyProgressText);

    let instaMonkeyNewChance = document.createElement('div');
    instaMonkeyNewChance.classList.add('insta-monkey-new-chance');
    instaMonkeyProgress.appendChild(instaMonkeyNewChance);

    let instaMonkeyNewChanceText = document.createElement('p');
    instaMonkeyNewChanceText.classList.add('insta-monkey-progress-label-text','black-outline');
    instaMonkeyNewChanceText.innerHTML = "Total New Chance:";
    instaMonkeyNewChance.appendChild(instaMonkeyNewChanceText);

    let instaMonkeyNewChanceValue = document.createElement('p');
    instaMonkeyNewChanceValue.classList.add('insta-monkey-total-chance-text','black-outline');
    instaMonkeyNewChance.appendChild(instaMonkeyNewChanceValue);

    let instaMonkeyTiersContainer = document.createElement('div');
    instaMonkeyTiersContainer.classList.add('insta-monkey-tiers-container');
    instaMonkeyTopBottom.appendChild(instaMonkeyTiersContainer);

    let instaMonkeyTiersLabel = document.createElement('p');
    instaMonkeyTiersLabel.classList.add('insta-monkey-tiers-label','black-outline');
    instaMonkeyTiersLabel.innerHTML = "Unique By Tier:";
    instaMonkeyTiersContainer.appendChild(instaMonkeyTiersLabel);

    let tierCounts = tower == "All" ? Object.entries([1, 2, 3, 4, 5].reduce((acc, key) => ({ ...acc, [key]: Object.values(processedInstaData.TowerTierTotals).map(tower => tower[key] || 0).reduce((a, b) => a + b, 0) }), {})) : Object.entries(processedInstaData.TowerTierTotals[tower]);
    for (let [tier, tierTotal] of tierCounts) {
        let instaMonkeyTierDiv = document.createElement('div');
        instaMonkeyTierDiv.classList.add('insta-monkey-tier-div');
        instaMonkeyTiersContainer.appendChild(instaMonkeyTierDiv);

        if (tower == "All") {
            let instaMonkeyTierText = document.createElement('p');
            instaMonkeyTierText.classList.add('insta-monkey-tier-text-list', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierDiv.style.backgroundImage = `url(./Assets/UI/InstaTier${tier}Container.png)`
            instaMonkeyTierText.innerHTML = `${tierTotal}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierText);

            let fractionBar = document.createElement('p');
            fractionBar.classList.add('insta-monkey-tier-fraction-bar', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierDiv.appendChild(fractionBar);

            let instaMonkeyTierTextBottom = document.createElement('p');
            instaMonkeyTierTextBottom.classList.add('insta-monkey-tier-text-list',`insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierTextBottom.innerHTML = `${constants.instaTiers[tier].length * Object.keys(constants.towersInOrder).length}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierTextBottom);
        } else {
            let instaMonkeyTierText = document.createElement('p');
            instaMonkeyTierText.classList.add('insta-monkey-tier-text-list', `insta-tier-text-${tier}`, tier == "5" ? "t5-insta-outline" : "black-outline");
            instaMonkeyTierDiv.style.backgroundImage = `url(./Assets/UI/InstaTier${tier}Container.png)`
            instaMonkeyTierText.innerHTML = `${tierTotal}/${constants.instaTiers[tier].length}`;
            instaMonkeyTierDiv.appendChild(instaMonkeyTierText);
        }
    }

    let instaMonkeyChanceContainer = document.createElement('div');
    instaMonkeyChanceContainer.classList.add('insta-monkey-chance-container');
    instaMonkeyTopBottom.appendChild(instaMonkeyChanceContainer);

    let instaMonkeyChanceText = document.createElement('p');
    instaMonkeyChanceText.classList.add('insta-monkey-tiers-label','black-outline');
    instaMonkeyChanceText.innerHTML = "New Chance:";
    instaMonkeyChanceContainer.appendChild(instaMonkeyChanceText);

    let outlineColor = "black-outline";

    if (tower != "All") {
        switch(processedInstaData.TowerBorders[tower]) {
            case "Gold":
                outlineColor = "knowledge-outline";
                break;
            case "Black":
                outlineColor = "leaderboard-outline";
                break;
        }
    }

    let chestTierChances = constants.collection.crateRewards.instaMonkey[currentCollectionChest].tierChance;

    for (let [tier, tierTotal] of tierCounts) {
        let instaMonkeyChance = document.createElement('div');
        instaMonkeyChance.classList.add('insta-monkey-chance-div');
        instaMonkeyChanceContainer.appendChild(instaMonkeyChance);

        let instaMonkeyChanceTier = document.createElement('p');
        instaMonkeyChanceTier.classList.add('insta-monkey-chance-text-list',outlineColor);
        instaMonkeyChanceTier.innerHTML = (chances[tier - 1] * 100).toFixed(2) + "%";
        instaMonkeyChance.appendChild(instaMonkeyChanceTier);
        if (chestTierChances.hasOwnProperty(tier) && chances[tier - 1] == 0) {
            let instaMonkeyImpossibleSlash = document.createElement('img');
            instaMonkeyImpossibleSlash.classList.add('insta-monkey-completed-tick');
            instaMonkeyImpossibleSlash.src = "./Assets/UI/TickGreenIcon.png";
            instaMonkeyChance.appendChild(instaMonkeyImpossibleSlash);
        } else if (chances[tier - 1] == 0) {
            instaMonkeyChanceTier.classList.add('insta-monkey-chance-zero');
        }
    }
    instaMonkeyNewChanceValue.innerHTML = `${(chances.reduce((a, b) => a + b, 0) * 100).toFixed(2)}%`;
    if (chances.reduce((a, b) => a + b, 0) == 0) {
        instaMonkeyNewChanceValue.classList.add('insta-monkey-chance-zero');
    } 

    let instaMonkeysMissingContainer = document.createElement('div');
    instaMonkeysMissingContainer.style.display = "none";
    instaMonkeysMissingContainer.classList.add('insta-monkeys-missing-container');
    instaMonkeyAndMissingDiv.appendChild(instaMonkeysMissingContainer);

    if(tower != "All") {
        mapsProgressCoopToggleInput.addEventListener('change', () => {
            instaMonkeysMissingContainer.style.display = mapsProgressCoopToggleInput.checked ? "flex" : "none";
            instaMonkeysMissingContainer.innerHTML = "";
            collectionMissingToggle = mapsProgressCoopToggleInput.checked;
            onSelectCollectionEventMissingToggle(instaMonkeysMissingContainer, tower, chances);
        })
    } else {
        // mapsProgressCoopToggleText.innerHTML = "Show Full List: ";
        // mapsProgressCoopToggleInput.addEventListener('change', () => {
        //     instaMonkeysMissingContainer.style.display = mapsProgressCoopToggleInput.checked ? "flex" : "none";
        //     collectionMissingToggle = mapsProgressCoopToggleInput.checked;
        //     openAllTowersList(instaMonkeysMissingContainer);
        // })
        instaMonkeysMissingContainer.style.display = "flex";
        openAllTowersList(instaMonkeysMissingContainer);
    }

    if(collectionMissingToggle && tower != "All") {
        instaMonkeysMissingContainer.style.display = "flex";
        onSelectCollectionEventMissingToggle(instaMonkeysMissingContainer, tower, chances);
    }
}

function onSelectCollectionEventChest(type) {
    currentCollectionChest = type;
    for (let element of document.getElementsByClassName('collection-event-chest-selector')) {
        element.classList.remove('chest-selected');
        element.classList.add('chest-unselected');
    }
    document.getElementById(`collection-event-chest-selector-${type}`).classList.add('chest-selected');
    generateCollectionEventTowerInfo(currentCollectionTower);
}

function onSelectCollectionEventMissingToggle(instaMonkeysMissingContainer, tower, chances) {
    function addInstaMonkeyIcon(towerType, tiers, obtained) {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.classList.add('insta-monkey-tier-container','insta-monkey-unobtained');
        instaMonkeysMissingContainer.appendChild(instaMonkeyTierContainer);

        let instaMonkeyTierImg = document.createElement('img');
        instaMonkeyTierImg.classList.add('insta-monkey-tier-img');
        instaMonkeyTierImg.src = getInstaMonkeyIcon(towerType,tiers);
        instaMonkeyTierContainer.appendChild(instaMonkeyTierImg);
        
        instaMonkeyTierImg.classList.add('upgrade-after-locked');

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-tier-text','black-outline');
        instaMonkeyTierText.innerHTML = `${tiers[0]}-${tiers[1]}-${tiers[2]}`;
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);

        if (obtained) {
            let instaMonkeyTierObtained = document.createElement('img');
            instaMonkeyTierObtained.classList.add('insta-monkey-tier-obtained');
            instaMonkeyTierObtained.src = "./Assets/UI/TickGreenIcon.png";
            instaMonkeyTierContainer.appendChild(instaMonkeyTierObtained);

            instaMonkeyTierContainer.addEventListener('click', () => {
                processedInstaData.TowerObtained[towerType] = processedInstaData.TowerObtained[towerType].filter(value => value != tiers);
                let key = Object.keys(constants.instaTiers).find(key => constants.instaTiers[key].includes(tiers));
                processedInstaData.TowerMissingByTier[towerType][key].push(tiers);
                delete btd6usersave.instaTowers[towerType][tiers];
                processedInstaData.TowerTierTotals[towerType][key] -= 1;
                btd6publicprofile.gameplay["instaMonkeyCollection"] -= 1;
                document.getElementById('insta-total-counter').innerHTML = `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
                calculateInstaBorder(towerType);
                generateCollectionEventTowerInfo(towerType);
            });
        } else {
            instaMonkeyTierContainer.addEventListener('click', () => {
                processedInstaData.TowerObtained[towerType].push(tiers);
                let key = Object.keys(constants.instaTiers).find(key => constants.instaTiers[key].includes(tiers));
                processedInstaData.TowerMissingByTier[towerType][key] = processedInstaData.TowerMissingByTier[towerType][key].filter(value => value != tiers);
                btd6usersave.instaTowers[towerType][tiers] = 0;
                processedInstaData.TowerTierTotals[towerType][key] += 1;
                btd6publicprofile.gameplay["instaMonkeyCollection"] += 1;
                document.getElementById('insta-total-counter').innerHTML = `${btd6publicprofile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
                calculateInstaBorder(towerType);
                generateCollectionEventTowerInfo(towerType);
            })
        }
    }

    if (tower == "All") {
        Object.entries(processedInstaData.TowerMissingByTier).forEach(([tower, instas]) => {
            Object.entries(instas).forEach(([tier, missing]) => {
                if(chances[tier - 1] > 0) {
                    for(let value of missing) {
                        addInstaMonkeyIcon(tower, value);
                    }
                }
            })
        })
    } else {
        let missingInstas = Object.entries(processedInstaData.TowerMissingByTier[tower])
        .map(([key, insta]) => ({tier: key, insta}))
        .filter(({tier, insta}) => chances[tier - 1] > 0)
        .map(({insta}) => insta)
        .flat();

        missingInstas.forEach(tiers => {
            addInstaMonkeyIcon(tower, tiers, false);
        })

        let manualEntry = processedInstaData.TowerObtained[tower];

        manualEntry.forEach(tiers => {
            addInstaMonkeyIcon(tower, tiers, true);
        });

        if (missingInstas.length == 0 && manualEntry.length == 0) {
            let noneMissing = document.createElement('p');
            noneMissing.classList.add('no-data-found','none-collection','black-outline');
            noneMissing.innerHTML = "None Missing in this Chest Type!";
            instaMonkeysMissingContainer.appendChild(noneMissing);
        }
    }
}

function openAllTowersList(instaMonkeysMissingContainer){
    instaMonkeysMissingContainer.innerHTML = "";

    let chancesDict = {};
    chancesDict["NoFeatured"] = generateChances("All");
    Object.keys(constants.towersInOrder).forEach(tower => {
        chancesDict[tower] = generateChances(tower);
    })

    let sortedTowers = Object.keys(constants.towersInOrder);
    switch(collectionListSortType) {
        case "Highest Total Chance":
            sortedTowers = Object.keys(chancesDict).sort((a, b) => {
                let sumA = chancesDict[a].reduce((a, b) => a + b, 0);
                let sumB = chancesDict[b].reduce((a, b) => a + b, 0);
                return sumB - sumA;
            })
            break;
        case "In-Game Tower Order":
            break;
        case "Alphabetical Towers":
            sortedTowers = Object.keys(constants.towersInOrder).sort();
            break;
    }

    let titleAndSortDiv = document.createElement('div');
    titleAndSortDiv.classList.add('insta-monkey-title-container');
    instaMonkeysMissingContainer.appendChild(titleAndSortDiv);

    let titleText = document.createElement('p');
    titleText.classList.add('collection-header-list-text','black-outline');
    titleText.innerHTML = `Featured Insta Odds (${currentCollectionChest.toLocaleUpperCase()} ${currentCollectionChest == "wood" ? "Crate" : "Chest"})`;
    titleAndSortDiv.appendChild(titleText);

    let sortFilterDiv = document.createElement('div');
    sortFilterDiv.classList.add('insta-monkey-sort-container');
    titleAndSortDiv.appendChild(sortFilterDiv);

    let sortFilterText = document.createElement('p');
    sortFilterText.classList.add('insta-monkey-sort-label','black-outline');
    sortFilterText.innerHTML = "Sort By:";
    sortFilterDiv.appendChild(sortFilterText);

    let sortFilterSelect = document.createElement('select');
    sortFilterSelect.classList.add('map-progress-filter-difficulty-select');
    sortFilterSelect.addEventListener('change', () => {
    })
    sortFilterDiv.appendChild(sortFilterSelect);

    let sortOptions = ["Highest Total Chance", "In-Game Tower Order", "Alphabetical Towers"];
    sortOptions.forEach(option => {
        let sortOption = document.createElement('option');
        sortOption.value = option;
        sortOption.innerHTML = option;
        sortFilterSelect.appendChild(sortOption); 
    })

    sortFilterSelect.value = collectionListSortType;
    sortFilterSelect.addEventListener('change', () => {
        collectionListSortType = sortFilterSelect.value;
        openAllTowersList(instaMonkeysMissingContainer);
    })

    let headerRow = {
        "Tower Type": "white",
        "Tier 1 Chance": "insta-tier-text-1",
        "Tier 2 Chance": "insta-tier-text-2",
        "Tier 3 Chance": "insta-tier-text-3",
        "Tier 4 Chance": "insta-tier-text-4",
        "Tier 5 Chance": "insta-tier-text-5",
        "Total Chance": "white"
    }

    let instaMonkeyHeaderRow = document.createElement('div');
    instaMonkeyHeaderRow.classList.add('insta-monkey-header-container','insta-monkey-unobtained');
    instaMonkeysMissingContainer.appendChild(instaMonkeyHeaderRow);

    Object.entries(headerRow).forEach(([key, value]) => {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.classList.add('insta-monkey-header-container','insta-monkey-unobtained');
        instaMonkeyHeaderRow.appendChild(instaMonkeyTierContainer);

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-small-name-text','black-outline', value);
        instaMonkeyTierText.innerHTML = key;
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);
    })

    let chestTierChances = constants.collection.crateRewards.instaMonkey[currentCollectionChest].tierChance;

    sortedTowers.forEach(tower => {
        let instaMonkeyTierContainer = document.createElement('div');
        instaMonkeyTierContainer.classList.add('insta-monkey-list-container','insta-monkey-unobtained');
        instaMonkeysMissingContainer.appendChild(instaMonkeyTierContainer);

        let instaMonkeyTierImg = document.createElement('img');
        instaMonkeyTierImg.classList.add('insta-monkey-list-img');
        instaMonkeyTierImg.src = tower == "NoFeatured" ? "./Assets/UI/InstaRandomTier1.png" : getInstaMonkeyIcon(tower,'000');
        instaMonkeyTierContainer.appendChild(instaMonkeyTierImg);

        let instaMonkeyTierText = document.createElement('p');
        instaMonkeyTierText.classList.add('insta-monkey-small-name-text','black-outline');
        instaMonkeyTierText.innerHTML = tower == "NoFeatured" ? "No Featured Selected" : getLocValue(tower);
        instaMonkeyTierContainer.appendChild(instaMonkeyTierText);

        let instaMonkeyTierChanceContainer = document.createElement('div');
        instaMonkeyTierChanceContainer.classList.add('insta-monkey-list-chance-container');
        instaMonkeyTierContainer.appendChild(instaMonkeyTierChanceContainer);

        chancesDict[tower].forEach((chance, index) => {
            let instaMonkeyChance = document.createElement('div');
            instaMonkeyChance.classList.add('insta-monkey-chance-div');
            instaMonkeyTierChanceContainer.appendChild(instaMonkeyChance);

            let instaMonkeyChanceTier = document.createElement('p');
            instaMonkeyChanceTier.classList.add('insta-monkey-chance-text-list','black-outline');
            instaMonkeyChanceTier.innerHTML = (chance * 100).toFixed(2) + "%";
            if (chestTierChances.hasOwnProperty(index + 1) && chance == 0) {
                let instaMonkeyImpossibleSlash = document.createElement('img');
                instaMonkeyImpossibleSlash.classList.add('insta-monkey-completed-tick');
                instaMonkeyImpossibleSlash.src = "./Assets/UI/TickGreenIcon.png";
                instaMonkeyChance.appendChild(instaMonkeyImpossibleSlash);
            } else if (chance == 0) {
                instaMonkeyChanceTier.classList.add('insta-monkey-chance-zero');
            }
            instaMonkeyChance.appendChild(instaMonkeyChanceTier);
        })

        let instaMonkeyTotalChance = document.createElement('div');
        instaMonkeyTotalChance.classList.add('insta-monkey-chance-div');
        instaMonkeyTierChanceContainer.appendChild(instaMonkeyTotalChance);

        let sumOfChances = chancesDict[tower].reduce((a, b) => a + b, 0);

        let instaMonkeyTotalChanceTier = document.createElement('p');
        instaMonkeyTotalChanceTier.classList.add('insta-monkey-chance-text-list','black-outline');
        instaMonkeyTotalChanceTier.innerHTML = (sumOfChances * 100).toFixed(2) + "%";
        if(sumOfChances == 0) {
            instaMonkeyTotalChanceTier.classList.add('insta-monkey-chance-zero');
        }
        instaMonkeyTotalChance.appendChild(instaMonkeyTotalChanceTier);
    })
}


function processRewardsString(input){
    let result = {};
    let rewards = input.split("#");
    let counter = 0;
    for (let reward of rewards) {
        result[counter] = {};
        let rewardData = reward.split(":");
        let rewardType = rewardData[0];
        if (!["MonkeyMoney","Power","InstaMonkey","KnowledgePoints","RandomInstaMonkey","Trophy"].includes(rewardType)) {
            result[counter].type = "Other";
            result[counter].value = rewardType;
            counter++;
            continue;
        }
        let params = rewardData[1].split(",");
        switch (rewardType) {
            case "MonkeyMoney":
                result[counter].type = "MonkeyMoney";
                result[counter].amount = parseInt(params[0]);
                break;
            case "Power":
                result[counter].type = "Power";
                result[counter].power = params[0];
                result[counter].amount = parseInt(params[1]);
                if(params[1] == null) { result[counter].amount = 1;}
                break;
            case "InstaMonkey":
                result[counter].type = "InstaMonkey";
                result[counter].tower = params[0];
                result[counter].tiers = params[1];
                break;
            case "KnowledgePoints":
                result[counter].type = "KnowledgePoints";
                result[counter].amount = parseInt(params[0]);
                break;
            case "RandomInstaMonkey":
                result[counter].type = "RandomInstaMonkey";
                result[counter].tier = params[0];
                result[counter].amount = parseInt(params[1]);
                break;
            case "Trophy":
                result[counter].type = "Trophy";
                result[counter].trophy = params[0];
                break;
        }
        counter++;
    }
    return result;
}

function openBTD6Link(link){
    window.location.href = link;
}

function openBTD6Site(link) {
    window.open(link, "_blank");
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
