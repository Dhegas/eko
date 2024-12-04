const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

canvas.width = 800;
canvas.height = 600;

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 20,
  color: "white",
  speed: 5,
};

const bullets = [];
const aliens = [];
let score = 0;

function drawRect(rect) {
  ctx.fillStyle = rect.color;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function createAliens() {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      aliens.push({
        x: col * 60 + 50,
        y: row * 40 + 30,
        width: 40,
        height: 20,
        color: "lime",
      });
    }
  }
}

function moveAliens() {
  aliens.forEach((alien) => {
    alien.y += 0.5;
  });
}

function drawAliens() {
  aliens.forEach(drawRect);
}

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10,
    color: "red",
    speed: -7,
  });
}

function drawBullets() {
  bullets.forEach(drawRect);
}

function moveBullets() {
  bullets.forEach((bullet) => {
    bullet.y += bullet.speed;
  });
  bullets.filter((bullet) => bullet.y > 0);
}

function checkCollisions() {
  bullets.forEach((bullet, bIndex) => {
    aliens.forEach((alien, aIndex) => {
      if (bullet.x < alien.x + alien.width && bullet.x + bullet.width > alien.x && bullet.y < alien.y + alien.height && bullet.y + bullet.height > alien.y) {
        bullets.splice(bIndex, 1);
        aliens.splice(aIndex, 1);
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
      }
    });
  });
}

function gameOver() {
  if (aliens.some((alien) => alien.y > canvas.height - 50)) {
    alert("Game Over! Your score is: " + score);
    document.location.reload();
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(player);
  drawBullets();
  moveBullets();
  drawAliens();
  moveAliens();
  checkCollisions();
  gameOver();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) {
    player.x -= player.speed;
  } else if (e.key === "ArrowRight" && player.x < canvas.width - player.width) {
    player.x += player.speed;
  } else if (e.key === " ") {
    shoot();
  }
});

createAliens();
setInterval(update, 1000 / 60);
