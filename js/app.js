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
let rating = 0;

function generateCardHtml(symbol) {
    return `<li class="card" data-card="${symbol}"><i class="fa ${symbol}"></i></li>`
}

function resetGame() {
    setMoveCount(0);
    rating = 0;
    startTime = Date.now();
    const cards = cardsSymbols.concat(cardsSymbols);
    const shuffled = shuffle(cards);
    const deckHtml = shuffled.map(generateCardHtml).join('');
    deck.innerHTML = deckHtml;
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', onCardClick);
    });
}

function onCardClick({ target: card }) {
    if (card.classList.contains('open') || 
        card.classList.contains('match') || 
        blockCardFlip) {
        return;
    }
    card.classList.add('open', 'show');
    checkForMatches();
}

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
        blockCardFlip = true;
        setTimeout(() => {
            closeCards(openCards)
            blockCardFlip = false;
        }, 500);
    }
}

function checkForGameCompletion() {
    const notMatchedCards = document.querySelectorAll('.card:not(.match)');
    if (notMatchedCards.length === 0) {
        const time = Math.round((Date.now() - startTime) / 100, 2); 
        showFinalDialog(time, moveCount, rating);
    }
}

function setMoveCount(moves) {
    moveCount = moves;
    document.querySelector('.moves').innerHTML = moves === 1 ? 
        `1 Move` :
        `${moves} Moves`;
}

function markMatchedCards(cards) {
    closeCards(cards);
    cards.forEach(card => {
        card.classList.add('match');
    });
}

function closeCards(cards) {
    cards.forEach(card => {
        card.classList.remove('open', 'show');
    });
}

function showFinalDialog(time, moves, rating) {
    document.querySelector('.modal .stats-time').innerHTML = time;
    document.querySelector('.modal .stats-moves').innerHTML = moves;
    document.querySelector('.modal .stats-rating').innerHTML = Array(rating)
        .fill('<i class="fa fa-star"></i>')
        .join('');
    document.querySelector('.modal').classList.remove('hidden');
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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

function init() {
    document.querySelector('.restart').addEventListener('click', resetGame);
    resetGame();
}

init();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
