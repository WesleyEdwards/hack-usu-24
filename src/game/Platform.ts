import { platformHeight } from "../constants";
import { Coor } from "./types";
export type PlatProps = {
  initPos: Coor;
  width: number;
  floor: boolean;
};
export class Platform {
  pos: Coor;
  width: number;
  floor: boolean;
  constructor(props: PlatProps) {
    this.pos = { ...props.initPos };
    this.width = props.width;
    this.floor = props.floor;
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.translate(offsetX + this.pos.x, this.pos.y);
    ctx.fillRect(0, 0, this.width, platformHeight);
    ctx.restore();
  }
}
