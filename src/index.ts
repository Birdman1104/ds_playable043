import { EventSystem } from '@pixi/events';
import { extensions } from '@pixi/extensions';
import App from './App';

extensions.add(EventSystem);

window.startGame = function () {
  window.game = new App();
  // @ts-ignore
  globalThis.__PIXI_APP__ = window.game;

  window.game.init();
  window.addEventListener('resize', () => window.game.appResize());
  window.addEventListener('orientationchange', () => window.game.appResize());
  window.addEventListener('visibilitychange', (e) => window.game.onVisibilityChange(e));
  window.addEventListener('focus', () => window.game.onFocusChange(true));
  window.addEventListener('blur', () => window.game.onFocusChange(false));
};

window.addEventListener('load', () => {
  // @ts-ignore
  if (!window.pi) {
    window.startGame();
  }
});
