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
        name: 'pcta',
        bounds: { x: 0.8, y: 0.85, width: 0.175, height: 0.125 },
      },
      {
        name: 'sound',
        bounds: { x: 0.05, y: 0.85, width: 0.1, height: 0.125 },
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
        name: 'pcta',
        bounds: { x: 0.6, y: 0.725, width: 0.4, height: 0.05 },
      },
      {
        name: 'sound',
        bounds: { x: 0.0, y: 0.725, width: 0.25, height: 0.05 },
      },
    ],
  };
};
