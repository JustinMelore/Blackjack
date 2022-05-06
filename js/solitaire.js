//Keeps track of the player's wins
var playerWins = 0;
document.getElementsByClassName("wins").textContent = `Player Wins: ${playerWins}`;

//A class for making a playing card
class Card {
    //Constructor
    constructor(suit, rank, value, hidden) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
        this.hidden = hidden;
    }
}

//A class for making a deck of cards
class Deck {
    //Constructor
    constructor() { 
        this.deck = [];
    }

    //Resets the deck
    resetDeck() {
        let suits = ["clubs", "diamonds", "hearts", "spades"];
        let ranks = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];
        let values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                this.deck.push(new Card(suits[i], ranks[j], values[j]));
            }
        }
    }

    //Grabs a random card from the deck and then removes it from the deck, while also creating the dom element for the card
    drawCard(hidden = false, location) {
        let place = Math.floor(Math.random() * this.deck.length);
        const chosenCard = this.deck[place];
        chosenCard.hidden = hidden;
        this.deck.splice(place, 1);
        const newCard = document.createElement("div");
        newCard.classList.add("card");
        newCard.setAttribute("cardRank",chosenCard.rank);
        newCard.setAttribute("cardSuit",chosenCard.suit);
        (chosenCard.hidden) ? newCard.style.backgroundImage = `url('images/cardback.svg')` : newCard.style.backgroundImage = `url('images/${chosenCard.rank}_of_${chosenCard.suit}.svg')`;
        location.appendChild(newCard);
    }
}

//Deck of all available cards
var deck = new Deck();
deck.resetDeck();

//Resets the cards for the game
let resetCards = (cardDeck) => {
    const cardList = document.getElementsByClassName("card");
    //Gets rid of cards already loaded in
    for(let i=0; i<cardList.length; i++) {
        cardList[0].remove();
        i--;
    }

    //Adds new cards to the 7 columns
    const cardSlots = document.getElementsByClassName("container")[2].children;
    for(let i=0; i<cardSlots.length; i++) {
        for(let j=0; j<=i; j++) (i==j) ? cardDeck.drawCard(false, cardSlots[i]) : cardDeck.drawCard(true, cardSlots[i]);
        //event listener here
    }

    //Adds the remaining cards to the deck at the top left
    const deckSlot = document.getElementsByClassName("container")[1].firstChild;
    for(let i=0; i<deck["deck"].length; i++) {
        cardDeck.drawCard(true, deckSlot);
        i--;
        //Event listener here
    }
}

resetCards(deck);

//Function that lets you pull a card from the deck on the left side of the screen
function takeCard() {
    const cards = this.firstChild.children;
    //Code for if there are still cards remaining in the deck
    for(let i=1; i<cards.length; i++) {
        const transformation = window.getComputedStyle(cards[i])["animationName"]
        if(transformation != "deckFlipCard") {
            if(i>1) cards[i-1].style.zIndex = -1;
            // cards[i].style.transform = "translateX(160%)";
            cards[i].style.animation = "deckFlipCard 0.5s forwards";
            setTimeout(() => {cards[i].style.backgroundImage = `url('images/${cards[i].getAttribute("cardrank")}_of_${cards[i].getAttribute("cardsuit")}.svg')`}, 250);
            return;
        }
    }
    //Code for if all of the cards have been seen
    for(let i=1; i<cards.length; i++) {
        cards[i].style.zIndex = 1;
        cards[i].style.transform = "translateX(10%)";
    }
}

document.getElementsByClassName("container")[1].addEventListener("mousedown",takeCard);