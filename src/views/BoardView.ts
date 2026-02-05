import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import anime from 'animejs';
import {
  LEVEL_CONFIG,
  MISFILLED1,
  MISFILLED10,
  MISFILLED11,
  MISFILLED12,
  MISFILLED13,
  MISFILLED14,
  MISFILLED2,
  MISFILLED3,
  MISFILLED4,
  MISFILLED5,
  MISFILLED6,
  MISFILLED7,
  MISFILLED8,
  MISFILLED9,
} from '../configs/LevelConfig';
import { SpriteEffects } from '../utils/ShineEffects';
import { makeSprite } from '../utils/Utils';

const CELL_SIZE = 133;
const CELL_COUNT_X = 64;
const CELL_COUNT_Y = 56;

// Animation constants
const INIT_DELAY = 200; // 2 seconds
const ZOOM_DURATION = 1000;
const ZOOM_SCALE = 2.2;

const gemsConfig: Record<string, string> = {
  '11': 'black',
  '15': 'grey',
  '17': 'yellow_light',
  '9': 'orange',
  '6': 'yellow',
  '13': 'brown_light',
};

const getGemColor = (id: number): string => {
  return gemsConfig[id.toString()] || 'yellow';
};

export class BoardView extends Container {
  private boardRoot = new Container();
  private backgroundLayer = new Container();
  private gemsLayer = new Container();
  private stack1 = new Container();
  private stack2 = new Container();
  private misfilledLayer1 = new Container();
  private misfilledLayer1Background = new Container();
  private misfilledLayer1Gems = new Container();
  private misfilledLayer2 = new Container();
  private misfilledLayer2Background = new Container();
  private misfilledLayer2Gems = new Container();
  private boardSlots = new Map<string, { background: Sprite; gem?: Sprite; color: string }>();
  private stack1Slots: { x: number; y: number; gem?: Sprite }[] = [];
  private stack2Slots: { x: number; y: number; gem?: Sprite }[] = [];
  private misfilledMap1 = new Map<
    string,
    { background: Sprite; wrong: string; correct: string; gem: Sprite | null }
  >();
  private misfilledMap2 = new Map<
    string,
    { background: Sprite; wrong: string; correct: string; gem: Sprite | null }
  >();

  private activeColor: string = '';

  private gemsGroup11: (Sprite | null)[] = [];
  private gemsGroup12: (Sprite | null)[] = [];
  private gemsGroup13: (Sprite | null)[] = [];
  private gemsGroup14: (Sprite | null)[] = [];
  private gemsGroup15: (Sprite | null)[] = [];
  private gemsGroup16: (Sprite | null)[] = [];
  private gemsGroup17: (Sprite | null)[] = [];

  private cellsGroup11: Sprite[] = [];
  private cellsGroup12: Sprite[] = [];
  private cellsGroup13: Sprite[] = [];
  private cellsGroup14: Sprite[] = [];
  private cellsGroup15: Sprite[] = [];
  private cellsGroup16: Sprite[] = [];
  private cellsGroup17: Sprite[] = [];

  private correctCounter = 0;
  private misfills = 7;

  private gemsGroup21: (Sprite | null)[] = [];
  private gemsGroup22: (Sprite | null)[] = [];
  private gemsGroup23: (Sprite | null)[] = [];
  private gemsGroup24: (Sprite | null)[] = [];
  private gemsGroup25: (Sprite | null)[] = [];
  private gemsGroup26: (Sprite | null)[] = [];
  private gemsGroup27: (Sprite | null)[] = [];

  private cellsGroup21: Sprite[] = [];
  private cellsGroup22: Sprite[] = [];
  private cellsGroup23: Sprite[] = [];
  private cellsGroup24: Sprite[] = [];
  private cellsGroup25: Sprite[] = [];
  private cellsGroup26: Sprite[] = [];
  private cellsGroup27: Sprite[] = [];

  private chosenGems: Sprite[] = [];

  private stack1Filled = false;
  private stack2Filled = false;

  private stack1Map = new Map<string, { gem?: Sprite }>();
  private stack2Map = new Map<string, { gem?: Sprite }>();

  private animationInProgress = false;

  constructor() {
    super();

    this.addChild(this.boardRoot);
    this.boardRoot.addChild(this.backgroundLayer);
    this.boardRoot.addChild(this.gemsLayer);
    this.boardRoot.addChild(this.stack1);
    this.boardRoot.addChild(this.stack2);
    this.misfilledLayer1.addChild(this.misfilledLayer1Background);
    this.misfilledLayer1.addChild(this.misfilledLayer1Gems);
    this.misfilledLayer2.addChild(this.misfilledLayer2Background);
    this.misfilledLayer2.addChild(this.misfilledLayer2Gems);
    this.boardRoot.addChild(this.misfilledLayer1);
    this.boardRoot.addChild(this.misfilledLayer2);

    this.drawBoard();
    this.buildStack1();
    this.buildStack2();
    this.buildSegment1();
    this.buildSegment2();

    setTimeout(() => {
      this.zoomIntoSegment1();
    }, INIT_DELAY);
  }

  public getBounds(): Rectangle {
    return new Rectangle(250, 250, CELL_SIZE * CELL_COUNT_X + 500, CELL_SIZE * CELL_COUNT_Y + 500);
  }

  private drawBoard(): void {
    const { height } = this.getBounds();
    for (const block of LEVEL_CONFIG.data.Layout) {
      const [x, y] = block.Position.split(';').map((value) => Number(value));
      if (Number.isNaN(x) || Number.isNaN(y)) continue;
      const color = getGemColor(block.Color);

      const { cx, cy } = this.getCellCenter(x, y, height);

      const empty = makeSprite({ frame: `empty_${color}.png`, atlas: 'gems', x: cx, y: cy });
      const gemSprite = makeSprite({ frame: `gem_${color}.png`, atlas: 'gems', x: cx, y: cy });
      this.backgroundLayer.addChild(empty);
      this.gemsLayer.addChild(gemSprite);

      this.boardSlots.set(this.getKey(x, y), { background: empty, gem: gemSprite, color });
    }
  }

  private buildStack1(): void {
    const cols = 11;
    const rows = 2;

    const startX = 4850;
    const startY = 3500;

    this.stack1.position.set(startX, startY);
    this.stack1Slots = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const slotX = col * CELL_SIZE;
        const slotY = row * CELL_SIZE;
        const empty = makeSprite({
          frame: 'empty_white.png',
          atlas: 'gems',
          x: slotX,
          y: slotY,
        });
        empty.eventMode = 'static';
        empty.on('pointerdown', () => this.onStackClick());
        this.stack1.addChild(empty);
        this.stack1Slots.push({ x: slotX, y: slotY });
      }
    }

    this.stack1.alpha = 0;
  }

  private buildStack2(): void {
    const cols = 11;
    const rows = 2;

    const startX = 1400;
    const startY = 5750;

    this.stack2.position.set(startX, startY);
    this.stack2Slots = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const slotX = col * CELL_SIZE;
        const slotY = row * CELL_SIZE;
        const empty = makeSprite({
          frame: 'empty_white.png',
          atlas: 'gems',
          x: slotX,
          y: slotY,
        });
        empty.eventMode = 'static';
        empty.on('pointerdown', () => this.onStack2Click());
        this.stack2.addChild(empty);
        this.stack2Slots.push({ x: slotX, y: slotY });
      }
    }

    this.stack2.alpha = 0;
  }

  private onStackClick(): void {
    if (!this.activeColor || this.animationInProgress) return;

    if (this.stack1Filled) {
      //
    } else {
      this.moveGemsToStack1();
    }
  }

  private onStack2Click(): void {
    if (!this.activeColor || this.animationInProgress) return;

    if (this.stack2Filled) {
      //
    } else {
      this.moveGemsToStack2();
    }
  }

  private moveGemsToStack1(): void {
    this.animationInProgress = true;
    this.stack1Filled = true;
    this.activeColor = '';
    this.stack1Slots.forEach((s, i) => {
      const gem = this.chosenGems[this.chosenGems.length - i - 1];
      if (!gem) return;
      gem.scale.set(0.8, 0.8);
      anime({
        targets: gem,
        x: this.stack1.x + s.x,
        y: this.stack1.y + s.y,
        duration: 300,
        delay: i * 10,
        easing: 'easeInOutSine',
        complete: () => {
          gem.scale.set(1, 1);
          if (i === this.chosenGems.length - 1) {
            this.chosenGems.forEach((gem) => {
              this.misfilledMap1.forEach((m, k) => {
                if (m.gem === gem) {
                  this.stack1Map.set(k, { gem: gem as Sprite });
                  this.misfilledMap1.set(k, {
                    background: m.background,
                    wrong: m.wrong,
                    correct: m.correct,
                    gem: null,
                  });
                }
              });
            });

            this.chosenGems = [];
            this.animationInProgress = false;
          }
        },
      });
    });
  }

  private moveGemsToStack2(): void {
    this.animationInProgress = true;
    this.stack2Filled = true;
    this.activeColor = '';
    this.stack2Slots.forEach((s, i) => {
      const gem = this.chosenGems[this.chosenGems.length - i - 1];
      if (!gem) return;
      gem.scale.set(0.8, 0.8);
      anime({
        targets: gem,
        x: this.stack2.x + s.x,
        y: this.stack2.y + s.y,
        duration: 300,
        delay: i * 10,
        easing: 'easeInOutSine',
        complete: () => {
          gem.scale.set(1, 1);
          if (i === this.chosenGems.length - 1) {
            this.chosenGems.forEach((gem) => {
              this.misfilledMap2.forEach((m, k) => {
                if (m.gem === gem) {
                  this.stack2Map.set(k, { gem: gem as Sprite });
                  this.misfilledMap2.set(k, {
                    background: m.background,
                    wrong: m.wrong,
                    correct: m.correct,
                    gem: null,
                  });
                }
              });
            });

            this.chosenGems = [];
            this.animationInProgress = false;
          }
        },
      });
    });
  }

  private getCellCenter(x: number, y: number, height: number): { cx: number; cy: number } {
    return {
      cx: (x + 0.5) * CELL_SIZE,
      cy: -(y + 0.5) * CELL_SIZE + height,
    };
  }

  private getMisfilledMap1(): Map<string, { background: string; wrong: string; correct: string }> {
    const map = new Map<string, { background: string; wrong: string; correct: string }>();
    const segments = [
      { positions: MISFILLED1, background: 'black', wrong: 'orange', correct: 'black' },
      { positions: MISFILLED2, background: 'yellow', wrong: 'grey', correct: 'yellow' },
      { positions: MISFILLED3, background: 'white', wrong: 'yellow', correct: 'white' },
      { positions: MISFILLED4, background: 'yellow', wrong: 'orange', correct: 'yellow' },
      { positions: MISFILLED5, background: 'grey', wrong: 'yellow', correct: 'grey' },
      { positions: MISFILLED6, background: 'orange', wrong: 'black', correct: 'orange' },
      { positions: MISFILLED7, background: 'orange', wrong: 'white', correct: 'orange' },
    ];

    for (const segment of segments) {
      for (const pos of segment.positions) {
        map.set(this.getKey(pos.x, pos.y), {
          background: segment.background,
          wrong: segment.wrong,
          correct: segment.correct,
        });
      }
    }

    return map;
  }

  private getMisfilledMap2(): Map<string, { background: string; wrong: string; correct: string }> {
    const map = new Map<string, { background: string; wrong: string; correct: string }>();
    const segments = [
      { positions: MISFILLED8, background: 'grey', wrong: 'brown_light', correct: 'grey' },
      { positions: MISFILLED9, background: 'black', wrong: 'yellow', correct: 'black' },
      { positions: MISFILLED10, background: 'grey', wrong: 'orange', correct: 'grey' },
      {
        positions: MISFILLED11,
        background: 'brown_light',
        wrong: 'orange',
        correct: 'brown_light',
      },
      { positions: MISFILLED12, background: 'orange', wrong: 'black', correct: 'orange' },
      { positions: MISFILLED13, background: 'orange', wrong: 'grey', correct: 'orange' },
      { positions: MISFILLED14, background: 'yellow', wrong: 'grey', correct: 'yellow' },
    ];

    for (const segment of segments) {
      for (const pos of segment.positions) {
        map.set(this.getKey(pos.x, pos.y), {
          background: segment.background,
          wrong: segment.wrong,
          correct: segment.correct,
        });
      }
    }

    return map;
  }

  private getKey(x: number, y: number): string {
    return `${x};${y}`;
  }

  private buildSegment1(): void {
    const segment = LEVEL_CONFIG.data.Segments?.[0];
    if (!segment || segment.Positions.length === 0) return;

    const misfilledMap = this.getMisfilledMap1();
    const { height } = this.getBounds();
    const layoutColorMap = new Map<string, string>();

    for (const block of LEVEL_CONFIG.data.Layout) {
      layoutColorMap.set(block.Position, getGemColor(block.Color));
    }

    for (const position of segment.Positions) {
      const [x, y] = position.split(';').map((value) => Number(value));
      if (Number.isNaN(x) || Number.isNaN(y)) continue;
      const key = this.getKey(x, y);
      const slot = this.boardSlots.get(key);
      const misfilled = misfilledMap.get(key);

      const { cx, cy } = this.getCellCenter(x, y, height);

      if (!misfilled) {
        const empty = makeSprite({
          frame: `empty_${slot?.color ?? 'black'}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        this.misfilledLayer1Background.addChild(empty);
        const gem = makeSprite({
          frame: `gem_${slot?.color ?? 'black'}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        this.misfilledLayer1Background.addChild(gem);
      } else {
        const empty = makeSprite({
          frame: `empty_${misfilled.background}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        empty.eventMode = 'static';
        empty.on('pointerdown', () => this.onMisfilled1EmptyClick(x, y, misfilled.correct));
        this.misfilledLayer1Background.addChild(empty);

        const gem = makeSprite({
          frame: `gem_${misfilled.wrong}_wrong.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        gem.eventMode = 'static';
        gem.on('pointerdown', () => this.onMisfilled1GemClick(x, y, misfilled.wrong));
        this.misfilledLayer1Gems.addChild(gem);

        this.misfilledMap1.set(key, {
          background: empty,
          wrong: misfilled.wrong,
          correct: misfilled.correct,
          gem: gem,
        });
      }
    }

    const gemsGroup11 = MISFILLED1.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.gem;
    }).filter((g) => g !== undefined);
    const cellsGroup11 = MISFILLED1.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.gemsGroup11 = gemsGroup11;

    this.cellsGroup11 = cellsGroup11;

    const gemsGroup12 = MISFILLED2.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup12 = gemsGroup12;
    const cellsGroup12 = MISFILLED2.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup12 = cellsGroup12;

    const gemsGroup13 = MISFILLED3.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup13 = gemsGroup13;
    const cellsGroup13 = MISFILLED3.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup13 = cellsGroup13;

    const gemsGroup14 = MISFILLED4.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup14 = gemsGroup14;
    const cellsGroup14 = MISFILLED4.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup14 = cellsGroup14;

    const gemsGroup15 = MISFILLED5.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup15 = gemsGroup15;
    const cellsGroup15 = MISFILLED5.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup15 = cellsGroup15;

    const gemsGroup16 = MISFILLED6.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup16 = gemsGroup16;
    const cellsGroup16 = MISFILLED6.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup16 = cellsGroup16;

    const gemsGroup17 = MISFILLED7.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup17 = gemsGroup17;
    const cellsGroup17 = MISFILLED7.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap1.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup17 = cellsGroup17;
  }

  private buildSegment2(): void {
    const segment = LEVEL_CONFIG.data.Segments?.[1];
    if (!segment || segment.Positions.length === 0) return;
    const { height } = this.getBounds();

    const misfilledMap = this.getMisfilledMap2();
    const layoutColorMap = new Map<string, string>();

    for (const block of LEVEL_CONFIG.data.Layout) {
      layoutColorMap.set(block.Position, getGemColor(block.Color));
    }

    for (const position of segment.Positions) {
      const [x, y] = position.split(';').map((value) => Number(value));
      if (Number.isNaN(x) || Number.isNaN(y)) continue;
      const key = this.getKey(x, y);
      const slot = this.boardSlots.get(key);
      const misfilled = misfilledMap.get(key);

      const { cx, cy } = this.getCellCenter(x, y, height);

      if (!misfilled) {
        const empty = makeSprite({
          frame: `empty_${slot?.color ?? 'black'}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        this.misfilledLayer2Background.addChild(empty);
        const gem = makeSprite({
          frame: `gem_${slot?.color ?? 'black'}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        this.misfilledLayer2Background.addChild(gem);
      } else {
        const empty = makeSprite({
          frame: `empty_${misfilled.background}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        empty.eventMode = 'static';
        empty.on('pointerdown', () => this.onMisfilled2EmptyClick(x, y, misfilled.correct));
        this.misfilledLayer2Background.addChild(empty);

        const gem = makeSprite({
          frame: `gem_${misfilled.wrong}_wrong.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        gem.eventMode = 'static';
        gem.on('pointerdown', () => this.onMisfilled2GemClick(x, y, misfilled.wrong));
        this.misfilledLayer2Gems.addChild(gem);

        this.misfilledMap2.set(key, {
          background: empty,
          wrong: misfilled.wrong,
          correct: misfilled.correct,
          gem: gem,
        });
      }
    }

    const gemsGroup21 = MISFILLED8.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.gem;
    }).filter((g) => g !== undefined);
    const cellsGroup21 = MISFILLED1.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.gemsGroup21 = gemsGroup21;
    this.cellsGroup21 = cellsGroup21;

    const gemsGroup22 = MISFILLED9.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup22 = gemsGroup22;
    const cellsGroup22 = MISFILLED9.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup22 = cellsGroup22;

    const gemsGroup23 = MISFILLED10.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup23 = gemsGroup23;
    const cellsGroup23 = MISFILLED10.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup23 = cellsGroup23;

    const gemsGroup24 = MISFILLED11.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup24 = gemsGroup24;
    const cellsGroup24 = MISFILLED11.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup24 = cellsGroup24;

    const gemsGroup25 = MISFILLED12.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup25 = gemsGroup25;
    const cellsGroup25 = MISFILLED12.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup25 = cellsGroup25;

    const gemsGroup26 = MISFILLED13.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup26 = gemsGroup26;
    const cellsGroup26 = MISFILLED13.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup26 = cellsGroup26;

    const gemsGroup27 = MISFILLED14.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.gem;
    }).filter((g) => g !== undefined);
    this.gemsGroup27 = gemsGroup27;
    const cellsGroup27 = MISFILLED14.map((position) => {
      const key = this.getKey(position.x, position.y);
      return this.misfilledMap2.get(key)?.background;
    }).filter((c) => c !== undefined);
    this.cellsGroup27 = cellsGroup27;
  }

  private onMisfilled1GemClick(x: number, y: number, color: string): void {
    if (this.activeColor || this.animationInProgress) return;

    this.activeColor = color;
    const key = this.getKey(x, y);
    const gemo = this.misfilledMap1.get(key)?.gem || this.stack1Map.get(key)?.gem || null;

    const gemsGroup = [
      this.gemsGroup11,
      this.gemsGroup12,
      this.gemsGroup13,
      this.gemsGroup14,
      this.gemsGroup15,
      this.gemsGroup16,
      this.gemsGroup17,
    ].find((group) => group.find((gem) => gem === gemo));
    if (gemsGroup) {
      this.chosenGems = gemsGroup.filter((g) => g !== null) as Sprite[];

      this.chosenGems.forEach((gem, i) => {
        anime({
          targets: gem,
          y: '-=20',
          duration: 100,
          delay: i * 4,
          easing: 'easeInOutSine',
        });
        anime({
          targets: gem.scale,
          x: 1.1,
          y: 1.1,
          duration: 100,
          delay: i * 4,
          easing: 'easeInOutSine',
        });
      });
    }
  }

  private onMisfilled2GemClick(x: number, y: number, color: string): void {
    if (this.activeColor || this.animationInProgress) return;

    this.activeColor = color;
    const key = this.getKey(x, y);
    const gemo = this.misfilledMap2.get(key)?.gem || this.stack2Map.get(key)?.gem || null;

    const gemsGroup = [
      this.gemsGroup21,
      this.gemsGroup22,
      this.gemsGroup23,
      this.gemsGroup24,
      this.gemsGroup25,
      this.gemsGroup26,
      this.gemsGroup27,
    ].find((group) => group.find((gem) => gem === gemo));

    if (gemsGroup) {
      this.chosenGems = gemsGroup.filter((g) => g !== null) as Sprite[];

      this.chosenGems.forEach((gem, i) => {
        anime({
          targets: gem,
          y: '-=20',
          duration: 100,
          delay: i * 4,
          easing: 'easeInOutSine',
        });
        anime({
          targets: gem.scale,
          x: 1.1,
          y: 1.1,
          duration: 100,
          delay: i * 4,
          easing: 'easeInOutSine',
        });
      });
    }
  }

  private onMisfilled1EmptyClick(x: number, y: number, correctColor: string): void {
    if (!this.activeColor || this.animationInProgress) return;

    const cellKey = this.getKey(x, y);
    const cell = this.misfilledMap1.get(cellKey)?.background;
    const cellsGroup = [
      this.cellsGroup11,
      this.cellsGroup12,
      this.cellsGroup13,
      this.cellsGroup14,
      this.cellsGroup15,
      this.cellsGroup16,
      this.cellsGroup17,
    ].find((group) => group.find((c) => c === cell));

    if (cellsGroup) {
      const activeColorCopy = this.activeColor;
      this.activeColor = '';
      this.animationInProgress = true;
      console.warn('correctColor', correctColor === activeColorCopy);

      cellsGroup.forEach((c, i) => {
        const gem = this.chosenGems[this.chosenGems.length - i - 1];
        if (!gem) return;
        gem.scale.set(0.8, 0.8);
        anime({
          targets: gem,
          x: c.x,
          y: c.y,
          duration: 300,
          delay: i * 10,
          easing: 'easeInOutSine',
          complete: () => {
            gem.scale.set(1, 1);
            if (activeColorCopy === correctColor) {
              gem.texture = Texture.from(`gem_${correctColor}.png`);
              gem.eventMode = 'none';
              c.eventMode = 'none';
              console.log('correct');
            }

            if (i === this.chosenGems.length - 1) {
              this.misfilledMap1.forEach((m, k) => {
                if (m.background === cell) {
                  this.misfilledMap1.set(k, {
                    background: m.background,
                    wrong: m.wrong,
                    correct: m.correct,
                    gem: this.chosenGems[this.chosenGems.length - i - 1],
                  });
                }
              });
              this.chosenGems = [];
              this.animationInProgress = false;
              this.stack1Map.forEach((m, k) => {
                if (m.gem === gem) {
                  this.stack1Map.delete(k);
                }
              });
              this.stack1Filled = false;

              if (correctColor === activeColorCopy) {
                this.correctCounter++;
                if (this.correctCounter === this.misfills) {
                  this.zoomOut(true);
                }
              }
            }
          },
        });
      });
    }
  }

  private onMisfilled2EmptyClick(x: number, y: number, correctColor: string): void {
    if (!this.activeColor || this.animationInProgress) return;

    const cellKey = this.getKey(x, y);
    const cell = this.misfilledMap2.get(cellKey)?.background;
    const cellsGroup = [
      this.cellsGroup21,
      this.cellsGroup22,
      this.cellsGroup23,
      this.cellsGroup24,
      this.cellsGroup25,
      this.cellsGroup26,
      this.cellsGroup27,
    ].find((group) => group.find((c) => c === cell));

    if (cellsGroup) {
      const activeColorCopy = this.activeColor;
      this.activeColor = '';
      this.animationInProgress = true;
      cellsGroup.forEach((c, i) => {
        const gem = this.chosenGems[this.chosenGems.length - i - 1];
        if (!gem) return;
        gem.scale.set(0.8, 0.8);
        anime({
          targets: gem,
          x: c.x,
          y: c.y,
          duration: 300,
          delay: i * 10,
          easing: 'easeInOutSine',
          complete: () => {
            gem.scale.set(1, 1);
            if (activeColorCopy === correctColor) {
              gem.texture = Texture.from(`gem_${correctColor}.png`);
              gem.eventMode = 'none';
              c.eventMode = 'none';
            }

            if (i === this.chosenGems.length - 1) {
              this.misfilledMap2.forEach((m, k) => {
                if (m.background === cell) {
                  this.misfilledMap2.set(k, {
                    background: m.background,
                    wrong: m.wrong,
                    correct: m.correct,
                    gem: this.chosenGems[this.chosenGems.length - i - 1],
                  });
                }
              });
              this.chosenGems = [];
              this.animationInProgress = false;
              this.stack2Map.forEach((m, k) => {
                if (m.gem === gem) {
                  this.stack2Map.delete(k);
                }
              });
              this.stack2Filled = false;
            }
          },
        });
      });
    }
  }

  private zoomIntoSegment1(): void {
    const animTarget = {
      scaleX: this.boardRoot.scale.x,
      scaleY: this.boardRoot.scale.y,
      x: this.boardRoot.x,
      y: this.boardRoot.y,
    };

    anime({
      targets: animTarget,
      scaleX: ZOOM_SCALE,
      scaleY: ZOOM_SCALE,
      x: -7500,
      y: -200,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
      update: () => {
        this.boardRoot.scale.set(animTarget.scaleX, animTarget.scaleY);
        this.boardRoot.position.set(animTarget.x, animTarget.y);
      },
    });

    anime({
      targets: this.stack1,
      alpha: 1,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: this.stack1,
      alpha: 1,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: [this.backgroundLayer, this.gemsLayer],
      alpha: 0.1,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: [this.misfilledLayer2, this.stack2],
      alpha: 0,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
    });
  }

  private zoomIntoSegment2(): void {
    const animTarget = {
      scaleX: this.boardRoot.scale.x,
      scaleY: this.boardRoot.scale.y,
      x: this.boardRoot.x,
      y: this.boardRoot.y,
    };

    anime({
      targets: animTarget,
      scaleX: ZOOM_SCALE,
      scaleY: ZOOM_SCALE,
      x: 300,
      y: -5700,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
      update: () => {
        this.boardRoot.scale.set(animTarget.scaleX, animTarget.scaleY);
        this.boardRoot.position.set(animTarget.x, animTarget.y);
      },
    });

    anime({
      targets: this.stack2,
      alpha: 1,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: this.stack2,
      alpha: 1,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: [this.backgroundLayer, this.gemsLayer, this.misfilledLayer1],
      alpha: 0.1,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
    });
  }

  private zoomOut(switchSegment = false): void {
    const animTarget = {
      scaleX: this.boardRoot.scale.x,
      scaleY: this.boardRoot.scale.y,
      x: this.boardRoot.x,
      y: this.boardRoot.y,
    };

    anime({
      targets: animTarget,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
      update: () => {
        this.boardRoot.scale.set(animTarget.scaleX, animTarget.scaleY);
        this.boardRoot.position.set(animTarget.x, animTarget.y);
      },
      complete: () => {
        if (switchSegment) {
          anime({
            targets: [this.misfilledLayer1, this.stack1],
            alpha: 0,
            duration: ZOOM_DURATION / 2,
            easing: 'easeInOutQuad',
          });
          anime({
            targets: [this.misfilledLayer2, this.stack2],
            alpha: 1,
            duration: ZOOM_DURATION / 2,
            easing: 'easeInOutQuad',
            complete: () => {
              this.zoomIntoSegment2();
            },
          });
        }
      },
    });
  }

  /**
   * Example: Apply shine effect to all gems in a group
   * This demonstrates how to use the shine effects on multiple sprites efficiently
   */
  public shineGemsGroup(groupIndex: number): void {
    const allGemGroups = [
      this.gemsGroup11,
      this.gemsGroup12,
      this.gemsGroup13,
      this.gemsGroup14,
      this.gemsGroup15,
      this.gemsGroup16,
      this.gemsGroup17,
      this.gemsGroup21,
      this.gemsGroup22,
      this.gemsGroup23,
      this.gemsGroup24,
      this.gemsGroup25,
      this.gemsGroup26,
      this.gemsGroup27,
    ];

    const gemGroup = allGemGroups[groupIndex];
    if (!gemGroup) return;

    const sprites = gemGroup.filter((g) => g !== null) as Sprite[];

    // Apply shine effect to all sprites in the group
    // Optimized for performance - can handle 22+ sprites simultaneously
    SpriteEffects.addShineToSprites(sprites, {
      duration: 300,
      direction: 45, // 45 degree angle
      width: 0.3,
      intensity: 0.2,
      easing: 'linear',
    });
  }

  /**
   * Example: Apply reveal effect to selected gems
   */
  public revealGems(sprites: Sprite[]): void {
    SpriteEffects.addRevealToSprites(sprites, {
      duration: 800,
      direction: 'left',
      easing: 'easeInOutQuad',
      onComplete: () => {
        console.log('Reveal animation complete');
      },
    });
  }

  /**
   * Example: Apply wipe effect to selected gems
   */
  public wipeGems(sprites: Sprite[]): void {
    SpriteEffects.addWipeToSprites(sprites, {
      duration: 1000,
      direction: 'right',
      edgeSoftness: 0.15,
      easing: 'easeInOutQuad',
      onComplete: () => {
        console.log('Wipe animation complete');
      },
    });
  }

  /**
   * Example: Remove shine effects from all gems in a group
   */
  public removeShineFromGroup(groupIndex: number): void {
    const allGemGroups = [
      this.gemsGroup11,
      this.gemsGroup12,
      this.gemsGroup13,
      this.gemsGroup14,
      this.gemsGroup15,
      this.gemsGroup16,
      this.gemsGroup17,
      this.gemsGroup21,
      this.gemsGroup22,
      this.gemsGroup23,
      this.gemsGroup24,
      this.gemsGroup25,
      this.gemsGroup26,
      this.gemsGroup27,
    ];

    const gemGroup = allGemGroups[groupIndex];
    if (!gemGroup) return;

    gemGroup.forEach((gem) => {
      if (gem) {
        SpriteEffects.removeEffect(gem, 'shine');
      }
    });
  }
}
