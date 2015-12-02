//This file is ported over from a Java version I had written previously

function generateMaze()
{
    //Limit movement options for generation
    //Iteration to test cases until all options are eliminated
    //Use stack for spiral maze case
    //Randomly generates a path from beginning to end
    //Declare and initialize/instantiate local variables
    maze = new Array(mazeSize);
    var startLocation = Math.floor((mazeSize-1) / 2) + Math.floor(Math.random() * 2);
    maze.playerStartLocation = new Location(1, startLocation);
    maze.endLocationRow;
    maze.endLocationColumn;
    var keepgoing1 = true;
    var keepgoing2 = true;
    var leftChecked = false;
    var forwardChecked = false;
    var rightChecked = false;
    var backwardChecked = false;
    var randomDirection = 0;
    var previousPath = backward;
    //Will store a stack for the case where it spirals into itself
    var path = [];
    
    //Initialize maze and generate the outer walls
    for(var i = 0; i < mazeSize; i++)
    {
        maze[i] = new Array(mazeSize);
        for(var j = 0; j < mazeSize; j++)
        {
            if(i == 0 || i == (mazeSize-1) || j == 0 || j == (mazeSize-1))
            {
                maze[i][j] = 2;
            }//End if
            else
            {
                maze[i][j] = 0;
            }
        }//End j for loop
    }//End i for loop
    
    //Start near the middle
    var currLocation = new Location(0, startLocation);
    maze[currLocation.getRow()][currLocation.getColumn()] = 1;
    
    //Go forward first to get into the maze
    currLocation.setRow(currLocation.getRow()+1);
    maze[currLocation.getRow()][currLocation.getColumn()] = 1;
    
    //While loop to randomly generate the maze until at the last row
    while(keepgoing1)
    {
        keepgoing2 = true;
        leftChecked = false;
        forwardChecked = false;
        rightChecked = false;
        backwardChecked = false;
        //While loop to store random number in randomDirection
        while(keepgoing2)
        {
            randomDirection = Math.floor(Math.random() * 4);
            //Determine if direction is possible
            //Regenerate random if necessary
            //Check if not at edge of maze
            if(currLocation.getRow() != 0 && currLocation.getColumn() != 0 && currLocation.getColumn() != (mazeSize-1))
            {
                if(randomDirection == left)
                {
                    //Check if not already a path
                    if(maze[currLocation.getRow()][currLocation.getColumn()+1] == 0)
                    {
                        currLocation.setColumn(currLocation.getColumn()+1);
                        maze[currLocation.getRow()][currLocation.getColumn()] = 1;
                        //Store row then column on a stack
                        path.push(currLocation.getRow());
                        path.push(currLocation.getColumn());
                        keepgoing2 = false;
                    }//End if not already a path
                    else
                    {
                        leftChecked = true;
                    }//End else
                }//End if left
                else if(randomDirection == forward)
                {
                    //Check if not already a path
                    if(maze[currLocation.getRow()+1][currLocation.getColumn()] == 0)
                    {
                        currLocation.setRow(currLocation.getRow()+1);
                        maze[currLocation.getRow()][currLocation.getColumn()] = 1;
                        path.push(currLocation.getRow());
                        path.push(currLocation.getColumn());
                        keepgoing2 = false;
                    }//End if not already a path
                    //Check for the end of the maze
                    else if(maze[currLocation.getRow()+1][currLocation.getColumn()] == 2)
                    {
                        currLocation.setRow(currLocation.getRow()+1);
                        maze[currLocation.getRow()][currLocation.getColumn()] = 1;
                        path.push(currLocation.getRow());
                        path.push(currLocation.getColumn());
                        maze.endLocationRow = currLocation.getRow();
                        maze.endLocationColumn = currLocation.getColumn();
                        keepgoing2 = false;
                        keepgoing1 = false;
                        continue;
                    }//End if
                    else
                    {
                        forwardChecked = true;
                    }//End else
                }//End if forward
                else if(randomDirection == right)
                {
                    //Check if not already a path
                    if(maze[currLocation.getRow()][currLocation.getColumn()-1] == 0)
                    {
                        currLocation.setColumn(currLocation.getColumn()-1);
                        maze[currLocation.getRow()][currLocation.getColumn()] = 1;
                        path.push(currLocation.getRow());
                        path.push(currLocation.getColumn());
                        keepgoing2 = false;
                    }//End if not already a path
                    else
                    {
                        rightChecked = true;
                    }//End else
                }//End if right
                else if(randomDirection == backward)
                {
                    //Check if not already a path
                    if(maze[currLocation.getRow()-1][currLocation.getColumn()] == 0)
                    {
                        currLocation.setRow(currLocation.getRow()-1);
                        maze[currLocation.getRow()][currLocation.getColumn()] = 1;
                        path.push(currLocation.getRow());
                        path.push(currLocation.getColumn());
                        keepgoing2 = false;
                    }//End if not already a path
                    else
                    {
                        backwardChecked = true;
                    }//End else
                }//End if backward
            }//End if to check for edge of maze
            
            //Check to see if at the last row
            for(var i = 0; i < mazeSize; i++)
            {
                if(maze[mazeSize-1][i] == 1)
                {
                    maze.endLocationRow = mazeSize-1;
                    maze.endLocationColumn = i;
                    console.log(maze.endLocationRow);
                    console.log(maze.endLocationColumn);
                    keepgoing2 = false;
                    keepgoing1 = false;
                }//End if statement
            }//End i for loop
            
            //Check for spiral and edge of maze, then go back through path
            if(maze[currLocation.getRow()][currLocation.getColumn()+1] > 0 && 
                    maze[currLocation.getRow()+1][currLocation.getColumn()] > 0 && 
                    maze[currLocation.getRow()][currLocation.getColumn()-1] > 0 && 
                    maze[currLocation.getRow()-1][currLocation.getColumn()] > 0)
            {
                if(path.length <= 0)
                {
                    //Check the outside edges to find a path to create an exit
                    for(var i = 0; i < mazeSize; i++)
                    {
                        //Check bottom edge
                        if(maze[mazeSize-2][i] == 1)
                        {
                            maze[mazeSize-1][i] = 1;
                            maze.endLocationRow = mazeSize - 1;
                            maze.endLocationColumn = i;
                            i = mazeSize;
                        }//End if bottom
                        //Check left edge
                        else if(maze[mazeSize-1-i][mazeSize-2] == 1)
                        {
                            maze[mazeSize-1-i][mazeSize-1] = 1;
                            maze.endLocationRow = i;
                            maze.endLocationColumn = mazeSize - 1;
                            i = mazeSize;
                        }//End else if left
                        //Check right edge
                        else if(maze[mazeSize-1-i][1] == 1)
                        {
                            maze[mazeSize-1-i][0] = 1;
                            maze.endLocationRow = i;
                            maze.endLocationColumn = 0;
                            i = mazeSize;
                        }//End else if right
                        //Check top edge
                        else if(maze[1][i] == 1 && (i != (mazeSize-1)/2 || i != mazeSize/2))
                        {
                            maze[0][i] = 1;
                            maze.endLocationRow = 0;
                            maze.endLocationColumn = i;
                            i = mazeSize;
                        }//End if top edge
                    }//End check edges for loop
                    keepgoing1 = false;
                    keepgoing2 = false;
                }//End if path is empty
                else
                {
                    currLocation.setColumn(path.pop());
                    currLocation.setRow(path.pop());
                    keepgoing2 = false;
                }//End else
            }//End if to check for spiral
        }//End while keepgoing2 loop
    }//End while keepgoing1 loop
    
    //Test maze generation, useful for debugging
    // for(var k = 0; k < mazeSize; k++)
    // {
    //     for(var l = 0; l < mazeSize; l++)
    //     {
    //         console.log(maze[k][l]);
    //     }
    //     console.log("\n");
    // }
    return maze;
}//End generateMaze function

function Location(row, column)
{
	this.row = row;
	this.column = column;
	
	this.getRow = function()
	{
		return this.row;
	}//End getRow method
	
	this.setRow = function(row)
	{
		this.row = row;
	}//End setRow method
	
	this.getColumn = function()
	{
		return this.column;
	}//End getColumn method
	
	this.setColumn = function(column)
	{
		this.column = column;
	}//End setColumn method
}//End Location class