export default class PowerUpController {
  constructor(canvas, player) {
    this.canvas = canvas;
    this.player = player;
    this.powerUps = [];
    this.dropChance = 0.5;
    this.fallSpeed = 3;
    this.pickupsound = new Audio("sounds/pickup.mp3");
    this.pickupsound.volume = 0.5;
  }

  spawn(x, y, type = null) {
    if (!type) type = Math.random() < 0.5 ? "heart" : "boost";

    const image = new Image();
    image.src = type === "heart" ? "images/heart.png" : "images/boost.png";

    this.powerUps.push({ x, y, width: 30, height: 30, type, image });
  }

  draw(ctx) {
    this.powerUps.forEach((p) => {
      p.y += this.fallSpeed;
      ctx.drawImage(p.image, p.x, p.y, p.width, p.height);
    });

    this.checkCollision();
    this.powerUps = this.powerUps.filter((p) => p.y < this.canvas.height);
  }

checkCollision() {
  this.powerUps.forEach((p, i) => {
    if (
      p.x < this.player.x + this.player.width &&
      p.x + p.width > this.player.x &&
      p.y < this.player.y + this.player.height &&
      p.y + p.height > this.player.y
    ) {
      if (p.type === "heart") {
        this.player.lives++;
        document.getElementById("lives").textContent = this.player.lives;
        flashStat("lives");
      } 
      else if (p.type === "boost") {
        this.player.boostCount = (this.player.boostCount || 0) + 1;
        document.getElementById("boost").textContent = this.player.boostCount;
        flashStat("boost");
      }

      this.pickupsound.currentTime = 0;
      this.pickupsound.play();
      this.powerUps.splice(i, 1);
    }
  });
}
}
