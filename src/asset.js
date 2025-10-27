const achievementNameFixMap = {
    "Clicker": "Bloons Master",
    "Superior Clicker": "Superior Bloons Master",
    "Ultimate Clicker": "Ultimate Bloons Master",
    "Knowledgable Primate": "Knowledgeable Primate",
    "Triple Threat": "Triple threat",
    "Small Bloons": "Alchermistman and Bloonacleboy",
    "Master of Life": "Master of life",
    "What did it cost": "What did it cost? - Everything",
    "2 Mega Pops": "2 MegaPops",
    "Looking fab": "Lookin fab",
    "GoldenTicket": "Golden Ticket",
    "Axis of Havok": "Axis of Havoc",
    "Co-op Popper!": "Co-op Popper",
    "CouponCrazy": "Coupon Crazy",
    "LimitedRun": "Limited Run",
    "ALaCode": "A La Code",
    "InstantGratification": "Instant Gratification",
    "Achievement Of Achievements": "Achievement of Achievements",
    "What is this new Bloonery": "What is this new Bloonery?",
    "Who's the Boss": "Who's the Boss?",
    "I'llBeBack": "I'll Be Back",
    "SoSpiiiceyNinjaKiwi": "So Spiiicey Ninja Kiwi",
    "DavidsVsGoliath": "Davids vs Goliath",
    "ToolsToDarwin": "Tools to Darwin",
    "BigSpender": "Big Spender",
    "NotLackingCriticalInformation": "Not Lacking Critical Information",
    "StubbornStrategy": "Stubborn Strategy",
    "Hook Line And Sinker": "Hook, Line, and Sinker",
    "CrashOfTheTitans": "Crash of the Titans",
    "So Shiny": "So Shiny!",
    "Ultimate Team Up": "Ultimate Team-up",
    "StudentLoans": "Student Loans",
    "StickySituation": "Sticky Situation",
    "NoHarvest": "No Harvest",
    "ReadyPlayerOne": "Ready Player One?",
    "TheDailyReid": "The Daily Reid",
    "InstaCentury": "Insta Century"
}

const reverseAchievementNameFixMap = Object.entries(achievementNameFixMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});

const skinNameFixMap = {
    "ObynOceanGuardian": "OceanObyn",
    "MoltenObyn": "MountainObyn",
    "JoanOfArcAdora": "JoanOfArc",
    "CyberQuincy": "QuincyCyber",
    "ETnEtienne": "ETn",
    "SentaiCaptainChurchill": "SentaiChurchill",
    "SleighCaptainChurchill": "SleighChurchill",
    "TinkerfairyRosalia": "RosaliaTinkerfairy"
}

const upgradeNameFixMap = {
    "Spikeopult": "Spike-o-pult",
    "BuccaneerLongRange": "LongRange",
    "BuccaneerGrapeShot": "GrapeShot",
    "BuccaneerCrowsNest": "CrowsNest",
    "BuccaneerHotShot": "HotShot",
    "BuccaneerCarrierFlagship": "CarrierFlagship",
    "BuccaneerCannonShip": "CannonShip",
    "BuccaneerMerchantman": "Merchantman",
    "BuccaneerFavoredTrades": "FavoredTrades",
    "BuccaneerAircraftCarrier": "AircraftCarrier",
    "BuccaneerDestroyer": "Destroyer",
    "BuccaneerTradeEmpire": "TradeEmpire",
    "BuccaneerPirateLord": "PirateLord",
    "BuccaneerMonkeyPirates": "MonkeyPirates",
    "HeattippedDarts": "HeatTippedDart",
    "BioncBoomerang": "BionicBoomerang",
    "LargeCalibre": "LongCalibre",
    "LaserBlasts": "LaserBlast",
    "GuidedMagic": "GuildedMagic",
    "MortarRapidReload": "RapidReload",
    "SupplyDrop": "CashDrop",
    "PlasmaBlasts": "PlasmaBlast",
    "XXXLTrap": "XXXL",
    "OversizeNails": "OversizedNails",
    "CenteredPath": "FlightOrders",
    "Shockwave": "ShellShock",
    "Monkeyopolis": "Metropolis",
    "Spectre": "Specter",
    "TrueSunGod": "TrueSonGod",
    "HydraRocketPods": "HydraRockets",
    "DartMonkeyParagon": "ApexPlasmaMaster",
    "BoomerangMonkeyParagon": "GlaiveDominus",
    "NinjaMonkeyParagon": "AscendedShadow",
    "EngineerMonkeyParagon": "MasterBuilder",
    "WizardMonkeyParagon": "MagusPerfectus",
    "MonkeyAceParagon": "GoliathDoomship",
    "MonkeyBuccaneerParagon": "NavarchOfTheSeas",
    "MonkeySubParagon": "NauticSiegeCore",
    "SmartSpikes": "DirectedSpikes",
    "TackShooterParagon": "CycloneOfFireAndMetal"
}

let locJSONOverrides = {
    "Directed Spikes": "Smart Spikes",
    "Directed Spikes Description": "Smart Spikes Description",
    "CircusGwendolinSkinName": "HarlegwenGwendolinSkinName",
    "CircusGwendolinSkinDescription": "HarlegwenGwendolinSkinDescription",
    "OctoJonesSkinName": "OctoJonesStrikerJonesSkinName",
    "OctoJonesSkinDescription": "OctoJonesStrikerJonesSkinDescription",
    "MoltenObynSkinName": "ObynMountainGuardianSkinName",
    "MoltenObynSkinDescription": "ObynMountainGuardianSkinDescription",
    "SushiBentoSkinName": "SushiBentoBenjaminSkinName",
    "SushiBentoSkinDescription": "SushiBentoBenjaminSkinDescription",
    "KaijuPatSkinName": "KaijuPatFustySkinName",
    "KaijuPatSkinDescription": "KaijuPatFustySkinDescription",
    "GalaxiliSkinName": "GalaxiliEziliSkinName",
    "GalaxiliSkinDescription": "GalaxiliEziliSkinDescription",
    "VoidoraSkinName": "VoidoraAdoraSkinName",
    "VoidoraSkinDescription": "VoidoraAdoraSkinDescription",
    "VikingSaudaSkinName": "VikingSaudaSaudaSkinName",
    "VikingSaudaSkinDescription": "VikingSaudaSaudaSkinDescription",
    "JiangshiSaudaSkinName": "JiangshiSaudaSaudaSkinName",
    "JiangshiSaudaSkinDescription": "JiangshiSaudaSaudaSkinDescription",
    "DreadPirateBrickellSkinName": "DreadPirateBrickellAdmiralBrickellSkinName",
    "DreadPirateBrickellSkinDescription": "DreadPirateBrickellAdmiralBrickellSkinDescription",
    "LifeguardBrickellSkinName": "LifeguardBrickellAdmiralBrickellSkinName",
    "LifeguardBrickellSkinDescription": "LifeguardBrickellAdmiralBrickellSkinDescription",
    "PsimbalsSkinName": "PsimbalsPsiSkinName",
    "PsimbalsSkinDescription": "PsimbalsPsiSkinDescription",
    "GeraldoGentlemanGadgeteerSkinName": "GentlemonkeyGadgeteerGeraldoSkinName",
    "GeraldoGentlemanGadgeteerSkinDescription": "GentlemonkeyGadgeteerGeraldoSkinDescription",
    "Mode Easy": "Easy",
    "Mode Medium": "Medium",
    "Mode Hard": "Hard",
    "Mode Impoppable": "Impoppable",
    "Mode Sandbox": "Sandbox",
    "RosaliaTinkerfairySkinName": "TinkerfairyRosaliaSkinName",
    "RosaliaTinkerfairySkinDescription": "TinkerfairyRosaliaSkinDescription",
    "AdoraSheRaSkinDescription": "SheRaAdoraSkinDescription",
    "AdoraSheRaSkinName": "SheRaSkinName"
}

let medalMap = {
    "Easy": "Bronze",
    "PrimaryOnly": "Bronze01",
    "Deflation": "Bronze02",
    "Medium": "Silver",
    "MilitaryOnly": "Silver01",
    "Apopalypse": "Silver03",
    "Reverse": "Silver02",
    "Hard": "Gold",
    "MagicOnly": "Gold01",
    "DoubleMoabHealth": "Gold03",
    "HalfCash": "Gold04",
    "AlternateBloonsRounds": "Gold02",
    "Impoppable": "Impoppable",
    "Clicks": "ImpoppableRuby",
    "CHIMPS-BLACK": "ImpoppableHematite"
}

let saveSkintoSkinMap = {
    "Scientist Gwendolin": "ScientistGwendolin",
    "Biker Bones": "BikerBones",
    "Sentai Captain Churchill": "SentaiCaptainChurchill",
    "Cyber Quincy": "Cyber Quincy",
    "Octo Jones": "OctoJones",
    "Sleigh Captain Churchill": "SleighCaptainChurchill",
    "Wolfpack Quincy": "WolfpackQuincy",
    "ScientistGwendolin": "Scientist Gwendolin",
    "BikerBones": "Biker Bones",
    "SentaiCaptainChurchill": "Sentai Captain Churchill",
    "CyberQuincy": "Cyber Quincy",
    "OctoJones": "Octo Jones",
    "SleighCaptainChurchill": "Sleigh Captain Churchill",
    "WolfpackQuincy": "Wolfpack Quincy"
}

let trophyStoreKeyFixes = {
    "HeroesQuincyCyberQuincyPlacementFireworks": "H-CyberQuincyPlacementFireworks",
    "HeroesChurchillPlacementTankDrop": "H-ChurchillPlacementTankDrop",
    "HeroesBenjamminDJSkinPlacementPartyLights": "H-BenDJSkinPlacementPartyLights",
    "HeroesStrikerJonesPlacementParadrop": "H-StrikerJonesPlacementParadrop",
    "GameUIUpgradesDisplayNamedMonkeys": "GameUIUpgradesNamedMonkeys",
    "GameUIMusicTrackMusicTitleFiestaMix": "UIMusic-TitleFiestaMix",
    "GameUIMusicTrackMusicSunshineGameboyMix": "UIMusic-SunshineGameboyMix",
    "GameUIMusicTrackMusicTropicalComplextroMix": "UIMusic-TropicalComplextroMix",
    "BloonsAllBloonsPopsBarrelOfMonkeys": "BloonsAll-PopsBarrelOfMonkeys",
    "CoopEmoteAnimationSparklingHearts": "CE-AnimationSparklingHearts",
    "GameUIMusicTrackMusicSunsetSilentNightMix": "UIMusic-SunsetSilentNightMix",
    "TowerProjectileBombshooterPumpkin": "TP-BombshooterPumpkin",
    "TowerProjectileBananaFarmCandyCorn": "TP-BananaFarmCandyCorn",
    "TowerEffectAllMonkeysPlacementUpgradesGhosts": "TEAMPU-Ghosts",
    "GameUIPowerSkinSuperVampireStorm": "PSkin-SuperVampireStorm",
    "GameUIMusicTrackMusicFiestaSynthwaveMix": "UIMusic-FiestaSynthwaveMix",
    // Unused "CoopEmoteTextRound100": null,
    "TowerEffectAllMonkeysPlacementUpgradesPresents": "TEAMPU-Presents",
    "TowerProjectileBoomerangCandyCane": "TP-BoomerangCandyCane",
    "GameUIMusicTrackMusicJingleBloons": "UIMusic-JingleBloons",
    "TowerProjectileSpikeFactoryPineapples": "TP-SpikeFactoryPineapples",
    "GameUIMusicTrackMusicBMCStreetParty": "UIMusic-BMCStreetParty",
    "TowerProjectileDartlingEasterEggs": "TP-DartlingEasterEggs",
    "CoopEmoteAnimationPixelMonkeyDance": "CE-AnimationPixelMonkeyDance",
    "HeroesPatFustyPlacementSuperjump": "H-PatFustyPlacementSuperjump",
    "TowerPropMonkeyVillageBrazilFlag": "TProp-VillageBrazilFlag",
    "TowerPropMonkeyVillageScotlandFlag": "TProp-VillageScotlandFlag",
    "TowerPropMonkeyVillageBananaFlag": "TProp-VillageBananaFlag",
    "TowerEffectAllMonkeysPlacementUpgradesFireworks": "TEAMPU-Fireworks",
    "TowerProjectileWizardMonkeyFireworks": "TP-WizardMonkeyFireworks",
    "GameUIPowerSkinMonkeyBoostFireworks": "PSkin-MonkeyBoostFireworks",
    "GameUIMusicTrackMusicTropicalOctopusMix": "UIMusic-TropicalOctopusMix",
    "HeroesGwendolinPlacementFireball": "H-GwendolinPlacementFireball",
    "TowerPropMonkeyVillageGermanyFlag": "TProp-VillageGermanyFlag",
    "TowerEffectAllMonkeysPlacementUpgradesButterflies": "TEAMPU-Butterflies",
    "HeroesChurchillSentaiSkinPetDrone": "H-ChurchillSentaiSkinPetDrone",
    "TowerEffectAllMonkeysPlacementUpgradesBats": "TEAMPU-Bats",
    "TowerProjectileEngineerVampireHunter": "TP-EngineerVampireHunter",
    "TowerPropMonkeyVillageCanadianFlag": "TProp-VillageCanadianFlag",
    "TowerPropMonkeyVillageAustralianFlag": "TProp-VillageAustralianFlag",
    "CoopEmoteAnimationBikerBonesRage": "H-BikerBonesPlacementHellrift",
    "GameUIPowerSkinEnergisingTotemChristmasTree": "PSkin-EnergisingTotemXmasTree",
    "GameUIMusicTrackMusicWinterChilledMix": "UIMusic-WinterChilledMix",
    "HeroesStrikerJonesPetGermanShepherd": "H-StrikerJonesPetGermanShepherd",
    "CoopEmoteAnimationThinkingMonkey": "CE-AnimationThinkingMonkey",
    "GameUIPowerSkinRoadSpikesFlowerPatch": "PSkin-RoadSpikesFlowerPatch",
    "GameUIPowerSkinMonkeyBoostSugarRush": "PSkin-MonkeyBoostSugarRush",
    "GameUIMusicTrackMusicSunshineFiestaMix": "UIMusic-SunshineFiestaMix",
    "GameUIMusicTrackMusicTribesJaloonMix": "UIMusic-TribesJaloonMix",
    "GameUIPowerSkinGlueTrapHoneyTrap": "PSkin-GlueTrapHoneyTrap",
    "GameUIPowerSkinBananaFarmerBananaCostume": "PSkin-BananaFarmerBananaCostume",
    "TowerProjectileBananaFarmPresents": "TP-BananaFarmPresents",
    "TowerProjectileTackShooterIcicles": "TP-TackShooterIcicles",
    "TowerProjectileDartMonkeySnowballs": "TP-DartMonkeySnowballs",
    "TowerProjectileNinjaMonkeySnowflakes": "TP-NinjaMonkeySnowflakes",
    "HeroesStrikerJonesBikerBonesPlacementHellrift": "H-BikerBonesPlacementHellrift",
    "TowerProjectileSniperMonkeyConfetti": "BloonsAllBloonsPopsConfetti",
    "TowerProjectileAlchemistSpringFlowers": "TP-AlchemistSpringFlowers",
    "TowerPropMonkeyVillageSwedenFlag": "TProp-VillageSwedenFlag",
    "HeroesQuincyPlacementSpecialForces": "H-QuincyPlacementSpecialForces",
    "GameUIMusicTrackMusicSunset64Mix": "UIMusic-Sunset64Mix",
    "GameUIMusicTrackMusicFiestaHeliumHeightsMix": "UIMusic-FiestaHeliumHeightsMix",
    "GameUIPowerSkinCamoTrapSprinkler": "PSkin-CamoTrapSprinkler",
    "GameUIMusicTrackMusicTribesFunkedMix": "UIMusic-TribesFunkedMix",
    "GameUIMusicTrackMusicTropicalClassyBrassMix": "UIMusic-TropicalClassyBrassMix",
    "GameUIMusicTrackMusicWinterTonkMix": "UIMusic-WinterTonkMix",
    "HeroesAdmiralBrickellPlacementAerialDeployment": "H-BrickellPlacementAerialDep",
    "TowerProjectileDartMonkeyPumpkins": "TP-DartMonkeyPumpkins",
    "TowerProjectileMonkeyBuccaneerFlavouredTrades": "TP-BuccaneerFlavouredTrades"
}

let knownProblematicMaps = ["ZMYVERW", "ZMYUWTV", "ZMYUDTK", "ZMYVPGA", "ZMYVPFH", "ZMYWHPC"]

function getTowerAssetPath(towerType, upgrade) {
    return towerType == "WizardMonkey" ? `Assets/TowerIcon/${upgrade}-Wizard.png` : `Assets/TowerIcon/${upgrade}-${towerType}.png`;
}

function getInstaContainerIcon(towerType, upgrade) {
    return  towerType == "WizardMonkey" ? `Assets/UI/InstaContainer/${upgrade}-Wizard.png` : `Assets/UI/InstaContainer/${upgrade}-${towerType}.png`;
}

function getInstaMonkeyIcon(towerType, upgrade) {
    let instaTiers = Math.max(upgrade[0], upgrade[1], upgrade[2]);
    switch(Math.max(upgrade[0], upgrade[1], upgrade[2])) {
        case parseInt(upgrade[0]):
            instaTiers = `${instaTiers}00`;
            break;
        case parseInt(upgrade[1]):
            instaTiers = `0${instaTiers}0`;
            break;
        case parseInt(upgrade[2]):
            instaTiers = `00${instaTiers}`;
            break;
    }
    return towerType == "WizardMonkey" ? `Assets/InstaMonkeyIcon/${instaTiers}-WizardInsta.png` : `Assets/InstaMonkeyIcon/${instaTiers}-${towerType}Insta.png`;
}

function getUpgradeAssetPath(upgrade) {
    upgrade = upgrade.replace(/[^a-zA-Z0-9]/g, "");
    return upgradeNameFixMap[upgrade] ? `Assets/UpgradeIcon/${upgradeNameFixMap[upgrade]}UpgradeIcon.png` : `Assets/UpgradeIcon/${upgrade}UpgradeIcon.png`;
}

function getKnowledgeAssetPath(knowledge) {
    return knowledge == "SubAdmiral" ? `Assets/KnowledgeIcon/NavalUpgradesIcon.png` : `Assets/KnowledgeIcon/${knowledge}Icon.png`;
}

function getHeroPortrait(hero, level) {
    return level == 1 ?  `Assets/Portrait/${hero}Portrait.png` : `Assets/Portrait/${hero}PortraitLvl${level}.png`;
}

function getHeroSquareIcon(hero) {
    hero = skinNameFixMap[hero] || hero
    return `Assets/HeroIconSquare/HeroIcon${hero}.png`;
}

function getHeroIconCircle(hero) {
    hero = skinNameFixMap[hero] || hero
    return `Assets/HeroIconCircle/HeroIcon${hero}.png`;
}

function getSkinAssetPath(skin, level) {
    skin = skinNameFixMap[skin] || skin;
    return level == 1 ? `Assets/Portrait/${skin}Portrait.png` : `Assets/Portrait/${skin}PortraitLvl${level}.png`;
}

function getMapIcon(map) {
    return map == "#ouch" ? `Assets/MapIcon/MapSelectouchButton.png` : `Assets/MapIcon/MapSelect${map}Button.png`;
}

function getPowerIcon(power){
    return `Assets/PowerIcon/${power}Icon.png`;
}

function getAchievementIcon(achievement, hidden){
    return hidden ? `Assets/AchievementIcon/HiddenIcon.png` : `Assets/AchievementIcon/${achievement}Icon.png`;
}

function fixAchievementName(name){
    return achievementNameFixMap[name] || name;
}

function getMedalIcon(medal){
    return `Assets/MedalIcon/${medal}.png`;
}

function getModeIcon(mode){
    return `Assets/ModeIcon/${mode}Btn.png`;
}

function getRewardIcon(rewardData){
    switch(rewardData.type){
        case "MonkeyMoney":
            return `Assets/UI/BloonjaminsIcon.png`;
        case "Power":
            return getPowerIcon(rewardData.power);
        case "InstaMonkey":
            return getInstaMonkeyIcon(rewardData.tower, rewardData.tiers);
        case "KnowledgePoints":
            return `Assets/UI/KnowledgeIcon.png`;
        case "RandomInstaMonkey":
            return `Assets/UI/InstaRandomTier${rewardData.tier == 0 ? 1 : rewardData.tier}.png`;
        case "Trophy":
            return `Assets/UI/TrophyIcon.png`;
        default:
            return `Assets/UI/${rewardData.value}Icon.png`;
    }
}

function getProfileIcon(profile){
    return `Assets/ProfileAvatar/${profile}.png`;
}

function getProfileAvatar(profileData) {
    if(profileData.avatar == 0) return "Assets/ProfileAvatar/ProfileAvatar01.png";
    let avatarIndex = parseInt(profileData.avatar.replace(/\D/g,''));
    if (profileData.avatar == "" || isNaN(avatarIndex)) return "Assets/ProfileAvatar/ProfileAvatar01.png";
    return (avatarIndex <= constants.profileAvatars) ? `Assets/ProfileAvatar/${profileData.avatar}.png` : profileData.avatarURL
}

function getProfileBanner(profileData) {
    if(profileData.banner == 0) return "Assets/ProfileBanner/TeamsBannerDeafult.png";
    let bannerIndex = parseInt(profileData.banner.replace(/\D/g,''));
    if (profileData.banner == "" || isNaN(bannerIndex)) return "Assets/ProfileBanner/TeamsBannerDeafult.png";
    return (bannerIndex <= constants.profileBanners) ? `Assets/ProfileBanner/${profileData.banner}.png` : profileData.bannerURL
}

function getCustomMapIcon(id) {
    return knownProblematicMaps.includes(id) ? `Assets/CustomMapIcon/${id}.jpg` : `https://data.ninjakiwi.com/btd6/maps/map/${id}/preview`;
}

function getLocValue(key){
    if(locJSONOverrides[key]) return locJSON[locJSONOverrides[key]];
    return locJSON[key] ? locJSON[key] : key;
}

function getCollectionEventSkinIcon(skin) {
    switch(skin) {
        case "totem":
            return "CollectingEventTotemBtn";
        case "fireworks":
            return "CollectingEventFireworksBtn";
        case "halloween":
            return "CollectingEventHalloweenBtn";
    }
}