import { debounceLog } from "./helpers";

type SmokeParticle = {
  x: number;
  y: number;
  life: number;
  size: number;
};

export class Smoke {
  private smoke: SmokeParticle[] = [];
  private smokeTimer = 0;
  private smokeSpeed = 20;

  update(deltaTime: number, coords: Coor[]) {
    const moreCoors = coords.reduce<Coor[]>((acc, c) => {
      for (let i = 0; i < 5; i++) {
        const x = c.x + Math.random() * 80 - 5;
        const y = c.y + Math.random() * 80 - 5;
        acc.push({ x, y });
      }
      return acc;
    }, []);
    this.smokeTimer += deltaTime / 1000;
    this.smokeTimer = 0;
    moreCoors.forEach((c) => {
      this.smoke.push({
        x: c.x,
        y: c.y,
        life: this.smokeLife,
        size: Math.random() * 20 + 5,
      });
    });
    this.smoke = this.smoke.map((s) => {
      s.life -= deltaTime / 1000;
      s.y -= this.smokeSpeed * (deltaTime / 1000) * 4;

      return s;
    });
    debounceLog(this.smoke.length);
    this.smoke = this.smoke.filter((s) => s.life > 0);
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.translate(offsetX, 0);

    this.smoke.forEach((s) => {
      const centerX = s.x;
      const centerY = s.y;
      const radius = s.size;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );

      gradient.addColorStop(0, "#b0000075");
      gradient.addColorStop(0.2, "#46464675");
      gradient.addColorStop(1, "#ffffff00");

      ctx.fillStyle = gradient;

      // Draw the circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawFront() {
    // ctx.save();
    // ctx.translate(offsetX, 0);
    // ctx.fillStyle = "#61616146";
    // this.smoke.forEach((s) => {
    //   ctx.beginPath();
    //   ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
    //   ctx.fill();
    // });
    // ctx.restore();
  }

  get smokeLife() {
    return Math.random() * 0.5;
  }
}
