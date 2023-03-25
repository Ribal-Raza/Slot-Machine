const prompt = require("prompt-sync")();
var location1 = 3;
var location2 = 4;
var location3 = 5;
var guess;
var hits = 0;
var guesses = 0;
var isSunk = false;
while (isSunk == false) {
  guess = prompt("Ready, aim, fire! (enter a number from 0-6):");
  if (guess < 0 || guess > 6) {
    console.log("Please enter a valid cell number!");
  } else {
    guesses = guesses + 1;
    if (guess == location1 || guess == location2 || guess == location3) {
      console.log("HIT!");
      hits = hits + 1;
      if (hits == 3) {
        isSunk = true;
        console.log("You sank my battleship!");
      }
    } else {
      console.log("MISS");
    }
  }
}
var stats =
  "You took " +
  guesses +
  " guesses to sink the battleship, " +
  "which means your shooting accuracy was " +
  (3 / guesses) * 100 +
  "%";
console.log(stats);
