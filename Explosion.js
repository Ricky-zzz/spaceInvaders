export default class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameInterval = 5; 
    this.frames = [];
    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `images/explode/ex${i}.png`;
      this.frames.push(img);
    }

    this.done = false;
  }

  draw(ctx) {
    if (this.done) return;
    const frame = this.frames[this.frameIndex];
    if (frame) {
      ctx.drawImage(frame, this.x - 10, this.y - 10, 50, 50); 
    }
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frameIndex++;
      this.frameTimer = 0;
    }
    if (this.frameIndex >= this.frames.length) {
      this.done = true;
    }
  }
}
