/** Rename variables */
var Neat = neataptic.Neat;
var Methods = neataptic.Methods;
var Config = neataptic.Config;
var Architect = neataptic.Architect;

Config.warnings = false;

/* trained Population */
var USE_TRAINED_POP = false;

/** Global Variables */
var neat;

/*construct GA*/
function initNeat() {
    neat = new Neat(
        3, 3,
        null,
        {
            mutation: [
                Methods.Mutation.ADD_NODE,
                Methods.Mutation.SUB_NODE,
                Methods.Mutation.ADD_CONN,
                Methods.Mutation.SUB_CONN,
                Methods.Mutation.MOD_WEIGHT,
                Methods.Mutation.MOD_BIAS,
                Methods.Mutation.MOD_ACTIVATION,
                Methods.Mutation.ADD_GATE,
                Methods.Mutation.SUB_GATE,
                Methods.Mutation.ADD_SELF_CONN,
                Methods.Mutation.SUB_SELF_CONN,
                Methods.Mutation.ADD_BACK_CONN,
                Methods.Mutation.SUB_BACK_CONN
            ],
            popsize: PLAYERS,
            mutationRate: MUTATION_RATE,
            elitism: ELITISM,
            network: new Architect.Random(3, START_HIDDEN_SIZE, 3)
        }

    );

    if (USE_TRAINED_POP) neat.population = population;
}

function startEvaluation() {
    photos = [];
    let i = 0;
    let j = 0;

    for (let genome in neat.population) {
        genome = neat.population[genome];
        new Photograph(i * sideLength, j * sideLength, genome);
        if (i >= grids - 1) {
            j++;
            i = 0;
        } else {
            i++;
        }
    }
    neat.mutate();
    drawPhotos();
}


function endEvaluation() {
    console.log('Generation: ', neat.generation, ' - average score: ', neat.getAverage());
    console.log('Generation highest score', neat.getFittest().score);

    //networks shouldn't get too big
    for (var genome in neat.population) {
        genome = neat.population[genome];
        genome.score -= (genome.nodes.length);
    }

    neat.sort();
    var newPopulation = [];

    //Elitism
    for (var i = 0; i < neat.elitism; i++) {
        newPopulation.push(neat.population[i]);
    }

    //breed next population
    for (var i = 0; i < neat.popsize - neat.elitism; i++) {
        newPopulation.push(neat.getOffspring());
    }

    //replace old pop with new
    neat.population = newPopulation;
    neat.mutate();

    neat.generation++;
    startEvaluation();
}

function mouseClicked() {
    let clickedX = floor(mouseX / sideLength);
    let clickedY = floor(mouseY / sideLength);

    if (clickedX >= 0 && clickedX < grids) {
        if (clickedY >= 0 && clickedY < grids) {
            console.log(`clicked (${clickedX},${clickedY})`);
            photoClicked = (clickedY * grids) + clickedX;

            //give fitness to the clicked photo
            photos[photoClicked].brain.score += 10;
        }
    }
}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        endEvaluation();
    }
}