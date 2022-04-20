//Keeps track of the player's wins
var wins = 0;
document.getElementsByTagName("span")[0].textContent = wins;

//Keeps track of the amount of guesses the player has left
var moves = 39;
document.getElementsByTagName("h2")[0].textContent = `Moves Left: ${moves}`;

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
}

resetCards();