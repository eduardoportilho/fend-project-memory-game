// Constants
const deck = document.querySelector('.deck');
const cardsSymbols = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-bomb',
    'fa-leaf',
    'fa-bicycle',
]

// Game state
let blockCardFlip = false;
let moveCount = 0;
let startTime = Date.now();
let rating = 3;
let timer;
let timerRunning = false;

/**
 * Initialize the game.
 */
function init() {
    document.querySelector('.restart').addEventListener('click', resetGame);
    // Modal play again button: close modal and restart
    document.querySelector('.play-again-btn').addEventListener('click', _ => {
        document.querySelector('.modal').classList.add('hidden');
        resetGame();
    });
    resetGame();
}

/**
 * Restart the game, reseting the statistics.
 */
function resetGame() {
    // Reset statistics.
    setMoveCount(0);
    updateRating();
    startTime = Date.now();
    // Start timer if not running
    if (!timerRunning) {
        startTimer();
    }
    // We use 2 cards of each symbol, so we need to duplicate the symbol array
    const cards = cardsSymbols.concat(cardsSymbols);
    const shuffled = shuffle(cards);
    const deckHtml = shuffled.map(generateCardHtml).join('');
    deck.innerHTML = deckHtml;
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', onCardClick);
    });
}

/**
 * Start timer and keep updating the time display.
 */
function startTimer() {
    timerRunning = true;
    const time = getElapsedTime(); 
    document.querySelector('.time').innerHTML = time;
    timer = setTimeout(startTimer, 1000);
}

/**
 * Stop timer.
 */
function stopTimer() {
    timerRunning = false;
    clearTimeout(timer);
}

/**
 * Get the time since the game started in the format HH:mm:ss
 */
function getElapsedTime() {
   const ms = Date.now() - startTime;
   // From milliseconds to hour, minutes, seconds and milliseconds: 
   // https://stackoverflow.com/questions/10874048/from-milliseconds-to-hour-minutes-seconds-and-milliseconds
   const seconds = Math.round((ms / 1000) % 60, 2);
   const minutes = Math.round(((ms / (1000*60)) % 60), 2);
   const hours   = Math.round(((ms / (1000*60*60)) % 24), 2);
   const pad = (n) => (('' + n).padStart(2, 0))
   return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Shuffle function from http://stackoverflow.com/a/2450976
 * @param {Array} array 
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * Card click handler.
 * @param {Event} param0 Click event
 */
function onCardClick({ target: card }) {
    // Ignore click on opened and matched cards or if the game is blocked.
    if (
        card.classList.contains('open') || 
        card.classList.contains('match') || 
        blockCardFlip
    ) {
        return;
    }
    card.classList.add('open', 'show');
    checkForMatches();
    updateRating();
}

/**
 * Generate the HTML for a card.
 * @param {string} symbol 
 */
function generateCardHtml(symbol) {
    return `<li class="card" data-card="${symbol}"><i class="fa ${symbol}"></i></li>`
}

/**
 * Check if the open cards matches and lock them if so.
 */
function checkForMatches() {
    const openCards = document.querySelectorAll('.card.open');
    if (openCards.length < 2) {
        return;
    }
    setMoveCount(moveCount + 1);
    const [card1, card2] = openCards;
    // Match?
    if (card1.dataset.card === card2.dataset.card) {
        markMatchedCards([card1, card2]);
        checkForGameCompletion();
    } else {
        // Block the cards to avoid opening a card while flipping 
        blockCardFlip = true;
        // Close the cards after a while
        setTimeout(() => {
            closeCards(openCards)
            blockCardFlip = false;
        }, 500);
    }
}

/**
 * Mark the cards as matched.
 * @param {Array} cards 
 */
function markMatchedCards(cards) {
    closeCards(cards);
    cards.forEach(card => {
        card.classList.add('match');
    });
}

/**
 * Close the cards.
 * @param {Array} cards 
 */
function closeCards(cards) {
    cards.forEach(card => {
        card.classList.remove('open', 'show');
    });
}

/**
 * Check if all cards were matched and show the modal if so.
 */
function checkForGameCompletion() {
    const notMatchedCards = document.querySelectorAll('.card:not(.match)');
    if (notMatchedCards.length === 0) {
        stopTimer();
        showFinalDialog();
    }
}

/**
 * Update the move count statistics and the display.
 * @param {number} moves 
 */
function setMoveCount(moves) {
    moveCount = moves;
    document.querySelector('.moves').innerHTML = moves === 1 ? 
        `1 Move` :
        `${moves} Moves`;
}

/**
 * Update the ratings statistics based on the move count and update the display.
 */
function updateRating() {
    if (moveCount >= 20) {
        rating = 1;
    } else if (moveCount >= 10) {
        rating = 2;
    } else {
        rating = 3;
    }
    document.querySelector('.stars').innerHTML = Array(rating)
        .fill('<li><i class="fa fa-star"></i></li>')
        .join('');
}

/**
 * Show the final dialog with the updated statistics.
 */
function showFinalDialog() {
    const time = getElapsedTime();
    document.querySelector('.modal .stats-time').innerHTML = time;
    document.querySelector('.modal .stats-moves').innerHTML = moveCount;
    document.querySelector('.modal .stats-rating').innerHTML = Array(rating)
        .fill('<i class="fa fa-star"></i>')
        .join('');
    document.querySelector('.modal').classList.remove('hidden');
}

init();
