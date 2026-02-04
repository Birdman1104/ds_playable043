import { Point } from '@pixi/math';


export const getChestRaysSpriteConfig = (): SpriteConfig => {
  return {
    atlas: 'loots',
    frame: `rays.png`,
    scaleX: 0.001,
    scaleY: 0.001,
    alpha: 0,
    anchor: new Point(0.5, 0.5),
  };
};
export const getLogoSpriteConfig = (x: number, y: number, scale?: number): SpriteConfig => {
  return {
    atlas: 'preload',
    frame: `progress_logo.png`,
    x,
    y,
    scaleX: scale ?? 0.8,
    scaleY: scale ?? 0.8,
  };
};

export const getBackgroundSpriteConfig = (): SpriteConfig => {
  return {
    frame: `bkg.jpg`,
  };
};
export const getPCtaSpriteConfig = (): SpriteConfig => {
  return { atlas: 'ui', frame: `pcta.png` };
};
export const getHintSpriteConfig = (): SpriteConfig => {
  return { atlas: 'ui', frame: `circle.png` };
};
export const getSoundButtonSpriteConfig = (type: 'on' | 'off'): SpriteConfig => {
  return { atlas: 'ui', frame: `sound_${type}.png` };
};
export const getNumberSpriteConfig = (frame: string, atlas: string): SpriteConfig => {
  return { atlas, frame: `${frame}.png`, anchor: new Point(0.5, 0.5), scaleX: 0.5, scaleY: 0.5 };
};