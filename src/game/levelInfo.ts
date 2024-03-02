type Level = {
  blockProps: { x: number; y: number; width: number; height: number }[];
  fusedProps: { x: number; y: number }[];
  parshendiProps: { x: number; y: number }[];
};

const level1: Level = {
  blockProps: [
    { x: 0, y: 600, width: 1245, height: 100 },
    { x: 0, y: 400, width: 100, height: 200 },
    { x: 1145, y: 400, width: 100, height: 200 },
    { x: 200, y: 300, width: 100, height: 100 },
    { x: 200, y: 500, width: 100, height: 100 },
    { x: 945, y: 300, width: 100, height: 100 },
    { x: 945, y: 500, width: 100, height: 100 },
  ],
  fusedProps: [
    { x: 200, y: 200 },
    { x: 200, y: 300 },
  ],
  parshendiProps: [{ x: 300, y: 400 }],
};

export function getLevelInfo(level: number) {
  return { ...level1 };
}
