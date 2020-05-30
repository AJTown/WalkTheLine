function costGrowth(Rate, N) {
    return Math.ceil(RespectUpgradeCost * Math.pow(Rate, N));
};

function BuyRespectUpgrade(Multi) {
    RespectUpgradeCost = costGrowth(1.07, RespectUpgrades)
    RespectMultiplier *= Multi
};

var GameData = {
    Respect: 0,
    GoodBehaviour: 0,
    Strength: 0,
    Luck: 0,
    RespectPerSecond: 1,
    RespectMultiplier: 1,
    GoodBehaviourPerSecond: 1,
    RespectLossFromGoodBehaviourPS: 1,
    GoodBehaviourLossFromRespectPS: 1,
    RespectUpgrades: 0,
    RespectUpgradeCost: 10,
    StrengthReward: 1,
    LuckReward: 1,
    SliderMin: 30,
    SliderMax: 500,
    TimeOut: 30,
    Speed: 1000,
    Update: 1,
    RespectUpgrade: 100,
    GoodBehaviourUpgrade: 1000000
};

var Upgrades = {
    Respect: 0,
    GoodBehaviour: 0,
    Strength: 0,
    Luck: 0,
    RespectPerSecond: 1,
    RespectMultiplier: 1,
    GoodBehaviourPerSecond: 1,
    RespectLossFromGoodBehaviourPS: 1,
    GoodBehaviourLossFromRespectPS: 1,
    RespectUpgrades: 0,
    RespectUpgradeCost: 10,
    StrengthReward: 1,
    LuckReward: 1,
    SliderMin: 30,
    SliderMax: 500,
    TimeOut: 30,
    Speed: 1000,
    Update: 1,
    RespectUpgrade: 100,
    GoodBehaviourUpgrade: 1000000
};


function UpdateGameData() {
    GameData = Upgrades
};

function UpdateValues() {
    document.getElementById("Respect").innerHTML = GameData.Respect + " Respect";
    document.getElementById("GoodBehaviour").innerHTML = GameData.GoodBehaviour + " Good Behaviour"; //print respect to page
}

function UpdateSlider() {
    document.getElementById("myRange").min = GameData.SliderMin
    document.getElementById("myRange").max = GameData.SliderMax
        //    document.getElementById("myRange").value = Math.floor(((GameData.SliderMax - GameData.SliderMin) / 2) + GameData.SliderMin)
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
    UpdateGameData();
    InLoop = 1
    var RespectLoop = window.setInterval(function() {
        GameData.Respect += GameData.RespectMultiplier * Math.floor(GameData.RespectPerSecond * (0.00001 * Math.pow((CurrencyPerSecond - 30), 2) + 1));
        GameData.GoodBehaviour -= Math.floor(GameData.GoodBehaviourLossFromRespectPS * (0.00001 * Math.pow((CurrencyPerSecond - 30), 2) + 1));
        Upgrades.GoodBehaviour = GameData.GoodBehaviour; //Accrue Good Behaviours
        Upgrades.Respect = GameData.Respect; //Lose Respect
        UpdateValues()
        if (Iters === 1) {
            UpdateGameData();
            UpdateSlider();
            InLoop = 0
            clearInterval(RespectLoop);
        }
        Iters--;
    }, GameData.Speed)
};
// //This function accrues Good Behaviours over time, 
// //upgrades can be purchased but shouldn't take affect until after the loop has finished
function GoodBehaviours(Iters, CurrencyPerSecond) {
    UpdateGameData();
    InLoop = 1
    var GooodBehaviourLoop = window.setInterval(function() {
        GameData.GoodBehaviour += Math.floor(GameData.GoodBehaviourPerSecond * (0.00001 * Math.pow((CurrencyPerSecond - 30), 2) + 1)); //Accrue Good Behaviours
        GameData.Respect -= Math.floor(GameData.RespectLossFromGoodBehaviourPS * (0.00001 * Math.pow((CurrencyPerSecond - 30), 2) + 1)); //Lose Respect
        Upgrades.GoodBehaviour = GameData.GoodBehaviour; //Accrue Good Behaviours
        Upgrades.Respect = GameData.Respect; //Lose Respect
        UpdateValues()
        if (Iters === 1) {
            //Update againstupgrades
            UpdateGameData();
            UpdateSlider();
            InLoop = 0
            clearInterval(GooodBehaviourLoop);
        }
        Iters--;
    }, GameData.Speed)
};

function AddIterations(JobQueue, Job, Iterations, CurrencyPS) {
    JobQueue.push([Job, Iterations, CurrencyPS])
};

function RunIterations(JobQueue) {
    if (JobQueue.length > 0) {
        let Iters = JobQueue[0][1]
        let CurrencyPerSecond = JobQueue[0][2]
        if (JobQueue[0][0] === 1) {
            GainRespect(Iters, CurrencyPerSecond)
        } else {
            GoodBehaviours(Iters, CurrencyPerSecond)
        }
        JobQueue.shift()
    }
};



var mainGameLoop = window.setInterval(function() {
    if (InLoop == 0) {
        RunIterations(JobQueue)
    }
}, GameData.Speed);

// var saveGameLoop = window.setInterval(function() {
//     localStorage.setItem("walkTheLineSave", JSON.stringify(Upgrades))
// }, 15000)




//if (typeof savegame.dwarves !== "undefined") gameData.dwarves = savegame.dwarves;