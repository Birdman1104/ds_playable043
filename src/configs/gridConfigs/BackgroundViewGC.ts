import { CellScale } from 'libs/grid';
import { lp } from '../../utils/Utils';

export const getBackgroundGridConfig = () => {
  return lp(getBackgroundGridLandscapeConfig, getBackgroundGridPortraitConfig).call(null);
};

const getBackgroundGridLandscapeConfig = () => {
  const area = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: 'background',
    // debug: { color: 0xd95027 },
    area,
    cells: [
      {
        name: 'bkg',
        scale: CellScale.envelop,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};

const getBackgroundGridPortraitConfig = () => {
  const area = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: 'background',
    // debug: { color: 0xd95027 },
    area,
    cells: [
      {
        name: 'bkg',
        scale: CellScale.envelop,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};
