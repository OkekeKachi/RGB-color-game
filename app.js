


const rgbValueElement = document.getElementById('rgbValue');
const colorOptionsElement = document.getElementById('colorOptions');
const resultMessageElement = document.getElementById('resultMessage');
const playToInput = document.getElementById('playToInput');
const startGameButton = document.getElementById('startGameButton');
const playToCirclesElement = document.getElementById('playToCircles');
const newColorsButton = document.getElementById('newColorsButton');
score = document.getElementById("score")

function checkScreenSize() {
    const width = window.innerWidth;
    const element = document.querySelector('.head');
    const element2 = document.querySelector('.headSmall');

    if (width < 768) {
        element.style.display = 'none';
        element2.style.display = 'block'
        showGuideButton2.style.display = "inline-block"
        showGuideButton.style.display = 'none' // Hide on small screens
    } else {
        element.style.display = 'inline-block';
        showGuideButton.style.display = 'inline-block' // Show on large screens
        element2.style.display = 'none'
        showGuideButton2.style.display = "none"
    }
}
window.addEventListener('resize', checkScreenSize);
window.addEventListener('load', checkScreenSize);
const showGuideButton = document.getElementById('showGuideButton');
const showGuideButton2 = document.querySelector('.btnSmall');
const guideElement = document.getElementById('guide');
const closeGuideButton = document.getElementById('closeGuideButton');
closeGuideButton.addEventListener('click', () => {
    guideElement.classList.add('hidden');
});
showGuideButton.addEventListener('click', () => {
    guideElement.classList.toggle('hidden');
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
