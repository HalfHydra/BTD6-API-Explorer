let debugRank = document.createElement('div');
debugRank.id = 'debug-rank';
debugRank.classList.add('debug-rank');
document.body.appendChild(debugRank);

document.body.appendChild(generateRank());
setInterval(() => {
    btd6usersave["xp"] = tempXP;
    tempXP += 1000;
    generateRankInfo();
    debugRank.innerHTML = '';
    debugRank.appendChild(generateRank());
}, 100);