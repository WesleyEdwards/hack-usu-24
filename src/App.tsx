import "./App.css";
import { Button, Sheet, Stack } from "@mui/joy";
import { enterGameLoop } from "./game/main";
import { useState } from "react";

export const canvasWidth = 1245;
export const canvasHeight = 700;

declare global {
  interface Window {
    stopGame: boolean;
  }
}

function App() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <Sheet>
        <Stack>
          <canvas id="canvas" width={canvasWidth} height={canvasHeight} />
          <Stack direction="row" justifyContent="center">
            <Button
              onClick={(e) => {
                enterGameLoop();
                setPlaying(true);
                window.stopGame = false;
                e.stopPropagation();
              }}
              disabled={playing}
            >
              Play
            </Button>
            <Button
              onClick={(e) => {
                setPlaying(false);
                window.stopGame = false;
                e.stopPropagation();
              }}
              disabled={!playing}
            >
              Stop
            </Button>
          </Stack>
        </Stack>
      </Sheet>
    </>
  );
}

export default App;
