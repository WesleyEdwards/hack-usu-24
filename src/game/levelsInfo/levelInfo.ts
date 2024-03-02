import { FusedProps } from "../Fused";
import { ParshendiProps } from "../Parshendi";
import { PlatProps } from "../Platform";
import level1 from "./level1.json";

export type Level = {
  platProps: PlatProps[];
  fusedProps: FusedProps[];
  parshendiProps: ParshendiProps[];
};

export function getLevelInfo(level: number) {
  return { ...level1 };
}
