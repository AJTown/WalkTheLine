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
    GoodBehaviourUpgradeCost: 1000000,
    ShopVisible: 0,
    SpeedUpAmountPerClick: 0
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
    GoodBehaviourUpgradeCost: 1000000,
    ShopVisible: 0,
    SpeedUpAmountPerClick: 0
};

var HardReset = {
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
    GoodBehaviourUpgradeCost: 1000000,
    ShopVisible: 0,
    SpeedUpAmountPerClick: 0
}

function costGrowth(Rate, N) {
    return Math.ceil(Upgrades.RespectUpgradeCost * Math.pow(Rate, N));
};

function BuyRespectUpgrade(Multi) {
    GameData.Respect -= Upgrades.RespectUpgradeCost
    Upgrades.RespectUpgradeCost = costGrowth(1.07, Upgrades.RespectUpgrades);
    Upgrades.RespectUpgrades += 1;
    Upgrades.RespectMultiplier *= Multi;
    Upgrades.GoodBehaviourLossMultiplier *= Multi;
    UpdateValues()
};

function BuyGoodBehaviourUpgrade(Multi) {
    GameData.GoodBehaviour -= Upgrades.GoodBehaviourUpgradeCost
    Upgrades.GoodBehaviourUpgradeCost = costGrowth(1.07, Upgrades.GoodBehaviourUpgrades);
    Upgrades.GoodBehaviourUpgrades += 1;
    Upgrades.GoodBehaviourMultiplier *= Multi;
    Upgrades.RespectLossMultiplier *= Multi;
    UpdateValues()
};

function SliderMulti(x, CurrencyPerSecond) {
    return Math.floor(x * (0.00001 * Math.pow((CurrencyPerSecond - 30), 2) + 1))
};

function UpdateGameData() {
    GameData = Object.assign({}, Upgrades)
};

function UpdateValues() {
    document.getElementById("Respect").innerHTML = GameData.Respect;
    document.getElementById("GoodBehaviour").innerHTML = GameData.GoodBehaviour; //print respect to page
    TotalIters = RespectIters + GBIters
    document.getElementById("IterationsLeft").innerHTML = "Number of actions left: " + TotalIters
}

function UpdateSlider() {
    document.getElementById("slider").min = GameData.SliderMin
    document.getElementById("slider").max = GameData.SliderMax
    document.getElementById("slider").value = Math.floor(((GameData.SliderMax - GameData.SliderMin) / 2) + GameData.SliderMin)
};

function LoadGame() {
    var savegame = JSON.parse(localStorage.getItem("walkTheLineSave"))
    if (savegame !== null) {
        GameData = savegame
        Upgrades = savegame
    }
    UpdateValues()
    UpdateSlider()
};

window.InLoop = 0
var JobQueue = []

RespectIters = 0
GBIters = 0

function GainRespect(CurrencyPerSecond) {
    InLoop = 1
    var RespectLoop = window.setInterval(function() {
        GameData.Respect += GameData.RespectMultiplier * SliderMulti(GameData.RespectPerSecond, CurrencyPerSecond);
        GameData.GoodBehaviour -= GameData.GoodBehaviourLossMultiplier * SliderMulti(GameData.GoodBehaviourLossFromRespectPS, CurrencyPerSecond);
        Upgrades.GoodBehaviour = GameData.GoodBehaviour; //Accrue Good Behaviours
        Upgrades.Respect = GameData.Respect; //Lose Respect
        UpdateValues()
        if (RespectIters <= 1) {
            InLoop = 0
            CurrentJob[0] = [0]
            clearInterval(RespectLoop);
        }
        RespectIters--;
    }, GameData.Speed)
};

function GoodBehaviours(CurrencyPerSecond) {
    InLoop = 1
    var GooodBehaviourLoop = window.setInterval(function() {
        GameData.GoodBehaviour += GameData.GoodBehaviourMultiplier * SliderMulti(GameData.GoodBehaviourPerSecond, CurrencyPerSecond); //Accrue Good Behaviours
        GameData.Respect -= GameData.RespectLossMultiplier * SliderMulti(GameData.RespectLossFromGoodBehaviourPS, CurrencyPerSecond);
        Upgrades.GoodBehaviour = GameData.GoodBehaviour; //Accrue Good Behaviours
        Upgrades.Respect = GameData.Respect; //Lose Respect
        UpdateValues()
        if (GBIters <= 1) {
            InLoop = 0
            CurrentJob[0] = 0
            clearInterval(GooodBehaviourLoop)
        }
        GBIters--;
    }, GameData.Speed)
};

function AddIterations(JobQueue, Job, Iterations) {
    JobQueue.push([Job, Iterations])
};

function RunIterations(JobQueue) {
    if (JobQueue.length > 0) {
        let Iters = JobQueue[0][1]
        let CurrencyPerSecond = Iters
        CurrentJob = JobQueue[0]
        if (JobQueue[0][0] === 1) {
            UpdateGameData()
            GainRespect(CurrencyPerSecond)
            RespectIters = Iters
        } else {
            UpdateGameData()
            GoodBehaviours(CurrencyPerSecond)
            GBIters = Iters
        }
        JobQueue.shift()
    }
};

function DisableRespectUpgrade() {
    document.getElementById("RespectUpgrade").disabled = true
}

function EnableRespectUpgrade() {
    document.getElementById("RespectUpgrade").disabled = false
}

function DisableGBUpgrade() {
    document.getElementById("GBUpgrade").disabled = true
}

function EnableGBUpgrade() {
    document.getElementById("GBUpgrade").disabled = false
}

var mainGameLoop = window.setInterval(function() {
    if (GameData.Respect >= Upgrades.RespectUpgradeCost) {
        EnableRespectUpgrade()
    } else { DisableRespectUpgrade() };
    if (GameData.GoodBehaviour >= Upgrades.GoodBehaviourUpgradeCost) {
        EnableGBUpgrade()
    } else { DisableGBUpgrade() };
    if (InLoop == 0) {
        RunIterations(JobQueue)
    }
    UpdateValues();
    ResetButtonClickCountReset++
    if (ResetButtonClickCountReset >= 1000) {
        ResetButtonClickCount = 0
    }
}, 20);

function SpeedGameUp() {
    if (GBIters > 1 || RespectIters > 1) {
        if (CurrentJob[0] == 2) {
            CurrencyPerSecondManual = CurrentJob[1]
            GameData.GoodBehaviour += GameData.GoodBehaviourMultiplier * SliderMulti(GameData.GoodBehaviourPerSecond, CurrencyPerSecondManual); //Accrue Good Behaviours
            GameData.Respect -= GameData.RespectLossMultiplier * SliderMulti(GameData.RespectLossFromGoodBehaviourPS, CurrencyPerSecondManual);
            Upgrades.GoodBehaviour = GameData.GoodBehaviour; //Accrue Good Behaviours
            Upgrades.Respect = GameData.Respect; //Lose Respect
            UpdateValues()
            GBIters--
        } else if (CurrentJob[0] == 1) {
            CurrencyPerSecondManual = CurrentJob[1]
            GameData.Respect += GameData.RespectMultiplier * SliderMulti(GameData.RespectPerSecond, CurrencyPerSecondManual);
            GameData.GoodBehaviour -= GameData.GoodBehaviourLossMultiplier * SliderMulti(GameData.GoodBehaviourLossFromRespectPS, CurrencyPerSecondManual);
            Upgrades.GoodBehaviour = GameData.GoodBehaviour;
            Upgrades.Respect = GameData.Respect;
            UpdateValues()
            RespectIters--
        }
    }
};

var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("walkTheLineSave", JSON.stringify(Upgrades))
}, 15000)

ResetButtonClickCount = 0
ResetButtonClickCountReset = 0

function ResetButton() {
    ResetButtonClickCount++
    if (ResetButtonClickCount >= 10) {
        localStorage.removeItem("walkTheLineSave")
        location.reload()
    }
}

//For updates to save games
//if (typeof savegame.dwarves !== "undefined") gameData.dwarves = savegame.dwarves;