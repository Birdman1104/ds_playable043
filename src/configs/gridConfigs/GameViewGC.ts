import { lp } from '../../utils/Utils';

export const getGameViewGridConfig = () => {
  return lp(getGameViewGridLandscapeConfig, getGameViewGridPortraitConfig).call(null);
};

const getGameViewGridLandscapeConfig = () => {
  const area = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: 'game',
    // debug: { color: 0xff0000 },
    area,
    cells: [
      {
        name: 'board',
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};

const getGameViewGridPortraitConfig = () => {
  const area = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: 'game',
    // debug: { color: 0xff0000 },
    area,
    cells: [
      {
        name: 'board',
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
    ],
  };
};
