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
        bounds: { x: 0.025, y: 0, width: 0.1, height: 0.1 },
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
        bounds: { x: 0, y: 0, width: 0.3, height: 0.08 },
      },
    ],
  };
};
