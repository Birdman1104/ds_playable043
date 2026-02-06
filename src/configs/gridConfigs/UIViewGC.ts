import { CellScale } from '../../libs/grid';
import { lp } from '../../utils/Utils';

export const getUIGridConfig = () => {
  return lp(getUIGridLandscapeConfig, getUIGridPortraitConfig).call(null);
};

const getUIGridLandscapeConfig = () => {
  const area = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: 'ui',
    // debug: { color: 0xd950ff },
    area,
    cells: [
      {
        name: 'wrapper',
        scale: CellScale.envelop,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};

const getUIGridPortraitConfig = () => {
  const area = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: 'ui',
    // debug: { color: 0xd950ff },
    area,
    cells: [
      {
        name: 'wrapper',
        scale: CellScale.envelop,

        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};
