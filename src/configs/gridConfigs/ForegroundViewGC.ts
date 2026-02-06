import { CellAlign } from '../../libs/grid';
import { lp } from '../../utils/Utils';

export const getForegroundGridConfig = () => {
  return lp(getForegroundGridLandscapeConfig, getForegroundGridPortraitConfig).call(null);
};

const getForegroundGridLandscapeConfig = () => {
  const area = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: 'foreground',
    // debug: { color: 0xff5027 },
    area,
    cells: [
      {
        name: 'logo',
        bounds: { x: 0.01, y: 0, width: 0.125, height: 0.1 },
      },
      {
        name: 'sound',
        align: CellAlign.leftBottom,
        bounds: { x: 0, y: 0.9, width: 0.1, height: 0.1 },
        offset: { x: 10, y: -10 },
      },
    ],
  };
};

const getForegroundGridPortraitConfig = () => {
  const area = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: 'foreground',
    // debug: { color: 0xff5027 },
    area,
    cells: [
      {
        name: 'logo',
        bounds: { x: 0.01, y: 0.01, width: 0.2, height: 0.1 },
      },
      {
        name: 'sound',
        align: CellAlign.leftBottom,
        bounds: { x: 0, y: 0.925, width: 0.075, height: 0.075 },
        offset: { x: 10, y: -10 },
      },
    ],
  };
};
