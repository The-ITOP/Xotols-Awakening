let shortArray = [];
let imgIndex = 0; 
let imgX = -180; 
let imgY = 120;  
let isJumping = false; 
let jumpSpeed = -15;   
let velocityY = 0;     
let gravity = 0.8;     
let groundLevel = 120; 
let lastDirection = "right";
let fireBreathActive = false; 
let fireBreathStartTime = 0; 
let icicleActive = false;
let iciclesStartTime = 0;
let rockActive = false;
let rockStartTime = 0;

function preload() {
  shortArray[0] = loadImage("stance_right.PNG");
  shortArray[1] = loadImage("stance_left.PNG");
  shortArray[2] = loadImage("fire_left.PNG");
  shortArray[3] = loadImage("fire_right.PNG");
  shortArray[4] = loadImage("icicles.png");
  shortArray[5] = loadImage("rock.png")
}

function setup() {
  createCanvas(800, 700);
}

function draw() {
  background(220);

  // Horizon line
  line(0, 558, 800, 558);

  // Update position for movement and jumping
  moveAnim();
  applyGravity();

  translate(width / 2, height / 2);

  // Display image based on last direction
  if (keys.a) {
    image(shortArray[1], imgX, imgY, 350, 250); 
    lastDirection = "left"; 
  } else if (keys.d) {
    image(shortArray[0], imgX, imgY, 350, 250); right
    lastDirection = "right"; 
  } else {
    // Default to the last direction moved
    if (lastDirection === "left") {
      image(shortArray[1], imgX, imgY, 350, 250); 
    } else {
      image(shortArray[0], imgX, imgY, 350, 250); 
    }
  }
  // fire breath display
  if (fireBreathActive) {
    fireBreath();

    // Check if 500 milliseconds have passed
    if (millis() - fireBreathStartTime > 500) {
      fireBreathActive = false; // Deactivate fire breath
    }
  }
  if (icicleActive){
    icicles();
    
    if (millis() - iciclesStartTime > 750) {
      icicleActive = false;
    }
  }
}

// Function to move the character left/right
function moveAnim() {
  if (keys.a) {
    imgX -= 5; // Move left
  }
  if (keys.d) {
    imgX += 5; // Move right
  }
}

// Object to store the state of each key
const keys = {
  a: false,
  s: false,
  d: false,
};

// Function to handle keydown events
function keyPressed() {
  if (key.toLowerCase() === "a") keys.a = true;
  if (key.toLowerCase() === "s") keys.s = true;
  if (key.toLowerCase() === "d") keys.d = true;

  // Handle jump with W
  if (key.toLowerCase() === "w" && !isJumping) {
    isJumping = true; // Start the jump
    velocityY = jumpSpeed; // Set the upward velocity
    
  }
  if (key === "Shift"){
    icicleActive = true;
    iciclesStartTime = millis();
  }
}

function mousePressed() {
  // Trigger fire breath when mouse is clicked
  fireBreathActive = true;
  fireBreathStartTime = millis(); // Record the current time
}

// Function to handle keyup events
function keyReleased() {
  if (key.toLowerCase() === "a") keys.a = false;
  if (key.toLowerCase() === "s") keys.s = false;
  if (key.toLowerCase() === "d") keys.d = false;
}

// Function to apply gravity and handle jumping
function applyGravity() {
  if (isJumping) {
    imgY += velocityY; // Update the Y position based on velocity
    velocityY += gravity; // Apply gravity to the velocity

    // Check if the character has landed
    if (imgY >= groundLevel) {
      imgY = groundLevel; // Reset Y position to ground level
      isJumping = false;  // End the jump
      velocityY = 0;      // Reset velocity
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
  image(shortArray[4], imgX+40,imgY-30, 250,150)
}

 function rockDraw() {
   image(shortarray[5], imgX,imgY,350,250)
 }
