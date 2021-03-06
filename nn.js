

function onDocumentLoad() {
    setTimeout(()=>{
        let nn = new NN();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);



const POPULATION = 10;
//Our neural network
function NN(){
    
    //Create our neural network... 16 input, 5 neurons in hidden layer and 4 output 
    this.neuvol = new Neuroevolution({
        population:POPULATION ,
        network:[4, [5], 1],
        // randomBehaviour:0.1,
        // mutationRate:0.5, 
        // mutationRange:0.5,    
    });

    //generation
    this.gen = [];
    //counting generation
    this.generation = 0;

    //Rexes
    this.players = [];

    //This is refence from https://github.com/amaneureka/T-Rex/blob/master/js/brain.js
    this.keyEvent = {
        JUMP: 32,
        DUCK: 40
    };

    this.best_score = 0;

    this.initializePlayers();


    this.startGame();

}

NN.prototype.initializePlayers = function()
{
    for(let i=0; i<POPULATION;i++)
    {
        this.players[i] = new Runner("interstitial-wrapper",null, i);
    }
};




NN.prototype.startGame = function()
{
    this.gen = this.neuvol.nextGeneration();
    this.generation++;
    self = this;
    for(let i=0; i<POPULATION;i++)
    {
        let trex =self.players[i];
        trex.restart();
        self.jumpDragon(trex);
        self.players[i].f_crashed = false;
    }
    setInterval(()=>
    {
        for(let i=0; i<POPULATION;i++)
        {
            let trex =self.players[i];
            if(!trex.f_crashed)
            {    //If is not killed before
                self.updateRex(i);   
            }
        }
    }, 50);
}

// //Get the next generation of rex ai
// NN.prototype.nextGeneration = function(){
//     this.startGame();
// }



NN.prototype.updateRex = function(index)
{
    let trex = self.players[index];     
    if(trex.crashed)
    {
        let score = trex.distanceRan;
        console.log("Score:", score);
        self.players[index].f_crashed = true;
        this.neuvol.networkScore(this.gen[index], score);
        if(score>this.best_score)
        {
            this.best_score = score;
            document.getElementById("best_score").innerHTML = "Best score:"+ this.best_score;
            document.getElementById("generation_show").innerHTML = "Generation:"+ this.generation;
        }
        this.verifyAllDead();
    }else
    {
        this.takeGuess(trex,index);
    }
}

NN.prototype.verifyAllDead = function(){
    for(let i =0; i<POPULATION;i++)
    {
        if(!this.players[i].crashed)
            return;
    }
    console.log("All deads!");
    this.startGame();
}

//Train the neural network
NN.prototype.takeGuess = function(trex, index){

    //This is a reference from  https://github.com/amaneureka/T-Rex/blob/master/js/brain.js
    let obstacle = trex.horizon.obstacles[0];
    let inputs = [];
    if(obstacle)
    {
        inputs[0] = obstacle.xPos;
        inputs[1] = obstacle.yPos;
        inputs[2] = obstacle.size;
        inputs[3] = Math.round(trex.currentSpeed);
    }else
    {
        inputs[0] = 0;
        inputs[1] = 0;
        inputs[2] = 0;
        inputs[3] = 0;
    }

    let output = this.gen[index].compute(inputs)[0];
    if(output > 0.5)
    {
        //Jump
        this.jumpDragon(trex);
    }else
    {
        //Take down
        this.duckDragon(trex);
    }
}


NN.prototype.jumpDragon = function(trex)
{
    trex.onKeyDown({
        keyCode: this.keyEvent.JUMP,
        type: 'touchstart'
    });
    trex.onKeyUp({
        keyCode: this.keyEvent.JUMP,
        type: 'touchend'
    });
};

NN.prototype.duckDragon = function(trex)
{
    // trex.onKeyDown({
    //     keyCode: this.keyEvent.DUCK,
    //     type: 'touchstart'
    // });

    // trex.onKeyDown({
    //     keyCode: this.keyEvent.DUCK,
    //     type: 'touchend'
    // });
};
