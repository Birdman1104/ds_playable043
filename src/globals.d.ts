declare module 'stats.js';

declare module '*.atlas' {
  const src: string;
  export default src;
}

interface Window {
  game: any;
  startGame: () => void;
}

type TutorialSequenceConfig = {
  text: string;
  duration: number;
  clickToComplete: boolean;
};

type AssetNameAndPath = {
  name: string;
  path: string;
};

type SpineFiles = {
  key: string;
  jsonURL: string;
  atlasURL: string;
  preMultipliedAlpha?: boolean;
};

declare namespace GlobalMixins {
  interface DisplayObjectEvents {
    hideComplete: [string];
    showComplete: [string];
    click: [string];
  }
}

type SpriteConfig = {
  frame: string;
  atlas?: string;
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
  anchor?: Point;
  tint?: number;
  alpha?: number;
  rotation?: number;
};

type PointLike = {
  x: number;
  y: number;
};

type Coordinates = {
  i: number;
  j: number;
};

type ActiveEnemyConfig = {
  points: number;
  type: EnemySkin;
  i: number;
  j: number;
  energy: number;
  scaleX?: 1 | -1;
  spineSkins?: string[];
};

type BackgroundEnemyConfig = {
  points: number;
  type: EnemySkin;
  x: number;
  y: number;
  scaleX?: 1 | -1;
  spineSkins?: string[];
};

type GridChild = Container<DisplayObject> & IPixiChild;

type ICellConfig = {
  name: string;
  debug?: IDebug;
  scale?: CellScale;
  align?: CellAlign;
  cells?: ICellConfig[];
  bounds?: IRawBounds;
  padding?: IRawPadding;
  offset?: IRawPoint;
};

type ChestConfig = {
  i: number;
  j: number;
  points: number;
  loots?: {
    energy?: number;
    diamonds?: number;
    coins?: number;
    item?: LootItem;
  };
};

type RoadTile = {
  i: number;
  j: number;
  gr: Graphics;
  occupiedBy: ActiveEnemy | Chest | null;
  event?: { name?: string; args?: any };
};
