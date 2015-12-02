//Zombie class definitions
function Zombie()
{
    var zombieTypeChance = Math.floor(Math.random() * 100);
    var pic;
    var health;
    var worth;
    var width = 124;
    var height = 144;
    //This if else block will first look for anything less than 55
    //Then look for anything less than 75, which is automatically greater than or equal to 55
    //Then look for anything less than 90, which is automatically greater than or equal to 75
    //Then look for anything else, which is automatically greater than or equal to 90, but less than 100
    if (zombieTypeChance < 55)
    {
        pic = "normalZombieSheet.png";
        health = 50;
        worth = 50;
        damage = 1;
    }
    else if (zombieTypeChance < 75)
    {
        pic = "fastZombieSheet.png";
        health = 50;
        worth = 100;
        damage = 2;
    }
    else if (zombieTypeChance < 90)
    {
        pic = "bruteZombieSheet.png";
        health = 150;
        worth = 200;
        width = 192;
        height = 256;
        damage = 5;
    }
    else
    {
        pic = "armedZombieSheet.png";
        health = 300;
        worth = 500;
        damage = 10;
    }
    //Default difficulty is NORMAL
    if (difficulty == EASY)
    {
        health *= .5;
    }
    else if (difficulty == HARD)
    {
        health *= 1.5;
        damage *= 2;
    }
    else if (difficulty == EXTREME)
    {
        health *= 3;
        damage *= 3;
    }
    //Zombie sprite licensing
    //Curt - cjc83486 - http://opengameart.org/content/zombie-rpg-sprites
    var tZombie = new Sprite(game, pic, width, height);
    tZombie.health = health;
    tZombie.resetHealth = health;
    tZombie.dead = false;
    tZombie.worth = worth;
    tZombie.damage = damage;
    tZombie.setBoundAction(BOUNCE);
    tZombie.reset = function()
    {
        //Pick a location that is not on a wall/block or a door
        this.tileX = Math.floor(Math.random() * 20);
        this.tileY = Math.floor(Math.random() * 20);
        while (tileset[this.tileX][this.tileY].getState() != CONCRETE)
        {
            this.tileX = Math.floor(Math.random() * 20);
            this.tileY = Math.floor(Math.random() * 20);
        }
        this.setPosition(tileset[this.tileX][this.tileY].x, tileset[this.tileX][this.tileY].y);
    };
    tZombie.reset();
    //Each animation block is a 3x4 set of images
    tZombie.loadAnimation(width, height, width/3, height/4);
    tZombie.generateAnimationCycles();
    tZombie.renameCycles(new Array("down", "right", "up", "left"));
    tZombie.setAnimationSpeed(500);
    tZombie.setSpeed(0);
    tZombie.pauseAnimation();
    tZombie.setCurrentCycle("down");
    tZombie.move = function()
    {
        //Check the move chance
        var moveChance = Math.floor(Math.random() * 10);
        if (moveChance < 2)
        {
            //Check the random direction for possible moves then check for collisions against block for valid movement
            var randomDirection = Math.floor(Math.random() * 4);
            if (randomDirection == forward)
            {
                if (!this.checkBlockCollisions(forward))
                {
                    this.tileX -= 1;
                    this.setY(this.y - BLOCK_PIXEL_SIZE);
                    this.setCurrentCycle("up");
                    this.playAnimation();
                }
            }
            else if (randomDirection == left)
            {
                if (!this.checkBlockCollisions(left))
                {
                    this.tileY -= 1;
                    this.setX(this.x - BLOCK_PIXEL_SIZE);
                    this.setCurrentCycle("left");
                    this.playAnimation();
                }
            }
            else if (randomDirection == backward)
            {
                if (!this.checkBlockCollisions(backward))
                {
                    this.tileX += 1;
                    this.setY(this.y + BLOCK_PIXEL_SIZE);
                    this.setCurrentCycle("down");
                    this.playAnimation();
                }
            }
            else if (randomDirection == right)
            {
                if (!this.checkBlockCollisions(right))
                {
                    this.tileY += 1;
                    this.setX(this.x + BLOCK_PIXEL_SIZE);
                    this.setCurrentCycle("right");
                    this.playAnimation();
                }
            }
        }
    };
    //Check if the zombie collides with a block
    tZombie.checkBlockCollisions = function(moveDirection)
    {
        //Assume collision
        var collision = true;
        var offsetRow = 0;
        var offsetColumn = 0;
        //Check the passed in moveDirection
        if (moveDirection == forward)
        {
            offsetRow = -1;
        }
        else if (moveDirection == left)
        {
            offsetColumn = -1;
        }
        else if (moveDirection == backward)
        {
            offsetRow = 1;
        }
        else if (moveDirection == right)
        {
            offsetColumn = 1;
        }
        //Check if the next block movement is valid
        if ((this.tileX + offsetRow) >= 0 && (this.tileY + offsetColumn) >= 0 && (this.tileX + offsetRow) < ROWS && (this.tileY + offsetColumn) < COLUMNS)
        {
            if (tileset[this.tileX + offsetRow][this.tileY + offsetColumn].getState() == CONCRETE)
            {
                collision = false;
            }
        }
        return collision;
    };
    tZombie.collidesWithBullets = function(sprite)
    {
        if (this.visible)
        {
            var collision = true;
            if (this.distanceTo(sprite) > 16)
            {
                collision = false;
            }
        }
        return collision;
    };
    tZombie.checkCollisions = function()
    {
        //This is to help check for movement collisions
        var collision = false;
        //Check bullet collisions
        for (var i = 0; i < MAX_BULLETS; i++)
        {
            if (bullets[i].visible)
            {
                if (this.collidesWithBullets(bullets[i]))
                {
                    this.health -= character.gun.damage;
                    if (this.health <= 0)
                    {
                        zombiesKilled++;
                        score += this.worth;
                        this.dead = true;
                        this.hide();
                        this.health = this.resetHealth;
                    }
                }
            }
        }
        return collision;
    };
    return tZombie;
}

function setupZombies()
{
    //Initialize and instantiate the zombiesss
    zombies = new Array(NUM_ZOMBIES);
    for (var i = 0; i < NUM_ZOMBIES; i++)
    {
        zombies[i] = new Zombie();
        zombies[i].hide();
    }
}

function resetZombies()
{
    //This will reset the zombies so that they will respawn on different rooms
    //Even if killed in previous room(as zombies are reused from room to room)
    for (var i = 0; i < NUM_ZOMBIES; i++)
    {
        zombies[i].dead = false;
        zombies[i].reset();
    }   
}

function updateZombies()
{
    for (var i = 0; i < NUM_ZOMBIES; i++)
    {
        //Move method also checks for collisions
        zombies[i].move();
        if (tileset[zombies[i].tileX][zombies[i].tileY].visible)
        {
            if (!zombies[i].dead)
            {
                zombies[i].show();
            }
            zombies[i].checkCollisions();
        }
        else
        {
            zombies[i].hide();
        }
        zombies[i].update();
    }
}