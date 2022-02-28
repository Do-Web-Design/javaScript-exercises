// //frontPage

const frontPage = document.querySelector(".frontPage");
const sectionsAll = document.querySelectorAll(".section");
const sectionCal = document.querySelector(".calculator");
const sectionTic = document.querySelector(".tictactoe");

const btnTic = document.querySelector("[btn-tic]");
const btnCal = document.querySelector("[btn-cal]");

const btnsReturnTic = document.querySelectorAll(".icon__return");

for (const el of sectionsAll) {
  el.classList.add("hidden");
}

function clickBtn(btn, section) {
  btn.addEventListener("click", function () {
    section.classList.remove("hidden");
    frontPage.classList.add("hidden");
  });
}
clickBtn(btnCal, sectionCal);
clickBtn(btnTic, sectionTic);

for (const el of btnsReturnTic) {
  el.addEventListener("click", function () {
    for (const el of sectionsAll) {
      el.classList.add("hidden");
    }
    frontPage.classList.remove("hidden");
  });
}
////////////////////////////////////////////////////////////////////////
// calculator

class Calculator {
  constructor(previousOutput, currentOutput) {
    this.previousOutputTextElement = previousOutputTextElement;
    this.currentOutputTextElement = currentOutputTextElement;
    this.clean();
  }

  clean() {
    this.previousOutput = "";
    this.currentOutput = "";
    this.operation = undefined;
  }

  appendNumber(number) {
    if (number === "." && this.currentOutput.includes(".")) return;
    this.currentOutput = this.currentOutput.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOutput === "" && operation == "+/-") {
      this.appendNumber("-");
      return;
    }

    if (this.previousOutput !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOutput = this.currentOutput;
    this.currentOutput = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOutput);
    const current = parseFloat(this.currentOutput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "x":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      case "%":
        computation = ((prev * current) / 100).toFixed(2);
        break;
      default:
        return;
    }
    this.currentOutput = computation;
    this.operation = undefined;
    this.previousOutput = "";
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOutputTextElement.innerText = this.getDisplayNumber(
      this.currentOutput
    );
    if (this.operation != null) {
      this.previousOutputTextElement.innerText = `${this.getDisplayNumber(
        this.previousOutput
      )} ${this.operation}`;
    } else {
      this.previousOutputTextElement.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const cleanButton = document.querySelector("[data-all-clear]");
const previousOutputTextElement = document.querySelector(
  "[data-previous-output]"
);
const currentOutputTextElement = document.querySelector(
  "[data-current-output]"
);

const calculator = new Calculator(
  previousOutputTextElement,
  currentOutputTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

cleanButton.addEventListener("click", (button) => {
  calculator.clean();
  calculator.updateDisplay();
});

////////////////////////////////////////////////////////////////////////
//Tic Tac Toe

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boxElements = document.querySelectorAll("[data-box-Tic]");
const boxes = document.getElementById("boxesTic");
const winningMessage = document.getElementById("winningMessageTic");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text-tic]"
);
const restartButton = document.getElementById("restartButtonTic");

let circleTurn;

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  circleTurn = false;
  boxElements.forEach((box) => {
    box.classList.remove(X_CLASS); //restart btn
    box.classList.remove(CIRCLE_CLASS); //restart btn
    box.removeEventListener("click", handleClick); //restart btn
    box.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessage.classList.remove("show"); //restart btn
}

function handleClick(e) {
  console.log("clicked");
  const box = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

  placeMark(box, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    switchTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerHTML = "Draw!";
  } else {
    winningMessageTextElement.innerHTML = `${circleTurn ? "O's" : "X's"} wins!`;
  }
  winningMessage.classList.add("show");
}

function isDraw() {
  return [...boxElements].every((box) => {
    return (
      box.classList.contains(X_CLASS) || box.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(box, currentClass) {
  box.classList.add(currentClass);
}

function switchTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  boxes.classList.remove(X_CLASS);
  boxes.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    boxes.classList.add(CIRCLE_CLASS);
  } else {
    boxes.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return boxElements[index].classList.contains(currentClass);
    });
  });
}
