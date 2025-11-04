// Boss.js
export default class Boss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 100;
    this.health = 50;
    this.maxHealth = 50;

    this.image = new Image();
    this.image.src = "images/boss.png";

    this.direction = 1; 
    this.speed = 2;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 10, this.width, 6);
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x, this.y - 10, (this.width * this.health) / this.maxHealth, 6);
  }

  move(canvas) {
    this.x += this.speed * this.direction;
    if (this.x + this.width > canvas.width || this.x < 0) {
      this.direction *= -1;
    }
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }

  collideWith(sprite) {
    return (
      this.x < sprite.x + sprite.width &&
      this.x + this.width > sprite.x &&
      this.y < sprite.y + sprite.height &&
      this.y + this.height > sprite.y
    );
  }
}
