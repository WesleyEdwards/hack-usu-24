import "./App.css";
import { Button, Stack } from "@mui/joy";
import { enterGameLoop } from "./game/main";
import { useState } from "react";
import { canvasHeight, canvasWidth } from "./constants";

declare global {
  interface Window {
    stopGame: boolean;
  }
}

function App() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <Stack>
        <canvas
          id="canvas"
          width={canvasWidth}
          height={canvasHeight}
          style={{
            border: "2px solid black",
            borderRadius: "10px",
          }}
        />
        <Stack direction="row" justifyContent="center" gap="1rem" margin="1rem">
          <Button
            sx={{
              fontFamily: "Caveat",
              fontSize: "1.5rem",
            }}
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
            sx={{
              fontFamily: "Caveat",
              fontSize: "1.5rem",
            }}
            onClick={(e) => {
              setPlaying(false);
              window.stopGame = true;
              e.stopPropagation();
            }}
            disabled={!playing}
          >
            Stop
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default App;
