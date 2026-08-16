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

let heroDescKeyOverrides = {
    "DanDMonkeHeMan": "HeMan"
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
    "Cyber Quincy": "CyberQuincy",
    "Octo Jones": "OctoJones",
    "Sleigh Captain Churchill": "SleighCaptainChurchill",
    "Wolfpack Quincy": "WolfpackQuincy",
    "ScientistGwendolin": "Scientist Gwendolin",
    "BikerBones": "Biker Bones",
    "SentaiCaptainChurchill": "Sentai Captain Churchill",
    "CyberQuincy": "Cyber Quincy",
    "OctoJones": "Octo Jones",
    "SleighCaptainChurchill": "Sleigh Captain Churchill",
    "WolfpackQuincy": "Wolfpack Quincy",
}

let saveSkinToSkinMapReversed = Object.entries(saveSkintoSkinMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});

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

let knowledgeSprites = [
    {"name":"4And4Icon","x":0,"y":0,"width":300,"height":300},
    {"name":"AbilityDisciplineIcon","x":0,"y":301,"width":300,"height":300},
    {"name":"AbilityMasteryIcon","x":301,"y":0,"width":300,"height":300},
    {"name":"AcceleratedAerodartsIcon","x":301,"y":301,"width":300,"height":300},
    {"name":"AcidStabilityIcon","x":0,"y":602,"width":300,"height":300},
    {"name":"AdvancedLogisticsIcon","x":301,"y":602,"width":300,"height":300},
    {"name":"AeronauticSubsidyIcon","x":602,"y":0,"width":300,"height":300},
    {"name":"AirforceUpgradesIcon","x":602,"y":301,"width":300,"height":300},
    {"name":"AmbushTechIcon","x":602,"y":602,"width":300,"height":300},
    {"name":"ArcaneImpaleIcon","x":0,"y":903,"width":300,"height":300},
    {"name":"AviationGradeGlueIcon","x":301,"y":903,"width":300,"height":300},
    {"name":"BackroomDealsIcon","x":602,"y":903,"width":300,"height":300},
    {"name":"BankDepositsIcon","x":903,"y":0,"width":300,"height":300},
    {"name":"BeneathTheWavesIcon","x":903,"y":301,"width":300,"height":300},
    {"name":"BetterSellDealsIcon","x":903,"y":602,"width":300,"height":300},
    {"name":"BigBloonBlueprintsIcon","x":903,"y":903,"width":300,"height":300},
    {"name":"BigBloonSabotageIcon","x":0,"y":1204,"width":300,"height":300},
    {"name":"BigBunchIcon","x":301,"y":1204,"width":300,"height":300},
    {"name":"BigCryoBlastIcon","x":602,"y":1204,"width":300,"height":300},
    {"name":"BiggerBanksIcon","x":903,"y":1204,"width":300,"height":300},
    {"name":"BiggerCamoTrapIcon","x":1204,"y":0,"width":300,"height":300},
    {"name":"BigInfernoIcon","x":1204,"y":301,"width":300,"height":300},
    {"name":"BigTrapsIcon","x":1204,"y":602,"width":300,"height":300},
    {"name":"BionicAugmentationIcon","x":1204,"y":903,"width":300,"height":300},
    {"name":"BonusGlueGunnerIcon","x":1204,"y":1204,"width":300,"height":300},
    {"name":"BonusMonkeyIcon","x":0,"y":1505,"width":300,"height":300},
    {"name":"BreakingBallisticIcon","x":301,"y":1505,"width":300,"height":300},
    {"name":"BroadBladeDartlingsIcon","x":602,"y":1505,"width":300,"height":300},
    {"name":"BudgetBatteryIcon","x":903,"y":1505,"width":300,"height":300},
    {"name":"BudgetCashDropsIcon","x":1204,"y":1505,"width":300,"height":300},
    {"name":"BudgetClustersIcon","x":1505,"y":0,"width":300,"height":300},
    {"name":"BudgetPontoonsIcon","x":1505,"y":301,"width":300,"height":300},
    {"name":"CeramicShockIcon","x":1505,"y":602,"width":300,"height":300},
    {"name":"ChargedChinooksIcon","x":1505,"y":903,"width":300,"height":300},
    {"name":"CheaperDoublesIcon","x":1505,"y":1204,"width":300,"height":300},
    {"name":"CheaperLakesIcon","x":1505,"y":1505,"width":300,"height":300},
    {"name":"CheaperMaimingIcon","x":0,"y":1806,"width":300,"height":300},
    {"name":"CheaperSolutionIcon","x":301,"y":1806,"width":300,"height":300},
    {"name":"FocusedPlasmaIcon","x":602,"y":1806,"width":300,"height":300},
    {"name":"CheapRangsIcon","x":903,"y":1806,"width":300,"height":300},
    {"name":"ColdFrontIcon","x":1204,"y":1806,"width":300,"height":300},
    {"name":"ComeOnEverybodyIcon","x":1505,"y":1806,"width":300,"height":300},
    {"name":"CrossbowReachIcon","x":1806,"y":0,"width":300,"height":300},
    {"name":"CrossTheStreamsIcon","x":1806,"y":301,"width":300,"height":300},
    {"name":"DeadlyTranquilityIcon","x":1806,"y":602,"width":300,"height":300},
    {"name":"DiversionTacticsIcon","x":1806,"y":903,"width":300,"height":300},
    {"name":"DoorGunnerIcon","x":1806,"y":1204,"width":300,"height":300},
    {"name":"EliteMilitaryTrainingIcon","x":1806,"y":1505,"width":300,"height":300},
    {"name":"EliteTutorsIcon","x":1806,"y":1806,"width":300,"height":300},
    {"name":"LongGraduationIcon","x":0,"y":2107,"width":300,"height":300},
    {"name":"EmergencyUnlockIcon","x":301,"y":2107,"width":300,"height":300},
    {"name":"EmpoweredHeroesIcon","x":602,"y":2107,"width":300,"height":300},
    {"name":"ExtraBounceIcon","x":903,"y":2107,"width":300,"height":300},
    {"name":"ExtraBurnyStuffIcon","x":1204,"y":2107,"width":300,"height":300},
    {"name":"ExtraDartPopsIcon","x":1505,"y":2107,"width":300,"height":300},
    {"name":"FarmSubsidyIcon","x":1806,"y":2107,"width":300,"height":300},
    {"name":"FasterTakedownsIcon","x":2107,"y":0,"width":300,"height":300},
    {"name":"FastGlueIcon","x":2107,"y":301,"width":300,"height":300},
    {"name":"FastTackAttacksIcon","x":2107,"y":602,"width":300,"height":300},
    {"name":"FirstLastLineOfDefenseIcon","x":2107,"y":903,"width":300,"height":300},
    {"name":"FitFarmersIcon","x":2107,"y":1204,"width":300,"height":300},
    {"name":"FlameJetIcon","x":2107,"y":1505,"width":300,"height":300},
    {"name":"FlankingManeuversIcon","x":2107,"y":1806,"width":300,"height":300},
    {"name":"FlatPackBuildingsIcon","x":2107,"y":2107,"width":300,"height":300},
    {"name":"ForceVsForceIcon","x":0,"y":2408,"width":300,"height":300},
    {"name":"FraggyFragsIcon","x":301,"y":2408,"width":300,"height":300},
    {"name":"GlobalAbilityCooldownsIcon","x":602,"y":2408,"width":300,"height":300},
    {"name":"GorgonStormIcon","x":903,"y":2408,"width":300,"height":300},
    {"name":"GrandPrixSpreeIcon","x":1204,"y":2408,"width":300,"height":300},
    {"name":"GunCoolantIcon","x":1505,"y":2408,"width":300,"height":300},
    {"name":"HardPressIcon","x":1806,"y":2408,"width":300,"height":300},
    {"name":"HardTacksIcon","x":2107,"y":2408,"width":300,"height":300},
    {"name":"HealthyBananasIcon","x":2408,"y":0,"width":300,"height":300},
    {"name":"HeavyKnockbackIcon","x":2408,"y":301,"width":300,"height":300},
    {"name":"HeroFavorsIcon","x":2408,"y":602,"width":300,"height":300},
    {"name":"HeroicReachIcon","x":2408,"y":903,"width":300,"height":300},
    {"name":"HeroicVelocityIcon","x":2408,"y":1204,"width":300,"height":300},
    {"name":"HiValueMinesIcon","x":2408,"y":1505,"width":300,"height":300},
    {"name":"HotMagicIcon","x":2408,"y":1806,"width":300,"height":300},
    {"name":"HypothermiaIcon","x":2408,"y":2107,"width":300,"height":300},
    {"name":"IcyChillIcon","x":2408,"y":2408,"width":300,"height":300},
    {"name":"IncreasedLifespanIcon","x":0,"y":2709,"width":300,"height":300},
    {"name":"InlandRevenueStreamsIcon","x":301,"y":2709,"width":300,"height":300},
    {"name":"InsiderTradesIcon","x":602,"y":2709,"width":300,"height":300},
    {"name":"JustOneMoreIcon","x":903,"y":2709,"width":300,"height":300},
    {"name":"LingeringMagicIcon","x":1204,"y":2709,"width":300,"height":300},
    {"name":"LongerBoostsIcon","x":1505,"y":2709,"width":300,"height":300},
    {"name":"LongerDartTimeIcon","x":1806,"y":2709,"width":300,"height":300},
    {"name":"LongTurboIcon","x":2107,"y":2709,"width":300,"height":300},
    {"name":"MagicTricksIcon","x":2408,"y":2709,"width":300,"height":300},
    {"name":"ManaShieldIcon","x":2709,"y":0,"width":300,"height":300},
    {"name":"MasterDefenderIcon","x":2709,"y":301,"width":300,"height":300},
    {"name":"MoreBuckshotIcon","x":2709,"y":602,"width":300,"height":300},
    {"name":"MasterDoubleCrossIcon","x":2709,"y":903,"width":300,"height":300},
    {"name":"MaulingMoabMinesIcon","x":2709,"y":1204,"width":300,"height":300},
    {"name":"MegaMaulerIcon","x":2709,"y":1505,"width":300,"height":300},
    {"name":"MilitaryConscriptionIcon","x":2709,"y":1806,"width":300,"height":300},
    {"name":"MoMonkeyMoneyIcon","x":2709,"y":2107,"width":300,"height":300},
    {"name":"MonkeyEducationIcon","x":2709,"y":2408,"width":300,"height":300},
    {"name":"MonkeysTogetherStrongIcon","x":2709,"y":2709,"width":300,"height":300},
    {"name":"MoreCashIcon","x":0,"y":3010,"width":300,"height":300},
    {"name":"MoreSplattyGlueIcon","x":301,"y":3010,"width":300,"height":300},
    {"name":"MoreSplodyIcon","x":602,"y":3010,"width":300,"height":300},
    {"name":"MoreValuableBananasIcon","x":903,"y":3010,"width":300,"height":300},
    {"name":"NavalUpgradesIcon","x":1204,"y":3010,"width":300,"height":300},
    {"name":"OneMoreSpikeIcon","x":1505,"y":3010,"width":300,"height":300},
    {"name":"PaintStripperIcon","x":1806,"y":3010,"width":300,"height":300},
    {"name":"ParagonOfPowerIcon","x":2107,"y":3010,"width":300,"height":300},
    {"name":"PoppyBladesIcon","x":2408,"y":3010,"width":300,"height":300},
    {"name":"PowerfulMonkeyStormIcon","x":2709,"y":3010,"width":300,"height":300},
    {"name":"PreGamePrepIcon","x":3010,"y":0,"width":300,"height":300},
    {"name":"QuadBurstIcon","x":3010,"y":301,"width":300,"height":300},
    {"name":"QuickHandsIcon","x":3010,"y":602,"width":300,"height":300},
    {"name":"RapidRazorsIcon","x":3010,"y":903,"width":300,"height":300},
    {"name":"RecurringRangsIcon","x":3010,"y":1204,"width":300,"height":300},
    {"name":"ScholarshipsIcon","x":3010,"y":1505,"width":300,"height":300},
    {"name":"SelfTaughtHeroesIcon","x":3010,"y":1806,"width":300,"height":300},
    {"name":"SoColdIcon","x":3010,"y":2107,"width":300,"height":300},
    {"name":"SpeedyBrewingIcon","x":3010,"y":2408,"width":300,"height":300},
    {"name":"StrikeDownTheFalseIcon","x":3010,"y":2709,"width":300,"height":300},
    {"name":"StrongTonicIcon","x":3010,"y":3010,"width":300,"height":300},
    {"name":"SupaThriveIcon","x":0,"y":3311,"width":300,"height":300},
    {"name":"SuperRangeIcon","x":301,"y":3311,"width":300,"height":300},
    {"name":"SupersizeGlueTrapIcon","x":602,"y":3311,"width":300,"height":300},
    {"name":"TargetedPineapplesIcon","x":903,"y":3311,"width":300,"height":300},
    {"name":"ThereCanBeOnlyOneIcon","x":1204,"y":3311,"width":300,"height":300},
    {"name":"ThickerFoamsIcon","x":1505,"y":3311,"width":300,"height":300},
    {"name":"TinyTornadoesIcon","x":1806,"y":3311,"width":300,"height":300},
    {"name":"ToArmsIcon","x":2107,"y":3311,"width":300,"height":300},
    {"name":"TradeAgreementsIcon","x":2408,"y":3311,"width":300,"height":300},
    {"name":"VeryShreddyIcon","x":2709,"y":3311,"width":300,"height":300},
    {"name":"VeteranMonkeyTrainingIcon","x":3010,"y":3311,"width":300,"height":300},
    {"name":"VigilantSentriesIcon","x":3311,"y":0,"width":300,"height":300},
    {"name":"VineRuptureIcon","x":3311,"y":301,"width":300,"height":300},
    {"name":"ViolentImpactIcon","x":3311,"y":602,"width":300,"height":300},
    {"name":"WarmOakIcon","x":3311,"y":903,"width":300,"height":300},
    {"name":"WeakPointIcon","x":3311,"y":1204,"width":300,"height":300},
    {"name":"WingmonkeyIcon","x":3311,"y":1505,"width":300,"height":300},
    {"name":"XrayUltraIcon","x":3311,"y":1806,"width":300,"height":300}
]

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

function getKnowledgeSprite(knowledge) {
    return knowledgeSprites.find(sprite => sprite.name === (knowledge === "SubAdmiral" ? "NavalUpgradesIcon" : `${knowledge}Icon`));
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
    if (constants.mapsInOrder[map] === undefined) {
        return `Assets/MapIcon/MapLoadingImage.png`;
    }
    return map == "#ouch" ? `Assets/MapIcon/MapSelectouchButton.png` : `Assets/MapIcon/MapSelect${map}Button.png`;
}

function getPowerIcon(power){
    return `Assets/PowerIcon/${power}Icon.png`;
}

function getAchievementIcon(achievement, hidden){
    return hidden ? `Assets/AchievementIcon/HiddenIcon.png` : `Assets/AchievementIcon/${achievement.trim()}Icon.png`;
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
        case "CollectionEvent":
            return `Assets/UI/EventTotemLootIcon.png`;
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

function getCollectionEventSkinIcon(eventData) {
    if (!eventData || !eventData.start || !eventData.end) {
        return "CollectingEventTotemBtn";
    }

    if (eventData.id && constants && constants.collection.autoSkinOverride.hasOwnProperty(eventData.id)) {
        return constants.collection.autoSkinOverride[eventData.id];
    }

    const startDate = new Date(eventData.start);
    const endDate = new Date(eventData.end);

    const isDateInRange = (month, day) => {
        const checkDate = new Date(startDate.getFullYear(), month - 1, day);
        const checkDateNextYear = new Date(startDate.getFullYear() + 1, month - 1, day);
        return (checkDate >= startDate && checkDate <= endDate) || 
               (checkDateNextYear >= startDate && checkDateNextYear <= endDate);
    };

    if (isDateInRange(12, 25)) {
        return "CollectingEventChristmasBtn";
    } else if (isDateInRange(10, 31)) {
        return "CollectingEventHalloweenBtn";
    } else if (isDateInRange(7, 4)) {
        return "CollectingEventFireworksBtn";
    } else if (isDateInRange(4, 5)) {
        return "CollectingEventEasterBtn";
    } else if (isDateInRange(6, 14)) {
        return "CollectingEventPartyTimeBtn";
    } 

    return "CollectingEventTotemBtn";
}