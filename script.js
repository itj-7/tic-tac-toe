const cells = document.querySelectorAll('.cell');
const resultDiv = document.getElementById('result');
const resetButton = document.getElementById('reset');
const turnIndicator = document.getElementById('turn-indicator');
const note = document.getElementById('note');

let currentPlayer = 'X';
let gameOver = false;

const gameBoard = document.getElementById('game-board');
const winLine = document.createElement('div');
winLine.classList.add('win-line');
gameBoard.appendChild(winLine);

turnIndicator.textContent = "Turn: X";

function drawWinLine(pattern) {
  const lineStyles = {
    '0,1,2': { top: '16.66%', left: '50%', width: '100%', transform: 'translate(-50%, -50%) rotate(0deg)' },
    '3,4,5': { top: '50%', left: '50%', width: '100%', transform: 'translate(-50%, -50%) rotate(0deg)' },
    '6,7,8': { top: '83.33%', left: '50%', width: '100%', transform: 'translate(-50%, -50%) rotate(0deg)' },
    '0,3,6': { top: '50%', left: '16.66%', height: '100%', width: '5px', transform: 'translate(-50%, -50%)' },
    '1,4,7': { top: '50%', left: '50%', height: '100%', width: '5px', transform: 'translate(-50%, -50%)' },
    '2,5,8': { top: '50%', left: '83.33%', height: '100%', width: '5px', transform: 'translate(-50%, -50%)' },
    '0,4,8': { top: '50%', left: '50%', width: '141%', transform: 'translate(-50%, -50%) rotate(45deg)' },
    '2,4,6': { top: '50%', left: '50%', width: '141%', transform: 'translate(-50%, -50%) rotate(-45deg)' }
  };

  const key = pattern.sort((a, b) => a - b).join(',');
  const style = lineStyles[key];
  if (style) {
    Object.assign(winLine.style, {
      display: 'block',
      top: style.top,
      left: style.left,
      width: style.width || '5px',
      height: style.height || '5px',
      transform: style.transform
    });
  }
}

function clearWinLine() {
  winLine.style.display = 'none';
  winLine.style.transform = '';
  winLine.style.top = '';
  winLine.style.left = '';
}

cells.forEach(cell => {
  cell.addEventListener('click', function() {
    if (cell.textContent === '' && currentPlayer === 'X' && !gameOver) {
      cell.textContent = 'X';
      if (!checkWinner()) {
        currentPlayer = 'O';
        turnIndicator.textContent = "Turn: O";
        setTimeout(botMove, 300);
      }
    }
  });
});

function botMove() {
  if (gameOver) return;

  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent === '') {
      cells[i].textContent = 'O';
      let score = minimax(cells, 0, false);
      cells[i].textContent = '';

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== undefined) {
    cells[bestMove].textContent = 'O';
    if (!checkWinner()) {
      currentPlayer = 'X';
      turnIndicator.textContent = "Turn: X";
    }
  }
}

function minimax(board, depth, isMaximizing) {
  let winner = getWinner();
  if (winner !== null) {
    const scores = { X: -1, O: 1, draw: 0 };
    return scores[winner];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i].textContent === '') {
        board[i].textContent = 'O';
        let score = minimax(board, depth + 1, false);
        board[i].textContent = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i].textContent === '') {
        board[i].textContent = 'X';
        let score = minimax(board, depth + 1, true);
        board[i].textContent = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function getWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      return cells[a].textContent;
    }
  }

  if ([...cells].every(cell => cell.textContent !== '')) {
    return 'draw';
  }

  return null;
}

const checkWinner = () => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
      resultDiv.textContent = `${cells[a].textContent} wins!`;
      note.classList.add('show');
      drawWinLine(pattern);
      gameOver = true;
      return true;
    }
  }

  if ([...cells].every(cell => cell.textContent !== '')) {
    resultDiv.textContent = "It's a draw!";
    gameOver = true;
    return true;
  }

  clearWinLine();
  return false;
};

const resetGame = () => {
  cells.forEach(cell => cell.textContent = '');
  resultDiv.textContent = '';
  note.classList.remove('show');
  currentPlayer = 'X';
  gameOver = false;
  clearWinLine();
  turnIndicator.textContent = "Turn: X";
};

resetButton.addEventListener('click', resetGame);
