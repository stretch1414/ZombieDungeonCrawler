//Game variables
var timer;
var timer2;
var timer3;
var timer4;
var scene;
var character;
var bullets;
var zombies;
var zombiesKilled = 0;
var points = 0;
var score = 0;
var UP = 0;
var RIGHT = 90;
var DOWN = 180;
var LEFT = 270;
var moveDelay = .1;
var cycleGunDelay = .1;
var output;
var output2;
var emptyClip;
var emptyClip2;
//Maze variables
var left = 0;
var forward = 1;
var right = 2;
var backward = 3;
var mazeSize = 20;
//Map variables
var map;
var tileset;
var ROWS = mazeSize;
var COLUMNS= mazeSize;
var BLOCK = 0;
var CONCRETE = 1;
var EDGE = 2;
var DOOR = 3;
var NUM_STATES = 4;
//Number of rooms between 5 and 10
var NUM_ROOMS = Math.floor(Math.random() * 5) + 5;
//Will make there be about 10-20 zombies in each room, depending on the number of rooms
var NUM_ZOMBIES = Math.floor(100 / NUM_ROOMS);
var rooms = [];
var currentRoom = 0;
var BLOCK_PIXEL_SIZE = 32;
//Difficulty variables
var EASY = "Easy";
var NORMAL = "Normal";
var HARD = "Hard";
var EXTREME = "Extreme";
var difficulty;
var difficultyScoringText;

function init()
{
    output = document.getElementById("output");
    output2 = document.getElementById("output2");
    difficultySelection();
    //Take away the radio difficulty buttons
    output2.innerHTML = "";
    for (var i = 0; i < NUM_ROOMS; i++)
    {
        rooms[i] = generateMaze();
    }
    map = rooms[currentRoom];
    emptyClip = new Sound("emptyClip.mp3");
    emptyClip2 = new Sound("emptyClip.ogg");
    //This is for the delay in character movement and gun fire delay
    timer = new Timer();
    //This is for the gun cycle delay
    timer2 = new Timer();
    //This is the timer for the gun fire delay
    timer3 = new Timer();
    //This is the timer for the character changing direction facing
    timer4 = new Timer();
    game = new Scene();
    game.setSize(640, 640);
    game.setBG("#000000");
    setupTiles();
    loadTileMap();
    character = new Character();
    character.gun.loadBullets();
    //Show the starting tile
    tileset[character.tileX][character.tileY].show();
    setupZombies();
    game.start();
}

function update()
{
    game.clear();
    //Reload map after entering next room or reload after re-entering previous room
    if (character.tileX == map.endLocationRow && character.tileY == map.endLocationColumn)
    {
        currentRoom++;
        if (currentRoom >= rooms.length)
        {
            if (character.gun.gunTypeArray.length >= 4)
            {
                //Bonus for making it out alive
                score += 10000;
                game.stop();
                output2.innerHTML = "Congratulations!  You made it out and unlocked all the guns!<br>" +
                    "You killed " + zombiesKilled + " zombies and your score totalled " + score;
            }
            else
            {
                output2.innerHTML = "You do not have all the guns unlocked to make it out";
                character.endPosition();
                currentRoom--;
            }
        }
        else
        {
            map = rooms[currentRoom];
            loadTileMap();
            resetZombies();
            character.startPosition();
            //Show the starting tile
            tileset[character.tileX][character.tileY].show();
        }
    }
    else if (character.tileX == (map.playerStartLocation.row-1) && character.tileY == map.playerStartLocation.column)
    {
        if (currentRoom > 0)
        {
            currentRoom--;
            map = rooms[currentRoom];
            loadTileMap(true);
            resetZombies();
            character.endPosition();
            //Show the starting tile
            tileset[character.tileX][character.tileY].show();
        }
        else
        {
            character.startPosition();
        }
    }
    character.checkKeys();
    character.gun.checkKeys();
    character.checkZombieCollisions();
    lightAdjacentTiles();
    updateTiles();
    updateZombies();
    updateBullets();
    character.update();
    character.gun.update();
    if (character.health <= 0)
    {
        game.stop();
        output.innerHTML = "You killed " + zombiesKilled + " zombies and your score totalled " + score + " before perishing";
        output2.innerHTML = "";
    }
    else
    {
        //https://openclipart.org/detail/177336/key-a-by-fabuio-177336
        output.innerHTML = "Difficulty: " + difficulty + "<br>" +
            "You are in room " + (currentRoom + 1) + "<br>" +
            "Kill zombies to unlock guns and make it out alive!<br>" +
            difficultyScoringText +
            "Health : " + character.health + "<br>" +
            "Gun : " + character.gun.name + "<br>" +
            "Ammo : " + character.gun.ammo + "<br>" +
            "Score : " + score + "<br>" +
            "WASD to move<br>" +
            "Arrow Keys to change direction facing<br>" +
            "Spacebar to shoot/fire<br>" +
            "R to reload<br>" +
            "Q to cycle backward through guns<br>" +
            "E to cycle forward through guns<br>";
    }
}

//Difficulty ramping with character health, zombie damage and health, and gun unlocks being higher score
//Also a smaller viewing range for EXTREME difficulty
function difficultySelection()
{
    if (document.getElementById("Easy").checked)
    {
        difficulty = EASY;
        flag = false;
    }
    if (document.getElementById("Normal").checked)
    {
        difficulty = NORMAL;
        flag = false;
    }
    if (document.getElementById("Hard").checked)
    {
        difficulty = HARD;
        flag = false;
    }
    if (document.getElementById("Extreme").checked)
    {
        difficulty = EXTREME;
        flag = false;
    }
    //Default to NORMAL
    points = 3000;
    if (difficulty == EASY)
    {
        points = 1000;
    }
    else if (difficulty == HARD)
    {
        points = 5000;
    }
    else if (difficulty == EXTREME)
    {
        points = 7000;
    }
    var totalPoints = 3 * points;
    difficultyScoringText = "Every " + points + " points unlocks a new gun up to " + totalPoints + " (shotgun, assault, & sniper)<br>"
}