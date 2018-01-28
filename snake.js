var snakeGameLoopAsInterval;

function snakeStartAndRun(canvasId, closeCb){
  "use strict";

  // Canvas boilerplate
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext('2d');

  // Constants
  var COLOR_FOR_BACKGROUND = 'black';
  var COLOR_FOR_TEXT = 'white';
  var COLOR_FOR_SNAKE = 'blue';
  var COLOR_FOR_APPLE = 'red';
  var TILE_SIZE = 20;
  var TILE_BORDER = 2;
  var TILE_SIZE_WITH_BORDER = TILE_SIZE - TILE_BORDER;
  var MAX_X = canvas.width / TILE_SIZE;
  var MAX_Y = canvas.height / TILE_SIZE;
  var TRAIL_MIN_LENGTH = 5;
  var VELOCITY_TO_UP = { x: 0, y: -1 };
  var VELOCITY_TO_LEFT = { x: -1, y: 0 };
  var VELOCITY_TO_DOWN = { x: 0, y: +1 };
  var VELOCITY_TO_RIGHT = { x: +1, y: 0 };

  // Initial state of some sprites
  var learnedHowToMove = false;
  var apple = { x: 10, y: 10 };
  var snake = {
    head: { x: 5, y: 5 },
    velocity: VELOCITY_TO_RIGHT,
    body: { length: TRAIL_MIN_LENGTH, trail: [] }
  };

  // Keyboard control
  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 87: // W
        if (snake.velocity !== VELOCITY_TO_DOWN) {
          learnedHowToMove = true;
          snake.velocity = VELOCITY_TO_UP;
        }
        break;
      case 65: // A
        if (snake.velocity !== VELOCITY_TO_RIGHT) {
          learnedHowToMove = true;
          snake.velocity = VELOCITY_TO_LEFT;
        }
        break;
      case 83: // S
        if (snake.velocity !== VELOCITY_TO_UP) {
          learnedHowToMove = true;
          snake.velocity = VELOCITY_TO_DOWN;
        }
        break;
      case 68: // D
        if (snake.velocity !== VELOCITY_TO_LEFT) {
          learnedHowToMove = true;
          snake.velocity = VELOCITY_TO_RIGHT;
        }
        break;
      case 27: // Esc
        closeCb();
        break;
    }
  });

  // Game loop
  snakeGameLoopAsInterval = setInterval(function () {
    // Calculate a movement intention, which will be the next trail element
    snake.head.x += snake.velocity.x;
    snake.head.y += snake.velocity.y;

    // Check if this move won't collide with walls, thus correcting such intention
    if (snake.head.x >= MAX_X) {
      snake.head.x = 0;
    }
    if (snake.head.x < 0) {
      snake.head.x = MAX_X;
    }
    if (snake.head.y >= MAX_Y) {
      snake.head.y = 0;
    }
    if (snake.head.y < 0) {
      snake.head.y = MAX_Y;
    }

    // Prepare for drawing, clear canvas
    ctx.fillStyle = COLOR_FOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paint all trail elements, also checking if any of them will collide with this new calculated element
    ctx.fillStyle = COLOR_FOR_SNAKE;
    snake.body.trail.forEach(function (trailPart) {
      ctx.fillRect(trailPart.x * TILE_SIZE, trailPart.y * TILE_SIZE, TILE_SIZE_WITH_BORDER, TILE_SIZE_WITH_BORDER);
      if (trailPart.x === snake.head.x && trailPart.y === snake.head.y) {
        snake.body.length = TRAIL_MIN_LENGTH;
      }
    });

    // Let the calculated trail element start becoming old for the next iteration
    snake.body.trail.push({ x: snake.head.x, y: snake.head.y });

    // The trail hard length must not exceed its logical length, so remove the older elements
    while (snake.body.trail.length > snake.body.length) {
      snake.body.trail.shift();
    }

    // Check if the apple was reached, putting its position elsewhere
    function isAnyTrailPartCollidingWithApple(trailPart) {
      return trailPart.x === apple.x && trailPart.y === apple.y;
    }
    if (snake.body.trail.find(isAnyTrailPartCollidingWithApple)){
      snake.body.length++;
      while (snake.body.trail.find(isAnyTrailPartCollidingWithApple)){
        apple = {
          x: Math.floor(Math.random() * MAX_X),
          y: Math.floor(Math.random() * MAX_Y)
        };
      }
    }

    // Draw the apple
    ctx.fillStyle = COLOR_FOR_APPLE;
    ctx.fillRect(apple.x * TILE_SIZE, apple.y * TILE_SIZE, TILE_SIZE_WITH_BORDER, TILE_SIZE_WITH_BORDER);

    // Show basic controls
    if (!learnedHowToMove) {
      ctx.fillStyle = COLOR_FOR_TEXT;
      ctx.font = "18px Arial";
      ctx.fillText("INSTRUCTIONS:", 10, 30);
      ctx.fillText("Use W, A, S and D", 10, 50);
      ctx.fillText("keys to move the snake.", 10, 70);
    }

  }, 1000 / 10);
}
