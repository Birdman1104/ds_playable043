import { lego } from '@armathai/lego';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { OutlineFilter } from '@pixi/filter-outline';
import { Point, Rectangle } from '@pixi/math';
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
import { getCongratsSpriteConfig, getHandSpriteConfig } from '../configs/SpriteConfig';
import { MainGameEvents, SoundEvents } from '../lego/events/MainEvents';
import { delayRunnable, makeSprite } from '../utils/Utils';

const CELL_SIZE = 133;
const CELL_COUNT_X = 64;
const CELL_COUNT_Y = 56;

const INIT_DELAY = 1.8;
const ZOOM_DURATION = 1000;
const ZOOM_SCALE = 2.2;

const HINT_DELAY = 3;

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

const timer = {
  value: 0,
};

const SEGEMNT1_X = -7500;
const SEGEMNT1_Y = -200;

const SEGEMNT2_X = 300;
const SEGEMNT2_Y = -5700;

const CONGRATS_TEXT_X = 4700;
const CONGRATS_TEXT_Y = 5500;

const TEXT_ORDER: ('good' | 'great' | 'perfect' | 'goodJob')[] = [
  'good',
  'great',
  'perfect',
  'goodJob',
];
let currentTextIndex = 0;

const outlineProperties = {
  thickness: 5,
  alpha: 1,
};

export class BoardView extends Container {
  private boardRoot = new Container();
  private backgroundLayer = new Container();
  private gemsLayer = new Container();
  private stack1 = new Container();
  private stack1Overlay = new Container();
  private stack2 = new Container();
  private stack2Overlay = new Container();
  private misfilledLayer1 = new Container();
  private misfilledLayer1Background = new Container();
  private misfilledLayer1StaticGems = new Container();
  private misfilledLayer1Gems = new Container();
  private misfilledLayer2 = new Container();
  private misfilledLayer2Background = new Container();
  private misfilledLayer2StaticGems = new Container();
  private misfilledLayer2Gems = new Container();
  private outlineFilter1: OutlineFilter | null = null;
  private outlineFilter2: OutlineFilter | null = null;
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
  private misfills1 = 7;
  private misfills2 = 14;
  private firstFromFirst = true;
  private firstFromSecond = true;

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

  private hand: Sprite = makeSprite(getHandSpriteConfig());

  private congratsText: Sprite = makeSprite(getCongratsSpriteConfig(TEXT_ORDER[currentTextIndex]));

  constructor() {
    super();

    this.addChild(this.boardRoot);
    this.boardRoot.x = 500;

    this.boardRoot.addChild(this.backgroundLayer);
    this.boardRoot.addChild(this.gemsLayer);
    this.boardRoot.addChild(this.stack1);
    this.boardRoot.addChild(this.stack1Overlay);
    this.boardRoot.addChild(this.stack2);
    this.boardRoot.addChild(this.stack2Overlay);
    this.misfilledLayer1.addChild(this.misfilledLayer1Background);
    this.misfilledLayer1.addChild(this.misfilledLayer1StaticGems);
    this.misfilledLayer1.addChild(this.misfilledLayer1Gems);
    this.misfilledLayer2.addChild(this.misfilledLayer2Background);
    this.misfilledLayer2.addChild(this.misfilledLayer2Gems);
    this.misfilledLayer2.addChild(this.misfilledLayer2StaticGems);
    this.boardRoot.addChild(this.misfilledLayer1);
    this.boardRoot.addChild(this.misfilledLayer2);
    this.boardRoot.addChild(this.hand);

    this.addChild(this.congratsText);
    this.congratsText.position.set(CONGRATS_TEXT_X, CONGRATS_TEXT_Y);

    this.drawBoard();
    this.buildStack1();
    this.buildStack2();
    this.buildSegment1();
    this.buildSegment2();
    lego.event.emit(SoundEvents.Theme);

    this.outlineFilter1 = new OutlineFilter(5, 0xfcd121, 0.3);
    this.outlineFilter2 = new OutlineFilter(5, 0xfcd121, 0.3);
    this.misfilledLayer1Background.filters = [this.outlineFilter1];
    this.misfilledLayer2Background.filters = [this.outlineFilter2];
    this.backgroundLayer.filters = [new OutlineFilter(3, 0xffffff, 0.3)];

    anime({
      targets: outlineProperties,
      alpha: 0,
      duration: (INIT_DELAY * 1000) / 4,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: 5,
      update: () => {
        this.setOutlineAlpha(outlineProperties.alpha);
      },
      complete: () => {
        this.misfilledLayer1Background.filters = [];
        this.misfilledLayer2Background.filters = [];
        this.zoomIntoSegment1();
      },
    });
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
    this.stack1Overlay.position.set(startX, startY);
    this.stack1Slots = [];

    const background = makeSprite({
      atlas: 'game',
      frame: 'stack_bkg.png',
      x: -CELL_SIZE / 2 - 50,
      y: -CELL_SIZE / 2 - 50,
      anchor: { x: 0, y: 0 },
    });
    this.stack1.addChild(background);

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
        empty.on('pointerdown', () => this.onStack1Click());
        this.stack1.addChild(empty);

        const emptyOverlay = makeSprite({
          frame: 'empty_yellow_light.png',
          atlas: 'gems',
          x: slotX,
          y: slotY,
        });
        this.stack1Overlay.addChild(emptyOverlay);

        this.stack1Slots.push({ x: slotX, y: slotY });
      }
    }

    this.stack1.alpha = 0;
    this.stack1Overlay.alpha = 0;
  }

  private buildStack2(): void {
    const cols = 11;
    const rows = 2;

    const startX = 1400;
    const startY = 5750;

    this.stack2.position.set(startX, startY);
    this.stack2Overlay.position.set(startX, startY);
    this.stack2Slots = [];

    const background = makeSprite({
      atlas: 'game',
      frame: 'stack_bkg.png',
      x: -CELL_SIZE / 2 - 50,
      y: -CELL_SIZE / 2 - 50,
      anchor: { x: 0, y: 0 },
    });
    this.stack2.addChild(background);

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

        const emptyOverlay = makeSprite({
          frame: 'empty_yellow_light.png',
          atlas: 'gems',
          x: slotX,
          y: slotY,
        });
        this.stack2Overlay.addChild(emptyOverlay);

        this.stack2Slots.push({ x: slotX, y: slotY });
      }
    }

    this.stack2.alpha = 0;
    this.stack2Overlay.alpha = 0;
  }

  private onStack1Click(): void {
    lego.event.emit(SoundEvents.Click);
    if (!this.activeColor || this.animationInProgress || this.stack1Filled) return;
    this.restartHint();
    anime.remove(this.stack1Overlay);
    this.stack1Overlay.alpha = 0;
    this.moveGemsToStack1();
  }

  private onStack2Click(): void {
    lego.event.emit(SoundEvents.Click);
    if (!this.activeColor || this.animationInProgress || this.stack2Filled) return;
    this.restartHint();
    anime.remove(this.stack2Overlay);
    this.stack2Overlay.alpha = 0;
    this.moveGemsToStack2();
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
        delay: i * 50,
        easing: 'easeInOutSine',
        complete: () => {
          lego.event.emit(SoundEvents.Bell);
          gem.scale.set(1, 1);
          if (i === this.chosenGems.length - 1) {
            this.chosenGems.forEach((gem, i) => {
              this.misfilledMap1.forEach((m, k) => {
                if (m.gem === gem) {
                  this.stack1Map.set(i.toString(), { gem: gem as Sprite });
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
          lego.event.emit(SoundEvents.Bell);
          gem.scale.set(1, 1);
          if (i === this.chosenGems.length - 1) {
            this.chosenGems.forEach((gem) => {
              this.misfilledMap2.forEach((m, k) => {
                if (m.gem === gem) {
                  this.stack2Map.set(i.toString(), { gem: gem as Sprite });
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
        this.misfilledLayer1StaticGems.addChild(gem);
      } else {
        const empty = makeSprite({
          frame: `empty_${misfilled.background}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        empty.eventMode = 'static';
        empty.on('pointerdown', () => this.onMisfilled1EmptyClick(empty, misfilled.correct));
        this.misfilledLayer1Background.addChild(empty);

        const gem = makeSprite({
          frame: `gem_${misfilled.wrong}_wrong.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        gem.eventMode = 'static';
        gem.on('pointerdown', () => this.onMisfilled1GemClick(gem, misfilled.wrong));
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

    const misfilledMap = this.getMisfilledMap2();
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
        this.misfilledLayer2Background.addChild(empty);
        const gem = makeSprite({
          frame: `gem_${slot?.color ?? 'black'}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        this.misfilledLayer2StaticGems.addChild(gem);
      } else {
        const empty = makeSprite({
          frame: `empty_${misfilled.background}.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        empty.eventMode = 'static';
        empty.on('pointerdown', () => this.onMisfilled2EmptyClick(empty, misfilled.correct));
        this.misfilledLayer2Background.addChild(empty);

        const gem = makeSprite({
          frame: `gem_${misfilled.wrong}_wrong.png`,
          atlas: 'gems',
          x: cx,
          y: cy,
        });
        gem.eventMode = 'static';
        gem.on('pointerdown', () => this.onMisfilled2GemClick(gem, misfilled.wrong));
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
    const cellsGroup21 = MISFILLED8.map((position) => {
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

  private onMisfilled1GemClick(gemo: Sprite, color: string): void {
    lego.event.emit(SoundEvents.Click);
    if (this.animationInProgress) return;

    if (this.chosenGems.find((gem) => gem === gemo)) {
      return;
    }

    this.restartHint();

    if (this.firstFromFirst) {
      this.firstFromFirst = false;
      anime({
        targets: this.stack1Overlay,
        alpha: 0.7,
        duration: 400,
        loop: 6,
        direction: 'alternate',
        easing: 'easeInOutSine',
      });
    }
    if (this.activeColor) {
      this.putGemBack(this.chosenGems);

      this.chosenGems = [];
    }

    this.activeColor = color;

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
      this.highlightGems(this.chosenGems, this.misfilledLayer1Gems);
    }
  }

  private putGemBack(gems: Sprite[] | null): void {
    if (!gems) return;
    gems.forEach((gem, i) => {
      anime({
        targets: gem,
        y: '+=20',
        duration: 100,
        delay: i * 25,
        easing: 'easeInOutSine',
      });
      anime({
        targets: gem.scale,
        x: 1,
        y: 1,
        duration: 100,
        delay: i * 20,
        easing: 'easeInOutSine',
      });
    });
  }

  private highlightGems(gems: Sprite[] | null, layer: Container): void {
    if (!gems) return;
    gems.forEach((gem, i) => {
      layer.addChild(gem);
      anime({
        targets: gem,
        y: '-=20',
        duration: 100,
        delay: i * 25,
        complete: () => lego.event.emit(SoundEvents.Pop),
        easing: 'easeInOutSine',
      });
      anime({
        targets: gem.scale,
        x: 1.1,
        y: 1.1,
        duration: 100,
        delay: i * 20,
        easing: 'easeInOutSine',
      });
    });
  }

  private onMisfilled2GemClick(gemo: Sprite, color: string): void {
    lego.event.emit(SoundEvents.Click);
    if (this.animationInProgress) return;
    if (this.chosenGems.find((gem) => gem === gemo)) {
      return;
    }

    this.restartHint();

    if (this.firstFromFirst) {
      this.firstFromFirst = false;
      anime({
        targets: this.stack1Overlay,
        alpha: 0.7,
        duration: 400,
        loop: 6,
        direction: 'alternate',
        easing: 'easeInOutSine',
      });
    }

    if (this.activeColor) {
      this.putGemBack(this.chosenGems);
      this.chosenGems = [];
    }

    this.activeColor = color;

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
      this.highlightGems(this.chosenGems, this.misfilledLayer2Gems);
    }
  }

  private onMisfilled1EmptyClick(cell: Sprite, correctColor: string): void {
    lego.event.emit(SoundEvents.Click);
    if (!this.activeColor || this.animationInProgress) return;
    this.restartHint();

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

      cellsGroup.forEach((c, i) => {
        const gem = this.chosenGems[this.chosenGems.length - i - 1];
        if (!gem) return;
        gem.scale.set(0.8, 0.8);
        anime({
          targets: gem,
          x: c.x,
          y: c.y,
          duration: 400,
          delay: i * 50,
          easing: 'easeInOutSine',
          complete: () => {
            this.misfilledMap1.forEach((m, k) => {
              if (m.gem === gem) {
                this.misfilledMap1.set(k, {
                  background: m.background,
                  wrong: m.wrong,
                  correct: m.correct,
                  gem: null,
                });
              }
            });
            this.stack1Map.forEach((m, k) => {
              if (m.gem === gem) {
                this.stack1Map.delete(k);
                this.stack1Filled = false;
              }
            });
            gem.scale.set(1, 1);
            if (activeColorCopy === correctColor) {
              gem.texture = Texture.from(`gem_${correctColor}.png`);
              gem.eventMode = 'none';
              c.eventMode = 'none';
            }

            if (i === this.chosenGems.length - 1) {
              const placedGems = [...this.chosenGems];

              this.misfilledMap1.forEach((m, k) => {
                if (cellsGroup.find((c) => c === m.background)) {
                  this.misfilledMap1.set(k, {
                    background: m.background,
                    wrong: m.wrong,
                    correct: m.correct,
                    gem: this.chosenGems[this.chosenGems.length - i - 1],
                  });
                }
              });

              let gemsFromStack1 = false;
              this.stack1Map.forEach((m, k) => {
                if (m.gem && placedGems.includes(m.gem)) {
                  this.stack1Map.delete(k);
                  gemsFromStack1 = true;
                }
              });

              if (gemsFromStack1 && this.stack1Map.size === 0) {
                this.stack1Filled = false;
              }

              this.chosenGems = [];
              this.animationInProgress = false;

              if (correctColor === activeColorCopy) {
                this.updateCorrectCounter();
                if (this.correctCounter === this.misfills1) {
                  this.stopHintTimer();
                  this.hideHint();
                  this.zoomOut().then(() => {
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
                      complete: () => this.zoomIntoSegment2(),
                    });
                  });
                }
              }
            }
          },
        });
      });
    }
  }

  private onMisfilled2EmptyClick(cell: Sprite, correctColor: string): void {
    lego.event.emit(SoundEvents.Click);
    if (!this.activeColor || this.animationInProgress) return;
    this.restartHint();

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
          duration: 500,
          delay: i * 50,
          easing: 'easeInOutSine',
          complete: () => {
            this.misfilledMap2.forEach((m, k) => {
              if (m.gem === gem) {
                this.misfilledMap2.set(k, {
                  background: m.background,
                  wrong: m.wrong,
                  correct: m.correct,
                  gem: null,
                });
              }
            });

            this.stack2Map.forEach((m, k) => {
              if (m.gem === gem) {
                this.stack2Map.delete(k);
                this.stack2Filled = false;
              }
            });

            gem.scale.set(1, 1);
            if (activeColorCopy === correctColor) {
              gem.texture = Texture.from(`gem_${correctColor}.png`);
              gem.eventMode = 'none';
              c.eventMode = 'none';
            }

            if (i === this.chosenGems.length - 1) {
              const placedGems = [...this.chosenGems];

              this.misfilledMap2.forEach((m, k) => {
                if (cellsGroup.find((c) => c === m.background)) {
                  this.misfilledMap2.set(k, {
                    background: m.background,
                    wrong: m.wrong,
                    correct: m.correct,
                    gem: this.chosenGems[this.chosenGems.length - i - 1],
                  });
                }
              });

              let gemsFromStack2 = false;
              this.stack2Map.forEach((m, k) => {
                if (m.gem && placedGems.includes(m.gem)) {
                  this.stack2Map.delete(k);
                  gemsFromStack2 = true;
                }
              });

              if (gemsFromStack2 && this.stack2Map.size === 0) {
                this.stack2Filled = false;
              }

              this.chosenGems = [];
              this.animationInProgress = false;

              if (correctColor === activeColorCopy) {
                this.updateCorrectCounter();
                if (this.correctCounter === this.misfills2) {
                  this.stopHintTimer();
                  this.hideHint();
                  this.zoomOut().then(() => {
                    lego.event.emit(MainGameEvents.ParticleStart);
                    anime({
                      targets: [this.backgroundLayer, this.gemsLayer],
                      alpha: 1,
                      duration: ZOOM_DURATION,
                      easing: 'easeInOutQuad',
                    });
                    anime({
                      targets: [this.misfilledLayer2, this.stack2],
                      alpha: 0,
                      duration: ZOOM_DURATION,
                      easing: 'easeInOutQuad',
                      complete: () => {
                        [
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
                          this.cellsGroup11,
                          this.cellsGroup12,
                          this.cellsGroup13,
                          this.cellsGroup14,
                          this.cellsGroup15,
                          this.cellsGroup16,
                          this.cellsGroup17,
                          this.cellsGroup21,
                          this.cellsGroup22,
                          this.cellsGroup23,
                          this.cellsGroup24,
                          this.cellsGroup25,
                          this.cellsGroup26,
                          this.cellsGroup27,
                        ].forEach((group) => {
                          group.forEach((sprite) => sprite?.destroy());
                        });
                        this.misfilledMap1.clear();
                        this.misfilledMap2.clear();
                        this.stack1Map.clear();
                        this.stack2Map.clear();
                        this.chosenGems = [];
                        this.activeColor = '';
                        this.correctCounter = 0;

                        delayRunnable(0.8, () => {
                          lego.event.emit(MainGameEvents.AdToCTA);
                        });
                      },
                    });
                  });
                }
              }
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
      x: SEGEMNT1_X,
      y: SEGEMNT1_Y,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
      update: () => {
        this.boardRoot.scale.set(animTarget.scaleX, animTarget.scaleY);
        this.boardRoot.position.set(animTarget.x, animTarget.y);
      },
      complete: () => this.startHintTimer(),
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
      x: SEGEMNT2_X,
      y: SEGEMNT2_Y,
      duration: ZOOM_DURATION,
      easing: 'easeInOutQuad',
      update: () => {
        this.boardRoot.scale.set(animTarget.scaleX, animTarget.scaleY);
        this.boardRoot.position.set(animTarget.x, animTarget.y);
      },
      complete: () => this.startHintTimer(),
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

  private zoomOut(): Promise<void> {
    const animTarget = {
      scaleX: this.boardRoot.scale.x,
      scaleY: this.boardRoot.scale.y,
      x: this.boardRoot.x,
      y: this.boardRoot.y,
    };

    return new Promise((resolve) => {
      anime({
        targets: animTarget,
        scaleX: 1,
        scaleY: 1,
        x: 500,
        y: 0,
        delay: 2000,
        duration: ZOOM_DURATION,
        easing: 'easeInOutQuad',
        update: () => {
          this.boardRoot.scale.set(animTarget.scaleX, animTarget.scaleY);
          this.boardRoot.position.set(animTarget.x, animTarget.y);
        },
        complete: () => resolve(),
      });
    });
  }

  private getHintPositions(): Point[] {
    const isSegment1 = this.correctCounter < this.misfills1;
    const misfilledMap = isSegment1 ? this.misfilledMap1 : this.misfilledMap2;
    const stackMap = isSegment1 ? this.stack1Map : this.stack2Map;
    const stackFilled = isSegment1 ? this.stack1Filled : this.stack2Filled;
    const stackSlots = isSegment1 ? this.stack1Slots : this.stack2Slots;
    const stackContainer = isSegment1 ? this.stack1 : this.stack2;

    const isGemInteractive = (gem: Sprite | null): boolean => {
      return gem !== null && gem.eventMode !== 'none';
    };

    const getGemColorFromTexture = (gem: Sprite): string | null => {
      if (!gem || !gem.texture) return null;
      const textureId = gem.texture.textureCacheIds?.[0] || '';
      const match = textureId.match(/gem_([^_]+)(?:_wrong)?\.png/);
      return match ? match[1] : null;
    };

    const keyToPoint = (key: string): Point => {
      const [x, y] = key.split(';').map(Number);
      const { height } = this.getBounds();
      const { cx, cy } = this.getCellCenter(x, y, height);
      return new Point(cx, cy);
    };

    if (this.chosenGems.length > 0 && this.activeColor) {
      const chosenColor = this.activeColor;

      for (const [key, value] of misfilledMap.entries()) {
        const gem = value.gem;
        const gemInStack =
          gem !== null && Array.from(stackMap.values()).some((entry) => entry.gem === gem);
        const isEmpty = !gem || gemInStack || (gem && !isGemInteractive(gem));

        if (isEmpty && value.correct === chosenColor) {
          const cellPos = keyToPoint(key);
          return [cellPos, cellPos];
        }
      }

      if (stackSlots.length > 0) {
        const firstSlot = stackSlots[0];
        const stackPos = new Point(stackContainer.x + firstSlot.x, stackContainer.y + firstSlot.y);
        return [stackPos, stackPos];
      }
    }

    if (!stackFilled) {
      for (const [key, value] of misfilledMap.entries()) {
        const gem = value.gem;
        if (gem && isGemInteractive(gem)) {
          const gemColor = getGemColorFromTexture(gem);
          if (gemColor === value.wrong) {
            const gemPos = keyToPoint(key);
            const gemsInStack = Array.from(stackMap.values()).filter(
              (entry) => entry.gem !== null && entry.gem !== undefined,
            ).length;
            const emptySlotIndex = stackSlots.length - gemsInStack - 1;

            if (emptySlotIndex >= 0 && emptySlotIndex < stackSlots.length) {
              const emptySlot = stackSlots[emptySlotIndex];
              const stackPos = new Point(
                stackContainer.x + emptySlot.x,
                stackContainer.y + emptySlot.y,
              );
              return [gemPos, stackPos];
            }
          }
        }
      }

      for (const [key, value] of stackMap.entries()) {
        const gem = value.gem;
        if (gem && isGemInteractive(gem)) {
          const gemColor = getGemColorFromTexture(gem);
          const misfilled = misfilledMap.get(key);
          if (misfilled && gemColor === misfilled.wrong) {
            const gemPos = keyToPoint(key);

            const gemsInStack = Array.from(stackMap.values()).filter(
              (entry) => entry.gem !== null && entry.gem !== undefined,
            ).length;
            const emptySlotIndex = stackSlots.length - gemsInStack - 1;

            if (emptySlotIndex >= 0 && emptySlotIndex < stackSlots.length) {
              const emptySlot = stackSlots[emptySlotIndex];
              const stackPos = new Point(
                stackContainer.x + emptySlot.x,
                stackContainer.y + emptySlot.y,
              );
              return [gemPos, stackPos];
            }
          }
        }
      }
    } else {
      for (const [key, value] of misfilledMap.entries()) {
        const gem = value.gem;
        const isEmpty = !gem;
        if (isEmpty) {
          const neededColor = value.correct;

          const cellPos = keyToPoint(key);

          for (const gemValue of stackMap.values()) {
            const stackGem = gemValue.gem;
            if (stackGem && isGemInteractive(stackGem)) {
              const gemColor = getGemColorFromTexture(stackGem);
              if (gemColor === neededColor) {
                const gemPos = new Point(stackGem.x, stackGem.y);
                return [gemPos, cellPos];
              }
            }
          }

          for (const [gemKey, gemValue] of misfilledMap.entries()) {
            const misfilledGem = gemValue.gem;
            const isInStack =
              misfilledGem !== null &&
              Array.from(stackMap.values()).some((entry) => entry.gem === misfilledGem);
            if (misfilledGem && isGemInteractive(misfilledGem) && !isInStack) {
              const gemColor = getGemColorFromTexture(misfilledGem);
              if (gemColor === neededColor && gemColor !== gemValue.correct) {
                const gemPos = keyToPoint(gemKey);
                return [gemPos, cellPos];
              }
            }
          }
        }
      }
    }

    return [new Point(0, 0), new Point(0, 0)];
  }

  private showHint(): void {
    let currentPointIndex = 0;
    const points = this.getHintPositions();

    if (points.length === 0) return;

    const showFirstTime = (): void => {
      const point = points[currentPointIndex];
      this.hand.alpha = 1;
      this.hand.position.set(point.x, point.y);
      this.hand.angle = 0;
      this.hand.visible = true;

      pointHand();
    };

    const pointHand = (): void => {
      anime({
        targets: this.hand.scale,
        x: 0.8,
        y: 0.8,
        duration: 500,
        easing: 'easeInOutCubic',
        direction: 'alternate',
        complete: () => {
          currentPointIndex = (currentPointIndex + 1) % points.length;
          moveHand(points[currentPointIndex]);
        },
      });
    };

    const moveHand = (pos: Point): void => {
      anime({
        targets: this.hand,
        x: pos.x,
        y: pos.y,
        duration: 500,
        easing: 'easeInOutCubic',
        complete: () => pointHand(),
      });
    };

    showFirstTime();
  }

  private hideHint(): void {
    anime.remove(this.hand);
    anime.remove(this.hand.scale);
    this.hand.scale.set(1, 1);
    this.hand.visible = false;
    this.hand.alpha = 0;
  }

  private startHintTimer(): void {
    anime({
      targets: timer,
      value: 1,
      duration: HINT_DELAY * 1000,
      easing: 'easeInOutQuad',
      complete: () => {
        this.showHint();
      },
    });
  }

  private stopHintTimer(): void {
    anime.remove(timer);
    timer.value = 0;
  }

  private restartHint(): void {
    this.hideHint();
    this.stopHintTimer();
    this.startHintTimer();
  }

  private updateCorrectCounter(): void {
    this.correctCounter++;
    if (this.correctCounter >= this.misfills1 - 3 && this.correctCounter <= this.misfills1) {
      this.jumpText();
    }
    if (this.correctCounter >= this.misfills2 - 3 && this.correctCounter <= this.misfills2) {
      this.jumpText();
    }
  }

  private jumpText(): void {
    anime({
      targets: this.congratsText,
      y: 4000,
      duration: 1400,
      easing: 'easeOutBounce',
      complete: () => {
        currentTextIndex = (currentTextIndex + 1) % TEXT_ORDER.length;

        anime({
          targets: this.congratsText,
          alpha: 0,
          duration: 200,
          easing: 'easeInOutQuad',
          complete: () => {
            this.congratsText.alpha = 0;
            this.congratsText.scale.set(0.01);
            this.congratsText.position.set(CONGRATS_TEXT_X, CONGRATS_TEXT_Y);
            this.congratsText.texture = Texture.from(
              getCongratsSpriteConfig(TEXT_ORDER[currentTextIndex]).frame,
            );
          },
        });
      },
    });
    anime({
      targets: this.congratsText,
      alpha: 1,
      duration: 1000,
      easing: 'easeInOutQuad',
    });
    anime({
      targets: this.congratsText.scale,
      x: 10,
      y: 10,
      duration: 1000,
      easing: 'easeInOutSine',
    });
  }

  public setOutlineAlpha1(alpha: number): void {
    if (this.outlineFilter1) {
      this.outlineFilter1.alpha = alpha;
    }
  }

  public setOutlineAlpha2(alpha: number): void {
    if (this.outlineFilter2) {
      this.outlineFilter2.alpha = alpha;
    }
  }

  public setOutlineAlpha(alpha: number): void {
    this.setOutlineAlpha1(alpha);
    this.setOutlineAlpha2(alpha);
  }

  public getOutlineAlpha1(): number {
    return this.outlineFilter1?.alpha ?? 0;
  }

  public getOutlineAlpha2(): number {
    return this.outlineFilter2?.alpha ?? 0;
  }
}
