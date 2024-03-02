import { platformHeight } from "../constants";
import { Coor } from "./types";
// 100 x 50
import sprite from "../assets/platform.png";
export type PlatProps = {
  initPos: Coor;
  width: number;
  floor: boolean;
};
export class Platform {
  pos: Coor;
  width: number;
  floor: boolean;
  img = new Image();
  constructor(props: PlatProps) {
    this.pos = { ...props.initPos };
    this.width = props.width;
    this.floor = props.floor;
    this.img.src = sprite;
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.translate(offsetX + this.pos.x, this.pos.y);
    ctx.fillRect(0, 0, this.width, platformHeight);
    let distance_covered = 0;
    let to_draw = this.img.width;
    while (distance_covered < this.width - 1) {
      if (distance_covered + this.img.width > this.width) {
        to_draw = this.width - distance_covered;
      }
      if (to_draw > 0) {
        ctx.drawImage(
          this.img,
          0,
          0,
          to_draw,
          this.img.height,
          distance_covered,
          0,
          to_draw,
          this.img.height
        );
        distance_covered += to_draw - 1;
      } else {
        break;
      }
    }
    if (this.floor) {
      ctx.fillStyle = "rgba(10, 10, 10, 0.2)";
      ctx.fillRect(0, 0, this.width, platformHeight);
    }
    ctx.restore();
  }
}
