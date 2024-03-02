type MateLevelInfo = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  packages: {
    x: number;
    y: number;
  }[];
  opponents: {
    grog: {
      initPos: {
        x: number;
        y: number;
      };
      moveSpeed: number;
      jumpOften: boolean;
    }[];
  };
  platforms: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }[];
  floors: {
    x: number;
    width: number;
    color: string;
  }[];
};

type Coor = {
  x: number;
  y: number;
};

type NightLevelInfo = {
  platProps: {
    initPos: Coor;
    width: number;
    floor: boolean;
  }[];
  fusedProps: { initPos: Coor }[];
  parshendiProps: { initPos: Coor }[];
};

function convertMateToNight(mateLevelInfo: MateLevelInfo): NightLevelInfo {
  const platProps = mateLevelInfo.platforms.map((p) => ({
    initPos: { x: p.x, y: p.y },
    width: p.width,
    floor: false,
  }));
  const fusedProps = mateLevelInfo.packages.map((p) => ({
    initPos: { x: p.x, y: p.y },
  }));
  const parshendiProps = mateLevelInfo.opponents.grog.map((g) => ({
    initPos: g.initPos,
  }));
  return { platProps, fusedProps, parshendiProps };
}
