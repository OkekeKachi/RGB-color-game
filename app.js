


const rgbValueElement = document.getElementById('rgbValue');
const colorOptionsElement = document.getElementById('colorOptions');
const resultMessageElement = document.getElementById('resultMessage');
const playToInput = document.getElementById('playToInput');
const startGameButton = document.getElementById('startGameButton');
const playToCirclesElement = document.getElementById('playToCircles');
const newColorsButton = document.getElementById('newColorsButton');
score = document.getElementById("score")
const showGuideButton = document.getElementById('showGuideButton');
const showGuideButton2 = document.querySelector('.btnSmall');
const guideElement = document.getElementById('guide');
div = document.createElement("div")
showGuideButton.addEventListener('click', () => {
    
    div.innerHTML = `
    <div id="guide">
        <h2>How to Play</h2>
        <div class="guide-section">
            <h3>Game Setup</h3>
            <p>1. Enter a number in the "Play to" field. This number represents how many correct guesses you need to win.
            </p>
            <p>2. Click the "Start Game" button to begin. A random color will be displayed at the top.</p>
        </div>
        <div class="guide-section">
            <h3>Playing the Game</h3>
            <p>1. You will see a set of color boxes. Click on a color that you think matches the displayed RGB color.</p>
            <p>2. If your guess is correct, one of the circles will be filled, and you will continue guessing until you
                either fill all the circles or run out of attempts. You have only 3 attempts.</p>
            <p>3. If your guess is incorrect, you will lose one attempt.
            </p>
        </div>
        <div class="guide-section">
            <h3>Winning and Losing</h3>
            <p>1. If you fill all the circles by guessing the correct colors, you win the game!</p>
            <p>2. If you run out of attempts before filling all the circles, the game will notify you that you've lost.</p>
        </div>
        <div class="guide-section">
            <h3>New Colors</h3>
            <p>If you don't like the current set of colors, you can click the "New Colors" button to generate a new set.</p>
        </div>
        <button id="closeGuideButton" class="btn">Close Guide</button>   
    </div> 
    `
    document.body.appendChild(div)
    const closeGuideButton = document.getElementById('closeGuideButton');
    // setTimeout(() => {
    //     if (div != ` `) {
    //         document.addEventListener('click', function (event) {

    //             // Check if the clicked element is outside the div
    //             if (!div.contains(event.target)) {
    //                 // Perform an action

    //                 div.innerHTML = ` `

    //             }
    //         });
    //     }
    // }, 2000);

    closeGuideButton.addEventListener('click', () => {
        div.innerHTML = ` `
    });

});




let correctColor;
let playTo;
let correctGuesses = 0;
let attempts = 3; // Hidden number of attempts
let gameActive = false;

startGameButton.addEventListener('click', startGame);
playToInput.addEventListener('keydown', function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        startGame()
    }
})
newColorsButton.addEventListener('click', setupGame);
newColorsButton.disabled = true
function startGame() {

    score.textContent = "0"
    playTo = parseInt(playToInput.value);
    if (!playTo || playTo <= 0 || playTo > 10) {
        resultMessageElement.textContent = 'Please enter a number between 0 and 10';
        setTimeout(() => {
            resultMessageElement.textContent = '';
        }, 3000);

        return;
    }
    correctGuesses = 0;
    attempts = 3; // Reset attempts for a new game
    setupPlayToCircles();
    setupGame();
    gameActive = true;
    newColorsButton.textContent = "New Colors"
    newColorsButton.disabled = false
    playToInput.value = "";
}

function setupPlayToCircles() {
    playToCirclesElement.innerHTML = '';
    for (let i = 0; i < playTo; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        playToCirclesElement.appendChild(circle);
    }
}

function fillCircle() {
    const circles = document.querySelectorAll('.circle');
    if (correctGuesses <= playTo) {
        circles[correctGuesses - 1].classList.add('filled');
    }
}

function setupGame() {
    const colors = [];
    for (let i = 0; i < 6; i++) {
        colors.push(generateRandomColor());
    }

    correctColor = colors[Math.floor(Math.random() * colors.length)];
    rgbValueElement.textContent = correctColor.toUpperCase();

    colorOptionsElement.innerHTML = '';
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color-option');
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener('click', () => checkGuess(color, colorDiv));
        colorOptionsElement.appendChild(colorDiv);
    });

    resultMessageElement.textContent = '';
}

function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function checkGuess(selectedColor, colorDiv) {
    if (!gameActive) return; // Prevent further actions after the game ends

    if (selectedColor === correctColor) {
        correctGuesses++;
        fillCircle();

        if (correctGuesses === playTo) {
            newColorsButton.textContent = ""
            newColorsButton.disabled = true
            resultMessageElement.textContent = 'Congratulations, you won!';
            initScore = parseInt(score.textContent)
            initScore = initScore + 10
            score.textContent = `${initScore}`;
            colorOptionsElement.querySelectorAll('.color-option').forEach(div => {
                div.style.backgroundColor = correctColor;
            });
            disableGame();
        } else {
            resultMessageElement.textContent = 'Correct! Keep going!';
            initScore = parseInt(score.textContent)
            initScore = initScore + 10
            score.textContent = `${initScore}`;
            colorOptionsElement.querySelectorAll('.color-option').forEach(div => {
                div.style.backgroundColor = correctColor;
            });
            setTimeout(setupGame, 1000); // Generate new colors after a short delay
        }
    } else {
        attempts--;

        if (attempts <= 0) {
            resultMessageElement.textContent = 'You lost! Try again!';
            newColorsButton.textContent = ""
            newColorsButton.disabled = true
            colorOptionsElement.querySelectorAll('.color-option').forEach(div => {
                div.style.backgroundColor = correctColor;
            });
            disableGame();
        } else {
            resultMessageElement.textContent = `Try Again!`;
            colorDiv.remove(); // Remove incorrect color option
        }
    }
}

function disableGame() {
    gameActive = false; // Disable the game
}


startGame();
