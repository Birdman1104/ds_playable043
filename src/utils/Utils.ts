import { Skeleton, Skin } from '@esotericsoftware/spine-core';
import { Point, Rectangle, Texture } from '@pixi/core';
import { DisplayObject } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import { Text } from '@pixi/text';
import anime from 'animejs';
import { SPRITESHEET } from 'assetsInfo/spriteSheets';


export const parseBase64JsonToObject = (base64: string): any => {
  const slicedBase64 = base64.slice(29, base64.length);
  const convertedJson = atob(slicedBase64);
  const parsed = JSON.parse(convertedJson);
  return parsed;
};

export function base64ToBlobUrl(base64: string, type: string) {
  const binary = atob(base64.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type });
  return URL.createObjectURL(blob);
}

export const getTextureFromSpriteSheet = (atlas: string, key: string): Texture => {
  return SPRITESHEET[atlas].textures[key];
};

export const lp = (l: any, p: any) => {
  const { clientWidth: w, clientHeight: h } = document.body;
  return w > h ? l : p;
};

export const isLandscape = () => {
  const { clientWidth: w, clientHeight: h } = document.body;
  return w > h;
};

export const makeSprite = (config: SpriteConfig): Sprite => {
  const {
    frame,
    atlas = '',
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    anchor = new Point(0.5, 0.5),
    tint = 0xffffff,
    alpha = 1,
    rotation = 0,
  } = config;

  const texture = SPRITESHEET[atlas]
    ? getTextureFromSpriteSheet(atlas, frame)
    : Texture.from(frame);
  const sprite = new Sprite(texture);
  sprite.position.set(x, y);
  sprite.scale.set(scaleX, scaleY);
  sprite.anchor.set(anchor.x, anchor.y);
  sprite.tint = tint;
  sprite.alpha = alpha;
  sprite.rotation = rotation;
  return sprite;
};

export const fitDimension = (
  dim: { width: number; height: number },
  minRatio: number,
  maxRatio: number,
): { width: number; height: number } => {
  const ratioW = dim.width / dim.height;
  const ratioH = dim.height / dim.width;

  if (ratioW < ratioH) {
    if (ratioW > maxRatio) {
      dim.width = dim.width * (maxRatio / ratioW);
    } else if (ratioW < minRatio) {
      dim.height = dim.height * (ratioW / minRatio);
    }
  } else {
    if (ratioH > maxRatio) {
      dim.height = dim.height * (maxRatio / ratioH);
    } else if (ratioH < minRatio) {
      dim.width = dim.width * (ratioH / minRatio);
    }
  }

  return dim;
};

export const drawBounds = (
  container: any,
  color = 0xffffff * Math.random(),
  alpha = 0.5,
): Graphics => {
  const { x, y, width, height } = container.getBounds();
  const gr = new Graphics();
  gr.beginFill(color, alpha);
  gr.drawRect(x, y, width, height);
  gr.endFill();
  container.addChild(gr);
  return gr;
};

export const delayRunnable = (delay: number, runnable: Function, context?: any, ...args: any[]) => {
  let delayMS = delay * 1000;
  const delayWrapper = () => {
    delayMS -= window.game.ticker.deltaMS;
    if (delayMS <= 0) {
      runnable.call(context, ...args);
      window.game.ticker.remove(delayWrapper);
    }
  };
  window.game.ticker.add(delayWrapper);
  return delayWrapper;
};

export const loopRunnable = (runnable: Function, context?: any, ...args: any[]) => {
  return window.game.ticker.add(runnable, context, ...args);
};

export const removeRunnable = (runnable: Function, context?: any) =>
  window.game.ticker.remove(runnable, context);

export const getGameBounds = () => {
  const { clientWidth: width, clientHeight: height } = document.body;

  return new Rectangle(0, 0, width, height);
};

export const isSquareLikeScreen = (): boolean => {
  const { width, height } = getGameBounds();
  return Math.min(width, height) / Math.max(width, height) > 0.7;
};

export const isNarrowScreen = (): boolean => {
  const { width, height } = getGameBounds();
  return Math.min(width, height) / Math.max(width, height) < 0.5;
};

export const getViewByProperty = (
  prop: string,
  value: string,
  parent?: DisplayObject,
): DisplayObject | null => {
  const { children } = parent || window.game.stage;

  if (!children || children.length === 0) {
    return null;
  }

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    if (child[prop] === value) {
      return child;
    }

    const view = getViewByProperty(prop, value, child);
    if (view) {
      return view;
    }
  }

  return null;
};

export const randomInt = (min: number, max: number): number => {
  const mi = Math.ceil(min);
  const ma = Math.floor(max);
  return Math.floor(Math.random() * (ma - mi + 1)) + mi;
};

export const shuffle = (arr: any[]): void => {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

export const callIfExists = (callback: any): void => {
  if (typeof callback === 'function') {
    callback();
  }
};

export const drawPoint = (
  container: any,
  x: number,
  y: number,
  radius = 5,
  color = 0xffffff * Math.random(),
  alpha = 0.5,
): Graphics => {
  const gr = new Graphics();
  gr.beginFill(color, alpha);
  gr.drawCircle(x, y, radius);
  gr.endFill();
  container.addChild(gr);
  return gr;
};

export const drawRect = (
  container: any,
  x: number,
  y: number,
  w = 5,
  h = 5,
  color = 0xffffff * Math.random(),
  alpha = 0.5,
): Graphics => {
  const gr = new Graphics();
  gr.beginFill(color, alpha);
  gr.drawRect(x, y, w, h);
  gr.endFill();
  container.addChild(gr);
  return gr;
};

export const fitText = (textGameObject: Text, width: number, height: number) => {
  const { width: textWidth, height: textHeight } = textGameObject;
  const { fontSize } = textGameObject.style;
  const ratioW = width ? width / textWidth : 1;
  const ratioH = height ? height / textHeight : 1;
  const ratio = Math.min(Math.min(ratioW, ratioH), 1);

  if (typeof fontSize === 'number') {
    const newFontSize = fontSize * ratio;
    textGameObject.style.fontSize = newFontSize;
  }
};

export const sample = (arr: any[]): any => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const difference = (arrA: any[], arrB: any[]): any[] => {
  return arrA.filter((x) => !arrB.includes(x));
};

export const distanceBetween = (a: PointLike, b: PointLike): number =>
  Math.hypot(b.x - a.x, b.y - a.y);

export const angleBetween = (x1: number, y1: number, x2: number, y2: number): number =>
  (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

export const radBetween = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.atan2(y2 - y1, x2 - x1);

export const addCustomSkin = (
  skeleton: Skeleton,
  customSkinName: string,
  skinsToAdd: string[],
): Skin => {
  const newSkin = new Skin(customSkinName);
  const skins = skinsToAdd.map((s) => skeleton.data.findSkin(s));
  skins.forEach((s) => s && newSkin.addSkin(s));
  return newSkin;
};



export const tweenToCell = (grid: any, child: any, cellName: string, cb: any = null, duration = 300, easing = 'easeInOutSine'): void => {
  const { x: fromScaleX, y: fromScaleY } = child.scale;
  const { x: fromPositionX, y: fromPositionY } = child.position;
  grid.rebuildChild(child, cellName);
  anime({
    targets: child,
    x: [fromPositionX, child.x],
    y: [fromPositionY, child.y],
    duration,
    easing,
    complete: () => callIfExists(cb),
  });
  anime({
    targets: child.scale,
    x: [fromScaleX, child.scale.x],
    y: [fromScaleY, child.scale.y],
    duration,
    easing,
  });
};