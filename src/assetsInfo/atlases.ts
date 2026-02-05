// @ts-nocheck

import gemsJson from '../assets/atlases/gems.json';
import gemsPng from '../assets/atlases/gems.png?inline';

import gameJson from '../assets/atlases/game.json';
import gamePng from '../assets/atlases/game.png?inline';

export const ATLASES = [
  { name: 'gems', img: gemsPng, json: gemsJson },
  { name: 'game', img: gamePng, json: gameJson },
];

// export const PRELOAD_ATLAS = { name: 'preload', img: preloadPng, json: preloadJson };
