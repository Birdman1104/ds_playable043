import { CellScale } from 'libs/grid';
import { lp } from '../../utils/Utils';

export const getPreloadGridConfig = () => {
  return lp(getPreloadGridLandscapeConfig, getPreloadGridPortraitConfig).call(null);
};

const getPreloadGridLandscapeConfig = () => {
  const area = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: 'preload',
    // debug: { color: 0xd95027 },
    area,
    cells: [
      {
        name: 'logo',
        bounds: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 },
      },
      {
        name: 'progress',
        bounds: { x: 0.2, y: 0.7, width: 0.6, height: 0.2 },
      },
    ],
  };
};

const getPreloadGridPortraitConfig = () => {
  const area = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: 'preload',
    // debug: { color: 0xd95027 },
    area,
    cells: [
      {
        name: 'logo',
        bounds: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 },
      },
      {
        name: 'progress',
        bounds: { x: 0.2, y: 0.7, width: 0.6, height: 0.2 },
      },
    ],
  };
};
