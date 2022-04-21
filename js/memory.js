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
        // newCard.style.backgroundImage = `url('images/cardback.svg')`;
        newCard.style.backgroundImage = `url('images/${chosenCard.rank}_of_${chosenCard.suit}.svg')`;
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
    //Makes sure that clicking on the same card doesn't count as a pair and has moves left
    if(selectedCards.includes(this) || moves<=0) return;
    
    //Flips over the card you selected and adds it to the pair
    selectedCards.push(this);
    this.style.animation = "flipCard 0.5s forwards";
    setTimeout(() => {this.style.backgroundImage = `url('images/${this.getAttribute("cardRank")}_of_${this.getAttribute("cardSuit")}.svg')`}, 250);
    
    //Triggers once the player has a pair
    if(selectedCards.length > 1) {
        let firstCard = selectedCards[0];
        let secondCard = selectedCards[1];
        moves--;
        document.getElementsByTagName("h2")[0].textContent = `Moves Left: ${moves}`;
        //Pair of identical cards
        if(selectedCards[0].getAttribute("cardRank") == selectedCards[1].getAttribute("cardRank")) {
            setTimeout(() => {firstCard.style.animation = "removeCard 1s forwards"}, 500);
            setTimeout(() => {firstCard.remove()}, 1500);
            setTimeout(() => {secondCard.style.animation = "removeCard 1s forwards"}, 500);
            setTimeout(() => {
                secondCard.remove();
                //Checks to see if the player has won
                if(document.getElementsByClassName("card").length == 0) {
                    wins++;
                    document.getElementsByTagName("span")[0].textContent = wins; 
                    gameEnd("Won!","green");
                }                
            }, 1500);
        //Not a matching pair
        }else{
            setTimeout(() => {
                firstCard.style.animation = "returnCard 0.5s forwards";
                setTimeout(() => {firstCard.style.backgroundImage = `url('images/cardback.svg')`}, 250);
                secondCard.style.animation = "returnCard 0.5s forwards";
                setTimeout(() => {
                    secondCard.style.backgroundImage = `url('images/cardback.svg')`;
                }, 250);
                //Checks if the player has run out of moves
                if(moves == 0) {
                    gameEnd("Lost!","red");
                }                           
            }, 550);
        }
        selectedCards = [];
    }
}

//Function that makes a popup screen appear when the game finishes
let gameEnd = (text,color) => {
    //Removes any currently visible cards on the screen
    let cardList = document.getElementsByClassName("card");
    for(let i=0; i<cardList.length; i++) {
        cardList[i].remove();
        i--;
    }
    
    //Makes the game over screen appear
    const popupText = document.getElementsByTagName("span")[1];
    popupText.style.color = color;
    popupText.textContent = text;
    const background = document.getElementsByTagName("section")[0];
    background.style.zIndex = 2;
    background.style.opacity = "100%";
    for(let i of background.children) i.style.transform = "none";
}