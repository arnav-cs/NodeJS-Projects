const prompt = require("prompt-sync")();

const ROWS = 3;
const COLUMNS = 3;
let initialBalance = 0;
let totalWinnings = 0;


const SYMBOL_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

const deposit = () => {
    while (true) {
        const depositAmount = prompt('Enter the amount to deposit: ');
        const numDepositAmount = parseFloat(depositAmount);

        if (isNaN(numDepositAmount) || numDepositAmount <= 0) {
            console.log("Invalid Deposit Amount. Try again!");
        } else {
            return numDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1 - 3): ");
        const numOfLines = parseInt(lines);

        if (isNaN(numOfLines) || numOfLines <= 0 || numOfLines > 3) {
            console.log("Invalid number of lines. Select between 1 - 3. Try again!");
        } else {
            return numOfLines;
        }
    }
};

const getChoice = () => {
    while (true) {
        const choice = prompt('Pick an option (1-5): ');
        const numChoice = parseInt(choice);
        if (isNaN(numChoice) || numChoice < 1 || numChoice > 5) {
            console.log('Pick a valid option between 1 and 5.');
        } else {
            return numChoice;
        }
    }
};

const getBetPerLine = (balance, lines) => {
    console.log('1. Bet $1 per line');
    console.log('2. Bet $5 per line');
    console.log('3. Bet $10 per line');
    console.log('4. Bet $50 per line');
    console.log('5. Custom amount per line');

    let betAmount = 0;

    switch (getChoice()) {
        case 1: betAmount = 1; break;
        case 2: betAmount = 5; break;
        case 3: betAmount = 10; break;
        case 4: betAmount = 50; break;
        case 5:
            while (true) {
                const custom = prompt('Enter custom bet amount per line: ');
                betAmount = parseFloat(custom);
                if (isNaN(betAmount) || betAmount <= 0) {
                    console.log("Invalid custom amount.");
                } else {
                    break;
                }
            }
            break;
    }

    const totalBet = betAmount * lines;

    if (totalBet > balance) {
        console.log(`Insufficient Balance. You only have $${balance}`);
        return getBetPerLine(balance, lines);
    } else {
        console.log(`Betting $${betAmount} on ${lines} lines (Total: $${totalBet})`);
        return betAmount;
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLUMNS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transposeReels = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLUMNS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        console.log(row.join(" | "));
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        const firstSymbol = symbols[0];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol !== firstSymbol) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[firstSymbol];
        }
    }

    return winnings;
};


const game = () => {
    initialBalance = deposit();
    let balance = initialBalance;

    while (true) {
        console.log(`\nYour current balance is: $${balance}`);
        const numberOfLines = getNumberOfLines();
        const betPerLine = getBetPerLine(balance, numberOfLines);
        const totalBet = betPerLine * numberOfLines;

        balance -= totalBet;

        const reels = spin();
        const rows = transposeReels(reels);
        printRows(rows);

        const winnings = getWinnings(rows, betPerLine, numberOfLines);
        totalWinnings += winnings;
        balance += winnings;

        console.log(`You won: $${winnings}`);
        console.log(`Your new balance is: $${balance}`);

        const playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain.toLowerCase() !== "y") {
            break;
        }
    }

    const netProfit = balance - initialBalance;
    console.log("\nGame Over!");
    console.log(`Final Balance: $${balance}`);
    if (netProfit > 0) {
        console.log(`You won a total of $${netProfit}!`);
    } else if (netProfit < 0) {
        console.log(`You lost a total of $${Math.abs(netProfit)}.`);
    } else {
        console.log("You broke even.");
    }
};


game();
