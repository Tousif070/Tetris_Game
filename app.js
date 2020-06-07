let grid=document.querySelector(".grid"); // USED IN THE scoreCalculation METHOD
let squares=Array.from(document.querySelectorAll(".grid .grid-blocks")); // FOR THE GRID
let displaySquares=Array.from(document.querySelectorAll(".mini-grid .grid-blocks")); // FOR THE MINI GRID
const width=10; // FOR THE GRID
const displayWidth=4; // FOR THE MINI GRID

const displayScore=document.getElementById("displayScore"); // TO DISPLAY THE SCORE
const displayHighScore=document.getElementById("displayHighScore"); // TO DISPLAY THE HIGH SCORE
const displayHighScoreView=document.getElementById("displayHighScoreView"); // TO HIGHLIGHT THE NEW HIGH SCORE

// BUTTONS
const startOrPauseButton=document.getElementById("startOrPauseButton");
const leftBtn=document.getElementById("leftBtn");
const rotateBtn=document.getElementById("rotateBtn");
const rightBtn=document.getElementById("rightBtn");
const downBtn=document.getElementById("downBtn");

// INDIVIDUAL TETROMINOES
const lTetromino=[
    [0, width, width * 2, 1],
    [width, 1 + width, 2 + width, 2 + width * 2],
    [width * 2, 1, 1 + width, 1 + width * 2],
    [width, width * 2, 1 + width * 2, 2 + width * 2]
];

const zTetromino=[
    [width, 1, 1 + width, 2],
    [0, width, 1 + width, 1 + width * 2],
    [width, 1, 1 + width, 2],
    [0, width, 1 + width, 1 + width * 2]
];

const tTetromino=[
    [width, 1, 1 + width, 2 + width],
    [0, width, width * 2, 1 + width],
    [width, 1 + width, 1 + width * 2, 2 + width],
    [width, 1, 1 + width, 1 + width * 2]
];

const oTetromino=[
    [0, width, 1, 1 + width],
    [0, width, 1, 1 + width],
    [0, width, 1, 1 + width],
    [0, width, 1, 1 + width]
];

const iTetromino=[
    [1, 1 + width, 1 + width * 2, 1 + width * 3],
    [0, 1, 2, 3],
    [1, 1 + width, 1 + width * 2, 1 + width * 3],
    [0, 1, 2, 3]
];

// ARRAY OF THE INDIVIDUAL TETROMINOES
const tetrominoes=[lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

// ARRAY FOR THE NEXT TETROMINOES. THESE WILL BE DISPLAYED IN THE MINI GRID
const nextTetrominoes=[
    [1, 1 + displayWidth, 1 + displayWidth * 2, 2],
    [displayWidth, 1, 1 + displayWidth, 2],
    [displayWidth * 2, 1 + displayWidth, 1 + displayWidth * 2, 2 + displayWidth * 2],
    [1 + displayWidth, 1 + displayWidth * 2, 2 + displayWidth, 2 + displayWidth * 2],
    [1, 1 + displayWidth, 1 + displayWidth * 2, 1 + displayWidth * 3]
];

let currentPosition=null;
let currentRotation=0;
let nextRandomTetromino=null;
let randomTetromino=0;
let currentTetromino=0;
let timerID=null;
let removedSquares=0;
let score=0;
let isGameOver=true;

// FUNCTIONS

// SELECTING A RANDOM TETROMINO
function selectRandomTetromino()
{
    randomTetromino=nextRandomTetromino;
    currentTetromino=tetrominoes[randomTetromino][currentRotation];
    currentPosition=4;
    gameOver();
}

// DRAW FUNCTION TO DRAW THE TETROMINOES
function drawTetromino()
{
    currentTetromino.forEach(value => {
        squares[currentPosition + value].classList.add("tetromino");
    });
}

// UNDRAW FUNCTION TO UNDRAW THE TETROMINOES
function undrawTetromino()
{
    currentTetromino.forEach(value => {
        squares[currentPosition + value].classList.remove("tetromino");
    });
}

// STOPPING THE TETROMINOES
function freeze()
{
    if(currentTetromino.some(value => squares[currentPosition + value + width].classList.contains("frozen")))
    {
        currentTetromino.forEach(value => {
            squares[currentPosition + value].classList.add("frozen");
        });
        selectRandomTetromino();
        nextRandomTetromino=Math.floor(Math.random() * tetrominoes.length);
        displayNextTetromino();
        scoreCalculation();
    }
}

// MOVING THE TETROMINOES DOWNWARDS
function moveDown()
{
    freeze(); // CHECKING IF MOVING DOWNWARDS IS POSSIBLE OR NOT
    undrawTetromino();
    currentPosition+=width;
    drawTetromino();
}

// MOVING THE TETROMINOES TO THE LEFT
function moveLeft()
{
    if(!(currentTetromino.some(value => (currentPosition + value) % width == 0) || currentTetromino.some(value => squares[currentPosition + value - 1].classList.contains("frozen"))))
    {
        undrawTetromino();
        currentPosition--;
        drawTetromino();
    }
}

// MOVING THE TETROMINOES TO THE RIGHT
function moveRight()
{
    if(!(currentTetromino.some(value => (currentPosition + value) % width == (width - 1)) || currentTetromino.some(value => squares[currentPosition + value + 1].classList.contains("frozen"))))
    {
        undrawTetromino();
        currentPosition++;
        drawTetromino();
    }
}

// CHECKING BEFORE ROTATING THE TETROMINOES
function okToRotate(tempCurrentTetromino)
{
    let tempCurrentRotation=currentRotation;
    tempCurrentRotation++;
    if(tempCurrentRotation == currentTetromino.length)
    {
        tempCurrentRotation=0;
    }
    tempCurrentTetromino=tetrominoes[randomTetromino][tempCurrentRotation];

    if(tempCurrentTetromino.some(value => squares[currentPosition + value].classList.contains("frozen")))
    {
        return false;
    }
    else
    {
        return true;
    }
}

// ROTATING THE TETROMINOES
function rotateTetromino()
{
    if(okToRotate(currentTetromino))
    {
        undrawTetromino();
        currentRotation++;
        if(currentRotation == currentTetromino.length)
        {
            currentRotation=0;
        }

        if(currentTetromino.some(value => (currentPosition + value) % width == 0)) // CHECKING ALONG THE LEFT BORDER
        {
            currentTetromino=tetrominoes[randomTetromino][currentRotation];
            if(currentTetromino.some(value => (currentPosition + value) % width == (width - 1)))
            {
                currentPosition++;
            }
        }
        else if(currentTetromino.some(value => (currentPosition + value) % width == (width - 1))) // CHECKING ALONG THE RIGHT BORDER
        {
            currentTetromino=tetrominoes[randomTetromino][currentRotation];
            while(currentTetromino.some(value => (currentPosition + value) % width == 0)) // CONSIDERING 2 ITERATIONS FOR THE iTETROMINO
            {
                currentPosition--;
            }
        }
        else if(iTetromino.some(value => (currentTetromino == value))) // EXTRA CHECKING FOR iTETROMINO TO GET RID OFF A BUG
        {
            currentTetromino=tetrominoes[randomTetromino][currentRotation];
            if(currentTetromino.some(value => (currentPosition + value) % width == 0)) // EXPLICITLY HANDLING A BUG
            {
                currentPosition--;

                if(currentTetromino.some(value => (currentPosition + value) % width == 0) && currentTetromino.some(value => (currentPosition + value) % width == (width - 1)))
                {
                    currentPosition++;
                }
            }
        }
        else
        {
            currentTetromino=tetrominoes[randomTetromino][currentRotation];
        }

        drawTetromino();
    }
}

// CONTROLLING THE TETROMINOES
function control(e)
{
    if(timerID != null)
    {
        if(e.keyCode == 37)
        {
            moveLeft();
        }
        else if(e.keyCode == 82)
        {
            rotateTetromino();
        }
        else if(e.keyCode == 39)
        {
            moveRight();
        }
        else if(e.keyCode == 40)
        {
            moveDown();
        }
    }
}

// DISPLAYING THE NEXT TETROMINO
function displayNextTetromino()
{
    displaySquares.forEach(value => {
        value.classList.remove("tetromino");
    });

    nextTetrominoes[nextRandomTetromino].forEach(value => {
        displaySquares[value].classList.add("tetromino");
    });
}

// DISPLAYING THE SCORE
function scoreCalculation()
{
    for(let i=0; i<200; i+=width)
    {
        const row=[i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if(row.every(value => squares[value].classList.contains("frozen")))
        {
            row.forEach(value => {
                squares[value].classList.remove("frozen", "tetromino");
            });
            removedSquares=squares.splice(i, width);
            squares=removedSquares.concat(squares);
            squares.forEach(value => grid.appendChild(value)); // THIS STATEMENT PHYSICALLY ARRANGES THE GRID BLOCKS INSIDE THE GRID

            score+=5;
            displayScore.innerHTML=score;
        }
    }
}

// GAME OVER
function gameOver()
{
    if(currentTetromino.some(value => squares[currentPosition + value].classList.contains("frozen")))
    {
        clearInterval(timerID);
        timerID=null;
        isGameOver=true;
        displayScore.innerHTML+=" Game Over !!!";

        let newHighScore=getHighScoreFromCookie();
        if(score > newHighScore) // SAVING THE NEW HIGH SCORE IN JAVASCRIPT COOKIE
        {
            setHighScoreInCookie("highScore", score, 90);
            displayHighScore.innerHTML=score;
            displayHighScoreView.style.color="#3D9FA2";
            setTimeout(() => {
                displayHighScoreView.style.color="";
            }, 4000);
        }
    }
}

// Game Refresh
function refreshGame()
{
    score=0;
    displayScore.innerHTML=score;

    for(let i=0; i<200; i++)
    {
        squares[i].classList.remove("frozen", "tetromino");
    }

    nextRandomTetromino=Math.floor(Math.random() * tetrominoes.length);
    selectRandomTetromino();
    nextRandomTetromino=Math.floor(Math.random() * tetrominoes.length);
    displayNextTetromino();
}

// EVENTS

startOrPauseButton.addEventListener("click", () => {
    if(timerID != null)
    {
        // GAME PAUSE
        clearInterval(timerID);
        timerID=null;
    }
    else
    {
        // GAME START
        if(isGameOver)
        {
            refreshGame();
            isGameOver=false;
        }
        timerID=setInterval(moveDown, 700);
    }
});

document.addEventListener("keydown", control);

leftBtn.addEventListener("click", () => { if(timerID != null) { moveLeft(); } });
rotateBtn.addEventListener("click", () => { if(timerID != null) { rotateTetromino(); } });
rightBtn.addEventListener("click", () => { if(timerID != null) { moveRight(); } });
downBtn.addEventListener("click", () => { if(timerID != null) { moveDown(); } });

// FUNCTIONS FOR MANAGING HIGH SCORE WITH JAVASCRIPT COOKIES

function displayHighScoreOnScreen()
{
    displayHighScore.innerHTML=getHighScoreFromCookie();
}

function setHighScoreInCookie(cookieName, cookieValue, days)
{
    let d=new Date();
    d.setTime(d.getTime() + (days * 24 * 3600 * 1000));
    let expires="expires=" + d.toUTCString();
    let cookieString=cookieName + "=" + cookieValue + ";" + expires + ";path=/;";
    document.cookie=cookieString;
}

function getHighScoreFromCookie()
{
    let highScoreFromCookie=0;
    if(document.cookie != null && document.cookie != "")
    {
        let retrievedCookie=document.cookie;
        let cookieArr=retrievedCookie.split("=");
        highScoreFromCookie=cookieArr[1];
    }
    return highScoreFromCookie;
}
