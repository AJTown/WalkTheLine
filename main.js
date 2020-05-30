var GameData = {
    Respect: 0,
    GoodBehaviour: 0,
    Strength: 0,
    Luck: 0,
    RespectPerSecond: 1,
    RespectMultiplier: 1,
    GoodBehaviourMultiplier: 1,
    GoodBehaviourLossMultiplier: 1,
    RespectLossMultiplier: 1,
    GoodBehaviourPerSecond: 1,
    RespectLossFromGoodBehaviourPS: 1,
    GoodBehaviourLossFromRespectPS: 1,
    RespectUpgrades: 1,
    GoodBehaviourUpgrades: 1,
    StrengthReward: 1,
    LuckReward: 1,
    SliderMin: 30,
    SliderMax: 500,
    TimeOut: 30,
    Speed: 1000,
    Update: 1,
    RespectUpgradeCost: 100,
    GoodBehaviourUpgradeCost: 1000000
};

var Upgrades = {
    Respect: 0,
    GoodBehaviour: 0,
    Strength: 0,
    Luck: 0,
    RespectPerSecond: 1,
    RespectMultiplier: 1,
    GoodBehaviourMultiplier: 1,
    GoodBehaviourLossMultiplier: 1,
    RespectLossMultiplier: 1,
    GoodBehaviourPerSecond: 1,
    RespectLossFromGoodBehaviourPS: 1,
    GoodBehaviourLossFromRespectPS: 1,
    RespectUpgrades: 1,
    GoodBehaviourUpgrades: 1,
    StrengthReward: 1,
    LuckReward: 1,
    SliderMin: 30,
    SliderMax: 500,
    TimeOut: 30,
    Speed: 1000,
    Update: 1,
    RespectUpgradeCost: 100,
    GoodBehaviourUpgradeCost: 1000000
};

function costGrowth(Rate, N) {
    return Math.ceil(Upgrades.RespectUpgradeCost * Math.pow(Rate, N));
};

function BuyRespectUpgrade(Multi) {
    Upgrades.RespectUpgradeCost = costGrowth(1.07, Upgrades.RespectUpgrades);
    Upgrades.RespectUpgrades += 1;
    Upgrades.RespectMultiplier *= Multi;
    Upgrades.GoodBehaviourLossMultiplier *= Multi;
};

function BuyGoodBehaviourUpgrade(Multi) {
    Upgrades.GoodBehaviourUpgradeCost = costGrowth(1.07, Upgrades.GoodBehaviourUpgrades);
    Upgrades.GoodBehaviourUpgrades += 1;
    Upgrades.GoodBehaviourMultiplier *= Multi;
    Upgrades.RespectLossMultiplier *= Multi;
};

function SliderMulti(x, CurrencyPerSecond) {
    return Math.floor(x * (0.00001 * Math.pow((CurrencyPerSecond - 30), 2) + 1))
};

function UpdateGameData() {
    GameData = Object.assign({}, Upgrades)
};

function UpdateValues() {
    document.getElementById("Respect").innerHTML = GameData.Respect + " Respect";
    document.getElementById("GoodBehaviour").innerHTML = GameData.GoodBehaviour + " Good Behaviour"; //print respect to page
}

function UpdateSlider() {
    document.getElementById("myRange").min = GameData.SliderMin
    document.getElementById("myRange").max = GameData.SliderMax
    document.getElementById("myRange").value = Math.floor(((GameData.SliderMax - GameData.SliderMin) / 2) + GameData.SliderMin)
};

function LoadGame() {
    // var savegame = JSON.parse(localStorage.getItem("walkTheLineSave"))
    // if (savegame !== null) {
    //     GameData = savegame
    //     Upgrades = savegame
    // }
    UpdateValues()
    UpdateSlider()
};

window.InLoop = 0
var JobQueue = []
    // This function accrues respect over time, 
    // upgrades can be purchased but shouldn't take affect until after the loop has finished
function GainRespect(Iters, CurrencyPerSecond) {
    InLoop = 1
    var RespectLoop = window.setInterval(function() {
        GameData.Respect += GameData.RespectMultiplier * SliderMulti(GameData.RespectPerSecond, CurrencyPerSecond);
        GameData.GoodBehaviour -= GameData.GoodBehaviourLossMultiplier * SliderMulti(GameData.GoodBehaviourLossFromRespectPS, CurrencyPerSecond);
        Upgrades.GoodBehaviour = GameData.GoodBehaviour; //Accrue Good Behaviours
        Upgrades.Respect = GameData.Respect; //Lose Respect
        UpdateValues()
        if (Iters === 1) {
            InLoop = 0
            clearInterval(RespectLoop);
        }
        Iters--;
    }, GameData.Speed)
};
// //This function accrues Good Behaviours over time, 
// //upgrades can be purchased but shouldn't take affect until after the loop has finished
function GoodBehaviours(Iters, CurrencyPerSecond) {
    InLoop = 1
    var GooodBehaviourLoop = window.setInterval(function() {
        GameData.GoodBehaviour += GameData.GoodBehaviourMultiplier * SliderMulti(GameData.GoodBehaviourPerSecond, CurrencyPerSecond); //Accrue Good Behaviours
        GameData.Respect -= GameData.RespectLossMultiplier * SliderMulti(GameData.RespectLossFromGoodBehaviourPS, CurrencyPerSecond);
        Upgrades.GoodBehaviour = GameData.GoodBehaviour; //Accrue Good Behaviours
        Upgrades.Respect = GameData.Respect; //Lose Respect
        UpdateValues()
        if (Iters === 1) {
            //Update againstupgrades
            UpdateSlider();
            InLoop = 0
            clearInterval(GooodBehaviourLoop);
        }
        Iters--;
    }, GameData.Speed)
};

function AddIterations(JobQueue, Job, Iterations) {
    JobQueue.push([Job, Iterations])
};

function RunIterations(JobQueue) {
    if (JobQueue.length > 0) {
        let Iters = JobQueue[0][1]
        let CurrencyPerSecond = Iters
        if (JobQueue[0][0] === 1) {
            UpdateGameData()
            GainRespect(Iters, CurrencyPerSecond)
        } else {
            UpdateGameData()
            GoodBehaviours(Iters, CurrencyPerSecond)
        }
        JobQueue.shift()
    }
};



var mainGameLoop = window.setInterval(function() {
    if (InLoop == 0) {
        RunIterations(JobQueue)
    }
}, 20);

// var saveGameLoop = window.setInterval(function() {
//     localStorage.setItem("walkTheLineSave", JSON.stringify(Upgrades))
// }, 15000)




//if (typeof savegame.dwarves !== "undefined") gameData.dwarves = savegame.dwarves;