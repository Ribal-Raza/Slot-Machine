// 1- Desposit some money in slot machine
// 2- Determine the number of lines to bet on
// 3- Collect a bet amount (how much a user is betting)
// 4- Roll the slot machine
// 5- Check if user won or lost
// 6- Give user winnings if user won
// 7- Play again

const prompt = require("prompt-sync")();

// ROWS and COLUMS variables means the number of rows and columns in slot machine
const ROWS = 3;
const COLUMNS = 3;

//SYMBOLS_COUNT means that how many copies of each symbol is present in slot machine
const SYMBOL_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

// SYMBOL_VALUE means, if a line with same symbol appears after spinning the slot machine, it's value will
// be multipied by the bet amount
const SYMBOL_VALUE = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

//prompt-sync is used to take input in console from user.

//deposit function is responsible for getting valid user amount to roll the slot machine

function deposit() {
  const depositAmount = prompt("Enter your deposit Amount: ");

  //prompt-sync's instace prompt will return the entered amount in strings
  //we have to convert it into integer so we can perform mathematical operatrions on it

  const intDepositAmount = parseFloat(depositAmount);

  //parseFloat will return a number if user has entered a valid number
  //otherwise it will return NaN(Not a Number). In case of NaN, we cant perform
  //mathematical operations on it, so it's better to apply a check/if-else statement
  // that will check for valid value, otherwise will ask user to enter a valid value

  if (isNaN(intDepositAmount) || intDepositAmount <= 0) {
    console.log("You have entered an invalid amount, enter right amount again");

    //here we have called deposit inside deposit function, it is called recurrsion.

    deposit();
  } else {
    return intDepositAmount;
  }
}

// getNumberofLines function will be responsible to get number of mached pattrens lines that user wants
//to bet on, total winning amount will be =  numberOfLines * depositAmount

const getNumberOfLines = () => {
  // here while loop is used to repeat the process in it until user enter valid number of lines

  while (true) {
    const lines = prompt("Enter Number of Lines to bet on (1-3): ");
    const intLines = parseFloat(lines);

    if (
      isNaN(intLines) ||
      intLines <= 0 ||
      intLines > 3 ||
      intLines % 1 !== 0
    ) {
      console.log(
        "You have enterned invalid value for lines, enter correct value!"
      );
    } else {
      return intLines;
    }
  }
};

// getbet function will be responsible for getting a bet amount from the current/available balance

const getBet = (balance, lines) => {
  while (true) {
    const betAmount = prompt(
      `Enter the bet Amount per Line from you availabe ${balance}$ balance: `
    );
    const intBetAmount = parseFloat(betAmount);
    if (
      isNaN(intBetAmount) ||
      intBetAmount > balance / lines ||
      intBetAmount <= 0
    ) {
      console.log(
        "You have enterned invalid amount for bet, enter correct amount!"
      );
    } else {
      return intBetAmount;
    }
  }
};

//spin function will randomly select the symbol in each line
const spin = () => {
  const symbols = [];

  //the outer for loop will iterate through object of SYMBOL_COUNT

  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    //the inner for loop will push the symbol into symbols array according to their count
    // for example in SYMBOL_COUNT "A : 2", so A will be pushed twice into symbols array.

    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  //now when we have got our symbols array with all the symbols, we are gonna select random symbol and
  // push them into an array that will consist of columns and rows
  // reel variable is an array depicting a row
  const reels = [];

  //now to randomly add value to reels, we have to add symbol in each of the columns of the main row
  // outer loop will loop through columns
  for (let i = 0; i < COLUMNS; i++) {
    //reels.push will at a column to the original reels array everytime the loop iterates
    reels.push([]);
    // reelSymbol variable consists of all the symbols through spread operator
    const reelSymbols = [...symbols];

    //inner loop will iterate through rows
    for (let j = 0; j < ROWS; j++) {
      // RandomIndex will randomly select an index of a symbol from reelSymbols array
      const RandomIndex = Math.floor(Math.random() * reelSymbols.length);

      //selected sysmbol will be the value of RandomIndex of reelSymbol
      const seletedSymbol = reelSymbols[RandomIndex];

      //finally the random symbol will be pushed to the inner array of reels array
      reels[i].push(seletedSymbol);
      //now we have to remove the pushed symbol from reelSymbols array so it does not gets selected again
      reelSymbols.splice(RandomIndex, 1);
    }
  }
  return reels;
};

// the output of reels gives an array with three more arrays in it, each element of child array is part
// of a column, to check the values of a row, we would have to match corresponding elements of each child
//array. TO make it easy, we can transponse the array in a manner that returns simple array with three child
// arrays that represent a row, so we write transponse function.

const transpose = (reels) => {
  const newRows = [];

  //outer for loop will iterate through each row
  for (let i = 0; i < ROWS; i++) {
    newRows.push([]);

    //inner loop will add corresponding row values to newRow array
    for (let j = 0; j < COLUMNS; j++) {
      newRows[i].push(reels[i][j]);
    }
  }
  return newRows;
};

const slotResult = (newRows) => {
  for (const row of newRows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winning = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winning += bet * SYMBOL_VALUE[symbols[0]];
    }
  }
  return winning;
};

const gameMachine = () => {
  let balance = deposit();
  while (true) {
    const numberOfLines = getNumberOfLines();
    const betAmount = getBet(balance, numberOfLines);
    balance -= betAmount * numberOfLines;
    const reels = spin();
    const row = transpose(reels);
    const result = slotResult(row);
    const winAmount = getWinnings(row, betAmount, numberOfLines);
    if (winAmount > 0) {
      balance += winAmount;
      console.log("You won " + winAmount + "$");
    } else {
      console.log(
        "You have lost your bet! Your remaining balance is: " + balance
      );
    }

    const playAgain = prompt("Do you want to play Again?(Y/N): ");
    if (playAgain == "N") {
      break;
    }
  }
};
gameMachine();
