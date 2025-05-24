const standaloneSites = {
    "Roundsets": { link: "https://btd6apiexplorer.github.io/rounds", text: "Roundsets", icon: "DefaultRoundSetIcon", background: "BloonsBG" },
    "Leaderboards": { link: "https://btd6apiexplorer.github.io/leaderboards", text: "Leaderboards", icon: "LeaderboardSiteBtn", background: "TrophyStoreTiledBG" },
    "Rogue Artifacts": { link: "https://btd6apiexplorer.github.io/rogue", text: "Rogue Artifacts", icon: "RogueSiteBtn", background: "RogueBG" },
    "Insta Tracker": { link: "https://btd6apiexplorer.github.io/insta", text: "Insta Tracker", icon: "InstaSiteBtn", background: "CollectionHelp2" }
};
const FAQ = {
    "What can I do with this?": "Some primary uses are tracking your progress automatically, viewing events and leaderboards up to two months in the past, browsing user generated content, and as a bonus feature: viewing round information. You can also view more detailed stats and progress than you can see in the game such as your highest round for every mode on every map you've played. Those who are working on their Insta Monkey collection can use this as a tracker as the data pulled is always up to date!",
    "How long does the API take to update after I do something in the game?": "15 minutes is the most I've seen. Be sure to press the save button in settings if you want to minimize the time it takes to update! It should not take more than 24 hours to update in any circumstance (browser caching, etc).",
    "Why is this not available for BTD6+ and Netflix?": "This is because the data is stored differently for these versions such as using iCloud for BTD6+. This is not compatible with the Open Data API."
}

const changelog = ``` 
v1.9.1: Many Bug Fixes<br>
- Fixed Voidora's hero starter kit being incorrect<br>
- Fixed CT Local Medals not appearing and Global medals being incorrectly labeled<br>
- Fixed the normal Rogue Legends roundset not being updated with the Update 48 changes<br>
- Fixed a bug causing modded paragons to show up and error out<br><br>
v.1.9.0: Update 48 Content, Abilites Used Section, Top Paragons<br>
- Added all content from Update 48 (there was a lot)<br>
- You are now able to view how many times you've used each ability. You can find this under Progress -> Unqiue Abilities Used<br>
- Top Paragons will now appear under Top Towers and Top Heroes on the overview<br>
- Rogue Legends received an update with 6 new roundset variations, those have been added as a top bar with an icon of what bloons on the tile the roundset correlates to.<br>
- Rogue Legends Artifacts has been updated to include all the artifacts added, as well as be able to sort for only Update 48 artifacts.<br><br>
v1.8.1: Rogue Artifacts Updates<br>
- Filter & Sort has been reworked into a new settings menu that adds lots of new filtering options<br>
- A search bar has been added to find artifacts quickly<br>
- The total count of artifacts should now always be accurate<br>
- The back button now correctly returns you to where you were prior<br><br>
v1.8.0: Rogue Legends Artifacts<br>
- Added Rogue Legends Artifacts standalone site. Allows you to track and share your artifacts collection with others, as well as reference Hero Starter Kits for each artifact<br>
- Unfortunately the Open Data API does not have the extracted artifacts available for your profile, so all entry will be manual<br>
- Updated the standalone site buttons to be simpler<br><br>
v.1.7.1: Inevitable bug fixes<br>
- Rogue Legends Stats will no longer show up if you don't own it<br>
- Tooltips now render HTML entities, have larger text, and have the arrow centered<br>
- Added missing tooltips from leaderboards site<br><br>
v.1.7.0: Update 47 and Tooltips!<br>
- Added Update 47.1 content including the new Rogue Legends roundset<br>
- Added proper tooltips to medals and a few other places like the Towers section.<br>
- Added Rogue Legends stats to the overview page<br>
- Added Round Hints to the roundset viewer<br>
- Added Overall Highest Round and Total Games Won on the map specific details menu<br>
- Added missing Adora + Battle Cat Roundsets, and a few older Odysseys courtesy of @jessiepatch<br>
- The standalone site buttons got a glow up.<br>
- The roundset selection screen has been condensed and cleaned up.<br>
- Fixed a bug involving leaderboard requests that result in incorrect placements and duplicated entries<br>
- Leaderboard entries should only have the profiles loaded if they are currently rendered on screen.<br><br>
v1.6.1: Inevitable Leaderboard Fixes<br>
- The site no longer infinite loads when there are no active events<br>
- The site no longer has any leaderboards with 0 scores shown (some older events get their leaderboards wiped early)<br>
- Events that aren't started won't show up until they are active<br>
- The initial load was improved, and the loading icon now shows correctly when clicking a leaderboard for the first time<br><br>
v1.6.0: Leaderboards improvements and page!<br>
- There is now a <a href="./leaderboards" target="_blank" style="color: white;">Leaderboards Page</a> made specifically for viewing them all in one place.<br>
- Loading profiles automatically has been turned back on because...<br>
- Improved the handling of automatically loading leaderboard profiles to not be rate limited as quickly. This system should hopefully prevent any rate limiting at all.<br><br>
v1.5.1: Bug fixes! <br>
- Zero limited or excluded towers/heroes like the upcoming Bloonarius 56 will no longer show an empty box<br>
- The timer no longer jumps to the first event of the list assuming there is only one active at a time.<br><br>
v1.5.0: Trophy Store Items and Update 46!<br>
- Added Update 46 content<br>
- Added the Trophy Store Items menu for those who want to see all that exist and your collection.<br>
- Team Store items have also been added, but since I am unable to test how that works, it is hidden in settings by default.<br>
- Settings should now save when reloading the page using the same system that saves the OAK tokens you've used.<br>
- Fixed a bug that prevented newer maps from showing up<br>
- Added missing badges<br><br>
v1.4.0: Extras and Events in Roundsets<br>
- User profiles on the leaderboards and content browser no longer load by default. This caused too many rate limiting issues.<br>
- Added a setting in Settings to toggle automatic profile loading back on if you wanted to see the profile avatar and banner of users on the leaderboard.<br>
- Added known previous events with custom roundsets to the Roundsets section.<br>
- Fixed a bug involving timers going weirdly negative<br>
- Added Creator Support instructions<br><br>
v1.3.0: QoL Changes<br>
- Added Update 45 images and content<br>
- You can now toggle to see just the excluded towers and heroes of a challenge or event<br>
- You can now swap between Normal/Elite on the details for a boss<br>
- Bloon groups can now be hidden in the round previewer by clicking on them<br>
- Added a checkmark in the Collection Event list to categories that were completely collected<br>
- Updated Endurance Rounds to use updated round thresholds<br>
- Resolved an issue when applying a filter to content browser content and not refreshing<br>
- Added Ceramic Flood Roundset (very late)<br><br>
v1.2.3: Collection Event Menu Upgrade<br>
- Added a how to use guide at the top of the Collection Event Menu<br>
- Added the Insta Chest odds to the Collection Event Menu<br>
- Clicking on a missing Insta will now temporarily mark it as obtained<br><br>
v1.2.2: Missing Medals<br>
- Added a few missing medals from the overview/leaderboard profile pages<br>
- Added mouse hover tooltips to various elements<br><br>
v1.2.1: Insta Monkey Collection Improvements<br>
- Resolved an issue preventing the collected but used Insta Monkeys from being displayed.<br>
- Add a new list of all the Insta Monkey tower chances in the Collection Event Helper for efficient checking of what the best Featured Insta Monkey to choose is.<br>
- The trailer video no longer plays in the background after previewing the site or logging in! Thanks for the feedback.<br>
<br>
v1.2.0: Preview Mode and UI Improvements <br>
- Added a way to use the site without an OAK token. Useful when you don\'t have it accessible or can\'t make one<br>
- The site now prompts when your data has new content that the site doesn\'t have updated yet<br>
- Challenge details now correctly shows the max amount of specific monkeys if limited<br>
- Other UI fixes<br><br>
v1.1.0: Insta Monkey Collection Features<br>
- Added Insta Monkey Collection Event Helper. This displays the odds of getting a new Insta Monkey for each chest type and when selecting a featured tower.<br>
- Also added a page documentating all of the continuous sources of Insta Monkeys<br>
- UI fixes and improvements<br>
<br>
v1.0.1: Bug Fixes<br>
- Daily challenges now show the correct associated date<br>
- Rework roundset processing to fix numerous bugs<br>
- Add extra one-off roundsets to the list for completion sake<br>
- Other minor UI fixes<br><br>
v1.0.0: Initial Release<br>
- The Odyssey tab is still being worked on and will be added in the near future.<br>
- An Insta Monkeys Rotation helper will also be added soon.
```

function generateFrontPage(){
    const frontPage = document.getElementById('front-page');

    frontPage.appendChild(createEl('p', { classList: ['disclaimer-text', 'font-gardenia'], innerHTML: 'This site is not affiliated with Ninja Kiwi. All game assets belong to Ninja Kiwi.' }));
    frontPage.appendChild(createEl('p', { classList: ['front-page-text', 'font-gardenia', 'ta-center'], innerHTML: 'Access your profile using an OAK token for the best experience!' }));

    const previousOAK = createEl('div');
    Object.entries(localStorageOAK).forEach(([oak, oakdata]) => {
        const entry = createEl('div', {
            classList: ['previous-oak-entry', 'd-flex', 'ai-center', 'ps-relative'],
            style: { backgroundImage: `linear-gradient(to right, transparent 80%, var(--profile-primary) 100%),url(${oakdata.banner})` }
        });
        entry.appendChild(generateAvatar(100, oakdata.avatar));
        entry.appendChild(createEl('p', { classList: ['profile-name', 'tc-white', 'font-luckiest', 'black-outline'], innerHTML: oakdata.displayName }));
        const useBtn = createEl('img', { classList: ['use-button', 'ps-absolute'], src: './Assets/UI/ContinueBtn.png' });
        useBtn.addEventListener('click', () => {
            trailerVideo.pause();
            if (!pressedStart) {
                pressedStart = true;
                document.getElementById("loading").style.removeProperty("transform");
                loggedIn = true;
                oak_token = oak;
                getSaveData(oak);
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
    frontPage.appendChild(previousOAK);

    const trailerVideo = createEl('video', { classList: ['trailer-video'], src: './Assets/Trailer/Trailer.mp4' });
    trailerVideo.preload = 'none';
    trailerVideo.controls = true;

    let siteAccessDiv = document.createElement('div');
    siteAccessDiv.classList.add('site-access-div');
    frontPage.appendChild(siteAccessDiv);

    let siteLoginButtons = document.createElement('div');
    siteLoginButtons.classList.add('site-login-buttons');
    siteAccessDiv.appendChild(siteLoginButtons);

    let previewButton = document.createElement('p');
    previewButton.classList.add('site-access-button','black-outline');
    previewButton.innerHTML = 'Preview Site';
    previewButton.addEventListener('click', () => {
        trailerVideo.pause();
        previewSite();
    })
    siteLoginButtons.appendChild(previewButton);

    let challengeSelectorOR = document.createElement('p');
    challengeSelectorOR.classList.add("challenge-selector-or", "black-outline");
    challengeSelectorOR.innerHTML = "OR";
    siteLoginButtons.appendChild(challengeSelectorOR);

    let loginButton = document.createElement('p');
    loginButton.classList.add('site-access-button','black-outline');
    loginButton.innerHTML = 'Login With OAK';
    loginButton.addEventListener('click', () => {
        document.querySelector('.oak-entry-div').style.display = 'flex';
        siteLoginButtons.style.display = 'none';
    })
    siteLoginButtons.appendChild(loginButton);

    let oakEntryDiv = document.createElement('div');
    oakEntryDiv.classList.add('oak-entry-div');
    oakEntryDiv.style.display = 'none';
    frontPage.appendChild(oakEntryDiv);
    
    let keyEntry = document.createElement('input');
    keyEntry.classList.add('key-entry');
    keyEntry.placeholder = 'Enter your OAK here';
    oakEntryDiv.appendChild(keyEntry);
    
    let startButton = document.createElement('div');
    startButton.classList.add('start-button','black-outline');
    startButton.innerHTML = 'Start';
    startButton.addEventListener('click', () => {
        trailerVideo.pause();
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

    let OtherInfoHeader = document.createElement('p');
    OtherInfoHeader.classList.add('site-info-header','black-outline');
    OtherInfoHeader.innerHTML = 'Site Information';
    frontPage.appendChild(OtherInfoHeader);

    let infoButtons = document.createElement('div');
    infoButtons.classList.add('info-buttons');
    frontPage.appendChild(infoButtons);

    let trailerButton = document.createElement('p');
    trailerButton.classList.add('where-button','black-outline');
    trailerButton.innerHTML = 'Watch Trailer';
    infoButtons.appendChild(trailerButton);

    let faqButton = document.createElement('p');
    faqButton.classList.add('where-button','black-outline')
    faqButton.innerHTML = 'FAQ';
    infoButtons.appendChild(faqButton);

    let knownIssuesButton = document.createElement('p');
    knownIssuesButton.classList.add('where-button','black-outline');
    knownIssuesButton.innerHTML = 'Known Issues';
    infoButtons.appendChild(knownIssuesButton);

    let changelogButton = document.createElement('p');
    changelogButton.classList.add('where-button','black-outline');
    changelogButton.innerHTML = 'Changelog';
    infoButtons.appendChild(changelogButton);

    let privacyButton = document.createElement('p');
    privacyButton.classList.add('where-button', 'black-outline');
    privacyButton.innerHTML = 'Privacy Policy';
    infoButtons.appendChild(privacyButton);

    let feedbackButton = document.createElement('p');
    feedbackButton.classList.add('where-button','black-outline');
    feedbackButton.innerHTML = 'Send Feedback';
    infoButtons.appendChild(feedbackButton);

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

    let StandaloneSiteText = document.createElement('p');
    StandaloneSiteText.classList.add('site-info-header', 'sites-text', 'black-outline');
    StandaloneSiteText.innerHTML = 'Standalone Sites';
    frontPage.appendChild(StandaloneSiteText);

    let sitesText = document.createElement('p');
    sitesText.classList.add('where-text');
    sitesText.innerHTML = 'Separate sites with just one specialized module of this site:';
    frontPage.appendChild(sitesText);

    let StandaloneSiteDiv = document.createElement('div');
    StandaloneSiteDiv.classList.add('site-access-div');
    frontPage.appendChild(StandaloneSiteDiv);

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
        "Rogue Artifacts": {
            "link": "https://btd6apiexplorer.github.io/rogue",
            "text": "Rogue Artifacts",
            "icon": "RogueSiteBtn",
            "background": "RogueBG"
        },
        "Insta Tracker": {
            "link": "https://btd6apiexplorer.github.io/insta",
            "text": "Insta Tracker",
            "icon": "InstaSiteBtn",
            "background": "CollectionHelp2"
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
    OAKInstructionsText.innerHTML = 'An Open Access Key (OAK) is a unique key that allows you to access your Bloons TD 6 data from Ninja Kiwi\'s Open Data API. The site will use this to fetch your information from the API. <br><br>NOTE: Progress tracking is not available for BTD6+ on Apple Arcade and BTD6 Netflix as OAK tokens are unavailable. Alternatively, you can <p onclick="previewSite()" style="font-family:GardeniaBold;color: white;cursor: pointer;text-decoration: underline;display: inline-block;">Preview The Site</p>';
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
    knownIssuesText.innerHTML = '- There are some cases where the leaderboard scoring type is different for Normal vs Elite boss events, but this is not reflected on the API right now. This will be fixed when it is corrected on the Open Data API.<br>- Legends Feats badge is missing from the currency and medals section<br>- The leaderboards site and leaderboards on the events are currently broken. This is being worked on to reflect changes to the system made in Update 48.';
    knownIssuesDiv.appendChild(knownIssuesText);
    
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
    changelogText.innerHTML = `v1.9.1: Many Bug Fixes<br>- Fixed Voidora's hero starter kit being incorrect<br>- Fixed CT Local Medals not appearing and Global medals being incorrectly labeled<br>- Fixed the normal Rogue Legends roundset not being updated with the Update 48 changes<br>- Fixed a bug causing modded paragons to show up and error out<br><br>
    v.1.9.0: Update 48 Content, Abilites Used Section, Top Paragons<br>- Added all content from Update 48 (there was a lot)<br>- You are now able to view how many times you've used each ability. You can find this under Progress -> Unqiue Abilities Used<br>- Top Paragons will now appear under Top Towers and Top Heroes on the overview<br>- Rogue Legends received an update with 6 new roundset variations, those have been added as a top bar with an icon of what bloons on the tile the roundset correlates to.<br>- Rogue Legends Artifacts has been updated to include all the artifacts added, as well as be able to sort for only Update 48 artifacts.<br><br>
    v1.8.1: Rogue Artifacts Updates<br>- Filter & Sort has been reworked into a new settings menu that adds lots of new filtering options<br>- A search bar has been added to find artifacts quickly<br>- The total count of artifacts should now always be accurate<br>- The back button now correctly returns you to where you were prior<br><br>
    v1.8.0: Rogue Legends Artifacts<br>- Added Rogue Legends Artifacts standalone site. Allows you to track and share your artifacts collection with others, as well as reference Hero Starter Kits for each artifact<br>- Unfortunately the Open Data API does not have the extracted artifacts available for your profile, so all entry will be manual<br>- Updated the standalone site buttons to be simpler<br><br>
    v.1.7.1: Inevitable bug fixes<br>- Rogue Legends Stats will no longer show up if you don't own it<br>- Tooltips now render HTML entities, have larger text, and have the arrow centered<br>- Added missing tooltips from leaderboards site<br><br>
    v.1.7.0: Update 47 and Tooltips!<br>- Added Update 47.1 content including the new Rogue Legends roundset<br>- Added proper tooltips to medals and a few other places like the Towers section.<br>- Added Rogue Legends stats to the overview page<br>- Added Round Hints to the roundset viewer<br>- Added Overall Highest Round and Total Games Won on the map specific details menu<br>- Added missing Adora + Battle Cat Roundsets, and a few older Odysseys courtesy of @jessiepatch<br>- The standalone site buttons got a glow up.<br>- The roundset selection screen has been condensed and cleaned up.<br>- Fixed a bug involving leaderboard requests that result in incorrect placements and duplicated entries<br>- Leaderboard entries should only have the profiles loaded if they are currently rendered on screen.<br><br>
    v1.6.1: Inevitable Leaderboard Fixes<br>- The site no longer infinite loads when there are no active events<br>- The site no longer has any leaderboards with 0 scores shown (some older events get their leaderboards wiped early)<br>- Events that aren't started won't show up until they are active<br>- The initial load was improved, and the loading icon now shows correctly when clicking a leaderboard for the first time<br><br>
    v1.6.0: Leaderboards improvements and page!<br>- There is now a <a href="./leaderboards" target="_blank" style="color: white;">Leaderboards Page</a> made specifically for viewing them all in one place.<br>- Loading profiles automatically has been turned back on because...<br>- Improved the handling of automatically loading leaderboard profiles to not be rate limited as quickly. This system should hopefully prevent any rate limiting at all.<br><br>
    v1.5.1: Bug fixes! <br>- Zero limited or excluded towers/heroes like the upcoming Bloonarius 56 will no longer show an empty box<br>- The timer no longer jumps to the first event of the list assuming there is only one active at a time.<br><br>
    v1.5.0: Trophy Store Items and Update 46!<br>- Added Update 46 content<br>- Added the Trophy Store Items menu for those who want to see all that exist and your collection.<br>- Team Store items have also been added, but since I am unable to test how that works, it is hidden in settings by default.<br>- Settings should now save when reloading the page using the same system that saves the OAK tokens you've used.<br>- Fixed a bug that prevented newer maps from showing up<br>- Added missing badges<br><br>
    v1.4.0: Extras and Events in Roundsets<br>- User profiles on the leaderboards and content browser no longer load by default. This caused too many rate limiting issues.<br>- Added a setting in Settings to toggle automatic profile loading back on if you wanted to see the profile avatar and banner of users on the leaderboard.<br>- Added known previous events with custom roundsets to the Roundsets section.<br>- Fixed a bug involving timers going weirdly negative<br>- Added Creator Support instructions<br><br>
    v1.3.0: QoL Changes<br>- Added Update 45 images and content<br>- You can now toggle to see just the excluded towers and heroes of a challenge or event<br>- You can now swap between Normal/Elite on the details for a boss<br>- Bloon groups can now be hidden in the round previewer by clicking on them<br>- Added a checkmark in the Collection Event list to categories that were completely collected<br>- Updated Endurance Rounds to use updated round thresholds<br>- Resolved an issue when applying a filter to content browser content and not refreshing<br>- Added Ceramic Flood Roundset (very late)<br><br>
    v1.2.3: Collection Event Menu Upgrade<br>- Added a how to use guide at the top of the Collection Event Menu<br>- Added the Insta Chest odds to the Collection Event Menu<br>- Clicking on a missing Insta will now temporarily mark it as obtained<br><br>
    v1.2.2: Missing Medals<br>- Added a few missing medals from the overview/leaderboard profile pages<br>- Added mouse hover tooltips to various elements<br><br>
    v1.2.1: Insta Monkey Collection Improvements<br>- Resolved an issue preventing the collected but used Insta Monkeys from being displayed.<br>- Add a new list of all the Insta Monkey tower chances in the Collection Event Helper for efficient checking of what the best Featured Insta Monkey to choose is.<br>- The trailer video no longer plays in the background after previewing the site or logging in! Thanks for the feedback.<br><br>v1.2.0: Preview Mode and UI Improvements <br>- Added a way to use the site without an OAK token. Useful when you don\'t have it accessible or can\'t make one<br>- The site now prompts when your data has new content that the site doesn\'t have updated yet<br>- Challenge details now correctly shows the max amount of specific monkeys if limited<br>- Other UI fixes<br><br>
    v1.1.0: Insta Monkey Collection Features<br>- Added Insta Monkey Collection Event Helper. This displays the odds of getting a new Insta Monkey for each chest type and when selecting a featured tower.<br>- Also added a page documentating all of the continuous sources of Insta Monkeys<br>- UI fixes and improvements<br><br>v1.0.1: Bug Fixes<br>- Daily challenges now show the correct associated date<br>- Rework roundset processing to fix numerous bugs<br>- Add extra one-off roundsets to the list for completion sake<br>- Other minor UI fixes<br><br>
    v1.0.0: Initial Release<br>- The Odyssey tab is still being worked on and will be added in the near future.<br>- An Insta Monkeys Rotation helper will also be added soon.`;
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
        ["oak-instructions", "faq", "privacy", "known-issues","changelog","trailer", "feedback"].forEach((tabName) => {
            trailerVideo.pause();
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
}