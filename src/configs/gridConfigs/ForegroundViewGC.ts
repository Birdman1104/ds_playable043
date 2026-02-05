import { lp } from '../../utils/Utils';

export const getForegroundGridConfig = () => {
  return lp(getForegroundGridLandscapeConfig, getForegroundGridPortraitConfig).call(null);
};

const getForegroundGridLandscapeConfig = () => {
  const area = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: 'foreground',
    debug: { color: 0xff5027 },
    area,
    cells: [
      {
        name: 'logo',
        bounds: { x: 0.01, y: 0, width: 0.125, height: 0.1 },
      },
    ],
  };
};

const getForegroundGridPortraitConfig = () => {
  const area = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: 'foreground',
    debug: { color: 0xff5027 },
    area,
    cells: [
      {
        name: 'logo',
        bounds: { x: 0, y: 0.01, width: 0.4, height: 0.1 },
      },
    ],
  };
};
