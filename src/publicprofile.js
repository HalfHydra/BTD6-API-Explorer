async function openProfile(source, profile, callback){
    profile = await getUserProfile(profile)
    if (profile == null) { return; }
    resetScroll();
    document.getElementById(`${source}-content`).style.display = "none";

    addToBackQueue({ source: source, destination: 'publicprofile', callback: callback });

    let publicProfileContent = document.getElementById('publicprofile-content');
    publicProfileContent.style.display = "flex";
    publicProfileContent.innerHTML = "";
    
    let publicProfileDiv = document.createElement('div');
    publicProfileDiv.classList.add('publicprofile-div');
    publicProfileContent.appendChild(publicProfileDiv);

    let modalClose = document.createElement('img');
    modalClose.classList.add('error-modal-close');
    modalClose.src = "./Assets/UI/CloseBtn.png";
    modalClose.addEventListener('click', () => {
        exitProfile(source);
    })
    publicProfileDiv.appendChild(modalClose);

    let profileHeader = document.createElement('div');
    profileHeader.classList.add('profile-header','profile-banner');
    profileHeader.style.backgroundImage = `linear-gradient(to bottom, transparent 50%, var(--profile-primary) 70%),url('${getProfileBanner(profile)}')`;
    publicProfileDiv.appendChild(profileHeader);
    profileHeader.appendChild(generateAvatar(100, getProfileAvatar(profile)));

    let profileTopBottom = document.createElement('div');
    profileTopBottom.classList.add('profile-top-bottom');
    profileHeader.appendChild(profileTopBottom);

    let profileTop = document.createElement('div');
    profileTop.classList.add('profile-top-public');
    profileTopBottom.appendChild(profileTop);

    let profileName = document.createElement('p');
    profileName.classList.add('profile-name','black-outline');
    profileName.innerHTML = profile["displayName"];
    profileTop.appendChild(profileName);

    let rankStar = document.createElement('div');
    rankStar.classList.add('rank-star-public');
    profileTop.appendChild(rankStar);

    let rankImg = document.createElement('img');
    rankImg.classList.add('rank-img');
    rankImg.src = '../Assets/UI/LvlHolder.png';
    rankStar.appendChild(rankImg);

    let rankText = document.createElement('p');
    rankText.classList.add('rank-text','black-outline');
    rankText.innerHTML = profile.rank;
    rankStar.appendChild(rankText);

    if (profile.veteranRank > 0) {
        let rankStarVeteran = document.createElement('div');
        rankStarVeteran.classList.add('rank-star-public');
        profileTop.appendChild(rankStarVeteran);

        let rankImgVeteran = document.createElement('img');
        rankImgVeteran.classList.add('rank-img');
        rankImgVeteran.src = '../Assets/UI/LvlHolderVeteran.png';
        rankStarVeteran.appendChild(rankImgVeteran);

        let rankTextVeteran = document.createElement('p');
        rankTextVeteran.classList.add('rank-text','black-outline');
        rankTextVeteran.innerHTML = profile.veteranRank;
        rankStarVeteran.appendChild(rankTextVeteran);
    }

    let profileFollowers = document.createElement('div')
    profileFollowers.classList.add('profile-followers');
    profileTop.appendChild(profileFollowers);

    let followersLabel = document.createElement('p');
    followersLabel.classList.add('followers-label','black-outline');
    followersLabel.innerHTML = 'Followers';
    profileFollowers.appendChild(followersLabel);

    let followersCount = document.createElement('p');
    followersCount.classList.add('followers-count');
    followersCount.innerHTML = profile["followers"].toLocaleString();
    profileFollowers.appendChild(followersCount);


    let belowProfileHeader = document.createElement('div');
    belowProfileHeader.classList.add('below-profile-header');
    publicProfileDiv.appendChild(belowProfileHeader);

    let leftColumnDiv = document.createElement('div');
    leftColumnDiv.classList.add('left-column-div');
    belowProfileHeader.appendChild(leftColumnDiv);

    let leftColumnHeader = document.createElement('div');
    leftColumnHeader.classList.add('left-column-header');
    leftColumnDiv.appendChild(leftColumnHeader);

    let leftColumnHeaderText = document.createElement('p');
    leftColumnHeaderText.classList.add('column-header-text','black-outline');
    leftColumnHeaderText.innerHTML = 'Medals';
    leftColumnHeader.appendChild(leftColumnHeaderText);

    let publicMedals = {};
    let tempCoop = {};
    for (let [key, value] of Object.entries(medalMap)){
        publicMedals["Medal" + value] = profile["_medalsSinglePlayer"][key] || 0;
        tempCoop["MedalCoop" + value] = profile["_medalsMultiplayer"][key] || 0;
    }
    publicMedals = {...publicMedals, ...tempCoop};
    publicMedals["BlastapopoulosEliteBadge"] = profile["bossBadgesElite"]["Blastapopoulos"] || 0;
    publicMedals["BlastapopoulosBadge"] = profile["bossBadgesNormal"]["Blastapopoulos"] || 0;
    publicMedals["PhayzeEliteBadge"] = profile["bossBadgesElite"]["Phayze"] || 0;
    publicMedals["PhayzeBadge"] = profile["bossBadgesNormal"]["Phayze"] || 0;
    publicMedals["DreadbloonEliteBadge"] = profile["bossBadgesElite"]["Dreadbloon"] || 0;
    publicMedals["DreadbloonBadge"] = profile["bossBadgesNormal"]["Dreadbloon"] || 0;
    publicMedals["VortexEliteBadge"] = profile["bossBadgesElite"]["Vortex"] || 0;
    publicMedals["VortexBadge"] = profile["bossBadgesNormal"]["Vortex"] || 0;
    publicMedals["LychEliteBadge"] = profile["bossBadgesElite"]["Lych"] || 0;
    publicMedals["LychBadge"] = profile["bossBadgesNormal"]["Lych"] || 0;
    publicMedals["BloonariusEliteBadge"] = profile["bossBadgesElite"]["Bloonarius"] || 0;
    publicMedals["BloonariusBadge"] = profile["bossBadgesNormal"]["Bloonarius"] || 0;
    publicMedals["MedalEventBronzeMedal"] = profile["_medalsRace"]["Bronze"] || 0;
    publicMedals["MedalEventSilverMedal"] = profile["_medalsRace"]["Silver"] || 0;
    publicMedals["MedalEventDoubleSilverMedal"] = profile["_medalsRace"]["DoubleSilver"] || 0;
    publicMedals["MedalEventGoldSilverMedal"] = profile["_medalsRace"]["GoldSilver"] || 0;
    publicMedals["MedalEventDoubleGoldMedal"] = profile["_medalsRace"]["DoubleGold"] || 0;
    publicMedals["MedalEventGoldDiamondMedal"] = profile["_medalsRace"]["GoldDiamond"] || 0;
    publicMedals["MedalEventBlueDiamondMedal"] = profile["_medalsRace"]["BlueDiamond"] || 0;
    publicMedals["MedalEventRedDiamondMedal"] = profile["_medalsRace"]["RedDiamond"] || 0;
    publicMedals["MedalEventBlackDiamondMedal"] = profile["_medalsRace"]["BlackDiamond"] || 0;
    publicMedals["OdysseyStarIcon"] = profile.gameplay["totalOdysseyStars"] || 0;
    publicMedals["BossMedalEventBronzeMedal"] = profile["_medalsBoss"]["Bronze"] || 0;
    publicMedals["BossMedalEventSilverMedal"] = profile["_medalsBoss"]["Silver"] || 0;
    publicMedals["BossMedalEventDoubleSilverMedal"] = profile["_medalsBoss"]["DoubleSilver"] || 0;
    publicMedals["BossMedalEventGoldSilverMedal"] = profile["_medalsBoss"]["GoldSilver"] || 0;
    publicMedals["BossMedalEventDoubleGoldMedal"] = profile["_medalsBoss"]["DoubleGold"] || 0;
    publicMedals["BossMedalEventGoldDiamondMedal"] = profile["_medalsBoss"]["GoldDiamond"] || 0;
    publicMedals["BossMedalEventBlueDiamondMedal"] = profile["_medalsBoss"]["BlueDiamond"] || 0;
    publicMedals["BossMedalEventRedDiamondMedal"] = profile["_medalsBoss"]["RedDiamond"] || 0;
    publicMedals["BossMedalEventBlackDiamondMedal"] = profile["_medalsBoss"]["BlackDiamond"] || 0;
    publicMedals["EliteBossMedalEventBronzeMedal"] = profile["_medalsBossElite"]["Bronze"] || 0;
    publicMedals["EliteBossMedalEventSilverMedal"] = profile["_medalsBossElite"]["Silver"] || 0;
    publicMedals["EliteBossMedalEventDoubleSilverMedal"] = profile["_medalsBossElite"]["DoubleSilver"] || 0;
    publicMedals["EliteBossMedalEventGoldSilverMedal"] = profile["_medalsBossElite"]["GoldSilver"] || 0;
    publicMedals["EliteBossMedalEventDoubleGoldMedal"] = profile["_medalsBossElite"]["DoubleGold"] || 0;
    publicMedals["EliteBossMedalEventGoldDiamondMedal"] = profile["_medalsBossElite"]["GoldDiamond"] || 0;
    publicMedals["EliteBossMedalEventBlueDiamondMedal"] = profile["_medalsBossElite"]["BlueDiamond"] || 0;
    publicMedals["EliteBossMedalEventRedDiamondMedal"] = profile["_medalsBossElite"]["RedDiamond"] || 0;
    publicMedals["EliteBossMedalEventBlackDiamondMedal"] = profile["_medalsBossElite"]["BlackDiamond"] || 0;
    publicMedals["CtLocalPlayerBronzeMedal"] = profile["_medalsCTLocal"]["Bronze"] || 0;
    publicMedals["CtLocalPlayerSilverMedal"] = profile["_medalsCTLocal"]["Silver"] || 0;
    publicMedals["CtLocalPlayerDoubleGoldMedal"] = profile["_medalsCTLocal"]["DoubleGold"] || 0;
    publicMedals["CtLocalPlayerGoldDiamondMedal"] = profile["_medalsCTLocal"]["GoldDiamond"] || 0;
    publicMedals["CtLocalPlayerBlueDiamondMedal"] = profile["_medalsCTLocal"]["BlueDiamond"] || 0;
    publicMedals["CtLocalPlayerRedDiamondMedal"] = profile["_medalsCTLocal"]["RedDiamond"] || 0;
    publicMedals["CtLocalPlayerBlackDiamondMedal"] = profile["_medalsCTLocal"]["BlackDiamond"] || 0;
    publicMedals["CtGlobalPlayerBronzeMedal"] = profile["_medalsCTGlobal"]["Bronze"] || 0;
    publicMedals["CtGlobalPlayerSilverMedal"] = profile["_medalsCTGlobal"]["Silver"] || 0;
    publicMedals["CtGlobalPlayerDoubleSilverMedal"] = profile["_medalsCTGlobal"]["DoubleSilver"] || 0;
    publicMedals["CtGlobalPlayerGoldSilverMedal"] = profile["_medalsCTGlobal"]["GoldSilver"] || 0;
    publicMedals["CtGlobalPlayerDoubleGoldMedal"] = profile["_medalsCTGlobal"]["DoubleGold"] || 0;
    publicMedals["CtGlobalPlayerGoldDiamondMedal"] = profile["_medalsCTGlobal"]["GoldDiamond"] || 0;
    publicMedals["CtGlobalPlayerDiamondMedal"] = profile["_medalsCTGlobal"]["Diamond"] || 0;

    let currencyAndMedalsDiv = document.createElement('div');
    currencyAndMedalsDiv.classList.add('currency-medals-div');
    leftColumnDiv.appendChild(currencyAndMedalsDiv);

    let medalsDiv = document.createElement('div');
    medalsDiv.classList.add('medals-div');
    currencyAndMedalsDiv.appendChild(medalsDiv);

    for (let [medal, num] of Object.entries(publicMedals)){
        if(num === 0) { continue; }
        let medalDiv = document.createElement('div');
        medalDiv.classList.add('medal-div');
        medalDiv.title = constants.medalLabels[medal];
        medalsDiv.appendChild(medalDiv);

        let medalImg = document.createElement('img');
        medalImg.classList.add('medal-img');
        medalImg.src = getMedalIcon(medal);
        medalImg.style.display = "none";
        medalImg.addEventListener('load', () => {
            if(medalImg.width < medalImg.height){
                medalImg.style.width = `${ratioCalc(3,70,256,0,medalImg.width)}px`
            } else {
                medalImg.style.height = `${ratioCalc(3,70,256,0,medalImg.height)}px`
            }
            medalImg.style.removeProperty('display');
        })
        medalDiv.appendChild(medalImg);

        let medalText = document.createElement('p');
        medalText.classList.add('medal-text','black-outline');
        medalText.innerHTML = num.toLocaleString();
        medalDiv.appendChild(medalText);

        tippy(medalDiv, {
            content: constants.medalLabels[medal],
            placement: 'top',
            theme: 'speech_bubble'
        })
    }

    let topHeroesMonkesyDiv = document.createElement('div');
    topHeroesMonkesyDiv.classList.add('top-heroes-monkeys-div');
    leftColumnDiv.appendChild(topHeroesMonkesyDiv);

    let topHeroesDiv = document.createElement('div');
    topHeroesDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topHeroesDiv);

    let topHeroesTopDiv = document.createElement('div');
    topHeroesTopDiv.classList.add('top-heroes-top-div');
    topHeroesDiv.appendChild(topHeroesTopDiv);

    let topHeroesTopRibbonDiv = document.createElement('div');
    topHeroesTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topHeroesTopDiv.appendChild(topHeroesTopRibbonDiv);

    let topHeroesText = document.createElement('p');
    topHeroesText.classList.add('top-heroes-text','black-outline');
    topHeroesText.innerHTML = 'Top Heroes';
    topHeroesTopRibbonDiv.appendChild(topHeroesText);

    let mapsProgressCoopToggle = document.createElement('div');
    mapsProgressCoopToggle.classList.add('maps-progress-coop-toggle');  
    topHeroesTopDiv.appendChild(mapsProgressCoopToggle);

    let mapsProgressCoopToggleText = document.createElement('p');
    mapsProgressCoopToggleText.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText.innerHTML = "Show All: ";
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleText);

    let mapsProgressCoopToggleInput = document.createElement('input');
    mapsProgressCoopToggleInput.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput.type = 'checkbox';
    mapsProgressCoopToggle.appendChild(mapsProgressCoopToggleInput);

    let topHeroesList = document.createElement('div');
    topHeroesList.classList.add('top-heroes-list');
    topHeroesDiv.appendChild(topHeroesList);

    let top3HeroesDiv = document.createElement('div');
    top3HeroesDiv.classList.add('top-3-heroes-div');
    topHeroesList.appendChild(top3HeroesDiv);

    let otherHeroesDiv = document.createElement('div');
    otherHeroesDiv.classList.add('other-heroes-div');
    otherHeroesDiv.style.display = 'none';
    topHeroesList.appendChild(otherHeroesDiv);

    mapsProgressCoopToggleInput.addEventListener('change', () => {
        mapsProgressCoopToggleInput.checked ? otherHeroesDiv.style.display = 'flex' : otherHeroesDiv.style.display = 'none';
    })

    let counter = 0;

    let heroesList = Object.keys(constants.heroesInOrder);

    for (let [hero, xp] of Object.entries(profile["heroesPlaced"]).sort((a, b) => b[1] - a[1])){
        if(xp === 0) { continue; }
        if(!heroesList.includes(hero)) { continue; }
        let heroDiv = document.createElement('div');
        heroDiv.classList.add('hero-div');
        counter < 3 ? top3HeroesDiv.appendChild(heroDiv) : otherHeroesDiv.appendChild(heroDiv);

        let heroImg = document.createElement('img');
        heroImg.classList.add('hero-img');
        heroImg.src = getHeroPortrait(hero,1);
        heroImg.style.display = "none";
        heroImg.addEventListener('load', () => {
            if(heroImg.width < heroImg.height){
                heroImg.style.width = `${ratioCalc(3,150,1920,0,heroImg.width)}px`
            } else {
                heroImg.style.height = `${ratioCalc(3,150,1920,0,heroImg.height)}px`
            }
            heroImg.style.removeProperty('display');
        })
        heroDiv.appendChild(heroImg);

        let heroText = document.createElement('p');
        heroText.classList.add('hero-text','black-outline');
        heroText.innerHTML = xp.toLocaleString();
        heroDiv.appendChild(heroText);
        counter++;

        tippy(heroDiv, {
            content: `${getLocValue(hero)} Placed ${xp.toLocaleString()} Times`,
            placement: 'top',
            theme: 'speech_bubble'
        })
    }

    let topTowersDiv = document.createElement('div');
    topTowersDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topTowersDiv);

    let topTowersTopDiv = document.createElement('div');
    topTowersTopDiv.classList.add('top-heroes-top-div');
    topTowersDiv.appendChild(topTowersTopDiv);

    let topTowersTopRibbonDiv = document.createElement('div');
    topTowersTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topTowersTopDiv.appendChild(topTowersTopRibbonDiv);

    let topTowersText = document.createElement('p');
    topTowersText.classList.add('top-heroes-text','black-outline');
    topTowersText.innerHTML = 'Top Towers';
    topTowersTopRibbonDiv.appendChild(topTowersText);

    let mapsProgressCoopToggle2 = document.createElement('div');
    mapsProgressCoopToggle2.classList.add('maps-progress-coop-toggle');
    topTowersTopDiv.appendChild(mapsProgressCoopToggle2);

    let mapsProgressCoopToggleText2 = document.createElement('p');
    mapsProgressCoopToggleText2.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText2.innerHTML = "Show All: ";
    mapsProgressCoopToggle2.appendChild(mapsProgressCoopToggleText2);

    let mapsProgressCoopToggleInput2 = document.createElement('input');
    mapsProgressCoopToggleInput2.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput2.type = 'checkbox';
    mapsProgressCoopToggle2.appendChild(mapsProgressCoopToggleInput2);
    
    let topTowersList = document.createElement('div');
    topTowersList.classList.add('top-heroes-list');
    topTowersDiv.appendChild(topTowersList);

    let top3TowersDiv = document.createElement('div');
    top3TowersDiv.classList.add('top-3-heroes-div');
    topTowersList.appendChild(top3TowersDiv);

    let otherTowersDiv = document.createElement('div');
    otherTowersDiv.classList.add('other-heroes-div');
    otherTowersDiv.style.display = 'none';
    topTowersList.appendChild(otherTowersDiv);

    mapsProgressCoopToggleInput2.addEventListener('change', () => {
        mapsProgressCoopToggleInput2.checked ? otherTowersDiv.style.display = 'flex' : otherTowersDiv.style.display = 'none';
    })

    counter = 0;
    let towersList = Object.keys(constants.towersInOrder);

    for (let [tower, xp] of Object.entries(profile["towersPlaced"]).sort((a, b) => b[1] - a[1])){
        if(xp === 0) { continue; }
        if(!towersList.includes(tower)) { continue; }
        let towerDiv = document.createElement('div');
        towerDiv.classList.add('hero-div');
        counter < 3 ? top3TowersDiv.appendChild(towerDiv) : otherTowersDiv.appendChild(towerDiv);

        let towerImg = document.createElement('img');
        towerImg.classList.add('hero-img');
        towerImg.src = getInstaContainerIcon(tower,"000");
        towerDiv.appendChild(towerImg);

        let towerText = document.createElement('p');
        towerText.classList.add('hero-text','black-outline');
        towerText.innerHTML = xp.toLocaleString();
        towerDiv.appendChild(towerText);
        counter++;

        tippy(towerDiv, {
            content: `${getLocValue(tower)} Placed ${xp.toLocaleString()} Times`,
            placement: 'top',
            theme: 'speech_bubble'
        })
    }

    let topParagonsDiv = document.createElement('div');
    topParagonsDiv.classList.add('top-heroes-div');
    topHeroesMonkesyDiv.appendChild(topParagonsDiv);

    let topParagonsTopDiv = document.createElement('div');
    topParagonsTopDiv.classList.add('top-heroes-top-div');
    topParagonsDiv.appendChild(topParagonsTopDiv);

    let topParagonsTopRibbonDiv = document.createElement('div');
    topParagonsTopRibbonDiv.classList.add('top-heroes-top-ribbon-div');
    topParagonsTopRibbonDiv.style.filter = 'hue-rotate(250deg)';
    topParagonsTopDiv.appendChild(topParagonsTopRibbonDiv);

    let topParagonsText = document.createElement('p');
    topParagonsText.classList.add('top-heroes-text','black-outline');
    topParagonsText.innerHTML = 'Top Paragons';
    topParagonsTopRibbonDiv.appendChild(topParagonsText);

    let mapsProgressCoopToggle3 = document.createElement('div');
    mapsProgressCoopToggle3.classList.add('maps-progress-coop-toggle');
    topParagonsTopDiv.appendChild(mapsProgressCoopToggle3);

    let mapsProgressCoopToggleText3 = document.createElement('p');
    mapsProgressCoopToggleText3.classList.add('maps-progress-coop-toggle-text','black-outline');
    mapsProgressCoopToggleText3.innerHTML = "Show All: ";
    mapsProgressCoopToggle3.appendChild(mapsProgressCoopToggleText3);

    let mapsProgressCoopToggleInput3 = document.createElement('input');
    mapsProgressCoopToggleInput3.classList.add('maps-progress-coop-toggle-input');
    mapsProgressCoopToggleInput3.type = 'checkbox';
    mapsProgressCoopToggle3.appendChild(mapsProgressCoopToggleInput3);
    
    let topParagonsList = document.createElement('div');
    topParagonsList.classList.add('top-heroes-list');
    topParagonsDiv.appendChild(topParagonsList);

    let top3ParagonsDiv = document.createElement('div');
    top3ParagonsDiv.classList.add('top-3-heroes-div');
    topParagonsList.appendChild(top3ParagonsDiv);

    let otherParagonsDiv = document.createElement('div');
    otherParagonsDiv.classList.add('other-heroes-div');
    otherParagonsDiv.style.display = 'none';
    topParagonsList.appendChild(otherParagonsDiv);

    mapsProgressCoopToggleInput3.addEventListener('change', () => {
        mapsProgressCoopToggleInput3.checked ? otherParagonsDiv.style.display = 'flex' : otherParagonsDiv.style.display = 'none';
    })

    counter = 0;

    for (let [tower, xp] of Object.entries(profile.stats["paragonsPurchasedByName"]).sort((a, b) => b[1] - a[1])){
        
        if(xp === 0) { continue; }
        if(!constants.paragonsAvailable.includes(tower)) { continue; }
        let towerDiv = document.createElement('div');
        towerDiv.classList.add('hero-div');
        towerDiv.style.backgroundImage = "url(../Assets/UI/ParagonContainer.png)";
        counter < 3 ? top3ParagonsDiv.appendChild(towerDiv) : otherParagonsDiv.appendChild(towerDiv);

        let towerImg = document.createElement('img');
        towerImg.classList.add('hero-img');
        towerImg.src = getTowerAssetPath(tower,"Paragon");
        towerDiv.appendChild(towerImg);

        let towerText = document.createElement('p');
        towerText.classList.add('hero-text','black-outline');
        towerText.innerHTML = xp.toLocaleString();
        towerDiv.appendChild(towerText);
        counter++;

        tippy(towerDiv, {
            content: `${getLocValue(tower + " Paragon")} Placed ${xp.toLocaleString()} Times`,
            placement: 'top',
            theme: 'speech_bubble'
        })
    }

    let rightColumnDiv = document.createElement('div');
    rightColumnDiv.classList.add('right-column-div');
    belowProfileHeader.appendChild(rightColumnDiv);

    let rightColumnHeader = document.createElement('div');
    rightColumnHeader.classList.add('overview-right-column-header');
    rightColumnDiv.appendChild(rightColumnHeader);

    let rightColumnHeaderText = document.createElement('p');
    rightColumnHeaderText.classList.add('column-header-text','black-outline');
    rightColumnHeaderText.innerHTML = 'Overall Stats';
    rightColumnHeader.appendChild(rightColumnHeaderText);

    let statsPublic = {};
    statsPublic["Games Played"] = profile.gameplay["gameCount"];
    statsPublic["Games Won"] = profile.gameplay["gamesWon"];
    statsPublic["Highest Round (All Time)"] = profile.gameplay["highestRound"];
    statsPublic["Highest Round (CHIMPS)"] = profile.gameplay["highestRoundCHIMPS"];
    statsPublic["Highest Round (Deflation)"] = profile.gameplay["highestRoundDeflation"];
    statsPublic["Monkeys Placed"] = profile.gameplay["monkeysPlaced"];
    statsPublic["Total Pop Count"] = profile.bloonsPopped["bloonsPopped"];
    statsPublic["Total Co-Op Pop Count"] = profile.bloonsPopped["coopBloonsPopped"];
    statsPublic["Camo Bloons Popped"] = profile.bloonsPopped["camosPopped"];
    statsPublic["Lead Bloons Popped"] = profile.bloonsPopped["leadsPopped"];
    statsPublic["Purple Bloons Popped"] = profile.bloonsPopped["purplesPopped"];
    statsPublic["Regrow Bloons Popped"] = profile.bloonsPopped["regrowsPopped"];
    statsPublic["Ceramic Bloons Popped"] = profile.bloonsPopped["ceramicsPopped"];
    statsPublic["MOABs Popped"] = profile.bloonsPopped["moabsPopped"];
    statsPublic["BFBs Popped"] = profile.bloonsPopped["bfbsPopped"];
    statsPublic["ZOMGs Popped"] = profile.bloonsPopped["zomgsPopped"];
    statsPublic["DDTs Popped"] = profile.bloonsPopped["ddtsPopped"];
    statsPublic["BADs Popped"] = profile.bloonsPopped["badsPopped"];
    statsPublic["Bloons Leaked"] = profile.bloonsPopped["bloonsLeaked"];
    statsPublic["Cash Generated"] = profile.gameplay["cashEarned"];
    statsPublic["Cash Gifted"] = profile.gameplay["coopCashGiven"];
    statsPublic["Abilities Used"] = profile.gameplay["abilitiesUsed"];
    statsPublic["Powers Used"] = profile.gameplay["powersUsed"];
    statsPublic["Insta Monkeys Used"] = profile.gameplay["instaMonkeysUsed"];
    statsPublic["Daily Reward Chests Opened"] = profile.gameplay["dailyRewards"];
    statsPublic["Challenges Completed"] = profile.gameplay["challengesCompleted"];
    statsPublic["Achievements"] = `${profile["achievements"]}/${constants.achievements + constants.hiddenAchievements}`;
    statsPublic["Odysseys Completed"] = profile.gameplay["totalOdysseysCompleted"];
    statsPublic["Lifetime Trophies"] = profile.gameplay["totalTrophiesEarned"];
    statsPublic["Necro Bloons Reanimated"] = profile.bloonsPopped["necroBloonsReanimated"];
    statsPublic["Transforming Tonics Used"] = profile.bloonsPopped["transformingTonicsUsed"];
    statsPublic["Most Experienced Monkey"] = getLocValue(profile["mostExperiencedMonkey"]);
    statsPublic["Insta Monkey Collection"] = `${profile.gameplay["instaMonkeyCollection"]}/${constants.totalInstaMonkeys}`;
    statsPublic["Collection Chests Opened"] = profile.gameplay["collectionChestsOpened"];
    statsPublic["Golden Bloons Popped"] = profile.bloonsPopped["goldenBloonsPopped"];
    statsPublic["Monkey Teams Wins"] = profile.gameplay["monkeyTeamsWins"];
    statsPublic["Bosses Popped"] = profile.bloonsPopped["bossesPopped"];
    statsPublic["Damage Done To Bosses"] = profile.gameplay["damageDoneToBosses"];

    let profileStatsDiv = document.createElement('div');
    profileStatsDiv.classList.add('profile-stats');
    rightColumnDiv.appendChild(profileStatsDiv);

    for (let [key, value] of Object.entries(statsPublic)){
        let stat = document.createElement('div');
        stat.classList.add('stat');
        profileStatsDiv.appendChild(stat);

        let statName = document.createElement('p');
        statName.classList.add('stat-name');
        statName.innerHTML = key;
        stat.appendChild(statName);

        let statValue = document.createElement('p');
        statValue.classList.add('stat-value');
        statValue.innerHTML = value.toLocaleString();
        stat.appendChild(statValue);
    }

    let exclusiveStatsPublic = {}
    exclusiveStatsPublic["Contested Territory Tiles Captured"] = profile.stats["ctCapturedTiles"];
    exclusiveStatsPublic["Towers Sold"] = profile.stats["totalTowersSold"];
    exclusiveStatsPublic["Total Tier 1 Upgrades"] = profile.stats["upgradesPurchasedByTier"]["1"];
    exclusiveStatsPublic["Total Tier 2 Upgrades"] = profile.stats["upgradesPurchasedByTier"]["2"];
    exclusiveStatsPublic["Total Tier 3 Upgrades"] = profile.stats["upgradesPurchasedByTier"]["3"];
    exclusiveStatsPublic["Total Tier 4 Upgrades"] = profile.stats["upgradesPurchasedByTier"]["4"];
    exclusiveStatsPublic["Total Tier 5 Upgrades"] = profile.stats["upgradesPurchasedByTier"]["5"];

    let exclusiveStatDiv = document.createElement('div');
    exclusiveStatDiv.classList.add('profile-stats');
    rightColumnDiv.appendChild(exclusiveStatDiv);

    let exclusiveStatColumnHeader = document.createElement('div');
    exclusiveStatColumnHeader.classList.add('overview-right-column-header');
    exclusiveStatDiv.appendChild(exclusiveStatColumnHeader);

    let exclusiveColumnHeaderText = document.createElement('p');
    exclusiveColumnHeaderText.classList.add('column-header-text','black-outline');
    exclusiveColumnHeaderText.innerHTML = 'API Exclusive Stats';
    exclusiveStatColumnHeader.appendChild(exclusiveColumnHeaderText);

    for (let [key, value] of Object.entries(exclusiveStatsPublic)){
        if (value == null) { continue; }
        let stat = document.createElement('div');
        stat.classList.add('stat');
        exclusiveStatDiv.appendChild(stat);

        let statName = document.createElement('p');
        statName.classList.add('stat-name');
        statName.innerHTML = key;
        stat.appendChild(statName);

        let statValue = document.createElement('p');
        statValue.classList.add('stat-value');
        statValue.innerHTML = value.toLocaleString();
        stat.appendChild(statValue);
    }
}

function exitProfile(source){
    goBack();
    // document.getElementById('publicprofile-content').style.display = "none";
    // document.getElementById(`${source}-content`).style.display = "flex";
}
