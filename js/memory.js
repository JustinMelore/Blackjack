//Keeps track of the player's wins
var wins = 0;
document.getElementsByTagName("span")[0].textContent = wins;

//Keeps track of the amount of guesses the player has left
var moves = 39;
document.getElementsByTagName("h2")[0].textContent = `Moves Left: ${moves}`;

//Keeps track of the cards the player currently has selected
var selectedCards = [];

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

//Resets the site with new cards upon loading the page or playing another game
let resetCards = () => {
    let ranks = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];
    let values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    let cardList = [];
    //Creates a list of all 26 cards
    for (let i in ranks) {
        cardList.push((new Card("hearts", ranks[i], values[i], true)));
        cardList.push((new Card("hearts", ranks[i], values[i], true)));
    }

    //Places the cards out onto the screen
    for(let i=0; i<26; i++) {
        const newCard = document.createElement("div");
        const cardNum = Math.floor(Math.random()*cardList.length);
        const chosenCard = cardList[cardNum];
        cardList.splice(cardNum, 1);
        newCard.classList.add("card");
        newCard.setAttribute("cardRank",chosenCard.rank);
        newCard.setAttribute("cardSuit",chosenCard.suit);
        newCard.style.backgroundImage = `url('images/cardback.svg')`;
        // newCard.style.backgroundImage = `url('images/${chosenCard.rank}_of_${chosenCard.suit}.svg')`;
        const tableCell = document.createElement("td");
        tableCell.appendChild(newCard);
        if(i<13) {
            document.getElementsByTagName("tr")[0].appendChild(tableCell);
        }else{
            document.getElementsByTagName("tr")[1].appendChild(tableCell);
        }
        newCard.style.animation = "addedCard 0.5s forwards";
    }

    //Makes it so each card has clicking functionality
    for(let i of document.getElementsByClassName("card")) i.addEventListener("mousedown",selectCard);   
}

resetCards();

//Function that lets you make a match between two cards on click
function selectCard() {
    if(selectedCards.includes(this)) return;
    selectedCards.push(this);
    this.style.animation = "flipCard 0.5s forwards";
    setTimeout(() => {this.style.backgroundImage = `url('images/${this.getAttribute("cardRank")}_of_${this.getAttribute("cardSuit")}.svg')`}, 250);
    if(selectedCards.length > 1) {
        let firstCard = selectedCards[0];
        let secondCard = selectedCards[1];
        if(selectedCards[0].getAttribute("cardRank") == selectedCards[1].getAttribute("cardRank")) {
            setTimeout(() => {firstCard.style.animation = "removeCard 1s forwards"}, 500);
            setTimeout(() => {firstCard.remove()}, 1500);
            setTimeout(() => {secondCard.style.animation = "removeCard 1s forwards"}, 500);
            setTimeout(() => {secondCard.remove()}, 1500);
            
        }else{
            setTimeout(() => {
                firstCard.style.animation = "returnCard 0.5s forwards";
                setTimeout(() => {firstCard.style.backgroundImage = `url('images/cardback.svg')`}, 250);
                secondCard.style.animation = "returnCard 0.5s forwards";
                setTimeout(() => {secondCard.style.backgroundImage = `url('images/cardback.svg')`  }, 250);             
            }, 550);
        }
        selectedCards = [];
    }
    
}