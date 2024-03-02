// This class is to create the smoke effect when the player is moving.
// THe update function receives a list of coordinates where they should be drawn.
// The draw function will draw the smoke in the given coordinates.
// The coordinates will update every frame, so the smoke will be drawn in different places.
// It iwll eventally fade away.

type SmokeParticle = {
  x: number;
  y: number;
  life: number;
};

export class Smoke {
  private smoke: SmokeParticle[] = [];
  private smokeTimer = 0;
  private smokeInterval = 0.05;
  private smokeLife = 0.5;
  private smokeSpeed = 20;

  update(deltaTime: number, coords: Coor[]) {
    this.smokeTimer += deltaTime / 1000;
    if (this.smokeTimer > this.smokeInterval) {
      this.smokeTimer = 0;
      coords.forEach((c) => {
        this.smoke.push({
          x: c.x,
          y: c.y,
          life: this.smokeLife,
        });
      });
    }
    this.smoke = this.smoke.map((s) => {
      s.life -= deltaTime / 1000;
      s.y -= this.smokeSpeed * (deltaTime / 1000);
      return s;
    });
    this.smoke = this.smoke.filter((s) => s.life > 0);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.smoke.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
