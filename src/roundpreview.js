// let canvas = null;
// let ctx = null;
// let bloons = [];
// let background = new Image();
// background.src = "../Assets/UI/RoundPreview.png";

let previewInterval;

let bloonsData = {
    "Red": {
        "name": "Red",
        "rbe": 1,
        "speed": 25,
        "layer": 1,
    },
    "Blue": {
        "name": "Blue",
        "rbe": 2,
        "speed": 35,
        "layer": 2
    },
    "Green": {
        "name": "Green",
        "rbe": 3,
        "speed": 45,
        "layer": 3
    },
    "Yellow": {
        "name": "Yellow",
        "rbe": 4,
        "speed": 80,
        "layer": 4
    },
    "Pink": {
        "name": "Pink",
        "rbe": 5,
        "speed": 87.5,
        "layer": 5
    },
    "Black": {
        "name": "Black",
        "rbe": 11,
        "speed": 45,
        "layer": 6
    },
    "Purple": {
        "name": "Purple",
        "rbe": 11,
        "speed": 75,
        "layer": 7
    },
    "White": {
        "name": "White",
        "rbe": 12,
        "speed": 50,
        "layer": 6
    },
    "Lead": {
        "name": "Lead",
        "rbe": 23,
        "speed": 25,
        "layer": 7
    },
    "Zebra": {
        "name": "Zebra",
        "rbe": 23,
        "speed": 45,
        "layer": 7
    },
    "Rainbow": {
        "name": "Rainbow",
        "rbe": 47,
        "speed": 55,
        "layer": 8
    },
    "Ceramic": {
        "name": "Ceramic",
        "rbe": 47,
        "speed": 62.5,
        "layer": 9
    },
    "Moab": {
        "name": "Moab",
        "rbe": 616,
        "speed": 25,
        "layer": 10
    },
    "Bfb": {
        "name": "Bfb",
        "rbe": 3164,
        "speed": 6.25,
        "layer": 11
    },
    "Zomg": {
        "name": "Zomg",
        "rbe": 16656,
        "speed": 4.5,
        "layer": 12
    },
    "Ddt": {
        "name": "Ddt",
        "rbe": 3164,
        "speed": 66,
        "layer": 12
    },
    "Bad": {
        "name": "Bad",
        "rbe": 16464,
        "speed": 4.5,
        "layer": 13
    }
}

let bloons_spritesheet = new Image();
bloons_spritesheet.src = "../Assets/BloonIcon/preview_bloons_spritesheet.png";

let bloonImageMap = {
    "CeramicCamo": {
        "x": 1153,
        "y": 0,
        "width": 129,
        "height": 163
    },
    "CeramicFortified": {
        "x": 993,
        "y": 547,
        "width": 140,
        "height": 163
    },
    "CeramicFortifiedCamo": {
        "x": 993,
        "y": 711,
        "width": 140,
        "height": 163
    },
    "CeramicRegrow": {
        "x": 0,
        "y": 782,
        "width": 176,
        "height": 162
    },
    "CeramicRegrowCamo": {
        "x": 177,
        "y": 782,
        "width": 176,
        "height": 162
    },
    "CeramicRegrowFortified": {
        "x": 629,
        "y": 0,
        "width": 186,
        "height": 162
    },
    "CeramicRegrowFortifiedCamo": {
        "x": 629,
        "y": 163,
        "width": 186,
        "height": 162
    },
    "Black": {
        "x": 1283,
        "y": 790,
        "width": 78,
        "height": 97
    },
    "BlackCamo": {
        "x": 1283,
        "y": 888,
        "width": 78,
        "height": 97
    },
    "BlackRegrow": {
        "x": 833,
        "y": 945,
        "width": 105,
        "height": 97
    },
    "BlackRegrowCamo": {
        "x": 708,
        "y": 782,
        "width": 105,
        "height": 97
    },
    "Blue": {
        "x": 1283,
        "y": 148,
        "width": 110,
        "height": 139
    },
    "BlueCamo": {
        "x": 1283,
        "y": 288,
        "width": 110,
        "height": 139
    },
    "BlueRegrow": {
        "x": 408,
        "y": 641,
        "width": 150,
        "height": 138
    },
    "BlueRegrowCamo": {
        "x": 993,
        "y": 146,
        "width": 150,
        "height": 138
    },
    "Ceramic": {
        "x": 1153,
        "y": 164,
        "width": 129,
        "height": 163
    },
    "LeadFortifiedCamo": {
        "x": 993,
        "y": 875,
        "width": 133,
        "height": 156
    },
    "LeadRegrow": {
        "x": 816,
        "y": 326,
        "width": 168,
        "height": 154
    },
    "LeadRegrowCamo": {
        "x": 816,
        "y": 481,
        "width": 168,
        "height": 154
    },
    "LeadRegrowFortified": {
        "x": 629,
        "y": 326,
        "width": 178,
        "height": 154
    },
    "LeadRegrowFortifiedCamo": {
        "x": 629,
        "y": 481,
        "width": 178,
        "height": 154
    },
    "Green": {
        "x": 878,
        "y": 1100,
        "width": 116,
        "height": 147
    },
    "GreenCamo": {
        "x": 995,
        "y": 1100,
        "width": 116,
        "height": 147
    },
    "GreenRegrow": {
        "x": 468,
        "y": 474,
        "width": 159,
        "height": 145
    },
    "GreenRegrowCamo": {
        "x": 629,
        "y": 636,
        "width": 159,
        "height": 145
    },
    "Lead": {
        "x": 134,
        "y": 1100,
        "width": 123,
        "height": 156
    },
    "LeadCamo": {
        "x": 258,
        "y": 1100,
        "width": 123,
        "height": 156
    },
    "LeadFortified": {
        "x": 0,
        "y": 1100,
        "width": 133,
        "height": 156
    },
    "WhiteRegrow": {
        "x": 1153,
        "y": 1132,
        "width": 105,
        "height": 97
    },
    "WhiteRegrowCamo": {
        "x": 1283,
        "y": 428,
        "width": 105,
        "height": 97
    },
    "Yellow": {
        "x": 382,
        "y": 1100,
        "width": 123,
        "height": 156
    },
    "YellowCamo": {
        "x": 506,
        "y": 1100,
        "width": 123,
        "height": 156
    },
    "YellowRegrow": {
        "x": 816,
        "y": 636,
        "width": 168,
        "height": 154
    },
    "YellowRegrowCamo": {
        "x": 0,
        "y": 945,
        "width": 168,
        "height": 154
    },
    "Zebra": {
        "x": 1153,
        "y": 984,
        "width": 116,
        "height": 147
    },
    "ZebraCamo": {
        "x": 1283,
        "y": 0,
        "width": 116,
        "height": 147
    },
    "ZebraRegrow": {
        "x": 816,
        "y": 791,
        "width": 159,
        "height": 145
    },
    "ZebraRegrowCamo": {
        "x": 993,
        "y": 0,
        "width": 159,
        "height": 145
    },
    "Pink": {
        "x": 1153,
        "y": 328,
        "width": 129,
        "height": 163
    },
    "PinkCamo": {
        "x": 1153,
        "y": 492,
        "width": 129,
        "height": 163
    },
    "PinkRegrow": {
        "x": 354,
        "y": 782,
        "width": 176,
        "height": 162
    },
    "PinkRegrowCamo": {
        "x": 531,
        "y": 782,
        "width": 176,
        "height": 162
    },
    "Purple": {
        "x": 630,
        "y": 1100,
        "width": 123,
        "height": 156
    },
    "PurpleCamo": {
        "x": 754,
        "y": 1100,
        "width": 123,
        "height": 156
    },
    "PurpleRegrow": {
        "x": 169,
        "y": 945,
        "width": 168,
        "height": 154
    },
    "PurpleRegrowCamo": {
        "x": 338,
        "y": 945,
        "width": 168,
        "height": 154
    },
    "Rainbow": {
        "x": 1153,
        "y": 656,
        "width": 129,
        "height": 163
    },
    "RainbowCamo": {
        "x": 1153,
        "y": 820,
        "width": 129,
        "height": 163
    },
    "RainbowRegrow": {
        "x": 816,
        "y": 0,
        "width": 176,
        "height": 162
    },
    "RainbowRegrowCamo": {
        "x": 816,
        "y": 163,
        "width": 176,
        "height": 162
    },
    "Red": {
        "x": 1283,
        "y": 526,
        "width": 103,
        "height": 131
    },
    "RedCamo": {
        "x": 1283,
        "y": 658,
        "width": 103,
        "height": 131
    },
    "RedRegrow": {
        "x": 993,
        "y": 285,
        "width": 143,
        "height": 130
    },
    "RedRegrowCamo": {
        "x": 993,
        "y": 416,
        "width": 143,
        "height": 130
    },
    "White": {
        "x": 1283,
        "y": 986,
        "width": 78,
        "height": 97
    },
    "WhiteCamo": {
        "x": 1283,
        "y": 1084,
        "width": 78,
        "height": 97
    },
    "Bad": {
        "x": 0,
        "y": 238,
        "width": 326,
        "height": 235
    },
    "BadFortified": {
        "x": 0,
        "y": 0,
        "width": 326,
        "height": 237
    },
    "Bfb": {
        "x": 234,
        "y": 474,
        "width": 233,
        "height": 164
    },
    "BfbFortified": {
        "x": 0,
        "y": 474,
        "width": 233,
        "height": 166
    },
    "DdtCamo": {
        "x": 0,
        "y": 641,
        "width": 203,
        "height": 140
    },
    "DdtFortifiedCamo": {
        "x": 204,
        "y": 641,
        "width": 203,
        "height": 140
    },
    "Moab": {
        "x": 670,
        "y": 945,
        "width": 162,
        "height": 105
    },
    "MoabFortified": {
        "x": 507,
        "y": 945,
        "width": 162,
        "height": 110
    },
    "Zomg": {
        "x": 327,
        "y": 0,
        "width": 301,
        "height": 194
    },
    "ZomgFortified": {
        "x": 327,
        "y": 195,
        "width": 301,
        "height": 194
    }
}

class Bloon {
    constructor(type) {
        this.speed = 0.125 * bloonsData[type.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].speed;
        this.x = -200;
        this.type = type;
    }
    move() {
        this.x += this.speed;
    }
    // move(delta) {
    //     this.x += this.speed * delta;
    //   }
    shouldDelete() {
        const certainValue = 800; // replace with your value
        return this.x >= certainValue;
    }
    render(ctx) {
        let spriteData = bloonImageMap[this.type];
        ctx.drawImage(bloons_spritesheet, spriteData.x, spriteData.y, spriteData.width, spriteData.height, this.x, 100, ratioCalc(1, 0, 100, spriteData.width, spriteData.height), 100);
    }
}

class Blimp {
    constructor(type) {
        this.speed = 0.125 * bloonsData[type.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].speed;
        this.x = -(bloonImageMap[type].width * 1.62);
        this.type = type;
    }
    move() {
        this.x += this.speed;
    }
    // move(delta) {
    //     this.x += this.speed * delta;
    //   }
    shouldDelete() {
        const certainValue = 800; // replace with your value
        return this.x >= certainValue;
    }
    render(ctx) {
        let spriteData = bloonImageMap[this.type];
        ctx.drawImage(bloons_spritesheet, spriteData.x, spriteData.y, spriteData.width, spriteData.height, this.x, 150 - ((spriteData.height * 1.62) / 2), spriteData.width * 1.62, spriteData.height * 1.62);
    }

}

const bloons = [];

const update = () => {
    bloons.forEach((bloon, i) => {
        bloon.move()
        if (bloon.shouldDelete()) {
            bloons.splice(i, 1);
        }
    })
}

// let lastTime = Date.now();

// const update = () => {
//   const now = Date.now();
//   const delta = (now - lastTime) / 1000; // convert to seconds
//   lastTime = now;

//   bloons.forEach((bloon, i) => {
//     bloon.move(delta);
//     if (bloon.shouldDelete()) {
//       bloons.splice(i, 1);
//     }
//   });
// };

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bloons.forEach(bloon => bloon.render(ctx));
}

let canvas;
let ctx;

function startRound(round) {
    for (let bloonGroup of round.bloonGroups) {
        setTimeout(() => {
            spawnBloon(bloonGroup);
        }, bloonGroup.start * 1000);
    }
}

function spawnBloon(bloonGroup) {
    let interval = (bloonGroup.duration - bloonGroup.start) / bloonGroup.count;
    let count = 0;
    let spawnInterval = setInterval(() => {
        if (count >= bloonGroup.count) {
            clearInterval(spawnInterval);
            return;
        }
        // ["Moab", "MoabFortified", "Bfb", "BfbFortified", "Zomg", "ZomgFortified", "DdtCamo", "DdtFortifiedCamo", "Bad", "BadFortified"].includes(bloonGroup.bloon) ? bloons.push(new Blimp(bloonGroup.bloon)) : bloons.push(new Bloon(bloonGroup.bloon));
        let bloonType = bloonGroup.bloon;
        let bloon = ["Moab", "MoabFortified", "Bfb", "BfbFortified", "Zomg", "ZomgFortified", "DdtCamo", "DdtFortifiedCamo", "Bad", "BadFortified"].includes(bloonType) ? new Blimp(bloonType) : new Bloon(bloonType);
        let layer = bloonsData[bloonType.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].layer;
        let index = bloons.findIndex(b => bloonsData[b.type.replace("Camo", "").replace("Regrow", "").replace("Fortified", "")].layer > layer);
        if (index === -1) {
            bloons.push(bloon);
        } else {
            bloons.splice(index, 0, bloon);
        }
        // bloons.push(new Bloon(bloonGroup.bloon));
        count++;
    }, interval * 1000);
}

//   window.addEventListener('load',()=>{
//     canvas = document.getElementById('roundset-canvas');
//     ctx = canvas.getContext('2d');
//     setInterval(()=>{
//       update();
//       render();
//     }, 1000/60);
//   })