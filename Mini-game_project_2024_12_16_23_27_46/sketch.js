let shortArray = [];
let imgIndex = 0;
let imgX = -180;
let imgY = 120;
let isJumping = false;
let jumpSpeed = -15;
let velocityY = 0;
let gravity = 0.8;
let groundLevel = 120;
let rockLevel = imgY + 20;
let lastDirection = "right";
let fireBreathActive = false;
let fireBreathStartTime = 0;
let icicleActive = false;
let iciclesStartTime = 0;
let rock = null;
//enemies
let enemies = [];
//timer
let seconds = 0; 
let minutes = 0; 
let hours = 0;   

let gameState = "start";
let startScreenText = "Press 'Enter' to Start the Game";

// Timer variables
let timerInterval = null; 

function preload() {
  shortArray[0] = loadImage("stance_right.PNG");
  shortArray[1] = loadImage("stance_left.PNG");
  shortArray[2] = loadImage("fire_left.PNG");
  shortArray[3] = loadImage("fire_right.PNG");
  shortArray[4] = loadImage("icicles.png");
  shortArray[5] = loadImage("rock.png");
  shortArray[6] = loadImage("fireEn.PNG");
  shortArray[7] = loadImage("waterEn.PNG");
  shortArray[8] = loadImage("rockEn.PNG");
  shortArray[9] = loadImage("lightningEn.PNG");
}

function setup() {
  createCanvas(800, 700);
}

function draw() {
  background(220);

  if (gameState === "start") {
    showStartScreen();
  } else if (gameState === "game") {
    runGame();
  }
}

function showStartScreen() {
  textSize(32);
  fill(0);
  textAlign(CENTER, CENTER);
  text(startScreenText, width / 2, height / 2); // Show the "Press Enter" message
  push();
  stroke(0);
  line(160,320,640,320)
  line(160,380,640,380)
  line(160,320,160,380)
  line(640,320,640,380)
  pop();
}

function runGame() {
  if (!timerInterval) {
    startTimer();
  }

  // Enemies
  spawnEnemy();
  moveEnemies();
  drawEnemies();
  moveAnim();
  applyGravity();

  translate(width / 2, height / 2);

  if (keys.a) {
    image(shortArray[1], imgX, imgY, 350, 250);
    lastDirection = "left";
  } else if (keys.d) {
    image(shortArray[0], imgX, imgY, 350, 250);
    lastDirection = "right";
  } else {
    // Default to the last direction moved
    if (lastDirection === "left") {
      image(shortArray[1], imgX, imgY, 350, 250);
    } else {
      image(shortArray[0], imgX, imgY, 350, 250);
    }
  }

  if (fireBreathActive) {
    fireBreath();

    if (millis() - fireBreathStartTime > 500) {
      fireBreathActive = false; // Deactivate fire breath
    }
  }

  if (icicleActive) {
    icicles();

    if (millis() - iciclesStartTime > 750) {
      icicleActive = false;
    }
  }
}

function moveAnim() {
  if (keys.a) {
    imgX -= 8; // Move left
  }
  if (keys.d) {
    imgX += 8; // Move right
  }
}

const keys = {
  a: false,
  s: false,
  d: false,
};

function keyPressed() {
  if (gameState === "start") {
    if (keyCode === ENTER) {
      gameState = "game"; // Start the game
    }
  }

  if (gameState === "game") {
    if (key.toLowerCase() === "a") keys.a = true;
    if (key.toLowerCase() === "s") keys.s = true;
    if (key.toLowerCase() === "d") keys.d = true;

    if (key.toLowerCase() === "w" && !isJumping) {
      isJumping = true; 
      velocityY = jumpSpeed; 
    }
    if (key === "Shift") {
      icicleActive = true;
      iciclesStartTime = millis();
    }

    if (key === " ") {
      dodge(); 
    }
  }
}

function mousePressed() {
  fireBreathActive = true;
  fireBreathStartTime = millis(); 
}

function keyReleased() {
  if (key.toLowerCase() === "a") keys.a = false;
  if (key.toLowerCase() === "s") keys.s = false;
  if (key.toLowerCase() === "d") keys.d = false;
}

function applyGravity() {
  if (isJumping) {
    imgY += velocityY; 
    velocityY += gravity; 

    if (imgY >= groundLevel) {
      imgY = groundLevel; 
      isJumping = false; 
      velocityY = 0; 
    }
  }
}

function fireBreath() {
  if (lastDirection === "left") {
    image(shortArray[2], imgX - 100, imgY + 60, 250, 150);
  } else if (lastDirection === "right") {
    image(shortArray[3], imgX + 190, imgY + 60, 250, 150);
  }
}

function icicles() {
  image(shortArray[4], imgX + 40, imgY - 30, 250, 150);
}

// Enemies
function spawnEnemy() {
  if (frameCount % 120 === 0) {
    const enemyTypes = [6, 7, 8, 9]; 

    for (let i = 0; i < 4; i++) {
      const enemyType = random(enemyTypes); 
      let spawnSide = random(["left", "right", "top"]);
      let spawnX, spawnY, velocityX, velocityY;

      if (spawnSide === "left") {
        spawnX = 0;
        spawnY = random(100, height / 2); 
        velocityX = random(2, 4); 
        velocityY = random(2, 4);
      } else if (spawnSide === "right") {
        spawnX = width;
        spawnY = random(100, height / 2); 
        velocityX = -random(2, 4); 
        velocityY = random(2, 4); 
      } else if (spawnSide === "top") {
        spawnX = random(100, width - 100); 
        spawnY = 0;
        velocityX = 0; 
        velocityY = random(3, 6); 
      }

      let enemy = {
        x: spawnX,
        y: spawnY,
        width: 100,
        height: 100,
        type: enemyType,
        velocityX: velocityX,
        velocityY: velocityY,
      };

      enemies.push(enemy); 
    }
  }
}

function moveEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];

    enemy.x += enemy.velocityX;
    enemy.y += enemy.velocityY;
    if (enemy.y > height || enemy.x < 0 || enemy.x > width) {
      enemies.splice(i, 1); 
    }
  }
}

function drawEnemies() {
  for (let enemy of enemies) {
    image(shortArray[enemy.type], enemy.x, enemy.y, enemy.width, enemy.height); // Draw enemy
  }
}

function dodge() {
  const dodgeDistance = 150;
  if (keys.a) imgX -= dodgeDistance;
  if (keys.d) imgX += dodgeDistance;
}

// Timer function
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++; 

    if (seconds === 60) { 
      seconds = 0;
      minutes++;
    }

    if (minutes === 60) { 
      minutes = 0;
      hours++;
    }
    console.log(`${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`);
  }, 1000); 
}

function padTime(unit) {
  return unit < 10 ? '0' + unit : unit;
}
