let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;
let leftPaddleY = 250;
let rightPaddleY = 250;
let playerScore = 0;
let computerScore = 0;
const WINNING_SCORE = 8;
let showingWinScreen = false;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

window.onload = () => {
  canvas = document.getElementById("game-canvas");
  canvasContext = canvas.getContext("2d");
  let framesPerSecond = 30;
  drawEverything();
  moveEverything();
  setInterval(() => {
    drawEverything();
    moveEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", restartGame);

  canvas.addEventListener("mousemove", (e) => {
    let mousePosition = calculateMousePosition(e);
    leftPaddleY = mousePosition.y - PADDLE_HEIGHT / 2;
  });
};

function restartGame() {
  if (showingWinScreen) {
    playerScore = 0;
    computerScore = 0;
    showingWinScreen = false;
  }
}

function calculateMousePosition(e) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = e.clientX - rect.left - root.scrollLeft;
  let mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function ballReset() {
  if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  let rightPaddleYCenter = rightPaddleY + PADDLE_HEIGHT / 2;
  if (rightPaddleYCenter < ballY - 35) {
    rightPaddleY += 6;
  } else if (rightPaddleYCenter > ballY + 35) {
    rightPaddleY -= 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= 10) {
    if (ballY > leftPaddleY && ballY < leftPaddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (leftPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      computerScore++; // Needed before ball reset
      ballReset();
    }
  }
  if (ballX >= canvas.width - 10) {
    if (ballY > rightPaddleY && ballY < rightPaddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (rightPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      playerScore++; // Needed before ball reset
      ballReset();
    }
  }
  if (ballY <= 10) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY >= canvas.height - 10) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 35) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "#FFFFFF");
  }
}
function drawEverything() {
  // Draws the black canvas
  colorRect(0, 0, canvas.width / 2, canvas.height, "#3333FF");
  colorRect(canvas.width / 2, 0, canvas.width / 2, canvas.height, "#1A1A82");

  // Displays who won message
  if (showingWinScreen) {
    if (playerScore >= WINNING_SCORE) {
      canvasContext.fillStyle = "#FFFFFF";
      canvasContext.font = "18px PressStart";
      canvasContext.fillText(`Congratulations, you won!`, 190, 180);
    } else if (computerScore >= WINNING_SCORE) {
      canvasContext.fillStyle = "#FFFFFF";
      canvasContext.font = "18px PressStart";
      canvasContext.fillText(`The computer won.`, 253, 180);
    }

    // Play again message
    canvasContext.fillStyle = "#FFFFFF";
    canvasContext.font = "18px PressStart";
    canvasContext.fillText("Click to play again", 235, 375);
    return;
  }

  drawNet();

  // Left player paddle
  colorRect(0, leftPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  // Right player paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    rightPaddleY,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );

  // Displays the score on the screen
  canvasContext.fillStyle = "#FFFFFF";
  canvasContext.font = "32px Pixelboy";
  canvasContext.fillText(playerScore, 280, 100);
  canvasContext.fillText(computerScore, canvas.width - 280, 100);

  // draws the ball
  pongBall(ballX, ballY, 10, "white");
}

function pongBall(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
