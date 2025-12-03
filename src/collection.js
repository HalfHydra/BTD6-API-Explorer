const TWO64 = 1n << 64n;
const TWO63 = 1n << 63n;
const MOD_PM = 2147483647n;
const MOD_PM_MINUS1_NUM = 2147483646;

function toLong(x) {
  let v = x & (TWO64 - 1n);
  if (v >= TWO63) v -= TWO64;
  return v;
}

function longAbs(x) {
  if (x === -TWO63) return x;
  return x < 0n ? -x : x;
}

function I64(str) {
  let result = 0n;
  for (const c of str) {
    const digit = BigInt(c.charCodeAt(0) - 48);
    result = toLong(toLong(result * 10n) + digit);
  }
  return result;
}

function GetSeedLong(id) {
  let sb = '';
  for (const c of id) sb += c.charCodeAt(0).toString();
  if (sb.length > 18) sb = sb.substring(0, 18);
  const parsed = I64(sb);
  return longAbs(parsed);
}

class SeededRandom {
  constructor(seed) {
    if (seed < 0n) seed = longAbs(seed);
    this.seed = seed;
  }
  Next() {
    this.seed = toLong(this.seed * 16807n);
    this.seed = this.seed % MOD_PM;
    return Number(this.seed);
  }
  NextFloat() {
    return this.Next() / MOD_PM_MINUS1_NUM;
  }
  Range(min, max) {
    if (min === max) return min;
    const span = max - min;
    const r = this.Next() % span;
    return min + r;
  }
}

function ShuffleSeeded(seedLong, inputList) {
  const rng = new SeededRandom(seedLong);
  const list = inputList.slice();
  const length = list.length;
  for (let i = 0; i < length; i++) {
    const j = rng.Range(i, length);
    if (j < 0 || j >= length) continue;
    const tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list;
}

class CollectionEventFeaturedInstasHelper {
  constructor() {
    this.instaMonkeysTypeList = [];
    this.getCurrentPageNumber = () => 0;
  }
  GetPossibleInstaMonkeys() {
    const list = this.instaMonkeysTypeList;
    if (!list || list.length === 0) return [];
    const totalCount = list.length;
    const pageSize = Math.ceil(totalCount * 0.25);
    let currentPage = this.getCurrentPageNumber();
    let outerIndex = 0;
    while (pageSize < currentPage) {
      currentPage -= pageSize;
      outerIndex++;
    }
    const maxItemsPerPage = 4;
    const pageItems = [];
    for (let i = 0; i < maxItemsPerPage; i++) {
      const rotIndex = (i + outerIndex + currentPage * maxItemsPerPage) % totalCount;
      pageItems.push(list[rotIndex]);
    }
    return pageItems;
  }
}

function processCollectionEvent(eventData) {
  const seed = GetSeedLong(eventData.id);

  let secondsPerPage = 28800;

  let maxPages = Math.ceil((eventData.end - eventData.start) / (secondsPerPage * 1000));

  const featuredMonkeyTypes = ["Alchemist","BananaFarm","BombShooter","BoomerangMonkey","DartMonkey","Druid","GlueGunner","HeliPilot","IceMonkey","MonkeyAce","MonkeyBuccaneer","MonkeySub","MonkeyVillage","NinjaMonkey","SniperMonkey","SpikeFactory","SuperMonkey","TackShooter","WizardMonkey","MortarMonkey","EngineerMonkey","DartlingGunner","BeastHandler","Mermonkey","Desperado"]

  const shuffledMonkeyTypes = ShuffleSeeded(seed, featuredMonkeyTypes);

  const helper = new CollectionEventFeaturedInstasHelper();
  helper.instaMonkeysTypeList = shuffledMonkeyTypes;

  const pages = {};
  for (let page = 0; page < maxPages; page++) {
    helper.getCurrentPageNumber = () => page;
    pages[page] = helper.GetPossibleInstaMonkeys();
  }

  return {
    id: eventData.id,
    start: eventData.start,
    end: eventData.end,
    rotations: pages
  };
}