function getTowerAssetPath(towerType, upgrade) {
    if(towerType == "WizardMonkey"){
        towerType = "Wizard"
    }
    return `Assets/TowerIcon/${upgrade}-${towerType}.png`;
}

function getInstaMonkeyIcon(towerType, upgrade) {
    return `Assets/InstaMonkeyIcon/${upgrade}-${towerType}Insta.png`;
}

function getUpgradeAssetPath(upgrade) {
    switch(upgrade) {
        case "Spikeopult":
            upgrade = "Spike-o-pult";
            break;
        case "BuccaneerLongRange":
            upgrade = "LongRange"
            break;
        case "BuccaneerGrapeShot":
            upgrade = "GrapeShot"
            break;
        case "BuccaneerCrowsNest":
            upgrade = "CrowsNest"
            break;
        case "BuccaneerHotShot":
            upgrade = "HotShot"
            break;
        case "BuccaneerCarrierFlagship":
            upgrade = "CarrierFlagship"
            break;
        case "BuccaneerCannonShip":
            upgrade = "CannonShip"
            break;
        case "BuccaneerMerchantman":
            upgrade = "Merchantman"
            break;
        case "BuccaneerFavoredTrades":
            upgrade = "FavoredTrades"
            break;
        case "BuccaneerAircraftCarrier":
            upgrade = "AircraftCarrier"
            break;
        case "BuccaneerDestroyer":
            upgrade = "Destroyer"
            break;
        case "BuccaneerTradeEmpire":
            upgrade = "TradeEmpire"
            break;
        case "BuccaneerPirateLord":
            upgrade = "PirateLord"
            break;
        case "BuccaneerMonkeyPirates":
            upgrade = "MonkeyPirates"
            break;
        case "HeattippedDarts":
            upgrade = "HeatTippedDart"
            break;
        case "BioncBoomerang":
            upgrade = "BionicBoomerang"
            break;
        case "LargeCalibre":
            upgrade = "LongCalibre"
            break;
        case "LaserBlasts":
            upgrade = "LaserBlast"
            break;
        case "GuidedMagic":
            upgrade = "GuildedMagic"
            break;
        case "MortarRapidReload":
            upgrade = "RapidReload"
            break;
        case "SupplyDrop":
            upgrade = "CashDrop"
            break;
        case "PlasmaBlasts":
            upgrade = "PlasmaBlast"
            break;
        case "XXXLTrap":
            upgrade = "XXXL"
            break;
        case "OversizeNails":
            upgrade = "OversizedNails"
            break;
        case "CenteredPath":
            upgrade = "FlightOrders"
            break;
        case "Shockwave":
            upgrade = "ShellShock"
            break;
        case "Monkeyopolis":
            upgrade = "Metropolis"
            break;
        case "Spectre":
            upgrade = "Specter"
            break;
        case "TrueSunGod":
            upgrade = "TrueSonGod"
            break;
        case "HydraRocketPods":
            upgrade = "HydraRockets"
            break;
        case "DartMonkeyParagon":
            upgrade = "ApexPlasmaMaster"
            break;
        case "BoomerangMonkeyParagon":
            upgrade = "GlaiveDominus"
            break;
        case "NinjaMonkeyParagon":
            upgrade = "AscendedShadow"
            break;
        case "EngineerMonkeyParagon":
            upgrade = "MasterBuilder"
            break;
        case "WizardMonkeyParagon":
            upgrade = "MagusPerfectus"
            break;
        case "MonkeyAceParagon":
            upgrade = "GoliathDoomship"
            break;
        case "MonkeyBuccaneerParagon":
            upgrade = "NavarchOfTheSeas"
            break;
        case "MonkeySubParagon":
            upgrade = "NauticSiegeCore"
            break;
    }
    return `Assets/UpgradeIcon/${upgrade}UpgradeIcon.png`;
}

function getKnowledgeAssetPath(knowledge) {
    switch(knowledge) {
        case "SubAdmiral":
            knowledge = "NavalUpgrades"
            break;
    }
    return `Assets/KnowledgeIcon/${knowledge}Icon.png`;
}

function getHeroPortrait(hero, level) {
    if(level == 1) {
        return `Assets/Portrait/${hero}Portrait.png`;
    }
    return `Assets/Portrait/${hero}PortraitLvl${level}.png`;
}

function getSkinAssetPath(skin, level) {
    switch(skin){
        case "ObynOceanGuardian":
            skin = "OceanObyn"
            break;
        case "MoltenObyn":
            skin = "MountainObyn"
            break;
        case "JoanOfArcAdora":
            skin = "JoanOfArc"
            break;
        case "CyberQuincy":
            skin = "QuincyCyber"
            break;
        case "ETnEtienne":
            skin = "ETn"
            break;
        case "SentaiCaptainChurchill":
            skin = "SentaiChurchill"
            break;
        case "SleighCaptainChurchill":
            skin = "SleighChurchill"
            break;
    }
    if(level == 1) {
        return `Assets/Portrait/${skin}Portrait.png`;
    }
    return `Assets/Portrait/${skin}PortraitLvl${level}.png`;
}

function getMapIcon(map) {
    if(map == "#ouch") {
        return `Assets/MapIcon/MapSelectouchButton.png`;
    }
    return `Assets/MapIcon/MapSelect${map}Button.png`;
}

function getPowerIcon(power){
    return `Assets/PowerIcon/${power}Icon.png`;
}

function getAchievementIcon(achievement, hidden){
    if(hidden){
        return `Assets/AchievementIcon/HiddenIcon.png`;
    }
    return `Assets/AchievementIcon/${achievement}Icon.png`;
}

function fixAchievementName(name){
    switch(name){
        case "Clicker":
            return "Bloons Master"
        case "Superior Clicker":
            return "Superior Bloons Master"
        case "Ultimate Clicker":
            return "Ultimate Bloons Master"
        case "Knowledgable Primate":
            return "Knowledgeable Primate"
        case "Triple Threat":
            return "Triple threat"
        case "Small Bloons":
            return "Alchermistman and Bloonacleboy"
        case "Master of Life":
            return "Master of life"
        case "What did it cost":
            return "What did it cost? - Everything"
        case "2 Mega Pops":
            return "2 MegaPops"
        case "Looking fab":
            return "Lookin fab"
        case "GoldenTicket":
            return "Golden Ticket"
        case "Axis of Havok":
            return "Axis of Havoc"
        case "Co-op Popper!":
            return "Co-op Popper"
        case "CouponCrazy":
            return "Coupon Crazy"
        case "LimitedRun":
            return "Limited Run"
        case "ALaCode":
            return "A La Code"
        case "InstantGratification":
            return "Instant Gratification"
        case "Achievement Of Achievements":
            return "Achievement of Achievements"
        case "What is this new Bloonery":
            return "What is this new Bloonery?"
        case "Who's the Boss":
            return "Who's the Boss?"
        case "I'llBeBack":
            return "I'll Be Back"
        case "SoSpiiiceyNinjaKiwi":
            return "So Spiiicey Ninja Kiwi"
        case "DavidsVsGoliath":
            return "Davids vs Goliath"
        case "ToolsToDarwin":
            return "Tools to Darwin"
        case "BigSpender":
            return "Big Spender"
        case "NotLackingCriticalInformation":
            return "Not Lacking Critical Information"
        case "StubbornStrategy":
            return "Stubborn Strategy"
        case "Hook Line And Sinker":
            return "Hook, Line, and Sinker"
        case "CrashOfTheTitans":
            return "Crash of the Titans"
        case "So Shiny":
            return "So Shiny!"
        case "Ultimate Team Up":
            return "Ultimate Team-up"
        case "StudentLoans":
            return "Student Loans"
        case "StickySituation":
            return "Sticky Situation"
        case "NoHarvest":
            return "No Harvest"
        case "ReadyPlayerOne":
            return "Ready Player One?"
        case "TheDailyReid":
            return "The Daily Reid"
        case "InstaCentury":
            return "Insta Century"
        default:
            return name;
    }
}