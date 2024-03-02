import topIdle from "../assets/szeth_idle_(top).png";
import { playerDistFromLeft, playerHeight, playerWidth } from "../constants";
import { Player } from "./Player";

const idle = {
  width: 400,
  height: 650,
};

export class PlayerDrawManager {
  image = new Image();

  constructor() {
    //
  }
  draw(ctx: CanvasRenderingContext2D, player: Player) {
    this.image.src = topIdle;
    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y);
    // drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    const dx = -20;
    const dy = -20;
    ctx.drawImage(this.image, dx, dy);

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, playerWidth, playerHeight);

    // ctx.drawImage(this.image, 0, 0, 64, 64, 0, 0, 64, 64);

    ctx.restore();
  }
}
