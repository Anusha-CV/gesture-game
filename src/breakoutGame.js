/**
 * Breakout Game Logic
 * Handles paddle, ball, collision detection, and game state
 */

export class Paddle {
  constructor(canvasWidth, canvasHeight) {
    this.width = 100;
    this.height = 15;
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - 40;
    this.canvasWidth = canvasWidth;
    this.speed = 10;
  }

  /**
   * Update paddle position based on normalized palm X (0-1)
   * @param {number} palmX - Normalized X position from gesture detection
   */
  updateFromGesture(palmX) {
    if (palmX !== null && palmX !== undefined) {
      // Map palmX (0-1) to canvas width, centered on paddle
      this.x = palmX * this.canvasWidth - this.width / 2;
      
      // Keep paddle within canvas bounds
      this.x = Math.max(0, Math.min(this.x, this.canvasWidth - this.width));
    }
  }

  /**
   * Draw the paddle on canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add gradient effect
    ctx.strokeStyle = "#00AA00";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Get center X position of paddle
   */
  getCenterX() {
    return this.x + this.width / 2;
  }
}

export class Ball {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.radius = 15;
    this.reset();
  }

  /**
   * Reset ball to center position
   */
  reset() {
    this.x = this.canvasWidth / 2;
    this.y = this.canvasHeight / 2;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isLaunched = false;
  }

  /**
   * Launch the ball with initial velocity
   * @param {number} paddleCenterX - Center X position of paddle for direction
   */
  launch(paddleCenterX = null) {
    if (this.isLaunched) return;

    this.isLaunched = true;
    
    // Launch upward with slight random angle
    const angle = (Math.random() - 0.5) * Math.PI / 4; // ±45 degrees
    const speed = 5;
    
    this.velocityX = Math.sin(angle) * speed;
    this.velocityY = -Math.abs(Math.cos(angle) * speed); // Always upward
  }

  /**
   * Update ball position
   */
  update() {
    if (!this.isLaunched) return;

    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  /**
   * Check collision with walls and bounce
   */
  checkWallCollision() {
    // Left and right walls
    if (this.x - this.radius <= 0 || this.x + this.radius >= this.canvasWidth) {
      this.velocityX = -this.velocityX;
      this.x = Math.max(this.radius, Math.min(this.x, this.canvasWidth - this.radius));
    }

    // Top wall
    if (this.y - this.radius <= 0) {
      this.velocityY = -this.velocityY;
      this.y = this.radius;
    }

    // Bottom wall (ball lost)
    if (this.y - this.radius > this.canvasHeight) {
      return true; // Ball is lost
    }

    return false;
  }

  /**
   * Check collision with paddle and bounce
   * @param {Paddle} paddle
   * @returns {boolean} - True if collision occurred
   */
  checkPaddleCollision(paddle) {
    if (!this.isLaunched) return false;

    // Check if ball is at paddle height
    const ballBottom = this.y + this.radius;
    const ballTop = this.y - this.radius;
    
    if (ballBottom >= paddle.y && ballTop <= paddle.y + paddle.height) {
      // Check horizontal overlap
      if (this.x >= paddle.x && this.x <= paddle.x + paddle.width) {
        // Collision detected!
        this.velocityY = -Math.abs(this.velocityY); // Bounce upward
        
        // Add spin based on where ball hit the paddle
        const hitPosition = (this.x - paddle.x) / paddle.width; // 0 to 1
        const spinFactor = (hitPosition - 0.5) * 2; // -1 to 1
        this.velocityX += spinFactor * 2;
        
        // Limit maximum velocity
        this.velocityX = Math.max(-8, Math.min(8, this.velocityX));
        
        // Move ball above paddle to prevent multiple collisions
        this.y = paddle.y - this.radius;
        
        return true;
      }
    }

    return false;
  }

  /**
   * Draw the ball on canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isLaunched ? "#FFFFFF" : "#FFFF00";
    ctx.fill();
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }
}

export class BreakoutGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.paddle = new Paddle(this.width, this.height);
    this.ball = new Ball(this.width, this.height);
    
    this.score = 0;
    this.bounces = 0;
    this.isGameOver = false;
    this.animationId = null;
  }

  /**
   * Update game state
   */
  update() {
    if (this.isGameOver) return;

    // Update ball position
    this.ball.update();

    // Check collisions
    const ballLost = this.ball.checkWallCollision();
    if (ballLost) {
      this.gameOver();
      return;
    }

    const paddleHit = this.ball.checkPaddleCollision(this.paddle);
    if (paddleHit) {
      this.bounces++;
      this.score += 10;
    }
  }

  /**
   * Draw all game elements
   */
  draw() {
    // Clear canvas
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw game elements
    this.paddle.draw(this.ctx);
    this.ball.draw(this.ctx);

    // Draw HUD
    this.drawHUD();
  }

  /**
   * Draw HUD (score, instructions, etc.)
   */
  drawHUD() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(`Score: ${this.score}`, 10, 25);
    this.ctx.fillText(`Bounces: ${this.bounces}`, 10, 45);

    if (!this.ball.isLaunched) {
      this.ctx.font = "20px Arial";
      this.ctx.fillStyle = "#FFFF00";
      this.ctx.textAlign = "center";
      this.ctx.fillText("👊 Make a FIST to launch!", this.width / 2, this.height / 2 - 30);
      this.ctx.fillText("🖐️ Use OPEN PALM to move paddle", this.width / 2, this.height / 2);
      this.ctx.textAlign = "left";
    }

    if (this.isGameOver) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.ctx.fillRect(0, this.height / 2 - 60, this.width, 120);
      
      this.ctx.font = "32px Arial";
      this.ctx.fillStyle = "#FF0000";
      this.ctx.textAlign = "center";
      this.ctx.fillText("GAME OVER!", this.width / 2, this.height / 2 - 10);
      
      this.ctx.font = "20px Arial";
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.fillText(`Final Score: ${this.score}`, this.width / 2, this.height / 2 + 30);
      this.ctx.textAlign = "left";
    }
  }

  /**
   * Handle game over
   */
  gameOver() {
    this.isGameOver = true;
    setTimeout(() => {
      this.reset();
    }, 3000);
  }

  /**
   * Reset game state
   */
  reset() {
    this.ball.reset();
    this.score = 0;
    this.bounces = 0;
    this.isGameOver = false;
  }

  /**
   * Start game loop
   */
  start() {
    const gameLoop = () => {
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }

  /**
   * Stop game loop
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
