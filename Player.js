import Explosion from "./Explosion.js"; 

export default class Player {
    shootPressed = false;
    rightPressed = false;
    leftPressed = false;

    constructor(canvas, velocity, bulletController) {
        this.canvas = canvas;
        this.velocity = velocity;
        this.bulletController = bulletController;
        this.width = 50;
        this.height = 58;
        this.x = (this.canvas.width - this.width) / 2;
        this.y = this.canvas.height - this.height - 30;
        this.lives = 3;
        this.boostCount = 1;

        this.isBoostActive = false;
        this.boostTimer = 0;
        this.normalVelocity = velocity;
        this.boostDuration = 600;
        this.isImmune = false;
        this.isHit = false;
        this.flashTimer = 0;
        this.flashDuration = 60; 

        this.image = new Image();
        this.image.src = 'images/ship2.png';

        this.explosion = null;
        this.explodeSound = new Audio("sounds/explode.mp3");
        this.explodeSound.volume = 0.4;
        this.powerUpSound = new Audio("sounds/power-up.mp3");
        this.powerUpSound.volume = 0.4;
        this.powerDownSound = new Audio("sounds/power-down.mp3");
        this.powerDownSound.volume = 0.4;

        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
    }

    move() {
        if (this.rightPressed && this.x + this.width < this.canvas.width) {
            this.x += this.velocity;
        } else if (this.leftPressed && this.x > 0) {
            this.x -= this.velocity;
        }
    }

    draw(ctx) {
        if (this.explosion) {
            this.explosion.draw(ctx);
            if (this.explosion.done) {
                this.explosion = null;
            }
        }
        if (this.shootPressed && this.bulletController.bulletInterval <= 0) {
            if (this.isBoostActive) {
                this.bulletController.shoot(this.x + this.width / 2 - 35, this.y + 5, -6);
                this.bulletController.shoot(this.x + this.width / 2 - 10, this.y + 5, -6);
                this.bulletController.shoot(this.x + this.width / 2 + 15, this.y + 5, -6);
                this.bulletController.bulletInterval = 15;
            } else {
                this.bulletController.shoot(this.x + this.width / 2 - 10, this.y, -4);
                this.bulletController.bulletInterval = 25;
            }
        }

        this.move();

        if (this.isHit && this.flashTimer > 0) {
            if (Math.floor(this.flashTimer / 5) % 2 === 0) {
                ctx.globalAlpha = 0.4; 
            } else {
                ctx.globalAlpha = 1.0;
            }
            this.flashTimer--;
            if (this.flashTimer <= 0) {
                this.isHit = false;
                ctx.globalAlpha = 1.0;
            }
        } else {
            ctx.globalAlpha = 1.0;
        }


        if (this.isBoostActive) {
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 25;
        } else {
            ctx.shadowBlur = 0;
        }


        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;


        if (this.isBoostActive) {
            this.boostTimer--;
            if (this.boostTimer <= 0) {
                this.deactivateBoost();
            }
        }
    }

    takeDamage() {
        if (this.isImmune) return;

        this.explodeSound.currentTime = 0;
        this.explodeSound.play();
        this.explosion = new Explosion(this.x, this.y);


        this.lives--;
        document.getElementById("lives").textContent = this.lives;

        flashStatr("lives");
        this.isHit = true;
        this.flashTimer = this.flashDuration;


        this.isImmune = true;
        setTimeout(() => (this.isImmune = false), 1500); 
    }

    activateBoost() {
        this.powerUpSound.currentTime = 0;
        this.powerUpSound.play();
        this.isBoostActive = true;
        this.isImmune = true;
        this.boostTimer = this.boostDuration;
        this.velocity = this.normalVelocity * 2;
        this.bulletController.setMaxBullets(500);
    }

    deactivateBoost() {
        this.powerDownSound.currentTime = 0;
        this.powerDownSound.play();
        this.isBoostActive = false;
        this.isImmune = false;
        this.velocity = this.normalVelocity;
        this.bulletController.resetMaxBullets();
    }

    useBoost() {
        if (this.boostCount > 0 && !this.isBoostActive) {
            this.boostCount--;
            this.activateBoost();
        }
    }

    keyDown = (event) => {
        if (event.code === "ArrowRight") this.rightPressed = true;
        if (event.code === "ArrowLeft") this.leftPressed = true;
        if (event.code === "Space") this.shootPressed = true;
        if (event.code === "KeyB") this.useBoost();
    };

    keyUp = (event) => {
        if (event.code === "ArrowRight") this.rightPressed = false;
        if (event.code === "ArrowLeft") this.leftPressed = false;
        if (event.code === "Space") this.shootPressed = false;
    };

    
}
