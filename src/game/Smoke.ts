import { debounceLog } from "./helpers";

type SmokeParticle = {
  x: number;
  y: number;
  life: number;
  size: number;
  black: boolean;
};

export class Smoke {
  private smoke: SmokeParticle[] = [];
  private smokeTimer = 0;
  private smokeSpeed = 20;

  update(deltaTime: number, coords: (Coor & { player: boolean })[]) {
    const moreCoors = coords.reduce<Coor[]>((acc, c) => {
      const howMany = c.player ? 5 : 40;
      for (let i = 0; i < howMany; i++) {
        const x = c.x + Math.random() * 40 - 5;
        const y = c.y + Math.random() * 40 - 5;
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
        black: Math.random() > 0.5,
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
      if (s.black) {
        ctx.save();
        ctx.fillStyle = "#000000";

        ctx.globalAlpha = 0.2;

        // make a gradiant

        // Draw the circle
        const gradiant = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.size
        );
        gradiant.addColorStop(0, "#000000");
        gradiant.addColorStop(1, "#00000000");
        ctx.fillStyle = gradiant;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
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
      }
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
