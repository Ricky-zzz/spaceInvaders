import Boss from "./Boss.js";

export default class BossController {
  constructor(canvas, enemyBulletController, playerBulletController) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;

    this.boss = new Boss(canvas.width / 2 - 75, 80);

    
    this.bulletInterval = 20;
    this.bulletTimer = this.bulletInterval;

  
    this.spreadInterval = 120;
    this.spreadTimer = this.spreadInterval;

    this.bossDeathSound = new Audio("sounds/explode.mp3");
    this.bossDeathSound.volume = 0.3;

    this.isAlive = true;
  }

  draw(ctx) {
    if (!this.isAlive) return;

    this.boss.move(this.canvas);
    this.fireBullet();
    this.fireSpreadShot();
    this.handleCollision();
    this.boss.draw(ctx);
  }

  // ===== NORMAL STRAIGHT SHOT =====
  fireBullet() {
    if (!this.isAlive) return;

    this.bulletTimer--;
    if (this.bulletTimer <= 0) {
      this.bulletTimer = this.bulletInterval;

      const bulletX = this.boss.x + this.boss.width / 2;
      const bulletY = this.boss.y + this.boss.height;
      this.enemyBulletController.shoot(bulletX, bulletY, 6);
    }
  }

  // ===== SPREAD SHOT =====
  fireSpreadShot() {
    if (!this.isAlive) return;

    this.spreadTimer--;
    if (this.spreadTimer <= 0) {
      this.spreadTimer = this.spreadInterval;

      const centerX = this.boss.x + this.boss.width / 2;
      const bulletY = this.boss.y + this.boss.height;

      const spread = [
        { vx: -3, vy: 6 },
        { vx: -1.5, vy: 6 },
        { vx: 0, vy: 6 },
        { vx: 1.5, vy: 6 },
        { vx: 3, vy: 6 },
      ];

      spread.forEach(({ vx, vy }) => {
        this.enemyBulletController.shoot(centerX, bulletY, vy, 0);
        const bullet = this.enemyBulletController.bullets[this.enemyBulletController.bullets.length - 1];
        if (bullet) bullet.velocityX = vx;
      });
    }
  }

  handleCollision() {
    if (!this.isAlive) return;

    if (this.playerBulletController.collideWith(this.boss)) {
      const dead = this.boss.takeDamage();
      if (dead) {
        this.bossDeathSound.play();
        this.isAlive = false;
        window.score = (window.score || 0) + 2000;
      }
    }
  }

  collideWith(player) {
    return this.isAlive && this.boss.collideWith(player);
  }

  isDefeated() {
    return !this.isAlive;
  }
}
