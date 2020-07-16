/*
The Game Project 6 - Adding game mechanics
*/

var gameChar_x;
var gameChar_world_x;
var gameChar_y;
var floorPos_y;
var scrollPos;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;

var mountains;

var trees;

var canyons;

var collectable;

var game_score;

var flagpole; 

var lives;

var enemies;

var backgroundSound


function preload()
{
    
    //loading the background sound
    soundFormats('mp3');
    backgroundSound = loadSound('assets/game.mp3');
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    
    lives = 4;
    
    startGame();
    
    //looping the background sound
    backgroundSound.setVolume(0.1);
    backgroundSound.loop();
    
}



// Function that is called everytime a life is lost and at the start of the game
function startGame()
{
    
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

    
    
	// Initialisation (of arrays of scenery objects).
    trees = [
        {y_pos: height/2.5, x_pos: -200},
        {y_pos: height/2.5, x_pos: 100},
        {y_pos: height/2.5, x_pos: 220},
        {y_pos: height/2.5, x_pos: 488},
        {y_pos: height/2.5, x_pos: 852},
        {y_pos: height/2.5, x_pos: 1024},
        {y_pos: height/2.5, x_pos: 1220}
    ]
    
    clouds = [
        {x_pos: -50, y_pos: random(0, 180), size: 1},
        {x_pos: 400, y_pos: random(0, 180), size: 1},
        {x_pos: 800, y_pos: random(0, 180), size: 1},
        {x_pos: 1300, y_pos: random(0, 180), size: 1}
    ]
    
    mountains = [
        {x_pos: -500, size: 1},
        {x_pos: 0, size: 1},
        {x_pos: 570, size: 1},
        {x_pos: 980, size: 1},
        {x_pos: 1100, size: 1},
    ]
    
    canyons = [
        {x_pos: 120, width: 100},
        {x_pos: 550, width: 80},
        {x_pos: 940, width: 100},
        {x_pos: 1500, width: 70},
        {x_pos: 1970, width: 140}
    ]
    
    collectable = [
        {x_pos: 100, y_pos: 411, size: 46, isFound: false},
        {x_pos: 340, y_pos: 411, size: 46, isFound: false},
        {x_pos: 980, y_pos: 411, size: 46, isFound: false},
        {x_pos: 1700, y_pos: 411, size: 46, isFound: false}
    ]
    
    game_score = 0;
    
    // The flagpole is a tent which lights up
    flagpole = {
        x_pos: 1900,
        isReached: false
    }

    // To update the lives
    lives -= 1;
    
    // For the enemies
    enemies = [];

    enemies.push(new Enemy(0, floorPos_y, 100));
    enemies.push(new Enemy(900, floorPos_y, 100));
    enemies.push(new Enemy(1400, floorPos_y, 100));
    enemies.push(new Enemy(1750, floorPos_y, 100));
}

function draw()
{
    
	background(170, 169, 178); //fill the sky gray

	noStroke();
	fill(160, 82, 45); // draw some brown ground
	rect(0, floorPos_y, width, height/4);
    
    push();
    translate(scrollPos, 0);

    drawClouds();
    
    drawMountains();

    drawTrees();

	// Draw canyons
    for(var i = 0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
            if (isPlummeting == true)
                {
                    gameChar_y += 9;
                }
        }

    // Draw collectable items
    for(var i = 0; i < collectable.length; i++)
        {

            if(collectable[i].isFound == false)
                {
                    drawCollectable(collectable[i]);
                    checkCollectable(collectable[i]);
                }
        }
    
    // The flagpole is a tent which lights up
    renderFlagpole();
    
    // For the Enemy 
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break;
        }
    }

	pop();
    
    // Text displays when you have lost
    if(lives == 0)
    {
        fill(50);
        stroke(255);
        strokeWeight(3);
        textSize(40);
        text("Game over, press space to continue.", width/5, height/2);
        return;
    }
    
    // Text displays when you have won
    if(flagpole.isReached == true)
    {
        fill(229, 157, 14);
        stroke(255);
        strokeWeight(3);
        textSize(40);
        text("Level complete! Press space to continue.", width/5, height/2);
        return;
    }
    
    
    // Draw game character.
	drawGameChar();
    
    //draw the score on the screen
    fill(255);
    noStroke();
    textSize(17);
    text("Score: " + game_score, 20, 30);
    
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    
    
    
    //logic for character to jump, then fall down
    
    if(floorPos_y != gameChar_y)
        {
            gameChar_y += 1;
            isFalling = true;
        }
    else
        {
            isFalling = false;
        }
    
    
    //to check the flagpole
    
    if(flagpole.isReached != true)
    {
        checkFlagpole();
    }
    
    
    
    //to reset the game after each heart is lost
    
    if(gameChar_y > floorPos_y + 200 && lives >= 1)
    {
        startGame();
    }

    
    
    //Drawing the hearts <lives>
    
    for(var i = 0; i < lives; i++)
    {
        fill(128, 0, 0);
        quad((60 * [i]) + 120, 33,
             (60 * [i]) + 123, 55,
             (60 * [i]) + 141, 30,
             (60 * [i]) + 128, 25);
        fill(255, 0, 0);
        quad((60 * [i]) + 109, 16,
             (60 * [i]) + 127, 28,
             (60 * [i]) + 120, 57,
             (60 * [i]) + 102, 27);
        quad((60 * [i]) + 129, 15,
             (60 * [i]) + 119, 28,
             (60 * [i]) + 134, 38,
             (60 * [i]) + 141, 21);
        fill(128, 0, 0);
        quad((60 * [i]) + 110, 28,
             (60 * [i]) + 107, 48,
             (60 * [i]) + 119, 42,
             (60 * [i]) + 117, 27);
    }
    
   
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

}





// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    //For the next level
    if(flagpole.isReached && key == ' ')
    {
        //nextLevel();
        
        //added to the command I had to copy, so my personal game would re-start when space was pressed. The command above was commented out as otherwise it does not work (re-starting the level) but you can add it in and delete this to link all the levels together.
        startGame();
        lives = 3;
        return;
    }
    else if(lives == 0 && key == ' ')
    {
        //returnToStart();
        
        //added to the command I had to copy, so my personal game would re-start when space was pressed. The command above was commented out as otherwise it does not work (re-starting the level) but you can add it in and delete this to link all the levels together.
        startGame();
        lives = 3;
        return;
    }
    
    
	// If statements to control the animation of the character when keys are pressed.

    // 37 == left
    // 39 == right
    // 32 == space bar, 38 == up arrow
      
    if(keyCode == 37)
       {
            isLeft = true;
       }

    if(keyCode == 39)
        {
            isRight = true; 
        }
    
    if(gameChar_y != floorPos_y)
        {
            keyCode = false;
        }
    
    if(keyCode == 32)
        {
            gameChar_y -= 100;
        }
}



function keyReleased()
{
    // If statements to control the animation of the character when keys are released.
    
    if(keyCode == 37)
       {
            isLeft = false;
       }

    if(keyCode == 39)
        {
            isRight = false; 
        }
}




// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
    // The "jumpin-left code" or "walking-right code"... comments are for each of the different ways I drew the poses of the game character (beetle). So a different pose will be drawn in each different state.
    
	fill(0);
	//the game character
	if(isLeft && isFalling)
	{
        // Jumping-left code

        //body
        ellipse(gameChar_x + 0.5, gameChar_y - 25, 27, 25);
        //head
        ellipse(gameChar_x + 0.5, gameChar_y - 38, 15, 15);
        //antenna left
        triangle(gameChar_x - 6, gameChar_y - 41, 
                 gameChar_x - 3, gameChar_y - 44, 
                 gameChar_x - 9, gameChar_y - 51);
        triangle(gameChar_x - 9, gameChar_y - 51,
                 gameChar_x - 8, gameChar_y - 47,
                 gameChar_x - 1, gameChar_y - 54);
        //antenna right
        triangle(gameChar_x + 1, gameChar_y - 41,
                 gameChar_x + 7, gameChar_y - 41,
                 gameChar_x + 10, gameChar_y - 51);
        triangle(gameChar_x + 10, gameChar_y - 51,
                 gameChar_x + 9, gameChar_y - 47,
                 gameChar_x + 2, gameChar_y - 54);
        //eyes
        fill(255);
        ellipse(gameChar_x - 4, gameChar_y - 41, 3);
        ellipse(gameChar_x + 1, gameChar_y - 41, 3);
        fill(0);
        //arms
        strokeWeight(1.5);
        stroke(0);
        //arm, top right
        line(gameChar_x + 12, gameChar_y - 25,
             gameChar_x + 15, gameChar_y - 28);
        //arm, top left
        line(gameChar_x - 11, gameChar_y - 25,
             gameChar_x - 14, gameChar_y - 30);
        //arm, bottom left
        line(gameChar_x - 9, gameChar_y - 17,
             gameChar_x - 11, gameChar_y - 16);
        //arm, bottom right
        line(gameChar_x + 9, gameChar_y - 17,
             gameChar_x + 11, gameChar_y - 16);
        //left leg
        line(gameChar_x - 6, gameChar_y - 14,
             gameChar_x - 8, gameChar_y - 6);
        line(gameChar_x - 8, gameChar_y - 6,
             gameChar_x - 7, gameChar_y + 2);
        //right leg
        line(gameChar_x + 5, gameChar_y - 15,
             gameChar_x + 5.5, gameChar_y - 6);
        line(gameChar_x + 5.5, gameChar_y - 6,
             gameChar_x + 7, gameChar_y + 2);
        strokeWeight(1);

	}
	else if(isRight && isFalling)
	{
		// Jumping-right code
        
        //body
        ellipse(gameChar_x + 0.5, gameChar_y - 25, 27, 25);
        //head
        ellipse(gameChar_x + 0.5, gameChar_y - 38, 15, 15);
        //antenna left
        triangle(gameChar_x - 6, gameChar_y - 41, 
                 gameChar_x - 3, gameChar_y - 44, 
                 gameChar_x - 9, gameChar_y - 51);
        triangle(gameChar_x - 9, gameChar_y - 51,
                 gameChar_x - 8, gameChar_y - 47,
                 gameChar_x - 1, gameChar_y - 54);
        //antenna right
        triangle(gameChar_x + 1, gameChar_y - 41,
                 gameChar_x + 7, gameChar_y - 41,
                 gameChar_x + 10, gameChar_y - 51);
        triangle(gameChar_x + 10, gameChar_y - 51,
                 gameChar_x + 9, gameChar_y - 47,
                 gameChar_x + 2, gameChar_y - 54);
        //eyes
        fill(255);
        ellipse(gameChar_x, gameChar_y - 41, 3);
        ellipse(gameChar_x + 5, gameChar_y - 41, 3);
        fill(0);
        //arms
        strokeWeight(1.5);
        stroke(0);
        //arm, top right
        line(gameChar_x + 12, gameChar_y - 25,
             gameChar_x + 15, gameChar_y - 30);
        //arm, top left
        line(gameChar_x - 11, gameChar_y - 25,
             gameChar_x - 14, gameChar_y - 28);
        //arm, bottom left
        line(gameChar_x - 9, gameChar_y - 17,
             gameChar_x - 11, gameChar_y - 16);
        //arm, bottom right
        line(gameChar_x + 9, gameChar_y - 17,
             gameChar_x + 11, gameChar_y - 16);
        //left leg
        line(gameChar_x - 6, gameChar_y - 15,
             gameChar_x - 6, gameChar_y - 6);
        line(gameChar_x - 6, gameChar_y - 6,
             gameChar_x - 7, gameChar_y + 2);
        //right leg
        line(gameChar_x + 5, gameChar_y - 15,
             gameChar_x + 7, gameChar_y - 6);
        line(gameChar_x + 7, gameChar_y - 6,
             gameChar_x + 7, gameChar_y + 2);
        strokeWeight(1);

	}
	else if(isLeft)
	{
		// Walking left code
        
        //body
        ellipse(gameChar_x + 0.5, gameChar_y - 25, 27, 25);
        //head
        ellipse(gameChar_x + 0.5, gameChar_y - 38, 15, 15);
        //antenna left
        triangle(gameChar_x - 6, gameChar_y - 41, 
                 gameChar_x - 3, gameChar_y - 44, 
                 gameChar_x - 9, gameChar_y - 51);
        triangle(gameChar_x - 9, gameChar_y - 51,
                 gameChar_x - 8, gameChar_y - 47,
                 gameChar_x - 1, gameChar_y - 54);
        //antenna right
        triangle(gameChar_x + 1, gameChar_y - 41,
                 gameChar_x + 7, gameChar_y - 41,
                 gameChar_x + 10, gameChar_y - 51);
        triangle(gameChar_x + 10, gameChar_y - 51,
                 gameChar_x + 9, gameChar_y - 47,
                 gameChar_x + 2, gameChar_y - 54);
        //eyes
        fill(255);
        ellipse(gameChar_x - 4, gameChar_y - 41, 3);
        ellipse(gameChar_x + 1, gameChar_y - 41, 3);
        fill(0);
        //arms
        strokeWeight(1.5);
        stroke(0);
        //arm, top right
        line(gameChar_x + 12, gameChar_y - 25,
             gameChar_x + 15, gameChar_y - 18);
        //arm, top left
        line(gameChar_x - 11, gameChar_y - 25,
             gameChar_x - 14, gameChar_y - 20);
        //arm, bottom left
        line(gameChar_x - 9, gameChar_y - 17,
             gameChar_x - 11, gameChar_y - 14);
        //arm, bottom right
        line(gameChar_x + 9, gameChar_y - 17,
             gameChar_x + 11, gameChar_y - 12);
        //left leg
        line(gameChar_x - 6, gameChar_y - 14,
             gameChar_x - 10, gameChar_y - 6);
        line(gameChar_x - 10, gameChar_y - 6,
             gameChar_x - 7, gameChar_y + 2);
        //right leg
        line(gameChar_x + 5, gameChar_y - 15,
             gameChar_x + 3, gameChar_y - 6);
        line(gameChar_x + 3, gameChar_y - 6,
             gameChar_x + 7, gameChar_y + 2);
        strokeWeight(1);

	}
	else if(isRight)
	{
		// Walking right code
        
        //body
        ellipse(gameChar_x + 0.5, gameChar_y - 25, 27, 25);
        //head
        ellipse(gameChar_x + 0.5, gameChar_y - 38, 15, 15);
        //antenna left
        triangle(gameChar_x - 6, gameChar_y - 41, 
                 gameChar_x - 3, gameChar_y - 44, 
                 gameChar_x - 9, gameChar_y - 51);
        triangle(gameChar_x - 9, gameChar_y - 51,
                 gameChar_x - 8, gameChar_y - 47,
                 gameChar_x - 1, gameChar_y - 54);
        //antenna right
        triangle(gameChar_x + 1, gameChar_y - 41,
                 gameChar_x + 7, gameChar_y - 41,
                 gameChar_x + 10, gameChar_y - 51);
        triangle(gameChar_x + 10, gameChar_y - 51,
                 gameChar_x + 9, gameChar_y - 47,
                 gameChar_x + 2, gameChar_y - 54);
        //eyes
        fill(255);
        ellipse(gameChar_x, gameChar_y - 41, 3);
        ellipse(gameChar_x + 5, gameChar_y - 41, 3);
        fill(0);
        //arms
        strokeWeight(1.5);
        stroke(0);
        //arm, top right
        line(gameChar_x + 12, gameChar_y - 25,
             gameChar_x + 15, gameChar_y - 20);
        //arm, top left
        line(gameChar_x - 11, gameChar_y - 25,
             gameChar_x - 14, gameChar_y - 18);
        //arm, bottom left
        line(gameChar_x - 9, gameChar_y - 17,
             gameChar_x - 11, gameChar_y - 12);
        //arm, bottom right
        line(gameChar_x + 9, gameChar_y - 17,
             gameChar_x + 11, gameChar_y - 14);
        //left leg
        line(gameChar_x - 6, gameChar_y - 15,
             gameChar_x - 3.5, gameChar_y - 6);
        line(gameChar_x - 3.5, gameChar_y - 6,
             gameChar_x - 7, gameChar_y + 2);
        //right leg
        line(gameChar_x + 5, gameChar_y - 15,
             gameChar_x + 10, gameChar_y - 6);
        line(gameChar_x + 10, gameChar_y - 6,
             gameChar_x + 7, gameChar_y + 2);
        strokeWeight(1);

	}
	else if(isFalling || isPlummeting)
	{
		// Jumping facing forwards code
        
        //body
        ellipse(gameChar_x + 0.5, gameChar_y - 25, 30, 25);
        //head
        ellipse(gameChar_x + 0.5, gameChar_y - 38, 15, 15);
        //antenna left
        triangle(gameChar_x - 6, gameChar_y - 41, 
                 gameChar_x - 3, gameChar_y - 44, 
                 gameChar_x - 9, gameChar_y - 51);
        triangle(gameChar_x - 9, gameChar_y - 51,
                 gameChar_x - 8, gameChar_y - 47,
                 gameChar_x - 1, gameChar_y - 54);
        //antenna right
        triangle(gameChar_x + 1, gameChar_y - 41,
                 gameChar_x + 7, gameChar_y - 41,
                 gameChar_x + 10, gameChar_y - 51);
        triangle(gameChar_x + 10, gameChar_y - 51,
                 gameChar_x + 9, gameChar_y - 47,
                 gameChar_x + 2, gameChar_y - 54);
        //eyes
        fill(255);
        ellipse(gameChar_x - 2, gameChar_y - 41, 3);
        ellipse(gameChar_x + 3, gameChar_y - 41, 3);
        fill(0);
        //arms
        strokeWeight(1.5);
        stroke(0);
        //arm, top right
        line(gameChar_x + 15, gameChar_y - 25,
             gameChar_x + 18, gameChar_y - 30);
        //arm, top left
        line(gameChar_x - 14, gameChar_y - 25,
             gameChar_x - 17, gameChar_y - 30);
        //arm, bottom left
        line(gameChar_x - 11, gameChar_y - 17,
             gameChar_x - 14, gameChar_y - 17);
        //arm, bottom right
        line(gameChar_x + 11, gameChar_y - 17,
             gameChar_x + 14.5, gameChar_y - 17);
        //left leg
        line(gameChar_x - 6, gameChar_y - 14,
             gameChar_x - 6, gameChar_y - 6);
        line(gameChar_x - 6, gameChar_y - 6,
             gameChar_x - 6, gameChar_y + 2);
        //right leg
        line(gameChar_x + 5, gameChar_y - 15,
             gameChar_x + 5, gameChar_y - 6);
        line(gameChar_x + 5, gameChar_y - 6,
             gameChar_x + 5, gameChar_y + 2);
        strokeWeight(1);

	}
	else
	{
		// Standing front facing code
        
        //body
        ellipse(gameChar_x + 0.5, gameChar_y - 25, 30, 25);
        //head
        ellipse(gameChar_x + 0.5, gameChar_y - 38, 15, 15);
        //antenna left
        triangle(gameChar_x - 6, gameChar_y - 41, 
                 gameChar_x - 3, gameChar_y - 44, 
                 gameChar_x - 9, gameChar_y - 51);
        triangle(gameChar_x - 9, gameChar_y - 51,
                 gameChar_x - 8, gameChar_y - 47,
                 gameChar_x - 1, gameChar_y - 54);
        //antenna right
        triangle(gameChar_x + 1, gameChar_y - 41,
                 gameChar_x + 7, gameChar_y - 41,
                 gameChar_x + 10, gameChar_y - 51);
        triangle(gameChar_x + 10, gameChar_y - 51,
                 gameChar_x + 9, gameChar_y - 47,
                 gameChar_x + 2, gameChar_y - 54);
        //eyes
        fill(255);
        ellipse(gameChar_x - 2, gameChar_y - 41, 3);
        ellipse(gameChar_x + 3, gameChar_y - 41, 3);
        fill(0);
        //arms
        strokeWeight(1.5);
        stroke(0);
        //arm, top right
        line(gameChar_x + 15, gameChar_y - 25,
             gameChar_x + 18, gameChar_y - 20);
        //arm, top left
        line(gameChar_x - 14, gameChar_y - 25,
             gameChar_x - 17, gameChar_y - 20);
        //arm, bottom left
        line(gameChar_x - 12, gameChar_y - 17,
             gameChar_x - 14, gameChar_y - 14);
        //arm, bottom right
        line(gameChar_x + 12, gameChar_y - 17,
             gameChar_x + 14, gameChar_y - 14);
        //left leg
        line(gameChar_x - 6, gameChar_y - 13.5,
             gameChar_x - 10, gameChar_y - 6);
        line(gameChar_x - 10, gameChar_y - 6,
             gameChar_x - 7, gameChar_y + 2);
        //right leg
        line(gameChar_x + 5, gameChar_y - 15,
             gameChar_x + 10, gameChar_y - 6);
        line(gameChar_x + 10, gameChar_y - 6,
             gameChar_x + 7, gameChar_y + 2);
        strokeWeight(1);

    }
}




// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    // Draw clouds.
    for(var i = 0; i < clouds.length; i++)
    {
        fill(113, 113, 113)
        ellipse(clouds[i].x_pos + 177 * clouds[i].size,
                clouds[i].y_pos + 46 * clouds[i].size,
                80 * clouds[i].size,
                80 * clouds[i].size);
        fill(122, 122, 122);
        ellipse(clouds[i].x_pos + 210 * clouds[i].size,
                clouds[i].y_pos + 50 * clouds[i].size,
                70 * clouds[i].size,
                60 * clouds[i].size);
        ellipse(clouds[i].x_pos + 260 * clouds[i].size,
                clouds[i].y_pos + 50 * clouds[i].size,
                80 * clouds[i].size,
                60 * clouds[i].size);
        fill(113, 113, 113)
        ellipse(clouds[i].x_pos + 250 * clouds[i].size,
                clouds[i].y_pos + 70 * clouds[i].size,
                70 * clouds[i].size,
                80 * clouds[i].size);
        ellipse(clouds[i].x_pos + 210 * clouds[i].size,
                clouds[i].y_pos + 90 * clouds[i].size,
                60 * clouds[i].size,
                60 * clouds[i].size);
        fill(122, 122, 122);
        ellipse(clouds[i].x_pos + 180 * clouds[i].size,
                clouds[i].y_pos + 70 * clouds[i].size,
                80 * clouds[i].size,
                60 * clouds[i].size);
        }   
}

// Function to draw mountains objects.
function drawMountains()
{
    // Draw mountains.
    for(var i = 0; i < mountains.length; i++)
    {
        fill(204,65,36);
        triangle(mountains[i].x_pos + 450 * mountains[i].size,
                 432 * mountains[i].size,
                 mountains[i].x_pos + 644 * mountains[i].size,
                 433 * mountains[i].size,
                 mountains[i].x_pos + 512 * mountains[i].size,
                 144 * mountains[i].size);
        fill(218,77,48);
        triangle(mountains[i].x_pos + 400 * mountains[i].size,
                 432 * mountains[i].size,
                 mountains[i].x_pos + 560 * mountains[i].size,
                 433 * mountains[i].size,
                 mountains[i].x_pos + 512 * mountains[i].size,
                 300 * mountains[i].size);
        fill(222,95,69);
        triangle(mountains[i].x_pos + 590 * mountains[i].size,
                 433 * mountains[i].size,
                 mountains[i].x_pos + 680 * mountains[i].size,
                 433 * mountains[i].size,
                 mountains[i].x_pos + 650 * mountains[i].size,
                 300 * mountains[i].size);
        fill(200);
        triangle(mountains[i].x_pos + 500 * mountains[i].size,
                 200 * mountains[i].size,
                 mountains[i].x_pos + 543 * mountains[i].size,
                 210 * mountains[i].size,
                 mountains[i].x_pos + 512 * mountains[i].size,
                 144 * mountains[i].size);
    }
}

// Function to draw tree objects.
function drawTrees()
{
    // Draw trees.
    for(var i = 0; i < trees.length; i++)
        {
            //tree
            noStroke();
            fill(104,26,26);
            rect(trees[i].x_pos + 328, trees[i].y_pos + 112,10,100);
            fill(85,107,47);
            quad(trees[i].x_pos + 297, trees[i].y_pos + 68,
                 trees[i].x_pos + 343, trees[i].y_pos + 47,
                 trees[i].x_pos + 383, trees[i].y_pos + 77,
                 trees[i].x_pos + 323, trees[i].y_pos + 118);
            quad(trees[i].x_pos + 344, trees[i].y_pos + 81,
                 trees[i].x_pos + 364, trees[i].y_pos + 127,
                 trees[i].x_pos + 290, trees[i].y_pos + 119,
                 trees[i].x_pos + 274, trees[i].y_pos + 83);
            fill(128,128,0);
            quad(trees[i].x_pos + 339, trees[i].y_pos + 81,
                 trees[i].x_pos + 354, trees[i].y_pos + 115,
                 trees[i].x_pos + 365, trees[i].y_pos + 55,
                 trees[i].x_pos + 398, trees[i].y_pos + 87);
            quad(trees[i].x_pos + 298, trees[i].y_pos + 100,
                 trees[i].x_pos + 330, trees[i].y_pos + 56,
                 trees[i].x_pos + 289, trees[i].y_pos + 34,
                 trees[i].x_pos + 278, trees[i].y_pos + 47);
            quad(trees[i].x_pos + 351, trees[i].y_pos + 136,
                 trees[i].x_pos + 349, trees[i].y_pos + 103,
                 trees[i].x_pos + 388, trees[i].y_pos + 90,
                 trees[i].x_pos + 387, trees[i].y_pos + 108);
            rect(trees[i].x_pos + 305, trees[i].y_pos + 43, 20, 20);
            quad(trees[i].x_pos + 309, trees[i].y_pos + 115,
                 trees[i].x_pos + 332, trees[i].y_pos + 119,
                 trees[i].x_pos + 315, trees[i].y_pos + 140,
                 trees[i].x_pos + 301, trees[i].y_pos + 121);
            //peach and leaf
            fill(255,178,102);
            ellipse(trees[i].x_pos + 366, trees[i].y_pos + 87, 10);
            ellipse(trees[i].x_pos + 309, trees[i].y_pos + 62, 10);
            ellipse(trees[i].x_pos + 302, trees[i].y_pos + 114, 10);
        }   
}




// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    //canyon    
        fill(10,38,19);
        rect(t_canyon.x_pos + 62 * t_canyon.width / 100,
             432,
             180 * t_canyon.width / 100,
             200);
        fill(144,38,19);
        rect(t_canyon.x_pos + 62 * t_canyon.width / 100,
             462,
             35 * t_canyon.width / 100,
             200);
        rect(t_canyon.x_pos + 205 * t_canyon.width / 100,
             462,
             37 * t_canyon.width / 100,
             200);
        fill(158,52,27);
        rect(t_canyon.x_pos + 97 * t_canyon.width / 100,
             502,
             37 * t_canyon.width / 100,
             200);
        rect(t_canyon.x_pos + 169 * t_canyon.width / 100,
             520,
             37 * t_canyon.width / 100,
             200);
        fill(70,130,180);
        rect(t_canyon.x_pos + 134 * t_canyon.width / 100,
             562,
             35 * t_canyon.width / 100,
             100);
        fill(10,38,19);
        rect(t_canyon.x_pos + 83 * t_canyon.width / 100,
             458,
             20 * t_canyon.width / 100,
             20);
        rect(t_canyon.x_pos + 163 * t_canyon.width / 100,
             518,
             20 * t_canyon.width / 100,
             30);
        triangle(t_canyon.x_pos + 201 * t_canyon.width / 100, 481,
                 t_canyon.x_pos + 225 * t_canyon.width / 100, 458,
                 t_canyon.x_pos + 194 * t_canyon.width / 100, 452);
        fill(10,38,19);
        triangle(t_canyon.x_pos + 242 * t_canyon.width / 100, 432,
                 t_canyon.x_pos + 255 * t_canyon.width / 100, 432,
                 t_canyon.x_pos + 242 * t_canyon.width / 100, 453);
        fill(160,82,45);
        triangle(t_canyon.x_pos + 61 * t_canyon.width / 100, 432,
                 t_canyon.x_pos + 82 * t_canyon.width / 100, 432,
                 t_canyon.x_pos + 61 * t_canyon.width / 100, 450);
}


// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{   
      if(gameChar_world_x >= t_canyon.x_pos + 62 && gameChar_world_x <= t_canyon.width * 1.8 + t_canyon.x_pos + 62 && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
        }
        else
        {
            isPlummeting = false;
        }
}




// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
        // Drawing the stick
        strokeWeight(3);
        stroke(82, 54, 27);
            //bottom point
        line(t_collectable.x_pos - 10 * t_collectable.size / 50,
            t_collectable.y_pos + 13 * t_collectable.size / 50,
            //top point
            t_collectable.x_pos + 10 * t_collectable.size / 50,
            t_collectable.y_pos - 22 * t_collectable.size / 50)
        strokeWeight(2);
        stroke(101, 67, 33);
            //bottom point
        line(t_collectable.x_pos - 1 * t_collectable.size / 50,
            t_collectable.y_pos - 3 * t_collectable.size / 50,
            //top point
            t_collectable.x_pos + 1 * t_collectable.size / 50,
            t_collectable.y_pos - 20 * t_collectable.size / 50)
            //bottom point
        line(t_collectable.x_pos - 6 * t_collectable.size / 50,
            t_collectable.y_pos + 8 * t_collectable.size / 50,
            //top point
            t_collectable.x_pos + 10 * t_collectable.size / 50,
            t_collectable.y_pos - 8 * t_collectable.size / 50)
        strokeWeight(1.1);
            //bottom point
        line(t_collectable.x_pos + 6 * t_collectable.size / 50,
            t_collectable.y_pos - 15 * t_collectable.size / 50,
            //top point
            t_collectable.x_pos + 15 * t_collectable.size / 50,
            t_collectable.y_pos - 20 * t_collectable.size / 50)
    
        // Drawing the Leaf
        noStroke();
        fill(107, 142, 35);
        quad(t_collectable.x_pos + 13.5 * t_collectable.size / 50,
             t_collectable.y_pos - 19 * t_collectable.size / 50, t_collectable.x_pos + 20 * t_collectable.size / 50,
             t_collectable.y_pos - 20 * t_collectable.size / 50, t_collectable.x_pos + 23 * t_collectable.size / 50,
             t_collectable.y_pos - 25 * t_collectable.size / 50, t_collectable.x_pos + 19 * t_collectable.size / 50,
             t_collectable.y_pos - 25 * t_collectable.size / 50);
        quad(t_collectable.x_pos - 1 * t_collectable.size / 50,
             t_collectable.y_pos - 6 * t_collectable.size / 50, t_collectable.x_pos - 3 * t_collectable.size / 50,
             t_collectable.y_pos - 15 * t_collectable.size / 50, t_collectable.x_pos - 9 * t_collectable.size / 50,
             t_collectable.y_pos - 18 * t_collectable.size / 50, t_collectable.x_pos - 6 * t_collectable.size / 50,
             t_collectable.y_pos - 7 * t_collectable.size / 50);
        
    
}


// Function to check character(beetle) has collected an item.
function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);
    if(d < 30)
        {
            t_collectable.isFound = true;
            game_score += 1;
        }
}


// Function to draw the flagpole(tent).
function renderFlagpole()
{
    push();
    stroke(53, 53, 14);
    strokeWeight(0.6);
    //draws tent body
    fill(81, 98, 35);
    quad(flagpole.x_pos + 44, floorPos_y - 70,
         flagpole.x_pos + 141, floorPos_y - 70,
         flagpole.x_pos + 166, floorPos_y,
         flagpole.x_pos + 69, floorPos_y);
    //draws tent enterance
    fill(81, 98, 35);
    triangle(flagpole.x_pos, floorPos_y,
             flagpole.x_pos + 70, floorPos_y,
             flagpole.x_pos + 45, floorPos_y - 70);
    //draws tent inner enterance
    fill(77, 77, 33);
    triangle(flagpole.x_pos + 10, floorPos_y,
             flagpole.x_pos + 60, floorPos_y,
             flagpole.x_pos + 43, floorPos_y - 55);
    
    
    if(flagpole.isReached)
    {
        //draws tent with light off
        stroke(53, 53, 14);
        strokeWeight(0.6);
        //draws tent body
        fill(81, 98, 35);
        quad(flagpole.x_pos + 44, floorPos_y - 70,
             flagpole.x_pos + 141, floorPos_y - 70,
             flagpole.x_pos + 166, floorPos_y,
             flagpole.x_pos + 69, floorPos_y);
        //draws tent enterance
        fill(81, 98, 35);
        triangle(flagpole.x_pos, floorPos_y,
                 flagpole.x_pos + 70, floorPos_y,
                 flagpole.x_pos + 45, floorPos_y - 70);
        //draws tent inner enterance
        fill(255, 204, 0);
        triangle(flagpole.x_pos + 10, floorPos_y,
                 flagpole.x_pos + 60, floorPos_y,
                 flagpole.x_pos + 43, floorPos_y - 55);
    }
    else
    {
        //draws tent with lights on
        stroke(53, 53, 14);
        strokeWeight(0.6);
        //draws tent body
        fill(81, 98, 35);
        quad(flagpole.x_pos + 44, floorPos_y - 70,
             flagpole.x_pos + 141, floorPos_y - 70,
             flagpole.x_pos + 166, floorPos_y,
             flagpole.x_pos + 69, floorPos_y);
        //draws tent enterance
        fill(81, 98, 35);
        triangle(flagpole.x_pos, floorPos_y,
                 flagpole.x_pos + 70, floorPos_y,
                 flagpole.x_pos + 45, floorPos_y - 70);
        //draws tent inner enterance
        fill(77, 57, 33);
        triangle(flagpole.x_pos + 10, floorPos_y,
                 flagpole.x_pos + 60, floorPos_y,
                 flagpole.x_pos + 43, floorPos_y - 55);
    }
    pop();
}

// Function to check if the character(beetle) has reached the flagpole(tent).
function checkFlagpole()
{   
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 10)
    {
        flagpole.isReached = true;
    }
    
}




// ----------------------------------
// Enemies
// ----------------------------------


function Enemy(x_pos, y_pos, range)
{
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.range = range;
    this.current_x = x_pos;
    this.incr = 1;
    
    this.draw = function()
    {   
        
        if(this.incr >= 1)
        {
            //Body
            fill(0);
            quad(this.current_x, this.y_pos - 23, //bottom right 
                 this.current_x + 3, this.y_pos - 35, // top right
                 this.current_x + 12, this.y_pos - 36, //top left
                 this.current_x + 10, this.y_pos - 25) // bottom left
            fill(235, 188, 66);
            quad(this.current_x - 4, this.y_pos - 19, //bottom right 
                 this.current_x - 1, this.y_pos - 31, // top right
                 this.current_x + 8, this.y_pos - 30, //top left
                 this.current_x + 6, this.y_pos - 22) // bottom left)
            fill(0);
            quad(this.current_x - 7, this.y_pos - 10, //bottom right 
                 this.current_x - 1, this.y_pos - 25, // top right
                 this.current_x + 4, this.y_pos - 28, //top left
                 this.current_x + 4, this.y_pos - 22) // bottom left)
            fill(235, 188, 66);
            quad(this.current_x - 4, this.y_pos - 11, //bottom right 
                 this.current_x - 8, this.y_pos - 16, // top right
                 this.current_x - 2, this.y_pos - 16, //top left
                 this.current_x + 2, this.y_pos - 7) // bottom left)
            fill(0);
            quad(this.current_x - 1, this.y_pos - 9, //bottom right 
                 this.current_x - 1, this.y_pos - 10, // top right
                 this.current_x + 10, this.y_pos - 5, //top left
                 this.current_x + 1, this.y_pos - 8) // bottom left)
            // Wings
            fill(0, 0, 0, 90)
            quad(this.current_x - 1, this.y_pos - 42, //bottom right 
                 this.current_x - 11, this.y_pos - 55, // top right
                 this.current_x + 10, this.y_pos - 46, //top left
                 this.current_x + 20, this.y_pos - 30) // bottom left
            quad(this.current_x - 5, this.y_pos - 36, //bottom right 
                 this.current_x - 18, this.y_pos - 47, // top right
                 this.current_x + 15, this.y_pos - 36, //top left
                 this.current_x + 15, this.y_pos - 34) // bottom left
            // Antenna 
            stroke(0);
            strokeWeight(0.9);
            line(this.current_x + 15, this.y_pos - 40,
                 this.current_x + 13, this.y_pos - 45)
            line(this.current_x + 13, this.y_pos - 45,
                 this.current_x + 6, this.y_pos - 50)
            line(this.current_x + 17, this.y_pos - 40,
                 this.current_x + 19, this.y_pos - 45)
            line(this.current_x + 19, this.y_pos - 45,
                 this.current_x + 25, this.y_pos - 48)
            // Arms 
            strokeWeight(0.2);
            line(this.current_x + 12, this.y_pos - 35,
                 this.current_x + 16, this.y_pos - 27)
            line(this.current_x + 3, this.y_pos - 35,
                 this.current_x + 14, this.y_pos - 22)
            // Head 
            noStroke();
            fill(235, 188, 66);
            quad(this.current_x + 8, this.y_pos - 33, //bottom right 
                 this.current_x + 10, this.y_pos - 41, // top right
                 this.current_x + 22, this.y_pos - 39, //top left
                 this.current_x + 20, this.y_pos - 30) // bottom left
            //Eyes
            fill(0);
            ellipse(this.current_x + 19, this.y_pos - 36, 4, 8)
            ellipse(this.current_x + 13, this.y_pos - 36, 4, 8)
        }
        else
        {
            //Body
            fill(0);
            quad(this.current_x, this.y_pos - 23, //bottom right 
                 this.current_x - 3, this.y_pos - 35, // top right
                 this.current_x - 12, this.y_pos - 36, //top left
                 this.current_x - 10, this.y_pos - 25) // bottom left
            fill(235, 188, 66);
            quad(this.current_x + 4, this.y_pos - 19, //bottom right 
                 this.current_x + 1, this.y_pos - 31, // top right
                 this.current_x - 8, this.y_pos - 30, //top left
                 this.current_x - 6, this.y_pos - 22) // bottom left)
            fill(0);
            quad(this.current_x + 7, this.y_pos - 10, //bottom right 
                 this.current_x + 1, this.y_pos - 25, // top right
                 this.current_x - 4, this.y_pos - 28, //top left
                 this.current_x - 4, this.y_pos - 22) // bottom left)
            fill(235, 188, 66);
            quad(this.current_x + 4, this.y_pos - 11, //bottom right 
                 this.current_x + 8, this.y_pos - 16, // top right
                 this.current_x + 2, this.y_pos - 16, //top left
                 this.current_x - 2, this.y_pos - 7) // bottom left)
            fill(0);
            quad(this.current_x + 1, this.y_pos - 9, //bottom right 
                 this.current_x + 1, this.y_pos - 10, // top right
                 this.current_x - 10, this.y_pos - 5, //top left
                 this.current_x - 1, this.y_pos - 8) // bottom left)
            // Wings
            fill(0, 0, 0, 90)
            quad(this.current_x + 1, this.y_pos - 42, //bottom right 
                 this.current_x + 11, this.y_pos - 55, // top right
                 this.current_x - 10, this.y_pos - 46, //top left
                 this.current_x - 20, this.y_pos - 30) // bottom left
            quad(this.current_x + 5, this.y_pos - 36, //bottom right 
                 this.current_x + 18, this.y_pos - 47, // top right
                 this.current_x - 15, this.y_pos - 36, //top left
                 this.current_x - 15, this.y_pos - 34) // bottom left
            // Antenna 
            stroke(0);
            strokeWeight(0.9);
            line(this.current_x - 15, this.y_pos - 40,
                 this.current_x - 13, this.y_pos - 45)
            line(this.current_x - 13, this.y_pos - 45,
                 this.current_x - 6, this.y_pos - 50)
            line(this.current_x - 17, this.y_pos - 40,
                 this.current_x - 19, this.y_pos - 45)
            line(this.current_x - 19, this.y_pos - 45,
                 this.current_x - 25, this.y_pos - 48)
            // Arms 
            strokeWeight(0.2);
            line(this.current_x - 12, this.y_pos - 35,
                 this.current_x - 16, this.y_pos - 27)
            line(this.current_x - 3, this.y_pos - 35,
                 this.current_x - 14, this.y_pos - 22)
            // Head 
            noStroke();
            fill(235, 188, 66);
            quad(this.current_x - 8, this.y_pos - 33, //bottom right 
                 this.current_x - 10, this.y_pos - 41, // top right
                 this.current_x - 22, this.y_pos - 39, //top left
                 this.current_x - 20, this.y_pos - 30) // bottom left
            //Eyes
            fill(0);
            ellipse(this.current_x - 19, this.y_pos - 36, 4, 8)
            ellipse(this.current_x - 13, this.y_pos - 36, 4, 8)
        }
      
    }
    
    this.update = function()
    {
        this.current_x += this.incr;
        
        if(this.current_x < this.x_pos)
        {
            this.incr = 1;
        }
        else if(this.current_x > this.x_pos + this.range)
        {
            this.incr = -1;
        }
    }
    
    this.isContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.current_x, this.y_pos)
        
        if(d < 30)
        {
            return true;
        }
        
        return false;
    }
    
}





