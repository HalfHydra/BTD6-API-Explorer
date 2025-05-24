function createEl(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.classList) el.classList.add(...options.classList);
    if (options.innerHTML) el.innerHTML = options.innerHTML;
    if (options.textContent) el.textContent = options.textContent;
    if (options.id) el.id = options.id;
    if (options.src) el.src = options.src;
    if (options.placeholder) el.placeholder = options.placeholder;
    if (options.style) Object.assign(el.style, options.style);
    if (options.onclick) el.onclick = options.onclick;
    if (options.attributes) {
        for (const [key, value] of Object.entries(options.attributes)) {
            el.setAttribute(key, value);
        }
    }
    if (options.children) {
        options.children.forEach(child => el.appendChild(child));
    }
    return el;
}

function createModal({ header = '', content = '', footer = '', classList = [] } = {}) {
    const modalOverlay = createEl('div', {
        classList: ['modal-overlay', ...classList]
    });

    const modalBox = createEl('div', { classList: ['modal-box'] });

    const modalHeader = createEl('div', { classList: ['modal-header'] });
    modalBox.appendChild(modalHeader);

    const collectionHeaderModalLeft = createEl('div', { classList: ['collection-header-modal-left'] });
    modalHeader.appendChild(collectionHeaderModalLeft);

    const modalTitle = createEl('p', {
        classList: ['collection-modal-header-text', 'black-outline'],
        innerHTML: header
    });
    modalHeader.appendChild(modalTitle);

    const modalClose = createEl('img', {
        classList: ['collection-modal-close'],
        src: "./Assets/UI/CloseBtn.png"
    });
    modalClose.addEventListener('click', () => {
        document.querySelector('.modal-overlay')?.remove();
    });
    modalHeader.appendChild(modalClose);

    const modalContent = createEl('div', { classList: ['modal-content'] });
    modalBox.appendChild(modalContent);

    if (typeof content === 'string') {
        modalContent.innerHTML = content;
    } else if (content) {
        modalContent.appendChild(content);
    }

    if (footer) {
        const modalFooter = createEl('div', { classList: ['modal-footer'] });
        if (typeof footer === 'string') {
            modalFooter.innerHTML = footer;
        } else {
            modalFooter.appendChild(footer);
        }
        modalBox.appendChild(modalFooter);
    }

    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
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
                        node.addEventListener('error', imageLoaded);
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

function fetchConstants() {
    return fetch('./data/Constants.json')
        .then(response => response.json())
        .then(data => {
            constants = data;
            readyFlags[4] = 1
        })
        .catch(error => {
            console.error('Error:', error)
            errorModal(error, "js")
    });
}

function fetchMainDependencies() {
    Promise.all([
        fetch('./data/English.json').then(response => response.json()),
        fetch('./data/Achievements150.json').then(response => response.json()),
        fetch('./data/trophyStoreItems.json').then(response => response.json()),
        fetch('./data/teamsStoreItems.json').then(response => response.json())
    ])
    .then(([englishData, achievementsData, trophyStoreItems, teamsStoreItems]) => {
        locJSON = englishData;
        achievementsJSON = achievementsData;
        trophyStoreItemsJSON = trophyStoreItems;
        teamsStoreItemsJSON = teamsStoreItems;
        readyFlags[2] = 1;
        readyFlags[3] = 1;
        loadSettings();
        generateIfReady();
    })
    .catch(error => {
        console.error('Error:', error);
        errorModal(error, "js");
    });

    showLoading();
}

function resetScroll() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function loadSettings() {
    let settings = JSON.parse(localStorage.getItem("BTD6OAKSettings"));
    if (settings) {
        preventRateLimiting = settings.ProfileLoading;
        useNamedMonkeys = settings.UseNamedMonkeys;
        showTeamsItems = settings.TeamsStoreItems;
    }
}

function saveSettings() {
    let settings = {
        "ProfileLoading": preventRateLimiting,
        "UseNamedMonkeys": useNamedMonkeys,
        "TeamsStoreItems": showTeamsItems
    }
    localStorage.setItem("BTD6OAKSettings", JSON.stringify(settings));
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

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
}

function formatScoreTime(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let remainingMilliseconds = milliseconds % 1000;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    remainingMilliseconds = remainingMilliseconds.toString().padStart(3, '0');

    let timeString = `${minutes}:${seconds}.${remainingMilliseconds}`;
    if (hours > 0) {
        hours = hours.toString().padStart(2, '0');
        timeString = `${hours}:${timeString}`;
    }

    return timeString;
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

function relativeTime(current, previous) {
    const units = [
        { name: "year", ms: 365 * 24 * 60 * 60 * 1000 },
        { name: "month", ms: 30 * 24 * 60 * 60 * 1000 },
        { name: "day", ms: 24 * 60 * 60 * 1000 },
        { name: "hour", ms: 60 * 60 * 1000 },
        { name: "minute", ms: 60 * 1000 },
        { name: "second", ms: 1000 }
    ];

    const elapsed = current - previous;

    for (const unit of units) {
        if (elapsed < unit.ms) continue;
        let time = Math.round(elapsed / unit.ms);
        return `${time} ${unit.name}${time > 1 ? 's' : ''} ago`;
    }
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

function generateLoginDiv() {
    let loginDiv = createEl('div', { classList: ['d-flex', 'ai-center', 'jc-center', 'fd-column', 'bg-color-primary'] });
    
    let loginTitle = createEl('p', { classList: ['site-info-header', 'black-outline'], innerHTML: 'Login with your OAK Token!' });
    loginDiv.appendChild(loginTitle);
    
    const previousOAK = createEl('div');
    Object.entries(localStorageOAK).forEach(([oak, oakdata]) => {
        const entry = createEl('div', {
            classList: ['previous-oak-entry', 'd-flex', 'ai-center', 'ps-relative'],
            style: { backgroundImage: `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(${oakdata.banner})` }
        });
        entry.appendChild(generateAvatar(100, oakdata.avatar));
        entry.appendChild(createEl('p', { classList: ['profile-name', 'tc-white', 'font-luckiest', 'black-outline'], innerHTML: oakdata.displayName }));
        const useBtn = createEl('img', { classList: ['use-button', 'ps-absolute'], src: './Assets/UI/ContinueBtn.png' });
        useBtn.addEventListener('click', async () => {
            // trailerVideo.pause();
            if (!pressedStart) {
                pressedStart = true;
                document.getElementById("loading").style.removeProperty("transform");
                oak_token = oak;
                await getSaveData(oak);
                loggedIn = true;
                fetchMainDependencies();
                // changeTab('profile')
            }
        });
        entry.appendChild(useBtn);
        const delBtn = createEl('img', { classList: ['delete-button', 'ps-absolute'], src: './Assets/UI/CloseBtn.png' });
        delBtn.addEventListener('click', () => {
            delete localStorageOAK[oak];
            writeLocalStorage();
            previousOAK.removeChild(entry);
        });
        entry.appendChild(delBtn);
        previousOAK.appendChild(entry);
    });
    loginDiv.appendChild(previousOAK)

    let siteAccessDiv = document.createElement('div');
    siteAccessDiv.classList.add('site-access-div');
    loginDiv.appendChild(siteAccessDiv);

    // let siteLoginButtons = document.createElement('div');
    // siteLoginButtons.classList.add('site-login-buttons');
    // siteAccessDiv.appendChild(siteLoginButtons);

    // let previewButton = document.createElement('p');
    // previewButton.classList.add('site-access-button','black-outline');
    // previewButton.innerHTML = 'Preview Site';
    // previewButton.addEventListener('click', () => {
    //     trailerVideo.pause();
    //     previewSite();
    // })
    // siteLoginButtons.appendChild(previewButton);

    // let challengeSelectorOR = document.createElement('p');
    // challengeSelectorOR.classList.add("challenge-selector-or", "black-outline");
    // challengeSelectorOR.innerHTML = "OR";
    // siteLoginButtons.appendChild(challengeSelectorOR);

    // let loginButton = document.createElement('p');
    // loginButton.classList.add('site-access-button','black-outline');
    // loginButton.innerHTML = 'Login With OAK';
    // loginButton.addEventListener('click', () => {
    //     document.querySelector('.oak-entry-div').style.display = 'flex';
    //     siteLoginButtons.style.display = 'none';
    // })
    // siteLoginButtons.appendChild(loginButton);

    let oakEntryDiv = document.createElement('div');
    oakEntryDiv.classList.add('oak-entry-div');
    // oakEntryDiv.style.display = 'none';
    loginDiv.appendChild(oakEntryDiv);
    
    let keyEntry = document.createElement('input');
    keyEntry.classList.add('key-entry');
    keyEntry.placeholder = 'Enter your OAK here';
    oakEntryDiv.appendChild(keyEntry);
    
    let startButton = document.createElement('div');
    startButton.classList.add('start-button','black-outline');
    startButton.innerHTML = 'Start';
    startButton.addEventListener('click', async () => {
        // trailerVideo.pause();
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
            await getSaveData(oak_token);
            fetchMainDependencies();
            // changeTab('profile')
        }
    })
    oakEntryDiv.appendChild(startButton);

    let getOakDiv = document.createElement('div');
    getOakDiv.classList.add('get-oak-div');
    loginDiv.appendChild(getOakDiv);

    let whereText = document.createElement('p');
    whereText.classList.add('where-text');
    whereText.innerHTML = 'Don\'t have an OAK token? Read here:';
    getOakDiv.appendChild(whereText);

    let whereButton = document.createElement('p');
    whereButton.classList.add('where-button','black-outline');
    whereButton.style.width = "220px";
    whereButton.innerHTML = 'View OAK Guide';
    whereButton.addEventListener('click', () => {
        openOAKInstructionsModal();
    })
    getOakDiv.appendChild(whereButton);

    let OAKInstructionsDiv = document.createElement('div');
    OAKInstructionsDiv.id = 'oak-instructions-div';
    OAKInstructionsDiv.classList.add('oak-instructions-div');
    OAKInstructionsDiv.style.display = 'none';
    loginDiv.appendChild(OAKInstructionsDiv);

    return loginDiv;
}

function openOAKInstructionsModal(){
    let OAKInstructionsDiv = createEl('div', { style: {
        padding: '10px'
    }});
    OAKInstructionsDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-header', 'black-outline'],
        innerHTML: 'What is an Open Access Key?'
    }));

    OAKInstructionsDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-text'],
        innerHTML: 'An Open Access Key (OAK) is a unique key that allows you to access your Bloons TD 6 data from Ninja Kiwi\'s Open Data API. The site will use this to fetch your information from the API to be displayed in a familiar way. <br><br>NOTE: Progress tracking is not available for BTD6+ on Apple Arcade and BTD6 Netflix as OAK tokens are unavailable.'
    }));

    OAKInstructionsDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-header', 'black-outline'],
        innerHTML: 'How do I get one?'
    }));

    OAKInstructionsDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-text'],
        innerHTML: 'Step 1: Login and Backup your progress with a Ninja Kiwi Account in BTD6. You can do this by going to settings from the main menu and clicking on the Account button.'
    }));

    OAKInstructionsDiv.appendChild(createEl('img', {
        classList: ['oak-instruction-img'],
        src: './Assets/UI/OAKTutorial1.jpg'
    }));

    OAKInstructionsDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-text'],
        innerHTML: 'Step 2: Select "Open Data API" at the bottom right of the account screen.'
    }));

    OAKInstructionsDiv.appendChild(createEl('img', {
        classList: ['oak-instruction-img'],
        src: './Assets/UI/OAKTutorial2.jpg'
    }));

    OAKInstructionsDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-text'],
        innerHTML: 'Step 3: Generate a key and copy that in to the above text field. It should start with "oak_". Then click "Start" to begin!'
    }));

    OAKInstructionsDiv.appendChild(createEl('img', {
        classList: ['oak-instruction-img'],
        src: './Assets/UI/OAKTutorial3.jpg'
    }));

    OAKInstructionsDiv.appendChild(createEl('p', {
        classList: ['oak-instructions-text'],
        innerHTML: 'You can read more about the Open Data API here: <a href="https://ninja.kiwi/opendatafaq" target="_blank", style="color:white";>Open Data API Article</a><br><br>Privacy Note: This app does not store any data being sent to or retrieved from Ninja Kiwi\'s Open Data API outside of your browser/device. The localStorage browser feature is used to prevent users from having to re-enter their OAK token every time they visit the site. If you would like to delete this stored data, you can do so by clicking the "X" on the profile you would like to delete on this homepage or clearing your browsing data.'
    }));
    createModal({
        header: 'OAK Instructions',
        content: OAKInstructionsDiv,
    });
    return OAKInstructionsDiv;
    
}