import { lp } from '../../utils/Utils';
import { CellScale } from '../../libs/grid';

export const getCTAGridConfig = () => {
  return lp(getCTAGridLandscapeConfig, getCTAGridPortraitConfig).call(null);
};

const getCTAGridLandscapeConfig = () => {
  const area = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: 'cta',
    // debug: { color: 0xd950ff },
    area,
    cells: [
      {
        name: 'content',
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
      {
        name: 'blocker',
        scale: CellScale.fill,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};

const getCTAGridPortraitConfig = () => {
  const area = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: 'cta',
    // debug: { color: 0xd950ff },
    area,
    cells: [
      {
        name: 'content',
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
      {
        name: 'blocker',
        scale: CellScale.fill,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};
