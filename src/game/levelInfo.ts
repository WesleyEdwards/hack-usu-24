import { FusedProps } from "./Fused";
import { ParshendiProps } from "./Parshendi";
import { PlatProps } from "./Platform";

export type Level = {
  platProps: PlatProps[];
  fusedProps: FusedProps[];
  parshendiProps: ParshendiProps[];
};

const level1: Level = {
  platProps: [
    { initPos: { x: 100, y: 670 }, width: 200, floor: true },
    { initPos: { x: 400, y: 670 }, width: 500, floor: true },
    { initPos: { x: 100, y: 600 }, width: 200, floor: false },
    { initPos: { x: 500, y: 600 }, width: 300, floor: false },
    { initPos: { x: 100, y: 500 }, width: 200, floor: false },
    { initPos: { x: 150, y: 400 }, width: 200, floor: false },
    { initPos: { x: 200, y: 300 }, width: 300, floor: false },
    { initPos: { x: 400, y: 200 }, width: 100, floor: false },
  ],
  fusedProps: [
    { initPos: { x: 100, y: 200 } },
    { initPos: { x: 200, y: 300 } },
  ],
  parshendiProps: [{ initPos: { x: 300, y: 400 } }],
};

export function getLevelInfo(level: number) {
  return { ...level1 };
}
