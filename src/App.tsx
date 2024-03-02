import "./App.css";
import { Button, CssVarsProvider, Input, Stack } from "@mui/joy";
import { enterGameLoop } from "./game/main";
import { useState } from "react";
import { canvasHeight, canvasWidth, initialLifeCount } from "./constants";

declare global {
  interface Window {
    stopGame: boolean;
    selectedWidth?: number;
  }
}

function App() {
  const [playing, setPlaying] = useState(false);

  // const { mode, setMode } = useColorScheme();
  // useEffect(() => {
  //   setMode("dark");
  // }, []);

  const [lives, setLives] = useState(initialLifeCount);
  const decrementLives = () => setLives((prev) => prev - 1);

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
            style={{
              border: "2px solid black",
              borderRadius: "10px",
            }}
          />
          <Stack
            direction="row"
            justifyContent="center"
            gap="1rem"
            margin="1rem"
          >
            <Button
              sx={{
                fontFamily: "Caveat",
                fontSize: "1.5rem",
              }}
              onClick={(e) => {
                enterGameLoop({
                  decrementLives,
                });
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
          <Stack direction="row" gap="1rem">
            {Array.from({ length: lives }).map((_, i) => (
              <img
                key={i}
                alt="heart"
                src="https://emojicdn.elk.sh/❤️"
                style={{
                  height: "30px",
                  width: "30px",
                }}
              />
            ))}
          </Stack>
          <Input
            sx={{ maxWidth: "400px" }}
            type="number"
            placeholder="Platform Width"
            defaultValue={200}
            onChange={(e) => (window.selectedWidth = +e.target.value)}
          />
        </Stack>
      </>
    </CssVarsProvider>
  );
}

export default App;
