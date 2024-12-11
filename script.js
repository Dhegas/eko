const startButton = document.getElementById("startGame");
const menu = document.getElementById("menu");
const gameDiv = document.getElementById("game");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let score = 0;
let level = 1;
let isGameRunning = false;

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 50,
  width: 40,
  height: 20,
  speed: 5,
};

let bullets = [];
let enemies = [];
const enemyConfig = {
  rows: 3,
  cols: 7,
  width: 40,
  height: 20,
  padding: 10,
  offsetX: 50,
  offsetY: 50,
  speed: 1,
};

function startGame() {
  menu.style.display = "none";
  gameDiv.style.display = "block";
  score = 0;
  level = 1;
  isGameRunning = true;
  initEnemies();
  gameLoop();
}

function initEnemies() {
  enemies = []; // Clear existing enemies
  for (let row = 0; row < enemyConfig.rows; row++) {
    for (let col = 0; col < enemyConfig.cols; col++) {
      enemies.push({
        x: enemyConfig.offsetX + col * (enemyConfig.width + enemyConfig.padding),
        y: enemyConfig.offsetY + row * (enemyConfig.height + enemyConfig.padding),
        width: enemyConfig.width,
        height: enemyConfig.height,
        alive: true,
      });
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
  });
}

function drawEnemies() {
  ctx.fillStyle = "green";
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}

function moveBullets() {
  bullets.forEach((bullet) => {
    bullet.y -= 5;
  });
  bullets = bullets.filter((bullet) => bullet.y > 0);
}

function moveEnemies() {
  enemies.forEach((enemy) => {
    enemy.x += enemyConfig.speed;
  });

  const hitWall = enemies.some((enemy) => enemy.alive && (enemy.x + enemy.width > canvas.width || enemy.x < 0));

  if (hitWall) {
    enemyConfig.speed *= -1;
    enemies.forEach((enemy) => {
      enemy.y += 20;
    });
  }
}

function detectCollisions() {
  bullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      if (enemy.alive && bullet.x < enemy.x + enemy.width && bullet.x + 5 > enemy.x && bullet.y < enemy.y + enemy.height && bullet.y + 10 > enemy.y) {
        enemy.alive = false;
        bullet.y = -10; // Remove bullet
        score += 10;
      }
    });
  });
}

function checkLevelComplete() {
  if (enemies.every((enemy) => !enemy.alive)) {
    level++;
    enemyConfig.rows++;
    enemyConfig.speed += 0.5;
    initEnemies();
  }
}

function gameLoop() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullets();
  drawEnemies();

  moveBullets();
  moveEnemies();
  detectCollisions();
  checkLevelComplete();

  scoreDisplay.textContent = `Score: ${score}`;
  requestAnimationFrame(gameLoop);
}

// Player movement
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) {
    player.x -= player.speed;
  }
  if (e.key === "ArrowRight" && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
  if (e.key === " " && isGameRunning) {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
  }
});

startButton.addEventListener("click", startGame);
