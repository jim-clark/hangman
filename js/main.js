/*----- constants -----*/
const WORDS = [
  'ARRAY', 'FUNCTION', 'BINARY', 'VARIABLE',
  'BOOLEAN', 'REACT', 'COMPUTER SCIENCE',
  'TERMINAL', 'EVENTS'
];
const PANEL_WIDTH = 15;
const FATAL_NUM_GUESSES = 6;

/*----- app's state (variables) -----*/
let secretWord;
let guessWord;
let gameStatus;  // null = in progress; 👎 = lose; 👍 = win
let wrongLetters;

/*----- cached element references -----*/
const guessEl = document.getElementById('guess');
const msgEl = document.getElementById('msg');
const replayBtn = document.getElementById('replay');
const gallowsEl = document.getElementById('gallows');
const letterBtns = document.querySelectorAll('section > button');

/*----- event listeners -----*/
document.querySelector('section')
  .addEventListener('click', handleLetterClick);

document.getElementById('replay')
  .addEventListener('click', init);


/*----- functions -----*/
init();

// in response to user interaction, update state and call render
function handleLetterClick(evt) {
  debugger;
  const letter = evt.target.textContent;
  // Exit function if the following conditions exit
  if (evt.target.tagName !== 'BUTTON' || gameStatus) return;
  if (secretWord.includes(letter)) {
    // Update guessWord where all occurances of that letter exist
    let newGuess = '';
    for (let i = 0; i < secretWord.length; i++) {
      newGuess += secretWord.charAt(i) === letter ? letter : guessWord.charAt(i);
    }
    guessWord = newGuess;
  } else {
    // Add the letter to the wrongLetters array
    wrongLetters.push(letter);
  }
  gameStatus = getGameStatus();
  render();
}

function getGameStatus() {
  if (guessWord === secretWord) return '👍';
  if (wrongLetters.length === FATAL_NUM_GUESSES) return '👎';
  return null;
  // if (guessWord === secretWord) {
  //   return '👍';
  // } else if (wrongLetters.length === FATAL_NUM_GUESSES) {
  //   return '👎';
  // }
}

// render transfers all state to the DOM
function render() {
  guessEl.textContent = guessWord;
  replayBtn.style.visibility = gameStatus ? 'visible' : 'hidden';
  gallowsEl.style.backgroundPositionX = `-${wrongLetters.length * PANEL_WIDTH}vmin`;
  renderButtons();
  renderMessage();
}

function renderMessage() {
  if (gameStatus === '👍') {
   msgEl.textContent = 'CONGRATS - YOU WON!';
  } else if (gameStatus === '👎') {
    msgEl.textContent = 'RIP';
  } else {
    const numRemaining = FATAL_NUM_GUESSES - wrongLetters.length;
    msgEl.innerHTML = `GOOD LUCK!<br><span>${numRemaining} WRONG GUESS${numRemaining === 1 ? '' : 'ES'} REMAINING</span>`;
  }
}

function renderButtons() {
  letterBtns.forEach(function(btn) {
    const letter = btn.textContent;
    btn.disabled = guessWord.includes(letter) || wrongLetters.includes(letter);
    if (guessWord.includes(letter)) {
      btn.className = 'valid-letter';
    } else if (wrongLetters.includes(letter)) {
      btn.className = 'wrong-letter';
    } else {
      btn.className = '';
    }
  });
}

function init() {
  const rndIdx = Math.floor(Math.random() * WORDS.length);
  secretWord = WORDS[rndIdx];
  guessWord = '';
  // init guessWord with underscores for each char in secretWord
  for (let char of secretWord) {
    guessWord += (char === ' ') ? ' ' : '_';
  }
  // Using regular expression
  // guessWord = secretWord.replace(/[A-Z]/g, '_');
  gameStatus = null;
  wrongLetters = [];
  render();
}