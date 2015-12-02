var SMALL_CLIP = 10;
var LARGE_CLIP = 30;
//Can't have more than 30 bullets on the screen, because of reloading
var MAX_BULLETS = 30;
var currentBullet = 0;

//Gun class definitions
function Gun()
{
    //State array of following
    //  0 = pistol
    //  1 = shotgun
    //  2 = assault rifle
    //  3 = sniper rifle
    //  4 = laser
    //Initialize starting gun (pistol)
    //The gun is a custom sprite I created, it is pretty bad, but could be replaced by a better one and implemented into the sprite better
    var tGun = new Sprite(game, "gun.png", 5, 5);
    tGun.name = "pistol";
    tGun.gunType = 0;
    tGun.gunTypeArray = [];
    tGun.gunTypeArray.push(tGun.gunType);
    tGun.damage = 10;
    tGun.spread = 5;
    tGun.ammo = 10;
    tGun.delay = .5;
    //Define class methods
    tGun.loadBullets = function()
    {
        bullets = new Array(MAX_BULLETS);
        for (var i = 0; i < MAX_BULLETS; i++)
        {
            bullets[i] = new Bullet();
        }//End for
    };//End tGun.loadBullets
    tGun.checkKeys = function()
    {
        var elapsedTime2 = timer2.getElapsedTime();
        var elapsedTime3 = timer3.getElapsedTime();
        //Cycle guns back
        if (elapsedTime2 > cycleGunDelay)
        {
            if (keysDown[K_Q])
            {
                this.cycleBack();
            }//End if
            timer2.reset();
        }
        //Cycle guns forward
        if (elapsedTime2 > cycleGunDelay)
        {
            if (keysDown[K_E])
            {
                this.cycleForward();
            }//End if
            timer2.reset();
        }
        //Reload
        if (keysDown[K_R])
        {
            this.reload();
        }//End if
        //Fire/Shoot
        if (keysDown[K_SPACE])
        {
            if (this.ammo > 0)
            {
                if (elapsedTime3 > this.delay)
                {
                    currentBullet++;
                    if (currentBullet >= this.ammo)
                    {
                        currentBullet = 0;
                    }//End if
                    this.fire();
                    timer3.reset();
                }//End if
            }//End if
            else
            {
                emptyClip.play();
                emptyClip2.play();
                output2.innerHTML = "You must reload! (press R)";
            }//End else
        }
    };//End tGun.checkKeys
    tGun.cycleBack = function()
    {
        if (this.gunTypeArray.indexOf(this.gunType) == 0)
        {
            this.gunType = this.gunTypeArray[this.gunTypeArray.length-1];
        }//End if
        else
        {
            this.gunType = this.gunTypeArray[this.gunTypeArray.indexOf(this.gunType)-1];
        }//End else
        //Reloading so you have a full clip when switching to a new gun
        this.reload();
    };//End tGun.cycleBack
    tGun.cycleForward = function()
    {
        if (this.gunTypeArray.indexOf(this.gunType) == (this.gunTypeArray.length - 1))
        {
            this.gunType = 0;
        }//End if
        else
        {
            this.gunType = this.gunTypeArray[this.gunTypeArray.indexOf(this.gunType)+1];
        }//End else
        //Reloading so you have a full clip when switching to a new gun
        this.reload();
    };//End this.cycleForward
    tGun.reload = function()
    {
        //Larger clip for shotgun and assault rifle
        if (this.gunType == 1 || this.gunType == 2)
        {
            this.ammo = LARGE_CLIP
        }//End if
        else
        {
            this.ammo = SMALL_CLIP;
        }//End else
        output2.innerHTML = "";
    };//End this.reload
    tGun.fire = function()
    {
        //Shotgun shoots 3 bullets at once from clip
        if (this.gunType == 1)
        {
            this.ammo -= 3;
            bullets[currentBullet].fire();
            currentBullet++;
            bullets[currentBullet].fire();
            currentBullet++;
            bullets[currentBullet].fire();
        }//End if
        else
        {
            this.ammo--;
            bullets[currentBullet].fire();
        }//End else
    };//End this.fire
    tGun.update = function()
    {
        if (score > points && this.gunTypeArray.indexOf(1) == -1)
        {
            //Add the shotgun to the inventory
            this.gunTypeArray.push(1);
            output2.innerHTML = "You unlocked the shotgun!";
        }
        if (score > (2 * points) && this.gunTypeArray.indexOf(2) == -1)
        {
            //Add the assault rifle to the inventory
            this.gunTypeArray.push(2);
            output2.innerHTML = "You unlocked the assault rifle!";
        }
        if (score > (3 * points) && this.gunTypeArray.indexOf(3) == -1)
        {
            //Add the sniper rifle to the inventory
            this.gunTypeArray.push(3);
            output2.innerHTML = "You unlocked the sniper rifle!";
        }
        if (this.gunType == 0)
        {
            this.name = "pistol";
            this.damage = 10;
            this.spread = 5;
            this.delay = .25;
        }//End if
        else if (this.gunType == 1)
        {
            this.name = "shotgun";
            this.damage = 25;
            this.spread = 10;
            this.delay = .25;
        }//End else if
        else if (this.gunType == 2)
        {
            this.name = "assault rifle";
            this.damage = 25;
            this.spread = 5;
            this.delay = .05;
        }//End else if
        else if (this.gunType == 3)
        {
            this.name = "sniper rifle";
            this.damage = 100;
            this.spread = 0;
            this.delay = .5;
        }//End else if
    };//End this.update
    return tGun;
}//End Gun class

function Bullet()
{
    //The bullet is a sprite I created myself
    var tBullet = new Sprite(game, "bullet.png", 5, 5);
    tBullet.hide();
    tBullet.setBoundAction(DIE);
    tBullet.fire = function()
    {
        this.show();
        var modifier = (Math.random() * character.gun.spread) - (character.gun.spread / 2);
        this.setAngle(character.directionFacing + modifier);
        this.setSpeed(20);
        this.setPosition(tileset[character.tileX][character.tileY].x, tileset[character.tileX][character.tileY].y);
    };
    tBullet.checkBlockCollisions = function()
    {
        //Assume no collision
        var collision = false;
        for (var row = 0; row < ROWS; row++)
        {
            for (var column = 0; column < COLUMNS; column++)
            {
                if (tileset[row][column].getState() != CONCRETE && this.collidesWith(tileset[row][column]))
                {
                    collision = true;
                    break;
                }
            }
            if (collision)
            {
                break;
            }
        }
        return collision;
    };
    return tBullet;
}

function updateBullets()
{
    for (var i = 0; i < MAX_BULLETS; i++)
    {
        if (bullets[i].checkBlockCollisions())
        {
            bullets[i].hide();
        }
        bullets[i].update();
    }
}