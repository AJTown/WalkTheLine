var GameData = {
    Respect: 0,
    GoodBehaviour: 0,
    Strength: 0,
    Luck: 0,
    RespectPerSecond: 1,
    GoodBehaviourPerSecond: 1,
    StrengthReward: 1,
    LuckReward: 1,
    TimeOut: 30,
    Speed: 1000
};

var Upgrades = {
    RespectPerSecond: 1,
    GoodBehaviourPerSecond: 1,
    StrengthReward: 1,
    LuckReward: 1,
};


function UpdateGameData() {
    GameData.RespectPerSecond = Upgrades.RespectPerSecond;
    GameData.GoodBehaviourPerSecond = Upgrades.GoodBehaviourPerSecond;
    GameData.StrengthReward = Upgrades.StrengthReward;
    GameData.LuckReward = Upgrades.LuckReward;
}
window.InLoop = 0
var JobQueue = []
    // This function accrues respect over time, 
    // upgrades can be purchased but shouldn't take affect until after the loop has finished
function GainRespect(Iters) {
    UpdateGameData();
    InLoop = 1
    var RespectLoop = window.setInterval(function() {
        GameData.Respect += GameData.RespectPerSecond;
        document.getElementById("Respect").innerHTML = GameData.Respect + " Respect";
        if (Iters === 1) {
            UpdateGameData();
            InLoop = 0
            clearInterval(RespectLoop);
        }
        Iters--;
    }, GameData.Speed)
};
// //This function accrues Good Behaviours over time, 
// //upgrades can be purchased but shouldn't take affect until after the loop has finished
function GoodBehaviours(Iters) {
    UpdateGameData();
    InLoop = 1
    var GooodBehaviourLoop = window.setInterval(function() {
        GameData.GoodBehaviour += GameData.GoodBehaviourPerSecond; //Accrue Respect
        document.getElementById("GoodBehaviour").innerHTML = GameData.GoodBehaviour + " Good Behaviour"; //print respect to page
        if (Iters === 1) {
            //Update againstupgrades
            UpdateGameData();
            InLoop = 0
            clearInterval(GooodBehaviourLoop);
        }
        Iters--;
    }, GameData.Speed)
};

function AddIterations(JobQueue, Job, Iterations) {
    JobQueue.push([Job, Iterations])
    NextJob = JobQueue[0]
};

function RunIterations(JobQueue) {
    if (JobQueue.length > 0) {
        let Iters = JobQueue[0][1]
        if (JobQueue[0][0] === 1) {
            GainRespect(Iters)
        } else {
            GoodBehaviours(Iters)
        }
        JobQueue.shift()
    }
};

var mainGameLoop = window.setInterval(function() {
    if (InLoop == 0) {
        RunIterations(JobQueue)
    }
}, GameData.Speed);