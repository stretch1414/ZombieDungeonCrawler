//Character class definitions
function Character()
{
    //Character sprite licensing
    //makrohn GitHub
    //https://github.com/makrohn/Universal-LPC-spritesheet
    //Dual-licensed, links below (taken from github listing as described)
    //http://creativecommons.org/licenses/by-sa/3.0/
    //http://gaurav.munjal.us/Universal-LPC-Spritesheet-Character-Generator/LICENSE
    var tCharacter = new Sprite(game, "characterSheet2.png", 576, 256);
    tCharacter.health = 1000;
    tCharacter.directionFacing = DOWN;
    
    //Each animation block is a 9x4 set of images
    tCharacter.loadAnimation(576, 256, 64, 64);
    tCharacter.generateAnimationCycles();
    tCharacter.renameCycles(new Array("up", "left", "down", "right"));
    tCharacter.setAnimationSpeed(500);
    //Starting tile positions
    tCharacter.startPosition = function()
    {
        this.tileX = map.playerStartLocation.getRow();
        this.tileY = map.playerStartLocation.getColumn();
        var tempY = tileset[this.tileX][this.tileY].y - this.animation.cellHeight / 8;
        this.setPosition(tileset[this.tileX][this.tileY].x, tempY);
    };
    tCharacter.endPosition = function()
    {
        this.tileX = map.endLocationRow - 1;
        this.tileY = map.endLocationColumn;
        var tempY = tileset[this.tileX][this.tileY].y - this.animation.cellHeight / 8;
        this.setPosition(tileset[this.tileX][this.tileY].x, tempY);
    };
    tCharacter.startPosition();
    tCharacter.setSpeed(0);
    tCharacter.pauseAnimation();
    tCharacter.setCurrentCycle("down");
    //Declare a new instance of the gun class
    tCharacter.gun = new Gun();
    tCharacter.gun.setPosition(tCharacter.x, tCharacter.y);
    //Just move the map, don't actually move the character
    tCharacter.checkKeys = function()
    {
        //TODO - add option for moving and looking a different direction
        //Use arrow keys for changing look direction, use WASD for movement
        //This will account for the key being held down
        //but will still play the animation and move correctly
        var elapsedTime;
        var elapsedTime4;
        //Move Up
        if (keysDown[K_W])
        {
            elapsedTime = timer.getElapsedTime();
            if (elapsedTime > moveDelay)
            {
                if (!this.checkBlockCollisions(forward))
                {
                    this.tileX -= 1;
                    this.setY(this.y - BLOCK_PIXEL_SIZE);
                }
                this.directionFacing = UP;
                this.setCurrentCycle("up");
                this.playAnimation();
                timer.reset();
            }
        }
        //Turn to face Up
        if (keysDown[K_UP])
        {
            elapsedTime4 = timer4.getElapsedTime();
            if (elapsedTime4 > moveDelay)
            {
                this.directionFacing = UP;
                this.setCurrentCycle("up");
                timer4.reset();
            }
        }
        //Move Left
        if (keysDown[K_A])
        {
            elapsedTime = timer.getElapsedTime();
            if (elapsedTime > moveDelay)
            {
                if (!this.checkBlockCollisions(left))
                {
                    this.tileY -= 1;
                    this.setX(this.x - BLOCK_PIXEL_SIZE);
                }
                this.directionFacing = LEFT;
                this.setCurrentCycle("left");
                this.playAnimation();
                timer.reset();
            }
        }
        //Turn to face Left
        if (keysDown[K_LEFT])
        {
            elapsedTime4 = timer4.getElapsedTime();
            if (elapsedTime4 > moveDelay)
            {
                this.directionFacing = LEFT;
                this.setCurrentCycle("left");
                timer4.reset();
            }
        }
        //Move Down
        if (keysDown[K_S])
        {
            elapsedTime = timer.getElapsedTime();
            if (elapsedTime > moveDelay)
            {
                if (!this.checkBlockCollisions(backward))
                {
                    this.tileX += 1;
                    this.setY(this.y + BLOCK_PIXEL_SIZE);
                }
                this.directionFacing = DOWN;
                this.setCurrentCycle("down");
                this.playAnimation();
                timer.reset();
            }
        }
        //Turn to face Down
        if (keysDown[K_DOWN])
        {
            elapsedTime4 = timer4.getElapsedTime();
            if (elapsedTime4 > moveDelay)
            {
                this.directionFacing = DOWN;
                this.setCurrentCycle("down");
                timer4.reset();
            }
        }
        //Move Right
        if (keysDown[K_D])
        {
            elapsedTime = timer.getElapsedTime();
            if (elapsedTime > moveDelay)
            {
                if (!this.checkBlockCollisions(right))
                {
                    this.tileY += 1;
                    this.setX(this.x + BLOCK_PIXEL_SIZE);
                }
                this.directionFacing = RIGHT;
                this.setCurrentCycle("right");
                this.playAnimation();
                timer.reset();
            }
        }
        //Turn to face Right
        if (keysDown[K_RIGHT])
        {
            elapsedTime4 = timer4.getElapsedTime();
            if (elapsedTime4 > moveDelay)
            {
                this.directionFacing = RIGHT;
                this.setCurrentCycle("right");
                timer4.reset();
            }
        }
        if (!keysDown[K_W] && !keysDown[K_A] && !keysDown[K_S] && !keysDown[K_D])
        {
            this.pauseAnimation();
        }
    };
    //Check if the character collides with a block
    tCharacter.checkBlockCollisions = function(moveDirection)
    {
        if (this.visible)
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
                if (map[this.tileX + offsetRow][this.tileY + offsetColumn] == 1)
                {
                    collision = false;
                }
            }
        }
        return collision;
    };
    tCharacter.checkZombieCollisions = function()
    {
        if (this.visible)
        {
            //Assume no collision
            var collision = false;
            var damage = [];
            for (var i = 0; i < NUM_ZOMBIES; i++)
            {
                if (tileset[this.tileX][this.tileY].x == tileset[zombies[i].tileX][zombies[i].tileY].x && 
                    tileset[this.tileX][this.tileY].y == tileset[zombies[i].tileX][zombies[i].tileY].y && 
                    zombies[i].visible)
                {
                    collision = true;
                    damage.push(zombies[i].damage);
                }
            }
            if (collision)
            {
                for (var i = 0; i < damage.length; i++)
                {
                    this.health -= damage[i];
                }
            }
        }
    }
    return tCharacter;
}