import { playerHeight, playerWidth } from "../constants";
import { Parshendi, parshendiHeight, parshendiWidth } from "./Parshendi";
import { Platform } from "./Platform";
import { Player } from "./Player";

export function calculatePlayerPlatCollision(
  player: Player,
  plat: Platform[],
  keyDown: boolean
) {
  plat.forEach((p) => {
    const leftRight =
      player.pos.x < p.pos.x + p.width && player.pos.x + playerWidth > p.pos.x;
    const topBottom =
      player.pos.y + playerHeight >= p.pos.y &&
      player.prevPos.y + playerHeight <= p.pos.y;

    if (!p.floor && keyDown) {
      return false;
    }
    if (leftRight && topBottom) {
      player.setOnPlatform(p.pos.y);
      return true;
    }
    return false;
  });
}

export function calculateParshendiPlatCollision(
  parshendi: Parshendi[],
  plat: Platform[],
) {
  plat.forEach((p) => {
    parshendi.forEach((par) => {
        const leftRight =
          par.pos.x < p.pos.x + p.width && par.pos.x + parshendiWidth > p.pos.x;
        const topBottom =
          par.pos.y + parshendiHeight >= p.pos.y &&
          par.prevPos.y + parshendiHeight <= p.pos.y;
    
        if (leftRight && topBottom) {
          par.setOnPlatform(p.pos.y);
          return true;
        }
        return false;
      });
    })
}
