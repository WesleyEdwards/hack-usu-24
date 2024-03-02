export type Keys = {
  down: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  hit: boolean;
  jump: boolean;
  jumpBuffer: boolean;
};

export const addEventListeners = () => {
  const keys: Keys = {
    down: false,
    left: false,
    right: false,
    up: false,
    hit: false,
    jump: false,
    jumpBuffer: false,
  };
  window.addEventListener("keydown", (e) => {
    if (e.key === "s") keys.down = true;
    if (e.key === "a") keys.left = true;
    if (e.key === "d") keys.right = true;
    if (e.key === "w") keys.up = true;
    if (e.key === "k") keys.hit = true;
    if (e.key === " ") {
      keys.jump = true;
      keys.jumpBuffer = true;
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "s") keys.down = false;
    if (e.key === "a") keys.left = false;
    if (e.key === "d") keys.right = false;
    if (e.key === "w") keys.up = false;
    if (e.key === " ") keys.jump = false;
  });
  return keys;
};
