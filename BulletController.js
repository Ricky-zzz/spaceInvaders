import Bullet from './Bullet.js';

export default class BulletController {
    bullets = [];
    bulletInterval = 0;

    constructor(canvas, maxBullets, soundEnabled, bulletImage) {
        this.canvas = canvas;
        this.maxBullets = maxBullets;
        this.defaultMaxBullets = maxBullets; 
        this.soundEnabled = soundEnabled;
        this.bulletImage = bulletImage; 
        
        this.shootSound = new Audio("sounds/shoot3.mp3");
        this.shootSound.volume = 0.5;
    }

    draw(ctx) {
        this.bullets.forEach((bullet) => bullet.draw(ctx));
        this.bullets = this.bullets.filter((b) => !b.offScreen());
        if (this.bulletInterval > 0) {
            this.bulletInterval--;
        }
    }

    collideWith(sprite) {
       const bulletHitSpriteIndex = this.bullets.findIndex(bullet => bullet.collideWith(sprite));

        if (bulletHitSpriteIndex >= 0) {
            this.bullets.splice(bulletHitSpriteIndex,1);
            return true;
        }

        return false
    }

    shoot(x, y, velocity, bulletInterval = 0) {
        if (this.bulletInterval <= 0 && this.bullets.length < this.maxBullets) {
            const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletImage); 
            this.bullets.push(bullet);

            if (this.soundEnabled) {
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }

            this.bulletInterval = bulletInterval;
        }
    }
t
    setMaxBullets(limit) {
        this.maxBullets = limit;
    }

    resetMaxBullets() {
        this.maxBullets = this.defaultMaxBullets;
    }
}