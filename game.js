let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGameBtn = document.querySelector(".new-game");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let modeSelect = document.querySelector("#mode");

let turnO = true; 
let gameOver = false;

let boardState = ["", "", "", "", "", "", "", "", ""];

const wincomb = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const resetGame = () => {
  turnO = true;
  gameOver = false;
  boardState = ["", "", "", "", "", "", "", "", ""];
  enableboxes();
  msgContainer.classList.add("hide");
  newGameBtn.classList.add("hide");
};

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (gameOver || boardState[index] !== "") return;

    playerMove(index, "O"); 

    if (!gameOver) {
      setTimeout(() => computerMove(), 400);
    }
  });
});



function playerMove(i, sign = "O") {
  boxes[i].innerText = sign;
  boxes[i].disabled = true;
  boardState[i] = sign;
  checkwin();
}

function computerMove() {
  if (gameOver) return;

  let mode = modeSelect.value;
  let moveIndex;

  if (mode === "easy") moveIndex = easyMove(boardState);
  if (mode === "moderate") moveIndex = moderateMove(boardState);
  if (mode === "hard") moveIndex = hardMove(boardState);

  playerMove(moveIndex, "X");
}


function easyMove(board) {
  const empty = board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);

  return empty[Math.floor(Math.random() * empty.length)];
}


function moderateMove(board) {
  
  for (const [a, b, c] of wincomb) {
    if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
    if (board[a] === "X" && board[b] === "" && board[c] === "X") return b;
    if (board[a] === "" && board[b] === "X" && board[c] === "X") return a;
  }
  
  for (const [a, b, c] of wincomb) {
    if (board[a] === "O" && board[b] === "O" && board[c] === "") return c;
    if (board[a] === "O" && board[b] === "" && board[c] === "O") return b;
    if (board[a] === "" && board[b] === "O" && board[c] === "O") return a;
  }

  return easyMove(board);
}


function minimax(board, depth, isMaximizing) {
  let result = getWinner(board);
  if (result === "X") return 10 - depth;
  if (result === "O") return depth - 10;
  if (!board.includes("")) return 0; // Tie

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = "";
      }
    }
    return best;
  }
}

function hardMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}


function getWinner(board) {
  for (let [a, b, c] of wincomb) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}



const enableboxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

const disabledBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, winner is ${winner}`;
  disabledBoxes();
  msgContainer.classList.remove("hide");
  newGameBtn.classList.remove("hide");
  gameOver = true;
};

const checkwin = () => {
  for (let pattern of wincomb) {
    let [a, b, c] = pattern;
    if (
      boardState[a] !== "" &&
      boardState[a] === boardState[b] &&
      boardState[b] === boardState[c]
    ) {
      showWinner(boardState[a]);
      return;
    }
  }

  // Tie check
  if (!boardState.includes("") && !gameOver) {
    msg.innerText = "It's a Draw!";
    msgContainer.classList.remove("hide");
    newGameBtn.classList.remove("hide");
    gameOver = true;
  }
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
