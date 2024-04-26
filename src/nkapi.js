let oak_token = ""

let btd6usersave = {};
let _btd6usersave = {}; // the model

getSaveData(oak_token)

async function getSaveData(oak_token) {
    // let res = await fetch(`https://data.ninjakiwi.com/btd6/save/${oak_token}`);
    let res = await fetch(`./data/PreventAPISpam.txt`);
    try {
        let json = await res.json();
        console.log(json)
        btd6usersave = json["body"]
        _btd6usersave = json["model"]
    } catch (e) {
        return `Something went wrong with the request. Response Code: ${res.status} [${e}]`;
    }
}