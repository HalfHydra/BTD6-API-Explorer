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

const skinNameFixMap = {
    "ObynOceanGuardian": "OceanObyn",
    "MoltenObyn": "MountainObyn",
    "JoanOfArcAdora": "JoanOfArc",
    "CyberQuincy": "QuincyCyber",
    "ETnEtienne": "ETn",
    "SentaiCaptainChurchill": "SentaiChurchill",
    "SleighCaptainChurchill": "SleighChurchill"
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
    "SmartSpikes": "DirectedSpikes"
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

function getTowerAssetPath(towerType, upgrade) {
    return towerType == "WizardMonkey" ? `Assets/TowerIcon/${upgrade}-Wizard.png` : `Assets/TowerIcon/${upgrade}-${towerType}.png`;
}

function getInstaContainerIcon(towerType, upgrade) {
    return  towerType == "WizardMonkey" ? `Assets/UI/InstaContainer/${upgrade}-Wizard.png` : `Assets/UI/InstaContainer/${upgrade}-${towerType}.png`;
}

function getInstaMonkeyIcon(towerType, upgrade) {
    return `Assets/InstaMonkeyIcon/${upgrade}-${towerType}Insta.png`;
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
    return `Assets/HeroIconSquare/HeroIcon${hero}.png`;
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

function getLocValue(key){
    if(key == "Directed Spikes") return "Smart Spikes";
    if(key == "Directed Spikes Description") return "Smart Spikes Description";
    return locJSON[key];
}