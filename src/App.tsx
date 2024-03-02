import "./App.css";
import { Button, CssVarsProvider, Input, Stack } from "@mui/joy";
import { enterGameLoop } from "./game/main";
import { useEffect, useState } from "react";
import {
  canvasHeight,
  canvasWidth,
  initialGravity,
  initialLifeCount,
  initialShootTerminateDist,
  shakeTime,
} from "./constants";
import heartSprite from "./assets/heart_animation_from_sketchy_website.gif";

declare global {
  interface Window {
    stopGame: boolean;
    selectedWidth?: number;
    gravity: number;
    shootTerminateDist: number;
    spearVelMultiplier: number;
    timeMultiplier: number;
  }
}

export type ModifyUI = {
  setShaking: (shaking: boolean) => void;
  decrementLife: () => void;
};

function App() {
  const [playing, setPlaying] = useState(false);

  const [lives, setLives] = useState(initialLifeCount);
  const [shaking, setShaking] = useState(false);
  const decrementLife = () => {
    setLives((prev) => prev - 1);
  };

  useEffect(() => {
    if (!shaking) return;
    const cleanup = setTimeout(() => {
      setShaking(false);
    }, shakeTime);
    return () => clearTimeout(cleanup);
  }, [shaking]);

  useEffect(() => {
    // Initial values
    window.gravity = initialGravity;
    window.shootTerminateDist = initialShootTerminateDist;
    window.spearVelMultiplier = 1;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    const cleanup = setTimeout(() => {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.font = "50px Pirata One";
      ctx.fillStyle = "#800000";
      ctx.textAlign = "center";
      ctx.fillText("Nightblood", canvasWidth / 2, canvasHeight / 2);
    }, 300);
    return () => clearTimeout(cleanup);
  }, []);

  useEffect(() => {
    if (lives === 0) {
      setPlaying(false);
      window.stopGame = true;
    }
  }, [lives]);

  return (
    <CssVarsProvider
      defaultMode="dark"
      modeStorageKey="demo_identify-system-mode"
      disableNestedContext
    >
      <>
        <Stack>
          <canvas
            id="canvas"
            width={canvasWidth}
            height={canvasHeight}
            className={
              shaking ? "move-up-and-down-rapidly fade-in-shadow-box" : ""
            }
            style={{
              border: "2px solid black",
              borderRadius: "10px",
            }}
          />
          <Stack direction="row" justifyContent="space-between" margin="1rem">
            <Stack
              direction="row"
              gap="0.5rem"
              width="24rem"
              alignItems="center"
            >
              {playing &&
                Array.from({ length: lives }).map((_, i) => (
                  <img
                    key={i}
                    alt="heart"
                    src={heartSprite}
                    style={{ height: "50px", width: "50px" }}
                  />
                ))}
            </Stack>
            <Button
              sx={{
                fontFamily: "Pirata One",
                fontSize: "1.5rem",
                minWidth: "200px",
                background: "#800000",
                color: "black",
                "&:hover": {
                  backgroundColor: "#360f0f",
                },
              }}
              onClick={(e) => {
                enterGameLoop({
                  decrementLife,
                  setShaking,
                });
                setPlaying(true);
                window.stopGame = false;
                e.stopPropagation();
              }}
              disabled={playing}
            >
              Play
            </Button>
            <div style={{ width: "24rem" }}></div>
          </Stack>
          <Stack direction="row" gap="1rem"></Stack>
        </Stack>
      </>
    </CssVarsProvider>
  );
}

export default App;
