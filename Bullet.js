export default class Bullet {
  constructor(canvas, x, y, velocityY, imagePath, velocityX = 0) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.velocityY = velocityY;
    this.velocityX = velocityX; 

    this.width = 20;
    this.height = 20;

    this.image = new Image();
    this.image.src = imagePath;
  }

  draw(ctx) {
    this.x += this.velocityX; 
    this.y += this.velocityY; 
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWith(sprite) {
    return (
      this.x + this.width > sprite.x &&
      this.x < sprite.x + sprite.width &&
      this.y + this.height > sprite.y &&
      this.y < sprite.y + sprite.height
    );
  }

  offScreen() {
    return (
      this.y + this.height < 0 ||
      this.y > this.canvas.height ||
      this.x + this.width < 0 ||
      this.x > this.canvas.width
    );
  }
}
