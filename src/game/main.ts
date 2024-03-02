import { GameState } from "./GameState";

export function enterGameLoop() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const gameState = new GameState(ctx);

  let lastTime = 0;
  function update(deltaTime: number) {
    gameState.update(deltaTime);
  }

  function draw() {
    gameState.draw();
  }

  function gameLoop(timeStamp: number) {
    if (window.stopGame) return;
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    update(deltaTime);
    draw();

    if (!window.stopGame) {
      requestAnimationFrame(gameLoop);
    }
  }

  requestAnimationFrame(gameLoop);
}
