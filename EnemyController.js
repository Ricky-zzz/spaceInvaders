import Enemy from './Enemy.js';
import MovingDirection from './MovingDirection.js';
import Explosion from './Explosion.js';

export default class EnemyController {

    enemyMap = [];
    enemyRows = [];
    currentDirection = MovingDirection.right;
    explosions = [];

    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    moveDownTimerDefault = 20;
    moveDownTimer = this.moveDownTimerDefault;
    BulletIntervalDefault;
    BulletInterval;

    constructor(canvas, enemyBulletController, playerBulletController, fireRate = 40, numRows = 4) {
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;
        this.enemyDeathoSound = new Audio("sounds/explode.mp3");
        this.enemyShootSound = new Audio("sounds/shoot2.mp3");
        this.enemyShootSound.volume = 0.5;
        this.enemyDeathoSound.volume = 0.5;
        this.BulletIntervalDefault = fireRate;
        this.BulletInterval = this.BulletIntervalDefault;
        this.enemyMap = Array(numRows).fill().map(() => [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
        this.createEnemies();
    }

    draw(ctx) {
        this.decrementMoveDownTimer();
        this.updateVelAndDir();
        this.collisionDetection();
        this.drawEnemies(ctx);
        this.resetMoveDownTimer();
        this.fireBullet();

        this.explosions.forEach(explosion => explosion.draw(ctx));
        this.explosions = this.explosions.filter(e => !e.done);
    }

    collisionDetection() {
        this.enemyRows.forEach((row) => {
            for (let i = 0; i < row.length; i++) {
                const enemy = row[i];
                if (this.playerBulletController.collideWith(enemy)) {
                    this.enemyDeathoSound.currentTime = 0;
                    this.enemyDeathoSound.play();

                    this.explosions.push(new Explosion(enemy.x, enemy.y));

                    row.splice(i, 1);
                    i--;
                    window.score += 50;
                    document.getElementById("score").textContent = window.score;
                    flashStat("score");


                    if (Math.random() < 0.1 && window.powerUpCtrl) {
                        window.powerUpCtrl.spawn(enemy.x, enemy.y);
                    }
                }
            }
        });

        this.enemyRows = this.enemyRows.filter((row) => row.length > 0);
    }

    fireBullet() {
        this.BulletInterval--;
        if (this.BulletInterval <= 0) {
            this.BulletInterval = this.BulletIntervalDefault;
            const allEnemies = this.enemyRows.flat();
            if (allEnemies.length === 0) return;
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            if (enemy) {
                this.enemyBulletController.shoot(enemy.x, enemy.y, 3);
                this.enemyShootSound.currentTime = 0;
                this.enemyShootSound.play();
            }
        }
    }


    resetMoveDownTimer() {
        if (this.moveDownTimer <= 0)
            this.moveDownTimer = this.moveDownTimerDefault;
    }

    decrementMoveDownTimer() {
        if (
            this.currentDirection === MovingDirection.downleft ||
            this.currentDirection === MovingDirection.downright
        ) {
            this.moveDownTimer--;
        }
    }

    updateVelAndDir() {
        const firstRow = this.enemyRows[0];
        const lastRow = this.enemyRows[this.enemyRows.length - 1];
        if (!firstRow || !lastRow) return;

        const leftMostEnemy = firstRow[0];
        const rightMostEnemy = firstRow[firstRow.length - 1];

        switch (this.currentDirection) {
            case MovingDirection.right:
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;

                if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
                    this.currentDirection = MovingDirection.downleft;
                }
                break;

            case MovingDirection.left:
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;

                if (leftMostEnemy.x <= 0) {
                    this.currentDirection = MovingDirection.downright;
                }
                break;

            case MovingDirection.downleft:
                if (this.moveDown(MovingDirection.left)) return;
                break;

            case MovingDirection.downright:
                if (this.moveDown(MovingDirection.right)) return;
                break;
        }
    }

    moveDown(nextDirection) {
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;

        if (this.moveDownTimer <= 0) {
            this.currentDirection = nextDirection;
            return true;
        }
        return false;
    }

    drawEnemies(ctx) {
        this.enemyRows.flat().forEach(enemy => {
            enemy.move(this.xVelocity, this.yVelocity);
            enemy.draw(ctx);
        });
    }

    createEnemies() {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    this.enemyRows[rowIndex].push(
                        new Enemy(enemyIndex * 50, rowIndex * 35, enemyNumber)
                    );
                }
            });
        });
    }

    collideWith(sprite) {
        return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
    }
}
