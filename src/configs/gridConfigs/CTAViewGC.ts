import { CellScale } from '../../libs/grid';
import { lp } from '../../utils/Utils';

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
        name: 'logo',
        bounds: { x: 0.15, y: 0.1, width: 0.7, height: 0.5 },
      },
      {
        name: 'button',
        bounds: { x: 0.15, y: 0.7, width: 0.7, height: 0.2 },
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
        name: 'logo',
        bounds: { x: 0.15, y: 0, width: 0.7, height: 0.7 },
      },
      {
        name: 'button',
        bounds: { x: 0.1, y: 0.7, width: 0.8, height: 0.3 },
      },
      {
        name: 'blocker',
        scale: CellScale.fill,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};
