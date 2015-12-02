//Tile class definitions
function Tile()
{
    //All tile images were created by me
    tTile = new Sprite(game, "concrete.png", BLOCK_PIXEL_SIZE, BLOCK_PIXEL_SIZE);
    tTile.setSpeed(0);
    tTile.state = CONCRETE;
    //Block is in here twice to account for the outer walls and the inner walls
    tTile.images = new Array("block.png", "concrete.png", "block.png", "door.png");
    tTile.row = 0;
    tTile.column = 0;
    tTile.setState = function(state)
    {
        this.state = state;
        this.setImage(this.images[this.state]);
    }
    tTile.getRow = function()
    {
        return this.row;
    }
    tTile.getColumn = function()
    {
        return this.column;
    }
    tTile.getState = function()
    {
        return this.state;
    }
    return tTile;
}

function setupTiles()
{
    tileset = new Array(ROWS);
    for (var row = 0; row < ROWS; row++)
    {
        var tempRow = new Array(COLUMNS);
        for (var column = 0; column < COLUMNS; column++)
        {
            tempRow[column] = new Tile();
            xPos = BLOCK_PIXEL_SIZE / 2 + (BLOCK_PIXEL_SIZE * column);
            yPos = BLOCK_PIXEL_SIZE / 2 + (BLOCK_PIXEL_SIZE * row);
            tempRow[column].setPosition(xPos, yPos);
            tempRow[column].row = row;
            tempRow[column].column = column;
        }
        tileset[row] = tempRow;
    }
}

function loadTileMap(bShowAll)
{
    if (bShowAll == undefined || bShowAll == null)
    {
        bShowAll = false;
    }
    for (var row = 0; row < ROWS; row++)
    {
        for (var column = 0; column < COLUMNS; column++)
        {
            var currentVal = map[row][column];
            if ((row == (map.playerStartLocation.row-1) && column == map.playerStartLocation.column))
            {
                tileset[row][column].setState(3);
            }
            else if (row == map.endLocationRow && column == map.endLocationColumn)
            {
                tileset[row][column].setState(3);
            }
            else
            {
                tileset[row][column].setState(currentVal);
            }
            //Allow ability to show all (for previously explored rooms)
            if (!bShowAll)
            {
                tileset[row][column].hide();
            }
            else
            {
                tileset[row][column].show();
            }
        }
    }
}

function lightAdjacentTiles()
{
    //The tiles that have already been 'discovered" will remain visible
    //Up 1
    if ((character.tileY - 1) >= 0)
    {
        tileset[character.tileX][character.tileY-1].show();
    }
    //Down 1
    if ((character.tileY + 1) < ROWS)
    {
        tileset[character.tileX][character.tileY+1].show();
    }
    //Left 1
    if ((character.tileX - 1) >= 0)
    {
        tileset[character.tileX-1][character.tileY].show();
    }
    //Right 1
    if ((character.tileX + 1) < COLUMNS)
    {
        tileset[character.tileX+1][character.tileY].show();
    }

    //This will make the tiles within two spaces to the character visible
    if (difficulty != EXTREME)
    {
        //Up 1, Left 1
        if ((character.tileY - 1) >= 0 && (character.tileX - 1) >= 0)
        {
            tileset[character.tileX-1][character.tileY-1].show();
        }
        //Up 1, Right 1
        if ((character.tileY - 1) >= 0 && (character.tileX + 1) < COLUMNS)
        {
            tileset[character.tileX+1][character.tileY-1].show();
        }
        //Down 1, Left 1
        if ((character.tileY + 1) < ROWS && (character.tileX - 1) >= 0)
        {
            tileset[character.tileX-1][character.tileY+1].show();
        }
        //Down 1, Right 1
        if ((character.tileY + 1) < ROWS && (character.tileX + 1) < COLUMNS)
        {
            tileset[character.tileX+1][character.tileY+1].show();
        }
        //Up 2
        if ((character.tileY - 2) >= 0)
        {
            tileset[character.tileX][character.tileY-2].show();
        }
        //Down 2
        if ((character.tileY + 2) < ROWS)
        {
            tileset[character.tileX][character.tileY+2].show();
        }
        //Left 2
        if ((character.tileX - 2) >= 0)
        {
            tileset[character.tileX-2][character.tileY].show();
        }
        //Right 2
        if ((character.tileX + 2) < COLUMNS)
        {
            tileset[character.tileX+2][character.tileY].show();
        }
    }
}

function updateTiles()
{
    for (row = 0; row < ROWS; row++)
    {
        for (column = 0; column < COLUMNS; column++)
        {
            tileset[row][column].update();
        }
    }
}