//Keeps track of the player's and dealer's wins
var playerWins = 0;
var dealerWins = 0;
document.getElementsByTagName("span")[0].textContent = playerWins;
document.getElementsByTagName("span")[1].textContent = dealerWins;

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

    //Grabs a random card from the deck and then removes it from the deck
    drawCard(hidden = false) {
        let place = Math.floor(Math.random() * this.deck.length);
        const chosenCard = this.deck[place];
        chosenCard.hidden = hidden;
        this.deck.splice(place, 1);
        return chosenCard;
    }
}

//A class for the player and dealer's hands
class Hand {
    //Constructor
    constructor(player) {
        this.cards = [];
        this.player = player;
    }

    //Adds a card to the player's hand
    addCard(card) {
        if(!this.hasBusted()) {
            this.cards.push(card);
            const hand = document.getElementById(this.player);
            //Makes sure any aces are switched to ones if the player would normally bust
            for(let c of this.cards) {
                if(c.value === 11 && this.getTotal() > 21) c.value = 1;
            }    
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.setAttribute("cardRank",card.rank);
            newCard.setAttribute("cardSuit",card.suit);
            (card.hidden) ? newCard.style.backgroundImage = `url('images/cardback.svg')` : newCard.style.backgroundImage = `url('images/${card.rank}_of_${card.suit}.svg')`;
            hand.appendChild(newCard);
            newCard.style.animation = "addedCard 0.5s forwards";    
        }
    }

    //Returns the combined value of all the cards in the hand
    getTotal() {
        let totalValue = 0;
        for(let card of this.cards) {totalValue+= card.value;}
        return totalValue;
    }

    //Checks to see if the player has busted
    hasBusted() {return (this.getTotal() > 21 ? true: false);} 
}

    //Sets up the deck and the hands of both the dealer and the player
    const deck = new Deck();
    deck.resetDeck();
    const playerHand = new Hand("player");
    const dealerHand = new Hand("dealer");

    //Function for resetting the dealer and player's hands back to 2, while also resetting the deck
    function resetHands() {
        deck.resetDeck();
        playerHand.cards=[];
        dealerHand.cards=[];
        for (let i = 0; i < 2; i++) playerHand.addCard(deck.drawCard());
        dealerHand.addCard(deck.drawCard(true));
        dealerHand.addCard(deck.drawCard());    
    }

    resetHands();

//Function that lets the player stand and then allows the dealer to go
function dealerTurn() {
    //Part of the function that hides the buttons and reveals the dealer's hidden card
    const cardHands = document.getElementsByClassName("options");
    cardHands[0].style.display = "none";
    cardHands[1].style.display = "none";
    const hiddenCard = document.getElementById("dealer").firstChild;
    hiddenCard.style.animation = "flipCard 0.5s forwards";
    setTimeout(() => {
        document.getElementsByClassName("card")[0].style.backgroundImage = `url('images/${hiddenCard.getAttribute("cardRank")}_of_${hiddenCard.getAttribute("cardSuit")}.svg')`
    }, 250);

    //Part of the function that actually allows the dealer to play
    let interval = setInterval(() => {
        if(dealerHand.getTotal()>=17) {
            clearInterval(interval);
            let background = document.getElementsByTagName("section")[0];
            let text = document.getElementsByTagName("span")[2];
            background.style.zIndex = "2";
            if((dealerHand.hasBusted() && playerHand.hasBusted()) || (dealerHand.getTotal() == playerHand.getTotal())) {
                text.textContent = "Tied!";
                text.style.color = "blue";
            }else if((dealerHand.getTotal() > playerHand.getTotal() && !dealerHand.hasBusted()) || playerHand.hasBusted()) {
                dealerWins++;
                text.textContent = "Lost!";
                text.style.color = "red";
                document.getElementsByTagName("span")[1].textContent = dealerWins;
            }else{
                playerWins++;
                text.textContent = "Win!";
                text.style.color = "green";
                document.getElementsByTagName("span")[0].textContent = playerWins;
            }
            background.style.opacity = "100%";
            for(let i=0; i<background.children.length; i++) background.children[i].style.transform= "none";    
        }else {
            dealerHand.addCard(deck.drawCard());   
        }
    }, 1000);
}

//Gives functionality to the "hit" and "stay" buttons
document.getElementsByClassName("options")[0].addEventListener("mousedown", function () { playerHand.addCard(deck.drawCard())});
document.getElementsByClassName("options")[1].addEventListener("mousedown", dealerTurn);

//Gives functionality to the replay button once a game is finished
document.getElementById("redo").addEventListener("mousedown",function() {
    let background = document.getElementsByTagName("section")[0];
    background.style.opacity = 0;
    for(let i=0; i<background.children.length; i++) {
        background.children[i].style.transform = "translateY(-100%)";
    }
    background.style.zIndex = "-1";
    let cards = document.getElementsByClassName("card");
    for(let i=0; i<cards.length; i++) {
        cards[i].remove();
        i--;
    }
    const cardHands = document.getElementsByClassName("options");
    cardHands[0].style.display = "flex";
    cardHands[1].style.display = "flex";
    resetHands();
})    